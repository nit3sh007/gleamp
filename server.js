// server.js
import express from "express";
import next from "next";
// import { scrapeAllSources } from "./src/pages/api/scraper.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Run the scraper on server startup:
  (async () => {
    try {
      //console.log("Running scraper on server startup...");
      const data = await scrapeAllSources();
      //console.log("Scraping finished on startup. Articles:", data.length);
    } catch (error) {
      //console.error("Error running scraper on startup:", error);
    }
  })();

  server.all("*", (req, res) => handle(req, res));

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
