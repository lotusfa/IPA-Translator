/**
 * IPA Core - Text processing functions
 *
 * Language-specific formatters should be imported directly from js/format/[lang].format.js
 * to avoid loading unused modules.
 */

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

/**
 * Process Khmer text using Intl.Segmenter for smart word breaking
 * This handles the "no-space" nature of Khmer and keeps clusters together.
 * * @param {object} options - Options:
 * @param {string} options.input - Input Khmer text
 * @param {object} options.lookupTable - IPA lookup table (km.json)
 * @param {boolean} [options.withWords] - Show word:ipa format
 * @param {boolean} [options.pairsOnly] - Return array of [word, ipa]
 * @returns {string|object} Processed result
 */
export function processKhmerText(options) {
  const { input, lookupTable, withWords = false, pairsOnly = false } = options;

  // 1. Clean hidden characters
  const sanitizedInput = input.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  // 2. Use Segmenter for word-level boundaries
  const segmenter = new Intl.Segmenter('km', { granularity: 'word' });
  const segments = segmenter.segment(sanitizedInput);

  let result = "";
  let pairs = [];

  for (const { segment } of segments) {
    const cleanSegment = segment.trim();
    if (!cleanSegment) {
      if (!pairsOnly) result += " ";
      continue;
    }

    // Try whole word first (e.g., "ភាសា" or "សួស្តី")
    let matchedIPA = lookupTable[cleanSegment];

    if (matchedIPA) {
      result += withWords ? `( ${cleanSegment} ${matchedIPA} ) ` : `${matchedIPA} `;
      if (pairsOnly) pairs.push([cleanSegment, matchedIPA]);
    } else {
      /* 3. Fallback: Break word into phonetic clusters
         This regex captures: Base Consonant + Subscripts + Vowels + Diacritics
      */
      const clusters = cleanSegment.match(/[\u1780-\u17AF]([\u17D2][\u1780-\u17AF])*[\u17B6-\u17D3\u17D7]*/g) || [cleanSegment];
      
      for (const cluster of clusters) {
        const clusterIPA = lookupTable[cluster];
        if (clusterIPA) {
          result += withWords ? `( ${cluster} ${clusterIPA} ) ` : `${clusterIPA} `;
          if (pairsOnly) pairs.push([cluster, clusterIPA]);
        } else {
          // If cluster not in DB, keep original text
          result += cluster; 
          if (pairsOnly) pairs.push([cluster, null]);
        }
      }
      result += " ";
    }
  }

  if (pairsOnly) return { result: result.trim(), pairs };
  return result.trim().replace(/\s+/g, ' '); // Clean up spacing
}
