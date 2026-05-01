/** Swahili IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/sw.json',
  process: processTextLongestMatch,
  ttsLanguage: 'sw',
  locale: { textAndIpa: '(Neno /ipa/)', onlyIpa: '/ipa/ tu' },
  gameLabel: 'swahili',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Shiriki', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'Hifadhidata ya IPA', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Mchezo wa maswali', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Lugha nyingine', type: 'lang' },
  ]
});
