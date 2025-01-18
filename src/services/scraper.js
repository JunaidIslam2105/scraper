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
        const author = $(element).next().find('.hnuser').text().trim();
        const scoreText = $(element).next().find('.score').text().trim();
        const score = scoreText ? parseInt(scoreText.replace(' points', '').trim(), 10) : 0;

        if (title && url) {
            stories.push({ title, url, author, score });
            saveStoryToDB({ title, url, author, score });
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
