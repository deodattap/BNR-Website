const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules for admin login
const loginRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required.'),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

// POST /api/admin/login
router.post('/login', loginRules, validate, (req, res) => {
  const { username, password } = req.body;

  const validUsername = process.env.ADMIN_USERNAME;
  const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  // Username check
  if (username !== validUsername) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  // Secure bcrypt password comparison
  const passwordMatch = validPasswordHash
    ? bcrypt.compareSync(password, validPasswordHash)
    : password === process.env.ADMIN_PASSWORD; // fallback for legacy .env

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ success: true, token, message: 'Login successful' });
});

module.exports = router;
