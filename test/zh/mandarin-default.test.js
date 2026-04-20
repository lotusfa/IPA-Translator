/**
 * Default Mandarin IPA to Pinyin Conversion Test
 * Tests to catch systematic IPA → pinyin normalization bugs
 * 
 * Focus areas (based on bug analysis):
 * 1. Syllabic consonants (ɻ̩ → i after zh/ch/sh/r/z/c/s)
 * 2. ü series (ɥ → ü, not u)
 * 3. y series (y → i, not yu)
 * 4. Tone mapping (˧˥ → 2, ˥˩ → 4, etc.)
 * 5. t/k mapping (t → t, not d; k → k, not g)
 * 6. Proper normalization order (ui → uei internally, but output as ui)
 */

import {
  convertSyllableToPinyin,
  convertIPATextToPinyin
} from '../../js/zh.format.js';

const results = { passed: 0, failed: 0, tests: [] };

// Tone markers
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

console.log('\n=== Default Mandarin IPA to Pinyin Tests ===\n');

// ============================================
// 1️⃣ Syllabic Consonants (ɻ̩ → i)
// ============================================
console.log('--- 1️⃣ Syllabic Consonants (ɻ̩ → i) ---');
assert('ʈʂɻ̩ → zhi', convertSyllableToPinyin('ʈʂɻ̩' + T1), 'zhi1');
assert('ʈʂʰɻ̩ → chi', convertSyllableToPinyin('ʈʂʰɻ̩' + T1), 'chi1');
assert('ʂɻ̩ → shi', convertSyllableToPinyin('ʂɻ̩' + T4), 'shi4');
assert('ɻ̩ → ri', convertSyllableToPinyin('ɻ̩' + T4), 'ri4');
assert('tsɻ̩ → zi', convertSyllableToPinyin('tsɻ̩' + T1), 'zi1');
assert('tsʰɻ̩ → ci', convertSyllableToPinyin('tsʰɻ̩' + T2), 'ci2');
assert('sɻ̩ → si', convertSyllableToPinyin('sɻ̩' + T4), 'si4');

// ============================================
// 2️⃣ ü Series (ɥ → ü, NOT u)
// ============================================
console.log('\n--- 2️⃣ ü Series (ɥ → ü) ---');
// With j/q/x/y, ɥ should become ü
assert('tɕɥ → ju', convertSyllableToPinyin('tɕɥ' + T1), 'ju1');
assert('tɕʰɥɛn → quan', convertSyllableToPinyin('tɕʰɥɛn' + T2), 'quan2');
assert('ɕɥe → xue', convertSyllableToPinyin('ɕɥe' + T2), 'xue2');
assert('ɥan → yuan', convertSyllableToPinyin('ɥan' + T2), 'yuan2');
assert('ɥn → yun', convertSyllableToPinyin('ɥn' + T2), 'yun2');
assert('ɥo → yuo', convertSyllableToPinyin('ɥo' + T1), 'yuo1');

// l + ü should keep umlaut
assert('ly → lü', convertSyllableToPinyin('ly' + T4), 'lü4');
assert('lɥe → lüe', convertSyllableToPinyin('lɥe' + T4), 'lüe4');

// ============================================
// 3️⃣ y Series (y → i, NOT yu)
// ============================================
console.log('\n--- 3️⃣ y Series (y → i) ---');
assert('ya → ia', convertSyllableToPinyin('ya' + T1), 'ya1');
assert('yo → io', convertSyllableToPinyin('yo' + T1), 'yo1');
assert('ye → ie', convertSyllableToPinyin('ye' + T2), 'ye2');
assert('you → iou', convertSyllableToPinyin('you' + T1), 'you1');
assert('yan → ian', convertSyllableToPinyin('yan' + T1), 'yan1');
assert('yin → in', convertSyllableToPinyin('yin' + T1), 'yin1');
assert('ying → ing', convertSyllableToPinyin('ying' + T4), 'ying4');
assert('yong → iong', convertSyllableToPinyin('yong' + T4), 'yong4');

// ============================================
// 4️⃣ Tone Mapping (˥˩ → 4, ˧˥ → 2, etc.)
// ============================================
console.log('\n--- 4️⃣ Tone Mapping ---');
// Check tone conversion
assert('ʈʂoŋ˥˥ → zhong1', convertSyllableToPinyin('ʈʂoŋ' + T1), 'zhong1');
assert('ʈʂoŋ˧˥ → zhong2', convertSyllableToPinyin('ʈʂoŋ' + T2), 'zhong2');
assert('ʈʂoŋ˨˩˦ → zhong3', convertSyllableToPinyin('ʈʂoŋ' + T3), 'zhong3');
assert('ʈʂoŋ˥˩ → zhong4', convertSyllableToPinyin('ʈʂoŋ' + T4), 'zhong4');

assert('tʰjɛn˥˥ → tian1', convertSyllableToPinyin('tʰjɛn' + T1), 'tian1');
assert('tʰjɛn˧˥ → tian2', convertSyllableToPinyin('tʰjɛn' + T2), 'tian2');
assert('tʰjɛn˨˩˦ → tian3', convertSyllableToPinyin('tʰjɛn' + T3), 'tian3');
assert('tʰjɛn˥˩ → tian4', convertSyllableToPinyin('tʰjɛn' + T4), 'tian4');

// ============================================
// 5️⃣ t/k Mapping (t → t, k → k, NOT d/g)
// ============================================
console.log('\n--- 5️⃣ t/k Mapping (t → t, k → k) ---');
assert('toŋ → tong', convertSyllableToPinyin('toŋ' + T1), 'tong1');
assert('tʰoŋ → tong2', convertSyllableToPinyin('tʰoŋ' + T2), 'tong2');
assert('ko → kuo', convertSyllableToPinyin('ko' + T1), 'kuo1');
assert('kʰo → kuo2', convertSyllableToPinyin('kʰo' + T2), 'kuo2');
assert('hoŋ → hong', convertSyllableToPinyin('hoŋ' + T4), 'hong4');

// ============================================
// 6️⃣ Proper Normalization Order
// ============================================
console.log('\n--- 6️⃣ Normalization Order (ui → uei internally) ---');
// Normalized output should still be gui, not guei
assert('gui → gui', convertSyllableToPinyin('gui' + T1), 'gui1');
assert('lun → lun', convertSyllableToPinyin('lun' + T4), 'lun4');
assert('liu → liu', convertSyllableToPinyin('liu' + T2), 'liu2');

// Internal forms should normalize correctly
assert('guei → gui', convertSyllableToPinyin('guei' + T1), 'gui1');
assert('luen → lun', convertSyllableToPinyin('luen' + T4), 'lun4');
assert('liou → liu', convertSyllableToPinyin('liou' + T2), 'liu2');

// ============================================
// 7️⃣ IPA Consonant Mapping (ʈʂ → zh, etc.)
// ============================================
console.log('\n--- 7️⃣ IPA Consonant Mapping ---');
assert('ʈʂ → zh', convertSyllableToPinyin('ʈʂa' + T4), 'zha4');
assert('ʈʂʰ → ch', convertSyllableToPinyin('ʈʂʰa' + T4), 'cha4');
assert('ʂ → sh', convertSyllableToPinyin('ʂa' + T4), 'sha4');
assert('ɻ → r', convertSyllableToPinyin('ɻa' + T2), 'ra2');
assert('ts → z', convertSyllableToPinyin('tsa' + T4), 'za4');
assert('tsʰ → c', convertSyllableToPinyin('tsʰa' + T4), 'ca4');
assert('s → s', convertSyllableToPinyin('sa' + T4), 'sa4');

// ============================================
// 8️⃣ Zero Initial (No Leading Consonant)
// ============================================
console.log('\n--- 8️⃣ Zero Initial ---');
assert('an → an', convertSyllableToPinyin('an' + T1), 'an1');
assert('ang → ang', convertSyllableToPinyin('ang' + T4), 'ang4');
assert('ai → ai', convertSyllableToPinyin('ai' + T4), 'ai4');
assert('ou → ou', convertSyllableToPinyin('ou' + T2), 'ou2');
assert('o → o', convertSyllableToPinyin('o' + T1), 'o1');

// ============================================
// 9️⃣ Full Sentence Test (Mixed Cases)
// ============================================
console.log('\n--- 9️⃣ Full Sentence Test ---');
assert('ʈʂoŋˊ kuoˊ → zhong2 guo2', 
  convertIPATextToPinyin('/ʈʂoŋ' + T2 + ' ' + 'kuo' + T2 +"/"), '/zhong2 guo2/');
assert('ɕyɛˊ → xue2', convertSyllableToPinyin('ɕyɛ' + T2), 'xue2');
assert('xueiˋ → hui4', convertSyllableToPinyin('xuei' + T4), 'hui4');
assert('ʈʂʰuˇ → chu3', convertSyllableToPinyin('ʈʂʰu' + T3), 'chu3');

// ============================================
// 🔟 w Series (w → u)
// ============================================
console.log('\n--- 🔟 w Series (w → u) ---');
assert('wa → ua', convertSyllableToPinyin('wa' + T1), 'wa1');
assert('wo → uo', convertSyllableToPinyin('wo' + T3), 'wo3');
assert('wei → ui', convertSyllableToPinyin('wei' + T4), 'wei4');
assert('wen → uen', convertSyllableToPinyin('wen' + T2), 'wen2');

// ============================================
// Summary
// ============================================
console.log('\n========================================');
console.log('Results: ' + results.passed + ' passed, ' + results.failed + ' failed');
console.log('========================================\n');

export default results;
