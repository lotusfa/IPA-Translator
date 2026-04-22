/**
 * IPA Core - Shared utility module for IPA Translator
 * Provides common functions for all language implementations
 * 
 * Usage: Import specific functions in each language's main.js
 * Example: import { loadIPADatabase, processText } from './ipa-core.js';
 */

// ============================================
// Re-export format functions from format.js
// ============================================

export {
  formatIPA_num,
  formatIPA_org,
  formatJyutpingCantonese,
  formatJyutpingMandarin,
  formatJyutpingMandarinNum,
  formatJyutping,
  formatJyutping_num,
  formatIPAOutput,
  formatMandarinOutput,
  formatVietnamese,
  formatVietnameseOutput,
  formatYueOutput,
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu
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

  xmlhttp.onreadystatechange = function () {
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

  xmlhttp.onerror = function () {
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
    .replace(/[;:>"<`~!@#$%^&*()={}|\\[\]/.,?!]/g, "")
    .replace(/\s+/g, " ")
    .trim();
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
      result += withWords ? `( ${matchedWord} ${matchedIPA} ) ` : `${matchedIPA} `;
      i += wordLength;
    } else {
      result += input[i] + " ";
      i++;
    }
  }

  return result.trim();
}

/**
 * Process Vietnamese text with longest match word-based lookup
 * Optimized for Vietnamese language: splits by space, tries longest multi-word combinations
 * Uses greedy approach - matches longest possible phrase first
 * 
 * @param {object} options - Options:
 *   @param {string} options.input - Input Vietnamese text
 *   @param {object} options.lookupTable - IPA lookup table with word->IPA mappings
 *   @param {boolean} [options.withWords] - Show word:IPA format (default: false)
 *   @param {function} [options.onProgress] - Callback for progress updates
 * @returns {string} Processed result with IPA transcription
 */
export function processTextLongestMatch(options) {
  const {
    input,
    lookupTable,
    withWords = false,
    onProgress = null
  } = options;

  // Split text into words (Vietnamese uses spaces as word separators)
  const words = input.trim().split(/\s+/).filter(w => w.length > 0);

  if (words.length === 0) {
    return "";
  }

  let result = "";
  let i = 0;

  while (i < words.length) {
    let matchedIPA = null;
    let matchedWord = null;
    let matchLength = 0;

    // Try longest possible word combination first (greedy approach)
    // Vietnamese phrases can be multi-word, so we try from max length down to 1
    const maxComboLength = Math.min(5, words.length - i); // Limit to 5 words max

    for (let len = maxComboLength; len >= 1; len--) {
      const candidate = words.slice(i, i + len).join(" ");
      
      const candidatesToCheck = [
        candidate,
        preprocessText(candidate),
        preprocessText(candidate).toLowerCase()
      ];

      for (const key of candidatesToCheck) {
        if (lookupTable[key]) {
          matchedIPA = lookupTable[key];
          matchedWord = candidate;
          matchLength = len;
          break;
        }
      }

      if (matchedIPA) break;
    }

    if (matchedIPA) {
      result += withWords ? `( ${matchedWord} ${matchedIPA} ) ` : matchedIPA + " ";
      i += matchLength; // Skip all matched words
    } else {
      // No match found, keep original word
      result += words[i] + " ";
      i++;
    }

    if (onProgress) onProgress(result);
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
 * Set element value with fade-in animation for smoother visual transition
 * @param {string} elementId - Element ID
 * @param {string} value - Value to set
 * @param {number} animationDuration - Animation duration in ms (default: 300)
 */
export function setElementValueAnimated(elementId, value, animationDuration = 300) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.value = value;

  // Apply fade-in animation
  el.classList.add('ipa-fade-in');

  // Remove animation class after completion
  setTimeout(() => {
    el.classList.remove('ipa-fade-in');
  }, animationDuration);
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
    input.addEventListener("focus", function () {
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
// Text-to-Speech (TTS)
// ============================================

/**
 * Configuration for language-specific TTS settings
 */
const TTS_LANGUAGE_CONFIG = {
  // Cantonese / Chinese (Hong Kong)
  'zh-HK': { lang: 'zh-HK', rate: 0.9, pitch: 1.0, volume: 1.0 },
  // Chinese (Mainland)
  'zh-CN': { lang: 'zh-CN', rate: 0.9, pitch: 1.0, volume: 1.0 },
  // Chinese (Traditional)
  'zh-TW': { lang: 'zh-TW', rate: 0.9, pitch: 1.0, volume: 1.0 },
  // English (US)
  'en-US': { lang: 'en-US', rate: 1.0, pitch: 1.0, volume: 1.0 },
  // English (UK)
  'en-GB': { lang: 'en-GB', rate: 1.0, pitch: 1.0, volume: 1.0 },
  // French (France)
  'fr-FR': { lang: 'fr-FR', rate: 1.0, pitch: 1.0, volume: 1.0 },
  // French (Canada)
  'fr-CA': { lang: 'fr-CA', rate: 1.0, pitch: 1.0, volume: 1.0 },
  // Spanish (Spain)
  'es-ES': { lang: 'es-ES', rate: 1.0, pitch: 1.0, volume: 1.0 },
  // Spanish (Mexico)
  'es-MX': { lang: 'es-MX', rate: 1.0, pitch: 1.0, volume: 1.0 },
  // Mandarin
  'zh-CN-mandarin': { lang: 'zh-CN', rate: 0.95, pitch: 1.0, volume: 1.0 },
};

/**
 * Get TTS config for a language
 * @param {string} language - Language code (e.g., 'cantonese', 'english', 'zh-HK')
 * @returns {object} TTS configuration
 */
export function getTTSConfig(language) {
  // Map language names to ISO codes
  const langMap = {
    'cantonese': 'zh-HK',
    'zh': 'zh-CN',
    'chinese': 'zh-CN',
    'english': 'en-US',
    'en_US': 'en-US',
    'en_UK': 'en-GB',
    'french': 'fr-FR',
    'fr_FR': 'fr-FR',
    'fr_QC': 'fr-CA',
    'spanish': 'es-ES',
    'es_ES': 'es-ES',
    'es_MX': 'es-MX',
    'mandarin': 'zh-CN-mandarin',
    'vietnamese': 'vi-VN',
  };

  const langCode = langMap[language] || language;
  return TTS_LANGUAGE_CONFIG[langCode] || { lang: 'en-US', rate: 1.0, pitch: 1.0, volume: 1.0 };
}

/**
 * Speak text using Web Speech API
 * @param {object} options - TTS options:
 *   @param {string} options.text - Text to read aloud
 *   @param {string} [options.language] - Language code (default: 'en-US')
 *   @param {number} [options.rate] - Speech rate (0.1-10, default: 1.0)
 *   @param {number} [options.pitch] - Pitch (0-2, default: 1.0)
 *   @param {number} [options.volume] - Volume (0-1, default: 1.0)
 *   @param {function} [options.onError] - Error callback
 */
export function speakText(options) {
  const {
    text,
    language = 'en-US',
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
    onError = null
  } = options;

  if (!window.speechSynthesis) {
    const errorMsg = 'Browser does not support text-to-speech';
    console.warn(errorMsg);
    if (onError) onError(errorMsg);
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  window.speechSynthesis.speak(utterance);
}

/**
 * Speaker icon SVG paths
 */
const SPEAKER_ICON = {
  outer: 'M11 5L6 9H2v6h4l5 4V5z M15.54 8.46a5 5 0 0 1 0 7.07 M19.07 4.93a10 10 0 0 1 0 14.14',
  pause: 'M6 4h4v16H6z M14 4h4v16h-4z'
};

/**
 * Initialize TTS button handler
 * @param {object} options - Options:
 *   @param {string} options.buttonId - Speaker button element ID (default: 'speak-btn')
 *   @param {string} options.inputId - Input textarea element ID (default: 'cWords_tBox')
 *   @param {string} [options.language] - Language code for TTS
 *   @param {function} [options.customSpeak] - Custom speak function override
 */
export function initSpeakButton(options) {
  const {
    buttonId = 'speak-btn',
    inputId = 'cWords_tBox',
    language = 'en-US',
    customSpeak = null
  } = options;

  const speakBtn = document.getElementById(buttonId);
  const inputEl = document.getElementById(inputId);
  let isPlaying = false;

  // Get the SVG element inside the button
  const svg = speakBtn.querySelector('svg');
  if (!svg) return;

  // Get all path/rect elements
  const paths = svg.querySelectorAll('path, rect');
  let currentIcon = 'outer';

  function setIcon(iconType) {
    if (iconType === 'outer') {
      // Reset to speaker icon paths
      if (paths[0]) paths[0].setAttribute('d', SPEAKER_ICON.outer);
      // Remove rect elements if they exist from pause icon
      for (let i = 1; i < paths.length; i++) {
        if (paths[i].tagName === 'rect') {
          paths[i].remove();
        }
      }
    } else {
      // Reset to pause icon paths
      if (paths[0]) paths[0].setAttribute('d', SPEAKER_ICON.pause);
      // Remove other path elements
      for (let i = 1; i < paths.length; i++) {
        paths[i].remove();
      }
    }
  }

  // Set initial icon
  setIcon('outer');

  if (speakBtn && inputEl) {
    speakBtn.addEventListener('click', () => {
      const inputText = inputEl.value.trim();

      if (isPlaying) {
        // Stop playback and reset icon
        window.speechSynthesis.cancel();
        isPlaying = false;
        currentIcon = 'outer';
        setIcon('outer');
      } else if (inputText) {
        // Start playback
        if (customSpeak) {
          customSpeak(inputText);
        } else {
          const config = getTTSConfig(language);
          const utterance = new SpeechSynthesisUtterance(inputText);
          utterance.lang = config.lang;
          utterance.rate = config.rate;
          utterance.pitch = config.pitch;
          utterance.volume = config.volume;

          utterance.onend = () => {
            isPlaying = false;
            currentIcon = 'outer';
            setIcon('outer');
          };

          utterance.onerror = () => {
            isPlaying = false;
            currentIcon = 'outer';
            setIcon('outer');
          };

          window.speechSynthesis.speak(utterance);
        }

        isPlaying = true;
        currentIcon = 'pause';
        setIcon('pause');
      }
    });
  }
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
  toggle.addEventListener("click", function () {
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
// Language Navigation
// ============================================

/**
 * Generate and insert language buttons for "Other Languages" section
 * Reads from config/languages.json and dynamically builds the list
 * 
 * @param {object} options - Options:
 *   @param {string} options.containerId - ID of container element (default: "lang-buttons-container")
 *   @param {string} options.configPath - Path to languages.json config file (default: "../config/languages.json")
 *   @param {string} options.wrapperTag - HTML tag to wrap each item (default: "li")
 *   @param {function} [options.onSuccess] - Callback after successful generation
 *   @param {function} [options.onError] - Callback on error
 * 
 * Example usage:
 *   generateLanguageButtons({ containerId: "lang-list", configPath: "../config/languages.json" });
 */
export function generateLanguageButtons(options) {
  const {
    containerId = "lang-buttons-container",
    configPath = "../config/languages.json",
    wrapperTag = "li",
    onSuccess = null,
    onError = null
  } = options;

  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      try {
        const langConfig = JSON.parse(this.responseText);
        const container = document.getElementById(containerId);

        if (!container) {
          const errorMsg = `Container with ID "${containerId}" not found`;
          console.error(errorMsg);
          if (onError) onError(errorMsg);
          return;
        }

        const languages = langConfig.languages || [];
        let html = "";

        languages.forEach(lang => {
          const name = lang.name || lang.nativeName || lang.code;
          const href = lang.indexPath || "#";
          const isCurrent = lang.isActive === true;
          const style = isCurrent ? 'style="font-weight: bold; color: var(--accent-color);"' : "";

          html += `<${wrapperTag} ${style}><a href="${href}">${name}</a></${wrapperTag}>`;
        });

        container.innerHTML = html;

        if (onSuccess) onSuccess(languages);
      } catch (e) {
        const errorMsg = "Failed to parse language config: " + e.message;
        console.error(errorMsg);
        if (onError) onError(errorMsg);
      }
    } else if (this.readyState === 4) {
      const errorMsg = "Failed to load language config: " + this.status;
      console.error(errorMsg);
      if (onError) onError(errorMsg);
    }
  };

  xmlhttp.onerror = function () {
    const errorMsg = "Network error loading language config";
    console.error(errorMsg);
    if (onError) onError(errorMsg);
  };

  xmlhttp.open("GET", configPath, true);
  xmlhttp.send();
}

/**
 * Initialize language buttons on page load
 * Helper function to call generateLanguageButtons when DOM is ready
 * 
 * @param {object} options - Options for generateLanguageButtons
 */
export function initLanguageButtons(options) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      generateLanguageButtons(options);
    });
  } else {
    generateLanguageButtons(options);
  }
}

// ============================================
// Responsive Textarea Rows
// ============================================

/**
 * Set textarea rows based on screen width (mobile responsive)
 * Call this on page load to adjust rows for mobile devices
 * 
 * Usage: Call once on DOM ready: setResponsiveTextareaRows()
 * Or set specific values: setResponsiveTextareaRows({ cWords_tBox: 10, IPA_tBox: 10 })
 */
export function setResponsiveTextareaRows(options = {}) {
  // Check if mobile (768px or less)
  const isMobile = window.innerWidth <= 768;
  
  // Default rows
  const mobileRows = options.mobileRows || 5;
  const desktopRows = options.desktopRows || 10;
  
  // If no specific targets, apply to all textareas with ID containing '_tBox'
  const targets = options.targets || null;
  
  const textareas = targets 
    ? targets.map(id => document.getElementById(id)).filter(el => el)
    : document.querySelectorAll('textarea[id$="_tBox"]');
  
  textareas.forEach(textarea => {
    textarea.rows = isMobile ? mobileRows : desktopRows;
  });
}

/**
 * Initialize responsive textarea rows on DOM ready
 * Automatically calls setResponsiveTextareaRows and re-checks on resize
 */
export function initResponsiveTextareaRows(options = {}) {
  const isMobile = window.innerWidth <= 768;
  const mobileRows = options.mobileRows || 5;
  const desktopRows = options.desktopRows || 10;
  const targets = options.targets || null;
  
  const getAllTargets = () => targets 
    ? targets.map(id => document.getElementById(id)).filter(el => el)
    : document.querySelectorAll('textarea[id$="_tBox"]');
  
  // Set initial rows
  getAllTargets().forEach(textarea => {
    textarea.rows = isMobile ? mobileRows : desktopRows;
  });
  
  // Re-check on window resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const nowIsMobile = window.innerWidth <= 768;
      getAllTargets().forEach(textarea => {
        textarea.rows = nowIsMobile ? mobileRows : desktopRows;
      });
    }, 250);
  });
}
