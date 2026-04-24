/**
 * Esperanto IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

// Initialize with longest-match algorithm for phrase processing
initIPAIndexPage({
  databasePath: '../json/eo.json',
  process: processTextLongestMatch,
  maxWordLength: 5,
  ttsLanguage: 'eo'
});
