/** Norwegian IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/nb.json',
  process: processTextLongestMatch,
  ttsLanguage: 'nb-NO',
  locale: { textAndIpa: '(Tekst /ipa/)', onlyIpa: 'Kun /ipa/' },
  gameLabel: 'norwegian',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Del', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA-database', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Quizzspill', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Andre språk', type: 'lang' },
  ]
});
