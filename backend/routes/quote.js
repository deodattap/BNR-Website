const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const auth = require('../middleware/auth');

// POST /api/quote — Submit quote request
router.post('/', async (req, res) => {
  try {
    const { name, company, email, phone, projectType, location, budget, description } = req.body;

    if (!name || !email || !phone || !projectType || !location || !budget) {
      return res.status(400).json({ error: 'Please fill all required fields.' });
    }

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
