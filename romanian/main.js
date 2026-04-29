import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/ro.json',
  process: processTextLongestMatch,
  ttsLanguage: 'ro-RO',
  gameLabel: 'romanian'
});
