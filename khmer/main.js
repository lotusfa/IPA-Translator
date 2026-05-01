// Import the new function
import { initIPAIndexPage, processKhmerText } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/km.json',
  // Use the new Khmer processor here
  process: processKhmerText, 
  ttsLanguage: 'km-KH',
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