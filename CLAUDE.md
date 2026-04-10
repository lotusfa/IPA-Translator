# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IPA-Translator is a client-side web application that translates text from various languages to International Phonetic Alphabet (IPA). It supports Cantonese, Mandarin, English, Esperanto, Persian, Spanish, French, and Japanese.

## Architecture

**Static Site Structure:**
- Each language has its own directory (e.g., `cantonese/`, `mandarin/`, `english/`)
- Each language folder contains:
  - `index.html` - Main UI page with Bootstrap layout
  - `main.js` - Translation logic
  - `{lang}.json` - IPA mapping data (character → IPA)
  - `ipa_list*.html` - IPA database lookup pages

**Core Translation Flow (main.js pattern):**
1. User input in textarea (`cWords_tBox`) triggers `update_result()`
2. `get_IPA_DB()` fetches the language-specific JSON via XMLHttpRequest
3. Text is tokenized character-by-character
4. Each character is looked up in the IPA data object
5. Result formatted based on selected format (IPA_num, IPA_org, or Jyutping)
6. Output displayed in `IPA_tBox` textarea

**Format Options:**
- `IPA_num`: Numerical tone notation (e.g., `/nei13/`)
- `IPA_org`: Original IPA with diacritics (e.g., `/nei˩˧/`)
- `Jyutping`: Jyutping romanization (e.g., `/nei5/`)

## Key Implementation Details

**Cantonese-specific features:**
- Word-level search looks ahead up to 6 characters for multi-character word matches
- `ipa_ajex_data.txt` and `ipa_data.txt` are large database files for comprehensive character coverage
- `yue.json` contains the character-to-IPA mapping

**Mandarin structure:**
- Separate JSON files for simplified (`zh_hans.json`) and traditional (`zh_hant.json`) Chinese
- Additional `zh_hans_ajex.json` / `zh_hant_ajex.json` for expanded databases

## Running the Application

This is a static site. No build process required. Can be served with any static file server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

Then open `http://localhost:8000/cantonese/index.html` (or other language paths).
