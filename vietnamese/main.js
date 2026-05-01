/**
 * Vietnamese IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';
import { formatVietnameseOutput, formatIPANumbers } from '../js/format/vi.format.js';

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
  gameLabel: 'vietnamese',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Chia sẻ', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list-c', icon: 'globe', label: 'IPA Trung', type: 'link', href: './ipa_list_c.html' },
    { id: 'ipa-list-n', icon: 'globe', label: 'IPA Bắc', type: 'link', href: './ipa_list_n.html' },
    { id: 'ipa-list-s', icon: 'globe', label: 'IPA Nam', type: 'link', href: './ipa_list_s.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Trò chơi câu đố', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Ngôn ngữ khác', type: 'lang' },
  ]
});
