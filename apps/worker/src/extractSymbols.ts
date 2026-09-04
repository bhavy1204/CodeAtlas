import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import type {IndexedSymbol} from "@repo/search-engine"
import type {Node} from "@babel/types"

export function extractSymbols(
  code: string,
  meta: { repoFullName: string; filePath: string; language: IndexedSymbol["language"] }
): IndexedSymbol[] {
  const symbols: IndexedSymbol[] = [];

  let ast;
  try {
    ast = parse(code, {
      sourceType: "unambiguous",
      plugins: ["typescript", "jsx"],
    });
  } catch (err) {
    console.warn(`Failed to parse ${meta.filePath}:`, (err as Error).message);
    return [];
  }

  traverse(ast, {
    FunctionDeclaration(path) {
      if (!path.node.id) return;
      symbols.push(makeSymbol(path.node.id.name, "function", path.node, code, meta));
    },
    ClassDeclaration(path) {
      if (!path.node.id) return;
      symbols.push(makeSymbol(path.node.id.name, "class", path.node, code, meta));
    },
  });

  return symbols;
}

function makeSymbol(
  name: string,
  type: IndexedSymbol["symbolType"],
  node: Node,
  code: string,
  meta: { repoFullName: string; filePath: string; language: IndexedSymbol["language"] }
): IndexedSymbol {
  const startLine = node.loc?.start.line ?? 0;
  const endLine = node.loc?.end.line ?? 0;
  const snippet = code.slice(node.start ?? 0, node.end ?? 0).slice(0, 300);

  return {
    id: `${meta.repoFullName}:${meta.filePath}:${name}:${startLine}`,
    repoFullName: meta.repoFullName,
    filePath: meta.filePath,
    symbolName: name,
    symbolType: type,
    signature: snippet.split("\n")[0] ?? "",
    snippet,
    startLine,
    endLine,
    language: meta.language,
  };
}


