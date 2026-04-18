/**
 * Analysis of user's input issue
 * 
 * User input: /kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/
 * Expected output: /gwok3 zai3 jam1 biu1/
 * Actual output: /gwɔ:k3 zai3 jam1 biu1/
 * 
 * Problem: The user used "kw" instead of "kʷ" (IPA proper notation)
 * 
 * The syllable breakdown:
 * 1. /kwɔ:k˧/ - WRONG notation (should be /kʷɔ:k˧/)
 * 2. /tsɐi˧/ - Correct
 * 3. /jɐm˥/ - Correct  
 * 4. /pi:u˥/ - Correct
 */

import { formatYueJyutping } from '../js/yue.format.js';

console.log('\n=== User Input Analysis ===\n');

console.log('User input: /kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/');
console.log('Current output:  ', formatYueJyutping('/kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/'));
console.log('Expected output: /gwok3 zai3 jam1 biu1/');
console.log();

console.log('Correct IPA notation: /kʷɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/');
console.log('Correct output:     ', formatYueJyutping('/kʷɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/'));
console.log();

console.log('=== Analysis ===');
console.log('The word "宽阔" (broad/wide) in Cantonese:');
console.log('- 闊 = /kʷɔ:k˧/ → /kwok3/');
console.log('- 闊 的 IPA is [kʷ] (labialized velar) + [ɔ:] + [k] + [˧]');
console.log('- In proper IPA, [kʷ] should be used, not "kw"');
console.log();

console.log('The parser treats "kw" as two separate consonants [k] + [w]');
console.log('instead of the single labialized consonant [kʷ]');
console.log();

// Let's test what happens with "kw" as separate consonants
console.log('=== Testing "kw" parsing ===');
console.log('/kwɔ:˧/ (k + w + ɔ:) =', formatYueJyutping('/kwɔ:˧/'));
console.log('This is parsed as [k] + [w] + [ɔ:], not [kʷ] + [ɔ:]');
console.log();

