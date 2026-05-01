/** Finnish IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/fi.json',
  process: processTextLongestMatch,
  ttsLanguage: 'fi-FI',
  gameLabel: 'finnish',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Jaa', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA-tietokanta', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Peli', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Muut kielet', type: 'lang' },
  ]
});
