const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const auth    = require('../middleware/auth');
const { body } = require('express-validator');
const validate  = require('../middleware/validate');

let Application;
try { Application = require('../models/Application'); } catch(e) {}

// ── Resume upload (public — applicants are not logged in) ──────────────
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename:    (_req, file,  cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext    = path.extname(file.originalname).toLowerCase();
    cb(null, 'resume-' + unique + ext);
  }
});

const resumeFilter = (_req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext     = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext)
    ? cb(null, true)
    : cb(new Error('Only PDF, DOC, or DOCX files are accepted.'), false);
};

const uploadResume = multer({
  storage:   resumeStorage,
  fileFilter: resumeFilter,
  limits:    { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// Validation rules
const appRules = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required.'),
];

// POST /api/applications — Public — submit job application (with or without resume)
router.post('/', uploadResume.single('resume'), appRules, validate, async (req, res) => {
  try {
    if (!Application) return res.status(503).json({ error: 'Database not connected.' });

    const { name, email, phone, jobTitle, jobId } = req.body;
    const resumeUrl          = req.file ? '/uploads/' + req.file.filename : null;
    const resumeOriginalName = req.file ? req.file.originalname : null;

    const app = new Application({ name, email, phone, jobTitle, jobId: jobId || null, resumeUrl, resumeOriginalName });
    await app.save();

    res.status(201).json({ success: true, message: 'Application submitted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// GET /api/applications — Admin only — list all applications
router.get('/', auth, async (req, res) => {
  try {
    if (!Application) return res.json([]);
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/applications/:id — Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!Application) return res.status(503).json({ error: 'Database not connected.' });
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Multer error handler
router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Upload error.' });
});

module.exports = router;
