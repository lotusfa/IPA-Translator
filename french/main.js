/**
 * French IPA Translator - Refactored to use shared ipa-core module
 * Uses processTextLongestMatch for multi-word phrase matching
 */

import {
  loadIPADatabase,
  processTextLongestMatch,
  initDarkMode,
  initResponsiveTextareaRows,
  onTextInputChange,
  onMultipleChange,
  setElementValue,
  setElementValueAnimated,
  initSpeakButton
} from '../js/ipa-core.js';

let IPA_DB = {};
let variantOption = 'IPA_fr_FR'; // Default: France

/**
 * Load database with variant selection (fr_FR/fr_QC)
 */
function loadDatabase() {
  const variant = variantOption === 'IPA_fr_FR' ? 'FR' : 'QC';
  loadIPADatabase({ 
    basePath: `../json/fr_${variant}.json`, 
    onSuccess: (lookup) => { 
      IPA_DB = lookup; 
      translate(); 
    }
  });
}

/**
 * Translate input text using longest-match algorithm
 */
function translate() {
  const input = document.getElementById('cWords_tBox')?.value || '';
  if (!document.getElementById('IPA_tBox')) return;

  setElementValue('IPA_tBox', 'loading....');

  setTimeout(() => {
    const result = processTextLongestMatch({
      input,
      lookupTable: IPA_DB,
      withWords: !!document.getElementById('wf_c_words')?.checked
    });
    setElementValueAnimated('IPA_tBox', result);
  }, 10);
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dark mode
  initDarkMode('dark-mode-toggle');
  initResponsiveTextareaRows();

  // Initialize TTS button (French/France by default)
  initSpeakButton({ language: 'fr-FR' });

  // Set up input handler
  onTextInputChange('cWords_tBox', translate);

  // Set up variant radio handlers (IPA_fr_FR / IPA_fr_QC)
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
