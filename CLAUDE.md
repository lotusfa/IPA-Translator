# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IPA-Translator is a static HTML/JavaScript web application that translates text from various languages to International Phonetic Alphabet (IPA). It supports multiple languages with separate folders for each.

## Architecture

**Structure:**
- Each language has its own folder (e.g., `cantonese/`, `english/`, `mandarin/`) containing:
  - `index.html` - Main UI page
  - `ipa_list*.html` - IPA database view pages
  - `main.js` - Translation logic

- `json/` - Contains IPA mapping data files (one per language/dialect)
- `css/` - Shared stylesheets
- `lib/` - Third-party libraries (jQuery, DataTables)

**Data Flow:**
1. User inputs text in textarea (`cWords_tBox`)
2. `main.js` loads language-specific JSON from `../json/[lang].json`
3. `normalize_ipa_data()` flattens nested JSON into character→IPA lookup map
4. Text is converted character-by-character (with optional word-level matching)
5. Results displayed in output textarea (`IPA_tBox`)

**Key Functions in main.js:**
- `get_IPA_DB()` - Fetches IPA JSON data via XMLHttpRequest
- `normalize_ipa_data()` - Flattens JSON to lookup map
- `update_result()` - Main translation logic
- `format_main()` + `format_*()` - Output formatting (IPA numbers, Jyutping, etc.)
- `get_IPA_tBox()` / `set_IPA_tBox()` - Textarea value access

## Language Variants

Some languages support multiple dialects/variants controlled by radio buttons:
- **English**: US (`en_US.json`) vs UK (`en_UK.json`)
- **French**: France (`fr_FR.json`) vs Quebec (`fr_QC.json`)
- **Mandarin**: Traditional (`zh_hant.json`) vs Simplified (`zh_hans.json`)
- **Spanish**: Spain (`es_ES.json`) vs Mexico (`es_MX.json`)

## Common Features

All pages include:
- Dark mode toggle (persisted in localStorage)
- "With [Language] Words" checkbox (shows original text + IPA)
- "Allow Words Search" checkbox (matches multi-character words)
- Auto-update on input (debounced via `input` event)
- Select-all-on-focus for input textarea

## Development Tasks

**To add a new language:**
1. Create folder with language name
2. Copy `index.html` and adapt labels/text
3. Copy `main.js` and adapt:
   - `normalize_ipa_data()` for your JSON structure
   - `get_IPA_DB()` to point to correct JSON file
   - Language-specific preprocessors if needed
4. Add corresponding JSON file in `json/`

**To modify output format:**
Add new `format_*()` function and corresponding radio button in HTML

**To update IPA data:**
Edit JSON files in `json/` folder (structure: array of objects with language key like `"yue"`, `"en_US"`, etc.)
