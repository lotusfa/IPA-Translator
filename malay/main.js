/** Malay IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/ma.json',
  process: processTextLongestMatch,
  ttsLanguage: 'ms-MY',
  withWordsCheckboxId: 'wf_c_words',
  gameLabel: 'malay'
});
