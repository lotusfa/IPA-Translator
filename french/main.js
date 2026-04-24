/**
 * French IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage } from '../js/ui.js';
import { processTextLongestMatch } from '../js/ipa-core.js';

// Initialize with variant support (fr_FR/fr_QC)
initIPAIndexPage({
  databasePath: '../json/fr_${variant}.json',
  variantRadioSelector: 'input[name="inlineRadioOptions"]',
  process: processTextLongestMatch,
  getLanguage: () => {
    const variant = document.querySelector('input[name="inlineRadioOptions"]:checked')?.id;
    return variant === 'IPA_fr_FR' ? 'fr-FR' : 'fr-CA';
  }
});
