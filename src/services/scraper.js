const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeHackerNews() {
  try {
    const response = await axios.get('https://news.ycombinator.com/');
    const $ = cheerio.load(response.data);
    const stories = [];

    $('.athing').each((index, element) => {
      const title = $(element).find('.titleline a').text().trim();
      const url = $(element).find('.titleline a').attr('href');
      const id = $(element).attr('id');

      if (title && url) {
        stories.push({
          id,
          title,
          url: url.startsWith('http') ? url : `https://news.ycombinator.com/${url}`, 
        });
      }
    });

    console.log('Scraped stories:', stories);
    return stories;
  } catch (error) {
    console.error('Error scraping Hacker News:', error);
    return [];
  }
}

module.exports = { scrapeHackerNews };
