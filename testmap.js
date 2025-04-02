

// import { useEffect, useState, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import SearchModal from "@/components/SearchModal";
// import NewsFetcher from "@/components/NewsFetcher";
// import Sidebar from "@/components/Sidebar";

// // Create custom heatmap styles without d3 dependency
// const getHeatmapColor = (value) => {
//   // Convert value (0-100) to a color from blue to red
//   // Using simple RGB interpolation
//   const r = Math.floor((value / 100) * 255);
//   const g = Math.floor(Math.max(0, 140 - (value / 100) * 90));
//   const b = Math.floor(Math.max(0, 255 - (value / 100) * 205));
//   return `rgb(${r}, ${g}, ${b})`;
// };

// // Create custom pulsing marker
// const createPulsingMarker = (latlng, size) => {
//   const icon = L.divIcon({
//     className: "custom-pulsing-marker",
//     html: `<div class="marker-pulse" style="
//       width: ${size}px;
//       height: ${size}px;
//       background-color: rgba(0, 204, 255, 0.6);
//       border-radius: 50%;
//       box-shadow: 0 0 0 rgba(0, 204, 255, 0.4);
//       animation: pulse 1.5s infinite;
//     "></div>`,
//     iconSize: [size, size],
//     iconAnchor: [size/2, size/2]
//   });

//   // Add CSS animation for pulsing effect
//   if (!document.querySelector('#pulse-animation')) {
//     const style = document.createElement('style');
//     style.id = 'pulse-animation';
//     style.innerHTML = `
//       @keyframes pulse {
//         0% {
//           transform: scale(0.5);
//           opacity: 1;
//         }
//         100% {
//           transform: scale(1.8);
//           opacity: 0;
//         }
//       }
//       .marker-pulse {
//         position: relative;
//       }
//     `;
//     document.head.appendChild(style);
//   }

//   return L.marker(latlng, { icon });
// };

// export default function MapView() {
//   const [map, setMap] = useState(null);
//   const [countryLayer, setCountryLayer] = useState(null);
//   const [markersLayer, setMarkersLayer] = useState(null);
//   const [countryNames, setCountryNames] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [countryNews, setCountryNews] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [countryData, setCountryData] = useState({});
  
//   // Generate random data for demo purposes
//   const generateMockData = (countryFeatures) => {
//     const data = {};
//     countryFeatures.forEach(feature => {
//       // Generate random value between 0-100 for heatmap intensity
//       const heatValue = Math.floor(Math.random() * 100);
//       // Generate 1-4 random points within the country for pulsing markers
//       const numPoints = Math.floor(Math.random() * 3) + 1;
//       const points = [];
      
//       if (feature.geometry && feature.geometry.type.includes("Polygon")) {
//         for (let i = 0; i < numPoints; i++) {
//           // Get a random point within the country bounds
//           let bounds;
//           if (feature.geometry.type === "Polygon") {
//             bounds = L.geoJSON(feature.geometry).getBounds();
//           } else if (feature.geometry.type === "MultiPolygon") {
//             bounds = L.geoJSON(feature.geometry).getBounds();
//           }
          
//           if (bounds) {
//             const lat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
//             const lng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
//             points.push([lat, lng]);
//           }
//         }
//       }
      
//       data[feature.properties.name] = {
//         heatValue,
//         points,
//         // For real-time demo: how often this country gets updated
//         updateFrequency: Math.random() > 0.8 ? 5000 : 0
//       };
//     });
//     return data;
//   };

//   // Add pulsing markers to a country
//   const addPulsingMarkers = (countryName) => {
//     if (!map || !markersLayer || !countryData[countryName]) return;
    
//     // Clear previous markers first
//     markersLayer.clearLayers();
    
//     // Add pulsing markers for this country
//     countryData[countryName].points.forEach(point => {
//       const marker = createPulsingMarker(point, 15);
//       markersLayer.addLayer(marker);
//     });
//   };

//   // Initialize map and load GeoJSON
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
//         attributionControl: false,
//         preferCanvas: true // Better performance for many markers
//       });

//       L.control.zoom({ position: "bottomright" }).addTo(mapInstance);
//       setMap(mapInstance);

//       // Initialize marker layer
//       const markers = L.layerGroup().addTo(mapInstance);
//       setMarkersLayer(markers);

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

//       // Add legend for heatmap colors
//       const legend = L.control({ position: 'bottomleft' });
//       legend.onAdd = function () {
//         const div = L.DomUtil.create('div', 'info legend');
//         div.style.backgroundColor = 'rgba(0,0,0,0.7)';
//         div.style.padding = '10px';
//         div.style.borderRadius = '5px';
//         div.style.color = 'white';
        
//         const grades = [0, 25, 50, 75, 100];
//         div.innerHTML += '<strong>Activity Level</strong><br>';
        
//         for (let i = 0; i < grades.length - 1; i++) {
//           div.innerHTML +=
//             '<i style="background:' + getHeatmapColor(grades[i]) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//         }
//         return div;
//       };
//       legend.addTo(mapInstance);

//       fetch("/countries.geo.json")
//         .then((response) => response.json())
//         .then((data) => {
//           // Generate mock data for demo
//           const mockData = generateMockData(data.features);
//           setCountryData(mockData);

//           const layer = L.geoJSON(data, {
//             style: function(feature) {
//               const countryName = feature.properties.name;
//               const heatValue = mockData[countryName]?.heatValue || 0;
              
//               return {
//                 fillColor: getHeatmapColor(heatValue),
//                 color: "#00ccff",
//                 weight: 1,
//                 fillOpacity: 0.5 + (heatValue / 200) // More intense color = more opaque
//               };
//             },
//             onEachFeature: (feature, layer) => {
//               const tooltip = L.tooltip({ permanent: false, opacity: 1 })
//                 .setContent(`<b>${feature.properties.name}</b>
//                              <br>Activity Level: ${mockData[feature.properties.name]?.heatValue || 0}%`);

//               const highlightStyle = { 
//                 fillOpacity: 0.8,
//                 weight: 2
//               };
              
//               const defaultStyle = { 
//                 fillOpacity: 0.5 + (mockData[feature.properties.name]?.heatValue || 0) / 200,
//                 weight: 1
//               };

//               const onMouseOver = () => {
//                 layer.setStyle(highlightStyle);
//                 layer.bringToFront();
//               };
              
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
//                 addPulsingMarkers(feature.properties.name);
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
//         map.off();
//         map.remove();
//         setMap(null);
//       }
//     };
//   }, [map]);

//   // Set up real-time updates for countries with updateFrequency > 0
//   useEffect(() => {
//     if (!map || !countryLayer || Object.keys(countryData).length === 0) return;

//     const updateIntervals = [];

//     // For each country with updateFrequency, set up an interval to update its data
//     Object.entries(countryData).forEach(([countryName, data]) => {
//       if (data.updateFrequency > 0) {
//         const interval = setInterval(() => {
//           // Update heatmap value
//           const newValue = Math.floor(Math.random() * 100);
//           setCountryData(prev => ({
//             ...prev,
//             [countryName]: {
//               ...prev[countryName],
//               heatValue: newValue
//             }
//           }));
          
//           // Update the country color on the map
//           countryLayer.eachLayer(layer => {
//             if (layer.feature.properties.name === countryName) {
//               layer.setStyle({
//                 fillColor: getHeatmapColor(newValue),
//                 fillOpacity: 0.5 + (newValue / 200)
//               });
              
//               // Briefly highlight the country that updated
//               layer.setStyle({ weight: 3, color: "#ffffff" });
//               setTimeout(() => {
//                 layer.setStyle({ weight: 1, color: "#00ccff" });
//               }, 1000);
//             }
//           });
          
//           // If this country is selected, update its markers too
//           if (selectedCountry && selectedCountry.name === countryName) {
//             addPulsingMarkers(countryName);
//           }
//         }, data.updateFrequency);
        
//         updateIntervals.push(interval);
//       }
//     });
    
//     return () => {
//       updateIntervals.forEach(interval => clearInterval(interval));
//     };
//   }, [map, countryLayer, countryData, selectedCountry]);

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
//           const heatValue = countryData[countryName]?.heatValue || 0;
//           layer.setStyle({
//             color: "#00ccff",
//             weight: 1,
//             fillOpacity: 0.5 + (heatValue / 200)
//           });
//         }, 3000);
        
//         // Add pulsing markers for this country
//         addPulsingMarkers(countryName);
//       }
//     });
//   };

//   return (
//     <>
//       <div id="map" style={{ height: "100vh", width: "100%" }}></div>
//       <SearchModal countryNames={countryNames} highlightCountry={highlightCountry} />
//       <NewsFetcher 
//         markersLayer={markersLayer} 
//         countryLayer={countryLayer} 
//         selectedCountry={selectedCountry}
//         setIsSidebarOpen={setIsSidebarOpen}
//         setCountryNews={setCountryNews} 
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
// import * as d3 from "d3";

// // Create custom heatmap styles
// const getHeatmapColor = (value) => {
//   // Scale from blue to red based on value (0-100)
//   const interpolate = d3.interpolateRgb(
//     d3.rgb(0, 140, 255), // Cool blue
//     d3.rgb(255, 50, 50)  // Warm red
//   );
//   return interpolate(value / 100);
// };

// // Create custom pulsing marker
// const createPulsingMarker = (latlng, size, map) => {
//   const icon = L.divIcon({
//     className: "custom-pulsing-marker",
//     html: `<div class="marker-pulse" style="
//       width: ${size}px;
//       height: ${size}px;
//       background-color: rgba(0, 204, 255, 0.6);
//       border-radius: 50%;
//       box-shadow: 0 0 0 rgba(0, 204, 255, 0.4);
//       animation: pulse 1.5s infinite;
//     "></div>`,
//     iconSize: [size, size],
//     iconAnchor: [size/2, size/2]
//   });

//   // Add CSS animation for pulsing effect
//   if (!document.querySelector('#pulse-animation')) {
//     const style = document.createElement('style');
//     style.id = 'pulse-animation';
//     style.innerHTML = `
//       @keyframes pulse {
//         0% {
//           transform: scale(0.5);
//           opacity: 1;
//         }
//         100% {
//           transform: scale(1.8);
//           opacity: 0;
//         }
//       }
//       .marker-pulse {
//         position: relative;
//       }
//     `;
//     document.head.appendChild(style);
//   }

//   return L.marker(latlng, { icon });
// };

// export default function MapView() {
//   const [map, setMap] = useState(null);
//   const [countryLayer, setCountryLayer] = useState(null);
//   const [markersLayer, setMarkersLayer] = useState(null);
//   const [countryNames, setCountryNames] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [countryNews, setCountryNews] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [countryData, setCountryData] = useState({});
//   const webglLayerRef = useRef(null);
  
//   // Initialize WebGL layer for performance
//   const initWebGLLayer = (mapInstance) => {
//     if (L.Canvas.WebGLRenderer) {
//       webglLayerRef.current = L.canvas.webGLRenderer({ tolerance: 5 });
//       mapInstance.addLayer(webglLayerRef.current);
//     }
//   };

//   // Generate random data for demo purposes
//   const generateMockData = (countryFeatures) => {
//     const data = {};
//     countryFeatures.forEach(feature => {
//       // Generate random value between 0-100 for heatmap intensity
//       const heatValue = Math.floor(Math.random() * 100);
//       // Generate 1-4 random points within the country for pulsing markers
//       const numPoints = Math.floor(Math.random() * 3) + 1;
//       const points = [];
      
//       if (feature.geometry && feature.geometry.type.includes("Polygon")) {
//         for (let i = 0; i < numPoints; i++) {
//           // Get a random point within the country bounds
//           let bounds;
//           if (feature.geometry.type === "Polygon") {
//             bounds = L.geoJSON(feature.geometry).getBounds();
//           } else if (feature.geometry.type === "MultiPolygon") {
//             bounds = L.geoJSON(feature.geometry).getBounds();
//           }
          
//           if (bounds) {
//             const lat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
//             const lng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
//             points.push([lat, lng]);
//           }
//         }
//       }
      
//       data[feature.properties.name] = {
//         heatValue,
//         points,
//         // For real-time demo: how often this country gets updated
//         updateFrequency: Math.random() > 0.8 ? 5000 : 0
//       };
//     });
//     return data;
//   };

//   // Add pulsing markers to a country
//   const addPulsingMarkers = (countryName) => {
//     if (!map || !markersLayer || !countryData[countryName]) return;
    
//     // Clear previous markers first
//     markersLayer.clearLayers();
    
//     // Add pulsing markers for this country
//     countryData[countryName].points.forEach(point => {
//       const marker = createPulsingMarker(point, 15, map);
//       markersLayer.addLayer(marker);
//     });
//   };

//   // Initialize map and load GeoJSON
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
//         attributionControl: false,
//         preferCanvas: true // Better performance for many markers
//       });

//       L.control.zoom({ position: "bottomright" }).addTo(mapInstance);
//       setMap(mapInstance);

//       // Initialize marker layer
//       const markers = L.layerGroup().addTo(mapInstance);
//       setMarkersLayer(markers);
      
//       // Initialize WebGL layer for better performance
//       initWebGLLayer(mapInstance);

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

//       // Add legend for heatmap colors
//       const legend = L.control({ position: 'bottomleft' });
//       legend.onAdd = function () {
//         const div = L.DomUtil.create('div', 'info legend');
//         div.style.backgroundColor = 'rgba(0,0,0,0.7)';
//         div.style.padding = '10px';
//         div.style.borderRadius = '5px';
//         div.style.color = 'white';
        
//         const grades = [0, 25, 50, 75, 100];
//         div.innerHTML += '<strong>Activity Level</strong><br>';
        
//         for (let i = 0; i < grades.length - 1; i++) {
//           div.innerHTML +=
//             '<i style="background:' + getHeatmapColor(grades[i]) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//         }
//         return div;
//       };
//       legend.addTo(mapInstance);

//       fetch("/countries.geo.json")
//         .then((response) => response.json())
//         .then((data) => {
//           // Generate mock data for demo
//           const mockData = generateMockData(data.features);
//           setCountryData(mockData);

//           const layer = L.geoJSON(data, {
//             style: function(feature) {
//               const countryName = feature.properties.name;
//               const heatValue = mockData[countryName]?.heatValue || 0;
              
//               return {
//                 fillColor: getHeatmapColor(heatValue),
//                 color: "#00ccff",
//                 weight: 1,
//                 fillOpacity: 0.5 + (heatValue / 200) // More intense color = more opaque
//               };
//             },
//             onEachFeature: (feature, layer) => {
//               const tooltip = L.tooltip({ permanent: false, opacity: 1 })
//                 .setContent(`<b>${feature.properties.name}</b>
//                              <br>Activity Level: ${mockData[feature.properties.name]?.heatValue || 0}%`);

//               const highlightStyle = { 
//                 fillOpacity: 0.8,
//                 weight: 2
//               };
              
//               const defaultStyle = { 
//                 fillOpacity: 0.5 + (mockData[feature.properties.name]?.heatValue || 0) / 200,
//                 weight: 1
//               };

//               const onMouseOver = () => {
//                 layer.setStyle(highlightStyle);
//                 layer.bringToFront();
//               };
              
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
//                 addPulsingMarkers(feature.properties.name);
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
//         map.off();
//         map.remove();
//         setMap(null);
//       }
//     };
//   }, [map]);

//   // Set up real-time updates for countries with updateFrequency > 0
//   useEffect(() => {
//     if (!map || !countryLayer || Object.keys(countryData).length === 0) return;

//     const updateIntervals = [];

//     // For each country with updateFrequency, set up an interval to update its data
//     Object.entries(countryData).forEach(([countryName, data]) => {
//       if (data.updateFrequency > 0) {
//         const interval = setInterval(() => {
//           // Update heatmap value
//           const newValue = Math.floor(Math.random() * 100);
//           setCountryData(prev => ({
//             ...prev,
//             [countryName]: {
//               ...prev[countryName],
//               heatValue: newValue
//             }
//           }));
          
//           // Update the country color on the map
//           countryLayer.eachLayer(layer => {
//             if (layer.feature.properties.name === countryName) {
//               layer.setStyle({
//                 fillColor: getHeatmapColor(newValue),
//                 fillOpacity: 0.5 + (newValue / 200)
//               });
              
//               // Briefly highlight the country that updated
//               layer.setStyle({ weight: 3, color: "#ffffff" });
//               setTimeout(() => {
//                 layer.setStyle({ weight: 1, color: "#00ccff" });
//               }, 1000);
//             }
//           });
          
//           // If this country is selected, update its markers too
//           if (selectedCountry && selectedCountry.name === countryName) {
//             addPulsingMarkers(countryName);
//           }
//         }, data.updateFrequency);
        
//         updateIntervals.push(interval);
//       }
//     });
    
//     return () => {
//       updateIntervals.forEach(interval => clearInterval(interval));
//     };
//   }, [map, countryLayer, countryData, selectedCountry]);

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
//           const heatValue = countryData[countryName]?.heatValue || 0;
//           layer.setStyle({
//             color: "#00ccff",
//             weight: 1,
//             fillOpacity: 0.5 + (heatValue / 200)
//           });
//         }, 3000);
        
//         // Add pulsing markers for this country
//         addPulsingMarkers(countryName);
//       }
//     });
//   };

//   return (
//     <>
//       <div id="map" style={{ height: "100vh", width: "100%" }}></div>
//       <SearchModal countryNames={countryNames} highlightCountry={highlightCountry} />
//       <NewsFetcher 
//         markersLayer={markersLayer} 
//         countryLayer={countryLayer} 
//         selectedCountry={selectedCountry}
//         setIsSidebarOpen={setIsSidebarOpen}
//         setCountryNews={setCountryNews} 
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

