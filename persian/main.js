/** Persian IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/fa.json',
  process: processTextLongestMatch,
  ttsLanguage: 'fa',
  locale: { textAndIpa: '(متن /ipa/)', onlyIpa: 'فقط /ipa/' },
  gameLabel: 'persian',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'اشتراک‌گذاری', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'پایگاه داده IPA', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'بازی کوییز', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'زبان‌های دیگر', type: 'lang' },
  ]
});
