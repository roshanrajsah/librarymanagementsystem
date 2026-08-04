const fields = Object.fromEntries(['firstName', 'lastName', 'gender', 'phoneNumber', 'address'].map(key => [key, document.getElementById(key)]));

async function loadProfile() {
  const res = await fetch(`/api/users/${user.id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Unable to load profile.');
  Object.entries(fields).forEach(([key, element]) => element.value = data[key] || '');
  document.getElementById('username').value = data.username || '';
  document.getElementById('role').value = data.role || '';
  document.getElementById('profileName').textContent = `${data.firstName} ${data.lastName}`;
  document.getElementById('profileMeta').textContent = `${data.role} · @${data.username}`;
}

document.getElementById('profileForm').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const body = Object.fromEntries(Object.entries(fields).map(([key, element]) => [key, element.value.trim()]));
    const res = await fetch(`/api/users/${user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('user', JSON.stringify(data));
    toast('Profile updated.');
    loadProfile().catch(error => toast(error.message, 'error'));
  } catch (error) { toast(error.message, 'error'); }
});

loadProfile().catch(error => toast(error.message, 'error'));
