/** Malay IPA Translator */
import { initIPAIndexPage } from '../js/page/ipa-index-page.js';
import { processTextLongestMatch } from '../js/ipa.js';

initIPAIndexPage({
  databasePath: '../json/ma.json',
  process: processTextLongestMatch,
  ttsLanguage: 'ms-MY',
  locale: { textAndIpa: '(Teks /ipa/)', onlyIpa: 'Hanya /ipa/' },
  gameLabel: 'malay',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Kongsi', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'Pangkalan Data IPA', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Kuiz', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Bahasa Lain', type: 'lang' },
  ]
});
