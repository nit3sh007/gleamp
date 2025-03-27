// import { useState, useEffect, useMemo } from 'react';

// /**
//  * Custom hook to fetch and filter news based on country, search query, and category
//  * @param {string} selectedCountry - The country code to fetch news for
//  * @param {boolean} locationLoaded - Whether the location detection is complete
//  * @param {string} searchQuery - The current search query
//  * @param {string} selectedCategory - The currently selected category filter
//  * @returns {Object} - News data, loading state, and error information
//  */
// const useFetchNews = (
//   selectedCountry,
//   locationLoaded,
//   searchQuery = '',
//   selectedCategory = 'All'
// ) => {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch news when location is loaded and we have a selected country
//   useEffect(() => {
//     const fetchNews = async () => {
//       // Don't fetch until location detection is complete
//       if (!locationLoaded) {
//         console.log('Waiting for location detection to complete...');
//         return;
//       }
      
//       // Ensure we have a country code
//       if (!selectedCountry) {
//         console.log('No country selected, skipping fetch');
//         setLoading(false);
//         return;
//       }
      
//       try {
//         setLoading(true);
//         console.log('Fetching news for country:', selectedCountry);
        
//         const response = await fetch(`/api/news?country=${encodeURIComponent(selectedCountry)}`);
        
//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch news (${response.status}): ${errorText}`);
//         }
        
//         const data = await response.json();
//         console.log(`Received ${data.length} news items`);
        
//         setNews(data);
//         setError(null);
//       } catch (err) {
//         console.error('News fetch error:', err);
//         setError('Failed to load news');
//         setNews([]);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchNews();
//   }, [selectedCountry, locationLoaded]);

//   // Filter news based on search query
//   const filteredNews = useMemo(() => {
//     const query = searchQuery.toLowerCase();
//     if (!query) return news;

//     return news.filter(item => (
//       item.headline?.toLowerCase().includes(query) ||
//       item.summary?.toLowerCase().includes(query) ||
//       item.source?.toLowerCase().includes(query)
//     ));
//   }, [news, searchQuery]);

//   // Filter news by selected category
//   const categoryFilteredNews = useMemo(() => {
//     if (selectedCategory === 'All') return filteredNews;
    
//     return filteredNews.filter(item => 
//       item.category?.toLowerCase() === selectedCategory.toLowerCase()
//     );
//   }, [filteredNews, selectedCategory]);

//   return {
//     news,
//     filteredNews,
//     categoryFilteredNews,
//     loading,
//     error
//   };
// };

// export default useFetchNews;

// import { useState, useEffect, useMemo } from 'react';

// /**
//  * Custom hook to fetch and filter news based on country, search query, and category
//  * @param {string} selectedCountry - The country code to fetch news for
//  * @param {boolean} locationLoaded - Whether the location detection is complete
//  * @param {string} searchQuery - The current search query
//  * @param {string} selectedCategory - The currently selected category filter
//  * @returns {Object} - News data, loading state, and error information
//  */
// const useFetchNews = (
//   selectedCountry,
//   locationLoaded,
//   searchQuery = '',
//   selectedCategory = 'All'
// ) => {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch news when location is loaded and we have a selected country
//   useEffect(() => {
//     const fetchNews = async () => {
//       // Don't fetch until location detection is complete
//       if (!locationLoaded) {
//         console.log('Waiting for location detection to complete...');
//         return;
//       }
      
//       // Ensure we have a country code
//       if (!selectedCountry) {
//         console.log('No country selected, skipping fetch');
//         setLoading(false);
//         return;
//       }
      
//       try {
//         setLoading(true);
//         console.log(`Fetching news for country: ${selectedCountry}, category: ${selectedCategory}`);
        
//         // Build the API URL with query parameters
//         const url = new URL('/api/news', window.location.origin);
//         url.searchParams.append('country', selectedCountry);
//         if (selectedCategory !== 'All') {
//           url.searchParams.append('category', selectedCategory);
//         }
        
//         const response = await fetch(url.toString());
        
//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch news (${response.status}): ${errorText}`);
//         }
        
//         const data = await response.json();
//         console.log(`Received ${data.length} news items`);
        
//         setNews(data);
//         setError(null);
//       } catch (err) {
//         console.error('News fetch error:', err);
//         setError('Failed to load news');
//         setNews([]);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchNews();
//   }, [selectedCountry, selectedCategory, locationLoaded]);

//   // Filter news based on search query
//   const filteredNews = useMemo(() => {
//     const query = searchQuery.toLowerCase();
//     if (!query) return news;

//     return news.filter(item => (
//       item.headline?.toLowerCase().includes(query) ||
//       item.summary?.toLowerCase().includes(query) ||
//       item.source?.toLowerCase().includes(query)
//     ));
//   }, [news, searchQuery]);

//   return {
//     news,
//     filteredNews,
//     loading,
//     error
//   };
// };

// export default useFetchNews;


// import { useState, useEffect, useMemo } from 'react';
 
// const useFetchNews = (
//   selectedCountry,
//   locationLoaded,
//   searchQuery = '',
//   selectedCategory = 'All'
// ) => {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
 
//   useEffect(() => {
//     const fetchNews = async () => {
//       console.log('🌐 Fetch News Trigger:');
//       console.log('Location Loaded:', locationLoaded);
//       console.log('Selected Country:', selectedCountry);
//       console.log('Selected Category:', selectedCategory);

//       if (!locationLoaded) {
//         console.warn('⏳ Waiting for location detection...');
//         setLoading(false);
//         return;
//       }
     
//       if (!selectedCountry) {
//         console.warn('❌ No country selected');
//         setLoading(false);
//         return;
//       }
     
//       try {
//         setLoading(true);
       
//         const url = new URL('/api/news', window.location.origin);
//         url.searchParams.append('country', selectedCountry);
        
//         if (selectedCategory && selectedCategory !== 'All') {
//           url.searchParams.append('category', selectedCategory);
//         }
       
//         console.log('🔗 Fetching URL:', url.toString());
       
//         const response = await fetch(url.toString());
       
//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error('❌ Fetch Error:', errorText);
//           throw new Error(`Failed to fetch news (${response.status}): ${errorText}`);
//         }
       
//         const data = await response.json();
        
//         console.log('📰 Received News:', data.length, 'articles');
        
//         setNews(data);
//         setError(null);
//       } catch (err) {
//         console.error('🚨 News Fetch Error:', err);
//         setError('Failed to load news');
//         setNews([]);
//       } finally {
//         setLoading(false);
//       }
//     };
   
//     fetchNews();
//   }, [selectedCountry, selectedCategory, locationLoaded]);
 
//   const filteredNews = useMemo(() => {
//     console.log('🔍 Filtering News:');
//     console.log('Total News:', news.length);
//     console.log('Search Query:', searchQuery);
//     console.log('Selected Category:', selectedCategory);

//     let result = news;
    
//     if (selectedCategory && selectedCategory !== 'All') {
//       result = result.filter(item => 
//         item.category && 
//         item.category.toLowerCase() === selectedCategory.toLowerCase()
//       );
//       console.log('After Category Filter:', result.length);
//     }
    
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase().trim();
//       result = result.filter(item => 
//         (item.headline?.toLowerCase().includes(query)) ||
//         (item.summary?.toLowerCase().includes(query)) ||
//         (item.source?.toLowerCase().includes(query)) ||
//         (item.category?.toLowerCase().includes(query))
//       );
//       console.log('After Search Filter:', result.length);
//     }
    
//     return result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
//   }, [news, searchQuery, selectedCategory]);
 
//   return {
//     news,
//     filteredNews,
//     loading,
//     error
//   };
// };
 
// export default useFetchNews;


// import { useState, useEffect, useMemo } from 'react';
 
// const useFetchNews = (
//   selectedCountry,
//   locationLoaded,
//   searchQuery = '',
//   selectedCategory = 'All'
// ) => {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
 
//   useEffect(() => {
//     const fetchNews = async () => {
//       console.log('🌐 Fetch News Trigger:');
//       console.log('Location Loaded:', locationLoaded);
//       console.log('Selected Country:', selectedCountry);
//       console.log('Selected Category:', selectedCategory);

//       if (!locationLoaded) {
//         console.warn('⏳ Waiting for location detection...');
//         setLoading(false);
//         return;
//       }
     
//       if (!selectedCountry) {
//         console.warn('❌ No country selected');
//         setLoading(false);
//         return;
//       }
     
//       try {
//         setLoading(true);
       
//         const url = new URL('/api/news', window.location.origin);
        
//         // Map common country code abbreviations to full names if needed
//         const countryMap = {
//           'USA': 'United States of America',
//           'IND': 'India',
//           // Add more mappings as needed
//         };

//         const mappedCountry = countryMap[selectedCountry] || selectedCountry;
//         url.searchParams.append('country', mappedCountry);
        
//         if (selectedCategory && selectedCategory !== 'All') {
//           url.searchParams.append('category', selectedCategory);
//         }
       
//         console.log('🔗 Fetching URL:', url.toString());
       
//         const response = await fetch(url.toString());
       
//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error('❌ Fetch Error:', errorText);
//           throw new Error(`Failed to fetch news (${response.status}): ${errorText}`);
//         }
       
//         const data = await response.json();
        
//         console.log('📰 Received News:', data.length, 'articles');
        
//         setNews(data);
//         setError(null);
//       } catch (err) {
//         console.error('🚨 News Fetch Error:', err);
//         setError('Failed to load news');
//         setNews([]);
//       } finally {
//         setLoading(false);
//       }
//     };
   
//     fetchNews();
//   }, [selectedCountry, selectedCategory, locationLoaded]);
 
//   const filteredNews = useMemo(() => {
//     console.log('🔍 Filtering News:');
//     console.log('Total News:', news.length);
//     console.log('Search Query:', searchQuery);
//     console.log('Selected Category:', selectedCategory);

//     let result = news;
    
//     if (selectedCategory && selectedCategory !== 'All') {
//       result = result.filter(item => 
//         item.category && 
//         item.category.toLowerCase() === selectedCategory.toLowerCase()
//       );
//       console.log('After Category Filter:', result.length);
//     }
    
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase().trim();
//       result = result.filter(item => 
//         (item.headline?.toLowerCase().includes(query)) ||
//         (item.summary?.toLowerCase().includes(query)) ||
//         (item.source?.toLowerCase().includes(query)) ||
//         (item.category?.toLowerCase().includes(query))
//       );
//       console.log('After Search Filter:', result.length);
//     }
    
//     return result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
//   }, [news, searchQuery, selectedCategory]);
 
//   return {
//     news,
//     filteredNews,
//     loading,
//     error
//   };
// };
 
// export default useFetchNews;




// import { useState, useEffect, useMemo } from 'react';
 
// const useFetchNews = (
//   selectedCountry,
//   locationLoaded,
//   searchQuery = '',
//   selectedCategory = 'All'
// ) => {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
 
//   useEffect(() => {
//     const fetchNews = async () => {
//       console.log('🌐 Fetch News Trigger:');
//       console.log('Location Loaded:', locationLoaded);
//       console.log('Selected Country:', selectedCountry);
//       console.log('Selected Category:', selectedCategory);

//       if (!locationLoaded) {
//         console.warn('⏳ Waiting for location detection...');
//         setLoading(false);
//         return;
//       }
     
//       if (!selectedCountry) {
//         console.warn('❌ No country selected');
//         setLoading(false);
//         return;
//       }
     
//       try {
//         setLoading(true);
       
//         const url = new URL('/api/news', window.location.origin);
        
//         // Map common country code abbreviations to full names if needed
//         const countryMap = {
//           'USA': 'United States of America',
//           'IND': 'India',
//           // Add more mappings as needed
//         };

//         const mappedCountry = countryMap[selectedCountry] || selectedCountry;
//         url.searchParams.append('country', mappedCountry);
        
//         if (selectedCategory && selectedCategory !== 'All') {
//           url.searchParams.append('category', selectedCategory);
//         }
       
//         console.log('🔗 Fetching URL:', url.toString());
       
//         const response = await fetch(url.toString());
       
//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error('❌ Fetch Error:', errorText);
//           throw new Error(`Failed to fetch news (${response.status}): ${errorText}`);
//         }
       
//         const data = await response.json();
        
//         console.log('📰 Received News:', data.length, 'articles');
        
//         setNews(data);
//         setError(null);
//       } catch (err) {
//         console.error('🚨 News Fetch Error:', err);
//         setError('Failed to load news');
//         setNews([]);
//       } finally {
//         setLoading(false);
//       }
//     };
   
//     fetchNews();
//   }, [selectedCountry, selectedCategory, locationLoaded]);
 
//   const filteredNews = useMemo(() => {
//     console.log('🔍 Filtering News:');
//     console.log('Total News:', news.length);
//     console.log('Search Query:', searchQuery);
//     console.log('Selected Category:', selectedCategory);

//     let result = news;
    
//     if (selectedCategory && selectedCategory !== 'All') {
//       result = result.filter(item => 
//         item.category && 
//         item.category.toLowerCase() === selectedCategory.toLowerCase()
//       );
//       console.log('After Category Filter:', result.length);
//     }
    
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase().trim();
//       result = result.filter(item => 
//         (item.headline?.toLowerCase().includes(query)) ||
//         (item.summary?.toLowerCase().includes(query)) ||
//         (item.source?.toLowerCase().includes(query)) ||
//         (item.category?.toLowerCase().includes(query))
//       );
//       console.log('After Search Filter:', result.length);
//     }
    
//     return result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
//   }, [news, searchQuery, selectedCategory]);
 
//   return {
//     news,
//     filteredNews,
//     loading,
//     error
//   };
// };
 
// export default useFetchNews;
import { useState, useEffect, useMemo } from 'react';

const useFetchNews = (
  selectedCountry,
  locationLoaded,
  searchQuery = '',
  selectedCategory = 'All'
) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      console.log('🌐 Fetch News Trigger:');
      console.log('Location Loaded:', locationLoaded);
      console.log('Selected Country:', selectedCountry);
      console.log('Selected Category:', selectedCategory);

      if (!locationLoaded) {
        console.warn('⏳ Waiting for location detection...');
        setLoading(false);
        return;
      }
     
      if (!selectedCountry) {
        console.warn('❌ No country selected');
        setLoading(false);
        return;
      }
     
      try {
        setLoading(true);
       
        const url = new URL('/api/news', window.location.origin);
        
        url.searchParams.append('country', selectedCountry);
        
        if (selectedCategory && selectedCategory !== 'All') {
          url.searchParams.append('category', selectedCategory);
        }
       
        console.log('🔗 Fetching URL:', url.toString());
       
        const response = await fetch(url.toString());
       
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Fetch Error:', errorText);
          throw new Error(`Failed to fetch news (${response.status}): ${errorText}`);
        }
       
        const data = await response.json();
        
        console.log('📰 Received News:', data.length, 'articles');
        
        setNews(data);
        setError(null);
      } catch (err) {
        console.error('🚨 News Fetch Error:', err);
        setError('Failed to load news');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
   
    fetchNews();
  }, [selectedCountry, selectedCategory, locationLoaded]);
 
  const filteredNews = useMemo(() => {
    console.log('🔍 Filtering News:');
    console.log('Total News:', news.length);
    console.log('Search Query:', searchQuery);
    console.log('Selected Category:', selectedCategory);

    let result = news;
    
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(item => 
        item.category && 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      console.log('After Category Filter:', result.length);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        (item.headline?.toLowerCase().includes(query)) ||
        (item.summary?.toLowerCase().includes(query)) ||
        (item.source?.toLowerCase().includes(query)) ||
        (item.category?.toLowerCase().includes(query))
      );
      console.log('After Search Filter:', result.length);
    }
    
    return result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }, [news, searchQuery, selectedCategory]);
 
  return {
    news,
    filteredNews,
    loading,
    error
  };
};
 
export default useFetchNews;