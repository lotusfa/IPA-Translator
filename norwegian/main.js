/** Norwegian IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/nb.json',
  process: processTextLongestMatch,
  ttsLanguage: 'nb-NO',
  withWordsCheckboxId: 'wf_c_words'
});
