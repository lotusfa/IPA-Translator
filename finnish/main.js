/** Finnish IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ipa-core.js';

initIPAIndexPage({
  databasePath: '../json/fi.json',
  process: ({ input, lookupTable }) => processTextLongestMatch({ input, lookupTable, withWords: isElementChecked('wf_c_words') }),
  speakButtonOptions: { language: 'fi-FI' }
});
