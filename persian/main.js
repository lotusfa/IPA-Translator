/**
 * Persian IPA Translator - Refactored to use shared ipa-core module
 */

import {
  loadIPADatabase,
  processTextLongestMatch,
  initDarkMode,
  onTextInputChange,
  getElementValue,
  setElementValue,
  isElementChecked
} from '../js/ipa-core.js';

let IPA_DB = {};

/**
 * Load database (static path for Persian)
 */
function loadDatabase() {
  loadIPADatabase({
    basePath: '../json/fa.json',
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

  setTimeout(() => {
    const result = processTextLongestMatch({
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

  // Set up word format checkbox
  const wf_c_words = document.getElementById('wf_c_words');
  if (wf_c_words) {
    wf_c_words.addEventListener('change', translate);
  }

  // Initial loading
  loadDatabase();
});
