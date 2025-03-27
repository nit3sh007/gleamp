// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { Home, Search, User, Bell, Settings, Menu, X } from "lucide-react";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     setMounted(true);
//     const savedState = localStorage.getItem("navbarState");
//     if (savedState !== null) {
//       setIsOpen(JSON.parse(savedState));
//     }
//   }, []);

//   useEffect(() => {
//     if (mounted) {
//       localStorage.setItem("navbarState", JSON.stringify(isOpen));
//     }
//   }, [isOpen, mounted]);

//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       const isMobileView = width < 768;
//       const isTabletView = width >= 768 && width < 1024;

//       setIsMobile(isMobileView);

//       if (isTabletView) {
//         setIsOpen(false);
//       } else if (width >= 1024) {
//         setIsOpen(true);
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const handleRouteChange = () => {
//       if (isMobile) setIsOpen(true);
//     };

//     router.events.on("routeChangeComplete", handleRouteChange);
//     return () => router.events.off("routeChangeComplete", handleRouteChange);
//   }, [isMobile, router]);

//   useEffect(() => {
//     const handleMapClick = (event) => {
//       const mapElement = document.getElementById("map");
//       if (mapElement?.contains(event.target) && !isMobile) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("click", handleMapClick);
//     return () => document.removeEventListener("click", handleMapClick);
//   }, [isMobile]);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   const navItems = [
//     { path: "/", icon: Home, label: "Home" },
//     { path: "/search", icon: Search, label: "Search" },
//     { path: "/profile", icon: User, label: "Profile" },
//     { path: "/notifications", icon: Bell, label: "Notifications" },
//     { path: "/settings", icon: Settings, label: "Settings" },
//   ];

//   const isActivePath = (path) => router.pathname === path;

//   return (
//     <>
//       {mounted && (
//         <>
//           <div
//             className={`fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out z-[1000]
//               ${isMobile ? 'hidden' : 'block'} 
//               ${isOpen ? 'w-64' : 'w-16'}`}
//             style={{
//               backgroundColor: "#111827",
//               boxShadow: "2px 0 5px rgba(0, 0, 0, 0.3)",
//             }}
//           >
//             <div className="flex items-center justify-between p-4 border-b border-gray-700">
//               <span
//                 className={`text-2xl font-bold text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}
//               >
//                 Gleamp
//               </span>
//               <button
//                 onClick={toggleSidebar}
//                 className="text-white focus:outline-none hover:bg-gray-700 p-1 rounded transition-colors duration-200 active:scale-95"
//               >
//                 {isOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>

//             <nav className="mt-4 space-y-1">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 const active = isActivePath(item.path);
//                 return (
//                   <Link
//                     key={item.path}
//                     href={item.path}
//                     className={`flex items-center px-4 py-3 text-white relative group transition-all duration-200
//                     hover:bg-gray-800/50 active:bg-gray-700 active:scale-[0.98] 
//                     ${active ? "bg-gray-800/30" : ""}`}
//                   >
//                     <div className="w-8 h-8 flex items-center justify-center">
//                       <Icon
//                         className={`transition-transform duration-200 group-hover:scale-110
//                         ${active ? "text-white" : "text-gray-400"}`}
//                         size={20}
//                       />
//                     </div>
//                     {isOpen && (
//                       <span
//                         className={`ml-2 transition-all duration-200
//                       ${active ? "text-white font-bold" : "text-gray-400 font-normal"}
//                       group-hover:text-white`}
//                       >
//                         {item.label}
//                       </span>
//                     )}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>

//           <div
//             className={`fixed bottom-0 left-0 w-full h-16 z-[1005] 
//             ${!isMobile ? 'hidden' : 'flex'} 
//             justify-around items-center bg-gray-900 shadow-top`}
//           >
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const active = isActivePath(item.path);
//               return (
//                 <Link
//                   key={item.path}
//                   href={item.path}
//                   className="flex flex-col items-center justify-center w-full h-full transition-transform active:scale-95"
//                 >
//                   <div className="w-8 h-8 flex items-center justify-center">
//                     <Icon
//                       size={24}
//                       className={`transition-transform duration-200 hover:scale-110
//                       ${active ? "text-white" : "text-gray-400"}`}
//                     />
//                   </div>
//                   <span
//                     className={`text-xs mt-1 transition-all duration-200
//                   ${active ? "text-white font-bold" : "text-gray-400 font-normal"}`}
//                   >
//                     {item.label.split(" ")[0]}
//                   </span>
//                 </Link>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Navbar;


// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { Home, Search, User, Bell, Settings, Menu, X } from "lucide-react";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false); // Start collapsed by default
//   const [isMobile, setIsMobile] = useState(false);
//   const [isTablet, setIsTablet] = useState(false); // Add tablet state
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     setMounted(true);
//     const savedState = localStorage.getItem("navbarState");
//     if (savedState !== null) {
//       // Only apply saved state if not in tablet mode
//       const width = window.innerWidth;
//       if (!(width >= 768 && width < 1024)) {
//         setIsOpen(JSON.parse(savedState));
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (mounted && !isTablet) {
//       localStorage.setItem("navbarState", JSON.stringify(isOpen));
//     }
//   }, [isOpen, mounted, isTablet]);

//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       const isMobileView = width < 768;
//       const isTabletView = width >= 768 && width < 1024;

//       setIsMobile(isMobileView);
//       setIsTablet(isTabletView);

//       // Force collapsed state in tablet view
//       if (isTabletView) {
//         setIsOpen(false);
//       } else if (width >= 1024 && !isMobileView) {
//         // For desktop, default to open unless manually set
//         const savedState = localStorage.getItem("navbarState");
//         if (savedState === null) {
//           setIsOpen(true);
//         }
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const handleRouteChange = () => {
//       if (isMobile) {
//         setIsOpen(false); // Close the navbar on mobile when route changes
//       } else if (isTablet) {
//         setIsOpen(false); // Ensure it stays collapsed on tablet
//       }
//     };

//     router.events.on("routeChangeComplete", handleRouteChange);
//     return () => router.events.off("routeChangeComplete", handleRouteChange);
//   }, [isMobile, isTablet, router]);

//   useEffect(() => {
//     const handleMapClick = (event) => {
//       const mapElement = document.getElementById("map");
//       if (mapElement?.contains(event.target) && !isMobile) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("click", handleMapClick);
//     return () => document.removeEventListener("click", handleMapClick);
//   }, [isMobile]);

//   const toggleSidebar = () => {
//     // For tablet mode, allow toggle but immediately collapse when resizing to tablet
//     setIsOpen(!isOpen);
//   };

//   const navItems = [
//     { path: "/", icon: Home, label: "Home" },
//     { path: "/search", icon: Search, label: "Search" },
//     { path: "/profile", icon: User, label: "Profile" },
//     { path: "/notifications", icon: Bell, label: "Notifications" },
//     { path: "/settings", icon: Settings, label: "Settings" },
//   ];

//   const isActivePath = (path) => router.pathname === path;

//   return (
//     <>
//       {mounted && (
//         <>
//           <div
//             className={`fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out z-[1000]
//               ${isMobile ? 'hidden' : 'block'} 
//               ${isOpen ? 'w-64' : 'w-16'}`}
//             style={{
//               backgroundColor: "#111827",
//               boxShadow: "2px 0 5px rgba(0, 0, 0, 0.3)",
//             }}
//           >
//             <div className="flex items-center justify-between p-4 border-b border-gray-700">
//               <span
//                 className={`text-2xl font-bold text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}
//               >
//                 Gleamp
//               </span>
//               <button
//                 onClick={toggleSidebar}
//                 className="text-white focus:outline-none hover:bg-gray-700 p-1 rounded transition-colors duration-200 active:scale-95"
//               >
//                 {isOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>

//             <nav className="mt-4 space-y-1">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 const active = isActivePath(item.path);
//                 return (
//                   <Link
//                     key={item.path}
//                     href={item.path}
//                     className={`flex items-center px-4 py-3 text-white relative group transition-all duration-200
//                     hover:bg-gray-800/50 active:bg-gray-700 active:scale-[0.98] 
//                     ${active ? "bg-gray-800/30" : ""}`}
//                   >
//                     <div className="w-8 h-8 flex items-center justify-center">
//                       <Icon
//                         className={`transition-transform duration-200 group-hover:scale-110
//                         ${active ? "text-white" : "text-gray-400"}`}
//                         size={20}
//                       />
//                     </div>
//                     {isOpen && (
//                       <span
//                         className={`ml-2 transition-all duration-200
//                       ${active ? "text-white font-bold" : "text-gray-400 font-normal"}
//                       group-hover:text-white`}
//                       >
//                         {item.label}
//                       </span>
//                     )}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>

//           <div
//             className={`fixed bottom-0 left-0 w-full h-16 z-[1005] 
//             ${!isMobile ? 'hidden' : 'flex'} 
//             justify-around items-center bg-gray-900 shadow-top`}
//           >
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const active = isActivePath(item.path);
//               return (
//                 <Link
//                   key={item.path}
//                   href={item.path}
//                   className="flex flex-col items-center justify-center w-full h-full transition-transform active:scale-95"
//                 >
//                   <div className="w-8 h-8 flex items-center justify-center">
//                     <Icon
//                       size={24}
//                       className={`transition-transform duration-200 hover:scale-110
//                       ${active ? "text-white" : "text-gray-400"}`}
//                     />
//                   </div>
//                   <span
//                     className={`text-xs mt-1 transition-all duration-200
//                   ${active ? "text-white font-bold" : "text-gray-400 font-normal"}`}
//                   >
//                     {item.label.split(" ")[0]}
//                   </span>
//                 </Link>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Navbar;


// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { Home, Search, User, Bell, Settings, Menu, X } from "lucide-react";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [viewportSize, setViewportSize] = useState({
//     isMobile: false,
//     isTablet: false
//   });
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();
//   const { isMobile, isTablet } = viewportSize;

//   // Consolidated resize handler
//   const handleResize = useCallback(() => {
//     const width = window.innerWidth;
//     const isMobileView = width < 768;
//     const isTabletView = width >= 768 && width < 1024;

//     setViewportSize({
//       isMobile: isMobileView,
//       isTablet: isTabletView
//     });

//     // Handle sidebar state based on viewport
//     if (isTabletView) {
//       // Force collapsed on tablet
//       setIsOpen(false);
//     } else if (width >= 1024 && !isMobileView) {
//       // For desktop, respect user preference or default to open
//       const savedState = localStorage.getItem("navbarState");
//       if (savedState === null && mounted) {
//         setIsOpen(true);
//       }
//     }
//   }, [mounted]);

//   // Initial setup
//   useEffect(() => {
//     setMounted(true);
    
//     // Apply saved state only if not in tablet mode
//     const savedState = localStorage.getItem("navbarState");
//     if (savedState !== null) {
//       const width = window.innerWidth;
//       if (!(width >= 768 && width < 1024)) {
//         setIsOpen(JSON.parse(savedState));
//       }
//     }
    
//     handleResize();
    
//     // Set up event listeners
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [handleResize]);

//   // Persist navbar state
//   useEffect(() => {
//     if (mounted && !isTablet) {
//       localStorage.setItem("navbarState", JSON.stringify(isOpen));
//     }
//   }, [isOpen, mounted, isTablet]);

//   // Route change handler
//   useEffect(() => {
//     const handleRouteChange = () => {
//       if (isMobile || isTablet) {
//         setIsOpen(false);
//       }
//     };

//     router.events.on("routeChangeComplete", handleRouteChange);
//     return () => router.events.off("routeChangeComplete", handleRouteChange);
//   }, [isMobile, isTablet, router]);

//   // Map click handler
//   useEffect(() => {
//     const handleMapClick = (event) => {
//       const mapElement = document.getElementById("map");
//       if (mapElement?.contains(event.target) && !isMobile) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("click", handleMapClick);
//     return () => document.removeEventListener("click", handleMapClick);
//   }, [isMobile]);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const navItems = [
//     { path: "/", icon: Home, label: "Home" },
//     { path: "/search", icon: Search, label: "Search" },
//     { path: "/profile", icon: User, label: "Profile" },
//     { path: "/notifications", icon: Bell, label: "Notifications" },
//     { path: "/settings", icon: Settings, label: "Settings" },
//   ];

//   const isActivePath = (path) => router.pathname === path;

//   if (!mounted) return null;

//   return (
//     <>
//       {/* Desktop/Tablet Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out z-[1000]
//           ${isMobile ? 'hidden' : 'block'} 
//           ${isOpen ? 'w-64' : 'w-16'}`}
//         style={{
//           backgroundColor: "#111827",
//           boxShadow: "2px 0 5px rgba(0, 0, 0, 0.3)",
//         }}
//         aria-label="Main navigation"
//         role="navigation"
//       >
// <div className="flex items-center justify-between p-4 border-b border-gray-700">
//   {isTablet ? (
//     // Show a "G" logo for tablet mode
//     <span className="text-2xl font-bold text-white">G</span>
//   ) : (
//     // For other modes, show the title when expanded
//     <span
//       className={`text-2xl font-bold text-white transition-opacity duration-300 ${
//         isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
//       }`}
//     >
//       Gleamp
//     </span>
//   )}
  
//   {/* Only show toggle button in non-tablet mode */}
//   {!isTablet && (
//     <button
//       onClick={toggleSidebar}
//       className="text-white focus:outline-none hover:bg-gray-700 p-1 rounded transition-colors duration-200 active:scale-95"
//       aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
//       aria-expanded={isOpen}
//     >
//       {isOpen ? <X size={24} /> : <Menu size={24} />}
//     </button>
//   )}
// </div>

//         <nav className="mt-4 space-y-1">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const active = isActivePath(item.path);
//             return (
//               <Link
//                 key={item.path}
//                 href={item.path}
//                 className={`flex items-center px-4 py-3 text-white relative group transition-all duration-200
//                 hover:bg-gray-800/50 active:bg-gray-700 active:scale-[0.98] 
//                 ${active ? "bg-gray-800/30" : ""}`}
//                 aria-current={active ? "page" : undefined}
//               >
//                 <div className="w-8 h-8 flex items-center justify-center">
//                   <Icon
//                     className={`transition-transform duration-200 group-hover:scale-110
//                     ${active ? "text-white" : "text-gray-400"}`}
//                     size={20}
//                     aria-hidden="true"
//                   />
//                 </div>
//                 {isOpen && (
//                   <span
//                     className={`ml-2 transition-all duration-200
//                   ${active ? "text-white font-bold" : "text-gray-400 font-normal"}
//                   group-hover:text-white`}
//                   >
//                     {item.label}
//                   </span>
//                 )}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Mobile Navigation Bar */}
//       <div
//         className={`fixed bottom-0 left-0 w-full h-16 z-[1005] 
//         ${!isMobile ? 'hidden' : 'flex'} 
//         justify-around items-center bg-gray-900 shadow-lg`}
//         role="navigation"
//         aria-label="Mobile navigation"
//       >
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           const active = isActivePath(item.path);
//           return (
//             <Link
//               key={item.path}
//               href={item.path}
//               className="flex flex-col items-center justify-center w-full h-full transition-transform active:scale-95"
//               aria-current={active ? "page" : undefined}
//             >
//               <div className="w-8 h-8 flex items-center justify-center">
//                 <Icon
//                   size={24}
//                   className={`transition-transform duration-200 hover:scale-110
//                   ${active ? "text-white" : "text-gray-400"}`}
//                   aria-hidden="true"
//                 />
//               </div>
//               <span
//                 className={`text-xs mt-1 transition-all duration-200
//               ${active ? "text-white font-bold" : "text-gray-400 font-normal"}`}
//               >
//                 {item.label.split(" ")[0]}
//               </span>
//             </Link>
//           );
//         })}
//       </div>
//     </>
//   );
// };

// export default Navbar;



// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { Home, Search, User, Bell, Settings, Menu, X } from "lucide-react";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [viewportSize, setViewportSize] = useState({
//     isMobile: false,
//     isTablet: false,
//     isLargeTablet: false
//   });
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();
//   const { isMobile, isTablet, isLargeTablet } = viewportSize;

//   // More precise viewport detection for iPad models
//   const handleResize = useCallback(() => {
//     const width = window.innerWidth;
    
//     // More precise breakpoints for different device types
//     const isMobileView = width < 768;
    
//     // Split tablet range to handle different iPad models properly
//     // Standard iPad/iPad Air (768-834px) and iPad Pro (1024px)
//     const isStandardTablet = width >= 768 && width < 1000;
//     const isLargeTabletView = width >= 1000 && width < 1200;
//     const isAnyTablet = isStandardTablet || isLargeTabletView;

//     setViewportSize({
//       isMobile: isMobileView,
//       isTablet: isAnyTablet,
//       isLargeTablet: isLargeTabletView
//     });

//     // For ANY tablet size, force the navbar to collapsed state (no toggle)
//     if (isAnyTablet) {
//       setIsOpen(false);
//     } 
//     // Desktop mode - use saved preference or default to open
//     else if (width >= 1200 && mounted) {
//       const savedState = localStorage.getItem("navbarState");
//       if (savedState === null) {
//         setIsOpen(true);
//       }
//     }
//   }, [mounted]);

//   // Initial setup
//   useEffect(() => {
//     setMounted(true);
    
//     if (typeof window !== 'undefined') {
//       const width = window.innerWidth;
      
//       // Define tablet ranges that cover all iPad models
//       const isAnyTablet = (width >= 768 && width < 1200);
      
//       // For tablets, always force collapsed state with no toggle
//       if (isAnyTablet) {
//         setIsOpen(false);
//       } else {
//         // For desktop, check saved state
//         const savedState = localStorage.getItem("navbarState");
//         if (savedState !== null) {
//           setIsOpen(JSON.parse(savedState));
//         } else {
//           // Default to open for desktop
//           setIsOpen(width >= 1200);
//         }
//       }
      
//       // Initial viewport detection
//       handleResize();
      
//       // Set up event listeners
//       window.addEventListener("resize", handleResize);
//       return () => window.removeEventListener("resize", handleResize);
//     }
//   }, [handleResize]);

//   // Persist navbar state - only for desktop
//   useEffect(() => {
//     if (mounted && !isTablet && !isLargeTablet && typeof window !== 'undefined') {
//       localStorage.setItem("navbarState", JSON.stringify(isOpen));
//     }
//   }, [isOpen, mounted, isTablet, isLargeTablet]);

//   // Route change handler
//   useEffect(() => {
//     const handleRouteChange = () => {
//       if (isMobile || isTablet || isLargeTablet) {
//         setIsOpen(false);
//       }
//     };

//     router.events.on("routeChangeComplete", handleRouteChange);
//     return () => router.events.off("routeChangeComplete", handleRouteChange);
//   }, [isMobile, isTablet, isLargeTablet, router]);

//   // Map click handler
//   useEffect(() => {
//     const handleMapClick = (event) => {
//       const mapElement = document.getElementById("map");
//       if (mapElement?.contains(event.target) && !isMobile) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("click", handleMapClick);
//     return () => document.removeEventListener("click", handleMapClick);
//   }, [isMobile]);

//   const toggleSidebar = () => {
//     // Only allow toggle in desktop mode
//     if (!isTablet && !isLargeTablet) {
//       setIsOpen(!isOpen);
//     }
//   };

//   const navItems = [
//     { path: "/", icon: Home, label: "Home" },
//     { path: "/search", icon: Search, label: "Search" },
//     { path: "/profile", icon: User, label: "Profile" },
//     { path: "/notifications", icon: Bell, label: "Notifications" },
//     { path: "/settings", icon: Settings, label: "Settings" },
//   ];

//   const isActivePath = (path) => router.pathname === path;

//   if (!mounted) return null;

//   return (
//     <>
//       {/* Desktop/Tablet Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out z-[1000]
//           ${isMobile ? 'hidden' : 'block'} 
//           ${isOpen ? 'w-64' : 'w-16'}`}
//         style={{
//           backgroundColor: "#111827",
//           boxShadow: "2px 0 5px rgba(0, 0, 0, 0.3)",
//         }}
//         aria-label="Main navigation"
//         role="navigation"
//       >
//         <div className="flex items-center justify-between p-4 border-b border-gray-700">
//           {/* For ALL tablet modes (both standard and large iPads), just show "G" */}
//           {isTablet || isLargeTablet ? (
//             <span className="text-2xl font-bold text-white">G</span>
//           ) : (
//             // Only for desktop: show title or "G" based on open state
//             <>
//               {isOpen ? (
//                 <span className="text-2xl font-bold text-white">
//                   Gleamp
//                 </span>
//               ) : (
//                 <span className="text-2xl font-bold text-white">G</span>
//               )}
//             </>
//           )}
          
//           {/* ONLY show toggle button in desktop mode - NEVER for tablets */}
//           {!isTablet && !isLargeTablet && (
//             <button
//               onClick={toggleSidebar}
//               className="text-white focus:outline-none hover:bg-gray-700 p-1 rounded transition-colors duration-200 active:scale-95"
//               aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
//               aria-expanded={isOpen}
//             >
//               {isOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           )}
//         </div>

//         <nav className="mt-4 space-y-1">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const active = isActivePath(item.path);
//             return (
//               <Link
//                 key={item.path}
//                 href={item.path}
//                 className={`flex items-center px-4 py-3 text-white relative group transition-all duration-200
//                 hover:bg-gray-800/50 active:bg-gray-700 active:scale-[0.98] 
//                 ${active ? "bg-gray-800/30" : ""}`}
//                 aria-current={active ? "page" : undefined}
//               >
//                 <div className="w-8 h-8 flex items-center justify-center">
//                   <Icon
//                     className={`transition-transform duration-200 group-hover:scale-110
//                     ${active ? "text-white" : "text-gray-400"}`}
//                     size={20}
//                     aria-hidden="true"
//                   />
//                 </div>
//                 {isOpen && (
//                   <span
//                     className={`ml-2 transition-all duration-200
//                   ${active ? "text-white font-bold" : "text-gray-400 font-normal"}
//                   group-hover:text-white`}
//                   >
//                     {item.label}
//                   </span>
//                 )}
//                 {/* Show tooltips on hover for tablet modes */}
//                 {(isTablet || isLargeTablet) && (
//                   <div className="absolute left-16 bg-gray-900 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
//                     {item.label}
//                   </div>
//                 )}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Mobile Navigation Bar */}
//       <div
//         className={`fixed bottom-0 left-0 w-full h-16 z-[1005] 
//         ${!isMobile ? 'hidden' : 'flex'} 
//         justify-around items-center bg-gray-900 shadow-lg shadow-top`}
//         role="navigation"
//         aria-label="Mobile navigation"
//       >
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           const active = isActivePath(item.path);
//           return (
//             <Link
//               key={item.path}
//               href={item.path}
//               className="flex flex-col items-center justify-center w-full h-full transition-transform active:scale-95"
//               aria-current={active ? "page" : undefined}
//             >
//               <div className="w-8 h-8 flex items-center justify-center">
//                 <Icon
//                   size={24}
//                   className={`transition-transform duration-200 hover:scale-110
//                   ${active ? "text-white" : "text-gray-400"}`}
//                   aria-hidden="true"
//                 />
//               </div>
//               <span
//                 className={`text-xs mt-1 transition-all duration-200
//               ${active ? "text-white font-bold" : "text-gray-400 font-normal"}`}
//               >
//                 {item.label.split(" ")[0]}
//               </span>
//             </Link>
//           );
//         })}
//       </div>
//     </>
//   );
// };

// export default Navbar;



// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { Home, Search, User, Bell, Settings, Menu, X } from "lucide-react";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [viewportSize, setViewportSize] = useState({
//     isMobile: false,
//     isTablet: false,
//     isLargeTablet: false
//   });
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();
//   const { isMobile, isTablet, isLargeTablet } = viewportSize;

//   // More precise viewport detection for different device types
//   const handleResize = useCallback(() => {
//     const width = window.innerWidth;
    
//     // Clear breakpoints
//     const isMobileView = width < 768;
//     const isStandardTablet = width >= 768 && width < 1000;
//     const isLargeTabletView = width >= 1000 && width < 1200;
//     const isAnyTablet = isStandardTablet || isLargeTabletView;
//     const isDesktop = width >= 1200;
    
//     // For debugging
//     console.log(`Width: ${width}, isMobile: ${isMobileView}, isTablet: ${isAnyTablet}, isDesktop: ${isDesktop}`);

//     setViewportSize({
//       isMobile: isMobileView,
//       isTablet: isAnyTablet,
//       isLargeTablet: isLargeTabletView
//     });

//     // For desktop mode, use saved preference or default to open
//     if (isDesktop && mounted) {
//       const savedState = localStorage.getItem("navbarState");
//       if (savedState === null) {
//         setIsOpen(true);
//       } else {
//         setIsOpen(JSON.parse(savedState));
//       }
//     }
//     // For tablets, always collapse with no toggle
//     else if (isAnyTablet) {
//       setIsOpen(false);
//     }
//   }, [mounted]);

//   // Initial setup
//   useEffect(() => {
//     setMounted(true);
    
//     if (typeof window !== 'undefined') {
//       const width = window.innerWidth;
      
//       // Define desktop vs tablet/mobile breakpoints
//       const isDesktop = width >= 1200;
//       const isAnyTablet = (width >= 768 && width < 1200);
      
//       // For tablets, always force collapsed state with no toggle
//       if (isAnyTablet) {
//         setIsOpen(false);
//       } else if (isDesktop) {
//         // For desktop, check saved state
//         const savedState = localStorage.getItem("navbarState");
//         if (savedState !== null) {
//           setIsOpen(JSON.parse(savedState));
//         } else {
//           // Default to open for desktop
//           setIsOpen(true);
//         }
//       } else {
//         // For mobile, default to closed
//         setIsOpen(false);
//       }
      
//       // Initial viewport detection
//       handleResize();
      
//       // Set up event listeners
//       window.addEventListener("resize", handleResize);
//       return () => window.removeEventListener("resize", handleResize);
//     }
//   }, [handleResize]);

//   // Persist navbar state - only for desktop
//   useEffect(() => {
//     if (mounted && !isTablet && !isLargeTablet && !isMobile && typeof window !== 'undefined') {
//       localStorage.setItem("navbarState", JSON.stringify(isOpen));
//     }
//   }, [isOpen, mounted, isTablet, isLargeTablet, isMobile]);

//   // Route change handler
//   useEffect(() => {
//     const handleRouteChange = () => {
//       if (isMobile || isTablet || isLargeTablet) {
//         setIsOpen(false);
//       }
//     };

//     router.events.on("routeChangeComplete", handleRouteChange);
//     return () => router.events.off("routeChangeComplete", handleRouteChange);
//   }, [isMobile, isTablet, isLargeTablet, router]);

//   // Map click handler
//   useEffect(() => {
//     const handleMapClick = (event) => {
//       const mapElement = document.getElementById("map");
//       if (mapElement?.contains(event.target) && !isMobile) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("click", handleMapClick);
//     return () => document.removeEventListener("click", handleMapClick);
//   }, [isMobile]);

//   const toggleSidebar = () => {
//     // Only allow toggle in desktop mode
//     if (!isTablet && !isLargeTablet && !isMobile) {
//       setIsOpen(!isOpen);
//     }
//   };

//   const navItems = [
//     { path: "/", icon: Home, label: "Home" },
//     { path: "/search", icon: Search, label: "Search" },
//     { path: "/profile", icon: User, label: "Profile" },
//     { path: "/notifications", icon: Bell, label: "Notifications" },
//     { path: "/settings", icon: Settings, label: "Settings" },
//   ];

//   const isActivePath = (path) => router.pathname === path;

//   if (!mounted) return null;

//   return (
//     <>
//       {/* Debug overlay - remove in production */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="fixed top-0 right-0 bg-black text-white p-2 z-[9999] text-xs">
//           Width: {typeof window !== 'undefined' ? window.innerWidth : 'SSR'} | 
//           {isMobile ? 'Mobile' : isTablet ? 'Tablet' : isLargeTablet ? 'Large Tablet' : 'Desktop'} | 
//           Nav: {isOpen ? 'Open' : 'Closed'}
//         </div>
//       )}

//       {/* Desktop/Tablet Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out z-[1000]
//           ${isMobile ? 'hidden' : 'block'} 
//           ${isOpen ? 'w-64' : 'w-16'}`}
//         style={{
//           backgroundColor: "#111827",
//           boxShadow: "2px 0 5px rgba(0, 0, 0, 0.3)",
//         }}
//         aria-label="Main navigation"
//         role="navigation"
//       >
//         <div className="flex items-center justify-between p-4 border-b border-gray-700">
//           {/* Logo/Title based on sidebar state */}
//           {isOpen ? (
//             <span className="text-2xl font-bold text-white">Gleamp</span>
//           ) : (
//             <span className="text-2xl font-bold text-white">G</span>
//           )}
          
//           {/* Only show toggle in desktop mode - never for tablets */}
//           {!isTablet && !isLargeTablet && !isMobile && (
//             <button
//               onClick={toggleSidebar}
//               className="text-white focus:outline-none hover:bg-gray-700 p-1 rounded transition-colors duration-200 active:scale-95"
//               aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
//               aria-expanded={isOpen}
//             >
//               {isOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           )}
//         </div>

//         <nav className="mt-4 space-y-1">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const active = isActivePath(item.path);
//             return (
//               <Link
//                 key={item.path}
//                 href={item.path}
//                 className={`flex items-center px-4 py-3 text-white relative group transition-all duration-200
//                 hover:bg-gray-800/50 active:bg-gray-700 active:scale-[0.98] 
//                 ${active ? "bg-gray-800/30" : ""}`}
//                 aria-current={active ? "page" : undefined}
//               >
//                 <div className="w-8 h-8 flex items-center justify-center">
//                   <Icon
//                     className={`transition-transform duration-200 group-hover:scale-110
//                     ${active ? "text-white" : "text-gray-400"}`}
//                     size={20}
//                     aria-hidden="true"
//                   />
//                 </div>
//                 {isOpen && (
//                   <span
//                     className={`ml-2 transition-all duration-200
//                   ${active ? "text-white font-bold" : "text-gray-400 font-normal"}
//                   group-hover:text-white`}
//                   >
//                     {item.label}
//                   </span>
//                 )}
//                 {/* Show tooltips on hover for collapsed state */}
//                 {!isOpen && (
//                   <div className="absolute left-16 bg-gray-900 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
//                     {item.label}
//                   </div>
//                 )}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Mobile Navigation Bar */}
//       <div
//         className={`fixed bottom-0 left-0 w-full h-16 z-[1005] 
//         ${!isMobile ? 'hidden' : 'flex'} 
//         justify-around items-center bg-gray-900 shadow-lg shadow-top`}
//         role="navigation"
//         aria-label="Mobile navigation"
//       >
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           const active = isActivePath(item.path);
//           return (
//             <Link
//               key={item.path}
//               href={item.path}
//               className="flex flex-col items-center justify-center w-full h-full transition-transform active:scale-95"
//               aria-current={active ? "page" : undefined}
//             >
//               <div className="w-8 h-8 flex items-center justify-center">
//                 <Icon
//                   size={24}
//                   className={`transition-transform duration-200 hover:scale-110
//                   ${active ? "text-white" : "text-gray-400"}`}
//                   aria-hidden="true"
//                 />
//               </div>
//               <span
//                 className={`text-xs mt-1 transition-all duration-200
//               ${active ? "text-white font-bold" : "text-gray-400 font-normal"}`}
//               >
//                 {item.label.split(" ")[0]}
//               </span>
//             </Link>
//           );
//         })}
//       </div>
//     </>
//   );
// };

// export default Navbar;



import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Search, User, Bell, Settings } from "lucide-react";

const Navbar = () => {
  const [viewportSize, setViewportSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isMobile, isTablet, isDesktop } = viewportSize;

  // Viewport detection for different device types
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    
    // Clear breakpoints
    const isMobileView = width < 768;
    const isTabletView = width >= 768 && width < 1200;
    const isDesktopView = width >= 1200;
    
    // For debugging
    console.log(`Width: ${width}, isMobile: ${isMobileView}, isTablet: ${isTabletView}, isDesktop: ${isDesktopView}`);

    setViewportSize({
      isMobile: isMobileView,
      isTablet: isTabletView,
      isDesktop: isDesktopView
    });
  }, []);

  // Initial setup
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      // Initial viewport detection
      handleResize();
      
      // Set up event listeners
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [handleResize]);

  // Route change handler - only for mobile
  useEffect(() => {
    const handleRouteChange = () => {
      // No behavior needed since we don't have collapsible sidebar anymore
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router]);

  // Map click handler - no longer needed for toggling
  useEffect(() => {
    const handleMapClick = (event) => {
      // No behavior needed since sidebar is always expanded on desktop
    };

    document.addEventListener("click", handleMapClick);
    return () => document.removeEventListener("click", handleMapClick);
  }, []);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const isActivePath = (path) => router.pathname === path;

  if (!mounted) return null;

  return (
    <>
      {/* Debug overlay - remove in production
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 right-0 bg-black text-white p-2 z-[9999] text-xs">
          Width: {typeof window !== 'undefined' ? window.innerWidth : 'SSR'} | 
          {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
        </div>
      )} */}

      {/* Desktop/Tablet Sidebar - always expanded on desktop */}
      <div
        className={`fixed top-0 left-0 h-full z-[1000]
          ${isMobile ? 'hidden' : 'block'} 
          ${isDesktop ? 'w-48' : 'w-12'}`}
        style={{
          backgroundColor: "#111827",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.3)",
        }}
        aria-label="Main navigation"
        role="navigation"
      >
        <div className="flex items-center p-4 border-b border-gray-700">
          {/* Logo/Title based on viewport */}
          {isDesktop ? (
            <span className="text-2xl font-bold text-white">Gleamp</span>
          ) : (
            <span className="text-2xl font-bold text-white">G</span>
          )}
        </div>

        <nav className="mt-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 text-white relative group transition-all duration-200
                hover:bg-gray-800/50 active:bg-gray-700 active:scale-[0.98] 
                ${active ? "bg-gray-800/30" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <Icon
                    className={`transition-transform duration-200 group-hover:scale-110
                    ${active ? "text-white" : "text-gray-400"}`}
                    size={20}
                    aria-hidden="true"
                  />
                </div>
                {isDesktop && (
                  <span
                    className={`ml-2 transition-all duration-200
                  ${active ? "text-white font-bold" : "text-gray-400 font-normal"}
                  group-hover:text-white`}
                  >
                    {item.label}
                  </span>
                )}
                {/* Show tooltips only in tablet mode */}
                {isTablet && (
                  <div className="absolute left-16 bg-gray-900 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation Bar */}
      <div
        className={`fixed bottom-0 left-0 w-full h-16 z-[1005] 
        ${!isMobile ? 'hidden' : 'flex'} 
        justify-around items-center bg-gray-900 shadow-lg shadow-top`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center w-full h-full transition-transform active:scale-95"
              aria-current={active ? "page" : undefined}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <Icon
                  size={24}
                  className={`transition-transform duration-200 hover:scale-110
                  ${active ? "text-white" : "text-gray-400"}`}
                  aria-hidden="true"
                />
              </div>
              <span
                className={`text-xs mt-1 transition-all duration-200
              ${active ? "text-white font-bold" : "text-gray-400 font-normal"}`}
              >
                {item.label.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;