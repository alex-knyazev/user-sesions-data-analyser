var express = require('express');
var router = express.Router();

// const dataSessions = require('../data.js');
// const randomUserIndex = Math.floor(Math.random() * dataSessions.length);
// const userData = dataSessions[randomUserIndex];
const User = require('../models/user');

const saveUser = require('../controllers/saveUser');
const saveSession = require('../controllers/saveSession');

/* GET users listing. */
router.post('/', async function(req, res, next) {
  const { session, user: { id, email } } = req.body;
  let user = await User.findById(id);
  if(!user) {
    user  = await saveUser(id, email);
  }

  await saveSession(session, user);

  res.send({result: 'success'});
});

module.exports = router;
