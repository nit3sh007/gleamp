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
// }

import { connectDB } from "@/lib/db"; 
import { NewsArticle } from "../../modals/NewsArticle.js";

export default async function handler(req, res) {
  try {
    // Ensure database connection
    await connectDB();

    const { country, category } = req.query;
    
    console.log("🔍 News API Request Received:");
    console.log("Country:", country);
    console.log("Category:", category);

    // Validate country parameter
    if (!country) {
      console.error("❌ No country provided");
      return res.status(400).json({ error: "Country parameter is required" });
    }

    // Use exact matching instead of regex
    const query = { 
      $or: [
        { countryCode: country },
        { country: country }
      ]
    };
    
    // Add category filter if specified and not 'All'
    if (category && category.toLowerCase() !== 'all') {
      query.category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    }

    console.log("📋 Database Query:", query);

    // Count total matching documents first
    const totalCount = await NewsArticle.countDocuments(query);
    console.log(`📊 Total matching documents: ${totalCount}`);

    // If no documents, log a specific message
    if (totalCount === 0) {
      console.warn(`⚠️ No news found for query: ${JSON.stringify(query)}`);
    }

    // Fetch articles, sorted by most recent first
    const articles = await NewsArticle.find(query)
      .sort({ publishedAt: -1 })
      .limit(100);

    console.log(`✅ Fetched ${articles.length} articles`);

    // Handle image URLs and preserve other data
    const updatedArticles = articles.map((article) => {
      const updatedArticle = {...article._doc};
      
      updatedArticle.imageUrl = updatedArticle.imageUrl && updatedArticle.imageUrl.trim() !== ""
        ? updatedArticle.imageUrl
        : "/default-image.jpg";

      return updatedArticle;
    });

    res.status(200).json(updatedArticles);
  } catch (error) {
    console.error("❌ Error in News API:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
}