const users = require('./myusers.js');
const ChunksGaussianParamsCreator = require('./chunks');

/**
 * here we will analyse all users chunks to create params for gaussian function
 */
const allChunks = users.reduce((current, el) => {
  const elementChunks = el.chunks;
  return [...current, ...elementChunks];
}, []);

const chunksGaussianParamsCreator = new ChunksGaussianParamsCreator(allChunks);

/**
 * here we will analyse every chunk separate
 * to find possibility
 */
chunksProbability = allChunks.map(chunk => {
  const p = chunksGaussianParamsCreator.findChunkProbability(chunk);
  return p;
});
