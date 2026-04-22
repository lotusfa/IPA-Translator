/**
 * Vietnamese Format Utilities
 * Simple format functions for Vietnamese IPA output
 */

/**
 * Format Vietnamese IPA to tone numbers (1-6)
 * Currently returns input unchanged - can be enhanced later
 */
export function formatVietnamese(text) {
  return text;
}

/**
 * Format Vietnamese output dispatcher
 */
export function formatVietnameseOutput(text, options = {}) {
  if (typeof document !== 'undefined') {
    const IPA_num = document.getElementById('IPA_num');
    const IPA_org = document.getElementById('IPA_org');

    if (IPA_num && IPA_num.checked) return formatVietnamese(text);
    if (IPA_org && IPA_org.checked) return formatIPA_org(text);
  }
  return formatIPA_org(text);
}

/**
 * Format IPA number tones (˥→5, ˧→3, ˨→2, ˩→1)
 */
export function formatIPA_num(text) {
  return text
    .replace(/˥/g, '5')
    .replace(/˧/g, '3')
    .replace(/˨/g, '2')
    .replace(/˩/g, '1');
}

/**
 * Format original IPA (no transformation)
 */
export function formatIPA_org(text) {
  return text;
}
