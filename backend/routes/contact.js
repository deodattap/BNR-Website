const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { sendMail } = require('../utils/mailer');

// Validation rules for contact form
const contactRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters.'),
  body('phone')
    .optional({ checkFalsy: true })
    .isMobilePhone().withMessage('Please provide a valid phone number.'),
];

// POST /api/contact — Submit contact form
router.post('/', contactRules, validate, async (req, res) => {
  try {
    const { name, email, phone, projectType, message } = req.body;

    const contact = new Contact({ name, email, phone, projectType, message });
    await contact.save();

    // Send email notification (non-blocking, errors are logged not thrown)
    await sendMail({
      subject: `📩 New Contact Message from ${name}`,
      html: `
        <h2 style="color:#1a3a5c;">New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;">
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>Name</b></td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>Email</b></td><td style="padding:8px;border:1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>Phone</b></td><td style="padding:8px;border:1px solid #ddd;">${phone || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>Project Type</b></td><td style="padding:8px;border:1px solid #ddd;">${projectType || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>Message</b></td><td style="padding:8px;border:1px solid #ddd;">${message}</td></tr>
        </table>
        <p style="color:#888;font-size:12px;margin-top:16px;">Submitted via BNR Infrastructure website</p>
      `,
    });

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
