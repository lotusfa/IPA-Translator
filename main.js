import { initDarkMode } from './js/page/page-shared.js';

initDarkMode('dark-mode-toggle');

// Build language grids from config
fetch('./config/languages.json')
  .then(r => r.json())
  .then(({ languages }) => {
    const sorted = [...languages].sort((a, b) => a.name.localeCompare(b.name));
    const links = sorted.map(lang =>
      `<li><a href="./${lang.code}/index.html">${lang.name}</a></li>`
    ).join('');

    // Main grid (no <li> wrapper for grid layout)
    const grid = document.getElementById('language-grid');
    if (grid) {
      grid.innerHTML = sorted.map(lang =>
        `<a href="./${lang.code}/index.html">${lang.name}</a>`
      ).join('');
    }

    // Footer language list
    const footer = document.getElementById('lang-buttons-container');
    if (footer) footer.innerHTML = links;
  });
