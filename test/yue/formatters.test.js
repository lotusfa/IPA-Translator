/**
 * Test suite for Cantonese formatter functions - IPA to Various Schemes
 *
 * Run with: node --experimental-vm-modules node_modules/jest/bin/jest.js
 * Or directly with: node test/formatters.test.js
 */

// Import formatter functions from yue.format.js
import {
  formatIPA_num,
  formatIPA_org,
  formatJyutpingCantonese,
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu
} from '../../js/yue.format.js';

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
// Test formatIPA_num (tone number conversion)
// ============================================
console.log('\n=== Testing formatIPA_num ===');

assert('formatIPA_num: ˥ → 5', formatIPA_num('˥'), '5');
assert('formatIPA_num: ˧ → 3', formatIPA_num('˧'), '3');
assert('formatIPA_num: ˨ → 2', formatIPA_num('˨'), '2');
assert('formatIPA_num: ˩ → 1', formatIPA_num('˩'), '1');
assert('formatIPA_num: ˥˧ → 53', formatIPA_num('˥˧'), '53');
assert('formatIPA_num: ˧˥ → 35', formatIPA_num('˧˥'), '35');
assert('formatIPA_num: ˨˩ → 21', formatIPA_num('˨˩'), '21');
assert('formatIPA_num: /nei˥˧/ → /nei53/', formatIPA_num('/nei˥˧/'), '/nei53/');

// ============================================
// Test formatIPA_org (no transformation)
// ============================================
console.log('\n=== Testing formatIPA_org ===');

assert('formatIPA_org: no transformation', formatIPA_org('test'), 'test');
assert('formatIPA_org: preserves IPA', formatIPA_org('/nei˥˧/'), '/nei˥˧/');

// ============================================
// Test formatJyutpingCantonese (IPA tone marks to numbers)
// ============================================
console.log('\n=== Testing formatJyutpingCantonese ===');

assert('formatJyutpingCantonese: ˥˧ → 1', formatJyutpingCantonese('˥˧'), '1');
assert('formatJyutpingCantonese: ˧˥ → 2', formatJyutpingCantonese('˧˥'), '2');
assert('formatJyutpingCantonese: ˧ → 3', formatJyutpingCantonese('˧'), '3');
assert('formatJyutpingCantonese: ˨˩ → 4', formatJyutpingCantonese('˨˩'), '4');
assert('formatJyutpingCantonese: ˩˧ → 5', formatJyutpingCantonese('˩˧'), '5');
assert('formatJyutpingCantonese: ˨˨ → 6', formatJyutpingCantonese('˨˨'), '6');

// Entering tones
assert('formatJyutpingCantonese: k˥ → k1', formatJyutpingCantonese('k˥'), 'k1');
assert('formatJyutpingCantonese: k˧ → k3', formatJyutpingCantonese('k˧'), 'k3');
assert('formatJyutpingCantonese: k˨ → k6', formatJyutpingCantonese('k˨'), 'k6');
assert('formatJyutpingCantonese: t˥ → t1', formatJyutpingCantonese('t˥'), 't1');
assert('formatJyutpingCantonese: p˥ → p1', formatJyutpingCantonese('p˥'), 'p1');

// ============================================
// Test formatJyutpingCantonese - 聲調對照表例字
// ============================================
console.log('\n=== Testing formatJyutpingCantonese - 聲調對照表例字 ===');

// 陰平 53/55: 分 ˥˧/˥ → 1
assert('formatJyutpingCantonese: 分 ˥˧ → 1', formatJyutpingCantonese('˥˧'), '1');

// 陰上 35: 粉 ˧˥ → 2
assert('formatJyutpingCantonese: 粉 ˧˥ → 2', formatJyutpingCantonese('˧˥'), '2');

// 陰去 33: 訓 ˧ → 3
assert('formatJyutpingCantonese: 訓 ˧ → 3', formatJyutpingCantonese('˧'), '3');

// 陽平 21: 墳 ˨˩ → 4
assert('formatJyutpingCantonese: 墳 ˨˩ → 4', formatJyutpingCantonese('˨˩'), '4');

// 陽上 13: 憤 ˩˧ → 5
assert('formatJyutpingCantonese: 憤 ˩˧ → 5', formatJyutpingCantonese('˩˧'), '5');

// 陽去 22: 份 ˨ → 6
assert('formatJyutpingCantonese: 份 ˨ → 6', formatJyutpingCantonese('˨'), '6');

// 上陰入 5: 忽 ˥ → 7
assert('formatJyutpingCantonese: 忽 k˥ → k1', formatJyutpingCantonese('k˥'), 'k1');

// 下陰入 3: 發 ˧ → 8
assert('formatJyutpingCantonese: 發 k˧ → k3', formatJyutpingCantonese('k˧'), 'k3');

// 陽入 2: 佛 ˨ → 9
assert('formatJyutpingCantonese: 佛 k˨ → k6', formatJyutpingCantonese('k˨'), 'k6');

// 陰去 33: 訓 ˧ → 3
assert('formatJyutpingCantonese: 訓 ˧ → 3', formatJyutpingCantonese('˧'), '3');

// 陽平 21: 墳 ˨˩ → 4
assert('formatJyutpingCantonese: 墳 ˨˩ → 4', formatJyutpingCantonese('˨˩'), '4');

// 陽上 13: 憤 ˩˧ → 5
assert('formatJyutpingCantonese: 憤 ˩˧ → 5', formatJyutpingCantonese('˩˧'), '5');

// 陽去 22: 份 ˨ → 6
assert('formatJyutpingCantonese: 份 ˨ → 6', formatJyutpingCantonese('˨'), '6');

// 上陰入 5: 忽 ˥ → 7
assert('formatJyutpingCantonese: 忽 k˥ → k1', formatJyutpingCantonese('k˥'), 'k1');

// 下陰入 3: 發 ˧ → 8
assert('formatJyutpingCantonese: 發 k˧ → k3', formatJyutpingCantonese('k˧'), 'k3');

// 陽入 2: 佛 ˨ → 6
assert('formatJyutpingCantonese: 佛 k˨ → k6', formatJyutpingCantonese('k˨'), 'k6');

// ============================================
// Test formatYueJyutping (IPA → 粵拼)
// 声母对照表例字测试
// ============================================
console.log('\n=== Testing formatYueJyutping (IPA → 粵拼) - 声母 ===');

// 声母对照表例字
assert('formatYueJyutping: [p] → /b/', formatYueJyutping('/p/'), '/b/');
assert('formatYueJyutping: [pʰ] → /p/', formatYueJyutping('/pʰ/'), '/p/');
assert('formatYueJyutping: [m] → /m/', formatYueJyutping('/m/'), '/m/');
assert('formatYueJyutping: [f] → /f/', formatYueJyutping('/f/'), '/f/');
assert('formatYueJyutping: [t] → /d/', formatYueJyutping('/t/'), '/d/');
assert('formatYueJyutping: [tʰ] → /t/', formatYueJyutping('/tʰ/'), '/t/');
assert('formatYueJyutping: [n] → /n/', formatYueJyutping('/n/'), '/n/');
assert('formatYueJyutping: [l] → /l/', formatYueJyutping('/l/'), '/l/');
assert('formatYueJyutping: [k] → /g/', formatYueJyutping('/k/'), '/g/');
assert('formatYueJyutping: [kʰ] → /k/', formatYueJyutping('/kʰ/'), '/k/');
assert('formatYueJyutping: [ŋ] → /ng/', formatYueJyutping('/ŋ/'), '/ng/');
assert('formatYueJyutping: [h] → /h/', formatYueJyutping('/h/'), '/h/');
assert('formatYueJyutping: [ts] → /z/', formatYueJyutping('/ts/'), '/z/');
assert('formatYueJyutping: [tsʰ] → /c/', formatYueJyutping('/tsʰ/'), '/c/');
assert('formatYueJyutping: [s] → /s/', formatYueJyutping('/s/'), '/s/');
assert('formatYueJyutping: [kʷ] → /gw/', formatYueJyutping('/kʷ/'), '/gw/');
assert('formatYueJyutping: [kʷʰ] → /kw/', formatYueJyutping('/kʷʰ/'), '/kw/');
assert('formatYueJyutping: [j] → /j/', formatYueJyutping('/j/'), '/j/');
assert('formatYueJyutping: [w] → /w/', formatYueJyutping('/w/'), '/w/');

// ============================================
// Test formatYueJyutping (IPA → 粵拼)
// 韵母对照表例字测试
// ============================================
console.log('\n=== Testing formatYueJyutping (IPA → 粵拼) - 韵母 ===');

// 基本韵母
assert('formatYueJyutping: [aː] → /aa/', formatYueJyutping('/a:/'), '/aa/');
assert('formatYueJyutping: [aːi] → /aai/', formatYueJyutping('/a:i/'), '/aai/');
assert('formatYueJyutping: [aːu] → /aau/', formatYueJyutping('/a:u/'), '/aau/');
assert('formatYueJyutping: [aːm] → /aam/', formatYueJyutping('/a:m/'), '/aam/');
assert('formatYueJyutping: [aːn] → /aan/', formatYueJyutping('/a:n/'), '/aan/');
assert('formatYueJyutping: [aːŋ] → /aang/', formatYueJyutping('/a:ŋ/'), '/aang/');
assert('formatYueJyutping: [aːp] → /aap/', formatYueJyutping('/a:p/'), '/aap/');
assert('formatYueJyutping: [aːt] → /aat/', formatYueJyutping('/a:t/'), '/aat/');
assert('formatYueJyutping: [aːk] → /aak/', formatYueJyutping('/a:k/'), '/aak/');

// 短元音韵母
assert('formatYueJyutping: [ɐi] → /ai/', formatYueJyutping('/ɐi/'), '/ai/');
assert('formatYueJyutping: [ɐu] → /au/', formatYueJyutping('/ɐu/'), '/au/');
assert('formatYueJyutping: [ɐm] → /am/', formatYueJyutping('/ɐm/'), '/am/');
assert('formatYueJyutping: [ɐn] → /an/', formatYueJyutping('/ɐn/'), '/an/');
assert('formatYueJyutping: [ɐŋ] → /ang/', formatYueJyutping('/ɐŋ/'), '/ang/');
assert('formatYueJyutping: [ɐp] → /ap/', formatYueJyutping('/ɐp/'), '/ap/');
assert('formatYueJyutping: [ɐt] → /at/', formatYueJyutping('/ɐt/'), '/at/');
assert('formatYueJyutping: [ɐk] → /ak/', formatYueJyutping('/ɐk/'), '/ak/');

// e 韵母系列
assert('formatYueJyutping: [ɛː] → /e/', formatYueJyutping('/ɛ:/'), '/e/');
assert('formatYueJyutping: [ei] → /ei/', formatYueJyutping('/ei/'), '/ei/');
assert('formatYueJyutping: [ɛːu] → /eu/', formatYueJyutping('/ɛ:u/'), '/eu/');
assert('formatYueJyutping: [ɛːm] → /em/', formatYueJyutping('/ɛ:m/'), '/em/');
assert('formatYueJyutping: [ɛːn] → /en/', formatYueJyutping('/ɛ:n/'), '/en/');
assert('formatYueJyutping: [ɛːŋ] → /eng/', formatYueJyutping('/ɛ:ŋ/'), '/eng/');
assert('formatYueJyutping: [ɛːp] → /ep/', formatYueJyutping('/ɛ:p/'), '/ep/');
assert('formatYueJyutping: [ɛːt] → /et/', formatYueJyutping('/ɛ:t/'), '/et/');
assert('formatYueJyutping: [ɛːk] → /ek/', formatYueJyutping('/ɛ:k/'), '/ek/');

// i 韵母系列
assert('formatYueJyutping: [iː] → /i/', formatYueJyutping('/i:/'), '/i/');
assert('formatYueJyutping: [iːu] → /iu/', formatYueJyutping('/i:u/'), '/iu/');
assert('formatYueJyutping: [iːm] → /im/', formatYueJyutping('/i:m/'), '/im/');
assert('formatYueJyutping: [iːn] → /in/', formatYueJyutping('/i:n/'), '/in/');
assert('formatYueJyutping: [iːp] → /ip/', formatYueJyutping('/i:p/'), '/ip/');
assert('formatYueJyutping: [iːt] → /it/', formatYueJyutping('/i:t/'), '/it/');
assert('formatYueJyutping: [ɪŋ] → /ing/', formatYueJyutping('/ɪŋ/'), '/ing/');
assert('formatYueJyutping: [ɪk] → /ik/', formatYueJyutping('/ɪk/'), '/ik/');

// o 韵母系列
assert('formatYueJyutping: [ɔː] → /o/', formatYueJyutping('/ɔ:/'), '/o/');
assert('formatYueJyutping: [ɔːi] → /oi/', formatYueJyutping('/ɔ:i/'), '/oi/');
assert('formatYueJyutping: [ou] → /ou/', formatYueJyutping('/ou/'), '/ou/');
assert('formatYueJyutping: [ɔːn] → /on/', formatYueJyutping('/ɔ:n/'), '/on/');
assert('formatYueJyutping: [ɔːŋ] → /ong/', formatYueJyutping('/ɔ:ŋ/'), '/ong/');
assert('formatYueJyutping: [ɔːt] → /ot/', formatYueJyutping('/ɔ:t/'), '/ot/');
assert('formatYueJyutping: [ɔːk] → /ok/', formatYueJyutping('/ɔ:k/'), '/ok/');

// u 韵母系列
assert('formatYueJyutping: [uː] → /u/', formatYueJyutping('/u:/'), '/u/');
assert('formatYueJyutping: [uːi] → /ui/', formatYueJyutping('/u:i/'), '/ui/');
assert('formatYueJyutping: [uːn] → /un/', formatYueJyutping('/u:n/'), '/un/');
assert('formatYueJyutping: [ʊŋ] → /ung/', formatYueJyutping('/ʊŋ/'), '/ung/');
assert('formatYueJyutping: [uːt] → /ut/', formatYueJyutping('/u:t/'), '/ut/');
assert('formatYueJyutping: [ʊk] → /uk/', formatYueJyutping('/ʊk/'), '/uk/');

// oe 韵母系列
assert('formatYueJyutping: [œː] → /oe/', formatYueJyutping('/œ:/'), '/oe/');
assert('formatYueJyutping: [œːŋ] → /oeng/', formatYueJyutping('/œ:ŋ/'), '/oeng/');
assert('formatYueJyutping: [œːk] → /oek/', formatYueJyutping('/œ:k/'), '/oek/');
assert('formatYueJyutping: [œːt] → /oet/', formatYueJyutping('/œ:t/'), '/oet/');

// eoi/eon 系列
assert('formatYueJyutping: [ɵy] → /eoi/', formatYueJyutping('/ɵy/'), '/eoi/');
assert('formatYueJyutping: [ɵn] → /eon/', formatYueJyutping('/ɵn/'), '/eon/');
assert('formatYueJyutping: [ɵt] → /eot/', formatYueJyutping('/ɵt/'), '/eot/');

// y 韵母系列
assert('formatYueJyutping: [yː] → /yu/', formatYueJyutping('/y:/'), '/yu/');
assert('formatYueJyutping: [yːn] → /yun/', formatYueJyutping('/y:n/'), '/yun/');
assert('formatYueJyutping: [yːt] → /yut/', formatYueJyutping('/y:t/'), '/yut/');

// 成音节鼻音
assert('formatYueJyutping: [m̩] → /m/', formatYueJyutping('/m̩/'), '/m/');
assert('formatYueJyutping: [ŋ̩] → /ng/', formatYueJyutping('/ŋ̩/'), '/ng/');

// ============================================
// Test formatYueGuangzhou (IPA → 廣拼)
// 声母对照表例字测试
// ============================================
console.log('\n=== Testing formatYueGuangzhou (IPA → 廣拼) - 声母 ===');

// 声母对照表例字 - 大部分声母相同
assert('formatYueGuangzhou: [p] → /b/', formatYueGuangzhou('/p/'), '/b/');
assert('formatYueGuangzhou: [pʰ] → /p/', formatYueGuangzhou('/pʰ/'), '/p/');
assert('formatYueGuangzhou: [m] → /m/', formatYueGuangzhou('/m/'), '/m/');
assert('formatYueGuangzhou: [f] → /f/', formatYueGuangzhou('/f/'), '/f/');
assert('formatYueGuangzhou: [t] → /d/', formatYueGuangzhou('/t/'), '/d/');
assert('formatYueGuangzhou: [tʰ] → /t/', formatYueGuangzhou('/tʰ/'), '/t/');
assert('formatYueGuangzhou: [n] → /n/', formatYueGuangzhou('/n/'), '/n/');
assert('formatYueGuangzhou: [l] → /l/', formatYueGuangzhou('/l/'), '/l/');
assert('formatYueGuangzhou: [k] → /g/', formatYueGuangzhou('/k/'), '/g/');
assert('formatYueGuangzhou: [kʰ] → /k/', formatYueGuangzhou('/kʰ/'), '/k/');
assert('formatYueGuangzhou: [ŋ] → /ng/', formatYueGuangzhou('/ŋ/'), '/ng/');
assert('formatYueGuangzhou: [h] → /h/', formatYueGuangzhou('/h/'), '/h/');

// z,c,s 在广拼中接非 i/ü时用 z/c/s
assert('formatYueGuangzhou: [ts] → /z/', formatYueGuangzhou('/ts/'), '/z/');
assert('formatYueGuangzhou: [s] → /s/', formatYueGuangzhou('/s/'), '/s/');

// gw/kw 在广拼中写作 gu/ku
assert('formatYueGuangzhou: [kʷ] → /gu/', formatYueGuangzhou('/kʷ/'), '/gu/');
assert('formatYueGuangzhou: [kʷʰ] → /ku/', formatYueGuangzhou('/kʷʰ/'), '/ku/');

// j 在广拼中写作 y
assert('formatYueGuangzhou: [j] → /y/', formatYueGuangzhou('/j/'), '/y/');
assert('formatYueGuangzhou: [w] → /w/', formatYueGuangzhou('/w/'), '/w/');

// ============================================
// Test formatYueGuangzhou (IPA → 廣拼)
// 韵母对照表例字测试
// ============================================
console.log('\n=== Testing formatYueGuangzhou (IPA → 廣拼) - 韵母 ===');

// 基本韵母 - 广拼用单字母
assert('formatYueGuangzhou: [aː] → /a/', formatYueGuangzhou('/a:/'), '/a/');
assert('formatYueGuangzhou: [aːi] → /ai/', formatYueGuangzhou('/a:i/'), '/ai/');
assert('formatYueGuangzhou: [aːu] → /ao/', formatYueGuangzhou('/a:u/'), '/ao/');
assert('formatYueGuangzhou: [aːm] → /am/', formatYueGuangzhou('/a:m/'), '/am/');
assert('formatYueGuangzhou: [aːn] → /an/', formatYueGuangzhou('/a:n/'), '/an/');
assert('formatYueGuangzhou: [aːŋ] → /ang/', formatYueGuangzhou('/a:ŋ/'), '/ang/');
assert('formatYueGuangzhou: [aːp] → /ab/', formatYueGuangzhou('/a:p/'), '/ab/');
assert('formatYueGuangzhou: [aːt] → /ad/', formatYueGuangzhou('/a:t/'), '/ad/');
assert('formatYueGuangzhou: [aːk] → /ag/', formatYueGuangzhou('/a:k/'), '/ag/');

// 短元音韵母 - 广拼用 é 系列
assert('formatYueGuangzhou: [ɐi] → /ei/', formatYueGuangzhou('/ɐi/'), '/ei/');
assert('formatYueGuangzhou: [ɐu] → /eo/', formatYueGuangzhou('/ɐu/'), '/eo/');
assert('formatYueGuangzhou: [ɐm] → /em/', formatYueGuangzhou('/ɐm/'), '/em/');
assert('formatYueGuangzhou: [ɐn] → /en/', formatYueGuangzhou('/ɐn/'), '/en/');
assert('formatYueGuangzhou: [ɐŋ] → /eng/', formatYueGuangzhou('/ɐŋ/'), '/eng/');
assert('formatYueGuangzhou: [ɐp] → /eb/', formatYueGuangzhou('/ɐp/'), '/eb/');
assert('formatYueGuangzhou: [ɐt] → /ed/', formatYueGuangzhou('/ɐt/'), '/ed/');
assert('formatYueGuangzhou: [ɐk] → /eg/', formatYueGuangzhou('/ɐk/'), '/eg/');

// e 韵母系列 - 广拼带重音符号
assert('formatYueGuangzhou: [ɛː] → /é/', formatYueGuangzhou('/ɛ:/'), '/é/');
assert('formatYueGuangzhou: [ei] → /éi/', formatYueGuangzhou('/ei/'), '/éi/');
assert('formatYueGuangzhou: [ɛːu] → /éo/', formatYueGuangzhou('/ɛ:u/'), '/éo/');
assert('formatYueGuangzhou: [ɛːm] → /ém/', formatYueGuangzhou('/ɛ:m/'), '/ém/');
assert('formatYueGuangzhou: [ɛːn] → /én/', formatYueGuangzhou('/ɛ:n/'), '/én/');
assert('formatYueGuangzhou: [ɛːŋ] → /éng/', formatYueGuangzhou('/ɛ:ŋ/'), '/éng/');
assert('formatYueGuangzhou: [ɛːp] → /éb/', formatYueGuangzhou('/ɛ:p/'), '/éb/');
assert('formatYueGuangzhou: [ɛːt] → /éd/', formatYueGuangzhou('/ɛ:t/'), '/éd/');
assert('formatYueGuangzhou: [ɛːk] → /ég/', formatYueGuangzhou('/ɛ:k/'), '/ég/');

// i 韵母系列 - 广拼用 ig 作入声收尾
assert('formatYueGuangzhou: [iː] → /i/', formatYueGuangzhou('/i:/'), '/i/');
assert('formatYueGuangzhou: [iːu] → /iu/', formatYueGuangzhou('/i:u/'), '/iu/');
assert('formatYueGuangzhou: [iːm] → /im/', formatYueGuangzhou('/i:m/'), '/im/');
assert('formatYueGuangzhou: [iːn] → /in/', formatYueGuangzhou('/i:n/'), '/in/');
assert('formatYueGuangzhou: [iːp] → /ib/', formatYueGuangzhou('/i:p/'), '/ib/');
assert('formatYueGuangzhou: [iːt] → /id/', formatYueGuangzhou('/i:t/'), '/id/');
assert('formatYueGuangzhou: [ɪŋ] → /ing/', formatYueGuangzhou('/ɪŋ/'), '/ing/');
assert('formatYueGuangzhou: [ɪk] → /ig/', formatYueGuangzhou('/ɪk/'), '/ig/');

// o 韵母系列 - 广拼
assert('formatYueGuangzhou: [ɔː] → /o/', formatYueGuangzhou('/ɔ:/'), '/o/');
assert('formatYueGuangzhou: [ɔːi] → /oi/', formatYueGuangzhou('/ɔ:i/'), '/oi/');
assert('formatYueGuangzhou: [ou] → /ou/', formatYueGuangzhou('/ou/'), '/ou/');
assert('formatYueGuangzhou: [ɔːn] → /on/', formatYueGuangzhou('/ɔ:n/'), '/on/');
assert('formatYueGuangzhou: [ɔːŋ] → /ong/', formatYueGuangzhou('/ɔ:ŋ/'), '/ong/');
assert('formatYueGuangzhou: [ɔːt] → /od/', formatYueGuangzhou('/ɔ:t/'), '/od/');
assert('formatYueGuangzhou: [ɔːk] → /og/', formatYueGuangzhou('/ɔ:k/'), '/og/');

// u 韵母系列
assert('formatYueGuangzhou: [uː] → /u/', formatYueGuangzhou('/u:/'), '/u/');
assert('formatYueGuangzhou: [uːi] → /ui/', formatYueGuangzhou('/u:i/'), '/ui/');
assert('formatYueGuangzhou: [uːn] → /un/', formatYueGuangzhou('/u:n/'), '/un/');
assert('formatYueGuangzhou: [uːt] → /ud/', formatYueGuangzhou('/u:t/'), '/ud/');
assert('formatYueGuangzhou: [ʊŋ] → /ung/', formatYueGuangzhou('/ʊŋ/'), '/ung/');
assert('formatYueGuangzhou: [ʊk] → /ug/', formatYueGuangzhou('/ʊk/'), '/ug/');

// oe 韵母系列 - 广拼用 ê 系列
assert('formatYueGuangzhou: [œː] → /ê/', formatYueGuangzhou('/œ:/'), '/ê/');
assert('formatYueGuangzhou: [œːŋ] → /êng/', formatYueGuangzhou('/œ:ŋ/'), '/êng/');
assert('formatYueGuangzhou: [œːk] → /êg/', formatYueGuangzhou('/œ:k/'), '/êg/');
assert('formatYueGuangzhou: [œːt] → /êd/', formatYueGuangzhou('/œ:t/'), '/êd/');
assert('formatYueGuangzhou: [ɵy] → /êu/', formatYueGuangzhou('/ɵy/'), '/êu/');
assert('formatYueGuangzhou: [ɵn] → /ên/', formatYueGuangzhou('/ɵn/'), '/ên/');
assert('formatYueGuangzhou: [ɵt] → /êd/', formatYueGuangzhou('/ɵt/'), '/êd/');

// y 韵母系列 - 广拼用 ü系列
assert('formatYueGuangzhou: [yː] → /ü/', formatYueGuangzhou('/y:/'), '/ü/');
assert('formatYueGuangzhou: [yːn] → /ün/', formatYueGuangzhou('/y:n/'), '/ün/');
assert('formatYueGuangzhou: [yːt] → /üd/', formatYueGuangzhou('/y:t/'), '/üd/');

// ============================================
// Test formatYueAcademy (IPA → 教院)
// 声母对照表例字测试
// ============================================
console.log('\n=== Testing formatYueAcademy (IPA → 教院) - 声母 ===');

// 教院声母特点
assert('formatYueAcademy: [p] → /b/', formatYueAcademy('/p/'), '/b/');
assert('formatYueAcademy: [pʰ] → /p/', formatYueAcademy('/pʰ/'), '/p/');
assert('formatYueAcademy: [m] → /m/', formatYueAcademy('/m/'), '/m/');
assert('formatYueAcademy: [f] → /f/', formatYueAcademy('/f/'), '/f/');
assert('formatYueAcademy: [t] → /d/', formatYueAcademy('/t/'), '/d/');
assert('formatYueAcademy: [tʰ] → /t/', formatYueAcademy('/tʰ/'), '/t/');
assert('formatYueAcademy: [n] → /n/', formatYueAcademy('/n/'), '/n/');
assert('formatYueAcademy: [l] → /l/', formatYueAcademy('/l/'), '/l/');
assert('formatYueAcademy: [k] → /g/', formatYueAcademy('/k/'), '/g/');
assert('formatYueAcademy: [kʰ] → /k/', formatYueAcademy('/kʰ/'), '/k/');
assert('formatYueAcademy: [ŋ] → /ng/', formatYueAcademy('/ŋ/'), '/ng/');
assert('formatYueAcademy: [h] → /h/', formatYueAcademy('/h/'), '/h/');

// 教院特色：z→dz, c→ts
assert('formatYueAcademy: [ts] → /dz/', formatYueAcademy('/ts/'), '/dz/');
assert('formatYueAcademy: [tsʰ] → /ts/', formatYueAcademy('/tsʰ/'), '/ts/');
assert('formatYueAcademy: [s] → /s/', formatYueAcademy('/s/'), '/s/');

// gw/kw 教院与粵拼相同
assert('formatYueAcademy: [kʷ] → /gw/', formatYueAcademy('/kʷ/'), '/gw/');
assert('formatYueAcademy: [kʷʰ] → /kw/', formatYueAcademy('/kʷʰ/'), '/kw/');

// j→j (与耶鲁/刘锡祥不同，与广拼不同)
assert('formatYueAcademy: [j] → /j/', formatYueAcademy('/j/'), '/j/');
assert('formatYueAcademy: [w] → /w/', formatYueAcademy('/w/'), '/w/');

// ============================================
// Test formatYueAcademy (IPA → 教院)
// 韵母对照表例字测试
// ============================================
console.log('\n=== Testing formatYueAcademy (IPA → 教院) - 韵母 ===');

// 教院韵母基本与粵拼相同
assert('formatYueAcademy: [aː] → /aa/', formatYueAcademy('/a:/'), '/aa/');
assert('formatYueAcademy: [aːi] → /aai/', formatYueAcademy('/a:i/'), '/aai/');
assert('formatYueAcademy: [aːu] → /aau/', formatYueAcademy('/a:u/'), '/aau/');
assert('formatYueAcademy: [aːm] → /aam/', formatYueAcademy('/a:m/'), '/aam/');
assert('formatYueAcademy: [aːn] → /aan/', formatYueAcademy('/a:n/'), '/aan/');
assert('formatYueAcademy: [aːŋ] → /aang/', formatYueAcademy('/a:ŋ/'), '/aang/');
assert('formatYueAcademy: [aːp] → /aap/', formatYueAcademy('/a:p/'), '/aap/');
assert('formatYueAcademy: [aːt] → /aat/', formatYueAcademy('/a:t/'), '/aat/');
assert('formatYueAcademy: [aːk] → /aak/', formatYueAcademy('/a:k/'), '/aak/');

// 短元音韵母
assert('formatYueAcademy: [ɐi] → /ai/', formatYueAcademy('/ɐi/'), '/ai/');
assert('formatYueAcademy: [ɐu] → /au/', formatYueAcademy('/ɐu/'), '/au/');
assert('formatYueAcademy: [ɐm] → /am/', formatYueAcademy('/ɐm/'), '/am/');
assert('formatYueAcademy: [ɐn] → /an/', formatYueAcademy('/ɐn/'), '/an/');
assert('formatYueAcademy: [ɐŋ] → /ang/', formatYueAcademy('/ɐŋ/'), '/ang/');
assert('formatYueAcademy: [ɐp] → /ap/', formatYueAcademy('/ɐp/'), '/ap/');
assert('formatYueAcademy: [ɐt] → /at/', formatYueAcademy('/ɐt/'), '/at/');
assert('formatYueAcademy: [ɐk] → /ak/', formatYueAcademy('/ɐk/'), '/ak/');

// e 韵母系列
assert('formatYueAcademy: [ɛː] → /e/', formatYueAcademy('/ɛ:/'), '/e/');
assert('formatYueAcademy: [ei] → /ei/', formatYueAcademy('/ei/'), '/ei/');
assert('formatYueAcademy: [ɛːu] → /eu/', formatYueAcademy('/ɛ:u/'), '/eu/');
assert('formatYueAcademy: [ɛːm] → /em/', formatYueAcademy('/ɛ:m/'), '/em/');
assert('formatYueAcademy: [ɛːn] → /en/', formatYueAcademy('/ɛ:n/'), '/en/');
assert('formatYueAcademy: [ɛːŋ] → /eng/', formatYueAcademy('/ɛ:ŋ/'), '/eng/');
assert('formatYueAcademy: [ɛːp] → /ep/', formatYueAcademy('/ɛ:p/'), '/ep/');
assert('formatYueAcademy: [ɛːt] → /et/', formatYueAcademy('/ɛ:t/'), '/et/');
assert('formatYueAcademy: [ɛːk] → /ek/', formatYueAcademy('/ɛ:k/'), '/ek/');

// i 韵母系列
assert('formatYueAcademy: [iː] → /i/', formatYueAcademy('/i:/'), '/i/');
assert('formatYueAcademy: [iːu] → /iu/', formatYueAcademy('/i:u/'), '/iu/');
assert('formatYueAcademy: [iːm] → /im/', formatYueAcademy('/i:m/'), '/im/');
assert('formatYueAcademy: [iːn] → /in/', formatYueAcademy('/i:n/'), '/in/');
assert('formatYueAcademy: [iːp] → /ip/', formatYueAcademy('/i:p/'), '/ip/');
assert('formatYueAcademy: [iːt] → /it/', formatYueAcademy('/i:t/'), '/it/');
assert('formatYueAcademy: [ɪŋ] → /ing/', formatYueAcademy('/ɪŋ/'), '/ing/');
assert('formatYueAcademy: [ɪk] → /ik/', formatYueAcademy('/ɪk/'), '/ik/');

// o 韵母系列
assert('formatYueAcademy: [ɔː] → /o/', formatYueAcademy('/ɔ:/'), '/o/');
assert('formatYueAcademy: [ɔːi] → /oi/', formatYueAcademy('/ɔ:i/'), '/oi/');
assert('formatYueAcademy: [ou] → /ou/', formatYueAcademy('/ou/'), '/ou/');
assert('formatYueAcademy: [ɔːn] → /on/', formatYueAcademy('/ɔ:n/'), '/on/');
assert('formatYueAcademy: [ɔːŋ] → /ong/', formatYueAcademy('/ɔ:ŋ/'), '/ong/');
assert('formatYueAcademy: [ɔːt] → /ot/', formatYueAcademy('/ɔ:t/'), '/ot/');
assert('formatYueAcademy: [ɔːk] → /ok/', formatYueAcademy('/ɔ:k/'), '/ok/');

// u 韵母系列
assert('formatYueAcademy: [uː] → /u/', formatYueAcademy('/u:/'), '/u/');
assert('formatYueAcademy: [uːi] → /ui/', formatYueAcademy('/u:i/'), '/ui/');
assert('formatYueAcademy: [uːn] → /un/', formatYueAcademy('/u:n/'), '/un/');
assert('formatYueAcademy: [uːt] → /ut/', formatYueAcademy('/u:t/'), '/ut/');
assert('formatYueAcademy: [ʊŋ] → /ung/', formatYueAcademy('/ʊŋ/'), '/ung/');
assert('formatYueAcademy: [ʊk] → /uk/', formatYueAcademy('/ʊk/'), '/uk/');

// oe 韵母系列
assert('formatYueAcademy: [œː] → /oe/', formatYueAcademy('/œ:/'), '/oe/');
assert('formatYueAcademy: [œːŋ] → /oeng/', formatYueAcademy('/œ:ŋ/'), '/oeng/');
assert('formatYueAcademy: [œːk] → /oek/', formatYueAcademy('/œ:k/'), '/oek/');
assert('formatYueAcademy: [œːt] → /oet/', formatYueAcademy('/œ:t/'), '/oet/');

// eoi/eon 系列 - 教院用 oey/oen/oet
assert('formatYueAcademy: [ɵy] → /oey/', formatYueAcademy('/ɵy/'), '/oey/');
assert('formatYueAcademy: [ɵn] → /oen/', formatYueAcademy('/ɵn/'), '/oen/');
assert('formatYueAcademy: [ɵt] → /oet/', formatYueAcademy('/ɵt/'), '/oet/');

// y 韵母系列 - 教院用 y/yn/yt
assert('formatYueAcademy: [yː] → /y/', formatYueAcademy('/y:/'), '/y/');
assert('formatYueAcademy: [yːn] → /yn/', formatYueAcademy('/y:n/'), '/yn/');
assert('formatYueAcademy: [yːt] → /yt/', formatYueAcademy('/y:t/'), '/yt/');

// 成音节鼻音
assert('formatYueAcademy: [m̩] → /m/', formatYueAcademy('/m̩/'), '/m/');
assert('formatYueAcademy: [ŋ̩] → /ng/', formatYueAcademy('/ŋ̩/'), '/ng/');

// ============================================
// Test formatYueYale (IPA → 耶魯)
// 声母对照表例字测试
// ============================================
console.log('\n=== Testing formatYueYale (IPA → 耶魯) - 声母 ===');

// 耶鲁声母特点
assert('formatYueYale: [p] → /b/', formatYueYale('/p/'), '/b/');
assert('formatYueYale: [pʰ] → /p/', formatYueYale('/pʰ/'), '/p/');
assert('formatYueYale: [m] → /m/', formatYueYale('/m/'), '/m/');
assert('formatYueYale: [f] → /f/', formatYueYale('/f/'), '/f/');
assert('formatYueYale: [t] → /d/', formatYueYale('/t/'), '/d/');
assert('formatYueYale: [tʰ] → /t/', formatYueYale('/tʰ/'), '/t/');
assert('formatYueYale: [n] → /n/', formatYueYale('/n/'), '/n/');
assert('formatYueYale: [l] → /l/', formatYueYale('/l/'), '/l/');
assert('formatYueYale: [k] → /g/', formatYueYale('/k/'), '/g/');
assert('formatYueYale: [kʰ] → /k/', formatYueYale('/kʰ/'), '/k/');
assert('formatYueYale: [ŋ] → /ng/', formatYueYale('/ŋ/'), '/ng/');
assert('formatYueYale: [h] → /h/', formatYueYale('/h/'), '/h/');

// 耶鲁特色：ts→j, tsʰ→ch
assert('formatYueYale: [ts] → /j/', formatYueYale('/ts/'), '/j/');
assert('formatYueYale: [tsʰ] → /ch/', formatYueYale('/tsʰ/'), '/ch/');
assert('formatYueYale: [s] → /s/', formatYueYale('/s/'), '/s/');

// gw/kw 耶鲁与粵拼相同
assert('formatYueYale: [kʷ] → /gw/', formatYueYale('/kʷ/'), '/gw/');
assert('formatYueYale: [kʷʰ] → /kw/', formatYueYale('/kʷʰ/'), '/kw/');

// j→y (与教院不同)
assert('formatYueYale: [j] → /y/', formatYueYale('/j/'), '/y/');
assert('formatYueYale: [w] → /w/', formatYueYale('/w/'), '/w/');

// ============================================
// Test formatYueYale (IPA → 耶魯)
// 韵母对照表例字测试
// ============================================
console.log('\n=== Testing formatYueYale (IPA → 耶魯) - 韵母 ===');

// 耶鲁韵母基本与粵拼相同，但 o→oh
assert('formatYueYale: [aː] → /a/', formatYueYale('/a:/'), '/a/');
assert('formatYueYale: [aːi] → /aai/', formatYueYale('/a:i/'), '/aai/');
assert('formatYueYale: [aːu] → /aau/', formatYueYale('/a:u/'), '/aau/');
assert('formatYueYale: [aːm] → /aam/', formatYueYale('/a:m/'), '/aam/');
assert('formatYueYale: [aːn] → /aan/', formatYueYale('/a:n/'), '/aan/');
assert('formatYueYale: [aːŋ] → /aang/', formatYueYale('/a:ŋ/'), '/aang/');
assert('formatYueYale: [aːp] → /aap/', formatYueYale('/a:p/'), '/aap/');
assert('formatYueYale: [aːt] → /aat/', formatYueYale('/a:t/'), '/aat/');
assert('formatYueYale: [aːk] → /aak/', formatYueYale('/a:k/'), '/aak/');

// 短元音韵母
assert('formatYueYale: [ɐi] → /ai/', formatYueYale('/ɐi/'), '/ai/');
assert('formatYueYale: [ɐu] → /au/', formatYueYale('/ɐu/'), '/au/');
assert('formatYueYale: [ɐm] → /am/', formatYueYale('/ɐm/'), '/am/');
assert('formatYueYale: [ɐn] → /an/', formatYueYale('/ɐn/'), '/an/');
assert('formatYueYale: [ɐŋ] → /ang/', formatYueYale('/ɐŋ/'), '/ang/');
assert('formatYueYale: [ɐp] → /ap/', formatYueYale('/ɐp/'), '/ap/');
assert('formatYueYale: [ɐt] → /at/', formatYueYale('/ɐt/'), '/at/');
assert('formatYueYale: [ɐk] → /ak/', formatYueYale('/ɐk/'), '/ak/');

// e 韵母系列
assert('formatYueYale: [ɛː] → /e/', formatYueYale('/ɛ:/'), '/e/');
assert('formatYueYale: [ei] → /ei/', formatYueYale('/ei/'), '/ei/');
assert('formatYueYale: [ɛːu] → /eu/', formatYueYale('/ɛ:u/'), '/eu/');
assert('formatYueYale: [ɛːm] → /em/', formatYueYale('/ɛ:m/'), '/em/');
assert('formatYueYale: [ɛːn] → /en/', formatYueYale('/ɛ:n/'), '/en/');
assert('formatYueYale: [ɛːŋ] → /eng/', formatYueYale('/ɛ:ŋ/'), '/eng/');
assert('formatYueYale: [ɛːp] → /ep/', formatYueYale('/ɛ:p/'), '/ep/');
assert('formatYueYale: [ɛːt] → /et/', formatYueYale('/ɛ:t/'), '/et/');
assert('formatYueYale: [ɛːk] → /ek/', formatYueYale('/ɛ:k/'), '/ek/');

// i 韵母系列
assert('formatYueYale: [iː] → /i/', formatYueYale('/i:/'), '/i/');
assert('formatYueYale: [iːu] → /iu/', formatYueYale('/i:u/'), '/iu/');
assert('formatYueYale: [iːm] → /im/', formatYueYale('/i:m/'), '/im/');
assert('formatYueYale: [iːn] → /in/', formatYueYale('/i:n/'), '/in/');
assert('formatYueYale: [iːp] → /ip/', formatYueYale('/i:p/'), '/ip/');
assert('formatYueYale: [iːt] → /it/', formatYueYale('/i:t/'), '/it/');
assert('formatYueYale: [ɪŋ] → /ing/', formatYueYale('/ɪŋ/'), '/ing/');
assert('formatYueYale: [ɪk] → /ik/', formatYueYale('/ɪk/'), '/ik/');

// o 韵母系列 - 耶鲁 o→oh
assert('formatYueYale: [ɔː] → /o/', formatYueYale('/ɔ:/'), '/o/');
assert('formatYueYale: [ɔːi] → /oi/', formatYueYale('/ɔ:i/'), '/oi/');
assert('formatYueYale: [ou] → /ou/', formatYueYale('/ou/'), '/ou/');
assert('formatYueYale: [ɔːn] → /on/', formatYueYale('/ɔ:n/'), '/on/');
assert('formatYueYale: [ɔːŋ] → /ong/', formatYueYale('/ɔ:ŋ/'), '/ong/');
assert('formatYueYale: [ɔːt] → /ot/', formatYueYale('/ɔ:t/'), '/ot/');
assert('formatYueYale: [ɔːk] → /ok/', formatYueYale('/ɔ:k/'), '/ok/');

// u 韵母系列
assert('formatYueYale: [uː] → /u/', formatYueYale('/u:/'), '/u/');
assert('formatYueYale: [uːi] → /ui/', formatYueYale('/u:i/'), '/ui/');
assert('formatYueYale: [uːn] → /un/', formatYueYale('/u:n/'), '/un/');
assert('formatYueYale: [uːt] → /ut/', formatYueYale('/u:t/'), '/ut/');
assert('formatYueYale: [ʊŋ] → /ung/', formatYueYale('/ʊŋ/'), '/ung/');
assert('formatYueYale: [ʊk] → /uk/', formatYueYale('/ʊk/'), '/uk/');

// oe 韵母系列 - 耶鲁用 eu 系列
assert('formatYueYale: [œː] → /eu/', formatYueYale('/œ:/'), '/eu/');
assert('formatYueYale: [œːŋ] → /eung/', formatYueYale('/œ:ŋ/'), '/eung/');
assert('formatYueYale: [œːk] → /euk/', formatYueYale('/œ:k/'), '/euk/');
assert('formatYueYale: [œːt] → /eut/', formatYueYale('/œ:t/'), '/eut/');

// eoi/eon 系列 - 耶鲁用 eui/eun/eut
assert('formatYueYale: [ɵy] → /eui/', formatYueYale('/ɵy/'), '/eui/');
assert('formatYueYale: [ɵn] → /eun/', formatYueYale('/ɵn/'), '/eun/');
assert('formatYueYale: [ɵt] → /eut/', formatYueYale('/ɵt/'), '/eut/');

// y 韵母系列 - 耶鲁与粵拼相同
assert('formatYueYale: [yː] → /yu/', formatYueYale('/y:/'), '/yu/');
assert('formatYueYale: [yːn] → /yun/', formatYueYale('/y:n/'), '/yun/');
assert('formatYueYale: [yːt] → /yut/', formatYueYale('/y:t/'), '/yut/');

// 成音节鼻音
assert('formatYueYale: [m̩] → /m/', formatYueYale('/m̩/'), '/m/');
assert('formatYueYale: [ŋ̩] → /ng/', formatYueYale('/ŋ̩/'), '/ng/');

// ============================================
// Test formatYueLiu (IPA → 劉錫祥)
// 声母对照表例字测试
// ============================================
console.log('\n=== Testing formatYueLiu (IPA → 劉錫祥) - 声母 ===');

// 刘锡祥声母特点
assert('formatYueLiu: [p] → /b/', formatYueLiu('/p/'), '/b/');
assert('formatYueLiu: [pʰ] → /p/', formatYueLiu('/pʰ/'), '/p/');
assert('formatYueLiu: [m] → /m/', formatYueLiu('/m/'), '/m/');
assert('formatYueLiu: [f] → /f/', formatYueLiu('/f/'), '/f/');
assert('formatYueLiu: [t] → /d/', formatYueLiu('/t/'), '/d/');
assert('formatYueLiu: [tʰ] → /t/', formatYueLiu('/tʰ/'), '/t/');
assert('formatYueLiu: [n] → /n/', formatYueLiu('/n/'), '/n/');
assert('formatYueLiu: [l] → /l/', formatYueLiu('/l/'), '/l/');
assert('formatYueLiu: [k] → /g/', formatYueLiu('/k/'), '/g/');
assert('formatYueLiu: [kʰ] → /k/', formatYueLiu('/kʰ/'), '/k/');
assert('formatYueLiu: [ŋ] → /ng/', formatYueLiu('/ŋ/'), '/ng/');
assert('formatYueLiu: [h] → /h/', formatYueLiu('/h/'), '/h/');

// 刘锡祥特色：ts→j, tsʰ→ch
assert('formatYueLiu: [ts] → /j/', formatYueLiu('/ts/'), '/j/');
assert('formatYueLiu: [tsʰ] → /ch/', formatYueLiu('/tsʰ/'), '/ch/');
assert('formatYueLiu: [s] → /s/', formatYueLiu('/s/'), '/s/');

// gw/kw 刘锡祥与粵拼相同
assert('formatYueLiu: [kʷ] → /gw/', formatYueLiu('/kʷ/'), '/gw/');
assert('formatYueLiu: [kʷʰ] → /kw/', formatYueLiu('/kʷʰ/'), '/kw/');

// j→y (与耶鲁相同，与教院不同)
assert('formatYueLiu: [j] → /y/', formatYueLiu('/j/'), '/y/');
assert('formatYueLiu: [w] → /w/', formatYueLiu('/w/'), '/w/');

// ============================================
// Test formatYueLiu (IPA → 劉錫祥)
// 韵母对照表例字测试
// ============================================
console.log('\n=== Testing formatYueLiu (IPA → 劉錫祥) - 韵母 ===');

// 基本韵母
assert('formatYueLiu: [aː] → /a/', formatYueLiu('/a:/'), '/a/');
assert('formatYueLiu: [aːi] → /aai/', formatYueLiu('/a:i/'), '/aai/');
assert('formatYueLiu: [aːu] → /aau/', formatYueLiu('/a:u/'), '/aau/');
assert('formatYueLiu: [aːm] → /aam/', formatYueLiu('/a:m/'), '/aam/');
assert('formatYueLiu: [aːn] → /aan/', formatYueLiu('/a:n/'), '/aan/');
assert('formatYueLiu: [aːŋ] → /aang/', formatYueLiu('/a:ŋ/'), '/aang/');
assert('formatYueLiu: [aːp] → /aap/', formatYueLiu('/a:p/'), '/aap/');
assert('formatYueLiu: [aːt] → /aat/', formatYueLiu('/a:t/'), '/aat/');
assert('formatYueLiu: [aːk] → /aak/', formatYueLiu('/a:k/'), '/aak/');

// 短元音韵母
assert('formatYueLiu: [ɐi] → /ai/', formatYueLiu('/ɐi/'), '/ai/');
assert('formatYueLiu: [ɐu] → /au/', formatYueLiu('/ɐu/'), '/au/');
assert('formatYueLiu: [ɐm] → /am/', formatYueLiu('/ɐm/'), '/am/');
assert('formatYueLiu: [ɐn] → /an/', formatYueLiu('/ɐn/'), '/an/');
assert('formatYueLiu: [ɐŋ] → /ang/', formatYueLiu('/ɐŋ/'), '/ang/');
assert('formatYueLiu: [ɐp] → /ap/', formatYueLiu('/ɐp/'), '/ap/');
assert('formatYueLiu: [ɐt] → /at/', formatYueLiu('/ɐt/'), '/at/');
assert('formatYueLiu: [ɐk] → /ak/', formatYueLiu('/ɐk/'), '/ak/');

// e 韵母系列
assert('formatYueLiu: [ɛː] → /e/', formatYueLiu('/ɛ:/'), '/e/');
assert('formatYueLiu: [ei] → /ei/', formatYueLiu('/ei/'), '/ei/');
assert('formatYueLiu: [ɛːu] → /eu/', formatYueLiu('/ɛ:u/'), '/eu/');
assert('formatYueLiu: [ɛːm] → /em/', formatYueLiu('/ɛ:m/'), '/em/');
assert('formatYueLiu: [ɛːn] → /en/', formatYueLiu('/ɛ:n/'), '/en/');
assert('formatYueLiu: [ɛːŋ] → /eng/', formatYueLiu('/ɛ:ŋ/'), '/eng/');
assert('formatYueLiu: [ɛːp] → /ep/', formatYueLiu('/ɛ:p/'), '/ep/');
assert('formatYueLiu: [ɛːt] → /et/', formatYueLiu('/ɛ:t/'), '/et/');
assert('formatYueLiu: [ɛːk] → /ek/', formatYueLiu('/ɛ:k/'), '/ek/');

// i 韵母系列
assert('formatYueLiu: [iː] → /i/', formatYueLiu('/i:/'), '/i/');
assert('formatYueLiu: [iːu] → /iu/', formatYueLiu('/i:u/'), '/iu/');
assert('formatYueLiu: [iːm] → /im/', formatYueLiu('/i:m/'), '/im/');
assert('formatYueLiu: [iːn] → /in/', formatYueLiu('/i:n/'), '/in/');
assert('formatYueLiu: [iːp] → /ip/', formatYueLiu('/i:p/'), '/ip/');
assert('formatYueLiu: [iːt] → /it/', formatYueLiu('/i:t/'), '/it/');
assert('formatYueLiu: [ɪŋ] → /ing/', formatYueLiu('/ɪŋ/'), '/ing/');
assert('formatYueLiu: [ɪk] → /ik/', formatYueLiu('/ɪk/'), '/ik/');

// o 韵母系列 - 刘锡祥 ou→o
assert('formatYueLiu: [ɔː] → /oh/', formatYueLiu('/ɔ:/'), '/oh/');
assert('formatYueLiu: [ɔːi] → /oi/', formatYueLiu('/ɔ:i/'), '/oi/');
assert('formatYueLiu: [ou] → /o/', formatYueLiu('/ou/'), '/o/');
assert('formatYueLiu: [ɔːn] → /on/', formatYueLiu('/ɔ:n/'), '/on/');
assert('formatYueLiu: [ɔːŋ] → /ong/', formatYueLiu('/ɔ:ŋ/'), '/ong/');
assert('formatYueLiu: [ɔːt] → /ot/', formatYueLiu('/ɔ:t/'), '/ot/');
assert('formatYueLiu: [ɔːk] → /ok/', formatYueLiu('/ɔ:k/'), '/ok/');

// u 韵母系列 - 刘锡祥特色
assert('formatYueLiu: [uː] → /oo/', formatYueLiu('/u:/'), '/oo/');
assert('formatYueLiu: [uːi] → /ooi/', formatYueLiu('/u:i/'), '/ooi/');
assert('formatYueLiu: [uːn] → /oon/', formatYueLiu('/u:n/'), '/oon/');
assert('formatYueLiu: [uːt] → /oot/', formatYueLiu('/u:t/'), '/oot/');
assert('formatYueLiu: [ʊŋ] → /ung/', formatYueLiu('/ʊŋ/'), '/ung/');
assert('formatYueLiu: [ʊk] → /uk/', formatYueLiu('/ʊk/'), '/uk/');

// oe 韵母系列 - 刘锡祥用 euh 系列
assert('formatYueLiu: [œː] → /euh/', formatYueLiu('/œ:/'), '/euh/');
assert('formatYueLiu: [œːŋ] → /eung/', formatYueLiu('/œ:ŋ/'), '/eung/');
assert('formatYueLiu: [œːk] → /euk/', formatYueLiu('/œ:k/'), '/euk/');
assert('formatYueLiu: [œːt] → /eut/', formatYueLiu('/œ:t/'), '/eut/');

// eoi/eon 系列 - 刘锡祥用 ui/un/ut
assert('formatYueLiu: [ɵy] → /ui/', formatYueLiu('/ɵy/'), '/ui/');
assert('formatYueLiu: [ɵn] → /un/', formatYueLiu('/ɵn/'), '/un/');
assert('formatYueLiu: [ɵt] → /ut/', formatYueLiu('/ɵt/'), '/ut/');

// y 韵母系列 - 刘锡祥用 ue 系列
assert('formatYueLiu: [yː] → /ue/', formatYueLiu('/y:/'), '/ue/');
assert('formatYueLiu: [yːn] → /uen/', formatYueLiu('/y:n/'), '/uen/');
assert('formatYueLiu: [yːt] → /uet/', formatYueLiu('/y:t/'), '/uet/');

// 成音节鼻音
assert('formatYueLiu: [m̩] → /m/', formatYueLiu('/m̩/'), '/m/');
assert('formatYueLiu: [ŋ̩] → /ng/', formatYueLiu('/ŋ̩/'), '/ng/');

// ============================================
// Summary
// ============================================
console.log('\n========================================');
console.log(`Test Results: ${results.passed} passed, ${results.failed} failed`);
console.log('========================================\n');

// Export for use with test runners
export default results;
