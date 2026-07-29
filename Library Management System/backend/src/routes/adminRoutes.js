const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');

// Configure image upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/books', upload.single('coverImage'), adminController.addBook);
router.delete('/books/:id', adminController.deleteBook);
router.post('/authors', adminController.addAuthor);
router.post('/genres', adminController.addGenre);

module.exports = router;