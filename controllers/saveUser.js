const User = require('../models/user');

async function saveUser(id, email) {
  const newUser = new User({ id, email });
  const result = await newUser.save();
  return result;
}

module.exports = saveUser;
