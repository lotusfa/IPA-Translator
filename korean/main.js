import { initIPAIndexPage } from '../js/page/ipa-index-page.js';
import { processKorean } from '../js/ipa.js';

initIPAIndexPage({
  databasePath: '../json/ko.json',
  process: processKorean,
  locale: { textAndIpa: '(문자 /ipa/)', onlyIpa: '/ipa/ 만' },
  maxWordLength: 6,
  ttsLanguage: 'ko-KR',
  gameLabel: 'korean',
  languageSelectorId: 'lang-selector-btn',
  footerToolsContainerId: 'footer-tools',
  toolsConfig: [
    { id: 'share-btn', icon: 'share', label: '공유', type: 'share', visible: 'after-translate' },
    { id: 'ipa-list', icon: 'globe', label: 'IPA 데이터베이스', type: 'link', href: './ipa_list.html' },
    { id: 'game-btn', icon: 'gamepad', label: '퀴즈 게임', type: 'game', visible: 'after-translate' },
    { id: 'lang-btn', icon: 'lang', label: '다른 언어', type: 'lang' },
  ]
});