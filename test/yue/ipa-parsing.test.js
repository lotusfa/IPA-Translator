/**
 * Test IPA parsing issue with /kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/
 */

import { formatYueJyutping } from '../js/format/yue.format.js';

console.log('\n=== IPA Parsing Test ===\n');

// The original input from user
const originalIPAs = '/kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/';
console.log('Original IPA (user input):', originalIPAs);
console.log('Output:', formatYueJyutping(originalIPAs));
console.log();

// Correct IPA with proper kʷ notation
const correctIPA1 = '/kʷɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/';
console.log('Correct IPA (with kʷ):', correctIPA1);
console.log('Output:', formatYueJyutping(correctIPA1));
console.log();

// Breaking down each syllable
console.log('--- Syllable breakdown ---');
console.log('Syllable 1: /kʷɔ:k˧/ (correct)');
console.log('  Expected: /gwok3/');
console.log('  Actual:', formatYueJyutping('/kʷɔ:k˧/'));
console.log();

console.log('Syllable 1: /kwɔ:k˧/ (user input - wrong notation)');
console.log('  Actual:', formatYueJyutping('/kwɔ:k˧/'));
console.log();

// Other syllables
console.log('Syllable 2: /tsɐi˧/');
console.log('  Expected: /zai3/');
console.log('  Actual:', formatYueJyutping('/tsɐi˧/'));
console.log();

console.log('Syllable 3: /jɐm˥/');
console.log('  Expected: /jam1/');
console.log('  Actual:', formatYueJyutping('/jɐm˥/'));
console.log();

console.log('Syllable 4: /pi:u˥/');
console.log('  Expected: /biu1/');
console.log('  Actual:', formatYueJyutping('/pi:u˥/'));
console.log();

// Summary
console.log('=== Summary ===');
console.log('The issue is that user input uses "kw" instead of "kʷ" for [kʷ] sound.');
console.log('Correct notation: /kʷɔ:k˧/ → /gwok3/');
console.log('User notation:    /kwɔ:k˧/ → ? (not properly parsed)');
