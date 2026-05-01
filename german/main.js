/** German IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/de.json',
  process: processTextLongestMatch,
  ttsLanguage: 'de-DE',
  gameLabel: 'german',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Teilen', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA-Datenbank', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Quiz-Spiel', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Andere Sprachen', type: 'lang' },
  ]
});
