const genreId = queryId();
const genreName = document.getElementById('name');
const genreDescription = document.getElementById('description');
async function loadGenre() { if (!genreId) return; const genre = await api.get(`/genres/${genreId}`); genreName.value = genre.name; genreDescription.value = genre.description || ''; document.getElementById('formTitle').textContent = 'Edit genre'; }
document.getElementById('genreForm').addEventListener('submit', async event => { event.preventDefault(); try { const body = JSON.stringify({ name: genreName.value.trim(), description: genreDescription.value.trim() }); await (genreId ? api.put(`/genres/${genreId}`, body) : api.post('/genres', body)); toast('Genre saved.'); window.location.href = '/genres'; } catch (error) { toast(error.message, 'error'); } });
loadGenre().catch(error => toast(error.message, 'error'));
