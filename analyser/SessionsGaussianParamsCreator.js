const Decimal = require("decimal.js");

const { routesArray } = require("./allRoutes");
const allRoutesNames = routesArray.map(r => r.name);

class SessionsGaussianParamsCreator {
  constructor(sessions) {
    const features = sessions.map(s => {
      return new SessionFeaturesCreator(s);
    });

    this.features = features;

    const featuresKeys = Object.keys(features[0]);
    this.featuresGaussianParams = {};

    for (let i = 0; i < featuresKeys.length; i++) {
      const featureName = featuresKeys[i];
      const allFeatureValues = features.map(feature => feature[featureName]);
      const [mu, sigma] = this.findGaussianParams(allFeatureValues);
      this.featuresGaussianParams[featureName] = {};
      this.featuresGaussianParams[featureName].mean = mu;
      this.featuresGaussianParams[featureName].variance = sigma;
    }
  }

  findGaussianParams(values) {
    const summValues = values.reduce(
      (cur, val) => cur.add(val),
      new Decimal(0)
    );
    const mean = parseFloat(
      summValues.mul(new Decimal(1).div(values.length)).toString()
    );

    const summForVariance = values.reduce(
      (cur, val) => cur.add(Math.pow(val - mean, 2)),
      new Decimal(0)
    );
    const variance = parseFloat(
      new Decimal(1)
        .div(values.length)
        .mul(summForVariance)
        .toString()
    );

    return [mean, variance];
  }

  findSessionProbability(session) {
    const { featuresGaussianParams } = this;

    const featuresValues = new SessionFeaturesCreator(session);

    const featuresParamsKeys = Object.keys(featuresGaussianParams);

    const sessionParamsProbabilities = featuresParamsKeys.map(paramName => {
      let { mean, variance } = featuresGaussianParams[paramName];
      if (mean === 0) {
        mean = new Decimal(0.01);
      }
      if (variance === 0) {
        variance = new Decimal(0.01);
      }
      const formulaStep1 = new Decimal(1).div(
        new Decimal(2)
          .mul(Math.PI)
          .mul(variance)
          .sqrt()
      );
      const formulaStep2 = new Decimal(featuresValues[paramName])
        .sub(mean)
        .pow(2);
      const formulaStem3 = new Decimal(2).mul(variance);
      const formulastep4 = new Decimal(-1)
        .mul(formulaStep2.div(formulaStem3))
        .exp();

      let result = formulaStep1.mul(formulastep4).toNumber();
      if (result > 1) {
        result = 0.99;
      }
      return result;
    });

    let chunkProbability = new Decimal(sessionParamsProbabilities[0]);
    for (let i = 1; i < sessionParamsProbabilities.length; i++) {
      const px = sessionParamsProbabilities[i];
      chunkProbability = chunkProbability.mul(px);
    }
    const result = chunkProbability.toNumber();
    return result;
  }
}

/**
 * class to describe features for one session analysis
 */
class SessionFeaturesCreator {
  constructor(chunk) {
    const { routes, sessionDuration, meanStepDuration } = chunk;

    for (let i = 0; i < allRoutesNames.length; i++) {
      const routeName = allRoutesNames[i];
      this["include_" + routeName] = this.getRouteInChunk(routes, routeName);
    }

    this.routesAmount = routes.length;
    this.sessionDuration = sessionDuration;
    this.meanStepDuration = meanStepDuration;
  }

  getRouteInChunk(routes, routeName) {
    const found = routes.find(r => r.name === routeName);
    if (found) {
      return 1;
    } else {
      return 0;
    }
  }
}

module.exports = SessionsGaussianParamsCreator;
