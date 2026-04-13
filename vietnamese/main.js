/**
 * Vietnamese IPA Translator - Refactored to use shared ipa-core module
 */

import {
  loadIPADatabase,
  processTextCharBased,
  formatVietnameseOutput,
  onTextInputChange,
  onMultipleChange,
  initDarkMode,
  getElementValue,
  setElementValue,
  isElementChecked
} from '../js/ipa-core.js';

let IPA_DB = {};
let currentVariant = "vi_C"; // Default to Central Vietnamese

/**
 * Load database with variant selection (vi_C/vi_N/vi_S)
 */
function loadDatabase() {
  const variant = currentVariant;
  loadIPADatabase({
    basePath: `../json/${variant}.json`,
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
    const processed = processTextCharBased({
      input,
      lookupTable: IPA_DB,
      withWords: isElementChecked('wf_c_words'),
      allowWordSearch: isElementChecked('allow_words_search'),
      maxWordLength: 6
    });
    
    // Apply format transformation (IPA_org, IPA_num)
    const formatted = formatVietnameseOutput(processed);
    setElementValue('IPA_tBox', formatted);
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
  const variantRadios = document.querySelectorAll('input[name="variant"]');
  
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
  
  // Update on variant change and reload data
  variantRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      currentVariant = this.value;
      loadDatabase();
    });
  });
  
  // Initial loading
  loadDatabase();
});
