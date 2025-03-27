// import { useEffect, useState, useRef } from "react";
// import dynamic from 'next/dynamic';

// // Dynamically import Leaflet to ensure it's only loaded on client-side
// const MapComponent = dynamic(() => import('./MapComponent'), {
//   ssr: false,
//   loading: () => <div className="w-full h-screen bg-black flex items-center justify-center">Loading map...</div>
// });

// export default function MapView() {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return null;
//   }

//   return <MapComponent />;
// }