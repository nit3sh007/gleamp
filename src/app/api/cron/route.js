<<<<<<< HEAD

=======
// // Create this file: src/app/api/cron/route.js
>>>>>>> edb7fe010cdc6d4fac592bc44c283106d27ea0dd
// import { NextResponse } from "next/server";
// import { fetchNewsFromRSS } from "@/services/rssFetcher";
// import { newsSources } from "@/config/newsSources";
// import { connectDB } from "@/lib/db";

<<<<<<< HEAD

// export async function GET(request) {
//   console.log("⏳ Cron job API triggered at", new Date().toISOString());
  
//   try {
//     console.log("🔌 Connecting to database...");
//     await connectDB();
//     console.log("✅ Database connected");
=======
// export async function GET(request) {
//   console.log("🔍 API Route: /api/cron triggered at", new Date().toISOString());
  
//   try {
//     console.log("⏳ Cron job starting to connect to database");
//     await connectDB();
//     console.log("✅ Database connected successfully");
>>>>>>> edb7fe010cdc6d4fac592bc44c283106d27ea0dd
    
//     let processedSources = 0;
//     let processedCategories = 0;
    
//     for (const country of newsSources) {
//       console.log(`🌍 Processing country: ${country.countryName}`);
      
//       for (const source of country.sources) {
<<<<<<< HEAD
//         console.log(`📰 Processing source: ${source.name}`);
//         processedSources++;
        
//         for (const category of source.categories) {
=======
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



// import { NextResponse } from "next/server";
// import { fetchNewsFromRSS } from "@/services/rssFetcher";
// import { newsSources } from "@/config/newsSources";
// import { connectDB } from "@/lib/db";

// // Asynchronous scraping without blocking the response
// async function runNewsScraping() {
//   console.log("⏳ Background scraping started at", new Date().toISOString());

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
>>>>>>> edb7fe010cdc6d4fac592bc44c283106d27ea0dd
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
<<<<<<< HEAD
    
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
=======

//     console.log("📊 Scraping completed with", { processedSources, processedCategories });
//   } catch (error) {
//     console.error("❌ Critical error in scraping process:", error);
//   }
// }

// export async function GET() {
//   console.log("🚀 Cron job triggered at", new Date().toISOString());

//   // Run the scraper in the background
//   runNewsScraping();

//   return NextResponse.json({
//     message: "Scraper started successfully in the background.",
//     timestamp: new Date().toISOString(),
//   });
// }


>>>>>>> edb7fe010cdc6d4fac592bc44c283106d27ea0dd
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
