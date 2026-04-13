/**
 * English IPA Translator - Refactored to use shared ipa-core module
 */

import {
  loadIPADatabase,
  processTextWordBased,
  preprocessText,
  initDarkMode,
  onTextInputChange,
  onMultipleChange,
  getElementValue,
  setElementValue,
  isElementChecked
} from '../js/ipa-core.js';

let IPA_DB = {};

/**
 * Load database with dynamic variant selection (en_US/en_UK)
 */
function loadDatabase() {
  const variant = document.getElementById('IPA_US').checked ? 'US' : 'UK';
  loadIPADatabase({
    basePath: `../json/en_${variant}.json`,
    onSuccess: (lookup) => {
      IPA_DB = lookup;
      translate();
    },
    onError: (err) => {
      console.error('Failed to load database:', err);
      setElementValue('IPA_tBox', 'Error loading database');
    }
  });
}

/**
 * Translate input text
 */
function translate() {
  const input = getElementValue('cWords_tBox');
  setElementValue('IPA_tBox', 'loading....');
  
  // Small timeout to allow UI to update before processing
  setTimeout(() => {
    const result = processTextWordBased({
      input,
      lookupTable: IPA_DB,
      withWords: isElementChecked('wf_c_words')
    });
    setElementValue('IPA_tBox', result);
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
  
  // Set up radio button handlers for variant selection
  onMultipleChange('input[name="inlineRadioOptions"]', loadDatabase);
  
  // Set up word format checkbox
  const wf_c_words = document.getElementById('wf_c_words');
  if (wf_c_words) {
    wf_c_words.addEventListener('change', translate);
  }
  
  // Initial loading
  loadDatabase();
});
