// // Create this file: src/app/api/cron/route.js
// import { NextResponse } from "next/server";
// import { fetchNewsFromRSS } from "@/services/rssFetcher";
// import { newsSources } from "@/config/newsSources";
// import { connectDB } from "@/lib/db";

// export async function GET(request) {
//   console.log("🔍 API Route: /api/cron triggered at", new Date().toISOString());
  
//   try {
//     console.log("⏳ Cron job starting to connect to database");
//     await connectDB();
//     console.log("✅ Database connected successfully");
    
//     let processedSources = 0;
//     let processedCategories = 0;
    
//     for (const country of newsSources) {
//       console.log(`🌍 Processing country: ${country.countryName}`);
      
//       for (const source of country.sources) {
//         console.log(`📰 Processing source: ${source.name} for ${country.countryName}`);
//         processedSources++;
        
//         for (const category of source.categories) {
//           console.log(`📑 Fetching ${category.name} category from ${source.name}...`);
//           try {
//             await fetchNewsFromRSS(
//               category.rss,
//               country.countryCode,
//               country.countryName,
//               source.name,
//               category.name
//             );
//             console.log(`✅ Successfully fetched ${category.name} from ${source.name}`);
//             processedCategories++;
//           } catch (fetchError) {
//             console.error(`❌ Error fetching ${category.name} from ${source.name}:`, fetchError);
//           }
//         }
//       }
//     }
    
//     console.log(`🎉 Cron job completed: Processed ${processedSources} sources and ${processedCategories} categories`);
    
//     return NextResponse.json({ 
//       success: true, 
//       timestamp: new Date().toISOString(),
//       stats: {
//         processedSources,
//         processedCategories
//       }
//     });
//   } catch (error) {
//     console.error("❌ Critical error in cron job:", error);
//     return NextResponse.json(
//       { 
//         error: "Failed to scrape news", 
//         message: error.message,
//         timestamp: new Date().toISOString()
//       }, 
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { fetchNewsFromRSS } from "@/services/rssFetcher";
import { newsSources } from "@/config/newsSources";
import { connectDB } from "@/lib/db";

// Asynchronous scraping without blocking the response
async function runNewsScraping() {
  console.log("⏳ Background scraping started at", new Date().toISOString());

  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    let processedSources = 0;
    let processedCategories = 0;

    for (const country of newsSources) {
      console.log(`🌍 Processing country: ${country.countryName}`);
      
      for (const source of country.sources) {
        console.log(`📰 Processing source: ${source.name}`);
        processedSources++;

        for (const category of source.categories) {
          try {
            console.log(`📑 Fetching ${category.name} category from ${source.name}...`);
            await fetchNewsFromRSS(
              category.rss,
              country.countryCode,
              country.countryName,
              source.name,
              category.name
            );
            console.log(`✅ Successfully fetched ${category.name} from ${source.name}`);
            processedCategories++;
          } catch (error) {
            console.error(`❌ Error fetching ${category.name} from ${source.name}:`, error);
          }
        }
      }
    }

    console.log("📊 Scraping completed with", { processedSources, processedCategories });
  } catch (error) {
    console.error("❌ Critical error in scraping process:", error);
  }
}

export async function GET() {
  console.log("🚀 Cron job triggered at", new Date().toISOString());

  // Run the scraper in the background
  runNewsScraping();

  return NextResponse.json({
    message: "Scraper started successfully in the background.",
    timestamp: new Date().toISOString(),
  });
}
