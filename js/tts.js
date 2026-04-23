/**
 * Text-to-Speech (TTS) Module (Lean Edition)
 */

// Icons: PLAY = speaker, PAUSE = 2 rectangles
const ICONS = {
  PLAY: 'M11 5L6 9H2v6h4l5 4V5z M15.54 8.46a5 5 0 0 1 0 7.07 M19.07 4.93a10 10 0 0 1 0 14.14',
  PAUSE: 'M6 4h4v16H6z M14 4h4v16h-4z'
};

const VOICE_PRIORITY = {
  // --- English ---
  'en-US': ['Samantha', 'Alex', 'Victoria', 'Microsoft David', 'Google US English'],
  'en-GB': ['Daniel', 'Serena', 'Microsoft Hazel', 'Google UK English'],
  'en-AU': ['Karen', 'Catherine', 'Google AU English'],

  // --- Chinese ---
  'zh-HK': ['Sin-ji', 'Tracy', 'Danny'], // Sin-ji is the iconic macOS voice
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
  'zh-HK': { rate: 0.85 }, // Cantonese often sounds better a bit slower
  'zh-TW': { rate: 0.8 },
  'zh-CN': { rate: 0.8 },
  'es-ES': { rate: 0.8 },
  'es-MX': { rate: 0.8 },
};

/**
 * Normalizes language tags for comparison (zh_HK -> zh-hk)
 */
const norm = (lang) => lang.toLowerCase().replace('_', '-');

/**
 * High-quality voice selector - Strict about language
 */
async function selectBestVoice(lang) {
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();

  if (voices.length === 0) {
    await new Promise(resolve => {
      const cb = () => {
        synth.onvoiceschanged = null;
        resolve();
      };
      synth.onvoiceschanged = cb;
      // Timeout fallback for browsers where onvoiceschanged doesn't fire
      setTimeout(cb, 1000);
    });
    voices = synth.getVoices();
  }

  const targetLang = norm(lang);
  const preferred = VOICE_PRIORITY[lang] || [];

  // 1. Filter voices that strictly match the language tag
  const langVoices = voices.filter(v => norm(v.lang) === targetLang || norm(v.lang).startsWith(targetLang + '-'));

  if (langVoices.length === 0) return null; // No voice for this specific language

  // 2. Try curated list from priorities
  const curated = langVoices.find(v => preferred.some(p => v.name.includes(p)));
  if (curated) return curated;

  // 3. Fallback: First available voice for this language, excluding "novelty" voices
  return langVoices.find(v => !/Bad News|Boing|Zarvox|Whisper/i.test(v.name)) || langVoices[0];
}

/**
 * Main Speak Function
 */
export async function speak(text, lang = 'en-US', { onEnd, onError } = {}) {
  const synth = window.speechSynthesis;
  synth.cancel();

  const voice = await selectBestVoice(lang);
  
  // If no voice found for specific language, don't play (prevents Mandarin fallback)
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

  const iconPath = btn.querySelector('svg path');
  let isPlaying = false;

  // Function to hide/show button based on voice availability
  const updateVisibility = async () => {
    const currentLang = getLanguage ? getLanguage() : language;
    const voice = await selectBestVoice(currentLang);
    btn.style.display = voice ? 'inline-flex' : 'none';
  };

  // Check immediately and when voices change (async loading)
  updateVisibility();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.addEventListener('voiceschanged', updateVisibility);
  }

  btn.addEventListener('click', () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      isPlaying = false;
      if (iconPath) iconPath.setAttribute('d', ICONS.PLAY);
      return;
    }

    const text = input.value.trim();
    if (!text) return;

    const currentLang = getLanguage ? getLanguage() : language;
    isPlaying = true;
    if (iconPath) iconPath.setAttribute('d', ICONS.PAUSE);

    speak(text, currentLang, {
      onEnd: () => {
        isPlaying = false;
        if (iconPath) iconPath.setAttribute('d', ICONS.PLAY);
      }
    });
  });
}