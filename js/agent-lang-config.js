/**
 * Language configuration for the agent interface.
 * Maps language codes to database paths, processors, variants, and formatters.
 *
 * When adding a new language, update this file alongside the language's main.js.
 */

export const LANGUAGES = {
  cantonese: {
    name: 'Cantonese',
    databasePath: '../json/yue.json',
    processor: 'charBased',
    maxWordLength: 6,
    allowWordSearch: true,
    formats: {
      IPA_org: 'yue.format.js:formatIPA_org',
      IPA_num: 'yue.format.js:formatIPA_num',
      Jyutping: 'yue.format.js:formatYueJyutping',
      Guangzhou: 'yue.format.js:formatYueGuangzhou',
      Academy: 'yue.format.js:formatYueAcademy',
      Yale: 'yue.format.js:formatYueYale',
      Liu: 'yue.format.js:formatYueLiu',
    },
  },
  mandarin: {
    name: 'Mandarin',
    databasePath: '../json/${variant}.json',
    processor: 'charBased',
    maxWordLength: 9,
    allowWordSearch: true,
    variants: { hant: 'zh_hant', hans: 'zh_hans' },
    defaultVariant: 'hant',
    formats: {
      IPA_org: 'zh.format.js:formatIPA_org',
      IPA_num: 'zh.format.js:formatIPA_num',
      Pinyin_num: 'zh.format.js:convertIPATextToPinyin',
      Pinyin: 'zh.format.js:convertIPATextToPinyinWithMarks',
      Zhuyin: 'zh.format.js:convertIPATextToZhuyin',
    },
  },
  english: {
    name: 'English',
    databasePath: '../json/en_${variant}.json',
    processor: 'longestMatch',
    variants: { US: 'US', UK: 'UK' },
    defaultVariant: 'US',
  },
  french: {
    name: 'French',
    databasePath: '../json/${variant}.json',
    processor: 'longestMatch',
    variants: { FR: 'fr_FR', QC: 'fr_QC' },
    defaultVariant: 'FR',
  },
  spanish: {
    name: 'Spanish',
    databasePath: '../json/es_${variant}.json',
    processor: 'longestMatch',
    variants: { ES: 'ES', MX: 'MX' },
    defaultVariant: 'ES',
  },
  vietnamese: {
    name: 'Vietnamese',
    databasePath: '../json/vi_${variant}.json',
    processor: 'longestMatch',
    maxWordLength: 6,
    variants: { C: 'C', N: 'N', S: 'S' },
    defaultVariant: 'S',
    formats: {
      IPA_org: null,
      IPA_num: 'vi.format.js:formatIPANumbers',
      tone_simple: 'vi.format.js:formatVietnameseOutput',
    },
  },
  japanese: {
    name: 'Japanese',
    databasePath: '../json/ja.json',
    processor: 'charBased',
    maxWordLength: 6,
  },
  korean: {
    name: 'Korean',
    databasePath: '../json/ko.json',
    processor: 'korean',
    maxWordLength: 6,
  },
  khmer: {
    name: 'Khmer',
    databasePath: '../json/km.json',
    processor: 'khmer',
  },
  arabic: {
    name: 'Arabic',
    databasePath: '../json/ar.json',
    processor: 'longestMatch',
    maxWordLength: 5,
  },
  esperanto: {
    name: 'Esperanto',
    databasePath: '../json/eo.json',
    processor: 'longestMatch',
    maxWordLength: 5,
  },
  persian: {
    name: 'Persian',
    databasePath: '../json/fa.json',
    processor: 'longestMatch',
  },
  finnish: {
    name: 'Finnish',
    databasePath: '../json/fi.json',
    processor: 'longestMatch',
  },
  german: {
    name: 'German',
    databasePath: '../json/de.json',
    processor: 'longestMatch',
  },
  icelandic: {
    name: 'Icelandic',
    databasePath: '../json/is.json',
    processor: 'longestMatch',
  },
  jamaican: {
    name: 'Jamaican',
    databasePath: '../json/jam.json',
    processor: 'longestMatch',
  },
  malay: {
    name: 'Malay',
    databasePath: '../json/ma.json',
    processor: 'longestMatch',
  },
  norwegian: {
    name: 'Norwegian',
    databasePath: '../json/nb.json',
    processor: 'longestMatch',
  },
  odia: {
    name: 'Odia',
    databasePath: '../json/or.json',
    processor: 'longestMatch',
  },
  portuguese: {
    name: 'Portuguese',
    databasePath: '../json/pt_BR.json',
    processor: 'longestMatch',
  },
  romanian: {
    name: 'Romanian',
    databasePath: '../json/ro.json',
    processor: 'longestMatch',
  },
  swahili: {
    name: 'Swahili',
    databasePath: '../json/sw.json',
    processor: 'longestMatch',
  },
  swedish: {
    name: 'Swedish',
    databasePath: '../json/sv.json',
    processor: 'longestMatch',
  },
  dutch: {
    name: 'Dutch',
    databasePath: '../json/nl.json',
    processor: 'longestMatch',
  },
};

/**
 * Resolve the actual database path for a language and optional variant.
 */
export function resolveDatabasePath(languageCode, variant) {
  const lang = LANGUAGES[languageCode];
  if (!lang) return null;
  const path = lang.databasePath;
  if (path.includes('${variant}')) {
    const v = variant || lang.defaultVariant;
    const suffix = lang.variants && lang.variants[v];
    if (!suffix) return null;
    return path.replace('${variant}', suffix);
  }
  return path;
}

/**
 * Get list of valid format keys for a language.
 */
export function getValidFormats(languageCode) {
  const lang = LANGUAGES[languageCode];
  return lang && lang.formats ? Object.keys(lang.formats) : [];
}

/**
 * Get list of valid variant keys for a language.
 */
export function getValidVariants(languageCode) {
  const lang = LANGUAGES[languageCode];
  return lang && lang.variants ? Object.keys(lang.variants) : [];
}
