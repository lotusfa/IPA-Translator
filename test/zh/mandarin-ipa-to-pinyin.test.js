/**
 * Test suite for Mandarin IPA to Pinyin conversion
 * Based on Standard Chinese phonology (Wikipedia reference)
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

// Chao tone letters (IPA tone marks)
// U+02E5 ˥ modifier letter extra-high tone (5)
// U+02E6 ˦ modifier letter half-high tone (4)
// U+02E7 ˧ modifier letter mid tone (3)
// U+02E8 ˨ modifier letter low tone (2)
// U+02E9 ˩ modifier letter extra-low tone (1)
const TONE_5 = '\u02E5';
const TONE_4 = '\u02E6';
const TONE_3 = '\u02E7';
const TONE_2 = '\u02E8';
const TONE_1 = '\u02E9';

const T1 = TONE_5 + TONE_5;          // ˥˥ (55) - Tone 1 (high level)
const T2 = TONE_3 + TONE_5;          // ˧˥ (35) - Tone 2 (rising)
const T3 = TONE_2 + TONE_1 + TONE_4; // ˨˩˦ (214) - Tone 3 (low dipping)
const T4 = TONE_5 + TONE_1;          // ˥˩ (51) - Tone 4 (falling)

console.log('\n=== Testing convertToneToNumber ===');
assert('T1 (˥˥/55) -> 1', convertToneToNumber(T1), '1');
assert('T2 (˧˥/35) -> 2', convertToneToNumber(T2), '2');
assert('T3 (˨˩˦/214) -> 3', convertToneToNumber(T3), '3');
assert('T4 (˥˩/51) -> 4', convertToneToNumber(T4), '4');

console.log('\n=== Testing removeToneMarks ===');
assert('Remove T1 from ma˥˥', removeToneMarks('ma' + T1), 'ma');
assert('Remove T2 from pa˧˥', removeToneMarks('pa' + T2), 'pa');
assert('Remove T3 from ta˨˩˦', removeToneMarks('ta' + T3), 'ta');
assert('Remove T4 from ka˥˩', removeToneMarks('ka' + T4), 'ka');

console.log('\n=== Testing convertInitialToPinyin ===');

// Bilabial plosives - IPA unaspirated = pinyin b, IPA aspirated = pinyin p
assert('p (unaspirated) -> b', convertInitialToPinyin('p'), 'b');
assert('pʰ (aspirated) -> p', convertInitialToPinyin('p\u02B0'), 'p');

// Alveolar plosives - IPA unaspirated = pinyin d, IPA aspirated = pinyin t
assert('t (unaspirated) -> d', convertInitialToPinyin('t'), 'd');
assert('tʰ (aspirated) -> t', convertInitialToPinyin('t\u02B0'), 't');

// Velar plosives - IPA unaspirated = pinyin g, IPA aspirated = pinyin k
assert('k (unaspirated) -> g', convertInitialToPinyin('k'), 'g');
assert('kʰ (aspirated) -> k', convertInitialToPinyin('k\u02B0'), 'k');

// Retroflex series (ʈʂ = zh)
assert('ʈʂ (zh) -> zh', convertInitialToPinyin('\u1E9C\u0282'), 'zh');
assert('ʈʂʰ (ch) -> ch', convertInitialToPinyin('\u1E9C\u0282\u02B0'), 'ch');
assert('ʂ (sh) -> sh', convertInitialToPinyin('\u0282'), 'sh');
assert('ʐ (r) -> r', convertInitialToPinyin('\u0280'), 'r');

// Alveolar affricates (ts = z)
assert('ts (z) -> z', convertInitialToPinyin('ts'), 'z');
assert('tsʰ (c) -> c', convertInitialToPinyin('ts\u02B0'), 'c');
assert('s -> s', convertInitialToPinyin('s'), 's');

// Alveolo-palatal series (tɕ = j)
assert('tɕ (j) -> j', convertInitialToPinyin('t\u0255'), 'j');
assert('tɕʰ (q) -> q', convertInitialToPinyin('t\u0255\u02B0'), 'q');
assert('ɕ (x) -> x', convertInitialToPinyin('\u0255'), 'x');

// Nasals and liquids
assert('m -> m', convertInitialToPinyin('m'), 'm');
assert('n -> n', convertInitialToPinyin('n'), 'n');
assert('l -> l', convertInitialToPinyin('l'), 'l');

// Fricatives
assert('f -> f', convertInitialToPinyin('f'), 'f');
assert('h -> h', convertInitialToPinyin('h'), 'h');

// Glides
assert('j (y) -> y', convertInitialToPinyin('j'), 'y');
assert('w -> w', convertInitialToPinyin('w'), 'w');

console.log('\n=== Testing convertSyllableToPinyin ===');

// Test basic syllables with each tone
// IPA unaspirated p = pinyin b
assert('p (unaspirated) + T1 + a -> ba1', convertSyllableToPinyin('p' + T1 + 'a'), 'ba1');

// IPA aspirated pʰ = pinyin p
assert('pʰ (aspirated) + T2 + a -> pa2', convertSyllableToPinyin('p\u02B0' + T2 + 'a'), 'pa2');

// IPA unaspirated p = pinyin b (tone 3)
assert('p (unaspirated) + T3 + a -> ba3', convertSyllableToPinyin('p' + T3 + 'a'), 'ba3');

// IPA unaspirated p = pinyin b (tone 4)
assert('p (unaspirated) + T4 + a -> ba4', convertSyllableToPinyin('p' + T4 + 'a'), 'ba4');

// Test with retroflex series (ʈʂ = zh)
assert('ʈʂ + T1 + i -> zhi1', convertSyllableToPinyin('\u1E9C\u0282' + T1 + 'i'), 'zhi1');

// Test with alveolar series (ts = z)
assert('ts + T3 + i -> zi3', convertSyllableToPinyin('ts' + T3 + 'i'), 'zi3');

// Test with alveolo-palatal series (tɕ = j)
assert('tɕ + T4 + y -> jy4', convertSyllableToPinyin('t\u0255' + T4 + 'y'), 'jy4');

// Test with nasal finals
assert('m + T1 + a + ŋ -> maŋ1', convertSyllableToPinyin('m' + T1 + 'a\u014B'), 'maŋ1');

console.log('\n=== Testing convertIPATextToPinyin ===');

// Test full text conversion (with slash-delimited syllables)
assert('Multiple syllables (slash-delimited)',
  convertIPATextToPinyin('/p\u02B0' + T2 + 'a/ /p' + T4 + 'a/'),
  'pa2 ba4');

// Test plain text without slashes (should pass through unchanged except for tone detection)
assert('Plain text without slashes',
  convertIPATextToPinyin('p\u02B0' + T2 + 'a'),
  'p\u02B0' + T2 + 'a');

console.log('\n========================================');
console.log('Results: ' + results.passed + ' passed, ' + results.failed + ' failed');
console.log('========================================\n');

export default results;
