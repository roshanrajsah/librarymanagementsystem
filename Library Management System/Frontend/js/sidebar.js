// Dynamic sidebar renderer across pages
function renderSidebar(activePage) {
  const sidebarHTML = `
    <div class="sidebar-brand">📚 LMS Portal</div>
    <ul class="sidebar-menu">
      <li><a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
      <li><a href="books.html" class="${activePage === 'books' ? 'active' : ''}">Book List</a></li>
      <li><a href="book-add-edit.html" class="${activePage === 'book-form' ? 'active' : ''}">Add Book</a></li>
      <li><a href="authors.html" class="${activePage === 'authors' ? 'active' : ''}">Authors</a></li>
      <li><a href="genres.html" class="${activePage === 'genres' ? 'active' : ''}">Genres</a></li>
      <li><a href="profile.html" class="${activePage === 'profile' ? 'active' : ''}">My Profile</a></li>
      <li><a href="#" id="logoutBtn" style="color: #f87171;">Logout</a></li>
    </ul>
  `;
  
  const container = document.getElementById('sidebar-container');
  if (container) {
    container.innerHTML = sidebarHTML;
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      AuthGuard.logout();
    });
  }
}