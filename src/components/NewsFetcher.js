// import { useEffect } from "react";
// import L from "leaflet";
// import moment from "moment-timezone";

// export default function NewsFetcher({
//     markersLayer,
//     countryLayer,
//     selectedCountry,
//     setIsSidebarOpen,
//     setCountryNews,
// }) {
//     useEffect(() => {
//         if (selectedCountry && markersLayer && countryLayer) {
//             markersLayer.clearLayers();

//             fetch(`http://localhost:3000/api/news?country=${encodeURIComponent(selectedCountry.id)}`)
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error(`Server error: ${response.statusText}`);
//                     }
//                     return response.json();
//                 })
//                 .then((data) => {
//                    // console.log("Fetched News Data:", data); // Debugging
//                     //console.log("Data received from API:", data); // Log the received data
//                     setCountryNews(data || []);

//                     if (data.length === 0) {
//                         console.log("No news available for this country.");
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
//                                        <p><strong>Published:</strong> ${new Date(news.publishedAt).toLocaleString("en-GB", { 
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
//     }, [selectedCountry, markersLayer, countryLayer, setIsSidebarOpen, setCountryNews]);

//     return null;
// }


import { useEffect } from "react";
import L from "leaflet";
import moment from "moment-timezone";

export default function NewsFetcher({
    markersLayer,
    countryLayer,
    selectedCountry,
    selectedCategory,
    setIsSidebarOpen,
    setCountryNews,
}) {
    useEffect(() => {
        if (selectedCountry && markersLayer && countryLayer) {
            markersLayer.clearLayers();

            // Build URL with country and optional category
            let apiUrl = `http://localhost:3000/api/news?country=${encodeURIComponent(selectedCountry.id)}`;
            if (selectedCategory && selectedCategory !== 'All') {
                apiUrl += `&category=${encodeURIComponent(selectedCategory)}`;
            }

            fetch(apiUrl)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    setCountryNews(data || []);

                    if (data.length === 0) {
                        console.log("No news available for this country/category combination.");
                    }

                    data.forEach((news) => {
                        if (news.latitude && news.longitude) {
                            const formattedPublishedAt = moment(news.publishedAt)
                            .tz("Asia/Kolkata")
                            .format("MMM DD, YYYY, HH:mm z"); // Convert to IST
                            L.marker([news.latitude, news.longitude])
                                .addTo(markersLayer)
                                .bindPopup(`
                                    <div style="max-width: 250px;">
                                        <img 
                                            src="${news.imageUrl}" 
                                            alt="${news.headline}" 
                                            style="width:100%; height:auto; border-radius: 5px; margin-bottom: 5px;"
                                            onerror="this.onerror=null; this.src='/default-image.jpg';"
                                        >
                                        <b>${news.headline}</b><br>
                                        <p>${news.summary}</p>
                                        <p><strong>Source:</strong> ${news.source}</p>
                                        <p><strong>Category:</strong> ${news.category || 'News'}</p>
                                        <p><strong>Published:</strong> ${new Date(news.publishedAt).toLocaleString("en-GB", { 
                                                timeZone: "Asia/Kolkata", 
                                                weekday: "short", 
                                                year: "numeric", 
                                                month: "short", 
                                                day: "numeric", 
                                                hour: "2-digit", 
                                                minute: "2-digit", 
                                                second: "2-digit" 
                                            })}</p>
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
                });
        }
    }, [selectedCountry, selectedCategory, markersLayer, countryLayer, setIsSidebarOpen, setCountryNews]);

    return null;
}