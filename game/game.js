/**
 * IPA Game - Vanilla JS SPA
 * Reads game data from localStorage set by the main app.
 * Screens: start -> game1,2,3,4 -> congrats
 */

// ============================================
// localStorage Contract
// ============================================
// The main app writes: { text, ipa, pairs, language, format }
// - pairs: [[word, ipa], [word, ipa], ...]
// - language: folder name (e.g. "cantonese")
// - format: selected format id (e.g. "Jyutping")

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

function clearGameData() {
  localStorage.removeItem(STORAGE_KEY);
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

let gameData = null;   // { text, ipa, pairs, language, format }
let currentPairs = []; // shuffled subset for current round
let index = 0;         // current question index
let score = 0;
let gameType = null;   // 'ipa-to-word' | 'word-to-ipa'

// ============================================
// Screens
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

  showScreen(`
    <div class="game-screen active">
      <h1>IPA Game</h1>
      <p>${gameData.pairs.length} words loaded from ${gameData.language}</p>
      <div class="game-btn-grid">
        <button data-type="word-to-ipa" class="game-btn game-type-btn">Word -> IPA</button>
        <button data-type="ipa-to-word" class="game-btn game-type-btn">IPA -> Word</button>
      </div>
      <a href="../${gameData.language}/index.html" class="game-btn" style="display:inline-block; text-decoration:none; margin-top:20px;">Back to Translator</a>
    </div>
  `);

  app.querySelectorAll('.game-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      gameType = btn.dataset.type;
      launchGame();
    });
  });
}

function gameScreen() {
  if (index >= currentPairs.length) {
    congratsScreen();
    return;
  }

  const [word, ipa] = currentPairs[index];
  const progress = ((index) / currentPairs.length * 100).toFixed(0);

  if (gameType === 'word-to-ipa') {
    // Show word, user picks IPA from options
    const options = generateOptions(currentPairs, ipa);
    showScreen(`
      <div class="game-screen active">
        <button class="game-btn game-back-btn" style="position:static;">Back</button>
        <div class="game-progress"><div class="game-progress-bar" style="width:${progress}%"></div></div>
        <h2>${word}</h2>
        <p>Select the correct IPA:</p>
        <div class="game-btn-grid">
          ${options.map((opt, i) => `<button data-index="${i}" data-ipa="${opt}" class="game-btn game-option-btn">${opt}</button>`).join('')}
        </div>
      </div>
    `);

    app.querySelectorAll('.game-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.ipa;
        if (chosen === ipa) {
          score++;
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
          // Highlight correct answer
          app.querySelectorAll('.game-option-btn').forEach(b => {
            if (b.dataset.ipa === ipa) b.classList.add('correct');
          });
        }
        // Disable all buttons, advance after delay
        app.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
        setTimeout(() => { index++; gameScreen(); }, 800);
      });
    });

    app.querySelector('.game-back-btn').addEventListener('click', () => {
      if (confirm('Quit this game?')) window.history.back();
    });

  } else if (gameType === 'ipa-to-word') {
    // Show IPA, user picks word from options
    const options = generateOptions(currentPairs, word, true);
    showScreen(`
      <div class="game-screen active">
        <button class="game-btn game-back-btn" style="position:static;">Back</button>
        <div class="game-progress"><div class="game-progress-bar" style="width:${progress}%"></div></div>
        <h2>${ipa}</h2>
        <p>Select the correct word:</p>
        <div class="game-btn-grid">
          ${options.map((opt, i) => `<button data-index="${i}" data-word="${opt}" class="game-btn game-option-btn">${opt}</button>`).join('')}
        </div>
      </div>
    `);

    app.querySelectorAll('.game-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.word;
        if (chosen === word) {
          score++;
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
          app.querySelectorAll('.game-option-btn').forEach(b => {
            if (b.dataset.word === word) b.classList.add('correct');
          });
        }
        app.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
        setTimeout(() => { index++; gameScreen(); }, 800);
      });
    });

    app.querySelector('.game-back-btn').addEventListener('click', () => {
      if (confirm('Quit this game?')) window.history.back();
    });
  }
}

function congratsScreen() {
  showScreen(`
    <div class="game-screen active">
      <h1>Congrats!</h1>
      <p>Score: ${score} / ${currentPairs.length}</p>
      <p>${(score / currentPairs.length * 100).toFixed(0)}%</p>
      <div class="game-btn-grid">
        <button class="game-btn game-restart-btn">Play Again</button>
        <a href="../${gameData.language}/index.html" class="game-btn" style="text-decoration:none;">Back to Translator</a>
      </div>
    </div>
  `);

  app.querySelector('.game-restart-btn').addEventListener('click', () => {
    launchGame();
  });
}

// ============================================
// Game Logic
// ============================================

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateOptions(allPairs, correct, isWord = false) {
  // Generate 4 options: correct + 3 random distractors
  const pool = allPairs.filter(p => (isWord ? p[0] : p[1]) !== correct);
  const distractors = shuffle(pool).slice(0, 3).map(p => isWord ? p[0] : p[1]);
  return shuffle([correct, ...distractors]);
}

function launchGame() {
  currentPairs = shuffle(gameData.pairs);
  index = 0;
  score = 0;
  gameScreen();
}

// ============================================
// Init
// ============================================

startScreen();
