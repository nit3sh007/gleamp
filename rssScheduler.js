// import cron from "node-cron";
// import dotenv from "dotenv";
// import { newsSources } from "./src/config/newsSources.js";
// import { connectDB } from "./src/lib/db.js"; 
// import { fetchNewsFromRSS } from "./src/services/rssFetcher.js";

// dotenv.config();
// console.log("📌 rssScheduler.js is starting...");

// // Function to run the scraping
// async function runNewsScraping() {
//   try {
//     console.log("⏳ Scraping news started at", new Date().toLocaleTimeString());
//     // Ensure DB is connected before scraping
//     await connectDB();
    
//     for (const country of newsSources) {
//       console.log(`🌍 Processing country: ${country.countryName}`);
      
//       for (const source of country.sources) {
//         console.log(`📰 Processing source: ${source.name}`);
        
//         // Process each category for each source
//         for (const category of source.categories) {
//           console.log(`📑 Fetching ${category.name} category...`);
//           await fetchNewsFromRSS(
//             category.rss,
//             country.countryCode,
//             country.countryName,
//             source.name,
//             category.name
//           );
//         }
//       }
//     }
//     console.log("✅ Scraping completed successfully!");
//   } catch (error) {
//     console.error("❌ Error during news scraping:", error);
//   }
// }

// // Run immediately once
// runNewsScraping();

// // Schedule scraping every hour (adjust as needed)
// cron.schedule("*/1 * * * *", runNewsScraping);

// console.log("✅ Scraper scheduler started. Will run hourly.");






import cron from "node-cron";
import dotenv from "dotenv";
import { newsSources } from "./src/config/newsSources.js";
import { connectDB } from "./src/lib/db.js";
import { fetchNewsFromRSS } from "./src/services/rssFetcher.js";

dotenv.config();
console.log("📌 rssScheduler.js is starting...");

/**
 * Runs the scraping process
 */
async function runNewsScraping() {
  try {
    console.log("⏳ Scraping news started at", new Date().toLocaleTimeString());
    await connectDB();

    await Promise.all(newsSources.map(async (country) => {
      console.log(`🌍 Processing country: ${country.countryName}`);

      await Promise.all(country.sources.map(async (source) => {
        console.log(`📰 Processing source: ${source.name}`);

        await Promise.all(source.categories.map(async (category) => {
          console.log(`📑 Fetching ${category.name} category from ${source.name}...`);
          
          try {
            await fetchNewsFromRSS(
              category.rss,
              country.countryCode,
              country.countryName,
              source.name,
              category.name
            );
          } catch (error) {
            console.error(`❌ Error in ${source.name} (${category.name}):`, error);
          }
        }));
      }));
    }));

    console.log("✅ Scraping completed successfully!");
  } catch (error) {
    console.error("❌ Critical error during news scraping:", error);
  }
}

// Run immediately once
runNewsScraping();

// Schedule scraping every 30 minutes
cron.schedule("*0 20 * * * *", runNewsScraping);

console.log("✅ Scraper scheduler started. Running every 30 minutes.");
