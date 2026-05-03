/** Odia IPA Translator */
import { initIPAIndexPage } from '../js/page/ipa-index-page.js';
import { processTextLongestMatch } from '../js/ipa.js';

initIPAIndexPage({
  databasePath: '../json/or.json',
  process: processTextLongestMatch,
  enableSpeakButton: false,
  locale: { textAndIpa: '(ଅକ୍ଷର /ipa/)', onlyIpa: 'କେବଳ /ipa/' },
  gameLabel: 'odia',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'ସେୟାର୍', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA ଡାଟାବେସ୍', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'କୁଇଜ୍ ଖେଳ', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'ଅନ୍ୟ ଭାଷା', type: 'lang' },
  ]
});
