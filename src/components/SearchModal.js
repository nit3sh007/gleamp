import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

const SearchModal = ({ highlightCountry }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [countryNames, setCountryNames] = useState([]);
    const modalRef = useRef(null);
    const inputRef = useRef(null);

    // Fetch country list from GeoJSON
    useEffect(() => {
        fetch("/countries.geo.json")
            .then((response) => response.json())
            .then((data) => {
                if (data.features) {
                    const countryList = data.features.map((feature) => ({
                        id: feature.id, 
                        name: feature.properties.name
                    }));
                    setCountryNames(countryList);
                }
            })
            .catch((error) => console.error("Error loading country data:", error));
    }, []);

    // Handle search input with the strict filtering logic from the first component
    const handleSearchChange = (event) => {
        const value = event.target.value.trim().toLowerCase();
        setSearchValue(event.target.value);
        
        if (value === "") {
            setSuggestions([]);
            return;
        }
        
        // Apply the strict filtering logic from the first component
        const startsWithMatches = [];
        const wordStartMatches = [];
        
        countryNames.forEach(country => {
            const countryName = country.name.toLowerCase();
            const words = countryName.split(' ');
            
            if (countryName.startsWith(value)) {
                startsWithMatches.push(country);
            } else if (words.some(word => word.startsWith(value))) {
                wordStartMatches.push(country);
            }
        });
        
        // If we have countries that start with the search term, only show those
        // Otherwise, show countries where any word starts with the search term
        const sortedSuggestions = [...startsWithMatches, ...wordStartMatches];
        
        // Limit to 10 results
        setSuggestions(sortedSuggestions.slice(0, 10));
    };

    // Reset search when opening the modal
    const handleSearchButtonClick = () => {
        setIsOpen(true);
        setSearchValue("");
        setSuggestions([]);
        // Focus on input after modal opens
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    // Close modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen]);

    const clearSearch = () => {
        setSearchValue("");
        setSuggestions([]);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <>
            {/* Open Search Button */}
            <button 
                className="search-button bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full flex items-center gap-2"
                onClick={handleSearchButtonClick}
            >
                <Search size={18} />
                <span>Search Country</span>
            </button>

            {/* Search Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden"
                        ref={modalRef}
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold dark:text-white">Search Countries</h2>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    aria-label="Close"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            {/* Search input with icon */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    placeholder="Search for a country..."
                                />
                                {searchValue && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                            
                            {/* Suggestions list */}
                            <div className="max-h-80 overflow-y-auto">
                                {suggestions.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {suggestions.map((country) => (
                                            <li
                                                key={country.id}
                                                onClick={() => {
                                                    setSearchValue(country.name);
                                                    setIsOpen(false);
                                                    highlightCountry(country.name);
                                                }}
                                                className="px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200 transition-colors rounded"
                                            >
                                                {country.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    searchValue && (
                                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                            No matching countries found
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchModal;