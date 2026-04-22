/**
 * Mandarin IPA Translator - Refactored to use shared ipa-core module
 */

import {
  loadIPADatabase,
  processTextCharBased,
  initDarkMode,
  initResponsiveTextareaRows,
  onTextInputChange,
  onMultipleChange,
  setElementValue,
  setElementValueAnimated,
  initSpeakButton
} from '../js/ipa-core.js';

import { formatMandarinOutput } from '../js/zh.format.js';

let IPA_DB = {};
let formatOption = 'IPA_num';
let zhTypeOption = 'zh_type1';

/**
 * Load database with variant selection
 */
function loadDatabase() {
  const variant = zhTypeOption === 'zh_type1' ? 'zh_hant' : 'zh_hans';
  loadIPADatabase({ 
    basePath: `../json/${variant}.json`, 
    onSuccess: (lookup) => { IPA_DB = lookup; translate(); } 
  });
}

/**
 * Translate input text
 */
function translate() {
  const cWordsBox = document.getElementById('cWords_tBox');
  const ipaBox = document.getElementById('IPA_tBox');
  if (!cWordsBox || !ipaBox) return;

  const input = cWordsBox.value;
  setElementValue('IPA_tBox', 'loading....');

  setTimeout(() => {
    const result = processTextCharBased({
      input,
      lookupTable: IPA_DB,
      withWords: !!document.getElementById('wf_c_words')?.checked,
      allowWordSearch: !!document.getElementById('allow_words_search')?.checked,
      maxWordLength: 6
    });
    // Use formatMandarinOutput for Mandarin-specific formatting (tone diacritics or numbers)
    setElementValue('IPA_tBox', formatMandarinOutput(result));
  }, 10);
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dark mode
  initDarkMode('dark-mode-toggle');
  initResponsiveTextareaRows();

  // Initialize TTS button (Mandarin Chinese)
  initSpeakButton({ language: 'zh-CN' });

  // Set up input handler
  onTextInputChange('cWords_tBox', translate);
  
  // Set up Format radio handlers
  onMultipleChange('input[name="format"]', (e) => { formatOption = e.target.id; translate(); });
  
  // Set up 繁/簡 radio handlers
  onMultipleChange('input[name="zhTypeOption"]', (e) => { zhTypeOption = e.target.id; loadDatabase(); });
  
  // Set up checkbox handlers
  const wf_c_words = document.getElementById('wf_c_words');
  if (wf_c_words) {
    wf_c_words.addEventListener('change', translate);
  }
  const allow_words_search = document.getElementById('allow_words_search');
  if (allow_words_search) {
    allow_words_search.addEventListener('change', translate);
  }

  // Initial loading
  loadDatabase();
});
