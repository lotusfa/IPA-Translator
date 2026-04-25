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
 *   - setResponsiveTextareaRows() : Mobile-responsive textarea sizing
 *   - initResponsiveTextareaRows() : Initialize with resize listener
 *
 */

import { loadIPADatabase, normalizeIPAData, isElementChecked, setElementValue, setElementValueAnimated } from './core.js';
export { processTextCharBased, processTextLongestMatch } from './ipa-core.js';
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
 *   @param {Object} options.columnTitles - Custom column titles: { word, ipa } (optional)
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
    columnTitles = null
  } = options;

  // Derive column titles from languageCode if not provided
  const getLanguageColumnTitles = (langCode) => {
    if (!langCode) return { word: 'Word', ipa: 'IPA' };

    const [lang, region] = langCode.toLowerCase().replace('-', '_').split('_');

    // English variants
    if (lang === 'en') {
      return { word: 'English Word', ipa: 'IPA' };
    }

    // Cantonese (zh-HK)
    if (lang === 'zh' && region === 'hk') {
      return { word: '中文字 (Chinese)', ipa: '標音 (IPA)' };
    }

    // Mandarin variants (zh-CN, zh-TW)
    if (lang === 'zh') {
      return { word: '中文 (Chinese)', ipa: '標音 (IPA)' };
    }

    // Default fallback for other languages
    return { word: `${lang.charAt(0).toUpperCase() + lang.slice(1)} Word`, ipa: 'IPA' };
  };

  const titles = columnTitles || getLanguageColumnTitles(languageCode);

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
        columns: [
          { title: '#' },
          { title: titles.word },
          { title: titles.ipa }
        ],
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
    ttsLanguage = null
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
 * Set textarea rows based on screen width (mobile responsive)
 * Call this on page load to adjust rows for mobile devices
 */
export function setResponsiveTextareaRows(options = {}) {
  const isMobile = window.innerWidth <= 768;
  const mobileRows = options.mobileRows || 5;
  const desktopRows = options.desktopRows || 10;
  const targets = options.targets || null;

  const textareas = targets
    ? targets.map(id => document.getElementById(id)).filter(el => el)
    : document.querySelectorAll('textarea[id$="_tBox"]');

  textareas.forEach(textarea => {
    textarea.rows = isMobile ? mobileRows : desktopRows;
  });
}

/**
 * Initialize responsive textarea rows on DOM ready
 * Automatically calls setResponsiveTextareaRows and re-checks on resize
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
