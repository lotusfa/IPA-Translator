import { svgGamepad } from './svg.js';

/**
 * Extract formatted IPA pairs for the game.
 *
 * Takes the raw pairs array returned by a processor with pairsOnly: true.
 * If a formatter exists, wraps each IPA in /.../, runs through formatter,
 * and extracts content between /.../.
 *
 * @param {Function} processFn - The processor function (processTextCharBased or processTextLongestMatch)
 * @param {Array} pairs - Raw pairs array [[word, ipa], ...]
 * @param {Function|null} formatter - Optional formatter function
 * @returns {{ pairs: Array, formattedPairs: Array }}
 */
export function extractFormattedPairs(processFn, pairs, formatter) {
  const rawIpa = pairs.map(([w, ipa]) => [w, ipa]);

  let formattedIpa = rawIpa;
  if (formatter) {
    formattedIpa = pairs.map(([w, ipa]) => {
      const wrapped = '/' + ipa + '/';
      const formatted = formatter(wrapped);
      // Extract content between /.../ if formatter preserved it
      const match = formatted.match(/\/(.+?)\//);
      return [w, match ? match[1] : formatted];
    });
  }

  return { pairs: rawIpa, formattedPairs: formattedIpa };
}

/**
 * Create the game button and attach it to the output label.
 *
 * @param {Object} options
 * @param {string} options.inputId - ID of the input textarea
 * @param {string} options.outputId - ID of the output textarea
 * @param {Function} options.process - The processor function
 * @param {Object} options.IPA_DB - The IPA lookup table (set externally)
 * @param {string} options.gameLabel - Language folder name for game
 * @param {Function} options.getCurrentFormat - Returns current format string
 * @param {Function} options.getProcessorOptions - Returns { withWords, allowWordSearch }
 * @param {number} options.maxWordLength - Max word match length
 * @param {number} options.maxPhraseLength - Max phrase match length
 * @param {string|null} options.ttsLanguage - TTS language code
 * @param {Function|null} options.getLanguage - Function returning TTS language
 * @returns {HTMLElement|null} The created button, or null if output label not found
 */
export function createGameButton(options) {
  const {
    inputId,
    outputId,
    process,
    IPA_DB,
    gameLabel,
    getCurrentFormat,
    getProcessorOptions,
    maxWordLength,
    maxPhraseLength,
    ttsLanguage,
    getLanguage
  } = options;

  const outputEl = document.getElementById(outputId);
  if (!outputEl) return null;

  const outputLabel = outputEl.closest('.form-group')?.querySelector('label');
  if (!outputLabel) return null;

  const gameBtn = document.createElement('button');
  gameBtn.id = 'game-btn';
  gameBtn.className = 'btn-icon';
  gameBtn.setAttribute('aria-label', 'Start IPA Game');
  gameBtn.style.display = 'none';
  gameBtn.innerHTML = svgGamepad;
  outputLabel.appendChild(gameBtn);

  gameBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const input = document.getElementById(inputId)?.value || '';
    if (!input.trim()) return;

    const { withWords, allowWordSearch } = getProcessorOptions();

    const pairs = process({
      input,
      lookupTable: IPA_DB,
      withWords,
      allowWordSearch,
      maxWordLength,
      maxPhraseLength,
      pairsOnly: true
    });

    if (pairs.length < 2) return;

    const currentFormat = getCurrentFormat();
    const formatter = currentFormat ? window[currentFormat] : null;

    const { pairs: rawIpa, formattedPairs } = extractFormattedPairs(process, pairs, formatter);

    localStorage.setItem('ipa_game_data', JSON.stringify({
      text: input,
      pairs: rawIpa,
      formattedPairs,
      language: gameLabel || '',
      format: currentFormat || '',
      ttsLanguage: ttsLanguage || (getLanguage ? getLanguage() : '')
    }));

    window.location.href = '../game/index.html';
  });

  return gameBtn;
}
