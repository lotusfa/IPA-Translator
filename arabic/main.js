/**
 * Arabic IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage } from '../js/page/ipa-index-page.js';
import { processTextLongestMatch } from '../js/ipa.js';

// Initialize with longest-match algorithm for phrase processing
initIPAIndexPage({
  databasePath: '../json/ar.json',
  process: processTextLongestMatch,
  locale: { textAndIpa: '(نص /ipa/)', onlyIpa: '/ipa/ فقط' },
  maxWordLength: 5,
  ttsLanguage: 'ar',
  gameLabel: 'arabic',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'مشاركة', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'قاعدة بيانات IPA', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'لعبة اختبار', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'لغات أخرى', type: 'lang' },
  ]
});
