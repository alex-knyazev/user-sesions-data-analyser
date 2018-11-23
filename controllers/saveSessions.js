const UserSession = require('../models/userSession');

async function saveSessions(sessions, user) {
  const newUserSessions = [];
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    let steps = [];
    for (let j = 1; j < session.routes.length; j++) {
      const previousVisit = new Date(session.routes[j - 1].visitAt);
      const currentVisit = new Date(session.routes[j].visitAt);
      const stepSeconds = (currentVisit - previousVisit) / 1000;
      steps.push(stepSeconds);
    }
    const sessionDuration = steps.reduce((current, step) => current + step, 0);
    const meanStepDuration = sessionDuration / steps.length;
    const newUserSession = {
      routes: sessions[i].routes,
      meanStepDuration,
      sessionDuration,
      user: user.id,
    };
    newUserSessions.push(newUserSession);
  }
  const results = await UserSession.insertMany(newUserSessions);
  return results;
}

module.exports = saveSessions;
