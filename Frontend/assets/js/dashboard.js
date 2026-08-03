async function loadDashboard() {
  try {
    const [books, authors, genres] = await Promise.all([api.get('/books'), api.get('/authors'), api.get('/genres')]);
    document.getElementById('bookCount').textContent = books.length;
    document.getElementById('authorCount').textContent = authors.length;
    document.getElementById('genreCount').textContent = genres.length;
    document.getElementById('recentBooks').innerHTML = books.slice(0, 5).map(book => `<tr><td>${book.title}</td><td>${book.author_name}</td><td>${book.genre_name}</td><td><span class="badge">${book.stock} in stock</span></td><td><a class="link-button" href="/book-view?id=${book.id}">View</a></td></tr>`).join('') || '<tr><td colspan="5" class="empty">No books yet. Add your first book to get started.</td></tr>';
  } catch (error) { toast(error.message, 'error'); }
}
loadDashboard();
