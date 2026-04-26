/** Swahili IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/sw.json',
  process: processTextLongestMatch,
  ttsLanguage: 'sw',
  withWordsCheckboxId: 'wf_c_words',
  gameLabel: 'swahili'
});
