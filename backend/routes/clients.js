const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const auth = require('../middleware/auth');

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
router.post('/', auth, async (req, res) => {
  try {
    const { name, logo } = req.body;

    if (!name || !logo) {
      return res.status(400).json({ error: 'Client name and logo URL are required.' });
    }

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
