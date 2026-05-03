// Import the new function
import { initIPAIndexPage } from '../js/page/ipa-index-page.js';
import { processKhmerText } from '../js/ipa.js';

initIPAIndexPage({
  databasePath: '../json/km.json',
  // Use the new Khmer processor here
  process: processKhmerText, 
  ttsLanguage: 'km-KH',
  locale: { textAndIpa: '(អក្សរ /ipa/)', onlyIpa: '/ipa/ ប៉ុណ្ណោះ' },
  gameLabel: 'khmer',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'ចែករំលែក', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'មូលដ្ឋានទិន្នន័យ IPA', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'ហ្គេមក្វីស', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'ភាសាផ្សេងៗ', type: 'lang' },
  ]
});