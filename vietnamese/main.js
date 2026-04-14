/**
 * Vietnamese IPA Translator - Implemented with longest-match algorithm
 * Optimized for Vietnamese language which uses space-separated words
 */

import {
  loadIPADatabase,
  processTextLongestMatch,
  formatVietnamese,
  formatVietnameseOutput,
  getElementValue,
  setElementValue,
  isElementChecked,
  onTextInputChange,
  onMultipleChange,
  initDarkMode
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
    onSuccess: (rawLookup) => {
      IPA_DB = rawLookup;
      translate();
    },
    onError: (err) => {
      console.error('Failed to load database:', err);
      setElementValue('IPA_tBox', 'Error loading database');
    }
  });
}

/**
 * Translate input text using Vietnamese longest-match algorithm
 * Uses shared processTextLongestMatch from ipa-core
 */
function translate() {
  const input = getElementValue('cWords_tBox');
  setElementValue('IPA_tBox', 'loading....');

  // Use shared processTextLongestMatch from ipa-core
  setTimeout(() => {
    const withWords = isElementChecked('wf_c_words');
    const result = processTextLongestMatch({
      input: input,
      lookupTable: IPA_DB,
      withWords: withWords
    });

    // Apply format transformation (IPA_org, IPA_num)
    const formatted = formatVietnameseOutput(result);
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
  variantRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      currentVariant = this.value;
      loadDatabase();
    });
  });

  // Initial loading
  loadDatabase();
});
