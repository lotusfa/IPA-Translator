---
name: ipa-translator
description: Translate text to International Phonetic Alphabet (IPA) and romanization formats for 24 languages including Cantonese, Mandarin, English, Japanese, Korean, Vietnamese and more. Use when the user asks for IPA transcription, phonetic notation, Pinyin, Jyutping, or any language-to-IPA conversion.
---

# IPA Translator — Agent Interface

Translate text to International Phonetic Alphabet (IPA) via a web interface. **You must use your browser** (agent-browser or WebFetch) to access it — do not use curl or HTTP tools.

## Base URL

```
https://toolbox.lotusfa.com/ipa/agent.html
```

## How to Use

Navigate to the URL with query parameters. The page runs entirely in the browser — JavaScript fetches the IPA database and processes the text client-side.

```
https://toolbox.lotusfa.com/ipa/agent.html?language=<code>&input=<text>[&format=<format>][&variant=<variant>]
```

| Param | Required | Description |
|-------|----------|-------------|
| `language` | Yes | Language code (see list below) |
| `input` | Yes | Text to translate (URL-encode non-ASCII characters) |
| `format` | No | Output format. Omit for raw IPA |
| `variant` | No | Language variant. Uses default when omitted |

## Browser Usage

```bash
# Using agent-browser
agent-browser open "https://toolbox.lotusfa.com/ipa/agent.html?language=cantonese&format=Jyutping&input=%E4%BD%A0%E5%A5%BD"
agent-browser wait --load networkidle
agent-browser get text pre  # Get the IPA output

# Using WebFetch
WebFetch url="https://toolbox.lotusfa.com/ipa/agent.html?language=german&input=Hallo Welt" prompt="Extract the plain text IPA output from the page"
```

## Supported Languages

| Code | Name | Variants | Formats |
|------|------|----------|---------|
| cantonese | Cantonese | — | IPA_org, IPA_num, Jyutping, Guangzhou, Academy, Yale, Liu |
| mandarin | Mandarin | hant, hans | IPA_org, IPA_num, Pinyin_num, Pinyin, Zhuyin |
| english | English | US, UK | — |
| french | French | FR, QC | — |
| spanish | Spanish | ES, MX | — |
| vietnamese | Vietnamese | C, N, S | IPA_org, IPA_num, tone_simple |
| japanese | Japanese | — | — |
| korean | Korean | — | — |
| khmer | Khmer | — | — |
| arabic | Arabic | — | — |
| esperanto | Esperanto | — | — |
| persian | Persian | — | — |
| finnish | Finnish | — | — |
| german | German | — | — |
| icelandic | Icelandic | — | — |
| jamaican | Jamaican | — | — |
| malay | Malay | — | — |
| norwegian | Norwegian | — | — |
| odia | Odia | — | — |
| portuguese | Portuguese | — | — |
| romanian | Romanian | — | — |
| swahili | Swahili | — | — |
| swedish | Swedish | — | — |
| dutch | Dutch | — | — |

## Examples

- Cantonese → Jyutping: `?language=cantonese&format=Jyutping&input=%E4%BD%A0%E5%A5%BD`
- Mandarin → Pinyin: `?language=mandarin&variant=hans&format=Pinyin&input=%E4%BD%A0%E5%A5%BD`
- German IPA: `?language=german&input=Hallo Welt`
- Vietnamese (Southern): `?language=vietnamese&variant=S&format=tone_simple&input=Xin chao`
- Korean: `?language=korean&input=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94`
- Japanese: `?language=japanese&input=%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF`

## Output

The page renders plain text IPA or romanization in a `<pre>` element. No extra UI, no HTML wrapping. Errors appear as plain text starting with "Error:" or "Unknown".

## Notes

- The page runs entirely in the browser (client-side JS). It fetches IPA databases and processes text using JavaScript — no server-side API.
- Visit without parameters (`https://toolbox.lotusfa.com/ipa/agent.html`) to see a full documentation page with language table.
- Non-ASCII input must be URL-encoded (e.g., `你好` → `%E4%BD%A0%E5%A5%BD`).
