// // import { useEffect, useState } from "react";
// // import L from "leaflet";
// // import "leaflet/dist/leaflet.css";
// // import SearchModal from "@/components/SearchModal";  
// // import NewsFetcher from "@/components/NewsFetcher"; 
// // import Sidebar from "@/components/Sidebar"; 

// // export default function MapView() {
// //   const [map, setMap] = useState(null);
// //   const [countryLayer, setCountryLayer] = useState(null);
// //   const [markersLayer, setMarkersLayer] = useState(null);
// //   const [countryNames, setCountryNames] = useState([]);
// //   const [selectedCountry, setSelectedCountry] = useState(null);
// //   const [countryNews, setCountryNews] = useState([]); 
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// // useEffect(() => {
// //   if (typeof window !== "undefined" && !map) {
// //     const mapInstance = L.map("map", {
// //       center: [20, 0],
// //       zoom: 4,
// //       minZoom: 4,
// //       maxZoom: 5,
// //       worldCopyJump: false,
// //       maxBounds: [
// //         [-75, -175],
// //         [84, 180]
// //       ],
// //       maxBoundsViscosity: 1.0,
// //       doubleClickZoom: true,
// //       zoomControl: false,
// //       attributionControl: false
// //     });

// //     L.control.zoom({ position: "bottomright" }).addTo(mapInstance);
// //     setMap(mapInstance);

// //     const markers = L.layerGroup().addTo(mapInstance);
// //     setMarkersLayer(markers);

// //     mapInstance.on("dblclick", () => {
// //       const currentZoom = mapInstance.getZoom();
// //       const maxZoom = mapInstance.getMaxZoom();
// //       const minZoom = mapInstance.getMinZoom();

// //       if (currentZoom < maxZoom) {
// //         mapInstance.zoomIn();
// //       } else {
// //         mapInstance.setZoom(minZoom);
// //       }
// //     });

// //     fetch("/countries.geo.json")
// //       .then((response) => response.json())
// //       .then((data) => {
// //         const layer = L.geoJSON(data, {
// //           style: {
// //             color: "#00ccff",
// //             weight: 1,
// //             fillOpacity: 0.4
// //           },
// //           onEachFeature: (feature, layer) => {
// //             const tooltip = L.tooltip({ permanent: false, opacity: 1 })
// //               .setContent(`<b>${feature.properties.name}</b>`);

// //             const highlightStyle = { fillOpacity: 0.7 };
// //             const defaultStyle = { fillOpacity: 0.4 };

// //             const onMouseOver = () => layer.setStyle(highlightStyle);
// //             const onMouseOut = () => layer.setStyle(defaultStyle);

// //             layer.on("mouseover", onMouseOver);
// //             layer.on("mouseout", onMouseOut);
// //             layer.on("mousemove", (event) => tooltip.setLatLng(event.latlng).addTo(mapInstance));
// //             layer.on("mouseout", () => tooltip.remove());

// //             layer.on("click", (e) => {
// //               if (e && e.originalEvent) {
// //                 e.originalEvent.stopPropagation();
// //               }

// //               removeAllMarkers();
// //               setSelectedCountry({ id: feature.id, name: feature.properties.name });
// //               highlightCountry(feature.properties.name);
// //               setIsSidebarOpen(true);
// //             });

// //             layer.on("remove", () => {
// //               layer.off("mouseover", onMouseOver);
// //               layer.off("mouseout", onMouseOut);
// //               layer.off("mousemove");
// //               layer.off("click");
// //             });
// //           }
// //         }).addTo(mapInstance);
// //         setCountryLayer(layer);

// //         setCountryNames(data.features.map((feature) => feature.properties.name));
// //       })
// //       .catch((error) => console.error("Error loading GeoJSON:", error));
// //   }

// //   return () => {
// //     if (map) {
// //       map.off();
// //       map.remove();
// //       setMap(null);
// //     }
// //   };
// // }, [map]);

// //   const removeAllMarkers = () => {
// //     if (markersLayer) {
// //       markersLayer.clearLayers();
// //     }
// //   };

// //   const highlightCountry = (countryName) => {
// //     if (!countryLayer) {
// //       return;
// //     }

// //     countryLayer.eachLayer((layer) => {
// //       if (layer.feature.properties.name.toLowerCase() === countryName.toLowerCase()) {
// //         const bounds = layer.getBounds();
// //         map.flyToBounds(bounds, { padding: [50, 50], duration: 2 });

// //         layer.setStyle({
// //           color: "yellow",
// //           weight: 3,
// //           fillOpacity: 0.7
// //         });

// //         setTimeout(() => {
// //           layer.setStyle({
// //             color: "#00ccff",
// //             weight: 1,
// //             fillOpacity: 0.4
// //           });
// //         }, 3000);
// //       }
// //     });
// //   };

// //   return (
// //     <>
// //       <div id="map" style={{ height: "100vh", width: "100%" }}></div>
// //       <SearchModal countryNames={countryNames} highlightCountry={highlightCountry} />
// //       <NewsFetcher 
// //         markersLayer={markersLayer} 
// //         countryLayer={countryLayer} 
// //         selectedCountry={selectedCountry}
// //         setIsSidebarOpen={setIsSidebarOpen}
// //         setCountryNews={setCountryNews} 
// //       />
// //       {isSidebarOpen && (
// //         <Sidebar 
// //           selectedCountry={selectedCountry?.name} 
// //           countryNews={countryNews} 
// //           onClose={() => setIsSidebarOpen(false)} 
// //           isSidebarOpen={isSidebarOpen} 
// //         />
// //       )}
// //     </>
// //   );
// // }

// // //working code

// import { useEffect, useState, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import SearchModal from "@/components/SearchModal";  
// import NewsFetcher from "@/components/NewsFetcher"; 
// import Sidebar from "@/components/Sidebar"; 

// export default function MapView() {
//   const [map, setMap] = useState(null);
//   const [countryLayer, setCountryLayer] = useState(null);
//   const [markersLayer, setMarkersLayer] = useState(null);
//   const [pulseDotLayer, setPulseDotLayer] = useState(null);
//   const [countryNames, setCountryNames] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [countryNews, setCountryNews] = useState([]); 
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [newsCountByCountry, setNewsCountByCountry] = useState({});
//   const animationFrameRef = useRef(null);

//   useEffect(() => {
//     if (typeof window !== "undefined" && !map) {
//       const mapInstance = L.map("map", {
//         center: [20, 0],
//         zoom: 4,
//         minZoom: 4,
//         maxZoom: 5,
//         worldCopyJump: false,
//         maxBounds: [
//           [-75, -175],
//           [84, 180]
//         ],
//         maxBoundsViscosity: 1.0,
//         doubleClickZoom: true,
//         zoomControl: false,
//         attributionControl: false
//       });

//       L.control.zoom({ position: "bottomright" }).addTo(mapInstance);
//       setMap(mapInstance);

//       const markers = L.layerGroup().addTo(mapInstance);
//       setMarkersLayer(markers);

//       // Create a layer for pulsing dots and ensure it's on top
//       const pulseDots = L.layerGroup().addTo(mapInstance);
//       setPulseDotLayer(pulseDots);

//       mapInstance.on("dblclick", () => {
//         const currentZoom = mapInstance.getZoom();
//         const maxZoom = mapInstance.getMaxZoom();
//         const minZoom = mapInstance.getMinZoom();

//         if (currentZoom < maxZoom) {
//           mapInstance.zoomIn();
//         } else {
//           mapInstance.setZoom(minZoom);
//         }
//       });

//       fetch("/countries.geo.json")
//         .then((response) => response.json())
//         .then((data) => {
//           const layer = L.geoJSON(data, {
//             style: (feature) => {
//               return {
//                 color: "#00ccff",
//                 weight: 1,
//                 fillColor: getCountryColor(feature.id),
//                 fillOpacity: 0.4
//               };
//             },
//             onEachFeature: (feature, layer) => {
//               const tooltip = L.tooltip({ permanent: false, opacity: 1 })
//                 .setContent(`<b>${feature.properties.name}</b>`);

//               const highlightStyle = { fillOpacity: 0.7 };
//               const defaultStyle = { 
//                 fillOpacity: 0.4,
//                 fillColor: getCountryColor(feature.id)
//               };

//               const onMouseOver = () => layer.setStyle(highlightStyle);
//               const onMouseOut = () => layer.setStyle(defaultStyle);

//               layer.on("mouseover", onMouseOver);
//               layer.on("mouseout", onMouseOut);
//               layer.on("mousemove", (event) => tooltip.setLatLng(event.latlng).addTo(mapInstance));
//               layer.on("mouseout", () => tooltip.remove());

//               layer.on("click", (e) => {
//                 if (e && e.originalEvent) {
//                   e.originalEvent.stopPropagation();
//                 }

//                 removeAllMarkers();
//                 setSelectedCountry({ id: feature.id, name: feature.properties.name });
//                 highlightCountry(feature.properties.name);
//                 setIsSidebarOpen(true);
//               });

//               layer.on("remove", () => {
//                 layer.off("mouseover", onMouseOver);
//                 layer.off("mouseout", onMouseOut);
//                 layer.off("mousemove");
//                 layer.off("click");
//               });
//             }
//           }).addTo(mapInstance);
//           setCountryLayer(layer);

//           setCountryNames(data.features.map((feature) => feature.properties.name));
//         })
//         .catch((error) => console.error("Error loading GeoJSON:", error));
//     }

//     return () => {
//       if (map) {
//         if (animationFrameRef.current) {
//           cancelAnimationFrame(animationFrameRef.current);
//         }
//         map.off();
//         map.remove();
//         setMap(null);
//       }
//     };
//   }, [map]);

//   // Effect to update country colors when news count changes
//   useEffect(() => {
//     if (countryLayer && Object.keys(newsCountByCountry).length > 0) {
//       countryLayer.eachLayer((layer) => {
//         const countryId = layer.feature.id;
//         layer.setStyle({
//           fillColor: getCountryColor(countryId),
//           fillOpacity: 0.4
//         });
//       });
      
//       // Clear previous pulse dots and add new ones
//       updatePulseDots();
//     }
//   }, [newsCountByCountry, countryLayer, pulseDotLayer, map]);

//   const getCountryColor = (countryId) => {
//     const newsCount = newsCountByCountry[countryId] || 0;
    
//     if (newsCount === 0) {
//       return "#202c44"; // Base color for countries without news
//     } else if (newsCount < 5) {
//       return "#3a5180"; // Light intensity
//     } else if (newsCount < 10) {
//       return "#5474ad"; // Medium intensity
//     } else if (newsCount < 20) {
//       return "#6d97db"; // Higher intensity
//     } else {
//       return "#86baff"; // Highest intensity
//     }
//   };

//   // Add pulsing dots to countries with news
//   const updatePulseDots = () => {
//     if (!pulseDotLayer || !countryLayer || !map) return;
    
//     pulseDotLayer.clearLayers();
    
//     countryLayer.eachLayer((layer) => {
//       const countryId = layer.feature.id;
//       const newsCount = newsCountByCountry[countryId] || 0;
      
//       if (newsCount > 0) {
//         // Get center of country polygon for dot placement
//         const bounds = layer.getBounds();
//         const center = bounds.getCenter();
        
//         // Create prominent red pulsing dot for this country
//         createPulsingDot(center, newsCount);
//       }
//     });
//   };

//   // Create a red pulsing dot icon at the given position
// const createPulsingDot = (position, newsCount) => {
//   // Size based on news count, with a more visible minimum size
//   const size = Math.min(10 + (newsCount / 2), 25);
  
//   // Create custom divIcon for the pulsing effect
//   const pulsingIcon = L.divIcon({
//     className: 'pulse-icon',
//     html: `
//       <div class="pulse-core" style="
//         position: absolute;
//         width: ${size}px;
//         height: ${size}px;
//         background-color: rgba(255, 0, 0, 0.9);
//         border-radius: 50%;
//         z-index: 999;
//       "></div>
//       <div class="pulse-ring" style="
//         position: absolute;
//         width: ${size}px;
//         height: ${size}px;
//         background-color: transparent;
//         border: 3px solid rgba(255, 0, 0, 0.7);
//         border-radius: 50%;
//         animation: pulse-ring 2s infinite;
//         z-index: 998;
//       "></div>
//       ${newsCount > 0 ? `<div class="news-count" style="
//         position: absolute;
//         top: -5px;
//         right: -5px;
//         background-color: #ff0000;
//         color: white;
//         border-radius: 50%;
//         width: 16px;
//         height: 16px;
//         font-size: 10px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         font-weight: bold;
//         z-index: 1000;
//       ">${newsCount > 99 ? '99+' : newsCount}</div>` : ''}
//     `,
//     iconSize: [size + 20, size + 20],
//     iconAnchor: [(size + 20)/2, (size + 20)/2]
//   });
  
//   // Add the pulsing marker to the layer
//   const marker = L.marker(position, {
//     icon: pulsingIcon,
//     interactive: false,
//     zIndexOffset: 1000
//   }).addTo(pulseDotLayer);
  
//   return marker;
// };
//   const removeAllMarkers = () => {
//     if (markersLayer) {
//       markersLayer.clearLayers();
//     }
//   };

//   const highlightCountry = (countryName) => {
//     if (!countryLayer) {
//       return;
//     }

//     countryLayer.eachLayer((layer) => {
//       if (layer.feature.properties.name.toLowerCase() === countryName.toLowerCase()) {
//         const bounds = layer.getBounds();
//         map.flyToBounds(bounds, { padding: [50, 50], duration: 2 });

//         layer.setStyle({
//           color: "yellow",
//           weight: 3,
//           fillOpacity: 0.7
//         });

//         setTimeout(() => {
//           layer.setStyle({
//             color: "#00ccff",
//             weight: 1,
//             fillOpacity: 0.4,
//             fillColor: getCountryColor(layer.feature.id)
//           });
//         }, 3000);
//       }
//     });
//   };

//   // Add CSS for pulsing animation with a more prominent effect
//   const pulseCSS = `
//     @keyframes pulse-ring {
//       0% {
//         transform: scale(0.5);
//         opacity: 1;
//       }
//       50% {
//         transform: scale(1.5);
//         opacity: 0.5;
//       }
//       100% {
//         transform: scale(2);
//         opacity: 0;
//       }
//     }
    
//     /* Make sure our custom elements are visible */
//     .pulse-icon {
//       z-index: 1000 !important;
//     }
    
//     .pulse-core {
//       box-shadow: 0 0 8px #ff0000;
//     }
//   `;

//   return (
//     <>
//       <style>{pulseCSS}</style>
//       <div id="map" style={{ height: "100vh", width: "100%" }}></div>
//       <SearchModal countryNames={countryNames} highlightCountry={highlightCountry} />
//       <NewsFetcher 
//         markersLayer={markersLayer} 
//         countryLayer={countryLayer} 
//         selectedCountry={selectedCountry}
//         setIsSidebarOpen={setIsSidebarOpen}
//         setCountryNews={setCountryNews}
//         setNewsCountByCountry={setNewsCountByCountry}
//       />
//       {isSidebarOpen && (
//         <Sidebar 
//           selectedCountry={selectedCountry?.name} 
//           countryNews={countryNews} 
//           onClose={() => setIsSidebarOpen(false)} 
//           isSidebarOpen={isSidebarOpen} 
//         />
//       )}
//     </>
//   );
// }

// import { useEffect, useState, useRef } from "react";
// import L from "leaflet";
// import * as d3 from "d3";
// import "leaflet/dist/leaflet.css";
// import SearchModal from "@/components/SearchModal";  
// import NewsFetcher from "@/components/NewsFetcher"; 
// import Sidebar from "@/components/Sidebar"; 

// export default function MapView() {
//   const [map, setMap] = useState(null);
//   const [countryLayer, setCountryLayer] = useState(null);
//   const [markersLayer, setMarkersLayer] = useState(null);
//   const [pulseDotLayer, setPulseDotLayer] = useState(null);
//   const [countryNames, setCountryNames] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [countryNews, setCountryNews] = useState([]); 
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [newsCountByCountry, setNewsCountByCountry] = useState({});
//   const animationFrameRef = useRef(null);
//   const dotsRef = useRef({});

//   useEffect(() => {
//     if (typeof window !== "undefined" && !map) {
//       // Initialize Leaflet map with dark theme
//       const mapInstance = L.map("map", {
//         center: [20, 0],
//         zoom: 4,
//         minZoom: 4,
//         maxZoom: 5,
//         worldCopyJump: false,
//         maxBounds: [
//           [-75, -175],
//           [84, 180]
//         ],
//         maxBoundsViscosity: 1.0,
//         doubleClickZoom: true,
//         zoomControl: false,
//         attributionControl: false
//       });

//       L.control.zoom({ position: "bottomright" }).addTo(mapInstance);
//       setMap(mapInstance);

//       const markers = L.layerGroup().addTo(mapInstance);
//       setMarkersLayer(markers);

//       // Create a layer for pulsing dots and ensure it's on top
//       const pulseDots = L.layerGroup().addTo(mapInstance);
//       setPulseDotLayer(pulseDots);

//       mapInstance.on("dblclick", () => {
//         const currentZoom = mapInstance.getZoom();
//         const maxZoom = mapInstance.getMaxZoom();
//         const minZoom = mapInstance.getMinZoom();

//         if (currentZoom < maxZoom) {
//           mapInstance.zoomIn();
//         } else {
//           mapInstance.setZoom(minZoom);
//         }
//       });

//       fetch("/countries.geo.json")
//         .then((response) => response.json())
//         .then((data) => {
//           const layer = L.geoJSON(data, {
//             style: (feature) => {
//               return {
//                 color: "#1A4875", // Lighter blue border
//                 weight: 1,
//                 fillColor: "#0A2540", // Dark blue fill
//                 fillOpacity: 0.8
//               };
//             },
//             onEachFeature: (feature, layer) => {
//               const tooltip = L.tooltip({ permanent: false, opacity: 1 })
//                 .setContent(`<b>${feature.properties.name}</b>`);

//               const highlightStyle = { 
//                 fillOpacity: 0.9,
//                 fillColor: "#1A4875" // Slightly lighter when highlighted
//               };
              
//               const defaultStyle = { 
//                 fillOpacity: 0.8,
//                 fillColor: "#0A2540"
//               };

//               const onMouseOver = () => layer.setStyle(highlightStyle);
//               const onMouseOut = () => layer.setStyle(defaultStyle);

//               layer.on("mouseover", onMouseOver);
//               layer.on("mouseout", onMouseOut);
//               layer.on("mousemove", (event) => tooltip.setLatLng(event.latlng).addTo(mapInstance));
//               layer.on("mouseout", () => tooltip.remove());

//               layer.on("click", (e) => {
//                 if (e && e.originalEvent) {
//                   e.originalEvent.stopPropagation();
//                 }

//                 removeAllMarkers();
//                 setSelectedCountry({ id: feature.id, name: feature.properties.name });
//                 highlightCountry(feature.properties.name);
//                 setIsSidebarOpen(true);
//               });

//               layer.on("remove", () => {
//                 layer.off("mouseover", onMouseOver);
//                 layer.off("mouseout", onMouseOut);
//                 layer.off("mousemove");
//                 layer.off("click");
//               });
//             }
//           }).addTo(mapInstance);
//           setCountryLayer(layer);

//           setCountryNames(data.features.map((feature) => feature.properties.name));
//         })
//         .catch((error) => console.error("Error loading GeoJSON:", error));
//     }

//     return () => {
//       if (map) {
//         if (animationFrameRef.current) {
//           cancelAnimationFrame(animationFrameRef.current);
//         }
//         map.off();
//         map.remove();
//         setMap(null);
//       }
//     };
//   }, [map]);

//   // Effect to update pulsing dots when news count changes
//   useEffect(() => {
//     if (map && countryLayer && pulseDotLayer && Object.keys(newsCountByCountry).length > 0) {
//       // Clear existing dots
//       pulseDotLayer.clearLayers();
      
//       // Stop any active animations
//       Object.values(dotsRef.current).forEach(dotData => {
//         if (dotData.animation) {
//           cancelAnimationFrame(dotData.animation);
//         }
//       });
      
//       // Reset dots reference
//       dotsRef.current = {};
      
//       // Add new dots
//       countryLayer.eachLayer((layer) => {
//         const countryId = layer.feature.id;
//         const newsCount = newsCountByCountry[countryId] || 0;
        
//         if (newsCount > 0) {
//           const bounds = layer.getBounds();
//           const center = bounds.getCenter();
          
//           // Use plain circle markers with manual pulsing
//           const orangeCircle = L.circleMarker(center, {
//             radius: 8,
//             color: '#FF9500',
//             fillColor: '#FF9500',
//             fillOpacity: 0.9,
//             weight: 2,
//             opacity: 0.9
//           }).addTo(pulseDotLayer);
          
//           // Store reference for animation
//           dotsRef.current[countryId] = {
//             marker: orangeCircle,
//             animation: null,
//             phase: 0
//           };
//         }
//       });
      
//       // Start animation loop
//       animatePulsingDots();
//     }
    
//     return () => {
//       // Clean up animations
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
      
//       Object.values(dotsRef.current).forEach(dotData => {
//         if (dotData.animation) {
//           cancelAnimationFrame(dotData.animation);
//         }
//       });
//     };
//   }, [map, countryLayer, pulseDotLayer, newsCountByCountry]);
  
//   // Simple manual animation loop for pulsing
//   const animatePulsingDots = () => {
//     Object.values(dotsRef.current).forEach(dotData => {
//       // Update phase (0 to 2π)
//       dotData.phase = (dotData.phase + 0.05) % (Math.PI * 2);
      
//       // Size oscillation
//       const baseSize = 8;
//       const pulseSize = baseSize + 3 * Math.sin(dotData.phase);
      
//       // Opacity oscillation (for glow effect)
//       const baseOpacity = 0.8;
//       const pulseOpacity = baseOpacity + 0.2 * Math.sin(dotData.phase);
      
//       // Apply new size and opacity
//       dotData.marker.setRadius(pulseSize);
//       dotData.marker.setStyle({
//         fillOpacity: pulseOpacity,
//         opacity: pulseOpacity
//       });
//     });
    
//     // Continue animation loop
//     animationFrameRef.current = requestAnimationFrame(animatePulsingDots);
//   };

//   const removeAllMarkers = () => {
//     if (markersLayer) {
//       markersLayer.clearLayers();
//     }
//   };

//   const highlightCountry = (countryName) => {
//     if (!countryLayer) {
//       return;
//     }

//     countryLayer.eachLayer((layer) => {
//       if (layer.feature.properties.name.toLowerCase() === countryName.toLowerCase()) {
//         const bounds = layer.getBounds();
//         map.flyToBounds(bounds, { padding: [50, 50], duration: 2 });

//         layer.setStyle({
//           color: "#4A88C7",
//           weight: 2,
//           fillOpacity: 0.9,
//           fillColor: "#1A4875"
//         });

//         setTimeout(() => {
//           layer.setStyle({
//             color: "#1A4875",
//             weight: 1,
//             fillOpacity: 0.8,
//             fillColor: "#0A2540"
//           });
//         }, 3000);
//       }
//     });
//   };

//   // CSS for map styling
//   const mapCSS = `
//     /* Dark background for the map */
//     #map {
//       background-color:rgb(0, 0, 0);
//     }
    
//     /* Add a subtle glow to the country borders */
//     .leaflet-interactive {
//       stroke-opacity: 0.8;
//       transition: all 0.3s ease;
//     }
//   `;

//   return (
//     <>
//       <style>{mapCSS}</style>
//       <div id="map" style={{ height: "100vh", width: "100%" }}></div>
//       <SearchModal countryNames={countryNames} highlightCountry={highlightCountry} />
//       <NewsFetcher 
//         markersLayer={markersLayer} 
//         countryLayer={countryLayer} 
//         selectedCountry={selectedCountry}
//         setIsSidebarOpen={setIsSidebarOpen}
//         setCountryNews={setCountryNews}
//         setNewsCountByCountry={setNewsCountByCountry}
//       />
//       {isSidebarOpen && (
//         <Sidebar 
//           selectedCountry={selectedCountry?.name} 
//           countryNews={countryNews} 
//           onClose={() => setIsSidebarOpen(false)} 
//           isSidebarOpen={isSidebarOpen} 
//         />
//       )}
//     </>
//   );
// }

// import { useEffect, useState, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import SearchModal from "@/components/SearchModal";  
// import NewsFetcher from "@/components/NewsFetcher"; 
// import Sidebar from "@/components/Sidebar"; 

// export default function MapView() {
//   const [map, setMap] = useState(null);
//   const [countryLayer, setCountryLayer] = useState(null);
//   const [markersLayer, setMarkersLayer] = useState(null);
//   const [pulseDotLayer, setPulseDotLayer] = useState(null);
//   const [countryNames, setCountryNames] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [countryNews, setCountryNews] = useState([]); 
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [newsCountByCountry, setNewsCountByCountry] = useState({});
//   const animationFrameRef = useRef(null);
//   const dotMarkersRef = useRef({});
//   const isZoomingRef = useRef(false);
//   const throttleTimerRef = useRef(null);

//   useEffect(() => {
//     if (typeof window !== "undefined" && !map) {
//       // Initialize Leaflet map with dark theme
//       const mapInstance = L.map("map", {
//         center: [20, 0],
//         zoom: 4,
//         minZoom: 4,
//         maxZoom: 5,
//         worldCopyJump: false,
//         maxBounds: [
//           [-75, -175],
//           [84, 180]
//         ],
//         maxBoundsViscosity: 1.0,
//         doubleClickZoom: true,
//         zoomControl: false,
//         attributionControl: false,
//         // Add these options for better performance
//         preferCanvas: true,
//         renderer: L.canvas()
//       });

//       L.control.zoom({ position: "bottomright" }).addTo(mapInstance);
//       setMap(mapInstance);

//       const markers = L.layerGroup().addTo(mapInstance);
//       setMarkersLayer(markers);

//       // Create a layer for pulsing dots as a normal layer group
//       const pulseDots = L.layerGroup().addTo(mapInstance);
//       setPulseDotLayer(pulseDots);

//       // Optimize zoom handling
//       mapInstance.on("zoomstart", () => {
//         isZoomingRef.current = true;
//         // Pause animations during zoom
//         if (animationFrameRef.current) {
//           cancelAnimationFrame(animationFrameRef.current);
//           animationFrameRef.current = null;
//         }
//       });

//       mapInstance.on("zoomend", () => {
//         isZoomingRef.current = false;
//         // Only restart animation if not currently animating
//         if (!animationFrameRef.current && Object.keys(dotMarkersRef.current).length > 0) {
//           animationFrameRef.current = requestAnimationFrame(animatePulsingDots);
//         }
//       });

//       mapInstance.on("dblclick", () => {
//         const currentZoom = mapInstance.getZoom();
//         const maxZoom = mapInstance.getMaxZoom();
//         const minZoom = mapInstance.getMinZoom();

//         if (currentZoom < maxZoom) {
//           mapInstance.zoomIn();
//         } else {
//           mapInstance.setZoom(minZoom);
//         }
//       });

//       fetch("/countries.geo.json")
//         .then((response) => response.json())
//         .then((data) => {
//           const layer = L.geoJSON(data, {
//             style: (feature) => {
//               return {
//                 color: "#1A4875", // Lighter blue border
//                 weight: 1,
//                 fillColor: "#0A2540", // Dark blue fill
//                 fillOpacity: 0.8
//               };
//             },
//             onEachFeature: (feature, layer) => {
//               // Store centroid in feature properties for faster access
//               const bounds = layer.getBounds();
//               feature.properties.center = bounds.getCenter();
              
//               const tooltip = L.tooltip({ permanent: false, opacity: 1 })
//                 .setContent(`<b>${feature.properties.name}</b>`);

//               const highlightStyle = { 
//                 fillOpacity: 0.9,
//                 fillColor: "#1A4875" // Slightly lighter when highlighted
//               };
              
//               const defaultStyle = { 
//                 fillOpacity: 0.8,
//                 fillColor: "#0A2540"
//               };

//               const onMouseOver = () => layer.setStyle(highlightStyle);
//               const onMouseOut = () => layer.setStyle(defaultStyle);

//               layer.on("mouseover", onMouseOver);
//               layer.on("mouseout", onMouseOut);
//               layer.on("mousemove", (event) => tooltip.setLatLng(event.latlng).addTo(mapInstance));
//               layer.on("mouseout", () => tooltip.remove());

//               layer.on("click", (e) => {
//                 if (e && e.originalEvent) {
//                   e.originalEvent.stopPropagation();
//                 }

//                 removeAllMarkers();
//                 setSelectedCountry({ id: feature.id, name: feature.properties.name });
//                 highlightCountry(feature.properties.name);
//                 setIsSidebarOpen(true);
//               });

//               layer.on("remove", () => {
//                 layer.off("mouseover", onMouseOver);
//                 layer.off("mouseout", onMouseOut);
//                 layer.off("mousemove");
//                 layer.off("click");
//               });
//             }
//           }).addTo(mapInstance);
//           setCountryLayer(layer);

//           setCountryNames(data.features.map((feature) => feature.properties.name));
//         })
//         .catch((error) => console.error("Error loading GeoJSON:", error));
//     }

//     return () => {
//       if (map) {
//         if (animationFrameRef.current) {
//           cancelAnimationFrame(animationFrameRef.current);
//         }
//         map.off();
//         map.remove();
//         setMap(null);
//       }
//     };
//   }, [map]);

//   // Throttled function to update dot positions and styles
//   const throttledUpdateDots = () => {
//     if (throttleTimerRef.current) {
//       return;
//     }
    
//     throttleTimerRef.current = setTimeout(() => {
//       Object.values(dotMarkersRef.current).forEach(dotData => {
//         // Update phase (0 to 2π)
//         dotData.phase = (dotData.phase + 0.05) % (Math.PI * 2);
        
//         // Size oscillation - use smaller range to reduce rendering load
//         const baseSize = 6;
//         const pulseSize = baseSize + 2 * Math.sin(dotData.phase);
        
//         // Opacity oscillation (for glow effect)
//         const baseOpacity = 0.8;
//         const pulseOpacity = baseOpacity + 0.2 * Math.sin(dotData.phase);
        
//         // Apply new size and opacity
//         dotData.marker.setRadius(pulseSize);
//         dotData.marker.setStyle({
//           fillOpacity: pulseOpacity,
//           opacity: pulseOpacity
//         });
//       });
      
//       throttleTimerRef.current = null;
//     }, 50); // 50ms throttle
//   };

//   // Simple manual animation loop for pulsing with performance optimizations
//   const animatePulsingDots = () => {
//     if (isZoomingRef.current) {
//       return; // Don't animate during zoom
//     }
    
//     throttledUpdateDots();
    
//     // Continue animation loop
//     animationFrameRef.current = requestAnimationFrame(animatePulsingDots);
//   };

//   // Effect to update pulsing dots when news count changes
//   useEffect(() => {
//     if (map && countryLayer && pulseDotLayer && Object.keys(newsCountByCountry).length > 0) {
//       // Clear existing dots and stop animations
//       if (pulseDotLayer) {
//         pulseDotLayer.clearLayers();
//       }
      
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//         animationFrameRef.current = null;
//       }
      
//       // Reset markers reference
//       dotMarkersRef.current = {};
      
//       // Get all countries with news
//       const countryIdsWithNews = Object.keys(newsCountByCountry).filter(
//         countryId => newsCountByCountry[countryId] > 0
//       );
      
//       // Only add a limited number of dots to reduce load
//       const maxDots = Math.min(countryIdsWithNews.length, 15);
      
//       // Add new dots for countries with highest news count
//       countryLayer.eachLayer((layer) => {
//         const countryId = layer.feature.id;
//         const newsCount = newsCountByCountry[countryId] || 0;
        
//         if (newsCount > 0 && Object.keys(dotMarkersRef.current).length < maxDots) {
//           const center = layer.feature.properties.center;
          
//           // Create simpler circle markers
//           const dot = L.circleMarker(center, {
//             radius: 6,
//             color: '#FF9500',
//             fillColor: '#FF9500',
//             fillOpacity: 0.8,
//             weight: 1.5,
//             opacity: 0.8
//           }).addTo(pulseDotLayer);
          
//           // Store reference with minimal data
//           dotMarkersRef.current[countryId] = {
//             marker: dot,
//             phase: Math.random() * Math.PI * 2 // Randomize starting phase
//           };
//         }
//       });
      
//       // Start animation loop only if not currently zooming
//       if (!isZoomingRef.current && Object.keys(dotMarkersRef.current).length > 0) {
//         animationFrameRef.current = requestAnimationFrame(animatePulsingDots);
//       }
//     }
    
//     return () => {
//       // Clean up animations
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
      
//       if (throttleTimerRef.current) {
//         clearTimeout(throttleTimerRef.current);
//       }
//     };
//   }, [map, countryLayer, pulseDotLayer, newsCountByCountry]);

//   const removeAllMarkers = () => {
//     if (markersLayer) {
//       markersLayer.clearLayers();
//     }
//   };

//   const highlightCountry = (countryName) => {
//     if (!countryLayer) {
//       return;
//     }

//     countryLayer.eachLayer((layer) => {
//       if (layer.feature.properties.name.toLowerCase() === countryName.toLowerCase()) {
//         const bounds = layer.getBounds();
//         map.flyToBounds(bounds, { padding: [50, 50], duration: 2 });

//         layer.setStyle({
//           color: "#4A88C7",
//           weight: 2,
//           fillOpacity: 0.9,
//           fillColor: "#1A4875"
//         });

//         setTimeout(() => {
//           layer.setStyle({
//             color: "#1A4875",
//             weight: 1,
//             fillOpacity: 0.8,
//             fillColor: "#0A2540"
//           });
//         }, 3000);
//       }
//     });
//   };

//   // CSS for map styling
//   const mapCSS = `
//     /* Dark background for the map */
//     #map {
//       background-color:rgb(0, 0, 0);
//     }
    
//     /* Add a subtle glow to the country borders */
//     .leaflet-interactive {
//       stroke-opacity: 0.8;
//       transition: all 0.3s ease;
//     }
    
//     /* Optimize rendering performance */
//     .leaflet-canvas-container {
//       will-change: transform;
//     }
    
//     .leaflet-container {
//       -webkit-transform: translateZ(0);
//       transform: translateZ(0);
//     }
//   `;

//   return (
//     <>
//       <style>{mapCSS}</style>
//       <div id="map" style={{ height: "100vh", width: "100%" }}></div>
//       <SearchModal countryNames={countryNames} highlightCountry={highlightCountry} />
//       <NewsFetcher 
//         markersLayer={markersLayer} 
//         countryLayer={countryLayer} 
//         selectedCountry={selectedCountry}
//         setIsSidebarOpen={setIsSidebarOpen}
//         setCountryNews={setCountryNews}
//         setNewsCountByCountry={setNewsCountByCountry}
//       />
//       {isSidebarOpen && (
//         <Sidebar 
//           selectedCountry={selectedCountry?.name} 
//           countryNews={countryNews} 
//           onClose={() => setIsSidebarOpen(false)} 
//           isSidebarOpen={isSidebarOpen} 
//         />
//       )}
//     </>
//   );
// }



import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SearchModal from "@/components/SearchModal";  
import NewsFetcher from "@/components/NewsFetcher"; 
import Sidebar from "@/components/Sidebar"; 

export default function MapView() {
  const [map, setMap] = useState(null);
  const [countryLayer, setCountryLayer] = useState(null);
  const [markersLayer, setMarkersLayer] = useState(null);
  const [pulseDotLayer, setPulseDotLayer] = useState(null);
  const [countryNames, setCountryNames] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryNews, setCountryNews] = useState([]); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newsCountByCountry, setNewsCountByCountry] = useState({});
  const animationFrameRef = useRef(null);
  const dotMarkersRef = useRef({});
  const isZoomingRef = useRef(false);
  const throttleTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !map) {
      // Initialize Leaflet map with dark theme
      const mapInstance = L.map("map", {
        center: [20, 0],
        zoom: 4,
        minZoom: 4,
        maxZoom: 5,
        worldCopyJump: false,
        maxBounds: [
          [-75, -175],
          [84, 180]
        ],
        maxBoundsViscosity: 1.0,
        doubleClickZoom: true,
        zoomControl: false,
        attributionControl: false,
        // Add these options for better performance
        preferCanvas: true,
        renderer: L.canvas()
      });

      L.control.zoom({ position: "bottomright" }).addTo(mapInstance);
      setMap(mapInstance);

      const markers = L.layerGroup().addTo(mapInstance);
      setMarkersLayer(markers);

      // Create a layer for pulsing dots as a normal layer group
      const pulseDots = L.layerGroup().addTo(mapInstance);
      setPulseDotLayer(pulseDots);

      // Optimize zoom handling
      mapInstance.on("zoomstart", () => {
        isZoomingRef.current = true;
        // Pause animations during zoom
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      });

      mapInstance.on("zoomend", () => {
        isZoomingRef.current = false;
        // Only restart animation if not currently animating
        if (!animationFrameRef.current && Object.keys(dotMarkersRef.current).length > 0) {
          animationFrameRef.current = requestAnimationFrame(animatePulsingDots);
        }
      });

      mapInstance.on("dblclick", () => {
        const currentZoom = mapInstance.getZoom();
        const maxZoom = mapInstance.getMaxZoom();
        const minZoom = mapInstance.getMinZoom();

        if (currentZoom < maxZoom) {
          mapInstance.zoomIn();
        } else {
          mapInstance.setZoom(minZoom);
        }
      });

      fetch("/countries.geo.json")
        .then((response) => response.json())
        .then((data) => {
          const layer = L.geoJSON(data, {
            style: (feature) => {
              return {
                color: "#1A4875", // Lighter blue border
                weight: 1,
                fillColor: "#0A2540", // Dark blue fill
                fillOpacity: 0.8
              };
            },
            onEachFeature: (feature, layer) => {
              // Store centroid in feature properties for faster access
              const bounds = layer.getBounds();
              feature.properties.center = bounds.getCenter();
              
              const tooltip = L.tooltip({ permanent: false, opacity: 1 })
                .setContent(`<b>${feature.properties.name}</b>`);

              const highlightStyle = { 
                fillOpacity: 0.9,
                fillColor: "#1A4875" // Slightly lighter when highlighted
              };
              
              const defaultStyle = { 
                fillOpacity: 0.8,
                fillColor: "#0A2540"
              };

              const onMouseOver = () => layer.setStyle(highlightStyle);
              const onMouseOut = () => layer.setStyle(defaultStyle);

              layer.on("mouseover", onMouseOver);
              layer.on("mouseout", onMouseOut);
              layer.on("mousemove", (event) => tooltip.setLatLng(event.latlng).addTo(mapInstance));
              layer.on("mouseout", () => tooltip.remove());

              layer.on("click", (e) => {
                if (e && e.originalEvent) {
                  e.originalEvent.stopPropagation();
                }

                removeAllMarkers();
                setSelectedCountry({ id: feature.id, name: feature.properties.name });
                highlightCountry(feature.properties.name);
                setIsSidebarOpen(true);
              });

              layer.on("remove", () => {
                layer.off("mouseover", onMouseOver);
                layer.off("mouseout", onMouseOut);
                layer.off("mousemove");
                layer.off("click");
              });
            }
          }).addTo(mapInstance);
          setCountryLayer(layer);

          setCountryNames(data.features.map((feature) => feature.properties.name));
        })
        .catch((error) => console.error("Error loading GeoJSON:", error));
    }

    return () => {
      if (map) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        map.off();
        map.remove();
        setMap(null);
      }
    };
  }, [map]);

  // Enhanced pulsing dot animation
  const animatePulsingDots = () => {
    if (isZoomingRef.current) {
      return; // Don't animate during zoom
    }
    
    // Update all dots in one pass to reduce layout thrashing
    Object.values(dotMarkersRef.current).forEach(dotData => {
      // Update phase (0 to 2π)
      dotData.phase = (dotData.phase + 0.04) % (Math.PI * 2);
      
      // Primary dot size animation - gentler oscillation
      const baseDotSize = dotData.baseSize;
      const dotPulseSize = baseDotSize + 1.5 * Math.sin(dotData.phase);
      
      // Glow intensity changes
      const baseOpacity = 0.85;
      const pulseOpacity = baseOpacity + 0.15 * Math.sin(dotData.phase);
      
      // Update the primary dot
      dotData.primaryMarker.setRadius(dotPulseSize);
      dotData.primaryMarker.setStyle({
        fillOpacity: pulseOpacity,
        opacity: pulseOpacity * 0.7
      });
      
      // Update the glow effect with inverse phase
      const glowPhase = (dotData.phase + Math.PI) % (Math.PI * 2);
      const glowSize = baseDotSize * 2.5 + 2 * Math.sin(glowPhase);
      const glowOpacity = 0.3 + 0.15 * Math.sin(glowPhase);
      
      dotData.glowMarker.setRadius(glowSize);
      dotData.glowMarker.setStyle({
        fillOpacity: glowOpacity * 0.4,
        opacity: glowOpacity * 0.2
      });
      
      // Only update inner core for more important news
      if (dotData.importance > 0.6) {
        const coreOpacity = 0.9 + 0.1 * Math.sin(dotData.phase * 1.5);
        dotData.coreMarker?.setStyle({
          fillOpacity: coreOpacity
        });
      }
    });
    
    // Continue animation loop with optimized timing
    animationFrameRef.current = requestAnimationFrame(animatePulsingDots);
  };

  // Effect to update pulsing dots when news count changes
  useEffect(() => {
    if (map && countryLayer && pulseDotLayer && Object.keys(newsCountByCountry).length > 0) {
      // Clear existing dots and stop animations
      if (pulseDotLayer) {
        pulseDotLayer.clearLayers();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Reset markers reference
      dotMarkersRef.current = {};
      
      // Get all countries with news
      const countryIdsWithNews = Object.keys(newsCountByCountry).filter(
        countryId => newsCountByCountry[countryId] > 0
      );
      
      // Calculate maximum news count for scaling
      const maxNewsCount = Math.max(
        ...Object.values(newsCountByCountry).filter(count => count > 0)
      );
      
      // Only add a limited number of dots to reduce load
      const maxDots = Math.min(countryIdsWithNews.length, 20);
      
      // Sort countries by news count for priority rendering
      const sortedCountries = countryIdsWithNews
        .sort((a, b) => newsCountByCountry[b] - newsCountByCountry[a])
        .slice(0, maxDots);
      
      // Add new dots for countries with highest news count
      sortedCountries.forEach(countryId => {
        const newsCount = newsCountByCountry[countryId];
        
        // Find country layer to get center coordinates
        let center = null;
        countryLayer.eachLayer((layer) => {
          if (layer.feature.id === countryId) {
            center = layer.feature.properties.center;
          }
        });
        
        if (center) {
          // Calculate importance as normalized value between 0-1
          const importance = newsCount / maxNewsCount;
          
          // Determine size based on importance (news count)
          const baseSize = Math.max(5, Math.min(9, 5 + importance * 4));
          
          // Create a group for this dot's components
          const dotGroup = L.layerGroup().addTo(pulseDotLayer);
          
          // Create outer glow effect
          const glowMarker = L.circleMarker(center, {
            radius: baseSize * 2.5,
            color: '#FF9500',
            fillColor: '#FF9500',
            fillOpacity: 0.2,
            weight: 0.5,
            opacity: 0.2
          }).addTo(dotGroup);
          
          // Create main dot
          const primaryMarker = L.circleMarker(center, {
            radius: baseSize,
            color: '#FF9500',
            fillColor: '#FF9500',
            fillOpacity: 0.85,
            weight: 1.5,
            opacity: 0.6
          }).addTo(dotGroup);
          
          // Create inner core for more important news (higher count)
          let coreMarker = null;
          if (importance > 0.6) {
            coreMarker = L.circleMarker(center, {
              radius: baseSize * 0.5,
              color: '#FFBF00',
              fillColor: '#FFBF00',
              fillOpacity: 0.9,
              weight: 0,
              opacity: 0
            }).addTo(dotGroup);
          }
          
          // Add tooltip showing news count
          primaryMarker.bindTooltip(`${newsCount} news items`, {
            direction: 'top',
            offset: [0, -5],
            opacity: 0.9
          });
          
          // Store reference with enhanced data
          dotMarkersRef.current[countryId] = {
            primaryMarker,
            glowMarker,
            coreMarker,
            phase: Math.random() * Math.PI * 2, // Randomize starting phase
            baseSize,
            importance
          };
        }
      });
      
      // Start animation loop only if not currently zooming
      if (!isZoomingRef.current && Object.keys(dotMarkersRef.current).length > 0) {
        animationFrameRef.current = requestAnimationFrame(animatePulsingDots);
      }
    }
    
    return () => {
      // Clean up animations
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, [map, countryLayer, pulseDotLayer, newsCountByCountry]);

  const removeAllMarkers = () => {
    if (markersLayer) {
      markersLayer.clearLayers();
    }
  };

  const highlightCountry = (countryName) => {
    if (!countryLayer) {
      return;
    }

    countryLayer.eachLayer((layer) => {
      if (layer.feature.properties.name.toLowerCase() === countryName.toLowerCase()) {
        const bounds = layer.getBounds();
        map.flyToBounds(bounds, { padding: [50, 50], duration: 2 });

        layer.setStyle({
          color: "#4A88C7",
          weight: 2,
          fillOpacity: 0.9,
          fillColor: "#1A4875"
        });

        setTimeout(() => {
          layer.setStyle({
            color: "#1A4875",
            weight: 1,
            fillOpacity: 0.8,
            fillColor: "#0A2540"
          });
        }, 3000);
      }
    });
  };

  // CSS for map styling with enhanced glow effects
  const mapCSS = `
    /* Dark background for the map */
    #map {
      background-color: rgb(0, 0, 0);
    }
    
    /* Add a subtle glow to the country borders */
    .leaflet-interactive {
      stroke-opacity: 0.8;
      transition: all 0.3s ease;
    }
    
    /* Optimize rendering performance */
    .leaflet-canvas-container {
      will-change: transform;
    }
    
    .leaflet-container {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    
    /* Enhanced tooltip styling */
    .leaflet-tooltip {
      background-color: rgba(0, 0, 0, 0.75);
      color: #fff;
      border: 1px solid rgba(255, 149, 0, 0.6);
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(255, 149, 0, 0.3);
    }
    
    .leaflet-tooltip:before {
      border-top-color: rgba(0, 0, 0, 0.75);
    }
  `;

  return (
    <>
      <style>{mapCSS}</style>
      <div id="map" style={{ height: "100vh", width: "100%" }}></div>
      <SearchModal countryNames={countryNames} highlightCountry={highlightCountry} />
      <NewsFetcher 
        markersLayer={markersLayer} 
        countryLayer={countryLayer} 
        selectedCountry={selectedCountry}
        setIsSidebarOpen={setIsSidebarOpen}
        setCountryNews={setCountryNews}
        setNewsCountByCountry={setNewsCountByCountry}
      />
      {isSidebarOpen && (
        <Sidebar 
          selectedCountry={selectedCountry?.name} 
          countryNews={countryNews} 
          onClose={() => setIsSidebarOpen(false)} 
          isSidebarOpen={isSidebarOpen} 
        />
      )}
    </>
  );
}