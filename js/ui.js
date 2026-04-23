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

import { initDarkMode, initLanguageButtons, loadIPADatabase, normalizeIPAData } from './ipa-core.js';
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
