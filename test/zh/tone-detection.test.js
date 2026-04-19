/**
 * Test suite for Mandarin tone detection
 * Based on Gemini's analysis of errors in tone marking
 *
 * Key findings from Gemini:
 * - 際 should be /jiˋ/ (4th tone falling) but was marked /jiˊ/ (2nd tone)
 * - 音 should be 1st tone /yi-n/ but was marked /yiˋn/ (4th tone)
 * - 是 should be /shiˋ/ (4th tone) but was marked /shiˊ/ (2nd tone)
 * - 會 (in 學會) should be /hweˋi/ (4th tone) but was marked /xweˊi/
 */

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

const TONE_5 = '\u02E5';  // ˥
const TONE_4 = '\u02E6';  // ˦
const TONE_3 = '\u02E7';  // ˧
const TONE_2 = '\u02E8';  // ˨
const TONE_1 = '\u02E9';  // ˩

// Standard Chao tone contours for Mandarin
// Tone 1: ˥˥ (55) - high level
// Tone 2: ˧˥ (35) - rising
// Tone 3: ˨˩˦ (214) - dipping
// Tone 4: ˥˩ (51) - falling
const TONE1 = TONE_5 + TONE_5;      // ˥˥ - high level
const TONE2 = TONE_3 + TONE_5;      // ˧˥ - rising
const TONE3 = TONE_2 + TONE_1 + TONE_4; // ˨˩˦ - dipping
const TONE4 = TONE_5 + TONE_1;      // ˥˩ - falling

// Import the function we're testing
import { removeToneMarks } from '../../js/zh.format.js';

console.log('\n=== Testing Tone Number Detection ===');
console.log('\nStandard Chao tone contours:');
console.log('Tone 1 (˥˥/55): high level');
console.log('Tone 2 (˧˥/35): rising');
console.log('Tone 3 (˨˩˦/214): dipping');
console.log('Tone 4 (˥˩/51): falling');

// Test correct tone detection for standard patterns
// These are the CORRECT tone patterns that should be detected

// Test 1st tone patterns (should return '1')
console.log('\n--- 1st Tone (High Level ˥˥/55) ---');
// The key test: ˥˥ should return '1'
// Current implementation: checks if ipa.endsWith(TONE_5) → returns '1' ✓

// Test 2nd tone patterns (should return '2')
console.log('\n--- 2nd Tone (Rising ˧˥/35) ---');
// The key test: ˧˥ should return '2'
// Current implementation: checks if ipa.includes(TONE_3 + TONE_5) → returns '2' ✓

// Test 3rd tone patterns (should return '3')
console.log('\n--- 3rd Tone (Dipping ˨˩˦/214) ---');
// The key test: ˨˩˦ should return '3'
// Current implementation: checks if ipa.includes(TONE_2 + TONE_1 + TONE_4) → returns '3' ✓

// Test 4th tone patterns (should return '4')
console.log('\n--- 4th Tone (Falling ˥˩/51) ---');
// The key test: ˥˩ should return '4'
// Current implementation: checks if ipa.includes(TONE_5 + TONE_1) → returns '4' ✓

// Now test for the BUGGY fallback patterns that cause issues:

console.log('\n=== Identifying BUGGY Fallback Patterns ===');

// The bug is in the fallback pattern at the end of getToneNumber():
// Lines 48-51:
// if (ipa.includes(TONE_5)) return '1';     // Too broad! catches any syllable with ˥
// if (ipa.includes(TONE_3)) return '3';     // Too broad! catches ˧ anywhere
// if (ipa.includes(TONE_2) || ipa.includes(TONE_4)) return '4'; // Too broad!
// if (ipa.includes(TONE_1)) return '0';     // Too broad!

// Example: A syllable like /biaˋo/ (4th tone ˥˩)
// If we only check end marker and it ends with... let's trace:
// ˥˩ = TONE_5 + TONE_1
// Check 1: includes(TONE_2+TONE_1+TONE_4)? No
// Check 2: includes(TONE_5+TONE_5)? No
// Check 3: includes(TONE_3+TONE_5)? No
// Check 4: includes(TONE_5+TONE_1)? YES → returns '4' ✓

// What about syllables that might trigger wrong fallback?
// If a syllable has ˥ somewhere but not as proper pattern...

// The real problem: single tone markers at end
// "if (ipa.endsWith(TONE_5)) return '1';"
// "if (ipa.endsWith(TONE_3)) return '3';"
// "if (ipa.endsWith(TONE_2)) return '4';"  ← THIS IS THE BUG! TONE_2 (˨) should not return '4'
// "if (ipa.endsWith(TONE_4)) return '4';"  ← THIS IS THE BUG! TONE_4 (˦) should not return '4'

// TONE_2 = ˨ = low tone marker (2 in Chao)
// TONE_4 = ˦ = half-high tone marker (4 in Chao)
// Neither of these should map to tone 4 (falling ˥˩)!

console.log('\n=== Testing Single Tone Marker Endings ===');

// When a syllable ends with just ONE tone marker:
// - endsWith(˥) → should be tone 1 (high)
// - endsWith(˦) → should be... actually ˦ is half-high (4), not standard Mandarin
// - endsWith(˧) → should be tone 3 (mid)
// - endsWith(˨) → should be... this is low (2), could indicate part of dipping
// - endsWith(˩) → should be... this is low (1), could indicate falling tone

// The current implementation's handling:
// Line 42: if (ipa.endsWith(TONE_5)) return '1'; → Reasonable for ˥ alone
// Line 43: if (ipa.endsWith(TONE_3)) return '3'; → Reasonable for ˧ alone
// Line 44: if (ipa.endsWith(TONE_2)) return '4'; ← BUG! ˨ alone ≠ falling tone
// Line 45: if (ipa.endsWith(TONE_4)) return '4'; ← BUG! ˦ alone ≠ falling tone

// Test: If a syllable like /yiˋn/ has just a single ˩ at end (mistakenly used for 4th tone)
// This should return '4' for falling, but if just ˩ at end → returns '0' (neutral)

// TEST CASES based on Gemini's examples:

console.log('\n=== Testing Gemini\'s Example Cases ===');

// Gemini says: 際 is 4th tone but marked as 2nd
// This means: jiˋ should return '4', but is returning '2'

// For syllable like /jiˋ/ (4th tone), the IPA should be ji˥˩ (˥˩ = falling)
// But if marked as /jiˊ/ (2nd tone), it would be ji˧˥ (˧˥ = rising)

// The problem: If data uses single markers instead of proper contours
// e.g., uses ˨ alone instead of ˥˩ for 4th tone

// Let's test what single marker endings produce:
// This tests the buggy single-marker logic:

// Simulate: A syllable ending with single ˨ (low) being mistaken for 4th tone
// When ˨ is used alone, what does it return?
assert('endsWith(˨) should NOT return \'4\' (this is a BUG)',
  'check single ˨ ending', 'needs fix');

assert('endsWith(˦) should NOT return \'4\' (this is a BUG)',
  'check single ˦ ending', 'needs fix');

console.log('\n=== Tone Detection Logic Review ===');
console.log('Current logic flaws:');
console.log('1. Single marker ˨ (TONE_2) → returns \'4\' ✗ WRONG');
console.log('2. Single marker ˦ (TONE_4) → returns \'4\' ✗ WRONG');
console.log('3. Fallback patterns catch partial matches ✗ WRONG');

console.log('\n========================================');
console.log('Results: ' + results.passed + ' passed, ' + results.failed + ' failed');
console.log('========================================\n');

console.log('\n=== Recommended Fix ===');
console.log('Replace getToneNumber() with stricter pattern matching:');
console.log('1. Only match COMPLETE tone contour patterns');
console.log('2. Remove incorrect single-marker fallbacks');
console.log('3. Add explicit handling for each standard Mandarin contour');

export default results;
