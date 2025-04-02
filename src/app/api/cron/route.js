// import { NextResponse } from "next/server";
// import { fetchNewsFromRSS } from "@/services/rssFetcher";
// import { newsSources } from "@/config/newsSources";
// import { connectDB } from "@/lib/db";


// export async function GET(request) {
//   console.log("⏳ Cron job API triggered at", new Date().toISOString());
  
//   try {
//     console.log("🔌 Connecting to database...");
//     await connectDB();
//     console.log("✅ Database connected");
    
//     let processedSources = 0;
//     let processedCategories = 0;
    
//     for (const country of newsSources) {
//       console.log(`🌍 Processing country: ${country.countryName}`);
      
//       for (const source of country.sources) {
//         console.log(`📰 Processing source: ${source.name}`);
//         processedSources++;
        
//         for (const category of source.categories) {
//           try {
//             console.log(`📑 Fetching ${category.name} category from ${source.name}...`);
//             await fetchNewsFromRSS(
//               category.rss,
//               country.countryCode,
//               country.countryName,
//               source.name,
//               category.name
//             );
//             console.log(`✅ Successfully fetched ${category.name} from ${source.name}`);
//             processedCategories++;
//           } catch (error) {
//             console.error(`❌ Error fetching ${category.name} from ${source.name}:`, error);
//           }
//         }
//       }
//     }
    
//     const summary = {
//       success: true,
//       timestamp: new Date().toISOString(),
//       stats: {
//         processedSources,
//         processedCategories
//       }
//     };
    
//     console.log("📊 Scraping Summary:", summary);
//     return NextResponse.json(summary);
//   } catch (error) {
//     console.error("❌ Critical error in cron job:", error);
//     return NextResponse.json({ 
//       error: "Failed to scrape news", 
//       message: error.message,
//       timestamp: new Date().toISOString()
//     }, { status: 500 });
//   }
// }


// src/app/api/cron/route.js
import { NextResponse } from "next/server";
import { fetchNewsFromRSS } from "@/services/rssFetcher";
import { newsSources } from "@/config/newsSources";
import { connectDB } from "@/lib/db";

// Rate limit RSS fetches to avoid overwhelming external servers
async function rateLimitedFetch(tasks, concurrency = 3) {
  const results = [];
  const running = new Set();
  
  for (const task of tasks) {
    if (running.size >= concurrency) {
      // Wait for one task to complete before adding more
      await Promise.race(running);
    }
    
    // Create and store the promise
    const promise = (async () => {
      try {
        const result = await task();
        results.push(result);
      } catch (error) {
        console.error("Task error:", error.message);
      } finally {
        running.delete(promise);
      }
    })();
    
    running.add(promise);
  }
  
  // Wait for remaining tasks
  await Promise.all(running);
  return results;
}

export async function GET(request) {
  console.log("🚀 Cron job triggered at", new Date().toISOString());
  
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");
    
    let processedSources = 0;
    let processedCategories = 0;
    let successfulCategories = 0;
    
    // Create tasks for each RSS feed
    const tasks = [];
    
    for (const country of newsSources) {
      for (const source of country.sources) {
        processedSources++;
        
        for (const category of source.categories) {
          processedCategories++;
          
          // Create a task for each category
          tasks.push(() => {
            console.log(`📑 Fetching ${category.name} category from ${source.name}...`);
            return fetchNewsFromRSS(
              category.rss,
              country.countryCode,
              country.countryName,
              source.name,
              category.name
            ).then(result => {
              if (result.length > 0) {
                successfulCategories++;
              }
              return result;
            });
          });
        }
      }
    }
    
    // Process tasks with rate limiting
    console.log(`⏳ Processing ${tasks.length} RSS feeds with rate limiting...`);
    await rateLimitedFetch(tasks, 5); // Process 5 feeds concurrently
    
    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        processedSources,
        processedCategories,
        successfulCategories
      }
    };
    
    console.log("📊 Scraping Summary:", summary);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("❌ Critical error in cron job:", error.message);
    return NextResponse.json({ 
      error: "Failed to scrape news", 
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
