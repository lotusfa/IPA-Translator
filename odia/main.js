/**
 * Odia IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/or.json',
  process: processTextLongestMatch,
  withWordsCheckboxId: 'wf_c_words',
  enableSpeakButton: false
});
