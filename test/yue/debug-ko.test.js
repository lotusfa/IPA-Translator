/**
 * Debug: Testing [kʷɔ:k] conversion
 */

import { formatYueJyutping } from '../js/format/yue.format.js';

console.log('\n=== Debug: Testing [kʷɔ:k] conversion ===\n');

// According to table.md:
// [kʷ] → gw (聲母)
// [ɔ:k] → ok (韻母，like 惡 [ɔ:k])
// [˧] → 3

// Let's test each component
console.log('Test 1: Just [ɔ:k]');
console.log('  formatYueJyutping("/ɔ:k/"):', formatYueJyutping('/ɔ:k/'));
console.log('  Expected: /ok/');
console.log();

console.log('Test 2: [kʷ] + [ɔ:] without ending');
console.log('  formatYueJyutping("/kʷɔ:˥/"):', formatYueJyutping('/kʷɔ:˥/'));
console.log('  Expected: /gwo1/ (gw + oe) - wait, [ɔ:] should be "o", so /go1/');
console.log();

console.log('Test 3: [kʷ] + [ɔ:k] with tone');
console.log('  formatYueJyutping("/kʷɔ:k˧/"):', formatYueJyutping('/kʷɔ:k˧/'));
console.log('  Expected: /gwok3/');
console.log();

console.log('Test 4: [kʷ] + [ɔ:] + [k] separately');
console.log('  formatYueJyutping("/kʷɔ:˧k/"):', formatYueJyutping('/kʷɔ:˧k/'));
console.log();

// The actual problem: input is /kwɔ:k˧/ not /kʷɔ:k˧/
console.log('Test 5: Input /kwɔ:k˧/ (using regular k instead of kʷ)');
console.log('  formatYueJyutping("/kwɔ:k˧/"):', formatYueJyutping('/kwɔ:k˧/'));
console.log('  This is different! "kw" is not the same as "kʷ"');
console.log();

// Let's check what "kw" as a sequence means
console.log('Test 6: Just [ɔ:]+[k] without any initial');
console.log('  formatYueJyutping("/ɔ:k˧/"):', formatYueJyutping('/ɔ:k˧/'));
console.log();

