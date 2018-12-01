const mongoose = require("mongoose");

const SessionsGaussianParamsCreator = require("./SessionsGaussianParamsCreator");
const UserSession = require("../models/userSession");
const SessionAnalysisResult = require("../models/sessionAnalysisResult");

const dbConnection = mongoose.connect(
  "mongodb://localhost:27017/routes-analyser"
);

const analyse = async () => {
  const allSessions = await UserSession.find({});
  const sessionsGaussianParamsCreator = new SessionsGaussianParamsCreator(
    allSessions
  );

  const analisysWithLastVersion = await SessionAnalysisResult.find({})
    .sort({
      version: -1
    })
    .limit(1);

  let lastVersion = 0;
  if (analisysWithLastVersion.length) {
    lastVersion = await analisysWithLastVersion[0].version;
  }

  const newVersion = lastVersion + 1;
  sessionsProbabilities = allSessions.map(session => {
    const p = sessionsGaussianParamsCreator.findSessionProbability(session);
    return {
      session: session.id,
      user: session.user,
      probability: p,
      version: newVersion
    };
  });
  SessionAnalysisResult.insertMany(sessionsProbabilities);
};

analyse();
