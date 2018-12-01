var express = require("express");
var router = express.Router();

const SessionAnalysisResult = require("../models/sessionAnalysisResult");
const { routesArray } = require("../analyser/allRoutes");

/* GET users listing. */
router.get("/", async function(req, res, next) {
  const { accurancy } = req.query;
  const analisysWithLastVersion = await SessionAnalysisResult.find({})
    .sort({ version: -1 })
    .limit(1);

  let lastVersion = await analisysWithLastVersion[0].version;
  const resultsOfLastVersion = await SessionAnalysisResult.find({
    probability: {
      $gt: parseFloat(accurancy)
    },
    version: lastVersion
  })
    .populate("user")
    .populate("session");

  const popularRoutes = {};
  for (let i = 0; i < resultsOfLastVersion.length; i++) {
    const res = resultsOfLastVersion[i];
    const {
      session: { routes }
    } = res;
    for (let j = 0; j < routes.length; j++) {
      const route = routes[j].name;
      if (!popularRoutes[route]) {
        popularRoutes[route] = 1;
      } else {
        popularRoutes[route] = popularRoutes[route] + 1;
      }
    }
  }
  res.send(popularRoutes);
});

module.exports = router;
