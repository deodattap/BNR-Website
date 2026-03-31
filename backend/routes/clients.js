const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules for adding a client
const clientRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Client name is required.'),
  body('logo')
    .trim()
    .notEmpty().withMessage('Client logo URL is required.'),
];

// GET /api/clients — Get all clients (public)
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/clients — Add a client (admin only)
router.post('/', auth, clientRules, validate, async (req, res) => {
  try {
    const { name, logo } = req.body;

    const client = new Client({ name, logo });
    await client.save();

    res.status(201).json({ success: true, client });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/clients/:id — Delete a client (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
