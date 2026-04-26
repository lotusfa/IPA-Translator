/**
 * Vietnamese IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';
import { formatVietnameseOutput, formatIPANumbers } from '../js/vi.format.js';

// Initialize with char-based processing and Vietnamese formatters
initIPAIndexPage({
  databasePath: '../json/vi_${variant}.json',
  variantRadioSelector: 'input[name="variant"]',
  variantMapping: { variant_C: 'C', variant_N: 'N', variant_S: 'S' },
  process: processTextLongestMatch,
  formatRadioSelector: 'input[name="format"]',
  formatMapping: {
    IPA_org: (text) => text,
    IPA_num: formatIPANumbers,
    tone_simple: formatVietnameseOutput
  },
  maxWordLength: 6,
  ttsLanguage: 'vi-VN',
  gameLabel: 'vietnamese'
});
