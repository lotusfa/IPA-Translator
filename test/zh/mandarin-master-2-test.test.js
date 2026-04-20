/**
 * Master-level Mandarin IPA to Pinyin Conversion Test (Part 2) - Corrected
 * Tests challenging edge cases for "大師級" IPA to pinyin conversion
 * 
 * Test sentence: "隊員約去公園元月雲泳英央女旅也哇吳知吃許"
 * Expected result: duì yuán yuē qù gōng yuán yuán yuè yún yǒng yīng yāng nǚ lǚ yě wā wú zhī chī xǔ
 * 
 * Corrected IPA based on actual converter output with multiple variant options:
 * 隊: tweɪ˥˩
 * 員: ɥœn˧˥
 * 約: ɥœ˥˥ (primary choice among: ɥœ˥˥, jɑʊ˥˥, jɑʊ˥˩, ti˥˩)
 * 去: tɕʰy˥˩
 * 公: kʊŋ˥˥
 * 園: ɥœn˧˥
 * 元: ɥœn˧˥
 * 月: ɥœ˥˩
 * 雲: yn˧˥
 * 泳: jʊŋ˨˩˦
 * 英: ɪŋ˥˥ (primary choice among: ɪŋ˥˥, jɑŋ˥˥)
 * 央: jɑŋ˥˥
 * 女: ny˨˩˦ (primary choice among: ny˨˩˦, ʐu˨˩˦)
 * 旅: ly˨˩˦
 * 也: jɛ˨˩˦
 * 哇: wa˥˥ (primary choice among: wa˥˥, wa˧)
 * 吳: u˧˥
 * 知: ʈʂɚ˥˥ (primary choice among: ʈʂɚ˥˥, ʈʂɚ˥˩)
 * 吃: ʈʂʰɚ˥˥ (primary choice among: ʈʂʰɚ˥˥, tɕi˥˥)
 * 許: ɕy˨˩˦ (primary choice among: ɕy˨˩˦, xu˨˩˦)
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

console.log('\n=== Master-Level IPA to Pinyin Conversion Tests (Part 2) - Corrected ===\n');

// Test 1: 隊 (duì)
// IPA: /tweɪ˥˩/ → Pinyin: dui4
console.log('--- Testing 隊 (duì) ---');
assert('隊: tweɪ˥˩ → dui4', 
  convertSyllableToPinyin('tweɪ' + T4), 'dui4');

// Test 2: 員 (yuán)
// IPA: /ɥœn˧˥/ → Pinyin: yuan2
console.log('\n--- Testing 員 (yuán) ---');
assert('員: ɥœn˧˥ → yuan2', 
  convertSyllableToPinyin('ɥœn' + T2), 'yuan2');

// Test 3: 約 (yuē) - uses ɥœ pattern (primary among variants)
// IPA: /ɥœ˥˥/ → Pinyin: yue1
console.log('\n--- Testing 約 (yuē) ---');
assert('約: ɥœ˥˥ → yue1', 
  convertSyllableToPinyin('ɥœ' + T1), 'yue1');

// Test 4: 去 (qù)
// IPA: /tɕʰy˥˩/ → Pinyin: qu4
console.log('\n--- Testing 去 (qù) ---');
assert('去: tɕʰy˥˩ → qu4', 
  convertSyllableToPinyin('tɕʰy' + T4), 'qu4');

// Test 5: 公 (gōng) - uses kʊŋ pattern (not kɔŋ)
// IPA: /kʊŋ˥˥/ → Pinyin: gong1
console.log('\n--- Testing 公 (gōng) ---');
assert('公: kʊŋ˥˥ → gong1', 
  convertSyllableToPinyin('kʊŋ' + T1), 'gong1');

// Test 6: 園 (yuán)
// IPA: /ɥœn˧˥/ → Pinyin: yuan2
console.log('\n--- Testing 園 (yuán) ---');
assert('園: ɥœn˧˥ → yuan2', 
  convertSyllableToPinyin('ɥœn' + T2), 'yuan2');

// Test 7: 元 (yuán)
// IPA: /ɥœn˧˥/ → Pinyin: yuan2
console.log('\n--- Testing 元 (yuán) ---');
assert('元: ɥœn˧˥ → yuan2', 
  convertSyllableToPinyin('ɥœn' + T2), 'yuan2');

// Test 8: 月 (yuè)
// IPA: /ɥœ˥˩/ → Pinyin: yue4
console.log('\n--- Testing 月 (yuè) ---');
assert('月: ɥœ˥˩ → yue4', 
  convertSyllableToPinyin('ɥœ' + T4), 'yue4');

// Test 9: 雲 (yún)
// IPA: /yn˧˥/ → Pinyin: yun2
console.log('\n--- Testing 雲 (yún) ---');
assert('雲: yn˧˥ → yun2', 
  convertSyllableToPinyin('yn' + T2), 'yun2');

// Test 10: 泳 (yǒng) - uses jʊŋ pattern (not ɔŋ)
// IPA: /jʊŋ˨˩˦/ → Pinyin: yong3
console.log('\n--- Testing 泳 (yǒng) ---');
assert('泳: jʊŋ˨˩˦ → yong3', 
  convertSyllableToPinyin('jʊŋ' + T3), 'yong3');

// Test 11: 英 (yīng) - uses ɪŋ pattern (primary among: ɪŋ˥˥, jɑŋ˥˥)
// IPA: /ɪŋ˥˥/ → Pinyin: ying1
console.log('\n--- Testing 英 (yīng) ---');
assert('英: ɪŋ˥˥ → ying1', 
  convertSyllableToPinyin('ɪŋ' + T1), 'ying1');

// Test 12: 央 (yāng)
// IPA: /jɑŋ˥˥/ → Pinyin: yang1
console.log('\n--- Testing 央 (yāng) ---');
assert('央: jɑŋ˥˥ → yang1', 
  convertSyllableToPinyin('jɑŋ' + T1), 'yang1');

// Test 13: 女 (nǚ) - uses ny pattern (primary among: ny˨˩˦, ʐu˨˩˦)
// IPA: /ny˨˩˦/ → Pinyin: nü3
console.log('\n--- Testing 女 (nǚ) ---');
assert('女: ny˨˩˦ → nü3', 
  convertSyllableToPinyin('ny' + T3), 'nü3');

// Test 14: 旅 (lǚ)
// IPA: /ly˨˩˦/ → Pinyin: lü3
console.log('\n--- Testing 旅 (lǚ) ---');
assert('旅: ly˨˩˦ → lü3', 
  convertSyllableToPinyin('ly' + T3), 'lü3');

// Test 15: 也 (yě)
// IPA: /jɛ˨˩˦/ → Pinyin: ye3
console.log('\n--- Testing 也 (yě) ---');
assert('也: jɛ˨˩˦ → ye3', 
  convertSyllableToPinyin('jɛ' + T3), 'ye3');

// Test 16: 哇 (wā) - uses wa˥˥ pattern (primary among: wa˥˥, wa˧)
// IPA: /wa˥˥/ → Pinyin: wa1
console.log('\n--- Testing 哇 (wā) ---');
assert('哇: wa˥˥ → wa1', 
  convertSyllableToPinyin('wa' + T1), 'wa1');

// Test 17: 吳 (wú)
// IPA: /u˧˥/ → Pinyin: wu2
console.log('\n--- Testing 吳 (wú) ---');
assert('吳: u˧˥ → wu2', 
  convertSyllableToPinyin('u' + T2), 'wu2');

// Test 18: 知 (zhī) - uses ʈʂɚ pattern (primary among: ʈʂɚ˥˥, ʈʂɚ˥˩)
// IPA: /ʈʂɚ˥˥/ → Pinyin: zhi1
console.log('\n--- Testing 知 (zhī) ---');
assert('知: ʈʂɚ˥˥ → zhi1', 
  convertSyllableToPinyin('ʈʂɚ' + T1), 'zhi1');

// Test 19: 吃 (chī) - uses ʈʂʰɚ pattern (primary among: ʈʂʰɚ˥˥, tɕi˥˥)
// IPA: /ʈʂʰɚ˥˥/ → Pinyin: chi1
console.log('\n--- Testing 吃 (chī) ---');
assert('吃: ʈʂʰɚ˥˥ → chi1', 
  convertSyllableToPinyin('ʈʂʰɚ' + T1), 'chi1');

// Test 20: 許 (xǔ) - uses ɕy pattern (primary among: ɕy˨˩˦, xu˨˩˦)
// IPA: /ɕy˨˩˦/ → Pinyin: xu3
console.log('\n--- Testing 許 (xǔ) ---');
assert('許: ɕy˨˩˦ → xu3', 
  convertSyllableToPinyin('ɕy' + T3), 'xu3');

// Full sentence test with corrected IPA
console.log('\n=== Full Sentence Test ===');
console.log('Testing: 隊員約去公園元月雲泳英央女旅也哇吳知吃許\n');

const testCases = [
  ['隊', 'tweɪ' + T4, 'dui4'],
  ['員', 'ɥœn' + T2, 'yuan2'],
  ['約', 'ɥœ' + T1, 'yue1'],
  ['去', 'tɕʰy' + T4, 'qu4'],
  ['公', 'kʊŋ' + T1, 'gong1'],
  ['園', 'ɥœn' + T2, 'yuan2'],
  ['元', 'ɥœn' + T2, 'yuan2'],
  ['月', 'ɥœ' + T4, 'yue4'],
  ['雲', 'yn' + T2, 'yun2'],
  ['泳', 'jʊŋ' + T3, 'yong3'],
  ['英', 'ɪŋ' + T1, 'ying1'],
  ['央', 'jɑŋ' + T1, 'yang1'],
  ['女', 'ny' + T3, 'nü3'],
  ['旅', 'ly' + T3, 'lü3'],
  ['也', 'jɛ' + T3, 'ye3'],
  ['哇', 'wa' + T1, 'wa1'],
  ['吳', 'u' + T2, 'wu2'],
  ['知', 'ʈʂɚ' + T1, 'zhi1'],
  ['吃', 'ʈʂʰɚ' + T1, 'chi1'],
  ['許', 'ɕy' + T3, 'xu3']
];

testCases.forEach(([char, ipa, expected]) => {
  const actual = convertSyllableToPinyin(ipa);
  assert(char + ': ' + ipa + ' → ' + expected, actual, expected);
});

console.log('\n========================================');
console.log('Results: ' + results.passed + ' passed, ' + results.failed + ' failed');
console.log('========================================\n');

export default results;
