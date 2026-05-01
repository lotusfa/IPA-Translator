/**
 * Japanese IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage, processTextCharBased } from '../js/ui.js';

// Initialize with char-based processing (no formatter needed)
initIPAIndexPage({
  databasePath: '../json/ja.json',
  process: processTextCharBased,
  maxWordLength: 6,
  ttsLanguage: 'ja-JP',
  gameLabel: 'japanese',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: '共有', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPAデータベース', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'クイズゲーム', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: '他の言語', type: 'lang' },
  ]
});
