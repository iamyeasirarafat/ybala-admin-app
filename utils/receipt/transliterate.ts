/**
 * Makes arbitrary customer text printable on a thermal printer.
 *
 * The printer speaks a single-byte code page, so anything above Latin-1 has no
 * byte to send and used to come out as a row of `?`. Arabic customer names are
 * the case that matters in practice, so they are transliterated to Latin
 * rather than dropped — staff can still read and call out the name.
 *
 * This is deliberately NOT full Arabic support: letters are transliterated,
 * not rendered, so the receipt shows "Mhmd" rather than محمد. Printing real
 * Arabic glyphs needs either the vendor's Arabic code page (whose ESC t number
 * is undocumented for this hardware) or bitmap rendering via printBitmap.
 */

/** Arabic letter -> Latin approximation. */
const ARABIC_LETTERS: Record<string, string> = {
  ء: "'",
  آ: 'aa',
  أ: 'a',
  ؤ: 'u',
  إ: 'i',
  ئ: 'i',
  ا: 'a',
  ب: 'b',
  ة: 'h',
  ت: 't',
  ث: 'th',
  ج: 'j',
  ح: 'h',
  خ: 'kh',
  د: 'd',
  ذ: 'dh',
  ر: 'r',
  ز: 'z',
  س: 's',
  ش: 'sh',
  ص: 's',
  ض: 'd',
  ط: 't',
  ظ: 'z',
  ع: 'a',
  غ: 'gh',
  ف: 'f',
  ق: 'q',
  ك: 'k',
  ل: 'l',
  م: 'm',
  ن: 'n',
  ه: 'h',
  و: 'w',
  ى: 'a',
  ي: 'y',
  // Persian / Urdu letters that appear in Gulf-region names
  پ: 'p',
  چ: 'ch',
  ژ: 'zh',
  ک: 'k',
  گ: 'g',
  ی: 'y',
};

/** Arabic-Indic and extended Arabic-Indic digits. */
const ARABIC_DIGITS: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

/**
 * Short vowels, tanween, shadda, sukun (U+064B–U+0652) and tatweel (U+0640).
 * These are pronunciation marks and stretching, not letters — dropping them is
 * what makes the transliteration readable rather than cluttered.
 */
const isArabicDiacritic = (code: number): boolean =>
  (code >= 0x064b && code <= 0x0652) || code === 0x0640;

/**
 * Converts text to something the printer can render.
 *
 * Latin-1 passes through untouched, Arabic is transliterated, and anything
 * else still degrades to `?` — a Chinese or Cyrillic name has no sensible
 * Latin form and a wrong guess would be worse than an honest placeholder.
 */
export const toPrintable = (text: string): string => {
  let out = '';

  for (const char of text) {
    const code = char.charCodeAt(0);

    if (code < 0x100) {
      out += char;
      continue;
    }

    if (isArabicDiacritic(code)) continue;

    const letter = ARABIC_LETTERS[char] ?? ARABIC_DIGITS[char];
    out += letter ?? '?';
  }

  // Transliteration expands some letters to two characters, which can leave
  // doubled spacing when diacritics were dropped between words.
  return out.replace(/\s+/g, ' ').trim();
};
