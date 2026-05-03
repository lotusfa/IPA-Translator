import { initIPAIndexPage } from '../js/page/ipa-index-page.js';
import { processTextLongestMatch } from '../js/ipa.js';

initIPAIndexPage({
  databasePath: '../json/pt_BR.json',
  process: processTextLongestMatch,
  ttsLanguage: 'pt-BR',
  locale: { textAndIpa: '(Texto /ipa/)', onlyIpa: 'Apenas /ipa/' },
  gameLabel: 'portuguese',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: 'Compartilhar', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'Banco de Dados IPA', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: 'Jogo quiz', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: 'Outros idiomas', type: 'lang' }
  ]
});
