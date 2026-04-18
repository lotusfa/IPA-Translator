/**
 * Format Utilities - Mandarin IPA Formatting
 * Converts IPA tone patterns to Mandarin tone marks
 */

/**
 * Format IPA number tones (˥→5, ˧→3, ˨→2, ˩→1, remove :)
 * @param {string} text - Input IPA text
 * @returns {string} Formatted text
 */
export function formatIPA_num(text) {
  return text
    .replace(/˥/g, "5")
    .replace(/˧/g, "3")
    .replace(/˨/g, "2")
    .replace(/˩/g, "1")
    .replace(/:/g, "");
}

/**
 * Format original IPA (no transformation)
 * @param {string} text - Input IPA text
 * @returns {string} Original text
 */
export function formatIPA_org(text) {
  return text;
}

/**
 * Format IPA to Mandarin tone diacritics (ˉ ˊ ˇ ˋ)
 * Converts IPA tone patterns to Mandarin tone marks
 * Based on original toolbox version format_Jyutping
 * @param {string} text - Input IPA text
 * @returns {string} Mandarin formatted text with tone diacritics
 */
export function formatJyutpingMandarin(text) {
  return text
    .replace(/˥˥/g, "ˉ")           // Tone 1
    .replace(/˧˥/g, "ˊ")           // Tone 2
    .replace(/˨˩˦/g, "ˇ")          // Tone 3 (4-part)
    .replace(/˥˩/g, "ˋ")           // Tone 4
    .replace(/:/g, "");
}

/**
 * Format IPA to Mandarin tone numbers (1-4)
 * Converts IPA tone patterns directly to Mandarin tone numbers
 * @param {string} text - Input IPA text
 * @returns {string} Mandarin tone numbers
 */
export function formatJyutpingMandarinNum(text) {
  let x = formatJyutpingMandarin(text);
  return x
    .replace(/ˉ/g, "1")
    .replace(/ˊ/g, "2")
    .replace(/ˇ/g, "3")
    .replace(/ˋ/g, "4")
    .replace(/˙/g, "˙");
}

/**
 * Legacy alias for backward compatibility
 * @deprecated Use formatJyutpingMandarin instead
 */
export const formatJyutping = formatJyutpingMandarin;

/**
 * Format Mandarin output based on selected radio button
 * @param {string} text - Text to format
 * @param {object} [options] - Options (reserved for future use)
 * @returns {string} Formatted text
 */
export function formatMandarinOutput(text, options = {}) {
  if (typeof document !== 'undefined') {
    const IPA_num = document.getElementById('IPA_num');
    const IPA_org = document.getElementById('IPA_org');
    const Pinyin = document.getElementById('Pinyin');
    const Pinyin_num = document.getElementById('Pinyin_num');

    if (IPA_num && IPA_num.checked) {
      return formatIPA_num(text);
    } else if (IPA_org && IPA_org.checked) {
      return formatIPA_org(text);
    } else if (Pinyin_num && Pinyin_num.checked) {
      return formatJyutpingMandarinNum(text);
    } else if (Pinyin && Pinyin.checked) {
      return formatJyutpingMandarin(text);
    }
  }
  return formatIPA_org(text);
}
