require('dotenv').config();

const { scrapeHackerNews } = require('./services/scraper');

console.log('Environment loaded successfully');
console.log('Project initialized');

scrapeHackerNews();
