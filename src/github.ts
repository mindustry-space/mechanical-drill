import { KeyValueStore, log } from "crawlee";
import { Octokit } from "octokit";

export async function scrapeGitHubReleases(octokit: Octokit) {
  const store = await KeyValueStore.open("github_releases");

  log.info("Scraping GitHub releases");
  for await (const { data: releases } of octokit.paginate.iterator(
    "GET /repos/{owner}/{repo}/releases",
    {
      owner: "Anuken",
      repo: "Mindustry",
      per_page: 100,
    }
  )) {
    for (const release of releases) {
      await store.setValue(release.tag_name, {
        assets: release.assets
          .filter(({ state }) => state === "uploaded") // https://api.github.com/repos/Anuken/Mindustry/releases/assets/63716232
          .map((asset) => ({
            browser_download_url: asset.browser_download_url,
            content_type: asset.content_type,
            id: asset.id,
            name: asset.name,
            size: asset.size,
          })),
        body: release.body,
        html_url: release.html_url,
        id: release.id,
        name: release.name,
        prerelease: release.prerelease,
        published_at: release.published_at,
        tag_name: release.tag_name,
        tarball_url: release.tarball_url,
        zipball_url: release.zipball_url,
      });
    }
  }
  log.info("Finished scraping GitHub releases");
}
