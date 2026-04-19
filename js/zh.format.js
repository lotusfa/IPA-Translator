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
 * Convert IPA initial to Pinyin initial
 * @param {string} ipaInitial - IPA initial consonant
 * @returns {string} Pinyin initial
 */
export function convertInitialToPinyin(ipaInitial) {
  const map = {
    'p': 'b', 'p\u02B0': 'p',
    't': 'd', 't\u02B0': 't',
    'k': 'g', 'k\u02B0': 'k',
    't\u0282': 'zh', 't\u0282\u02B0': 'ch',
    'ts': 'z', 'ts\u02B0': 'c',
    't\u025A': 'j', 't\u025A\u02B0': 'q', '\u025A': 'x',
    '\u0282': 'sh', '\u0280': 'r',
    'f': 'f', 'h': 'h',
    'm': 'm', 'n': 'n',
    'l': 'l', 'j': 'y', 'w': 'w'
  };
  return map[ipaInitial] || ipaInitial;
}

/**
 * Convert IPA tone to number (1-4)
 * @param {string} ipa - IPA syllable with tone marks
 * @returns {string} Tone number (1-4) or '0' if no tone
 */
export function convertToneToNumber(ipa) {
  if (ipa.includes('˥˥')) return '1';
  if (ipa.includes('˧˥')) return '2';
  if (ipa.includes('˨˩˦')) return '3';
  if (ipa.includes('˥˩')) return '4';
  return '0';
}

/**
 * Remove tone marks from IPA
 * @param {string} ipa - IPA syllable with tone marks
 * @returns {string} IPA without tone marks
 */
export function removeToneMarks(ipa) {
  return ipa
    .replace(/˥˥/g, '')
    .replace(/˧˥/g, '')
    .replace(/˨˩˦/g, '')
    .replace(/˥˩/g, '');
}

/**
 * Get initial consonant length in IPA
 * @param {string} ipa - IPA syllable without tone marks
 * @returns {number} Length of initial consonant
 */
function getInitialLength(ipa) {
  const initialMap = ['p\u02B0', 't\u02B0', 'k\u02B0', 't\u0282\u02B0', 't\u025A\u02B0', 't\u0282', 'ts\u02B0', 'ts', 't\u025A', 'p', 't', 'k', '\u0282', '\u0280', 'f', 'h', 'm', 'n', 'l', 'j', 'w'];
  for (const init of initialMap) {
    if (ipa.startsWith(init)) return init.length;
  }
  return 0;
}

/**
 * Convert IPA syllable to Pinyin with tone number
 * @param {string} ipaSyllable - Full IPA syllable (e.g., "m˥˥a")
 * @returns {string} Pinyin with tone number (e.g., "ma1")
 */
export function convertSyllableToPinyin(ipaSyllable) {
  const tone = convertToneToNumber(ipaSyllable);
  const ipaNoTone = removeToneMarks(ipaSyllable);
  const initialLen = getInitialLength(ipaNoTone);
  const initial = convertInitialToPinyin(ipaNoTone.slice(0, initialLen));
  const finalPart = ipaNoTone.slice(initialLen);
  return initial + finalPart + tone;
}

/**
 * Convert full IPA text to Pinyin format
 * @param {string} text - IPA text with tone marks
 * @returns {string} Pinyin text with tone numbers
 */
export function convertIPATextToPinyin(text) {
  return text.replace(/([^ \t\n]+)/g, function(match) {
    return convertSyllableToPinyin(match);
  });
}

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
      // Pinyin with tone numbers: convert full IPA syllables to pinyin1 format
      return convertIPATextToPinyin(text);
    } else if (Pinyin && Pinyin.checked) {
      return formatJyutpingMandarin(text);
    }
  }
  return formatIPA_org(text);
}
