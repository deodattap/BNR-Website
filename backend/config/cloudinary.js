/**
 * backend/config/cloudinary.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Initialises and exports the Cloudinary v2 SDK instance used by the upload
 * route.  All credentials are read from environment variables so that nothing
 * sensitive is hard-coded.
 *
 * Required env vars (add to backend/.env AND Render environment):
 *   CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   CLOUDINARY_API_KEY=your_api_key
 *   CLOUDINARY_API_SECRET=your_api_secret
 */

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key    : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
