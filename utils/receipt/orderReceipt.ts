import {
  RECEIPT_FOOTER,
  RECEIPT_HEADER,
  ReceiptBlock,
  SHOP_NAME,
  SHOP_PHONE,
} from '@/constants/receipt';
import {
  CartLine,
  Order,
  OtherSettings,
  ShippingAddress,
  ShopSettings,
} from '@/types';
import {
  Align,
  PAPER_COLUMNS,
  centerText,
  divider,
  itemLines,
  padLine,
  wrapText,
} from './escpos';
import { toPrintable } from './transliterate';

/**
 * One printable element. Building a document first (rather than emitting bytes
 * directly) means the exact same layout can be rendered as ESC/POS for the
 * printer and as plain text for on-screen verification — see renderPreview.
 */
export type ReceiptElement =
  /**
   * `value` is already padded to its final position — alignment is baked into
   * the string rather than left to ESC/POS `ESC a`. Doing both would centre a
   * pre-padded string a second time and push it off to the right, and it also
   * keeps renderPreview byte-for-byte faithful to what the printer produces.
   */
  | { type: 'text'; value: string; bold?: boolean; doubleHeight?: boolean }
  | { type: 'feed'; lines: number }
  /** End of receipt: feeds clear of the tear bar. This hardware has no cutter. */
  | { type: 'tear' };

export interface ReceiptShopInfo {
  /** Overrides SHOP_NAME from the receipt config when set. */
  name?: string;
  other?: OtherSettings;
  shop?: ShopSettings;
}

/** Bakes horizontal position into the string; see ReceiptElement. */
const alignText = (value: string, align: Align = 'left'): string => {
  if (align === 'center') return centerText(value);
  if (align === 'right') {
    return ' '.repeat(Math.max(0, PAPER_COLUMNS - value.length)) + value;
  }
  return value;
};

/** Bare amount — the currency is named once, on the TOTAL line. */
const money = (value: string | number | undefined): string => {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? 0));
  return Number.isNaN(n) ? '0.00' : n.toFixed(2);
};

const toNumber = (value: string | number | undefined): number => {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? 0));
  return Number.isNaN(n) ? 0 : n;
};

/**
 * `about_us` and similar settings fields come from a rich-text editor, so they
 * carry markup that would print as literal tag soup.
 */
const stripHtml = (value?: string): string =>
  toPrintable(
    (value ?? '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim(),
  );

const formatDateTime = (iso?: string): string => {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    ` ${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

const cartLineDescription = (line: CartLine): string => {
  const name =
    line.menu_data?.translations?.en?.name?.trim() || `Item #${line.menu}`;
  return toPrintable(`${line.quantity} x ${name}`);
};

const variantLabel = (line: CartLine): string | null => {
  const variant = line.variant as { name?: string } | null | undefined;
  const name = variant?.name?.trim();
  // Transliterate the name only, then indent: toPrintable() collapses and
  // trims whitespace, so indenting first would lose the leading spaces.
  return name ? `  (${toPrintable(name)})` : null;
};

/**
 * Expands one configured block from constants/receipt.ts. Blocks backed by
 * settings render nothing when their field is empty, so a config listing every
 * possible contact line degrades to just the ones that are filled in.
 */
const renderBlock = (
  block: ReceiptBlock,
  shop: ReceiptShopInfo,
): ReceiptElement[] => {
  switch (block.type) {
    case 'shopName':
      return [
        {
          type: 'text',
          value: centerText(shop.name ?? SHOP_NAME),
          bold: true,
          doubleHeight: true,
        },
      ];

    case 'text':
      return [
        {
          type: 'text',
          value: alignText(block.value, block.align),
          bold: block.bold,
          doubleHeight: block.large,
        },
      ];

    case 'phone': {
      const phone = SHOP_PHONE?.trim() || shop.other?.phone?.trim();
      if (!phone) return [];
      const label = block.label ? `${block.label}: ` : '';
      return [{ type: 'text', value: centerText(`${label}${phone}`) }];
    }

    case 'email': {
      const email = shop.other?.email?.trim();
      if (!email) return [];
      return [{ type: 'text', value: centerText(email) }];
    }

    case 'whatsapp': {
      const whatsapp = shop.other?.whatsapp?.trim();
      if (!whatsapp) return [];
      const label = block.label ? `${block.label}: ` : '';
      return [{ type: 'text', value: centerText(`${label}${whatsapp}`) }];
    }

    case 'aboutUs': {
      const about = stripHtml(shop.other?.about_us);
      if (!about) return [];
      return wrapText(about)
        .slice(0, block.maxLines ?? 3)
        .map((l) => ({ type: 'text' as const, value: centerText(l) }));
    }

    case 'space':
      return [{ type: 'feed', lines: block.lines ?? 1 }];

    case 'divider':
      return [{ type: 'text', value: divider(block.char) }];
  }
};

/**
 * Builds the receipt for an order.
 *
 * Totals are read from the order rather than recomputed: the backend is the
 * source of truth for what the customer was actually charged, and a receipt
 * that disagrees with the payment is worse than one that omits a line.
 */
export const buildOrderReceipt = (
  order: Order,
  shop: ReceiptShopInfo,
): ReceiptElement[] => {
  const elements: ReceiptElement[] = [];
  const push = (element: ReceiptElement) => elements.push(element);
  const line = (value: string) => push({ type: 'text', value });

  // ---- Header (configured in constants/receipt.ts) ----
  RECEIPT_HEADER.forEach((block) => renderBlock(block, shop).forEach(push));

  // ---- Order meta ----
  push({
    type: 'text',
    value: centerText(`ORDER #${order.id}`),
    bold: true,
  });
  line(centerText(formatDateTime(order.created_at)));
  line(divider());

  // Customer-supplied text is transliterated before layout, not after: an
  // Arabic name changes length when converted, and the 32-column wrapping has
  // to measure the string that actually gets printed.
  const customerName = toPrintable(order.full_name?.trim() || 'Guest');
  wrapText(`Customer: ${customerName}`).forEach((l) => line(l));
  if (order.customer_phone) line(toPrintable(`Phone: ${order.customer_phone}`));

  if (order.is_pickup) {
    const branch = order.branch_info?.en_title?.trim();
    line(toPrintable(`Type: Pickup${branch ? ` - ${branch}` : ''}`));
  } else {
    line('Type: Delivery');
    const address = order.shipping_address as ShippingAddress | undefined;
    const parts = [address?.street, address?.city, address?.state, address?.zip]
      .filter(Boolean)
      .join(', ');
    if (parts) wrapText(toPrintable(parts)).forEach((l) => line(l));
  }

  const note = order.delivery_note?.trim();
  if (note) wrapText(toPrintable(`Note: ${note}`)).forEach((l) => line(l));

  // ---- Items ----
  line(divider());
  const lines = order.carts ?? [];
  if (lines.length === 0) {
    line('No items');
  } else {
    for (const cart of lines) {
      const lineTotal = toNumber(cart.price) * cart.quantity;
      itemLines(cartLineDescription(cart), money(lineTotal)).forEach((l) =>
        line(l),
      );

      const variant = variantLabel(cart);
      if (variant) line(variant);

      const instruction = cart.instruction?.trim();
      if (instruction) {
        wrapText(toPrintable(`* ${instruction}`), PAPER_COLUMNS - 2).forEach(
          (l) => line(`  ${l}`),
        );
      }
    }
  }

  // ---- Totals ----
  line(divider());

  const subtotal = toNumber(order.total_price);
  line(padLine('Subtotal', money(subtotal)));

  const discount = toNumber(order.discount_price);
  if (discount > 0) {
    const codes = (order.coupon_data ?? [])
      .map((c) => c.code)
      .filter(Boolean)
      .join(', ');
    line(padLine(codes ? `Discount (${codes})` : 'Discount', `-${money(discount)}`));
  }

  const delivery = toNumber(order.delivery_charge);
  if (delivery > 0) line(padLine('Delivery', money(delivery)));

  const vat = toNumber(order.vat);
  if (vat > 0) {
    const rate = toNumber(shop.shop?.vat);
    line(padLine(rate > 0 ? `VAT (${rate}%)` : 'VAT', money(vat)));
  }

  line(divider());
  push({
    type: 'text',
    value: padLine('TOTAL', `${money(order.price)} AED`),
    bold: true,
    doubleHeight: true,
  });
  line(divider());

  // ---- Footer ----
  if (order.payment_method) {
    const label =
      order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card';
    line(`Payment: ${label}`);
  }

  // ---- Footer (configured in constants/receipt.ts) ----
  RECEIPT_FOOTER.forEach((block) => renderBlock(block, shop).forEach(push));

  push({ type: 'tear' });
  return elements;
};
