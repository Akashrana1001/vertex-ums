const express = require('express');
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET /books â€” all books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find().populate('addedBy', 'name email').sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /books â€” TEACHER only, add book
router.post('/books', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can add books' });
    }
    const book = await Book.create({ ...req.body, addedBy: req.user.id });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /books/:id â€” TEACHER only, update book
router.put('/books/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can update books' });
    }
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /borrow â€” TEACHER: all borrows, STUDENT: own
router.get('/borrow', async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'STUDENT') filter.studentId = req.user.id;
    const records = await BorrowRecord.find(filter)
      .populate('bookId', 'title author isbn')
      .populate('studentId', 'name email')
      .sort({ borrowDate: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /borrow â€” STUDENT only, borrow a book
router.post('/borrow', async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can borrow books' });
    }
    const { bookId, dueDate } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.available <= 0) return res.status(400).json({ message: 'No copies available' });

    book.available -= 1;
    await book.save();

    const record = await BorrowRecord.create({
      bookId,
      studentId: req.user.id,
      dueDate,
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /borrow/:id/return â€” TEACHER only, mark returned
router.put('/borrow/:id/return', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can process returns' });
    }
    const record = await BorrowRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Borrow record not found' });

    record.status = 'returned';
    record.returnDate = new Date();
    await record.save();

    // Increment available count
    await Book.findByIdAndUpdate(record.bookId, { $inc: { available: 1 } });

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


