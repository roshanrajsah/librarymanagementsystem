const API_BASE = '/api';

// --- AUTHENTICATION ---
async function loginUser(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

// --- AUTHORS ---
async function getAuthors() {
  const res = await fetch(`${API_BASE}/user/authors`);
  return res.json();
}

async function addAuthor(name, bio) {
  const res = await fetch(`${API_BASE}/admin/authors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, bio })
  });
  return res.json();
}

// --- BOOKS ---
async function getBooks() {
  const res = await fetch(`${API_BASE}/user/books`);
  return res.json();
}

async function addBook(bookData) {
  const res = await fetch(`${API_BASE}/admin/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  return res.json();
}
