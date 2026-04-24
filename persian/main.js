/**
 * Persian IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/fa.json',
  process: processTextLongestMatch,
  ttsLanguage: 'fa',
  withWordsCheckboxId: 'wf_c_words'
});
