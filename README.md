# mechanical-drill

This repository contains scripts that scrape Mindustry data.

Currently it can scrape:

- bundles from Mindustry's Git repository using [git-cat-file](https://github.com/kawanet/git-cat-file) and [simple-git](https://github.com/steveukx/git-js)
- changelogs and releases from [itch.io](https://anuke.itch.io/mindustry) using [Crawlee](https://crawlee.dev/)
- changelogs, downloads and releases from [GitHub](https://github.com/Anuken/Mindustry/releases) using [the official REST client](https://github.com/octokit/octokit.js)

Output data is available in [the lead repository](https://github.com/mindustry-space/lead).
