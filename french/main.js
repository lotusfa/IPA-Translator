/**
 * French IPA Translator - Simplified using initIPAIndexPage
 */

import { initIPAIndexPage } from '../js/page/ipa-index-page.js';
import { processTextLongestMatch } from '../js/ipa.js';

// Initialize with variant support (fr_FR/fr_QC)
initIPAIndexPage({
  databasePath: '../json/${variant}.json',
  variantRadioSelector: 'input[name="inlineRadioOptions"]',
  variantMapping: { IPA_fr_FR: 'fr_FR', IPA_fr_QC: 'fr_QC' },
  process: processTextLongestMatch,
  locale: { textAndIpa: '(Texte /ipa/)', onlyIpa: 'Seulement /ipa/' },
  getLanguage: () => {
    const variant = document.querySelector('input[name="inlineRadioOptions"]:checked')?.id;
    return variant === 'IPA_fr_FR' ? 'fr-FR' : 'fr-CA';
  },
  gameLabel: 'french',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Partager', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list-fr', icon: 'globe', label: 'IPA France', type: 'link', href: './ipa_list_fr.html' },
    { id: 'ipa-list-qc', icon: 'globe', label: 'IPA Québec', type: 'link', href: './ipa_list_qc.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Jeu quiz', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Autres langues', type: 'lang' },
  ]
});
