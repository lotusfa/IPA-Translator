import { svgGamepad } from './svg.js';

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

    // Get raw pairs for syllable-fill game type (needs unformatted IPA)
    const { pairs } = process({
      input,
      lookupTable: IPA_DB,
      withWords,
      allowWordSearch,
      maxWordLength,
      maxPhraseLength,
      pairsOnly: true
    });

    if (pairs.length < 2) return;

    // Get translator's formatted output — guarantees same result as what user sees
    const rawText = process({
      input,
      lookupTable: IPA_DB,
      withWords,
      allowWordSearch,
      maxWordLength,
      maxPhraseLength
    });

    const currentFormat = getCurrentFormat();
    const formatter = currentFormat ? window[currentFormat] : null;
    const formattedText = formatter ? formatter(rawText) : rawText;

    // Extract formatted pairs by walking through the translator's output
    const formattedIpa = [];
    let text = formattedText;
    for (let i = 0; i < pairs.length; i++) {
      const [word] = pairs[i];
      const idx = text.indexOf(word);
      if (idx === -1) { formattedIpa.push([word, '']); continue; }

      const afterWord = text.slice(idx + word.length);
      let nextPos = text.length - idx;

      for (let j = i + 1; j < pairs.length; j++) {
        const pos = text.indexOf(pairs[j][0], idx + word.length);
        if (pos !== -1 && pos < nextPos) {
          nextPos = pos - (idx + word.length);
        } else { break; }
      }

      formattedIpa.push([word, afterWord.slice(0, nextPos).trim()]);
      text = text.slice(idx + word.length);
    }

    localStorage.setItem('ipa_game_data', JSON.stringify({
      text: input,
      pairs,
      formattedPairs: formattedIpa,
      language: gameLabel || '',
      format: currentFormat || '',
      ttsLanguage: ttsLanguage || (getLanguage ? getLanguage() : '')
    }));

    window.location.href = '../game/index.html';
  });

  return gameBtn;
}
