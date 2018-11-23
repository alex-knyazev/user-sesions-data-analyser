const tree = {
  'collections/all': [
    'collections/my/want',
    'collections/my/tried',
    'articles/popular',
    'groups/my',
    'tea',
    'teaMap/china',
    'settings',
  ],
  'collections/my/want': [
    'collections/all',
    'collections/my/tried',
    'articles/popular',
    'groups/my',
    'tea',
    'settings',
  ],
  'collections/my/tried': [
    'collections/all',
    'collections/my/tried',
    'articles/popular',
    'groups/my',
    'tea',
    'settings',
  ],
  'articles/popular': ['articles/new', 'article', 'collections/all', 'settings', 'groups/my'],
  'articles/new': ['articles/popular', 'article', 'collections/all', 'settings', 'groups/my'],
  article: [
    'articles/popular',
    'articles/new',
    'collections/all',
    'article',
    'settings',
    'groups/my',
  ],
  'groups/my': ['article', 'settings'],
  settings: ['collections/all'],
  'groups/my': ['collections/all'],
  'teaMap/china': ['collections/all'],
  tea: ['collections/all'],
};

const createChunk = () => {
  let chunk = [];
  const allRoutes = Object.keys(tree);

  const rand = Math.floor(Math.random() * allRoutes.length);
  const keyStart = allRoutes[rand];
  const connected = tree[keyStart];
  const chunkLength = Math.floor(Math.random() * 50 + 1);
  let startAt = new Date();
  startAt = new Date(
    new Date(startAt.setDate(Math.random() + 1 * 30)).setHours((Math.random() * 24).toFixed(3)),
  );
  let tempDate = new Date();

  const generateChunk = (chunk, connected) => {
    const rand = Math.floor(Math.random() * connected.length);
    const visitAt = tempDate;

    const route = {
      name: connected[rand],
      visitAt,
    };
    chunk.push(route);
    if (chunk.length > chunkLength) {
      return chunk;
    }
    const newConnected = tree[route.name];
    tempDate = new Date(+tempDate + Math.random() * 60 * 10000);
    return generateChunk(chunk, newConnected);
  };

  const result = generateChunk(chunk, connected);

  return {
    routes: result,
  };
};

module.exports = createChunk;
