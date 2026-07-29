const db = require('../config/db');

const createGenreTable = () => new Promise((resolve, reject) => db.run(`
  CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`, error => error ? reject(error) : resolve()));

const all = () => new Promise((resolve, reject) => db.all('SELECT * FROM genres ORDER BY name', [], (error, rows) => error ? reject(error) : resolve(rows)));
const findById = id => new Promise((resolve, reject) => db.get('SELECT * FROM genres WHERE id = ?', [id], (error, row) => error ? reject(error) : resolve(row)));
const create = ({ name, description }) => new Promise((resolve, reject) => db.run('INSERT INTO genres (name, description) VALUES (?, ?)', [name, description || ''], function (error) { error ? reject(error) : resolve(findById(this.lastID)); }));
const update = (id, { name, description }) => new Promise((resolve, reject) => db.run('UPDATE genres SET name = ?, description = ? WHERE id = ?', [name, description || '', id], function (error) { error ? reject(error) : this.changes ? resolve(findById(id)) : resolve(null); }));
const remove = id => new Promise((resolve, reject) => db.run('DELETE FROM genres WHERE id = ?', [id], function (error) { error ? reject(error) : resolve(this.changes > 0); }));

module.exports = { createGenreTable, all, findById, create, update, remove };
