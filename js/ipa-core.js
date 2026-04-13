/**
 * IPA Core - Shared utility module for IPA Translator
 * Provides common functions for all language implementations
 * 
 * Usage: Import specific functions in each language's main.js
 * Example: import { loadIPADatabase, processText } from './ipa-core.js';
 */

// ============================================
// Data Loading
// ============================================

/**
 * Load IPA database from JSON file with error handling
 * Supports both static paths and dynamic variant selection
 * 
 * @param {object} options - Configuration object:
 *   @param {string} options.basePath - Base path to JSON file (e.g., "../json/en" or "../json/yue.json")
 *   @param {string} [options.variantKey] - Optional static variant key (e.g., "en_US")
 *   @param {function} [options.getVariant] - Callback to get variant dynamically from DOM
 *   @param {function} options.onSuccess - Callback with normalized lookup object
 *   @param {function} [options.onError] - Optional error callback
 * 
 * Example usage:
 *   // Static path
 *   loadIPADatabase({ basePath: '../json/yue.json', onSuccess: (data) => { ... } });
 *   
 *   // Dynamic variant (en_US/en_UK)
 *   loadIPADatabase({
 *     basePath: '../json/en',
 *     getVariant: () => document.getElementById('IPA_US').checked ? 'US' : 'UK',
 *     onSuccess: (data) => { ... }
 *   });
 */
export function loadIPADatabase(options) {
  const { basePath, variantKey, getVariant, onSuccess, onError } = options;
  
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var langData = JSON.parse(this.responseText);
      // Determine variant: use variantKey if provided, otherwise call getVariant callback
      const variant = variantKey || (getVariant ? getVariant() : null);
      const lookup = normalizeIPAData(langData, variant);
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

  // Determine the JSON path
  let jsonPath;
  if (getVariant) {
    const variant = getVariant();
    // Handle paths like "../json/en" -> "../json/en_US.json" or "../json/en_UK.json"
    const base = basePath.replace(/\.json$/, '');
    jsonPath = base + '_' + variant + '.json';
  } else if (variantKey) {
    // Static variant: "../json/en" + "_US" + ".json" = "../json/en_US.json"
    const base = basePath.replace(/\.json$/, '');
    jsonPath = base + '_' + variantKey + '.json';
  } else {
    jsonPath = basePath;
  }
  
  xmlhttp.open("GET", jsonPath, true);
  xmlhttp.send();
}

/**
 * Normalize IPA data from JSON format into a flat lookup object
 * Supports both single-key and multi-variant formats
 * 
 * @param {object} langData - Raw JSON data
 * @param {string|null} [variantKey] - Optional variant key (e.g., 'en_US', 'zh_hans', 'yue')
 * @returns {object} Flat lookup object: { word: ipa, char: ipa }
 */
export function normalizeIPAData(langData, variantKey = null) {
  const normalized = {};
  
  // Get the appropriate data array
  let dataArray;
  if (variantKey && langData[variantKey]) {
    dataArray = langData[variantKey];
  } else if (variantKey) {
    // Fallback for zh_hans/zh_hant pattern
    const fallbackKey = variantKey === 'zh_hans' ? 'zh_hant' : 'zh_hans';
    dataArray = langData[fallbackKey] || [];
  } else {
    // Single-key format: get first key's value
    const firstKey = Object.keys(langData)[0];
    dataArray = firstKey ? langData[firstKey] : [];
  }
  
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
// Format Transformations (for Cantonese/Mandarin)
// ============================================

/**
 * Format IPA number tones (˥→5, ˧→3, ˨→2, ˩→1, remove :)
 * @param {string} text - Input IPA text
 * @returns {string} Formatted text
 */
export function formatIPA_num(text) {
  return text
    .replace(/˥/g, "5")
    .replace(/˧/g, "3")
    .replace(/˨/g, "2")
    .replace(/˩/g, "1")
    .replace(/:/g, "");
}

/**
 * Format original IPA (no transformation)
 * @param {string} text - Input IPA text
 * @returns {string} Original text
 */
export function formatIPA_org(text) {
  return text;
}

/**
 * Format to Jyutping with tone marks (ˉ, ˊ, ˇ, ˋ, ˙)
 * @param {string} text - Input IPA text
 * @returns {string} Jyutping formatted text
 */
export function formatJyutping(text) {
  return text
    .replace(/˥˥/g, "ˉ")
    .replace(/˧˥/g, "ˊ")
    .replace(/˨˩˦/g, "ˇ")
    .replace(/˨˩˩/g, "ˇ")
    .replace(/˥˩/g, "ˋ")
    .replace(/˥˧/g, "ˋ")
    .replace(/˨˩/g, "˙")
    .replace(/˧˩/g, "˙")
    .replace(/˦˩/g, "˙")
    .replace(/˩˩/g, "˙")
    .replace(/˧/g, "˙")
    .replace(/:/g, "");
}

/**
 * Format to Jyutping with numeric tones (1-6)
 * Combines formatJyutping with tone number conversion
 * @param {string} text - Input IPA text
 * @returns {string} Jyutping numeric formatted text
 */
export function formatJyutping_num(text) {
  let x = formatJyutping(text);
  return x
    .replace(/ˉ/g, "1")
    .replace(/ˊ/g, "2")
    .replace(/ˇ/g, "3")
    .replace(/ˋ/g, "4")
    .replace(/˙/g, "˙");
}

/**
 * Get active format from radio buttons and apply transformation
 * Auto-detects which format radio button is checked
 * 
 * @param {string} text - Text to format
 * @param {object} [options] - Options (reserved for future use)
 * @returns {string} Formatted text
 */
export function formatIPAOutput(text, options = {}) {
  // Check for radio elements by ID (backward compatible with existing HTML)
  const IPA_num = document.getElementById('IPA_num');
  const IPA_org = document.getElementById('IPA_org');
  const Jyutping = document.getElementById('Jyutping');
  const Jyutping_num = document.getElementById('Jyutping_num');
  
  if (IPA_num && IPA_num.checked) {
    return formatIPA_num(text);
  } else if (Jyutping_num && Jyutping_num.checked) {
    return formatJyutping_num(text);
  } else if (Jyutping && Jyutping.checked) {
    return formatJyutping(text);
  } else if (IPA_org && IPA_org.checked) {
    return formatIPA_org(text);
  }
  
  // Default: return original
  return formatIPA_org(text);
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

// ============================================
// Vietnamese Format Transformations
// ============================================

/**
 * Vietnamese-specific format IPA number tones
 * Different tone mapping for Vietnamese compared to Cantonese/Mandarin
 * @param {string} text - Input IPA text
 * @returns {string} Formatted text
 */
export function formatIPA_num_vi(text) {
  return text
    .replace(/˧˥/g, "5")
    .replace(/˧/g, "3")
    .replace(/˨˩/g, "4")
    .replace(/˩/g, "1")
    .replace(/˧˧/g, "3")
    .replace(/˦˥/g, "6")
    .replace(/˦/g, "4")
    .replace(/˧˩/g, "4")
    .replace(/˨˧/g, "5")
    .replace(/˥/g, "1")
    .replace(/:/g, "");
}
