# IPA Translator - Localization & SEO Specification

## Overview

本規範用於確保每個語言頁面都有統一且優化 SEO 的 wording 結構，讓當地用戶能使用自己語言的 IPA 翻譯工具。

## Target Languages (Priority)

| Priority | Language | Status | Notes |
|----------|----------|--------|-------|
| 🔴 High | Cantonese (粵語) | ✅ Ready | 已完成 |
| 🔴 High | Mandarin (普通話) | ✅ Ready | 已完成 |
| 🔴 High | Vietnamese (Tiếng Việt) | ✅ Ready | 已完成 |
| 🔴 High | English | ✅ Ready | 已完成 |
| 🟡 Medium | Japanese (日本語) | ⚠️ Needs Update | 部分完成 |
| 🟡 Medium | French (Français) | ⚠️ Needs Update | 需要雙語化 |
| 🟢 Low | Others | 🔄 To Improve | 需要當地化 |

---

## Page Structure Template

每個語言頁面必須包含以下結構：

### 1. Title Tag (必須雙語)

```html
<title>[本地語言名稱] - [English Name] - IPA Translator</title>
```

**範例：**
- Cantonese: `粵語國際音標翻譯器 - Cantonese IPA Translator`
- Mandarin: `普通話國際音標翻譯器 - Mandarin IPA Translator`
- Vietnamese: `Hệ phiên IPA Tiếng Việt - Vietnamese IPA Transliterator`
- English: `IPA Translator - English`
- Japanese: `日本語国際音標変換 - Japanese IPA Converter`

### 2. H1 & H2 Headers

```html
<h1>[本地語言名稱] + IPA + 翻譯器/變換器</h1>
<h2>[English Name]</h2>
```

### 3. Input/Output Labels (雙語格式)

| 元素 | 格式範例 |
|------|----------|
| Input Label | `日本語テキスト / Japanese text` |
| Output Label | `IPA 音標 / IPA` 或 `Phiên âm IPA` |
| Placeholder | `Nhập văn bản tiếng Việt...` (僅本地語言) |

### 4. Format Options (雙語)

```
[本地語言說明] (English example)
```

**範例：**
- 音標數字 (/nei13/) - Cantonese
- 國際音標 (/nei˩˧/) - Cantonese
- Số phiên âm (/nei13/) - Vietnamese
- Phiên âm IPA (/nei˩˧/) - Vietnamese

### 5. Checkboxes (雙語)

| Function | Format |
|----------|--------|
| Show Original | `Hiển thị văn bản gốc / Show Original` |
| Word Match | `Ghép theo từ / Word Match` 或 `以詞組匹配 / Word Match` |

### 6. Footer Description (關鍵 SEO 部分)

**必須包含：**
1. 本地語言名稱（多種變體）
2. IPA / International Phonetic Alphabet
3. 支援功能（dialects, variants）

**Template:**
```html
<p>[本地語言描述，涵蓋多種當地名稱變體]</p>
<p>[English description with keywords]</p>
```

**範例 (Mandarin):**
```html
<p>此開源項目爲普通話（國語/漢語）標注國際音標，支援繁體字及簡體中文。</p>
<p>This open-source project adds IPA to Mandarin / Putonghua / Guoyu / Chinese, supporting both Traditional and Simplified Chinese.</p>
```

**範例 (Vietnamese):**
```html
<p>Đây là dự án mã nguồn mở chuyển phiên tiếng Việt (Tiếng Việt) sang phiên âm IPA, hỗ trợ phương ngữ miền Bắc, Trung, Nam.</p>
<p>This open-source project converts Vietnamese (Tiếng Việt) to IPA, supporting Central, Northern, and Southern dialects.</p>
```

### 7. Links Section (雙語)

```html
<h4>[本地語言] / Links</h4>
<ul>
  <li><a href="...">[本地名稱] ([English])</a></li>
  <li><a href="...">[本地名稱] (Wikipedia)</a></li>
</ul>
```

---

## Language-Specific Keywords

### Cantonese (粵語)
- 粵語 / 廣東話 / 香港話
- 國際音標 / 萬國音標
- 粵拼 / Jyutping

### Mandarin (普通話)
- 普通話 / 國語 / 漢語
- 拼音 / Pinyin
- 繁體 / 簡體

### Vietnamese (Tiếng Việt)
- Tiếng Việt
- Phương ngữ: Bắc (Northern) / Trung (Central) / Nam (Southern)
- Phiên âm quốc tế

### Japanese (日本語)
- 日本語 / にほんご / Nihon-go
- 仮名 / Kana
- 音標 / 発音

### English
- English
- British / American
- IPA / Phonetic

---

## SEO Best Practices

### 1. Use Native Script First
Always put local script first, then English in parentheses:
- ✅ `語音 / Voice`
- ❌ `Voice / 語音`

### 2. Include Common Variants
For languages with multiple names, include all in description:
- Mandarin: 普通話 (國語/漢語)
- Vietnamese: Tiếng Việt (Vietnamese)

### 3. Localize Wikipedia Links
Link to the local language Wikipedia, not English:
- Vietnamese: `https://vi.wikipedia.org/wiki/Bảng_phiên_âm_quốc_tế`
- Japanese: `https://ja.wikipedia.org/wiki/国際音声記号`

### 4. Meta Description
Each page should have proper meta description with keywords:
```html
<meta name="description" content="[Local description with keywords] ([English translation])">
```

---

## Checklist for Each Language

- [ ] Title tag bilingual (Local + English)
- [ ] H1 uses local script primarily
- [ ] H2 in English
- [ ] Input/Output labels bilingual
- [ ] Placeholder in local language
- [ ] Format options localized with examples
- [ ] Checkboxes bilingual
- [ ] Footer description includes name variants
- [ ] Links section bilingual
- [ ] Wikipedia link points to local language version
- [ ] Language buttons functionality working

---

## Quick Reference: Common Translations

| English | Cantonese | Mandarin | Vietnamese | Japanese |
|---------|-----------|----------|------------|----------|
| IPA Translator | 國際音標翻譯器 | 國際音標翻譯器 | Hệ phiên IPA | 国際音標変換 |
| Input text | 輸入文字 | 輸入文字 | Nhập văn bản | テキストを入力 |
| Output | 輸出 | 輸出 | Đầu ra | 出力 |
| With Original | 保留原文 | 保留原文 | Hiển thị gốc | 原文を表示 |
| Word Match | 以詞組匹配 | 以詞組匹配 | Ghép theo từ | 単語一致 |
| Database | 資料庫 | 資料庫 | Cơ sở dữ liệu | データベース |
| Links | 連結 | 連結 | Liên kết | リンク |

---

## Maintenance

When adding a new language or updating an existing one:

1. Read this specification
2. Follow the template structure
3. Use bilingual format (Local / English)
4. Include all common name variants
5. Link to local Wikipedia
6. Test all links and functionality
