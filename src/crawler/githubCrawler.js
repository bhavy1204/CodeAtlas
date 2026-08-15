import { githubApi } from "../config/github.js";

async function getRepos(topic = "nodejs") {
    const res = await githubApi.get(`/search/repositories?q=topic:${topic}&sort=stars&order=desc`);

    return res.data.items;
}

async function run() {
    const repos = getRepos();
    console.log(`Fetched repos\n ${repos}`);
    
    
}

run()