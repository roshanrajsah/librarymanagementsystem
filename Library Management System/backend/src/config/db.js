const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const databasePath = path.join(__dirname, '../database/library.sqlite');
const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error('Database connection error:', error.message);
    return;
  }
  console.log('Connected to SQLite database.');
});

db.run('PRAGMA foreign_keys = ON');

module.exports = db;
