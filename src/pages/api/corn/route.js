import { NextResponse } from "next/server";
import { fetchNewsFromRSS } from "@/services/rssFetcher";
import { newsSources } from "@/config/newsSources";

export async function GET() {
  try {
    console.log("🚀 Vercel Cron Job: Starting RSS Scraping...");

    for (const country of newsSources) {
      console.log(`🌍 Country: ${country.countryName}`);
      for (const source of country.sources) {
        console.log(`🔎 Source: ${source.name}`);
        for (const categoryItem of source.categories) {
          console.log(`📰 Category: ${categoryItem.name}`);
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

    console.log("✅ Scraping completed successfully!");
    return NextResponse.json({ message: "Scraping completed successfully!" });
  } catch (error) {
    console.error("❌ Error during scraping:", error);
    return NextResponse.json({ error: "Error during scraping" }, { status: 500 });
  }
}
