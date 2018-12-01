const mongoose = require("mongoose");

const sessionAnalysisResult = new mongoose.Schema({
  probability: Number,
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSession"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  version: Number
});

const SessionAnalysisResult = mongoose.model(
  "SessionAnalysisResult",
  sessionAnalysisResult
);

module.exports = SessionAnalysisResult;
