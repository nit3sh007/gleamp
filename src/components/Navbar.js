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