import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';

const CountryFilter = ({ 
  onCountrySelect, 
  selectedCountry, 
  countryList, 
  onClose, 
  isOpen,
  isLocationEnabled,
  onLocationToggle
}) => {
  const [searchCountry, setSearchCountry] = useState('');
  const [showCountryList, setShowCountryList] = useState(false);
  const [localSelectedCountry, setLocalSelectedCountry] = useState(selectedCountry);
  const modalRef = useRef(null);

  // Reset search text when popup closes and update local state when selectedCountry changes
  useEffect(() => {
    if (!isOpen) {
      setSearchCountry('');
      setShowCountryList(false);
    }
    setLocalSelectedCountry(selectedCountry);
  }, [isOpen, selectedCountry]);

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleModalClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isLocationEnabled, localSelectedCountry]);

  // Strict filtering logic from the old code that only shows exact matches
  const filteredCountries = useMemo(() => {
    const searchTerm = searchCountry.trim().toLowerCase();
    
    if (!searchTerm) return countryList;

    const startsWithMatches = [];
    const wordStartMatches = [];

    countryList.forEach(country => {
      const countryName = country.name.toLowerCase();
      const words = countryName.split(' ');

      if (countryName.startsWith(searchTerm)) {
        startsWithMatches.push(country);
      } else if (words.some(word => word.startsWith(searchTerm))) {
        wordStartMatches.push(country);
      }
    });

    // If we have countries that start with the search term, only show those
    if (startsWithMatches.length > 0) {
      return startsWithMatches;
    }
    // Otherwise, show countries where any word starts with the search term
    return wordStartMatches;
  }, [searchCountry, countryList]);

  // Get current country name
  const getCurrentCountryName = () => {
    if (!localSelectedCountry) return "Not selected";
    const foundCountry = countryList.find(c => c.code === localSelectedCountry);
    return foundCountry ? foundCountry.name : localSelectedCountry;
  };

  const handleLocationCheckboxClick = () => {
    // Update the location enabled status directly
    const newLocationEnabledStatus = !isLocationEnabled;
    onLocationToggle(newLocationEnabledStatus);
    
    // If turning off location, go to country list
    if (!newLocationEnabledStatus) {
      setShowCountryList(true);
    }
  };

  const handleExploreLocationsClick = () => {
    setShowCountryList(true);
  };

  const handleBackToMainMenu = () => {
    setShowCountryList(false);
    setSearchCountry('');
  };

  // Main close handler with smart fallback behavior
  const handleModalClose = () => {
    // If location is disabled and no country selected, re-enable location
    if (!isLocationEnabled && !localSelectedCountry) {
      onLocationToggle(true); // Auto-enable location
    }
    
    // Now we can safely close the modal
    onClose();
  };

  const handleCloseButton = () => {
    handleModalClose();
  };

  const handleSelectCountry = (countryCode) => {
    setLocalSelectedCountry(countryCode);
    onCountrySelect(countryCode);
    
    // Go back to main menu after selecting country
    setShowCountryList(false);
  };

  const handleEscKey = (e) => {
    if (e.key === 'Escape') {
      // If in country list, go back to main view
      if (showCountryList) {
        setShowCountryList(false);
      } else {
        // Otherwise handle normal close
        handleModalClose();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, showCountryList]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div 
        ref={modalRef} 
        className="bg-black text-white rounded-lg w-full max-w-sm mx-4 border border-gray-700"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              {showCountryList ? (
                <button 
                  onClick={handleBackToMainMenu}
                  className="mr-2 text-white rounded-full hover:bg-gray-800 w-8 h-8 flex items-center justify-center"
                >
                  ←
                </button>
              ) : null}
              {showCountryList ? "Explore locations" : "Explore settings"}
            </h2>
            <button 
              onClick={handleCloseButton} 
              className="text-white hover:text-gray-300 text-2xl px-2"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {!showCountryList ? (
            <>
              <h3 className="text-lg font-bold mb-3">Location</h3>
              
              {/* Location toggle */}
              <div className="mb-5">
                <div 
                  className="flex items-center justify-between cursor-pointer py-2" 
                  onClick={handleLocationCheckboxClick}
                >
                  <div>
                    <span className="text-white">Show content in this location</span>
                    <p className="text-sm text-gray-400 mt-1">
                      When this is on, you'll see what's happening around you right now.
                    </p>
                  </div>
                  <div className="ml-4">
                    {isLocationEnabled ? (
                      <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border border-gray-500 rounded-sm"></div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Explore locations button */}
              <div 
                className="flex items-center justify-between py-3 cursor-pointer border-t border-gray-800"
                onClick={handleExploreLocationsClick}
              >
                <div>
                  <span className="text-white">Explore locations</span>
                  <p className={`text-sm mt-1 ${!localSelectedCountry && !isLocationEnabled ? "text-yellow-500" : "text-gray-400"}`}>
                    {getCurrentCountryName()}
                    {!localSelectedCountry && !isLocationEnabled && " (Recommended)"}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              {!isLocationEnabled && !localSelectedCountry && (
                <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 rounded-md text-sm text-yellow-200">
                  Tip: Select a country for personalized content, or location will be automatically enabled when you exit.
                </div>
              )}
            </>
          ) : (
            <>
              {/* Search input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 text-gray-200 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  autoFocus
                />
                {searchCountry && (
                  <button
                    onClick={() => setSearchCountry('')}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Country list */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCountries.map(country => (
                  <button
                    key={country.code}
                    className={`w-full text-left px-3 py-3 text-white hover:bg-gray-800 rounded flex justify-between items-center ${
                      localSelectedCountry === country.code ? 'bg-gray-800' : ''
                    }`}
                    onClick={() => handleSelectCountry(country.code)}
                  >
                    <span>{country.name}</span>
                    {localSelectedCountry === country.code && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </button>
                ))}
                
                {filteredCountries.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    No matching countries found
                  </div>
                )}
              </div>

              {!isLocationEnabled && (
                <div className="mt-4 p-3 bg-blue-900 bg-opacity-20 rounded-md text-sm text-blue-200 flex justify-between items-center">
                  <span>Choose a country for personalized content</span>
                  <button 
                    onClick={handleBackToMainMenu}
                    className="px-2 py-1 bg-blue-800 rounded text-white text-xs hover:bg-blue-700"
                  >
                    Skip
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryFilter;