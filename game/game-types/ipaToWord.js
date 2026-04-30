// Game type: show IPA, user picks word from 4 options

import { generateOptions } from './utils.js';
import { speak, selectBestVoice } from '../../js/tts.js';
import { svgVoice, svgPause } from '../../js/svg.js';

export const id = 'ipa-to-word';

// Cache voice support check
let hasVoice = null;

async function checkVoice(lang) {
  if (hasVoice !== null) return hasVoice;
  hasVoice = (await selectBestVoice(lang)) !== null;
  return hasVoice;
}

// Detect TTS language from word text (fallback when lang is unknown)
function detectLang(word) {
  if (/\p{Script=Han}/u.test(word)) return 'zh-CN';
  if (/\p{Script=Hiragana}/u.test(word) || /\p{Script=Katakana}/u.test(word)) return 'ja-JP';
  if (/\p{Script=Hangul}/u.test(word)) return 'ko-KR';
  return 'en-US';
}

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
        ${options.map(opt => `
          <button data-word="${opt}" class="game-btn game-option-btn">
            ${opt}
            <span class="game-option-speak-btn" data-word="${opt}" aria-label="Speak">
              ${svgVoice}
            </span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// Call after render to wire up speak buttons on the answer options
export function attachSpeakButtons(lang) {
  const btns = document.querySelectorAll('.game-option-speak-btn');
  if (!btns.length) return;

  const setIcon = (btn, html) => { btn.innerHTML = html; };
  const speaking = new Map(); // track per-button speaking state

  btns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();

      const word = btn.dataset.word;
      const isSpeaking = speaking.get(btn) || false;

      if (isSpeaking) {
        window.speechSynthesis.cancel();
        speaking.set(btn, false);
        setIcon(btn, svgVoice);
        return;
      }

      const effectiveLang = lang || detectLang(word);
      const voiceOk = await checkVoice(effectiveLang);
      if (!voiceOk) {
        btn.style.display = 'none';
        return;
      }

      // Cancel any other option speak
      btns.forEach(b => {
        if (b !== btn && speaking.get(b)) {
          speaking.set(b, false);
          setIcon(b, svgVoice);
        }
      });
      window.speechSynthesis.cancel();

      speaking.set(btn, true);
      setIcon(btn, svgPause);

      speak(word, effectiveLang, {
        onEnd: () => {
          speaking.set(btn, false);
          setIcon(btn, svgVoice);
        }
      });
    });
  });
}

export function getCorrectAnswer(pair) {
  return pair[0]; // Word
}
