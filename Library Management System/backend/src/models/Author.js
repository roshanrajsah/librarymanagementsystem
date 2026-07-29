const db = require('../config/db');

const createAuthorTable = () => new Promise((resolve, reject) => db.run(`
  CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    bio TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`, error => error ? reject(error) : resolve()));

const all = () => new Promise((resolve, reject) => db.all('SELECT * FROM authors ORDER BY name', [], (error, rows) => error ? reject(error) : resolve(rows)));
const findById = id => new Promise((resolve, reject) => db.get('SELECT * FROM authors WHERE id = ?', [id], (error, row) => error ? reject(error) : resolve(row)));
const create = ({ name, bio }) => new Promise((resolve, reject) => db.run('INSERT INTO authors (name, bio) VALUES (?, ?)', [name, bio || ''], function (error) { error ? reject(error) : resolve(findById(this.lastID)); }));
const update = (id, { name, bio }) => new Promise((resolve, reject) => db.run('UPDATE authors SET name = ?, bio = ? WHERE id = ?', [name, bio || '', id], function (error) { error ? reject(error) : this.changes ? resolve(findById(id)) : resolve(null); }));
const remove = id => new Promise((resolve, reject) => db.run('DELETE FROM authors WHERE id = ?', [id], function (error) { error ? reject(error) : resolve(this.changes > 0); }));

module.exports = { createAuthorTable, all, findById, create, update, remove };
