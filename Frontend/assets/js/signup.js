document.getElementById('signupForm').addEventListener('submit', async event => {
  event.preventDefault();
  const body = Object.fromEntries(['firstName','lastName','username','password','phoneNumber','gender','address'].map(id => [id, document.getElementById(id).value.trim()]));
  try { const response = await fetch('/api/auth/signup', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); localStorage.setItem('isLoggedIn','true'); localStorage.setItem('user',JSON.stringify(data.user)); window.location.href='/user/books'; } catch(error) { alert(error.message || 'Unable to create account.'); }
});
