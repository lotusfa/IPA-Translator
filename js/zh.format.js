/**
 * Mandarin IPA to Pinyin Converter
 * Converts Mandarin IPA syllables to Hanyu Pinyin with tone marks
 * Based on the working structure of yue.format.js
 */

// IPA Initial to Pinyin mapping (longest patterns first)
export const INITIAL_MAP = {
  'tɕʰ': 'q', 'tʂʰ': 'ch', 'ʈʂʰ': 'ch',
  'tɕ': 'j', 'tʂ': 'zh', 'ʈʂ': 'zh',
  'ɕ': 'x', 'ʂ': 'sh', 'ʐ': 'r', 'ɻ': 'r',
  'tsʰ': 'c', 'ts': 'z', 's': 's',
  'pʰ': 'p', 'tʰ': 't', 'kʰ': 'k',
  'p': 'b', 't': 'd', 'k': 'g',
  'f': 'f', 'x': 'h', 'h': 'h', 'm': 'm', 'n': 'n', 'l': 'l',
  'j': 'y', 'w': 'w'
};

// Initial patterns ordered by length (longest first) for matching
// Note: Removed 'j' and 'w' - these are IPA glides handled in addVowelPrefix for pure vowel syllables
export const INITIAL_PATTERNS = ['tɕʰ', 'tʂʰ', 'ʈʂʰ', 'tɕ', 'tʂ', 'ʈʂ', 'tsʰ', 'ɕ', 'ʂ', 'ʐ', 'ɻ', 'ts', 'pʰ', 'tʰ', 'kʰ', 'p', 't', 'k', 's', 'f', 'x', 'h', 'm', 'n', 'l'];

// Tone Unicode characters
const TONE_5 = '\u02e5';  // ˥ high level (55)
const TONE_4 = '\u02e6';  // ˦ high rising (45)
const TONE_3 = '\u02e7';  // ˧ mid level (33)
const TONE_2 = '\u02e8';  // ˨ low falling (21)
const TONE_1 = '\u02e9';  // ˩ low level (11)

/**
 * Get tone number from IPA tone marks
 */
function getToneNumber(ipa) {
  // Tone 3: ˨˩˦ (214) - falling-then-rising pattern
  if (ipa.includes(TONE_2 + TONE_1 + TONE_4)) return '3';
  // Tone 1: ˥˥ (55) - high level
  if (ipa.includes(TONE_5 + TONE_5)) return '1';
  // Tone 2: ˧˥ (35) - rising
  if (ipa.includes(TONE_3 + TONE_5)) return '2';
  // Tone 4: ˥˩ (51) - falling
  if (ipa.includes(TONE_5 + TONE_1)) return '4';
  // Handle single tone markers at end of syllable
  if (ipa.endsWith(TONE_5)) return '1';
  if (ipa.endsWith(TONE_3)) return '3';
  if (ipa.endsWith(TONE_2)) return '4';
  if (ipa.endsWith(TONE_4)) return '4';
  if (ipa.endsWith(TONE_1)) return '0';
  // Fallback pattern matching
  if (ipa.includes(TONE_5)) return '1';
  if (ipa.includes(TONE_3)) return '3';
  if (ipa.includes(TONE_2) || ipa.includes(TONE_4)) return '4';
  if (ipa.includes(TONE_1)) return '0';
  return '3';
}

/**
 * Remove tone marks from IPA string
 */
function removeToneMarks(ipa) {
  return ipa.replace(/[˥˦˧˨˩]/g, '');
}

/**
 * Get initial length from IPA syllable
 */
function getInitialLength(ipa) {
  for (const init of INITIAL_PATTERNS) {
    if (ipa.startsWith(init)) return init.length;
  }
  return 0;
}

/**
 * Convert initial to pinyin
 */
function convertInitial(ipaInit) {
  return INITIAL_MAP[ipaInit] || '';
}

/**
 * Convert final (vowel part) to pinyin
 * Order matters: longer patterns first
 */
function convertFinal(ipaFinal) {
  if (!ipaFinal) return '';
  let result = ipaFinal;
  // Handle IPA palatal glide j (becomes i in pinyin final)
  // j followed by vowel becomes i + vowel (e.g., jɑʊ → iao, jɛn → ian)
  result = result.replace(/jɛn/g, 'ian');
  result = result.replace(/j/g, 'i');
  // Handle nasal finals first (longest patterns first)
  result = result.replace(/ɥŋ/g, 'iong');
  result = result.replace(/iɔŋ/g, 'iong');
  result = result.replace(/ɪŋ/g, 'ing');
  result = result.replace(/iŋ/g, 'ing');
  result = result.replace(/ʊŋ/g, 'ong');
  result = result.replace(/uŋ/g, 'ong');
  // Handle other special finals
  result = result.replace(/ueɪ/g, 'ui');
  result = result.replace(/uei/g, 'ui');
  result = result.replace(/aɻ/g, 'ar');
  // Retroflex finals: ɚ (er) and ɻ (retroflex approximant)
  // ɚ becomes i in zhi/ch/sh/ri syllables
  // ɻ at end of syllable becomes i (e.g., shɻ → shi)
  result = result.replace(/ɚ/g, 'i');   // Retroflex vowel → i (for zhi/ch/sh/ri)
  result = result.replace(/ɻ/g, 'i');   // Retroflex approximant → i
  // Final ɿ (after z/c/s) becomes i
  result = result.replace(/ɿ/g, 'i');   // Syllabic r after z/c/s → i
  result = result.replace(/uɔ/g, 'uo');
  result = result.replace(/ɥ/g, 'u');
  // Convert diphthongs (longer patterns first)
  result = result.replace(/ɑʊ/g, 'ao');
  result = result.replace(/aʊ/g, 'ao');
  result = result.replace(/iɛu/g, 'iao');  // Handle iɛu → iao
  result = result.replace(/aɪ/g, 'ai');
  // Convert single vowels
  result = result.replace(/ɔ/g, 'o');
  result = result.replace(/ɑ/g, 'a');
  result = result.replace(/ɪ/g, 'i');
  result = result.replace(/ʊ/g, 'u');
  result = result.replace(/ə/g, 'e');
  result = result.replace(/ɛ/g, 'e');
  result = result.replace(/ɤ/g, 'e');
  // ɯ (unrounded close back) → i for zi/ci/si (after s)
  result = result.replace(/ɯ/g, 'i');
  result = result.replace(/œ/g, 'e');
  // IPA y (front rounded vowel) → ü when after j/q/x, else u
  // For pure y syllable (like 語 = y3), it becomes u (yu3 → yǔ)
  result = result.replace(/y(?![ɛnŋ])/g, 'u');  // y before ɛn/ŋ becomes ü, else u
  // Convert ŋ to ng (fallback, after specific patterns)
  result = result.replace(/ŋ/g, 'ng');
  return result;
}

/**
 * Add appropriate y/w prefix for syllables starting with vowels
 */
function addVowelPrefix(ipaNoTone, pinyinFinal) {
  if (!pinyinFinal) return '';
  // Pure vowel syllables
  if (ipaNoTone === 'i' || ipaNoTone === 'ɪ') return 'yi';
  if (ipaNoTone === 'u') return 'wu';
  if (ipaNoTone === 'y' || ipaNoTone === 'ü') return 'yu';
  // Syllables starting with i-/ɪ-
  if (ipaNoTone.startsWith('i') || ipaNoTone.startsWith('ɪ')) {
    // Handle in, ing, iang, etc.
    if (pinyinFinal === 'in') return 'yin';
    if (pinyinFinal === 'ing') return 'ying';
    if (pinyinFinal.startsWith('iang')) return 'yang' + pinyinFinal.substring(6);
    if (pinyinFinal.startsWith('i')) return 'y' + pinyinFinal.substring(1);
    return 'y' + pinyinFinal;
  }
  // Syllables starting with u-/ʊ-
  if (ipaNoTone.startsWith('u') || ipaNoTone.startsWith('ʊ')) {
    if (pinyinFinal.startsWith('u')) return 'w' + pinyinFinal.substring(1);
    if (pinyinFinal === 'ong') return 'wong';  // Special case
    return 'w' + pinyinFinal;
  }
  // Syllables starting with ü- (y in IPA = ü in pinyin)
  if (ipaNoTone.startsWith('y')) {
    // Handle y + vowel combinations
    if (ipaNoTone === 'y' || ipaNoTone === 'yn' || ipaNoTone.startsWith('yn')) {
      // y + n = yin (IPA y without diacritic = i sound before n)
      if (pinyinFinal === 'in' || pinyinFinal.startsWith('in')) {
        return 'yin' + pinyinFinal.substring(2);
      }
      return 'yin';
    }
    if (pinyinFinal.startsWith('ü')) return 'yu' + pinyinFinal.substring(2);
    return 'y' + pinyinFinal;
  }
  return pinyinFinal;
}

/**
 * Convert single IPA syllable to pinyin
 */
export function convertSyllableToPinyin(ipaSyllable) {
  if (!ipaSyllable || typeof ipaSyllable !== 'string') return '';
  const tone = getToneNumber(ipaSyllable);
  const ipaNoTone = removeToneMarks(ipaSyllable);
  const initialLen = getInitialLength(ipaNoTone);
  if (initialLen > 0) {
    const initial = convertInitial(ipaNoTone.slice(0, initialLen));
    const finalPart = convertFinal(ipaNoTone.slice(initialLen));
    return initial + finalPart + tone;
  } else {
    const finalPart = convertFinal(ipaNoTone);
    const prefixed = addVowelPrefix(ipaNoTone, finalPart);
    return prefixed + tone;
  }
}

/**
 * Apply tone mark to pinyin syllable (e.g., guo2 → guó)
 */
export function applyToneMarkToSyllable(pinyinWithNumber) {
  if (!pinyinWithNumber) return '';
  // Precomposed vowels with tone marks (tone 1, 2, 3, 4)
  const toneMarks = {
    'a': ['', '\u0101', '\u00E1', '\u01CE', '\u00E0'],  // ā, á, ǎ, à
    'o': ['', '\u014D', '\u00F3', '\u01D0', '\u00F2'],  // ō, ó, ǒ, ò
    'e': ['', '\u0113', '\u00E9', '\u011B', '\u00E8'],  // ē, é, ě, è
    'i': ['', '\u012B', '\u00ED', '\u01D4', '\u00EC'],  // ī, í, ǐ, ì
    'u': ['', '\u016B', '\u00FA', '\u01D4', '\u00F9'],  // ū, ú, ǔ, ù
    '\u00FC': ['', '\u01D8', '\u01DA', '\u01DC']        // ǘ, ǚ, ǜ (tone 1,2,4 for ü)
  };
  const match = pinyinWithNumber.match(/^(.+?)([01234])$/);
  if (!match) return pinyinWithNumber;
  const vowelPart = match[1];
  const toneNum = match[2];
  if (toneNum === '0') return vowelPart + '\u02D9';  // neutral tone
  // Priority order for tone mark placement: a > o > e > i > u > ü
  const priority = ['a', 'o', 'e', 'i', 'u', '\u00FC'];
  for (const v of priority) {
    const idx = vowelPart.indexOf(v);
    if (idx >= 0) {
      const marks = toneMarks[v];
      const toneMark = marks[toneNum] || marks[1];
      return vowelPart.slice(0, idx) + toneMark + vowelPart.slice(idx + 1);
    }
  }
  // Fallback: add tone 1 to first vowel
  return vowelPart + '\u02C9';
}

/**
 * Convert IPA text (in /.../ format) to pinyin
 */
export function convertIPATextToPinyin(text) {
  return text.replace(/\/([^/]+)\//g, (match, ipaSegment) => {
    const syllables = ipaSegment.trim().split(/\s+/);
    return '/' + syllables.map(s => convertSyllableToPinyin(s)).join(' ') + '/';
  });
}

/**
 * Convert IPA text to pinyin with proper tone marks
 */
export function convertIPATextToPinyinWithMarks(text) {
  return text.replace(/\/([^/]+)\//g, (match, ipaSegment) => {
    const syllables = ipaSegment.trim().split(/\s+/);
    const pinyinWithMarks = syllables.map(s => applyToneMarkToSyllable(convertSyllableToPinyin(s))).join(' ');
    return '/' + pinyinWithMarks + '/';
  });
}

/**
 * Format IPA numbers (˥→5, ˧→3, etc.)
 */
export function formatIPA_num(text) {
  return text.replace(/˥/g, '5').replace(/˦/g, '4').replace(/˧/g, '3').replace(/˨/g, '2').replace(/˩/g, '1');
}

/**
 * Format original IPA (no change)
 */
export function formatIPA_org(text) {
  return text;
}

/**
 * Format to tone mark style (ˉ ˊ ˇ ˋ)
 */
export function formatJyutpingMandarin(text) {
  return text.replace(/˥˥/g, '\u02C6').replace(/˧˥/g, '\u02CA').replace(/˨˩˦/g, '\u02C7').replace(/˥˩/g, '\u02CB');
}

export const formatJyutping = formatJyutpingMandarin;

/**
 * Main output formatter - checks DOM for selected format option
 */
export function formatMandarinOutput(text, options = {}) {
  if (typeof document !== 'undefined') {
    const IPA_num = document.getElementById('IPA_num');
    const IPA_org = document.getElementById('IPA_org');
    const Pinyin = document.getElementById('Pinyin');
    const Pinyin_num = document.getElementById('Pinyin_num');
    if (IPA_num && IPA_num.checked) return formatIPA_num(text);
    if (IPA_org && IPA_org.checked) return formatIPA_org(text);
    if (Pinyin_num && Pinyin_num.checked) return convertIPATextToPinyin(text);
    if (Pinyin && Pinyin.checked) return convertIPATextToPinyinWithMarks(text);
  }
  return text;
}
