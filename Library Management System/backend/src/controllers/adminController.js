const db = require('../config/db');

// Add Book (Supports uploaded cover_image via Multer)
exports.addBook = (req, res) => {
  const { title, author_id, genre_id, stock } = req.body;
  const cover_image = req.file ? req.file.filename : null;

  const sql = `INSERT INTO books (title, author_id, genre_id, stock, cover_image) VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [title, author_id, genre_id, stock || 0, cover_image], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: 'Book created successfully' });
  });
};

// Delete Book
exports.deleteBook = (req, res) => {
  db.run('DELETE FROM books WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Book deleted successfully' });
  });
};

// Add Author
exports.addAuthor = (req, res) => {
  const { name, bio } = req.body;
  db.run('INSERT INTO authors (name, bio) VALUES (?, ?)', [name, bio], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, bio });
  });
};

// Add Genre
exports.addGenre = (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO genres (name) VALUES (?)', [name], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name });
  });
};