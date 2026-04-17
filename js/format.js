/**
 * Format Utilities - Format transformation for IPA output
 * Provides format conversion functions for various languages
 */

/**
 * Format IPA number tones (˥→5, ˧→3, ˨→2, ˩→1)
 * @param {string} text - Input IPA text
 * @returns {string} Formatted text
 */
export function formatIPA_num(text) {
  return text
    .replace(/˥/g, "5")
    .replace(/˧/g, "3")
    .replace(/˨/g, "2")
    .replace(/˩/g, "1");
}

/**
 * Format original IPA (no transformation)
 * @param {string} text - Input IPA text
 * @returns {string} Original text
 */
export function formatIPA_org(text) {
  return text;
}

/**
 * Format IPA to Jyutping (Cantonese) tone numbers (1-6)
 * Converts IPA tone diacritics to Jyutping numeric format
 * Special handling for entering tone endings (k7-9, t7-9, p7-9)
 * @param {string} text - Input IPA text
 * @returns {string} Jyutping formatted text
 */
export function formatJyutpingCantonese(text) {
  return text
    .replace(/˥˧/g, "1")
    .replace(/˥˥/g, "1")
    .replace(/˧˥/g, "2")
    .replace(/˧˧/g, "3")
    .replace(/˨˩/g, "4")
    .replace(/˩˩/g, "4")
    .replace(/˩˧/g, "5")
    .replace(/˨˧/g, "5")
    .replace(/˨˨/g, "6")
    .replace(/k˥/g, "k7")
    .replace(/k˧/g, "k8")
    .replace(/k˨/g, "k9")
    .replace(/t˥/g, "t7")
    .replace(/t˧/g, "t8")
    .replace(/t˨/g, "t9")
    .replace(/p˥/g, "p7")
    .replace(/p˧/g, "p8")
    .replace(/p˨/g, "p9")
    .replace(/˥/g, "1")
    .replace(/˧/g, "3")
    .replace(/˨/g, "6");
}

/**
 * Format IPA to Mandarin tone diacritics (ˉ ˊ ˇ ˋ ˙)
 * Converts IPA tone patterns to Mandarin tone marks
 * @param {string} text - Input IPA text
 * @returns {string} Mandarin formatted text with tone diacritics
 */
export function formatJyutpingMandarin(text) {
  return text
    .replace(/˥˥/g, "ˉ")
    .replace(/˧˥/g, "ˊ")
    .replace(/˨˩˦/g, "ˇ")
    .replace(/˨˩˩/g, "ˇ")
    .replace(/˥˩/g, "ˋ")
    .replace(/˥˧/g, "ˋ")
    .replace(/˨˩/g, "˙")
    .replace(/˧˩/g, "˙")
    .replace(/˦˩/g, "˙")
    .replace(/˩˩/g, "˙")
    .replace(/˧/g, "˙");
}

/**
 * Legacy alias for backward compatibility
 * @deprecated Use formatJyutpingCantonese instead
 */
export const formatJyutping = formatJyutpingCantonese;

/**
 * Format IPA to Jyutping with numeric tone endings (1-5) for Cantonese
 * @param {string} text - Input IPA text
 * @returns {string} Jyutping numeric format
 */
export function formatJyutping_num(text) {
  let x = formatJyutpingCantonese(text);
  return x
    .replace(/ˉ/g, "1")
    .replace(/ˊ/g, "2")
    .replace(/ˇ/g, "3")
    .replace(/ˋ/g, "4")
    .replace(/˙/g, "5");
}

/**
 * Format IPA to Mandarin tone numbers (1-4)
 * @param {string} text - Input IPA text
 * @returns {string} Mandarin tone numbers
 */
export function formatJyutpingMandarinNum(text) {
  let x = formatJyutpingMandarin(text);
  return x
    .replace(/ˉ/g, "1")
    .replace(/ˊ/g, "2")
    .replace(/ˇ/g, "3")
    .replace(/ˋ/g, "4")
    .replace(/˙/g, "˙");
}

/**
 * Format Vietnamese IPA to tone numbers (1-6)
 * @param {string} text - Input IPA text
 * @returns {string} Vietnamese IPA with tone numbers
 */
export function formatVietnamese(text) {
  return text
    .replace(/˧˥/g, "5")
    .replace(/˧/g, "3")
    .replace(/˨˩/g, "4")
    .replace(/˩/g, "1")
    .replace(/˧˧/g, "3")
    .replace(/˦˥/g, "6")
    .replace(/˦/g, "4")
    .replace(/˧˩/g, "4")
    .replace(/˨˧/g, "5")
    .replace(/˥/g, "1");
}

/**
 * Get active format from radio buttons
 * @param {string} text - Text to format
 * @returns {string} Formatted text
 */
export function formatIPAOutput(text, options = {}) {
  const IPA_num = document.getElementById('IPA_num');
  const IPA_org = document.getElementById('IPA_org');
  const Jyutping = document.getElementById('Jyutping');
  const Jyutping_num = document.getElementById('Jyutping_num');

  if (IPA_num && IPA_num.checked) {
    return formatIPA_num(text);
  } else if (Jyutping_num && Jyutping_num.checked) {
    return formatJyutping_num(text);
  } else if (Jyutping && Jyutping.checked) {
    return formatJyutpingCantonese(text);
  } else if (IPA_org && IPA_org.checked) {
    return formatIPA_org(text);
  }

  return formatIPA_org(text);
}

/**
 * Format Mandarin output
 * @param {string} text - Text to format
 * @returns {string} Formatted text
 */
export function formatMandarinOutput(text, options = {}) {
  const IPA_num = document.getElementById('IPA_num');
  const IPA_org = document.getElementById('IPA_org');
  const Jyutping = document.getElementById('Jyutping');
  const Jyutping_num = document.getElementById('Jyutping_num');

  if (IPA_num && IPA_num.checked) {
    return formatIPA_num(text);
  } else if (IPA_org && IPA_org.checked) {
    return formatIPA_org(text);
  } else if (Jyutping_num && Jyutping_num.checked) {
    return formatJyutpingMandarinNum(text);
  } else if (Jyutping && Jyutping.checked) {
    return formatJyutpingMandarin(text);
  }

  return formatIPA_org(text);
}

/**
 * Format Vietnamese output
 * @param {string} text - Text to format
 * @returns {string} Formatted text
 */
export function formatVietnameseOutput(text, options = {}) {
  const IPA_num = document.getElementById('IPA_num');
  const IPA_org = document.getElementById('IPA_org');

  if (IPA_num && IPA_num.checked) {
    return formatVietnamese(text);
  } else if (IPA_org && IPA_org.checked) {
    return formatIPA_org(text);
  }

  return formatIPA_org(text);
}

// ============================================
// Cantonese Multi-Scheme Support
// ============================================

/**
 * IPA segment to Jyutping mapping
 * Maps IPA phoneme segments to Jyutping romanization components
 */
const IPA_SEG_TO_JYUTPING = {
  // Vowels / Finals
  'a:': 'aa', 'a:i': 'aai', 'a:u': 'aau', 'a:m': 'aam', 'a:n': 'aan', 'a:ŋ': 'aang',
  'a:p': 'aap', 'a:t': 'aat', 'a:k': 'aak',
  'ɐi': 'ai', 'ɐu': 'au', 'ɐm': 'am', 'ɐn': 'an', 'ɐŋ': 'ang',
  'ɐp': 'ap', 'ɐt': 'at', 'ɐk': 'ak',
  'ɛ:': 'e', 'ei': 'ei', 'ɛ:u': 'eu', 'ɛ:m': 'em', 'ɛ:n': 'en', 'ɛ:ŋ': 'eng',
  'ɛ:p': 'ep', 'ɛ:t': 'et', 'ɛ:k': 'ek',
  'i:': 'i', 'i:u': 'iu', 'i:m': 'im', 'i:n': 'in', 'i:p': 'ip', 'i:t': 'it',
  'ɪŋ': 'ing', 'ɪk': 'ik',
  'ɔ:': 'o', 'ɔ:i': 'oi', 'ou': 'ou', 'ɔ:n': 'on', 'ɔ:ŋ': 'ong',
  'ɔ:t': 'ot', 'ɔ:k': 'ok',
  'u:': 'u', 'u:i': 'ui', 'u:n': 'un', 'u:t': 'ut',
  'ʊŋ': 'ung', 'ʊk': 'uk',
  'œ:': 'oe', 'œ:ŋ': 'oeng', 'œ:k': 'oek', 'œ:t': 'oet',
  'ɵy': 'eoi', 'ɵn': 'eon', 'ɵt': 'eot',
  'y:': 'yu', 'y:n': 'yun', 'y:t': 'yut',
  'm̩': 'm', 'ŋ̩': 'ng',

  // Initials
  'p': 'b', 'pʰ': 'p', 'm': 'm', 'f': 'f',
  't': 'd', 'tʰ': 't', 'n': 'n', 'l': 'l',
  'k': 'g', 'kʰ': 'k', 'ŋ': 'ng', 'h': 'h',
  'ts': 'z', 'tsʰ': 'c', 's': 's',
  'kʷ': 'gw', 'kʷʰ': 'kw',
  'j': 'j', 'w': 'w', 'ʔ': ''
};

/**
 * Tone mapping: IPA tone pattern → Jyutping tone number
 * Order matters - check longer patterns first!
 */
const IPA_TONE_TO_NUM = {
  // Entering tones (check first)
  'k˥': 7, 't˥': 7, 'p˥': 7,
  'k˧': 8, 't˧': 8, 'p˧': 8,
  'k˨': 9, 't˨': 9, 'p˨': 9,
  // Normal tones
  '˥˧': 1, '˥˥': 1,
  '˧˥': 2,
  '˧˧': 3,
  '˨˩': 4, '˩˩': 4,
  '˩˧': 5, '˨˧': 5,
  '˨˨': 6
};

/**
 * Extract tone number from IPA string
 */
function getToneNum(ipa) {
  // Check entering tones first
  if (IPA_TONE_TO_NUM['k˥'] && ipa.match(/k˥|t˥|p˥/)) return 7;
  if (ipa.match(/k˧|t˧|p˧/)) return 8;
  if (ipa.match(/k˨|t˨|p˨/)) return 9;

  // Normal tones
  if (ipa.includes('˥˧') || ipa.includes('˥˥')) return 1;
  if (ipa.includes('˧˥')) return 2;
  if (ipa.includes('˧˧') || ipa.includes('˧')) return 3;
  if (ipa.includes('˨˩') || ipa.includes('˩˩')) return 4;
  if (ipa.includes('˩˧') || ipa.includes('˨˧')) return 5;
  if (ipa.includes('˨˨') || ipa.includes('˨')) return 6;
  return 0;
}

/**
 * Remove tone markers from IPA string
 */
function removeTones(ipa) {
  return ipa
    .replace(/˥˧/g, '').replace(/˥˥/g, '')
    .replace(/˧˥/g, '').replace(/˧˧/g, '').replace(/˧/g, '')
    .replace(/˨˩/g, '').replace(/˩˩/g, '').replace(/˩˧/g, '').replace(/˨˧/g, '')
    .replace(/˨˨/g, '').replace(/˨/g, '')
    .replace(/˥/g, '').replace(/˩/g, '');
}

/**
 * Convert a single IPA syllable to Jyutping
 */
function ipaSylToJyutping(ipa) {
  const tone = getToneNum(ipa);
  const isEntering = /k˥|k˧|k˨|t˥|t˧|t˨|p˥|p˧|p˨/.test(ipa);
  const base = removeTones(ipa);

  // Try direct match first
  if (IPA_SEG_TO_JYUTPING[base]) {
    let result = IPA_SEG_TO_JYUTPING[base];

    // Add tone
    if (isEntering) {
      // Determine entering tone (7/8/9) based on tone mark
      if (ipa.match(/˥/)) result = result.replace(/[1-6]$/, '') + '7';
      else if (ipa.match(/˧/)) result = result.replace(/[1-6]$/, '') + '8';
      else if (ipa.match(/˨/)) result = result.replace(/[1-6]$/, '') + '9';
    } else if (tone && !/[1-6]$/.test(result)) {
      result += tone;
    }

    return result;
  }

  // Try component-wise conversion
  let result = '';
  let remaining = base;

  // Try to match long patterns first
  const patterns = [
    'a:ŋ', 'a:n', 'a:m', 'a:u', 'a:i', 'a:k', 'a:t', 'a:p', 'a:',
    'ɐŋ', 'ɐn', 'ɐm', 'ɐk', 'ɐt', 'ɐp', 'ɐu', 'ɐi',
    'ɛ:ŋ', 'ɛ:n', 'ɛ:m', 'ɛ:k', 'ɛ:t', 'ɛ:p', 'ɛ:u', 'ɛ:',
    'i:n', 'i:m', 'i:p', 'i:t', 'i:u', 'i:',
    'ɪŋ', 'ɪk',
    'ɔ:ŋ', 'ɔ:n', 'ɔ:k', 'ɔ:t', 'ɔ:i', 'ɔ:',
    'ʊŋ', 'ʊk', 'u:n', 'u:i', 'u:t', 'u:',
    'œ:ŋ', 'œ:k', 'œ:t', 'œ:',
    'ɵy', 'ɵn', 'ɵt',
    'y:n', 'y:t', 'y:',
    'ei', 'ou', 'oi', 'iu', 'im', 'in', 'ing',
    'ip', 'it', 'ik', 'um', 'ung', 'uk',
    'oe', 'oeng', 'oek', 'oet',
    'eoi', 'eon', 'eot', 'yun', 'yut',
    'm̩', 'ŋ̩'
  ];

  for (const pat of patterns) {
    if (remaining.includes(pat) && IPA_SEG_TO_JYUTPING[pat]) {
      result = IPA_SEG_TO_JYUTPING[pat];
      break;
    }
  }

  // Add tone
  if (isEntering) {
    if (ipa.match(/˥/)) { if (!/[789]$/.test(result)) result += '7'; }
    else if (ipa.match(/˧/)) { if (!/[789]$/.test(result)) result += '8'; }
    else if (ipa.match(/˨/)) { if (!/[789]$/.test(result)) result += '9'; }
  } else if (tone && !/[1-6]$/.test(result)) {
    result += tone;
  }

  return result || base;
}

/**
 * Format IPA to Jyutping (粵拼)
 * Converts full IPA text (with /.../ format) to Jyutping
 */
export function formatYueJyutping(text) {
  return text.split(/(?=\/)/g).map(segment => {
    if (segment.startsWith('/')) {
      const endSlash = segment.indexOf('/', 1);
      if (endSlash > 0) {
        const ipa = segment.substring(1, endSlash);
        const rest = segment.substring(endSlash);
        return '/' + ipaSylToJyutping(ipa) + rest;
      }
    }
    return segment;
  }).join('');
}

/**
 * Jyutping to Guangzhou final mapping
 */
function jyutpingFinalToGuangzhou(final) {
  const map = {
    'aa': 'a', 'aai': 'ai', 'aau': 'ao', 'aam': 'am', 'aan': 'an', 'aang': 'ang',
    'aap': 'ab', 'aat': 'ad', 'aak': 'ag',
    'ai': 'ei', 'au': 'eo', 'am': 'em', 'an': 'en', 'ang': 'eng',
    'ap': 'eb', 'at': 'ed', 'ak': 'eg',
    'e': 'é', 'ei': 'éi', 'eu': 'éo', 'em': 'ém', 'en': 'én', 'eng': 'éng',
    'ep': 'éb', 'et': 'éd', 'ek': 'ég',
    'i': 'i', 'iu': 'iu', 'im': 'im', 'in': 'in', 'ing': 'ing',
    'ip': 'ib', 'it': 'id', 'ik': 'ig',
    'o': 'o', 'oi': 'oi', 'ou': 'ou', 'on': 'on', 'ong': 'ong',
    'ot': 'od', 'ok': 'og',
    'u': 'u', 'ui': 'ui', 'un': 'un', 'ung': 'ung',
    'ut': 'ud', 'uk': 'ug',
    'oe': 'ê', 'oeng': 'êng', 'oek': 'ê',
    'eoi': 'êu', 'eon': 'ên', 'eot': 'êd',
    'yu': 'ü', 'yun': 'ün', 'yut': 'üd',
    'm': 'm', 'ng': 'ng'
  };
  return map[final] || final;
}

/**
 * Jyutping to Guangzhou initial mapping
 */
function jyutpingInitialToGuangzhou(init) {
  const map = {
    'b': 'b', 'p': 'p', 'm': 'm', 'f': 'f',
    'd': 'd', 't': 't', 'n': 'n', 'l': 'l',
    'g': 'g', 'k': 'k', 'ng': 'ng', 'h': 'h',
    'z': 'z', 'c': 'c', 's': 's',
    'gw': 'gu', 'kw': 'ku',
    'j': 'y', 'w': 'w'
  };
  return map[init] || init;
}

/**
 * Convert Jyutping to Guangzhou (廣拼)
 */
function jyutpingToGuangzhou(jyutping) {
  const tone = parseInt(jyutping.match(/[1-9]$/)?.[0]) || 0;
  const base = jyutping.replace(/[1-9]$/, '');

  // Extract initial
  let initial = '';
  let finalPart = base;

  const initials = ['gw', 'kw', 'ng', 'j', 'z', 'c', 's', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'w'];
  for (const init of initials) {
    if (base.startsWith(init)) {
      initial = jyutpingInitialToGuangzhou(init);
      finalPart = base.substring(init.length);
      break;
    }
  }

  const result = initial + jyutpingFinalToGuangzhou(base || finalPart);
  return tone ? result + tone : result;
}

/**
 * Jyutping to Academy (教院) mapping
 */
function jyutpingFinalToAcademy(final) {
  const map = {
    'aa': 'aa', 'aai': 'aai', 'aau': 'aau', 'aam': 'aam', 'aan': 'aan', 'aang': 'aang',
    'aap': 'aap', 'aat': 'aat', 'aak': 'aak',
    'ai': 'ai', 'au': 'au', 'am': 'am', 'an': 'an', 'ang': 'ang',
    'ap': 'ap', 'at': 'at', 'ak': 'ak',
    'e': 'e', 'ei': 'ei', 'eu': 'eu', 'em': 'em', 'en': 'en', 'eng': 'eng',
    'ep': 'ep', 'et': 'et', 'ek': 'ek',
    'i': 'i', 'iu': 'iu', 'im': 'im', 'in': 'in', 'ing': 'ing',
    'ip': 'ip', 'it': 'it', 'ik': 'ik',
    'o': 'o', 'oi': 'oi', 'ou': 'ou', 'on': 'on', 'ong': 'ong',
    'ot': 'ot', 'ok': 'ok',
    'u': 'u', 'ui': 'ui', 'un': 'un', 'ung': 'ung',
    'ut': 'ut', 'uk': 'uk',
    'oe': 'oe', 'oeng': 'oeng', 'oek': 'oek',
    'eoi': 'oey', 'eon': 'oen', 'eot': 'oet',
    'yu': 'y', 'yun': 'yn', 'yut': 'yt',
    'm': 'm', 'ng': 'ng'
  };
  return map[final] || final;
}

function jyutpingInitialToAcademy(init) {
  const map = {
    'b': 'b', 'p': 'p', 'm': 'm', 'f': 'f',
    'd': 'd', 't': 't', 'n': 'n', 'l': 'l',
    'g': 'g', 'k': 'k', 'ng': 'ng', 'h': 'h',
    'z': 'dz', 'c': 'ts', 's': 's',
    'gw': 'gw', 'kw': 'kw',
    'j': 'j', 'w': 'w'
  };
  return map[init] || init;
}

function jyutpingToAcademy(jyutping) {
  const tone = parseInt(jyutping.match(/[1-9]$/)?.[0]) || 0;
  const base = jyutping.replace(/[1-9]$/, '');

  let initial = '';
  let finalPart = base;

  const initials = ['gw', 'kw', 'ng', 'j', 'z', 'c', 's', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'w'];
  for (const init of initials) {
    if (base.startsWith(init)) {
      initial = jyutpingInitialToAcademy(init);
      finalPart = base.substring(init.length);
      break;
    }
  }

  const result = initial + jyutpingFinalToAcademy(base || finalPart);
  return tone ? result + tone : result;
}

/**
 * Jyutping to Yale (耶魯) mapping
 */
function jyutpingFinalToYale(final) {
  const map = {
    'aa': 'a', 'aai': 'aai', 'aau': 'aau', 'aam': 'aam', 'aan': 'aan', 'aang': 'aang',
    'aap': 'aap', 'aat': 'aat', 'aak': 'aak',
    'ai': 'ai', 'au': 'au', 'am': 'am', 'an': 'an', 'ang': 'ang',
    'ap': 'ap', 'at': 'at', 'ak': 'ak',
    'e': 'e', 'ei': 'ei', 'eu': 'eu', 'em': 'em', 'en': 'en', 'eng': 'eng',
    'ep': 'ep', 'et': 'et', 'ek': 'ek',
    'i': 'i', 'iu': 'iu', 'im': 'im', 'in': 'in', 'ing': 'ing',
    'ip': 'ip', 'it': 'it', 'ik': 'ik',
    'o': 'oh', 'oi': 'oi', 'ou': 'ou', 'on': 'on', 'ong': 'ong',
    'ot': 'ot', 'ok': 'ok',
    'u': 'u', 'ui': 'ui', 'un': 'un', 'ung': 'ung',
    'ut': 'ut', 'uk': 'uk',
    'oe': 'eu', 'oeng': 'eung', 'oek': 'euk',
    'eoi': 'eui', 'eon': 'eun', 'eot': 'eut',
    'yu': 'yu', 'yun': 'yun', 'yut': 'yut',
    'm': 'm', 'ng': 'ng'
  };
  return map[final] || final;
}

function jyutpingInitialToYale(init) {
  const map = {
    'b': 'b', 'p': 'p', 'm': 'm', 'f': 'f',
    'd': 'd', 't': 't', 'n': 'n', 'l': 'l',
    'g': 'g', 'k': 'k', 'ng': 'ng', 'h': 'h',
    'z': 'j', 'c': 'ch', 's': 's',
    'gw': 'gw', 'kw': 'kw',
    'j': 'y', 'w': 'w'
  };
  return map[init] || init;
}

function jyutpingToYale(jyutping) {
  const tone = parseInt(jyutping.match(/[1-9]$/)?.[0]) || 0;
  const base = jyutping.replace(/[1-9]$/, '');

  let initial = '';
  let finalPart = base;

  const initials = ['gw', 'kw', 'ng', 'j', 'z', 'c', 's', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'w'];
  for (const init of initials) {
    if (base.startsWith(init)) {
      initial = jyutpingInitialToYale(init);
      finalPart = base.substring(init.length);
      break;
    }
  }

  let result = initial + jyutpingFinalToYale(base || finalPart);

  // Add Yale tone marks
  if (tone) {
    if (tone === 1) result = result.replace(/^(.*?)([aeiouüêœ])/i, '$1ā');
    else if (tone === 2) result = result.replace(/^(.*?)([aeiouüêœ])/i, '$1á');
    else if (tone === 3) result = result.replace(/^(.*?)([aeiouüêœ])/i, '$1a');
    else if (tone === 4) result = result.replace(/^(.*?)([aeiouüêœ])/i, '$1à') + 'h';
    else if (tone === 5) result = result.replace(/^(.*?)([aeiouüêœ])/i, '$1á') + 'h';
    else if (tone === 6) result = result.replace(/^(.*?)([aeiouüêœ])/i, '$1à') + 'h';
  }

  return result;
}

/**
 * Jyutping to Liu (劉錫祥) mapping
 */
function jyutpingFinalToLiu(final) {
  const map = {
    'aa': 'a', 'aai': 'aai', 'aau': 'aau', 'aam': 'aam', 'aan': 'aan', 'aang': 'aang',
    'aap': 'aap', 'aat': 'aat', 'aak': 'aak',
    'ai': 'ai', 'au': 'au', 'am': 'am', 'an': 'an', 'ang': 'ang',
    'ap': 'ap', 'at': 'at', 'ak': 'ak',
    'e': 'e', 'ei': 'ei', 'eu': 'eu', 'em': 'em', 'en': 'en', 'eng': 'eng',
    'ep': 'ep', 'et': 'et', 'ek': 'ek',
    'i': 'i', 'iu': 'iu', 'im': 'im', 'in': 'in', 'ing': 'ing',
    'ip': 'ip', 'it': 'it', 'ik': 'ik',
    'o': 'o', 'oi': 'oi', 'ou': 'o', 'on': 'on', 'ong': 'ong',
    'ot': 'ot', 'ok': 'ok',
    'u': 'oo', 'ui': 'ooi', 'un': 'oon', 'ung': 'ung',
    'ut': 'oot', 'uk': 'uk',
    'oe': 'euh', 'oeng': 'eung', 'oek': 'euk',
    'eoi': 'ui', 'eon': 'un', 'eot': 'ut',
    'yu': 'ue', 'yun': 'uen', 'yut': 'uet',
    'm': 'm', 'ng': 'ng'
  };
  return map[final] || final;
}

function jyutpingInitialToLiu(init) {
  const map = {
    'b': 'b', 'p': 'p', 'm': 'm', 'f': 'f',
    'd': 'd', 't': 't', 'n': 'n', 'l': 'l',
    'g': 'g', 'k': 'k', 'ng': 'ng', 'h': 'h',
    'z': 'j', 'c': 'ch', 's': 's',
    'gw': 'gw', 'kw': 'kw',
    'j': 'y', 'w': 'w'
  };
  return map[init] || init;
}

function jyutpingToLiu(jyutping) {
  const tone = parseInt(jyutping.match(/[1-9]$/)?.[0]) || 0;
  const base = jyutping.replace(/[1-9]$/, '');

  let initial = '';
  let finalPart = base;

  const initials = ['gw', 'kw', 'ng', 'j', 'z', 'c', 's', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'w'];
  for (const init of initials) {
    if (base.startsWith(init)) {
      initial = jyutpingInitialToLiu(init);
      finalPart = base.substring(init.length);
      break;
    }
  }

  const result = initial + jyutpingFinalToLiu(base || finalPart);
  return tone ? result + tone : result;
}

/**
 * Format Cantonese with multi-scheme output
 * Order: IPA org → IPA num → 粵拼 → 廣拼 → 教院 → 耶魯 → 劉錫祥
 */
export function formatYueOutput(text, options = {}) {
  const IPA_org = document.getElementById('IPA_org');
  const IPA_num = document.getElementById('IPA_num');
  const Jyutping = document.getElementById('Jyutping');
  const Guangzhou = document.getElementById('Guangzhou');
  const Academy = document.getElementById('Academy');
  const Yale = document.getElementById('Yale');
  const Liu = document.getElementById('Liu');

  // 1. IPA (original) - 最原始，從 DATA 直接轉換
  if (IPA_org && IPA_org.checked) {
    return formatIPA_org(text);
  }
  // 2. IPA 數字 - 純粹把音標轉為數字
  if (IPA_num && IPA_num.checked) {
    return formatIPA_num(text);
  }
  // 3. 粵拼
  if (Jyutping && Jyutping.checked) {
    return formatYueJyutping(text);
  }
  // 4. 廣拼
  if (Guangzhou && Guangzhou.checked) {
    return formatYueGuangzhou(text);
  }
  // 5. 教院
  if (Academy && Academy.checked) {
    return formatYueAcademy(text);
  }
  // 6. 耶魯
  if (Yale && Yale.checked) {
    return formatYueYale(text);
  }
  // 7. 劉錫祥
  if (Liu && Liu.checked) {
    return formatYueLiu(text);
  }

  // Default: IPA org
  return formatIPA_org(text);
}

/**
 * Format Cantonese to Guangzhou (廣拼)
 */
export function formatYueGuangzhou(text) {
  const jyutping = formatYueJyutping(text);
  return jyutping.split(/(?=\/)/g).map(segment => {
    if (segment.startsWith('/')) {
      const endSlash = segment.indexOf('/', 1);
      if (endSlash > 0) {
        const jp = segment.substring(1, endSlash);
        const rest = segment.substring(endSlash);
        return '/' + jyutpingToGuangzhou(jp) + rest;
      }
    }
    return segment;
  }).join('');
}

/**
 * Format Cantonese to Academy (教院)
 */
export function formatYueAcademy(text) {
  const jyutping = formatYueJyutping(text);
  return jyutping.split(/(?=\/)/g).map(segment => {
    if (segment.startsWith('/')) {
      const endSlash = segment.indexOf('/', 1);
      if (endSlash > 0) {
        const jp = segment.substring(1, endSlash);
        const rest = segment.substring(endSlash);
        return '/' + jyutpingToAcademy(jp) + rest;
      }
    }
    return segment;
  }).join('');
}

/**
 * Format Cantonese to Yale (耶魯)
 */
export function formatYueYale(text) {
  const jyutping = formatYueJyutping(text);
  return jyutping.split(/(?=\/)/g).map(segment => {
    if (segment.startsWith('/')) {
      const endSlash = segment.indexOf('/', 1);
      if (endSlash > 0) {
        const jp = segment.substring(1, endSlash);
        const rest = segment.substring(endSlash);
        return '/' + jyutpingToYale(jp) + rest;
      }
    }
    return segment;
  }).join('');
}

/**
 * Format Cantonese to Liu (劉錫祥)
 */
export function formatYueLiu(text) {
  const jyutping = formatYueJyutping(text);
  return jyutping.split(/(?=\/)/g).map(segment => {
    if (segment.startsWith('/')) {
      const endSlash = segment.indexOf('/', 1);
      if (endSlash > 0) {
        const jp = segment.substring(1, endSlash);
        const rest = segment.substring(endSlash);
        return '/' + jyutpingToLiu(jp) + rest;
      }
    }
    return segment;
  }).join('');
}
