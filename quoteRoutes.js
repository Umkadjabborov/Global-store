const express = require('express');
const router = express.Router();

const {
  getAllQuotes,
  getMyQuotes,
  createQuote,
  deleteQuote,
} = require('../controllers/quoteController');

const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllQuotes);

// Protected routes
router.get('/my', authMiddleware, getMyQuotes);
router.post('/', authMiddleware, createQuote);
router.delete('/:id', authMiddleware, deleteQuote);

module.exports = router;
