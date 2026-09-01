import { tokenize } from "./tokenizer";
import type { IndexedSymbol } from "./types";
import * as fs from "fs"

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

  saveToFile(filePath: string): void {
    const data = {
      documents: [...this.documents.entries()],
      invertedIndex: [...this.invertedIndex.entries()].map(([token, ids]) => [
        token,
        [...ids],
      ]),
      nameTokens: [...this.nameTokens.entries()].map(([id, tokens]) => [
        id,
        [...tokens],
      ]),
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  static loadFromFile(filePath: string): IndexStore {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    const store = new IndexStore();
    store.documents = new Map(data.documents);
    store.invertedIndex = new Map(
      data.invertedIndex.map(([token, ids]: [string, string[]]) => [token, new Set(ids)])
    );
    store.nameTokens = new Map(
      data.nameTokens.map(([id, tokens]: [string, string[]]) => [id, new Set(tokens)])
    );
    return store;
  }
}
