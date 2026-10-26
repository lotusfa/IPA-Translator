---
name: ipa-translator
description: Translate text to International Phonetic Alphabet (IPA) and romanization formats for 24 languages including Cantonese, Mandarin, English, Japanese, Korean, Vietnamese and more. Use when the user asks for IPA transcription, phonetic notation, Pinyin, Jyutping, or any language-to-IPA conversion.
---

# IPA Translator — Agent Interface

Static-hosted, offline-capable IPA converter. Humans use the normal language pages; **agents and CLI tools** should drive `agent.html` in a JavaScript browser and read `#output`.

## Hosting model

- Files are static (Firebase / any static host). Conversion runs **in the browser** after load.
- No server API. A plain HTTP GET without JS execution will not produce IPA.

## How agents / CLI should call it

Use a browser automation tool (agent-browser, Playwright, Puppeteer, or a CLI wrapper around one):

1. Open the URL with query params (URL-encode non-ASCII `input`).
2. Wait until `#output` has `data-status="ready"` or `data-status="error"` (not `loading`).
3. Read `pre#output` text content.
4. If the text starts with `Error:`, treat as failure.

**Do not** use curl / WebFetch / raw HTTP alone for translate mode — those tools usually do not run page JS.

Docs mode (no translate): open `agent.html` with **no query string**, or `?help=1`.

## Base URL

[https://toolbox.lotusfa.com/ipa/agent.html](https://toolbox.lotusfa.com/ipa/agent.html)

Local preview (from the `ipa` folder):

```bash
python3 -m http.server 8765 --bind 127.0.0.1
# then open http://127.0.0.1:8765/agent.html?...
```

## Query parameters

```
agent.html?language=<code>&input=<text>[&format=<format>][&variant=<variant>][&displayFormat=<format>]
```

| Param | Required | Description |
|-------|----------|-------------|
| `language` | Yes (translate) | Language code (**case-insensitive**) |
| `input` | Yes (translate) | Text to translate (URL-encode non-ASCII) |
| `format` | No | Output format key (Jyutping, Pinyin, …). Omit for raw IPA. `IPA_org` is identity (raw IPA). |
| `variant` | No | Language variant; default when omitted |
| `displayFormat` | No | `normal` (default), `ipa`, `json`, `csv`. **No `ruby`** (UI-only). |
| `help` / `docs=1` | Docs | Show documentation instead of translating |

Missing `language` or `input` (when any other query is present) returns `Error: …`, not the docs page.

## Browser / agent-browser example

```bash
agent-browser open "https://toolbox.lotusfa.com/ipa/agent.html?language=cantonese&format=Jyutping&input=%E4%BD%A0%E5%A5%BD"
agent-browser wait --load networkidle
# Prefer: wait until pre#output[data-status="ready"], then:
agent-browser get text "pre#output"
```

## Supported Languages

| Code | Variants | Formats |
|------|----------|---------|
| cantonese | — | IPA_org, IPA_num, Jyutping, Guangzhou, Academy, Yale, Liu |
| mandarin | hant, hans | IPA_org, IPA_num, Pinyin_num, Pinyin, Zhuyin |
| english | US, UK | — |
| french | FR, QC | — |
| spanish | ES, MX | — |
| vietnamese | C, N, S | IPA_org, IPA_num, tone_simple |
| japanese | — | — |
| korean | — | — |
| khmer | — | — |
| arabic | — | — |
| esperanto | — | — |
| persian | — | — |
| finnish | — | — |
| german | — | — |
| icelandic | — | — |
| jamaican | — | — |
| malay | — | — |
| norwegian | — | — |
| odia | — | — |
| portuguese | — | — |
| romanian | — | — |
| swahili | — | — |
| swedish | — | — |
| dutch | — | — |

## Examples

- [Cantonese → Jyutping](https://toolbox.lotusfa.com/ipa/agent.html?language=cantonese&format=Jyutping&input=%E4%BD%A0%E5%A5%BD)
- [Mandarin → Pinyin](https://toolbox.lotusfa.com/ipa/agent.html?language=mandarin&variant=hans&format=Pinyin&input=%E4%BD%A0%E5%A5%BD)
- [German IPA](https://toolbox.lotusfa.com/ipa/agent.html?language=german&input=Hallo%20Welt)
- [Vietnamese (Southern)](https://toolbox.lotusfa.com/ipa/agent.html?language=vietnamese&variant=S&format=tone_simple&input=Xin%20chao)
- [Korean](https://toolbox.lotusfa.com/ipa/agent.html?language=korean&input=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94)
- [Japanese](https://toolbox.lotusfa.com/ipa/agent.html?language=japanese&input=%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF)
- [IPA only](https://toolbox.lotusfa.com/ipa/agent.html?language=cantonese&input=%E6%AC%A2%E8%BF%8E&displayFormat=ipa)
- [JSON output](https://toolbox.lotusfa.com/ipa/agent.html?language=cantonese&input=%E6%AC%A2%E8%BF%8E&displayFormat=json)

## Output contract

| `data-status` | Meaning |
|---------------|---------|
| `loading` | Still working |
| `ready` | Success **or** documentation page |
| `error` | Failure; text starts with `Error:` |

| displayFormat | Output |
|---------------|--------|
| `normal` (default) | Text with IPA, e.g. `( 歡 fu:n˥ ) ( 迎 jɪŋ˨˩ )` |
| `ipa` | IPA only |
| `json` | JSON array of `{word, ipa, formatted}` |
| `csv` | CSV with quoted `word`, `ipa`, `formatted` columns |

## Notes

- Non-ASCII `input` must be URL-encoded (`你好` → `%E4%BD%A0%E5%A5%BD`).
- Same static files work for people (UI) and agents (`agent.html`); no separate backend.
