// import { useEffect, useState } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import SearchModal from "@/components/SearchModal";  
// import NewsFetcher from "@/components/NewsFetcher"; 
// import Sidebar from "@/components/Sidebar"; 

// export default function MapView() {
//   const [map, setMap] = useState(null);
//   const [countryLayer, setCountryLayer] = useState(null);
//   const [markersLayer, setMarkersLayer] = useState(null);
//   const [countryNames, setCountryNames] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [countryNews, setCountryNews] = useState([]); 
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// useEffect(() => {
//   if (typeof window !== "undefined" && !map) {
//     const mapInstance = L.map("map", {
//       center: [20, 0],
//       zoom: 4,
//       minZoom: 4,
//       maxZoom: 5,
//       worldCopyJump: false,
//       maxBounds: [
//         [-75, -175],
//         [84, 180]
//       ],
//       maxBoundsViscosity: 1.0,
//       doubleClickZoom: true,
//       zoomControl: false,
//       attributionControl: false
//     });

//     L.control.zoom({ position: "bottomright" }).addTo(mapInstance);
//     setMap(mapInstance);

//     const markers = L.layerGroup().addTo(mapInstance);
//     setMarkersLayer(markers);

//     mapInstance.on("dblclick", () => {
//       const currentZoom = mapInstance.getZoom();
//       const maxZoom = mapInstance.getMaxZoom();
//       const minZoom = mapInstance.getMinZoom();

//       if (currentZoom < maxZoom) {
//         mapInstance.zoomIn();
//       } else {
//         mapInstance.setZoom(minZoom);
//       }
//     });

//     fetch("/countries.geo.json")
//       .then((response) => response.json())
//       .then((data) => {
//         const layer = L.geoJSON(data, {
//           style: {
//             color: "#00ccff",
//             weight: 1,
//             fillOpacity: 0.4
//           },
//           onEachFeature: (feature, layer) => {
//             const tooltip = L.tooltip({ permanent: false, opacity: 1 })
//               .setContent(`<b>${feature.properties.name}</b>`);

//             const highlightStyle = { fillOpacity: 0.7 };
//             const defaultStyle = { fillOpacity: 0.4 };

//             const onMouseOver = () => layer.setStyle(highlightStyle);
//             const onMouseOut = () => layer.setStyle(defaultStyle);

//             layer.on("mouseover", onMouseOver);
//             layer.on("mouseout", onMouseOut);
//             layer.on("mousemove", (event) => tooltip.setLatLng(event.latlng).addTo(mapInstance));
//             layer.on("mouseout", () => tooltip.remove());

//             layer.on("click", (e) => {
//               if (e && e.originalEvent) {
//                 e.originalEvent.stopPropagation();
//               }

//               removeAllMarkers();
//               setSelectedCountry({ id: feature.id, name: feature.properties.name });
//               highlightCountry(feature.properties.name);
//               setIsSidebarOpen(true);
//             });

//             layer.on("remove", () => {
//               layer.off("mouseover", onMouseOver);
//               layer.off("mouseout", onMouseOut);
//               layer.off("mousemove");
//               layer.off("click");
//             });
//           }
//         }).addTo(mapInstance);
//         setCountryLayer(layer);

//         setCountryNames(data.features.map((feature) => feature.properties.name));
//       })
//       .catch((error) => console.error("Error loading GeoJSON:", error));
//   }

//   return () => {
//     if (map) {
//       map.off();
//       map.remove();
//       setMap(null);
//     }
//   };
// }, [map]);

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
//             fillOpacity: 0.4
//           });
//         }, 3000);
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

// //working code

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

  useEffect(() => {
    if (typeof window !== "undefined" && !map) {
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
        attributionControl: false
      });

      L.control.zoom({ position: "bottomright" }).addTo(mapInstance);
      setMap(mapInstance);

      const markers = L.layerGroup().addTo(mapInstance);
      setMarkersLayer(markers);

      // Create a layer for pulsing dots and ensure it's on top
      const pulseDots = L.layerGroup().addTo(mapInstance);
      setPulseDotLayer(pulseDots);

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
                color: "#00ccff",
                weight: 1,
                fillColor: getCountryColor(feature.id),
                fillOpacity: 0.4
              };
            },
            onEachFeature: (feature, layer) => {
              const tooltip = L.tooltip({ permanent: false, opacity: 1 })
                .setContent(`<b>${feature.properties.name}</b>`);

              const highlightStyle = { fillOpacity: 0.7 };
              const defaultStyle = { 
                fillOpacity: 0.4,
                fillColor: getCountryColor(feature.id)
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

  // Effect to update country colors when news count changes
  useEffect(() => {
    if (countryLayer && Object.keys(newsCountByCountry).length > 0) {
      countryLayer.eachLayer((layer) => {
        const countryId = layer.feature.id;
        layer.setStyle({
          fillColor: getCountryColor(countryId),
          fillOpacity: 0.4
        });
      });
      
      // Clear previous pulse dots and add new ones
      updatePulseDots();
    }
  }, [newsCountByCountry, countryLayer, pulseDotLayer, map]);

  const getCountryColor = (countryId) => {
    const newsCount = newsCountByCountry[countryId] || 0;
    
    if (newsCount === 0) {
      return "#202c44"; // Base color for countries without news
    } else if (newsCount < 5) {
      return "#3a5180"; // Light intensity
    } else if (newsCount < 10) {
      return "#5474ad"; // Medium intensity
    } else if (newsCount < 20) {
      return "#6d97db"; // Higher intensity
    } else {
      return "#86baff"; // Highest intensity
    }
  };

  // Add pulsing dots to countries with news
  const updatePulseDots = () => {
    if (!pulseDotLayer || !countryLayer || !map) return;
    
    pulseDotLayer.clearLayers();
    
    countryLayer.eachLayer((layer) => {
      const countryId = layer.feature.id;
      const newsCount = newsCountByCountry[countryId] || 0;
      
      if (newsCount > 0) {
        // Get center of country polygon for dot placement
        const bounds = layer.getBounds();
        const center = bounds.getCenter();
        
        // Create prominent red pulsing dot for this country
        createPulsingDot(center, newsCount);
      }
    });
  };

  // Create a red pulsing dot icon at the given position
const createPulsingDot = (position, newsCount) => {
  // Size based on news count, with a more visible minimum size
  const size = Math.min(10 + (newsCount / 2), 25);
  
  // Create custom divIcon for the pulsing effect
  const pulsingIcon = L.divIcon({
    className: 'pulse-icon',
    html: `
      <div class="pulse-core" style="
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: rgba(255, 0, 0, 0.9);
        border-radius: 50%;
        z-index: 999;
      "></div>
      <div class="pulse-ring" style="
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: transparent;
        border: 3px solid rgba(255, 0, 0, 0.7);
        border-radius: 50%;
        animation: pulse-ring 2s infinite;
        z-index: 998;
      "></div>
      ${newsCount > 0 ? `<div class="news-count" style="
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #ff0000;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        z-index: 1000;
      ">${newsCount > 99 ? '99+' : newsCount}</div>` : ''}
    `,
    iconSize: [size + 20, size + 20],
    iconAnchor: [(size + 20)/2, (size + 20)/2]
  });
  
  // Add the pulsing marker to the layer
  const marker = L.marker(position, {
    icon: pulsingIcon,
    interactive: false,
    zIndexOffset: 1000
  }).addTo(pulseDotLayer);
  
  return marker;
};
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
          color: "yellow",
          weight: 3,
          fillOpacity: 0.7
        });

        setTimeout(() => {
          layer.setStyle({
            color: "#00ccff",
            weight: 1,
            fillOpacity: 0.4,
            fillColor: getCountryColor(layer.feature.id)
          });
        }, 3000);
      }
    });
  };

  // Add CSS for pulsing animation with a more prominent effect
  const pulseCSS = `
    @keyframes pulse-ring {
      0% {
        transform: scale(0.5);
        opacity: 1;
      }
      50% {
        transform: scale(1.5);
        opacity: 0.5;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    /* Make sure our custom elements are visible */
    .pulse-icon {
      z-index: 1000 !important;
    }
    
    .pulse-core {
      box-shadow: 0 0 8px #ff0000;
    }
  `;

  return (
    <>
      <style>{pulseCSS}</style>
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