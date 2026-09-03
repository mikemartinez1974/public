const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'root.node');
const templatePath = path.join(__dirname, 'templates', 'public-arrival-template', 'root.node');
const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));
const byId = new Map(template.nodes.map((node) => [node.id, node]));
const GRAPH_ID = 'public-home-declaration';
const GRAPH_REF = 'github://mikemartinez1974/public/root.node';

const renameNode = (templateId, id, overrides = {}) => {
  const node = clone(byId.get(templateId));
  if (!node) throw new Error(`Missing template node: ${templateId}`);
  node.id = id;
  node.data = { ...(node.data || {}), ...(overrides.data || {}) };
  node.data.identity = { ...(node.data.identity || {}), graphId: GRAPH_ID, ...(overrides.identity || {}) };
  return { ...node, ...overrides, data: node.data };
};

const declaration = renameNode('public-arrival-template-declaration', GRAPH_ID, {
  label: 'Public Atelier',
  position: { x: -1180, y: -560 },
  data: {
    document: { url: GRAPH_REF },
    visibilityRole: 'editor',
  },
  identity: {
    nodeId: 'public-atelier',
    name: 'Public Atelier',
    version: '2.0.0',
  },
});
declaration.data.intent = { kind: 'public arrival', scope: 'public-repo-home' };
declaration.data.declaration = {
  ...declaration.data.declaration,
  artifactKind: 'public-arrival',
  defaultSurfaceId: 'detail',
  landingSurfaceId: 'landing',
  surfaces: [
    { id: 'detail', kind: 'view', payload: 'node.web.detail', viewNodeId: 'public-home-detail' },
    { id: 'summary', kind: 'view', payload: 'node.web.summary', viewNodeId: 'public-home-summary' },
    { id: 'icon', kind: 'view', payload: 'node.web.icon', viewNodeId: 'public-home-icon' },
    { id: 'glyph', kind: 'glyph', payload: 'node.web.glyph', viewNodeId: 'public-home-glyph' },
    { id: 'landing', kind: 'node', payload: 'node.web.detail', viewNodeId: 'public-home-arrival' },
    { id: 'public-summary', kind: 'port', payload: 'node.web.summary', portNodeId: 'public-home-summary-port', viewNodeId: 'public-home-summary' },
  ],
};

const detail = renameNode('public-arrival-template-detail', 'public-home-detail', {
  label: 'Public Atelier detail',
  data: {
    view: { intent: 'node', payload: 'node.web.detail' },
    html: "<div style='width:100%;height:100%;box-sizing:border-box;padding:26px;border-radius:20px;background:#111827;border:1px solid #475569;box-shadow:0 18px 38px rgba(0,0,0,.28);font-family:system-ui;color:#f8fafc'><div style='font:800 11px/1 system-ui;color:#67e8f9'>PUBLIC GRAPH</div><div style='font:850 32px/1.05 system-ui;margin:15px 0'>Public Atelier</div><div style='font:500 16px/1.6 system-ui;color:#cbd5e1'>A welcoming front door to Twilite, its public commons, and the wider boulevard of graph-native work.</div></div>",
  },
});
const summary = renameNode('public-arrival-template-summary', 'public-home-summary', {
  label: 'Public Atelier summary',
  data: {
    view: { intent: 'node', payload: 'node.web.summary' },
    html: "<div style='width:100%;height:100%;box-sizing:border-box;padding:20px;border-radius:18px;background:#111827;border:1px solid #475569;box-shadow:0 12px 28px rgba(0,0,0,.24);font-family:system-ui;color:#f8fafc'><div style='font:800 10px/1 system-ui;color:#67e8f9'>PUBLIC FRONT DOOR</div><div style='font:850 24px/1.08 system-ui;margin:14px 0'>Public Atelier</div><div style='font:500 14px/1.55 system-ui;color:#cbd5e1'>Learn how Twilite works or explore its public graph world.</div></div>",
  },
});
const icon = renameNode('public-arrival-template-icon', 'public-home-icon', {
  label: 'Public Atelier icon',
  data: {
    view: { intent: 'node', payload: 'node.web.icon' },
    html: "<div style='width:100%;height:100%;box-sizing:border-box;padding:16px;border-radius:16px;background:#111827;border:1px solid #475569;font-family:system-ui;color:#f8fafc;display:flex;flex-direction:column;justify-content:space-between'><div style='width:44px;height:44px;border-radius:10px;background:#0891b2;display:flex;align-items:center;justify-content:center;font-size:22px'>⌂</div><div style='font:800 16px/1.15 system-ui'>Public Atelier</div></div>",
  },
});
const glyph = renameNode('public-arrival-template-glyph', 'public-home-glyph', {
  label: 'Public Atelier',
  data: { glyph: '⌂', view: { payload: 'node.web.glyph' } },
});
const summaryPort = renameNode('public-arrival-template-summary-port', 'public-home-summary-port', {
  label: 'Public Summary',
  data: {
    sourceNodeId: 'public-home-summary',
    sourcePayload: 'node.web.summary',
    payload: 'node.web.summary',
    view: { intent: 'node', payload: 'node.web.summary' },
  },
  identity: { portId: 'public-summary' },
});

const bridgeSpecs = [
  ['arrival-class-bridge', 'public-home-arrival-class-bridge'],
  ['arrival-route-class-bridge', 'public-home-arrival-route-class-bridge'],
  ['arrival-section-class-bridge', 'public-home-arrival-section-class-bridge'],
  ['arrival-utility-class-bridge', 'public-home-arrival-utility-class-bridge'],
];
const bridges = bridgeSpecs.map(([sourceId, id], index) => renameNode(sourceId, id, {
  position: { x: -1180, y: 0 + index * 190 },
  visible: false,
}));

const arrival = renameNode('public-arrival-example', 'public-home-arrival', {
  label: 'Public Atelier',
  root: true,
  position: { x: 180, y: 0 },
  data: {
    eyebrow: 'WELCOME',
    title: 'Public Atelier',
    body: 'This is Michael Martinez’s public graph world. Learn how Twilite works, or explore the places and ideas already taking shape here.',
    definitionKey: 'arrival',
  },
});
arrival.handles = arrival.handles.filter((handle) => ['root', 'route-1', 'route-2'].includes(handle.id));
arrival.ports = arrival.ports.filter((port) => ['root', 'route-1', 'route-2'].includes(port.id));
arrival.handles.find((handle) => handle.id === 'route-1').label = 'learn more';
arrival.handles.find((handle) => handle.id === 'route-2').label = 'explore';

const learn = renameNode('public-arrival-learn', 'public-home-learn', {
  label: 'Learn More',
  position: { x: -180, y: 520 },
  data: {
    eyebrow: 'LEARN MORE',
    title: 'Understand Twilite',
    body: 'Follow a guided introduction to graph-native documents, navigation, and authoring.',
    destinationRef: 'github://twilite-zone/public/tutorial/root.node',
    destinationLabel: 'Start the tutorial',
    routeKind: 'explanatory',
    prominence: 'primary',
    status: 'active',
    target: { mode: 'navigate', kind: 'graph', ref: 'github://twilite-zone/public/tutorial/root.node', entryPort: 'root' },
    definitionKey: 'arrival-route',
  },
});

const explore = renameNode('public-arrival-utility-section', 'public-home-explore', {
  label: 'Explore',
  position: { x: 520, y: 520 },
  data: {
    eyebrow: 'EXPLORE',
    title: 'Explore the public world',
    body: 'Choose a place to understand the product, browse public repositories, or continue into the wider content ecosystem.',
    definitionKey: 'arrival-section',
  },
});

const utility = (id, label, position, body, ref, destinationLabel) => renameNode('public-arrival-docs', id, {
  label,
  position,
  data: {
    title: label,
    body,
    destinationRef: ref,
    destinationLabel,
    target: { mode: 'navigate', kind: 'graph', ref, entryPort: 'root' },
    definitionKey: 'arrival-utility',
  },
});
const twilite = utility('public-home-twilite', 'Twilite', { x: -40, y: 980 }, 'See the product, its purpose, and the graph-native model behind it.', 'github://twilite-zone/public/products/twilite/root.node', 'Open Twilite');
const commons = utility('public-home-commons', 'Public Commons', { x: 420, y: 980 }, 'Browse the curated commons for public repositories and shared graph resources.', 'github://twilite-zone/public/github/the-commons/root.node', 'Open the Commons');
const boulevard = utility('public-home-boulevard', 'The Boulevard', { x: 880, y: 980 }, 'Continue from repository-backed graphs into the wider public content ecosystem.', 'github://twilite-zone/public/boulevard/root.node', 'Enter the Boulevard');

const edge = (id, type, label, source, sourcePort, target, targetPort, semanticRole = type) => ({
  id,
  type,
  label,
  source,
  sourcePort,
  sourceHandle: sourcePort,
  target,
  targetPort,
  targetHandle: targetPort,
  style: { stroke: '#64748b', strokeWidth: 2, dash: [], curved: true },
  data: { semanticRole, presentation: { layer: semanticRole.startsWith('arrival.') ? 'semantic' : 'contract' } },
});
const edges = [
  edge('public-home-detail-edge', 'default-view', '', GRAPH_ID, 'default-view', detail.id, 'root'),
  edge('public-home-summary-edge', 'reference', '', GRAPH_ID, 'summary-view', summary.id, 'root', 'shared-summary'),
  edge('public-home-icon-edge', 'reference', '', GRAPH_ID, 'icon-view', icon.id, 'root', 'shared-icon'),
  edge('public-home-glyph-edge', 'reference', '', GRAPH_ID, 'glyph', glyph.id, 'root', 'shared-glyph'),
  edge('public-home-landing-edge', 'reference', '', GRAPH_ID, 'landing-surface', arrival.id, 'root', 'landing-surface'),
  edge('public-home-port-edge', 'reference', '', GRAPH_ID, 'port', summaryPort.id, 'root', 'exposes-port'),
  edge('public-home-learn-edge', 'arrival.offers-route', 'learn more', arrival.id, 'route-1', learn.id, 'parent'),
  edge('public-home-explore-edge', 'arrival.offers-route', 'explore', arrival.id, 'route-2', explore.id, 'parent'),
  edge('public-home-twilite-edge', 'arrival.contains', 'twilite', explore.id, 'item-1', twilite.id, 'parent'),
  edge('public-home-commons-edge', 'arrival.contains', 'commons', explore.id, 'item-2', commons.id, 'parent'),
  edge('public-home-boulevard-edge', 'arrival.contains', 'boulevard', explore.id, 'item-3', boulevard.id, 'parent'),
];

const graph = {
  fileVersion: '1.0',
  metadata: {
    title: 'Public Atelier',
    description: 'A welcoming public front door to Twilite, its commons, and its wider graph world.',
    graphId: GRAPH_ID,
    version: '2.0.0',
    kind: 'public arrival',
    created: '2026-08-27T16:07:56.032Z',
    modified: '2026-09-02T23:45:00.000Z',
    author: 'Michael Martinez',
    tags: ['public', 'arrival', 'twilite'],
    preferredViewer: 'https://dev.twilite.zone',
    template: { ref: 'github://mikemartinez1974/public/templates/public-arrival-template/root.node', version: '0.2.1' },
  },
  nodes: [declaration, detail, summary, icon, glyph, summaryPort, ...bridges, arrival, learn, explore, twilite, commons, boulevard],
  edges,
  clusters: [],
  settings: {
    ...clone(template.settings),
    snapToGrid: true,
    edgeRouting: 'orthogonal',
    layout: { ...clone(template.settings.layout), mode: 'manual', direction: 'DOWN', edgeLaneGapPx: 18 },
    github: { repo: 'mikemartinez1974/public', path: 'root.node', branch: 'main', autoCreateRepo: true, repoVisibility: 'private', seedOnCommit: false, enableGithubPages: false },
    autoSave: false,
  },
  scripts: [],
};

fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
