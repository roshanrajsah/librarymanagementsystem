const path = require('path');
require("dotenv").config();
let db;

if (process.env.NODE_ENV === 'production') {
  // ---- Production: Turso (libSQL) ----
  const { createClient } = require('@libsql/client');

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // Wrap libsql's promise-based client so it exposes the same
  // callback-style API as sqlite3 (run/get/all), so models don't
  // need to change based on environment.
  db = {
    run(sql, params = [], callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      client
        .execute({ sql, args: params })
        .then(result => {
          if (callback) {
            // Mimic sqlite3's `this.lastID` / `this.changes` via context object
            const context = {
              lastID: result.lastInsertRowid !== undefined ? Number(result.lastInsertRowid) : undefined,
              changes: result.rowsAffected,
            };
            callback.call(context, null);
          }
        })
        .catch(error => {
          if (callback) callback(error);
          else console.error('Turso run() error:', error.message);
        });
      return db;
    },

    get(sql, params = [], callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      client
        .execute({ sql, args: params })
        .then(result => {
          const row = result.rows.length > 0 ? result.rows[0] : undefined;
          if (callback) callback(null, row);
        })
        .catch(error => {
          if (callback) callback(error);
          else console.error('Turso get() error:', error.message);
        });
      return db;
    },

    all(sql, params = [], callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      client
        .execute({ sql, args: params })
        .then(result => {
          if (callback) callback(null, result.rows);
        })
        .catch(error => {
          if (callback) callback(error);
          else console.error('Turso all() error:', error.message);
        });
      return db;
    },

    each(sql, params = [], rowCallback, completeCallback) {
      if (typeof params === 'function') {
        completeCallback = rowCallback;
        rowCallback = params;
        params = [];
      }
      client
        .execute({ sql, args: params })
        .then(result => {
          result.rows.forEach(row => rowCallback && rowCallback(null, row));
          if (completeCallback) completeCallback(null, result.rows.length);
        })
        .catch(error => {
          if (rowCallback) rowCallback(error);
          else console.error('Turso each() error:', error.message);
        });
      return db;
    },

    exec(sql, callback) {
      client
        .executeMultiple(sql)
        .then(() => {
          if (callback) callback(null);
        })
        .catch(error => {
          if (callback) callback(error);
          else console.error('Turso exec() error:', error.message);
        });
      return db;
    },

    close(callback) {
      // libsql client has no explicit close needed for HTTP transport,
      // but keep the same signature for compatibility.
      if (callback) callback(null);
    },
  };

  console.log('Connected to Turso (production).');
} else if (process.env.NODE_ENV === 'development') {
  // ---- Development: local sqlite3 (unchanged) ----
  const sqlite3 = require('sqlite3').verbose();

  db = new sqlite3.Database(path.join(__dirname, '../database/library.sqlite'), error => {
    if (error) console.error('Unable to open the local database:', error.message);
    else console.log('Connected to the local SQLite database.');
  });

  db.run('PRAGMA foreign_keys = ON');
} else {
  throw new Error(
    `NODE_ENV is set to "${process.env.NODE_ENV}". Expected "production" or "development".`
  );
}

module.exports = db;