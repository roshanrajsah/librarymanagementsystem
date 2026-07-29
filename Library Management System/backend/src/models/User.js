const db = require('../config/db');

const createUserTable = () => new Promise((resolve, reject) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      gender TEXT,
      phone_number TEXT,
      address TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `, (error) => (error ? reject(error) : resolve()));
});

const findByUsername = (username) => new Promise((resolve, reject) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], (error, user) => {
    if (error) return reject(error);
    return resolve(user);
  });
});

const create = (user) => new Promise((resolve, reject) => {
  const sql = `INSERT INTO users
    (username, password, first_name, last_name, gender, phone_number, address, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [user.username, user.password, user.firstName, user.lastName, user.gender, user.phoneNumber, user.address, user.role];

  db.run(sql, values, function onCreate(error) {
    if (error) return reject(error);
    return resolve({ id: this.lastID, ...user });
  });
});

const findById = (id) => new Promise((resolve, reject) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (error, user) => {
    if (error) return reject(error);
    return resolve(user);
  });
});

const updateProfile = (id, user) => new Promise((resolve, reject) => {
  const sql = `UPDATE users SET first_name = ?, last_name = ?, gender = ?, phone_number = ?, address = ? WHERE id = ?`;
  db.run(sql, [user.firstName, user.lastName, user.gender || '', user.phoneNumber || '', user.address || '', id], function (error) {
    if (error) return reject(error);
    return this.changes ? resolve(findById(id)) : resolve(null);
  });
});

const publicUser = (user) => ({
  id: user.id, username: user.username, firstName: user.first_name, lastName: user.last_name,
  gender: user.gender, phoneNumber: user.phone_number, address: user.address, role: user.role
});

module.exports = { createUserTable, findByUsername, findById, create, updateProfile, publicUser };
