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

import { useEffect, useState } from "react";
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

  // Fetch country codes dynamically
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(getApiUrl("/api/countries"));
        if (!response.ok) throw new Error("Failed to fetch country data");

        const countries = await response.json();
        const codes = countries.map((country) => country.code); // Extract country codes
        setCountryCodes(codes);
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch news for the selected country
  useEffect(() => {
    if (selectedCountry && markersLayer && countryLayer) {
      markersLayer.clearLayers();
      let apiPath = `/api/news?country=${encodeURIComponent(selectedCountry.id)}`;
      if (selectedCategory && selectedCategory !== "All") {
        apiPath += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const apiUrl = getApiUrl(apiPath);
      console.log("Fetching from URL:", apiUrl);

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
          return response.json();
        })
        .then((data) => {
          setCountryNews(data || []);
          setNewsCountByCountry((prev) => ({
            ...prev,
            [selectedCountry.id]: data.length,
          }));

          setFetchedCountries((prev) => ({
            ...prev,
            [selectedCountry.id]: true,
          }));

          if (data.length === 0) console.log("No news available for this country/category.");

          data.forEach((news) => {
            if (news.latitude && news.longitude) {
              const formattedPublishedAt = moment(news.publishedAt)
                .tz("Asia/Kolkata")
                .format("MMM DD, YYYY, HH:mm z");

              L.marker([news.latitude, news.longitude])
                .addTo(markersLayer)
                .bindPopup(`
                  <div style="max-width: 250px;">
                    <img 
                      src="${news.imageUrl || "/default-image.jpg"}" 
                      alt="${news.headline}" 
                      style="width:100%; height:auto; border-radius: 5px; margin-bottom: 5px;"
                      onerror="this.onerror=null; this.src='/default-image.jpg';"
                    >
                    <b>${news.headline}</b><br>
                    <p>${news.summary}</p>
                    <p><strong>Source:</strong> ${news.source}</p>
                    <p><strong>Category:</strong> ${news.category || "News"}</p>
                    <p><strong>Published:</strong> ${formattedPublishedAt}</p>
                    <a href="${news.url}" target="_blank" style="color: blue; text-decoration: underline;">Read more</a>
                  </div>
                `);
            }
          });

          setIsSidebarOpen(true);
        })
        .catch((error) => {
          console.error("Error fetching news:", error);
          setCountryNews([]);
          setNewsCountByCountry((prev) => ({
            ...prev,
            [selectedCountry.id]: 0,
          }));
        });
    }
  }, [selectedCountry, selectedCategory, markersLayer, countryLayer, setIsSidebarOpen, setCountryNews]);

  // Preload news count for all countries
  useEffect(() => {
    if (countryLayer && countryCodes.length > 0 && Object.keys(fetchedCountries).length === 0) {
      console.log("Initializing country news counts...");
      const newsCounts = {};

      const processCountries = async () => {
        for (const countryCode of countryCodes) {
          try {
            const apiUrl = getApiUrl(`/api/news?country=${countryCode}&limit=1`);
            const response = await fetch(apiUrl);
            if (response.ok) {
              const data = await response.json();
              newsCounts[countryCode] = data.length;

              setFetchedCountries((prev) => ({
                ...prev,
                [countryCode]: true,
              }));

              setNewsCountByCountry((prev) => ({
                ...prev,
                [countryCode]: data.length,
              }));

              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          } catch (error) {
            console.error(`Error fetching data for ${countryCode}:`, error);
          }
        }
      };

      setTimeout(() => {
        processCountries();
      }, 500);
    }
  }, [countryLayer, countryCodes, fetchedCountries, setNewsCountByCountry]);

  return null;
}
