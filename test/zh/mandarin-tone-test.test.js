/**
 * Test suite for Mandarin tone detection - Based on Gemini feedback
 *
 * Gemini's Analysis:
 * The input text contains many tone marking errors where 4th tone (ˋ) was marked as 2nd tone (ˊ)
 * and 1st tone (no mark or ˉ) was often marked as 4th tone (ˋ).
 *
 * Key errors identified:
 * - 際 should be /jiˋ/ (4th) but was /jiˊ/ (2nd)
 * - 音 should be /yin-/ (1st) but was /yiˋn/ (4th)
 * - 是 should be /shiˋ/ (4th) but was /shiˊ/ (2nd)
 * - 會 (in 學會) should be /hweˋi/ (4th) but was /xweˊi/ (2nd)
 * - 設計 should be /sheˋ jiˋ/ (both 4th) but was /sheˊ jiˊ/ (2nd)
 * - 系 should be /xiˋ/ (4th) but was /xiˊ/ (2nd)
 *
 * The format uses: ˉ (1st), ˊ (2nd), ˇ (3rd), ˋ (4th) for single marker style
 * Or: ˥˥ (1st), ˧˥ (2nd), ˨˩˦ (3rd), ˥˩ (4th) for Chao contour style
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

// Define tone markers
// Single marker style (diacritic tone marks):
const TONE1_SINGLE = '\u02C9';  // ˉ macron (1st tone - high level)
const TONE2_SINGLE = '\u02CA';  // ˊ acute (2nd tone - rising)
const TONE3_SINGLE = '\u02C7';  // ˇ caron (3rd tone - dipping)
const TONE4_SINGLE = '\u02CB';  // ˋ grave (4th tone - falling)

// Chao tone letters (contour style):
const TONE_5 = '\u02E5';  // ˥ extra-high (5)
const TONE_4 = '\u02E6';  // ˦ half-high (4)
const TONE_3 = '\u02E7';  // ˧ mid (3)
const TONE_2 = '\u02E8';  // ˨ low (2)
const TONE_1 = '\u02E9';  // ˩ extra-low (1)

// Standard Chao contours:
const CHAO_TONE1 = TONE_5 + TONE_5;        // ˥˥ (55) - high level
const CHAO_TONE2 = TONE_3 + TONE_5;        // ˧˥ (35) - rising
const CHAO_TONE3 = TONE_2 + TONE_1 + TONE_4; // ˨˩˦ (214) - dipping
const CHAO_TONE4 = TONE_5 + TONE_1;        // ˥˩ (51) - falling

console.log('\n=== Testing Single-Marker Tone Style ===');
console.log('Format: Uses ˉ ˊ ˇ ˋ as single tone markers');

// Test tone 1 (high level ˉ): /yi-n/  → pinyin yī
assert('音 /yinˉ/ should convert to yī',
  convertSyllableToPinyin('yin' + TONE1_SINGLE), 'yin1');

// Test tone 2 (rising ˊ): /guoˊ/ → pinyin guó
assert('國 /guoˊ/ should convert to guo2',
  convertSyllableToPinyin('guo' + TONE2_SINGLE), 'guo2');

// Test tone 3 (dipping ˇ): /yiˇ/ → pinyin yǐ
assert('以 /yiˇ/ should convert to yi3',
  convertSyllableToPinyin('yi' + TONE3_SINGLE), 'yi3');

// Test tone 4 (falling ˋ): /shiˋ/ → pinyin shì
assert('是 /shiˋ/ should convert to shi4',
  convertSyllableToPinyin('shi' + TONE4_SINGLE), 'shi4');

console.log('\n=== Testing Chao Contour Style ===');
console.log('Format: Uses ˥˥ ˧˥ ˨˩˦ ˥˩ for tone contours');

// Test Chao tone contours
assert('音 /yin˥˥/ (T1) should convert to yin1',
  convertSyllableToPinyin('yin' + CHAO_TONE1), 'yin1');

assert('國 /guo˧˥/ (T2) should convert to guo2',
  convertSyllableToPinyin('guo' + CHAO_TONE2), 'guo2');

assert('一 /yi˨˩˦/ (T3) should convert to yi3',
  convertSyllableToPinyin('yi' + CHAO_TONE3), 'yi3');

assert('際 /ji˥˩/ (T4) should convert to ji4',
  convertSyllableToPinyin('ji' + CHAO_TONE4), 'ji4');

console.log('\n=== Testing Gemini\'s Error Cases ===');

// The errors Gemini identified - showing what the WRONG input produces
// These tests help identify if the system correctly handles proper input

// Correct 4th tone for 際 (should be ji4)
console.log('\n--- Correct 4th Tone Markings ---');
assert('際 /ji˥˩/ (correct 4th) = ji4',
  convertSyllableToPinyin('ji' + CHAO_TONE4), 'ji4');

// Correct 1st tone for 音 (should be yin1)
console.log('\n--- Correct 1st Tone Markings ---');
assert('音 /yin˥˥/ (correct 1st) = yin1',
  convertSyllableToPinyin('yin' + CHAO_TONE1), 'yin1');

// Correct 4th tone for 是 (should be shi4)
console.log('\n--- Correct 4th Tone for 是 ---');
assert('是 /shi˥˩/ (correct 4th) = shi4',
  convertSyllableToPinyin('shi' + CHAO_TONE4), 'shi4');

// Correct 4th tone for 會 (in 學會, should be hwe4)
console.log('\n--- Correct 4th Tone for 會 ---');
assert('會 /hwe˥˩/ (correct 4th) = hwe4',
  convertSyllableToPinyin('hwe' + CHAO_TONE4), 'hwe4');

// Correct 4th tone for 設計 (both should be 4th)
console.log('\n--- Correct 4th Tone for 設計 ---');
assert('設 /she˥˩/ (correct 4th) = she4',
  convertSyllableToPinyin('she' + CHAO_TONE4), 'she4');

assert('計 /ji˥˩/ (correct 4th) = ji4',
  convertSyllableToPinyin('ji' + CHAO_TONE4), 'ji4');

// Correct 4th tone for 系 (should be xi4)
console.log('\n--- Correct 4th Tone for 系 ---');
assert('系 /xi˥˩/ (correct 4th) = xi4',
  convertSyllableToPinyin('xi' + CHAO_TONE4), 'xi4');

// Correct 1st tone for 標 (should be biao1)
console.log('\n--- Correct 1st Tone for 標 ---');
assert('標 /biao˥˥/ (correct 1st) = biao1',
  convertSyllableToPinyin('biao' + CHAO_TONE1), 'biao1');

// Correct 4th tone for 丁 (should be ding4 - but Gemini says dīng is 1st)
console.log('\n--- Correct 1st Tone for 丁 ---');
assert('丁 /ding˥˥/ (correct 1st) = ding1',
  convertSyllableToPinyin('ding' + CHAO_TONE1), 'ding1');

console.log('\n=== Testing Full Text Conversion ===');

// Test the full sentence from Gemini with CORRECT tone markings
const correctSentence = '國際 /guo˧˥ ji˥˩/ (音 /yi˥˥n/ ) ( 標 /biao˥˥/ ) 是 /shi˥˩/ 一 /yi˨˩˦/ 種 /zhoŋ˨˩˦/ ...';

console.log('\nTesting text conversion with proper tone contours...');
const converted = convertIPATextToPinyin('國際 /guo' + CHAO_TONE2 + ' ji' + CHAO_TONE4 + '/');
console.log('Result:', converted);

console.log('\n========================================');
console.log('Results: ' + results.passed + ' passed, ' + results.failed + ' failed');
console.log('========================================\n');

// Export for further analysis
export default results;
