/**
 * Mandarin IPA Converter - KISS Refactored + Y/ɥ/GLIDE FIX
 * Converts IPA to Pinyin and Zhuyin (注音)
 */

export const INITIAL_MAP = {
  'tɕʰ': 'q', 'tʂʰ': 'ch', 'ʈʂʰ': 'ch',
  'tɕ': 'j', 'tʂ': 'zh', 'ʈʂ': 'zh',
  'ɕ': 'x', 'ʂ': 'sh', 'ʐ': 'r', 'ɻ': 'r',
  'tsʰ': 'c', 'ts': 'z', 's': 's',
  'pʰ': 'p', 'tʰ': 't', 'kʰ': 'k',
  'p': 'b', 't': 'd', 'k': 'g', 'ɡ': 'g',
  'f': 'f', 'h': 'h', 'm': 'm', 'n': 'n', 'l': 'l',
  'j': 'j', 'q': 'q', 'x': 'h', 'w': 'w'
};

export const INITIAL_PATTERNS = ['tɕʰ', 'tʂʰ', 'ʈʂʰ', 'tɕ', 'tʂ', 'ʈʂ', 'tsʰ', 'ɕ', 'ʂ', 'ʐ', 'ɻ', 'ts', 'q', 'x', 'pʰ', 'tʰ', 'kʰ', 'p', 't', 'k', 'ɡ', 'j', 's', 'f', 'h', 'm', 'n', 'l', 'w'];

// Tone marker unicode characters
const TONE = {
  FIVE: '˥', FOUR: '˦', THREE: '˧', TWO: '˨', ONE: '˩'
};

const VOWEL_MAP = {
  'a': ['', 'ā', 'á', 'ǎ', 'à'],
  'o': ['', 'ō', 'ó', 'ǒ', 'ò'],
  'e': ['', 'ē', 'é', 'ě', 'è'],
  'i': ['', 'ī', 'í', 'ǐ', 'ì'],
  'u': ['', 'ū', 'ú', 'ǔ', 'ù'],
  'ü': ['', 'ǖ', 'ǘ', 'ǚ', 'ǜ'],
  'v': ['', 'ǖ', 'ǘ', 'ǚ', 'ǜ']
};

function getToneNumber(ipa) {
  const { ONE, TWO, THREE, FOUR, FIVE } = TONE;
  if (ipa.includes(TWO + ONE + FOUR)) return '3';
  if (ipa.includes(THREE + FIVE)) return '2';
  if (ipa.includes(FIVE + FIVE) || ipa.endsWith(FIVE)) return '1';
  if (ipa.includes(FIVE + ONE) || [FOUR, TWO, ONE].some(t => ipa.endsWith(t))) return '4';
  if (ipa.endsWith(ONE)) return '0';
  if (ipa.includes(FIVE)) return '1';
  if (ipa.includes(THREE)) return '3';
  if (ipa.includes(TWO) || ipa.includes(FOUR)) return '4';
  if (ipa.includes(ONE)) return '0';
  return '3';
}

function removeToneMarks(ipa) {
  return ipa.replace(/[˥˦˧˨˩ˉˊˇˋ\u0329]/g, '');
}

function getInitialLength(ipa) {
  for (const pattern of INITIAL_PATTERNS) {
    if (ipa.startsWith(pattern)) return pattern.length;
  }
  return 0;
}

function convertInitial(ipaInitial) {
  return INITIAL_MAP[ipaInitial] || '';
}

function isZeroInitial(initialIPA, vowelPart) {
  return initialIPA === 'j';
}

function fixOrthography(text, initial = '') {
  let result = text.replace(/y/g, 'ü').replace(/ɥ/g, 'ü');
  // 只有 j, q, x, y 之後才把 ü 轉為 u
  if (['j', 'q', 'x', 'y'].includes(initial) || initial === '') {
    // 注意：如果是零聲母(y)，也轉為 u (如 yuan)
    result = result.replace(/ü/g, 'u');
  }
  return result;
}

function applyDiacritic(word, tone) {
  if (tone < 1 || tone > 4) return word;
  if (word.includes('ui')) return word.replace(/i/, VOWEL_MAP['i'][tone]);
  if (word.includes('iu')) return word.replace(/u/, VOWEL_MAP['u'][tone]);
  for (const vowel of ['a', 'o', 'e', 'i', 'u', 'ü']) {
    if (word.includes(vowel)) return word.replace(vowel, VOWEL_MAP[vowel][tone - 1]);
  }
  return word;
}

function convertFinal(ipaFinal, pinyinInitial = '', isZeroInitialCase = false) {
  // 1. 定義空韻（Apical Vowel）集合
  // 這些符號在 zh, ch, sh, r, z, c, s 後面一律轉為 "i"
  const apicalVowels = ['̩', 'ɨ', 'ɻ', 'ɚ', 'ɿ'];
  
  if (!ipaFinal || apicalVowels.includes(ipaFinal)) {
    if (['zh', 'ch', 'sh', 'r', 'z', 'c', 's'].includes(pinyinInitial)) return 'i';
  }

  // 2. 處理獨立音節 "er" (二, 兒)
  // 如果沒有聲母，且 IPA 是這些捲舌元音，則回傳 "er"
  if (!pinyinInitial && (ipaFinal === 'ɚ' || ipaFinal === 'aɻ' || ipaFinal === 'əɻ')) {
    return 'er';
  }

  if (!ipaFinal) return '';

  // 3. 一般元音處理
  let result = ipaFinal.replace(/œ/g, 'ɛ');
  result = result.replace(/ɤŋ/g, 'eng').replace(/ɤ/g, 'e').replace(/ɔ/g, 'o');
  result = result.replace(/uɔ/g, 'uo').replace(/w/g, 'u');
  
  // 處理 iong
  result = result.replace(/ɥyŋ/g, 'iong').replace(/iɔŋ/g, 'iong');

  // 修正：只有在非空韻的情況下才處理 ɻ/ɚ 轉 i 的邏輯（例如處理 ri 時的輔音殘留）
  // 但因為上方已經優先處理了空韻，這裡主要是清理剩餘的特殊符號
  if (result === 'ɥɛn') {
    result = isZeroInitialCase ? 'yuan' : 'uan';
  } else {
    result = result.replace(/ɥ/g, 'u');
  }

  result = fixOrthography(result, pinyinInitial);
  
  // 進行大範圍的 Pinyin 映射
  result = result.replace(/ɪŋ/g, 'ing').replace(/iŋ/g, 'ing')
    .replace(/ʊŋ/g, 'ong').replace(/uŋ/g, 'ong')
    .replace(/iɛu/g, 'iao').replace(/ɪɛu/g, 'iu').replace(/ɪu/g, 'iu')
    .replace(/ɛn/g, 'an').replace(/iɛn/g, 'ian').replace(/ɪɛn/g, 'ian').replace(/ɪɑn/g, 'ian')
    .replace(/ɪɑnɡ/g, 'iang').replace(/ɛ/g, 'e')
    .replace(/ɑŋ/g, 'ang').replace(/ɑʊ/g, 'ao').replace(/aɪ/g, 'ai')
    .replace(/ŋ/g, 'ng').replace(/ɑ/g, 'a').replace(/ɪ/g, 'i').replace(/ʊ/g, 'u')
    .replace(/ə/g, 'e').replace(/ɯ/g, 'i').replace(/j/g, 'i')
    .replace(/œ/g, 'e').replace(/ɡ/g, 'g');

  if (isZeroInitialCase) return 'y' + result;

  // 處理 ui, iu, un 的簡寫
  if (pinyinInitial) {
    result = result.replace(/uei/g, 'ui').replace(/uəi/g, 'ui')
      .replace(/iou/g, 'iu').replace(/iəu/g, 'iu')
      .replace(/uen/g, 'un').replace(/uən/g, 'un');
  }
  
  return result;
}

function addVowelPrefix(ipaNoTone, pinyinFinal) {
  if (!pinyinFinal) return '';
  if (ipaNoTone === 'aɻ' || ipaNoTone === 'ɚ') return 'er'; // 強制回傳 er
  if (ipaNoTone === 'i' || ipaNoTone === 'ɪ') return 'yi';
  if (ipaNoTone === 'u') return 'wu';
  if (ipaNoTone === 'y') return 'yu';
  if (ipaNoTone === 'yn') return 'yun';
  if (ipaNoTone === 'ɥɛn' || ipaNoTone === 'ɥœn') return 'yuan';
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
  if (ipaNoTone.includes('y') || ipaNoTone.includes('ɥ')) {
    if (ipaNoTone.endsWith('n')) return 'yun' + ipaNoTone.slice(2, -1);
    if (ipaNoTone.endsWith('ŋ')) return 'yong' + ipaNoTone.slice(2, -2);
    const base = pinyinFinal.replace(/ü/g, 'u');
    return 'yu' + base.replace(/^u/, '');
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
    const isZero = isZeroInitial(initialIPA, vowelPart);
    const finalPart = convertFinal(vowelPart, initial, isZero);
    return isZero ? finalPart + tone : initial + finalPart + tone;
  }
  const finalPart = convertFinal(ipaNoTone, '', false);
  const prefixed = addVowelPrefix(ipaNoTone, finalPart);
  return prefixed + tone;
}

export function applyToneMarkToSyllable(pinyinWithNumber) {
  if (!pinyinWithNumber) return '';
  const match = pinyinWithNumber.match(/^(.+?)([01234])$/);
  if (!match) return pinyinWithNumber;
  const [, vowelPart, toneNum] = match;
  if (toneNum === '0') return vowelPart + '˙';
  if (vowelPart.includes('ui')) return vowelPart.replace(/i/, VOWEL_MAP['i'][toneNum]);
  if (vowelPart.includes('iu')) return vowelPart.replace(/u/, VOWEL_MAP['u'][toneNum]);
  for (const vowel of ['a', 'o', 'e', 'i', 'u', 'ü']) {
    const idx = vowelPart.indexOf(vowel);
    if (idx >= 0) return vowelPart.slice(0, idx) + VOWEL_MAP[vowel][toneNum] + vowelPart.slice(idx + 1);
  }
  return vowelPart + 'ˉ';
}

export function convertIPATextToPinyin(text) {
  return text.replace(/\/([^/]+)\//g, (m, ipa) => '/' + ipa.trim().split(/\s+/).map(s => convertSyllableToPinyin(s)).join(' ') + '/');
}

export function convertIPATextToPinyinWithMarks(text) {
  return text.replace(/\/([^/]+)\//g, (m, ipa) => {
    const syllables = ipa.trim().split(/\s+/);
    return '/' + syllables.map(s => applyToneMarkToSyllable(convertSyllableToPinyin(s))).join(' ') + '/';
  });
}

// ============================================
// Zhuyin (注音) Conversion - 重寫重點區域
// ============================================

export const PINYIN_TO_ZHUYIN_INITIAL = {
  'b': 'ㄅ', 'p': 'ㄆ', 'm': 'ㄇ', 'f': 'ㄈ',
  'd': 'ㄉ', 't': 'ㄊ', 'n': 'ㄋ', 'l': 'ㄌ',
  'g': 'ㄍ', 'k': 'ㄎ', 'h': 'ㄏ',
  'j': 'ㄐ', 'q': 'ㄑ', 'x': 'ㄒ',
  'zh': 'ㄓ', 'ch': 'ㄔ', 'sh': 'ㄕ', 'r': 'ㄖ',
  'z': 'ㄗ', 'c': 'ㄘ', 's': 'ㄙ'
};
export const PINYIN_TO_ZHUYIN_FINAL = {
  'a': 'ㄚ', 'o': 'ㄛ', 'e': 'ㄜ', 'ê': 'ㄝ',
  'i': 'ㄧ', 'u': 'ㄨ', 'ü': 'ㄩ',
  'ai': 'ㄞ', 'ei': 'ㄟ', 'ao': 'ㄠ', 'ou': 'ㄡ',
  'an': 'ㄢ', 'en': 'ㄣ', 'ang': 'ㄤ', 'eng': 'ㄥ', 'ong': 'ㄨㄥ',
  'er': 'ㄦ',
  'ia': 'ㄧㄚ', 'ie': 'ㄧㄝ', 'iao': 'ㄧㄠ', 'iu': 'ㄧㄡ',
  'ian': 'ㄧㄢ', 'in': 'ㄧㄣ', 'iang': 'ㄧㄤ', 'ing': 'ㄧㄥ', 'iong': 'ㄩㄥ',
  'ua': 'ㄨㄚ', 'uo': 'ㄨㄛ', 'uai': 'ㄨㄞ', 'ui': 'ㄨㄟ',
  'uan': 'ㄨㄢ', 'un': 'ㄨㄣ', 'uang': 'ㄨㄤ', 'ueng': 'ㄨㄥ',
  'üe': 'ㄩㄝ', 'üan': 'ㄩㄢ', 'ün': 'ㄩㄣ',
  'yao': 'ㄧㄠ', 'iao': 'ㄧㄠ',
  'yue': 'ㄩㄝ',
  'ye': 'ㄧㄝ',
  'wa': 'ㄨㄚ',
  'yuan': 'ㄩㄢ', 'yun': 'ㄩㄣ',
  'ying': 'ㄧㄥ', 'yang': 'ㄧㄤ',
  'yan': 'ㄧㄢ', 'yin': 'ㄧㄣ',
  'yu': 'ㄩ', 'yong': 'ㄩㄥ',
  'wu': 'ㄨ', 'yi': 'ㄧ'
};

const ZHUYIN_TONE = { '1': '', '2': 'ˊ', '3': 'ˇ', '4': 'ˋ', '5': '˙', '0': '˙' };

function handleComplexFinal(pinyinFinal) {
  const directMap = { ...PINYIN_TO_ZHUYIN_FINAL };
  if (directMap[pinyinFinal]) return directMap[pinyinFinal];

  let result = pinyinFinal.replace(/ü/g, 'ㄩ')
    .replace(/ɑ?ng/g, 'ㄤ').replace(/e?ng/g, 'ㄥ')
    .replace(/iɛu|ɪu/gi, 'ㄧㄡ').replace(/iŋ/gi, 'ㄧㄥ')
    .replace(/uɔ/g, 'ㄨㄛ').replace(/ɑʊ/g, 'ㄠ').replace(/aɪ/g, 'ㄞ')
    .replace(/ɛn/g, 'ㄢ').replace(/ɛ/g, 'ㄜ').replace(/ɑ/g, 'ㄚ')
    .replace(/ɪ/g, 'ㄧ').replace(/ʊ/g, 'ㄨ').replace(/ə/g, 'ㄜ');
  return result;
}

// 穩健的 initial/final 切割（取代原本 regex）
function splitPinyinToInitialFinal(pinyinSyllableWithNum) {
  if (!pinyinSyllableWithNum) return { initial: '', final: '', tone: '3' };
  const toneMatch = pinyinSyllableWithNum.match(/([0-5])$/);
  const tone = toneMatch ? toneMatch[1] : '3';
  let syllable = pinyinSyllableWithNum.replace(/[0-5]$/, '');

  const possibleInitials = ['zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x']
    .sort((a, b) => b.length - a.length);

  let initial = '';
  for (const init of possibleInitials) {
    if (syllable.startsWith(init)) {
      initial = init;
      break;
    }
  }
  const final = syllable.slice(initial.length);
  return { initial, final, tone };
}

export function convertSyllableToZhuyin(ipaSyllable) {
  const pinyinWithNum = convertSyllableToPinyin(ipaSyllable);
  if (!pinyinWithNum) return '';

  const { initial: pyInitial, final: pyFinal, tone } = splitPinyinToInitialFinal(pinyinWithNum);

  // j/q/x 後的 u 其實是 ü 的特殊處理
  let effectiveFinal = pyFinal;
  if (['j', 'q', 'x'].includes(pyInitial)) {
    if (pyFinal === 'u') effectiveFinal = 'ü';
    else if (pyFinal === 'ue') effectiveFinal = 'üe';
    else if (pyFinal === 'uan') effectiveFinal = 'üan';
    else if (pyFinal === 'un') effectiveFinal = 'ün';
  }

  const zhInitial = PINYIN_TO_ZHUYIN_INITIAL[pyInitial] || '';
  let zhFinal = PINYIN_TO_ZHUYIN_FINAL[effectiveFinal] || handleComplexFinal(effectiveFinal);

  // 空韻（zhi, chi, shi, ri, zi, ci, si）
  if (['zh', 'ch', 'sh', 'r', 'z', 'c', 's'].includes(pyInitial) && (pyFinal === 'i' || pyFinal === '')) {
    zhFinal = '';
  }

  const toneMark = ZHUYIN_TONE[tone] || '';
  if (tone === '0' || tone === '5') return '˙' + zhInitial + zhFinal;
  return zhInitial + zhFinal + toneMark;
}

export function convertIPATextToZhuyin(text) {
  return text.replace(/\/([^/]+)\//g, (m, ipa) => '/' + ipa.trim().split(/\s+/).map(s => convertSyllableToZhuyin(s)).join(' ') + '/');
}

// ============================================
// Format Dispatcher
// ============================================

export function formatIPA_num(text) { return text.replace(/˥/g, '5').replace(/˧/g, '3').replace(/˨/g, '2').replace(/˩/g, '1'); }
export function formatIPA_org(text) { return text; }
export function formatJyutpingMandarin(text) { return text.replace(/˥˥/g, 'ˆ').replace(/˧˥/g, 'ˊ').replace(/˨˩˦/g, 'ˇ').replace(/˥˩/g, 'ˋ'); }
export const formatJyutping = formatJyutpingMandarin;

export function formatMandarinOutput(text, options = {}) {
  if (typeof document !== 'undefined') {
    const IPA_num = document.getElementById('IPA_num');
    const IPA_org = document.getElementById('IPA_org');
    const Pinyin = document.getElementById('Pinyin');
    const Pinyin_num = document.getElementById('Pinyin_num');
    const Zhuyin = document.getElementById('Zhuyin');
    if (IPA_num?.checked) return formatIPA_num(text);
    if (IPA_org?.checked) return formatIPA_org(text);
    if (Pinyin_num?.checked) return convertIPATextToPinyin(text);
    if (Pinyin?.checked) return convertIPATextToPinyinWithMarks(text);
    if (Zhuyin?.checked) return convertIPATextToZhuyin(text);
  }
  return text;
}
