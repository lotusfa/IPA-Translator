/**
 * Real-world Cantonese test cases
 * Based on actual words from json/yue.json and ref/table.md
 *
 * Run with: node test/real-cases.test.js
 */

import {
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu
} from '../js/yue.format.js';

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

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
// Real examples from ref/table.md
// Based on correct IPA to Jyutping mapping
// ============================================
console.log('\n=== Testing Real Examples from Table ===\n');

// 聲母对照表例字测试 - these are single syllable tests
console.log('--- 聲母例字 ---');

// 巴 [p] + [a:] + [˥] = /pa:˥/ → baa1
// Note: ˥ without entering ending = tone 1
assert('巴 Jyutping: /pa:˥/ → /baa1/',
  formatYueJyutping('/pa:˥/'), '/baa1/');

// 趴 [pʰ] + [a:] + [˥] = /pʰa:˥/ → paal
assert('趴 Jyutping: /pʰa:˥/ → /paal/',
  formatYueJyutping('/pʰa:˥/'), '/paal/');

// 媽 [m] + [a:] + [˥] = /ma:˥/ → maa1
assert('媽 Jyutping: /ma:˥/ → /maa1/',
  formatYueJyutping('/ma:˥/'), '/maa1/');

// 花 [f] + [a:] + [˥] = /fa:˥/ → faa1
assert('花 Jyutping: /fa:˥/ → /faal/',
  formatYueJyutping('/fa:˥/'), '/faal/');

// 打 [t] + [a:] + [˥] = /ta:˥/ → daal
assert('打 Jyutping: /ta:˥/ → /daal/',
  formatYueJyutping('/ta:˥/'), '/daal/');

// 家 [k] + [a:] + [˥] = /ka:˥/ → gaa1
assert('家 Jyutping: /ka:˥/ → /gaa1/',
  formatYueJyutping('/ka:˥/'), '/gaa1/');

// 卡 [kʰ] + [a:t] + [˧] = /kʰa:t˧/ → kaat3
assert('卡 Jyutping: /kʰa:t˧/ → /kaat3/',
  formatYueJyutping('/kʰa:t˧/'), '/kaat3/');

// 渣 [ts] + [a:] + [˥] = /tsa:˥/ → zaa1
assert('渣 Jyutping: /tsa:˥/ → /zaal/',
  formatYueJyutping('/tsa:˥/'), '/zaal/');

// 差 [tsʰ] + [a:] + [˥] = /tsʰa:˥/ → caal
assert('差 Jyutping: /tsʰa:˥/ → /caal/',
  formatYueJyutping('/tsʰa:˥/'), '/caal/');

// 瓜 [kʷ] + [a:] + [˥] = /kʷa:˥/ → gwaal
assert('瓜 Jyutping: /kʷa:˥/ → /gwaa1/',
  formatYueJyutping('/kʷa:˥/'), '/gwaa1/');

// 夸 [kʷʰ] + [a:] + [˥] = /kʷʰa:˥/ → kwaal
assert('夸 Jyutping: /kʷʰa:˥/ → /kwaa1/',
  formatYueJyutping('/kʷʰa:˥/'), '/kwaa1/');

// ============================================
// 韻母对照表例字测试
// ============================================
console.log('\n--- 韻母例字 ---');

// 啊 [a:] + [˥] = /a:˥/ → aa1
assert('啊 Jyutping: /a:˥/ → /aa1/',
  formatYueJyutping('/a:˥/'), '/aa1/');

// 矮 [ɐi] + [˧] = /ɐi˧/ → ai3 (not ai2, ˧=3)
assert('矮 Jyutping: /ɐi˧/ → /ai3/',
  formatYueJyutping('/ɐi˧/'), '/ai3/');

// 歐 [ɐu] + [˧˥] = /ɐu˧˥/ → au2
assert('歐 Jyutping: /ɐu˧˥/ → /au2/',
  formatYueJyutping('/ɐu˧˥/'), '/au2/');

// 些 [ɛ:] + [˥] = /ɛ:˥/ → e1
assert('些 Jyutping: /ɛ:˥/ → /e1/',
  formatYueJyutping('/ɛ:˥/'), '/e1/');

// 四 [ei] + [˧] = /ei˧/ → ei3
assert('四 Jyutping: /ei˧/ → /ei3/',
  formatYueJyutping('/ei˧/'), '/ei3/');

// 衣 [i:] + [˥] = /i:˥/ → ji1
assert('衣 Jyutping: /i:˥/ → /ji1/',
  formatYueJyutping('/i:˥/'), '/ji1/');

// 柯 [ɔ:] + [˥] = /ɔ:˥/ → o1
assert('柯 Jyutping: /ɔ:˥/ → /o1/',
  formatYueJyutping('/ɔ:˥/'), '/o1/');

// 烏 [u:] + [˥] = /u:˥/ → wu1
assert('烏 Jyutping: /u:˥/ → /wu1/',
  formatYueJyutping('/u:˥/'), '/wu1/');

// 靴 [œ:] + [˥] = /œ:˥/ → heul (Yale) / oe1 (Jyutping)
assert('靴 Jyutping: /œ:˥/ → /oe1/',
  formatYueJyutping('/œ:˥/'), '/oe1/');

// 銳 [ɵy] + [˨˩] = /ɵy˨˩/ → zeoi6
assert('銳 Jyutping: /ɵy˨˩/ → /zeoi6/',
  formatYueJyutping('/ɵy˨˩/'), '/zeoi6/');

// 於 [y:] + [˥] = /y:˥/ → yu1
assert('於 Jyutping: /y:˥/ → /yu1/',
  formatYueJyutping('/y:˥/'), '/yu1/');

// ============================================
// 入声调例字 (Entering tones)
// ============================================
console.log('\n--- 入聲例字 ---');

// 鴨 [a:p] + [˥] = /a:p˥/ → aap1 (上陰入)
assert('鴨 Jyutping: /a:p˥/ → /aap1/',
  formatYueJyutping('/a:p˥/'), '/aap1/');

// 壓 [a:t] + [˥] = /a:t˥/ → aat1
assert('壓 Jyutping: /a:t˥/ → /aat1/',
  formatYueJyutping('/a:t˥/'), '/aat1/');

// 軛 [a:k] + [˥] = /a:k˥/ → aak1
assert('軛 Jyutping: /a:k˥/ → /aak1/',
  formatYueJyutping('/a:k˥/'), '/aak1/');

// 下陰入例子：發 [fa:t˧] → faat3
assert('發 Jyutping: /fa:t˧/ → /faat3/',
  formatYueJyutping('/fa:t˧/'), '/faat3/');

// 益 [ɪk] + [˧] = /ɪk˧/ → zik3 (initial 'ts' is missing, this is just vowel+ending)
// Actually 益 = /jik˧/ → zik3
assert('益 Jyutping: /jik˧/ → /zik3/',
  formatYueJyutping('/jik˧/'), '/zik3/');

// 月 [y:t] + [˨] = /y:t˨/ → jyut6
assert('月 Jyutping: /y:t˨/ → /jyut6/',
  formatYueJyutping('/y:t˨/'), '/jyut6/');

// ============================================
// 成音节鼻音
// ============================================
console.log('\n--- 成音節鼻音 ---');

// 唔 [m̩] + [˨˩] = /m̩˨˩/ → m4
assert('唔 Jyutping: /m̩˨˩/ → /m4/',
  formatYueJyutping('/m̩˨˩/'), '/m4/');

// 吳 [ŋ̩] + [˨˩] = /ŋ̩˨˩/ → ng4
assert('吳 Jyutping: /ŋ̩˨˩/ → /ng4/',
  formatYueJyutping('/ŋ̩˨˩/'), '/ng4/');

// ============================================
// 聲調對照表例字
// ============================================
console.log('\n--- 聲調例字 ---');

// 分 [pɐn] + [˥˧] = /pɐn˥˧/ → fan1
assert('分 Jyutping: /pɐn˥˧/ → /fan1/',
  formatYueJyutping('/pɐn˥˧/'), '/fan1/');

// 粉 [pɐn] + [˧˥] = /pɐn˧˥/ → fan2
assert('粉 Jyutping: /pɐn˧˥/ → /fan2/',
  formatYueJyutping('/pɐn˧˥/'), '/fan2/');

// 訓 [fɐn] + [˧] = /fɐn˧/ → fan3
assert('訓 Jyutping: /fɐn˧/ → /fan3/',
  formatYueJyutping('/fɐn˧/'), '/fan3/');

// 墳 [fɐn] + [˨˩] = /fɐn˨˩/ → fan4
assert('墳 Jyutping: /fɐn˨˩/ → /fan4/',
  formatYueJyutping('/fɐn˨˩/'), '/fan4/');

// 憤 [fɐn] + [˩˧] = /fɐn˩˧/ → fan5
assert('憤 Jyutping: /fɐn˩˧/ → /fan5/',
  formatYueJyutping('/fɐn˩˧/'), '/fan5/');

// 份 [fɐn] + [˨] = /fɐn˨/ → fan6
assert('份 Jyutping: /fɐn˨/ → /fan6/',
  formatYueJyutping('/fɐn˨/'), '/fan6/');

// 忽 [hut] + [˥] = /hut˥/ → hut1 (上陰入)
assert('忽 Jyutping: /hut˥/ → /hut1/',
  formatYueJyutping('/hut˥/'), '/hut1/');

// 佛 [fɐt] + [˨] = /fɐt˨/ → fat6
assert('佛 Jyutping: /fɐt˨/ → /fat6/',
  formatYueJyutping('/fɐt˨/'), '/fat6/');

// ============================================
// Multi-character words from JSON data
// ============================================
console.log('\n--- 多字詞語 (from JSON) ---');

// account: /a:˨ kʰa:ŋ˥/ → aa4 hang1
// Note: ɐŋ maps to ang, so kʰa:ŋ should be hang
assert('account Jyutping: /a:˨ kʰa:ŋ˥/ → /aa4 hang1/',
  formatYueJyutping('/a:˨ kʰa:ŋ˥/'), '/aa4 hang1/');

// cheap 嘢: /tsʰi:p˥ jɛ:˩˧/ → ceot1 je1
// tsʰ → c, i:p → eot (wait, i:p should be ip)
// Actually: tsʰi:p = c + i:p = cip, and ˥ = 1
assert('cheap Jyutping: /tsʰi:p˥/ → /cip1/',
  formatYueJyutping('/tsʰi:p˥/'), '/cip1/');

// jɛ:˩˧ = j + ɛ: + ˩˧ = je + 5 = je5, but 嘢 is usually je5
assert('嘢 Jyutping: /jɛ:˩˧/ → /je5/',
  formatYueJyutping('/jɛ:˩˧/'), '/je5/');

// ============================================
// Summary
// ============================================
console.log('\n========================================');
console.log(`Test Results: ${results.passed} passed, ${results.failed} failed`);
console.log('========================================\n');

export default results;
