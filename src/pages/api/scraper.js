// import express from "express";
// import next from "next";
// import { fetchNewsFromRSS } from "./src/services/rssFetcher.js";
// import { newsSources } from "./src/config/newsSources.js"; // Import updated sources

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   (async () => {
//     try {
//       console.log("Fetching news from all sources...");
//       for (const country of newsSources) {
//         for (const source of country.sources) {
//           console.log(`🔄 Fetching ${source.name} from ${country.countryName}...`);
//           await fetchNewsFromRSS(source.rss, country.countryCode, country.countryName, source.name);
//         }
//       }
//       console.log("✅ All RSS feeds fetched successfully!");
//     } catch (error) {
//       console.error("❌ Error fetching news:", error);
//     }
//   })();

//   server.all("*", (req, res) => handle(req, res));

//   const port = process.env.PORT || 3000;
//   server.listen(port, (err) => {
//     if (err) throw err;
//     console.log(`> Ready on http://localhost:${port}`);
//   });
// }).catch((ex) => {
//   console.error(ex.stack);
//   process.exit(1);
// });


import express from "express";
import next from "next";
import { fetchNewsFromRSS } from "./src/services/rssFetcher.js";
import { newsSources } from "./src/config/newsSources.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  (async () => {
    try {
      console.log("Fetching news from all sources...");
      for (const country of newsSources) {
        for (const source of country.sources) {
          console.log(`🔄 Fetching from ${source.name} in ${country.countryName}...`);
          
          // Fetch from each category
          for (const categoryItem of source.categories) {
            console.log(`📰 Fetching ${categoryItem.name} category...`);
            await fetchNewsFromRSS(
              categoryItem.rss, 
              country.countryCode, 
              country.countryName, 
              source.name,
              categoryItem.name
            );
          }
        }
      }
      console.log("✅ All RSS feeds fetched successfully!");
    } catch (error) {
      console.error("❌ Error fetching news:", error);
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