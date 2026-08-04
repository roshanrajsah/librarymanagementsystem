const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
const profileFields = Object.fromEntries(['firstName', 'lastName', 'gender', 'phoneNumber', 'address'].map(key => [key, document.getElementById(key)]));

async function loadProfile() {
  try {
    const user = await api.get(`/users/${currentUser.id}`);
    Object.entries(profileFields).forEach(([key, field]) => field.value = user[key] || '');
    document.getElementById('username').value = user.username || '';
    document.getElementById('role').value = user.role || '';
    document.getElementById('profileName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('profileMeta').textContent = `${user.role} · @${user.username}`;
  } catch (error) { toast(error.message, 'error'); }
}

document.getElementById('profileForm').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const body = JSON.stringify({ firstName: profileFields.firstName.value.trim(), lastName: profileFields.lastName.value.trim(), gender: profileFields.gender.value, phoneNumber: profileFields.phoneNumber.value.trim(), address: profileFields.address.value.trim() });
    const user = await api.put(`/users/${currentUser.id}`, body);
    localStorage.setItem('user', JSON.stringify(user));
    toast('Profile updated.');
    loadProfile();
  } catch (error) { toast(error.message, 'error'); }
});

loadProfile();
