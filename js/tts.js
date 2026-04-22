/**
 * Text-to-Speech (TTS) Module for IPA Translator
 * Provides language-specific TTS functionality using Web Speech API
 */

// ============================================
// TTS Configuration
// ============================================

/**
 * Speaker icon SVG paths
 */
const SPEAKER_ICON = {
  outer: 'M11 5L6 9H2v6h4l5 4V5z M15.54 8.46a5 5 0 0 1 0 7.07 M19.07 4.93a10 10 0 0 1 0 14.14',
  pause: 'M6 4h4v16H6z M14 4h4v16h-4z'
};

/**
 * Voice priority list for high-quality voice selection
 */
const VOICE_PRIORITY_LIST = {
  'en-US': ['Samantha', 'Alex', 'Victoria', 'Microsoft David', 'Google US English'],
  'en-GB': ['Daniel', 'Serena', 'Microsoft Hazel'],
  'zh-HK': ['Sin-ji'],
  'zh-TW': ['Meijia']
};

/**
 * Get TTS configuration for a language
 * @param {string} language - Language code (e.g., 'cantonese', 'english', 'zh-HK')
 * @returns {object} TTS configuration: { lang, rate, pitch, volume }
 */
export function getTTSConfig(language) {
  // Map language names to ISO codes
  const langMap = {
    'cantonese': 'zh-HK',
    'zh': 'zh-CN',
    'chinese': 'zh-CN',
    'english': 'en-US',
    'en_US': 'en-US',
    'en_UK': 'en-GB',
    'french': 'fr-FR',
    'fr_FR': 'fr-FR',
    'fr_QC': 'fr-CA',
    'spanish': 'es-ES',
    'es_ES': 'es-ES',
    'es_MX': 'es-MX',
    'mandarin': 'zh-CN-mandarin',
    'vietnamese': 'vi-VN',
  };

  const langCode = langMap[language] || language;
  const TTS_LANGUAGE_CONFIG = {
    'zh-HK': { lang: 'zh-HK', rate: 0.9, pitch: 1.0, volume: 1.0 },
    'zh-CN': { lang: 'zh-CN', rate: 0.9, pitch: 1.0, volume: 1.0 },
    'zh-TW': { lang: 'zh-TW', rate: 0.9, pitch: 1.0, volume: 1.0 },
    'en-US': { lang: 'en-US', rate: 1.0, pitch: 1.0, volume: 1.0 },
    'en-GB': { lang: 'en-GB', rate: 1.0, pitch: 1.0, volume: 1.0 },
    'fr-FR': { lang: 'fr-FR', rate: 1.0, pitch: 1.0, volume: 1.0 },
    'fr-CA': { lang: 'fr-CA', rate: 1.0, pitch: 1.0, volume: 1.0 },
    'es-ES': { lang: 'es-ES', rate: 1.0, pitch: 1.0, volume: 1.0 },
    'es-MX': { lang: 'es-MX', rate: 1.0, pitch: 1.0, volume: 1.0 },
    'zh-CN-mandarin': { lang: 'zh-CN', rate: 0.95, pitch: 1.0, volume: 1.0 },
  };

  return TTS_LANGUAGE_CONFIG[langCode] || { lang: 'en-US', rate: 1.0, pitch: 1.0, volume: 1.0 };
}

/**
 * Speak text using Web Speech API
 * @param {object} options - TTS options:
 *   @param {string} options.text - Text to read aloud
 *   @param {string} [options.language] - Language code (default: 'en-US')
 *   @param {number} [options.rate] - Speech rate (0.1-10, default: 1.0)
 *   @param {number} [options.pitch] - Pitch (0-2, default: 1.0)
 *   @param {number} [options.volume] - Volume (0-1, default: 1.0)
 *   @param {function} [options.onError] - Error callback
 */
export function speakText(options) {
  const {
    text,
    language = 'en-US',
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
    onError = null
  } = options;

  if (!window.speechSynthesis) {
    const errorMsg = 'Browser does not support text-to-speech';
    console.warn(errorMsg);
    if (onError) onError(errorMsg);
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  window.speechSynthesis.speak(utterance);
}

/**
 * Improved TTS with high-quality voice selection
 * Uses browser's enhanced/premium voices for more natural speech
 * @param {string} text - Text to speak
 * @param {string} lang - Language code (e.g., 'en-US')
 * @param {function} onEnd - Callback when speech ends
 * @param {function} onError - Callback on error
 */
export function speakBetter(text, lang, onEnd, onError) {
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();

  // If no voices loaded yet, wait for the event
  if (voices.length === 0) {
    const waitForVoices = () => {
      voices = synth.getVoices();
      if (voices.length > 0) {
        speakBetter(text, lang, onEnd, onError);
      }
    };
    synth.onvoiceschanged = waitForVoices;
    setTimeout(waitForVoices, 100);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const langPrefix = lang.split('-')[0];

  let selectedVoice = null;

  // Try preferred voices first
  const preferredNames = VOICE_PRIORITY_LIST[lang] || [];
  for (const name of preferredNames) {
    selectedVoice = voices.find(v => v.name.includes(name) && v.lang.includes(lang));
    if (selectedVoice) break;
  }

  // Fallback to search for high-quality voices
  if (!selectedVoice) {
    selectedVoice = voices.find(voice => {
      const isRightLang = voice.lang.includes(lang);
      const isHighQuality = /Enhanced|Premium|Natural|Neural|Apple|Siri/i.test(voice.name);
      const isNotCrazy = !/Bad News|Bahh|Bells|Boing|Good News|Bubbles|Cellos|Wobble|Zarvox|Albert|Whisper/i.test(voice.name);
      const isNotBad = !/Eddy|Flo|Fred/i.test(voice.name);

      return isRightLang && (isHighQuality || voice.localService) && isNotCrazy && isNotBad;
    });
  }

  // Final fallback: any voice of that language
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang.includes(lang));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    console.log('Using voice:', selectedVoice.name, '(' + selectedVoice.lang + ')');
  }

  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  utterance.onend = () => {
    onEnd && onEnd();
  };

  utterance.onerror = (event) => {
    console.error('TTS Error:', event);
    onError && onError(event);
  };

  synth.speak(utterance);
}

/**
 * Initialize TTS button with speaker icon
 * @param {object} options - Options:
 *   @param {string} options.buttonId - Speaker button element ID (default: 'speak-btn')
 *   @param {string} options.inputId - Input textarea element ID (default: 'cWords_tBox')
 *   @param {string} [options.language] - Language code for TTS
 *   @param {function} [options.customSpeak] - Custom speak function override
 */
export function initSpeakButton(options) {
  const {
    buttonId = 'speak-btn',
    inputId = 'cWords_tBox',
    language = 'en-US',
    customSpeak = null
  } = options;

  const speakBtn = document.getElementById(buttonId);
  const inputEl = document.getElementById(inputId);
  let isPlaying = false;

  const svg = speakBtn.querySelector('svg');
  if (!svg) return;

  const paths = svg.querySelectorAll('path, rect');
  let currentIcon = 'outer';

  function setIcon(iconType) {
    if (iconType === 'outer') {
      if (paths[0]) paths[0].setAttribute('d', SPEAKER_ICON.outer);
      for (let i = 1; i < paths.length; i++) {
        if (paths[i].tagName === 'rect') {
          paths[i].remove();
        }
      }
    } else {
      if (paths[0]) paths[0].setAttribute('d', SPEAKER_ICON.pause);
      for (let i = 1; i < paths.length; i++) {
        paths[i].remove();
      }
    }
  }

  setIcon('outer');

  if (speakBtn && inputEl) {
    speakBtn.addEventListener('click', () => {
      const inputText = inputEl.value.trim();

      if (isPlaying) {
        window.speechSynthesis.cancel();
        isPlaying = false;
        currentIcon = 'outer';
        setIcon('outer');
      } else if (inputText) {
        if (customSpeak) {
          customSpeak(inputText);
        } else {
          const config = getTTSConfig(language);

          speakBetter(
            inputText,
            config.lang,
            () => {
              isPlaying = false;
              currentIcon = 'outer';
              setIcon('outer');
            },
            () => {
              isPlaying = false;
              currentIcon = 'outer';
              setIcon('outer');
            }
          );
        }

        isPlaying = true;
        currentIcon = 'pause';
        setIcon('pause');
      }
    });
  }
}
