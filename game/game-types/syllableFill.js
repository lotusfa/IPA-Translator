/**
 * Syllable Fill-In-The-Blank Game Type
 * Breaks an IPA syllable into onset + rhyme + tone blanks.
 * User fills each blank one at a time with multiple choice buttons.
 */

import { decomposeSyllable, getInitialsForLanguage, supportsDecomposition } from '../../js/syllable-decompose.js';
import { decomposeToJyutping, JYUTPING_INITIALS } from '../../js/yue.format.js';
import { decomposeToPinyin, MANDARIN_INITIALS } from '../../js/zh.format.js';
import { shuffle } from './utils.js';

export const id = 'syllable-fill';

export function canUse(lang) {
  return supportsDecomposition(lang);
}

const partLabels = { onset: 'Initial', rhyme: 'Rhyme', tone: 'Tone' };

const decomposeByLang = {
  cantonese: decomposeToJyutping,
  mandarin: decomposeToPinyin,
};

const initialsByLang = {
  cantonese: JYUTPING_INITIALS,
  mandarin: MANDARIN_INITIALS,
};

/**
 * Create initial sub-state for a word.
 * @returns {Object|null} subState or null if decomposition failed
 */
export function createSubState(pair, language) {
  const ipa = pair[1].replace(/^\/*|\/*$/g, '');
  if (ipa.includes(' ')) return null; // skip multi-syllable words

  const parts = decomposeSyllable(ipa, language);
  // Build visible positions — skip empty onset
  const positions = ['onset', 'rhyme', 'tone'].filter(p => p === 'rhyme' || p === 'tone' || parts[p]);

  if (positions.length < 2) return null; // need at least rhyme + tone

  const decomposeFn = decomposeByLang[language] || decomposeToJyutping;
  const formattedParts = decomposeFn(ipa);

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
 * Generate options for the current sub-step.
 */
function getStepOptions(subState, language, allPairs) {
  const partName = subState.positions[subState.step];

  const decomposeFn = decomposeByLang[language] || decomposeToJyutping;
  const initialsPool = initialsByLang[language] || JYUTPING_INITIALS;

  if (partName === 'onset') {
    const pool = initialsPool.filter(v => v !== subState.formattedParts[partName]);
    return shuffle([subState.formattedParts[partName], ...shuffle(pool).slice(0, 3)]);
  }

  // For rhyme/tone: collect from other words in the session
  const values = [];
  for (const [, ipa] of allPairs) {
    const clean = ipa.replace(/^\/*|\/*$/g, '');
    if (clean.includes(' ')) continue;
    try {
      const fp = decomposeFn(clean);
      if (fp[partName] && fp[partName] !== subState.formattedParts[partName]) values.push(fp[partName]);
    } catch { /* skip unparseable */ }
  }
  const unique = [...new Set(values)];
  return shuffle([subState.formattedParts[partName], ...shuffle(unique).slice(0, 3)]);
}

/**
 * Render the syllable fill screen.
 * Options are pre-rendered with data-value attributes.
 * Caller attaches click handlers to .game-option-btn buttons.
 */
export function renderSyllableFill(pair, progress, subState, allPairs, language) {
  const [word] = pair;
  const { positions, formattedFilled } = subState;
  const partName = positions[subState.step];

  const blanksHtml = positions.map(pos => {
    const val = formattedFilled[pos];
    const cls = val ? 'game-syllable-blank filled' : 'game-syllable-blank';
    return `<div class="game-syllable-blank-wrap"><div class="${cls}">${val || '___'}</div><div class="game-syllable-part-label">${pos}</div></div>`;
  }).join('');

  const options = getStepOptions(subState, language, allPairs);

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
