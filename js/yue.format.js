/**
 * Cantonese Format Utilities
 * Direct conversion from IPA to various Cantonese romanization schemes
 */

// IPA initials - ordered from longest to shortest for proper matching
export const IPA_INITIALS = ['kʷʰ', 'kʷ', 'tsʰ', 'ts', 'pʰ', 'tʰ', 'kʰ', 'ŋ', 'k', 'm', 'f', 'n', 'l', 'h', 's', 'w', 'j', 't', 'p', 'd', 'g'];

// Tone Unicode characters
const TONE_5 = '\u02e5';  // ˥ high level
const TONE_3 = '\u02e7';  // ˧ mid level
const TONE_2 = '\u02e8';  // ˨ low level
const TONE_1 = '\u02e9';  // ˩ low level

/**
 * Extract tone number from IPA string
 * Returns '1', '2', '3', '4', '5', '6', or ''
 */
function getTone(ipa) {
  // Check for ˧ first (mid tone, = 3) - before multi-char patterns
  if (ipa.includes('k' + TONE_3) || ipa.includes('t' + TONE_3) || ipa.includes('p' + TONE_3)) {
    return '3';  // 下陰入
  }
  if (ipa.includes('k' + TONE_5) || ipa.includes('t' + TONE_5) || ipa.includes('p' + TONE_5)) {
    return '1';  // 上陰入
  }
  if (ipa.includes('k' + TONE_2) || ipa.includes('t' + TONE_2) || ipa.includes('p' + TONE_2)) {
    return '6';  // 陽入
  }

  // Multi-character tone patterns (check longest first)
  if (ipa.includes(TONE_5 + TONE_3)) return '1';  // 陰平 53
  if (ipa.includes(TONE_5 + TONE_5)) return '1';  // 陰平 55
  if (ipa.includes(TONE_3 + TONE_5)) return '2';  // 陰上 35
  if (ipa.includes(TONE_3 + TONE_3)) return '3';  // 陰去 33
  if (ipa.includes(TONE_2 + TONE_1) || ipa.includes(TONE_1 + TONE_1)) return '4';  // 陽平 21/11
  if (ipa.includes(TONE_1 + TONE_3) || ipa.includes(TONE_2 + TONE_3)) return '5';  // 陽上 13
  if (ipa.includes(TONE_2 + TONE_2)) return '6';  // 陽去 22

  // Single tone characters (fallback - check in order of priority)
  if (ipa.includes(TONE_5)) return '1';
  if (ipa.includes(TONE_3)) return '3';
  if (ipa.includes(TONE_2)) return '6';
  if (ipa.includes(TONE_1)) return '4';

  return '';
}

/**
 * Remove tone markers from IPA string
 */
function removeTones(ipa) {
  let result = ipa;
  // Remove multi-char tones first
  result = result.replace(new RegExp(TONE_5 + TONE_3, 'g'), '');
  result = result.replace(new RegExp(TONE_5 + TONE_5, 'g'), '');
  result = result.replace(new RegExp(TONE_3 + TONE_5, 'g'), '');
  result = result.replace(new RegExp(TONE_3 + TONE_3, 'g'), '');
  result = result.replace(new RegExp(TONE_2 + TONE_1, 'g'), '');
  result = result.replace(new RegExp(TONE_1 + TONE_1, 'g'), '');
  result = result.replace(new RegExp(TONE_1 + TONE_3, 'g'), '');
  result = result.replace(new RegExp(TONE_2 + TONE_3, 'g'), '');
  result = result.replace(new RegExp(TONE_2 + TONE_2, 'g'), '');
  // Remove single tones
  result = result.replace(new RegExp(TONE_5, 'g'), '');
  result = result.replace(new RegExp(TONE_3, 'g'), '');
  result = result.replace(new RegExp(TONE_2, 'g'), '');
  result = result.replace(new RegExp(TONE_1, 'g'), '');
  // Remove tone markers after consonants
  result = result.replace(/k˥|t˥|p˥|k˧|t˧|p˧|k˨|t˨|p˨/g, '');
  return result;
}


/**
 * Normalize user-friendly IPA input
 * Converts "kw" -> "kʷ" and "kwʰ" -> "kʷʰ" for better user experience
 */
function normalizeIPA(input) {
  // Replace "kwʰ" with "kʷʰ" first (longer pattern)
  input = input.replace(/kwʰ/g, 'kʷʰ');
  // Replace "kw" with "kʷ" (but not if followed by a tone marker)
  input = input.replace(/kw(?!˥|˧|˨|˩|˥˧|˧˥|˩˧|˨˩)/g, 'kʷ');
  return input;
}

/**
 * Scheme mappings
 */
const SCHEME_MAPS = {
  jyutping: {
    initials: {
      'p': 'b', 'pʰ': 'p', 'm': 'm', 'f': 'f',
      't': 'd', 'tʰ': 't', 'n': 'n', 'l': 'l',
      'k': 'g', 'kʰ': 'k', 'ŋ': 'ng', 'h': 'h',
      'ts': 'z', 'tsʰ': 'c', 's': 's',
      'kʷ': 'gw', 'kʷʰ': 'kw', 'j': 'j', 'w': 'w', 'ʔ': ''
    },
    vowels: {
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
      'm̩': 'm', 'ŋ̩': 'ng'
    }
  },

  guangzhou: {
    initials: {
      'p': 'b', 'pʰ': 'p', 'm': 'm', 'f': 'f',
      't': 'd', 'tʰ': 't', 'n': 'n', 'l': 'l',
      'k': 'g', 'kʰ': 'k', 'ŋ': 'ng', 'h': 'h',
      'ts': 'z', 'tsʰ': 'c', 's': 's',
      'kʷ': 'gu', 'kʷʰ': 'ku', 'j': 'y', 'w': 'w', 'ʔ': ''
    },
    vowels: {
      'a:': 'a', 'a:i': 'ai', 'a:u': 'ao', 'a:m': 'am', 'a:n': 'an', 'a:ŋ': 'ang',
      'a:p': 'ab', 'a:t': 'ad', 'a:k': 'ag',
      'ɐi': 'ei', 'ɐu': 'eo', 'ɐm': 'em', 'ɐn': 'en', 'ɐŋ': 'eng',
      'ɐp': 'eb', 'ɐt': 'ed', 'ɐk': 'eg',
      'ɛ:': 'é', 'ei': 'éi', 'ɛ:u': 'éo', 'ɛ:m': 'ém', 'ɛ:n': 'én', 'ɛ:ŋ': 'éng',
      'ɛ:p': 'éb', 'ɛ:t': 'éd', 'ɛ:k': 'ég',
      'i:': 'i', 'i:u': 'iu', 'i:m': 'im', 'i:n': 'in', 'i:p': 'ib', 'i:t': 'id',
      'ɪŋ': 'ing', 'ɪk': 'ig',
      'ɔ:': 'o', 'ɔ:i': 'oi', 'ou': 'ou', 'ɔ:n': 'on', 'ɔ:ŋ': 'ong',
      'ɔ:t': 'od', 'ɔ:k': 'og',
      'u:': 'u', 'u:i': 'ui', 'u:n': 'un', 'u:t': 'ud',
      'ʊŋ': 'ung', 'ʊk': 'ug',
      'œ:': 'ê', 'œ:ŋ': 'êng', 'œ:k': 'êg', 'œ:t': '-',
      'ɵy': 'êu', 'ɵn': 'ên', 'ɵt': 'êd',
      'y:': 'ü', 'y:n': 'ün', 'y:t': 'üd',
      'm̩': 'm', 'ŋ̩': 'ng'
    }
  },

  academy: {
    initials: {
      'p': 'b', 'pʰ': 'p', 'm': 'm', 'f': 'f',
      't': 'd', 'tʰ': 't', 'n': 'n', 'l': 'l',
      'k': 'g', 'kʰ': 'k', 'ŋ': 'ng', 'h': 'h',
      'ts': 'dz', 'tsʰ': 'ts', 's': 's',
      'kʷ': 'gw', 'kʷʰ': 'kw', 'j': 'j', 'w': 'w', 'ʔ': ''
    },
    vowels: {
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
      'ɵy': 'oey', 'ɵn': 'oen', 'ɵt': 'oet',
      'y:': 'y', 'y:n': 'yn', 'y:t': 'yt',
      'm̩': 'm', 'ŋ̩': 'ng'
    }
  },

  yale: {
    initials: {
      'p': 'b', 'pʰ': 'p', 'm': 'm', 'f': 'f',
      't': 'd', 'tʰ': 't', 'n': 'n', 'l': 'l',
      'k': 'g', 'kʰ': 'k', 'ŋ': 'ng', 'h': 'h',
      'ts': 'j', 'tsʰ': 'ch', 's': 's',
      'kʷ': 'gw', 'kʷʰ': 'kw', 'j': 'y', 'w': 'w', 'ʔ': ''
    },
    vowels: {
      'a:': 'a', 'a:i': 'aai', 'a:u': 'aau', 'a:m': 'aam', 'a:n': 'aan', 'a:ŋ': 'aang',
      'a:p': 'aap', 'a:t': 'aat', 'a:k': 'aak',
      'ɐi': 'ai', 'ɐu': 'au', 'ɐm': 'am', 'ɐn': 'an', 'ɐŋ': 'ang',
      'ɐp': 'ap', 'ɐt': 'at', 'ɐk': 'ak',
      'ɛ:': 'e', 'ei': 'ei', 'ɛ:u': 'eu', 'ɛ:m': 'em', 'ɛ:n': 'en', 'ɛ:ŋ': 'eng',
      'ɛ:p': 'ep', 'ɛ:t': 'et', 'ɛ:k': 'ek',
      'i:': 'i', 'i:u': 'iu', 'i:m': 'im', 'i:n': 'in', 'i:p': 'ip', 'i:t': 'it',
      'ɪŋ': 'ing', 'ɪk': 'ik',
      'ɔ:': 'o',
      'ɔ:i': 'oi', 'ou': 'ou', 'ɔ:n': 'on', 'ɔ:ŋ': 'ong',
      'ɔ:t': 'ot', 'ɔ:k': 'ok',
      'u:': 'u', 'u:i': 'ui', 'u:n': 'un', 'u:t': 'ut',
      'ʊŋ': 'ung', 'ʊk': 'uk',
      'œ:': 'eu', 'œ:ŋ': 'eung', 'œ:k': 'euk', 'œ:t': 'eut',
      'ɵy': 'eui', 'ɵn': 'eun', 'ɵt': 'eut',
      'y:': 'yu', 'y:n': 'yun', 'y:t': 'yut',
      'm̩': 'm', 'ŋ̩': 'ng'
    }
  },

  liu: {
    initials: {
      'p': 'b', 'pʰ': 'p', 'm': 'm', 'f': 'f',
      't': 'd', 'tʰ': 't', 'n': 'n', 'l': 'l',
      'k': 'g', 'kʰ': 'k', 'ŋ': 'ng', 'h': 'h',
      'ts': 'j', 'tsʰ': 'ch', 's': 's',
      'kʷ': 'gw', 'kʷʰ': 'kw', 'j': 'y', 'w': 'w', 'ʔ': ''
    },
    vowels: {
      'a:': 'a', 'a:i': 'aai', 'a:u': 'aau', 'a:m': 'aam', 'a:n': 'aan', 'a:ŋ': 'aang',
      'a:p': 'aap', 'a:t': 'aat', 'a:k': 'aak',
      'ɐi': 'ai', 'ɐu': 'au', 'ɐm': 'am', 'ɐn': 'an', 'ɐŋ': 'ang',
      'ɐp': 'ap', 'ɐt': 'at', 'ɐk': 'ak',
      'ɛ:': 'e', 'ei': 'ei', 'ɛ:u': 'eu', 'ɛ:m': 'em', 'ɛ:n': 'en', 'ɛ:ŋ': 'eng',
      'ɛ:p': 'ep', 'ɛ:t': 'et', 'ɛ:k': 'ek',
      'i:': 'i', 'i:u': 'iu', 'i:m': 'im', 'i:n': 'in', 'i:p': 'ip', 'i:t': 'it',
      'ɪŋ': 'ing', 'ɪk': 'ik',
      'ɔ:': 'oh', 'ɔ:i': 'oi', 'ou': 'o', 'ɔ:n': 'on', 'ɔ:ŋ': 'ong',
      'ɔ:t': 'ot', 'ɔ:k': 'ok',
      'u:': 'oo', 'u:i': 'ooi', 'u:n': 'oon', 'u:t': 'oot',
      'ʊŋ': 'ung', 'ʊk': 'uk',
      'œ:': 'euh', 'œ:ŋ': 'eung', 'œ:k': 'euk', 'œ:t': 'eut',
      'ɵy': 'ui', 'ɵn': 'un', 'ɵt': 'ut',
      'y:': 'ue', 'y:n': 'uen', 'y:t': 'uet',
      'm̩': 'm', 'ŋ̩': 'ng'
    }
  }
};

/**
 * Convert single IPA syllable to target scheme
 */
function ipaSylToScheme(ipa, scheme) {
  const map = SCHEME_MAPS[scheme];

  // Handle space-separated syllables
  if (ipa.includes(' ')) {
    return ipa.trim().split(/\s+/).map(syl => ipaSylToScheme(syl, scheme)).join(' ');
  }

  // Extract tone first
  const tone = getTone(ipa);
  const base = removeTones(ipa);

  // Parse into initial + rest
  let initial = '';
  let rest = base;

  // First, check for syllabic nasals (m̩, ŋ̩) - they have no initial
  if (base === 'm̩' || base === 'ŋ̩' || base.startsWith('m̩') || base.startsWith('ŋ̩')) {
    // Syllabic nasal is the entire base (no separate initial)
    initial = '';
    rest = base;
  } else {
    for (const init of IPA_INITIALS) {
      if (base.startsWith(init)) {
        initial = init;
        rest = base.substring(init.length);
        break;
      }
    }
  }

  // Convert initial
  let initialResult = map.initials[initial] || '';

  // Convert vowel/final part - try exact match first, then fallback
  let finalResult = map.vowels[rest] || rest;

  // Combine and add tone
  let result = initialResult + finalResult;
  if (tone) {
    result += tone;
  }

  return result;
}

/**
 * Process text segments in /.../ format
 */
function processSegments(text, scheme) {
  return text.replace(/\/[^\/]+\//g, (match) => {
    const content = match.slice(1, -1);
    const result = ipaSylToScheme(content, scheme);
    return '/' + result + '/';
  });
}

// ============================================
// Public API - Direct IPA to Scheme Conversion
// ============================================

export function formatYueJyutping(text) {
  text = normalizeIPA(text);
  return processSegments(text, 'jyutping');
}

// 廣州話拼音專用：把 z/c/s 在 i/ü 前面自動轉成 j/q/x
function processGuangzhouVariant(text) {
  if (!text || typeof text !== 'string') return text;

  /**
   * 改進邏輯：
   * 1. ([/\s]) : 匹配斜槓 / 或空格，確保這是音節的起點。
   * 2. ([zcs]) : 捕獲聲母 z, c, s。
   * 3. ([iü][^/\s]*) : 匹配以 i 或 ü 開頭的韻母，直到遇到下一個空格或斜槓。
   */
  return text.replace(
    /([/\s])([zcs])([iü][^/\s]*)/gi,
    (match, prefix, initial, rest) => {
      const lowerInit = initial.toLowerCase();
      
      let newInitial = lowerInit;
      if (lowerInit === 'z') newInitial = 'j';
      else if (lowerInit === 'c') newInitial = 'q';
      else if (lowerInit === 's') newInitial = 'x';

      // 處理大小寫保持
      if (initial === initial.toUpperCase() && initial !== initial.toLowerCase()) {
        newInitial = newInitial.toUpperCase();
      }

      // 返回 原始前綴 + 轉換後的聲母 + 韻母餘下部分
      return `${prefix}${newInitial}${rest}`;
    }
  );
}

// 主函數修改版
export function formatYueGuangzhou(text) {
  text = normalizeIPA(text);
  let result = processSegments(text, 'guangzhou');
  return processGuangzhouVariant(result)
}

export function formatYueAcademy(text) {
  text = normalizeIPA(text);
  return processSegments(text, 'academy');
}

function postProcessYale(text) {
  return text
    // 處理耶魯常見的 yyu, yyun, yyut 問題
    .replace(/yyu/g, 'yu')
    // 如果你的代碼產生了 yyi 或 wwu
    .replace(/yyi/g, 'yi')
    .replace(/wwu/g, 'wu');
}

export function formatYueYale(text) {
  text = normalizeIPA(text);
  let result =  processSegments(text, 'yale');
  return postProcessYale(result);
}

export function formatYueLiu(text) {
  text = normalizeIPA(text);
  return processSegments(text, 'liu');
}

// ============================================
// Legacy Functions (for backward compatibility)
// ============================================

export function formatIPA_num(text) {
  return text
    .replace(new RegExp(TONE_5, 'g'), '5')
    .replace(new RegExp(TONE_3, 'g'), '3')
    .replace(new RegExp(TONE_2, 'g'), '2')
    .replace(new RegExp(TONE_1, 'g'), '1');
}

export function formatIPA_org(text) {
  return text;
}

export function formatJyutpingCantonese(text) {
  // Convert tone marks to numbers - order matters: handle compound tones first
  return text
    .replace(new RegExp(TONE_5 + TONE_3, 'g'), '1')  // 陰平 53
    .replace(new RegExp(TONE_5 + TONE_5, 'g'), '1')  // 陰平 55
    .replace(new RegExp(TONE_3 + TONE_5, 'g'), '2')  // 陰上 35
    .replace(new RegExp(TONE_1 + TONE_3, 'g'), '5')  // 陽上 13 - moved before single tones
    .replace(new RegExp(TONE_2 + TONE_3, 'g'), '5')  // 陽上 13 - alternative
    .replace(new RegExp(TONE_3 + TONE_3, 'g'), '3')  // 陰去 33
    .replace(new RegExp(TONE_3, 'g'), '3')           // 陰去 33 (fallback)
    .replace(new RegExp(TONE_2 + TONE_1, 'g'), '4')  // 陽平 21
    .replace(new RegExp(TONE_1 + TONE_1, 'g'), '4')  // 陽平 11
    .replace(new RegExp(TONE_2 + TONE_2, 'g'), '6')  // 陽去 22
    .replace(new RegExp(TONE_2, 'g'), '6')           // 陽去 22 (fallback)
    .replace(new RegExp(TONE_5, 'g'), '1')           // 陰平 5 (fallback)
    .replace(new RegExp(TONE_1, 'g'), '4');          // 陽平 4 (fallback)
}

export function formatJyutpingMandarin(text) {
  return text;
}

export const formatJyutping = formatJyutpingCantonese;

export function formatJyutping_num(text) {
  return formatJyutpingCantonese(text)
    .replace(/ˉ/g, '1').replace(/ˊ/g, '2').replace(/ˇ/g, '3')
    .replace(/ˋ/g, '4').replace(/˙/g, '5');
}

export function formatJyutpingMandarinNum(text) {
  return formatJyutpingMandarin(text)
    .replace(/ˉ/g, '1').replace(/ˊ/g, '2').replace(/ˇ/g, '3')
    .replace(/ˋ/g, '4');
}

export function formatVietnamese(text) {
  return text;
}

// ============================================
// DOM-based Output Functions
// ============================================

export function formatYueOutput(text, options = {}) {
  if (typeof document !== 'undefined') {
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
  }
  return formatIPA_org(text);
}

export function formatMandarinOutput(text, options = {}) {
  if (typeof document !== 'undefined') {
    const IPA_num = document.getElementById('IPA_num');
    const IPA_org = document.getElementById('IPA_org');
    const Jyutping = document.getElementById('Jyutping');
    const Jyutping_num = document.getElementById('Jyutping_num');

    if (IPA_num && IPA_num.checked) return formatIPA_num(text);
    if (IPA_org && IPA_org.checked) return formatIPA_org(text);
    if (Jyutping_num && Jyutping_num.checked) return formatJyutpingMandarinNum(text);
    if (Jyutping && Jyutping.checked) return formatJyutpingMandarin(text);
  }
  return formatIPA_org(text);
}

export function formatVietnameseOutput(text, options = {}) {
  if (typeof document !== 'undefined') {
    const IPA_num = document.getElementById('IPA_num');
    const IPA_org = document.getElementById('IPA_org');

    if (IPA_num && IPA_num.checked) return formatVietnamese(text);
    if (IPA_org && IPA_org.checked) return formatIPA_org(text);
  }
  return formatIPA_org(text);
}
