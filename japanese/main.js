/**
 * Japanese IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';

// Initialize with char-based processing (no formatter needed)
initIPAIndexPage({
  databasePath: '../json/ja.json',
  process: processTextCharBased,
  maxWordLength: 6,
  ttsLanguage: 'ja-JP'
});
