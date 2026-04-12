/**
 * backend/routes/upload.js
 * ─────────────────────────────────────────────────────────────────────────────
 * POST /api/upload  — Upload a single image to Cloudinary (admin only).
 *
 * Strategy:
 *  • multer stores the incoming file in memory (no disk write).
 *  • The buffer is piped to Cloudinary via an upload_stream.
 *  • On success the route returns { success: true, url: <cloudinary_secure_url> }.
 *
 * The returned URL is a full https:// Cloudinary URL, so the existing
 * resolveImageUrl() helper in js/api.js passes it through unchanged.
 * Old images stored as /uploads/... relative paths still work because
 * resolveImageUrl() already prepends BACKEND_BASE for relative paths.
 */

const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const cloudinary = require('../config/cloudinary');
const auth     = require('../middleware/auth');

// ── Multer: keep file in memory, never touch disk ────────────────────────────
const memStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp, gif, svg).'), false);
  }
};

const upload = multer({
  storage   : memStorage,
  fileFilter,
  limits    : { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// ── POST /api/upload ─────────────────────────────────────────────────────────
router.post('/', auth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }

  console.log('[BNR Upload] Uploading to Cloudinary...');

  try {
    // Pipe the in-memory buffer to Cloudinary using a promise wrapper
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder        : 'bnr-infrastructure', // organises assets in Cloudinary
          resource_type : 'image',
          // Use the original filename (without extension) as the public_id suffix
          // so names are human-readable in the Cloudinary Media Library.
          use_filename      : true,
          unique_filename   : true,
          overwrite         : false,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    console.log('[BNR Upload] URL:', result.secure_url);

    return res.status(201).json({
      success  : true,
      url      : result.secure_url,  // full https:// Cloudinary URL — never disappears
      filename : result.public_id,
    });

  } catch (err) {
    console.error('[BNR Upload] Cloudinary error:', err.message);
    return res.status(500).json({ error: 'Image upload to Cloudinary failed: ' + err.message });
  }
});

// ── Multer error handler ─────────────────────────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
