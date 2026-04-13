/**
 * IPA Core - Shared utility module for IPA Translator
 * Provides common functions for all language implementations
 * 
 * Usage: Import specific functions in each language's main.js
 * Example: import { loadIPADatabase, processText } from './ipa-core.js';
 */

// ============================================
// Re-export format functions from format-jyutping
// ============================================

export {
  formatIPA_num,
  formatIPA_org,
  formatJyutping,
  formatIPAOutput
} from './format.js';

// ============================================
// Data Loading
// ============================================

/**
 * Load IPA database from JSON file with error handling
 * Simply loads the JSON and normalizes using the first key
 * 
 * @param {object} options - Configuration object:
 *   @param {string} options.basePath - Base path to JSON file (e.g., "../json/yue.json")
 *   @param {function} options.onSuccess - Callback with normalized lookup object
 *   @param {function} [options.onError] - Optional error callback
 * 
 * Example usage:
 *   loadIPADatabase({ basePath: '../json/yue.json', onSuccess: (data) => { ... } });
 */
export function loadIPADatabase(options) {
  const { basePath, onSuccess, onError } = options;
  
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var langData = JSON.parse(this.responseText);
      const lookup = normalizeIPAData(langData);
      onSuccess(lookup);
    } else if (this.readyState == 4) {
      const errorMsg = "Failed to load database: " + this.status;
      console.error(errorMsg);
      if (onError) onError(errorMsg);
    }
  };
  
  xmlhttp.onerror = function() {
    const errorMsg = "Network error loading IPA database";
    console.error(errorMsg);
    if (onError) onError(errorMsg);
  };

  xmlhttp.open("GET", basePath, true);
  xmlhttp.send();
}

/**
 * Normalize IPA data from JSON format into a flat lookup object
 * Simply gets the first key from the JSON and uses its array
 * This works universally for all single-key formats: "yue", "en_US", "zh_hans", etc.
 * 
 * @param {object} langData - Raw JSON data
 * @returns {object} Flat lookup object: { word: ipa, char: ipa }
 */
export function normalizeIPAData(langData) {
  const normalized = {};
  
  // Get the first (and typically only) key from the JSON
  // This works for all single-key formats: "yue", "en_US", "zh_hans", etc.
  const firstKey = Object.keys(langData)[0];
  const dataArray = firstKey ? langData[firstKey] : [];
  
  // Flatten into lookup object
  if (Array.isArray(dataArray)) {
    dataArray.forEach(entry => {
      Object.keys(entry).forEach(key => {
        normalized[key] = entry[key];
      });
    });
  }
  
  return normalized;
}

// ============================================
// Text Processing
// ============================================

/**
 * Clean and preprocess input text
 * @param {string} text - Raw input text
 * @returns {string} Cleaned text
 */
export function preprocessText(text) {
  return text
    .toLowerCase()
    .replace(/[;:>"<`~!@#$%^&*()={}|\\[\]/.,?!]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Process text with word-based lookup (for European languages)
 * Splits by space and processes each word
 * 
 * @param {object} options - Options:
 *   @param {string} options.input - Input text
 *   @param {object} options.lookupTable - IPA lookup table
 *   @param {boolean} [options.withWords] - Show word:ipa format (default: false)
 *   @param {function} [options.onProgress] - Callback for progress updates
 * @returns {string} Processed result
 */
export function processTextWordBased(options) {
  const { input, lookupTable, withWords = false, onProgress = null } = options;
  
  const words = input.split(" ").filter(w => w.length > 0);
  let result = "";
  
  for (let i = 0; i < words.length; i++) {
    const word = preprocessText(words[i]);
    
    if (word && lookupTable[word]) {
      const ipa = lookupTable[word];
      result += withWords ? `( ${words[i]} : ${ipa} ) ` : ipa + " ";
    } else {
      result += words[i] + " ";
    }
    
    if (onProgress) onProgress(result);
  }
  
  return result.trim();
}

/**
 * Process text with character-based lookup and optional multi-char word search
 * (for CJK languages like Chinese, Japanese)
 * 
 * @param {object} options - Options:
 *   @param {string} options.input - Input text
 *   @param {object} options.lookupTable - IPA lookup table
 *   @param {boolean} [options.withWords] - Show word:ipa format (default: false)
 *   @param {boolean} [options.allowWordSearch] - Enable multi-char matching (default: false)
 *   @param {number} [options.maxWordLength] - Max word length for matching (default: 6)
 * @returns {string} Processed result
 */
export function processTextCharBased(options) {
  const { 
    input, 
    lookupTable, 
    withWords = false, 
    allowWordSearch = false, 
    maxWordLength = 6 
  } = options;
  
  let result = "";
  let i = 0;
  
  while (i < input.length) {
    let matchedWord = null;
    let matchedIPA = null;
    let wordLength = 0;
    
    // Try multi-character word matching first
    if (allowWordSearch) {
      for (let len = maxWordLength; len >= 1; len--) {
        if (i + len <= input.length) {
          const word = input.substring(i, i + len);
          if (lookupTable[word]) {
            matchedWord = word;
            matchedIPA = lookupTable[word];
            wordLength = len;
            break;
          }
        }
      }
    }
    
    // Fall back to single character
    if (!matchedWord) {
      const char = input[i];
      if (lookupTable[char]) {
        matchedWord = char;
        matchedIPA = lookupTable[char];
        wordLength = 1;
      }
    }
    
    // Add result
    if (matchedWord) {
      result += withWords ? `( ${matchedWord} ${matchedIPA} ) ` : `/${matchedIPA}/ `;
      i += wordLength;
    } else {
      result += input[i] + " ";
      i++;
    }
  }
  
  return result.trim();
}

// ============================================
// DOM Utilities
// ============================================

/**
 * Safely get DOM element value
 * @param {string} elementId - Element ID
 * @returns {string} Element value or empty string
 */
export function getElementValue(elementId) {
  const el = document.getElementById(elementId);
  return el ? el.value : "";
}

/**
 * Safely set DOM element value
 * @param {string} elementId - Element ID
 * @param {string} value - Value to set
 */
export function setElementValue(elementId, value) {
  const el = document.getElementById(elementId);
  if (el) el.value = value;
}

/**
 * Check if element exists and is checked (for checkboxes/radios)
 * @param {string} elementId - Element ID
 * @returns {boolean} Whether element exists and is checked
 */
export function isElementChecked(elementId) {
  const el = document.getElementById(elementId);
  return el && el.checked;
}

// ============================================
// Event Helpers
// ============================================

/**
 * Add input handler that triggers translation
 * @param {string} inputId - Input textarea element ID
 * @param {function} handler - Handler function
 */
export function onTextInputChange(inputId, handler) {
  const input = document.getElementById(inputId);
  if (input) {
    input.addEventListener("input", handler);
    
    // Select all on focus
    input.addEventListener("focus", function() {
      this.select();
    });
  }
}

/**
 * Add change handler to multiple radio/checkbox elements
 * @param {string} selector - CSS selector for elements
 * @param {function} handler - Handler function
 */
export function onMultipleChange(selector, handler) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.addEventListener("change", handler);
  });
}

// ============================================
// Dark Mode
// ============================================

/**
 * Initialize dark mode toggle functionality
 * @param {string} toggleId - Toggle button element ID
 */
export function initDarkMode(toggleId) {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;
  
  const iconImg = toggle.querySelector(".icon");
  const savedTheme = localStorage.getItem("theme");
  
  // Set initial state
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (iconImg) iconImg.src = "../img/dark-mode.svg";
  } else {
    if (iconImg) iconImg.src = "../img/light-mode.svg";
  }
  
  // Add click handler
  toggle.addEventListener("click", function() {
    toggle.classList.add("btn-theme-transition");
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    
    if (iconImg) {
      iconImg.src = isDark ? "../img/dark-mode.svg" : "../img/light-mode.svg";
    }
    
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}
