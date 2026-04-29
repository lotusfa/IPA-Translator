/**
 * Vietnamese Standard Tone Formatter
 * Uses standard pedagogical tone numbering (Số thứ tự thanh điệu)
 */

// Rules ordered by length (longest match first) to ensure precision
const STANDARD_TONE_RULES = [
  // Triple letters (e.g., Dipping-rising Hỏi)
  { regex: /˧˩˨/g, num: '4' }, 
  
  // Double letters (Ligatures)
  { regex: /˧˥|˦˥|˩˧/g, num: '3' }, // Sắc
  { regex: /˨˩|˦˨/g,     num: '2' }, // Huyền
  { regex: /[˧˦˥]ˀ/g,    num: '5' }, // Ngã (High glottal)
  { regex: /[˨˩]ˀ/g,     num: '6' }, // Nặng (Low glottal)
  
  // Single letter Fallbacks
  { regex: /˧/g, num: '1' }, // Ngang
  { regex: /˦/g, num: '3' }, // Sắc variant
  { regex: /˨/g, num: '6' }, // Nặng variant
  { regex: /˩/g, num: '4' }, // Hỏi variant
  { regex: /˥/g, num: '5' }  // Ngã variant
];
/**
 * Format to standard 1-6 tone numbers (Thanh điệu)
 */
export function formatVietnameseStandard(text) {
  let result = text;

  STANDARD_TONE_RULES.forEach(({ regex, num }) => {
    result = result.replace(regex, num);
  });

  // Safety: ensure only one tone number remains per syllable
  return result.replace(/(\d)\d+/g, '$1');
}

/**
 * Format Vietnamese IPA (alias for formatVietnameseStandard)
 * Maintains backward compatibility
 */
export function formatVietnamese(text) {
  return formatVietnameseStandard(text);
}

/**
 * Format Vietnamese output (wrapper for tone formatting)
 */
export function formatVietnameseOutput(result) {
  return formatVietnameseStandard(result);
}

/**
 * Direct IPA pitch height conversion (1-5)
 * Standard Chao Tone Letters: 1=Low, 5=High
 */
export function formatIPANumbers(text) {
  const map = { '˥': '5', '˦': '4', '˧': '3', '˨': '2', '˩': '1' };
  return text.replace(/[˥˦˧˨˩]/g, m => map[m]);
}