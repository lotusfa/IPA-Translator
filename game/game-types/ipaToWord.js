// Game type: show IPA, user picks word from 4 options

import { generateOptions } from './utils.js';

export const id = 'ipa-to-word';

export function renderIpaToWord(pair, allPairs, progress) {
  const [word, ipa] = pair;
  const options = generateOptions(allPairs, word, true);

  return `
    <div class="game-screen active">
      <button class="game-btn game-back-btn" style="position:static;">Back</button>
      <div class="game-progress"><div class="game-progress-bar" style="width:${progress}%"></div></div>
      <h2>${ipa}</h2>
      <p>Select the correct word:</p>
      <div class="game-btn-grid">
        ${options.map(opt => `<button data-word="${opt}" class="game-btn game-option-btn">${opt}</button>`).join('')}
      </div>
    </div>
  `;
}

export function getCorrectAnswer(pair) {
  return pair[0]; // Word
}
