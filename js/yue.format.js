/**
 * Cantonese Format Utilities
 * Direct conversion from IPA to various Cantonese romanization schemes
 * All formats convert directly from IPA without intermediate Jyutping conversion
 */

// Tone number mapping from IPA patterns
const TONE_MAP = {
  // Entering tones
  'k˥': '7', 't˥': '7', 'p˥': '7',
  'k˧': '8', 't˧': '8', 'p˧': '8',
  'k˨': '9', 't˨': '9', 'p˨': '9',
  // Level tones
  '˥˧': '1', '˥˥': '1',
  '˧˥': '2',
  '˧˧': '3', '˧': '3',
  '˨˩': '4', '˩˩': '4',
  '˩˧': '5', '˨˧': '5',
  '˨˨': '6', '˨': '6'
};

// IPA to each scheme mapping
const IPA_TO_SCHEME = {
  jyutping: {
    // Finals
    'a:': 'aa', 'a:i': 'aai', 'a:u': 'aau', 'a:m': 'aam', 'a:n': 'aan', 'a:ŋ': 'aang',
    'a:p': 'aap', 'a:t': 'aat', 'a:k': 'aak',
    'ɐi': 'ai', 'ɐu': 'au', 'ɐm': 'am', 'ɐn': 'an', 'ɐŋ': 'ang',
    'ɐp': 'ap', 'ɐt': 'at', 'ɐk': 'ak',
    'ɛ:': 'e', 'ei': 'ei', 'ɛ:u': 'eu', 'ɛ:m': 'em', 'ɛ:n': 'en', 'ɛ:ŋ': 'eng',
    'ɛ:p': 'ep', 'ɛ:t': 'et', 'ɛ:k': 'ek',
    'i:': 'i', 'i:u': 'iu', 'i:m': 'im', 'i:n': 'in', 'i:p': 'ip', 'i:t': 'it', 'ɪŋ': 'ing', 'ɪk': 'ik',
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
    'kʷ': 'gw', 'kʷʰ': 'kw', 'j': 'j', 'w': 'w', 'ʔ': ''
  },
  guangzhou: {
    'a:': 'a', 'a:i': 'ai', 'a:u': 'ao', 'a:m': 'am', 'a:n': 'an', 'a:ŋ': 'ang',
    'a:p': 'ab', 'a:t': 'ad', 'a:k': 'ag',
    'ɐi': 'ei', 'ɐu': 'eo', 'ɐm': 'em', 'ɐn': 'en', 'ɐŋ': 'eng',
    'ɐp': 'eb', 'ɐt': 'ed', 'ɐk': 'eg',
    'ɛ:': 'é', 'ei': 'éi', 'ɛ:u': 'éo', 'ɛ:m': 'ém', 'ɛ:n': 'én', 'ɛ:ŋ': 'éng',
    'ɛ:p': 'éb', 'ɛ:t': 'éd', 'ɛ:k': 'ég',
    'i:': 'i', 'i:u': 'iu', 'i:m': 'im', 'i:n': 'in', 'i:p': 'ib', 'i:t': 'id', 'ɪŋ': 'ig', 'ɪk': 'ig',
    'ɔ:': 'o', 'ɔ:i': 'oi', 'ou': 'ou', 'ɔ:n': 'on', 'ɔ:ŋ': 'ong',
    'ɔ:t': 'od', 'ɔ:k': 'og',
    'u:': 'u', 'u:i': 'ui', 'u:n': 'un', 'u:t': 'ud',
    'ʊŋ': 'ung', 'ʊk': 'ug',
    'œ:': 'ê', 'œ:ŋ': 'êng', 'œ:k': 'ê', 'œ:t': 'êd',
    'ɵy': 'êu', 'ɵn': 'ên', 'ɵt': 'êd',
    'y:': 'ü', 'y:n': 'ün', 'y:t': 'üd',
    'm̩': 'm', 'ŋ̩': 'ng',
    'p': 'b', 'pʰ': 'p', 'm': 'm', 'f': 'f',
    't': 'd', 'tʰ': 't', 'n': 'n', 'l': 'l',
    'k': 'g', 'kʰ': 'k', 'ŋ': 'ng', 'h': 'h',
    'ts': 'z', 'tsʰ': 'c', 's': 's',
    'kʷ': 'gu', 'kʷʰ': 'ku', 'j': 'y', 'w': 'w', 'ʔ': ''
  },
  academy: {
    'a:': 'aa', 'a:i': 'aai', 'a:u': 'aau', 'a:m': 'aam', 'a:n': 'aan', 'a:ŋ': 'aang',
    'a:p': 'aap', 'a:t': 'aat', 'a:k': 'aak',
    'ɐi': 'ai', 'ɐu': 'au', 'ɐm': 'am', 'ɐn': 'an', 'ɐŋ': 'ang',
    'ɐp': 'ap', 'ɐt': 'at', 'ɐk': 'ak',
    'ɛ:': 'e', 'ei': 'ei', 'ɛ:u': 'eu', 'ɛ:m': 'em', 'ɛ:n': 'en', 'ɛ:ŋ': 'eng',
    'ɛ:p': 'ep', 'ɛ:t': 'et', 'ɛ:k': 'ek',
    'i:': 'i', 'i:u': 'iu', 'i:m': 'im', 'i:n': 'in', 'i:p': 'ip', 'i:t': 'it', 'ɪŋ': 'ing', 'ɪk': 'ik',
    'ɔ:': 'o', 'ɔ:i': 'oi', 'ou': 'ou', 'ɔ:n': 'on', 'ɔ:ŋ': 'ong',
    'ɔ:t': 'ot', 'ɔ:k': 'ok',
    'u:': 'u', 'u:i': 'ui', 'u:n': 'un', 'u:t': 'ut',
    'ʊŋ': 'ung', 'ʊk': 'uk',
    'œ:': 'oe', 'œ:ŋ': 'oeng', 'œ:k': 'oek', 'œ:t': 'oet',
    'ɵy': 'oey', 'ɵn': 'oen', 'ɵt': 'oet',
    'y:': 'y', 'y:n': 'yn', 'y:t': 'yt',
    'm̩': 'm', 'ŋ̩': 'ng',
    'p': 'b', 'pʰ': 'p', 'm': 'm', 'f': 'f',
    't': 'd', 'tʰ': 't', 'n': 'n', 'l': 'l',
    'k': 'g', 'kʰ': 'k', 'ŋ': 'ng', 'h': 'h',
    'ts': 'dz', 'tsʰ': 'ts', 's': 's',
    'kʷ': 'gw', 'kʷʰ': 'kw', 'j': 'j', 'w': 'w', 'ʔ': ''
  },
  yale: {
    'a:': 'a', 'a:i': 'aai', 'a:u': 'aau', 'a:m': 'aam', 'a:n': 'aan', 'a:ŋ': 'aang',
    'a:p': 'aap', 'a:t': 'aat', 'a:k': 'aak',
    'ɐi': 'ai', 'ɐu': 'au', 'ɐm': 'am', 'ɐn': 'an', 'ɐŋ': 'ang',
    'ɐp': 'ap', 'ɐt': 'at', 'ɐk': 'ak',
    'ɛ:': 'e', 'ei': 'ei', 'ɛ:u': 'eu', 'ɛ:m': 'em', 'ɛ:n': 'en', 'ɛ:ŋ': 'eng',
    'ɛ:p': 'ep', 'ɛ:t': 'et', 'ɛ:k': 'ek',
    'i:': 'i', 'i:u': 'iu', 'i:m': 'im', 'i:n': 'in', 'i:p': 'ip', 'i:t': 'it', 'ɪŋ': 'ing', 'ɪk': 'ik',
    'ɔ:': 'oh', 'ɔ:i': 'oi', 'ou': 'ou', 'ɔ:n': 'on', 'ɔ:ŋ': 'ong',
    'ɔ:t': 'ot', 'ɔ:k': 'ok',
    'u:': 'u', 'u:i': 'ui', 'u:n': 'un', 'u:t': 'ut',
    'ʊŋ': 'ung', 'ʊk': 'uk',
    'œ:': 'eu', 'œ:ŋ': 'eung', 'œ:k': 'euk', 'œ:t': 'eut',
    'ɵy': 'eui', 'ɵn': 'eun', 'ɵt': 'eut',
    'y:': 'yu', 'y:n': 'yun', 'y:t': 'yut',
    'm̩': 'm', 'ŋ̩': 'ng',
    'p': 'b', 'pʰ': 'p', 'm': 'm', 'f': 'f',
    't': 'd', 'tʰ': 't', 'n': 'n', 'l': 'l',
    'k': 'g', 'kʰ': 'k', 'ŋ': 'ng', 'h': 'h',
    'ts': 'j', 'tsʰ': 'ch', 's': 's',
    'kʷ': 'gw', 'kʷʰ': 'kw', 'j': 'y', 'w': 'w', 'ʔ': ''
  },
  liu: {
    'a:': 'a', 'a:i': 'aai', 'a:u': 'aau', 'a:m': 'aam', 'a:n': 'aan', 'a:ŋ': 'aang',
    'a:p': 'aap', 'a:t': 'aat', 'a:k': 'aak',
    'ɐi': 'ai', 'ɐu': 'au', 'ɐm': 'am', 'ɐn': 'an', 'ɐŋ': 'ang',
    'ɐp': 'ap', 'ɐt': 'at', 'ɐk': 'ak',
    'ɛ:': 'e', 'ei': 'ei', 'ɛ:u': 'eu', 'ɛ:m': 'em', 'ɛ:n': 'en', 'ɛ:ŋ': 'eng',
    'ɛ:p': 'ep', 'ɛ:t': 'et', 'ɛ:k': 'ek',
    'i:': 'i', 'i:u': 'iu', 'i:m': 'im', 'i:n': 'in', 'i:p': 'ip', 'i:t': 'it', 'ɪŋ': 'ing', 'ɪk': 'ik',
    'ɔ:': 'o', 'ɔ:i': 'oi', 'ou': 'o', 'ɔ:n': 'on', 'ɔ:ŋ': 'ong',
    'ɔ:t': 'ot', 'ɔ:k': 'ok',
    'u:': 'oo', 'u:i': 'ooi', 'u:n': 'oon', 'u:t': 'oot',
    'ʊŋ': 'ung', 'ʊk': 'uk',
    'œ:': 'euh', 'œ:ŋ': 'eung', 'œ:k': 'euk', 'œ:t': 'eut',
    'ɵy': 'ui', 'ɵn': 'un', 'ɵt': 'ut',
    'y:': 'ue', 'y:n': 'uen', 'y:t': 'uet',
    'm̩': 'm', 'ŋ̩': 'ng',
    'p': 'b', 'pʰ': 'p', 'm': 'm', 'f': 'f',
    't': 'd', 'tʰ': 't', 'n': 'n', 'l': 'l',
    'k': 'g', 'kʰ': 'k', 'ŋ': 'ng', 'h': 'h',
    'ts': 'j', 'tsʰ': 'ch', 's': 's',
    'kʷ': 'gw', 'kʷʰ': 'kw', 'j': 'y', 'w': 'w', 'ʔ': ''
  }
};

// IPA initials order for parsing (longest first)
const IPA_INITIALS = ['kʷʰ', 'kʷ', 'tsʰ', 'ts', 'pʰ', 'tʰ', 'kʰ', 'ŋ', 'k', 'm', 'f', 'n', 'l', 'h', 's', 'j', 'w', 'p', 'd', 'g'];

// Entering tone consonants
const ENTERING_CONSONANTS = ['k', 't', 'p'];

/**
 * Extract tone number from IPA string
 */
function getTone(ipa) {
  // Check entering tones first
  for (const consonant of ENTERING_CONSONANTS) {
    if (ipa.includes(consonant + '˥')) return '7';
    if (ipa.includes(consonant + '˧')) return '8';
    if (ipa.includes(consonant + '˨')) return '9';
  }
  // Check normal tones
  if (ipa.includes('˥˧') || ipa.includes('˥˥')) return '1';
  if (ipa.includes('˧˥')) return '2';
  if (ipa.includes('˧')) return '3';
  if (ipa.includes('˨˩') || ipa.includes('˩˩')) return '4';
  if (ipa.includes('˩˧') || ipa.includes('˨˧')) return '5';
  if (ipa.includes('˨˨') || ipa.includes('˨')) return '6';
  return '';
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
 * Check if IPA has entering tone endings
 */
function isEnteringTone(ipa) {
  return /k˥|k˧|k˨|t˥|t˧|t˨|p˥|p˧|p˨/.test(ipa);
}

/**
 * Convert single IPA syllable to target scheme
 */
function ipaSylToScheme(ipa, scheme) {
  const base = removeTones(ipa);
  const map = IPA_TO_SCHEME[scheme];

  // Try direct lookup first
  if (map[base]) {
    let result = map[base];
    if (isEnteringTone(ipa)) {
      result += getTone(ipa);
    } else {
      const tone = getTone(ipa);
      if (tone) result += tone;
    }
    return result;
  }

  // Decompose into initial + final
  let initial = '';
  let finalPart = base;

  for (const init of IPA_INITIALS) {
    if (base.startsWith(init)) {
      initial = map[init] || '';
      finalPart = base.substring(init.length);
      break;
    }
  }

  const finalResult = map[finalPart] || finalPart;
  let result = initial + finalResult;

  if (isEnteringTone(ipa)) {
    result += getTone(ipa);
  } else {
    const tone = getTone(ipa);
    if (tone) result += tone;
  }

  return result;
}

/**
 * Process text segments in /.../ format
 */
function processSegments(text, scheme) {
  return text.split(/(?=\/)/g).map(segment => {
    if (segment.startsWith('/')) {
      const endSlash = segment.indexOf('/', 1);
      if (endSlash > 1) {
        const content = segment.substring(1, endSlash);
        const rest = segment.substring(endSlash);
        return '/' + ipaSylToScheme(content, scheme) + rest;
      } else if (endSlash === -1) {
        const content = segment.substring(1);
        return '/' + ipaSylToScheme(content, scheme);
      }
    }
    return segment;
  }).join('');
}

// ============================================
// Public API - Direct IPA to Scheme Conversion
// ============================================

export function formatYueJyutping(text) {
  return processSegments(text, 'jyutping');
}

export function formatYueGuangzhou(text) {
  return processSegments(text, 'guangzhou');
}

export function formatYueAcademy(text) {
  return processSegments(text, 'academy');
}

export function formatYueYale(text) {
  return processSegments(text, 'yale');
}

export function formatYueLiu(text) {
  return processSegments(text, 'liu');
}

// ============================================
// Legacy Functions (for backward compatibility)
// ============================================

export function formatIPA_num(text) {
  return text.replace(/˥/g, "5").replace(/˧/g, "3").replace(/˨/g, "2").replace(/˩/g, "1");
}

export function formatIPA_org(text) {
  return text;
}

export function formatJyutpingCantonese(text) {
  return text
    .replace(/˥˧/g, "1").replace(/˥˥/g, "1")
    .replace(/˧˥/g, "2")
    .replace(/˧˧/g, "3").replace(/˧/g, "3")
    .replace(/˨˩/g, "4").replace(/˩˩/g, "4")
    .replace(/˩˧/g, "5").replace(/˨˧/g, "5")
    .replace(/˨˨/g, "6")
    .replace(/k˥/g, "k7").replace(/k˧/g, "k8").replace(/k˨/g, "k9")
    .replace(/t˥/g, "t7").replace(/t˧/g, "t8").replace(/t˨/g, "t9")
    .replace(/p˥/g, "p7").replace(/p˧/g, "p8").replace(/p˨/g, "p9")
    .replace(/˥/g, "1").replace(/˨/g, "6");
}

export function formatJyutpingMandarin(text) {
  return text
    .replace(/˥˥/g, "ˉ").replace(/˧˥/g, "ˊ")
    .replace(/˨˩˦/g, "ˇ").replace(/˨˩˩/g, "ˇ")
    .replace(/˥˩/g, "ˋ").replace(/˥˧/g, "ˋ")
    .replace(/˨˩/g, "˙").replace(/˧˩/g, "˙").replace(/˦˩/g, "˙").replace(/˩˩/g, "˙")
    .replace(/˧/g, "˙");
}

export const formatJyutping = formatJyutpingCantonese;

export function formatJyutping_num(text) {
  return formatJyutpingCantonese(text)
    .replace(/ˉ/g, "1").replace(/ˊ/g, "2").replace(/ˇ/g, "3")
    .replace(/ˋ/g, "4").replace(/˙/g, "5");
}

export function formatJyutpingMandarinNum(text) {
  return formatJyutpingMandarin(text)
    .replace(/ˉ/g, "1").replace(/ˊ/g, "2").replace(/ˇ/g, "3")
    .replace(/ˋ/g, "4");
}

export function formatVietnamese(text) {
  return text
    .replace(/˧˥/g, "5").replace(/˧/g, "3").replace(/˨˩/g, "4").replace(/˩/g, "1")
    .replace(/˧˧/g, "3").replace(/˦˥/g, "6").replace(/˦/g, "4")
    .replace(/˧˩/g, "4").replace(/˨˧/g, "5").replace(/˥/g, "1");
}

// ============================================
// DOM-based Output Functions
// ============================================

export function formatYueOutput(text, options = {}) {
  const IPA_org = document.getElementById('IPA_org');
  const IPA_num = document.getElementById('IPA_num');
  const Jyutping = document.getElementById('Jyutping');
  const Guangzhou = document.getElementById('Guangzhou');
  const Academy = document.getElementById('Academy');
  const Yale = document.getElementById('Yale');
  const Liu = document.getElementById('Liu');

  if (IPA_org && IPA_org.checked) return formatIPA_org(text);
  if (IPA_num && IPA_num.checked) return formatIPA_num(text);
  if (Jyutping && Jyutping.checked) return formatYueJyutping(text);
  if (Guangzhou && Guangzhou.checked) return formatYueGuangzhou(text);
  if (Academy && Academy.checked) return formatYueAcademy(text);
  if (Yale && Yale.checked) return formatYueYale(text);
  if (Liu && Liu.checked) return formatYueLiu(text);
  return formatIPA_org(text);
}

export function formatMandarinOutput(text, options = {}) {
  const IPA_num = document.getElementById('IPA_num');
  const IPA_org = document.getElementById('IPA_org');
  const Jyutping = document.getElementById('Jyutping');
  const Jyutping_num = document.getElementById('Jyutping_num');

  if (IPA_num && IPA_num.checked) return formatIPA_num(text);
  if (IPA_org && IPA_org.checked) return formatIPA_org(text);
  if (Jyutping_num && Jyutping_num.checked) return formatJyutpingMandarinNum(text);
  if (Jyutping && Jyutping.checked) return formatJyutpingMandarin(text);
  return formatIPA_org(text);
}

export function formatVietnameseOutput(text, options = {}) {
  const IPA_num = document.getElementById('IPA_num');
  const IPA_org = document.getElementById('IPA_org');

  if (IPA_num && IPA_num.checked) return formatVietnamese(text);
  if (IPA_org && IPA_org.checked) return formatIPA_org(text);
  return formatIPA_org(text);
}
