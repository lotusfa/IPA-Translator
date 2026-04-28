/**
 * Shared UI Initialization for IPA-Translator Pages — Barrel Re-export
 *
 * All implementation has been split into dedicated modules:
 *   ipa-index-page.js  — initIPAIndexPage (translation pages)
 *   ipa-list-page.js   — initIPATable, initIPAListPage (IPA reference pages)
 *   page-shared.js     — initDarkMode, language nav, responsive textarea
 *   game-entry.js      — createGameButton
 *
 * Usage:
 *   import { initIPAIndexPage } from '../js/ui.js';
 *   import { initIPAListPage } from '../js/ui.js';
 */

export { initIPAIndexPage } from './ipa-index-page.js';
export { initIPATable, initIPAListPage } from './ipa-list-page.js';
export { initDarkMode, generateLanguageButtons, initLanguageButtons, initResponsiveTextareaRows } from './page-shared.js';
export { processTextCharBased, processTextLongestMatch } from './ipa.js';
export { createGameButton } from './game-entry.js';
