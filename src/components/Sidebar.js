import { useEffect, useRef, useState } from "react";

const Sidebar = ({ selectedCountry, countryNews, onClose, isSidebarOpen, onNavbarCollapse }) => {
  const ignoreClickRef = useRef(true);
  const [expandedArticle, setExpandedArticle] = useState(null);
  
  // Notify parent to collapse navbar when sidebar opens
  useEffect(() => {
    if (isSidebarOpen && onNavbarCollapse) {
      onNavbarCollapse();
    }
  }, [isSidebarOpen, onNavbarCollapse]);

  useEffect(() => {
    ignoreClickRef.current = true;
    const timer = setTimeout(() => {
      ignoreClickRef.current = false;
    }, 300);

    const handleClickOutside = (event) => {
      if (ignoreClickRef.current) return;
      const sidebar = document.getElementById("locationSidebar");
      if (
        sidebar &&
        !sidebar.contains(event.target) &&
        !event.target.closest("#map")
      ) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarOpen, onClose]);

  useEffect(() => {
    const mapEl = document.getElementById("map");
    const handleWheel = (event) => {
      if (mapEl && mapEl.contains(event.target) && event.deltaY > 50) {
        onClose();
      }
    };

    if (mapEl) {
      mapEl.addEventListener("wheel", handleWheel);
    }
    return () => {
      if (mapEl) {
        mapEl.removeEventListener("wheel", handleWheel);
      }
    };
  }, [onClose]);

  // Collapse Navbar when a country is clicked
  useEffect(() => {
    if (selectedCountry && onNavbarCollapse) {
      onNavbarCollapse();
    }
  }, [selectedCountry, onNavbarCollapse]);

  // Filter duplicates based on title and show latest news first
  const filterDuplicates = (newsArray) => {
    const uniqueArticles = new Map();
    newsArray.forEach((news) => {
      const title = news.headline?.toLowerCase().trim();
      if (!title) return;
      if (!uniqueArticles.has(title)) {
        uniqueArticles.set(title, news);
      } else {
        const existingNews = uniqueArticles.get(title);
        if (new Date(news.publishedAt) > new Date(existingNews.publishedAt)) {
          uniqueArticles.set(title, news);
        }
      }
    });
    return Array.from(uniqueArticles.values());
  };

  // Filter and sort articles (latest first)
  const filteredNews = filterDuplicates(countryNews).sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  return (
    <div 
      id="locationSidebar" 
      className={`sidebar ${isSidebarOpen ? "active" : ""} p-3 bg-gray-900 text-white h-full overflow-y-auto w-[450px] shadow-lg transition-transform duration-300`}
      style={{
      //  zIndex: 9999 // Higher than SideMenu to overlay it
      }}
    >
      {/* Sticky Header: Country Name & Close Button */}
      <div className="sticky top-0 bg-black z-10 p-4 border-b flex justify-between items-center shadow-sm">
        <h2 className="font-semibold text-white-900 text-lg">{selectedCountry || "Select a Country"}</h2>
        <button id="closeSidebar" onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">
          ×
        </button>
      </div>
      
      <div className="mt-5">
        {filteredNews.length === 0 ? (
          <p className="text-red-400">No news available.</p>
        ) : (
          filteredNews.map((news, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 mb-4 shadow-md transition-all cursor-pointer"
              onClick={(e) => {
                // Prevent closing when clicking on links
                e.stopPropagation();
                setExpandedArticle(expandedArticle === index ? null : index);
              }}
            >
              {/* Source & Date */}
              <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                <span className="text-[10px] font-semibold">{news.source || "Unknown"}</span>
                <span className="text-[10px] font-semibold">{new Date(news.publishedAt).toLocaleString()}</span>
              </div>

              {/* Title & Image */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white leading-tight">{news.headline}</h3>
                </div>
                <img
                  src={news.imageUrl || "/default-image.jpg"}
                  alt="News"
                  className="w-[150px] h-[100px] object-cover rounded-lg"
                />
              </div>

              {/* Expandable Summary & Read More */}
              {expandedArticle === index && (
                <div className="mt-3">
                  <p className="text-gray-300 text-sm">{news.summary}</p>
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] font-semibold text-blue-400 block mt-2 text-right"
                    onClick={(e) => e.stopPropagation()} // Keep sidebar open
                  >
                    Read more →
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;