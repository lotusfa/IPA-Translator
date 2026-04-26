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
