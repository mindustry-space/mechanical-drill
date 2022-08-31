// For more information, see https://crawlee.dev/
import { CheerioCrawler, ProxyConfiguration } from "crawlee";
import { router } from "./routes.js";

const crawler = new CheerioCrawler({
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: router,
});

await crawler.run(["https://anuke.itch.io/mindustry/devlog"]);
