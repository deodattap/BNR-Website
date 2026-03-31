const nodemailer = require('nodemailer');

/**
 * Creates a reusable transporter using SMTP settings from .env.
 * Works with Gmail (with App Password) or any SMTP provider.
 */
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

/**
 * Sends an email notification.
 * Errors are caught and logged — never throws so the calling route won't crash.
 *
 * @param {Object} options
 * @param {string} options.subject  - Email subject
 * @param {string} options.html     - HTML body content
 */
const sendMail = async ({ subject, html }) => {
  // Skip silently if email credentials are not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  Email not sent: SMTP_USER / SMTP_PASS not set in .env');
    return;
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"BNR Infrastructure" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
      subject,
      html,
    });
    console.log(`✉️  Email sent: ${info.messageId}`);
  } catch (err) {
    console.error('⚠️  Email send failed (non-fatal):', err.message);
  }
};

module.exports = { sendMail };
