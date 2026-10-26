/**
 * Agent interface — IPA Translator
 * Loaded by agent.html via <script type="module">.
 * Static-hosted, client-side IPA via URL query parameters.
 * Designed for browsers AND browser-driven agents / CLI tools.
 */

import { LANGUAGES, resolveDatabasePath } from './agent-lang-config.js';
import { normalizeIPAData } from './utils.js';
import { processTextCharBased, processTextLongestMatch, processKhmerText, processKorean } from './ipa.js';
import { formatAsJSON, formatAsCSV, stripHTML } from './format-display.js';

const app = document.getElementById('app');
const params = new URLSearchParams(window.location.search);
const hasAnyParam = [...params.keys()].length > 0;
const helpRequested = params.has('help') || params.get('docs') === '1';

const languageRaw = params.get('language');
const input = params.get('input');
const displayFormat = (params.get('displayFormat') || 'normal').toLowerCase();

// Docs only when the page is opened with no query, or ?help / ?docs=1.
// Partial params (e.g. language without input) return a stable Error: line
// so agents do not mistake documentation for IPA output.
if (!hasAnyParam || helpRequested) {
  showDocumentation();
} else if (!languageRaw || input === null) {
  const missing = [];
  if (!languageRaw) missing.push('language');
  if (input === null) missing.push('input');
  showError(`Missing required parameter(s): ${missing.join(', ')}. Open agent.html with no params (or ?help=1) for docs.`);
} else {
  setOutput('Loading...', 'loading');
  await runTranslation(languageRaw, input, params.get('format'), params.get('variant'), displayFormat);
}

async function runTranslation(langCodeRaw, inputText, formatKey, variantKey, displayFormat) {
  const langCode = resolveLanguageCode(langCodeRaw);
  if (!langCode) {
    return showError(`Unknown language "${langCodeRaw}". Valid languages: ${Object.keys(LANGUAGES).join(', ')}`);
  }
  const lang = LANGUAGES[langCode];

  const validDisplayFormats = ['normal', 'ipa', 'json', 'csv'];
  if (!validDisplayFormats.includes(displayFormat)) {
    return showError(`Invalid displayFormat "${displayFormat}". Valid values: ${validDisplayFormats.join(', ')}`);
  }

  if (formatKey !== null) {
    if (!lang.formats) {
      return showError(`Language "${langCode}" does not support output formats.`);
    }
    if (!(formatKey in lang.formats)) {
      return showError(`Unknown format "${formatKey}" for ${langCode}. Valid formats: ${Object.keys(lang.formats).join(', ')}`);
    }
  }

  if (variantKey !== null) {
    if (!lang.variants) {
      return showError(`Language "${langCode}" does not have variants.`);
    }
    if (!(variantKey in lang.variants)) {
      return showError(`Unknown variant "${variantKey}" for ${langCode}. Valid variants: ${Object.keys(lang.variants).join(', ')}`);
    }
  }

  if (inputText.length > 10000) {
    return showError('Input too long (max 10,000 characters)');
  }

  if (!inputText.trim()) {
    setOutput('', 'ready');
    return;
  }

  const dbPath = resolveDatabasePath(langCode, variantKey);
  if (!dbPath) {
    return showError(`Failed to resolve database path for ${langCode}.`);
  }

  let jsonData;
  try {
    const resp = await fetch(dbPath);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    jsonData = await resp.json();
  } catch (e) {
    return showError(`Failed to load IPA database for ${langCode}: ${e.message}`);
  }

  const lookupTable = normalizeIPAData(jsonData);

  const procOpts = {
    input: inputText,
    lookupTable,
    allowWordSearch: lang.allowWordSearch || false,
  };
  if (lang.maxWordLength) procOpts.maxWordLength = lang.maxWordLength;

  const processors = {
    charBased: processTextCharBased,
    longestMatch: processTextLongestMatch,
    khmer: processKhmerText,
    korean: processKorean,
  };
  const processor = processors[lang.processor];
  if (!processor) {
    return showError(`Unknown processor "${lang.processor}" for ${langCode}.`);
  }

  let formatter = null;
  if (formatKey && lang.formats && lang.formats[formatKey]) {
    const formatRef = lang.formats[formatKey];
    if (formatRef) {
      const [moduleName, exportName] = formatRef.split(':');
      try {
        const mod = await import(`./format/${moduleName}`);
        formatter = mod[exportName];
      } catch (e) {
        return showError(`Failed to load formatter: ${e.message}`);
      }
    }
    // null formatRef (e.g. IPA_org) means identity / raw IPA — intentional.
  }

  let output;
  if (displayFormat === 'json' || displayFormat === 'csv') {
    const { pairs } = processor({ ...procOpts, pairsOnly: true });
    output = displayFormat === 'json'
      ? formatAsJSON(pairs, formatter)
      : formatAsCSV(pairs, formatter);
  } else {
    procOpts.withWords = displayFormat === 'normal';
    let result = processor(procOpts);
    if (formatter) result = formatter(result);
    output = stripHTML(result);
  }
  setOutput(output, 'ready');
}

function resolveLanguageCode(code) {
  if (!code) return null;
  if (LANGUAGES[code]) return code;
  const lower = code.toLowerCase();
  if (LANGUAGES[lower]) return lower;
  const match = Object.keys(LANGUAGES).find((k) => k.toLowerCase() === lower);
  return match || null;
}

function ensureOutputEl() {
  let el = document.getElementById('output');
  if (!el) {
    app.innerHTML = '';
    el = document.createElement('pre');
    el.id = 'output';
    app.appendChild(el);
  }
  return el;
}

function setOutput(text, status) {
  const el = ensureOutputEl();
  el.className = status === 'loading' ? 'loading' : (status === 'error' ? 'error' : '');
  el.dataset.status = status;
  el.textContent = text;
}

function showError(msg) {
  const line = msg.startsWith('Error:') ? msg : `Error: ${msg}`;
  setOutput(line, 'error');
}

function showDocumentation() {
  const langLines = Object.entries(LANGUAGES).map(([code, lang]) => {
    const variants = lang.variants ? Object.keys(lang.variants).join(', ') : '-';
    const formats = lang.formats ? Object.keys(lang.formats).join(', ') : '-';
    return `  ${code}: variants=[${variants}] formats=[${formats}]`;
  }).join('\n');

  const doc = [
    'IPA Translator — Agent Interface',
    'Static-hosted client-side IPA. Humans use the UI pages; agents/CLI drive this page in a JS browser.',
    '',
    'USAGE: agent.html?language=<code>&input=<text>[&format=<fmt>][&variant=<var>][&displayFormat=<fmt>]',
    'DOCS:  agent.html   or   agent.html?help=1',
    '',
    'PARAMETERS:',
    '  language         (required for translate) Language code (case-insensitive)',
    '  input            (required for translate) Text to translate (URL-encode non-ASCII)',
    '  format           Output format key (Jyutping, Pinyin, etc). Omit for raw IPA.',
    '  variant          Language variant. Uses default when omitted.',
    '  displayFormat    normal (text+IPA, default), ipa (IPA only), json, csv',
    '                   Note: ruby layout is UI-only; not available here.',
    '',
    'SUPPORTED LANGUAGES:',
    langLines,
    '',
    'EXAMPLES:',
    '  ?language=german&input=Hallo%20Welt',
    '  ?language=cantonese&format=Jyutping&input=%E4%BD%A0%E5%A5%BD',
    '  ?language=mandarin&variant=hans&format=Pinyin&input=%E4%BD%A0%E5%A5%BD',
    '  ?language=cantonese&input=%E6%AD%A1%E8%BF%8E&displayFormat=ipa',
    '  ?language=cantonese&input=%E6%AD%A1%E8%BF%8E&displayFormat=json',
    '',
    'OUTPUT: Plain text in <pre id="output">.',
    '  Success: data-status="ready" (loading class removed)',
    '  Error:   data-status="error", text starts with "Error:"',
    '  Docs:    no query params (or ?help=1)',
    '',
    'NOTE: Needs a JavaScript browser (agent-browser, Playwright, Puppeteer, or a CLI that drives one).',
    '      Plain curl / HTTP fetch without JS will not run the converter.',
    'See SKILL.md for the agent usage guide.',
  ].join('\n');

  setOutput(doc, 'ready');
}
