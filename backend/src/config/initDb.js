const User = require('../models/User');
const Author = require('../models/Author');
const Genre = require('../models/Genre');
const Book = require('../models/Book');
const Borrowing = require('../models/Borrowing');
const seedAdmin = require('../seeder/adminSeeder');

const initializeDatabase = async () => {
  // await User.createUserTable();
  // await Author.createAuthorTable();
  // await Genre.createGenreTable();
  // await Book.createBookTable();
  // await Borrowing.createBorrowingTable();
  // await seedAdmin();
};

module.exports = initializeDatabase;
