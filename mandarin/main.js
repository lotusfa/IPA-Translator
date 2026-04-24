/**
 * Mandarin IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';
import { formatMandarinOutput } from '../js/zh.format.js';

// Initialize with char-based processing and Mandarin formatters
initIPAIndexPage({
  databasePath: '../json/${variant}.json',
  variantRadioSelector: 'input[name="zhTypeOption"]',
  process: processTextCharBased,
  formatRadioSelector: 'input[name="format"]',
  formatMapping: {
    IPA_org: (text) => text,
    IPA_num: (text) => text.replace(/˥/g, '5').replace(/˧/g, '3').replace(/˨/g, '2').replace(/˩/g, '1'),
    Pinyin_num: (text) => text,
    Pinyin: (text) => text,
    Zhuyin: (text) => text
  },
  maxWordLength: 6
});
