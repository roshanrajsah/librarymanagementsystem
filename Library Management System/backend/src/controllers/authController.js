const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide both username and password.' });
  }

  try {
    const user = await User.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    return res.json({
      message: 'Login successful.',
      user: {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        gender: user.gender,
        phoneNumber: user.phone_number,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to log in right now.' });
  }
};

exports.signup = async (req, res) => {
  const { username, password, firstName, lastName, gender, phoneNumber, address } = req.body;
  if (!username || !password || !firstName || !lastName) return res.status(400).json({ error: 'Username, password, first name, and last name are required.' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must contain at least 6 characters.' });
  try {
    if (await User.findByUsername(username.trim())) return res.status(409).json({ error: 'That username is already in use.' });
    const user = await User.create({ username: username.trim(), password: await bcrypt.hash(password, 10), firstName: firstName.trim(), lastName: lastName.trim(), gender: gender || '', phoneNumber: phoneNumber || '', address: address || '', role: 'user' });
    return res.status(201).json({ message: 'Account created.', user: User.publicUser({ id: user.id, username: user.username, first_name: user.firstName, last_name: user.lastName, gender: user.gender, phone_number: user.phoneNumber, address: user.address, role: user.role }) });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to create your account right now.' });
  }
};
