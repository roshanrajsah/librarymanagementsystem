const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// The models use sqlite3's callback API. Keeping the database local lets the
// application start even when a remote Turso connection is unavailable.
const db = new sqlite3.Database(path.join(__dirname, '../database/library.sqlite'), error => {
  if (error) console.error('Unable to open the local database:', error.message);
  else console.log('Connected to the local SQLite database.');
});

db.run('PRAGMA foreign_keys = ON');

module.exports = db;
