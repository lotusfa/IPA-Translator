import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/nl.json',
  process: processTextLongestMatch,
  ttsLanguage: 'nl-NL',
  gameLabel: 'dutch'
});
