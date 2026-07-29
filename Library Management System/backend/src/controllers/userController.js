const db = require('../config/db');

// Get All Books
exports.getBooks = (req, res) => {
  const sql = `
    SELECT b.*, a.name as author_name, g.name as genre_name 
    FROM books b
    LEFT JOIN authors a ON b.author_id = a.id
    LEFT JOIN genres g ON b.genre_id = g.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Get All Authors
exports.getAuthors = (req, res) => {
  db.all('SELECT * FROM authors', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Get All Genres
exports.getGenres = (req, res) => {
  db.all('SELECT * FROM genres', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};