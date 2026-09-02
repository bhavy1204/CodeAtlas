import "dotenv/config";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
    throw new Error("Missing GITHUB_TOKEN in .env");
}

interface GitTreeItem {
    path: string;
    type: "blob" | "tree";
}

async function listRepoFiles(owner: string, repo: string, branch = "main"): Promise<string[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
        },
    });

    if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const data: any = await res.json();
    const tree: GitTreeItem[] = data.tree;

    return tree
        .filter(item => item.type === "blob") // "blob" = file, "tree" = folder
        .map(item => item.path)
        .filter(path => path.endsWith(".js") || path.endsWith(".ts"));
}

async function fetchFileContent(owner: string, repo: string, path: string): Promise<string> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.raw+json",
        },
    });
    // console.log(res)
    if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    return res.text();
}

async function main() {
    const files = await listRepoFiles("lodash", "lodash");
    console.log(`Found ${files.length} JS/TS files`);
    console.log(files.slice(0, 20));

    const content = await fetchFileContent("lodash", "lodash", files[0]);
    console.log("--- content of", files[0], "---");
    console.log(content.slice(0, 300));
}

main().catch(console.error);