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

import { shuffle, resetVoiceCache } from './game-types/utils.js';
import { compressAndEncode, parseShareFromUrl, clearShareParams, getShareModal } from '../js/share.js';
import { svgShare } from '../js/svg.js';
import { initGameI18n, t } from './game-i18n.js';
import * as wordToIpa from './game-types/wordToIpa.js';
import * as ipaToWord from './game-types/ipaToWord.js';
import * as syllableFill from './game-types/syllableFill.js';

const ANSWER_DELAY = 800;

// Registered game types — add new types here
const gameTypes = [wordToIpa, ipaToWord, syllableFill];

function randomGameType() {
  const lang = gameData?.language || '';
  const eligible = gameTypes.filter(gt => !gt.canUse || gt.canUse(lang));
  return eligible[Math.floor(Math.random() * eligible.length)];
}

function getAllPairs(queue, gameTypeId, data) {
  if (gameTypeId === 'syllable-fill') {
    return queue.map(q => data.pairs.find(rp => rp[0] === q.pair[0]) || q.pair);
  } else if (data.format && data.formattedPairs) {
    return queue.map(q => data.formattedPairs.find(fp => fp[0] === q.pair[0]) || q.pair);
  }
  return queue.map(q => q.pair);
}

const STORAGE_KEY = 'ipa_game_data';

function loadGameData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    // Filter out entries with null IPA (unmatched database entries)
    if (data.pairs) data.pairs = data.pairs.filter(([, ipa]) => ipa != null);
    if (data.formattedPairs) data.formattedPairs = data.formattedPairs.filter(([, ipa]) => ipa != null);
    return data;
  } catch {
    return null;
  }
}

// ============================================
// Share — encode game data into URL / decode from URL
// ============================================

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
  // Move focus to first button for keyboard/screen reader users
  setTimeout(() => { const firstBtn = app.querySelector('button'); firstBtn?.focus(); }, 50);
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
        <h1>${t('game_title')}</h1>
        <p>${t('game_no_data_message')}</p>
        <button class="game-btn game-back-translator-btn" style="display:inline-block; text-decoration:none;">${t('game_back_to_translator')}</button>
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

  // Truncate source text for preview
  const previewText = gameData.text
    ? gameData.text.length > 60
      ? gameData.text.slice(0, 60) + '…'
      : gameData.text
    : null;

  function render() {
    showScreen(`
      <div class="game-screen active">
        <h1>${t('game_title')}</h1>
        ${previewText ? `<p class="game-start-preview">${previewText}</p>` : ''}
        <p class="game-start-intro">${t('game_intro_sentence', { count: totalPairs })}</p>
        <div class="game-summary">
          <p><strong>${totalPairs}</strong> ${t('game_words')} &middot; ${formatLabel}${langLabel ? ' &middot; ' + langLabel : ''}</p>
        </div>
        <p>${t('game_how_many_questions')}</p>
        <div class="game-length-picker">
          ${lengths.map(n =>
            `<button data-length="${n}" class="game-btn game-length-btn ${n === selectedLength ? 'correct' : ''}">${n === totalPairs ? t('game_all_n', { n }) : n}</button>`
          ).join('')}
        </div>
        <button id="start-game-btn" class="game-btn game-start-btn">${t('game_start')}</button>
        <div style="display:flex; gap:10px; justify-content:center;">
          <button id="share-btn" class="game-btn">${svgShare}</button>
          <button class="game-btn game-link-btn" style="display:inline-block; text-decoration:none;">${t('game_back_to_translator')}</button>
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

    app.querySelector('#share-btn').addEventListener('click', () => {
      getShareModal().show(() => loadGameData());
    });

    app.querySelector('.game-link-btn').addEventListener('click', async () => {
      window.location.href = await createTranslatorUrl();
    });
  }

  render();
}

// --- Attach answer handler for single-step game types ---
function attachSingleStepHandler(selector, dataAttr, correctAnswer) {
  app.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset[dataAttr] === correctAnswer) { score++; btn.classList.add('correct'); }
      else {
        btn.classList.add('wrong');
        app.querySelectorAll(selector).forEach(b => { if (b.dataset[dataAttr] === correctAnswer) b.classList.add('correct'); });
      }
      app.querySelectorAll(selector).forEach(b => (b.disabled = true));
      setTimeout(() => { index++; quizScreen(); }, ANSWER_DELAY);
    });
  });
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
  const progress = ((index + 1) / questionQueue.length * 100).toFixed(0);

  const allPairs = getAllPairs(questionQueue, gameType.id, gameData);

  // --- syllable-fill: multi-step game type ---
  if (gameType.id === 'syllable-fill') {
    const lang = gameData.language;
    const fmt = gameData.format || '';
    if (!currentSubState) {
      currentSubState = syllableFill.createSubState(pair, lang, fmt);
      // If decomposition failed (e.g., unsupported syllable), fall back to word-to-ipa
      if (!currentSubState) {
        questionQueue[index].type = wordToIpa;
        if (gameData.format && gameData.formattedPairs) {
          const fp = gameData.formattedPairs.find(p => p[0] === pair[0]);
          if (fp) questionQueue[index].pair = fp;
        }
        quizScreen(); // re-render with the fallback type
        return;
      }
    }

    const html = syllableFill.renderSyllableFill(pair, progress, currentSubState, allPairs, lang, fmt);
    showScreen(html);

    const container = document.getElementById('syllable-options');
    const { step, positions, parts, formattedParts } = currentSubState;
    const partName = positions[step];
    const correctValue = formattedParts[partName];

    container.querySelectorAll('.game-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.value;
        if (chosen === correctValue) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
          currentSubState.allCorrect = false;
          container.querySelectorAll('.game-option-btn').forEach(b => {
            if (b.dataset.value === correctValue) b.classList.add('correct');
          });
        }
        container.querySelectorAll('.game-option-btn').forEach(b => (b.disabled = true));

        // Mark this blank as filled with the correct value
        currentSubState.filled[partName] = parts[partName];
        currentSubState.formattedFilled[partName] = formattedParts[partName];
        currentSubState.step++;

        const isLastStep = step >= positions.length - 1;
        setTimeout(() => {
          if (isLastStep) {
            if (currentSubState.allCorrect) score++;
            currentSubState = null;
            index++;
            quizScreen();
          } else {
            quizScreen(); // re-render next sub-step
          }
        }, ANSWER_DELAY);
      });
    });

  // --- ipa-to-word: single-step ---
  } else if (gameType.id === 'ipa-to-word') {
    showScreen(gameType.renderIpaToWord(pair, allPairs, progress));
    ipaToWord.attachSpeakButtons(gameData.ttsLanguage || '');
    attachSingleStepHandler('.game-option-btn', 'word', pair[0]);

  // --- word-to-ipa: single-step (default) ---
  } else {
    showScreen(wordToIpa.renderWordToIpa(pair, allPairs, progress));
    wordToIpa.attachSpeakButton(pair, gameData.ttsLanguage || gameData.language);
    attachSingleStepHandler('.game-option-btn', 'ipa', pair[1]);
  }

  app.querySelector('.game-back-btn').addEventListener('click', () => {
    showQuitConfirm(async () => {
      window.location.href = await createTranslatorUrl();
    });
  });
}

// ============================================
// Quit Confirmation Modal
// ============================================

function showQuitConfirm(onQuit) {
  const overlay = document.createElement('div');
  overlay.className = 'game-quit-overlay';
  overlay.innerHTML = `
    <div class="game-quit-modal">
      <p>${t('game_quit_question')}</p>
      <div class="game-quit-actions">
        <button class="game-btn game-cancel-quit-btn">${t('game_stay')}</button>
        <button class="game-btn game-confirm-quit-btn">${t('game_quit')}</button>
      </div>
    </div>
  `;
  app.appendChild(overlay);

  overlay.querySelector('.game-cancel-quit-btn').addEventListener('click', () => {
    overlay.remove();
  });
  overlay.querySelector('.game-confirm-quit-btn').addEventListener('click', () => {
    overlay.remove();
    onQuit();
  });
  overlay.querySelector('.game-confirm-quit-btn').focus();
}

// ============================================
// Congrats Screen
// ============================================

function congratsScreen() {
  showScreen(`
    <div class="game-screen active">
      <h1>${t('game_congrats')}</h1>
      <p>${t('game_score', { score, total: questionQueue.length })}</p>
      <p>${(score / questionQueue.length * 100).toFixed(0)}%</p>
      <div class="game-congrats-actions">
        <button class="game-btn game-restart-btn">${t('game_play_again')}</button>
        <button id="share-btn" class="game-btn">${svgShare}</button>
        <button class="game-btn game-back-translator-btn" style="text-decoration:none;">${t('game_back_to_translator')}</button>
      </div>
    </div>
  `);

  app.querySelector('.game-restart-btn').addEventListener('click', () => {
    launchGame(questionQueue.length);
  });

  app.querySelector('#share-btn').addEventListener('click', () => {
    getShareModal().show(() => loadGameData());
  });

  app.querySelector('.game-back-translator-btn').addEventListener('click', async () => {
    window.location.href = await createTranslatorUrl();
  });
}

// ============================================
// Game Launch — build shuffled queue with random types
// ============================================

function launchGame(length) {
  resetVoiceCache();
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
  const gd = loadGameData();
  await initGameI18n(gd?.language || 'english');
  document.title = t('game_title');
  startScreen();
})();
