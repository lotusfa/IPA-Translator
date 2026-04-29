import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';

// Example of a post-lookup rule for Nasalization (p + n -> m + n) 입니
function applyKoreanPhonology(ipaArray) {
  console.log(ipaArray)
  for (let i = 0; i < ipaArray.length - 1; i++) {
    let current = ipaArray[i];
    let next = ipaArray[i+1];
    
    // console.log('current',current)
    // console.log('next',next)
    // If current ends in [p̚] and next starts with [n]
    if (current[1].endsWith('p̚/') && next[1].startsWith('/n')) {
      console.log('(p + n -> m + n)')
      ipaArray[i][1] = current[1].replace('p̚/', 'm/'); // Change [p̚] to [m]
    }
    // ... add more rules for tensing, l-assimilation, etc.
  }
  return ipaArray;
}

function processKorean(options) {
  const { input, withWords = false, pairsOnly = false } = options;

  // Step 1: get all matched [word, ipa] pairs from the base processor
  const { pairs: rawPairs } = processTextCharBased({ ...options, pairsOnly: true, withWords: true });
  const matchedPairs = rawPairs.filter(p => p[1] != null);

  // Step 2: find each word's actual position in input (handles unmatched chars)
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
      result += String(input[i]) + " ";
    }
  }

  if (pairsOnly) return { result: result.trim(), pairs: matchesWithUpdated.map(m => [m.word, m.ipa]) };
  return result.trim();
}

initIPAIndexPage({
  databasePath: '../json/ko.json',
  process: processKorean,
  maxWordLength: 6,
  ttsLanguage: 'ko-KR',
  gameLabel: 'korean'
});
