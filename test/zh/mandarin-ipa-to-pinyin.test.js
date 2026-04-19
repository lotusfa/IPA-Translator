/**
 * Test suite for Mandarin IPA to Pinyin conversion
 * Run with: node test/zh/mandarin-ipa-to-pinyin.test.js
 */

import {
  convertInitialToPinyin,
  convertToneToNumber,
  removeToneMarks,
  convertSyllableToPinyin,
  convertIPATextToPinyin
} from '../../js/zh.convert.js';

const results = { passed: 0, failed: 0, tests: [] };

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

// IPA tone marks (Unicode)
const TONE_5 = '\u02E5';  // 5 - high
const TONE_3 = '\u02E7';  // 3 - mid
const TONE_2 = '\u02E8';  // 2 - low
const TONE_1 = '\u02E9';  // 1 - lowest

// Mandarin tones
const T1 = TONE_5 + TONE_5;   // 55 - Tone 1
const T2 = TONE_3 + TONE_5;   // 35 - Tone 2
const T3 = TONE_2 + TONE_1 + TONE_2; // 212 - Tone 3 variant
const T4 = TONE_5 + TONE_1;   // 51 - Tone 4

console.log('\n=== Testing convertToneToNumber ===');
assert('T1 (55) -> 1', convertToneToNumber(T1), '1');
assert('T2 (35) -> 2', convertToneToNumber(T2), '2');
assert('T4 (51) -> 4', convertToneToNumber(T4), '4');

console.log('\n=== Testing convertInitialToPinyin ===');
// Bilabial stops
assert('p -> b', convertInitialToPinyin('p'), 'b');
assert('pʰ -> p', convertInitialToPinyin('p\u02B0'), 'p');

// Alveolar stops
assert('t -> d', convertInitialToPinyin('t'), 'd');
assert('tʰ -> t', convertInitialToPinyin('t\u02B0'), 't');

// Velar stops
assert('k -> g', convertInitialToPinyin('k'), 'g');
assert('kʰ -> k', convertInitialToPinyin('k\u02B0'), 'k');

// Retroflex series
assert('t\u0282 -> zh', convertInitialToPinyin('t\u0282'), 'zh');
assert('t\u0282ʰ -> ch', convertInitialToPinyin('t\u0282\u02B0'), 'ch');
assert('\u0282 -> sh', convertInitialToPinyin('\u0282'), 'sh');

// Alveolar affricates
assert('ts -> z', convertInitialToPinyin('ts'), 'z');
assert('tsʰ -> c', convertInitialToPinyin('ts\u02B0'), 'c');

// Palatal series
assert('t\u025A -> j', convertInitialToPinyin('t\u025A'), 'j');
assert('t\u025Aʰ -> q', convertInitialToPinyin('t\u025A\u02B0'), 'q');
assert('\u025A -> x', convertInitialToPinyin('\u025A'), 'x');

// Fricatives
assert('f -> f', convertInitialToPinyin('f'), 'f');
assert('h -> h', convertInitialToPinyin('h'), 'h');

// Nasals and liquids
assert('m -> m', convertInitialToPinyin('m'), 'm');
assert('n -> n', convertInitialToPinyin('n'), 'n');
assert('l -> l', convertInitialToPinyin('l'), 'l');

// Approximants
assert('j -> y', convertInitialToPinyin('j'), 'y');
assert('w -> w', convertInitialToPinyin('w'), 'w');

console.log('\n=== Testing convertSyllableToPinyin ===');
// 妈 ma1 (Tone 1)
assert('m + T1 + a -> ma1', convertSyllableToPinyin('m' + T1 + 'a'), 'ma1');
// 爬 pa2 (Tone 2)
assert('pʰ + T2 + a -> pa2', convertSyllableToPinyin('p\u02B0' + T2 + 'a'), 'pa2');
// 骂 ma4 (Tone 4)
assert('m + T4 + a -> ma4', convertSyllableToPinyin('m' + T4 + 'a'), 'ma4');

console.log('\n========================================');
console.log('Results: ' + results.passed + ' passed, ' + results.failed + ' failed');
console.log('========================================\n');

export default results;
