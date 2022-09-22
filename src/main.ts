import { Octokit } from "octokit";

import { scrapeFromGit } from "./git.js";
import { scrapeFromGitHub } from "./github.js";
import { scrapeFromItch } from "./itch.js";

if (!process.env.GITHUB_TOKEN)
  throw "GITHUB_TOKEN environment variable is not set.";

Promise.all([
  scrapeFromGit(),
  scrapeFromGitHub(
    new Octokit({
      auth: process.env.GITHUB_TOKEN,
      timeZone: "Etc/UTC",
    })
  ),
  scrapeFromItch(),
]);
