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

  // --- Others ---
  'pt-BR': ['Luciana', 'Felipe', 'Microsoft Maria'],
  'ru-RU': ['Milena', 'Yuri', 'Microsoft Irina'],
  'tr-TR': ['Filiz', 'Microsoft Tolga']
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
 * High-quality voice selector
 */
async function selectBestVoice(lang) {
  const synth = window.speechSynthesis;
  
  // Ensure voices are loaded
  let voices = synth.getVoices();
  if (voices.length === 0) {
    await new Promise(resolve => { synth.onvoiceschanged = () => resolve(); });
    voices = synth.getVoices();
  }

  const preferred = VOICE_PRIORITY[lang] || [];
  
  // 1. Try curated list
  const curated = voices.find(v => preferred.some(p => v.name.includes(p)) && v.lang.includes(lang));
  if (curated) return curated;

  // 2. Fallback: Find high quality/natural, exclude "novelty" voices
  return voices.find(v => 
    v.lang.includes(lang) && 
    /Enhanced|Premium|Natural|Neural|Apple/i.test(v.name) && 
    !/Bad News|Boing|Zarvox|Whisper/i.test(v.name)
  ) || voices.find(v => v.lang.includes(lang));
}

/**
 * Main Speak Function
 */
export async function speak(text, lang = 'en-US', { onEnd, onError } = {}) {
  const synth = window.speechSynthesis;
  synth.cancel(); 

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = await selectBestVoice(lang);
  
  console.log(voice)
  // Apply Config
  const config = { lang, rate: 0.85, pitch: 1.0, ...LANG_OVERRIDES[lang] };
  Object.assign(utterance, config);
  if (voice) utterance.voice = voice;

  utterance.onend = onEnd;
  utterance.onerror = (e) => {
    console.error('TTS Error:', e);
    if (onError) onError(e);
  };

  synth.speak(utterance);
}

/**
 * UI Controller (KISS - simple play/pause toggle)
 */
export function initSpeakButton({ buttonId = 'speak-btn', inputId = 'cWords_tBox', language = 'en-US', getLanguage = null }) {
  const btn = document.getElementById(buttonId);
  const input = document.getElementById(inputId);
  const iconPath = btn?.querySelector('svg path');

  if (!btn || !input || !iconPath) return;

  let isPlaying = false;

  btn.addEventListener('click', () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      isPlaying = false;
      iconPath.setAttribute('d', ICONS.PLAY);
      return;
    }

    const text = input.value.trim();
    if (!text) return;

    const currentLang = getLanguage ? getLanguage() : language;
    isPlaying = true;
    iconPath.setAttribute('d', ICONS.PAUSE);

    speak(text, currentLang, {
      onEnd: () => {
        isPlaying = false;
        iconPath.setAttribute('d', ICONS.PLAY);
      }
    });
  });
}