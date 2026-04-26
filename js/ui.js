/**
 * Shared UI Initialization for IPA-Translator Pages
 *
 * KISS Principle: Modular functions for different page types
 * Replaces ~70 lines of inline JavaScript in ipa_list*.html files
 *
 * Usage:
 *   For IPA list pages: import { initIPAListPage } from '../js/ui.js';
 *   For index pages:     *
 * ============================================================
 * FUNCTION USAGE BY PAGE TYPE:
 * ============================================================
 *
 * For ipa_list*.html pages (IPA database view):
 *   - initIPAListPage()  : Full page initialization (DataTable + TTS + Dark mode)
 *   - initIPATable()     : DataTable initialization only
 *
 * For index.html pages (Translation UI):
 *   - initIPAIndexPage() : Full page initialization (TTS + Dark mode + Responsive textarea)
 *   - initDarkMode()     : Dark mode toggle only
 *   - generateLanguageButtons() : Language navigation buttons
 *   - initLanguageButtons()     : Helper wrapper for generateLanguageButtons
 *   - initResponsiveTextareaRows() : Set rows + re-check on resize
 *
 */

import { loadIPADatabase, normalizeIPAData, isElementChecked, setElementValue, setElementValueAnimated } from './utils.js';
export { processTextCharBased, processTextLongestMatch } from './ipa.js';
import { createSpeakButton, preloadVoiceSupport, hasVoiceSupport, initSpeakButton } from './tts.js';

// ============================================================
// FOR IPA_LIST PAGES - DataTable Initialization
// ============================================================

/**
 * Initialize IPA DataTable with optional TTS speak buttons
 * FOR: ipa_list*.html pages only
 * Replaces ~50 lines of inline DataTable code in ipa_list*.html files
 *
 * @param {Object} options - Configuration:
 *   @param {string} options.tableId - DataTable element ID (default: 'DataTable')
 *   @param {string} options.jsonPath - Path to IPA JSON data file
 *   @param {string} options.languageCode - Language code for TTS (e.g., 'zh-HK', 'en-US')
 *   @param {boolean} options.enableSpeakButtons - Enable TTS buttons in table (default: true)
 *   @param {boolean} options.paging - Enable pagination (default: true)
 *   @param {number} options.pageLength - Default page size (default: 10)
 *
 * @returns {Promise} Resolves when table is initialized
 */
export function initIPATable(options) {
  const {
    tableId = 'DataTable',
    jsonPath,
    languageCode = null,
    enableSpeakButtons = true,
    paging = true,
    pageLength = 10,
  } = options;

  return new Promise((resolve, reject) => {
    $.get(jsonPath, function(data) {
      // Normalize data: flatten JSON into array with word/ipa fields
      const ipaDB = normalizeIPAData(data);
      const tableData = Object.entries(ipaDB).map(([entry, ipa], index) => {
        const row = [index + 1, entry, ipa];
        row.word = entry;
        row.ipa = ipa;
        return row;
      });

      // Initialize jQuery DataTable with consistent options
      const $table = $(`#${tableId}`);
      $table.DataTable({
        data: tableData,
        paging,
        pageLength,
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        deferRender: true,
        ordering: true,
        searching: true,
        info: true,
        responsive: true,
        language: {
          emptyTable: 'No data available'
        },
        columnDefs: [
          { orderable: true, targets: [0] },
          {
            orderable: true,
            targets: [1],
            createdCell: function(td, cellData, rowData) {
              if (enableSpeakButtons && languageCode) {
                const btn = createSpeakButton(rowData.word, languageCode);
                if (btn) $(td).prepend(btn);
              }
            }
          },
          { orderable: true, targets: [2] }
        ],
        initComplete: function() {
          resolve();
        }
      });
    }).fail(function(err) {
      reject(new Error(`Failed to load IPA data: ${err.statusText}`));
    });
  });
}

// ============================================
// Full Page Initialization (ipa_list pages)
// ============================================

/**
 * Initialize a standard IPA page with all common features
 * FOR: ipa_list*.html pages only (IPA database view)
 * Single function replaces ~70 lines of inline JavaScript in ipa_list*.html files
 *
 * @param {Object} options - Page configuration:
 *   @param {string} options.language - Language code for TTS (e.g., 'zh-HK', 'en-US')
 *   @param {string} options.tableJsonPath - Path to IPA JSON data for DataTable
 *   @param {string} options.tableId - DataTable element ID (default: 'DataTable')
 *   @param {boolean} options.enableTTS - Enable TTS speak buttons (default: true)
 *   @param {boolean} options.enableLanguageButtons - Show language navigation (default: true)
 *   @param {boolean} options.paging - Enable pagination (default: true)
 *   @param {number} options.pageLength - Default page size (default: 10)
 *
 * @returns {Promise} Resolves when page is fully initialized
 */
export async function initIPAListPage(options = {}) {
  const {
    language = null,
    tableJsonPath = null,
    tableId = 'DataTable',
    enableTTS = true,
    enableLanguageButtons = true,
    paging = true,
    pageLength = 10
  } = options;

  // Initialize dark mode (uses existing initDarkMode from ipa-core.js)
  initDarkMode('dark-mode-toggle');

  // Initialize language navigation if enabled
  if (enableLanguageButtons) {
    initLanguageButtons({
      containerId: 'lang-buttons-container',
      configPath: '../config/languages.json'
    });
  }

  // Preload TTS voices if enabled
  if (enableTTS && language) {
    await preloadVoiceSupport(language);
  }

  // Initialize DataTable if json path provided
  if (tableJsonPath) {
    await initIPATable({
      tableId,
      jsonPath: tableJsonPath,
      languageCode: enableTTS ? language : null,
      enableSpeakButtons: enableTTS,
      paging,
      pageLength
    });
  }
}

// ============================================
// Full Page Initialization (index pages)
// ============================================

/**
 * Initialize a standard IPA translation page with all common features
 * FOR: index.html pages only (translation UI)
 *
 * KISS Design: Simple, direct implementation with sensible defaults.
 * Supports configurable database loading, processing algorithms, and output formatters.
 *
 * @param {Object} options - Page configuration:
 *   REQUIRED:
 *   @param {string} options.databasePath - Path to IPA JSON (supports '${variant}' pattern for dialects)
 *   @param {Function} options.process - Processing function (processTextCharBased / processTextLongestMatch)
 *
 *   OPTIONAL - DOM Element IDs (defaults match standard naming convention):
 *   @param {string} options.inputId - Input textarea ID (default: 'cWords_tBox')
 *   @param {string} options.outputId - Output textarea ID (default: 'IPA_tBox')
 *   @param {string} options.withWordsId - "With Words" checkbox ID (default: 'wf_c_words')
 *   @param {string} options.allowWordSearchId - "Allow Words Search" checkbox ID (default: 'allow_words_search')
 *   @param {string} options.variantRadioSelector - Variant radio selector (default: 'input[name="inlineRadioOptions"]')
 *   @param {string} options.formatRadioSelector - Format radio selector (optional)
 *   @param {string} options.darkModeToggleId - Dark mode toggle ID (default: 'dark-mode-toggle')
 *   @param {string} options.langButtonsContainerId - Language buttons container ID (default: 'lang-buttons-container')
 *   @param {string} options.speakButtonId - TTS button ID (default: 'speak-btn')
 *
 *   OPTIONAL - Processing behavior:
 *   @param {Function} options.outputFormatter - Optional output formatter function
 *   @param {number} options.maxWordLength - Max word length for char-based processing (default: 6)
 *   @param {number} options.maxPhraseLength - Max phrase length for longest-match (default: 5)
 *   @param {string} options.withWordsCheckboxId - Auto-handle "with words" checkbox (shortcut for withWordsId + wrapper)
 *   @param {string} options.ttsLanguage - TTS language code (shortcut for speakButtonOptions.language)
 *
 *   OPTIONAL - UI customization:
 *   @param {boolean} options.enableLanguageButtons - Show language navigation (default: true)
 *   @param {boolean} options.enableResponsiveTextarea - Enable responsive textarea (default: true)
 *   @param {boolean} options.enableSpeakButton - Enable TTS speak button (default: true)
 *   @param {number} options.mobileRows - Mobile textarea rows (default: 5)
 *   @param {number} options.desktopRows - Desktop textarea rows (default: 10)
 *   @param {Object} options.formatMapping - Format radio to formatter mapping (optional)
 *   @param {Function} options.getLanguage - Function returning TTS language code (for variant-specific TTS)
 *   @param {Object} options.speakButtonOptions - TTS button options: { language } (deprecated, use ttsLanguage)
 *
 * @returns {Object} Public API: { translate, destroy }
 */
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
  } = options;


  // Validate required options
  if (!databasePath) throw new Error('initIPAIndexPage: "databasePath" is required');
  if (!process) throw new Error('initIPAIndexPage: "process" is required');

  // State
  let IPA_DB = {};
  let currentFormat = null;
  let debounceTimer = null;
  let dbGeneration = 0 // bump on database reload to detect stale translates

  // Get variant from radio buttons
  const getVariant = () => {
    if (!variantRadioSelector) return null;
    const radio = document.querySelector(`${variantRadioSelector}:checked`);
    return radio ? radio.id : null;
  };

  // Get format from radio buttons
  const getFormat = () => {
    if (!formatRadioSelector) return null;
    const radio = document.querySelector(`${formatRadioSelector}:checked`);
    return radio ? radio.id : null;
  };

  // Build database path (supports variant pattern like '../json/en_${variant}.json')
  const getDatabasePath = () => {
    if (databasePath.includes('${variant}')) {
      const variant = getVariant();
      // Apply variant mapping if provided
      const mappedVariant = options.variantMapping && variant ? options.variantMapping[variant] : variant;
      return databasePath.replace('${variant}', mappedVariant || 'default');
    }
    return databasePath;
  };

  // Get output formatter
  const getFormatter = () => {
    if (formatMapping && currentFormat && formatMapping[currentFormat]) {
      return formatMapping[currentFormat];
    }
    return outputFormatter;
  };

  // Core translation function
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
    const gen = dbGeneration; // capture to detect stale results

    setTimeout(() => {
      if (gen !== dbGeneration) return; // stale, skip
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

      // Show game button after successful translation
      if (enableGameButton) {
        const gameBtn = document.getElementById('game-btn');
        if (gameBtn) gameBtn.style.display = 'inline-flex';
      }
    }, 10);
  };

  // Load database
  const loadDatabase = () => {
    dbGeneration++; // bump so in-flight translates become stale
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

  // Debounced translate helper
  const debouncedTranslate = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(translate, 50);
  };

  // Setup event listeners
  const setupEventListeners = () => {
    // Input handler with debounce + select all on focus
    const inputEl = document.getElementById(inputId);
    if (inputEl) {
      inputEl.addEventListener('input', debouncedTranslate);
      inputEl.addEventListener('focus', function () { this.select(); });
    }

    // Variant radio handlers
    if (variantRadioSelector) {
      document.querySelectorAll(variantRadioSelector).forEach(el => {
        el.addEventListener('change', () => {
          loadDatabase();
        });
      });
    }

    // Format radio handlers
    if (formatRadioSelector) {
      document.querySelectorAll(formatRadioSelector).forEach(el => {
        el.addEventListener('change', () => {
          currentFormat = getFormat();
          translate();
        });
      });
    }

    // Checkbox handlers
    if (withWordsId) {
      const withWordsEl = document.getElementById(withWordsId);
      if (withWordsEl) withWordsEl.addEventListener('change', translate);
    }

    if (allowWordSearchId) {
      const allowWordSearchEl = document.getElementById(allowWordSearchId);
      if (allowWordSearchEl) allowWordSearchEl.addEventListener('change', translate);
    }
  };

  // Initialize UI components
  initDarkMode(darkModeToggleId);

  if (enableLanguageButtons) {
    initLanguageButtons({ containerId: langButtonsContainerId, configPath: '../config/languages.json' });
  }

  if (enableResponsiveTextarea) {
    initResponsiveTextareaRows({ mobileRows, desktopRows });
  }

  // Initialize TTS speak button if enabled
  if (enableSpeakButton) {
    initSpeakButton({
      buttonId: speakButtonId,
      inputId: inputId,
      getLanguage: getLanguage || (ttsLanguage ? () => ttsLanguage : () => null)
    });
  }

  // Initialize game button if enabled
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
        gameBtn.innerHTML = `<svg class="icon" viewBox="0 0 512 512" fill="currentColor">
          <path d="M511.27,331.566L511.27,331.566c0-0.009,0-0.018,0-0.026c-0.008-0.052,0-0.087-0.008-0.14h-0.009
           c-6.682-88.65-27.159-154.403-55.948-198.846c-14.412-22.221-30.968-39.115-49.041-50.507
           c-18.048-11.401-37.649-17.198-57.388-17.18c-14.551-0.009-26.985,2.629-37.527,6.611c-15.836,5.97-27.358,14.795-36.364,21.319
           c-4.495,3.28-8.373,5.961-11.549,7.592c-3.211,1.658-5.475,2.239-7.436,2.239c-1.328-0.009-2.725-0.251-4.521-0.92
           c-3.115-1.137-7.288-3.732-12.278-7.332c-7.531-5.354-16.885-12.764-29.223-18.846c-12.339-6.092-27.766-10.69-46.855-10.664
           c-19.739-0.018-39.34,5.787-57.388,17.18c-27.115,17.119-50.794,46.481-69.008,87.887C18.542,211.332,5.743,264.92,0.746,331.401
           H0.738c-0.009,0.052,0,0.096-0.009,0.14c0,0.008,0,0.017,0,0.026l0,0C0.243,336.981,0,342.247,0,347.358
           c-0.009,25.058,5.77,46.455,16.651,63.141c10.846,16.694,26.863,28.347,45.614,33.822c6.43,1.892,13.068,2.811,19.757,2.811
           c19.445-0.026,39.046-7.618,57.692-20.764c18.681-13.189,36.598-32.052,52.91-55.731c7.845-11.427,18.5-24.798,29.987-34.854
           c5.736-5.032,11.662-9.214,17.362-12.026c5.71-2.82,11.09-4.244,16.027-4.235c4.936-0.009,10.317,1.414,16.026,4.235
           c8.555,4.199,17.588,11.558,25.787,20.112c8.226,8.538,15.67,18.196,21.562,26.76c16.312,23.688,34.23,42.55,52.902,55.739
           c18.655,13.146,38.255,20.738,57.7,20.764c6.69,0,13.328-0.92,19.749-2.811c18.759-5.475,34.776-17.128,45.614-33.822
           C506.221,393.813,512,372.416,512,347.358C512,342.256,511.757,336.981,511.27,331.566z M476.737,398.36
           c-8.104,12.356-19.236,20.469-33.284,24.651c-4.33,1.275-8.807,1.9-13.475,1.908c-13.484,0.026-28.902-5.414-44.894-16.703
           c-15.974-11.254-32.312-28.225-47.418-50.177c-8.564-12.417-20.044-27.012-33.64-38.95c-6.812-5.97-14.169-11.297-22.16-15.245
           c-7.975-3.94-16.677-6.534-25.866-6.534c-9.189,0-17.892,2.594-25.866,6.534c-11.974,5.943-22.577,14.906-31.957,24.616
           c-9.353,9.726-17.432,20.268-23.843,29.579c-15.106,21.952-31.454,38.923-47.419,50.177
           c-15.991,11.288-31.418,16.729-44.894,16.703c-4.677-0.009-9.145-0.633-13.484-1.908c-14.04-4.182-25.172-12.295-33.284-24.651
           c-8.06-12.364-13.04-29.293-13.04-51.002c0-4.451,0.208-9.111,0.65-13.961v-0.052l0.009-0.113
           c6.429-86.17,26.446-148.582,52.451-188.59c12.989-20.026,27.41-34.447,42.256-43.801c14.872-9.353,30.126-13.744,45.544-13.761
           c11.896,0.009,21.424,2.091,29.675,5.189c12.356,4.65,21.883,11.756,31.158,18.507c4.652,3.367,9.233,6.655,14.378,9.336
           c5.111,2.655,11.028,4.729,17.666,4.729c4.399,0,8.556-0.928,12.286-2.325c6.56-2.482,12-6.213,17.422-10.065
           c8.113-5.831,16.208-12.14,26.091-16.981c9.883-4.833,21.449-8.364,37.076-8.39c15.418,0.017,30.672,4.408,45.545,13.761
           c22.264,14.005,43.6,39.532,60.511,78.03c16.92,38.464,29.354,89.735,34.195,154.36v0.052l0.009,0.113
           c0.434,4.842,0.652,9.502,0.652,13.961C489.778,369.067,484.806,386.004,476.737,398.36z"/>
          <polygon points="161.232,178.126 122.29,178.126 122.29,213.631 86.785,213.631 86.785,252.573 122.29,252.573
           122.29,288.079 161.232,288.079 161.232,252.573 196.737,252.573 196.737,213.631 161.232,213.631"/>
          <path d="M368.659,167.002c-11.331,0-20.52,9.189-20.52,20.538c0,11.341,9.189,20.538,20.52,20.538
           c11.35,0,20.538-9.197,20.538-20.538C389.197,176.191,380.008,167.002,368.659,167.002z"/>
          <path d="M368.659,266.247c-11.331,0-20.52,9.189-20.52,20.53c0,11.349,9.189,20.538,20.52,20.538
           c11.35,0,20.538-9.189,20.538-20.538C389.197,275.436,380.008,266.247,368.659,266.247z"/>
          <path d="M418.282,216.633c-11.341,0-20.538,9.189-20.538,20.53c0,11.349,9.197,20.529,20.538,20.529
           c11.35,0,20.538-9.18,20.538-20.529C438.82,225.822,429.631,216.633,418.282,216.633z"/>
          <path d="M319.054,216.633c-11.349,0-20.538,9.189-20.538,20.53c0,11.349,9.189,20.529,20.538,20.529
           c11.341,0,20.539-9.18,20.539-20.529C339.592,225.822,330.394,216.633,319.054,216.633z"/>
        </svg>`;
        outputLabel.appendChild(gameBtn);

        gameBtn.addEventListener('click', () => {
          const input = document.getElementById(inputId)?.value || '';
          if (!input.trim()) return;

          const effectiveWithWordsId = withWordsCheckboxId || withWordsId;
          const withWords = effectiveWithWordsId ? isElementChecked(effectiveWithWordsId) : false;
          const allowWordSearch = allowWordSearchId ? isElementChecked(allowWordSearchId) : false;

          const pairs = process({
            input,
            lookupTable: IPA_DB,
            withWords,
            allowWordSearch,
            maxWordLength,
            maxPhraseLength,
            pairsOnly: true
          });

          if (pairs.length < 2) {
            alert('Need at least 2 matched words to start a game.');
            return;
          }

          const rawIpa = pairs.map(([w, ipa]) => [w, ipa]);

          // Also get formatted pairs if formatter exists
          // Formatters expect /ipa/ wrapped text, so wrap raw IPA before formatting
          const formatter = getFormatter();
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

          localStorage.setItem('ipa_game_data', JSON.stringify({
            text: input,
            pairs: rawIpa,
            formattedPairs: formattedIpa,
            language: gameLabel || '',
            format: currentFormat || ''
          }));

          window.location.href = '../game/index.html';
        });
      }
    }
  }

  // Setup event listeners and load database
  setupEventListeners();
  loadDatabase();

  // Return public API
  return {
    translate,
    destroy: () => { clearTimeout(debounceTimer); }
  };
}

// ============================================
// SHARED UTILITIES (Used by index.html and ipa_list.html)
// ============================================

// --------------------------------------------
// Dark Mode
// --------------------------------------------

/**
 * Initialize dark mode toggle functionality
 * @param {string} toggleId - Toggle button element ID
 */
export function initDarkMode(toggleId) {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;

  const iconImg = toggle.querySelector(".icon");
  const savedTheme = localStorage.getItem("theme");

  // Set initial state
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (iconImg) iconImg.src = "../img/dark-mode.svg";
  } else {
    if (iconImg) iconImg.src = "../img/light-mode.svg";
  }

  // Add click handler
  toggle.addEventListener("click", function () {
    toggle.classList.add("btn-theme-transition");
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    if (iconImg) {
      iconImg.src = isDark ? "../img/dark-mode.svg" : "../img/light-mode.svg";
    }

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// ============================================
// Language Navigation
// ============================================

/**
 * Generate and insert language buttons for "Other Languages" section
 * Reads from config/languages.json and dynamically builds the list
 * USED BY: Both index.html and ipa_list*.html pages
 *
 * @param {object} options - Options:
 *   @param {string} options.containerId - ID of container element (default: "lang-buttons-container")
 *   @param {string} options.configPath - Path to languages.json config file (default: "../config/languages.json")
 *   @param {string} options.wrapperTag - HTML tag to wrap each item (default: "li")
 */
export async function generateLanguageButtons(options) {
  const {
    containerId = "lang-buttons-container",
    configPath = "../config/languages.json",
    wrapperTag = "li"
  } = options;

  try {
    const response = await fetch(configPath);
    if (!response.ok) {
      throw new Error(`Failed to load language config: ${response.status}`);
    }

    const langConfig = await response.json();
    const container = document.getElementById(containerId);

    if (!container) {
      throw new Error(`Container with ID "${containerId}" not found`);
    }

    const languages = langConfig.languages || [];
    let html = "";

    languages.forEach(lang => {
      const name = lang.name || lang.nativeName || lang.code;
      const href = lang.indexPath || "#";
      const isCurrent = lang.isActive === true;
      const style = isCurrent ? 'style="font-weight: bold; color: var(--accent-color);"' : "";

      html += `<${wrapperTag} ${style}><a href="${href}">${name}</a></${wrapperTag}>`;
    });

    container.innerHTML = html;
  } catch (e) {
    console.error(e.message);
  }
}

/**
 * Initialize language buttons on page load
 * Helper function to call generateLanguageButtons when DOM is ready
 */
export function initLanguageButtons(options) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      generateLanguageButtons(options);
    });
  } else {
    generateLanguageButtons(options);
  }
}

// ============================================
// Responsive Textarea (Shared Utility)
// ============================================

/**
 * Set textarea rows based on screen width and re-check on resize
 */
export function initResponsiveTextareaRows(options = {}) {
  const isMobile = window.innerWidth <= 768;
  const mobileRows = options.mobileRows || 5;
  const desktopRows = options.desktopRows || 10;
  const targets = options.targets || null;

  const getAllTargets = () => targets
    ? targets.map(id => document.getElementById(id)).filter(el => el)
    : document.querySelectorAll('textarea[id$="_tBox"]');

  // Set initial rows
  getAllTargets().forEach(textarea => {
    textarea.rows = isMobile ? mobileRows : desktopRows;
  });

  // Re-check on window resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const nowIsMobile = window.innerWidth <= 768;
      getAllTargets().forEach(textarea => {
        textarea.rows = nowIsMobile ? mobileRows : desktopRows;
      });
    }, 250);
  });
}
