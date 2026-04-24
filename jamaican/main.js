/** Jamaican IPA Translator */
import { initIPAIndexPage, processTextLongestMatch } from '../js/ipa-core.js';

initIPAIndexPage({
  databasePath: '../json/jam.json',
  process: ({ input, lookupTable }) => processTextLongestMatch({ input, lookupTable, withWords: isElementChecked('wf_c_words') }),
  speakButtonOptions: { language: 'en-US' }
});
