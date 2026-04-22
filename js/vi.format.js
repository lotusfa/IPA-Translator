/**
 * Vietnamese Format Utilities
 * Simple format functions for Vietnamese IPA output
 */

/**
 * Format Vietnamese IPA to tone numbers (direct conversion)
 * Converts each IPA tone mark character directly to its corresponding digit:
 * - ˥ → 5
 * - ˧ → 3
 * - ˨ → 2
 * - ˩ → 1
 * Example: /baŋ˧˩˨/ → /baŋ312/
 */
export function formatVietnamese(text) {
  return text
    .replace(/˥/g, '5')
    .replace(/˧/g, '3')
    .replace(/˨/g, '2')
    .replace(/˩/g, '1');
}

/**
 * Format Vietnamese IPA using simplified 6-tone system
 * Maps each Vietnamese tone to a single digit number:
 * - ngang (level): ˧ → 1
 * - sắc (rising): ˧˥, ˊ → 2
 * - hỏi (falling): ˧˩˨, ˧˩ → 3
 * - ngã (creaky): ˧ˀ → 4
 * - nặng (heavy): ˨ˀ → 5
 * - huyền (low): ˦˨ → 6
 * Example: /baŋ˧˩˨/ → /baŋ3/
 */
export function formatVietnameseSimple(text) {
  return text
    // First: Replace 3-segment tone marks (must be before 2-segment patterns)
    .replace(/˧˩˨/g, '3')    // hỏi tone (3-segment)
    // Then: Replace 2-segment tone marks
    .replace(/˧˥/g, '2')     // sắc (rising)
    .replace(/˩˧/g, '2')     // sắc variant
    .replace(/˦˧˥/g, '2')    // sắc variant
    .replace(/˥˧/g, '3')     // hỏi variant (falling)
    .replace(/˧˩/g, '3')     // hỏi (2-segment falling)
    .replace(/˦˨/g, '6')     // huyền (low falling)
    .replace(/˥˩/g, '3')     // hỏi variant
    .replace(/˨˩/g, '5')     // nặng variant
    // Then: Replace creaky tones
    .replace(/˧ˀ/g, '4')     // ngã (creaky-level)
    .replace(/˨ˀ/g, '5')     // nặng (creaky/heavy)
    // Finally: Replace single tone marks (fallback)
    .replace(/˧/g, '1')      // ngang (level)
    .replace(/˥/g, '2')      // high
    .replace(/˦/g, '6')      // high level / huyền
    .replace(/˩/g, '3')      // low / hỏi
    .replace(/˨/g, '5');     // low / nặng
}

/**
 * Format Vietnamese output dispatcher
 * Supports three formats:
 * - IPA_num: Direct tone mark to number conversion (formatVietnamese)
 * - IPA_simple: Simplified 6-tone system (formatVietnameseSimple)
 * - IPA_org: Original IPA (no transformation)
 */
export function formatVietnameseOutput(text, options = {}) {
  if (typeof document !== 'undefined') {
    const IPA_num = document.getElementById('IPA_num');
    const tone_simple = document.getElementById('tone_simple');
    const IPA_org = document.getElementById('IPA_org');

    if (tone_simple && tone_simple.checked) return formatVietnameseSimple(text);
    if (IPA_num && IPA_num.checked) return formatVietnamese(text);
    if (IPA_org && IPA_org.checked) return formatIPA_org(text);
  }
  return formatIPA_org(text);
}

/**
 * Format original IPA (no transformation)
 */
export function formatIPA_org(text) {
  return text;
}
