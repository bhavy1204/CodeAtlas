import axios from "axios";
import { configDotenv } from "dotenv";

export const githubApi = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
    }
});
