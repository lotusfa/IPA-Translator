/**
 * Test user-friendly IPA input normalization
 * Users can now type "kw" instead of "kʷ" and "kwʰ" instead of "kʷʰ"
 */

import {
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu
} from '../js/yue.format.js';

const results = { passed: 0, failed: 0 };

function assert(name, actual, expected) {
  if (actual === expected) {
    results.passed++;
    console.log(`✓ ${name}`);
  } else {
    results.failed++;
    console.log(`✗ ${name}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual:   ${actual}`);
  }
}

console.log('\n=== Testing User-Friendly IPA Input ===\n');

// ============================================
// Test "kw" normalization for [kʷ]
// ============================================
console.log('--- Testing "kw" → "kʷ" ---');

// User-friendly notation
assert('User-friendly: /kwɔ:k˧/ → /gwok3/',
  formatYueJyutping('/kwɔ:k˧/'), '/gwok3/');

assert('User-friendly: /kwa:˥/ → /gwaa1/',
  formatYueJyutping('/kwa:˥/'), '/gwaa1/');

assert('User-friendly: /kwa:˥/ → /gwaa1/',
  formatYueJyutping('/kwa:˥/'), '/gwaa1/');

// Proper IPA notation (should also work)
assert('Proper IPA: /kʷɔ:k˧/ → /gwok3/',
  formatYueJyutping('/kʷɔ:k˧/'), '/gwok3/');

assert('Proper IPA: /kʷa:˥/ → /gwaa1/',
  formatYueJyutping('/kʷa:˥/'), '/gwaa1/');

// ============================================
// Test "kwʰ" normalization for [kʷʰ]
// ============================================
console.log('\n--- Testing "kwʰ" → "kʷʰ" ---');

// User-friendly notation
assert('User-friendly: /kʰa:˥/ (should be /kwʰa:˥/) → /kwaa1/',
  formatYueJyutping('/kwʰa:˥/'), '/kwaa1/');

// Proper IPA notation
assert('Proper IPA: /kʷʰa:˥/ → /kwaa1/',
  formatYueJyutping('/kʷʰa:˥/'), '/kwaa1/');

// ============================================
// Real examples from user
// ============================================
console.log('\n--- Real User Examples ---');

// User input: /kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/
// Expected: /gwok3 zai3 jam1 biu1/
assert('User: /kwɔ:k˧/ → /gwok3/',
  formatYueJyutping('/kwɔ:k˧/'), '/gwok3/');

assert('User: /tsɐi˧/ → /zai3/',
  formatYueJyutping('/tsɐi˧/'), '/zai3/');

assert('User: /jɐm˥/ → /jam1/',
  formatYueJyutping('/jɐm˥/'), '/jam1/');

assert('User: /pi:u˥/ → /biu1/',
  formatYueJyutping('/pi:u˥/'), '/biu1/');

// Full sentence test
const fullInput = '/kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/';
const fullOutput = formatYueJyutping(fullInput);
console.log(`\nFull test: ${fullInput}`);
console.log(`  Output: ${fullOutput}`);
console.log(`  Expected: /gwok3 zai3 jam1 biu1/`);

if (fullOutput === '/gwok3 zai3 jam1 biu1/') {
  console.log('  ✓ PASS\n');
  results.passed++;
} else {
  console.log('  ✗ FAIL\n');
  results.failed++;
}

// ============================================
// Test all schemes
// ============================================
console.log('--- All Schemes Test ---');

const testIPA = '/kwɔ:k˧/';

console.log(`\nTesting: ${testIPA}`);
console.log(`  Jyutping:    ${formatYueJyutping(testIPA)}`);
console.log(`  Guangzhou:   ${formatYueGuangzhou(testIPA)}`);
console.log(`  Academy:     ${formatYueAcademy(testIPA)}`);
console.log(`  Yale:        ${formatYueYale(testIPA)}`);
console.log(`  Liu:         ${formatYueLiu(testIPA)}`);

// ============================================
// Summary
// ============================================
console.log('\n========================================');
console.log(`Test Results: ${results.passed} passed, ${results.failed} failed`);
console.log('========================================\n');
