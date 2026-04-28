/**
 * IPA Translation Page Initialization
 * FOR: index.html pages only (translation UI)
 */

import { loadIPADatabase, normalizeIPAData, isElementChecked, setElementValue, setElementValueAnimated } from './utils.js';
import { initSpeakButton } from './tts.js';
import { svgGamepad } from './svg.js';
import { createShareButton, parseShareFromUrl, clearShareParams } from './share.js';
import { initDarkMode, initLanguageButtons, initResponsiveTextareaRows } from './page-shared.js';

export function initIPAIndexPage(options) {
  const {
    databasePath,
    process,
    inputId = 'cWords_tBox',
    outputId = 'IPA_tBox',
    withWordsId = 'wf_c_words',
    allowWordSearchId = 'allow_words_search',
    variantRadioSelector = 'input[name="inlineRadioOptions"]',
    formatRadioSelector = null,
    darkModeToggleId = 'dark-mode-toggle',
    langButtonsContainerId = 'lang-buttons-container',
    speakButtonId = 'speak-btn',
    outputFormatter = null,
    maxWordLength = 6,
    maxPhraseLength = 5,
    enableLanguageButtons = true,
    enableResponsiveTextarea = true,
    enableSpeakButton = true,
    mobileRows = 5,
    desktopRows = 10,
    formatMapping = null,
    getLanguage = null,
    variantMapping = null,
    withWordsCheckboxId = null,
    ttsLanguage = null,
    gameLabel = null,
    enableGameButton = true,
    enableShareButton = true,
  } = options;

  if (!databasePath) throw new Error('initIPAIndexPage: "databasePath" is required');
  if (!process) throw new Error('initIPAIndexPage: "process" is required');

  let IPA_DB = {};
  let currentFormat = null;
  let debounceTimer = null;
  let dbGeneration = 0;

  const getVariant = () => {
    if (!variantRadioSelector) return null;
    const radio = document.querySelector(`${variantRadioSelector}:checked`);
    return radio ? radio.id : null;
  };

  const getFormat = () => {
    if (!formatRadioSelector) return null;
    const radio = document.querySelector(`${formatRadioSelector}:checked`);
    return radio ? radio.id : null;
  };

  const getDatabasePath = () => {
    if (databasePath.includes('${variant}')) {
      const variant = getVariant();
      const mappedVariant = options.variantMapping && variant ? options.variantMapping[variant] : variant;
      return databasePath.replace('${variant}', mappedVariant || 'default');
    }
    return databasePath;
  };

  const getFormatter = () => {
    if (formatMapping && currentFormat && formatMapping[currentFormat]) {
      return formatMapping[currentFormat];
    }
    return outputFormatter;
  };

  const translate = () => {
    const inputEl = document.getElementById(inputId);
    const outputEl = document.getElementById(outputId);
    if (!inputEl || !outputEl) return;

    const input = inputEl.value;
    if (input.length > 10000) {
      setElementValue(outputId, 'Input too long (max 10,000 characters)');
      return;
    }
    setElementValue(outputId, 'loading....');
    const gen = dbGeneration;

    setTimeout(() => {
      if (gen !== dbGeneration) return;
      const effectiveWithWordsId = withWordsCheckboxId || withWordsId;
      const withWords = effectiveWithWordsId ? isElementChecked(effectiveWithWordsId) : false;
      const allowWordSearch = allowWordSearchId ? isElementChecked(allowWordSearchId) : false;

      let result = process({
        input,
        lookupTable: IPA_DB,
        withWords,
        allowWordSearch,
        maxWordLength,
        maxPhraseLength
      });

      const formatter = getFormatter();
      if (formatter) result = formatter(result);

      setElementValueAnimated(outputId, result);

      if (enableGameButton) {
        const gameBtn = document.getElementById('game-btn');
        if (gameBtn) gameBtn.style.display = 'inline-flex';
      }

      if (enableShareButton) {
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) shareBtn.style.display = 'inline-flex';
      }
    }, 10);
  };

  const loadDatabase = () => {
    dbGeneration++;
    setElementValue(outputId, 'loading....');
    loadIPADatabase({
      basePath: getDatabasePath(),
      onSuccess: (lookup) => {
        IPA_DB = lookup;
        translate();
      },
      onError: (err) => {
        console.error('Failed to load database:', err);
        setElementValue(outputId, 'Error loading database');
      }
    });
  };

  const debouncedTranslate = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(translate, 50);
  };

  const setupEventListeners = () => {
    const inputEl = document.getElementById(inputId);
    if (inputEl) {
      inputEl.addEventListener('input', debouncedTranslate);
      inputEl.addEventListener('focus', function () { this.select(); });
    }

    if (variantRadioSelector) {
      document.querySelectorAll(variantRadioSelector).forEach(el => {
        el.addEventListener('change', () => { loadDatabase(); });
      });
    }

    if (formatRadioSelector) {
      document.querySelectorAll(formatRadioSelector).forEach(el => {
        el.addEventListener('change', () => {
          currentFormat = getFormat();
          translate();
        });
      });
    }

    if (withWordsId) {
      const withWordsEl = document.getElementById(withWordsId);
      if (withWordsEl) withWordsEl.addEventListener('change', translate);
    }

    if (allowWordSearchId) {
      const allowWordSearchEl = document.getElementById(allowWordSearchId);
      if (allowWordSearchEl) allowWordSearchEl.addEventListener('change', translate);
    }
  };

  // Initialize shared UI components
  initDarkMode(darkModeToggleId);

  if (enableLanguageButtons) {
    initLanguageButtons({ containerId: langButtonsContainerId, configPath: '../config/languages.json' });
  }

  if (enableResponsiveTextarea) {
    initResponsiveTextareaRows({ mobileRows, desktopRows });
  }

  if (enableSpeakButton) {
    initSpeakButton({
      buttonId: speakButtonId,
      inputId: inputId,
      getLanguage: getLanguage || (ttsLanguage ? () => ttsLanguage : () => null)
    });
  }

  // Game button
  if (enableGameButton) {
    const outputEl = document.getElementById(outputId);
    if (outputEl) {
      const outputLabel = outputEl.closest('.form-group')?.querySelector('label');
      if (outputLabel) {
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

          const effectiveWithWordsId = withWordsCheckboxId || withWordsId;
          const withWords = effectiveWithWordsId ? isElementChecked(effectiveWithWordsId) : false;
          const allowWordSearch = allowWordSearchId ? isElementChecked(allowWordSearchId) : false;

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

          const formatter = getFormatter();
          const formattedIpa = pairs.map(([w, ipa]) => {
            if (!formatter) return [w, ipa];
            const formatted = formatter(ipa);
            const match = formatted.match(/\/(.+?)\//);
            return [w, match ? match[1] : formatted];
          });

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
      }
    }
  }

  // Share button
  if (enableShareButton) {
    const outputEl = document.getElementById(outputId);
    if (outputEl) {
      const outputLabel = outputEl.closest('.form-group')?.querySelector('label');
      if (outputLabel) {
        const shareBtn = createShareButton({
          buttonId: 'share-btn',
          className: 'btn-icon',
          parentEl: outputLabel,
          getShareData: () => {
            const input = document.getElementById(inputId)?.value || '';
            if (!input.trim()) return null;
            return {
              page: 'translator',
              lang: gameLabel || '',
              text: input,
              format: currentFormat || '',
            };
          }
        });
        shareBtn.style.display = 'none';
      }
    }
  }

  // Parse shared URL data
  (async () => {
    const raw = await parseShareFromUrl();
    if (!raw || raw.page !== 'translator') return;

    if (raw.lang && raw.lang !== gameLabel) {
      const params = new URLSearchParams(window.location.search);
      const b64 = params.get('d');
      if (b64) window.location.href = `../${raw.lang}/index.html?d=${b64}`;
      return;
    }

    clearShareParams();

    if (raw.text) {
      const inputEl = document.getElementById(inputId);
      if (inputEl) inputEl.value = raw.text;
    }

    if (raw.format && formatRadioSelector) {
      const formatRadio = document.querySelector(`${formatRadioSelector}[id="${raw.format}"]`);
      if (formatRadio) {
        formatRadio.checked = true;
        currentFormat = raw.format;
      }
    }
  })();

  setupEventListeners();
  loadDatabase();

  return {
    translate,
    destroy: () => { clearTimeout(debounceTimer); }
  };
}
