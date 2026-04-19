/**
 * Mandarin IPA to Pinyin Converter
 */

export function convertInitialToPinyin(ipaInitial) {
  const map = {
    // Retroflex series (ʈʂ = zh)
    '\u1E9C\u0282': 'zh',
    '\u1E9C\u0282\u02B0': 'ch',
    '\u0282': 'sh',
    '\u0280': 'r',
    // Alveolo-palatal series (tɕ = j, where ɕ is U+0255)
    't\u0255': 'j',
    't\u0255\u02B0': 'q',
    '\u0255': 'x',
    // Alveolar affricates (ts = z)
    'ts': 'z',
    'ts\u02B0': 'c',
    's': 's',
    // Plosives (unaspirated → pinyin b/d/g, aspirated → p/p/t/k)
    'p': 'b',
    'p\u02B0': 'p',
    't': 'd',
    't\u02B0': 't',
    'k': 'g',
    'k\u02B0': 'k',
    // Nasals and liquids
    'm': 'm',
    'n': 'n',
    'l': 'l',
    // Fricatives
    'f': 'f',
    'h': 'h',
    // Glides
    'j': 'y',
    'w': 'w'
  };
  return map[ipaInitial] ?? ipaInitial;
}

function getInitialLength(ipa) {
  const initialPatterns = [
    '\u1E9C\u0282\u02B0',  // ch
    '\u1E9C\u0282',       // zh
    't\u0255\u02B0',       // q (t + ɕ + aspirated)
    't\u0255',             // j (t + ɕ)
    '\u0255',             // x
    '\u0282',             // sh
    '\u0280',             // r
    'ts\u02B0',           // c
    'ts',                 // z
    'p\u02B0',            // p (aspirated)
    't\u02B0',            // t (aspirated)
    'k\u02B0',            // k (aspirated)
    'p',                  // b (unaspirated)
    't',                  // d (unaspirated)
    'k',                  // g (unaspirated)
    's',                  // s
    'f',                  // f
    'h',                  // h
    'm',                  // m
    'n',                  // n
    'l',                  // l
    'j',                  // y
    'w'                   // w
  ];
  for (const pattern of initialPatterns) {
    if (ipa.startsWith(pattern)) return pattern.length;
  }
  return 0;
}

export function convertToneToNumber(ipa) {
  // Chao tone letters:
  // ˥ (U+02E5) = 5 = extra-high
  // ˦ (U+02E6) = 4 = half-high
  // ˧ (U+02E7) = 3 = mid
  // ˨ (U+02E8) = 2 = low
  // ˩ (U+02E9) = 1 = extra-low
  const T5 = '\u02E5';
  const T4 = '\u02E6';
  const T3 = '\u02E7';
  const T2 = '\u02E8';
  const T1 = '\u02E9';
  
  // Mandarin tones:
  // Tone 1: 55 (˥˥) - high level
  // Tone 2: 35 (˧˥) - rising
  // Tone 3: 214 (˨˩˦) - low dipping
  // Tone 4: 51 (˥˩) - falling
  
  // Check tone sequences by extracting tone letters
  const toneSeq = ipa.match(/[˥˦˧˨˩]/g);
  if (toneSeq) {
    const seq = toneSeq.join('');
    // Check for 3-tone sequences (Tone 3: ˨˩˦ = T2+T1+T4)
    if (seq.includes(T2 + T1 + T4)) return '3';
    // Check for 2-tone sequences
    if (seq.includes(T5 + T5)) return '1';
    if (seq.includes(T3 + T5)) return '2';
    if (seq.includes(T5 + T1)) return '4';
    // Single tone letters
    if (seq.includes(T5)) return '1';
    if (seq.includes(T4)) return '2';
    if (seq.includes(T3)) return '3';
    if (seq.includes(T2)) return '4';
    if (seq.includes(T1)) return '0';
  }
  return '0';
}

export function removeToneMarks(ipa) {
  return ipa.replace(/[˥˦˧˨˩]/g, '');
}

export function convertSyllableToPinyin(ipaSyllable) {
  const tone = convertToneToNumber(ipaSyllable);
  const ipaNoTone = removeToneMarks(ipaSyllable);
  const initialLen = getInitialLength(ipaNoTone);
  const initial = convertInitialToPinyin(ipaNoTone.slice(0, initialLen));
  const finalPart = ipaNoTone.slice(initialLen);
  return initial + finalPart + tone;
}

export function convertIPATextToPinyin(text) {
  return text.replace(/\/([^/]+)\//g, function(_, ipaSegment) {
    return convertSyllableToPinyin(ipaSegment);
  });
}
