import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SearchModal from "@/components/SearchModal";  
import NewsFetcher from "@/components/NewsFetcher"; 
import Sidebar from "@/components/Sidebar"; 

export default function MapView() {
  const [map, setMap] = useState(null);
  const [countryLayer, setCountryLayer] = useState(null);
  const [markersLayer, setMarkersLayer] = useState(null);
  const [countryNames, setCountryNames] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryNews, setCountryNews] = useState([]); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          style: {
            color: "#00ccff",
            weight: 1,
            fillOpacity: 0.4
          },
          onEachFeature: (feature, layer) => {
            const tooltip = L.tooltip({ permanent: false, opacity: 1 })
              .setContent(`<b>${feature.properties.name}</b>`);

            const highlightStyle = { fillOpacity: 0.7 };
            const defaultStyle = { fillOpacity: 0.4 };

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
      map.off();
      map.remove();
      setMap(null);
    }
  };
}, [map]);

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
            fillOpacity: 0.4
          });
        }, 3000);
      }
    });
  };

  return (
    <>
      <div id="map" style={{ height: "100vh", width: "100%" }}></div>
      <SearchModal countryNames={countryNames} highlightCountry={highlightCountry} />
      <NewsFetcher 
        markersLayer={markersLayer} 
        countryLayer={countryLayer} 
        selectedCountry={selectedCountry}
        setIsSidebarOpen={setIsSidebarOpen}
        setCountryNews={setCountryNews} 
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

//working code


