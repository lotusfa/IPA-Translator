// Import the new function
import { initIPAIndexPage, processKhmerText } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/km.json',
  // Use the new Khmer processor here
  process: processKhmerText, 
  ttsLanguage: 'km-KH',
  gameLabel: 'khmer'
});