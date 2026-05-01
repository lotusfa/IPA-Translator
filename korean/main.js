import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';

/**
 * Applies Korean phonological rules to an array of [word, ipa] pairs.
 * Rules handled: Nasalization, Tensing (Fortition), and L-Assimilation.
 */
function applyKoreanPhonology(ipaArray) {
  for (let i = 0; i < ipaArray.length - 1; i++) {
    let current = ipaArray[i]; // [word, ipa]
    let next = ipaArray[i + 1]; // [word, ipa]

    const curIPA = current[1];
    const nxtIPA = next[1];


    // --- 1. NASAL ASSIMILATION ---
    // Rules: p̚, k̚, t̚ + n → m, ŋ, n + n
    if (nxtIPA.startsWith('/n')) {
      if (curIPA.endsWith('p̚/')) {
        ipaArray[i][1] = curIPA.replace('p̚/', 'm/');
      } else if (curIPA.endsWith('k̚/')) {
        ipaArray[i][1] = curIPA.replace('k̚/', 'ŋ/');
      } else if (curIPA.endsWith('t̚/')) {
        ipaArray[i][1] = curIPA.replace('t̚/', 'n/');
      }
    }

    // Add this inside your applyKoreanPhonology loop
    // Rule: k + h -> kʰ (Aspiration)
    if (curIPA.endsWith('k̚/') && nxtIPA.startsWith('/h')) {
      ipaArray[i][1] = curIPA.replace('k̚/', '/'); // Remove the k stop
      ipaArray[i+1][1] = nxtIPA.replace('/h', '/kʰ'); // Turn h into aspirated k
    }

    // --- 2. TENSING (FORTITION) ---
    // Rules: After a stop (p̚, k̚, t̚), plain consonants become tense
    const isStop = curIPA.endsWith('p̚/') || curIPA.endsWith('k̚/') || curIPA.endsWith('t̚/');
    if (isStop) {
      const tenseMap = {
        '/k': '/k͈',
        '/t': '/t͈',
        '/p': '/p͈',
        '/s': '/s͈',
        '/t͡ɕ': '/t͡ɕ͈'
      };
      
      for (const [plain, tense] of Object.entries(tenseMap)) {
        if (nxtIPA.startsWith(plain) && !nxtIPA.startsWith(tense)) {
          ipaArray[i + 1][1] = nxtIPA.replace(plain, tense);
          break; 
        }
      }
    }

    // --- 3. L-ASSIMILATION (LATERALIZATION) ---
    // Rule: n + l -> l + l
    if (curIPA.endsWith('n/') && nxtIPA.startsWith('/l')) {
      ipaArray[i][1] = curIPA.replace('n/', 'l/');
    }
    // Rule: l + n -> l + l
    if (curIPA.endsWith('l/') && nxtIPA.startsWith('/n')) {
      ipaArray[i + 1][1] = nxtIPA.replace('/n', '/l');
    }
  }
  return ipaArray;
}

/**
 * Wrapper for Korean text processing that leverages character-based lookup
 * and applies post-processing phonology rules.[cite: 1]
 */
function processKorean(options) {
  const { input, withWords = false, pairsOnly = false } = options;

  // Step 1: get all matched [word, ipa] pairs from the base processor[cite: 1]
  const { pairs: rawPairs } = processTextCharBased({ ...options, pairsOnly: true });
  const matchedPairs = rawPairs.filter(p => p[1] != null);

  // Step 2: find each word's actual position in input
  let searchFrom = 0;
  const matches = matchedPairs.map(([word, ipa]) => {
    const start = input.indexOf(word, searchFrom);
    searchFrom = start + word.length;
    return { start, end: start + word.length, word, ipa };
  });

  // Step 3: apply Korean phonology post-processing on IPA values
  const phonologyInput = matchedPairs.map(([word, ipa]) => [word, ipa]);
  applyKoreanPhonology(phonologyInput);
  const updatedIPA = phonologyInput.map(([word, ipa]) => ipa);

  // Step 4: rebuild result, interleaving matched spans and unmatched chars
  const matchesWithUpdated = matches.map((m, i) => ({ ...m, ipa: updatedIPA[i] }));

  let result = "";
  let mi = 0;
  for (let i = 0; i < input.length; i++) {
    if (mi < matchesWithUpdated.length && i === matchesWithUpdated[mi].start) {
      const m = matchesWithUpdated[mi];
      result += withWords ? `( ${m.word} ${m.ipa} ) ` : m.ipa + " ";
      i += m.word.length - 1;
      mi++;
    } else {
      // Keep spaces and punctuation as is
      result += input[i] === " " ? "  " : String(input[i]) + " ";
    }
  }

  if (pairsOnly) return { result: result.trim(), pairs: matchesWithUpdated.map(m => [m.word, m.ipa]) };
  return result.trim().replace(/\s+/g, ' ');
}

initIPAIndexPage({
  databasePath: '../json/ko.json',
  process: processKorean,
  locale: { textAndIpa: '(문자 /ipa/)', onlyIpa: '/ipa/ 만' },
  maxWordLength: 6,
  ttsLanguage: 'ko-KR',
  gameLabel: 'korean',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: '공유', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA 데이터베이스', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: '퀴즈 게임', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: '다른 언어', type: 'lang' },
  ]
});