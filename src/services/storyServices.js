

const connection = require('../config/db'); 

function checkIfStoryExists(title, url, callback) {
  const query = 'SELECT COUNT(*) AS count FROM stories WHERE title = ? AND url = ?';
  connection.query(query, [title, url], (err, results) => {
    if (err) {
      console.error('Error checking for duplicate story:', err);
      callback(err, null);
    } else {
      callback(null, results[0].count > 0); 
    }
  });
}

function saveStoryToDB(story) {
  const { title, url, author, score } = story;


  checkIfStoryExists(title, url, (err, exists) => {
    if (err) {
      console.error('Error checking for duplicate story:', err);
      return;
    }

    if (!exists) {
      const query = 'INSERT INTO stories (title, url, author, score) VALUES (?, ?, ?, ?)';
      const values = [title, url, author, score];
      connection.query(query, values, (err, results) => {
        if (err) {
          console.error('Error saving story to database:', err);
        } else {
          console.log('Story saved to database:', results.insertId);
        }
      });
    } else {
      console.log('Story already exists in the database:', title);
    }
  });
}

module.exports = { saveStoryToDB };
