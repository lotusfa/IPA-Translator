/**
 * IPA Translation Page Initialization
 * FOR: index.html pages only (translation UI)
 */

import { loadIPADatabase, normalizeIPAData, isElementChecked, setElementValue, setElementValueAnimated } from '../utils.js';
import { initSpeakButton } from '../tts.js';
import { getShareModal, parseShareFromUrl, clearShareParams } from '../share.js';
import { svgShare, svgGlobe, svgGamepad, svgCopy, svgTick, svgDownArrow } from '../svg.js';
import { initDarkMode, initLanguageButtons, generateLanguageButtons, initResponsiveTextareaRows } from './page-shared.js';

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
    languageSelectorId = null,
    footerToolsContainerId = null,
    toolsConfig = null,
  } = options;

  if (!databasePath) throw new Error('initIPAIndexPage: "databasePath" is required');
  if (!process) throw new Error('initIPAIndexPage: "process" is required');

  let IPA_DB = {};
  let currentFormat = null;
  let debounceTimer = null;
  let dbGeneration = 0;
  let displayFormat = '';

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

  const iconMap = { share: svgShare, globe: svgGlobe, gamepad: svgGamepad };

  function buildPairsData() {
    const input = document.getElementById(inputId)?.value || '';
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

    return { pairs, formattedPairs };
  }

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

      // Handle display format overrides
      if (displayFormat === 'ipa') {
        const ipas = (result.match(/\/[^/]+/g) || []).map(s => s.slice(1, -1));
        if (ipas.length) setElementValueAnimated(outputId, ipas.join(' '));
      } else if (displayFormat === 'json') {
        const { pairs, formattedPairs } = buildPairsData();
        setElementValueAnimated(outputId, JSON.stringify(pairs, null, 2));
      } else if (displayFormat === 'csv') {
        const { pairs, formattedPairs } = buildPairsData();
        const csv = ['"word","ipa","formatted"'];
        pairs.forEach(([w, ipa], i) => {
          csv.push(`"${w}","${ipa || ''}","${(formattedPairs[i] || [])[1] || ''}"`);
        });
        setElementValueAnimated(outputId, csv.join('\n'));
      }

      if (enableShareButton) {
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) shareBtn.style.display = 'inline-flex';
      }

      if (footerToolsContainerId) {
        const container = document.getElementById(footerToolsContainerId);
        if (container) {
          container.querySelectorAll('[data-visible="after-translate"]').forEach(el => {
            el.style.display = 'flex';
          });
        }
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

  if (enableLanguageButtons && !languageSelectorId) {
    initLanguageButtons({ containerId: langButtonsContainerId, configPath: '../config/languages.json' });
  }

  // Language selector modal (alternative to footer language buttons)
  if (languageSelectorId) {
    const selectorBtn = document.getElementById(languageSelectorId);
    if (selectorBtn) {
      let langModal = null;

      const getLangModal = () => {
        if (!langModal) {
          const overlay = document.createElement('div');
          overlay.className = 'lang-modal-overlay';
          overlay.innerHTML = `
            <div class="lang-modal" role="dialog" aria-modal="true">
              <button class="lang-modal-close" aria-label="Close">&times;</button>
              <h3>選擇語言 / Select Language</h3>
              <ul class="lang-modal-list" id="lang-modal-list"></ul>
            </div>`;
          document.body.appendChild(overlay);

          const closeBtn = overlay.querySelector('.lang-modal-close');
          const close = () => { overlay.style.display = 'none'; };

          closeBtn.addEventListener('click', close);
          overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
          });
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.style.display !== 'none') close();
          });

          langModal = { overlay, close };
        }
        return langModal;
      };

      selectorBtn.addEventListener('click', () => {
        const modal = getLangModal();
        generateLanguageButtons({
          containerId: 'lang-modal-list',
          configPath: '../config/languages.json',
          wrapperTag: 'div'
        });
        modal.overlay.style.display = 'flex';
      });
    }
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

  // Output controls — copy button and display format dropdown
  const outputControls = document.getElementById('output-controls');
  if (outputControls) {
    const copyBtn = document.getElementById('copy-output-btn');
    if (copyBtn) {
      copyBtn.innerHTML = svgCopy;
      copyBtn.addEventListener('click', () => {
        const output = document.getElementById(outputId)?.value || '';
        navigator.clipboard.writeText(output).then(() => {
          copyBtn.innerHTML = svgTick;
          setTimeout(() => { copyBtn.innerHTML = svgCopy; }, 1500);
        });
      });
    }

    const formatBtn = document.getElementById('display-format-btn');
    if (formatBtn) {
      const formatLabels = { '': '(文字 /ipa/)', ipa: '只有 /ipa/', json: 'JSON', csv: 'CSV' };

      const dropdown = {
        el: null,
        open: false,
        show() {
          if (!this.el) {
            this.el = document.createElement('div');
            this.el.className = 'format-dropdown';
            this.el.style.display = 'none';
            this.el.innerHTML = Object.entries(formatLabels).map(([val, label]) =>
              `<button class="format-dropdown-menu-item" value="${val}">${label}</button>`
            ).join('');
            this.el.querySelectorAll('.format-dropdown-menu-item').forEach(item => {
              item.addEventListener('click', () => {
                displayFormat = item.value;
                formatBtn.innerHTML = `${formatLabels[item.value]} ${svgDownArrow}`;
                this.open = false;
                this.el.style.display = 'none';
                translate();
              });
            });
            outputControls.appendChild(this.el);
          }
          this.open = true;
          formatBtn.setAttribute('aria-expanded', 'true');
          this.el.style.display = 'block';
        },
        hide() {
          this.open = false;
          formatBtn.removeAttribute('aria-expanded');
          if (this.el) this.el.style.display = 'none';
        }
      };

      formatBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.open ? dropdown.hide() : dropdown.show();
      });

      document.addEventListener('click', (e) => {
        if (dropdown.open && !formatBtn.contains(e.target) && !dropdown.el?.contains(e.target)) {
          dropdown.hide();
        }
      });
    }

  }

  // Language selector button — inject SVG arrow
  if (languageSelectorId) {
    const selBtn = document.getElementById(languageSelectorId);
    if (selBtn) {
      const text = selBtn.textContent.trim();
      if (text.includes('▾')) {
        selBtn.innerHTML = text.replace('▾', '') + svgDownArrow;
      }
    }
  }

  // Share button (opens modal with share, export, and game options)
  // Shared click handler for share button (output label or footer tools)
  const shareButtonClick = (e) => {
    if (e) e.stopPropagation();
    const input = document.getElementById(inputId)?.value || '';
    if (!input.trim()) return;

    const { pairs, formattedPairs } = buildPairsData();

    const shareData = {
      page: 'translator',
      lang: gameLabel || '',
      text: input,
      format: currentFormat || '',
      pairs,
      formattedPairs,
    };

    const opts = { getShareData: () => shareData, showExport: true };

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
  };

  const gameButtonClick = () => {
    const input = document.getElementById(inputId)?.value || '';
    if (!input.trim()) return;

    const { pairs, formattedPairs } = buildPairsData();
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

    window.location.href = '../game/index.html';
  };

  // Footer tools — per-language config from main.js
  if (footerToolsContainerId && toolsConfig) {
    const container = document.getElementById(footerToolsContainerId);
    if (container) {
      let html = '';

      toolsConfig.forEach(tool => {
        const icon = iconMap[tool.icon] || '';
        const visible = tool.visible === 'after-translate';
        const hiddenStyle = visible ? 'style="display:none"' : '';

        if (tool.type === 'link') {
          html += `<a href="${tool.href}" id="${tool.id}" class="share-circle-btn" ${hiddenStyle}>${icon}<span>${tool.label}</span></a>`;
        } else if (tool.type === 'share' && enableShareButton) {
          html += `<button id="${tool.id}" class="share-circle-btn" data-visible="${tool.visible}" ${hiddenStyle}>${icon}<span>${tool.label}</span></button>`;
        } else if (tool.type === 'game' && enableGameButton) {
          html += `<button id="${tool.id}" class="share-circle-btn" data-visible="${tool.visible}" ${hiddenStyle}>${icon}<span>${tool.label}</span></button>`;
        }
      });

      container.innerHTML = html;

      // Wire up handlers by ID
      const shareBtn = document.getElementById('share-btn');
      if (shareBtn) shareBtn.addEventListener('click', shareButtonClick);

      const gameBtn = document.getElementById('game-btn');
      if (gameBtn) gameBtn.addEventListener('click', gameButtonClick);
    }
  }

  // Share button on output label (legacy — only if no footer tools and share is enabled)
  if (enableShareButton && !footerToolsContainerId) {
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
        shareBtn.addEventListener('click', shareButtonClick);
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
