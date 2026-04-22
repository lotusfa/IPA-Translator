/**
 * Esperanto IPA Translator - Refactored to use shared ipa-core module
 * Uses processTextLongestMatch for multi-word phrase matching
 */

import {
  loadIPADatabase,
  processTextLongestMatch,
  initDarkMode,
  initResponsiveTextareaRows,
  onTextInputChange,
  onMultipleChange,
  getElementValue,
  setElementValue,
  setElementValueAnimated,
  isElementChecked,
  initSpeakButton
} from '../js/ipa-core.js';

let IPA_DB = {};

/**
 * Load database (static path for Esperanto)
 */
function loadDatabase() {
  loadIPADatabase({
    basePath: '../json/eo.json',
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
 * Translate input text using longest-match algorithm
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

  // Initialize TTS button (Esperanto)
  // initSpeakButton({ language: 'eo' });

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
