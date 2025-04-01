// import Parser from "rss-parser";
// import { connectDB } from "../lib/db.js";
// import { NewsArticle } from "../modals/NewsArticle.js";
// import moment from "moment-timezone"; 

// // Initialize RSS parser
// const rssParser = new Parser({
//   customFields: {
//     item: [
//       'enclosure',
//       'media:content',
//       'content:encoded'
//     ],
//   },
//   timeout: 10000,
//   requestOptions: {
//     rejectUnauthorized: false
//   }
// });

// /**
//  * Extracts location data from text
//  * @param {string} text - The text to extract location from
//  * @param {string} countryName - The country name for default coordinates
//  * @returns {Object} - Object with latitude and longitude
//  */
// async function extractLocationFromText(text, countryName) {
//   // For now, use default coordinates based on country
//   // In a real implementation, you might use a geocoding API or NLP to extract locations
  
//   // Default coordinates map (simplified example)
//   const defaultCoordinates = {
//     "United States of America": { latitude: 37.0902, longitude: -95.7129 },
//     // Add more countries as needed
//   };
  
//   // Return default coordinates or fallback to US coordinates
//   return defaultCoordinates[countryName] || { latitude: 37.0902, longitude: -95.7129 };
// }

// /**
//  * Fetches news from an RSS feed URL and stores in the database
//  * @param {string} rssUrl - The RSS feed URL
//  * @param {string} countryCode - The country code
//  * @param {string} countryName - The country name
//  * @param {string} sourceName - The name of the news source
//  * @param {string} category - The category of the news
//  */
// export const fetchNewsFromRSS = async (rssUrl, countryCode, countryName, sourceName, category = 'All') => {
//   try {
//     // Connect to the database
//     await connectDB();
    
//     console.log(`Fetching from ${sourceName} (${category}) for ${countryName}...`);
    
//     // Fetch and parse the RSS feed
//     const feed = await rssParser.parseURL(rssUrl);
    
//     // Process each item in the feed
//     const processedItems = await Promise.all(feed.items.map(async (item) => {
//       try {
//         // Extract necessary data
//         const headline = item.title;
//         const summary = item.contentSnippet || item.content || '';
//         const url = item.link || item.guid;
//         const imageUrl = extractImageUrl(item);
//         const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
        
//         // Extract location data
//         const { latitude, longitude } = await extractLocationFromText(headline + ' ' + summary, countryName);
        
//         // Create or update news article
//         const newsArticle = {
//           country: countryName,
//           countryCode,
//           source: sourceName,
//           headline,
//           summary: summary.substring(0, 300), // Limit summary length
//           url,
//           imageUrl,
//           latitude,
//           longitude,
//           publishedAt,
//           category // Add category field
//         };
        
//         // Use findOneAndUpdate to avoid duplicates
//         await NewsArticle.findOneAndUpdate(
//           { url },
//           newsArticle,
//           { upsert: true, new: true }
//         );
        
//         return newsArticle;
//       } catch (error) {
//         console.error(`Error processing item from ${sourceName}:`, error);
//         return null;
//       }
//     }));
    
//     const validItems = processedItems.filter(item => item !== null);
//     console.log(`✅ Successfully processed ${validItems.length} items from ${sourceName} (${category})`);
    
//     return validItems;
//   } catch (error) {
//     console.error(`❌ Error fetching RSS from ${sourceName} (${category}):`, error);
//     throw error;
//   }
// };

// /**
//  * Extracts image URL from an RSS item
//  * @param {Object} item - The RSS item
//  * @returns {string} - The image URL or empty string
//  */
// function extractImageUrl(item) {
//   // Try various ways to get the image URL
//   if (item.enclosure && item.enclosure.url) {
//     return item.enclosure.url;
//   }
  
//   if (item['media:content'] && item['media:content'].url) {
//     return item['media:content'].url;
//   }
  
//   if (item.content) {
//     const match = item.content.match(/<img[^>]+src="([^">]+)"/);
//     if (match) return match[1];
//   }
  
//   return '';
// }




import Parser from "rss-parser";
import { connectDB } from "../lib/db.js";
import { NewsArticle } from "../modals/NewsArticle.js";
import moment from "moment-timezone";

// Initialize RSS parser
const rssParser = new Parser({
  customFields: {
    item: ['enclosure', 'media:content', 'content:encoded'],
  },
  timeout: 10000,
  requestOptions: {
    rejectUnauthorized: false
  }
});

/**
 * Fetch with timeout to prevent hanging requests
 * @param {string} rssUrl - The RSS feed URL
 * @param {number} timeout - Timeout in milliseconds
 */
const fetchWithTimeout = async (rssUrl, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(rssUrl, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`⏳ Timeout: ${rssUrl} took too long to respond.`);
    }
    throw error;
  }
};

/**
 * Extracts location data from text
 */
async function extractLocationFromText(text, countryName) {
  const defaultCoordinates = {
    "United States of America": { latitude: 37.0902, longitude: -95.7129 },
  };
  return defaultCoordinates[countryName] || { latitude: 37.0902, longitude: -95.7129 };
}

/**
 * Fetches news from an RSS feed and stores in the database
 */
export const fetchNewsFromRSS = async (rssUrl, countryCode, countryName, sourceName, category = 'All') => {
  try {
    await connectDB();
    console.log(`📥 Fetching from ${sourceName} (${category}) for ${countryName}...`);

    // Use fetchWithTimeout before parsing the RSS
    await fetchWithTimeout(rssUrl);

    const feed = await rssParser.parseURL(rssUrl);
    if (!feed.items || feed.items.length === 0) {
      console.warn(`⚠️ No articles found for ${sourceName} (${category})`);
      return [];
    }

    const processedItems = await Promise.all(feed.items.map(async (item) => {
      try {
        const headline = item.title;
        const summary = item.contentSnippet || item.content || '';
        const url = item.link || item.guid;
        const imageUrl = extractImageUrl(item);
        const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
        const { latitude, longitude } = await extractLocationFromText(headline + ' ' + summary, countryName);

        const newsArticle = {
          country: countryName,
          countryCode,
          source: sourceName,
          headline,
          summary: summary.substring(0, 300),
          url,
          imageUrl,
          latitude,
          longitude,
          publishedAt,
          category
        };

        await NewsArticle.findOneAndUpdate(
          { url },
          newsArticle,
          { upsert: true, new: true }
        );

        return newsArticle;
      } catch (error) {
        console.error(`❌ Error processing article from ${sourceName}:`, error);
        return null;
      }
    }));

    console.log(`✅ Processed ${processedItems.filter(Boolean).length} articles from ${sourceName} (${category})`);
    return processedItems;
  } catch (error) {
    console.error(`❌ Error fetching RSS from ${sourceName} (${category}):`, error);
    return [];
  }
};

/**
 * Extracts image URL from an RSS item
 */
function extractImageUrl(item) {
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;
  if (item['media:content'] && item['media:content'].url) return item['media:content'].url;

  if (item.content) {
    const match = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (match) return match[1];
  }
  
  return '';
}
