import { Octokit } from "octokit";
import { scrapeGitHubReleases } from "./github.js";
import { scrapeItchDevlogs } from "./itch.js";

if (!process.env.GITHUB_TOKEN)
  throw "GITHUB_TOKEN environment variable is not set.";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  timeZone: "Etc/UTC",
});

await Promise.all([scrapeItchDevlogs(), scrapeGitHubReleases(octokit)]);
