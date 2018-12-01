const UserSession = require('../models/userSession');

async function saveSession(session, user) {
  let steps = [];
  for (let i = 1; i < session.length; i++) {
    const previousVisit = new Date(session[i - 1].visitAt);
    const currentVisit = new Date(session[i].visitAt);
    const stepSeconds = (currentVisit - previousVisit) / 1000;
    steps.push(stepSeconds);
  }

  const sessionDuration = steps.reduce((current, step) => current + step, 0);
  const meanStepDuration = sessionDuration / steps.length;

  const newUserSessionData = {
    routes: session,
    meanStepDuration,
    sessionDuration,
    user: user.id,
  };
  
  const newUserSession = new UserSession(newUserSessionData);
  result = newUserSession.save();
  
  return result;
}

module.exports = saveSession;
