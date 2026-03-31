const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules for quote request
const quoteRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.'),
  body('projectType')
    .trim()
    .notEmpty().withMessage('Project type is required.'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required.'),
  body('budget')
    .trim()
    .notEmpty().withMessage('Budget is required.'),
];

// POST /api/quote — Submit quote request
router.post('/', quoteRules, validate, async (req, res) => {
  try {
    const { name, company, email, phone, projectType, location, budget, description } = req.body;

    const quote = new Quote({ name, company, email, phone, projectType, location, budget, description });
    await quote.save();

    res.status(201).json({ success: true, message: 'Quote request submitted! Our team will contact you within 24 hours.' });
  } catch (err) {
    console.error('Quote error:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET /api/quote — Get all quotes (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/quote/:id — Delete a quote (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
