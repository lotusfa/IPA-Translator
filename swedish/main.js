/** Swedish IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/sv.json',
  process: processTextLongestMatch,
  ttsLanguage: 'sv-SE',
  withWordsCheckboxId: 'wf_c_words',
  gameLabel: 'swedish'
});
