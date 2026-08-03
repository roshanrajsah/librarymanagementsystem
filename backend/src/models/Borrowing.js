const db = require('../config/db');

const createBorrowingTable = () => new Promise((resolve, reject) => db.run(`
  CREATE TABLE IF NOT EXISTS borrowings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    borrowed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    returned_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT
  )`, error => error ? reject(error) : resolve()));

const create = ({ userId, bookId }) => new Promise((resolve, reject) => db.run(
  'INSERT INTO borrowings (user_id, book_id) VALUES (?, ?)', [userId, bookId],
  function (error) { error ? reject(error) : resolve({ id: this.lastID, userId, bookId }); }
));
const byUser = userId => new Promise((resolve, reject) => db.all(`SELECT borrowings.*, books.title, books.cover_image, authors.name AS author_name
  FROM borrowings JOIN books ON books.id = borrowings.book_id JOIN authors ON authors.id = books.author_id
  WHERE borrowings.user_id = ? AND borrowings.returned_at IS NULL ORDER BY borrowings.borrowed_at DESC`, [userId],
  (error, rows) => error ? reject(error) : resolve(rows)));

module.exports = { createBorrowingTable, create, byUser };
