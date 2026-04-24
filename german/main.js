/** German IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/de.json',
  process: processTextLongestMatch,
  ttsLanguage: 'de-DE',
  withWordsCheckboxId: 'wf_c_words'
});
