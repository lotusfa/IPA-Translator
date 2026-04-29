/**
 * Syllable Decomposition
 * Breaks raw IPA syllables into onset (initial), rhyme (nucleus+coda), and tone (Chao letters).
 * Used by the syllable-fill game type.
 */

import { IPA_INITIALS } from './format/yue.format.js';
import { INITIAL_PATTERNS } from './format/zh.format.js';

const LANGUAGE_INITIALS = {
  cantonese: IPA_INITIALS,
  mandarin: INITIAL_PATTERNS,
};

const CHAO_TONES = '˥˦˧˨˩';

/**
 * Check if a language supports syllable decomposition.
 */
export function supportsDecomposition(language) {
  return language === 'cantonese' || language === 'mandarin';
}

/**
 * Get all known initials for a language (for distractor generation).
 */
export function getInitialsForLanguage(language) {
  return LANGUAGE_INITIALS[language] || [];
}

/**
 * Extract Chao tone letters from an IPA syllable.
 * Handles tones at the end and tones after checked-tone codas (k/t/p).
 * Returns the raw tone string (e.g., "˥", "˨˩˦").
 */
function extractTone(ipa) {
  // Check for checked-tone pattern: k/t/p followed by tone letters
  const checkedMatch = ipa.match(/[ktp]([˥˦˧˨˩]+)/);
  if (checkedMatch) return checkedMatch[1];

  // Trailing tone letters
  const trailMatch = ipa.match(/([˥˦˧˨˩]+)$/);
  if (trailMatch) return trailMatch[1];

  return '';
}

/**
 * Remove all Chao tone characters from an IPA string.
 */
function stripTones(ipa) {
  return ipa.replace(/[˥˦˧˨˩]/g, '');
}

/**
 * Find the longest-matching initial from a list.
 */
function findInitial(base, initials) {
  for (const init of initials) {
    if (base.startsWith(init)) return init;
  }
  return '';
}

/**
 * Decompose a raw IPA syllable into { onset, rhyme, tone }.
 * @param {string} ipa - Raw IPA syllable, e.g. "jɐm˥" or "/jɐm˥/"
 * @param {string} language - "cantonese" or "mandarin"
 * @returns {{ onset: string, rhyme: string, tone: string }}
 */
export function decomposeSyllable(ipa, language) {
  // Strip surrounding slashes
  const clean = ipa.replace(/^\/*|\/*$/g, '');

  const tone = extractTone(clean);
  const base = stripTones(clean);
  const initials = LANGUAGE_INITIALS[language] || [];
  const onset = findInitial(base, initials);
  const rhyme = base.substring(onset.length);

  return { onset, rhyme, tone };
}
