
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
//   const [legendVisible, setLegendVisible] = useState(true);
//   const animationFrameRef = useRef(null);
//   const dotMarkersRef = useRef({});
//   const isZoomingRef = useRef(false);
//   const throttleTimerRef = useRef(null);
//   const wsRef = useRef(null);
//   const countryFlagsRef = useRef({});
//   const lastUpdateTimeRef = useRef({});

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

//       // Fetch country flags for use in tooltips
//       fetch("/api/countries")
//         .then(response => response.json())
//         .then(countries => {
//           const flagsMap = {};
//           countries.forEach(country => {
//             if (country.code && country.flag) {
//               flagsMap[country.code] = country.flag;
//             }
//           });
//           countryFlagsRef.current = flagsMap;
//         })
//         .catch(error => console.error("Error fetching country flags:", error));

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

//       // Create engagement level legend
//       createEngagementLegend(mapInstance);
//     }

//     return () => {
//       if (map) {
//         if (animationFrameRef.current) {
//           cancelAnimationFrame(animationFrameRef.current);
//         }
//         if (wsRef.current) {
//           wsRef.current.close();
//         }
//         map.off();
//         map.remove();
//         setMap(null);
//       }
//     };
//   }, [map]);

//   // Create engagement legend
//   const createEngagementLegend = (mapInstance) => {
//     const legend = L.control({ position: 'bottomleft' });
    
//     legend.onAdd = function() {
//       const div = L.DomUtil.create('div', 'info legend');
//       div.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
//       div.style.padding = '10px';
//       div.style.borderRadius = '5px';
//       div.style.color = '#fff';
//       div.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)';
//       div.style.border = '1px solid rgba(255, 149, 0, 0.4)';
//       div.style.maxWidth = '180px';
      
//       // Use D3 color scale for gradient
//       const colorScale = d3.scaleLinear()
//         .domain([0, 0.33, 0.66, 1])
//         .range(['#0A2540', '#1A4875', '#FF9500', '#FFBF00']);
      
//       div.innerHTML = '<h4 style="margin:0 0 10px 0;border-bottom:1px solid #ddd;padding-bottom:5px;">Engagement Level</h4>';
      
//       // Create gradient bar
//       const gradientHtml = `
//         <div style="position:relative;height:20px;width:100%;background:linear-gradient(to right, #0A2540, #1A4875, #FF9500, #FFBF00);border-radius:3px;"></div>
//         <div style="display:flex;justify-content:space-between;margin-top:5px;">
//           <span>Low</span>
//           <span>Medium</span>
//           <span>High</span>
//         </div>
//         <div style="margin-top:10px;font-size:0.9em;">
//           <div style="display:flex;align-items:center;margin-bottom:5px;">
//             <div style="width:10px;height:10px;background-color:#FF9500;border-radius:50%;margin-right:8px;"></div>
//             <span>Recent updates</span>
//           </div>
//           <div style="display:flex;align-items:center;">
//             <div style="width:10px;height:10px;background-color:#FFBF00;border-radius:50%;margin-right:8px;"></div>
//             <span>Breaking news</span>
//           </div>
//         </div>
//       `;
      
//       div.innerHTML += gradientHtml;
      
//       return div;
//     };
    
//     legend.addTo(mapInstance);
//   };

//   // Set up WebSocket connection for real-time updates
//   useEffect(() => {
//     if (map && countryLayer) {
//       // Use WebSocket for real-time updates if available, otherwise fallback to polling
//       const setupRealTimeConnection = () => {
//         try {
//           const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//           const wsUrl = `${protocol}//${window.location.host}/api/ws`;
          
//           const ws = new WebSocket(wsUrl);
          
//           ws.onopen = () => {
//             console.log("WebSocket connection established");
//           };
          
//           ws.onmessage = (event) => {
//             try {
//               const data = JSON.parse(event.data);
              
//               if (data.type === 'newsUpdate') {
//                 // Process real-time news update
//                 handleNewsUpdate(data.payload);
//               }
//             } catch (error) {
//               console.error("Error parsing WebSocket message:", error);
//             }
//           };
          
//           ws.onerror = (error) => {
//             console.error("WebSocket error:", error);
//             // Fallback to polling on error
//             setupPolling();
//           };
          
//           ws.onclose = () => {
//             console.log("WebSocket connection closed");
//             // Reconnect after a delay
//             setTimeout(setupRealTimeConnection, 3000);
//           };
          
//           wsRef.current = ws;
//         } catch (error) {
//           console.error("Error setting up WebSocket:", error);
//           // Fallback to polling if WebSocket failed
//           setupPolling();
//         }
//       };
      
//       const setupPolling = () => {
//         console.log("Falling back to polling for updates");
//         // Poll for news count updates every 15 seconds
//         const intervalId = setInterval(() => {
//           fetchNewsCountUpdates();
//         }, 15000);
        
//         return () => clearInterval(intervalId);
//       };
      
//       // Initialize real-time connection
//       setupRealTimeConnection();
      
//       // Initial fetch for news counts
//       fetchNewsCountUpdates();
//     }
//   }, [map, countryLayer]);

//   // Fetch news count updates via polling (fallback for WebSocket)
//   const fetchNewsCountUpdates = async () => {
//     try {
//       const response = await fetch('/api/counts');
//       if (response.ok) {
//         const data = await response.json();
        
//         // Mock breaking vs recent news categorization for demo
//         const newsWithCategories = {};
//         Object.keys(data).forEach(countryId => {
//           const count = data[countryId];
//           // Distribute counts between breaking and recent
//           const breakingCount = Math.floor(count * Math.random() * 0.5); // 0-50% breaking
//           const recentCount = count - breakingCount;
          
//           newsWithCategories[countryId] = count;
//           newsWithCategories[`${countryId}_breaking`] = breakingCount;
//           newsWithCategories[`${countryId}_recent`] = recentCount;
          
//           // Update last update time
//           lastUpdateTimeRef.current[countryId] = new Date();
//         });
        
//         setNewsCountByCountry(prevCounts => ({
//           ...prevCounts,
//           ...newsWithCategories
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching news count updates:", error);
//     }
//   };

//   // Handle real-time news updates from WebSocket
//   const handleNewsUpdate = (newsData) => {
//     if (!newsData || !newsData.countryCode) return;
    
//     const countryId = newsData.countryCode;
//     const now = new Date();
//     lastUpdateTimeRef.current[countryId] = now;
    
//     // Update news counts
//     setNewsCountByCountry(prevCounts => {
//       const currentTotal = prevCounts[countryId] || 0;
//       const currentBreaking = prevCounts[`${countryId}_breaking`] || 0;
      
//       // Add new article as breaking news
//       return {
//         ...prevCounts,
//         [countryId]: currentTotal + 1,
//         [`${countryId}_breaking`]: currentBreaking + 1
//       };
//     });
    
//     // If this country is currently selected, add to news list
//     if (selectedCountry && selectedCountry.id === countryId) {
//       setCountryNews(prev => [newsData, ...prev]);
//     }
    
//     // Add visual indication on the map for breaking news
//     flashBreakingNewsIndicator(countryId);
//   };

//   // Visual indication for breaking news
//   const flashBreakingNewsIndicator = (countryId) => {
//     if (!map || !countryLayer) return;
    
//     // Find the country layer
//     let countryFeature = null;
//     countryLayer.eachLayer(layer => {
//       if (layer.feature.id === countryId) {
//         countryFeature = layer;
//       }
//     });
    
//     if (countryFeature) {
//       // Flash effect
//       const originalStyle = {
//         color: "#1A4875",
//         weight: 1,
//         fillOpacity: 0.8,
//         fillColor: "#0A2540"
//       };
      
//       const flashStyle = {
//         color: "#FFBF00",
//         weight: 2,
//         fillOpacity: 0.4,
//         fillColor: "#FF9500"
//       };
      
//       // Apply flash style
//       countryFeature.setStyle(flashStyle);
      
//       // Return to original style after animation
//       setTimeout(() => {
//         countryFeature.setStyle(originalStyle);
//       }, 1500);
//     }
//   };

//   // Enhanced pulsing dot animation with D3 color scale
//   const animatePulsingDots = () => {
//     if (isZoomingRef.current) {
//       return; // Don't animate during zoom
//     }
    
//     // Create D3 color scale for engagement levels
//     const colorScale = d3.scaleLinear()
//       .domain([0, 0.33, 0.66, 1])
//       .range(['#0A2540', '#1A4875', '#FF9500', '#FFBF00']);
    
//     // Update all dots in one pass to reduce layout thrashing
//     Object.entries(dotMarkersRef.current).forEach(([countryId, dotData]) => {
//       // Update phase (0 to 2π)
//       dotData.phase = (dotData.phase + 0.04) % (Math.PI * 2);
      
//       // Get color based on importance
//       const color = colorScale(dotData.importance);
//       const highlightColor = d3.color(color).brighter(0.5).formatHex();
      
//       // Primary dot size animation - gentler oscillation
//       const baseDotSize = dotData.baseSize;
//       const dotPulseSize = baseDotSize + 1.5 * Math.sin(dotData.phase);
      
//       // Glow intensity changes
//       const baseOpacity = 0.85;
//       const pulseOpacity = baseOpacity + 0.15 * Math.sin(dotData.phase);
      
//       // Update the primary dot
//       dotData.primaryMarker.setRadius(dotPulseSize);
//       dotData.primaryMarker.setStyle({
//         fillColor: color,
//         color: color,
//         fillOpacity: pulseOpacity,
//         opacity: pulseOpacity * 0.7
//       });
      
//       // Update the glow effect with inverse phase
//       const glowPhase = (dotData.phase + Math.PI) % (Math.PI * 2);
//       const glowSize = baseDotSize * 2.5 + 2 * Math.sin(glowPhase);
//       const glowOpacity = 0.3 + 0.15 * Math.sin(glowPhase);
      
//       dotData.glowMarker.setRadius(glowSize);
//       dotData.glowMarker.setStyle({
//         fillColor: color,
//         color: highlightColor,
//         fillOpacity: glowOpacity * 0.4,
//         opacity: glowOpacity * 0.2
//       });
      
//       // Only update inner core for more important news
//       if (dotData.importance > 0.6) {
//         const coreOpacity = 0.9 + 0.1 * Math.sin(dotData.phase * 1.5);
//         dotData.coreMarker?.setStyle({
//           fillColor: highlightColor,
//           color: highlightColor,
//           fillOpacity: coreOpacity
//         });
//       }
//     });
    
//     // Continue animation loop with optimized timing
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
//         countryId => newsCountByCountry[countryId] > 0 && !countryId.includes('_')
//       );
      
//       // Calculate maximum news count for scaling
//       const maxNewsCount = Math.max(
//         ...Object.values(newsCountByCountry).filter(count => count > 0)
//       );
      
//       // Only add a limited number of dots to reduce load
//       const maxDots = Math.min(countryIdsWithNews.length, 30);
      
//       // Sort countries by news count for priority rendering
//       const sortedCountries = countryIdsWithNews
//         .sort((a, b) => newsCountByCountry[b] - newsCountByCountry[a])
//         .slice(0, maxDots);
      
//       // Create D3 color scale for engagement levels
//       const colorScale = d3.scaleLinear()
//         .domain([0, 0.33, 0.66, 1])
//         .range(['#0A2540', '#1A4875', '#FF9500', '#FFBF00']);
      
//       // Add new dots for countries with highest news count
//       sortedCountries.forEach(countryId => {
//         const newsCount = newsCountByCountry[countryId];
//         const breakingCount = newsCountByCountry[`${countryId}_breaking`] || 0;
//         const recentCount = newsCountByCountry[`${countryId}_recent`] || 0;
        
//         // Find country layer to get center coordinates
//         let center = null;
//         let countryName = null;
        
//         countryLayer.eachLayer((layer) => {
//           if (layer.feature.id === countryId) {
//             center = layer.feature.properties.center;
//             countryName = layer.feature.properties.name;
//           }
//         });
        
//         if (center) {
//           // Calculate importance as normalized value between 0-1
//           const importance = newsCount / maxNewsCount;
          
//           // Determine size based on importance (news count)
//           const baseSize = Math.max(5, Math.min(10, 5 + importance * 5));
          
//           // Get appropriate color based on importance
//           const color = colorScale(importance);
//           const highlightColor = d3.color(color).brighter(0.5).formatHex();
          
//           // Create a group for this dot's components
//           const dotGroup = L.layerGroup().addTo(pulseDotLayer);
          
//           // Create outer glow effect
//           const glowMarker = L.circleMarker(center, {
//             radius: baseSize * 2.5,
//             color: color,
//             fillColor: color,
//             fillOpacity: 0.2,
//             weight: 0.5,
//             opacity: 0.2
//           }).addTo(dotGroup);
          
//           // Create main dot
//           const primaryMarker = L.circleMarker(center, {
//             radius: baseSize,
//             color: color,
//             fillColor: color,
//             fillOpacity: 0.85,
//             weight: 1.5,
//             opacity: 0.6
//           }).addTo(dotGroup);
          
//           // Create inner core for more important news (higher count)
//           let coreMarker = null;
//           if (importance > 0.6) {
//             coreMarker = L.circleMarker(center, {
//               radius: baseSize * 0.5,
//               color: highlightColor,
//               fillColor: highlightColor,
//               fillOpacity: 0.9,
//               weight: 0,
//               opacity: 0
//             }).addTo(dotGroup);
//           }
          
//           // Calculate time since last update
//           let timeDisplay = '';
//           if (lastUpdateTimeRef.current[countryId]) {
//             const timeDiff = Math.floor((new Date() - lastUpdateTimeRef.current[countryId]) / 60000);
//             timeDisplay = timeDiff === 0 ? 'just now' : `${timeDiff} min ago`;
//           }
          
//           // Get country flag
//           const flagEmoji = countryFlagsRef.current[countryId] || '🌐';
          
//           // Add enhanced tooltip showing news count, breaking/recent breakdown and timestamp
//           const tooltipContent = `
//             <div style="padding: 5px; min-width: 150px;">
//               <div style="display: flex; align-items: center; margin-bottom: 5px;">
//                 <span style="font-size: 1.2em; margin-right: 8px;">${flagEmoji}</span>
//                 <span style="font-weight: bold;">${countryName || countryId}</span>
//               </div>
//               <div style="margin-top: 5px;">
//                 <div><b>${newsCount}</b> total articles</div>
//                 ${breakingCount > 0 ? `<div style="color: #FFBF00;"><b>${breakingCount}</b> breaking</div>` : ''}
//                 ${recentCount > 0 ? `<div style="color: #FF9500;"><b>${recentCount}</b> recent</div>` : ''}
//                 ${timeDisplay ? `<div style="font-size: 0.8em; margin-top: 5px;">Latest update: ${timeDisplay}</div>` : ''}
//               </div>
//             </div>
//           `;
          
//           primaryMarker.bindTooltip(tooltipContent, {
//             direction: 'top',
//             offset: [0, -5],
//             opacity: 0.9,
//             className: 'custom-tooltip'
//           });
          
//           // Make dots clickable to open sidebar with country news
//           primaryMarker.on('click', () => {
//             map.closePopup();
            
//             // Find the corresponding country
//             let foundCountry = null;
//             countryLayer.eachLayer((layer) => {
//               if (layer.feature.id === countryId) {
//                 foundCountry = { 
//                   id: layer.feature.id, 
//                   name: layer.feature.properties.name 
//                 };
//               }
//             });
            
//             if (foundCountry) {
//               setSelectedCountry(foundCountry);
//               highlightCountry(foundCountry.name);
//               setIsSidebarOpen(true);
//             }
//           });
          
//           // Store reference with enhanced data
//           dotMarkersRef.current[countryId] = {
//             primaryMarker,
//             glowMarker,
//             coreMarker,
//             phase: Math.random() * Math.PI * 2, // Randomize starting phase
//             baseSize,
//             importance,
//             color
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

//         // Enhanced highlight style using D3 color
//         const highlightColor = d3.color("#4A88C7").formatHex();
//         const glowColor = d3.color("#FF9500").formatHex();
        
//         layer.setStyle({
//           color: highlightColor,
//           weight: 2,
//           fillOpacity: 0.9,
//           fillColor: "#1A4875"
//         });

//         // Add pulsing glow effect
//         const pulseStep = 0.05;
//         let pulseValue = 0;
//         let increasing = true;
        
//         const pulseInterval = setInterval(() => {
//           if (increasing) {
//             pulseValue += pulseStep;
//             if (pulseValue >= 1) {
//               increasing = false;
//               pulseValue = 1;
//             }
//           } else {
//             pulseValue -= pulseStep;
//             if (pulseValue <= 0) {
//               clearInterval(pulseInterval);
              
//               // Restore original style after animation
//               layer.setStyle({
//                 color: "#1A4875",
//                 weight: 1,
//                 fillOpacity: 0.8,
//                 fillColor: "#0A2540"
//               });
//               return;
//             }
//           }
          
//           // Interpolate color for pulse effect
//           const interpolatedColor = d3.interpolate("#1A4875", glowColor)(pulseValue);
          
//           layer.setStyle({
//             color: interpolatedColor,
//             weight: 1 + pulseValue,
//             fillOpacity: 0.8 + (0.1 * pulseValue)
//           });
//         }, 30);
//       }
//     });
//   };

//   // CSS for map styling with enhanced glow effects
//   const mapCSS = `
//     /* Dark background for the map */
//     #map {
//       background-color: rgb(0, 0, 0);
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
    
//     /* Enhanced tooltip styling */
//     .leaflet-tooltip {
//       background-color: rgba(0, 0, 0, 0.85);
//       color: #fff;
//       border: 1px solid rgba(255, 149, 0, 0.6);
//       border-radius: 4px;
//       box-shadow: 0 0 15px rgba(255, 149, 0, 0.3);
//       padding: 8px;
//       font-family: Arial, sans-serif;
//     }
    
//     .leaflet-tooltip:before {
//       border-top-color: rgba(0, 0, 0, 0.75);
//     }
    
//     /* Custom tooltip for pulsing dots */
//     .custom-tooltip {
//       background-color: rgba(0, 0, 0, 0.85) !important;
//       border: 1px solid rgba(255, 149, 0, 0.6) !important;
//       box-shadow: 0 0 10px rgba(255, 149, 0, 0.4) !important;
//     }
    
//     /* Legend styling */
//     .legend {
//       transition: opacity 0.3s ease;
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