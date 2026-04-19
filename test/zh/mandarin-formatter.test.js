/**
 * Mandarin Formatter Test Suite
 * Tests zh.format.js formatter against phonics.md reference syllables
 *
 * Run with: node --experimental-vm-modules test/zh/mandarin-formatter.test.js
 */

import {
  convertSyllableToPinyin,
  convertIPATextToPinyin,
  applyToneMarkToSyllable
} from '../../js/zh.format.js';

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

// Tone markers (Chao style)
const TONE_5 = '\u02E5';  // ˥ extra-high (5)
const TONE_4 = '\u02E6';  // ˦ half-high (4)
const TONE_3 = '\u02E7';  // ˧ mid (3)
const TONE_2 = '\u02E8';  // ˨ low (2)
const TONE_1 = '\u02E9';  // ˩ extra-low (1)

// Standard Chao contours
const CHAO_TONE1 = TONE_5 + TONE_5;        // ˥˥ (55)
const CHAO_TONE2 = TONE_3 + TONE_5;        // ˧˥ (35)
const CHAO_TONE3 = TONE_2 + TONE_1 + TONE_4; // ˨˩˦ (214)
const CHAO_TONE4 = TONE_5 + TONE_1;        // ˥˩ (51)

// ============================================
// Test syllables from phonics.md reference
// ============================================

console.log('\n=== Testing b initial (口唇音) ===');
// bɑ (八) bo (波) bɑi (百) bei (悲) bɑo (包) bɑn (班) ben (奔) bɑnɡ (幫) benɡ (崩) bi (逼) bie (別) biao (標) biɑn (邊) bin (賓) binɡ (兵) bu (不)
assert('bɑ (八) tone1', convertSyllableToPinyin('bɑ' + CHAO_TONE1), 'ba1');
assert('bo (波) tone1', convertSyllableToPinyin('bo' + CHAO_TONE1), 'bo1');
assert('bɑi (百) tone3', convertSyllableToPinyin('bɑi' + CHAO_TONE3), 'bai3');
assert('bei (悲) tone1', convertSyllableToPinyin('bei' + CHAO_TONE1), 'bei1');
assert('bɑo (包) tone1', convertSyllableToPinyin('bɑo' + CHAO_TONE1), 'bao1');
assert('bɑn (班) tone1', convertSyllableToPinyin('bɑn' + CHAO_TONE1), 'ban1');
assert('ben (奔) tone1', convertSyllableToPinyin('ben' + CHAO_TONE1), 'ben1');
assert('bɑnɡ (幫) tone1', convertSyllableToPinyin('bɑnɡ' + CHAO_TONE1), 'bang1');
assert('benɡ (崩) tone1', convertSyllableToPinyin('benɡ' + CHAO_TONE1), 'beng1');
assert('bi (逼) tone1', convertSyllableToPinyin('bi' + CHAO_TONE1), 'bi1');
assert('bie (別) tone2', convertSyllableToPinyin('bie' + CHAO_TONE2), 'bie2');
assert('biao (標) tone1', convertSyllableToPinyin('biao' + CHAO_TONE1), 'biao1');
assert('biɑn (邊) tone1', convertSyllableToPinyin('biɑn' + CHAO_TONE1), 'bian1');
assert('bin (賓) tone1', convertSyllableToPinyin('bin' + CHAO_TONE1), 'bin1');
assert('binɡ (兵) tone1', convertSyllableToPinyin('binɡ' + CHAO_TONE1), 'bing1');
assert('bu (不) tone4', convertSyllableToPinyin('bu' + CHAO_TONE4), 'bu4');

console.log('\n=== Testing p initial (口唇音) ===');
// pɑ (怕) po (坡) pɑi (拍) pei (胚) pɑo (跑) pou (剖) pɑn (盤) pen (盆) pɑnɡ (旁) penɡ (烹) pi (批) pie (撇) piao (飄) piɑn (偏) pin (拼) ping (平) pu (撲)
assert('pɑ (怕) tone4', convertSyllableToPinyin('pɑ' + CHAO_TONE4), 'pa4');
assert('po (坡) tone1', convertSyllableToPinyin('po' + CHAO_TONE1), 'po1');
assert('pɑi (拍) tone1', convertSyllableToPinyin('pɑi' + CHAO_TONE1), 'pai1');
assert('pei (胚) tone1', convertSyllableToPinyin('pei' + CHAO_TONE1), 'pei1');
assert('pɑo (跑) tone3', convertSyllableToPinyin('pɑo' + CHAO_TONE3), 'pao3');
assert('pou (剖) tone1', convertSyllableToPinyin('pou' + CHAO_TONE1), 'pou1');
assert('pɑn (盤) tone2', convertSyllableToPinyin('pɑn' + CHAO_TONE2), 'pan2');
assert('pen (盆) tone2', convertSyllableToPinyin('pen' + CHAO_TONE2), 'pen2');
assert('pɑnɡ (旁) tone2', convertSyllableToPinyin('pɑnɡ' + CHAO_TONE2), 'pang2');
assert('penɡ (烹) tone1', convertSyllableToPinyin('penɡ' + CHAO_TONE1), 'peng1');
assert('pi (批) tone1', convertSyllableToPinyin('pi' + CHAO_TONE1), 'pi1');
assert('pie (撇) tone3', convertSyllableToPinyin('pie' + CHAO_TONE3), 'pie3');
assert('piao (飄) tone1', convertSyllableToPinyin('piao' + CHAO_TONE1), 'piao1');
assert('piɑn (偏) tone1', convertSyllableToPinyin('piɑn' + CHAO_TONE1), 'pian1');
assert('pin (拼) tone1', convertSyllableToPinyin('pin' + CHAO_TONE1), 'pin1');
assert('ping (平) tone2', convertSyllableToPinyin('ping' + CHAO_TONE2), 'ping2');
assert('pu (撲) tone1', convertSyllableToPinyin('pu' + CHAO_TONE1), 'pu1');

console.log('\n=== Testing m initial (口唇音) ===');
// mɑ (媽) mo (模) me (麼) mɑi (麥) mei (眉) mɑo (毛) mou (某) mɑn (滿) men (門) mɑnɡ (忙) menɡ (蒙) mi (迷) mie (滅) miao (苗) miu (謬) miɑn (棉) nin (您) niɑnɡ (娘) ninɡ (寧) nu (奴) nuo (挪) nuɑn (暖) nü (女) nüe (虐)
assert('mɑ (媽) tone1', convertSyllableToPinyin('mɑ' + CHAO_TONE1), 'ma1');
assert('mo (模) tone1', convertSyllableToPinyin('mo' + CHAO_TONE1), 'mo1');
assert('mɑi (麥) tone4', convertSyllableToPinyin('mɑi' + CHAO_TONE4), 'mai4');
assert('mei (眉) tone2', convertSyllableToPinyin('mei' + CHAO_TONE2), 'mei2');
assert('mɑo (毛) tone2', convertSyllableToPinyin('mɑo' + CHAO_TONE2), 'mao2');
assert('mou (某) tone3', convertSyllableToPinyin('mou' + CHAO_TONE3), 'mou3');
assert('mɑn (滿) tone3', convertSyllableToPinyin('mɑn' + CHAO_TONE3), 'man3');
assert('men (門) tone2', convertSyllableToPinyin('men' + CHAO_TONE2), 'men2');
assert('mɑnɡ (忙) tone2', convertSyllableToPinyin('mɑnɡ' + CHAO_TONE2), 'mang2');
assert('menɡ (蒙) tone2', convertSyllableToPinyin('menɡ' + CHAO_TONE2), 'meng2');
assert('mi (迷) tone2', convertSyllableToPinyin('mi' + CHAO_TONE2), 'mi2');
assert('mie (滅) tone4', convertSyllableToPinyin('mie' + CHAO_TONE4), 'mie4');
assert('miao (苗) tone2', convertSyllableToPinyin('miao' + CHAO_TONE2), 'miao2');
assert('miɑn (棉) tone2', convertSyllableToPinyin('miɑn' + CHAO_TONE2), 'mian2');
assert('nin (您) tone2', convertSyllableToPinyin('nin' + CHAO_TONE2), 'nin2');
assert('miu (謬) tone4', convertSyllableToPinyin('miu' + CHAO_TONE4), 'miu4');

console.log('\n=== Testing d initial (舌尖音) ===');
// dɑ (大) de (德) dɑi (呆) dei (得) dɑo (刀) dou (鬥) dɑn (單) den (扽) dɑnɡ (當) denɡ (燈) donɡ (冬) di (地) dia (嗲) die (爹) diao (刁) diu (丟) diɑn (點) dinɡ (丁) du (讀) duo (多) dui (對) duɑn (端) dun (噸)
assert('dɑ (大) tone4', convertSyllableToPinyin('dɑ' + CHAO_TONE4), 'da4');
assert('de (德) tone1', convertSyllableToPinyin('de' + CHAO_TONE1), 'de1');
assert('dɑi (呆) tone1', convertSyllableToPinyin('dɑi' + CHAO_TONE1), 'dai1');
assert('dɑo (刀) tone1', convertSyllableToPinyin('dɑo' + CHAO_TONE1), 'dao1');
assert('dou (鬥) tone4', convertSyllableToPinyin('dou' + CHAO_TONE4), 'dou4');
assert('dɑn (單) tone1', convertSyllableToPinyin('dɑn' + CHAO_TONE1), 'dan1');
assert('dɑnɡ (當) tone1', convertSyllableToPinyin('dɑnɡ' + CHAO_TONE1), 'dang1');
assert('denɡ (燈) tone1', convertSyllableToPinyin('denɡ' + CHAO_TONE1), 'deng1');
assert('donɡ (冬) tone1', convertSyllableToPinyin('donɡ' + CHAO_TONE1), 'dong1');
assert('di (地) tone4', convertSyllableToPinyin('di' + CHAO_TONE4), 'di4');
assert('die (爹) tone1', convertSyllableToPinyin('die' + CHAO_TONE1), 'die1');
assert('diao (刁) tone1', convertSyllableToPinyin('diao' + CHAO_TONE1), 'diao1');
assert('diɑn (點) tone3', convertSyllableToPinyin('diɑn' + CHAO_TONE3), 'dian3');
assert('dinɡ (丁) tone1', convertSyllableToPinyin('dinɡ' + CHAO_TONE1), 'ding1');
assert('du (讀) tone2', convertSyllableToPinyin('du' + CHAO_TONE2), 'du2');
assert('duo (多) tone1', convertSyllableToPinyin('duo' + CHAO_TONE1), 'duo1');
assert('dui (對) tone4', convertSyllableToPinyin('dui' + CHAO_TONE4), 'dui4');
assert('duɑn (端) tone1', convertSyllableToPinyin('duɑn' + CHAO_TONE1), 'duan1');
assert('dun (噸) tone1', convertSyllableToPinyin('dun' + CHAO_TONE1), 'dun1');

console.log('\n=== Testing t initial (舌尖音) ===');
// tɑ (她) te (特) tɑi (胎) tei (忒) tɑo (濤) tou (偷) tɑn (貪) tɑnɡ (湯) tenɡ (疼) tonɡ (通) ti (梯) tie (貼) tiao (挑) tiɑn (天) tinɡ (聽) tu (突) tuo (拖) tui (推) tuɑn (團) tun (吞)
assert('tɑ (她) tone4', convertSyllableToPinyin('tɑ' + CHAO_TONE4), 'ta4');
assert('te (特) tone4', convertSyllableToPinyin('te' + CHAO_TONE4), 'te4');
assert('tɑi (胎) tone1', convertSyllableToPinyin('tɑi' + CHAO_TONE1), 'tai1');
assert('tɑo (濤) tone1', convertSyllableToPinyin('tɑo' + CHAO_TONE1), 'tao1');
assert('tou (偷) tone1', convertSyllableToPinyin('tou' + CHAO_TONE1), 'tou1');
assert('tɑn (貪) tone1', convertSyllableToPinyin('tɑn' + CHAO_TONE1), 'tan1');
assert('tɑnɡ (湯) tone1', convertSyllableToPinyin('tɑnɡ' + CHAO_TONE1), 'tang1');
assert('tenɡ (疼) tone2', convertSyllableToPinyin('tenɡ' + CHAO_TONE2), 'teng2');
assert('tonɡ (通) tone1', convertSyllableToPinyin('tonɡ' + CHAO_TONE1), 'tong1');
assert('ti (梯) tone1', convertSyllableToPinyin('ti' + CHAO_TONE1), 'ti1');
assert('tie (貼) tone1', convertSyllableToPinyin('tie' + CHAO_TONE1), 'tie1');
assert('tiao (挑) tone1', convertSyllableToPinyin('tiao' + CHAO_TONE1), 'tiao1');
assert('tiɑn (天) tone1', convertSyllableToPinyin('tiɑn' + CHAO_TONE1), 'tian1');
assert('ting (聽) tone1', convertSyllableToPinyin('ting' + CHAO_TONE1), 'ting1');
assert('tu (突) tone1', convertSyllableToPinyin('tu' + CHAO_TONE1), 'tu1');
assert('tuo (拖) tone1', convertSyllableToPinyin('tuo' + CHAO_TONE1), 'tuo1');
assert('tui (推) tone1', convertSyllableToPinyin('tui' + CHAO_TONE1), 'tui1');
assert('tuɑn (團) tone2', convertSyllableToPinyin('tuɑn' + CHAO_TONE2), 'tuan2');
assert('tun (吞) tone1', convertSyllableToPinyin('tun' + CHAO_TONE1), 'tun1');

console.log('\n=== Testing l initial (舌尖音) ===');
// lɑ (拉) le (樂) lɑi (來) lei (類) lɑo (撈) lou (樓) lɑn (蘭) lɑnɡ (狼) lenɡ (冷) lonɡ (龍) li (離) lia (倆) lie (列) liao (療) liu (劉) liɑn (連) lin (林) liɑnɡ (良) linɡ (靈) lu (盧) luo (羅) luɑn (亂) lun (掄) lü (呂) lüe (略)
assert('lɑ (拉) tone1', convertSyllableToPinyin('lɑ' + CHAO_TONE1), 'la1');
assert('le (樂) tone4', convertSyllableToPinyin('le' + CHAO_TONE4), 'le4');
assert('lɑi (來) tone2', convertSyllableToPinyin('lɑi' + CHAO_TONE2), 'lai2');
assert('lei (類) tone4', convertSyllableToPinyin('lei' + CHAO_TONE4), 'lei4');
assert('lɑo (撈) tone1', convertSyllableToPinyin('lɑo' + CHAO_TONE1), 'lao1');
assert('lou (樓) tone2', convertSyllableToPinyin('lou' + CHAO_TONE2), 'lou2');
assert('lɑn (蘭) tone2', convertSyllableToPinyin('lɑn' + CHAO_TONE2), 'lan2');
assert('lɑnɡ (狼) tone2', convertSyllableToPinyin('lɑnɡ' + CHAO_TONE2), 'lang2');
assert('lenɡ (冷) tone3', convertSyllableToPinyin('lenɡ' + CHAO_TONE3), 'leng3');
assert('lonɡ (龍) tone2', convertSyllableToPinyin('lonɡ' + CHAO_TONE2), 'long2');
assert('li (離) tone2', convertSyllableToPinyin('li' + CHAO_TONE2), 'li2');
assert('lie (列) tone4', convertSyllableToPinyin('lie' + CHAO_TONE4), 'lie4');
assert('liao (療) tone2', convertSyllableToPinyin('liao' + CHAO_TONE2), 'liao2');
assert('liɑn (連) tone2', convertSyllableToPinyin('liɑn' + CHAO_TONE2), 'lian2');
assert('lin (林) tone2', convertSyllableToPinyin('lin' + CHAO_TONE2), 'lin2');
assert('liɑnɡ (良) tone2', convertSyllableToPinyin('liɑnɡ' + CHAO_TONE2), 'liang2');
assert('linɡ (靈) tone2', convertSyllableToPinyin('linɡ' + CHAO_TONE2), 'ling2');
assert('lu (盧) tone2', convertSyllableToPinyin('lu' + CHAO_TONE2), 'lu2');
assert('luo (羅) tone2', convertSyllableToPinyin('luo' + CHAO_TONE2), 'luo2');
assert('luɑn (亂) tone4', convertSyllableToPinyin('luɑn' + CHAO_TONE4), 'luan4');
assert('lü (呂) tone3', convertSyllableToPinyin('ly' + CHAO_TONE3), 'lv3');

console.log('\n=== Testing g initial (舌根音) ===');
// ɡɑ (伽) ɡe (哥) ɡɑi (該) ɡei (給) ɡɑo (高) ɡou (溝) ɡɑn (干) ɡen (根) ɡɑnɡ (剛) ɡenɡ (耕) ɡonɡ (工) ɡu (姑) ɡuɑ (瓜) guo (國) ɡuɑi (怪) ɡui (規) ɡuɑn (關) ɡun (棍) ɡuɑnɡ (光)
assert('ɡɑ (伽) tone1', convertSyllableToPinyin('ɡɑ' + CHAO_TONE1), 'ga1');
assert('ɡe (哥) tone1', convertSyllableToPinyin('ɡe' + CHAO_TONE1), 'ge1');
assert('ɡɑi (該) tone1', convertSyllableToPinyin('ɡɑi' + CHAO_TONE1), 'gai1');
assert('ɡei (給) tone3', convertSyllableToPinyin('ɡei' + CHAO_TONE3), 'gei3');
assert('ɡɑo (高) tone1', convertSyllableToPinyin('ɡɑo' + CHAO_TONE1), 'gao1');
assert('ɡou (溝) tone1', convertSyllableToPinyin('ɡou' + CHAO_TONE1), 'gou1');
assert('ɡɑn (干) tone1', convertSyllableToPinyin('ɡɑn' + CHAO_TONE1), 'gan1');
assert('ɡen (根) tone1', convertSyllableToPinyin('ɡen' + CHAO_TONE1), 'gen1');
assert('ɡɑnɡ (剛) tone1', convertSyllableToPinyin('ɡɑnɡ' + CHAO_TONE1), 'gang1');
assert('ɡenɡ (耕) tone1', convertSyllableToPinyin('ɡenɡ' + CHAO_TONE1), 'geng1');
assert('ɡonɡ (工) tone1', convertSyllableToPinyin('ɡonɡ' + CHAO_TONE1), 'gong1');
assert('ɡu (姑) tone1', convertSyllableToPinyin('ɡu' + CHAO_TONE1), 'gu1');
assert('ɡuɑ (瓜) tone1', convertSyllableToPinyin('ɡuɑ' + CHAO_TONE1), 'gua1');
assert('guo (國) tone2', convertSyllableToPinyin('ɡuo' + CHAO_TONE2), 'guo2');
assert('ɡuɑi (怪) tone4', convertSyllableToPinyin('ɡuɑi' + CHAO_TONE4), 'guai4');
assert('ɡui (規) tone1', convertSyllableToPinyin('ɡui' + CHAO_TONE1), 'gui1');
assert('ɡuɑn (關) tone1', convertSyllableToPinyin('ɡuɑn' + CHAO_TONE1), 'guan1');
assert('ɡun (棍) tone4', convertSyllableToPinyin('ɡun' + CHAO_TONE4), 'gun4');
assert('ɡuɑnɡ (光) tone1', convertSyllableToPinyin('ɡuɑnɡ' + CHAO_TONE1), 'guang1');

console.log('\n=== Testing k initial (舌根音) ===');
// kɑ (卡) ke (可) kɑi (開) kei (礧) kɑo (考) kou (口) kɑn (砍) ken (懇) kɑnɡ (抗) kenɡ (坑) konɡ (空) ku (枯) kuɑ (誇) kuo (闊) kuɑi (快) kui (虧) kuɑn (寬) kun (坤) kuɑnɡ (筐)
assert('kɑ (卡) tone3', convertSyllableToPinyin('kɑ' + CHAO_TONE3), 'ka3');
assert('ke (可) tone3', convertSyllableToPinyin('ke' + CHAO_TONE3), 'ke3');
assert('kɑi (開) tone1', convertSyllableToPinyin('kɑi' + CHAO_TONE1), 'kai1');
assert('kɑo (考) tone3', convertSyllableToPinyin('kɑo' + CHAO_TONE3), 'kao3');
assert('kou (口) tone3', convertSyllableToPinyin('kou' + CHAO_TONE3), 'kou3');
assert('kɑn (砍) tone3', convertSyllableToPinyin('kɑn' + CHAO_TONE3), 'kan3');
assert('kɑnɡ (抗) tone4', convertSyllableToPinyin('kɑnɡ' + CHAO_TONE4), 'kang4');
assert('konɡ (空) tone1', convertSyllableToPinyin('konɡ' + CHAO_TONE1), 'kong1');
assert('ku (枯) tone1', convertSyllableToPinyin('ku' + CHAO_TONE1), 'ku1');
assert('kuɑ (誇) tone1', convertSyllableToPinyin('kuɑ' + CHAO_TONE1), 'kua1');
assert('kuo (闊) tone4', convertSyllableToPinyin('kuo' + CHAO_TONE4), 'kuo4');
assert('kuɑi (快) tone4', convertSyllableToPinyin('kuɑi' + CHAO_TONE4), 'kuai4');
assert('kuɑn (寬) tone1', convertSyllableToPinyin('kuɑn' + CHAO_TONE1), 'kuan1');
assert('kuɑnɡ (筐) tone1', convertSyllableToPinyin('kuɑnɡ' + CHAO_TONE1), 'kuang1');

console.log('\n=== Testing h initial (舌根音) ===');
// hɑ (哈) he (河) hɑi (海) hei (黑) hɑo (好) hou (後) hɑn (汗) hen (狠) hɑnɡ (航) henɡ (恆) honɡ (紅) hu (虎) huɑ (華) huo (火) huɑi (懷) hui (灰) huɑn (換) hun (渾) huɑnɡ (荒)
assert('hɑ (哈) tone1', convertSyllableToPinyin('hɑ' + CHAO_TONE1), 'ha1');
assert('he (河) tone2', convertSyllableToPinyin('he' + CHAO_TONE2), 'he2');
assert('hɑi (海) tone3', convertSyllableToPinyin('hɑi' + CHAO_TONE3), 'hai3');
assert('hei (黑) tone1', convertSyllableToPinyin('hei' + CHAO_TONE1), 'hei1');
assert('hɑo (好) tone3', convertSyllableToPinyin('hɑo' + CHAO_TONE3), 'hao3');
assert('hou (後) tone4', convertSyllableToPinyin('hou' + CHAO_TONE4), 'hou4');
assert('hɑn (汗) tone4', convertSyllableToPinyin('hɑn' + CHAO_TONE4), 'han4');
assert('hɑnɡ (航) tone2', convertSyllableToPinyin('hɑnɡ' + CHAO_TONE2), 'hang2');
assert('honɡ (紅) tone2', convertSyllableToPinyin('honɡ' + CHAO_TONE2), 'hong2');
assert('hu (虎) tone3', convertSyllableToPinyin('hu' + CHAO_TONE3), 'hu3');
assert('huɑ (華) tone2', convertSyllableToPinyin('huɑ' + CHAO_TONE2), 'hua2');
assert('huo (火) tone3', convertSyllableToPinyin('huo' + CHAO_TONE3), 'huo3');
assert('huɑi (懷) tone2', convertSyllableToPinyin('huɑi' + CHAO_TONE2), 'huai2');
assert('hui (灰) tone1', convertSyllableToPinyin('hui' + CHAO_TONE1), 'hui1');
assert('huɑn (換) tone4', convertSyllableToPinyin('huɑn' + CHAO_TONE4), 'huan4');
assert('huɑnɡ (荒) tone1', convertSyllableToPinyin('huɑnɡ' + CHAO_TONE1), 'huang1');

console.log('\n=== Testing j initial (腭音) ===');
// j i (基) jie (街) jiu (九) jia (家) jian (見) jiang (江) jing (經) ju (居) jue (覺) juan (卷) jun (軍)
// IPA: jɪ, jɪɛ, jɪɛu, jɪɑ, jɪɛn, jɪɑnɡ, jɪŋ, jy, jyɛ, jyɛn, yn
assert('jɪ (基) tone1', convertSyllableToPinyin('jɪ' + CHAO_TONE1), 'ji1');
assert('jɪɛ (街) tone1', convertSyllableToPinyin('jɪɛ' + CHAO_TONE1), 'jie1');
assert('jɪɛu (九) tone3', convertSyllableToPinyin('jɪɛu' + CHAO_TONE3), 'jiu3');
assert('jɪɑ (家) tone1', convertSyllableToPinyin('jɪɑ' + CHAO_TONE1), 'jia1');
assert('jɪɛn (見) tone4', convertSyllableToPinyin('jɪɛn' + CHAO_TONE4), 'jian4');
assert('jɪɑnɡ (江) tone1', convertSyllableToPinyin('jɪɑnɡ' + CHAO_TONE1), 'jiang1');
assert('jɪŋ (經) tone1', convertSyllableToPinyin('jɪŋ' + CHAO_TONE1), 'jing1');
assert('jy (居) tone1', convertSyllableToPinyin('jy' + CHAO_TONE1), 'ju1');
assert('jyɛ (覺) tone2', convertSyllableToPinyin('jyɛ' + CHAO_TONE2), 'jue2');
assert('jyɛn (卷) tone3', convertSyllableToPinyin('jyɛn' + CHAO_TONE3), 'juan3');
assert('yn (軍) tone1', convertSyllableToPinyin('yn' + CHAO_TONE1), 'jun1');

console.log('\n=== Testing q initial (腭音) ===');
// q i (欺) qie (恰) qiu (秋) qia (恰) qian (千) qiang (搶) qing (清) qu (區) que (缺) quan (全) qun (群)
assert('tɕʰɪ (欺) tone1', convertSyllableToPinyin('tɕʰɪ' + CHAO_TONE1), 'qi1');
assert('tɕʰɪɛ (切) tone1', convertSyllableToPinyin('tɕʰɪɛ' + CHAO_TONE1), 'qie1');
assert('tɕʰɪɛu (秋) tone1', convertSyllableToPinyin('tɕʰɪɛu' + CHAO_TONE1), 'qiu1');
assert('tɕʰɪɑ (恰) tone4', convertSyllableToPinyin('tɕʰɪɑ' + CHAO_TONE4), 'qia4');
assert('tɕʰɪɛn (千) tone1', convertSyllableToPinyin('tɕʰɪɛn' + CHAO_TONE1), 'qian1');
assert('tɕʰɪɑnɡ (搶) tone3', convertSyllableToPinyin('tɕʰɪɑnɡ' + CHAO_TONE3), 'qiang3');
assert('tɕʰɪŋ (清) tone1', convertSyllableToPinyin('tɕʰɪŋ' + CHAO_TONE1), 'qing1');
assert('tɕʰy (區) tone1', convertSyllableToPinyin('tɕʰy' + CHAO_TONE1), 'qu1');
assert('tɕʰyɛ (缺) tone1', convertSyllableToPinyin('tɕʰyɛ' + CHAO_TONE1), 'que1');
assert('tɕʰyɛn (全) tone2', convertSyllableToPinyin('tɕʰyɛn' + CHAO_TONE2), 'quan2');
assert('tɕʰyn (群) tone2', convertSyllableToPinyin('tɕʰyn' + CHAO_TONE2), 'qun2');

console.log('\n=== Testing x initial (腭音) ===');
// x i (希) xie (些) xiu (休) xia (下) xian (先) xiang (香) xing (星) xu (虛) xue (雪) xuan (宣) xun (尋)
assert('ɕɪ (希) tone1', convertSyllableToPinyin('ɕɪ' + CHAO_TONE1), 'xi1');
assert('ɕɪɛ (些) tone1', convertSyllableToPinyin('ɕɪɛ' + CHAO_TONE1), 'xie1');
assert('ɕɪɛu (休) tone1', convertSyllableToPinyin('ɕɪɛu' + CHAO_TONE1), 'xiu1');
assert('ɕɪɑ (下) tone4', convertSyllableToPinyin('ɕɪɑ' + CHAO_TONE4), 'xia4');
assert('ɕɪɛn (先) tone1', convertSyllableToPinyin('ɕɪɛn' + CHAO_TONE1), 'xian1');
assert('ɕɪɑnɡ (香) tone1', convertSyllableToPinyin('ɕɪɑnɡ' + CHAO_TONE1), 'xiang1');
assert('ɕɪŋ (星) tone1', convertSyllableToPinyin('ɕɪŋ' + CHAO_TONE1), 'xing1');
assert('ɕy (虛) tone1', convertSyllableToPinyin('ɕy' + CHAO_TONE1), 'xu1');
assert('ɕyɛ (雪) tone3', convertSyllableToPinyin('ɕyɛ' + CHAO_TONE3), 'xue3');
assert('ɕyɛn (宣) tone1', convertSyllableToPinyin('ɕyɛn' + CHAO_TONE1), 'xuan1');
assert('ɕyn (尋) tone2', convertSyllableToPinyin('ɕyn' + CHAO_TONE2), 'xun2');

console.log('\n=== Testing zh initial (捲舌音) ===');
// zh ɤ (知) zho (之) zha (鴉) zhe (遮) zhi (枝) zhu (株) zhuɑ (抓) zhuo (卓)
assert('tʂɤ (知) tone1', convertSyllableToPinyin('tʂɤ' + CHAO_TONE1), 'zhi1');
assert('tʂɔ (之) tone1', convertSyllableToPinyin('tʂɔ' + CHAO_TONE1), 'zhi1');
assert('tʂɑ (查) tone2', convertSyllableToPinyin('tʂɑ' + CHAO_TONE2), 'zha2');
assert('tʂɤ (遮) tone1', convertSyllableToPinyin('tʂɤ' + CHAO_TONE1), 'zhi1');
assert('tʂɚ (支) tone1', convertSyllableToPinyin('tʂɚ' + CHAO_TONE1), 'zhi1');
assert('tʂu (株) tone1', convertSyllableToPinyin('tʂu' + CHAO_TONE1), 'zhu1');
assert('tʂuɑ (抓) tone1', convertSyllableToPinyin('tʂuɑ' + CHAO_TONE1), 'zhua1');
assert('tʂuɔ (卓) tone1', convertSyllableToPinyin('tʂuɔ' + CHAO_TONE1), 'zhuo1');

console.log('\n=== Testing ch initial (捲舌音) ===');
// ch ɤ (蚩) cho (恥) cha (茶) che (車) chi (持) chu (樞) chuɑ (黌) cho (抽) chan (齒) chɑnɡ (昌) chonɡ (充)
assert('tʂʰɤ (蚩) tone1', convertSyllableToPinyin('tʂʰɤ' + CHAO_TONE1), 'chi1');
assert('tʂʰɔ (恥) tone3', convertSyllableToPinyin('tʂʰɔ' + CHAO_TONE3), 'chi3');
assert('tʂʰɑ (茶) tone2', convertSyllableToPinyin('tʂʰɑ' + CHAO_TONE2), 'cha2');
assert('tʂʰɤ (車) tone1', convertSyllableToPinyin('tʂʰɤ' + CHAO_TONE1), 'che1');
assert('tʂʰɚ (尺) tone3', convertSyllableToPinyin('tʂʰɚ' + CHAO_TONE3), 'chi3');
assert('tʂʰu (樞) tone1', convertSyllableToPinyin('tʂʰu' + CHAO_TONE1), 'chu1');
assert('tʂʰuɑ (幢) tone2', convertSyllableToPinyin('tʂʰuɑ' + CHAO_TONE2), 'chua2');
assert('tʂʰɑn (炒) tone3', convertSyllableToPinyin('tʂʰɑn' + CHAO_TONE3), 'chan3');
assert('tʂʰɑnɡ (昌) tone1', convertSyllableToPinyin('tʂʰɑnɡ' + CHAO_TONE1), 'chang1');
assert('tʂʰonɡ (充) tone1', convertSyllableToPinyin('tʂʰonɡ' + CHAO_TONE1), 'chong1');

console.log('\n=== Testing sh initial (捲舌音) ===');
// sh ɤ (詩) sho (失) sha (沙) she (社) shi (史) shu (殊) shuɑ (刷) shuo (碩)
assert('ʂɤ (詩) tone1', convertSyllableToPinyin('ʂɤ' + CHAO_TONE1), 'shi1');
assert('ʂɔ (失) tone1', convertSyllableToPinyin('ʂɔ' + CHAO_TONE1), 'shi1');
assert('ʂɑ (沙) tone1', convertSyllableToPinyin('ʂɑ' + CHAO_TONE1), 'sha1');
assert('ʂɤ (社) tone4', convertSyllableToPinyin('ʂɤ' + CHAO_TONE4), 'she4');
assert('ʂɚ (是) tone4', convertSyllableToPinyin('ʂɚ' + CHAO_TONE4), 'shi4');
assert('ʂu (殊) tone1', convertSyllableToPinyin('ʂu' + CHAO_TONE1), 'shu1');
assert('ʂuɑ (刷) tone1', convertSyllableToPinyin('ʂuɑ' + CHAO_TONE1), 'shua1');
assert('ʂuɔ (碩) tone4', convertSyllableToPinyin('ʂuɔ' + CHAO_TONE4), 'shuo4');

console.log('\n=== Testing r initial (捲舌音) ===');
// r ɤ (日) re (熱) ru (儒) ruo (若)
assert('ʐɤ (日) tone4', convertSyllableToPinyin('ʐɤ' + CHAO_TONE4), 'ri4');
assert('ʐɤ (熱) tone4', convertSyllableToPinyin('ʐɤ' + CHAO_TONE4), 'ri4');
assert('ʐu (儒) tone2', convertSyllableToPinyin('ʐu' + CHAO_TONE2), 'ru2');
assert('ʐuɔ (若) tone4', convertSyllableToPinyin('ʐuɔ' + CHAO_TONE4), 'ruo4');

console.log('\n=== Testing z initial (齒音) ===');
// z ɿ (子) zɑ (祖) zɑi (在) zei (賊) zɑo (早) zou (走) zɑn (則) zen (尊) zɑnɡ (藏) zenɡ (增) zonɡ (宗) zu (租) zuo (左)
assert('tsɿ (子) tone3', convertSyllableToPinyin('tsɿ' + CHAO_TONE3), 'zi3');
assert('tsɑ (祖) tone3', convertSyllableToPinyin('tsɑ' + CHAO_TONE3), 'za3');
assert('tsɑi (在) tone4', convertSyllableToPinyin('tsɑi' + CHAO_TONE4), 'zai4');
assert('tsɑo (早) tone3', convertSyllableToPinyin('tsɑo' + CHAO_TONE3), 'zao3');
assert('tsou (走) tone3', convertSyllableToPinyin('tsou' + CHAO_TONE3), 'zou3');
assert('tsɑn (贊) tone4', convertSyllableToPinyin('tsɑn' + CHAO_TONE4), 'zan4');
assert('tsɑnɡ (藏) tone2', convertSyllableToPinyin('tsɑnɡ' + CHAO_TONE2), 'zang2');
assert('tsu (租) tone1', convertSyllableToPinyin('tsu' + CHAO_TONE1), 'zu1');
assert('tsuɔ (左) tone3', convertSyllableToPinyin('tsuɔ' + CHAO_TONE3), 'zuo3');

console.log('\n=== Testing c initial (齒音) ===');
// c ɿ (次) cɑ (擦) cɑi (菜) cɑo (草) cou (凑) cɑn (参) cen (岑) cɑnɡ (倉) cenɡ (層) conɡ (從) cu (粗) cuo (錯)
assert('tsʰɿ (次) tone4', convertSyllableToPinyin('tsʰɿ' + CHAO_TONE4), 'ci4');
assert('tsʰɑ (擦) tone1', convertSyllableToPinyin('tsʰɑ' + CHAO_TONE1), 'ca1');
assert('tsʰɑi (菜) tone4', convertSyllableToPinyin('tsʰɑi' + CHAO_TONE4), 'cai4');
assert('tsʰɑo (草) tone3', convertSyllableToPinyin('tsʰɑo' + CHAO_TONE3), 'cao3');
assert('tsʰɑn (参) tone1', convertSyllableToPinyin('tsʰɑn' + CHAO_TONE1), 'can1');
assert('tsʰɑnɡ (倉) tone1', convertSyllableToPinyin('tsʰɑnɡ' + CHAO_TONE1), 'cang1');
assert('tsʰu (粗) tone1', convertSyllableToPinyin('tsʰu' + CHAO_TONE1), 'cu1');
assert('tsʰuɔ (錯) tone4', convertSyllableToPinyin('tsʰuɔ' + CHAO_TONE4), 'cuo4');

console.log('\n=== Testing s initial (齒音) ===');
// s ɿ (四) sɑ (撒) sɑi (塞) se (色) sɑo (掃) sou (搜) sɑn (三) sen (孫) sɑnɡ (喪) senɡ (僧) sonɡ (送) su (蘇) suo (所)
assert('sɿ (四) tone4', convertSyllableToPinyin('sɿ' + CHAO_TONE4), 'si4');
assert('sɑ (撒) tone1', convertSyllableToPinyin('sɑ' + CHAO_TONE1), 'sa1');
assert('sɑi (塞) tone1', convertSyllableToPinyin('sɑi' + CHAO_TONE1), 'sai1');
assert('se (色) tone4', convertSyllableToPinyin('se' + CHAO_TONE4), 'se4');
assert('sɑo (掃) tone3', convertSyllableToPinyin('sɑo' + CHAO_TONE3), 'sao3');
assert('sou (搜) tone1', convertSyllableToPinyin('sou' + CHAO_TONE1), 'sou1');
assert('sɑn (三) tone1', convertSyllableToPinyin('sɑn' + CHAO_TONE1), 'san1');
assert('sɑnɡ (喪) tone4', convertSyllableToPinyin('sɑnɡ' + CHAO_TONE4), 'sang4');
assert('sonɡ (送) tone4', convertSyllableToPinyin('sonɡ' + CHAO_TONE4), 'song4');
assert('su (蘇) tone1', convertSyllableToPinyin('su' + CHAO_TONE1), 'su1');
assert('suɔ (所) tone3', convertSyllableToPinyin('suɔ' + CHAO_TONE3), 'suo3');

console.log('\n=== Testing Pure Vowel Syllables ===');
// Pure vowel syllables without initials
assert('i (一) tone1', convertSyllableToPinyin('i' + CHAO_TONE1), 'yi1');
assert('ɪ (義) tone4', convertSyllableToPinyin('ɪ' + CHAO_TONE4), 'yi4');
assert('u (烏) tone1', convertSyllableToPinyin('u' + CHAO_TONE1), 'wu1');
assert('y (於) tone1', convertSyllableToPinyin('y' + CHAO_TONE1), 'yu1');
assert('y˩ (語) tone3', convertSyllableToPinyin('y' + CHAO_TONE3), 'yu3');
assert('ən (恩) tone1', convertSyllableToPinyin('ən' + CHAO_TONE1), 'en1');
assert('ɑ (阿) tone1', convertSyllableToPinyin('ɑ' + CHAO_TONE1), 'a1');

console.log('\n=== Testing Special Finals ===');
// Special finals including retroflex and yu patterns
assert('ʈʂʰɻ˩ (遲) should be chi2', convertSyllableToPinyin('ʈʂʰɻ' + CHAO_TONE4), 'chi4');
assert('ɕiɛ˨ (謝) should be xie2', convertSyllableToPinyin('ɕiɛ' + CHAO_TONE2), 'xie2');
assert('ɥyŋ˦ (雄) should be xiong2', convertSyllableToPinyin('ɥyŋ' + CHAO_TONE2), 'xiong2');

console.log('\n========================================');
console.log('RESULTS: ' + results.passed + ' passed, ' + results.failed + ' failed');
console.log('========================================\n');

if (results.failed > 0) {
  console.log('\nFailed tests:');
  results.tests
    .filter(t => t.status === 'FAIL')
    .forEach(t => {
      console.log('  - ' + t.name);
      console.log('    Expected: ' + t.expected + ', Got: ' + t.actual);
    });
}

// Export for further analysis
export default results;
