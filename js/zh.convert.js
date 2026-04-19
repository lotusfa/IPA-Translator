/**
 * Mandarin IPA to Pinyin Converter (Merged & Fixed)
 * Combines zh.convert.js and zh.format.js into one unified module
 */

const TONE_5 = '\u02E5';
const TONE_4 = '\u02E6';
const TONE_3 = '\u02E7';
const TONE_2 = '\u02E8';
const TONE_1 = '\u02E9';

export function convertInitialToPinyin(ipaInitial) {
  const map = {
    '\u1E9C\u0282\u02B0': 'ch',
    '\u1E9C\u0282': 'zh',
    '\u0282': 'sh',
    '\u0280': 'r',
    't\u0255\u02B0': 'q',
    't\u0255': 'j',
    '\u0255': 'x',
    'ts\u02B0': 'c',
    'ts': 'z',
    's': 's',
    'p\u02B0': 'p',
    'p': 'b',
    't\u02B0': 't',
    't': 'd',
    'k\u02B0': 'k',
    'k': 'g',
    'f': 'f',
    'h': 'h',
    'm': 'm',
    'n': 'n',
    'l': 'l',
    'j': 'y',
    'w': 'w'
  };
  return map[ipaInitial] ?? ipaInitial;
}

function getInitialLength(ipa) {
  const patterns = [
    '\u1E9C\u0282\u02B0', 't\u0255\u02B0', 'ts\u02B0',
    '\u1E9C\u0282', 't\u0255', 'ts',
    '\u0282', '\u0280',
    'p\u02B0', 't\u02B0', 'k\u02B0',
    '\u0255', 'p', 't', 'k', 'f', 'h', 's',
    'm', 'n', 'l', 'j', 'w'
  ];
  for (const pattern of patterns) {
    if (ipa.startsWith(pattern)) return pattern.length;
  }
  return 0;
}

export function convertToneToNumber(ipa) {
  const toneSeq = ipa.match(/[˥˦˧˨˩]/g);
  if (!toneSeq) return '0';
  const seq = toneSeq.join('');
  // Tone 3: 214 (˨˩˦) - check exact pattern first
  if (seq.includes(TONE_2 + TONE_1 + TONE_4)) return '3';
  // Tone 1: 55 (˥˥)
  if (seq.includes(TONE_5 + TONE_5)) return '1';
  // Tone 2: 35 (˧˥)
  if (seq.includes(TONE_3 + TONE_5)) return '2';
  // Tone 4: 51 (˥˩)
  if (seq.includes(TONE_5 + TONE_1)) return '4';
  // Single tone letters (fallback)
  if (seq.includes(TONE_5)) return '1';
  if (seq.includes(TONE_4)) return '2';
  if (seq.includes(TONE_3)) return '3';
  if (seq.includes(TONE_2)) return '4';
  if (seq.includes(TONE_1)) return '0';
  return '0';
}

export function removeToneMarks(ipa) {
  return ipa.replace(/[˥˦˧˨˩]/g, '');
}

function convertFinalToPinyin(ipaFinal) {
  let result = ipaFinal;
  // Handle diphthongs and special finals first
  result = result.replace(/aɪ/g, 'ai');
  result = result.replace(/aʊ/g, 'ao');
  result = result.replace(/ɑʊ/g, 'ao');
  result = result.replace(/uɔ/g, 'uo');
  result = result.replace(/ueɪ/g, 'ui');
  result = result.replace(/ɚ/g, 'er');
  // Single vowel mappings - do NOT convert ŋ to ng (keep ŋ in output)
  result = result.replace(/ɑ/g, 'a');
  result = result.replace(/ɔ/g, 'o');
  result = result.replace(/ɪ/g, 'i');
  result = result.replace(/ʊ/g, 'u');
  result = result.replace(/ə/g, 'e');
  result = result.replace(/ɛ/g, 'e');
  result = result.replace(/ɤ/g, 'e');
  // Do NOT convert y to v (keep y as is)
  // Do NOT convert ŋ to ng (keep ŋ as is)
  result = result.replace(/ɥ/g, 'u');
  result = result.replace(/œ/g, 'e');
  return result;
}

export function convertSyllableToPinyin(ipaSyllable) {
  const tone = convertToneToNumber(ipaSyllable);
  const ipaNoTone = removeToneMarks(ipaSyllable);
  const initialLen = getInitialLength(ipaNoTone);
  const initial = initialLen > 0 ? convertInitialToPinyin(ipaNoTone.slice(0, initialLen)) : '';
  const finalPart = convertFinalToPinyin(ipaNoTone.slice(initialLen));
  return initial + finalPart + tone;
}

export function convertIPATextToPinyin(text) {
  return text.replace(/\/([^/]+)\//g, function(_, ipaSegment) {
    const syllables = ipaSegment.trim().split(/\s+/);
    return syllables.map(s => convertSyllableToPinyin(s)).join(' ');
  });
}

export function formatIPA_num(text) {
  return text.replace(/˥/g, '5').replace(/˧/g, '3').replace(/˨/g, '2').replace(/˩/g, '1');
}

export function formatJyutpingMandarin(text) {
  return text.replace(/˥˥/g, 'ˉ').replace(/˧˥/g, 'ˊ').replace(/˨˩˦/g, 'ˇ').replace(/˥˩/g, 'ˋ');
}

export const formatJyutping = formatJyutpingMandarin;

export function formatMandarinOutput(text, options = {}) {
  if (typeof document !== 'undefined') {
    const IPA_num = document.getElementById('IPA_num');
    const IPA_org = document.getElementById('IPA_org');
    const Pinyin = document.getElementById('Pinyin');
    const Pinyin_num = document.getElementById('Pinyin_num');
    if (IPA_num && IPA_num.checked) return formatIPA_num(text);
    if (IPA_org && IPA_org.checked) return text;
    if (Pinyin_num && Pinyin_num.checked) return convertIPATextToPinyin(text);
    if (Pinyin && Pinyin.checked) return formatJyutpingMandarin(text);
  }
  return text;
}
