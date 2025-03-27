
// import dynamic from "next/dynamic";
// import { useState } from "react";
// import SearchModal from "@/components/SearchModal";
// import Navbar from "../components/Navbar"; // Import the sidebar
// const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

// export default function Home() {
//   const [selectedCountry, setSelectedCountry] = useState(null);

//   // Function to highlight a country on the map
//   const highlightCountry = (countryId) => {
//     setSelectedCountry(countryId);
//   };

//   return (
//     <div className="relative w-full h-screen">
//       <Navbar /> 
//       <SearchModal highlightCountry={highlightCountry} />
//       <div className="absolute inset-0">
//         <MapView selectedCountry={selectedCountry} />
//       </div>
//     </div>
//   );
// // }

// import dynamic from "next/dynamic";
// import { useState } from "react";
// import SearchModal from "@/components/SearchModal";
// // Remove this import - it's already included through the Layout
// // import Navbar from "../components/Navbar"; 

// const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

// export default function Home() {
//   const [selectedCountry, setSelectedCountry] = useState(null);

//   // Function to highlight a country on the map
//   const highlightCountry = (countryId) => {
//     setSelectedCountry(countryId);
//   };

//   return (
//     <div className="relative w-full h-screen">
//       {/* Remove this Navbar component - it's already included in Layout */}
//       <SearchModal highlightCountry={highlightCountry} />
//       <div className="absolute inset-0">
//         <MapView selectedCountry={selectedCountry} />
//       </div>
//     </div>
//   );
// }

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