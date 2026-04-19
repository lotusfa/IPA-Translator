/**
 * Format Utilities - Mandarin IPA Formatting
 * Based on Standard Chinese phonology (Wikipedia reference)
 * Converts IPA tone patterns to Mandarin tone marks and pinyin
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
 * Based on Chao tone values: ˥˥(55)=tone1, ˧˥(35)=tone2, ˨˩˦(214)=tone3, ˥˩(51)=tone4
 * @param {string} text - Input IPA text
 * @returns {string} Mandarin formatted text with tone diacritics
 */
export function formatJyutpingMandarin(text) {
  return text
    .replace(/˥˥/g, "ˉ")           // Tone 1: high level (55)
    .replace(/˧˥/g, "ˊ")           // Tone 2: rising (35)
    .replace(/˨˩˦/g, "ˇ")          // Tone 3: low dipping (214)
    .replace(/˥˩/g, "ˋ")           // Tone 4: falling (51)
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
 * Convert IPA initial consonant to Pinyin initial
 * Based on Standard Chinese consonant inventory
 * @param {string} ipaInitial - IPA initial consonant
 * @returns {string} Pinyin initial
 */
export function convertInitialToPinyin(ipaInitial) {
  const map = {
    // Bilabial plosives (unaspirated/aspirated)
    'p': 'b',
    'p\u02B0': 'p',

    // Alveolar plosives (unaspirated/aspirated)
    't': 'd',
    't\u02B0': 't',

    // Velar plosives (unaspirated/aspirated)
    'k': 'g',
    'k\u02B0': 'k',

    // Retroflex affricates (ʈ͡ʂ series) - Sec. 1.1
    '\u1E9C': 'zh',           // ʈ͡ʂ
    '\u1E9C\u02B0': 'ch',     // ʈ͡ʂʰ
    '\u0282': 'sh',           // ʂ
    '\u0280': 'r',            // ʐ

    // Alveolar affricates (t͡s series) - Sec. 1.1
    'ts': 'z',
    'ts\u02B0': 'c',
    's': 's',

    // Alveolo-palatal series (t͡ɕ) - Sec. 1.2
    '\u025A': 'j',            // t͡ɕ
    '\u025A\u02B0': 'q',      // t͡ɕʰ
    '\u029C': 'x',            // ɕ

    // Fricatives
    'f': 'f',
    'h': 'h',                 // x ~ h

    // Nasals and liquids
    'm': 'm',
    'n': 'n',
    'l': 'l',

    // Glides - Sec. 2
    'j': 'y',
    'w': 'w'
  };
  return map[ipaInitial] || ipaInitial;
}

/**
 * Convert IPA tone to number (1-4)
 * Based on Chao tone values from Standard Chinese phonology
 * @param {string} ipa - IPA syllable with tone marks
 * @returns {string} Tone number (1-4) or '0' if no tone
 */
export function convertToneToNumber(ipa) {
  if (ipa.includes('˥˥')) return '1';      // 55 - high level
  if (ipa.includes('˧˥')) return '2';      // 35 - rising
  if (ipa.includes('˨˩˦')) return '3';     // 214 - low dipping
  if (ipa.includes('˥˩')) return '4';      // 51 - falling
  return '0';                              // neutral tone
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
 * Priority order: longer patterns first for correct matching
 * @param {string} ipa - IPA syllable without tone marks
 * @returns {number} Length of initial consonant
 */
function getInitialLength(ipa) {
  // Priority order: multi-char aspirated > multi-char unaspirated > single chars
  const initialMap = [
    '\u1E9C\u02B0',    // ʈ͡ʂʰ (zh aspirated)
    '\u025A\u02B0',    // t͡ɕʰ (q)
    'ts\u02B0',        // t͡sʰ (c)
    '\u1E9C',          // ʈ͡ʂ (zh)
    '\u025A',          // t͡ɕ (j)
    'ts',              // t͡s (z)
    'p\u02B0',         // pʰ
    't\u02B0',         // tʰ
    'k\u02B0',         // kʰ
    '\u0282',          // ʂ (sh)
    '\u0280',          // ʐ (r)
    '\u029C',          // ɕ (x)
    'p', 't', 'k',     // unaspirated plosives
    'f', 'h',          // fricatives
    's',               // s
    'm', 'n',          // nasals
    'l',               // lateral
    'j', 'w'           // glides
  ];
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
