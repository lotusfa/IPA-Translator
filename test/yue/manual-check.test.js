/**
 * Manual check of IPA: /kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/
 * Based on ref/table.md
 */

import {
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu
} from '../js/format/yue.format.js';

console.log('\n=== Manual Check: /kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/ ===\n');

// Let's analyze each syllable based on table.md

// Syllable 1: /kwɔ:k˧/
// Breaking down:
// - [kʷ] = 聲母 → 粵拼: gw
// - [ɔ:] = 韻母 → 粵拼: o
// - [k] = 韻尾 (入聲) → 粵拼: k
// - [˧] = 聲調 3
// But wait, "kwɔ:k" is strange - ɔ: is already a vowel, and k is a consonant ending
// Looking at table.md: ɔ: + k = ok (like 惡 [ɔ:k])
// So /kʷɔ:k˧/ should be: gw + ok + 3 = gwok3
console.log('Syllable 1: /kwɔ:k˧/');
console.log('  Expected breakdown: [kʷ] + [ɔ:] + [k] + [˧]');
console.log('  粵拼 should be: gwok3 (gw + ok + 3)');
console.log('  Actual:', formatYueJyutping('/kwɔ:k˧/'));
console.log();

// Syllable 2: /tsɐi˧/
// - [ts] = 聲母 → 粵拼: z
// - [ɐi] = 韻母 → 粵拼: ai
// - [˧] = 聲調 3
// So /tsɐi˧/ should be: zai3
console.log('Syllable 2: /tsɐi˧/');
console.log('  Expected breakdown: [ts] + [ɐi] + [˧]');
console.log('  粵拼 should be: zai3');
console.log('  Actual:', formatYueJyutping('/tsɐi˧/'));
console.log();

// Syllable 3: /jɐm˥/
// - [j] = 聲母 → 粵拼: j
// - [ɐm] = 韻母 → 粵拼: am
// - [˥] = 聲調 1
// So /jɐm˥/ should be: jam1
console.log('Syllable 3: /jɐm˥/');
console.log('  Expected breakdown: [j] + [ɐm] + [˥]');
console.log('  粵拼 should be: jam1');
console.log('  Actual:', formatYueJyutping('/jɐm˥/'));
console.log();

// Syllable 4: /pi:u˥/
// - [p] = 聲母 → 粵拼: b
// - [i:u] = 韻母 → 粵拼: iu
// - [˥] = 聲調 1
// So /pi:u˥/ should be: biu1
console.log('Syllable 4: /pi:u˥/');
console.log('  Expected breakdown: [p] + [i:u] + [˥]');
console.log('  粵拼 should be: biu1');
console.log('  Actual:', formatYueJyutping('/pi:u˥/'));
console.log();

// Full word
console.log('=== Full IPA: /kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/ ===');
const fullIPA = '/kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/';
console.log('Jyutping:', formatYueJyutping(fullIPA));
console.log('Guangzhou:', formatYueGuangzhou(fullIPA));
console.log('Academy:', formatYueAcademy(fullIPA));
console.log('Yale:', formatYueYale(fullIPA));
console.log('Liu:', formatYueLiu(fullIPA));

// Now let's test each component separately
console.log('\n=== Component Tests ===\n');

// Test [kʷ] + [ɔ:k] - wait, this is not right. Let me check if k is part of ɔ: or separate
// Actually looking at table.md, [ɔ:k] doesn't exist, but [ɔ:] exists and [ɔ:k] would be 惡
// The pattern should be: ɔ: + k = ok (入聲 ending)

// So /kʷɔ:k˧/ should be parsed as:
// [kʷ] + [ɔ:] + [k] + [˧] = gw + o + k + 3 = gwok3
// But the current implementation might parse it differently

// Let's test with correct IPA format
console.log('Testing with separated IPA:');
console.log('  /kʷɔːk˧/ (with long vowel marker):', formatYueJyutping('/kʷɔːk˧/'));
console.log('  /kʷɔ:k˧/ (current):', formatYueJyutping('/kʷɔ:k˧/'));

