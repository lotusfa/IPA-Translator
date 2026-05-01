# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IPA-Translator is a static HTML/JavaScript web application that translates text from various languages to International Phonetic Alphabet (IPA). It supports 24 languages with separate folders for each. No build step or server required — pure ES modules in the browser.

## Architecture

### Directory Structure

```
├── <language>/           # One folder per language (cantonese/, mandarin/, etc.)
│   ├── index.html        # Translation UI page
│   ├── ipa_list*.html    # IPA database reference pages (multiple for variant languages)
│   └── main.js           # Thin wrapper: imports shared modules, calls initIPAIndexPage()
├── game/                 # IPA learning game (vanilla JS SPA, no heavy frameworks)
│   ├── index.html        # Minimal shell (<div id="game-app">)
│   ├── game.js           # Main game logic & state machine (screens: start, quiz, congrats)
│   ├── styles.css        # Game-specific styles (button grid, progress bar, correct/wrong)
│   └── game-types/       # Per-game-type logic (wordToIpa, ipaToWord, syllableFill)
├── js/                   # Shared JavaScript modules (ES modules)
│   ├── format/           # Language-specific formatters
│   │   ├── yue.format.js # Cantonese formatters (Jyutping, Yale, Guangzhou, Academy, Liu)
│   │   ├── zh.format.js  # Mandarin formatters (Pinyin with marks, Zhuyin)
│   │   └── vi.format.js  # Vietnamese formatters (tone formatting, IPA numbers)
│   ├── page/             # Page initialization & shared UI logic
│   │   ├── ipa-index-page.js  # initIPAIndexPage (translation pages)
│   │   ├── ipa-list-page.js   # initIPATable, initIPAListPage (IPA reference pages)
│   │   ├── page-shared.js     # initDarkMode, language nav, responsive textarea
│   │   └── game-entry.js      # createGameButton
│   ├── ipa.js            # Core: processTextCharBased, processTextLongestMatch, processKhmerText
│   ├── ui.js             # Barrel re-export of page/ modules (external-facing entry point)
│   ├── utils.js          # Utilities: loadIPADatabase, normalizeIPAData, DOM helpers
│   ├── tts.js            # TTS: speak(), selectBestVoice(), initSpeakButton, createSpeakButton
│   ├── share.js          # Compress/encode data into shareable URLs, clipboard helpers
│   ├── svg.js            # SVG icon data exported as strings
│   └── syllable-decompose.js  # Breaks IPA into onset/rhyme/tone (imports from format/)
├── json/                 # IPA mapping data (one file per language/variant)
├── config/               # Shared configuration (languages.json → nav buttons)
├── css/                  # Shared stylesheets
├── img/                  # SVG icons (dark/light mode, speak/pause)
├── lib/                  # Third-party libs (jQuery, DataTables)
└── test/                 # Test suites (test/yue/, test/zh/)
```

### Shared Module Design

Language `main.js` files are thin wrappers. The real logic lives in `js/`:

- **`initIPAIndexPage(options)`** (page/ipa-index-page.js) — Full translation page bootstrap. Required: `databasePath`, `process`. Optional: format mapping, variant mapping, TTS, element IDs
- **`initIPAListPage(options)`** (page/ipa-list-page.js) — Full IPA reference page bootstrap. Initializes DataTable + TTS + dark mode + language nav
- **`processTextCharBased(options)`** (ipa.js) — Character-by-character with optional multi-char word matching. Use for CJK languages.
- **`processTextLongestMatch(options)`** (ipa.js) — Greedy longest-phrase matching. Use for space-separated languages (Vietnamese, Arabic).
- **`loadIPADatabase(options)`** (utils.js) — Fetches JSON, normalizes via callback. Uses XMLHttpRequest.
- **`normalizeIPAData(data)`** (utils.js) — Extracts first key from JSON, flattens to `{ word: ipa }` lookup map.

**Import pattern for language main.js files:**
- Import `initIPAIndexPage` from `../js/ui.js` (barrel re-export → page/ipa-index-page.js, also re-exports `processText*` from ipa.js)
- Import formatters directly from `../js/format/[lang].format.js` (e.g., `yue.format.js`, `zh.format.js`) — this avoids loading unused format modules
- Import `processText*` from `../js/ui.js` (re-exported from ipa.js) or directly from `../js/ipa.js`

**Dependency chain:** utils.js ← ipa.js. page/ imports from utils.js, tts.js, share.js, svg.js. ui.js is a thin barrel re-export of page/. No circular deps.

### Data Flow

1. User inputs text → triggers debounced `translate()` in `initIPAIndexPage`
2. `loadIPADatabase()` fetches JSON → `normalizeIPAData()` flattens to lookup map
3. `processTextCharBased()` or `processTextLongestMatch()` converts text to IPA
4. Optional formatter (e.g., `formatYueOutput`) post-processes result
5. `setElementValueAnimated()` displays result with fade-in

### Language Variant Support

Languages with multiple dialects use `${variant}` in `databasePath` + `variantMapping`:

```javascript
initIPAIndexPage({
  databasePath: '../json/en_${variant}.json',
  variantMapping: { IPA_US: 'US', IPA_UK: 'UK' },
  // ...
});
```

### Adding a New Language

1. Create folder (e.g., `italian/`)
2. Create `index.html` — adapt labels, add format radios if needed
3. Create `main.js`:
   ```javascript
   import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';
   initIPAIndexPage({
     databasePath: '../json/it.json',
     process: processTextLongestMatch, // or processTextCharBased for CJK
     ttsLanguage: 'it-IT'
   });
   ```
4. Add JSON file in `json/it.json` (array of `{ char: ipa }` objects under a single key)
5. Add entry in `config/languages.json` for nav button

### Modifying Output Format

Add a formatter function in `js/format/[lang].format.js`, export it, and add to `formatMapping` in the language's `main.js`:

```javascript
formatMapping: {
  IPA_org: formatIPA_org,
  IPA_num: formatIPA_num,
  Pinyin: formatPinyin
}
```

### Game Architecture (`game/`)

The game is a vanilla JS SPA (no heavy frameworks) for IPA learning. Users enter from the translator by clicking a gamepad button near the output textarea.

**Entry flow:**
1. User translates text in any language page → gamepad button appears after first translation
2. Click gamepad → `initIPAIndexPage` re-runs the processor with `pairsOnly: true`, extracts `[[word, ipa], ...]` pairs
3. Saves to `localStorage['ipa_game_data']` and redirects to `game/index.html`
4. Game reads localStorage, presents quiz screens (start → word→IPA / IPA→word → congrats)

**localStorage contract (`ipa_game_data`):**
```json
{
  "text": "原始輸入文字",
  "pairs": [["字", "tsɪ˥"], ["詞", "sʰɐ˨"]],
  "formattedPairs": [["字", "tsi1"], ["詞", "ci4"]],
  "language": "cantonese",
  "format": "Jyutping"
}
```

- `pairs` — Raw IPA from database: `[[word, rawIPA], ...]` (e.g., `"tsɪ˥"`)
- `formattedPairs` — Formatted output: raw IPA wrapped in `/.../`, passed through active formatter, content extracted. e.g., `"/tsɪ˥/" → formatJyutping → "/tsi1/" → "tsi1"`. Same as `pairs` if no formatter active.
- `language` — From `gameLabel` in language main.js (e.g., `"cantonese"`)
- `format` — Currently selected format radio ID (e.g., `"Jyutping"`, `""` if none)

**`pairsOnly` option:** Both `processTextCharBased()` and `processTextLongestMatch()` accept `pairsOnly: true` — returns `[[word, rawIPA], ...]` array instead of a formatted string.

**Adding game support to a language:** Add `gameLabel: 'foldername'` to the language's `main.js` `initIPAIndexPage()` call. The gamepad button is injected automatically by `ui.js`.

**Game design goals (from handwritten notes):**
- No keyboard — on-screen buttons only (vocal game concept)
- Easy mode: simple study quiz (current implementation)
- Hard mode (future): number running race, drag & drop, memory matching
- Game types: IPA→word, word→IPA, phoneme→IPA, phoneme→words (TTS model limitation)

### Key API Reference

**initIPAIndexPage options:**
- `databasePath` (required) — Path to JSON, supports `${variant}` placeholder
- `process` (required) — `processTextCharBased` or `processTextLongestMatch`
- `formatRadioSelector` — CSS selector for format radio buttons
- `formatMapping` — `{ radioId: formatterFn }` map
- `variantRadioSelector` — CSS selector for variant radios (default: `'input[name="inlineRadioOptions"]'`)
- `variantMapping` — `{ radioId: jsonSuffix }` map
- `ttsLanguage` — TTS language code (e.g., `'zh-HK'`)
- `getLanguage` — Function returning TTS language (for variant-dependent TTS)
- `maxWordLength` — Max word match length (default: 6)
- `inputId`, `outputId`, `withWordsId`, `allowWordSearchId` — Custom element IDs
- `gameLabel` — Language folder name for game (enables gamepad button)
- `enableGameButton` — Enable gamepad button (default: `true`)

**initIPAListPage options:**
- `language` — TTS language code
- `tableJsonPath` — Path to JSON for DataTable
- `tableId` — Table element ID (default: `'DataTable'`)
- `enableTTS`, `enableLanguageButtons`, `paging`, `pageLength`

## Development Guidelines

- **KISS**: Keep solutions simple and direct. Avoid over-engineering.
- **ES modules only**: All `js/` files use `export`/`import`. No CommonJS.
- **Language main.js should be thin**: ~10-20 lines calling `initIPAIndexPage()`. Don't add new logic to language files — put shared logic in `js/`.
- **Use subagents for long/multi-step tasks**: Prevents context bloat.
- **Use `/graphify` skill for knowledge graph tasks**.
- **Use `Agent` browser skill when testing websites**.
