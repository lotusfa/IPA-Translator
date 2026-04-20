/**
 * Mandarin IPA to Pinyin Converter
 * Converts Mandarin IPA syllables to Hanyu Pinyin with tone marks
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

const TONE_5 = '\u02e5';
const TONE_4 = '\u02e6';
const TONE_3 = '\u02e7';
const TONE_2 = '\u02e8';
const TONE_1 = '\u02e9';

function getToneNumber(ipa) {
  if (ipa.includes(TONE_2 + TONE_1 + TONE_4)) return '3';
  if (ipa.includes(TONE_5 + TONE_5)) return '1';
  if (ipa.includes(TONE_3 + TONE_5)) return '2';
  if (ipa.includes(TONE_5 + TONE_1)) return '4';
  if (ipa.endsWith(TONE_5)) return '1';
  if (ipa.endsWith(TONE_3)) return '3';
  if (ipa.endsWith(TONE_2)) return '4';
  if (ipa.endsWith(TONE_4)) return '4';
  if (ipa.endsWith(TONE_1)) return '0';
  if (ipa.includes(TONE_5)) return '1';
  if (ipa.includes(TONE_3)) return '3';
  if (ipa.includes(TONE_2) || ipa.includes(TONE_4)) return '4';
  if (ipa.includes(TONE_1)) return '0';
  return '3';
}

function removeToneMarks(ipa) {
  return ipa.replace(/[˥˦˧˨˩]/g, '');
}

function getInitialLength(ipa) {
  for (const init of INITIAL_PATTERNS) {
    if (ipa.startsWith(init)) return init.length;
  }
  return 0;
}

function convertInitial(ipaInit) {
  return INITIAL_MAP[ipaInit] || '';
}

// Zero-initial: j when followed by ɛ or ɑ (for jɛn→yan, jɑŋ→yang)
// w is never a zero-initial; it's a real initial
function isZeroInitial(initialIPA, vowelPart) {
  if (initialIPA === 'j' && (vowelPart.startsWith('ɛ') || vowelPart.startsWith('ɑ'))) {
    return true; // jɛn → yan, jɑŋ → yang
  }
  if (initialIPA === 'j' && vowelPart === 'ɪŋ') {
    return true; // jɪŋ → ying
  }
  if (initialIPA === 'j' && vowelPart === 'ɥɛn') {
    return true; // ɥɛn → yuan (zero-initial for 員)
  }
  return false;
}

function convertFinal(ipaFinal, pinyinInitial = '', hasInitial = false, originalInitial = '', vowelPart = '') {
  if (!ipaFinal) return '';
  let result = ipaFinal;
  
  const retroflexInitials = ['zh', 'ch', 'sh', 'r'];
  const isZeroInitialCase = isZeroInitial(originalInitial, vowelPart);
  
  if (retroflexInitials.includes(pinyinInitial)) {
    result = result.replace(/ɤŋ/g, 'eng');
    // ɤ → e for retroflex (ʂɤ → she), but keep ɤ → i for compounds like ɤŋ → eng
    result = result.replace(/ɤ/g, 'e');
    result = result.replace(/ɔ/g, 'o');
  } else {
    result = result.replace(/ɤŋ/g, 'eng');
    result = result.replace(/ɤ/g, 'e');
    result = result.replace(/ɔ/g, 'o');
  }
  
  result = result.replace(/ɥyŋ/g, 'iong');
  // Handle ɥɛn → yuan for zero-initial case (員)
  if (result === 'ɥɛn') {
    if (isZeroInitialCase) {
      result = 'yuan';  // zero-initial: ɥɛn → yuan
    } else {
      result = 'uan';   // with initial: ɥɛn → uan
    }
  } else {
    result = result.replace(/ɥ/g, 'u');
  }
  result = result.replace(/ɻ/g, 'i');
  result = result.replace(/ɚ/g, 'i');
  result = result.replace(/ɿ/g, 'i');
  result = result.replace(/uɔ/g, 'uo');
  result = result.replace(/w/g, 'u');
  
  // Handle ü (IPA y): context-dependent after different initials
  // n, l followed by ü should keep ü (nǚ, lǜ) - replace y with ü
  // j, q, x followed by ü should become u (jūn, qū, xū) - replace y with u
  if (pinyinInitial === 'n' || pinyinInitial === 'l') {
    // Keep ü after n, l
    result = result.replace(/y/g, '\u00FC');
  } else if (pinyinInitial === 'j' || pinyinInitial === 'q' || pinyinInitial === 'x') {
    // After j, q, x: y → u
    result = result.replace(/y/g, 'u');
  } else {
    // Default: y → u for other initials
    result = result.replace(/y/g, 'u');
  }
  
  result = result.replace(/ɪŋ/g, 'ing');
  result = result.replace(/iŋ/g, 'ing');
  result = result.replace(/ʊŋ/g, 'ong');
  result = result.replace(/uŋ/g, 'ong');
  result = result.replace(/iɔŋ/g, 'iong');
  result = result.replace(/iɛu/g, 'iao');
  result = result.replace(/ɪɛu/g, 'iu');
  result = result.replace(/ɪu/g, 'iu');
  
  // Handle specific vowel patterns
  result = result.replace(/ɛn/g, 'an');
  result = result.replace(/ɑŋ/g, 'ang');
  result = result.replace(/iɛn/g, 'ian');
  result = result.replace(/ɪɛn/g, 'ian');
  result = result.replace(/ɪɑn/g, 'ian');
  result = result.replace(/ɪɑnɡ/g, 'iang');
  result = result.replace(/ɑʊ/g, 'ao');
  result = result.replace(/aɪ/g, 'ai');
  result = result.replace(/ŋ/g, 'ng');
  result = result.replace(/ɑ/g, 'a');
  result = result.replace(/ɪ/g, 'i');
  result = result.replace(/ʊ/g, 'u');
  result = result.replace(/ə/g, 'e');
  result = result.replace(/ɯ/g, 'i');
  // Refinement Rule: In Hanyu Pinyin, never use 'j' as a medial.
  // If the IPA contains a palatal medial [j], convert it to 'i' (e.g., 'biàn' instead of 'bjàn', 'xiāng' instead of 'xjāng')
  result = result.replace(/j/g, 'i');
  result = result.replace(/œ/g, 'e');
  result = result.replace(/ɡ/g, 'g');
  
  // For zero-initial j, prepend 'y'
  if (isZeroInitialCase && originalInitial === 'j') {
    result = 'y' + result;
  }
  
  // Final abbreviation rules (skip for zero-initial)
  if (hasInitial && pinyinInitial && pinyinInitial.length > 0 && !isZeroInitialCase) {
    result = result.replace(/uei/g, 'ui');
    result = result.replace(/uəi/g, 'ui');
    result = result.replace(/iou/g, 'iu');
    result = result.replace(/iəu/g, 'iu');
    result = result.replace(/uen/g, 'un');
    result = result.replace(/uən/g, 'un');
  }
  
  return result;
}

function addVowelPrefix(ipaNoTone, pinyinFinal, originalInitial = '') {
  if (!pinyinFinal) return '';
  
  if (ipaNoTone === 'i' || ipaNoTone === 'ɪ') return 'yi';
  if (ipaNoTone === 'u') return 'wu';
  if (ipaNoTone === 'y' || ipaNoTone === 'ü') return 'yu';
  if (ipaNoTone.startsWith('i') || ipaNoTone.startsWith('ɪ')) {
    if (pinyinFinal === 'in') return 'yin';
    if (pinyinFinal === 'ing') return 'ying';
    if (pinyinFinal.startsWith('iang')) return 'yang' + pinyinFinal.substring(6);
    if (pinyinFinal.startsWith('ian')) return 'yan' + pinyinFinal.substring(3);
    if (pinyinFinal.startsWith('i')) return 'y' + pinyinFinal.substring(1);
    return 'y' + pinyinFinal;
  }
  if (ipaNoTone.startsWith('u') || ipaNoTone.startsWith('ʊ')) {
    if (pinyinFinal.startsWith('u')) return 'w' + pinyinFinal.substring(1);
    if (pinyinFinal === 'ong') return 'wong';
    return 'w' + pinyinFinal;
  }
  if (ipaNoTone.startsWith('y')) {
    if (pinyinFinal === 'in' || pinyinFinal.startsWith('in')) {
      return 'yin' + pinyinFinal.substring(2);
    }
    if (pinyinFinal.startsWith('ü')) return 'yu' + pinyinFinal.substring(2);
    return 'y' + pinyinFinal;
  }
  // Handle ɥɛn (零聲母: 員 → yuan)
  if (ipaNoTone === 'ɥɛn' && pinyinFinal === 'uan') {
    return 'yuan';
  }
  return pinyinFinal;
}

export function convertSyllableToPinyin(ipaSyllable) {
  if (!ipaSyllable || typeof ipaSyllable !== 'string') return '';
  const tone = getToneNumber(ipaSyllable);
  const ipaNoTone = removeToneMarks(ipaSyllable);
  const initialLen = getInitialLength(ipaNoTone);
  
  if (initialLen > 0) {
    const initialIPA = ipaNoTone.slice(0, initialLen);
    const vowelPart = ipaNoTone.slice(initialLen);
    const initial = convertInitial(initialIPA);
    const isZeroInitialCase = isZeroInitial(initialIPA, vowelPart);
    const finalPart = convertFinal(vowelPart, initial, true, initialIPA, vowelPart);
    
    // For zero-initial syllables, the initial is already included in finalPart
    if (isZeroInitialCase) {
      return finalPart + tone;
    }
    return initial + finalPart + tone;
  } else {
    const finalPart = convertFinal(ipaNoTone, '', false, '', '');
    const prefixed = addVowelPrefix(ipaNoTone, finalPart);
    return prefixed + tone;
  }
}

export function applyToneMarkToSyllable(pinyinWithNumber) {
  if (!pinyinWithNumber) return '';
  const toneMarks = {
    'a': ['', '\u0101', '\u00E1', '\u01CE', '\u00E0'],
    'o': ['', '\u014D', '\u00F3', '\u01D0', '\u00F2'],
    'e': ['', '\u0113', '\u00E9', '\u011B', '\u00E8'],
    'i': ['', '\u012B', '\u00ED', '\u01D4', '\u00EC'],
    'u': ['', '\u016B', '\u00FA', '\u01D4', '\u00F9'],
    '\u00FC': ['', '\u01D8', '\u01DA', '\u01DC']
  };
  const match = pinyinWithNumber.match(/^(.+?)([01234])$/);
  if (!match) return pinyinWithNumber;
  const vowelPart = match[1];
  const toneNum = match[2];
  if (toneNum === '0') return vowelPart + '\u02D9';
  const priority = ['a', 'o', 'e', 'i', 'u', '\u00FC'];
  for (const v of priority) {
    const idx = vowelPart.indexOf(v);
    if (idx >= 0) {
      const marks = toneMarks[v];
      const toneMark = marks[toneNum] || marks[1];
      return vowelPart.slice(0, idx) + toneMark + vowelPart.slice(idx + 1);
    }
  }
  return vowelPart + '\u02C9';
}

export function convertIPATextToPinyin(text) {
  return text.replace(/\/([^/]+)\//g, (match, ipaSegment) => {
    const syllables = ipaSegment.trim().split(/\s+/);
    return '/' + syllables.map(s => convertSyllableToPinyin(s)).join(' ') + '/';
  });
}

export function convertIPATextToPinyinWithMarks(text) {
  return text.replace(/\/([^/]+)\//g, (match, ipaSegment) => {
    const syllables = ipaSegment.trim().split(/\s+/);
    const pinyinWithMarks = syllables.map(s => applyToneMarkToSyllable(convertSyllableToPinyin(s))).join(' ');
    return '/' + pinyinWithMarks + '/';
  });
}

export function formatIPA_num(text) {
  return text.replace(/˥/g, '5').replace(/˧/g, '3').replace(/˨/g, '2').replace(/˩/g, '1');
}

export function formatIPA_org(text) {
  return text;
}

export function formatJyutpingMandarin(text) {
  return text.replace(/˥˥/g, '\u02C6').replace(/˧˥/g, '\u02CA').replace(/˨˩˦/g, '\u02C7').replace(/˥˩/g, '\u02CB');
}

export const formatJyutping = formatJyutpingMandarin;

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
