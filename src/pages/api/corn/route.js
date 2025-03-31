// pages/api/cron.js or app/api/cron/route.js (depending on your Next.js version)
import { newsSources } from "../../src/config/newsSources";
import { connectDB } from "../../src/lib/db";
import { fetchNewsFromRSS } from "../../src/services/rssFetcher";

export default async function handler(req, res) {
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
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Failed to scrape news" });
  }
}
