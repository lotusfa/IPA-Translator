import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/is.json',
  process: processTextLongestMatch,
  ttsLanguage: 'is-IS',
  locale: { textAndIpa: '(Texti /ipa/)', onlyIpa: 'Aðeins /ipa/' },
  gameLabel: 'icelandic',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Deila', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA-gagnagrunnur', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Spil', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Aðrir tungumál', type: 'lang' },
  ]
});
