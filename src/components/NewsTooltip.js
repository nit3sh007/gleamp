// File: components/NewsTooltip.js
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';

export default function NewsTooltip({ 
  newsData, 
  countryName, 
  countryCode, 
  flagEmoji, 
  timestamp 
}) {
  const [timeAgo, setTimeAgo] = useState('');
  
  // Update the "time ago" text every minute
  useEffect(() => {
    if (!timestamp) return;
    
    const updateTimeAgo = () => {
      const now = Date.now();
      const diff = now - timestamp;
      
      if (diff < 60000) {
        setTimeAgo('just now');
      } else if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        setTimeAgo(`${minutes} minute${minutes !== 1 ? 's' : ''} ago`);
      } else if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        setTimeAgo(`${hours} hour${hours !== 1 ? 's' : ''} ago`);
      } else {
        const days = Math.floor(diff / 86400000);
        setTimeAgo(`${days} day${days !== 1 ? 's' : ''} ago`);
      }
    };
    
    // Update immediately
    updateTimeAgo();
    
    // Set up interval for updates
    const intervalId = setInterval(updateTimeAgo, 60000);
    
    return () => clearInterval(intervalId);
  }, [timestamp]);
  
  // Generate tooltip HTML
  const generateTooltipHTML = () => {
    const { total = 0, breaking = 0, recent = 0 } = newsData || {};
    
    return `
      <div class="news-tooltip">
        <div class="tooltip-header">
          <span class="country-flag">${flagEmoji || '🌐'}</span>
          <span class="country-name">${countryName || countryCode}</span>
        </div>
        
        <div class="tooltip-content">
          <div class="news-count">
            <span class="count-label">Total Articles:</span>
            <span class="count-value">${total}</span>
          </div>
          
          ${breaking > 0 ? `
            <div class="news-count breaking">
              <span class="count-label">Breaking:</span>
              <span class="count-value">${breaking}</span>
            </div>
          ` : ''}
          
          ${recent > 0 ? `
            <div class="news-count recent">
              <span class="count-label">Recent:</span>
              <span class="count-value">${recent}</span>
            </div>
          ` : ''}
        </div>
        
        ${timeAgo ? `
          <div class="tooltip-footer">
            Latest update: ${timeAgo}
          </div>
        ` : ''}
      </div>
    `;
  };
  
  // Method for Leaflet tooltips
  const getLeafletTooltipOptions = () => {
    return {
      direction: 'top',
      offset: [0, -10],
      opacity: 0.9,
      className: 'news-country-tooltip'
    };
  };
  
  return {
    html: generateTooltipHTML(),
    options: getLeafletTooltipOptions()
  };
}
