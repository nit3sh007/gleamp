import React, { useState, useEffect } from 'react';
import CountryFilter from '@/pages/settings/locations';
import useLocationManager from '../config/locationManager';
import SearchHeader from '../components/SearchHeader';
import useFetchNews from '../config/useFetchNews';

const MobileNewsCard = ({ headline, source, publishedAt, category, url, imageUrl }) => {
  // Format time in a more compact way
  const formatTimeAgo = (dateString) => {
    const published = new Date(dateString);
    const now = new Date();
    const diffHours = Math.round((now - published) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffHours < 720) { // Less than 30 days
      return `${Math.round(diffHours / 24)}d`;
    } else {
      return published.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <div className="bg-black text-white border-b border-gray-800 p-3">
        <div className="flex space-x-3">
          <div className="flex-1">
            {/* Headline with reduced font size */}
            <h2 className="text-sm sm:text-base font-bold mb-1.5 line-clamp-2">{headline}</h2>
            
            {/* Compact metadata section */}
            <div className="flex items-center text-gray-400 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="truncate max-w-[100px]">{source || 'News'}</span>
                <span className="text-gray-600">•</span>
                <span>{formatTimeAgo(publishedAt)}</span>
                {category && category.toLowerCase() !== 'all' && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="truncate max-w-[80px]">{category}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Thumbnail image with slightly reduced size */}
          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={imageUrl || '/api/placeholder/80/80'} 
              alt="News thumbnail" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </a>
  );
};

// Top story card for desktop and mobile top stories section
const TopStoryCard = ({ title, time, category, url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:bg-gray-800 p-2 rounded-lg transition-colors block">
    <h3 className="text-xs sm:text-sm font-medium text-white line-clamp-2">{title}</h3>
    <p className="text-xs text-gray-400 mt-0.5">{time} • {category}</p>
  </a>
);

// Skeleton loader for news cards
const SkeletonLoader = () => (
  <div className="space-y-1 md:space-y-2">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-1">
          <div className="h-4 bg-gray-800 rounded w-3/4"></div>
          <div className="h-3 bg-gray-800 rounded w-1/2"></div>
        </div>
        <div className="w-24 h-24 bg-gray-800 rounded"></div>
      </div>
    ))}
  </div>
);

// Skeleton loader for top stories
const TopStoriesSkeleton = () => (
  <div className="space-y-1 pt-1">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="animate-pulse p-1">
        <div className="h-3 bg-gray-800 rounded w-full"></div>
        <div className="h-2 bg-gray-800 rounded w-1/2 mt-1"></div>
      </div>
    ))}
  </div>
);

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Use the location manager hook for country-related logic
  const locationManager = useLocationManager();
  
  const { news, filteredNews, loading, error } = useFetchNews(
    locationManager.selectedCountry,
    locationManager.locationLoaded,
    searchQuery,
    selectedCategory
  );
  
  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div className="flex flex-col w-full max-w-7xl mx-auto">
        {/* SearchHeader with categories and search */}
        <SearchHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedCountry={locationManager.selectedCountry}
          openCountryFilter={locationManager.openCountryFilter}
        />

        {/* Main content area */}
        <div className="pt-4">
          <div className="flex flex-col md:flex-row w-full relative">
            {/* First column - Left sidebar (hidden on mobile) */}
            <div className="hidden md:block md:w-1/4 bg-black border-r border-gray-800 sticky top-24 h-screen">
              <div className="p-4">
                {/* Left sidebar content - intentionally left blank */}
              </div>
            </div>
            
            {/* Center column - Main content */}
            <div className="w-full md:w-1/2 px-2 sm:px-4 py-1 sm:py-2">
              <div className="w-full max-w-xl mx-auto">
                {/* Page title reflecting selected category */}
                <h2 className="text-white text-xl font-bold px-4 pb-4 border-b-2 border-white inline-block mb-4">
                  {selectedCategory === 'All' ? "What's New Today" : `${selectedCategory} News`}
                </h2>
                
                {loading || !locationManager.locationLoaded ? (
                  <SkeletonLoader />
                ) : error ? (
                  <div className="text-red-400 text-center py-2 sm:py-4 bg-red-900 bg-opacity-30 rounded-lg">
                    <p className="font-medium text-xs sm:text-base">Error loading data</p>
                    <p className="text-xs mt-0.5">{error}</p>
                  </div>
                ) : (
                  <div className="w-full">
                    {filteredNews.length > 0 ? (
                      filteredNews.map(item => (
                        <MobileNewsCard
                          key={item._id}
                          headline={item.headline}
                          url={item.url}
                          imageUrl={item.imageUrl}
                          source={item.source}
                          publishedAt={item.publishedAt}
                          category={item.category}
                        />
                      ))
                    ) : (
                      <div className="text-center py-2 sm:py-4 bg-gray-900 rounded-lg">
                        <p className="text-gray-400 text-xs sm:text-base">No news articles found</p>
                        {searchQuery && (
                          <p className="text-gray-500 text-xs mt-1">Try modifying your search</p>
                        )}
                        {selectedCategory !== 'All' && (
                          <p className="text-gray-500 text-xs mt-1">No {selectedCategory} news available</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right column - Desktop Top stories (hidden on mobile) */}
            <div className="hidden md:block md:w-1/4 bg-black border-l border-gray-800 sticky top-24 h-screen">
              <div className="p-4">
                <h2 className="text-red-600 font-bold text-sm mb-2">TOP STORIES</h2>
                {loading || !locationManager.locationLoaded ? (
                  <TopStoriesSkeleton />
                ) : (
                  <div className="space-y-2 pt-2">
                    {filteredNews.slice(0, 4).map((item) => (
                      <TopStoryCard
                        key={item._id}
                        title={item.headline}
                        time={new Date(item.publishedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        category={item.category || 'News'}
                        url={item.url}   
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile-only top stories section */}
          <div className="md:hidden w-full bg-black border-t border-gray-800 mt-4 px-2 py-3">
            <h2 className="text-red-600 font-bold text-xs mb-2">TOP STORIES</h2>
            {loading || !locationManager.locationLoaded ? (
              <TopStoriesSkeleton />
            ) : (
              <div className="space-y-2 pt-1">
                {filteredNews.slice(0, 4).map((item) => (
                  <TopStoryCard
                    key={item._id}
                    title={item.headline}
                    time={new Date(item.publishedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    category={item.category || 'News'}
                    url={item.url}   
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Country Filter */}
      <CountryFilter 
        onCountrySelect={locationManager.handleCountrySelect}
        selectedCountry={locationManager.selectedCountry}
        countryList={locationManager.countries}
        isOpen={locationManager.isCountryFilterOpen}
        onClose={locationManager.closeCountryFilter}
        isLocationEnabled={locationManager.isLocationEnabled}
        onLocationToggle={locationManager.handleLocationToggle}
      />
    </div>
  );
};

export default SearchPage;