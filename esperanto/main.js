/**
 * Esperanto IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage } from '../js/page/ipa-index-page.js';
import { processTextLongestMatch } from '../js/ipa.js';

// Initialize with longest-match algorithm for phrase processing
initIPAIndexPage({
  databasePath: '../json/eo.json',
  process: processTextLongestMatch,
  maxWordLength: 5,
  ttsLanguage: 'eo',
  locale: { textAndIpa: '(Teksto /ipa/)', onlyIpa: 'Nur /ipa/' },
  gameLabel: 'esperanto',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Dividi', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA-datumobazo', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Kvizo', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Aliaj lingvoj', type: 'lang' },
  ]
});
