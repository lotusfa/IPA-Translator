/**
 * Mandarin IPA to Pinyin Converter - KISS Refactored + Y/ɥ + œ/ɛ fixes
 * Converts IPA syllables to Hanyu Pinyin with tone marks
 */

export const INITIAL_MAP = {
  'tɕʰ': 'q', 'tʂʰ': 'ch', 'ʈʂʰ': 'ch',
  'tɕ': 'j', 'tʂ': 'zh', 'ʈʂ': 'zh',
  'ɕ': 'x', 'ʂ': 'sh', 'ʐ': 'r', 'ɻ': 'r',
  'tsʰ': 'c', 'ts': 'z', 's': 's',
  'pʰ': 'p', 'tʰ': 't', 'kʰ': 'k',
  'p': 'b', 't': 'd', 'k': 'g', 'ɡ': 'g',
  'f': 'f', 'h': 'h', 'm': 'm', 'n': 'n', 'l': 'l',
  'j': 'j', 'q': 'q', 'x': 'x', 'w': 'w'
};

export const INITIAL_PATTERNS = ['tɕʰ', 'tʂʰ', 'ʈʂʰ', 'tɕ', 'tʂ', 'ʈʂ', 'tsʰ', 'ɕ', 'ʂ', 'ʐ', 'ɻ', 'ts', 'q', 'x', 'pʰ', 'tʰ', 'kʰ', 'p', 't', 'k', 'ɡ', 'j', 's', 'f', 'h', 'm', 'n', 'l', 'w'];

// Tone marker unicode characters
const TONE = {
  FIVE: '˥',   // ˥
  FOUR: '˦',   // ˦
  THREE: '˧',  // ˧
  TWO: '˨',    // ˨
  ONE: '˩'     // ˩
};

/**
 * Vowel maps for diacritic placement
 * Maps each vowel to its diacritic forms for tones 1-4
 */
const VOWEL_MAP = {
  'a': ['ā', 'á', 'ǎ', 'à'],
  'o': ['ō', 'ó', 'ǐ', 'ò'],
  'e': ['ē', 'é', 'ě', 'è'],
  'i': ['ī', 'í', 'ǔ', 'ì'],
  'u': ['ū', 'ú', 'ǔ', 'ù'],
  'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
  'v': ['ǖ', 'ǘ', 'ǚ', 'ǜ'] // 'v' as shorthand for 'ü'
};

// Vowel priority for tone mark placement
const TONE_PRIORITY = ['a', 'o', 'e', 'ui', 'iu', 'üe', 'ü', 'u', 'i'];

/**
 * Extract tone number (1-4, 0 for neutral) from IPA
 * Tone patterns:
 *   Tone 1: ˥˥ or ends with ˥
 *   Tone 2: ˧˥ (three + five)
 *   Tone 3: ˨˩˦ (two + one + four)
 *   Tone 4: ˥˩ or ends with ˦/˨/˩
 *   Neutral: ends with ˩
 */
function getToneNumber(ipa) {
  const { ONE, TWO, THREE, FOUR, FIVE } = TONE;
  
  // Tone 3: ˨˩˦ (two + one + four)
  if (ipa.includes(TWO + ONE + FOUR)) return '3';
  // Tone 2: ˧˥ (three + five) - check BEFORE ending with FIVE
  if (ipa.includes(THREE + FIVE)) return '2';
  // Tone 1: ˥˥ (five + five) or ends with ˥
  if (ipa.includes(FIVE + FIVE) || ipa.endsWith(FIVE)) return '1';
  // Tone 4: ˥˩ (five + one) or ends with ˦/˨/˩
  if (ipa.includes(FIVE + ONE) || [FOUR, TWO, ONE].some(t => ipa.endsWith(t))) return '4';
  // Neutral tone: ends with ˩
  if (ipa.endsWith(ONE)) return '0';
  // Fallback patterns
  if (ipa.includes(FIVE)) return '1';
  if (ipa.includes(THREE)) return '3';
  if (ipa.includes(TWO) || ipa.includes(FOUR)) return '4';
  if (ipa.includes(ONE)) return '0';
  return '3'; // default
}

/**
 * Remove tone marks from IPA string
 */
function removeToneMarks(ipa) {
  return ipa.replace(/[˥˦˧˨˩ˉˊˇˋ]/g, '');
}

/**
 * Find the length of the initial consonant pattern
 */
function getInitialLength(ipa) {
  for (const pattern of INITIAL_PATTERNS) {
    if (ipa.startsWith(pattern)) return pattern.length;
  }
  return 0;
}

/**
 * Convert initial consonant to pinyin initial
 */
function convertInitial(ipaInitial) {
  return INITIAL_MAP[ipaInitial] || '';
}

/**
 * Check if this is a zero-initial syllable
 * Rules: j + ɛn→yan, j + ɑŋ→yang, j + ɪŋ→ying, j + ɥɛn→yuan
 */
function isZeroInitial(initialIPA, vowelPart) {
  if (initialIPA !== 'j') return false;
  return ['ɛn', 'ɑŋ', 'ɪŋ', 'ɥɛn'].includes(vowelPart);
}

/**
 * Handles the "y" and "ü" orthographic rules + general ɥ fix
 * IPA /y/ or /ɥ/ -> Pinyin "ü"
 * j/q/x + ü -> u (dots dropped)
 * Standalone ü -> yu
 */
function fixOrthography(text, initial = '') {
  let result = text;
  // General fix for y issue: treat ɥ exactly like y
  let hasY = result.includes('y') || result.includes('ɥ');
  
  if (hasY) {
    // Convert IPA y or ɥ to ü temporarily
    result = result.replace(/y/g, 'ü').replace(/ɥ/g, 'ü');
    
    // Rule: j, q, x + ü -> u (dots dropped)
    if (['j', 'q', 'x'].includes(initial)) {
      result = result.replace(/ü/g, 'u');
    }
    // Rule: n, l + ü -> nǚ, lǚ (dots kept for n, l)
    // For other consonants (like n after ü), convert ü to u
    // This handles cases like 'yn' -> 'ün' -> 'un' (for zero-initial, 'yun')
    else if (initial !== 'n' && initial !== 'l') {
      result = result.replace(/ü/g, 'u');
    }
  }
  
  return result;
}

/**
 * Places the tone diacritic on the correct vowel based on Pinyin rules
 * Priority: a > o > e > i > u > ü
 * Special cases: ui -> mark i, iu -> mark u
 */
function applyDiacritic(word, tone) {
  if (tone < 1 || tone > 4) return word;
  
  const toneMarks = VOWEL_MAP;
  
  // Special case: ui -> mark the i (actually it's u + ei, but written as ui)
  if (word.includes('ui')) {
    return word.replace(/i/, toneMarks['i'][tone]);
  }
  
  // Special case: iu -> mark the u (actually it's i + ou, but written as iu)
  if (word.includes('iu')) {
    return word.replace(/u/, toneMarks['u'][tone]);
  }
  
  // Standard priority: a > o > e > i > u > ü
  for (const vowel of ['a', 'o', 'e', 'i', 'u', 'ü']) {
    if (word.includes(vowel)) {
      return word.replace(vowel, toneMarks[vowel][tone - 1]);
    }
  }
  
  return word;
}

/**
 * Convert final (vowel part) to pinyin
 * Returns the pinyin final with prefix added for zero-initial cases
 */
function convertFinal(ipaFinal, pinyinInitial = '', isZeroInitialCase = false) {
  if (!ipaFinal) return '';
  
  // General fix for y issue: normalize œ → ɛ (common IPA variant, e.g. ɥœn becomes ɥɛn)
  let result = ipaFinal.replace(/œ/g, 'ɛ');
  
  // Handle retroflex initials (zh, ch, sh, r)
  const isRetroflex = ['zh', 'ch', 'sh', 'r'].includes(pinyinInitial);
  if (isRetroflex) {
    result = result.replace(/ɤŋ/g, 'eng').replace(/ɤ/g, 'e').replace(/ɔ/g, 'o');
  } else {
    result = result.replace(/ɤŋ/g, 'eng').replace(/ɤ/g, 'e').replace(/ɔ/g, 'o');
  }
  
  // Handle special finals
  result = result
    .replace(/ɥyŋ/g, 'iong')
    .replace(/ɻ/g, 'i').replace(/ɚ/g, 'i').replace(/ɿ/g, 'i')
    .replace(/uɔ/g, 'uo')
    .replace(/w/g, 'u');
  
  // Handle ɥɛn: zero-initial → yuan, otherwise uan
  // (now also catches normalized ɥœn)
  if (result === 'ɥɛn') {
    result = isZeroInitialCase ? 'yuan' : 'uan';
  } else {
    result = result.replace(/ɥ/g, 'u');
  }
  
  // Apply orthography rules for IPA 'y' / 'ɥ' (ü)
  result = fixOrthography(result, pinyinInitial);
  
  // Convert vowel patterns
  result = result
    .replace(/ɪŋ/g, 'ing').replace(/iŋ/g, 'ing')
    .replace(/ʊŋ/g, 'ong').replace(/uŋ/g, 'ong')
    .replace(/iɔŋ/g, 'iong')
    .replace(/iɛu/g, 'iao').replace(/ɪɛu/g, 'iu').replace(/ɪu/g, 'iu')
    .replace(/ɛn/g, 'an')
    .replace(/iɛn/g, 'ian').replace(/ɪɛn/g, 'ian').replace(/ɪɑn/g, 'ian')
    .replace(/ɪɑnɡ/g, 'iang')
    .replace(/ɛ/g, 'e')  // General fix: remaining ɛ → e (handles diphthongs like ɛɪ in tweɪ → uei → ui, and other finals)
    .replace(/ɑŋ/g, 'ang').replace(/ɑʊ/g, 'ao').replace(/aɪ/g, 'ai')
    .replace(/ŋ/g, 'ng')
    .replace(/ɑ/g, 'a').replace(/ɪ/g, 'i').replace(/ʊ/g, 'u')
    .replace(/ə/g, 'e').replace(/ɯ/g, 'i')
    .replace(/j/g, 'i')
    .replace(/œ/g, 'e').replace(/ɡ/g, 'g');  // œ replace kept for safety (harmless after normalization)
  
  // For zero-initial cases, add the appropriate prefix (y for j + vowel patterns)
  if (isZeroInitialCase) {
    if (result === 'ing') return 'ying';
    if (result === 'an') return 'yan';
    if (result === 'ang') return 'yang';
    if (result === 'uan') return 'yuan';
  }
  
  // Apply abbreviations (ui, iu, un) for non-zero-initial syllables
  if (!isZeroInitialCase && pinyinInitial) {
    result = result
      .replace(/uei/g, 'ui')
      .replace(/uəi/g, 'ui')
      .replace(/iou/g, 'iu')
      .replace(/iəu/g, 'iu')
      .replace(/uen/g, 'un')
      .replace(/uən/g, 'un');
  }
  
  return result;
}

/**
 * Add vowel prefix (y/w) for syllables without consonant initial
 * Generalized for ɥ-starting syllables (y issue fix)
 */
function addVowelPrefix(ipaNoTone, pinyinFinal) {
  if (!pinyinFinal) return '';
  
  if (ipaNoTone === 'i' || ipaNoTone === 'ɪ') return 'yi';
  if (ipaNoTone === 'u') return 'wu';
  if (ipaNoTone === 'y') return 'yu';
  if (ipaNoTone === 'yn') return 'yun';
  if (ipaNoTone === 'ɥɛn' || ipaNoTone === 'ɥœn') return 'yuan';  // added ɥœn for the exact example case
  if (ipaNoTone === 'yŋ') return 'yong';
  
  if (ipaNoTone.startsWith('i') || ipaNoTone.startsWith('ɪ')) {
    if (pinyinFinal === 'in') return 'yin';
    if (pinyinFinal === 'ing') return 'ying';
    if (pinyinFinal.startsWith('iang')) return 'yang' + pinyinFinal.slice(6);
    if (pinyinFinal.startsWith('ian')) return 'yan' + pinyinFinal.slice(3);
    return pinyinFinal.startsWith('i') ? 'y' + pinyinFinal.slice(1) : 'y' + pinyinFinal;
  }
  
  if (ipaNoTone.startsWith('u') || ipaNoTone.startsWith('ʊ')) {
    if (pinyinFinal === 'ong') return 'wong';
    return pinyinFinal.startsWith('u') ? 'w' + pinyinFinal.slice(1) : 'w' + pinyinFinal;
  }
  
  // General handling for zero-initial syllables starting with y or ɥ (the core y-issue fix)
  // Now catches ɥn → yun, ɥŋ → yong, ɥ → yu, and any other ɥ... cases
  if (ipaNoTone.includes('y') || ipaNoTone.includes('ɥ')) {
    // For patterns like yn, yŋ, ɥn, ɥŋ, etc.
    if (ipaNoTone.endsWith('n')) return 'yun' + ipaNoTone.slice(2, -1);
    if (ipaNoTone.endsWith('ŋ')) return 'yong' + ipaNoTone.slice(2, -2);
    // For ü + vowel, drop ü dots and add y prefix
    const base = pinyinFinal.replace(/ü/g, 'u');
    return 'yu' + base.replace(/^u/, '');
  }
  
  return pinyinFinal;
}

/**
 * Convert a single IPA syllable to pinyin with tone number
 */
export function convertSyllableToPinyin(ipaSyllable) {
  if (!ipaSyllable || typeof ipaSyllable !== 'string') return '';
  
  const tone = getToneNumber(ipaSyllable);
  const ipaNoTone = removeToneMarks(ipaSyllable);
  const initialLen = getInitialLength(ipaNoTone);
  
  if (initialLen > 0) {
    const initialIPA = ipaNoTone.slice(0, initialLen);
    const vowelPart = ipaNoTone.slice(initialLen);
    const initial = convertInitial(initialIPA);
    const isZero = isZeroInitial(initialIPA, vowelPart);
    const finalPart = convertFinal(vowelPart, initial, isZero);
    
    return isZero ? finalPart + tone : initial + finalPart + tone;
  }
  
  // Truly zero-initial syllable (no initial at all)
  const finalPart = convertFinal(ipaNoTone, '', false);
  const prefixed = addVowelPrefix(ipaNoTone, finalPart);
  return prefixed + tone;
}

/**
 * Apply tone marks to pinyin syllable (e.g., "ni4" → "nì")
 */
export function applyToneMarkToSyllable(pinyinWithNumber) {
  if (!pinyinWithNumber) return '';
  
  const toneMarks = {
    'a': ['', 'ā', 'á', 'ǎ', 'à'],
    'o': ['', 'ō', 'ó', 'ǐ', 'ò'],
    'e': ['', 'ē', 'é', 'ě', 'è'],
    'i': ['', 'ī', 'í', 'ǔ', 'ì'],
    'u': ['', 'ū', 'ú', 'ǔ', 'ù'],
    'ü': ['', 'ǖ', 'ǘ', 'ǚ', 'ǜ']
  };
  
  const match = pinyinWithNumber.match(/^(.+?)([01234])$/);
  if (!match) return pinyinWithNumber;
  
  const [, vowelPart, toneNum] = match;
  if (toneNum === '0') return vowelPart + '˙';
  
  // Special cases: ui -> mark i, iu -> mark u
  if (vowelPart.includes('ui')) {
    return vowelPart.replace(/i/, toneMarks['i'][toneNum]);
  }
  if (vowelPart.includes('iu')) {
    return vowelPart.replace(/u/, toneMarks['u'][toneNum]);
  }
  
  // Standard priority: a > o > e > i > u > ü
  for (const vowel of ['a', 'o', 'e', 'i', 'u', 'ü']) {
    const idx = vowelPart.indexOf(vowel);
    if (idx >= 0) {
      return vowelPart.slice(0, idx) + toneMarks[vowel][toneNum] + vowelPart.slice(idx + 1);
    }
  }
  
  return vowelPart + 'ˉ';
}

/**
 * Convert IPA text (in /.../) to pinyin with tone numbers
 */
export function convertIPATextToPinyin(text) {
  return text.replace(/\/([^/]+)\//g, (match, ipaSegment) => {
    const syllables = ipaSegment.trim().split(/\s+/);
    return '/' + syllables.map(s => convertSyllableToPinyin(s)).join(' ') + '/';
  });
}

/**
 * Convert IPA text to pinyin with tone marks
 */
export function convertIPATextToPinyinWithMarks(text) {
  return text.replace(/\/([^/]+)\//g, (match, ipaSegment) => {
    const syllables = ipaSegment.trim().split(/\s+/);
    const pinyinWithMarks = syllables.map(s => applyToneMarkToSyllable(convertSyllableToPinyin(s))).join(' ');
    return '/' + pinyinWithMarks + '/';
  });
}

// Format functions for different output modes
export function formatIPA_num(text) {
  return text.replace(/˥/g, '5').replace(/˧/g, '3').replace(/˨/g, '2').replace(/˩/g, '1');
}

export function formatIPA_org(text) {
  return text;
}

export function formatJyutpingMandarin(text) {
  return text.replace(/˥˥/g, 'ˆ').replace(/˧˥/g, 'ˊ')
             .replace(/˨˩˦/g, 'ˇ').replace(/˥˩/g, 'ˋ');
}

export const formatJyutping = formatJyutpingMandarin;

export function formatMandarinOutput(text, options = {}) {
  if (typeof document !== 'undefined') {
    const IPA_num = document.getElementById('IPA_num');
    const IPA_org = document.getElementById('IPA_org');
    const Pinyin = document.getElementById('Pinyin');
    const Pinyin_num = document.getElementById('Pinyin_num');
    
    if (IPA_num?.checked) return formatIPA_num(text);
    if (IPA_org?.checked) return formatIPA_org(text);
    if (Pinyin_num?.checked) return convertIPATextToPinyin(text);
    if (Pinyin?.checked) return convertIPATextToPinyinWithMarks(text);
  }
  return text;
}