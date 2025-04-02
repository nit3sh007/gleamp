import { connectDB } from "@/lib/db";
import { NewsArticle } from "@/modals/NewsArticle";

export default async function handler(req, res) {
  try {
    // Ensure database connection
    await connectDB();
    
    console.log("🔍 News Counts API Request Received");

    // Aggregate news articles by country code and count them
    const countryCounts = await NewsArticle.aggregate([
      // Group by countryCode and count
      {
        $group: {
          _id: "$countryCode",
          count: { $sum: 1 }
        }
      },
      // Filter out null or empty country codes
      {
        $match: {
          _id: { $ne: null, $ne: "" }
        }
      }
    ]);

    console.log(`✅ Fetched counts for ${countryCounts.length} countries`);
    
    // Transform the data into the format expected by the frontend
    const result = {};
    countryCounts.forEach(item => {
      if (item._id) {
        result[item._id] = item.count;
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error in News Counts API:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
}