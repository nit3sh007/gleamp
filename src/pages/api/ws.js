// File: pages/api/ws.js
import { Server } from 'socket.io';
import { connectDB } from "@/lib/db";
import { NewsArticle } from "@/modals/NewsArticle";

// Track active connections
const connections = new Set();

// Track last update time to throttle updates
let lastUpdateTime = Date.now();
const throttleInterval = 1000; // 1 second minimum between broadcasts

export default async function handler(req, res) {
  // Connect to database
  await connectDB();
  
  // Check if socket.io server already initialized
  if (res.socket.server.io) {
    console.log('Socket already running');
    res.end();
    return;
  }

  // Initialize socket.io server
  const io = new Server(res.socket.server, {
    path: '/api/ws',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  
  // Store io instance on server
  res.socket.server.io = io;
  
  // Handle new connections
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    connections.add(socket);
    
    // Send initial data on connection
    sendInitialData(socket);
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      connections.delete(socket);
    });
    
    // Handle subscription to specific countries
    socket.on('subscribeCountry', (countryCode) => {
      socket.join(`country:${countryCode}`);
      console.log(`Client ${socket.id} subscribed to country: ${countryCode}`);
    });
    
    // Handle unsubscription from specific countries
    socket.on('unsubscribeCountry', (countryCode) => {
      socket.leave(`country:${countryCode}`);
      console.log(`Client ${socket.id} unsubscribed from country: ${countryCode}`);
    });
  });
  
  // Setup periodic news checking
  setupNewsWatcher(io);
  
  console.log('WebSocket server initialized');
  res.end();
}

// Send initial data when client connects
async function sendInitialData(socket) {
  try {
    // Get news counts by country
    const countryCounts = await NewsArticle.aggregate([
      { $group: { _id: "$countryCode", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null, $ne: "" } } }
    ]);
    
    // Send counts to the client
    const countsData = {};
    countryCounts.forEach(item => {
      if (item._id) {
        countsData[item._id] = item.count;
      }
    });
    
    socket.emit('initialCounts', countsData);
    
    // Get latest news items (5 most recent)
    const latestNews = await NewsArticle.find({})
      .sort({ publishedAt: -1 })
      .limit(5)
      .lean();
    
    socket.emit('latestNews', latestNews);
    
  } catch (error) {
    console.error('Error sending initial data:', error);
  }
}

// Watch for new news articles and broadcast them
async function setupNewsWatcher(io) {
  // Polling approach for checking new news
  // In a production environment, consider using change streams or database triggers
  setInterval(async () => {
    try {
      const now = Date.now();
      
      // Don't check too frequently
      if (now - lastUpdateTime < throttleInterval) {
        return;
      }
      
      // Get most recent news article as timestamp reference
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() - 2); // Check last 2 minutes
      
      const recentNews = await NewsArticle.find({
        publishedAt: { $gte: timestamp }
      })
      .sort({ publishedAt: -1 })
      .lean();
      
      // If there are new articles, broadcast them
      if (recentNews.length > 0) {
        console.log(`Broadcasting ${recentNews.length} new articles`);
        
        // Update timestamp
        lastUpdateTime = now;
        
        // Group by country for more efficient broadcasting
        const newsByCountry = {};
        
        recentNews.forEach(news => {
          if (news.countryCode) {
            if (!newsByCountry[news.countryCode]) {
              newsByCountry[news.countryCode] = [];
            }
            newsByCountry[news.countryCode].push(news);
          }
        });
        
        // Broadcast to all clients
        io.emit('newsUpdate', { 
          type: 'batch', 
          timestamp: now,
          count: recentNews.length
        });
        
        // Broadcast to country-specific rooms
        Object.entries(newsByCountry).forEach(([countryCode, news]) => {
          io.to(`country:${countryCode}`).emit('countryNews', {
            countryCode,
            news,
            count: news.length
          });
          
          // Also broadcast individual updates for pulsing dots
          news.forEach(item => {
            io.emit('newsUpdate', {
              type: 'newsUpdate',
              payload: {
                countryCode: item.countryCode,
                timestamp: new Date(item.publishedAt).getTime(),
                title: item.headline
              }
            });
          });
        });
      }
    } catch (error) {
      console.error('Error in news watcher:', error);
    }
  }, 5000); // Check every 5 seconds
}