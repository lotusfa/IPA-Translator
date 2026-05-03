/**
 * Game i18n — lightweight locale loader.
 * Fetches config/locale/{lang}.json, caches it, provides t() with fallback to English.
 */

const CACHE = new Map();
let currentLang = 'english';
let fallback = null;

async function loadLocale(lang) {
  if (CACHE.has(lang)) return CACHE.get(lang);
  try {
    const res = await fetch(`../config/locale/${lang}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    CACHE.set(lang, data);
    return data;
  } catch {
    return null;
  }
}

/** Load locale for the given language. English is always loaded as fallback. */
export async function initGameI18n(lang) {
  currentLang = lang || 'english';
  fallback = await loadLocale('english') || null;
  if (currentLang !== 'english') {
    await loadLocale(currentLang);
  }
}

/** Translate a key. Falls back to English, then the key itself. Supports {placeholder}. */
export function t(key, params = {}) {
  const locale = CACHE.get(currentLang);
  let value = locale?.[key] || fallback?.[key] || key;
  for (const [k, v] of Object.entries(params)) {
    value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }
  return value;
}

export function getCurrentLang() { return currentLang; }
