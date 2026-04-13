/**
 * Cantonese IPA Translator - Refactored to use shared ipa-core module
 */

import {
  loadIPADatabase,
  processTextCharBased,
  formatIPAOutput,
  preprocessText,
  onTextInputChange,
  onMultipleChange,
  initDarkMode
} from '../js/ipa-core.js';

let IPA_DB = {};

/**
 * Load database (static path for Cantonese)
 */
function loadDatabase() {
  loadIPADatabase({
    basePath: '../json/yue.json',
    onSuccess: (lookup) => {
      IPA_DB = lookup;
      translate();
    },
    onError: (err) => {
      console.error('Failed to load database:', err);
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
    
    // Apply format transformation (IPA_org, IPA_num, Jyutping, Jyutping_num)
    const formatted = formatIPAOutput(processed);
    document.getElementById('IPA_tBox').value = formatted;
  }, 10);
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const wf_c_words = document.getElementById('wf_c_words');
  const allow_words_search = document.getElementById('allow_words_search');
  const formatRadios = document.querySelectorAll('input[name="format"]');
  
  // Initialize dark mode
  initDarkMode('dark-mode-toggle');
  
  // Set up input handler
  onTextInputChange('cWords_tBox', translate);
  
  // Set up format radio handlers
  onMultipleChange('input[name="format"]', translate);
  
  // Set up checkbox handlers
  if (wf_c_words) {
    wf_c_words.addEventListener('change', translate);
  }
  if (allow_words_search) {
    allow_words_search.addEventListener('change', translate);
  }
  
  // Initial load
  loadDatabase();
});
