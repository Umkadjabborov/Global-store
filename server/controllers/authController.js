const pool = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('Register request body:', req.body);

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email va password majburiy',
      });
    }

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: 'Bu username yoki email allaqachon mavjud',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: 'User muvaffaqiyatli ro‘yxatdan o‘tdi',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      message: 'Server xatoligi',
    });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email va password majburiy',
      });
    }

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        message: 'Email yoki parol noto‘g‘ri',
      });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Email yoki parol noto‘g‘ri',
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login muvaffaqiyatli',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server xatoligi',
    });
  }
};

// ME
const getMe = async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: 'User topilmadi',
      });
    }

    res.status(200).json(userResult.rows[0]);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      message: 'Server xatoligi',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};