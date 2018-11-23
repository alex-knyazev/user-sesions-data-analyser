var express = require('express');
var router = express.Router();

const dataSessions = require('../data.js');
const randomUserIndex = Math.floor(Math.random() * dataSessions.length);
const userData = dataSessions[randomUserIndex];

const saveUser = require('../controllers/saveUser');
const saveSessions = require('../controllers/saveSessions');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  // const sessions = req.body.sessions;
  const { sessions, id, email } = userData;

  const user = await saveUser(id, email);
  const newSessions = await saveSessions(sessions, user);

  debugger;

  res.send('respond with a resource');
});

module.exports = router;
