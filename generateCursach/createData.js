const mongoose = require('mongoose');
const fs = require('fs');

const createChunk = require('./routes.js');

const users = require('./users.js');

let newUsers = users.map(user => {
  const chunksAmount = Math.random() * 10 + 1;
  const chunks = [];
  for (let i = 0; i < chunksAmount; i++) {
    const chunk = createChunk();
    chunks.push(chunk);
  }
  const { email, gender, phone_number, birthdate, first_name, last_name, picture: avatar } = user;
  return {
    id: mongoose.Types.ObjectId(),
    email,
    sessions: chunks,
  };
});

fs.writeFile('./myusers.js', JSON.stringify(newUsers, null, 2), err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('File has been created');
});
