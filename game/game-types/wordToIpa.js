// Game type: show word, user picks IPA from 4 options

import { generateOptions, checkVoice, detectLang } from './utils.js';
import { speak } from '../../js/tts.js';
import { svgVoice, svgPause } from '../../js/svg.js';

export const id = 'word-to-ipa';

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
          ${svgVoice}
        </button>
      </h2>
      <p>Select the correct transcription:</p>
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

  const setIcon = (html) => { btn.innerHTML = html; };
  let isSpeaking = false;

  btn.addEventListener('click', async (e) => {
    e.stopPropagation();

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      setIcon(svgVoice);
      return;
    }

    const effectiveLang = lang || detectLang(pair[0]);
    const voiceOk = await checkVoice(effectiveLang);
    if (!voiceOk) {
      btn.style.display = 'none';
      return;
    }

    isSpeaking = true;
    setIcon(svgPause);

    speak(pair[0], effectiveLang, {
      onEnd: () => {
        isSpeaking = false;
        setIcon(svgVoice);
      }
    });
  });
}
