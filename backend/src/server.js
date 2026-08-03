const express = require('express');
require('dotenv').config();

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
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  });
