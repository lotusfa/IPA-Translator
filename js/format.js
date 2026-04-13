/**
 * Format Utilities - Format transformation for IPA output
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
 * Format IPA to Jyutping (Cantonese) tone numbers (1-6)
 * Converts IPA tone diacritics to Jyutping numeric format
 * Special handling for entering tone endings (k7-9, t7-9, p7-9)
 * @param {string} text - Input IPA text
 * @returns {string} Jyutping formatted text
 */
export function formatJyutpingCantonese(text) {
  return text
    .replace(/˥˧/g, "1")
    .replace(/˥˥/g, "1")
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
 * Format IPA to Mandarin tone diacritics (ˉ ˊ ˇ ˋ ˙)
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
    .replace(/˨˩˩/g, "ˇ")          // Tone 3 (variant)
    .replace(/˥˩/g, "ˋ")           // Tone 4
    .replace(/˥˧/g, "ˋ")           // Tone 4 (variant)
    .replace(/˨˩/g, "˙")           // Neutral tone
    .replace(/˧˩/g, "˙")           // Neutral tone (variant)
    .replace(/˦˩/g, "˙")           // Neutral tone (variant)
    .replace(/˩˩/g, "˙")           // Neutral tone (variant)
    .replace(/˧/g, "˙")            // Neutral tone (catch-all)
    .replace(/:/g, "");
}

/**
 * Legacy alias for backward compatibility
 * @deprecated Use formatJyutpingCantonese instead
 */
export const formatJyutping = formatJyutpingCantonese;

/**
 * Format IPA to Jyutping with numeric tone endings (1-5) for Cantonese
 * Converts Jyutping tone diacritics to numbers (after formatJyutpingCantonese)
 * @param {string} text - Input IPA text
 * @returns {string} Jyutping numeric format
 */
export function formatJyutping_num(text) {
  let x = formatJyutpingCantonese(text);
  return x
    .replace(/ˉ/g, "1")
    .replace(/ˊ/g, "2")
    .replace(/ˇ/g, "3")
    .replace(/ˋ/g, "4")
    .replace(/˙/g, "5");
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
  } else if (Jyutping_num && Jyutping_num.checked) {
    return formatJyutping_num(text);
  } else if (Jyutping && Jyutping.checked) {
    return formatJyutpingCantonese(text);
  } else if (IPA_org && IPA_org.checked) {
    return formatIPA_org(text);
  }
  
  return formatIPA_org(text);
}

/**
 * Format Mandarin output based on selected format
 * @param {string} text - Text to format
 * @param {object} [options] - Options (reserved for future use)
 * @returns {string} Formatted text
 */
export function formatMandarinOutput(text, options = {}) {
  const IPA_num = document.getElementById('IPA_num');
  const IPA_org = document.getElementById('IPA_org');
  const Jyutping = document.getElementById('Jyutping');
  const Jyutping_num = document.getElementById('Jyutping_num');
  
  if (IPA_num && IPA_num.checked) {
    return formatIPA_num(text);
  } else if (IPA_org && IPA_org.checked) {
    return formatIPA_org(text);
  } else if (Jyutping_num && Jyutping_num.checked) {
    return formatJyutpingMandarinNum(text);
  } else if (Jyutping && Jyutping.checked) {
    return formatJyutpingMandarin(text);
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
