const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const { saveStoryToDB } = require('./storyServices');

async function scrapeHackerNews() {
  try {
    const response = await axios.get('https://news.ycombinator.com/newest');
    const $ = cheerio.load(response.data);
    const stories = [];

    $('.athing').each((index, element) => {
      const title = $(element).find('.titleline a').text().trim();
      const url = $(element).find('.titleline a').attr('href');
      const author = $(element).next().find('.hnuser').text().trim();
      const scoreText = $(element).next().find('.score').text().trim();
      const score = parseInt(scoreText.replace(' points', ''), 10) || 0;
      const timeText = $(element).next().find('.age').text().trim(); 

      console.log('Time Text:', timeText);

      if (timeText.includes('minute')) {
        const minutesAgo = parseInt(timeText.split(' ')[0], 10); 
        if (minutesAgo <= 5) {
          const story = { title, url, author, score };
          console.log('Scraped story:', story);
          stories.push(story); 
          saveStoryToDB(story);
        } else {
          console.log(`Skipping story "${title}" as it was published ${minutesAgo} minutes ago.`);
        }
      } else {
        console.log(`Skipping story "${title}" as it is not published within the last 5 minutes.`);
      }
    });

    console.log(`Found ${stories.length} stories within last 5 minutes`);
    return stories; 
  } catch (error) {
    console.error('Error scraping Hacker News:', error);
    return [];
  }
}

module.exports = { scrapeHackerNews };