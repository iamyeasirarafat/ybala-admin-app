import {
  PAPER_COLUMNS,
  cmdBold,
  cmdFeed,
  cmdInit,
  cmdSize,
  cmdTearFeed,
  cmdText,
} from './escpos';
import { ReceiptElement } from './orderReceipt';

/**
 * Flattens a receipt document into an ESC/POS byte stream.
 *
 * Style commands are emitted per element and reset immediately after, so a
 * bold/double-height line can never leak its styling into the rest of the
 * receipt if a later element forgets to reset.
 */
export const renderEscPos = (elements: ReceiptElement[]): Uint8Array => {
  const bytes: number[] = [...cmdInit()];

  for (const element of elements) {
    switch (element.type) {
      case 'text': {
        // No alignment command: `value` arrives already padded to position, so
        // the printer must be left-aligned or it would shift the padding too.
        if (element.bold) bytes.push(...cmdBold(true));
        if (element.doubleHeight) bytes.push(...cmdSize(1, 2));

        bytes.push(...cmdText(element.value));

        if (element.doubleHeight) bytes.push(...cmdSize(1, 1));
        if (element.bold) bytes.push(...cmdBold(false));
        break;
      }
      case 'feed':
        bytes.push(...cmdFeed(element.lines));
        break;
      case 'tear':
        bytes.push(...cmdTearFeed());
        break;
    }
  }

  return new Uint8Array(bytes);
};

/**
 * Renders the same document as plain text, framed at the real paper width.
 *
 * This exists so the layout can be checked without burning a roll — the
 * printed output only differs in font weight and the logo bitmap.
 */
export const renderPreview = (elements: ReceiptElement[]): string => {
  const out: string[] = [];

  for (const element of elements) {
    switch (element.type) {
      case 'text':
        out.push(element.value);
        break;
      case 'feed':
        for (let i = 0; i < element.lines; i++) out.push('');
        break;
      case 'tear':
        out.push('-'.repeat(PAPER_COLUMNS) + ' (tear)');
        break;
    }
  }

  return out.join('\n');
};
