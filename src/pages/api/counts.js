// import { connectDB } from "@/lib/db";
// import { NewsArticle } from "@/modals/NewsArticle";

// export default async function handler(req, res) {
//   try {
//     // Ensure database connection
//     await connectDB();
    
//     console.log("🔍 News Counts API Request Received");

//     // Aggregate news articles by country code and count them
//     const countryCounts = await NewsArticle.aggregate([
//       // Group by countryCode and count
//       {
//         $group: {
//           _id: "$countryCode",
//           count: { $sum: 1 }
//         }
//       },
//       // Filter out null or empty country codes
//       {
//         $match: {
//           _id: { $ne: null, $ne: "" }
//         }
//       }
//     ]);

//     console.log(`✅ Fetched counts for ${countryCounts.length} countries`);
    
//     // Transform the data into the format expected by the frontend
//     const result = {};
//     countryCounts.forEach(item => {
//       if (item._id) {
//         result[item._id] = item.count;
//       }
//     });

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("❌ Error in News Counts API:", error);
//     res.status(500).json({ 
//       error: "Internal Server Error", 
//       details: error.message 
//     });
//   }
// }


// File: pages/api/counts.js
import { connectDB } from "@/lib/db";
import { NewsArticle } from "@/modals/NewsArticle";

// Cache for counts to improve performance
let countsCache = null;
let lastCacheTime = 0;
const CACHE_TTL = 60000; // 1 minute cache TTL

export default async function handler(req, res) {
  try {
    // Set proper CORS and caching headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=60');
    
    // Check for fresh cache
    const now = Date.now();
    if (countsCache && (now - lastCacheTime < CACHE_TTL)) {
      console.log("✅ Serving cached news counts");
      return res.status(200).json(countsCache);
    }
    
    // If specific country requested, handle that case
    const { country } = req.query;
    if (country) {
      await connectDB();
      
      const count = await NewsArticle.countDocuments({
        $or: [
          { countryCode: country },
          { country: new RegExp(`^${country}$`, 'i') }
        ]
      });
      
      const result = { [country]: count };
      res.status(200).json(result);
      return;
    }
    
    // Otherwise, get all country counts
    await connectDB();
    console.log("🔍 News Counts API Request Received");

    // Aggregate news articles by country code with more efficient pipeline
    const countryCounts = await NewsArticle.aggregate([
      // First match to filter out docs without country code
      {
        $match: {
          countryCode: { $exists: true, $ne: null, $ne: "" }
        }
      },
      // Then group and count
      {
        $group: {
          _id: "$countryCode",
          count: { $sum: 1 }
        }
      }
    ]);

    console.log(`✅ Fetched counts for ${countryCounts.length} countries`);
    
    // Transform the data efficiently
    const result = Object.fromEntries(
      countryCounts.map(item => [item._id, item.count])
    );

    // Update cache
    countsCache = result;
    lastCacheTime = now;
    
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error in News Counts API:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
}