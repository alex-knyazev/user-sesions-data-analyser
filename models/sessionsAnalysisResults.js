const mongoose = require('mongoose');

const sessionAnalysisResult = new mongoose.Schema({
  probability: Number,
  userSessions: [mongoose.Schema.Types.ObjectId],
  users: [mongoose.Schema.Types.ObjectId],
  mean: Number,
  variance: Number,
  usedAnomalyProbability: Number,
  isAnomaly: Boolean,
});

module.exports = sessionAnalysisResult;
