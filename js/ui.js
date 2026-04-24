/**
 * Shared UI Initialization for IPA-Translator Pages
 *
 * KISS Principle: One function to initialize all common page elements
 * Replaces ~70 lines of inline JavaScript in ipa_list*.html files
 *
 * Usage:
 *   import { initIPAPage } from '../js/ui.js';
 *   await initIPAPage({ language: 'zh-HK', tableJsonPath: '../json/zh_hk.json' });
 */

import { loadIPADatabase, normalizeIPAData } from './ipa-core.js';
import { createSpeakButton, preloadVoiceSupport, hasVoiceSupport } from './tts.js';

/**
 * Initialize IPA DataTable with optional TTS speak buttons
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

/**
 * Initialize a standard IPA page with all common features
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
export async function initIPAPage(options = {}) {
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
// Dark Mode
// ============================================

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
 *
 * @param {object} options - Options:
 *   @param {string} options.containerId - ID of container element (default: "lang-buttons-container")
 *   @param {string} options.configPath - Path to languages.json config file (default: "../config/languages.json")
 *   @param {string} options.wrapperTag - HTML tag to wrap each item (default: "li")
 *   @param {function} [options.onSuccess] - Callback after successful generation
 *   @param {function} [options.onError] - Callback on error
 */
export function generateLanguageButtons(options) {
  const {
    containerId = "lang-buttons-container",
    configPath = "../config/languages.json",
    wrapperTag = "li",
    onSuccess = null,
    onError = null
  } = options;

  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      try {
        const langConfig = JSON.parse(this.responseText);
        const container = document.getElementById(containerId);

        if (!container) {
          const errorMsg = `Container with ID "${containerId}" not found`;
          console.error(errorMsg);
          if (onError) onError(errorMsg);
          return;
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

        if (onSuccess) onSuccess(languages);
      } catch (e) {
        const errorMsg = "Failed to parse language config: " + e.message;
        console.error(errorMsg);
        if (onError) onError(errorMsg);
      }
    } else if (this.readyState === 4) {
      const errorMsg = "Failed to load language config: " + this.status;
      console.error(errorMsg);
      if (onError) onError(errorMsg);
    }
  };

  xmlhttp.onerror = function () {
    const errorMsg = "Network error loading language config";
    console.error(errorMsg);
    if (onError) onError(errorMsg);
  };

  xmlhttp.open("GET", configPath, true);
  xmlhttp.send();
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
// Responsive Textarea Rows
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
