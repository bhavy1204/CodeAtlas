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
const doc3: IndexedSymbol = {
  id: "103",
  repoFullName: "some/repo",
  filePath: "src/wait.js",
  symbolName: "wait",
  symbolType: "function",
  signature: "function wait(ms)",
  snippet: "function wait(ms) { ... }",
  startLine: 1,
  endLine: 5,
  language: "js",
};

store.addDocument(doc3);
store.addDocument(doc1);
store.addDocument(doc2);

// console.log("search 'debounce':", store.getDocumentIds("debounce"));

// console.log("search 'wait':", store.getDocumentIds("wait"));

// console.log("search 'fn':", store.getDocumentIds("fn"));

const ids = store.getDocumentIds("throttle");
const firstId = [...ids][0];
// console.log("fetched doc:", store.getDocument(firstId));

console.log("------------------------------Search--------------------------------------\n")

// console.log("search('debounce'):", store.search("debounce").map(d => d.symbolName));
// console.log("search('wait'):", store.search("wait").map(d => d.symbolName));
// console.log("search('debounce wait'):", store.search("debounce wait").map(d => d.symbolName));
// console.log("search('throttle nonExistingENtity'):", store.search("throttle nonexistentword").map(d => d.symbolName));


console.log("search('wait') ranked:", store.search("wait").map(d => d.symbolName));
