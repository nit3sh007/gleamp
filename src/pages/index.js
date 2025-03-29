import dynamic from "next/dynamic";
import { useState } from "react";
import SearchModal from "@/components/SearchModal";

const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Function to highlight a country on the map
  const highlightCountry = (countryId) => {
    setSelectedCountry(countryId);
  };

  return (
    <div className="relative w-full h-screen">
      <SearchModal highlightCountry={highlightCountry} />
      <div className="absolute inset-0">
        <MapView selectedCountry={selectedCountry} />
      </div>
    </div>
  );
}