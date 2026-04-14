/**
 * Spanish IPA Translator - Refactored to use shared ipa-core module
 */

import {
  loadIPADatabase,
  processTextLongestMatch,
  initDarkMode,
  onTextInputChange,
  onMultipleChange
} from '../js/ipa-core.js';

let IPA_DB = {};
let variantOption = 'IPA_Spain'; // Default: Spain

/**
 * Load database with variant selection (es_ES/es_MX)
 */
function loadDatabase() {
  const variant = variantOption === 'IPA_Spain' ? 'ES' : 'MX';
  loadIPADatabase({
    basePath: `../json/es_${variant}.json`,
    onSuccess: (lookup) => { IPA_DB = lookup; translate(); }
  });
}

/**
 * Translate input text
 */
function translate() {
  const input = document.getElementById('cWords_tBox')?.value || '';
  const ipaBox = document.getElementById('IPA_tBox');
  if (!ipaBox) return;

  ipaBox.value = 'loading....';

  setTimeout(() => {
    const result = processTextLongestMatch({
      input,
      lookupTable: IPA_DB,
      withWords: !!document.getElementById('wf_c_words')?.checked
    });
    ipaBox.value = result;
  }, 10);
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dark mode
  initDarkMode('dark-mode-toggle');

  // Set up input handler
  onTextInputChange('cWords_tBox', translate);

  // Set up variant radio handlers (IPA_Spain / IPA_Mexico)
  onMultipleChange('input[name="inlineRadioOptions"]', (e) => {
    variantOption = e.target.id;
    loadDatabase();
  });

  // Set up word format checkbox
  const wf_c_words = document.getElementById('wf_c_words');
  if (wf_c_words) {
    wf_c_words.addEventListener('change', translate);
  }

  // Initial loading
  loadDatabase();
});
