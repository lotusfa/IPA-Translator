/** Swedish IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/sv.json',
  process: processTextLongestMatch,
  ttsLanguage: 'sv-SE',
  gameLabel: 'swedish',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Dela', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA-databas', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Quizspel', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Andra språk', type: 'lang' },
  ]
});
