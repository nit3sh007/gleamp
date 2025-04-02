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




// import cron from "node-cron";
// import dotenv from "dotenv";
// import { newsSources } from "./src/config/newsSources.js";
// import { connectDB } from "./src/lib/db.js";
// import { fetchNewsFromRSS } from "./src/services/rssFetcher.js";



// dotenv.config();
// console.log("📌 RSS Scheduler starting...");

// /**
//  * Runs the news scraping process
//  */
// async function runNewsScraping() {
//   console.log("⏳ News scraping started at", new Date().toLocaleTimeString());
  
//   try {
//     await connectDB();
    
//     // Track statistics
//     let processedSources = 0;
//     let processedCategories = 0;
//     let successfulCategories = 0;
    
//     // Process countries sequentially to avoid overloading
//     for (const country of newsSources) {
//       console.log(`🌍 Processing country: ${country.countryName}`);
      
//       // Process up to 3 sources concurrently per country
//       const sourceBatches = [];
//       for (let i = 0; i < country.sources.length; i += 3) {
//         sourceBatches.push(country.sources.slice(i, i + 3));
//       }
      
//       for (const sourceBatch of sourceBatches) {
//         await Promise.all(sourceBatch.map(async (source) => {
//           console.log(`📰 Processing source: ${source.name}`);
//           processedSources++;
          
//           // Process up to 2 categories concurrently per source
//           const categoryBatches = [];
//           for (let i = 0; i < source.categories.length; i += 2) {
//             categoryBatches.push(source.categories.slice(i, i + 2));
//           }
          
//           for (const categoryBatch of categoryBatches) {
//             await Promise.all(categoryBatch.map(async (category) => {
//               processedCategories++;
              
//               try {
//                 console.log(`📑 Fetching ${category.name} category from ${source.name}...`);
//                 const results = await fetchNewsFromRSS(
//                   category.rss,
//                   country.countryCode,
//                   country.countryName,
//                   source.name,
//                   category.name
//                 );
                
//                 if (results && results.length > 0) {
//                   successfulCategories++;
//                 }
//               } catch (error) {
//                 console.error(`❌ Error in ${source.name} (${category.name}):`, error.message);
//               }
//             }));
            
//             // Small delay between category batches to prevent rate limiting
//             await new Promise(resolve => setTimeout(resolve, 1000));
//           }
//         }));
//       }
//     }
    
//     console.log("✅ Scraping completed!");
//     console.log(`📊 Summary: ${processedSources} sources, ${successfulCategories}/${processedCategories} categories successful`);
//   } catch (error) {
//     console.error("❌ Critical error during news scraping:", error);
//   }
// }

// // Run immediately once
// runNewsScraping();

// // Schedule scraping every 30 minutes
// cron.schedule("0 8 * * *", runNewsScraping);
// console.log("⏰ Scheduler started. Running everyday 8 pm.");
















import { newsSources } from "./src/config/newsSources.js";
import { connectDB } from "./src/lib/db.js";
import { fetchNewsFromRSS } from "./src/services/rssFetcher.js";

export default async function handler(req, res) {
  console.log("📌 RSS Scheduler running...");
  
  try {
    await connectDB();
    
    // Track statistics
    let processedSources = 0;
    let processedCategories = 0;
    let successfulCategories = 0;
    
    // Process countries sequentially to avoid overloading
    for (const country of newsSources) {
      console.log(`🌍 Processing country: ${country.countryName}`);
      
      // Process up to 3 sources concurrently per country
      const sourceBatches = [];
      for (let i = 0; i < country.sources.length; i += 3) {
        sourceBatches.push(country.sources.slice(i, i + 3));
      }
      
      for (const sourceBatch of sourceBatches) {
        await Promise.all(sourceBatch.map(async (source) => {
          console.log(`📰 Processing source: ${source.name}`);
          processedSources++;
          
          // Process up to 2 categories concurrently per source
          const categoryBatches = [];
          for (let i = 0; i < source.categories.length; i += 2) {
            categoryBatches.push(source.categories.slice(i, i + 2));
          }
          
          for (const categoryBatch of categoryBatches) {
            await Promise.all(categoryBatch.map(async (category) => {
              processedCategories++;
              
              try {
                console.log(`📑 Fetching ${category.name} category from ${source.name}...`);
                const results = await fetchNewsFromRSS(
                  category.rss,
                  country.countryCode,
                  country.countryName,
                  source.name,
                  category.name
                );
                
                if (results && results.length > 0) {
                  successfulCategories++;
                }
              } catch (error) {
                console.error(`❌ Error in ${source.name} (${category.name}):`, error.message);
              }
            }));
            
            // Small delay between category batches to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }));
      }
    }
    
    console.log("✅ Scraping completed!");
    console.log(`📊 Summary: ${processedSources} sources, ${successfulCategories}/${processedCategories} categories successful`);
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: "RSS scraping completed successfully",
      stats: {
        processedSources,
        processedCategories,
        successfulCategories
      }
    });
  } catch (error) {
    console.error("❌ Critical error during news scraping:", error);
    
    // Return error response
    return res.status(500).json({
      success: false,
      message: "Error during RSS scraping",
      error: error.message
    });
  }
}
