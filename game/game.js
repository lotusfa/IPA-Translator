/**
 * IPA Game - Vanilla JS SPA
 * Reads game data from localStorage set by the main app.
 * Screens: start (summary + length picker) -> quiz (mixed game types) -> congrats
 */

// ============================================
// Dark Mode (sync with main app theme)
// ============================================

(function applyTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark-mode');
})();

// ============================================
// localStorage Contract
// ============================================
// The main app writes: { text, pairs, formattedPairs, language, format }
// - pairs: [[word, rawIPA], ...]
// - formattedPairs: [[word, formattedOutput], ...] (or same as pairs if no format)

import { shuffle } from './game-types/utils.js';
import { compressAndEncode, copyToClipboard, parseShareFromUrl, clearShareParams } from '../js/share.js';
import { svgShare, svgTick } from '../js/svg.js';
import * as wordToIpa from './game-types/wordToIpa.js';
import * as ipaToWord from './game-types/ipaToWord.js';
import * as syllableFill from './game-types/syllableFill.js';

// Registered game types — add new types here
const gameTypes = [wordToIpa, ipaToWord, syllableFill];

function randomGameType() {
  const lang = gameData?.language || '';
  const eligible = gameTypes.filter(gt => !gt.canUse || gt.canUse(lang));
  return eligible[Math.floor(Math.random() * eligible.length)];
}

const STORAGE_KEY = 'ipa_game_data';

function loadGameData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ============================================
// Share — encode game data into URL / decode from URL
// ============================================

async function createShareUrl() {
  const data = loadGameData();
  if (!data) return null;
  const b64 = await compressAndEncode({
    page: 'game',
    lang: data.language || '',
    text: data.text || '',
    pairs: data.pairs || [],
    formattedPairs: data.formattedPairs || [],
    format: data.format || '',
  });
  const url = new URL(window.location.href);
  url.searchParams.set('d', b64);
  return url.toString();
}

async function createTranslatorUrl() {
  const data = loadGameData();
  if (!data) return `../${data?.language || 'cantonese'}/index.html`;
  const shareData = {
    page: 'translator',
    lang: data.language || '',
    text: data.text || '',
    format: data.format || '',
  };
  const b64 = await compressAndEncode(shareData);
  const url = new URL(`../${data.language}/index.html`, window.location.href);
  url.searchParams.set('d', b64);
  return url.toString();
}

async function copyShareUrl() {
  const url = await createShareUrl();
  if (!url) return;
  await copyToClipboard(url);
}

// Import data from URL if present (runs before startScreen)
async function importFromUrl() {
  const raw = await parseShareFromUrl();
  if (raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      text: raw.text || '',
      pairs: raw.pairs || [],
      formattedPairs: raw.formattedPairs || raw.pairs || [],
      language: raw.language || raw.lang || '',
      format: raw.format || '',
    }));
    clearShareParams();
  }
}

// ============================================
// Screen Management
// ============================================

const app = document.getElementById('game-app');

function showScreen(html) {
  app.innerHTML = html;
}

// ============================================
// Game State
// ============================================

let gameData = null;     // { text, pairs, formattedPairs, language, format }
let questionQueue = [];  // [{ pair, type }] shuffled queue for the session
let index = 0;           // current question index
let score = 0;
let currentSubState = null; // internal state for multi-step game types (syllable fill)

// ============================================
// Start Screen — summary + length picker
// ============================================

function startScreen() {
  gameData = loadGameData();
  if (!gameData || !gameData.pairs || gameData.pairs.length < 2) {
    showScreen(`
      <div class="game-screen active">
        <h1>IPA Game</h1>
        <p>No game data found. Go back to the translator and click the gamepad button.</p>
        <button class="game-btn game-back-translator-btn" style="display:inline-block; text-decoration:none;">Back to Translator</button>
      </div>
    `);
  app.querySelector('.game-back-translator-btn').addEventListener('click', async () => {
    window.location.href = await createTranslatorUrl();
  });
  return;
  }

  const totalPairs = gameData.pairs.length;
  const formatLabel = gameData.format || 'IPA';
  const langLabel = gameData.language || '';

  // Suggested lengths — cap at total pairs
  let lengths = [...new Set([5, 10, 20, totalPairs].filter(n => n <= totalPairs))];
  if (!lengths.includes(totalPairs)) lengths.push(totalPairs);
  lengths.sort((a, b) => a - b);

  let selectedLength = Math.min(10, totalPairs);

  function render() {
    showScreen(`
      <div class="game-screen active">
        <h1>IPA Game</h1>
        <div class="game-summary">
          <p><strong>${totalPairs}</strong> words &middot; ${formatLabel}${langLabel ? ' &middot; ' + langLabel : ''}</p>
        </div>
        <p>How many questions?</p>
        <div class="game-length-picker">
          ${lengths.map(n =>
            `<button data-length="${n}" class="game-btn game-length-btn ${n === selectedLength ? 'correct' : ''}">${n === totalPairs ? `All ${n}` : n}</button>`
          ).join('')}
        </div>
        <button id="start-game-btn" class="game-btn game-start-btn">Start</button>
        <div style="display:flex; gap:10px; justify-content:center;">
          <button id="share-btn" class="game-btn">${svgShare}</button>
          <button class="game-btn game-link-btn" style="display:inline-block; text-decoration:none;">Back to Translator</button>
        </div>
      </div>
    `);

    app.querySelectorAll('.game-length-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedLength = parseInt(btn.dataset.length, 10);
        render();
      });
    });

    app.querySelector('#start-game-btn').addEventListener('click', () => {
      launchGame(selectedLength);
    });

    app.querySelector('#share-btn').addEventListener('click', async () => {
      const btn = app.querySelector('#share-btn');
      await copyShareUrl();
      btn.innerHTML = svgTick;
      setTimeout(() => { btn.innerHTML = svgShare; }, 2000);
    });

    app.querySelector('.game-link-btn').addEventListener('click', async () => {
      window.location.href = await createTranslatorUrl();
    });
  }

  render();
}

// ============================================
// Quiz Screen — random game type per question
// ============================================

function quizScreen() {
  if (index >= questionQueue.length) {
    congratsScreen();
    return;
  }

  const { pair, type: gameType } = questionQueue[index];
  const progress = (index / questionQueue.length * 100).toFixed(0);
  const allPairs = questionQueue.map(q => q.pair);

  // --- syllable-fill: multi-step game type ---
  if (gameType.id === 'syllable-fill') {
    const lang = gameData.language;
    if (!currentSubState) {
      currentSubState = syllableFill.createSubState(pair, lang);
      // If decomposition failed (e.g., unsupported syllable), fall back to word-to-ipa
      if (!currentSubState) {
        index++; quizScreen();
        return;
      }
    }

    const html = syllableFill.renderSyllableFill(pair, progress, currentSubState);
    showScreen(html);

    const container = document.getElementById('syllable-options');
    const { step, positions, parts } = currentSubState;
    const partName = positions[step];
    const correctValue = parts[partName];

    container.querySelectorAll('.game-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.value;
        if (chosen === correctValue) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
          container.querySelectorAll('.game-option-btn').forEach(b => {
            if (b.dataset.value === correctValue) b.classList.add('correct');
          });
        }
        container.querySelectorAll('.game-option-btn').forEach(b => (b.disabled = true));

        // Mark this blank as filled with the correct value
        currentSubState.filled[partName] = correctValue;
        currentSubState.step++;

        const isLastStep = step >= positions.length - 1;
        setTimeout(() => {
          if (isLastStep) {
            score++;
            currentSubState = null;
            index++;
            quizScreen();
          } else {
            quizScreen(); // re-render next sub-step
          }
        }, 800);
      });
    });

  // --- ipa-to-word: single-step ---
  } else if (gameType.id === 'ipa-to-word') {
    showScreen(gameType.renderIpaToWord(pair, allPairs, progress));
    const correctAnswer = pair[0];
    app.querySelectorAll('.game-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.word;
        if (chosen === correctAnswer) { score++; btn.classList.add('correct'); }
        else {
          btn.classList.add('wrong');
          app.querySelectorAll('.game-option-btn').forEach(b => { if (b.dataset.word === correctAnswer) b.classList.add('correct'); });
        }
        app.querySelectorAll('.game-option-btn').forEach(b => (b.disabled = true));
        setTimeout(() => { index++; quizScreen(); }, 800);
      });
    });

  // --- word-to-ipa: single-step (default) ---
  } else {
    showScreen(wordToIpa.renderWordToIpa(pair, allPairs, progress));
    wordToIpa.attachSpeakButton(pair, gameData.ttsLanguage || gameData.language);
    const correctAnswer = pair[1];
    app.querySelectorAll('.game-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.ipa;
        if (chosen === correctAnswer) { score++; btn.classList.add('correct'); }
        else {
          btn.classList.add('wrong');
          app.querySelectorAll('.game-option-btn').forEach(b => { if (b.dataset.ipa === correctAnswer) b.classList.add('correct'); });
        }
        app.querySelectorAll('.game-option-btn').forEach(b => (b.disabled = true));
        setTimeout(() => { index++; quizScreen(); }, 800);
      });
    });
  }

  app.querySelector('.game-back-btn').addEventListener('click', async () => {
    if (confirm('Quit this game?')) window.location.href = await createTranslatorUrl();
  });
}

// ============================================
// Congrats Screen
// ============================================

function congratsScreen() {
  showScreen(`
    <div class="game-screen active">
      <h1>Congrats!</h1>
      <p>Score: ${score} / ${questionQueue.length}</p>
      <p>${(score / questionQueue.length * 100).toFixed(0)}%</p>
      <div class="game-congrats-actions">
        <button class="game-btn game-restart-btn">Play Again</button>
        <button id="share-btn" class="game-btn">${svgShare}</button>
        <button class="game-btn game-back-translator-btn" style="text-decoration:none;">Back to Translator</button>
      </div>
    </div>
  `);

  app.querySelector('.game-restart-btn').addEventListener('click', () => {
    launchGame(questionQueue.length);
  });

  app.querySelector('#share-btn').addEventListener('click', async () => {
    const btn = app.querySelector('#share-btn');
    await copyShareUrl();
    btn.innerHTML = svgTick;
    setTimeout(() => { btn.innerHTML = svgShare; }, 2000);
  });

  app.querySelector('.game-back-translator-btn').addEventListener('click', async () => {
    window.location.href = await createTranslatorUrl();
  });
}

// ============================================
// Game Launch — build shuffled queue with random types
// ============================================

function launchGame(length) {
  const pairs = (gameData.format && gameData.formattedPairs) ? gameData.formattedPairs : gameData.pairs;
  const rawPairs = gameData.pairs; // syllable-fill needs raw IPA
  const shuffled = shuffle(pairs).slice(0, length);

  questionQueue = shuffle(shuffled.map(pair => {
    const type = randomGameType();
    // syllable-fill must use raw IPA pairs (not formatted)
    const usePair = type.id === 'syllable-fill' && rawPairs !== pairs ? rawPairs.find(rp => rp[0] === pair[0]) || pair : pair;
    return { pair: usePair, type };
  }));

  index = 0;
  score = 0;
  currentSubState = null;
  quizScreen();
}

// ============================================
// Init
// ============================================

(async () => {
  await importFromUrl();
  startScreen();
})();
