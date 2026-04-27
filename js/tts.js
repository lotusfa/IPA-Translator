/**
 * Text-to-Speech (TTS) Module (Lean Edition)
 */

import { svgVoice, svgPause } from './svg.js';

export { svgVoice, svgPause };

// Path data for dynamic icon toggling (re-export for backward compatibility)
export const ICONS = {
  PLAY: 'M11 5L6 9H2v6h4l5 4V5z M15.54 8.46a5 5 0 0 1 0 7.07 M19.07 4.93a10 10 0 0 1 0 14.14',
  PAUSE: 'M6 4h4v16H6z M14 4h4v16h-4z'
};

const VOICE_PRIORITY = {
  // --- English ---
  'en-US': ['Samantha', 'Alex', 'Victoria', 'Microsoft David', 'Google US English'],
  'en-GB': ['Daniel', 'Serena', 'Microsoft Hazel', 'Google UK English'],
  'en-AU': ['Karen', 'Catherine', 'Google AU English'],

  // --- Chinese ---
  'zh-HK': ['Sin-ji', 'Tracy', 'Danny'],
  'zh-CN': ['Tingting', 'Huihui', 'Kangkang', 'Google Mandarin'],
  'zh-TW': ['Meijia', 'Hanhan', 'Yating'],

  // --- European ---
  'fr-FR': ['Laure', 'Romain', 'Thomas', 'Microsoft Paul'],
  'fr-CA': ['Amélie', 'Chantal', 'Nicolas'],
  'de-DE': ['Anna', 'Yannick', 'Microsoft Hedda', 'Google Deutsch'],
  'es-ES': ['Monica', 'Diego', 'Microsoft Helena'],
  'es-MX': ['Sabina', 'Paulina', 'Microsoft Raul'],
  'it-IT': ['Alice', 'Luca', 'Microsoft Elsa'],

  // --- Asian ---
  'ja-JP': ['Kyoko', 'Otoya', 'Microsoft Ayumi', 'Google 日本語'],
  'ko-KR': ['Yuna', 'Microsoft Heami', 'Google 한국어'],
  'vi-VN': ['Linh', 'Microsoft An'],
  'fi-FI': ['Satu', 'Shelley', 'Microsoft Finnish', 'Google Finnish'],

  // --- Others ---
  'pt-BR': ['Luciana', 'Felipe', 'Microsoft Maria'],
  'ru-RU': ['Milena', 'Yuri', 'Microsoft Irina'],
  'tr-TR': ['Filiz', 'Microsoft Tolga'],
  'fa' : ['Majed'],
};

// Configuration overrides for specific language quirks
const LANG_OVERRIDES = {
  'zh-HK': { rate: 0.85 },
  'zh-TW': { rate: 0.8 },
  'zh-CN': { rate: 0.8 },
  'es-ES': { rate: 0.8 },
  'es-MX': { rate: 0.8 },
};

/**
 * Normalizes language tags for comparison
 */
const norm = (lang) => lang.toLowerCase().replace('_', '-');

/**
 * Check if voice is available for a language
 */
export async function selectBestVoice(lang) {
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();

  if (voices.length === 0) {
    await new Promise(resolve => {
      const cb = () => {
        synth.onvoiceschanged = null;
        resolve();
      };
      synth.onvoiceschanged = cb;
      setTimeout(cb, 1000);
    });
    voices = synth.getVoices();
  }

  const targetLang = norm(lang);
  const preferred = VOICE_PRIORITY[lang] || [];

  const langVoices = voices.filter(v => norm(v.lang) === targetLang || norm(v.lang).startsWith(targetLang + '-'));

  if (langVoices.length === 0) return null;

  const curated = langVoices.find(v => preferred.some(p => v.name.includes(p)));
  if (curated) return curated;

  return langVoices.find(v => !/Bad News|Boing|Zarvox|Whisper/i.test(v.name)) || langVoices[0];
}

/**
 * Main Speak Function
 */
export async function speak(text, lang = 'en-US', { onEnd, onError } = {}) {
  const synth = window.speechSynthesis;
  synth.cancel();

  const voice = await selectBestVoice(lang);

  if (!voice) {
    console.warn(`No voice found for ${lang}`);
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const config = { lang, rate: 0.85, pitch: 1.0, ...LANG_OVERRIDES[lang] };

  Object.assign(utterance, config);
  utterance.voice = voice;

  utterance.onend = onEnd;
  utterance.onerror = (e) => {
    console.error('TTS Error:', e);
    if (onError) onError(e);
  };

  synth.speak(utterance);
}

/**
 * UI Controller with Visibility Logic
 */
export function initSpeakButton({ buttonId = 'speak-btn', inputId = 'cWords_tBox', language = 'en-US', getLanguage = null }) {
  const btn = document.getElementById(buttonId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;

  const svg = btn.querySelector('svg');
  const pathEl = svg.querySelector('path');
  const playPath = pathEl.getAttribute('d');
  let isPlaying = false;

  const setIcon = (showPause) => {
    if (showPause) {
      pathEl.setAttribute('d', ICONS.PAUSE);
    } else {
      pathEl.setAttribute('d', playPath);
    }
  };

  const updateVisibility = async () => {
    const currentLang = getLanguage ? getLanguage() : language;
    const voice = await selectBestVoice(currentLang);
    btn.style.display = voice ? 'inline-flex' : 'none';
  };

  updateVisibility();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.addEventListener('voiceschanged', updateVisibility);
  }

  btn.addEventListener('click', () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      isPlaying = false;
      setIcon(false);
      return;
    }

    const text = input.value.trim();
    if (!text) return;

    const currentLang = getLanguage ? getLanguage() : language;
    isPlaying = true;
    setIcon(true);

    speak(text, currentLang, {
      onEnd: () => {
        isPlaying = false;
        setIcon(false);
      }
    });
  });
}

/**
 * Global flag for voice support (for ipa_list pages)
 * Set by preloadVoiceSupport, checked by createSpeakButton
 */
export let hasVoiceSupport = false;

/**
 * Pre-check voice support for a language (call at page load)
 * Sets the hasVoiceSupport global flag for synchronous checks
 */
export async function preloadVoiceSupport(lang) {
  const voice = await selectBestVoice(lang);
  hasVoiceSupport = voice !== null;
  return hasVoiceSupport;
}

/**
 * Create a speak button for table rows
 */
const speakBtnState = { isPlaying: false };

export function createSpeakButton(text, lang = 'en-US') {
  // Check global voice support flag
  if (!hasVoiceSupport) {
    return null;
  }

  const btn = document.createElement('button');
  btn.className = 'btn-icon speak-word-btn';
  btn.setAttribute('aria-label', '朗讀單字');
  btn.innerHTML = svgVoice;

  const setIcon = (html) => { btn.innerHTML = html; };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (speakBtnState.isPlaying) {
      window.speechSynthesis.cancel();
      speakBtnState.isPlaying = false;
      setIcon(svgVoice);
      return;
    }

    speakBtnState.isPlaying = true;
    setIcon(svgPause);

    speak(text, lang, {
      onEnd: () => {
        speakBtnState.isPlaying = false;
        setIcon(svgVoice);
      }
    });
  });

  return btn;
}
