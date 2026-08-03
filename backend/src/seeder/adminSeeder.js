const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  if (await User.findByUsername('admin')) return;

  await User.create({
    username: 'admin',
    password: await bcrypt.hash('admin123', 10),
    firstName: 'Admin',
    lastName: 'User',
    gender: 'Other',
    phoneNumber: '0000000000',
    address: 'Library Administration',
    role: 'admin'
  });

  console.log('Default admin user created: admin / admin123');
};

module.exports = seedAdmin;
