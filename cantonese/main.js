/**
 * Cantonese IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';
import {
  formatIPA_org,
  formatIPA_num,
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu
} from '../js/format/yue.format.js';

// Initialize with char-based processing and Cantonese formatters
initIPAIndexPage({
  databasePath: '../json/yue.json',
  process: processTextCharBased,
  formatRadioSelector: 'input[name="format"]',
  formatMapping: {
    IPA_org: formatIPA_org,
    IPA_num: formatIPA_num,
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
    { id: 'share-btn', icon: 'share', label: '分享', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA 資料庫', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: '測驗小遊戲', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: '其他語言', type: 'lang' },
  ]
});
