/**
 * English IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage } from '../js/ui.js';
import { processTextLongestMatch } from '../js/ipa-core.js';

// Initialize with variant support (en_US/en_UK)
initIPAIndexPage({
  databasePath: '../json/en_${variant}.json',
  variantRadioSelector: 'input[name="inlineRadioOptions"]',
  variantMapping: { IPA_US: 'US', IPA_UK: 'UK' },
  process: processTextLongestMatch,
  getLanguage: () => {
    const variant = document.querySelector('input[name="inlineRadioOptions"]:checked')?.id;
    return variant === 'IPA_US' ? 'en-US' : 'en-GB';
  }
});
