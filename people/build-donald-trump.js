const fs = require('fs');

const clone = (value) => JSON.parse(JSON.stringify(value));
const source = JSON.parse(fs.readFileSync('erika-kirk.node', 'utf8'));
const out = clone(source);
const idMap = {
  'erika-kirk-declaration': 'donald-trump-declaration',
  'erika-kirk-profile-surface': 'donald-trump-profile-surface',
  'erika-kirk-research-surface': 'donald-trump-research-surface',
  'erika-kirk-icon-surface': 'donald-trump-icon-surface',
  'erika-kirk': 'donald-trump',
  'erika-kirk-biography': 'donald-trump-biography',
  'erika-kirk-tpusa-role': 'donald-trump-president-role',
  'erika-kirk-host-role': 'donald-trump-business-role',
  'erika-kirk-erika': 'donald-trump-melania',
  'erika-kirk-maga-doctrine': 'donald-trump-art-of-deal',
  'erika-kirk-college-scam': 'donald-trump-apprentice',
  'erika-kirk-show': 'donald-trump-truth-social',
  'erika-kirk-portrait': 'donald-trump-portrait',
  'erika-kirk-death': 'donald-trump-second-inauguration',
  'claim-erika-tpusa': 'claim-donald-presidencies',
  'evidence-erika-tpusa': 'evidence-donald-presidencies',
  'claim-erika-death': 'claim-donald-career',
  'evidence-erika-death': 'evidence-donald-career',
  'source-erika-tpusa': 'source-donald-white-house',
  'source-erika-ap': 'source-donald-miller-center',
  'source-erika-white-house': 'source-donald-publisher',
  'source-erika-portrait': 'source-donald-portrait',
};
const replaceString = (value) => {
  let result = value;
  for (const [from, to] of Object.entries(idMap).sort((a, b) => b[0].length - a[0].length)) result = result.replaceAll(from, to);
  return result.replaceAll('erika-kirk-person-graph', 'donald-trump-person-graph').replaceAll('Erika Kirk', 'Donald Trump');
};
const deepReplace = (value) => {
  if (Array.isArray(value)) return value.map(deepReplace);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, deepReplace(item)]));
  return typeof value === 'string' ? replaceString(value) : value;
};
const graph = deepReplace(out);
const node = (id) => graph.nodes.find((item) => item.id === id);
const set = (id, label, data) => {
  const item = node(id);
  if (!item) throw new Error(`Missing node: ${id}`);
  item.label = label;
  item.data = { ...item.data, ...data };
};
const stamp = '2026-07-19T15:00:00.000Z';
const portrait = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Donald%20Trump%20official%20portrait%2C%202025%20%28headshot%29.jpg?width=960';

graph.metadata = {
  ...graph.metadata,
  title: 'Donald Trump', graphId: 'donald-trump-person-graph', version: '1.0.0', created: stamp, modified: stamp,
  description: 'A sourced public-figure graph created from the Person Template.',
  tags: ['person', 'Donald Trump', 'biography', 'research'],
};
const declaration = node('donald-trump-declaration');
declaration.label = 'Donald Trump Declaration';
declaration.data.identity = {
  graphId: 'donald-trump-person-graph', name: 'Donald Trump', version: '1.0.0',
  description: 'A sourced public-figure graph about American president, businessman, author, and media personality Donald Trump.',
  createdAt: stamp, updatedAt: stamp,
};
declaration.data.declaration.defaultSurfaceId = 'donald-trump-profile-surface';
declaration.data.declaration.surfaces = [
  { id: 'donald-trump-profile-surface', kind: 'view', label: 'Profile', viewNodeId: 'donald-trump-profile-surface' },
  { id: 'donald-trump-research-surface', kind: 'view', label: 'Sources and Claims', viewNodeId: 'donald-trump-research-surface' },
  { id: 'donald-trump-icon-surface', kind: 'view', label: 'Icon', viewNodeId: 'donald-trump-icon-surface' },
];

set('donald-trump-profile-surface', 'Donald Trump Profile', {
  markdown: '# Donald Trump\n\nAmerican politician, businessman, author, and media personality serving as the 47th president of the United States.',
});
set('donald-trump-research-surface', 'Donald Trump Sources', {
  markdown: '# Sources and claims\n\nThis branch separates biographical assertions from the evidence and publications used to support them.',
});
set('donald-trump-icon-surface', 'Donald Trump Icon', {
  portrait, displayName: 'Donald Trump', subjectRef: 'donald-trump', memo: 'Compact portrait-and-name surface for Donald Trump.',
});
set('donald-trump', 'Donald Trump', {
  displayName: 'Donald Trump', fullName: 'Donald John Trump', aliases: ['Donald J. Trump'],
  summary: 'American politician, businessman, author, and media personality serving as the 47th president of the United States. He previously served as the 45th president from 2017 to 2021.',
  portrait, birthDate: '1946-06-14', deathDate: '', pronouns: 'he/him', nationality: 'American',
  primaryRoles: ['president of the United States', 'businessman', 'author', 'media personality'],
  canonicalUri: 'https://www.whitehouse.gov/administration/donald-j-trump/', status: 'living',
});
set('donald-trump-biography', 'Public Life', {
  title: 'Public Life',
  body: 'Donald John Trump was born in New York City in 1946 and graduated from the University of Pennsylvania in 1968. He led his family real-estate business, became a nationally known media personality through The Apprentice, and entered presidential politics. Trump served as the 45th president from 2017 to 2021 and began a nonconsecutive second term as the 47th president in January 2025.',
  period: '1946–present', subjectRef: 'donald-trump', status: 'active',
});
set('donald-trump-president-role', 'President of the United States', {
  title: '45th and 47th President', organizationRef: 'United States', startDate: '2017-01-20', endDate: '',
  locationRef: 'Washington, D.C.', description: 'Served from 2017 to 2021 and began a second, nonconsecutive presidential term on January 20, 2025.', status: 'current',
});
set('donald-trump-business-role', 'The Trump Organization', {
  title: 'President and Chairman', organizationRef: 'The Trump Organization', startDate: '1971', endDate: '2017',
  locationRef: 'New York City', description: 'Led the family real-estate and licensing business before entering the presidency.', status: 'historical',
});
set('donald-trump-melania', 'Melania Trump', {
  title: 'Marriage to Melania Trump', relationshipType: 'spouse-of', subjectRef: 'donald-trump', objectRef: 'Melania Trump',
  startDate: '2005', endDate: '', description: 'Donald Trump and Melania Trump married in 2005.', status: 'current',
});
set('donald-trump-art-of-deal', 'Trump: The Art of the Deal', {
  title: 'Trump: The Art of the Deal', workType: 'book', date: '1987', creatorRef: 'donald-trump',
  contribution: 'credited co-author with Tony Schwartz',
  uri: 'https://www.penguinrandomhouse.com/books/180675/trump-the-art-of-the-deal-by-donald-j-trump-with-tony-schwartz/',
  description: 'A business memoir and advice book credited to Donald Trump and Tony Schwartz.', status: 'published',
});
set('donald-trump-apprentice', 'The Apprentice', {
  title: 'The Apprentice', workType: 'reality television series', date: '2004–2015', creatorRef: 'donald-trump',
  contribution: 'host and executive producer', uri: 'https://www.imdb.com/title/tt0364782/',
  description: 'A reality competition series that made Trump a nationally recognized television personality.', status: 'historical',
});
set('donald-trump-truth-social', 'Truth Social', {
  title: 'Truth Social', workType: 'social media platform', date: '2022–present', creatorRef: 'donald-trump',
  contribution: 'founder of parent company Trump Media & Technology Group', uri: 'https://truthsocial.com/',
  description: 'A social media platform operated by Trump Media & Technology Group.', status: 'active',
});
set('donald-trump-portrait', 'Donald Trump Portrait', {
  title: 'Donald Trump official portrait, 2025', mediaType: 'image', uri: portrait, date: '2025-01-15',
  depictsRef: 'donald-trump', creator: 'Daniel Torok',
  rights: 'Public domain; see Wikimedia Commons file page',
  caption: 'Official inaugural portrait of Donald Trump for his second presidency.', status: 'published',
});
set('donald-trump-second-inauguration', 'Second Presidential Inauguration', {
  title: 'Second Presidential Inauguration', date: '2025-01-20', endDate: '', placeRef: 'United States Capitol, Washington, D.C.',
  participants: ['Donald Trump', 'JD Vance'],
  description: 'Trump took the presidential oath for a second time and began serving as the 47th president of the United States.', status: 'historical',
});
set('claim-donald-presidencies', 'Presidencies Claim', {
  title: '45th and 47th president',
  statement: 'Donald Trump served as the 45th president from 2017 to 2021 and began serving as the 47th president on January 20, 2025.',
  subjectRef: 'donald-trump', predicate: 'served-as', objectRef: '45th and 47th president of the United States', confidence: 'high', disputed: false, status: 'verified',
});
set('evidence-donald-presidencies', 'Presidencies Evidence', {
  title: 'White House and presidential-history records',
  evidenceText: 'The White House identifies Trump as the 45th and 47th president, while the Miller Center records his 2017 and 2025 inaugurations and nonconsecutive terms.',
  claimRef: 'claim-donald-presidencies', citationSourceId: 'source-donald-white-house',
  locator: 'official biography and presidential overview', stance: 'supports', confidence: 'high', status: 'verified',
});
set('claim-donald-career', 'Business and Media Career Claim', {
  title: 'Pre-presidential public career',
  statement: 'Before the presidency, Donald Trump led a real-estate business, was credited as co-author of The Art of the Deal, and hosted The Apprentice.',
  subjectRef: 'donald-trump', predicate: 'worked-in', objectRef: 'business, publishing, and television', confidence: 'high', disputed: false, status: 'verified',
});
set('evidence-donald-career', 'Business and Media Evidence', {
  title: 'Biographical and publisher records',
  evidenceText: 'The Miller Center summarizes Trump’s business and television career, and Penguin Random House identifies Trump and Tony Schwartz on The Art of the Deal.',
  claimRef: 'claim-donald-career', citationSourceId: 'source-donald-miller-center',
  locator: 'career overview and publisher book page', stance: 'supports', confidence: 'high', status: 'verified',
});
set('source-donald-white-house', 'White House Biography', {
  title: 'President Donald J. Trump', sourceType: 'official biography', author: 'The White House', publisher: 'The White House', publishedDate: '',
  uri: 'https://www.whitehouse.gov/administration/donald-j-trump/', accessedDate: '2026-07-19',
  citation: 'White House biography of President Donald J. Trump.', reliability: 'official government source; promotional', status: 'active',
});
set('source-donald-miller-center', 'Miller Center Biography', {
  title: 'Donald Trump', sourceType: 'presidential biography', author: 'Miller Center', publisher: 'University of Virginia', publishedDate: '',
  uri: 'https://millercenter.org/president/trump', accessedDate: '2026-07-19', citation: 'Miller Center presidential biography of Donald Trump.',
  reliability: 'institutional secondary source', status: 'active',
});
set('source-donald-publisher', 'Publisher Book Page', {
  title: 'Trump: The Art of the Deal', sourceType: 'publisher catalog record', author: 'Penguin Random House', publisher: 'Penguin Random House', publishedDate: '',
  uri: 'https://www.penguinrandomhouse.com/books/180675/trump-the-art-of-the-deal-by-donald-j-trump-with-tony-schwartz/', accessedDate: '2026-07-19',
  citation: 'Penguin Random House catalog page for Trump: The Art of the Deal.', reliability: 'official publisher record; promotional', status: 'active',
});
set('source-donald-portrait', 'Portrait Source', {
  title: 'Donald Trump official portrait, 2025 (headshot).jpg', sourceType: 'public-domain photograph', author: 'Daniel Torok',
  publisher: 'Wikimedia Commons', publishedDate: '2025-01-15',
  uri: 'https://commons.wikimedia.org/wiki/File:Donald_Trump_official_portrait,_2025_(headshot).jpg', accessedDate: '2026-07-19',
  citation: 'Official inaugural portrait by Daniel Torok, Wikimedia Commons, public domain.', reliability: 'primary media artifact', status: 'active',
});

for (const bridge of graph.nodes.filter((item) => item.type === 'bridge')) bridge.data.identity.graphId = 'donald-trump-person-graph';
const inheritedPortals = new Set(graph.nodes.filter((item) => item.type === 'portal' && item.id !== 'people-root-portal').map((item) => item.id));
graph.nodes = graph.nodes.filter((item) => !inheritedPortals.has(item.id));
graph.edges = graph.edges.filter((edge) => !inheritedPortals.has(edge.source) && !inheritedPortals.has(edge.target));
for (const edge of graph.edges) {
  edge.id = edge.id.replaceAll('erika', 'donald');
  if (edge.label === 'erika') edge.label = 'melania';
  if (edge.source === 'evidence-donald-presidencies' && edge.target === 'source-donald-publisher') edge.target = 'source-donald-miller-center';
  if (edge.source === 'evidence-donald-career' && edge.target === 'source-donald-miller-center') edge.label = 'from-source';
  if (edge.source === 'evidence-donald-career' && edge.target === 'source-donald-publisher') edge.label = 'corroborated-by';
}

fs.writeFileSync('donald-trump.node', `${JSON.stringify(graph, null, 2)}\n`);

const root = JSON.parse(fs.readFileSync('root.node', 'utf8'));
if (!root.nodes.some((item) => item.id === 'donald-trump-portal')) {
  const prototype = clone(root.nodes.find((item) => item.type === 'portal'));
  const ref = 'github://mikemartinez1974/public/people/donald-trump.node';
  prototype.id = 'donald-trump-portal'; prototype.label = 'Donald Trump'; prototype.position = { x: 780, y: 40 }; prototype.width = 280; prototype.height = 300;
  prototype.data = {
    memo: 'Open the sourced public-figure graph for Donald Trump.', link: '', authority: 'navigate', src: ref, ref, endpoint: `${ref}:root`, intent: 'external',
    target: { endpoint: `${ref}:root`, ref, mode: 'navigate', url: '', graphId: '', nodeId: 'donald-trump-icon-surface', portId: 'root', label: 'Open Donald Trump', handleId: 'root', surfaceId: '' },
    identity: { graphId: 'people-root-graph' }, security: 'prompt', sourceNodeId: 'donald-trump-icon-surface', sourcePayload: 'graph.web.icon', surfaceId: '', sourceRef: ref, visibilityRole: 'browser',
  };
  root.nodes.filter((item) => item.type === 'portal').forEach((item, index) => { item.position.x = [-780, -260, 260][index]; });
  root.nodes.push(prototype);
  root.edges.push({ id: 'people-root-edge-4', source: 'people-root-declaration', target: 'donald-trump-portal', sourcePort: 'right', targetPort: 'root', label: 'person', type: 'default' });
  root.metadata.modified = stamp; root.nodes[0].data.identity.updatedAt = stamp;
  fs.writeFileSync('root.node', `${JSON.stringify(root, null, 2)}\n`);
}
