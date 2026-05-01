import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/ro.json',
  process: processTextLongestMatch,
  ttsLanguage: 'ro-RO',
  locale: { textAndIpa: '(Text /ipa/)', onlyIpa: 'Doar /ipa/' },
  gameLabel: 'romanian',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Distribuiți', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'Baza de date IPA', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Joc quiz', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Alte limbi', type: 'lang' }
  ]
});
