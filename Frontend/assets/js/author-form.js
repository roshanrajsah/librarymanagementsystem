const authorId = queryId();
const authorName = document.getElementById('name');
const authorBio = document.getElementById('bio');
async function loadAuthor() { if (!authorId) return; const author = await api.get(`/authors/${authorId}`); authorName.value = author.name; authorBio.value = author.bio || ''; document.getElementById('formTitle').textContent = 'Edit author'; }
document.getElementById('authorForm').addEventListener('submit', async event => { event.preventDefault(); try { const body = JSON.stringify({ name: authorName.value.trim(), bio: authorBio.value.trim() }); await (authorId ? api.put(`/authors/${authorId}`, body) : api.post('/authors', body)); toast('Author saved.'); window.location.href = '/authors'; } catch (error) { toast(error.message, 'error'); } });
loadAuthor().catch(error => toast(error.message, 'error'));
