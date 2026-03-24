/**
 * BNR Infrastructure – Shared API Helper
 * Detects localhost vs production automatically.
 */

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://bnr-infrastructure.onrender.com/api'; // ← Replace with your Render URL after deployment

// Admin token helper
const getToken = () => localStorage.getItem('bnr_admin_token');

// ── Contact ──
async function postContact(data) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ── Quote ──
async function postQuote(data) {
  const res = await fetch(`${API_BASE}/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ── Projects ──
async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

async function createProject(data) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function deleteProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

// ── Clients ──
async function fetchClients() {
  const res = await fetch(`${API_BASE}/clients`);
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
}

async function createClient(data) {
  const res = await fetch(`${API_BASE}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function deleteClient(id) {
  const res = await fetch(`${API_BASE}/clients/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

// ── Admin ──
async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

async function fetchMessages() {
  const res = await fetch(`${API_BASE}/contact`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

async function fetchQuotes() {
  const res = await fetch(`${API_BASE}/quote`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}
