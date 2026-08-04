const db = require('../config/db');

const createBookTable = () => new Promise((resolve, reject) => db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    description TEXT DEFAULT '',
    cover_image TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE RESTRICT,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE RESTRICT
  )
`, error => {
  if (error) return reject(error);
  // SQLite lacks ADD COLUMN IF NOT EXISTS, so inspect older tables first.
  db.all('PRAGMA table_info(books)', [], (pragmaError, columns) => {
    if (pragmaError) return reject(pragmaError);
    if (columns.some(column => column.name === 'description')) return resolve();
    db.run("ALTER TABLE books ADD COLUMN description TEXT DEFAULT ''", alterError => alterError ? reject(alterError) : resolve());
  });
}));

const select = `SELECT books.*, authors.name AS author_name, genres.name AS genre_name
  FROM books
  INNER JOIN authors ON authors.id = books.author_id
  INNER JOIN genres ON genres.id = books.genre_id`;
const all = () => new Promise((resolve, reject) => db.all(`${select} ORDER BY books.id DESC`, [], (error, rows) => error ? reject(error) : resolve(rows)));
const findById = id => new Promise((resolve, reject) => db.get(`${select} WHERE books.id = ?`, [id], (error, row) => error ? reject(error) : resolve(row)));
const create = ({ title, authorId, genreId, stock, description, coverImage }) => new Promise((resolve, reject) => db.run('INSERT INTO books (title, author_id, genre_id, stock, description, cover_image) VALUES (?, ?, ?, ?, ?, ?)', [title, authorId, genreId, stock, description || '', coverImage || null], function (error) { error ? reject(error) : resolve(findById(this.lastID)); }));
const update = (id, { title, authorId, genreId, stock, description, coverImage }) => new Promise((resolve, reject) => {
  const imageSql = coverImage ? ', cover_image = ?' : '';
  const values = [title, authorId, genreId, stock, description || ''];
  if (coverImage) values.push(coverImage);
  values.push(id);
  db.run(`UPDATE books SET title = ?, author_id = ?, genre_id = ?, stock = ?, description = ?${imageSql} WHERE id = ?`, values, function (error) { error ? reject(error) : this.changes ? resolve(findById(id)) : resolve(null); });
});
const remove = id => new Promise((resolve, reject) => db.run('DELETE FROM books WHERE id = ?', [id], function (error) { error ? reject(error) : resolve(this.changes > 0); }));
const decreaseStock = id => new Promise((resolve, reject) => db.run('UPDATE books SET stock = stock - 1 WHERE id = ? AND stock > 0', [id], function (error) { error ? reject(error) : resolve(this.changes > 0); }));

module.exports = { createBookTable, all, findById, create, update, remove, decreaseStock };
