/**
 * Master-level Mandarin IPA to Pinyin Conversion Test
 * Tests challenging edge cases for "大師級" IPA to pinyin conversion
 * 
 * Test sentence: "隊員秋天在社區修建軍營，不想規律被變更。"
 * Expected result: duì yuán qiū tiān zài shè qū xiū jiàn jūn yíng, bù xiǎng guī lǜ bèi biàn gēng.
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

// Test 1: 隊 (duì) - uei → ui abbreviation + unaspirated t → d
// IPA: /tueɪ˥˩/ → Pinyin: duì
console.log('--- Testing 隊 (duì) ---');
assert('隊: tueɪ˥˩ → dui4', 
  convertSyllableToPinyin('tueɪ' + T4), 'dui4');

// Test 2: 規 (guī) - uei → ui abbreviation + unaspirated k → g
// IPA: /kweɪ˥˥/ → Pinyin: guī
console.log('\n--- Testing 規 (guī) ---');
assert('規: kweɪ˥˥ → gui1', 
  convertSyllableToPinyin('kweɪ' + T1), 'gui1');

// Test 3: 秋 (qiū) - iou → iu abbreviation
// IPA: /tɕʰjoʊ˥˥/ → Pinyin: qiū
console.log('\n--- Testing 秋 (qiū) ---');
assert('秋: tɕʰjoʊ˥˥ → qiu1', 
  convertSyllableToPinyin('tɕʰjoʊ' + T1), 'qiu1');

// Test 4: 修 (xiū) - iou → iu abbreviation with ɕ
// IPA: /ɕjoʊ˥˥/ → Pinyin: xiū
console.log('\n--- Testing 修 (xiū) ---');
assert('修: ɕjoʊ˥˥ → xiu1', 
  convertSyllableToPinyin('ɕjoʊ' + T1), 'xiu1');

// Test 5: 區 (qū) - j,q,x after ü automatically loses dots
// IPA: /tɕʰy˥˥/ → Pinyin: qu1
console.log('\n--- Testing 區 (qū) ---');
assert('區: tɕʰy˥˥ → qu1', 
  convertSyllableToPinyin('tɕʰy' + T1), 'qu1');

// Test 6: 軍 (jūn) - j,q,x after ü automatically loses dots
// IPA: /tɕyn˥˥/ → Pinyin: jun1
console.log('\n--- Testing 軍 (jūn) ---');
assert('軍: tɕyn˥˥ → jun1', 
  convertSyllableToPinyin('tɕyn' + T1), 'jun1');

// Test 7: 律 (lǜ) - n,l after ü keeps dots (critical test)
// IPA: /ly˥˩/ → Pinyin: lü4
console.log('\n--- Testing 律 (lǜ) ---');
assert('律: ly˥˩ → lü4', 
  convertSyllableToPinyin('ly' + T4), 'lü4');

// Test 8: 員 (yuán) - ian pattern with zero-initial jɛn → yan
// IPA: /ɥɛn˧˥/ → Pinyin: yuan2
console.log('\n--- Testing 員 (yuán) ---');
assert('員: ɥɛn˧˥ → yuan2', 
  convertSyllableToPinyin('ɥɛn' + T2), 'yuan2');

// Test 9: 建 (jiàn) - ian pattern
// IPA: /tɕjɛn˥˩/ → Pinyin: jian4
console.log('\n--- Testing 建 (jiàn) ---');
assert('建: tɕjɛn˥˩ → jian4', 
  convertSyllableToPinyin('tɕjɛn' + T4), 'jian4');

// Test 10: 變 (biàn) - ian pattern with unaspirated p → b
// IPA: /pjɛn˥˩/ → Pinyin: bian4
console.log('\n--- Testing 變 (biàn) ---');
assert('變: pjɛn˥˩ → bian4', 
  convertSyllableToPinyin('pjɛn' + T4), 'bian4');

// Test 11: 被 (bèi) - unaspirated p → b
// IPA: /peɪ˥˩/ → Pinyin: bei4
console.log('\n--- Testing 被 (bèi) ---');
assert('被: peɪ˥˩ → bei4', 
  convertSyllableToPinyin('peɪ' + T4), 'bei4');

// Test 12: 更 (gēng) - unaspirated k → g + ɤŋ → eng
// IPA: /kɤŋ˥˥/ → Pinyin: geng1
console.log('\n--- Testing 更 (gēng) ---');
assert('更: kɤŋ˥˥ → geng1', 
  convertSyllableToPinyin('kɤŋ' + T1), 'geng1');

// Test 13: 不 (bù) - unaspirated p → b
// IPA: /pu˥˩/ → Pinyin: bu4
console.log('\n--- Testing 不 (bù) ---');
assert('不: pu˥˩ → bu4', 
  convertSyllableToPinyin('pu' + T4), 'bu4');

// Test 14: 想 (xiǎng) - iang pattern
// IPA: /ɕjaŋ˨˩˦/ → Pinyin: xiang3
console.log('\n--- Testing 想 (xiǎng) ---');
assert('想: ɕjaŋ˨˩˦ → xiang3', 
  convertSyllableToPinyin('ɕjaŋ' + T3), 'xiang3');

// Full sentence test
console.log('\n=== Full Sentence Test ===');
console.log('Testing: 隊員秋天在社區修建軍營，不想規律被變更。\n');

const expectedFullResult = 'dui4 yuan2 qiu1 tian1 zai4 she4 qu1 xiu1 jian4 jun1 ying2, bu4 xiang3 gui1 lü4 bei4 bian4 geng1';

// Individual syllables from the test input
const testCases = [
  ['隊', 'tueɪ' + T4, 'dui4'],
  ['員', 'ɥɛn' + T2, 'yuan2'],
  ['秋', 'tɕʰjoʊ' + T1, 'qiu1'],
  ['天', 'tʰjɛn' + T1, 'tian1'],
  ['在', 'tsaɪ' + T4, 'zai4'],
  ['社', 'ʂɤ' + T4, 'she4'],
  ['區', 'tɕʰy' + T1, 'qu1'],
  ['修', 'ɕjoʊ' + T1, 'xiu1'],
  ['建', 'tɕjɛn' + T4, 'jian4'],
  ['軍', 'tɕyn' + T1, 'jun1'],
  ['營', 'jɪŋ' + T2, 'ying2'],
  ['不', 'pu' + T4, 'bu4'],
  ['想', 'ɕjaŋ' + T3, 'xiang3'],
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
