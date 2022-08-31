import { Dataset, createCheerioRouter } from "crawlee";

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
  log.info(`enqueueing new URLs`);
  await enqueueLinks({
    globs: ["https://anuke.itch.io/mindustry/devlog/**"],
    label: "devlog",
  });
});

router.addHandler("devlog", async ({ request, $, log }) => {
  log.info(request.loadedUrl);

  await Dataset.pushData({
    url: request.loadedUrl,
    title: $("section.post_header").children("h1").text(),
    body: $("section.post_body").html(),
    published_at: $("div.post_meta").children("span").attr("title"),
  });
});
