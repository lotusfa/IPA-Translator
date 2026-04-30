/**
 * IPA Translation Page Initialization
 * FOR: index.html pages only (translation UI)
 */

import { loadIPADatabase, normalizeIPAData, isElementChecked, setElementValue, setElementValueAnimated } from '../utils.js';
import { initSpeakButton } from '../tts.js';
import { getShareModal, parseShareFromUrl, clearShareParams } from '../share.js';
import { svgShare } from '../svg.js';
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

  // Share button (opens modal with share, export, and game options)
  if (enableShareButton) {
    const outputEl = document.getElementById(outputId);
    if (outputEl) {
      const outputLabel = outputEl.closest('.form-group')?.querySelector('label');
      if (outputLabel) {
        const shareBtn = document.createElement('button');
        shareBtn.id = 'share-btn';
        shareBtn.className = 'btn-icon';
        shareBtn.setAttribute('aria-label', 'Share');
        shareBtn.innerHTML = svgShare;
        shareBtn.style.display = 'none';
        outputLabel.appendChild(shareBtn);

        shareBtn.addEventListener('click', (e) => {
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

          const formatter = getFormatter();
          const formattedPairs = pairs.map(([w, ipa]) => {
            if (!formatter) return [w, ipa];
            const formatted = formatter(ipa);
            const match = formatted.match(/\/(.+?)\//);
            return [w, match ? match[1] : formatted];
          });

          const shareData = {
            page: 'translator',
            lang: gameLabel || '',
            text: input,
            format: currentFormat || '',
            pairs,
            formattedPairs,
          };

          const opts = {
            getShareData: () => shareData,
            showExport: true,
          };

          // Game button in modal
          if (enableGameButton) {
            opts.gameOnClick = () => {
              const validPairs = pairs.filter(([, ipa]) => ipa != null);
              if (validPairs.length < 2) return;

              localStorage.setItem('ipa_game_data', JSON.stringify({
                text: input,
                pairs: validPairs,
                formattedPairs,
                language: gameLabel || '',
                format: currentFormat || '',
                ttsLanguage: ttsLanguage || (getLanguage ? getLanguage() : ''),
              }));

              getShareModal().close();
              window.location.href = '../game/index.html';
            };
          }

          getShareModal().show(opts);
        });
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
