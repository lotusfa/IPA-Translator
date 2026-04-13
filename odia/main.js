/**
 * Odia IPA Translator - Refactored to use shared ipa-core module
 */

import {
  loadIPADatabase,
  processTextCharBased,
  formatIPAOutput,
  preprocessText,
  onTextInputChange,
  onMultipleChange,
  initDarkMode,
  setElementValue
} from '../js/ipa-core.js';

let IPA_DB = {};

/**
 * Load database (static path for Odia)
 */
function loadDatabase() {
  loadIPADatabase({
    basePath: '../json/or.json',
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
  const input = document.getElementById('cWords_tBox').value;
  document.getElementById('IPA_tBox').value = 'loading....';
  
  // Small delay to allow UI to update before processing
  setTimeout(() => {
    const processed = processTextCharBased({
      input,
      lookupTable: IPA_DB,
      withWords: document.getElementById('wf_c_words') && document.getElementById('wf_c_words').checked,
      allowWordSearch: document.getElementById('allow_words_search') && document.getElementById('allow_words_search').checked,
      maxWordLength: 6
    });
    
    // Apply format transformation (IPA_org, IPA_num)
    const output = formatIPAOutput({
      processed,
      format: document.querySelector('input[name="outputFormat"]:checked')?.value || 'IPA_org'
    });
    
    setElementValue('IPA_tBox', output);
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
  
  // Set up output format radio buttons
  onMultipleChange('input[name="outputFormat"]', translate);
  
  // Set up word format checkbox
  const wf_c_words = document.getElementById('wf_c_words');
  if (wf_c_words) {
    wf_c_words.addEventListener('change', translate);
  }
  
  // Initial loading
  loadDatabase();
});
