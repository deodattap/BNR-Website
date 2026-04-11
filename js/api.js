/**
 * BNR Infrastructure – Shared API Helper
 * Centralized API base URL for deployed backend on Render.
 */

const _isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE     = _isLocal ? 'http://localhost:5000/api' : 'https://bnr-backend-93y5.onrender.com/api';
/** Backend root (without /api) — used to resolve relative /uploads/... image paths */
const BACKEND_BASE = _isLocal ? 'http://localhost:5000'     : 'https://bnr-backend-93y5.onrender.com';

// Admin token helper
const getToken = () => localStorage.getItem('bnr_admin_token');

// ── Contact ──
async function postContact(data) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  });
  return res.json();
}
async function fetchMessages() {
  try {
    const res = await fetch(`${API_BASE}/contact`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

// ── Quote ──
async function postQuote(data) {
  const res = await fetch(`${API_BASE}/quote`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  });
  return res.json();
}
async function fetchQuotes() {
  try {
    const res = await fetch(`${API_BASE}/quote`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

// ── Projects ──
async function fetchProjects() {
  try { const res = await fetch(`${API_BASE}/projects`); return res.ok ? res.json() : []; } catch { return []; }
}
async function createProject(data) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(data)
  });
  return res.json();
}
async function deleteProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
  return res.json();
}

// ── Clients ──
async function fetchClients() {
  try { const res = await fetch(`${API_BASE}/clients`); return res.ok ? res.json() : []; } catch { return []; }
}
async function createClient(data) {
  const res = await fetch(`${API_BASE}/clients`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(data)
  });
  return res.json();
}
async function deleteClient(id) {
  const res = await fetch(`${API_BASE}/clients/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
  return res.json();
}

// ── Careers ──
async function fetchCareers(adminAll = false) {
  try {
    const url = adminAll ? `${API_BASE}/careers/all` : `${API_BASE}/careers`;
    const headers = adminAll ? { 'Authorization': `Bearer ${getToken()}` } : {};
    const res = await fetch(url, { headers });
    return res.ok ? res.json() : [];
  } catch { return []; }
}
async function createCareer(data) {
  const res = await fetch(`${API_BASE}/careers`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(data)
  });
  return res.json();
}
async function deleteCareer(id) {
  const res = await fetch(`${API_BASE}/careers/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
  return res.json();
}

// ── Admin ──
async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password })
  });
  return res.json();
}

// ── Applications ──
async function postApplication(formData) {
  // formData is a FormData object (multipart — includes resume file)
  try {
    const res = await fetch(`${API_BASE}/applications`, { method: 'POST', body: formData });
    return res.json();
  } catch { return { error: 'Network error. Check your connection.' }; }
}
async function fetchApplications() {
  try {
    const res = await fetch(`${API_BASE}/applications`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}
async function deleteApplication(id) {
  const res = await fetch(`${API_BASE}/applications/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
  return res.json();
}

/**
 * resolveImageUrl — safely prepend BACKEND_BASE when a stored image path
 * is relative (e.g. /uploads/file.jpg).  Absolute URLs are returned as-is.
 * @param {string} url
 * @returns {string}
 */
function resolveImageUrl(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : BACKEND_BASE + url;
}

// ── Keep-alive ping ──────────────────────────────────────────────────────────
// Pings the health endpoint every 5 minutes so the Render free-tier backend
// does not go to sleep between user visits.
(function startKeepAlive() {
  // Only ping the production backend (not localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;
  setInterval(function () {
    fetch(API_BASE + '/health').catch(function () { /* silent — best-effort */ });
  }, 300000); // every 5 minutes
}());
