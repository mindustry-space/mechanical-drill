import { Dataset, createCheerioRouter, CheerioCrawler } from "crawlee";

const itch = await Dataset.open("itch");
const router = createCheerioRouter();
const crawler = new CheerioCrawler({ requestHandler: router });

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
  log.info("enqueuing ");
  await enqueueLinks({
    globs: ["https://anuke.itch.io/mindustry/devlog/**"],
    label: "itch",
  });
});

type Upload = {
  date: string;
  name: string;
  platforms: string[];
  size: string;
};

router.addHandler("itch", async ({ request, $, log }) => {
  log.info("scraping " + request.loadedUrl);

  let uploads: Upload[] = [];
  $(".upload").each((_, upload) => {
    let platforms: string[] = [];
    $(upload)
      .find(".download_platforms span")
      .each((_, platform) => {
        let title = $(platform).attr("title");
        if (!title) throw "Could not find title";
        platforms.push(title.replace("Download for ", ""));
      });

    let date = $(upload).find(".upload_date").children("abbr").attr("title");
    let name = $(upload).find(".name").text();
    let size = $(upload).find(".file_size").text();

    if (!(date && name && size)) throw "Could not scrape uploads";
    uploads.push({
      date: date,
      name: name,
      platforms,
      size: size,
    });
  });

  await itch.pushData({
    body: $("section.post_body").html(),
    published_at: $("div.post_meta").children("span").attr("title"),
    title: $("section.post_header").children("h1").text(),
    uploads,
    url: request.loadedUrl,
  });
});

export async function scrapeItchDevlogs() {
  await crawler.run(["https://anuke.itch.io/mindustry/devlog"]);
}
