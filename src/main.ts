import { CheerioCrawler, log } from "crawlee";
import { router } from "./routes.js";

const crawler = new CheerioCrawler({ requestHandler: router });
await crawler.run(["https://anuke.itch.io/mindustry/devlog"]);
