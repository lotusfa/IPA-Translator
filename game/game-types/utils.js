// Shared helpers for game types — no imports from other game-types to avoid circular deps

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateOptions(allPairs, correct, isWord = false) {
  // Generate 4 options: correct + 3 random distractors
  const pool = allPairs.filter(p => (isWord ? p[0] : p[1]) !== correct);
  const distractors = shuffle(pool).slice(0, 3).map(p => isWord ? p[0] : p[1]);
  return shuffle([correct, ...distractors]);
}

// ============================================
// Share — encode game data into a URL param
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
  // Fallback — no compression
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
