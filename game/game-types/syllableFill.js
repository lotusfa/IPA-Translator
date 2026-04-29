/**
 * Syllable Fill-In-The-Blank Game Type
 * Breaks an IPA syllable into onset + rhyme + tone blanks.
 * User fills each blank one at a time with multiple choice buttons.
 */

function stripSlash(ipa) { return stripSlash(ipa); }

import { decomposeSyllable, getInitialsForLanguage, supportsDecomposition } from '../../js/syllable-decompose.js';
import { decomposeToJyutping, decomposeToGuangzhou, decomposeToAcademy, decomposeToYale, decomposeToLiu,
         JYUTPING_INITIALS, GUANGZHOU_INITIALS, ACADEMY_INITIALS, YALE_INITIALS, LIU_INITIALS,
         formatIPA_num as yueFormatIPANum } from '../../js/format/yue.format.js';
import { decomposeToPinyin, decomposeToZhuyin, MANDARIN_INITIALS, ZHUYIN_INITIALS } from '../../js/format/zh.format.js';
import { shuffle } from './utils.js';

export const id = 'syllable-fill';

export function canUse(lang) {
  return supportsDecomposition(lang);
}

const partLabels = { onset: 'Initial', rhyme: 'Rhyme', tone: 'Tone' };

function decomposeToIPA_num(ipa, language) {
  const parts = decomposeSyllable(ipa, language);
  return {
    onset: parts.onset,
    rhyme: parts.rhyme,
    tone: yueFormatIPANum(parts.tone),
  };
}

function decomposeToIPA_org(ipa, language) {
  return decomposeSyllable(ipa, language);
}

const decomposeByFormat = {
  Pinyin: decomposeToPinyin,
  'Pinyin_num': decomposeToPinyin,
  Zhuyin: decomposeToZhuyin,
  'IPA_num': decomposeToIPA_num,
  'IPA_org': decomposeToIPA_org,
  Jyutping: decomposeToJyutping,
  Guangzhou: decomposeToGuangzhou,
  Academy: decomposeToAcademy,
  Yale: decomposeToYale,
  Liu: decomposeToLiu,
};

const initialsByFormat = {
  Pinyin: MANDARIN_INITIALS,
  'Pinyin_num': MANDARIN_INITIALS,
  Zhuyin: ZHUYIN_INITIALS,
  Jyutping: JYUTPING_INITIALS,
  Guangzhou: GUANGZHOU_INITIALS,
  Academy: ACADEMY_INITIALS,
  Yale: YALE_INITIALS,
  Liu: LIU_INITIALS,
};

/**
 * Create initial sub-state for a word.
 * @param {Object} pair - [word, rawIPA]
 * @param {string} language - "cantonese" or "mandarin"
 * @param {string} format - Currently selected format (e.g., "Pinyin", "Zhuyin", or "")
 * @returns {Object|null} subState or null if decomposition failed
 */
export function createSubState(pair, language, format) {
  const ipa = pair[1].replace(/^\/*|\/*$/g, '');
  if (ipa.includes(' ')) return null; // skip multi-syllable words

  const parts = decomposeSyllable(ipa, language);
  // Build visible positions — skip empty onset
  const positions = ['onset', 'rhyme', 'tone'].filter(p => p === 'rhyme' || p === 'tone' || parts[p]);

  if (positions.length < 2) return null; // need at least rhyme + tone

  const decomposeFn = getDecomposer(language, format);
  // Use formatted decomposition if available, otherwise fall back to raw IPA parts
  const formattedParts = decomposeFn ? decomposeFn(ipa) : { onset: parts.onset, rhyme: parts.rhyme, tone: parts.tone };

  return {
    step: 0,
    positions,
    parts,
    formattedParts,
    filled: {},
    formattedFilled: {},
    allCorrect: true, // tracks if every sub-step was answered correctly
  };
}

/**
 * Get the decompose function for a language/format combination.
 * Returns a curried fn(ipa) → { onset, rhyme, tone }, or null for raw IPA.
 */
function getDecomposer(language, format) {
  const fn = decomposeByFormat[format];
  if (fn) return ipa => fn(ipa, language);
  // Default: raw IPA (use decomposeSyllable directly)
  return null;
}

/**
 * Generate options for the current sub-step.
 */
function getStepOptions(subState, language, allPairs, format) {
  const partName = subState.positions[subState.step];

  const decomposeFn = getDecomposer(language, format);
  const initialsPool = (format && initialsByFormat[format]) || getInitialsForLanguage(language);

  if (partName === 'onset') {
    const correctValue = subState.formattedParts[partName];
    if (decomposeFn) {
      // Formatted mode (Pinyin/Zhuyin): use predefined initials list
      const pool = initialsPool.filter(v => v !== correctValue);
      return shuffle([correctValue, ...shuffle(pool).slice(0, 3)]);
    } else {
      // Raw IPA mode: collect initials from other syllables in the session
      const values = [];
      for (const [, ipa] of allPairs) {
        const clean = stripSlash(ipa);
        if (clean.includes(' ')) continue;
        const p = decomposeSyllable(clean, language);
        if (p.onset && p.onset !== correctValue) values.push(p.onset);
      }
      const unique = [...new Set(values)];
      return shuffle([correctValue, ...shuffle(unique).slice(0, 3)]);
    }
  }

  // For rhyme/tone: collect from other words in the session
  const correctValue = subState.formattedParts[partName];
  const values = [];
  for (const [, ipa] of allPairs) {
    const clean = stripSlash(ipa);
    if (clean.includes(' ')) continue;
    try {
      const fp = decomposeFn ? decomposeFn(clean) : decomposeSyllable(clean, language);
      if (fp[partName] && fp[partName] !== correctValue) values.push(fp[partName]);
    } catch { /* skip unparseable */ }
  }
  const unique = [...new Set(values)];
  return shuffle([correctValue, ...shuffle(unique).slice(0, 3)]);
}

/**
 * Render the syllable fill screen.
 * Options are pre-rendered with data-value attributes.
 * Caller attaches click handlers to .game-option-btn buttons.
 */
export function renderSyllableFill(pair, progress, subState, allPairs, language, format) {
  const [word] = pair;
  const { positions, formattedFilled } = subState;
  const partName = positions[subState.step];

  const blanksHtml = positions.map(pos => {
    const val = formattedFilled[pos];
    const cls = val ? 'game-syllable-blank filled' : 'game-syllable-blank';
    return `<div class="game-syllable-blank-wrap"><div class="${cls}">${val || '___'}</div><div class="game-syllable-part-label">${pos}</div></div>`;
  }).join('');

  const options = getStepOptions(subState, language, allPairs, format);

  return `
    <div class="game-screen active">
      <button class="game-btn game-back-btn" style="position:static;">Back</button>
      <div class="game-progress"><div class="game-progress-bar" style="width:${progress}%"></div></div>
      <h2 class="game-word-row">${word}</h2>
      <p class="game-syllable-step-label">Fill in the ${partLabels[partName]}</p>
      <div class="game-syllable-blanks">${blanksHtml}</div>
      <div class="game-btn-grid" id="syllable-options">
        ${options.map(opt => `<button data-value="${opt}" class="game-btn game-option-btn">${opt}</button>`).join('')}
      </div>
    </div>
  `;
}
