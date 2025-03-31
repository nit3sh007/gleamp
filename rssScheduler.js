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
// 
import cron from "node-cron";
import dotenv from "dotenv";
import { newsSources } from "./src/config/newsSources.js";
import { connectDB } from "./src/lib/db.js";
import { fetchNewsFromRSS } from "./src/services/rssFetcher.js";

dotenv.config();
console.log("📌 rssScheduler.js is starting...", new Date().toISOString());

// Function to run the scraping
async function runNewsScraping() {
  console.log("⏳ Scraping news started at", new Date().toISOString());
  
  try {
    // Ensure DB is connected before scraping
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");
    
    let totalSources = 0;
    let completedSources = 0;
    let failedSources = 0;
    
    for (const country of newsSources) {
      console.log(`\n🌍 Processing country: ${country.countryName}`);
      
      for (const source of country.sources) {
        console.log(`📰 Processing source: ${source.name}`);
        totalSources++;
        
        // Process each category for each source
        for (const category of source.categories) {
          try {
            console.log(`  📑 Fetching ${category.name} category from ${source.name}...`);
            await fetchNewsFromRSS(
              category.rss,
              country.countryCode,
              country.countryName,
              source.name,
              category.name
            );
            console.log(`  ✅ Successfully fetched ${category.name} from ${source.name}`);
          } catch (categoryError) {
            console.error(`  ❌ Error fetching ${category.name} from ${source.name}:`, categoryError);
            failedSources++;
          }
        }
        completedSources++;
      }
    }
    
    console.log("\n📊 Scraping Summary:");
    console.log(`  Total sources: ${totalSources}`);
    console.log(`  Completed sources: ${completedSources}`);
    console.log(`  Failed sources: ${failedSources}`);
    console.log("✅ Scraping process completed at", new Date().toISOString());
  } catch (error) {
    console.error("❌ Critical error during news scraping:", error);
  }
}

// Fix the cron schedule syntax
cron.schedule("0 */1 * * *", () => {
  console.log("🕒 Scheduled hourly task triggered at", new Date().toISOString());
  runNewsScraping();
});

// Run immediately once on startup
console.log("🚀 Running initial scraping...");
runNewsScraping()
  .then(() => console.log("✅ Initial scraping completed"))
  .catch(err => console.error("❌ Initial scraping failed:", err));

console.log("⏱️ Scraper scheduler is active. Will run at the top of every hour.");