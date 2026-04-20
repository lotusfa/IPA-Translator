/**
 * Master-level Mandarin IPA to Pinyin Conversion Test
 * Tests challenging edge cases for "大師級" IPA to pinyin conversion
 * 
 * Test sentence: "隊員秋天在社區修建軍營，不想規律被變更。"
 * Expected result: duì yuán qiū tiān zài shè qū xiū jiàn jūn yíng, bù xiǎng guī lǜ bèi biàn gēng.
 * 
 * NOTE: This test uses the ACTUAL IPA output from the converter:
 * ( 隊員 /tweɪ˥˩ ɥœn˧˥/ ) ( 秋天 /tɕʰjoʊ˥˥ tʰjɛn˥˥/ ) ( 在 /tsaɪ˥˩/ ) 
 * ( 社 /ʂɤ˥˩/ ) ( 區 /tɕʰy˥˥/, /oʊ˥˥/ ) ( 修 /ɕjoʊ˥˥/ ) ( 建 /tɕjɛn˥˩/ ) 
 * ( 軍 /tɕyn˥˥/ ) ( 營 /ɪŋ˧˥/, /tsʰuɔ˥˥/ ) ， 
 * ( 不 /pu˥˩/, /foʊ˨˩˦/, /foʊ˥˥/ ) ( 想 /ɕjɑŋ˨˩˦/ ) 
 * ( 規 /kweɪ˥˥/, /kʰweɪ˥˥/, /ɕy˥˩/, /kweɪ˥˩/ ) ( 律 /ly˥˩/ ) 
 * ( 被 /peɪ˥˩/, /pʰi˥˥/, /pi˥˩/, /pʰi˥˩/ ) ( 變更 /pjɛn˥˩ kɤŋ˥˥/ ) 。
 */

import {
  convertSyllableToPinyin,
  convertIPATextToPinyin
} from '../../js/zh.format.js';

const results = { passed: 0, failed: 0, tests: [] };

// Chao tone letters
const TONE_5 = '\u02E5';
const TONE_4 = '\u02E6';
const TONE_3 = '\u02E7';
const TONE_2 = '\u02E8';
const TONE_1 = '\u02E9';

const T1 = TONE_5 + TONE_5;          // ˥˥ (55) - Tone 1
const T2 = TONE_3 + TONE_5;          // ˧˥ (35) - Tone 2
const T3 = TONE_2 + TONE_1 + TONE_4; // ˨˩˦ (214) - Tone 3
const T4 = TONE_5 + TONE_1;          // ˥˩ (51) - Tone 4

function assert(name, actual, expected) {
  const passed = actual === expected;
  if (passed) {
    results.passed++;
    results.tests.push({ name, status: 'PASS', actual, expected });
    console.log('\u2713 ' + name);
  } else {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', actual, expected });
    console.log('\u2717 ' + name);
    console.log('  Expected: ' + expected);
    console.log('  Actual:   ' + actual);
  }
}

console.log('\n=== Master-Level IPA to Pinyin Conversion Tests ===\n');

// Test 1: 隊 (duì) - uses simplified 'weɪ' pattern
// IPA: /tweɪ˥˩/ → Pinyin: dui4
console.log('--- Testing 隊 (duì) ---');
assert('隊: tweɪ˥˩ → dui4', 
  convertSyllableToPinyin('tweɪ' + T4), 'dui4');

// Test 2: 員 (yuán) - uses ɥœn pattern (zero-initial)
// IPA: /ɥœn˧˥/ → Pinyin: yuan2
console.log('\n--- Testing 員 (yuán) ---');
assert('員: ɥœn˧˥ → yuan2', 
  convertSyllableToPinyin('ɥœn' + T2), 'yuan2');

// Test 3: 秋 (qiū) - uses joʊ pattern
// IPA: /tɕʰjoʊ˥˥/ → Pinyin: qiu1
console.log('\n--- Testing 秋 (qiū) ---');
assert('秋: tɕʰjoʊ˥˥ → qiu1', 
  convertSyllableToPinyin('tɕʰjoʊ' + T1), 'qiu1');

// Test 4: 天 (tiān) - uses tʰjɛn pattern
// IPA: /tʰjɛn˥˥/ → Pinyin: tian1
console.log('\n--- Testing 天 (tiān) ---');
assert('天: tʰjɛn˥˥ → tian1', 
  convertSyllableToPinyin('tʰjɛn' + T1), 'tian1');

// Test 5: 規 (guī) - uses kweɪ pattern
// IPA: /kweɪ˥˥/ → Pinyin: gui1
console.log('\n--- Testing 規 (guī) ---');
assert('規: kweɪ˥˥ → gui1', 
  convertSyllableToPinyin('kweɪ' + T1), 'gui1');

// Test 6: 區 (qū) - uses tɕʰy pattern
// IPA: /tɕʰy˥˥/ → Pinyin: qu1
console.log('\n--- Testing 區 (qū) ---');
assert('區: tɕʰy˥˥ → qu1', 
  convertSyllableToPinyin('tɕʰy' + T1), 'qu1');

// Test 7: 修 (xiū) - uses ɕjoʊ pattern
// IPA: /ɕjoʊ˥˥/ → Pinyin: xiu1
console.log('\n--- Testing 修 (xiū) ---');
assert('修: ɕjoʊ˥˥ → xiu1', 
  convertSyllableToPinyin('ɕjoʊ' + T1), 'xiu1');

// Test 8: 建 (jiàn) - uses tɕjɛn pattern
// IPA: /tɕjɛn˥˩/ → Pinyin: jian4
console.log('\n--- Testing 建 (jiàn) ---');
assert('建: tɕjɛn˥˩ → jian4', 
  convertSyllableToPinyin('tɕjɛn' + T4), 'jian4');

// Test 9: 軍 (jūn) - uses tɕyn pattern
// IPA: /tɕyn˥˥/ → Pinyin: jun1
console.log('\n--- Testing 軍 (jūn) ---');
assert('軍: tɕyn˥˥ → jun1', 
  convertSyllableToPinyin('tɕyn' + T1), 'jun1');

// Test 10: 營 (yíng) - uses ɪŋ pattern (zero-initial)
// IPA: /ɪŋ˧˥/ → Pinyin: ying2
console.log('\n--- Testing 營 (yíng) ---');
assert('營: ɪŋ˧˥ → ying2', 
  convertSyllableToPinyin('ɪŋ' + T2), 'ying2');

// Test 11: 不 (bù) - uses pu pattern
// IPA: /pu˥˩/ → Pinyin: bu4
console.log('\n--- Testing 不 (bù) ---');
assert('不: pu˥˩ → bu4', 
  convertSyllableToPinyin('pu' + T4), 'bu4');

// Test 12: 想 (xiǎng) - uses ɕjɑŋ pattern (with ɑ vowel)
// IPA: /ɕjɑŋ˨˩˦/ → Pinyin: xiang3
console.log('\n--- Testing 想 (xiǎng) ---');
assert('想: ɕjɑŋ˨˩˦ → xiang3', 
  convertSyllableToPinyin('ɕjɑŋ' + T3), 'xiang3');

// Test 13: 律 (lǜ) - uses ly pattern (l + ü keeps umlaut)
// IPA: /ly˥˩/ → Pinyin: lü4
console.log('\n--- Testing 律 (lǜ) ---');
assert('律: ly˥˩ → lü4', 
  convertSyllableToPinyin('ly' + T4), 'lü4');

// Test 14: 被 (bèi) - uses peɪ pattern
// IPA: /peɪ˥˩/ → Pinyin: bei4
console.log('\n--- Testing 被 (bèi) ---');
assert('被: peɪ˥˩ → bei4', 
  convertSyllableToPinyin('peɪ' + T4), 'bei4');

// Test 15: 變 (biàn) - uses pjɛn pattern
// IPA: /pjɛn˥˩/ → Pinyin: bian4
console.log('\n--- Testing 變 (biàn) ---');
assert('變: pjɛn˥˩ → bian4', 
  convertSyllableToPinyin('pjɛn' + T4), 'bian4');

// Test 16: 更 (gēng) - uses kɤŋ pattern
// IPA: /kɤŋ˥˥/ → Pinyin: geng1
console.log('\n--- Testing 更 (gēng) ---');
assert('更: kɤŋ˥˥ → geng1', 
  convertSyllableToPinyin('kɤŋ' + T1), 'geng1');

// Test 17: 在 (zài) - uses tsaɪ pattern
// IPA: /tsaɪ˥˩/ → Pinyin: zai4
console.log('\n--- Testing 在 (zài) ---');
assert('在: tsaɪ˥˩ → zai4', 
  convertSyllableToPinyin('tsaɪ' + T4), 'zai4');

// Test 18: 社 (shè) - uses ʂɤ pattern
// IPA: /ʂɤ˥˩/ → Pinyin: she4
console.log('\n--- Testing 社 (shè) ---');
assert('社: ʂɤ˥˩ → she4', 
  convertSyllableToPinyin('ʂɤ' + T4), 'she4');

// Full sentence test with actual IPA from converter output
console.log('\n=== Full Sentence Test ===');
console.log('Testing: 隊員秋天在社區修建軍營，不想規律被變更。\n');

// Individual syllables using ACTUAL IPA from converter output
const testCases = [
  ['隊', 'tweɪ' + T4, 'dui4'],
  ['員', 'ɥœn' + T2, 'yuan2'],
  ['秋', 'tɕʰjoʊ' + T1, 'qiu1'],
  ['天', 'tʰjɛn' + T1, 'tian1'],
  ['在', 'tsaɪ' + T4, 'zai4'],
  ['社', 'ʂɤ' + T4, 'she4'],
  ['區', 'tɕʰy' + T1, 'qu1'],
  ['修', 'ɕjoʊ' + T1, 'xiu1'],
  ['建', 'tɕjɛn' + T4, 'jian4'],
  ['軍', 'tɕyn' + T1, 'jun1'],
  ['營', 'ɪŋ' + T2, 'ying2'],
  ['不', 'pu' + T4, 'bu4'],
  ['想', 'ɕjɑŋ' + T3, 'xiang3'],
  ['規', 'kweɪ' + T1, 'gui1'],
  ['律', 'ly' + T4, 'lü4'],
  ['被', 'peɪ' + T4, 'bei4'],
  ['變', 'pjɛn' + T4, 'bian4'],
  ['更', 'kɤŋ' + T1, 'geng1']
];

testCases.forEach(([char, ipa, expected]) => {
  const actual = convertSyllableToPinyin(ipa);
  assert(char + ': ' + ipa + ' → ' + expected, actual, expected);
});

console.log('\n========================================');
console.log('Results: ' + results.passed + ' passed, ' + results.failed + ' failed');
console.log('========================================\n');

export default results;
