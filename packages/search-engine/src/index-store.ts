import { tokenize } from "./tokenizer";
import type { IndexedSymbol } from "./types";

export class IndexStore {
  private documents = new Map<string, IndexedSymbol>();
  private invertedIndex = new Map<string, Set<string>>(); // token -> doc ids
  private nameTokens = new Map<string, Set<string>>(); // docId -> set of tokens from symbolName


  addDocument(doc: IndexedSymbol): void {
    this.documents.set(doc.id, doc);

    const nameTokenSet = new Set(tokenize(doc.symbolName));

    this.nameTokens.set(doc.id, nameTokenSet);

    // tokenize the fields worth searching
    const allTokens = new Set([
      ...tokenize(doc.symbolName),
      ...tokenize(doc.signature),
    ]);

    for (const token of allTokens) {
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

     const scored = matchingIds.map(id => {
      const doc = this.documents.get(id)!;
      const nameSet = this.nameTokens.get(id) ?? new Set();

      let score = 0;
      for (const qToken of queryTokens) {
        if (doc.symbolName.toLowerCase() === qToken) {
          score += 10; // exact full-name match
        } else if (nameSet.has(qToken)) {
          score += 5;  // token matched symbolName
        } else {
          score += 1;  // only signature
        }
      }
      return { doc, score };
    });

    scored.sort((a, b) => b.score - a.score);

    console.log(scored)

    return scored.map(s => s.doc);
  }
}
