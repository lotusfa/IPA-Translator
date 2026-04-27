/**
 * Share Module — compress/encode data into shareable URLs and render share buttons.
 * Used by: game/game.js, js/ui.js (translation pages)
 */

import { svgShare, svgTick } from './svg.js';

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
// Share Button UI
// ============================================

/**
 * Create a share button element and attach click handler.
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

  btn.addEventListener('click', async () => {
    const data = await Promise.resolve(getShareData());
    if (!data) return;
    const b64 = await compressAndEncode(data);
    const url = new URL(window.location.href);
    url.searchParams.set('d', b64);
    await copyToClipboard(url.toString());
    btn.innerHTML = svgTick;
    setTimeout(() => { btn.innerHTML = svgShare; }, 2000);
  });

  if (parentEl) parentEl.appendChild(btn);

  return btn;
}
