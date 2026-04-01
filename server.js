const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

const app = express();

// ===================
// CORS CONFIGURATION
// ===================
// Allow requests from frontend (port 3001)
// This handles both regular requests AND preflight OPTIONS requests
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true
}));

// ===================
// BODY PARSING
// ===================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===================
// ROUTES
// ===================
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);

// ===================
// HEALTH CHECK
// ===================
app.get('/', (req, res) => {
  res.send('Quotes API is running');
});

// ===================
// START SERVER
// ===================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
