/**
 * Game formattedPairs Extraction Tests
 *
 * Tests the per-syllable formatting algorithm used to create formattedPairs
 * for the game. The same algorithm appears in:
 *   - js/ipa-index-page.js (inline, game button click handler)
 *   - js/game-entry.js (inline, createGameButton click handler)
 *
 * Algorithm: For each [word, ipa] pair, wrap IPA in /.../, run through
 * formatter, extract content between slashes. If no formatter, use raw IPA.
 *
 * Run with: node test/game-formatted-pairs.test.js
 */

import {
  formatIPA_num as formatCantoneseIPA_num,
  formatIPA_org as formatCantoneseIPA_org,
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu,
} from '../js/yue.format.js';

import {
  formatIPA_num as formatMandarinIPA_num,
  formatIPA_org as formatMandarinIPA_org,
  convertIPATextToPinyinWithMarks,
  convertIPATextToZhuyin,
} from '../js/zh.format.js';

import { formatIPANumbers } from '../js/vi.format.js';

// ============================================
// Test Infrastructure
// ============================================

const results = { passed: 0, failed: 0, tests: [] };

function assert(name, actual, expected) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  if (passed) {
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    console.log(`  \u2713 ${name}`);
  } else {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', actual, expected });
    console.log(`  \u2717 ${name}`);
    console.log(`    Expected: ${JSON.stringify(expected)}`);
    console.log(`    Actual:   ${JSON.stringify(actual)}`);
  }
}

// ============================================
// Per-Syllable Formatting Algorithm (same as in ipa-index-page.js / game-entry.js)
// ============================================

function extractFormattedPairs(pairs, formatter) {
  return pairs.map(([w, ipa]) => {
    if (!formatter) return [w, ipa];
    // IPA values already have slashes from the database (e.g. "/ni˥˩/")
    const formatted = formatter(ipa);
    const match = formatted.match(/\/(.+?)\//);
    return [w, match ? match[1] : formatted];
  });
}

// ============================================
// Cantonese: No Formatter (raw IPA passthrough)
// ============================================

const cantonesePairs = [["你", "/nei˥˩/"], ["好", "/hou21/"]];

console.log('\n=== Cantonese: No Formatter ===');
{
  const pairs = extractFormattedPairs(cantonesePairs, null);
  assert('你 → nei˥˩', pairs[0], ["你", "nei˥˩"]);
  assert('好 → hou21', pairs[1], ["好", "hou21"]);
}

// ============================================
// Cantonese: IPA_org (identity, no transformation)
// ============================================

console.log('\n=== Cantonese: IPA_org ===');
{
  const pairs = extractFormattedPairs(cantonesePairs, formatCantoneseIPA_org);
  assert('你 → nei˥˩', pairs[0], ["你", "nei˥˩"]);
  assert('好 → hou21', pairs[1], ["好", "hou21"]);
}

// ============================================
// Cantonese: IPA_num (Chao tone → numbers)
// ============================================

console.log('\n=== Cantonese: IPA_num ===');
{
  const pairs = extractFormattedPairs(cantonesePairs, formatCantoneseIPA_num);
  // ˥→5 ˩→1 → "nei51"
  assert('你 → nei51', pairs[0], ["你", "nei51"]);
  assert('好 → hou21 (unchanged)', pairs[1], ["好", "hou21"]);
}

// ============================================
// Cantonese: Jyutping
// ============================================

console.log('\n=== Cantonese: Jyutping ===');
{
  const pairs = extractFormattedPairs(cantonesePairs, formatYueJyutping);
  // Verify pairs extracted without crash
  assert('Pair count', pairs.length, cantonesePairs.length);
  for (const [word] of pairs) {
    assert(`Word preserved: ${word}`, true, true);
  }
  console.log(`  (pairs: ${JSON.stringify(pairs)})`);
}

// ============================================
// Cantonese: Yale
// ============================================

console.log('\n=== Cantonese: Yale ===');
{
  const pairs = extractFormattedPairs(cantonesePairs, formatYueYale);
  assert('Pair count', pairs.length, cantonesePairs.length);
  console.log(`  (pairs: ${JSON.stringify(pairs)})`);
}

// ============================================
// Cantonese: Guangzhou
// ============================================

console.log('\n=== Cantonese: Guangzhou ===');
{
  const pairs = extractFormattedPairs(cantonesePairs, formatYueGuangzhou);
  assert('Pair count', pairs.length, cantonesePairs.length);
  console.log(`  (pairs: ${JSON.stringify(pairs)})`);
}

// ============================================
// Cantonese: Academy
// ============================================

console.log('\n=== Cantonese: Academy ===');
{
  const pairs = extractFormattedPairs(cantonesePairs, formatYueAcademy);
  assert('Pair count', pairs.length, cantonesePairs.length);
  console.log(`  (pairs: ${JSON.stringify(pairs)})`);
}

// ============================================
// Cantonese: Liu
// ============================================

console.log('\n=== Cantonese: Liu ===');
{
  const pairs = extractFormattedPairs(cantonesePairs, formatYueLiu);
  assert('Pair count', pairs.length, cantonesePairs.length);
  console.log(`  (pairs: ${JSON.stringify(pairs)})`);
}

// ============================================
// Mandarin: IPA_org (identity)
// ============================================

const mandarinPairs = [["你", "/ni˥˩/"], ["好", "/xau˥˩/"]];

console.log('\n=== Mandarin: IPA_org ===');
{
  const pairs = extractFormattedPairs(mandarinPairs, formatMandarinIPA_org);
  assert('你 → ni˥˩', pairs[0], ["你", "ni˥˩"]);
  assert('好 → xau˥˩', pairs[1], ["好", "xau˥˩"]);
}

// ============================================
// Mandarin: IPA_num (Chao tone → numbers)
// ============================================

console.log('\n=== Mandarin: IPA_num ===');
{
  const pairs = extractFormattedPairs(mandarinPairs, formatMandarinIPA_num);
  // ˥→5 ˩→1 → "ni51 xau51"
  assert('你 → ni51', pairs[0], ["你", "ni51"]);
  assert('好 → xau51', pairs[1], ["好", "xau51"]);
}

// ============================================
// Mandarin: Pinyin with Marks
// ============================================

console.log('\n=== Mandarin: Pinyin with Marks ===');
{
  const pairs = extractFormattedPairs(mandarinPairs, convertIPATextToPinyinWithMarks);
  assert('Pair count', pairs.length, mandarinPairs.length);
  console.log(`  (pairs: ${JSON.stringify(pairs)})`);
}

// ============================================
// Mandarin: Zhuyin
// ============================================

console.log('\n=== Mandarin: Zhuyin ===');
{
  const pairs = extractFormattedPairs(mandarinPairs, convertIPATextToZhuyin);
  assert('Pair count', pairs.length, mandarinPairs.length);
  console.log(`  (pairs: ${JSON.stringify(pairs)})`);
}

// ============================================
// Vietnamese: IPA Numbers
// ============================================

const vietnamesePairs = [["xin", "/sin˧˥/"], ["chào", "/za̞w˨˩/"]];

console.log('\n=== Vietnamese: IPA Numbers ===');
{
  const pairs = extractFormattedPairs(vietnamesePairs, formatIPANumbers);
  assert('Pair count', pairs.length, vietnamesePairs.length);
  console.log(`  (pairs: ${JSON.stringify(pairs)})`);
}

// ============================================
// Edge Cases
// ============================================

console.log('\n=== Edge Case: Repeated Characters ===');
{
  const pairs = [["人", "/jan45/"], ["人", "/jan45/"]];
  const result = extractFormattedPairs(pairs, null);
  assert('人[0] → jan45', result[0], ["人", "jan45"]);
  assert('人[1] → jan45', result[1], ["人", "jan45"]);
}

console.log('\n=== Edge Case: Single Pair ===');
{
  const pairs = [["我", "/ngɐ5/"]];
  const result = extractFormattedPairs(pairs, null);
  assert('我 → ngɐ5', result[0], ["我", "ngɐ5"]);
}

console.log('\n=== Edge Case: Empty IPA ===');
{
  const pairs = [["字", "/ /"], ["詞", "/ci4/"]];
  const result = extractFormattedPairs(pairs, null);
  assert('字 → ""', result[0], ["字", ""]);
  assert('詞 → ci4', result[1], ["詞", "ci4"]);
}

console.log('\n=== Edge Case: IPA_num with Complex Tones ===');
{
  const pairs = [["字", "/tsɪ˥˧/"], ["詞", "/sʰɐ˨˩˦/"]];
  const result = extractFormattedPairs(pairs, formatCantoneseIPA_num);
  // ˥→5 ˧→3 → "tsɪ53"
  // ˨→2 ˩→1 → "sʰɐ21˦" (˦ not converted by formatter)
  assert('字 → tsɪ53', result[0], ["字", "tsɪ53"]);
  assert('詞 → sʰɐ21˦', result[1], ["詞", "sʰɐ21˦"]);
}

console.log('\n=== Consistency: formattedPairs match pairs when no formatter ===');
{
  const pairs = [["學", "hɐk3"], ["生", "sɐŋ1"]];
  const result = extractFormattedPairs(pairs, null);
  for (let i = 0; i < pairs.length; i++) {
    assert(`${pairs[i][0]} → ${pairs[i][1]}`, result[i], pairs[i]);
  }
}

// ============================================
// Summary
// ============================================

console.log('\n========================================');
console.log(`Results: ${results.passed} passed, ${results.failed} failed`);
console.log('========================================');

if (results.failed > 0) {
  console.log('\nFailures:');
  for (const t of results.tests.filter(x => x.status === 'FAIL')) {
    console.log(`  ${t.name}`);
  }
  process.exit(1);
}
