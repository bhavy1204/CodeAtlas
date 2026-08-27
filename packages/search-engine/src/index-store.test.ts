import { IndexStore } from "./index-store";
import { IndexedSymbol } from "./types";

const store = new IndexStore();

const doc1: IndexedSymbol = {
  id: "101",
  repoFullName: "lodash/lodash",
  filePath: "src/debounce.js",
  symbolName: "debounce",
  symbolType: "function",
  signature: "function debounce(fn, wait)",
  snippet: "function debounce(fn, wait) { ... }",
  startLine: 20,
  endLine: 45,
  language: "js",
};

const doc2: IndexedSymbol = {
  id: "102",
  repoFullName: "user/lodash",
  filePath: "src/throttle.js",
  symbolName: "throttle",
  symbolType: "function",
  signature: "function throttle(fn, wait)",
  snippet: "function throttle(fn, wait) { ... }",
  startLine: 10,
  endLine: 30,
  language: "js",
};

store.addDocument(doc1);
store.addDocument(doc2);

console.log("search 'debounce':", store.getDocumentIds("debounce"));

console.log("search 'wait':", store.getDocumentIds("wait"));

console.log("search 'fn':", store.getDocumentIds("fn"));

const ids = store.getDocumentIds("throttle");
const firstId = [...ids][0];
console.log("fetched doc:", store.getDocument(firstId));
