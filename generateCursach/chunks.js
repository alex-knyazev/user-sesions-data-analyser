const Decimal = require('decimal.js');

class ChunksGaussianParamsCreator {
  constructor(chunks) {
    this.featuresParams = {};
    const features = chunks.map(ch => {
      return new ChunksFeaturesCreator(ch);
    });
    const featuresPrefixes = [
      'includeCollectionsAll',
      'includeCollectionsMyWant',
      'includeCollectionsMyTried',
      'includeArticlesPopular',
      'includeArticlesNew',
      'includeArticle',
      'includeGroupsMy',
      'includeSetting',
      'includeTeaMapChina',
      'includeTea',
      'routesAmount',
      'durationByStart',
    ];

    for (let i = 0; i < featuresPrefixes.length; i++) {
      const feature = featuresPrefixes[i];
      const [mu, sigma] = this.findGaussianParams(features.map(s => s[feature]));
      this.featuresParams[feature] = {};
      this.featuresParams[feature].mean = mu;
      this.featuresParams[feature].variance = sigma;
    }
  }

  findGaussianParams(values) {
    const summValues = values.reduce((cur, val) => cur.add(val), new Decimal(0));
    const mu = parseFloat(summValues.mul(new Decimal(1).div(values.length)).toString());

    const summForSigma = values.reduce(
      (cur, val) => cur.add(Math.pow(val - mu, 2)),
      new Decimal(0),
    );
    const sigma = parseFloat(
      new Decimal(1)
        .div(values.length)
        .mul(summForSigma)
        .toString(),
    );

    return [mu, sigma];
  }

  findChunkProbability(chunk) {
    const { featuresParams } = this;

    const chunkFeaturesValues = new ChunksFeaturesCreator(chunk);

    const featuresParamsKeys = Object.keys(featuresParams);
    const chunkParamsProbabilities = featuresParamsKeys.map(paramName => {
      const { mean, variance } = featuresParams[paramName];

      const formulaStep1 = new Decimal(1).div(
        new Decimal(2)
          .mul(Math.PI)
          .mul(variance)
          .sqrt(),
      );
      const formulaStep2 = new Decimal(chunkFeaturesValues[paramName]).sub(mean).pow(2);
      const formulaStem3 = new Decimal(2).mul(variance);
      const formulastep4 = new Decimal(-1).mul(formulaStep2.div(formulaStem3)).exp();

      let result = formulaStep1.mul(formulastep4);
      if (result > 1) {
        result = 0.99;
      }
      return result;
    });

    let chunkProbability = new Decimal(chunkParamsProbabilities[0]);
    for (let i = 1; i < chunkParamsProbabilities.length; i++) {
      const px = chunkParamsProbabilities[i];
      chunkProbability = chunkProbability.mul(px);
    }
  }
}

/**
 * class to describe features for one chunk analysis
 */
class ChunksFeaturesCreator {
  constructor(chunk) {
    const { routes, durationByStart } = chunk;
    this.routes = routes;
    this.includeCollectionsAll = this.getRouteInChunk('collections/all');
    this.includeCollectionsMyWant = this.getRouteInChunk('collections/my/want');
    this.includeCollectionsMyTried = this.getRouteInChunk('collections/my/tried');

    this.includeArticlesPopular = this.getRouteInChunk('articles/popular');
    this.includeArticlesNew = this.getRouteInChunk('articles/new');
    this.includeArticle = this.getRouteInChunk('article');

    this.includeGroupsMy = this.getRouteInChunk('groups/my');

    this.includeSetting = this.getRouteInChunk('settings');

    this.includeTeaMapChina = this.getRouteInChunk('teaMap/china');
    this.includeTea = this.getRouteInChunk('tea');

    this.routesAmount = routes.length;
    this.durationByStart = durationByStart;
  }

  getRouteInChunk(route) {
    const found = this.routes.find(r => r === route);
    if (found) {
      return 1;
    } else {
      return 0;
    }
  }
}

module.exports = ChunksGaussianParamsCreator;
