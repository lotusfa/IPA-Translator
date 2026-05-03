/**
 * Core Utilities - Shared primitives used by ipa.js and page/ modules.
 * Contains DOM utilities, data loading, and event helpers.
 */

// ============================================
// Data Loading
// ============================================

/**
 * Normalize IPA data from JSON format into a flat lookup object
 * Simply gets the first key from the JSON and uses its array
 * This works universally for all single-key formats: "yue", "en_US", "zh_hans", etc.
 *
 * @param {object} langData - Raw JSON data
 * @returns {object} Flat lookup object: { word: ipa, char: ipa }
 */
export function normalizeIPAData(langData) {
  const normalized = {};

  // Get the first (and typically only) key from the JSON
  // This works for all single-key formats: "yue", "en_US", "zh_hans", etc.
  const firstKey = Object.keys(langData)[0];
  const dataArray = firstKey ? langData[firstKey] : [];

  // Flatten into lookup object
  if (Array.isArray(dataArray)) {
    dataArray.forEach(entry => {
      Object.keys(entry).forEach(key => {
        normalized[key] = entry[key];
      });
    });
  }

  return normalized;
}

/**
 * Load IPA database from JSON file with error handling
 * Simply loads the JSON and normalizes using the first key
 *
 * @param {object} options - Configuration object:
 *   @param {string} options.basePath - Base path to JSON file (e.g., "../json/yue.json")
 *   @param {function} options.onSuccess - Callback with normalized lookup object
 *   @param {function} [options.onError] - Optional error callback
 *
 * Example usage:
 *   loadIPADatabase({ basePath: '../json/yue.json', onSuccess: (data) => { ... } });
 */
export function loadIPADatabase(options) {
  const { basePath, onSuccess, onError } = options;

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var langData = JSON.parse(this.responseText);
      const lookup = normalizeIPAData(langData);
      onSuccess(lookup);
    } else if (this.readyState == 4) {
      const errorMsg = "Failed to load database: " + this.status;
      console.error(errorMsg);
      if (onError) onError(errorMsg);
    }
  };

  xmlhttp.onerror = function () {
    const errorMsg = "Network error loading IPA database";
    console.error(errorMsg);
    if (onError) onError(errorMsg);
  };

  xmlhttp.open("GET", basePath, true);
  xmlhttp.send();
}

// ============================================
// DOM Utilities
// ============================================

/**
 * Safely get DOM element value
 * @param {string} elementId - Element ID
 * @returns {string} Element value or empty string
 */
export function getElementValue(elementId) {
  const el = document.getElementById(elementId);
  return el ? el.value : "";
}

/**
 * Safely set DOM element value
 * @param {string} elementId - Element ID
 * @param {string} value - Value to set
 */
export function setElementValue(elementId, value) {
  const el = document.getElementById(elementId);
  if (el) el.value = value;
}

/**
 * Set element value with fade-in animation for smoother visual transition
 * @param {string} elementId - Element ID
 * @param {string} value - Value to set
 * @param {number} animationDuration - Animation duration in ms (default: 300)
 */
export function setElementValueAnimated(elementId, value, animationDuration = 300) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.value = value;

  // Apply fade-in animation
  el.classList.add('ipa-fade-in');

  // Remove animation class after completion
  setTimeout(() => {
    el.classList.remove('ipa-fade-in');
  }, animationDuration);
}

/**
 * Check if element exists and is checked (for checkboxes/radios)
 * @param {string} elementId - Element ID
 * @returns {boolean} Whether element exists and is checked
 */
export function isElementChecked(elementId) {
  const el = document.getElementById(elementId);
  return el && el.checked;
}

// ============================================
// Event Helpers
// ============================================

/**
 * Add input handler that triggers translation
 * @param {string} inputId - Input textarea element ID
 * @param {function} handler - Handler function
 */
export function onTextInputChange(inputId, handler) {
  const input = document.getElementById(inputId);
  if (input) {
    input.addEventListener("input", handler);

    // Select all on focus
    input.addEventListener("focus", function () {
      this.select();
    });
  }
}

/**
 * Add change handler to multiple radio/checkbox elements
 * @param {string} selector - CSS selector for elements
 * @param {function} handler - Handler function
 */
export function onMultipleChange(selector, handler) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.addEventListener("change", handler);
  });
}
