import { NextResponse } from "next/server";
import { fetchNewsFromRSS } from "@/services/rssFetcher";
import { newsSources } from "@/config/newsSources";
import { connectDB } from "@/lib/db";

export async function GET(request) {
  try {
    console.log("⏳ Cron job triggered at", new Date().toLocaleTimeString());
    await connectDB();
    
    for (const country of newsSources) {
      for (const source of country.sources) {
        for (const category of source.categories) {
          await fetchNewsFromRSS(
            category.rss,
            country.countryCode,
            country.countryName,
            source.name,
            category.name
          );
        }
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(JSON.stringify({ error: "Failed to scrape news" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}