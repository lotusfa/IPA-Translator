/**
 * French IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage } from '../js/ui.js';
import { processTextLongestMatch } from '../js/ipa-core.js';

// Initialize with variant support (fr_FR/fr_QC)
initIPAIndexPage({
  databasePath: '../json/${variant}.json',
  variantRadioSelector: 'input[name="inlineRadioOptions"]',
  variantMapping: { IPA_fr_FR: 'fr_FR', IPA_fr_QC: 'fr_QC' },
  process: processTextLongestMatch,
  getLanguage: () => {
    const variant = document.querySelector('input[name="inlineRadioOptions"]:checked')?.id;
    return variant === 'IPA_fr_FR' ? 'fr-FR' : 'fr-CA';
  }
});
