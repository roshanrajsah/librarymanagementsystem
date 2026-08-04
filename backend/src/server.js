const express = require('express');
require('dotenv').config();

console.log("NODE_ENV:", process.env.NODE_ENV);

const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const initializeDatabase = require('./config/initDb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', resourceRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/', pageRoutes);

initializeDatabase()
  .then(() => {
    console.log('Database initialized');

    // Only start server when running locally
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  });

module.exports = app;