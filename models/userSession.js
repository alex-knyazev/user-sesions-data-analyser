const mongoose = require("mongoose");

const userSession = new mongoose.Schema({
  routes: [
    {
      visitAt: Date,
      name: String
    }
  ],
  meanStepDuration: Number,
  sessionDuration: Number,
  user: mongoose.Schema.Types.ObjectId
});

const UserSession = mongoose.model("UserSession", userSession);

module.exports = UserSession;
