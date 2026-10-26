/**
 * Display format utilities for IPA translation output.
 * Pure functions — no DOM dependency. Reusable by agent.html and ipa-index-page.js.
 */

/**
 * Apply a formatter function to each pair's IPA value.
 * Wraps raw IPA in /.../, runs through the formatter, extracts formatted content.
 */
export function formatPairIPAs(pairs, formatter) {
  if (!formatter) return pairs;
  return pairs.map(([word, ipa]) => {
    if (!ipa) return [word, ipa];
    const formatted = formatter('/' + ipa + '/');
    const match = formatted.match(/\/(.+?)\//);
    return [word, match ? match[1] : formatted];
  });
}

/**
 * Format pairs as a JSON array of {word, ipa, formatted} objects.
 */
export function formatAsJSON(pairs, formatter) {
  const formattedPairs = formatPairIPAs(pairs, formatter);
  const output = pairs.map(([word, ipa], i) => ({
    word,
    ipa: ipa || '',
    formatted: (formattedPairs[i] || [])[1] || ''
  }));
  return JSON.stringify(output, null, 2);
}

/**
 * Format pairs as CSV with header row.
 */
export function formatAsCSV(pairs, formatter) {
  const formattedPairs = formatPairIPAs(pairs, formatter);
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = ['"word","ipa","formatted"'];
  for (let i = 0; i < pairs.length; i++) {
    const [word, ipa] = pairs[i];
    rows.push([q(word), q(ipa || ''), q((formattedPairs[i] || [])[1] || '')].join(','));
  }
  return rows.join('\n');
}

/**
 * Strip HTML tags from formatted text output.
 */
export function stripHTML(text) {
  return text.replace(/<[^>]+>/g, '');
}
