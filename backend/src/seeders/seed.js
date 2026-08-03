const db = require('../config/db');
const bcrypt = require('bcryptjs'); // or 'bcrypt' depending on what you installed

db.serialize(async () => {
  console.log('🌱 Seeding database...');

  // 1. Insert Default Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  db.run(`
    INSERT OR REPLACE INTO users (id, username, password, name, email, role) 
    VALUES (1, 'admin', ?, 'Admin User', 'admin@example.com', 'admin')
  `, [hashedPassword], (err) => {
    if (err) console.error('Error seeding admin user:', err.message);
    else console.log('👤 Admin user created (Username: admin, Password: admin123)');
  });

  // 2. Insert Genres
  const genres = ['Fiction', 'Classic', 'Dystopian', 'Software Development'];
  genres.forEach((genre) => {
    db.run('INSERT OR IGNORE INTO genres (name) VALUES (?)', [genre]);
  });

  // 3. Insert Authors
  const authors = [
    { name: 'Robert C. Martin', bio: 'Author of Clean Code' },
    { name: 'F. Scott Fitzgerald', bio: 'American novelist' },
    { name: 'George Orwell', bio: 'English novelist and essayist' },
    { name: 'Harper Lee', bio: 'American novelist' },
  ];

  authors.forEach((author) => {
    db.run('INSERT OR IGNORE INTO authors (name, bio) VALUES (?, ?)', [author.name, author.bio]);
  });

  // 4. Insert Books
  setTimeout(() => {
    const books = [
      { title: 'Clean Code', author_id: 1, genre_id: 4, stock: 15 },
      { title: 'The Great Gatsby', author_id: 2, genre_id: 2, stock: 10 },
      { title: '1984', author_id: 3, genre_id: 3, stock: 20 },
      { title: 'To Kill a Mockingbird', author_id: 4, genre_id: 1, stock: 12 },
    ];

    books.forEach((book) => {
      db.run(
        'INSERT INTO books (title, author_id, genre_id, stock) VALUES (?, ?, ?, ?)',
        [book.title, book.author_id, book.genre_id, book.stock]
      );
    });

    console.log('✅ Database seeded successfully!');
  }, 1000);
});