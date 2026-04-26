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
import * as wordToIpa from './game-types/wordToIpa.js';
import * as ipaToWord from './game-types/ipaToWord.js';

// Registered game types — add new types here
const gameTypes = [wordToIpa, ipaToWord];

function randomGameType() {
  return gameTypes[Math.floor(Math.random() * gameTypes.length)];
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
        <a href="../${gameData ? '' : 'cantonese/'}index.html" class="game-btn" style="display:inline-block; text-decoration:none;">Back to Translator</a>
      </div>
    `);
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
        <a href="../${gameData.language}/index.html" class="game-btn game-link-btn" style="display:inline-block; text-decoration:none;">Back to Translator</a>
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

  // Delegate rendering to the game type module
  if (gameType.id === 'ipa-to-word') {
    showScreen(gameType.renderIpaToWord(pair, allPairs, progress));
  } else {
    showScreen(gameType.renderWordToIpa(pair, allPairs, progress));
    wordToIpa.attachSpeakButton(pair, gameData.ttsLanguage || gameData.language);
  }

  const isWordToIpa = gameType.id === 'word-to-ipa';
  const correctAnswer = isWordToIpa ? pair[1] : pair[0];

  app.querySelectorAll('.game-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const chosen = isWordToIpa ? btn.dataset.ipa : btn.dataset.word;
      if (chosen === correctAnswer) {
        score++;
        btn.classList.add('correct');
      } else {
        btn.classList.add('wrong');
        app.querySelectorAll('.game-option-btn').forEach(b => {
          const ca = isWordToIpa ? b.dataset.ipa : b.dataset.word;
          if (ca === correctAnswer) b.classList.add('correct');
        });
      }
      app.querySelectorAll('.game-option-btn').forEach(b => (b.disabled = true));
      setTimeout(() => { index++; quizScreen(); }, 800);
    });
  });

  app.querySelector('.game-back-btn').addEventListener('click', () => {
    if (confirm('Quit this game?')) window.history.back();
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
      <div class="game-btn-grid">
        <button class="game-btn game-restart-btn">Play Again</button>
        <a href="../${gameData.language}/index.html" class="game-btn" style="text-decoration:none;">Back to Translator</a>
      </div>
    </div>
  `);

  app.querySelector('.game-restart-btn').addEventListener('click', () => {
    launchGame(questionQueue.length);
  });
}

// ============================================
// Game Launch — build shuffled queue with random types
// ============================================

function launchGame(length) {
  const pairs = (gameData.format && gameData.formattedPairs) ? gameData.formattedPairs : gameData.pairs;
  const shuffled = shuffle(pairs).slice(0, length);

  questionQueue = shuffle(shuffled.map(pair => ({
    pair,
    type: randomGameType(),
  })));

  index = 0;
  score = 0;
  quizScreen();
}

// ============================================
// Init
// ============================================

startScreen();
