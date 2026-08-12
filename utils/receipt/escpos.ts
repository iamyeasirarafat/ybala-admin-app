/**
 * ESC/POS command primitives and text layout for 58mm thermal paper.
 *
 * 58mm rolls print 384 dots wide, which is exactly 32 characters in Font A
 * (each glyph is 12x24 dots). Every layout helper here assumes that width —
 * change PAPER_COLUMNS and DOTS_WIDTH together if a different roll is used.
 */

export const PAPER_COLUMNS = 32;
export const PAPER_DOTS_WIDTH = 384;

const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;

export type Align = 'left' | 'center' | 'right';

const ALIGN_CODE: Record<Align, number> = { left: 0, center: 1, right: 2 };

/**
 * Thermal printers speak a single-byte code page, not UTF-8. Anything outside
 * Latin-1 (notably Arabic) has no representation in the default code page and
 * would print as garbage, so it is replaced rather than emitted raw.
 */
const encodeText = (text: string): number[] => {
  const out: number[] = [];
  for (const char of text) {
    const code = char.charCodeAt(0);
    out.push(code < 0x100 ? code : 0x3f); // '?'
  }
  return out;
};

// ---------------- Commands ----------------

/** Resets the printer: clears any leftover style state from a prior job. */
export const cmdInit = (): number[] => [ESC, 0x40];

export const cmdAlign = (align: Align): number[] => [
  ESC,
  0x61,
  ALIGN_CODE[align],
];

export const cmdBold = (on: boolean): number[] => [ESC, 0x45, on ? 1 : 0];

/**
 * Character scaling. `GS ! n` packs width into the high nibble and height into
 * the low nibble, so 0x11 is double both — the widest a 32-column roll can
 * take before text wraps mid-word.
 */
export const cmdSize = (width: 1 | 2, height: 1 | 2): number[] => [
  GS,
  0x21,
  ((width - 1) << 4) | (height - 1),
];

export const cmdFeed = (lines: number): number[] => [ESC, 0x64, lines];

/**
 * End of receipt.
 *
 * Deliberately emits no bytes. This hardware has no auto-cutter (`GS V` is
 * ignored), and the paper feed that lets the receipt clear the tear bar is
 * performed by the vendor service's `printerPerformPrint(feedlines)` call,
 * which every print must end with anyway. Emitting `ESC d` here as well would
 * feed twice and waste roughly 20mm of paper per receipt.
 */
export const cmdTearFeed = (): number[] => [];

/** Emits a line of text plus a line feed. */
export const cmdText = (text: string): number[] => [...encodeText(text), LF];

export const cmdNewline = (): number[] => [LF];

// ---------------- Text layout ----------------

export const truncate = (text: string, width: number): string =>
  text.length <= width ? text : `${text.slice(0, Math.max(0, width - 1))}…`;

/** Repeats a character across the full paper width. */
export const divider = (char = '-'): string => char.repeat(PAPER_COLUMNS);

export const centerText = (
  text: string,
  width = PAPER_COLUMNS,
): string => {
  const clipped = text.length > width ? text.slice(0, width) : text;
  const pad = Math.floor((width - clipped.length) / 2);
  return ' '.repeat(Math.max(0, pad)) + clipped;
};

/**
 * Pushes `right` to the far edge with `left` at the near edge — the standard
 * receipt "label ....... amount" row. If the two would collide, `left` is
 * truncated so the amount is never the part that gets cut.
 */
export const padLine = (
  left: string,
  right: string,
  width = PAPER_COLUMNS,
): string => {
  const available = width - right.length;
  const clippedLeft =
    left.length > available - 1 ? truncate(left, available - 1) : left;
  const gap = Math.max(1, width - clippedLeft.length - right.length);
  return clippedLeft + ' '.repeat(gap) + right;
};

/** Greedy word wrap; words longer than `width` are hard-split. */
export const wrapText = (text: string, width = PAPER_COLUMNS): string[] => {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (word.length > width) {
      if (current) {
        lines.push(current);
        current = '';
      }
      for (let i = 0; i < word.length; i += width) {
        lines.push(word.slice(i, i + width));
      }
      continue;
    }
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > width) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines;
};

/**
 * An order line: description wrapped across the available width, with the
 * amount right-aligned on the final line so it always sits flush at the edge
 * regardless of how many lines the name took.
 */
export const itemLines = (
  description: string,
  amount: string,
  width = PAPER_COLUMNS,
): string[] => {
  const wrapped = wrapText(description, width - amount.length - 1);
  if (wrapped.length === 0) return [padLine('', amount, width)];

  const last = wrapped[wrapped.length - 1];
  return [...wrapped.slice(0, -1), padLine(last, amount, width)];
};
