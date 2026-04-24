/**
 * Cantonese IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';
import { formatYueOutput } from '../js/yue.format.js';

// Initialize with char-based processing and Cantonese formatters
initIPAIndexPage({
  databasePath: '../json/yue.json',
  process: processTextCharBased,
  formatRadioSelector: 'input[name="format"]',
  formatMapping: {
    IPA_org: (text) => text,
    IPA_num: (text) => text.replace(/˥/g, '5').replace(/˧/g, '3').replace(/˨/g, '2').replace(/˩/g, '1'),
    Jyutping: (text) => text,
    Guangzhou: (text) => text,
    Academy: (text) => text,
    Yale: (text) => text,
    Liu: (text) => text
  },
  maxWordLength: 6
});
