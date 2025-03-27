import { useState, useEffect } from 'react';
import { convertToAlpha3 } from '../config/aplhacode';

const useLocationManager = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCountryFilterOpen, setIsCountryFilterOpen] = useState(false);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [isLocationDetecting, setIsLocationDetecting] = useState(true);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [manuallySelectedCountry, setManuallySelectedCountry] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({
    locationStatus: 'Not started',
    detectedCountry: null,
    storedCountry: null,
    locationEnabled: false,
    apiErrors: [],
    countriesStatus: 'Not started'
  });

  // Fetch available countries list
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setDebugInfo(prev => ({...prev, countriesStatus: 'Fetching...'}));
        const response = await fetch('/api/countries');
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch countries (${response.status}): ${errorText}`);
        }
        
        const data = await response.json();
        setDebugInfo(prev => ({...prev, countriesStatus: 'Received', countriesCount: data.length}));
        
        // Server-side duplicate removal
        const uniqueCountries = Array.from(new Map(data.map(c => [c.code, c])).values());
        setCountries(uniqueCountries.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error('Country fetch error:', err);
        setError('Failed to load countries');
        setDebugInfo(prev => ({
          ...prev, 
          countriesStatus: 'Error', 
          apiErrors: [...prev.apiErrors, err.message]
        }));
      }
    };
    fetchCountries();
  }, []);

  // Function to detect user location via API
  const detectLocation = async () => {
    try {
      setIsLocationDetecting(true);
      setDebugInfo(prev => ({...prev, locationStatus: 'Detecting...'}));
      
      console.log('Fetching location from ipinfo.io...');
      const response = await fetch('https://ipinfo.io/json?token=ede546adc24e41');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch location (${response.status}): ${errorText}`);
      }
      
      const locationData = await response.json();
      console.log('Location data received:', locationData);
      setDebugInfo(prev => ({
        ...prev, 
        locationStatus: 'Data received', 
        locationData: JSON.stringify(locationData)
      }));
      
      const countryCode = locationData.country;
      
      if (countryCode) {
        // Convert alpha-2 to alpha-3 country code using the imported function
        const alpha3CountryCode = convertToAlpha3(countryCode);
        console.log('Detected country:', countryCode, '→', alpha3CountryCode);
        setDebugInfo(prev => ({
          ...prev, 
          detectedCountry: countryCode,
          convertedCountry: alpha3CountryCode
        }));
        
        setSelectedCountry(alpha3CountryCode);
        
        // Store detected country in localStorage
        localStorage.setItem('detectedCountry', alpha3CountryCode);
        localStorage.setItem('userCountry', alpha3CountryCode);
        
        return alpha3CountryCode;
      } else {
        throw new Error('No country code in response');
      }
    } catch (err) {
      console.error('Location detection error:', err);
      setDebugInfo(prev => ({
        ...prev, 
        locationStatus: 'Error', 
        apiErrors: [...prev.apiErrors, err.message]
      }));
      throw err;
    } finally {
      setIsLocationDetecting(false);
    }
  };

  // Detect user location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsLocationDetecting(true);
        setDebugInfo(prev => ({...prev, locationStatus: 'Initializing...'}));
        
        // Check for stored location preference - always true on initial load to ensure detection
        // This ensures auto-detection is always attempted on page load/server restart
        const storedLocationEnabled = localStorage.getItem('locationEnabled');
        const isFirstLoad = storedLocationEnabled === null;
        
        // If it's the first load or locationEnabled was previously true, enable location
        const shouldEnableLocation = isFirstLoad || storedLocationEnabled === 'true';
        
        // Always try auto-detection first on page load/server restart
        if (isFirstLoad) {
          localStorage.setItem('locationEnabled', 'true');
        }
        
        const storedDetectedCountry = localStorage.getItem('detectedCountry');
        const storedManualCountry = localStorage.getItem('manuallySelectedCountry');
        
        setDebugInfo(prev => ({
          ...prev, 
          storedDetectedCountry,
          storedManualCountry,
          locationEnabled: shouldEnableLocation,
          isFirstLoad
        }));
        
        // Update location enabled state
        setIsLocationEnabled(shouldEnableLocation);
        
        // Set the manually selected country from storage if available
        if (storedManualCountry) {
          setManuallySelectedCountry(storedManualCountry);
        }
        
        let countryToUse = '';
        
        // If location should be enabled, we should always try to detect it on page load/server restart
        if (shouldEnableLocation) {
          try {
            // Always try to get a fresh location on page load/server restart
            countryToUse = await detectLocation();
          } catch (err) {
            console.error('Auto-detection failed on page load:', err);
            // If detection fails, use previously detected country if available
            countryToUse = storedDetectedCountry || '';
            
            // Only use manually selected country as fallback if location is disabled
            if (!shouldEnableLocation && storedManualCountry) {
              countryToUse = storedManualCountry;
            }
            
            if (countryToUse) {
              setSelectedCountry(countryToUse);
            } else {
              // If no country is selected and auto-detection failed, force country filter to open
              setIsCountryFilterOpen(true);
            }
          }
        } else {
          // Location is disabled, use manually selected country
          countryToUse = storedManualCountry || '';
          setSelectedCountry(countryToUse);
          
          // If location is disabled and no country is selected, force the country filter to open
          if (!countryToUse) {
            setIsCountryFilterOpen(true);
          }
        }
        
        setDebugInfo(prev => ({
          ...prev, 
          locationStatus: 'Completed', 
          finalCountry: countryToUse
        }));
      } catch (err) {
        console.error('Location initialization error:', err);
        setDebugInfo(prev => ({
          ...prev, 
          locationStatus: 'Error during initialization', 
          apiErrors: [...prev.apiErrors, err.message]
        }));
      } finally {
        setLocationLoaded(true);
        setIsLocationDetecting(false);
      }
    };

    initializeLocation();
  }, []);

  // Handle country selection (manual selection from UI)
  const handleCountrySelect = (countryCode) => {
    console.log('Country manually selected:', countryCode);
    setDebugInfo(prev => ({...prev, manualSelection: countryCode}));
    
    // Store as manually selected country
    setManuallySelectedCountry(countryCode);
    localStorage.setItem('manuallySelectedCountry', countryCode);
    
    // Update the current selection
    setSelectedCountry(countryCode);
    
    // When a country is manually selected, disable automatic location detection
    setIsLocationEnabled(false);
    localStorage.setItem('locationEnabled', 'false');
    setDebugInfo(prev => ({...prev, locationEnabled: false}));
    
    // Store user's manual selection in regular storage too
    localStorage.setItem('userCountry', countryCode);
  };

  // Handle location toggle
  const handleLocationToggle = async (enabled) => {
    console.log('Location toggle changed:', enabled);
    
    // Set the state immediately to reflect UI change
    setIsLocationEnabled(enabled);
    setDebugInfo(prev => ({...prev, locationEnabled: enabled}));
    
    // Store preference
    localStorage.setItem('locationEnabled', enabled.toString());
    
    if (enabled) {
      // Location enabled: always get a fresh detection
      setIsLocationDetecting(true);
      try {
        const detectedCountry = await detectLocation();
        setSelectedCountry(detectedCountry);
      } catch (err) {
        console.error('Location re-detection error:', err);
        // If error, use previously detected country if available
        const storedDetectedCountry = localStorage.getItem('detectedCountry');
        if (storedDetectedCountry) {
          setSelectedCountry(storedDetectedCountry);
        } else {
          // Don't set a default country, leave as empty if no detection is available
          // and force country selection
          setSelectedCountry('');
          setIsCountryFilterOpen(true);
        }
      } finally {
        setIsLocationDetecting(false);
      }
    } else {
      // Location disabled: use manually selected country
      if (manuallySelectedCountry) {
        setSelectedCountry(manuallySelectedCountry);
        localStorage.setItem('userCountry', manuallySelectedCountry);
        console.log('Reverting to manually selected country:', manuallySelectedCountry);
      } else {
        // If no manually selected country when disabling location, keep the filter open
        // to force country selection
        setSelectedCountry('');
        localStorage.setItem('userCountry', '');
        // Don't close the filter until a country is selected
      }
    }
  };

  const openCountryFilter = () => setIsCountryFilterOpen(true);
  
  // Only allow closing the filter if a country is selected or location is enabled
  const closeCountryFilter = () => {
    if (selectedCountry || isLocationEnabled) {
      setIsCountryFilterOpen(false);
    }
  };

  return {
    selectedCountry,
    countries,
    isCountryFilterOpen,
    locationLoaded,
    isLocationDetecting,
    isLocationEnabled,
    error,
    debugInfo,
    handleCountrySelect,
    handleLocationToggle,
    openCountryFilter,
    closeCountryFilter
  };
};

export default useLocationManager;