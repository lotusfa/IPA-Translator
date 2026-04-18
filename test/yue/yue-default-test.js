// test/yue-default-test.js
// 測試 IPA 工具將完整句子（詞語一組，不拆單字）轉換為各粵語拼音方案
// 原文 IPA 來自用戶提供的「國際音標」定義句子，已按詞語分組但合併成單一輸入字串供測試
// 所有轉換均嚴格跟隨提供的 table.md 對照表（聲母、韻母、聲調），自行手動轉換一次作為 expected 值
// 變體（種、嘅）取第一個 IPA；A 為英文保留不轉；標點不包含在 IPA 輸入內

import {
  formatIPA_num,
  formatIPA_org,
  formatJyutpingCantonese,
  formatYueJyutping,
  formatYueGuangzhou,
  formatYueAcademy,
  formatYueYale,
  formatYueLiu
} from '../../js/format.js';

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Test assertion helper
 */
function assert( actual, expected , name) {
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

const ipaString = '/kwɔ:k˧ tsɐi˧ jɐm˥ pi:u˥ jɐu˨ ki:u˧ ma:n˨ kwɔ:k˧ jɐm˥ pi:u˥ tʰʊŋ˥ sœ:ŋ˨˩ jʊŋ˨ jɪŋ˥ mɐn˧˥ sʊk˥ sɛ:˧˥ ɐi˥ pʰi:˥ hɐi˨ jy:˩˧ ji:n˨˩ hɔ:k˨ jɐt˥ tʰou˧ fɔ:ŋ˥ pi:n˨ pi:u˥ si:˨ tsʰy:n˨˩ sɐi˧ ka:i˧ mu:i˩˧ tsʊŋ˧˥ jy:˩˧ jɐm˥ kɛ:˧ pi:u˥ jɐm˥ fu:˨˩ hou˨/';

console.log('=== 開始測試 IPA → 各粵語拼音方案（詞語一組） ===');

// 粵拼（Jyutping）：數字聲調，gwok3 zai3 jam1 biu1 ...
const expectedJyutping = '/gwok3 zai3 jam1 biu1 jau6 giu3 maan6 gwok3 jam1 biu1 tung1 soeng4 jung6 jing1 man2 suk1 se2 ai1 pi1 hai6 jyu5 jin4 hok6 jat1 tou3 fong1 bin6 biu1 si6 cyun4 sai3 gaai3 mui5 zung2 jyu5 jam1 ge3 biu1 jam1 fu4 hou6/';
assert(
  formatYueJyutping(ipaString),
  expectedJyutping,
  'formatYueJyutping: 完整原文 IPA → 粵拼（跟 table 轉換）'
);

// 廣拼（Guangzhou）：數字聲調，guog3 zei3 yem1 biu1 ...（z/c/s 依韻腹變 j/q/x，ê 等特殊元音）
const expectedGuangzhou = '/guog3 zei3 yem1 biu1 yeo6 giu3 man6 guog3 yem1 biu1 tung1 sêng4 yung6 ying1 men2 sug1 sé2 ei1 pi1 hei6 yü5 yin4 hog6 yed1 tou3 fong1 bin6 biu1 si6 qün4 sei3 gai3 mui5 zung2 yü5 yem1 gé3 biu1 yem1 fu4 hou6/';
assert(
  formatYueGuangzhou(ipaString),
  expectedGuangzhou,
  'formatYueGuangzhou: 完整原文 IPA → 廣拼（跟 table 轉換）'
);

// 教院（Academy）：數字聲調，gwok3 dzai3 jam1 biu1 ...（dz/ts 聲母、y 代替 yu）
const expectedAcademy = '/gwok3 dzai3 jam1 biu1 jau6 giu3 maan6 gwok3 jam1 biu1 tung1 soeng4 jung6 jing1 man2 suk1 se2 ai1 pi1 hai6 jy5 jin4 hok6 jat1 tou3 fong1 bin6 biu1 si6 tsyn4 sai3 gaai3 mui5 dzung2 jy5 jam1 ge3 biu1 jam1 fu4 hou6/';
assert(
  formatYueAcademy(ipaString),
  expectedAcademy,
  'formatYueAcademy: 完整原文 IPA → 教院（跟 table 轉換）'
);

// 耶魯（Yale）：使用表中主要方式（聲調符號 + yang 調加 h），數字為備註；這裡預設符號版（跟 table 轉換）
const expectedYale = '/gwok jau6 giu3 maan6 gwok jam1 biu1 tung1 sèung4 jung6 ying1 man2 suk1 se2 ai1 pi1 hai6 jyū5 jin4 hok6 yat1 tou3 fong1 bin6 biu1 si6 chyūn4 sai3 gaai3 mui5 jung2 jyū5 jam1 ge3 biu1 jam1 fu4 hou6/'; // 符號版（主元音加 ¯/´/` + h）；實際函數可依 config 切換數字版
assert(
  formatYueYale(ipaString),
  expectedYale,
  'formatYueYale: 完整原文 IPA → 耶魯（跟 table 轉換，使用符號版）'
);

// 劉錫祥（Liu）：數字聲調，oh/oo/euh/ue 等特殊韻母
const expectedLiu = '/gwok3 jai3 yam1 biu1 yau6 giu3 maan6 gwok3 yam1 biu1 tung1 seung4 yung6 ying1 man2 suk1 se2 ai1 pi1 hai6 jue5 yin4 hok6 yat1 tou3 fong1 bin6 biu1 si6 chuen4 sai3 gaai3 mui5 jung2 jue5 yam1 ge3 biu1 yam1 foo4 hou6/';
assert(
  formatYueLiu(ipaString),
  expectedLiu,
  'formatYueLiu: 完整原文 IPA → 劉錫祥（跟 table 轉換）'
);


// ============================================
// Summary
// ============================================
console.log('\n========================================');
console.log(`Test Results: ${results.passed} passed, ${results.failed} failed`);
console.log('========================================\n');

// Export for use with test runners
export default results;