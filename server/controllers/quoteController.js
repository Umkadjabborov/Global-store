const pool = require('../db/db');

// Get all quotes with username
const getAllQuotes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT quotes.*, users.username FROM quotes LEFT JOIN users ON quotes.user_id = users.id ORDER BY quotes.created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get all quotes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user's quotes
const getMyQuotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT quotes.*, users.username FROM quotes LEFT JOIN users ON quotes.user_id = users.id WHERE quotes.user_id = $1 ORDER BY quotes.created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get my quotes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new quote
const createQuote = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ message: 'Quote text is required' });
    }

    const result = await pool.query(
      `INSERT INTO quotes (text, user_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [text, userId]
    );

    res.status(201).json({
      message: 'Quote created successfully',
      quote: result.rows[0],
    });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete quote
const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingQuote = await pool.query(
      'SELECT * FROM quotes WHERE id = $1',
      [id]
    );

    if (existingQuote.rows.length === 0) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    if (existingQuote.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this quote' });
    }

    await pool.query('DELETE FROM quotes WHERE id = $1', [id]);

    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Delete quote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllQuotes,
  getMyQuotes,
  createQuote,
  deleteQuote,
};
