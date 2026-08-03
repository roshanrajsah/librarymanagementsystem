const express = require('express');
const path = require('path');

const router = express.Router();
const frontendDirectory = path.join(__dirname, '../../../frontend');

const pages = {
  login: 'login.html', signup: 'signup.html',
  dashboard: 'dashboard.html',
  books: 'books.html',
  'book-add-edit': 'book-add-edit.html',
  'book-view': 'book-view.html',
  authors: 'authors.html',
  'author-add-edit': 'author-add-edit.html',
  genres: 'genres.html',
  'genre-add-edit': 'genre-add-edit.html',
  profile: 'profile.html'
};

// Lets the unchanged pages load their existing relative CSS, JS, and image files.
router.use(express.static(frontendDirectory));

router.get('/', (req, res) => {
  return res.sendFile(path.join(frontendDirectory, 'index.html'));
});

router.get('/user/:page', (req, res) => {
  const page = req.params.page.replace(/\.html$/, '');
  const fileName = { books: 'books.html', borrowed: 'borrowed.html', profile: 'profile.html' }[page];
  return fileName ? res.sendFile(path.join(frontendDirectory, 'user', fileName)) : res.status(404).send('Page not found');
});

router.get('/:page', (req, res) => {
  const pageName = req.params.page.replace(/\.html$/, '');
  const fileName = pages[pageName];

  if (!fileName) {
    return res.status(404).send('Page not found');
  }

  return res.sendFile(path.join(frontendDirectory, fileName));
});

module.exports = router;
