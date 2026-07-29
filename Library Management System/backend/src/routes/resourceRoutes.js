const express = require('express');
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/resourceController');

const router = express.Router();
const upload = multer({ storage: multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, path.join(__dirname, '../../uploads')),
  filename: (_req, file, callback) => callback(null, `${Date.now()}${path.extname(file.originalname)}`)
}) });

for (const [name, handlers] of Object.entries({ authors: controller.authors, genres: controller.genres })) {
  router.route(`/${name}`).get(handlers.list).post(handlers.create);
  router.route(`/${name}/:id`).get(handlers.get).put(handlers.update).delete(handlers.remove);
}
router.route('/books').get(controller.books.list).post(upload.single('coverImage'), controller.books.create);
router.route('/books/:id').get(controller.books.get).put(upload.single('coverImage'), controller.books.update).delete(controller.books.remove);
router.post('/books/:id/borrow', controller.borrow);
router.route('/users/:id').get(controller.profile).put(controller.updateProfile);
router.get('/users/:userId/borrowings', controller.myBorrowings);

module.exports = router;
