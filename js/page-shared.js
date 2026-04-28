/**
 * Set up dark mode toggle
 * @param {string} toggleId - ID of the theme toggle button element
 */
export function initDarkMode(toggleId) {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;

  const iconImg = toggle.querySelector(".icon");
  const savedTheme = localStorage.getItem("theme");

  // Set initial state
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (iconImg) iconImg.src = "../img/dark-mode.svg";
  } else {
    if (iconImg) iconImg.src = "../img/light-mode.svg";
  }

  // Add click handler
  toggle.addEventListener("click", function () {
    toggle.classList.add("btn-theme-transition");
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    if (iconImg) {
      iconImg.src = isDark ? "../img/dark-mode.svg" : "../img/light-mode.svg";
    }

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

/**
 * Generate and insert language buttons for "Other Languages" section
 * Reads from config/languages.json and dynamically builds the list
 * USED BY: Both index.html and ipa_list*.html pages
 *
 * @param {object} options - Options:
 *   @param {string} options.containerId - ID of container element (default: "lang-buttons-container")
 *   @param {string} options.configPath - Path to languages.json config file (default: "../config/languages.json")
 *   @param {string} options.wrapperTag - HTML tag to wrap each item (default: "li")
 */
export async function generateLanguageButtons(options) {
  const {
    containerId = "lang-buttons-container",
    configPath = "../config/languages.json",
    wrapperTag = "li"
  } = options;

  try {
    const response = await fetch(configPath);
    if (!response.ok) {
      throw new Error(`Failed to load language config: ${response.status}`);
    }

    const langConfig = await response.json();
    const container = document.getElementById(containerId);

    if (!container) {
      throw new Error(`Container with ID "${containerId}" not found`);
    }

    const languages = langConfig.languages || [];
    let html = "";

    languages.forEach(lang => {
      const name = lang.name || lang.nativeName || lang.code;
      const href = lang.indexPath || "#";
      const isCurrent = lang.isActive === true;
      const style = isCurrent ? 'style="font-weight: bold; color: var(--accent-color);"' : "";

      html += `<${wrapperTag} ${style}><a href="${href}">${name}</a></${wrapperTag}>`;
    });

    container.innerHTML = html;
  } catch (e) {
    console.error(e.message);
  }
}

/**
 * Initialize language buttons on page load
 * Helper function to call generateLanguageButtons when DOM is ready
 */
export function initLanguageButtons(options) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      generateLanguageButtons(options);
    });
  } else {
    generateLanguageButtons(options);
  }
}

/**
 * Set textarea rows based on screen width and re-check on resize
 */
export function initResponsiveTextareaRows(options = {}) {
  const isMobile = window.innerWidth <= 768;
  const mobileRows = options.mobileRows || 5;
  const desktopRows = options.desktopRows || 10;
  const targets = options.targets || null;

  const getAllTargets = () => targets
    ? targets.map(id => document.getElementById(id)).filter(el => el)
    : document.querySelectorAll('textarea[id$="_tBox"]');

  // Set initial rows
  getAllTargets().forEach(textarea => {
    textarea.rows = isMobile ? mobileRows : desktopRows;
  });

  // Re-check on window resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const nowIsMobile = window.innerWidth <= 768;
      getAllTargets().forEach(textarea => {
        textarea.rows = nowIsMobile ? mobileRows : desktopRows;
      });
    }, 250);
  });
}
