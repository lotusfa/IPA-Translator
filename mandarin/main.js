/**
 * Mandarin IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';
import {
  formatMandarinIPA_org,
  formatMandarinIPA_num,
  convertIPATextToPinyin,
  convertIPATextToPinyinWithMarks,
  convertIPATextToZhuyin
} from '../js/ipa-core.js';

// Initialize with char-based processing and Mandarin formatters
initIPAIndexPage({
  databasePath: '../json/${variant}.json',
  variantRadioSelector: 'input[name="zhTypeOption"]',
  variantMapping: { zh_type1: 'zh_hant', zh_type2: 'zh_hans' },
  process: processTextCharBased,
  formatRadioSelector: 'input[name="format"]',
  formatMapping: {
    IPA_org: formatMandarinIPA_org,
    IPA_num: formatMandarinIPA_num,
    Pinyin_num: convertIPATextToPinyin,
    Pinyin: convertIPATextToPinyinWithMarks,
    Zhuyin: convertIPATextToZhuyin
  },
  maxWordLength: 6
});
