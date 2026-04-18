/**
 * Test suite for Cantonese IPA formatter functions
 *
 * Run with: node --experimental-vm-modules node_modules/jest/bin/jest.js
 * Or directly with: node test/formatters.test.js
 */

// Import formatter functions from js/format.js
import {
  formatIPA_num,
  formatIPA_org,
  formatJyutpingCantonese,
  formatJyutping_num,
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu,
  formatYueOutput
} from '../js/format.js';

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
// Test formatIPA_num
// ============================================
console.log('\n=== Testing formatIPA_num ===');

// Test tone conversions
assert('formatIPA_num: ˥ → 5', formatIPA_num('˥'), '5');
assert('formatIPA_num: ˧ → 3', formatIPA_num('˧'), '3');
assert('formatIPA_num: ˨ → 2', formatIPA_num('˨'), '2');
assert('formatIPA_num: ˩ → 1', formatIPA_num('˩'), '1');

// Test combined IPA strings
assert('formatIPA_num: ˥˧ → 53', formatIPA_num('˥˧'), '53');
assert('formatIPA_num: ˧˥ → 35', formatIPA_num('˧˥'), '35');
assert('formatIPA_num: ˨˩ → 21', formatIPA_num('˨˩'), '21');

// Test full IPA with tone
assert('formatIPA_num: /nei˥˧/ → /nei53/',
  formatIPA_num('/nei˥˧/'), '/nei53/');

// ============================================
// Test formatIPA_org
// ============================================
console.log('\n=== Testing formatIPA_org ===');

assert('formatIPA_org: no transformation',
  formatIPA_org('test'), 'test');
assert('formatIPA_org: preserves IPA',
  formatIPA_org('/nei˥˧/'), '/nei˥˧/');

// ============================================
// Test formatJyutpingCantonese
// ============================================
console.log('\n=== Testing formatJyutpingCantonese ===');

// Test tone conversions for regular tones
assert('formatJyutpingCantonese: ˥˧ → 1', formatJyutpingCantonese('˥˧'), '1');
assert('formatJyutpingCantonese: ˧˥ → 2', formatJyutpingCantonese('˧˥'), '2');
assert('formatJyutpingCantonese: ˧ → 3', formatJyutpingCantonese('˧'), '3');
assert('formatJyutpingCantonese: ˨˩ → 4', formatJyutpingCantonese('˨˩'), '4');
assert('formatJyutpingCantonese: ˩˧ → 5', formatJyutpingCantonese('˩˧'), '5');
assert('formatJyutpingCantonese: ˨˨ → 6', formatJyutpingCantonese('˨˨'), '6');

// Test entering tones (7, 8, 9)
assert('formatJyutpingCantonese: k˥ → k7', formatJyutpingCantonese('k˥'), 'k7');
assert('formatJyutpingCantonese: k˧ → k8', formatJyutpingCantonese('k˧'), 'k8');
assert('formatJyutpingCantonese: k˨ → k9', formatJyutpingCantonese('k˨'), 'k9');
assert('formatJyutpingCantonese: t˥ → t7', formatJyutpingCantonese('t˥'), 't7');
assert('formatJyutpingCantonese: p˥ → p7', formatJyutpingCantonese('p˥'), 'p7');

// Test combined IPA with other chars (should only convert tones)
assert('formatJyutpingCantonese: nei˥˧ → nei1',
  formatJyutpingCantonese('nei˥˧'), 'nei1');

// ============================================
// Test formatJyutping_num (deprecated)
// ============================================
console.log('\n=== Testing formatJyutping_num ===');

// This function uses tone marks from formatJyutpingMandarin
// which is wrong for Cantonese - it's a bug!
console.log('Note: formatJyutping_num is deprecated and may produce unexpected results');

// ============================================
// Test formatYueJyutping
// ============================================
console.log('\n=== Testing formatYueJyutping (IPA → Jyutping) ===');

// Test simple syllables with finals
assert('formatYueJyutping: /a:/ → /aa/',
  formatYueJyutping('/a:/'), '/aa/');
assert('formatYueJyutping: /a:i/ → /aai/',
  formatYueJyutping('/a:i/'), '/aai/');
assert('formatYueJyutping: /a:u/ → /aau/',
  formatYueJyutping('/a:u/'), '/aau/');

// Test initials
assert('formatYueJyutping: /p/ → /b/',
  formatYueJyutping('/p/'), '/b/');
assert('formatYueJyutping: /pʰ/ → /p/',
  formatYueJyutping('/pʰ/'), '/p/');
assert('formatYueJyutping: /t/ → /d/',
  formatYueJyutping('/t/'), '/d/');
assert('formatYueJyutping: /k/ → /g/',
  formatYueJyutping('/k/'), '/g/');

// Test voiced consonants (nasals)
assert('formatYueJyutping: /m/ → /m/',
  formatYueJyutping('/m/'), '/m/');
assert('formatYueJyutping: /n/ → /n/',
  formatYueJyutping('/n/'), '/n/');
assert('formatYueJyutping: /ŋ/ → /ng/',
  formatYueJyutping('/ŋ/'), '/ng/');

// Test sibilants
assert('formatYueJyutping: /ts/ → /z/',
  formatYueJyutping('/ts/'), '/z/');
assert('formatYueJyutping: /tsʰ/ → /c/',
  formatYueJyutping('/tsʰ/'), '/c/');
assert('formatYueJyutping: /s/ → /s/',
  formatYueJyutping('/s/'), '/s/');

// Test labiovelars
assert('formatYueJyutping: /kʷ/ → /gw/',
  formatYueJyutping('/kʷ/'), '/gw/');
assert('formatYueJyutping: /kʷʰ/ → /kw/',
  formatYueJyutping('/kʷʰ/'), '/kw/');

// Test vowel combinations
assert('formatYueJyutping: /ɐi/ → /ai/',
  formatYueJyutping('/ɐi/'), '/ai/');
assert('formatYueJyutping: /ɐu/ → /au/',
  formatYueJyutping('/ɐu/'), '/au/');

// Test long vowels
assert('formatYueJyutping: /ɛ:/ → /e/',
  formatYueJyutping('/ɛ:/'), '/e/');
assert('formatYueJyutping: /ɔ:/ → /o/',
  formatYueJyutping('/ɔ:/'), '/o/');
assert('formatYueJyutping: /œ:/ → /oe/',
  formatYueJyutping('/œ:/'), '/oe/');

// Test high vowels
assert('formatYueJyutping: /i:/ → /i/',
  formatYueJyutping('/i:/'), '/i/');
assert('formatYueJyutping: /y:/ → /yu/',
  formatYueJyutping('/y:/'), '/yu/');

// Test special syllables
assert('formatYueJyutping: /m̩/ → /m/',
  formatYueJyutping('/m̩/'), '/m/');
assert('formatYueJyutping: /ŋ̩/ → /ng/',
  formatYueJyutping('/ŋ̩/'), '/ng/');

// Test finals with endings
assert('formatYueJyutping: /a:m/ → /aam/',
  formatYueJyutping('/a:m/'), '/aam/');
assert('formatYueJyutping: /a:n/ → /aan/',
  formatYueJyutping('/a:n/'), '/aan/');
assert('formatYueJyutping: /a:ŋ/ → /aang/',
  formatYueJyutping('/a:ŋ/'), '/aang/');

// Test entering tone finals (p, t, k)
assert('formatYueJyutping: /a:p/ → /aap/',
  formatYueJyutping('/a:p/'), '/aap/');
assert('formatYueJyutping: /a:t/ → /aat/',
  formatYueJyutping('/a:t/'), '/aat/');
assert('formatYueJyutping: /a:k/ → /aak/',
  formatYueJyutping('/a:k/'), '/aak/');

// Test /ŋ/ final
assert('formatYueJyutping: /ɐŋ/ → /ang/',
  formatYueJyutping('/ɐŋ/'), '/ang/');
assert('formatYueJyutping: /ɐk/ → /ak/',
  formatYueJyutping('/ɐk/'), '/ak/');

// Test /u:/ final
assert('formatYueJyutping: /u:/ → /u/',
  formatYueJyutping('/u:/'), '/u/');
assert('formatYueJyutping: /ʊŋ/ → /ung/',
  formatYueJyutping('/ʊŋ/'), '/ung/');

// Test /ɪ/ variant finals
assert('formatYueJyutping: /ɪŋ/ → /ing/',
  formatYueJyutping('/ɪŋ/'), '/ing/');
assert('formatYueJyutping: /ɪk/ → /ik/',
  formatYueJyutping('/ɪk/'), '/ik/');

// Test mid vowels
assert('formatYueJyutping: /ei/ → /ei/',
  formatYueJyutping('/ei/'), '/ei/');
assert('formatYueJyutping: /ou/ → /ou/',
  formatYueJyutping('/ou/'), '/ou/');

// Test special finals
assert('formatYueJyutping: /ɛ:u/ → /eu/',
  formatYueJyutping('/ɛ:u/'), '/eu/');
assert('formatYueJyutping: /ɛ:m/ → /em/',
  formatYueJyutping('/ɛ:m/'), '/em/');
assert('formatYueJyutping: /ɛ:n/ → /en/',
  formatYueJyutping('/ɛ:n/'), '/en/');
assert('formatYueJyutping: /ɛ:ŋ/ → /eng/',
  formatYueJyutping('/ɛ:ŋ/'), '/eng/');

// Test /ɵ/ finals
assert('formatYueJyutping: /ɵy/ → /eoi/',
  formatYueJyutping('/ɵy/'), '/eoi/');
assert('formatYueJyutping: /ɵn/ → /eon/',
  formatYueJyutping('/ɵn/'), '/eon/');
assert('formatYueJyutping: /ɵt/ → /eot/',
  formatYueJyutping('/ɵt/'), '/eot/');

// Test /œ:/ finals
assert('formatYueJyutping: /œ:ŋ/ → /oeng/',
  formatYueJyutping('/œ:ŋ/'), '/oeng/');
assert('formatYueJyutping: /œ:k/ → /oek/',
  formatYueJyutping('/œ:k/'), '/oek/');
assert('formatYueJyutping: /œ:t/ → /oet/',
  formatYueJyutping('/œ:t/'), '/oet/');

// Test i finals
assert('formatYueJyutping: /i:m/ → /im/',
  formatYueJyutping('/i:m/'), '/im/');
assert('formatYueJyutping: /i:n/ → /in/',
  formatYueJyutping('/i:n/'), '/in/');
assert('formatYueJyutping: /i:p/ → /ip/',
  formatYueJyutping('/i:p/'), '/ip/');
assert('formatYueJyutping: /i:t/ → /it/',
  formatYueJyutping('/i:t/'), '/it/');
assert('formatYueJyutping: /i:u/ → /iu/',
  formatYueJyutping('/i:u/'), '/iu/');

// Test /ʊ/ variant
assert('formatYueJyutping: /ʊk/ → /uk/',
  formatYueJyutping('/ʊk/'), '/uk/');

// Test /ɐ/ finals
assert('formatYueJyutping: /ɐm/ → /am/',
  formatYueJyutping('/ɐm/'), '/am/');
assert('formatYueJyutping: /ɐn/ → /an/',
  formatYueJyutping('/ɐn/'), '/an/');
assert('formatYueJyutping: /ɐp/ → /ap/',
  formatYueJyutping('/ɐp/'), '/ap/');
assert('formatYueJyutping: /ɐt/ → /at/',
  formatYueJyutping('/ɐt/'), '/at/');

// Test /ɔ:/ finals
assert('formatYueJyutping: /ɔ:i/ → /oi/',
  formatYueJyutping('/ɔ:i/'), '/oi/');
assert('formatYueJyutping: /ɔ:n/ → /on/',
  formatYueJyutping('/ɔ:n/'), '/on/');
assert('formatYueJyutping: /ɔ:ŋ/ → /ong/',
  formatYueJyutping('/ɔ:ŋ/'), '/ong/');
assert('formatYueJyutping: /ɔ:t/ → /ot/',
  formatYueJyutping('/ɔ:t/'), '/ot/');
assert('formatYueJyutping: /ɔ:k/ → /ok/',
  formatYueJyutping('/ɔ:k/'), '/ok/');

// Test /u:/ finals
assert('formatYueJyutping: /u:i/ → /ui/',
  formatYueJyutping('/u:i/'), '/ui/');
assert('formatYueJyutping: /u:n/ → /un/',
  formatYueJyutping('/u:n/'), '/un/');
assert('formatYueJyutping: /u:t/ → /ut/',
  formatYueJyutping('/u:t/'), '/ut/');

// Test /y:/ finals
assert('formatYueJyutping: /y:n/ → /yun/',
  formatYueJyutping('/y:n/'), '/yun/');
assert('formatYueJyutping: /y:t/ → /yut/',
  formatYueJyutping('/y:t/'), '/yut/');

// ============================================
// Test formatYueGuangzhou
// ============================================
console.log('\n=== Testing formatYueGuangzhou (粵拼 → 廣拼) ===');

// Test final conversions
assert('formatYueGuangzhou: aa → a', formatYueGuangzhou('aa1'), 'a1');
assert('formatYueGuangzhou: aai → ai', formatYueGuangzhou('aai1'), 'ai1');
assert('formatYueGuangzhou: aau → ao', formatYueGuangzhou('aau1'), 'ao1');
assert('formatYueGuangzhou: aam → am', formatYueGuangzhou('aam1'), 'am1');
assert('formatYueGuangzhou: aan → an', formatYueGuangzhou('aan1'), 'an1');
assert('formatYueGuangzhou: aang → ang', formatYueGuangzhou('aang1'), 'ang1');

// Test entering tone finals
assert('formatYueGuangzhou: aap → ab', formatYueGuangzhou('aap1'), 'ab1');
assert('formatYueGuangzhou: aat → ad', formatYueGuangzhou('aat1'), 'ad1');
assert('formatYueGuangzhou: aak → ag', formatYueGuangzhou('aak1'), 'ag1');

// Test e finals
assert('formatYueGuangzhou: e → é', formatYueGuangzhou('e1'), 'é1');
assert('formatYueGuangzhou: ei → éi', formatYueGuangzhou('ei1'), 'éi1');
assert('formatYueGuangzhou: eu → éo', formatYueGuangzhou('eu1'), 'éo1');
assert('formatYueGuangzhou: eng → éng', formatYueGuangzhou('eng1'), 'éng1');

// Test zh /zh
assert('formatYueGuangzhou: ep → éb', formatYueGuangzhou('ep1'), 'éb1');
assert('formatYueGuangzhou: et → éd', formatYueGuangzhou('et1'), 'éd1');
assert('formatYueGuangzhou: ek → ég', formatYueGuangzhou('ek1'), 'ég1');

// Test initial conversions
assert('formatYueGuangzhou: gw → gu', formatYueGuangzhou('gw1'), 'gu1');
assert('formatYueGuangzhou: kw → ku', formatYueGuangzhou('kw1'), 'ku1');

// Test z, c, s (same as j, q, x when followed by i or ü)
assert('formatYueGuangzhou: z → z', formatYueGuangzhou('zi1'), 'zi1');

// ============================================
// Test formatYueAcademy (教院)
// ============================================
console.log('\n=== Testing formatYueAcademy (粵拼 → 教院) ===');

// Most finals are the same, but initials differ
assert('formatYueAcademy: z → dz', formatYueAcademy('zi1'), 'dzi1');
assert('formatYueAcademy: c → ts', formatYueAcademy('ci1'), 'tsi1');
assert('formatYueAcademy: gw → gw', formatYueAcademy('gw1'), 'gw1');
assert('formatYueAcademy: eoi → oey', formatYueAcademy('eoi1'), 'oey1');
assert('formatYueAcademy: eon → oen', formatYueAcademy('eon1'), 'oen1');
assert('formatYueAcademy: eot → oet', formatYueAcademy('eot1'), 'oet1');
assert('formatYueAcademy: yu → y', formatYueAcademy('yu1'), 'y1');
assert('formatYueAcademy: yun → yn', formatYueAcademy('yun1'), 'yn1');
assert('formatYueAcademy: yut → yt', formatYueAcademy('yut1'), 'yt1');

// ============================================
// Test formatYueYale (耶魯)
// ============================================
console.log('\n=== Testing formatYueYale (粵拼 → 耶魯) ===');

// Test Yale conversions - uses tone marks and h for level 4 and 5
assert('formatYueYale: o → oh', formatYueYale('o1'), 'oh1');
assert('formatYueYale: z → j', formatYueYale('zi1'), 'ji1');
assert('formatYueYale: c → ch', formatYueYale('ci1'), 'chi1');
assert('formatYueYale: j → y', formatYueYale('ji1'), 'yi1');
assert('formatYueYale: oe → eu', formatYueYale('oe1'), 'eu1');
assert('formatYueYale: oeng → eung', formatYueYale('oeng1'), 'eung1');
assert('formatYueYale: oek → euk', formatYueYale('oek1'), 'euk1');
assert('formatYueYale: eoi → eui', formatYueYale('eoi1'), 'eui1');
assert('formatYueYale: eon → eun', formatYueYale('eon1'), 'eun1');
assert('formatYueYale: eot → eut', formatYueYale('eot1'), 'eut1');
assert('formatYueYale: yu → yu', formatYueYale('yu1'), 'yu1');
assert('formatYueYale: yun → yun', formatYueYale('yun1'), 'yun1');
assert('formatYueYale: yut → yut', formatYueYale('yut1'), 'yut1');

// Test Yale tone marks (simplified - actual implementation has tone mark rules)
// Level 1: macron (ā)
// Level 2: acute (á)
// Level 3: no mark (a)
// Level 4: grave + h (àh)
// Level 5: acute + h (áh)
// Level 6: grave + h (àh)

// ============================================
// Test formatYueLiu (劉錫祥)
// ============================================
console.log('\n=== Testing formatYueLiu (粵拼 → 劉錫祥) ===');

// Test Liu Sik-hong conversions
assert('formatYueLiu: o → o', formatYueLiu('o1'), 'o1');
assert('formatYueLiu: u → oo', formatYueLiu('u1'), 'oo1');
assert('formatYueLiu: ui → ooi', formatYueLiu('ui1'), 'ooi1');
assert('formatYueLiu: un → oon', formatYueLiu('un1'), 'oon1');
assert('formatYueLiu: ut → oot', formatYueLiu('ut1'), 'oot1');
assert('formatYueLiu: oe → euh', formatYueLiu('oe1'), 'euh1');
assert('formatYueLiu: oeng → eung', formatYueLiu('oeng1'), 'eung1');
assert('formatYueLiu: oek → euk', formatYueLiu('oek1'), 'euk1');
assert('formatYueLiu: z → j', formatYueLiu('zi1'), 'ji1');
assert('formatYueLiu: c → ch', formatYueLiu('ci1'), 'chi1');
assert('formatYueLiu: eoi → ui', formatYueLiu('eoi1'), 'ui1');
assert('formatYueLiu: eon → un', formatYueLiu('eon1'), 'un1');
assert('formatYueLiu: eot → ut', formatYueLiu('eot1'), 'ut1');
assert('formatYueLiu: yu → ue', formatYueLiu('yu1'), 'ue1');
assert('formatYueLiu: yun → uen', formatYueLiu('yun1'), 'uen1');
assert('formatYueLiu: yut → uet', formatYueLiu('yut1'), 'uet1');

// ============================================
// Summary
// ============================================
console.log('\n========================================');
console.log(`Test Results: ${results.passed} passed, ${results.failed} failed`);
console.log('========================================\n');

// Export for use with test runners
export default results;
