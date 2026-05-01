import { initIPAIndexPage, processTextLongestMatch } from '../js/ui.js';

// Initialize with variant support (es_ES/es_MX)
initIPAIndexPage({
  databasePath: '../json/es_${variant}.json',
  variantRadioSelector: 'input[name="inlineRadioOptions"]',
  variantMapping: { IPA_Spain: 'ES', IPA_Mexico: 'MX' },
  process: processTextLongestMatch,
  getLanguage: () => {
    const variant = document.querySelector('input[name="inlineRadioOptions"]:checked')?.id;
    return variant === 'IPA_Spain' ? 'es-ES' : 'es-MX';
  },
  gameLabel: 'spanish',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Compartir', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list-es', icon: 'globe', label: 'IPA España', type: 'link', href: './ipa_list_es.html' },
    { id: 'ipa-list-mx', icon: 'globe', label: 'IPA México', type: 'link', href: './ipa_list_mx.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Juego quiz', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Otros idiomas', type: 'lang' }
  ]
});
