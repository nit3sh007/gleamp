
// import Parser from "rss-parser";
// import { connectDB } from "../lib/db.js";
// import { NewsArticle } from "../modals/NewsArticle.js";
// import moment from "moment-timezone"; 

// // Rate Limiter Class
// class RateLimiter {
//   constructor(maxRequests = 30, timeWindow = 60000) {
//     this.maxRequests = maxRequests;
//     this.timeWindow = timeWindow;
//     this.requests = new Map();
//   }

//   async canMakeRequest(sourceName) {
//     const now = Date.now();
//     const sourceRequests = this.requests.get(sourceName) || [];
//     const recentRequests = sourceRequests.filter(time => now - time < this.timeWindow);
    
//     if (recentRequests.length < this.maxRequests) {
//       recentRequests.push(now);
//       this.requests.set(sourceName, recentRequests);
//       return true;
//     }
    
//     return false;
//   }
// }

// // Circuit Breaker Class
// class CircuitBreaker {
//   constructor(threshold = 3, resetTime = 1800000) {
//     this.failures = new Map();
//     this.threshold = threshold;
//     this.resetTime = resetTime;
//   }

//   async shouldTry(sourceName) {
//     const failures = this.failures.get(sourceName);
//     if (!failures) return true;

//     if (failures.count >= this.threshold) {
//       const timeSinceLastFailure = Date.now() - failures.lastFailure;
//       if (timeSinceLastFailure < this.resetTime) {
//         console.log(`🔌 Circuit breaker active for ${sourceName}. Skipping.`);
//         return false;
//       }
//       this.failures.delete(sourceName);
//     }
//     return true;
//   }

//   recordFailure(sourceName) {
//     const failures = this.failures.get(sourceName) || { count: 0, lastFailure: 0 };
//     failures.count++;
//     failures.lastFailure = Date.now();
//     this.failures.set(sourceName, failures);
//   }

//   reset(sourceName) {
//     this.failures.delete(sourceName);
//   }
// }

// // Initialize rate limiter and circuit breaker
// const rateLimiter = new RateLimiter();
// const circuitBreaker = new CircuitBreaker();

// // Configure parser
// const parser = new Parser({
//   customFields: {
//     item: [
//       'enclosure',
//       'dc:creator',
//       'media:content',
//       'media:thumbnail',
//       'image',
//       'content:encoded'
//     ],
//   },
//   timeout: 10000,
//   requestOptions: {
//     rejectUnauthorized: false
//   }
// });

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// export const fetchNewsFromRSS = async (rssUrl, countryCode, countryName, sourceName) => {
//   // Check circuit breaker
//   if (!(await circuitBreaker.shouldTry(sourceName))) {
//     console.log(`🔌 Skipping ${sourceName} - circuit breaker open`);
//     return [];
//   }

//   // Check rate limiter
//   if (!(await rateLimiter.canMakeRequest(sourceName))) {
//     console.log(`⏳ Rate limit reached for ${sourceName}. Waiting...`);
//     await delay(1000);
//     return [];
//   }

//   let retries = 3;
  
//   while (retries > 0) {
//     try {
//       await connectDB();
      
//       const timeoutPromise = new Promise((_, reject) => 
//         setTimeout(() => reject(new Error('Timeout')), 15000)
//       );
      
//       const feed = await Promise.race([
//         parser.parseURL(rssUrl),
//         timeoutPromise
//       ]);

//       const articles = feed.items.map((item) => {
//         let pubDateRaw = item.pubDate;
//         let pubDateParsed = pubDateRaw
//           ? moment(pubDateRaw, "ddd, DD MMM YYYY HH:mm:ss Z").toISOString()
//           : new Date().toISOString();

//         // Your existing image extraction logic
//         let imageUrl = "";
//         if (item.enclosure?.url) {
//           imageUrl = item.enclosure.url;
//         } else if (item["media:content"]) {
//           if (Array.isArray(item["media:content"])) {
//             const mediaContent = item["media:content"].find(m => 
//               m.$ && (m.$.medium === "image" || m.$.type?.includes("image"))
//             );
//             imageUrl = mediaContent?.$.url || "";
//           } else if (item["media:content"].$ && item["media:content"].$.url) {
//             imageUrl = item["media:content"].$.url;
//           }
//         } else if (item.image) {
//           imageUrl = typeof item.image === "string" ? item.image : item.image?.url || "";
//         }

//         return {
//           country: countryCode,
//           countryName,
//           source: sourceName,
//           headline: item.title || "",
//           summary: item.contentSnippet || item.description || "",
//           url: item.link || "",
//           author: item["dc:creator"] || "Unknown",
//           imageUrl,
//           publishedAt: pubDateParsed,
//         };
//       });

//       for (const article of articles) {
//         await NewsArticle.updateOne(
//           { url: article.url },
//           { $set: article },
//           { upsert: true }
//         );
//       }

//       // Reset circuit breaker on success
//       circuitBreaker.reset(sourceName);
      
//       console.log(`✅ Saved ${articles.length} articles from ${sourceName} to MongoDB`);
//       return articles;

//     } catch (error) {
//       retries--;
      
//       if (error.code === 'ERR_SOCKET_CONNECTION_TIMEOUT' || 
//           error.message === 'Timeout' ||
//           error.code === 'ECONNREFUSED') {
        
//         console.log(`⚠️ Attempt failed for ${sourceName}, retries left: ${retries}`);
        
//         // Record failure in circuit breaker
//         circuitBreaker.recordFailure(sourceName);
        
//         if (retries > 0) {
//           await delay(2000);
//           continue;
//         }
//       }
      
//       console.error(`❌ Error fetching RSS feed from ${sourceName}:`, {
//         error: error.message,
//         code: error.code,
//         url: rssUrl
//       });
      
//       return [];
//     }
//   }
// };

import Parser from "rss-parser";
import { connectDB } from "../lib/db.js";
import { NewsArticle } from "../modals/NewsArticle.js";
import moment from "moment-timezone"; 

// Initialize RSS parser
const rssParser = new Parser({
  customFields: {
    item: [
      'enclosure',
      'media:content',
      'content:encoded'
    ],
  },
  timeout: 10000,
  requestOptions: {
    rejectUnauthorized: false
  }
});

/**
 * Extracts location data from text
 * @param {string} text - The text to extract location from
 * @param {string} countryName - The country name for default coordinates
 * @returns {Object} - Object with latitude and longitude
 */
async function extractLocationFromText(text, countryName) {
  // For now, use default coordinates based on country
  // In a real implementation, you might use a geocoding API or NLP to extract locations
  
  // Default coordinates map (simplified example)
  const defaultCoordinates = {
    "United States of America": { latitude: 37.0902, longitude: -95.7129 },
    // Add more countries as needed
  };
  
  // Return default coordinates or fallback to US coordinates
  return defaultCoordinates[countryName] || { latitude: 37.0902, longitude: -95.7129 };
}

/**
 * Fetches news from an RSS feed URL and stores in the database
 * @param {string} rssUrl - The RSS feed URL
 * @param {string} countryCode - The country code
 * @param {string} countryName - The country name
 * @param {string} sourceName - The name of the news source
 * @param {string} category - The category of the news
 */
export const fetchNewsFromRSS = async (rssUrl, countryCode, countryName, sourceName, category = 'All') => {
  try {
    // Connect to the database
    await connectDB();
    
    console.log(`Fetching from ${sourceName} (${category}) for ${countryName}...`);
    
    // Fetch and parse the RSS feed
    const feed = await rssParser.parseURL(rssUrl);
    
    // Process each item in the feed
    const processedItems = await Promise.all(feed.items.map(async (item) => {
      try {
        // Extract necessary data
        const headline = item.title;
        const summary = item.contentSnippet || item.content || '';
        const url = item.link || item.guid;
        const imageUrl = extractImageUrl(item);
        const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
        
        // Extract location data
        const { latitude, longitude } = await extractLocationFromText(headline + ' ' + summary, countryName);
        
        // Create or update news article
        const newsArticle = {
          country: countryName,
          countryCode,
          source: sourceName,
          headline,
          summary: summary.substring(0, 300), // Limit summary length
          url,
          imageUrl,
          latitude,
          longitude,
          publishedAt,
          category // Add category field
        };
        
        // Use findOneAndUpdate to avoid duplicates
        await NewsArticle.findOneAndUpdate(
          { url },
          newsArticle,
          { upsert: true, new: true }
        );
        
        return newsArticle;
      } catch (error) {
        console.error(`Error processing item from ${sourceName}:`, error);
        return null;
      }
    }));
    
    const validItems = processedItems.filter(item => item !== null);
    console.log(`✅ Successfully processed ${validItems.length} items from ${sourceName} (${category})`);
    
    return validItems;
  } catch (error) {
    console.error(`❌ Error fetching RSS from ${sourceName} (${category}):`, error);
    throw error;
  }
};

/**
 * Extracts image URL from an RSS item
 * @param {Object} item - The RSS item
 * @returns {string} - The image URL or empty string
 */
function extractImageUrl(item) {
  // Try various ways to get the image URL
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  
  if (item['media:content'] && item['media:content'].url) {
    return item['media:content'].url;
  }
  
  if (item.content) {
    const match = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (match) return match[1];
  }
  
  return '';
}