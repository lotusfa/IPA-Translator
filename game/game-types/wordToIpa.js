// Game type: show word, user picks IPA from 4 options

import { generateOptions } from './utils.js';
import { speak, selectBestVoice } from '../js/tts.js';

export const id = 'word-to-ipa';

// Cache voice support check
let hasVoice = null;

async function checkVoice(lang) {
  if (hasVoice !== null) return hasVoice;
  hasVoice = (await selectBestVoice(lang)) !== null;
  return hasVoice;
}

export function renderWordToIpa(pair, allPairs, progress) {
  const [word, ipa] = pair;
  const options = generateOptions(allPairs, ipa);

  return `
    <div class="game-screen active">
      <button class="game-btn game-back-btn" style="position:static;">Back</button>
      <div class="game-progress"><div class="game-progress-bar" style="width:${progress}%"></div></div>
      <h2 class="game-word-row">
        ${word}
        <button class="game-speak-btn" aria-label="Speak word">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z M15.54 8.46a5 5 0 0 1 0 7.07 M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        </button>
      </h2>
      <p>Select the correct IPA:</p>
      <div class="game-btn-grid">
        ${options.map(opt => `<button data-ipa="${opt}" class="game-btn game-option-btn">${opt}</button>`).join('')}
      </div>
    </div>
  `;
}

// Call after render to wire up the speak button
export function attachSpeakButton(pair, lang) {
  const btn = document.querySelector('.game-speak-btn');
  if (!btn) return;

  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const voiceOk = await checkVoice(lang);
    if (voiceOk) {
      speak(pair[0], lang);
    } else {
      btn.style.display = 'none';
    }
  });
}
