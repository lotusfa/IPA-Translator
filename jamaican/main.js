/** Jamaican IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/jam.json',
  process: processTextLongestMatch,
  ttsLanguage: 'en-US',
  withWordsCheckboxId: 'wf_c_words',
  gameLabel: 'jamaican'
});
