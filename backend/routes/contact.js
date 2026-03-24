const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// POST /api/contact — Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, projectType, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const contact = new Contact({ name, email, phone, projectType, message });
    await contact.save();

    res.status(201).json({ success: true, message: 'Message received! We will get back to you within 24 hours.' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET /api/contact — Get all messages (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/contact/:id — Delete a message (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
