/**
 * Japanese IPA Translator - Refactored to use shared ipa-core module
 */

import {
  loadIPADatabase,
  processTextCharBased,
  initDarkMode,
  onTextInputChange,
  setElementValue,
  isElementChecked
} from '../js/ipa-core.js';

let IPA_DB = {};

/**
 * Load database (static path for Japanese)
 */
function loadDatabase() {
  loadIPADatabase({
    basePath: '../json/ja.json',
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
  setElementValue('IPA_tBox', 'loading....');

  setTimeout(() => {
    const result = processTextCharBased({
      input,
      lookupTable: IPA_DB,
      withWords: isElementChecked('wf_c_words'),
      allowWordSearch: isElementChecked('allow_words_search'),
      maxWordLength: 6
    });
    setElementValue('IPA_tBox', result);
  }, 10);
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const cWords_tBox = document.getElementById('cWords_tBox');
  const wf_c_words = document.getElementById('wf_c_words');
  const allow_words_search = document.getElementById('allow_words_search');

  // Initialize dark mode
  initDarkMode('dark-mode-toggle');

  // Set up input handler
  onTextInputChange('cWords_tBox', translate);

  // Set up checkbox handlers
  if (wf_c_words) {
    wf_c_words.addEventListener('change', translate);
  }
  if (allow_words_search) {
    allow_words_search.addEventListener('change', translate);
  }

  // Initial loading
  loadDatabase();
});
