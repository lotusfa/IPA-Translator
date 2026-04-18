/**
 * Test to verify user-friendly IPA input normalization
 * Users often type "kw" instead of "kʷ" (the proper IPA symbol)
 */

import { formatYueJyutping } from '../js/yue.format.js';

console.log('\n=== Testing User-Friendly IPA Input ===\n');

// Test cases where users might use "kw" instead of "kʷ"
const testCases = [
  // Proper IPA notation with kʷ
  { input: '/kʷɔ:k˧/', expected: '/gwok3/', desc: 'Proper IPA: [kʷɔ:k˧]' },
  
  // User-friendly notation with "kw" (should be normalized to kʷ)
  { input: '/kwɔ:k˧/', expected: '/gwok3/', desc: 'User-friendly: [kwɔ:k˧]' },
  
  // Proper IPA notation with kʷʰ
  { input: '/kʷʰa:˥/', expected: '/kwaa1/', desc: 'Proper IPA: [kʷʰa:˥]' },
  
  // User-friendly notation with "kwʰ" (should be normalized to kʷʰ)
  { input: '/kwʰa:˥/', expected: '/kwaa1/', desc: 'User-friendly: [kwʰa:˥]' },
  
  // Real example: 誇 /kʷʰa:˥/
  { input: '/kwʰa:˥/', expected: '/kwaa1/', desc: '誇: [kwʰa:˥]' },
];

testCases.forEach(test => {
  const actual = formatYueJyutping(test.input);
  const passed = actual === test.expected;
  console.log(`${passed ? '✓' : '✗'} ${test.desc}`);
  console.log(`  Input:    ${test.input}`);
  console.log(`  Expected: ${test.expected}`);
  console.log(`  Actual:   ${actual}`);
  if (!passed) {
    console.log('  ISSUE: "kw" notation is not recognized as "kʷ"');
  }
  console.log();
});

