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
declaration.data.dependencies = {
  ...(declaration.data.dependencies || {}),
  nodeTypes: [...new Set([...(declaration.data.dependencies?.nodeTypes || []), 'bridge'])],
  skills: ['collection-template']
};
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
  purpose: 'Coordinated paths from current state to desired outcomes.',
  renderShape: { kind: 'svg' },
  svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' role='img' aria-label='Michael’s Plans Collection'><defs><linearGradient id='plan-card-bg' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#111827'/><stop offset='.58' stop-color='#164e63'/><stop offset='1' stop-color='#3f3f46'/></linearGradient></defs><rect x='5' y='5' width='630' height='350' rx='28' fill='url(#plan-card-bg)' stroke='#67e8f9' stroke-width='3'/><text x='48' y='72' fill='#a7f3d0' font-family='system-ui,sans-serif' font-size='14' font-weight='800' letter-spacing='.16em'>PLANS · MILESTONES · DECISIONS</text><text x='48' y='126' fill='#f8fafc' font-family='system-ui,sans-serif' font-size='40' font-weight='850'>Michael’s Plans</text><path d='M58 254 L168 205 L274 235 L386 154 L516 184 L584 116' fill='none' stroke='#67e8f9' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/><g fill='#fbbf24' stroke='#111827' stroke-width='3'><circle cx='58' cy='254' r='10'/><circle cx='168' cy='205' r='10'/><circle cx='274' cy='235' r='10'/><circle cx='386' cy='154' r='10'/><circle cx='516' cy='184' r='10'/><circle cx='584' cy='116' r='10'/></g><text x='48' y='320' fill='#cffafe' font-family='system-ui,sans-serif' font-size='17'>Durable routes from intention to completed outcomes</text></svg>",
  altText: 'A milestone route rising through six connected plan checkpoints.',
  view: { intent: 'node', payload: 'node.web.summary', label: "Michael's Plans Collection" }
};

const viewArtwork = {
  'plans-collection-detail-view': "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 440' role='img' aria-label='Plans collection detail'><rect width='720' height='440' rx='24' fill='#111827'/><rect x='34' y='32' width='652' height='376' rx='18' fill='#f8fafc'/><text x='72' y='92' fill='#164e63' font-family='system-ui,sans-serif' font-size='15' font-weight='800' letter-spacing='.14em'>PLAN LIBRARY</text><text x='72' y='142' fill='#111827' font-family='system-ui,sans-serif' font-size='38' font-weight='850'>From intent to outcome</text><g transform='translate(72 190)'><path d='M0 104 H118 V44 H250 V128 H388 V18 H544' fill='none' stroke='#0891b2' stroke-width='8' stroke-linejoin='round'/><g fill='#f59e0b' stroke='#111827' stroke-width='3'><circle cx='0' cy='104' r='12'/><circle cx='118' cy='44' r='12'/><circle cx='250' cy='128' r='12'/><circle cx='388' cy='18' r='12'/><circle cx='544' cy='18' r='12'/></g></g><text x='72' y='370' fill='#475569' font-family='system-ui,sans-serif' font-size='18'>Browse active plans, milestones, dependencies, and decision paths.</text></svg>",
  'plans-collection-summary-view': "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 520 320' role='img' aria-label='Plans collection summary'><rect width='520' height='320' rx='24' fill='#164e63'/><rect x='28' y='28' width='464' height='264' rx='18' fill='#ecfeff'/><text x='58' y='82' fill='#0f766e' font-family='system-ui,sans-serif' font-size='13' font-weight='800' letter-spacing='.14em'>COORDINATED PATHS</text><text x='58' y='128' fill='#111827' font-family='system-ui,sans-serif' font-size='34' font-weight='850'>Plans</text><path d='M62 230 L150 184 L244 212 L344 142 L452 166' fill='none' stroke='#0891b2' stroke-width='6' stroke-linecap='round'/><g fill='#f59e0b'><circle cx='62' cy='230' r='9'/><circle cx='150' cy='184' r='9'/><circle cx='244' cy='212' r='9'/><circle cx='344' cy='142' r='9'/><circle cx='452' cy='166' r='9'/></g><text x='58' y='272' fill='#475569' font-family='system-ui,sans-serif' font-size='16'>Six plan graphs per window</text></svg>",
  'plans-collection-icon-view': "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220' role='img' aria-label='Plans collection icon'><rect width='320' height='220' rx='26' fill='#111827'/><path d='M44 166 L96 118 L150 142 L210 76 L276 102' fill='none' stroke='#67e8f9' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/><g fill='#fbbf24' stroke='#111827' stroke-width='3'><circle cx='44' cy='166' r='11'/><circle cx='96' cy='118' r='11'/><circle cx='150' cy='142' r='11'/><circle cx='210' cy='76' r='11'/><circle cx='276' cy='102' r='11'/></g><text x='32' y='46' fill='#f8fafc' font-family='system-ui,sans-serif' font-size='25' font-weight='850'>PLANS</text></svg>"
};
for (const [nodeId, svg] of Object.entries(viewArtwork)) {
  const viewNode = graph.nodes.find((node) => node.id === nodeId);
  viewNode.data = {
    ...viewNode.data,
    content: { kind: 'svg', value: svg }
  };
}

const controller = graph.nodes.find((node) => node.id === 'plans-collection-window-controller');
controller.label = 'Plans Collection Browser';
controller.data = {
  ...controller.data,
  scriptName: 'Plans Collection Browser',
  scriptRef: 'github://mikemartinez1974/public/templates/collection-template/collection-window.js',
  memo: 'Discover and render the current Plans collection window.',
  pageSize: 6,
  _classBinding: {
    key: 'collection-window-controller',
    ref: 'github://mikemartinez1974/public/templates/collection-window-controller/classes/nodes/collection-window-controller.node-class.node',
    sourceRef: 'github://mikemartinez1974/public/templates/collection-window-controller/classes/nodes/collection-window-controller.node-class.node'
  },
  _bridge: {
    classKey: 'collection-window-controller',
    classRef: 'github://mikemartinez1974/public/templates/collection-window-controller/classes/nodes/collection-window-controller.node-class.node',
    entryPort: 'root',
    kind: 'node-class',
    sourceRef: 'github://mikemartinez1974/public/templates/collection-window-controller/classes/nodes/collection-window-controller.node-class.node',
    sourceBridgeNodeId: 'plans-collection-controller-import',
    targetKind: 'node-class',
    grants: ['read', 'execute', 'runtime', 'create', 'update', 'delete']
  }
};

const bridgePorts = [
  { id: 'root', key: 'root', label: 'root', direction: 'bidirectional', dataType: 'any', angle: 210 },
  { id: 'right', key: 'right', label: 'right', direction: 'output', dataType: 'value', angle: 0 }
];
graph.nodes.push({
  id: 'plans-collection-controller-import',
  type: 'bridge',
  label: 'Plans Collection Controller Import',
  root: false,
  position: { x: -1180, y: 20 },
  width: 420,
  height: 260,
  ports: bridgePorts,
  handles: bridgePorts.map((port) => ({ ...port, portId: port.id })),
  visible: true,
  showLabel: true,
  data: {
    memo: 'Authorizes the Plans collection to consume and execute the reusable collection-window capability.',
    bridge: {
      ref: 'github://mikemartinez1974/public/templates/collection-window-controller/root.node',
      role: 'import',
      resourceKind: 'capability-kit',
      scope: 'focused-graph',
      grants: ['read', 'create', 'execute', 'runtime', 'update', 'delete'],
      exposure: {
        nodeClasses: { mode: 'allow', include: ['collection-window-controller'] },
        scripts: { mode: 'allow', include: ['collection-window-controller'] },
        views: { mode: 'allow' }
      }
    },
    visibilityRole: 'editor',
    identity: { graphId: 'plans-collection-declaration' }
  }
});
graph.edges.push({
  id: 'plans-collection-controller-authority',
  type: 'reference',
  source: 'plans-collection-controller-import',
  target: 'plans-collection-window-controller',
  sourceHandle: 'right',
  targetHandle: 'trigger',
  label: 'authorizes collection browser',
  data: { relationship: 'authorizes collection browser', semanticRole: 'collection.controller-authority' }
});

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
