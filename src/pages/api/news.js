// import { connectDB } from "@/lib/db"; 
// import { NewsArticle } from "../../modals/NewsArticle.js";

// export default async function handler(req, res) {
//   try {
//     // Ensure database connection
//     await connectDB();

//     const { country, category } = req.query;
    
//     console.log("🔍 News API Request Received:");
//     console.log("Country:", country);
//     console.log("Category:", category);

//     // Validate country parameter
//     if (!country) {
//       console.error("❌ No country provided");
//       return res.status(400).json({ error: "Country parameter is required" });
//     }

//     // Create a more flexible country matching query
//     const query = { 
//       $or: [
//         { country: { $regex: new RegExp(country, 'i') } },
//         { countryCode: country },
//         { country: { $in: [
//           country, 
//           country.toLowerCase(), 
//           country.toUpperCase(),
//           country.trim()
//         ]}
//       }]
//     };
    
//     // Add category filter if specified and not 'All'
//     if (category && category.toLowerCase() !== 'all') {
//       query.category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
//     }

//     console.log("📋 Database Query:", query);

//     // Count total matching documents first
//     const totalCount = await NewsArticle.countDocuments(query);
//     console.log(`📊 Total matching documents: ${totalCount}`);

//     // If no documents, log a specific message
//     if (totalCount === 0) {
//       console.warn(`⚠️ No news found for query: ${JSON.stringify(query)}`);
//     }

//     // Fetch articles, sorted by most recent first
//     const articles = await NewsArticle.find(query)
//       .sort({ publishedAt: -1 })
//       .limit(100);

//     console.log(`✅ Fetched ${articles.length} articles`);

//     // Handle image URLs and preserve other data
//     const updatedArticles = articles.map((article) => {
//       const updatedArticle = {...article._doc};
      
//       updatedArticle.imageUrl = updatedArticle.imageUrl && updatedArticle.imageUrl.trim() !== ""
//         ? updatedArticle.imageUrl
//         : "/default-image.jpg";

//       return updatedArticle;
//     });

//     res.status(200).json(updatedArticles);
//   } catch (error) {
//     console.error("❌ Error in News API:", error);
//     res.status(500).json({ 
//       error: "Internal Server Error", 
//       details: error.message 
//     });
//   }
// // }

// import { connectDB } from "@/lib/db"; 
// import { NewsArticle } from "../../modals/NewsArticle.js";

// export default async function handler(req, res) {
//   try {
//     // Ensure database connection
//     await connectDB();

//     const { country, category } = req.query;
    
//     console.log("🔍 News API Request Received:");
//     console.log("Country:", country);
//     console.log("Category:", category);

//     // Validate country parameter
//     if (!country) {
//       console.error("❌ No country provided");
//       return res.status(400).json({ error: "Country parameter is required" });
//     }

//     // Use exact matching instead of regex
//     const query = { 
//       $or: [
//         { countryCode: country },
//         { country: country }
//       ]
//     };
    
//     // Add category filter if specified and not 'All'
//     if (category && category.toLowerCase() !== 'all') {
//       query.category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
//     }

//     console.log("📋 Database Query:", query);

//     // Count total matching documents first
//     const totalCount = await NewsArticle.countDocuments(query);
//     console.log(`📊 Total matching documents: ${totalCount}`);

//     // If no documents, log a specific message
//     if (totalCount === 0) {
//       console.warn(`⚠️ No news found for query: ${JSON.stringify(query)}`);
//     }

//     // Fetch articles, sorted by most recent first
//     const articles = await NewsArticle.find(query)
//       .sort({ publishedAt: -1 })
//       .limit(100);

//     console.log(`✅ Fetched ${articles.length} articles`);

//     // Handle image URLs and preserve other data
//     const updatedArticles = articles.map((article) => {
//       const updatedArticle = {...article._doc};
      
//       updatedArticle.imageUrl = updatedArticle.imageUrl && updatedArticle.imageUrl.trim() !== ""
//         ? updatedArticle.imageUrl
//         : "/default-image.jpg";

//       return updatedArticle;
//     });

//     res.status(200).json(updatedArticles);
//   } catch (error) {
//     console.error("❌ Error in News API:", error);
//     res.status(500).json({ 
//       error: "Internal Server Error", 
//       details: error.message 
//     });
//   }
// }

// File: pages/api/news.js
import { connectDB } from "@/lib/db"; 
import { NewsArticle } from "../../modals/NewsArticle.js";
import { createHash } from 'crypto';

// Cache for API responses to improve performance
const cache = new Map();
const CACHE_TTL = 30000; // 30 seconds cache TTL

export default async function handler(req, res) {
  try {
    // Ensure database connection
    await connectDB();

    const { country, category, limit = "100" } = req.query;
    
    console.log("🔍 News API Request Received:");
    console.log("Country:", country);
    console.log("Category:", category);
    console.log("Limit:", limit);

    // Validate country parameter
    if (!country) {
      console.error("❌ No country provided");
      return res.status(400).json({ error: "Country parameter is required" });
    }

    // Create a cache key based on request parameters
    const cacheKey = createHash('md5').update(
      `${country}-${category || 'all'}-${limit}`
    ).digest('hex');
    
    // Check if we have a fresh cached response
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_TTL)) {
      console.log(`✅ Serving cached response for ${country}`);
      return res.status(200).json(cachedResponse.data);
    }

    // Prepare query with improved performance
    const query = { 
      $or: [
        { countryCode: country },
        { country: new RegExp(`^${country}$`, 'i') } // Case-insensitive exact match
      ]
    };
    
    // Add category filter if specified and not 'All'
    if (category && category.toLowerCase() !== 'all') {
      // Case-insensitive match for category
      query.category = new RegExp(`^${category}$`, 'i');
    }

    console.log("📋 Database Query:", JSON.stringify(query));

    // Count total matching documents using a more efficient countDocuments
    const totalCount = await NewsArticle.countDocuments(query);
    console.log(`📊 Total matching documents: ${totalCount}`);

    // If no documents, return empty array quickly
    if (totalCount === 0) {
      console.warn(`⚠️ No news found for query: ${JSON.stringify(query)}`);
      return res.status(200).json([]);
    }

    // Parse limit to number with validation
    const parsedLimit = parseInt(limit, 10);
    const finalLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 100 : 
                      parsedLimit > 200 ? 200 : parsedLimit;

    // Create projection to only select needed fields for better performance
    const projection = {
      _id: 1,
      headline: 1,
      summary: 1,
      source: 1,
      url: 1,
      publishedAt: 1,
      imageUrl: 1,
      category: 1,
      countryCode: 1,
      country: 1,
      latitude: 1, 
      longitude: 1
    };

    // Fetch articles with projection, sorted by most recent first
    const articles = await NewsArticle.find(query, projection)
      .sort({ publishedAt: -1 })
      .limit(finalLimit)
      .lean(); // Use lean() for better performance

    console.log(`✅ Fetched ${articles.length} articles`);

    // Process articles more efficiently
    const updatedArticles = articles.map((article) => {
      // Use spread to create a new object rather than modifying
      return {
        ...article,
        imageUrl: article.imageUrl && article.imageUrl.trim() !== ""
          ? article.imageUrl
          : "/default-image.jpg"
      };
    });

    // Cache the response
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: updatedArticles
    });

    // Set caching headers for browsers and CDNs
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.status(200).json(updatedArticles);
    
  } catch (error) {
    console.error("❌ Error in News API:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
}