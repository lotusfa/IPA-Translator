/** Finnish IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/fi.json',
  process: processTextLongestMatch,
  ttsLanguage: 'fi-FI',
  withWordsCheckboxId: 'wf_c_words'
});
