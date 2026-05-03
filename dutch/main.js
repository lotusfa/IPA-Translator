/**
 * Dutch IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage } from '../js/page/ipa-index-page.js';
import { processTextLongestMatch } from '../js/ipa.js';

initIPAIndexPage({
  databasePath: '../json/nl.json',
  process: processTextLongestMatch,
  ttsLanguage: 'nl-NL',
  locale: { textAndIpa: '(Tekst /ipa/)', onlyIpa: 'Alleen /ipa/' },
  gameLabel: 'dutch',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Delen', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA-database', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Quizspel', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Andere talen', type: 'lang' },
  ]
});
