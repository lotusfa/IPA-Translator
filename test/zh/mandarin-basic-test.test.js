/**
 * Basic-Level Mandarin IPA to Pinyin Conversion Test
 * Tests common syllables, tones, and a simple sentence
 * 
 * Test sentence: "你好，我愛你。"
 * Expected result: ni3 hao3, wo3 ai4 ni3.
 * 
 * NOTE: Uses simple IPA patterns that most converters output for basic cases.
 */

import {
  convertSyllableToPinyin,
  convertIPATextToPinyin
} from '../../js/zh.format.js';

const results = { passed: 0, failed: 0, tests: [] };

// Chao tone letters (same as master test)
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
    console.log('✓ ' + name);
  } else {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', actual, expected });
    console.log('✗ ' + name);
    console.log('  Expected: ' + expected);
    console.log('  Actual:   ' + actual);
  }
}

console.log('\n=== Basic-Level IPA to Pinyin Conversion Tests ===\n');

// ========================
// BASIC SYLLABLE TESTS
// ========================

console.log('--- Testing 媽 (mā) - simple ma + Tone 1 ---');
assert('媽: ma˥˥ → ma1', 
  convertSyllableToPinyin('ma' + T1), 'ma1');

console.log('\n--- Testing 爸 (bà) - p-initial (b sound) + Tone 4 ---');
assert('爸: pa˥˩ → ba4', 
  convertSyllableToPinyin('pa' + T4), 'ba4');

console.log('\n--- Testing 你 (nǐ) - ni + Tone 3 ---');
assert('你: ni˨˩˦ → ni3', 
  convertSyllableToPinyin('ni' + T3), 'ni3');

console.log('\n--- Testing 好 (hǎo) - x-initial (h sound) + ao + Tone 3 ---');
assert('好: xɑʊ˨˩˦ → hao3', 
  convertSyllableToPinyin('xɑʊ' + T3), 'hao3');

console.log('\n--- Testing 我 (wǒ) - zero-initial wo + Tone 3 ---');
assert('我: wo˨˩˦ → wo3', 
  convertSyllableToPinyin('wo' + T3), 'wo3');

console.log('\n--- Testing 愛 (ài) - ai + Tone 4 ---');
assert('愛: aɪ˥˩ → ai4', 
  convertSyllableToPinyin('aɪ' + T4), 'ai4');

console.log('\n--- Testing 地 (dì) - t-initial (d sound) + Tone 4 ---');
assert('地: ti˥˩ → di4', 
  convertSyllableToPinyin('ti' + T4), 'di4');

console.log('\n--- Testing 女 (nǚ) - ny (ü) + Tone 3 ---');
assert('女: ny˨˩˦ → nü3', 
  convertSyllableToPinyin('ny' + T3), 'nü3');

console.log('\n--- Testing 哥 (gē) - kɤ + Tone 1 (from master style) ---');
assert('哥: kɤ˥˥ → ge1', 
  convertSyllableToPinyin('kɤ' + T1), 'ge1');

console.log('\n--- Testing 媽 (má) - Tone 2 (second tone check) ---');
assert('媽: ma˧˥ → ma2', 
  convertSyllableToPinyin('ma' + T2), 'ma2');

// ========================
// FULL SIMPLE SENTENCE TEST
// ========================

console.log('\n=== Full Basic Sentence Test ===');
console.log('Testing: 你好，我愛你。\n');

const testCases = [
  ['你', 'ni' + T3, 'ni3'],
  ['好', 'xɑʊ' + T3, 'hao3'],
  ['我', 'wo' + T3, 'wo3'],
  ['愛', 'aɪ' + T4, 'ai4'],
  ['你', 'ni' + T3, 'ni3']
];

testCases.forEach(([char, ipa, expected]) => {
  const actual = convertSyllableToPinyin(ipa);
  assert(char + ': ' + ipa + ' → ' + expected, actual, expected);
});

// Optional: test the full-text converter if you want
console.log('\n--- Optional full-text converter test (uncomment if needed) ---');
// const fullIpa = 'ni' + T3 + ' xaʊ' + T3 + ' wo' + T3 + ' aɪ' + T4 + ' ni' + T3;
// console.log('Full IPA input:', fullIpa);
// assert('Full sentence: 你好，我愛你。', 
//   convertIPATextToPinyin(fullIpa), 'ni3 hao3, wo3 ai4 ni3.');

console.log('\n========================================');
console.log('Results: ' + results.passed + ' passed, ' + results.failed + ' failed');
console.log('========================================\n');

export default results;