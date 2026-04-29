import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/km.json',
  process: processTextCharBased,
  maxWordLength: 6,
  ttsLanguage: 'km-KH',
  gameLabel: 'khmer'
});
