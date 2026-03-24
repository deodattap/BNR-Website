const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let Career;
try { Career = require('../models/Career'); } catch(e) {}

// GET /api/careers — Public: list all active openings
router.get('/', async (req, res) => {
  try {
    if (!Career) return res.json([]);
    const jobs = await Career.find({ active: true }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.json([]);
  }
});

// GET /api/careers/all — Admin: list all (including inactive)
router.get('/all', auth, async (req, res) => {
  try {
    if (!Career) return res.json([]);
    const jobs = await Career.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/careers — Admin: add new opening
router.post('/', auth, async (req, res) => {
  try {
    if (!Career) return res.status(503).json({ error: 'Database not connected.' });
    const { title, department, location, type, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required.' });
    const job = new Career({ title, department, location, type, description });
    await job.save();
    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/careers/:id — Admin: remove opening
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!Career) return res.status(503).json({ error: 'Database not connected.' });
    await Career.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
