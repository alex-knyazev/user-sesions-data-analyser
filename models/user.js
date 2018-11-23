const mongoose = require('mongoose');

const user = new mongoose.Schema({
  email: String,
});

const User = mongoose.model('User', user);

module.exports = User;
