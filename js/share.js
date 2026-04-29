/**
 * Share Module — compress/encode data into shareable URLs and render share buttons.
 * Used by: game/game.js, js/ui.js (translation pages)
 */

import { svgShare } from './svg.js';

// ============================================
// Encoding / Decoding
// ============================================

export async function compressAndEncode(data) {
  const json = JSON.stringify(data);
  if ('CompressionStream' in globalThis) {
    const stream = new CompressionStream('deflate');
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();
    writer.write(encoder.encode(json));
    writer.close();
    const chunks = [];
    const reader = stream.readable.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    const bytes = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0));
    let offset = 0;
    for (const c of chunks) {
      bytes.set(c, offset);
      offset += c.length;
    }
    return btoa(String.fromCharCode(...bytes));
  }
  return btoa(unescape(encodeURIComponent(json)));
}

export async function decodeAndDecompress(b64) {
  try {
    const json = atob(b64);
    if ('CompressionStream' in globalThis) {
      const bytes = Uint8Array.from(json, c => c.charCodeAt(0));
      const stream = new DecompressionStream('deflate');
      const writer = stream.writable.getWriter();
      writer.write(bytes);
      writer.close();
      const chunks = [];
      const reader = stream.readable.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const concatenated = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0));
      let off = 0;
      for (const c of chunks) { concatenated.set(c, off); off += c.length; }
      return JSON.parse(new TextDecoder().decode(concatenated));
    }
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

// ============================================
// URL Helpers
// ============================================

export function parseShareFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const b64 = params.get('d');
  if (!b64) return null;
  return decodeAndDecompress(b64);
}

export function clearShareParams() {
  const url = new URL(window.location.href);
  url.searchParams.delete('d');
  window.history.replaceState({}, '', url);
}

// ============================================
// Clipboard
// ============================================

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

// ============================================
// Share Modal
// ============================================

let shareModalInstance = null;

function getShareModal() {
  if (!shareModalInstance) {
    shareModalInstance = buildShareModal();
  }
  return shareModalInstance;
}

function buildShareModal() {
  const overlay = document.createElement('div');
  overlay.className = 'share-modal-overlay';
  overlay.innerHTML = `
    <div class="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
      <button class="share-modal-close btn-icon" aria-label="Close">&times;</button>
      <h3 id="share-modal-title">Share</h3>
      <button class="share-native-btn" style="display:none;">Share</button>
      <input class="share-url-field" type="text" readonly />
      <button class="copy-link-btn">Copy Link</button>
    </div>`;

  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('.share-modal-close');
  const nativeBtn = overlay.querySelector('.share-native-btn');
  const copyBtn = overlay.querySelector('.copy-link-btn');
  const urlField = overlay.querySelector('.share-url-field');

  let currentUrl = '';

  const close = () => {
    overlay.style.display = 'none';
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display !== 'none') close();
  });

  nativeBtn.addEventListener('click', async () => {
    try {
      await navigator.share({ url: currentUrl });
    } catch { /* user cancelled */ }
  });

  copyBtn.addEventListener('click', async () => {
    await copyToClipboard(currentUrl);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => { copyBtn.textContent = 'Copy Link'; }, 2000);
  });

  const show = async (getShareData) => {
    const data = await Promise.resolve(getShareData());
    if (!data) return;
    const b64 = await compressAndEncode(data);
    const url = new URL(window.location.href);
    url.searchParams.set('d', b64);
    currentUrl = url.toString();
    urlField.value = currentUrl;

    if (typeof navigator.share === 'function') {
      nativeBtn.style.display = '';
    } else {
      nativeBtn.style.display = 'none';
    }

    overlay.style.display = 'flex';
  };

  return { overlay, show, close };
}

/**
 * Create a share button element and attach click handler.
 * Opens a modal with share options instead of copying directly.
 * @param {Object} options
 *   @param {Function} options.getShareData - Sync or async. Returns the data object to share (or null to skip).
 *   @param {string} [options.buttonId='share-btn']
 *   @param {string} [options.className='btn-icon']
 *   @param {HTMLElement} [options.parentEl] - Parent element to append to
 * @returns {HTMLElement} The created button
 */
export function createShareButton(options) {
  const {
    getShareData,
    buttonId = 'share-btn',
    className = 'btn-icon',
    parentEl
  } = options;

  const btn = document.createElement('button');
  btn.id = buttonId;
  btn.className = className;
  btn.setAttribute('aria-label', 'Share');
  btn.innerHTML = svgShare;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    getShareModal().show(getShareData);
  });

  if (parentEl) parentEl.appendChild(btn);

  return btn;
}
