import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/pt_BR.json',
  process: processTextLongestMatch,
  ttsLanguage: 'pt-BR',
  gameLabel: 'portuguese'
});
