import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/ko.json',
  process: processTextCharBased,
  maxWordLength: 6,
  ttsLanguage: 'ko-KR',
  gameLabel: 'korean'
});
