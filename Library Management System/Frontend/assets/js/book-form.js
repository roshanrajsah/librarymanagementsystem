const bookId = queryId();
const bookTitle = document.getElementById('title');
const authorSelect = document.getElementById('authorId');
const genreSelect = document.getElementById('genreId');
const stockInput = document.getElementById('stock');
async function setOptions() {
  const [authors, genres] = await Promise.all([api.get('/authors'), api.get('/genres')]);
  authorSelect.innerHTML = '<option value="">Select an author</option>' + authors.map(item => `<option value="${item.id}">${item.name}</option>`).join('');
  genreSelect.innerHTML = '<option value="">Select a genre</option>' + genres.map(item => `<option value="${item.id}">${item.name}</option>`).join('');
}
async function loadBookForm() { await setOptions(); if (!bookId) return; const book = await api.get(`/books/${bookId}`); bookTitle.value = book.title; authorSelect.value = book.author_id; genreSelect.value = book.genre_id; stockInput.value = book.stock; document.getElementById('formTitle').textContent = 'Edit book'; document.getElementById('saveButton').textContent = 'Save changes'; }
document.getElementById('bookForm').addEventListener('submit', async event => { event.preventDefault(); try { const data = new FormData(event.currentTarget); if (!data.get('title') || !data.get('authorId') || !data.get('genreId')) throw new Error('Complete all required fields.'); await (bookId ? api.put(`/books/${bookId}`, data) : api.post('/books', data)); toast('Book saved.'); window.location.href = '/books'; } catch (error) { toast(error.message, 'error'); } });
loadBookForm().catch(error => toast(error.message, 'error'));
