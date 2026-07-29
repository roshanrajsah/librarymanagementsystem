const user = JSON.parse(localStorage.getItem('user') || 'null');
if (!user || user.role !== 'user') window.location.replace('/login');
const active = document.body.dataset.page;
const sidebar = document.getElementById('sidebar');
if (sidebar) sidebar.innerHTML = `<a class="brand" href="/user/books">Library<span>Hub</span></a><nav><a href="/user/books" class="${active === 'books' ? 'active' : ''}">Browse books</a><a href="/user/borrowed" class="${active === 'borrowed' ? 'active' : ''}">My borrowed books</a><a href="/user/profile" class="${active === 'profile' ? 'active' : ''}">My profile</a></nav><div class="sidebar-user"><strong>${user.firstName} ${user.lastName}</strong><small>Library member</small><button id="logoutButton">Sign out</button></div>`;
document.getElementById('logoutButton')?.addEventListener('click', () => { localStorage.clear(); location.href = '/'; });
function toast(message, type = 'success') { const el = document.createElement('div'); el.className = `toast ${type}`; el.textContent = message; document.body.append(el); setTimeout(() => el.remove(), 3000); }
