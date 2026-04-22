/**
 * Text-to-Speech (TTS) Module (Lean Edition)
 */

const SPEAKER_ICONS = {
  PLAY: 'M11 5L6 9H2v6h4l5 4V5z M15.54 8.46a5 5 0 0 1 0 7.07 M19.07 4.93a10 10 0 0 1 0 14.14',
  PAUSE: 'M6 4h4v16H6z M14 4h4v16h-4z'
};

const VOICE_PRIORITY = {
  'en-US': ['Samantha', 'Alex', 'Victoria'],
  'zh-HK': ['Sin-ji'],
  'fr-FR': ['Laure', 'Romain'],
  'zh-CN': ['Tingting']
  // Add only the ones you specifically want to curate
};

// Configuration overrides for specific language quirks
const LANG_OVERRIDES = {
  'zh-HK': { rate: 0.85 }, // Cantonese often sounds better a bit slower
  'zh-CN': { rate: 0.9 },
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
  const config = { lang, rate: 0.9, pitch: 1.0, ...LANG_OVERRIDES[lang] };
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
 * UI Controller (Simplified)
 */
export function initSpeakButton({ buttonId = 'speak-btn', inputId = 'cWords_tBox', language = 'en-US' }) {
  const btn = document.getElementById(buttonId);
  const input = document.getElementById(inputId);
  const iconPath = btn?.querySelector('path');
  
  if (!btn || !input || !iconPath) return;

  let isPlaying = false;

  btn.addEventListener('click', () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      isPlaying = false;
      iconPath.setAttribute('d', SPEAKER_ICONS.PLAY);
      return;
    }

    const text = input.value.trim();
    if (!text) return;

    isPlaying = true;
    iconPath.setAttribute('d', SPEAKER_ICONS.PAUSE);

    speak(text, language, {
      onEnd: () => {
        isPlaying = false;
        iconPath.setAttribute('d', SPEAKER_ICONS.PLAY);
      }
    });
  });
}