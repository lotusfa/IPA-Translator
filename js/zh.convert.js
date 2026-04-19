/**
 * Mandarin IPA to Pinyin Converter
 */

export function convertInitialToPinyin(ipaInitial) {
  const map = {
    'p': 'b', 'p\u02B0': 'p',
    't': 'd', 't\u02B0': 't',
    'k': 'g', 'k\u02B0': 'k',
    't\u0282': 'zh', 't\u0282\u02B0': 'ch',
    'ts': 'z', 'ts\u02B0': 'c',
    't\u025A': 'j', 't\u025A\u02B0': 'q', '\u025A': 'x',
    '\u0282': 'sh', '\u0280': 'r',
    'f': 'f', 'h': 'h',
    'm': 'm', 'n': 'n',
    'l': 'l', 'j': 'y', 'w': 'w'
  };
  return map[ipaInitial] || ipaInitial;
}

export function convertToneToNumber(ipa) {
  if (ipa.includes('˥˥')) return '1';
  if (ipa.includes('˧˥')) return '2';
  if (ipa.includes('˨˩˦')) return '3';
  if (ipa.includes('˥˩')) return '4';
  return '0';
}

export function removeToneMarks(ipa) {
  return ipa
    .replace(/˥˥/g, '')
    .replace(/˧˥/g, '')
    .replace(/˨˩˦/g, '')
    .replace(/˥˩/g, '');
}

export function convertSyllableToPinyin(ipaSyllable) {
  const tone = convertToneToNumber(ipaSyllable);
  const ipaNoTone = removeToneMarks(ipaSyllable);
  const initialLen = getInitialLength(ipaNoTone);
  const initial = convertInitialToPinyin(ipaNoTone.slice(0, initialLen));
  const finalPart = ipaNoTone.slice(initialLen);
  return initial + finalPart + tone;
}

function getInitialLength(ipa) {
  const initialMap = ['p\u02B0', 't\u02B0', 'k\u02B0', 't\u0282\u02B0', 'ts\u02B0', 't\u0282', 't\u025A\u02B0', 't\u025A', 'p', 't', 'k', 'ts', '\u0282', '\u0280', 'f', 'h', 'm', 'n', 'l', 'j', 'w', 'w'];
  for (const init of initialMap) {
    if (ipa.startsWith(init)) return init.length;
  }
  return 0;
}

export function convertIPATextToPinyin(text) {
  return text.replace(/\/([^/]+)\//g, function(_, ipaSegment) {
    return convertSyllableToPinyin(ipaSegment);
  });
}
