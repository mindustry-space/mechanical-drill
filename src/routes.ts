import { Dataset, createCheerioRouter } from "crawlee";

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ enqueueLinks, log, request }) => {
  log.info(request.loadedUrl);
  await enqueueLinks({
    globs: ["https://anuke.itch.io/mindustry/devlog/**"],
    label: "itch",
  });
});

const itch = await Dataset.open("itch");

router.addHandler("itch", async ({ request, $, log }) => {
  log.info(request.loadedUrl);

  let uploads = [];
  $(".upload").each((i, upload) => {
    let platforms = [];
    $(upload)
      .find(".download_platforms span")
      .each((j, platform) => {
        platforms.push($(platform).attr("title").replace("Download for ", ""));
      });

    uploads.push({
      date: $(upload).find(".upload_date").children("abbr").attr("title"),
      name: $(upload).find(".name").text(),
      platforms,
      size: $(upload).find(".file_size").text(),
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
