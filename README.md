# Hacker News Real-time Story Scraper

A Node.js service that scrapes stories from Hacker News in real-time and broadcasts updates to connected clients via WebSocket. The service maintains a 5-minute window of recent stories and provides instant updates to all connected clients.

## Features

- Real-time story updates via WebSocket
- Automatic scraping of new Hacker News stories
- MySQL database integration for story persistence
- 5-minute recent stories window
- Duplicate story detection
- Automatic reconnection handling
- Real-time browser updates without page refresh

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/scraper.git
cd scraper
```

2. Install dependencies
```bash
npm install
```

3. Create a MySQL database and initialize it
```bash
mysql -u your_username -p < sql/init.sql
```

4. Configure environment variables
   - Copy the example environment file
     ```bash
     cp .env.example .env
     ```
   - Update the .env file with your database credentials:
     ```
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=hacker_news
     ```

5. Start the server
```bash
node src/index.js
```

## Usage

### Running the Application

1. Start the server:
```bash
node src/index.js
```

2. Run the index.html file in the project directory.


3. You should see the real-time story feed start populating automatically.

## Database Schema

The stories table structure:

```sql
CREATE TABLE IF NOT EXISTS stories(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    score INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Reference

### WebSocket Messages

1. Initial Connection Response:
```javascript
{
  type: 'initial',
  stories: [
    {
      title: String,
      url: String,
      author: String,
      score: Number,
      timestamp: DateTime
    }
    // ... more stories
  ]
}
```

2. New Stories Update:
```javascript
{
  type: 'new_story',
  stories: [
    {
      title: String,
      url: String,
      author: String,
      score: Number,
      timestamp: DateTime
    }
    // ... more stories
  ]
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Hacker News API](https://github.com/HackerNews/API)
- [WebSocket](https://github.com/websockets/ws)
- [Node.js MySQL](https://github.com/mysqljs/mysql)

## Error Handling

The application includes error handling for:
- WebSocket connection failures
- Database connection issues
- Scraping failures
- Duplicate stories
- Invalid data formats

Common errors and solutions:

1. Database Connection Failed:
   - Check if MySQL is running
   - Verify database credentials in .env
   - Ensure database exists

2. WebSocket Connection Failed:
   - Check if server is running
   - Verify correct WebSocket port
   - Check for firewall issues

