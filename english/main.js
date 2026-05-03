/**
 * English IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage } from '../js/page/ipa-index-page.js';
import { processTextLongestMatch } from '../js/ipa.js';

// Initialize with variant support (en_US/en_UK)
initIPAIndexPage({
  databasePath: '../json/en_${variant}.json',
  variantRadioSelector: 'input[name="inlineRadioOptions"]',
  variantMapping: { IPA_US: 'US', IPA_UK: 'UK' },
  process: processTextLongestMatch,
  locale: { textAndIpa: '(Text /ipa/)', onlyIpa: 'Only /ipa/' },
  getLanguage: () => {
    const variant = document.querySelector('input[name="inlineRadioOptions"]:checked')?.id;
    return variant === 'IPA_US' ? 'en-US' : 'en-GB';
  },
  gameLabel: 'english',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Share', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list-us', icon: 'globe', label: 'IPA Database (US)', type: 'link', href: './ipa_list_us.html' },
    { id: 'ipa-list-uk', icon: 'globe', label: 'IPA Database (UK)', type: 'link', href: './ipa_list_uk.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Quiz Game', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Other Languages', type: 'lang' },
  ]
});
