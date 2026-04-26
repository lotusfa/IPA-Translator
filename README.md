# IPA Translator

A web-based tool for translating text from various languages into International Phonetic Alphabet (IPA) notation.

## 🌍 Supported Languages

| Language | Translator | IPA Reference |
|----------|-----------|---------------|
| Arabic (العربية) | [Translator](https://toolbox.lotusfa.com/ipa/arabic/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/arabic/ipa_list.html) |
| Cantonese (廣東話) | [Translator](https://toolbox.lotusfa.com/ipa/cantonese/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/cantonese/ipa_list.html) |
| English | [Translator](https://toolbox.lotusfa.com/ipa/english/index.html) | [US](https://toolbox.lotusfa.com/ipa/english/ipa_list_us.html) / [UK](https://toolbox.lotusfa.com/ipa/english/ipa_list_uk.html) |
| Esperanto | [Translator](https://toolbox.lotusfa.com/ipa/esperanto/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/esperanto/ipa_list.html) |
| Finnish | [Translator](https://toolbox.lotusfa.com/ipa/finnish/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/finnish/ipa_list.html) |
| French | [Translator](https://toolbox.lotusfa.com/ipa/french/index.html) | [France](https://toolbox.lotusfa.com/ipa/french/ipa_list_fr.html) / [Quebec](https://toolbox.lotusfa.com/ipa/french/ipa_list_qc.html) |
| German | [Translator](https://toolbox.lotusfa.com/ipa/german/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/german/ipa_list.html) |
| Jamaican Creole | [Translator](https://toolbox.lotusfa.com/ipa/jamaican/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/jamaican/ipa_list.html) |
| Japanese (日本語) | [Translator](https://toolbox.lotusfa.com/ipa/japanese/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/japanese/ipa_list.html) |
| Malay (Bahasa Melayu) | [Translator](https://toolbox.lotusfa.com/ipa/malay/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/malay/ipa_list.html) |
| Mandarin (Simplified 简体中文) | [Translator](https://toolbox.lotusfa.com/ipa/mandarin/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/mandarin/ipa_list_zh_hans.html) |
| Mandarin (Traditional 繁體中文) | [Translator](https://toolbox.lotusfa.com/ipa/mandarin/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/mandarin/ipa_list_zh_hant.html) |
| Norwegian (Norsk) | [Translator](https://toolbox.lotusfa.com/ipa/norwegian/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/norwegian/ipa_list.html) |
| Odia (ଓଡ଼ିଆ) | [Translator](https://toolbox.lotusfa.com/ipa/odia/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/odia/ipa_list.html) |
| Persian (فارسی) | [Translator](https://toolbox.lotusfa.com/ipa/persian/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/persian/ipa_list.html) |
| Spanish (Español) | [Translator](https://toolbox.lotusfa.com/ipa/spanish/index.html) | [Spain](https://toolbox.lotusfa.com/ipa/spanish/ipa_list_es.html) / [Mexico](https://toolbox.lotusfa.com/ipa/spanish/ipa_list_mx.html) |
| Swahili (Kiswahili) | [Translator](https://toolbox.lotusfa.com/ipa/swahili/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/swahili/ipa_list.html) |
| Swedish (Svenska) | [Translator](https://toolbox.lotusfa.com/ipa/swedish/index.html) | [IPA List](https://toolbox.lotusfa.com/ipa/swedish/ipa_list.html) |
| Vietnamese (Tiếng Việt) | [Translator](https://toolbox.lotusfa.com/ipa/vietnamese/index.html) | [Central](https://toolbox.lotusfa.com/ipa/vietnamese/ipa_list_c.html) / [Northern](https://toolbox.lotusfa.com/ipa/vietnamese/ipa_list_n.html) / [Southern](https://toolbox.lotusfa.com/ipa/vietnamese/ipa_list_s.html) |

## 🚀 Getting Started

Visit the live website: [https://toolbox.lotusfa.com/ipa/](https://toolbox.lotusfa.com/ipa/)

**Legacy Version**: [https://toolbox.lotusfa.com/legacy/ipa/cantonese/index.html](https://toolbox.lotusfa.com/legacy/ipa/cantonese/index.html)

## 📚 Features

- **Text-to-IPA Conversion**: Enter text in supported languages and get instant IPA transcription
- **Multiple Variants**: Support for regional dialects and pronunciation variations (e.g., US/UK English, France/Quebec French)
- **Multiple Output Formats**: Cantonese supports Jyutping, Yale, Guangzhou, and other romanizations. Mandarin supports Pinyin and Zhuyin
- **Text-to-Speech**: Speak button reads input aloud using Web Speech API with curated voice selection
- **Dark Mode**: Toggle between light and dark themes (persisted in localStorage)
- **"With Words" Mode**: Shows original text alongside IPA for learning
- **Word Matching**: Optional multi-character word matching for more accurate translations
- **IPA Database Browser**: Sortable, searchable DataTables view of IPA reference data for each language
- **Language Navigation**: Configurable language links powered by `config/languages.json`

## 🏗️ Architecture

A static HTML/JavaScript application — no build step or server required.

### Directory Structure

```
├── <language>/           # One folder per language (cantonese/, mandarin/, english/, etc.)
│   ├── index.html        # Translation UI page
│   ├── ipa_list*.html    # IPA database reference pages (may be multiple for variants)
│   └── main.js           # Language-specific config (imports shared modules from js/)
├── js/                   # Shared JavaScript modules (ES modules)
│   ├── ipa.js            # Core: text processing + re-exports all formatters/UI/TTS/utils
│   ├── ui.js             # UI: initIPAIndexPage, initIPAListPage, dark mode, language buttons
│   ├── utils.js          # Utilities: loadIPADatabase, normalizeIPAData, DOM helpers
│   ├── tts.js            # Text-to-speech: speak(), voice selection, initSpeakButton
│   ├── yue.format.js     # Cantonese formatters (Jyutping, Yale, Guangzhou, etc.)
│   ├── zh.format.js      # Mandarin formatters (Pinyin, Zhuyin)
│   └── vi.format.js      # Vietnamese formatters (tone formatting)
├── json/                 # IPA mapping data (one file per language/variant)
├── config/               # Shared configuration
│   ├── languages.json    # Language nav buttons (used by generateLanguageButtons)
│   └── tts-languages.json
├── css/                  # Shared stylesheets (styles.css)
├── img/                  # Icons (dark-mode.svg, light-mode.svg, speak/pause icons)
├── lib/                  # Third-party libraries (jQuery, DataTables)
└── test/                 # Test suites (test/yue/, test/zh/)
```

### Shared Module Design

Language-specific `main.js` files are now thin wrappers that call shared initialization functions:

- **`initIPAIndexPage()`** (ui.js) — Bootstraps a translation page: loads database, sets up event listeners, dark mode, TTS, responsive textarea
- **`initIPAListPage()`** (ui.js) — Bootstraps an IPA reference page: initializes DataTable with TTS buttons
- **`processTextCharBased()`** (ipa.js) — Character-by-character lookup with optional multi-char word matching (CJK languages)
- **`processTextLongestMatch()`** (ipa.js) — Greedy longest-phrase matching (Vietnamese, Arabic, and other space-separated languages)

Each language's `main.js` simply imports these and passes a config object:

```javascript
// Example: japanese/main.js
import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';

initIPAIndexPage({
  databasePath: '../json/ja.json',
  process: processTextCharBased,
  ttsLanguage: 'ja-JP'
});
```

Languages with multiple variants (English, French, Mandarin, Spanish, Vietnamese) use `${variant}` in `databasePath` plus a `variantMapping`.

### Data Flow

1. User inputs text in textarea (`cWords_tBox`)
2. `loadIPADatabase()` fetches JSON from `../json/[lang].json`
3. `normalizeIPAData()` flattens JSON into a character→IPA lookup map
4. `processTextCharBased()` or `processTextLongestMatch()` converts text to IPA
5. Language-specific formatter (e.g., `formatYueOutput`, `formatMandarinOutput`) post-processes the result
6. Result displayed in output textarea (`IPA_tBox`) with fade-in animation

### Language Variant Support

Some languages support multiple dialects/variants controlled by radio buttons. The `databasePath` uses `${variant}` pattern:

- **English**: `../json/en_${variant}.json` → US/UK
- **French**: `../json/fr_${variant}.json` → FR/QC
- **Mandarin**: `../json/zh_hans.json` / `../json/zh_hant.json`
- **Spanish**: `../json/es_${variant}.json` → ES/MX
- **Vietnamese**: `../json/vi_${variant}.json` → C/N/S

## 🙏 Credits & Acknowledgments

### IPA Database
This project is built on data from the **Open Dict Data** project:
- **IPA Dictionary Data**: [https://github.com/open-dict-data/ipa-dict](https://github.com/open-dict-data/ipa-dict)
- **Open Dict Data Website**: [https://open-dict-data.github.io](https://open-dict-data.github.io)

### Additional Resources

**Cantonese Resources:**
- 粵語拼音對照表: [Wikipedia](https://zh.m.wikipedia.org/wiki/%E7%B2%B5%E8%AA%9E%E6%8B%BC%E9%9F%B3%E5%B0%8D%E7%85%A7%E8%A1%A8)
- 粵語審音配詞字庫: [CU Lexis](http://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/)

**General Resources:**
- International Phonetic Alphabet: [Wikipedia](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet)
