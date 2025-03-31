import { NextResponse } from "next/server";
import { fetchNewsFromRSS } from "@/services/rssFetcher";
import { newsSources } from "@/config/newsSources";
import { connectDB } from "@/lib/db";

export async function GET(request) {
  console.log("🔍 API Route: /api/cron triggered at", new Date().toISOString());
  
  try {
    console.log("⏳ Cron job starting to connect to database");
    await connectDB();
    console.log("✅ Database connected successfully");
    
    let processedSources = 0;
    let processedCategories = 0;
    
    for (const country of newsSources) {
      console.log(`🌍 Processing country: ${country.countryName}`);
      
      for (const source of country.sources) {
        console.log(`📰 Processing source: ${source.name} for ${country.countryName}`);
        processedSources++;
        
        for (const category of source.categories) {
          console.log(`📑 Fetching ${category.name} category from ${source.name}...`);
          try {
            await fetchNewsFromRSS(
              category.rss,
              country.countryCode,
              country.countryName,
              source.name,
              category.name
            );
            console.log(`✅ Successfully fetched ${category.name} from ${source.name}`);
            processedCategories++;
          } catch (fetchError) {
            console.error(`❌ Error fetching ${category.name} from ${source.name}:`, fetchError);
          }
        }
      }
    }
    
    console.log(`🎉 Cron job completed: Processed ${processedSources} sources and ${processedCategories} categories`);
    
    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      stats: {
        processedSources,
        processedCategories
      }
    });
  } catch (error) {
    console.error("❌ Critical error in cron job:", error);
    return NextResponse.json(
      { 
        error: "Failed to scrape news", 
        message: error.message,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}