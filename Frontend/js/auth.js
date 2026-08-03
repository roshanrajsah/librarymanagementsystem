// Reliable Auth Guard & Session Handler
const AuthGuard = {
  checkAuth: function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
      window.location.href = 'login.html';
    }
  },

  login: async function (username, password) {
    // Direct, reliable credentials check
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ name: 'Admin User', email: 'admin@library.com' }));
      return true;
    }
    return false;
  },

  logout: function () {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
};