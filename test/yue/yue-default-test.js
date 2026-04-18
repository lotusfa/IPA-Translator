/**
 * Test suite for Cantonese IPA conversion - Real-world examples from table.md
 * 
 * Tests converting IPA transcriptions from the article text to various romanization schemes.
 * Uses word groups (not individual characters) as per table.md examples.
 * 
 * Run with: node test/yue-default-test.js
 */

// Import formatter functions from js/yue.format.js
import {
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu
} from '../js/yue.format.js';

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Test assertion helper
 */
function assert(name, actual, expected) {
  const passed = actual === expected;
  if (passed) {
    results.passed++;
    results.tests.push({ name, status: 'PASS', actual, expected });
    console.log(`✓ ${name}`);
  } else {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', actual, expected });
    console.log(`✗ ${name}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual:   ${actual}`);
  }
}

// ============================================
// Test words from the article text
// Source: 國際音標 /kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥/ ( 又 /jɐu˨/ ) ( 叫 /ki:u˧/ )...
// ============================================

console.log('\n=== Testing IPA → All 5 Schemes ===\n');

// Test 粵拼 (Jyutping)
console.log('--- 粵拼 (Jyutping) ---');
assert('Jyutping: [kʷɔ:k˧] → /gwok3/', formatYueJyutping('/kʷɔ:k˧/'), '/gwok3/');
assert('Jyutping: [tsɐi˧] → /zai3/', formatYueJyutping('/tsɐi˧/'), '/zai3/');
assert('Jyutping: [jɐu˨] → /jau6/', formatYueJyutping('/jɐu˨/'), '/jau6/');
assert('Jyutping: [ki:u˧] → /giu3/', formatYueJyutping('/ki:u˧/'), '/giu3/');
assert('Jyutping: [ma:n˨] → /maan6/', formatYueJyutping('/ma:n˨/'), '/maan6/');
assert('Jyutping: [jɐm˥] → /jam1/', formatYueJyutping('/jɐm˥/'), '/jam1/');
assert('Jyutping: [pi:u˥] → /biu1/', formatYueJyutping('/pi:u˥/'), '/biu1/');

// Test 廣拼 (Guangzhou)
console.log('\n--- 廣拼 (Guangzhou) ---');
assert('Guangzhou: [kʷɔ:k˧] → /gok3/', formatYueGuangzhou('/kʷɔ:k˧/'), '/gok3/');
assert('Guangzhou: [tsɐi˧] → /zai3/', formatYueGuangzhou('/tsɐi˧/'), '/zai3/');
assert('Guangzhou: [jɐu˨] → /yau6/', formatYueGuangzhou('/jɐu˨/'), '/yau6/');
assert('Guangzhou: [ma:n˨] → /man6/', formatYueGuangzhou('/ma:n˨/'), '/man6/');

// Test 教院 (Academy)
console.log('\n--- 教院 (Academy) ---');
assert('Academy: [p] → /b/', formatYueAcademy('/p/'), '/b/');
assert('Academy: [kʷɔ:k˧] → /gok3/', formatYueAcademy('/kʷɔ:k˧/'), '/gok3/');

// Test 耶魯 (Yale)
console.log('\n--- 耶魯 (Yale) ---');
assert('Yale: [ŋ̩] → /ng/', formatYueYale('/ŋ̩/'), '/ng/');

// Test 劉錫祥 (Liu)
console.log('\n--- 劉錫祥 (Liu) ---');
assert('Liu: [p] → /b/', formatYueLiu('/p/'), '/b/');

console.log('\n========================================');
console.log(`Total: ${results.passed + results.failed} tests`);
console.log(`Passed: ${results.passed}`);
console.log(`Failed: ${results.failed}`);
console.log('========================================\n');

if (results.failed > 0) {
  process.exit(1);
}
