/**
 * Vietnamese IPA Translator - Implemented with longest-match algorithm
 * Optimized for Vietnamese language which uses space-separated words
 */

import {
  loadIPADatabase,
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
 * Build Vietnamese lookup table with normalized (lowercase) keys
 * This enables case-insensitive lookup for Vietnamese text
 * 
 * @param {object} rawLookup - Raw lookup from ipa-core
 * @returns {object} Normalized lookup with lowercase keys
 */
function buildVietnameseLookup(rawLookup) {
  const normalized = {};
  
  // Normalize all keys to lowercase for case-insensitive matching
  Object.keys(rawLookup).forEach(key => {
    const lowerKey = key.toLowerCase();
    normalized[lowerKey] = rawLookup[key];
  });
  
  return normalized;
}

/**
 * Vietnamese longest-match word-based translation
 * 
 * Uses greedy algorithm to find longest matching phrases first.
 * This handles both single words and multi-word phrases like "a la hán", "phiên âm"
 * 
 * @param {string} input - Input Vietnamese text
 * @param {object} lookup - Normalized lookup table (lowercase keys)
 * @param {boolean} withWords - Show word:IPA format
 * @returns {string} IPA result
 */
function translateVietnamese(input, lookup, withWords = false) {
  // Normalize input: lowercase, trim, collapse whitespace
  const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ');
  if (!normalized) return '';
  
  const words = normalized.split(' ');
  let result = '';
  let i = 0;
  
  while (i < words.length) {
    let bestMatch = null;
    let bestLength = 0;
    let bestIPA = null;
    
    // Try to match longest phrase starting from current position
    // Maximum phrase length: 5 words (covers most Vietnamese multi-word phrases)
    const maxPhraseLen = Math.min(5, words.length - i);
    
    // Greedy match: try phrases from longest to shortest
    for (let len = maxPhraseLen; len >= 1; len--) {
      const candidate = words.slice(i, i + len).join(' ');
      
      // Check if this exact phrase exists in database
      if (lookup[candidate]) {
        bestMatch = candidate;
        bestLength = len;
        bestIPA = lookup[candidate];
        break; // Found longest match, exit loop
      }
    }
    
    // Apply match or output original word
    if (bestMatch) {
      if (withWords) {
        result += `( ${bestMatch} : ${bestIPA} ) `;
      } else {
        result += bestIPA + ' ';
      }
      i += bestLength;
    } else {
      // No match found, output word as-is
      result += words[i] + ' ';
      i++;
    }
  }
  
  return result.trim();
}

/**
 * Load database with variant selection (vi_C/vi_N/vi_S)
 */
function loadDatabase() {
  const variant = currentVariant;
  loadIPADatabase({
    basePath: `../json/${variant}.json`,
    onSuccess: (rawLookup) => {
      // Build normalized lookup table for case-insensitive search
      IPA_DB = buildVietnameseLookup(rawLookup);
      translate();
    },
    onError: (err) => {
      console.error('Failed to load database:', err);
      setElementValue('IPA_tBox', 'Error loading database');
    }
  });
}

/**
 * Translate input text using Vietnamese-specific longest-match algorithm
 */
function translate() {
  const input = getElementValue('cWords_tBox');
  setElementValue('IPA_tBox', 'loading....');
  
  // Small timeout to allow UI to update before processing
  setTimeout(() => {
    const withWords = isElementChecked('wf_c_words');
    const result = translateVietnamese(input, IPA_DB, withWords);
    
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
  variantRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      currentVariant = this.value;
      loadDatabase();
    });
  });
  
  // Initial loading
  loadDatabase();
});
