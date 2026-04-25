/**
 * Spanish IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage } from '../js/ui.js';
import { processTextLongestMatch } from '../js/ipa.js';

// Initialize with variant support (es_ES/es_MX)
initIPAIndexPage({
  databasePath: '../json/es_${variant}.json',
  variantRadioSelector: 'input[name="inlineRadioOptions"]',
  variantMapping: { IPA_Spain: 'ES', IPA_Mexico: 'MX' },
  process: processTextLongestMatch,
  getLanguage: () => {
    const variant = document.querySelector('input[name="inlineRadioOptions"]:checked')?.id;
    return variant === 'IPA_Spain' ? 'es-ES' : 'es-MX';
  }
});
