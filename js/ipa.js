/**
 * IPA Core - Shared utility module for IPA Translator
 * Provides common functions for all language implementations
 *
 * Usage: Import specific functions in each language's main.js
 * Example: import { loadIPADatabase, processText } from './ipa-core.js';
 */

// ============================================
// Re-export Cantonese format functions from yue.format.js
// ============================================

export {
  formatIPA_org as formatCantoneseIPA_org,
  formatIPA_num as formatCantoneseIPA_num,
  formatJyutpingCantonese,
  formatJyutping,
  formatJyutping_num,
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu,
  formatYueOutput
} from './yue.format.js';

// ============================================
// Re-export Mandarin format functions from zh.format.js
// ============================================

export {
  formatIPA_num as formatMandarinIPA_num,
  formatIPA_org as formatMandarinIPA_org,
  formatJyutpingMandarin,
  formatMandarinOutput,
  convertIPATextToPinyin,
  convertIPATextToPinyinWithMarks,
  convertIPATextToZhuyin
} from './zh.format.js';

// ============================================
// Re-export formatJyutpingMandarinNum from yue.format.js
// (defined there for historical reasons)
// ============================================

export {
  formatJyutpingMandarinNum
} from './yue.format.js';

// ============================================
// Re-export Vietnamese format functions from vi.format.js
// ============================================

export {
  formatVietnamese,
  formatVietnameseOutput,
  formatVietnameseStandard,
  formatIPANumbers
} from './vi.format.js';

// ============================================
// Re-export TTS functions from tts.js
// ============================================

export {
  initSpeakButton
} from './tts.js';
// ============================================
// Re-export shared utilities from utils.js
// ============================================

export {
  loadIPADatabase,
  normalizeIPAData,
  getElementValue,
  setElementValue,
  setElementValueAnimated,
  isElementChecked,
  onTextInputChange,
  onMultipleChange
} from './utils.js';


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
 *   @param {boolean} [options.pairsOnly] - Return [[word, ipa], ...] array instead of string (default: false)
 * @returns {string|string[][]} Processed result or pairs array
 */
export function processTextCharBased(options) {
  const {
    input,
    lookupTable,
    withWords = false,
    allowWordSearch = false,
    maxWordLength = 6,
    pairsOnly = false
  } = options;

  let result = "";
  let pairs = [];
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
      if (pairsOnly) pairs.push([matchedWord, matchedIPA]);
      i += wordLength;
    } else {
      result += input[i] + " ";
      i++;
    }
  }

  if (pairsOnly) return { result: result.trim(), pairs };
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
 *   @param {boolean} [options.pairsOnly] - Return [[word, ipa], ...] array instead of string (default: false)
 * @returns {string|string[][]} Processed result or pairs array
 */
export function processTextLongestMatch(options) {
  const {
    input,
    lookupTable,
    withWords = false,
    onProgress = null,
    pairsOnly = false
  } = options;

  // Split text into words (Vietnamese uses spaces as word separators)
  const words = input.trim().split(/\s+/).filter(w => w.length > 0);

  if (words.length === 0) {
    return pairsOnly ? [] : "";
  }

  let result = "";
  let pairs = [];
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
      if (pairsOnly) pairs.push([matchedWord, matchedIPA]);
      i += matchLength; // Skip all matched words
    } else {
      // No match found, keep original word
      result += words[i] + " ";
      i++;
    }

    if (onProgress) onProgress(result);
  }

  if (pairsOnly) return { result: result.trim(), pairs };
  return result.trim();
}

// ============================================
// Event Helpers (re-exported from core.js above)
// ============================================

// Export UI functions from ui.js for backward compatibility
export {
  initDarkMode,
  generateLanguageButtons,
  initLanguageButtons,
  initResponsiveTextareaRows
} from './ui.js';
