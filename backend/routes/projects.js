const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET /api/projects — Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/projects — Add a project (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, image, location, year, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Project title is required.' });
    }

    const project = new Project({ title, description, image, location, year, category });
    await project.save();

    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/projects/:id — Update a project (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/projects/:id — Delete a project (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
