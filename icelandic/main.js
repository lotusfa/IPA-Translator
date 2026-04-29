import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/is.json',
  process: processTextLongestMatch,
  ttsLanguage: 'is-IS',
  gameLabel: 'icelandic'
});
