async function loadAuthors() {
  try { const authors = await api.get('/authors'); document.getElementById('authorRows').innerHTML = authors.map(author => `<tr><td>${author.name}</td><td>${author.bio || '—'}</td><td class="actions"><a class="link-button" href="/author-add-edit?id=${author.id}">Edit</a><button class="link-button" data-delete="${author.id}">Delete</button></td></tr>`).join('') || '<tr><td colspan="3" class="empty">No authors added yet.</td></tr>'; } catch (error) { toast(error.message, 'error'); }
}
document.getElementById('authorRows').addEventListener('click', async event => { const id = event.target.dataset.delete; if (!id || !confirm('Delete this author?')) return; try { await api.delete(`/authors/${id}`); toast('Author deleted.'); loadAuthors(); } catch (error) { toast(error.message, 'error'); } });
loadAuthors();
