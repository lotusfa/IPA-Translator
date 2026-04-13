/**
 * Format Utilities - Format transformations for IPA output
 * Provides format conversion functions for various languages
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
 * Format IPA to Jyutping tone numbers (1-9)
 * Converts tone diacritics and consonant endings to numeric Jyutping format
 * @param {string} text - Input IPA text
 * @returns {string} Jyutping formatted text
 */
export function formatJyutping(text) {
  return text
    .replace(/˥˧/g, "1")
    .replace(/˥˥/g, "1")
    .replace(/˧˥/g, "2")
    .replace(/˧˥/g, "2")
    .replace(/˧˧/g, "3")
    .replace(/˨˩/g, "4")
    .replace(/˩˩/g, "4")
    .replace(/˩˧/g, "5")
    .replace(/˨˧/g, "5")
    .replace(/˨˨/g, "6")
    .replace(/k˥/g, "k7")
    .replace(/k˧/g, "k8")
    .replace(/k˨/g, "k9")
    .replace(/t˥/g, "t7")
    .replace(/t˧/g, "t8")
    .replace(/t˨/g, "t9")
    .replace(/p˥/g, "p7")
    .replace(/p˧/g, "p8")
    .replace(/p˨/g, "p9")
    .replace(/˥/g, "1")
    .replace(/˧/g, "3")
    .replace(/˨/g, "6")
    .replace(/:/g, "");
}

/**
 * Format Vietnamese IPA to tone numbers (1-6)
 * Converts Vietnamese tone diacritics to numeric format
 * @param {string} text - Input IPA text
 * @returns {string} Vietnamese IPA with tone numbers
 */
export function formatVietnamese(text) {
  return text
    .replace(/˧˥/g, "5")
    .replace(/˧/g, "3")
    .replace(/˨˩/g, "4")
    .replace(/˩/g, "1")
    .replace(/˧˧/g, "3")
    .replace(/˦˥/g, "6")
    .replace(/˦/g, "4")
    .replace(/˧˩/g, "4")
    .replace(/˨˧/g, "5")
    .replace(/˥/g, "1")
    .replace(/:/g, "");
}

/**
 * Get active format from radio buttons and apply transformation
 * Auto-detects which format radio button is checked
 * 
 * @param {string} text - Text to format
 * @param {object} [options] - Options (reserved for future use)
 * @returns {string} Formatted text
 */
export function formatIPAOutput(text, options = {}) {
  const IPA_num = document.getElementById('IPA_num');
  const IPA_org = document.getElementById('IPA_org');
  const Jyutping = document.getElementById('Jyutping');
  const Jyutping_num = document.getElementById('Jyutping_num');
  
  if (IPA_num && IPA_num.checked) {
    return formatIPA_num(text);
  } else if (Jyutping && Jyutping.checked) {
    return formatJyutping(text);
  } else if (IPA_org && IPA_org.checked) {
    return formatIPA_org(text);
  }
  
  return formatIPA_org(text);
}

/**
 * Format Vietnamese output based on selected format
 * @param {string} text - Text to format
 * @param {object} [options] - Options (reserved for future use)
 * @returns {string} Formatted text
 */
export function formatVietnameseOutput(text, options = {}) {
  const IPA_num = document.getElementById('IPA_num');
  const IPA_org = document.getElementById('IPA_org');
  
  if (IPA_num && IPA_num.checked) {
    return formatVietnamese(text);
  } else if (IPA_org && IPA_org.checked) {
    return formatIPA_org(text);
  }
  
  return formatIPA_org(text);
}
