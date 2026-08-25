export interface IndexedSymbol {
  id: string;
  repoFullName: string;
  filePath: string;
  symbolName: string;
  symbolType: "function" | "class" | "method" | "arrow" | "export";
  signature: string;
  snippet: string;
  startLine: number;
  endLine: number;
  language: "js" | "ts" | "jsx" | "tsx";
}
