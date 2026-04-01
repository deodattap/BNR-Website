/**
 * BNR Infrastructure – Shared API Helper
 * Centralized API base URL for deployed backend on Render.
 */

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://bnr-backend-93y5.onrender.com/api';

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
