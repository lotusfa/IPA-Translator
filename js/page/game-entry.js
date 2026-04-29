import { svgGamepad } from '../svg.js';

/**
 * Create the game button and attach it to the output label.
 *
 * @param {Object} options
 * @param {string} options.inputId - ID of the input textarea
 * @param {string} options.outputId - ID of the output textarea
 * @param {Function} options.process - The processor function
 * @param {Function} options.getIpaDataBase - Returns the current IPA lookup table
 * @param {string} options.gameLabel - Language folder name for game
 * @param {Function} options.getFormatter - Returns { formatter, formatId } or null
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
    getIpaDataBase,
    gameLabel,
    getFormatter,
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

    // Get raw pairs for syllable-fill game type (needs unformatted IPA)
    const { pairs } = process({
      input,
      lookupTable: getIpaDataBase(),
      withWords,
      allowWordSearch,
      maxWordLength,
      maxPhraseLength,
      pairsOnly: true
    });

    // Filter out entries where the IPA value is null (unmatched database entries)
    const validPairs = pairs.filter(([, ipa]) => ipa != null);
    if (validPairs.length < 2) return;

    const { formatter, formatId } = getFormatter();
    const formattedIpa = validPairs.map(([w, ipa]) => {
      if (!formatter) return [w, ipa];
      const formatted = formatter(ipa);
      const match = formatted.match(/\/(.+?)\//);
      return [w, match ? match[1] : formatted];
    });

    localStorage.setItem('ipa_game_data', JSON.stringify({
      text: input,
      pairs: validPairs,
      formattedPairs: formattedIpa,
      language: gameLabel || '',
      format: formatId || '',
      ttsLanguage: ttsLanguage || (getLanguage ? getLanguage() : '')
    }));

    window.location.href = '../game/index.html';
  });

  return gameBtn;
}
