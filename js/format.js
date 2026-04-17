/**
 * Format Utilities - Format transformation for IPA output
 * Provides format conversion functions for various languages
 */

/**
 * Format IPA number tones (˥→5, ˧→3, ˨→2, ˩→1, remove :)
 * @param {string} text - Input IPA text
 * @returns {string} Formatted text
 */
export function formatIPA_num(text) {
  return text
    .replace(/˥/g, "5")
    .replace(/˧/g, "3")
    .replace(/˨/g, "2")
    .replace(/˩/g, "1")
    .replace(/:/g, "");
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
    .replace(/˨/g, "6")
    .replace(/:/g, "");
}

/**
 * Format IPA to Mandarin tone diacritics (ˉ ˊ ˇ ˋ ˙)
 * Converts IPA tone patterns to Mandarin tone marks
 * Based on original toolbox version format_Jyutping
 * @param {string} text - Input IPA text
 * @returns {string} Mandarin formatted text with tone diacritics
 */
export function formatJyutpingMandarin(text) {
  return text
    .replace(/˥˥/g, "ˉ")           // Tone 1
    .replace(/˧˥/g, "ˊ")           // Tone 2
    .replace(/˨˩˦/g, "ˇ")          // Tone 3 (4-part)
    .replace(/˨˩˩/g, "ˇ")          // Tone 3 (variant)
    .replace(/˥˩/g, "ˋ")           // Tone 4
    .replace(/˥˧/g, "ˋ")           // Tone 4 (variant)
    .replace(/˨˩/g, "˙")           // Neutral tone
    .replace(/˧˩/g, "˙")           // Neutral tone (variant)
    .replace(/˦˩/g, "˙")           // Neutral tone (variant)
    .replace(/˩˩/g, "˙")           // Neutral tone (variant)
    .replace(/˧/g, "˙")            // Neutral tone (catch-all)
    .replace(/:/g, "");
}

/**
 * Legacy alias for backward compatibility
 * @deprecated Use formatJyutpingCantonese instead
 */
export const formatJyutping = formatJyutpingCantonese;

/**
 * Format IPA to Jyutping with numeric tone endings (1-5) for Cantonese
 * Converts Jyutping tone diacritics to numbers (after formatJyutpingCantonese)
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
 * Converts IPA tone patterns directly to Mandarin tone numbers
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
 * Converts Vietnamese tone diacritics to numeric format
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
 * Get active format from radio buttons and apply transformation
 * Auto-detects which format radio button is checked
 * 
 * @param {string} text - Text to format
 * @param {object} [options] - Options (reserved for future use)
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
 * Format Mandarin output based on selected format
 * @param {string} text - Text to format
 * @param {object} [options] - Options (reserved for future use)
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
 * Format Vietnamese output based on selected format
 * @param {string} text - Text to format
 * @param {object} [options] - Options (reserved for future use)
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
 * 粵拼聲母映射表 (Jyutping → 其他方案)
 */
export const YUE_INITIAL_MAP = {
  'b': { guangzhou: 'b', academy: 'b', yale: 'b', liu: 'b' },
  'p': { guangzhou: 'p', academy: 'p', yale: 'p', liu: 'p' },
  'm': { guangzhou: 'm', academy: 'm', yale: 'm', liu: 'm' },
  'f': { guangzhou: 'f', academy: 'f', yale: 'f', liu: 'f' },
  'd': { guangzhou: 'd', academy: 'd', yale: 'd', liu: 'd' },
  't': { guangzhou: 't', academy: 't', yale: 't', liu: 't' },
  'n': { guangzhou: 'n', academy: 'n', yale: 'n', liu: 'n' },
  'l': { guangzhou: 'l', academy: 'l', yale: 'l', liu: 'l' },
  'g': { guangzhou: 'g', academy: 'g', yale: 'g', liu: 'g' },
  'k': { guangzhou: 'k', academy: 'k', yale: 'k', liu: 'k' },
  'ng': { guangzhou: 'ng', academy: 'ng', yale: 'ng', liu: 'ng' },
  'h': { guangzhou: 'h', academy: 'h', yale: 'h', liu: 'h' },
  'z': { guangzhou: 'z', academy: 'dz', yale: 'j', liu: 'j' },
  'c': { guangzhou: 'c', academy: 'ts', yale: 'ch', liu: 'ch' },
  's': { guangzhou: 's', academy: 's', yale: 's', liu: 's' },
  'gw': { guangzhou: 'gu', academy: 'gw', yale: 'gw', liu: 'gw' },
  'kw': { guangzhou: 'ku', academy: 'kw', yale: 'kw', liu: 'kw' },
  'j': { guangzhou: 'y', academy: 'j', yale: 'y', liu: 'y' },
  'w': { guangzhou: 'w', academy: 'w', yale: 'w', liu: 'w' }
};

/**
 * 粵拼韻母映射表 (粵拼 → 其他方案)
 */
export const YUE_FINAL_MAP = {
  'aa': { guangzhou: 'a', academy: 'aa', yale: 'a', liu: 'a' },
  'aai': { guangzhou: 'ai', academy: 'aai', yale: 'aai', liu: 'aai' },
  'aau': { guangzhou: 'ao', academy: 'aau', yale: 'aau', liu: 'aau' },
  'aam': { guangzhou: 'am', academy: 'aam', yale: 'aam', liu: 'aam' },
  'aan': { guangzhou: 'an', academy: 'aan', yale: 'aan', liu: 'aan' },
  'aang': { guangzhou: 'ang', academy: 'aang', yale: 'aang', liu: 'aang' },
  'aap': { guangzhou: 'ab', academy: 'aap', yale: 'aap', liu: 'aap' },
  'aat': { guangzhou: 'ad', academy: 'aat', yale: 'aat', liu: 'aat' },
  'aak': { guangzhou: 'ag', academy: 'aak', yale: 'aak', liu: 'aak' },
  'ai': { guangzhou: 'ei', academy: 'ai', yale: 'ai', liu: 'ai' },
  'au': { guangzhou: 'eo', academy: 'au', yale: 'au', liu: 'au' },
  'am': { guangzhou: 'em', academy: 'am', yale: 'am', liu: 'am' },
  'an': { guangzhou: 'en', academy: 'an', yale: 'an', liu: 'an' },
  'ang': { guangzhou: 'eng', academy: 'ang', yale: 'ang', liu: 'ang' },
  'ap': { guangzhou: 'eb', academy: 'ap', yale: 'ap', liu: 'ap' },
  'at': { guangzhou: 'ed', academy: 'at', yale: 'at', liu: 'at' },
  'ak': { guangzhou: 'eg', academy: 'ak', yale: 'ak', liu: 'ak' },
  'e': { guangzhou: 'é', academy: 'e', yale: 'e', liu: 'e' },
  'ei': { guangzhou: 'éi', academy: 'ei', yale: 'ei', liu: 'ei' },
  'eu': { guangzhou: 'éo', academy: 'eu', yale: '-', liu: 'eu' },
  'em': { guangzhou: 'ém', academy: 'em', yale: 'em', liu: 'em' },
  'en': { guangzhou: 'én', academy: 'en', yale: 'en', liu: 'en' },
  'eng': { guangzhou: 'éng', academy: 'eng', yale: 'eng', liu: 'eng' },
  'ep': { guangzhou: 'éb', academy: 'ep', yale: 'ep', liu: 'ep' },
  'et': { guangzhou: 'éd', academy: 'et', yale: 'et', liu: 'et' },
  'ek': { guangzhou: 'ég', academy: 'ek', yale: 'ek', liu: 'ek' },
  'i': { guangzhou: 'i', academy: 'i', yale: 'i', liu: 'i' },
  'iu': { guangzhou: 'iu', academy: 'iu', yale: 'iu', liu: 'iu' },
  'im': { guangzhou: 'im', academy: 'im', yale: 'im', liu: 'im' },
  'in': { guangzhou: 'in', academy: 'in', yale: 'in', liu: 'in' },
  'ing': { guangzhou: 'ing', academy: 'ing', yale: 'ing', liu: 'ing' },
  'ip': { guangzhou: 'ib', academy: 'ip', yale: 'ip', liu: 'ip' },
  'it': { guangzhou: 'id', academy: 'it', yale: 'it', liu: 'it' },
  'ik': { guangzhou: 'ig', academy: 'ik', yale: 'ik', liu: 'ik' },
  'o': { guangzhou: 'o', academy: 'o', yale: 'oh', liu: 'o' },
  'oi': { guangzhou: 'oi', academy: 'oi', yale: 'oi', liu: 'oi' },
  'ou': { guangzhou: 'ou', academy: 'ou', yale: 'ou', liu: 'o' },
  'on': { guangzhou: 'on', academy: 'on', yale: 'on', liu: 'on' },
  'ong': { guangzhou: 'ong', academy: 'ong', yale: 'ong', liu: 'ong' },
  'ot': { guangzhou: 'od', academy: 'ot', yale: 'ot', liu: 'ot' },
  'ok': { guangzhou: 'og', academy: 'ok', yale: 'ok', liu: 'ok' },
  'u': { guangzhou: 'u', academy: 'u', yale: 'u', liu: 'oo' },
  'ui': { guangzhou: 'ui', academy: 'ui', yale: 'ui', liu: 'ooi' },
  'un': { guangzhou: 'un', academy: 'un', yale: 'un', liu: 'oon' },
  'ung': { guangzhou: 'ung', academy: 'ung', yale: 'ung', liu: 'ung' },
  'ut': { guangzhou: 'ud', academy: 'ut', yale: 'ut', liu: 'oot' },
  'uk': { guangzhou: 'ug', academy: 'uk', yale: 'uk', liu: 'uk' },
  'oe': { guangzhou: 'ê', academy: 'oe', yale: 'eu', liu: 'euh' },
  'oeng': { guangzhou: 'êng', academy: 'oeng', yale: 'eung', liu: 'eung' },
  'oek': { guangzhou: 'êng', academy: 'oek', yale: 'euk', liu: 'euk' },
  'oet': { guangzhou: '-', academy: '-', yale: '-', liu: 'eut' },
  'eoi': { guangzhou: 'êu', academy: 'oey', yale: 'eui', liu: 'ui' },
  'eon': { guangzhou: 'ên', academy: 'oen', yale: 'eun', liu: 'un' },
  'eot': { guangzhou: 'êd', academy: 'oet', yale: 'eut', liu: 'ut' },
  'yu': { guangzhou: 'ü', academy: 'y', yale: 'yu', liu: 'ue' },
  'yun': { guangzhou: 'ün', academy: 'yn', yale: 'yun', liu: 'uen' },
  'yut': { guangzhou: 'üd', academy: 'yt', yale: 'yut', liu: 'uet' },
  'm': { guangzhou: 'm', academy: 'm', yale: 'm', liu: 'm' },
  'ng': { guangzhou: 'ng', academy: 'ng', yale: 'ng', liu: 'ng' }
};

/**
 * 粵語聲調映射 (粵拼數字 → 其他方案)
 */
export const YUE_TONE_MAP = {
  1: { guangzhou: '1', academy: '1', yale: 'ā', liu: '1' },
  2: { guangzhou: '2', academy: '2', yale: 'á', liu: '2' },
  3: { guangzhou: '3', academy: '3', yale: 'a', liu: '3' },
  4: { guangzhou: '4', academy: '4', yale: 'àh', liu: '4' },
  5: { guangzhou: '5', academy: '5', yale: 'áh', liu: '5' },
  6: { guangzhou: '6', academy: '6', yale: 'ah', liu: '6' }
};

/**
 * Extract final (tone-less) form from Jyutping
 * E.g., "nei5" → "ne" (vowel part)
 */
function extractJyutpingFinal(jyutping) {
  // Match vowel + ending pattern
  const patterns = [
    /^(.*?)([1-6])$/,  // ends with tone number
    /^(.*?)(k|t|p|m|n|ng)$/,  // ends with final
    /^(.*?)(k|t|p|m|n|ng)([1-6])$/  // ends with final + tone
  ];

  // Simple approach: remove tone number at end
  return jyutping.replace(/[1-6]$/, '');
}

/**
 * Extract tone number from Jyutping
 * E.g., "nei5" → 5
 */
function extractToneNumber(text) {
  const match = text.match(/([1-6])$/);
  return match ? parseInt(match[1]) : null;
}

/**
 * 粵拼格式轉換 (Jyutping with numbers)
 * Already implemented as formatJyutpingCantonese
 */
export function formatYueJyutping(text) {
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
    .replace(/˨/g, "6")
    .replace(/:/g, "");
}

/**
 * Convert character-based IPA to Jyutping syllables
 * This is the core conversion function
 */
function convertToJyutpingFromIPA(ipa) {
  // Simplified mapping from IPA patterns to Jyutping
  // Actual implementation would need complete IPA→Jyutping lookup
  const IPA_TO_JYUTPING = {
    // Vowels
    'a:': 'aa',
    'a:': 'aa',
    'a:i': 'aai',
    'a:u': 'aau',
    'a:m': 'aam',
    'a:n': 'aan',
    'a:ŋ': 'aang',
    'ɐi': 'ai',
    'ɐu': 'au',
    'ɐm': 'am',
    'ɐn': 'an',
    'ɐŋ': 'ang',
    'ɛ:': 'e',
    'ei': 'ei',
    'ɛ:u': 'eu',
    'ɛ:m': 'em',
    'ɛ:n': 'en',
    'ɛ:ŋ': 'eng',
    'i:': 'i',
    'i:u': 'iu',
    'i:m': 'im',
    'i:n': 'in',
    'ɪŋ': 'ing',
    'i:p': 'ip',
    'i:t': 'it',
    'ɪk': 'ik',
    'ɔ:': 'o',
    'ɔ:i': 'oi',
    'ou': 'ou',
    'ɔ:n': 'on',
    'ɔ:ŋ': 'ong',
    'ɔ:t': 'ot',
    'ɔ:k': 'ok',
    'u:': 'u',
    'u:i': 'ui',
    'u:n': 'un',
    'ʊŋ': 'ung',
    'u:t': 'ut',
    'ʊk': 'uk',
    'œ:': 'oe',
    'œ:ŋ': 'oeng',
    'œ:k': 'oek',
    'ɵy': 'eoi',
    'ɵn': 'eon',
    'ɵt': 'eot',
    'y:': 'yu',
    'y:n': 'yun',
    'y:t': 'yut',
    // Consonants
    'p': 'b',
    'pʰ': 'p',
    'm': 'm',
    'f': 'f',
    't': 'd',
    'tʰ': 't',
    'n': 'n',
    'l': 'l',
    'k': 'g',
    'kʰ': 'k',
    'ŋ': 'ng',
    'h': 'h',
    'ts': 'z',
    'tsʰ': 'c',
    's': 's',
    'kʷ': 'gw',
    'kʷʰ': 'kw',
    'j': 'j',
    'w': 'w'
  };

  // Normalize and lookup
  let normalized = ipa.replace(/[\[\]ʰ]/g, '');
  return IPA_TO_JYUTPING[normalized] || normalized;
}

/**
 * Format Cantonese syllable to Guangzhou (廣拼)
 */
export function formatYueGuangzhou(text) {
  let result = formatYueJyutping(text);

  // Process each syllable
  result = result.split(' ').map(syl => {
    const tone = extractToneNumber(syl);
    const final = syl.replace(/[1-6]$/, '');

    // Extract initial and final parts
    let initial = '';
    let vowelFinal = '';

    // Match initial consonants
    const initials = ['gw', 'kw', 'ng', 'j', 'z', 'c', 's', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h'];
    for (const init of initials) {
      if (final.startsWith(init)) {
        initial = init;
        vowelFinal = final.substring(init.length);
        break;
      }
    }

    // Convert using mappings
    let converted = '';
    if (initial) {
      const initMap = YUE_INITIAL_MAP[initial];
      if (initMap) {
        converted += initMap.guangzhou;
      } else {
        converted += initial;
      }
    }

    // Convert final
    if (vowelFinal) {
      const finalMap = YUE_FINAL_MAP[vowelFinal];
      if (finalMap && finalMap.guangzhou && finalMap.guangzhou !== '-') {
        converted += finalMap.guangzhou;
      } else {
        converted += vowelFinal;
      }
    }

    // Add tone
    if (tone) {
      const toneMap = YUE_TONE_MAP[tone];
      if (toneMap) {
        converted += toneMap.guangzhou;
      }
    }

    return converted;
  }).join(' ');

  return result;
}

/**
 * Format Cantonese syllable to Academy (教院)
 */
export function formatYueAcademy(text) {
  let result = formatYueJyutping(text);

  result = result.split(' ').map(syl => {
    const tone = extractToneNumber(syl);
    const final = syl.replace(/[1-6]$/, '');

    let initial = '';
    let vowelFinal = '';

    const initials = ['gw', 'kw', 'ng', 'j', 'z', 'c', 's', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h'];
    for (const init of initials) {
      if (final.startsWith(init)) {
        initial = init;
        vowelFinal = final.substring(init.length);
        break;
      }
    }

    let converted = '';
    if (initial) {
      const initMap = YUE_INITIAL_MAP[initial];
      if (initMap) {
        converted += initMap.academy;
      } else {
        converted += initial;
      }
    }

    if (vowelFinal) {
      const finalMap = YUE_FINAL_MAP[vowelFinal];
      if (finalMap && finalMap.academy && finalMap.academy !== '-') {
        converted += finalMap.academy;
      } else {
        converted += vowelFinal;
      }
    }

    if (tone) {
      const toneMap = YUE_TONE_MAP[tone];
      if (toneMap) {
        converted += toneMap.academy;
      }
    }

    return converted;
  }).join(' ');

  return result;
}

/**
 * Format Cantonese syllable to Yale (耶魯)
 */
export function formatYueYale(text) {
  let result = formatYueJyutping(text);

  result = result.split(' ').map(syl => {
    const tone = extractToneNumber(syl);
    const final = syl.replace(/[1-6]$/, '');

    let initial = '';
    let vowelFinal = '';

    const initials = ['gw', 'kw', 'ng', 'j', 'z', 'c', 's', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h'];
    for (const init of initials) {
      if (final.startsWith(init)) {
        initial = init;
        vowelFinal = final.substring(init.length);
        break;
      }
    }

    let converted = '';
    if (initial) {
      const initMap = YUE_INITIAL_MAP[initial];
      if (initMap) {
        converted += initMap.yale;
      } else {
        converted += initial;
      }
    }

    if (vowelFinal) {
      const finalMap = YUE_FINAL_MAP[vowelFinal];
      if (finalMap && finalMap.yale && finalMap.yale !== '-') {
        converted += finalMap.yale;
      } else {
        converted += vowelFinal;
      }
    }

    // Yale uses tone diacritics instead of numbers
    if (tone) {
      const toneMap = YUE_TONE_MAP[tone];
      if (toneMap && toneMap.yale && toneMap.yale !== '-') {
        converted += toneMap.yale;
      }
    }

    return converted;
  }).join(' ');

  return result;
}

/**
 * Format Cantonese syllable to Liu (劉錫祥)
 */
export function formatYueLiu(text) {
  let result = formatYueJyutping(text);

  result = result.split(' ').map(syl => {
    const tone = extractToneNumber(syl);
    const final = syl.replace(/[1-6]$/, '');

    let initial = '';
    let vowelFinal = '';

    const initials = ['gw', 'kw', 'ng', 'j', 'z', 'c', 's', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h'];
    for (const init of initials) {
      if (final.startsWith(init)) {
        initial = init;
        vowelFinal = final.substring(init.length);
        break;
      }
    }

    let converted = '';
    if (initial) {
      const initMap = YUE_INITIAL_MAP[initial];
      if (initMap) {
        converted += initMap.liu;
      } else {
        converted += initial;
      }
    }

    if (vowelFinal) {
      const finalMap = YUE_FINAL_MAP[vowelFinal];
      if (finalMap && finalMap.liu && finalMap.liu !== '-') {
        converted += finalMap.liu;
      } else {
        converted += vowelFinal;
      }
    }

    if (tone) {
      const toneMap = YUE_TONE_MAP[tone];
      if (toneMap) {
        converted += toneMap.liu;
      }
    }

    return converted;
  }).join(' ');

  return result;
}

/**
 * Format Cantonese with multi-scheme output
 * @param {string} text - Text to format
 * @param {object} [options] - Options (reserved for future use)
 * @returns {string} Formatted text
 */
export function formatYueOutput(text, options = {}) {
  const IPA_num = document.getElementById('IPA_num');
  const IPA_org = document.getElementById('IPA_org');
  const Jyutping = document.getElementById('Jyutping');
  const Jyutping_num = document.getElementById('Jyutping_num');
  const Guangzhou = document.getElementById('Guangzhou');
  const Academy = document.getElementById('Academy');
  const Yale = document.getElementById('Yale');
  const Liu = document.getElementById('Liu');

  if (IPA_num && IPA_num.checked) {
    return formatIPA_num(text);
  } else if (IPA_org && IPA_org.checked) {
    return formatIPA_org(text);
  } else if (Jyutping_num && Jyutping_num.checked) {
    // Returns numbers only (1-6)
    return formatJyutpingCantonese(text).replace(/[a-z0-9]/g, '');
  } else if (Jyutping && Jyutping.checked) {
    return formatYueJyutping(text);
  } else if (Guangzhou && Guangzhou.checked) {
    return formatYueGuangzhou(text);
  } else if (Academy && Academy.checked) {
    return formatYueAcademy(text);
  } else if (Yale && Yale.checked) {
    return formatYueYale(text);
  } else if (Liu && Liu.checked) {
    return formatYueLiu(text);
  }

  return formatIPA_org(text);
}
