function splitCamelAndSnake(word: string): string[] {
  return word
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[_-]/)
    .join(" ")
    .split(" ")
    .filter(Boolean);
}

export function tokenize(input: string): string[] {
  const rawWords = input
    .split(/[^a-zA-Z0-9_-]+/)  
    .filter(Boolean);

  const tokens = new Set <string>();

  for (const word of rawWords) {
    const lower = word.toLowerCase();
    tokens.add(lower); 

    for (const piece of splitCamelAndSnake(word)) {
      tokens.add(piece.toLowerCase());
    }
  }

  return [...tokens];
}
