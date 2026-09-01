const fs = require('node:fs');
const path = require('node:path');

const output = path.join(__dirname, 'root.node');
const templatePath = path.join(__dirname, '..', 'templates', 'collection-template', 'root.node');
const current = JSON.parse(fs.readFileSync(output, 'utf8'));
const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
const graphRef = 'github://mikemartinez1974/public/plans/root.node';
const description = "Durable collection of Michael's plan graphs.";

const retarget = (value) => {
  if (Array.isArray(value)) return value.map(retarget);
  if (!value || typeof value !== 'object') {
    if (typeof value !== 'string') return value;
    return value
      .replaceAll('collection-template', 'plans-collection')
      .replaceAll('Collection Template', 'Plans Collection')
      .replaceAll('github://owner/repository/path/to/collection/root.node', graphRef);
  }
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, retarget(entry)]));
};

const graph = retarget(template);
graph.metadata = {
  ...graph.metadata,
  title: "Michael's Plans Collection",
  description,
  graphId: 'plans-collection-declaration',
  version: '1.0.0',
  kind: 'collection',
  created: current.metadata?.created || graph.metadata?.created,
  modified: new Date().toISOString(),
  tags: ['collection', 'plans'],
  preferredViewer: 'https://dev.twilite.zone'
};

const declaration = graph.nodes.find((node) => node.id === 'plans-collection-declaration');
declaration.label = "Michael's Plans Collection";
declaration.visible = false;
declaration.data.identity = {
  ...declaration.data.identity,
  graphId: 'plans-collection-declaration',
  nodeId: 'plans-collection',
  name: "Michael's Plans Collection",
  version: '1.0.0',
  description
};
declaration.data.intent = { kind: 'collection', scope: 'public' };
declaration.data.collection = {
  collectionRef: graphRef,
  membership: {
    source: 'repository-directory',
    includeDirectNodeFiles: true,
    includeDirectChildRoots: true,
    recursive: false
  },
  view: {
    mode: 'windowed',
    windowSize: 6,
    payload: 'node.web.icon',
    columns: 3,
    cardWidth: 240,
    cardHeight: 220,
    iconCardWidth: 240,
    iconCardHeight: 220,
    gapX: 70,
    gapY: 70,
    origin: { x: -720, y: 330 }
  }
};
declaration.data.document = { ...(declaration.data.document || {}), url: graphRef };
declaration.data.declaration.surfaces = declaration.data.declaration.surfaces.map((surface) => (
  surface.id === 'collection'
    ? { ...surface, label: 'Plans Collection', memo: 'Entry surface for the repository plans collection.' }
    : surface
));

const rootPort = graph.nodes.find((node) => node.id === 'plans-collection-root-port');
rootPort.label = "Michael's Plans Collection";
rootPort.data = {
  ...rootPort.data,
  identity: { graphId: 'plans-collection-declaration', portId: 'collection', name: "Michael's Plans Collection" },
  title: 'Plans',
  purpose: 'Coordinated paths from current state to desired outcomes.'
};

const controller = graph.nodes.find((node) => node.id === 'plans-collection-window-controller');
controller.label = 'Plans Collection Browser';
controller.data = {
  ...controller.data,
  scriptName: 'Plans Collection Browser',
  scriptRef: 'github://mikemartinez1974/public/templates/collection-template/collection-window.js',
  memo: 'Discover and render the current Plans collection window.',
  pageSize: 6
};

const repoHome = graph.nodes.find((node) => node.id === 'plans-collection-repo-home');
repoHome.data = {
  ...repoHome.data,
  ref: 'github://mikemartinez1974/public/root.node',
  src: 'github://mikemartinez1974/public/root.node',
  sourceRef: 'github://mikemartinez1974/public/root.node',
  endpoint: 'github://mikemartinez1974/public/root.node:root',
  sourceNodeId: 'public-home-view',
  target: {
    ...(repoHome.data.target || {}),
    ref: 'github://mikemartinez1974/public/root.node',
    endpoint: 'github://mikemartinez1974/public/root.node:root'
  }
};

const guidance = graph.nodes.find((node) => node.id === 'plans-collection-guidance');
guidance.label = 'Plans Collection Membership';
guidance.data = {
  ...guidance.data,
  markdown: '## Plans Collection Membership\n\nDirect `.node` files and direct child `root.node` graphs under `plans/` are collection members. The graph-owned controller presents six plan cards at a time.'
};

graph.nodes = graph.nodes.map((node) => ({
  ...node,
  data: node.data && typeof node.data === 'object'
    ? {
        ...node.data,
        identity: node.data.identity && typeof node.data.identity === 'object'
          ? { ...node.data.identity, graphId: node.data.identity.graphId === 'plans-collection' ? 'plans-collection-declaration' : node.data.identity.graphId }
          : node.data.identity
      }
    : node.data
}));
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;

fs.writeFileSync(output, `${JSON.stringify(graph, null, 2)}\n`);
