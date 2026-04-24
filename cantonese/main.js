/**
 * Cantonese IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';
import {
  formatCantoneseIPA_org,
  formatCantoneseIPA_num,
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu
} from '../js/ipa-core.js';

// Initialize with char-based processing and Cantonese formatters
initIPAIndexPage({
  databasePath: '../json/yue.json',
  process: processTextCharBased,
  formatRadioSelector: 'input[name="format"]',
  formatMapping: {
    IPA_org: formatCantoneseIPA_org,
    IPA_num: formatCantoneseIPA_num,
    Jyutping: formatYueJyutping,
    Guangzhou: formatYueGuangzhou,
    Academy: formatYueAcademy,
    Yale: formatYueYale,
    Liu: formatYueLiu
  },
  maxWordLength: 6
});
