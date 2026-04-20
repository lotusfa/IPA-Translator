/**
 * Mandarin IPA to Pinyin Converter - KISS Refactored
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
  FIVE: '\u02e5',   // ˥
  FOUR: '\u02e6',   // ˦
  THREE: '\u02e7',  // ˧
  TWO: '\u02e8',    // ˨
  ONE: '\u02e9'     // ˩
};

/**
 * Extract tone number (1-4, 0 for neutral) from IPA
 */
function getToneNumber(ipa) {
  const { ONE, TWO, THREE, FOUR, FIVE } = TONE;
  
  if (ipa.includes(TWO + ONE + FOUR)) return '3';
  if (ipa.includes(FIVE + FIVE) || ipa.endsWith(FIVE)) return '1';
  if (ipa.includes(THREE + FIVE)) return '2';
  if (ipa.includes(FIVE + ONE) || [FOUR, TWO, ONE].some(t => ipa.endsWith(t))) return '4';
  if (ipa.includes(FIVE)) return '1';
  if (ipa.includes(THREE)) return '3';
  if (ipa.includes(TWO) || ipa.includes(FOUR)) return '4';
  if (ipa.includes(ONE)) return '0';
  return '3';
}

/**
 * Remove tone marks from IPA string
 */
function removeToneMarks(ipa) {
  return ipa.replace(/[˥˦˧˨˩]/g, '');
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
 * Convert final (vowel part) to pinyin
 * Returns the pinyin final with prefix added for zero-initial cases
 */
function convertFinal(ipaFinal, pinyinInitial = '', isZeroInitialCase = false) {
  if (!ipaFinal) return '';
  
  let result = ipaFinal;
  
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
  if (result === 'ɥɛn') {
    result = isZeroInitialCase ? 'yuan' : 'uan';
  } else {
    result = result.replace(/ɥ/g, 'u');
  }
  
  // Handle ü (IPA y): context-dependent
  if (pinyinInitial === 'n' || pinyinInitial === 'l') {
    result = result.replace(/y/g, '\u00FC');
  } else {
    result = result.replace(/y/g, 'u');
  }
  
  // Convert vowel patterns
  result = result
    .replace(/ɪŋ/g, 'ing').replace(/iŋ/g, 'ing')
    .replace(/ʊŋ/g, 'ong').replace(/uŋ/g, 'ong')
    .replace(/iɔŋ/g, 'iong')
    .replace(/iɛu/g, 'iao').replace(/ɪɛu/g, 'iu').replace(/ɪu/g, 'iu')
    .replace(/ɛn/g, 'an')
    .replace(/iɛn/g, 'ian').replace(/ɪɛn/g, 'ian').replace(/ɪɑn/g, 'ian')
    .replace(/ɪɑnɡ/g, 'iang')
    .replace(/ɑŋ/g, 'ang').replace(/ɑʊ/g, 'ao').replace(/aɪ/g, 'ai')
    .replace(/ŋ/g, 'ng')
    .replace(/ɑ/g, 'a').replace(/ɪ/g, 'i').replace(/ʊ/g, 'u')
    .replace(/ə/g, 'e').replace(/ɯ/g, 'i')
    .replace(/j/g, 'i')
    .replace(/œ/g, 'e').replace(/ɡ/g, 'g');
  
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
 */
function addVowelPrefix(ipaNoTone, pinyinFinal) {
  if (!pinyinFinal) return '';
  
  if (ipaNoTone === 'i' || ipaNoTone === 'ɪ') return 'yi';
  if (ipaNoTone === 'u') return 'wu';
  if (ipaNoTone === 'y') return 'yu';
  // ɥɛn → yuan (no consonant initial)
  if (ipaNoTone === 'ɥɛn') return 'yuan';
  
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
    'a': ['', '\u0101', '\u00E1', '\u01CE', '\u00E0'],
    'o': ['', '\u014D', '\u00F3', '\u01D0', '\u00F2'],
    'e': ['', '\u0113', '\u00E9', '\u011B', '\u00E8'],
    'i': ['', '\u012B', '\u00ED', '\u01D4', '\u00EC'],
    'u': ['', '\u016B', '\u00FA', '\u01D4', '\u00F9'],
    '\u00FC': ['', '\u01D6', '\u01D8', '\u01DA', '\u01DC']
  };
  
  const match = pinyinWithNumber.match(/^(.+?)([01234])$/);
  if (!match) return pinyinWithNumber;
  
  const [, vowelPart, toneNum] = match;
  if (toneNum === '0') return vowelPart + '\u02D9';
  
  for (const vowel of ['a', 'o', 'e', 'i', 'u', '\u00FC']) {
    const idx = vowelPart.indexOf(vowel);
    if (idx >= 0) {
      return vowelPart.slice(0, idx) + toneMarks[vowel][toneNum] + vowelPart.slice(idx + 1);
    }
  }
  
  return vowelPart + '\u02C9';
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
  return text.replace(/˥˥/g, '\u02C6').replace(/˧˥/g, '\u02CA')
             .replace(/˨˩˦/g, '\u02C7').replace(/˥˩/g, '\u02CB');
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
