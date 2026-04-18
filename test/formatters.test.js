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
// Test IPA → Different Schemes (声母对照表例字)
// ============================================
console.log('\n=== Testing IPA → Different Schemes (声母对照表) ===');

// 声母对照表例字测试
// 巴 [p] → 粵拼:b, 廣拼:b, 教院:b, 耶魯:b, 劉錫祥:b
assert('formatYueJyutping(/p/): /b/', formatYueJyutping('/p/'), '/b/');
assert('formatYueGuangzhou(/p/): /b/', formatYueGuangzhou('/p/'), '/b/');
assert('formatYueAcademy(/p/): /b/', formatYueAcademy('/p/'), '/b/');
assert('formatYueYale(/p/): /b/', formatYueYale('/p/'), '/b/');
assert('formatYueLiu(/p/): /b/', formatYueLiu('/p/'), '/b/');

// 趴 [pʰ] → 粵拼:p, 廣拼:p, 教院:p, 耶魯:p, 劉錫祥:p
assert('formatYueJyutping(/pʰ/): /p/', formatYueJyutping('/pʰ/'), '/p/');
assert('formatYueGuangzhou(/pʰ/): /p/', formatYueGuangzhou('/pʰ/'), '/p/');
assert('formatYueAcademy(/pʰ/): /p/', formatYueAcademy('/pʰ/'), '/p/');
assert('formatYueYale(/pʰ/): /p/', formatYueYale('/pʰ/'), '/p/');
assert('formatYueLiu(/pʰ/): /p/', formatYueLiu('/pʰ/'), '/p/');

// 媽 [m] → 粵拼:m, 廣拼:m, 教院:m, 耶魯:m, 劉錫祥:m
assert('formatYueJyutping(/m/): /m/', formatYueJyutping('/m/'), '/m/');
assert('formatYueGuangzhou(/m/): /m/', formatYueGuangzhou('/m/'), '/m/');
assert('formatYueAcademy(/m/): /m/', formatYueAcademy('/m/'), '/m/');
assert('formatYueYale(/m/): /m/', formatYueYale('/m/'), '/m/');
assert('formatYueLiu(/m/): /m/', formatYueLiu('/m/'), '/m/');

// 花 [f] → 粵拼:f, 廣拼:f, 教院:f, 耶魯:f, 劉錫祥:f
assert('formatYueJyutping(/f/): /f/', formatYueJyutping('/f/'), '/f/');
assert('formatYueGuangzhou(/f/): /f/', formatYueGuangzhou('/f/'), '/f/');
assert('formatYueAcademy(/f/): /f/', formatYueAcademy('/f/'), '/f/');
assert('formatYueYale(/f/): /f/', formatYueYale('/f/'), '/f/');
assert('formatYueLiu(/f/): /f/', formatYueLiu('/f/'), '/f/');

// 打 [t] → 粵拼:d, 廣拼:d, 教院:d, 耶魯:d, 劉錫祥:d
assert('formatYueJyutping(/t/): /d/', formatYueJyutping('/t/'), '/d/');
assert('formatYueGuangzhou(/t/): /d/', formatYueGuangzhou('/t/'), '/d/');
assert('formatYueAcademy(/t/): /d/', formatYueAcademy('/t/'), '/d/');
assert('formatYueYale(/t/): /d/', formatYueYale('/t/'), '/d/');
assert('formatYueLiu(/t/): /d/', formatYueLiu('/t/'), '/d/');

// 他 [tʰ] → 粵拼:t, 廣拼:t, 教院:t, 耶魯:t, 劉錫祥:t
assert('formatYueJyutping(/tʰ/): /t/', formatYueJyutping('/tʰ/'), '/t/');
assert('formatYueGuangzhou(/tʰ/): /t/', formatYueGuangzhou('/tʰ/'), '/t/');
assert('formatYueAcademy(/tʰ/): /t/', formatYueAcademy('/tʰ/'), '/t/');
assert('formatYueYale(/tʰ/): /t/', formatYueYale('/tʰ/'), '/t/');
assert('formatYueLiu(/tʰ/): /t/', formatYueLiu('/tʰ/'), '/t/');

// 拿 [n] → 粵拼:n, 廣拼:n, 教院:n, 耶魯:n, 劉錫祥:n
assert('formatYueJyutping(/n/): /n/', formatYueJyutping('/n/'), '/n/');
assert('formatYueGuangzhou(/n/): /n/', formatYueGuangzhou('/n/'), '/n/');
assert('formatYueAcademy(/n/): /n/', formatYueAcademy('/n/'), '/n/');
assert('formatYueYale(/n/): /n/', formatYueYale('/n/'), '/n/');
assert('formatYueLiu(/n/): /n/', formatYueLiu('/n/'), '/n/');

// 啦 [l] → 粵拼:l, 廣拼:l, 教院:l, 耶魯:l, 劉錫祥:l
assert('formatYueJyutping(/l/): /l/', formatYueJyutping('/l/'), '/l/');
assert('formatYueGuangzhou(/l/): /l/', formatYueGuangzhou('/l/'), '/l/');
assert('formatYueAcademy(/l/): /l/', formatYueAcademy('/l/'), '/l/');
assert('formatYueYale(/l/): /l/', formatYueYale('/l/'), '/l/');
assert('formatYueLiu(/l/): /l/', formatYueLiu('/l/'), '/l/');

// 家 [k] → 粵拼:g, 廣拼:g, 教院:g, 耶魯:g, 劉錫祥:g
assert('formatYueJyutping(/k/): /g/', formatYueJyutping('/k/'), '/g/');
assert('formatYueGuangzhou(/k/): /g/', formatYueGuangzhou('/k/'), '/g/');
assert('formatYueAcademy(/k/): /g/', formatYueAcademy('/k/'), '/g/');
assert('formatYueYale(/k/): /g/', formatYueYale('/k/'), '/g/');
assert('formatYueLiu(/k/): /g/', formatYueLiu('/k/'), '/g/');

// 卡 [kʰ] → 粵拼:k, 廣拼:k, 教院:k, 耶魯:k, 劉錫祥:k
assert('formatYueJyutping(/kʰ/): /k/', formatYueJyutping('/kʰ/'), '/k/');
assert('formatYueGuangzhou(/kʰ/): /k/', formatYueGuangzhou('/kʰ/'), '/k/');
assert('formatYueAcademy(/kʰ/): /k/', formatYueAcademy('/kʰ/'), '/k/');
assert('formatYueYale(/kʰ/): /k/', formatYueYale('/kʰ/'), '/k/');
assert('formatYueLiu(/kʰ/): /k/', formatYueLiu('/kʰ/'), '/k/');

// 牙 [ŋ] → 粵拼:ng, 廣拼:ng, 教院:ng, 耶魯:ng, 劉錫祥:ng
assert('formatYueJyutping(/ŋ/): /ng/', formatYueJyutping('/ŋ/'), '/ng/');
assert('formatYueGuangzhou(/ŋ/): /ng/', formatYueGuangzhou('/ŋ/'), '/ng/');
assert('formatYueAcademy(/ŋ/): /ng/', formatYueAcademy('/ŋ/'), '/ng/');
assert('formatYueYale(/ŋ/): /ng/', formatYueYale('/ŋ/'), '/ng/');
assert('formatYueLiu(/ŋ/): /ng/', formatYueLiu('/ŋ/'), '/ng/');

// 哈 [h] → 粵拼:h, 廣拼:h, 教院:h, 耶魯:h, 劉錫祥:h
assert('formatYueJyutping(/h/): /h/', formatYueJyutping('/h/'), '/h/');
assert('formatYueGuangzhou(/h/): /h/', formatYueGuangzhou('/h/'), '/h/');
assert('formatYueAcademy(/h/): /h/', formatYueAcademy('/h/'), '/h/');
assert('formatYueYale(/h/): /h/', formatYueYale('/h/'), '/h/');
assert('formatYueLiu(/h/): /h/', formatYueLiu('/h/'), '/h/');

// 渣 [ts] → 粵拼:z, 廣拼:z/j, 教院:dz, 耶魯:j, 劉錫祥:j
assert('formatYueJyutping(/ts/): /z/', formatYueJyutping('/ts/'), '/z/');
assert('formatYueGuangzhou(/ts/): /z/', formatYueGuangzhou('/ts/'), '/z/');
assert('formatYueAcademy(/ts/): /dz/', formatYueAcademy('/ts/'), '/dz/');
assert('formatYueYale(/ts/): /j/', formatYueYale('/ts/'), '/j/');
assert('formatYueLiu(/ts/): /j/', formatYueLiu('/ts/'), '/j/');

// 差 [tsʰ] → 粵拼:c, 廣拼:c/q, 教院:ts, 耶魯:ch, 劉錫祥:ch
assert('formatYueJyutping(/tsʰ/): /c/', formatYueJyutping('/tsʰ/'), '/c/');
assert('formatYueGuangzhou(/tsʰ/): /c/', formatYueGuangzhou('/tsʰ/'), '/c/');
assert('formatYueAcademy(/tsʰ/): /ts/', formatYueAcademy('/tsʰ/'), '/ts/');
assert('formatYueYale(/tsʰ/): /ch/', formatYueYale('/tsʰ/'), '/ch/');
assert('formatYueLiu(/tsʰ/): /ch/', formatYueLiu('/tsʰ/'), '/ch/');

// 沙 [s] → 粵拼:s, 廣拼:s/x, 教院:s, 耶魯:s, 劉錫祥:s
assert('formatYueJyutping(/s/): /s/', formatYueJyutping('/s/'), '/s/');
assert('formatYueGuangzhou(/s/): /s/', formatYueGuangzhou('/s/'), '/s/');
assert('formatYueAcademy(/s/): /s/', formatYueAcademy('/s/'), '/s/');
assert('formatYueYale(/s/): /s/', formatYueYale('/s/'), '/s/');
assert('formatYueLiu(/s/): /s/', formatYueLiu('/s/'), '/s/');

// 瓜 [kʷ] → 粵拼:gw, 廣拼:gu, 教院:gw, 耶魯:gw, 劉錫祥:gw
assert('formatYueJyutping(/kʷ/): /gw/', formatYueJyutping('/kʷ/'), '/gw/');
assert('formatYueGuangzhou(/kʷ/): /gu/', formatYueGuangzhou('/kʷ/'), '/gu/');
assert('formatYueAcademy(/kʷ/): /gw/', formatYueAcademy('/kʷ/'), '/gw/');
assert('formatYueYale(/kʷ/): /gw/', formatYueYale('/kʷ/'), '/gw/');
assert('formatYueLiu(/kʷ/): /gw/', formatYueLiu('/kʷ/'), '/gw/');

// 夸 [kʷʰ] → 粵拼:kw, 廣拼:ku, 教院:kw, 耶魯:kw, 劉錫祥:kw
assert('formatYueJyutping(/kʷʰ/): /kw/', formatYueJyutping('/kʷʰ/'), '/kw/');
assert('formatYueGuangzhou(/kʷʰ/): /ku/', formatYueGuangzhou('/kʷʰ/'), '/ku/');
assert('formatYueAcademy(/kʷʰ/): /kw/', formatYueAcademy('/kʷʰ/'), '/kw/');
assert('formatYueYale(/kʷʰ/): /kw/', formatYueYale('/kʷʰ/'), '/kw/');
assert('formatYueLiu(/kʷʰ/): /kw/', formatYueLiu('/kʷʰ/'), '/kw/');

// 也 [j] → 粵拼:j, 廣拼:y, 教院:j, 耶魯:y, 劉錫祥:y
assert('formatYueJyutping(/j/): /j/', formatYueJyutping('/j/'), '/j/');
assert('formatYueGuangzhou(/j/): /y/', formatYueGuangzhou('/j/'), '/y/');
assert('formatYueAcademy(/j/): /j/', formatYueAcademy('/j/'), '/j/');
assert('formatYueYale(/j/): /y/', formatYueYale('/j/'), '/y/');
assert('formatYueLiu(/j/): /y/', formatYueLiu('/j/'), '/y/');

// 蛙 [w] → 粵拼:w, 廣拼:w, 教院:w, 耶魯:w, 劉錫祥:w
assert('formatYueJyutping(/w/): /w/', formatYueJyutping('/w/'), '/w/');
assert('formatYueGuangzhou(/w/): /w/', formatYueGuangzhou('/w/'), '/w/');
assert('formatYueAcademy(/w/): /w/', formatYueAcademy('/w/'), '/w/');
assert('formatYueYale(/w/): /w/', formatYueYale('/w/'), '/w/');
assert('formatYueLiu(/w/): /w/', formatYueLiu('/w/'), '/w/');

// ============================================
// Test IPA → Different Schemes (韵母对照表例字)
// ============================================
console.log('\n=== Testing IPA → Different Schemes (韵母对照表) ===');

// 韻母對照表例字测试
// 啊 [aː] → 粵拼:aa, 廣拼:a, 教院:aa, 耶魯:a, 劉錫祥:a
assert('formatYueJyutping(/a:/): /aa/', formatYueJyutping('/a:/'), '/aa/');
assert('formatYueGuangzhou(/a:/): /a/', formatYueGuangzhou('/a:/'), '/a/');
assert('formatYueAcademy(/a:/): /aa/', formatYueAcademy('/a:/'), '/aa/');
assert('formatYueYale(/a:/): /a/', formatYueYale('/a:/'), '/a/');
assert('formatYueLiu(/a:/): /a/', formatYueLiu('/a:/'), '/a/');

// 挨 [aːi] → 粵拼:aai, 廣拼:ai, 教院:aai, 耶魯:aai, 劉錫祥:aai
assert('formatYueJyutping(/a:i/): /aai/', formatYueJyutping('/a:i/'), '/aai/');
assert('formatYueGuangzhou(/a:i/): /ai/', formatYueGuangzhou('/a:i/'), '/ai/');
assert('formatYueAcademy(/a:i/): /aai/', formatYueAcademy('/a:i/'), '/aai/');
assert('formatYueYale(/a:i/): /aai/', formatYueYale('/a:i/'), '/aai/');
assert('formatYueLiu(/a:i/): /aai/', formatYueLiu('/a:i/'), '/aai/');

// 啱 [aːm] → 粵拼:aam, 廣拼:am, 教院:aam, 耶魯:aam, 劉錫祥:aam
assert('formatYueJyutping(/a:m/): /aam/', formatYueJyutping('/a:m/'), '/aam/');
assert('formatYueGuangzhou(/a:m/): /am/', formatYueGuangzhou('/a:m/'), '/am/');
assert('formatYueAcademy(/a:m/): /aam/', formatYueAcademy('/a:m/'), '/aam/');
assert('formatYueYale(/a:m/): /aam/', formatYueYale('/a:m/'), '/aam/');
assert('formatYueLiu(/a:m/): /aam/', formatYueLiu('/a:m/'), '/aam/');

// 晏 [aːn] → 粵拼:aan, 廣拼:an, 教院:aan, 耶魯:aan, 劉錫祥:aan
assert('formatYueJyutping(/a:n/): /aan/', formatYueJyutping('/a:n/'), '/aan/');
assert('formatYueGuangzhou(/a:n/): /an/', formatYueGuangzhou('/a:n/'), '/an/');
assert('formatYueAcademy(/a:n/): /aan/', formatYueAcademy('/a:n/'), '/aan/');
assert('formatYueYale(/a:n/): /aan/', formatYueYale('/a:n/'), '/aan/');
assert('formatYueLiu(/a:n/): /aan/', formatYueLiu('/a:n/'), '/aan/');

// 罌 [aːŋ] → 粵拼:aang, 廣拼:ang, 教院:aang, 耶魯:aang, 劉錫祥:aang
assert('formatYueJyutping(/a:ŋ/): /aang/', formatYueJyutping('/a:ŋ/'), '/aang/');
assert('formatYueGuangzhou(/a:ŋ/): /ang/', formatYueGuangzhou('/a:ŋ/'), '/ang/');
assert('formatYueAcademy(/a:ŋ/): /aang/', formatYueAcademy('/a:ŋ/'), '/aang/');
assert('formatYueYale(/a:ŋ/): /aang/', formatYueYale('/a:ŋ/'), '/aang/');
assert('formatYueLiu(/a:ŋ/): /aang/', formatYueLiu('/a:ŋ/'), '/aang/');

// 鴨 [aːp] → 粵拼:aap, 廣拼:ab, 教院:aap, 耶魯:aap, 劉錫祥:aap
assert('formatYueJyutping(/a:p/): /aap/', formatYueJyutping('/a:p/'), '/aap/');
assert('formatYueGuangzhou(/a:p/): /ab/', formatYueGuangzhou('/a:p/'), '/ab/');
assert('formatYueAcademy(/a:p/): /aap/', formatYueAcademy('/a:p/'), '/aap/');
assert('formatYueYale(/a:p/): /aap/', formatYueYale('/a:p/'), '/aap/');
assert('formatYueLiu(/a:p/): /aap/', formatYueLiu('/a:p/'), '/aap/');

// 壓 [aːt] → 粵拼:aat, 廣拼:ad, 教院:aat, 耶魯:aat, 劉錫祥:aat
assert('formatYueJyutping(/a:t/): /aat/', formatYueJyutping('/a:t/'), '/aat/');
assert('formatYueGuangzhou(/a:t/): /ad/', formatYueGuangzhou('/a:t/'), '/ad/');
assert('formatYueAcademy(/a:t/): /aat/', formatYueAcademy('/a:t/'), '/aat/');
assert('formatYueYale(/a:t/): /aat/', formatYueYale('/a:t/'), '/aat/');
assert('formatYueLiu(/a:t/): /aat/', formatYueLiu('/a:t/'), '/aat/');

// 軛 [aːk] → 粵拼:aak, 廣拼:ag, 教院:aak, 耶魯:aak, 劉錫祥:aak
assert('formatYueJyutping(/a:k/): /aak/', formatYueJyutping('/a:k/'), '/aak/');
assert('formatYueGuangzhou(/a:k/): /ag/', formatYueGuangzhou('/a:k/'), '/ag/');
assert('formatYueAcademy(/a:k/): /aak/', formatYueAcademy('/a:k/'), '/aak/');
assert('formatYueYale(/a:k/): /aak/', formatYueYale('/a:k/'), '/aak/');
assert('formatYueLiu(/a:k/): /aak/', formatYueLiu('/a:k/'), '/aak/');

// 歐 [ɐu] → 粵拼:au, 廣拼:eo, 教院:au, 耶魯:au, 劉錫祥:au
assert('formatYueJyutping(/ɐu/): /au/', formatYueJyutping('/ɐu/'), '/au/');
assert('formatYueGuangzhou(/ɐu/): /eo/', formatYueGuangzhou('/ɐu/'), '/eo/');
assert('formatYueAcademy(/ɐu/): /au/', formatYueAcademy('/ɐu/'), '/au/');
assert('formatYueYale(/ɐu/): /au/', formatYueYale('/ɐu/'), '/au/');
assert('formatYueLiu(/ɐu/): /au/', formatYueLiu('/ɐu/'), '/au/');

// 衣 [iː] → 粵拼:i, 廣拼:i, 教院:i, 耶魯:i, 劉錫祥:i
assert('formatYueJyutping(/i:/): /i/', formatYueJyutping('/i:/'), '/i/');
assert('formatYueGuangzhou(/i:/): /i/', formatYueGuangzhou('/i:/'), '/i/');
assert('formatYueAcademy(/i:/): /i/', formatYueAcademy('/i:/'), '/i/');
assert('formatYueYale(/i:/): /i/', formatYueYale('/i:/'), '/i/');
assert('formatYueLiu(/i:/): /i/', formatYueLiu('/i:/'), '/i/');

// 腰 [iːu] → 粵拼:iu, 廣拼:iu, 教院:iu, 耶魯:iu, 劉錫祥:iu
assert('formatYueJyutping(/i:u/): /iu/', formatYueJyutping('/i:u/'), '/iu/');
assert('formatYueGuangzhou(/i:u/): /iu/', formatYueGuangzhou('/i:u/'), '/iu/');
assert('formatYueAcademy(/i:u/): /iu/', formatYueAcademy('/i:u/'), '/iu/');
assert('formatYueYale(/i:u/): /iu/', formatYueYale('/i:u/'), '/iu/');
assert('formatYueLiu(/i:u/): /iu/', formatYueLiu('/i:u/'), '/iu/');

// 安 [ɔːn] → 粵拼:on, 廣拼:on, 教院:on, 耶魯:on, 劉錫祥:on
assert('formatYueJyutping(/ɔ:n/): /on/', formatYueJyutping('/ɔ:n/'), '/on/');
assert('formatYueGuangzhou(/ɔ:n/): /on/', formatYueGuangzhou('/ɔ:n/'), '/on/');
assert('formatYueAcademy(/ɔ:n/): /on/', formatYueAcademy('/ɔ:n/'), '/on/');
assert('formatYueYale(/ɔ:n/): /on/', formatYueYale('/ɔ:n/'), '/on/');
assert('formatYueLiu(/ɔ:n/): /on/', formatYueLiu('/ɔ:n/'), '/on/');

// 烏 [uː] → 粵拼:u, 廣拼:u, 教院:u, 耶魯:u, 劉錫祥:oo
assert('formatYueJyutping(/u:/): /u/', formatYueJyutping('/u:/'), '/u/');
assert('formatYueGuangzhou(/u:/): /u/', formatYueGuangzhou('/u:/'), '/u/');
assert('formatYueAcademy(/u:/): /u/', formatYueAcademy('/u:/'), '/u/');
assert('formatYueYale(/u:/): /u/', formatYueYale('/u:/'), '/u/');
assert('formatYueLiu(/u:/): /oo/', formatYueLiu('/u:/'), '/oo/');

// 靴 [œː] → 粵拼:oe, 廣拼:ê, 教院:oe, 耶魯:eu, 劉錫祥:euh
assert('formatYueJyutping(/œ:/): /oe/', formatYueJyutping('/œ:/'), '/oe/');
assert('formatYueGuangzhou(/œ:/): /ê/', formatYueGuangzhou('/œ:/'), '/ê/');
assert('formatYueAcademy(/œ:/): /oe/', formatYueAcademy('/œ:/'), '/oe/');
assert('formatYueYale(/œ:/): /eu/', formatYueYale('/œ:/'), '/eu/');
assert('formatYueLiu(/œ:/): /euh/', formatYueLiu('/œ:/'), '/euh/');

// 於 [yː] → 粵拼:yu, 廣拼:ü, 教院:y, 耶魯:yu, 劉錫祥:ue
assert('formatYueJyutping(/y:/): /yu/', formatYueJyutping('/y:/'), '/yu/');
assert('formatYueGuangzhou(/y:/): /ü/', formatYueGuangzhou('/y:/'), '/ü/');
assert('formatYueAcademy(/y:/): /y/', formatYueAcademy('/y:/'), '/y/');
assert('formatYueYale(/y:/): /yu/', formatYueYale('/y:/'), '/yu/');
assert('formatYueLiu(/y:/): /ue/', formatYueLiu('/y:/'), '/ue/');

// 唔 [m̩] → 粵拼:m, 廣拼:m, 教院:m, 耶魯:m, 劉錫祥:m
assert('formatYueJyutping(/m̩/): /m/', formatYueJyutping('/m̩/'), '/m/');
assert('formatYueGuangzhou(/m̩/): /m/', formatYueGuangzhou('/m̩/'), '/m/');
assert('formatYueAcademy(/m̩/): /m/', formatYueAcademy('/m̩/'), '/m/');
assert('formatYueYale(/m̩/): /m/', formatYueYale('/m̩/'), '/m/');
assert('formatYueLiu(/m̩/): /m/', formatYueLiu('/m̩/'), '/m/');

// 吳 [ŋ̩] → 粵拼:ng, 廣拼:ng, 教院:ng, 耶魯:ng, 劉錫祥:ng
assert('formatYueJyutping(/ŋ̩/): /ng/', formatYueJyutping('/ŋ̩/'), '/ng/');
assert('formatYueGuangzhou(/ŋ̩/): /ng/', formatYueGuangzhou('/ŋ̩/'), '/ng/');
assert('formatYueAcademy(/ŋ̩/): /ng/', formatYueAcademy('/ŋ̩/'), '/ng/');
assert('formatYueYale(/ŋ̩/): /ng/', formatYueYale('/ŋ̩/'), '/ng/');
assert('formatYueLiu(/ŋ̩/): /ng/', formatYueLiu('/ŋ̩/'), '/ng/');

// ============================================
// Summary
// ============================================
console.log('\n========================================');
console.log(`Test Results: ${results.passed} passed, ${results.failed} failed`);
console.log('========================================\n');

// Export for use with test runners
export default results;
