const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('The login endpoint did not return JSON.');
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Invalid username or password.');

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = data.user.role === 'admin' ? '/dashboard' : '/user/books';
  } catch (error) {
    console.error('Login error:', error);
    alert(error.message || 'Unable to log in. Please try again.');
  }
});
