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



import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SearchModal from '@/components/SearchModal';
import NewsFetcher from '@/components/NewsFetcher';
import Sidebar from '@/components/Sidebar';

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
  const [recentNewsCountries, setRecentNewsCountries] = useState({});
  
  // Use refs to track state and cleanup resources
  const mapRef = useRef(null);
  const mapContainerRef = useRef('map');
  const animationFrameRef = useRef(null);
  const boundaryAnimationRef = useRef(null);
  const dotMarkersRef = useRef({});
  const isZoomingRef = useRef(false);
  const throttleTimerRef = useRef(null);
  const countryLastUpdateRef = useRef({});
  const tooltipUpdateIntervalRef = useRef(null);
  const mapInitializedRef = useRef(false);
  const initialRenderRef = useRef(true);

  // Initialize map
  useEffect(() => {
    // Ensure we're on client side and map hasn't been initialized
    if (typeof window === 'undefined' || mapInitializedRef.current) {
      return;
    }

    // Check if a map instance already exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Create a new map instance
    const mapInstance = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 4,
      minZoom: 4,
      maxZoom: 5,
      worldCopyJump: false,
      maxBounds: [
        [-75, -175],
        [84, 180],
      ],
      maxBoundsViscosity: 1.0,
      doubleClickZoom: true,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
      renderer: L.canvas(),
    });

    // Store reference to map
    mapRef.current = mapInstance;
    setMap(mapInstance);
    mapInitializedRef.current = true;

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    const markers = L.layerGroup().addTo(mapInstance);
    setMarkersLayer(markers);

    const pulseDots = L.layerGroup().addTo(mapInstance);
    setPulseDotLayer(pulseDots);

    mapInstance.on('zoomstart', () => {
      isZoomingRef.current = true;
    });

    mapInstance.on('zoomend', () => {
      isZoomingRef.current = false;
      // Restart animations after zoom ends
      startAllAnimations();
    });

    mapInstance.on('dblclick', () => {
      const currentZoom = mapInstance.getZoom();
      const maxZoom = mapInstance.getMaxZoom();
      const minZoom = mapInstance.getMinZoom();

      if (currentZoom < maxZoom) {
        mapInstance.zoomIn();
      } else {
        mapInstance.setZoom(minZoom);
      }
    });

    // Start animations when the map becomes ready
    mapInstance.on('load', () => {
      startAllAnimations();
    });

    // Set up tooltip update interval
    tooltipUpdateIntervalRef.current = setInterval(() => {
      updateCountryTooltips();
    }, 60000); // Update time displays every minute

    // Load country data
    fetch('/countries.geo.json')
      .then((response) => response.json())
      .then((data) => {
        const layer = L.geoJSON(data, {
          style: (feature) => {
            return {
              color: '#1A4875',
              weight: 1,
              fillColor: '#0A2540',
              fillOpacity: 0.8,
            };
          },
          onEachFeature: (feature, layer) => {
            const bounds = layer.getBounds();
            feature.properties.center = bounds.getCenter();

            const getTooltipContent = (countryId, countryName) => {
              const newsCount = newsCountByCountry[countryId] || 0;
              const lastUpdate = countryLastUpdateRef.current[countryId];
              let timeString = 'No recent updates';
              
              if (lastUpdate) {
                const now = new Date();
                const diff = Math.floor((now - lastUpdate) / 1000); // seconds
                
                if (diff < 60) {
                  timeString = 'just now';
                } else if (diff < 3600) {
                  timeString = `${Math.floor(diff / 60)} min ago`;
                } else if (diff < 86400) {
                  timeString = `${Math.floor(diff / 3600)} hours ago`;
                }
              }
              
              // Add flag emoji based on country name (simplified version)
              const getCountryFlag = (name) => {
                // This is a simplified approach. In production, you would map country names to their flag emoji codes
                const flagEmojis = {
                  'United States': '🇺🇸',
                  'China': '🇨🇳',
                  'Russia': '🇷🇺',
                  'India': '🇮🇳',
                  'Brazil': '🇧🇷',
                  // Add more as needed
                };
                
                return flagEmojis[name] || '🌐';
              };
              
              const flag = getCountryFlag(countryName);
              
              return `
                <div>
                  <b>${flag} ${countryName}</b>
                  <div>News: ${newsCount} items</div>
                  <div>Updated: ${timeString}</div>
                </div>
              `;
            };

            const tooltip = L.tooltip({ permanent: false, opacity: 1 });

            const highlightStyle = {
              fillOpacity: 0.9,
              fillColor: '#1A4875',
            };

            const defaultStyle = {
              fillOpacity: 0.8,
              fillColor: '#0A2540',
            };

            const onMouseOver = () => {
              // Don't apply highlight style if country is already glowing
              if (!recentNewsCountries[feature.id]) {
                layer.setStyle(highlightStyle);
              }
              tooltip.setContent(getTooltipContent(feature.id, feature.properties.name));
            };
            
            const onMouseOut = () => {
              // Only return to default style if not currently blinking
              if (!recentNewsCountries[feature.id]) {
                layer.setStyle(defaultStyle);
              }
              tooltip.remove();
            };

            layer.on('mouseover', onMouseOver);
            layer.on('mouseout', onMouseOut);
            layer.on('mousemove', (event) => tooltip.setLatLng(event.latlng).addTo(mapInstance));
            layer.on('mouseout', () => tooltip.remove());

            layer.on('click', (e) => {
              if (e && e.originalEvent) {
                e.originalEvent.stopPropagation();
              }

              removeAllMarkers();
              setSelectedCountry({ id: feature.id, name: feature.properties.name });
              highlightCountry(feature.properties.name);
              setIsSidebarOpen(true);
              
              // Stop blinking for this country when clicked
              if (recentNewsCountries[feature.id]) {
                const updatedRecentNews = { ...recentNewsCountries };
                delete updatedRecentNews[feature.id];
                setRecentNewsCountries(updatedRecentNews);
              }
            });

            layer.on('remove', () => {
              layer.off('mouseover', onMouseOver);
              layer.off('mouseout', onMouseOut);
              layer.off('mousemove');
              layer.off('click');
            });
          },
        }).addTo(mapInstance);
        
        setCountryLayer(layer);
        setCountryNames(data.features.map((feature) => feature.properties.name));
        
        // Ensure animations are started after country layer is loaded
        startAllAnimations();
      })
      .catch((error) => console.error('Error loading GeoJSON:', error));

    // Cleanup function
    return () => {
      // Cancel all animations
      stopAllAnimations();
      
      if (tooltipUpdateIntervalRef.current) {
        clearInterval(tooltipUpdateIntervalRef.current);
        tooltipUpdateIntervalRef.current = null;
      }
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
        throttleTimerRef.current = null;
      }

      // Clean up map properly
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      
      // Reset initialization flag
      mapInitializedRef.current = false;
      setMap(null);
    };
  }, []); // Empty dependency array - only run once on mount

  // Function to stop all animations
  const stopAllAnimations = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (boundaryAnimationRef.current) {
      cancelAnimationFrame(boundaryAnimationRef.current);
      boundaryAnimationRef.current = null;
    }
  };

  // Function to start all animations
  const startAllAnimations = () => {
    // Only start animations if not already running and not currently zooming
    if (!isZoomingRef.current) {
      if (!animationFrameRef.current && Object.keys(dotMarkersRef.current).length > 0) {
        animationFrameRef.current = requestAnimationFrame(animatePulsingDots);
      }
      if (!boundaryAnimationRef.current && countryLayer) {
        boundaryAnimationRef.current = requestAnimationFrame(animateCountryBoundaries);
      }
    }
  };

  // Function to update country tooltips
  const updateCountryTooltips = () => {
    if (!countryLayer) return;
    
    // Force tooltips to update their time displays
    countryLayer.eachLayer((layer) => {
      if (layer.getTooltip()) {
        layer.getTooltip().setContent(layer.getTooltip().getContent());
      }
    });
  };

  // Animation function for country boundaries
  const animateCountryBoundaries = () => {
    if (isZoomingRef.current || !countryLayer || !mapRef.current) {
      boundaryAnimationRef.current = null;
      return;
    }

    const now = new Date();
    const pulseRate = 0.03;
    const pulseAmount = 0.2;
    
    // Flag to check if any country is animated
    let hasAnimatedCountries = false;
    
    countryLayer.eachLayer((layer) => {
      const countryId = layer.feature.id;
      
      // If this country should be glowing
      if (recentNewsCountries[countryId]) {
        hasAnimatedCountries = true;
        const phase = (now.getTime() / 1000) % (Math.PI * 2);
        const pulseValue = 0.5 + pulseAmount * Math.sin(phase * pulseRate * 10);
        
        layer.setStyle({
          color: '#FF9500',
          weight: 1.5 + pulseValue * 0.5,
          fillOpacity: 0.7 + pulseValue * 0.3,
          fillColor: '#1A4875',
        });
      } else {
        // Ensure non-glowing countries have default style
        // Only reset if not in hover state
        if (!layer._isHovering) {
          layer.setStyle({
            color: '#1A4875',
            weight: 1,
            fillColor: '#0A2540',
            fillOpacity: 0.8,
          });
        }
      }
    });

    // Continue animation loop only if at least one country is animated
    // or if we're on initial render (to ensure animation starts properly)
    if (hasAnimatedCountries || initialRenderRef.current) {
      initialRenderRef.current = false;
      boundaryAnimationRef.current = requestAnimationFrame(animateCountryBoundaries);
    } else {
      boundaryAnimationRef.current = null;
    }
  };

  // Animation function for pulsing dots
  const animatePulsingDots = () => {
    if (isZoomingRef.current || !mapRef.current) {
      animationFrameRef.current = null;
      return;
    }

    Object.values(dotMarkersRef.current).forEach((dotData) => {
      dotData.phase = (dotData.phase + 0.04) % (Math.PI * 2);

      const baseDotSize = dotData.baseSize;
      const dotPulseSize = baseDotSize + 1.5 * Math.sin(dotData.phase);

      const baseOpacity = 0.85;
      const pulseOpacity = baseOpacity + 0.15 * Math.sin(dotData.phase);

      dotData.primaryMarker.setRadius(dotPulseSize);
      dotData.primaryMarker.setStyle({
        fillOpacity: pulseOpacity,
        opacity: pulseOpacity * 0.7,
      });

      const glowPhase = (dotData.phase + Math.PI) % (Math.PI * 2);
      const glowSize = baseDotSize * 2.5 + 2 * Math.sin(glowPhase);
      const glowOpacity = 0.3 + 0.15 * Math.sin(glowPhase);

      dotData.glowMarker.setRadius(glowSize);
      dotData.glowMarker.setStyle({
        fillOpacity: glowOpacity * 0.4,
        opacity: glowOpacity * 0.2,
      });

      if (dotData.importance > 0.6) {
        const coreOpacity = 0.9 + 0.1 * Math.sin(dotData.phase * 1.5);
        dotData.coreMarker?.setStyle({
          fillOpacity: coreOpacity,
        });
      }
    });

    // Only continue animation if there are dots to animate
    if (Object.keys(dotMarkersRef.current).length > 0) {
      animationFrameRef.current = requestAnimationFrame(animatePulsingDots);
    } else {
      animationFrameRef.current = null;
    }
  };

  // Effect to update pulse dots when news data changes
  useEffect(() => {
    if (!map || !countryLayer || !pulseDotLayer || Object.keys(newsCountByCountry).length === 0) {
      return;
    }

    // Clear existing layers
    if (pulseDotLayer) {
      pulseDotLayer.clearLayers();
    }

    // Cancel existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Reset dots data
    dotMarkersRef.current = {};

    // Find countries with news
    const countryIdsWithNews = Object.keys(newsCountByCountry).filter(
      (countryId) => newsCountByCountry[countryId] > 0
    );

    // Calculate max news count for scaling
    const maxNewsCount = Math.max(
      ...Object.values(newsCountByCountry).filter((count) => count > 0),
      1 // Prevent division by zero
    );

    // Limit number of dots to display
    const maxDots = Math.min(countryIdsWithNews.length, 20);

    // Sort countries by news count
    const sortedCountries = countryIdsWithNews
      .sort((a, b) => newsCountByCountry[b] - newsCountByCountry[a])
      .slice(0, maxDots);

    // Create dots for each country with news
    sortedCountries.forEach((countryId) => {
      const newsCount = newsCountByCountry[countryId];

      let center = null;
      let countryName = '';
      countryLayer.eachLayer((layer) => {
        if (layer.feature.id === countryId) {
          center = layer.feature.properties.center;
          countryName = layer.feature.properties.name;
        }
      });

      if (center) {
        const importance = newsCount / maxNewsCount;
        const baseSize = Math.max(5, Math.min(9, 5 + importance * 4));
        const dotGroup = L.layerGroup().addTo(pulseDotLayer);

        // Create glow marker
        const glowMarker = L.circleMarker(center, {
          radius: baseSize * 2.5,
          color: '#FF9500',
          fillColor: '#FF9500',
          fillOpacity: 0.2,
          weight: 0.5,
          opacity: 0.2,
        }).addTo(dotGroup);

        // Create primary marker
        const primaryMarker = L.circleMarker(center, {
          radius: baseSize,
          color: '#FF9500',
          fillColor: '#FF9500',
          fillOpacity: 0.85,
          weight: 1.5,
          opacity: 0.6,
        }).addTo(dotGroup);

        // Create core marker for important news
        let coreMarker = null;
        if (importance > 0.6) {
          coreMarker = L.circleMarker(center, {
            radius: baseSize * 0.5,
            color: '#FFBF00',
            fillColor: '#FFBF00',
            fillOpacity: 0.9,
            weight: 0,
            opacity: 0,
          }).addTo(dotGroup);
        }

        // Add click handlers - MODIFIED: removed call to highlightCountry
        const clickHandler = () => {
          removeAllMarkers();
          setSelectedCountry({ id: countryId, name: countryName });
          // Remove this line to prevent zooming: highlightCountry(countryName);
          setIsSidebarOpen(true);
          
          // Stop blinking for this country when clicked
          if (recentNewsCountries[countryId]) {
            const updatedRecentNews = { ...recentNewsCountries };
            delete updatedRecentNews[countryId];
            setRecentNewsCountries(updatedRecentNews);
          }
        };

        primaryMarker.on('click', clickHandler);
        glowMarker.on('click', clickHandler);
        if (coreMarker) {
          coreMarker.on('click', clickHandler);
        }

        // Store references for animation
        dotMarkersRef.current[countryId] = {
          primaryMarker,
          glowMarker,
          coreMarker,
          phase: Math.random() * Math.PI * 2,
          baseSize,
          importance,
        };
      }
    });

    // Start animation if we have dots
    startAllAnimations();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [map, countryLayer, pulseDotLayer, newsCountByCountry]);

  // Effect to handle recent news countries - make sure glowing happens regardless of zoom
  useEffect(() => {
    if (!countryLayer) return;
    
    // Check for countries with news in the last 30 minutes
    const now = new Date();
    const recentNews = {};
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    
    // For development/testing, ensure we always have some countries to highlight
    // In production, you'd rely on actual news timestamps
    // Remove this block in production
    if (initialRenderRef.current && countryLayer) {
      let counter = 0;
      countryLayer.eachLayer((layer) => {
        if (counter < 5 && layer.feature.id) {  // Highlight first 5 countries
          recentNews[layer.feature.id] = true;
          countryLastUpdateRef.current[layer.feature.id] = new Date();
          counter++;
        }
      });
    }
    
    // Update recent news countries based on actual data
    Object.keys(newsCountByCountry).forEach(countryId => {
      if (newsCountByCountry[countryId] > 0) {
        // Get or create last update timestamp
        const lastUpdate = countryLastUpdateRef.current[countryId] || new Date();
        
        // Save/update the last update time reference
        countryLastUpdateRef.current[countryId] = lastUpdate;
        
        // Check if this country should have blinking boundaries (news in last 30 min)
        if (lastUpdate >= thirtyMinutesAgo) {
          recentNews[countryId] = true;
        }
      }
    });
    
    setRecentNewsCountries(recentNews);
    
    // Make sure animation is running
    startAllAnimations();
    
    // Clean up on unmount
    return () => {
      if (boundaryAnimationRef.current) {
        cancelAnimationFrame(boundaryAnimationRef.current);
        boundaryAnimationRef.current = null;
      }
    };
  }, [countryLayer, newsCountByCountry]);

  // Helper function to remove all markers
  const removeAllMarkers = () => {
    if (markersLayer) {
      markersLayer.clearLayers();
    }
  };

  // Function to highlight a country (used by search and country click, but not dots)
  const highlightCountry = (countryName) => {
    if (!countryLayer || !map) {
      return;
    }

    countryLayer.eachLayer((layer) => {
      if (layer.feature.properties.name.toLowerCase() === countryName.toLowerCase()) {
        const bounds = layer.getBounds();
        map.flyToBounds(bounds, { padding: [50, 50], duration: 2 });

        layer.setStyle({
          color: '#4A88C7',
          weight: 2,
          fillOpacity: 0.9,
          fillColor: '#1A4875',
        });

        // Reset style after animation unless it's in the recentNewsCountries
        setTimeout(() => {
          if (!recentNewsCountries[layer.feature.id]) {
            layer.setStyle({
              color: '#1A4875',
              weight: 1,
              fillOpacity: 0.8,
              fillColor: '#0A2540',
            });
          }
        }, 3000);
      }
    });
  };

  // CSS styles for the map
  const mapCSS = `
    #map {
      background-color: rgb(0, 0, 0);
    }
    .leaflet-interactive {
      stroke-opacity: 0.8;
      transition: all 0.3s ease;
    }
    .leaflet-canvas-container {
      will-change: transform;
    }
    .leaflet-container {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    .leaflet-tooltip {
      background-color: rgba(0, 0, 0, 0.75);
      color: #fff;
      border: 1px solid rgba(255, 149, 0, 0.6);
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(255, 149, 0, 0.3);
      padding: 5px 8px;
      min-width: 120px;
    }
    .leaflet-tooltip:before {
      border-top-color: rgba(0, 0, 0, 0.75);
    }
  `;

  return (
    <>
      <style>{mapCSS}</style>
      <div id="map" ref={mapContainerRef} style={{ height: '100vh', width: '100%' }}></div>
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