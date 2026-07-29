const page = document.body.dataset.page;
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (page !== 'login' && !localStorage.getItem('isLoggedIn')) window.location.replace('/login');

const navItems = [
  ['dashboard', 'Dashboard'], ['books', 'Books'], ['book-add-edit', 'Add Book'],
  ['authors', 'Authors'], ['genres', 'Genres'], ['profile', 'My Profile']
];
const sidebar = document.getElementById('sidebar');
if (sidebar) {
  sidebar.innerHTML = `<a class="brand" href="/dashboard">Library<span>Hub</span></a>
    <nav>${navItems.map(([key, label]) => `<a href="/${key}" class="${page === key ? 'active' : ''}">${label}</a>`).join('')}</nav>
    <div class="sidebar-user"><strong>${user ? `${user.firstName} ${user.lastName}` : 'Library user'}</strong><small>${user?.role || ''}</small><button id="logoutButton">Sign out</button></div>`;
  document.getElementById('logoutButton').addEventListener('click', () => { localStorage.clear(); window.location.href = '/'; });
}

function toast(message, type = 'success') {
  const element = document.createElement('div');
  element.className = `toast ${type}`;
  element.textContent = message;
  document.body.append(element);
  setTimeout(() => element.remove(), 3000);
}

function queryId() { return new URLSearchParams(window.location.search).get('id'); }
