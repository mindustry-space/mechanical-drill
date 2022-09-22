import { KeyValueStore, Log } from "crawlee";
import { simpleGit } from "simple-git";
import { openLocalRepo } from "git-cat-file";

const source = "../Mindustry";
const cat = openLocalRepo(source + "/.git");
const git = simpleGit(source, { trimmed: true });

const bundlesStore = await KeyValueStore.open("bundles");
const log = new Log({ prefix: "Git" });

export async function scrapeBundles(rev: string) {
  let bundles: {
    [name: string]: {
      [key: string]: string;
    };
  } = {};

  const rawTree = await git.raw(["ls-tree", rev, "core/assets/bundles/"]);
  const tree = Object.fromEntries(
    rawTree.split("\n").map((object) => {
      const [data, path] = object.split("\t");
      return [data.split(" ")[2], path];
    })
  );

  await Promise.all(
    Object.entries(tree).map(async ([id, path]) => {
      const name = path.split("/bundles/")[1];
      bundles[name] = {};

      (await cat.getObject(id)).data
        .toString()
        .split("\n")
        .map((v) => v.trim())
        .map((line) => {
          if (line == "") return;

          let [k, v] = line.split(" = ");
          bundles[name][k] = v;
        });
    })
  );

  await bundlesStore.setValue(rev, bundles);
}

export async function scrapeFromGit() {
  log.info("Starting to scrape");

  const tags = (await git.tags()).all;
  await Promise.all(
    tags.map(async (tag) => {
      await Promise.all([scrapeBundles(tag)]);
      log.info("Scraped from " + tag);
    })
  );
}
