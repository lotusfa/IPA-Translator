/**
 * Comprehensive test suite for Mandarin tone detection
 * Based on Gemini's analysis of tone marking errors
 *
 * IMPORTANT: IPA representations must match actual data in json/zh_hant.json
 *
 * Key mappings from actual JSON data:
 * - 國 /kuo˧˥/ → guo2 (not guo˧˥)
 * - 際 /tɕi˥˩/ → ji4
 * - 音 /in˥˥/ or /ɪn˥˥/ → yin1
 * - 是 /ʂɻ˥˩/ → shi4
 * - 學 /ɕɥœ˧˥/ or /ɕyɛ˧˥/ → xue2
 * - 會 /xwe˥˩/ → hui4 (or hwe4 with h-variant)
 * - 設 /ʂɤ˥˩/ → she4
 * - 計 /tɕi˥˩/ → ji4
 * - 統 /tʰʊŋ˨˩˦/ → tong3
 * - 由 /joʊ˧˥/ → you2
 */

import {
  convertSyllableToPinyin,
  convertIPATextToPinyin
} from '../../js/zh.format.js';

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

// Chao tone letters (standard IPA tone contour notation)
const TONE_5 = '\u02E5';  // ˥ extra-high (5)
const TONE_4 = '\u02E6';  // ˦ half-high (4)
const TONE_3 = '\u02E7';  // ˧ mid (3)
const TONE_2 = '\u02E8';  // ˨ low (2)
const TONE_1 = '\u02E9';  // ˩ extra-low (1)

// Standard Mandarin tone contours
const C_T1 = TONE_5 + TONE_5;           // ˥˥ (55) - high level
const C_T2 = TONE_3 + TONE_5;           // ˧˥ (35) - rising
const C_T3 = TONE_2 + TONE_1 + TONE_4;  // ˨˩˦ (214) - dipping
const C_T4 = TONE_5 + TONE_1;           // ˥˩ (51) - falling

console.log('\n=== Testing Basic Syllables with Correct IPA ===');

// Pure vowel syllables (no initial)
// /i˥˥/ → yi1 (y- prefix added for vowel-initial syllables)
assert('/i˥˥/ → yi1 (yī)', convertSyllableToPinyin('i' + C_T1), 'yi1');

// With initial kʰ (aspirated velar)
// /kuo˧˥/ → guo2
assert('/kuo˧˥/ → guo2 (guó)', convertSyllableToPinyin('kuo' + C_T2), 'guo2');

// With initial ɕ (palatal fricative) + final yɛ or ɥœ
// /ɕɥœ˧˥/ → xue2
assert('/ɕɥœ˧˥/ → xue2 (xué)', convertSyllableToPinyin('ɕɥœ' + C_T2), 'xue2');

// With initial ʂʰ + ɻ (retroflex)
// /ʂʰɻ˥˩/ → shi4
assert('/ʂɻ˥˩/ → shi4 (shì)', convertSyllableToPinyin('ʂɻ' + C_T4), 'shi4');

console.log('\n=== Testing tɕ Series (j/q/x initials) ===');

// tɕ = j (unaspirated palatal affricate)
// /tɕi˥˩/ → ji4 (jì)
assert('/tɕi˥˩/ → ji4 (jì)', convertSyllableToPinyin('tɕi' + C_T4), 'ji4');

// tɕʰ = q (aspirated palatal affricate)
// /tɕʰi˥˥/ → qi1
assert('/tɕʰi˥˥/ → qi1 (qī)', convertSyllableToPinyin('tɕʰi' + C_T1), 'qi1');

// ɕ = x (palatal fricative)
// /ɕi˥˥/ → xi1
assert('/ɕi˥˥/ → xi1 (xī)', convertSyllableToPinyin('ɕi' + C_T1), 'xi1');

console.log('\n=== Testing Retroflex Series (zh/ch/sh/r) ===');

// ʈʂ = zh (unaspirated retroflex affricate)
// /ʈʂɚ˥˥/ → zhi1
assert('/ʈʂɚ˥˥/ → zhi1 (zhī)', convertSyllableToPinyin('ʈʂɚ' + C_T1), 'zhi1');

// ʈʂʰ = ch (aspirated retroflex affricate)
// /ʈʂʰɚ˥˩/ → chi4
assert('/ʈʂʰɚ˥˩/ → chi4 (chì)', convertSyllableToPinyin('ʈʂʰɚ' + C_T4), 'chi4');

// ʂ = sh (retroflex fricative)
// /ʂɚ˥˩/ → shi4
assert('/ʂɚ˥˩/ → shi4 (shì)', convertSyllableToPinyin('ʂɚ' + C_T4), 'shi4');

// ʐ = r (retroflex voiced fricative)
// /ʐɚ˧˥/ → ri2 (actually rì is 4th tone)
assert('/ʐɚ˥˩/ → ri4 (rì)', convertSyllableToPinyin('ʐɚ' + C_T4), 'ri4');

console.log('\n=== Testing ts Series (z/c/s) ===');

// ts = z (unaspirated alveolar affricate)
// /tsɿ˥˥/ → zi1
assert('/tsɿ˥˥/ → zi1 (zī)', convertSyllableToPinyin('tsɿ' + C_T1), 'zi1');

// tsʰ = c (aspirated alveolar affricate)
// /tsʰɿ˥˩/ → ci4
assert('/tsʰɿ˥˩/ → ci4 (cì)', convertSyllableToPinyin('tsʰɿ' + C_T4), 'ci4');

// s = s (alveolar fricative)
// /sɿ˥˩/ → si4
assert('/sɿ˥˩/ → si4 (sì)', convertSyllableToPinyin('sɿ' + C_T4), 'si4');

console.log('\n=== Testing Nasal Finals ===');

// /tʰʊŋ˨˩˦/ → tong3
assert('/tʰʊŋ˨˩˦/ → tong3 (tǒng)', convertSyllableToPinyin('tʰʊŋ' + C_T3), 'tong3');

// /tɕʰjɛn˥˥/ → qian1
assert('/tɕʰjɛn˥˥/ → qian1 (qiān)', convertSyllableToPinyin('tɕʰjɛn' + C_T1), 'qian1');

console.log('\n=== Testing Gemni\'s Original Input Cases ===');

// From Gemini's analysis, the original text had these words with errors:
// 國際 /guoˊ jiˊ/ (should be kuo˧˥ tɕi˥˩)
// 音 /yiˋn/ (should be in˥˥)
// 標 /biaˋo/ (should be piɛu˥˥ or similar)
// 是 /shiˊ/ (should be ʂɻ˥˩)

// The actual IPA from zh_hant.json for 國際:
// 國 /kuo˧˥/ → guo2
// 際 /tɕi˥˩/ → ji4
assert('國 /kuo˧˥/ → guo2', convertSyllableToPinyin('kuo' + C_T2), 'guo2');
assert('際 /tɕi˥˩/ → ji4', convertSyllableToPinyin('tɕi' + C_T4), 'ji4');

// For 音, actual IPA is /in˥˥/ or /ɪn˥˥/
assert('音 /in˥˥/ → yin1', convertSyllableToPinyin('in' + C_T1), 'yin1');

// For 標, check actual IPA from JSON
// /piɛu˥˥/ → biao1
assert('標 /piɛu˥˥/ → biao1', convertSyllableToPinyin('piɛu' + C_T1), 'biao1');

console.log('\n=== Testing Text Conversion ===');

// Test full text conversion
const testText = '國 /kuo˧˥/ 際 /tɕi˥˩/ 音 /in˥˥/ 是 /ʂɻ˥˩/';
const converted = convertIPATextToPinyin(testText);
console.log('Input:', testText);
console.log('Output:', converted);

console.log('\n========================================');
console.log('Results: ' + results.passed + ' passed, ' + results.failed + ' failed');
console.log('========================================\n');

export default results;
