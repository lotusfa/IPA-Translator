/** Jamaican IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/jam.json',
  process: processTextLongestMatch,
  ttsLanguage: 'en-US',
  locale: { textAndIpa: '(Text /ipa/)', onlyIpa: 'Only /ipa/' },
  gameLabel: 'jamaican',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Share', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA Diireeb', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Quiz Gie', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Aada Langwij', type: 'lang' },
  ]
});
