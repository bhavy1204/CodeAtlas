import { tokenize } from "./tokenizer";
import type { IndexedSymbol } from "./types";

export class IndexStore {
  private documents = new Map<string, IndexedSymbol>();
  private invertedIndex = new Map<string, Set<string>>(); // token -> doc ids

  addDocument(doc: IndexedSymbol): void {
    this.documents.set(doc.id, doc);

    // tokenize the fields worth searching
    const tokens = new Set([
      ...tokenize(doc.symbolName),
      ...tokenize(doc.signature),
    ]);

    for (const token of tokens) {
      if (!this.invertedIndex.has(token)) {
        this.invertedIndex.set(token, new Set());
      }
      this.invertedIndex.get(token)!.add(doc.id);
    }
  }

  getDocumentIds(token: string): Set<string> {
    return this.invertedIndex.get(token.toLowerCase()) ?? new Set();
  }

  getDocument(id: any): IndexedSymbol | undefined {
    return this.documents.get(id);
  }

  search(query: string): IndexedSymbol[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const idSets = queryTokens.map(token => this.getDocumentIds(token))

    if (idSets.length === 0) return [];

    const first = idSets[0];
    const rest = idSets.slice(1);

    if (!first) {
      return []
    }

    const matchingIds = [...first].filter(id =>
      rest.every(set => set.has(id))
    );

    return matchingIds
      .map(id => this.documents.get(id))
      .filter((doc): doc is IndexedSymbol => doc !== undefined);
  }
}
