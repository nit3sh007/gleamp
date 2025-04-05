// import { useEffect } from "react";
// import L from "leaflet";
// import moment from "moment-timezone";

// export default function NewsFetcher({
//     markersLayer,
//     countryLayer,
//     selectedCountry,
//     selectedCategory,
//     setIsSidebarOpen,
//     setCountryNews,
// }) {
//     useEffect(() => {
//         if (selectedCountry && markersLayer && countryLayer) {
//             markersLayer.clearLayers();

//             // Build URL with country and optional category
//             let apiUrl = `http://localhost:3000/api/news?country=${encodeURIComponent(selectedCountry.id)}`;
//             if (selectedCategory && selectedCategory !== 'All') {
//                 apiUrl += `&category=${encodeURIComponent(selectedCategory)}`;
//             }

//             fetch(apiUrl)
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error(`Server error: ${response.statusText}`);
//                     }
//                     return response.json();
//                 })
//                 .then((data) => {
//                     setCountryNews(data || []);

//                     if (data.length === 0) {
//                         console.log("No news available for this country/category combination.");
//                     }

//                     data.forEach((news) => {
//                         if (news.latitude && news.longitude) {
//                             const formattedPublishedAt = moment(news.publishedAt)
//                             .tz("Asia/Kolkata")
//                             .format("MMM DD, YYYY, HH:mm z"); // Convert to IST
//                             L.marker([news.latitude, news.longitude])
//                                 .addTo(markersLayer)
//                                 .bindPopup(`
//                                     <div style="max-width: 250px;">
//                                         <img 
//                                             src="${news.imageUrl}" 
//                                             alt="${news.headline}" 
//                                             style="width:100%; height:auto; border-radius: 5px; margin-bottom: 5px;"
//                                             onerror="this.onerror=null; this.src='/default-image.jpg';"
//                                         >
//                                         <b>${news.headline}</b><br>
//                                         <p>${news.summary}</p>
//                                         <p><strong>Source:</strong> ${news.source}</p>
//                                         <p><strong>Category:</strong> ${news.category || 'News'}</p>
//                                         <p><strong>Published:</strong> ${new Date(news.publishedAt).toLocaleString("en-GB", { 
//                                                 timeZone: "Asia/Kolkata", 
//                                                 weekday: "short", 
//                                                 year: "numeric", 
//                                                 month: "short", 
//                                                 day: "numeric", 
//                                                 hour: "2-digit", 
//                                                 minute: "2-digit", 
//                                                 second: "2-digit" 
//                                             })}</p>
//                                             <a href="${news.url}" target="_blank" style="color: blue; text-decoration: underline;">Read more</a>
//                                     </div>
//                                 `);
//                         }
//                     });

//                     setIsSidebarOpen(true);
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching news:", error);
//                     setCountryNews([]);
//                 });
//         }
//     }, [selectedCountry, selectedCategory, markersLayer, countryLayer, setIsSidebarOpen, setCountryNews]);

//     return null;
// // }

// import { useEffect } from "react";
// import L from "leaflet";
// import moment from "moment-timezone";

// // Utility function for dynamic API URL
// function getApiUrl(path) {
//   // Use environment variable or dynamically determine base URL
//   const baseUrl = 
//     process.env.NEXT_PUBLIC_SITE_URL || 
//     (typeof window !== 'undefined' ? window.location.origin : '');
  
//   return `${baseUrl}${path}`;
// }

// export default function NewsFetcher({
//     markersLayer,
//     countryLayer,
//     selectedCountry,
//     selectedCategory,
//     setIsSidebarOpen,
//     setCountryNews,
// }) {
//     useEffect(() => {
//         if (selectedCountry && markersLayer && countryLayer) {
//             // Clear existing markers
//             markersLayer.clearLayers();

//             // Dynamically build URL with country and optional category
//             let apiPath = `/api/news?country=${encodeURIComponent(selectedCountry.id)}`;
            
//             // Add category if selected
//             if (selectedCategory && selectedCategory !== 'All') {
//                 apiPath += `&category=${encodeURIComponent(selectedCategory)}`;
//             }

//             // Construct full API URL
//             const apiUrl = getApiUrl(apiPath);
//             console.log('Fetching from URL:', apiUrl);

//             // Fetch news data
//             fetch(apiUrl)
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error(`Server error: ${response.statusText}`);
//                     }
//                     return response.json();
//                 })
//                 .then((data) => {
//                     // Update country news state
//                     setCountryNews(data || []);

//                     // Log if no news available
//                     if (data.length === 0) {
//                         console.log("No news available for this country/category combination.");
//                     }

//                     // Add markers for news with coordinates
//                     data.forEach((news) => {
//                         if (news.latitude && news.longitude) {
//                             // Format published date in IST
//                             const formattedPublishedAt = moment(news.publishedAt)
//                                 .tz("Asia/Kolkata")
//                                 .format("MMM DD, YYYY, HH:mm z");

//                             // Create marker with popup
//                             L.marker([news.latitude, news.longitude])
//                                 .addTo(markersLayer)
//                                 .bindPopup(`
//                                     <div style="max-width: 250px;">
//                                         <img 
//                                             src="${news.imageUrl || '/default-image.jpg'}" 
//                                             alt="${news.headline}" 
//                                             style="width:100%; height:auto; border-radius: 5px; margin-bottom: 5px;"
//                                             onerror="this.onerror=null; this.src='/default-image.jpg';"
//                                         >
//                                         <b>${news.headline}</b><br>
//                                         <p>${news.summary}</p>
//                                         <p><strong>Source:</strong> ${news.source}</p>
//                                         <p><strong>Category:</strong> ${news.category || 'News'}</p>
//                                         <p><strong>Published:</strong> ${formattedPublishedAt}</p>
//                                         <a href="${news.url}" target="_blank" style="color: blue; text-decoration: underline;">Read more</a>
//                                     </div>
//                                 `);
//                         }
//                     });

//                     // Open sidebar
//                     setIsSidebarOpen(true);
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching news:", error);
//                     // Reset country news on error
//                     setCountryNews([]);
//                 });
//         }
//     }, [selectedCountry, selectedCategory, markersLayer, countryLayer, setIsSidebarOpen, setCountryNews]);

//     return null;
// }


// import { useEffect, useState } from "react";
// import L from "leaflet";
// import moment from "moment-timezone";

// // Utility function for dynamic API URL
// function getApiUrl(path) {
//   // Use environment variable or dynamically determine base URL
//   const baseUrl = 
//     process.env.NEXT_PUBLIC_SITE_URL || 
//     (typeof window !== 'undefined' ? window.location.origin : '');
  
//   return `${baseUrl}${path}`;
// }

// export default function NewsFetcher({
//     markersLayer,
//     countryLayer,
//     selectedCountry,
//     selectedCategory,
//     setIsSidebarOpen,
//     setCountryNews,
//     setNewsCountByCountry
// }) {
//     // Track countries where we've already fetched news
//     const [fetchedCountries, setFetchedCountries] = useState({});
    
//     // Fetch news for the selected country
//     useEffect(() => {
//         if (selectedCountry && markersLayer && countryLayer) {
//             // Clear existing markers
//             markersLayer.clearLayers();

//             // Dynamically build URL with country and optional category
//             let apiPath = `/api/news?country=${encodeURIComponent(selectedCountry.id)}`;
            
//             // Add category if selected
//             if (selectedCategory && selectedCategory !== 'All') {
//                 apiPath += `&category=${encodeURIComponent(selectedCategory)}`;
//             }

//             // Construct full API URL
//             const apiUrl = getApiUrl(apiPath);
//             console.log('Fetching from URL:', apiUrl);

//             // Fetch news data
//             fetch(apiUrl)
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error(`Server error: ${response.statusText}`);
//                     }
//                     return response.json();
//                 })
//                 .then((data) => {
//                     // Update country news state for sidebar
//                     setCountryNews(data || []);
                    
//                     // Update news count for this country
//                     setNewsCountByCountry(prev => ({
//                         ...prev,
//                         [selectedCountry.id]: data.length
//                     }));
                    
//                     // Mark this country as fetched
//                     setFetchedCountries(prev => ({
//                         ...prev,
//                         [selectedCountry.id]: true
//                     }));

//                     // Log if no news available
//                     if (data.length === 0) {
//                         console.log("No news available for this country/category combination.");
//                     }

//                     // Add markers for news with coordinates
//                     data.forEach((news) => {
//                         if (news.latitude && news.longitude) {
//                             // Format published date in IST
//                             const formattedPublishedAt = moment(news.publishedAt)
//                                 .tz("Asia/Kolkata")
//                                 .format("MMM DD, YYYY, HH:mm z");

//                             // Create marker with popup
//                             L.marker([news.latitude, news.longitude])
//                                 .addTo(markersLayer)
//                                 .bindPopup(`
//                                     <div style="max-width: 250px;">
//                                         <img 
//                                             src="${news.imageUrl || '/default-image.jpg'}" 
//                                             alt="${news.headline}" 
//                                             style="width:100%; height:auto; border-radius: 5px; margin-bottom: 5px;"
//                                             onerror="this.onerror=null; this.src='/default-image.jpg';"
//                                         >
//                                         <b>${news.headline}</b><br>
//                                         <p>${news.summary}</p>
//                                         <p><strong>Source:</strong> ${news.source}</p>
//                                         <p><strong>Category:</strong> ${news.category || 'News'}</p>
//                                         <p><strong>Published:</strong> ${formattedPublishedAt}</p>
//                                         <a href="${news.url}" target="_blank" style="color: blue; text-decoration: underline;">Read more</a>
//                                     </div>
//                                 `);
//                         }
//                     });

//                     // Open sidebar
//                     setIsSidebarOpen(true);
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching news:", error);
//                     // Reset country news on error
//                     setCountryNews([]);
                    
//                     // Mark as having no news
//                     setNewsCountByCountry(prev => ({
//                         ...prev,
//                         [selectedCountry.id]: 0
//                     }));
//                 });
//         }
//     }, [selectedCountry, selectedCategory, markersLayer, countryLayer, setIsSidebarOpen, setCountryNews]);

//     // Preload news data for a sample of major countries on initial load
//     useEffect(() => {
//         if (countryLayer && setNewsCountByCountry) {
//             // Define some major countries to preload (you can adjust this list)
//             const majorCountries = [
//                 "USA", "GBR", "FRA", "DEU", "IND", "CHN", "JPN", "RUS", "BRA", "AUS"
//             ];
            
//             // For demonstration purposes, set some dummy data
//             // In a real implementation, you'd want to fetch this data from your API
//             const dummyData = {
//                 "USA": 15,
//                 "GBR": 8,
//                 "FRA": 6,
//                 "DEU": 7,
//                 "IND": 12,
//                 "CHN": 10,
//                 "JPN": 5,
//                 "RUS": 9,
//                 "BRA": 4,
//                 "AUS": 3
//             };
            
//             // Update news count by country with dummy data
//             setNewsCountByCountry(dummyData);
//         }
//     }, [countryLayer, setNewsCountByCountry]);

//     return null;
// // }

// import { useEffect, useState } from "react";
// import L from "leaflet";
// import moment from "moment-timezone";

// // Utility function for dynamic API URL
// function getApiUrl(path) {
//   // Use environment variable or dynamically determine base URL
//   const baseUrl = 
//     process.env.NEXT_PUBLIC_SITE_URL || 
//     (typeof window !== 'undefined' ? window.location.origin : '');
  
//   return `${baseUrl}${path}`;
// }

// export default function NewsFetcher({
//     markersLayer,
//     countryLayer,
//     selectedCountry,
//     selectedCategory,
//     setIsSidebarOpen,
//     setCountryNews,
//     setNewsCountByCountry
// }) {
//     // Track countries where we've already fetched news
//     const [fetchedCountries, setFetchedCountries] = useState({});
    
//     // Fetch news for the selected country
//     useEffect(() => {
//         if (selectedCountry && markersLayer && countryLayer) {
//             // Clear existing markers
//             markersLayer.clearLayers();

//             // Dynamically build URL with country and optional category
//             let apiPath = `/api/news?country=${encodeURIComponent(selectedCountry.id)}`;
            
//             // Add category if selected
//             if (selectedCategory && selectedCategory !== 'All') {
//                 apiPath += `&category=${encodeURIComponent(selectedCategory)}`;
//             }

//             // Construct full API URL
//             const apiUrl = getApiUrl(apiPath);
//             console.log('Fetching from URL:', apiUrl);

//             // Fetch news data
//             fetch(apiUrl)
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error(`Server error: ${response.statusText}`);
//                     }
//                     return response.json();
//                 })
//                 .then((data) => {
//                     // Update country news state for sidebar
//                     setCountryNews(data || []);
                    
//                     // Update news count for this country
//                     setNewsCountByCountry(prev => ({
//                         ...prev,
//                         [selectedCountry.id]: data.length
//                     }));
                    
//                     // Mark this country as fetched
//                     setFetchedCountries(prev => ({
//                         ...prev,
//                         [selectedCountry.id]: true
//                     }));

//                     // Log if no news available
//                     if (data.length === 0) {
//                         console.log("No news available for this country/category combination.");
//                     }

//                     // Add markers for news with coordinates
//                     data.forEach((news) => {
//                         if (news.latitude && news.longitude) {
//                             // Format published date in IST
//                             const formattedPublishedAt = moment(news.publishedAt)
//                                 .tz("Asia/Kolkata")
//                                 .format("MMM DD, YYYY, HH:mm z");

//                             // Create marker with popup
//                             L.marker([news.latitude, news.longitude])
//                                 .addTo(markersLayer)
//                                 .bindPopup(`
//                                     <div style="max-width: 250px;">
//                                         <img 
//                                             src="${news.imageUrl || '/default-image.jpg'}" 
//                                             alt="${news.headline}" 
//                                             style="width:100%; height:auto; border-radius: 5px; margin-bottom: 5px;"
//                                             onerror="this.onerror=null; this.src='/default-image.jpg';"
//                                         >
//                                         <b>${news.headline}</b><br>
//                                         <p>${news.summary}</p>
//                                         <p><strong>Source:</strong> ${news.source}</p>
//                                         <p><strong>Category:</strong> ${news.category || 'News'}</p>
//                                         <p><strong>Published:</strong> ${formattedPublishedAt}</p>
//                                         <a href="${news.url}" target="_blank" style="color: blue; text-decoration: underline;">Read more</a>
//                                     </div>
//                                 `);
//                         }
//                     });

//                     // Open sidebar
//                     setIsSidebarOpen(true);
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching news:", error);
//                     // Reset country news on error
//                     setCountryNews([]);
                    
//                     // Mark as having no news
//                     setNewsCountByCountry(prev => ({
//                         ...prev,
//                         [selectedCountry.id]: 0
//                     }));
//                 });
//         }
//     }, [selectedCountry, selectedCategory, markersLayer, countryLayer, setIsSidebarOpen, setCountryNews]);

//     // Initialize with sample countries (we'll progressively build real data as user interacts)
//     useEffect(() => {
//         if (countryLayer && Object.keys(fetchedCountries).length === 0) {
//             // Define major countries to preload news count for visualization
//             const majorCountries = [
//                 "USA", "GBR", "FRA", "DEU", "IND", "CHN", "JPN", "RUS", "BRA", "AUS", 
//                 "CAN", "ESP", "ITA", "NLD", "ZAF", "KOR", "MEX", "SAU", "EGY", "UKR","ECU"
//             ];
            
//             // Process countries one by one to avoid overwhelming the server
//             const processCountries = async () => {
//                 console.log("Initializing country news counts...");
//                 const newsCounts = {};
                
//                 // Process countries sequentially with a slight delay between requests
//                 for (const countryCode of majorCountries) {
//                     try {
//                         const apiUrl = getApiUrl(`/api/news?country=${countryCode}&limit=1`);
//                         const response = await fetch(apiUrl);
                        
//                         if (response.ok) {
//                             const data = await response.json();
//                             // Store the count for visualization
//                             newsCounts[countryCode] = data.length;
//                             console.log(`${countryCode}: ${data.length} news items`);
                            
//                             // Mark as fetched
//                             setFetchedCountries(prev => ({
//                                 ...prev,
//                                 [countryCode]: true
//                             }));
                            
//                             // Update the state incrementally
//                             setNewsCountByCountry(prev => ({
//                                 ...prev,
//                                 [countryCode]: data.length
//                             }));
                            
//                             // Small delay to avoid overwhelming the server
//                             await new Promise(resolve => setTimeout(resolve, 100));
//                         }
//                     } catch (error) {
//                         console.error(`Error fetching data for ${countryCode}:`, error);
//                     }
//                 }
//             };
            
//             // Start processing countries with a slight delay after component mount
//             setTimeout(() => {
//                 processCountries();
//             }, 500);
            
//             // Fallback to some initial dummy data for immediate visualization
//             setNewsCountByCountry({
                 
//             });
//         }
//     }, [countryLayer, fetchedCountries, setNewsCountByCountry]);

//     return null;
// }

// import { useEffect, useState } from "react";
// import L from "leaflet";
// import moment from "moment-timezone";

// // Utility function for dynamic API URL
// function getApiUrl(path) {
//   const baseUrl =
//     process.env.NEXT_PUBLIC_SITE_URL ||
//     (typeof window !== "undefined" ? window.location.origin : "");

//   return `${baseUrl}${path}`;
// }

// export default function NewsFetcher({
//   markersLayer,
//   countryLayer,
//   selectedCountry,
//   selectedCategory,
//   setIsSidebarOpen,
//   setCountryNews,
//   setNewsCountByCountry,
// }) {
//   const [fetchedCountries, setFetchedCountries] = useState({});
//   const [countryCodes, setCountryCodes] = useState([]);

//   // Fetch country codes dynamically
//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await fetch(getApiUrl("/api/countries"));
//         if (!response.ok) throw new Error("Failed to fetch country data");

//         const countries = await response.json();
//         const codes = countries.map((country) => country.code); // Extract country codes
//         setCountryCodes(codes);
//       } catch (error) {
//         console.error("Error fetching country codes:", error);
//       }
//     };

//     fetchCountries();
//   }, []);

//   // Fetch news for the selected country
//   useEffect(() => {
//     if (selectedCountry && markersLayer && countryLayer) {
//       markersLayer.clearLayers();
//       let apiPath = `/api/news?country=${encodeURIComponent(selectedCountry.id)}`;
//       if (selectedCategory && selectedCategory !== "All") {
//         apiPath += `&category=${encodeURIComponent(selectedCategory)}`;
//       }

//       const apiUrl = getApiUrl(apiPath);
//       console.log("Fetching from URL:", apiUrl);

//       fetch(apiUrl)
//         .then((response) => {
//           if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
//           return response.json();
//         })
//         .then((data) => {
//           setCountryNews(data || []);
//           setNewsCountByCountry((prev) => ({
//             ...prev,
//             [selectedCountry.id]: data.length,
//           }));

//           setFetchedCountries((prev) => ({
//             ...prev,
//             [selectedCountry.id]: true,
//           }));

//           if (data.length === 0) console.log("No news available for this country/category.");

//           data.forEach((news) => {
//             if (news.latitude && news.longitude) {
//               const formattedPublishedAt = moment(news.publishedAt)
//                 .tz("Asia/Kolkata")
//                 .format("MMM DD, YYYY, HH:mm z");

//               L.marker([news.latitude, news.longitude])
//                 .addTo(markersLayer)
//                 .bindPopup(`
//                   <div style="max-width: 250px;">
//                     <img 
//                       src="${news.imageUrl || "/default-image.jpg"}" 
//                       alt="${news.headline}" 
//                       style="width:100%; height:auto; border-radius: 5px; margin-bottom: 5px;"
//                       onerror="this.onerror=null; this.src='/default-image.jpg';"
//                     >
//                     <b>${news.headline}</b><br>
//                     <p>${news.summary}</p>
//                     <p><strong>Source:</strong> ${news.source}</p>
//                     <p><strong>Category:</strong> ${news.category || "News"}</p>
//                     <p><strong>Published:</strong> ${formattedPublishedAt}</p>
//                     <a href="${news.url}" target="_blank" style="color: blue; text-decoration: underline;">Read more</a>
//                   </div>
//                 `);
//             }
//           });

//           setIsSidebarOpen(true);
//         })
//         .catch((error) => {
//           console.error("Error fetching news:", error);
//           setCountryNews([]);
//           setNewsCountByCountry((prev) => ({
//             ...prev,
//             [selectedCountry.id]: 0,
//           }));
//         });
//     }
//   }, [selectedCountry, selectedCategory, markersLayer, countryLayer, setIsSidebarOpen, setCountryNews]);

//   // Preload news count for all countries
//   useEffect(() => {
//     if (countryLayer && countryCodes.length > 0 && Object.keys(fetchedCountries).length === 0) {
//       console.log("Initializing country news counts...");
//       const newsCounts = {};

//       const processCountries = async () => {
//         for (const countryCode of countryCodes) {
//           try {
//             const apiUrl = getApiUrl(`/api/news?country=${countryCode}&limit=1`);
//             const response = await fetch(apiUrl);
//             if (response.ok) {
//               const data = await response.json();
//               newsCounts[countryCode] = data.length;

//               setFetchedCountries((prev) => ({
//                 ...prev,
//                 [countryCode]: true,
//               }));

//               setNewsCountByCountry((prev) => ({
//                 ...prev,
//                 [countryCode]: data.length,
//               }));

//               await new Promise((resolve) => setTimeout(resolve, 100));
//             }
//           } catch (error) {
//             console.error(`Error fetching data for ${countryCode}:`, error);
//           }
//         }
//       };

//       setTimeout(() => {
//         processCountries();
//       }, 500);
//     }
//   }, [countryLayer, countryCodes, fetchedCountries, setNewsCountByCountry]);

//   return null;
// }


// NewsFetcher.js - Updated with breaking vs recent news categorization

// import { useEffect, useState } from "react";
// import L from "leaflet";
// import moment from "moment-timezone";

// // Utility function for dynamic API URL
// function getApiUrl(path) {
//   const baseUrl =
//     process.env.NEXT_PUBLIC_SITE_URL ||
//     (typeof window !== "undefined" ? window.location.origin : "");

//   return `${baseUrl}${path}`;
// }

// export default function NewsFetcher({
//   markersLayer,
//   countryLayer,
//   selectedCountry,
//   selectedCategory,
//   setIsSidebarOpen,
//   setCountryNews,
//   setNewsCountByCountry,
// }) {
//   const [fetchedCountries, setFetchedCountries] = useState({});
//   const [countryCodes, setCountryCodes] = useState([]);
//   const [newsTimestamps, setNewsTimestamps] = useState({});

//   // Fetch country codes dynamically
//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await fetch(getApiUrl("/api/countries"));
//         if (!response.ok) throw new Error("Failed to fetch country data");

//         const countries = await response.json();
//         const codes = countries.map((country) => country.code); // Extract country codes
//         setCountryCodes(codes);
//       } catch (error) {
//         console.error("Error fetching country codes:", error);
//       }
//     };

//     fetchCountries();
//   }, []);

//   // Fetch news for the selected country
//   useEffect(() => {
//     if (selectedCountry && markersLayer && countryLayer) {
//       markersLayer.clearLayers();
//       let apiPath = `/api/news?country=${encodeURIComponent(selectedCountry.id)}`;
//       if (selectedCategory && selectedCategory !== "All") {
//         apiPath += `&category=${encodeURIComponent(selectedCategory)}`;
//       }

//       const apiUrl = getApiUrl(apiPath);
//       console.log("Fetching from URL:", apiUrl);

//       fetch(apiUrl)
//         .then((response) => {
//           if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
//           return response.json();
//         })
//         .then((data) => {
//           setCountryNews(data || []);
          
//           // Process news timestamps to categorize breaking vs recent news
//           const now = Date.now();
//           const timestamps = data.map(news => new Date(news.publishedAt).getTime());
          
//           // Store timestamps
//           setNewsTimestamps(prev => ({
//             ...prev,
//             [selectedCountry.id]: timestamps
//           }));
          
//           // Count breaking news (0-5 minutes) and recent news (5-10 minutes)
//           const breakingNewsCount = timestamps.filter(
//             time => (now - time) < 300000 // Less than 5 minutes
//           ).length;
          
//           const recentNewsCount = timestamps.filter(
//             time => (now - time) >= 300000 && (now - time) < 600000 // Between 5-10 minutes
//           ).length;
          
//           // Update news counts including breaking vs recent categorization
//           setNewsCountByCountry(prev => ({
//             ...prev,
//             [selectedCountry.id]: data.length,
//             [`${selectedCountry.id}_breaking`]: breakingNewsCount,
//             [`${selectedCountry.id}_recent`]: recentNewsCount
//           }));

//           setFetchedCountries(prev => ({
//             ...prev,
//             [selectedCountry.id]: true
//           }));

//           if (data.length === 0) console.log("No news available for this country/category.");

//           data.forEach((news) => {
//             if (news.latitude && news.longitude) {
//               const formattedPublishedAt = moment(news.publishedAt)
//                 .tz("Asia/Kolkata")
//                 .format("MMM DD, YYYY, HH:mm z");
              
//               // Calculate how recent this news is
//               const newsTimestamp = new Date(news.publishedAt).getTime();
//               const newsAge = now - newsTimestamp;
//               const isBreakingNews = newsAge < 300000; // Less than 5 minutes old
              
//               // Enhanced popup with weather info for the news location
//               L.marker([news.latitude, news.longitude])
//                 .addTo(markersLayer)
//                 .bindPopup(`
//                   <div style="max-width: 250px;">
//                     <div style="position: absolute; top: 5px; right: 5px; background: ${
//                       isBreakingNews ? '#ff0000' : '#ff6600'
//                     }; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">
//                       ${isBreakingNews ? 'BREAKING' : 'RECENT'}
//                     </div>
//                     <img 
//                       src="${news.imageUrl || "/default-image.jpg"}" 
//                       alt="${news.headline}" 
//                       style="width:100%; height:auto; border-radius: 5px; margin-bottom: 5px;"
//                       onerror="this.onerror=null; this.src='/default-image.jpg';"
//                     >
//                     <b>${news.headline}</b><br>
//                     <p>${news.summary}</p>
//                     <p><strong>Source:</strong> ${news.source}</p>
//                     <p><strong>Category:</strong> ${news.category || "News"}</p>
//                     <p><strong>Published:</strong> ${formattedPublishedAt}</p>
//                     <p><strong>Local Weather:</strong> <span class="weather-data">Loading...</span></p>
//                     <a href="${news.url}" target="_blank" style="color: blue; text-decoration: underline;">Read more</a>
//                   </div>
//                 `);
//             }
//           });

//           setIsSidebarOpen(true);
//         })
//         .catch((error) => {
//           console.error("Error fetching news:", error);
//           setCountryNews([]);
//           setNewsCountByCountry(prev => ({
//             ...prev,
//             [selectedCountry.id]: 0,
//             [`${selectedCountry.id}_breaking`]: 0,
//             [`${selectedCountry.id}_recent`]: 0
//           }));
//         });
//     }
//   }, [selectedCountry, selectedCategory, markersLayer, countryLayer, setIsSidebarOpen, setCountryNews]);

//   // Preload news count for all countries
//   useEffect(() => {
//     if (countryLayer && countryCodes.length > 0 && Object.keys(fetchedCountries).length === 0) {
//       console.log("Initializing country news counts...");
//       const newsCounts = {};

//       const processCountries = async () => {
//         for (const countryCode of countryCodes) {
//           try {
//             const apiUrl = getApiUrl(`/api/news?country=${countryCode}&limit=1`);
//             const response = await fetch(apiUrl);
//             if (response.ok) {
//               const data = await response.json();
              
//               // Mock breaking vs recent news for preloaded countries 
//               // In production you'd fetch actual timestamps
//               const totalCount = data.length;
//               const breakingCount = Math.floor(totalCount * 0.4); // 40% breaking
//               const recentCount = totalCount - breakingCount; // 60% recent
              
//               newsCounts[countryCode] = totalCount;
//               newsCounts[`${countryCode}_breaking`] = breakingCount;
//               newsCounts[`${countryCode}_recent`] = recentCount;

//               setFetchedCountries(prev => ({
//                 ...prev,
//                 [countryCode]: true
//               }));

//               setNewsCountByCountry(prev => ({
//                 ...prev,
//                 [countryCode]: totalCount,
//                 [`${countryCode}_breaking`]: breakingCount,
//                 [`${countryCode}_recent`]: recentCount
//               }));

//               await new Promise(resolve => setTimeout(resolve, 100));
//             }
//           } catch (error) {
//             console.error(`Error fetching data for ${countryCode}:`, error);
//           }
//         }
//       };

//       setTimeout(() => {
//         processCountries();
//       }, 500);
//     }
//   }, [countryLayer, countryCodes, fetchedCountries, setNewsCountByCountry]);

//   return null;
// }


// NewsFetcher.js - Optimized for real-time updates and performance
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import moment from "moment-timezone";

// Utility function for dynamic API URL
function getApiUrl(path) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  return `${baseUrl}${path}`;
}

export default function NewsFetcher({
  markersLayer,
  countryLayer,
  selectedCountry,
  selectedCategory,
  setIsSidebarOpen,
  setCountryNews,
  setNewsCountByCountry,
}) {
  const [fetchedCountries, setFetchedCountries] = useState({});
  const [countryCodes, setCountryCodes] = useState([]);
  const [newsTimestamps, setNewsTimestamps] = useState({});
  const wsRef = useRef(null);
  const fetchThrottleRef = useRef(null);
  const countryFlagsRef = useRef({});

  // Fetch country codes and flags dynamically
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(getApiUrl("/api/countries"));
        if (!response.ok) throw new Error("Failed to fetch country data");

        const countries = await response.json();
        const codes = countries.map((country) => country.code); // Extract country codes
        
        // Store country flags for use in tooltips and UI
        const flagsMap = {};
        countries.forEach(country => {
          if (country.code && country.flag) {
            flagsMap[country.code] = country.flag;
          }
        });
        countryFlagsRef.current = flagsMap;
        
        setCountryCodes(codes);
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };

    fetchCountries();
    
    // Setup WebSocket connection for real-time news updates
    const setupWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws`;
      
      try {
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log("WebSocket connection established for news updates");
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'newsUpdate' && data.payload) {
              handleRealtimeNewsUpdate(data.payload);
            }
          } catch (error) {
            console.error("Error parsing WebSocket news message:", error);
          }
        };
        
        ws.onerror = (error) => {
          console.error("WebSocket error for news updates:", error);
          // Fallback to polling
          setupPolling();
        };
        
        ws.onclose = () => {
          console.log("WebSocket connection closed for news updates");
          // Try to reconnect after delay
          setTimeout(setupWebSocket, 3000);
        };
        
        wsRef.current = ws;
      } catch (error) {
        console.error("Error setting up WebSocket for news updates:", error);
        setupPolling();
      }
    };
    
    // Fallback polling mechanism
    const setupPolling = () => {
      console.log("Setting up news polling fallback");
      const pollInterval = setInterval(() => {
        fetchNewsCountsPolling();
      }, 10000); // Poll every 10 seconds
      
      return () => clearInterval(pollInterval);
    };
    
    setupWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (fetchThrottleRef.current) {
        clearTimeout(fetchThrottleRef.current);
      }
    };
  }, []);

  // Handler for real-time news updates received via WebSocket
  const handleRealtimeNewsUpdate = (newsData) => {
    if (!newsData || !newsData.countryCode) return;
    
    const countryCode = newsData.countryCode;
    const now = Date.now();
    
    // Update news counts
    setNewsCountByCountry(prev => {
      const currentTotal = prev[countryCode] || 0;
      const currentBreaking = prev[`${countryCode}_breaking`] || 0;
      
      return {
        ...prev,
        [countryCode]: currentTotal + 1,
        [`${countryCode}_breaking`]: currentBreaking + 1
      };
    });
    
    // Update timestamps to track recency
    setNewsTimestamps(prev => {
      const timestamps = prev[countryCode] || [];
      return {
        ...prev,
        [countryCode]: [now, ...timestamps]
      };
    });
    
    // If this country is currently selected, add to visible news list
    if (selectedCountry && selectedCountry.id === countryCode) {
      setCountryNews(prev => [newsData, ...prev]);
    }
  };

  // Polling fallback to fetch news counts
  const fetchNewsCountsPolling = async () => {
    try {
      const response = await fetch(getApiUrl('/api/counts'));
      if (response.ok) {
        const data = await response.json();
        
        // Process counts data
        const now = Date.now();
        const processedCounts = {};
        
        Object.entries(data).forEach(([countryCode, count]) => {
          // Distribute counts between breaking and recent (mock distribution for polling)
          const breakingCount = Math.floor(count * 0.3); // 30% breaking
          const recentCount = count - breakingCount;
          
          processedCounts[countryCode] = count;
          processedCounts[`${countryCode}_breaking`] = breakingCount;
          processedCounts[`${countryCode}_recent`] = recentCount;
          
          // Mark countries as fetched
          setFetchedCountries(prev => ({
            ...prev,
            [countryCode]: true
          }));
        });
        
        setNewsCountByCountry(prev => ({
          ...prev,
          ...processedCounts
        }));
      }
    } catch (error) {
      console.error("Error polling news counts:", error);
    }
  };

  // Fetch news for the selected country
  useEffect(() => {
    if (selectedCountry && markersLayer && countryLayer) {
      markersLayer.clearLayers();
      let apiPath = `/api/news?country=${encodeURIComponent(selectedCountry.id)}`;
      if (selectedCategory && selectedCategory !== "All") {
        apiPath += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      // Throttle fetch requests to prevent excessive API calls
      if (fetchThrottleRef.current) {
        clearTimeout(fetchThrottleRef.current);
      }
      
      fetchThrottleRef.current = setTimeout(async () => {
        try {
          const apiUrl = getApiUrl(apiPath);
          console.log("Fetching news from URL:", apiUrl);
          
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
          
          const data = await response.json();
          setCountryNews(data || []);
          
          // Process news timestamps to categorize breaking vs recent news
          const now = Date.now();
          const timestamps = data.map(news => new Date(news.publishedAt).getTime());
          
          // Store timestamps
          setNewsTimestamps(prev => ({
            ...prev,
            [selectedCountry.id]: timestamps
          }));
          
          // Count breaking news (0-5 minutes) and recent news (5-30 minutes)
          const breakingNewsCount = timestamps.filter(
            time => (now - time) < 300000 // Less than 5 minutes
          ).length;
          
          const recentNewsCount = timestamps.filter(
            time => (now - time) >= 300000 && (now - time) < 1800000 // Between 5-30 minutes
          ).length;
          
          // Update news counts including breaking vs recent categorization
          setNewsCountByCountry(prev => ({
            ...prev,
            [selectedCountry.id]: data.length,
            [`${selectedCountry.id}_breaking`]: breakingNewsCount,
            [`${selectedCountry.id}_recent`]: recentNewsCount
          }));

          setFetchedCountries(prev => ({
            ...prev,
            [selectedCountry.id]: true
          }));

          // Only create markers if we have data
          if (data.length > 0) {
            // Use batch processing for better performance
            const markers = data
              .filter(news => news.latitude && news.longitude)
              .map(news => {
                const formattedPublishedAt = moment(news.publishedAt)
                  .tz("Asia/Kolkata")
                  .format("MMM DD, YYYY, HH:mm z");
                
                // Calculate how recent this news is
                const newsTimestamp = new Date(news.publishedAt).getTime();
                const newsAge = now - newsTimestamp;
                const isBreakingNews = newsAge < 300000; // Less than 5 minutes old
                
                // Get country flag if available
                const countryFlag = countryFlagsRef.current[news.countryCode] || '';
                const flagDisplay = countryFlag ? `${countryFlag} ` : '';
                
                // Create marker with enhanced popup content
                const marker = L.marker([news.latitude, news.longitude]);
                
                marker.bindPopup(`
                  <div style="max-width: 280px;">
                    <div style="position: absolute; top: 5px; right: 5px; background: ${
                      isBreakingNews ? '#ff0000' : '#ff6600'
                    }; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">
                      ${isBreakingNews ? 'BREAKING' : 'RECENT'}
                    </div>
                    <img 
                      src="${news.imageUrl || "/default-image.jpg"}" 
                      alt="${news.headline}" 
                      style="width:100%; height:auto; border-radius: 5px; margin-bottom: 8px;"
                      onerror="this.onerror=null; this.src='/default-image.jpg';"
                    >
                    <h3 style="margin-top:0; margin-bottom:8px;">${flagDisplay}${news.headline}</h3>
                    <p style="margin-top:0;">${news.summary}</p>
                    <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.9em;">
                      <span><strong>Source:</strong> ${news.source}</span>
                      <span><strong>Category:</strong> ${news.category || "News"}</span>
                    </div>
                    <p><strong>Published:</strong> ${formattedPublishedAt}</p>
                    <a href="${news.url}" target="_blank" style="display:block; margin-top:10px; padding:6px 12px; background:#1A4875; color:white; text-align:center; text-decoration:none; border-radius:4px;">Read full article</a>
                  </div>
                `);
                
                return marker;
              });
            
            // Add all markers at once for better performance
            if (markers.length > 0) {
              const markerGroup = L.layerGroup(markers);
              markersLayer.addLayer(markerGroup);
            }
          }

          setIsSidebarOpen(true);
        } catch (error) {
          console.error("Error fetching news:", error);
          setCountryNews([]);
          setNewsCountByCountry(prev => ({
            ...prev,
            [selectedCountry.id]: 0,
            [`${selectedCountry.id}_breaking`]: 0,
            [`${selectedCountry.id}_recent`]: 0
          }));
        }
      }, 100); // Small delay to prevent excessive API calls
    }
  }, [selectedCountry, selectedCategory, markersLayer, countryLayer, setIsSidebarOpen, setCountryNews]);

  // Preload news count for all countries with batching
  useEffect(() => {
    if (countryLayer && countryCodes.length > 0 && Object.keys(fetchedCountries).length === 0) {
      console.log("Initializing country news counts...");

      const processCountries = async () => {
        // Process countries in batches for better performance
        const batchSize = 5;
        for (let i = 0; i < countryCodes.length; i += batchSize) {
          const batch = countryCodes.slice(i, i + batchSize);
          
          await Promise.all(batch.map(async (countryCode) => {
            try {
              const apiUrl = getApiUrl(`/api/counts?country=${countryCode}`);
              const response = await fetch(apiUrl);
              
              if (response.ok) {
                const data = await response.json();
                const countForCountry = data[countryCode] || 0;
                
                // Mock breaking vs recent news distribution
                const breakingCount = Math.floor(countForCountry * 0.3); // 30% breaking
                const recentCount = countForCountry - breakingCount;
                
                setNewsCountByCountry(prev => ({
                  ...prev,
                  [countryCode]: countForCountry,
                  [`${countryCode}_breaking`]: breakingCount,
                  [`${countryCode}_recent`]: recentCount
                }));

                setFetchedCountries(prev => ({
                  ...prev,
                  [countryCode]: true
                }));
              }
            } catch (error) {
              console.error(`Error fetching data for ${countryCode}:`, error);
            }
          }));
          
          // Small delay between batches to prevent overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      };

      // Start processing with a short delay to allow the map to initialize first
      setTimeout(() => {
        processCountries();
      }, 500);
    }
  }, [countryLayer, countryCodes, fetchedCountries]);

  return null;
}