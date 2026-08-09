import { Align } from '@/utils/receipt/escpos';

/**
 * Receipt header/footer layout.
 *
 * Edit the arrays below to change what prints and in what order — no changes
 * to the receipt builder are needed. Blocks that pull from the settings API
 * (phone, email, whatsapp, aboutUs) are skipped automatically when that field
 * is empty, so leaving them in is safe.
 */

export type ReceiptBlock =
  /** SHOP_NAME below, in large bold text. */
  | { type: 'shopName' }
  /** Any fixed text you want to add. */
  | { type: 'text'; value: string; align?: Align; bold?: boolean; large?: boolean }
  /** Contact fields from Other Settings ("about us" API). */
  | { type: 'phone'; label?: string }
  | { type: 'email' }
  | { type: 'whatsapp'; label?: string }
  /** about_us text from Other Settings, HTML stripped. */
  | { type: 'aboutUs'; maxLines?: number }
  /** Blank line(s). */
  | { type: 'space'; lines?: number }
  /** A full-width rule, e.g. -------------------------------- */
  | { type: 'divider'; char?: string };

/** Printed at the top of every receipt (the settings API has no shop-name field). */
export const SHOP_NAME = 'Ybala';

export const RECEIPT_HEADER: ReceiptBlock[] = [
  { type: 'shopName' },
  { type: 'space' },
  { type: 'phone', label: 'Tel' },
  { type: 'email' },
  { type: 'divider' },
];

export const RECEIPT_FOOTER: ReceiptBlock[] = [
  { type: 'space' },
  { type: 'text', value: 'Thank you!', align: 'center' },
  { type: 'space' },
  { type: 'aboutUs', maxLines: 3 },
];
