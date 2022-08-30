#!/usr/bin/env nix-shell
#!nix-shell -i python3 -p python3 python3Packages.orjson python3Packages.PyGithub python3Packages.rich
from collections import defaultdict
from github import Github
import orjson
from os import environ
from rich.progress import track

github = Github(environ["GITHUB_TOKEN"])
release_types = {
    "Mindustry.jar": "desktop",
    "desktop-release.jar": "desktop",
    "server-release.jar": "server",
}
repo = github.get_repo(89822531)
versions = defaultdict(dict)
for release in track(repo.get_releases()):
    if release.draft:
        continue

    for key in [
        "body",
        "html_url",
        "id",
        "prerelease",
        "published_at",
        "tarball_url",
        "title",
        "zipball_url",
    ]:
        versions[release.tag_name][key] = getattr(release, key)

    versions[release.tag_name]["assets"] = defaultdict(dict)
    for asset in release.get_assets():
        if asset.state != "uploaded":
            # https://api.github.com/repos/Anuken/Mindustry/releases/assets/63716232
            continue
        
        for key in ["browser_download_url", "content_type", "id", "name", "size"]:
            versions[release.tag_name]["assets"][release_types[asset.name]][
                key
            ] = getattr(asset, key)


with open("versions.json", "wb") as file:
    file.write(
        orjson.dumps(
            versions,
            option=orjson.OPT_APPEND_NEWLINE
            | orjson.OPT_INDENT_2
            | orjson.OPT_SORT_KEYS,
        )
    )
