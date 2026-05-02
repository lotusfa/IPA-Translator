// Shared helpers for game types — no imports from other game-types to avoid circular deps

import { selectBestVoice } from '../../js/tts.js';

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateOptions(allPairs, correct, isWord = false) {
  // Generate 4 options: correct + 3 random distractors
  const pool = allPairs.filter(p => (isWord ? p[0] : p[1]) !== correct);
  const distractors = shuffle(pool).slice(0, 3).map(p => isWord ? p[0] : p[1]);
  return shuffle([correct, ...distractors]);
}

// Per-language voice cache — resets on each launchGame()
const voiceCache = new Map();

export function resetVoiceCache() {
  voiceCache.clear();
}

export async function checkVoice(lang) {
  if (!voiceCache.has(lang)) {
    voiceCache.set(lang, (await selectBestVoice(lang)) !== null);
  }
  return voiceCache.get(lang);
}

// Detect TTS language from word text (fallback when lang is unknown)
export function detectLang(word) {
  if (/\p{Script=Han}/u.test(word)) return 'zh-CN';
  if (/\p{Script=Hiragana}/u.test(word) || /\p{Script=Katakana}/u.test(word)) return 'ja-JP';
  if (/\p{Script=Hangul}/u.test(word)) return 'ko-KR';
  return 'en-US';
}