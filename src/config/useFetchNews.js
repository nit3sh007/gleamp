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