// Game type: show word, user picks IPA from 4 options

import { generateOptions } from './utils.js';

export const id = 'word-to-ipa';

export function renderWordToIpa(pair, allPairs, progress) {
  const [word, ipa] = pair;
  const options = generateOptions(allPairs, ipa);

  return `
    <div class="game-screen active">
      <button class="game-btn game-back-btn" style="position:static;">Back</button>
      <div class="game-progress"><div class="game-progress-bar" style="width:${progress}%"></div></div>
      <h2>${word}</h2>
      <p>Select the correct IPA:</p>
      <div class="game-btn-grid">
        ${options.map(opt => `<button data-ipa="${opt}" class="game-btn game-option-btn">${opt}</button>`).join('')}
      </div>
    </div>
  `;
}
