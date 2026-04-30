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
} from '../js/ipa.js';

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
  maxWordLength: 6,
  ttsLanguage: 'zh-HK',
  gameLabel: 'cantonese',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: '分享 (Share)', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA 資料庫', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Quiz Game', type: 'game', visible: 'after-translate' },
  ]
});
