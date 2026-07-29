// Get all books with author name, genre name, and cover image
router.get('/books', (req, res) => {
  const sql = `
    SELECT 
      books.id,
      books.title,
      books.stock,
      books.cover_image,
      authors.name AS author_name,
      genres.name AS genre_name
    FROM books
    LEFT JOIN authors ON books.author_id = authors.id
    LEFT JOIN genres ON books.genre_id = genres.id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});