const Book = require('../models/Book');
const Author = require('../models/Author');
const Genre = require('../models/Genre');
const User = require('../models/User');
const Borrowing = require('../models/Borrowing');

const sendError = (res, error) => res.status(400).json({ error: error.message || 'Request could not be completed.' });
const entityHandlers = (Model, fields) => ({
  list: async (_req, res) => { try { res.json(await Model.all()); } catch (error) { sendError(res, error); } },
  get: async (req, res) => { try { const item = await Model.findById(req.params.id); item ? res.json(item) : res.status(404).json({ error: 'Not found.' }); } catch (error) { sendError(res, error); } },
  create: async (req, res) => { try { const payload = Object.fromEntries(fields.map(field => [field, req.body[field]])); if (!payload.name) return res.status(400).json({ error: 'Name is required.' }); res.status(201).json(await Model.create(payload)); } catch (error) { sendError(res, error); } },
  update: async (req, res) => { try { const payload = Object.fromEntries(fields.map(field => [field, req.body[field]])); if (!payload.name) return res.status(400).json({ error: 'Name is required.' }); const item = await Model.update(req.params.id, payload); item ? res.json(item) : res.status(404).json({ error: 'Not found.' }); } catch (error) { sendError(res, error); } },
  remove: async (req, res) => { try { const removed = await Model.remove(req.params.id); removed ? res.status(204).end() : res.status(404).json({ error: 'Not found.' }); } catch (error) { sendError(res, error); } }
});

const authors = entityHandlers(Author, ['name', 'bio']);
const genres = entityHandlers(Genre, ['name', 'description']);
const books = {
  list: async (_req, res) => { try { res.json(await Book.all()); } catch (error) { sendError(res, error); } },
  get: async (req, res) => { try { const item = await Book.findById(req.params.id); item ? res.json(item) : res.status(404).json({ error: 'Not found.' }); } catch (error) { sendError(res, error); } },
  create: async (req, res) => { try { const { title, authorId, genreId, stock } = req.body; if (!title || !authorId || !genreId) return res.status(400).json({ error: 'Title, author, and genre are required.' }); res.status(201).json(await Book.create({ title, authorId, genreId, stock: Number(stock) || 0, coverImage: req.file?.filename })); } catch (error) { sendError(res, error); } },
  update: async (req, res) => { try { const { title, authorId, genreId, stock } = req.body; if (!title || !authorId || !genreId) return res.status(400).json({ error: 'Title, author, and genre are required.' }); const item = await Book.update(req.params.id, { title, authorId, genreId, stock: Number(stock) || 0, coverImage: req.file?.filename }); item ? res.json(item) : res.status(404).json({ error: 'Not found.' }); } catch (error) { sendError(res, error); } },
  remove: async (req, res) => { try { const removed = await Book.remove(req.params.id); removed ? res.status(204).end() : res.status(404).json({ error: 'Not found.' }); } catch (error) { sendError(res, error); } }
};
const profile = async (req, res) => { try { const user = await User.findById(req.params.id); user ? res.json(User.publicUser(user)) : res.status(404).json({ error: 'User not found.' }); } catch (error) { sendError(res, error); } };
const updateProfile = async (req, res) => { try { const user = await User.updateProfile(req.params.id, req.body); user ? res.json(User.publicUser(user)) : res.status(404).json({ error: 'User not found.' }); } catch (error) { sendError(res, error); } };
const borrow = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user || user.role !== 'user') return res.status(400).json({ error: 'A valid user account is required.' });
    const reduced = await Book.decreaseStock(req.params.id);
    if (!reduced) return res.status(409).json({ error: 'This book is currently unavailable.' });
    const borrowing = await Borrowing.create({ userId: user.id, bookId: Number(req.params.id) });
    res.status(201).json({ message: 'Book borrowed successfully.', borrowing });
  } catch (error) { sendError(res, error); }
};
const myBorrowings = async (req, res) => { try { res.json(await Borrowing.byUser(req.params.userId)); } catch (error) { sendError(res, error); } };

module.exports = { authors, genres, books, profile, updateProfile, borrow, myBorrowings };
