const WebSocket = require('ws');
const cron = require('node-cron');
const { scrapeHackerNews } = require('./services/scraper.js');
const connection = require('./config/db');

const wss = new WebSocket.Server({ port: 8080 });


function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on('connection', (ws) => {
  console.log('New client connected');

  
  connection.query(
    'SELECT * FROM stories WHERE timestamp >= NOW() - INTERVAL 5 MINUTE ORDER BY timestamp DESC',
    (err, results) => {
      if (err) {
        console.error('Error fetching recent stories:', err);
        return;
      }
      
      ws.send(JSON.stringify({ 
        type: 'initial', 
        stories: results 
      }));
    }
  );

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});


cron.schedule('* * * * *', async () => {
  console.log('Running periodic scraper...');
  try {
    const newStories = await scrapeHackerNews();
    
    if (newStories.length > 0) {
      console.log(`Broadcasting ${newStories.length} new stories`);
      broadcast({
        type: 'new_story',
        stories: newStories
      });
    } else {
      console.log('No new stories to broadcast');
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});