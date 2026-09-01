const fs = require('fs');
const path = require('path');

const graphPath = path.join(__dirname, 'root.node');
const templatePath = path.resolve(
  __dirname,
  '../../../../twilite-zone/public/library/classes/nodes/task-planning/task-graph-template.node'
);

const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));
const templateNode = (suffix) => clone(template.nodes.find((node) => node.id === `task-graph-template-${suffix}`));

const prefix = 'reciprocal-multigraph-bridge-plan';
const graphId = `${prefix}-declaration`;
const interfaceIds = new Set([
  `${prefix}-detail-view`,
  `${prefix}-summary-view`,
  `${prefix}-icon-view`,
  `${prefix}-glyph`,
  `${prefix}-landing-surface`,
  `${prefix}-port`,
]);

const planClassTypes = ['plan', 'plan-goal', 'plan-phase', 'plan-action', 'plan-milestone', 'plan-decision', 'plan-constraint', 'plan-risk', 'plan-contingency'];

graph.nodes = graph.nodes.filter((node) => !interfaceIds.has(node.id));
graph.nodes = graph.nodes.filter((node) => !node.id.startsWith(`${prefix}-class-bridge-`));
graph.edges = graph.edges.filter((edge) => !edge.id.startsWith(`${prefix}-interface-`));

const declarationTemplate = templateNode('declaration');
const declaration = graph.nodes.find((node) => node.id === graphId);
declaration.label = 'Reciprocal Multi-Graph Bridge Contract';
declaration.position = { x: -1180, y: -850 };
declaration.width = declarationTemplate.width;
declaration.height = declarationTemplate.height;
declaration.visible = true;
declaration.showLabel = true;
declaration.ports = declarationTemplate.ports;
declaration.handles = declarationTemplate.handles;
declaration.inputs = [];
declaration.outputs = declarationTemplate.outputs;
declaration.data = {
  ...declarationTemplate.data,
  identity: {
    graphId,
    nodeId: prefix,
    name: 'Reciprocal Multi-Graph Bridge Contract',
    version: '1.0.0',
    description: 'Implementation plan for reciprocal bridge validation and direction-neutral multi-graph node expansion.',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  intent: { kind: 'plan', scope: 'implementation' },
  dependencies: {
    nodeTypes: ['declaration', 'view', 'content', 'glyph', 'port', 'plan', 'plan-goal', 'plan-phase', 'plan-action', 'plan-milestone', 'plan-decision', 'plan-constraint', 'plan-risk', 'plan-contingency'],
    portContracts: ['core'],
    skills: ['twilite-planning-graphs'],
    schemaVersions: { nodes: '>=1.0.0', ports: '>=1.0.0' },
    optional: [],
  },
  document: { url: 'github://mikemartinez1974/public/plans/reciprocal-multigraph-bridge-contract/root.node' },
  summaryNodeId: 'reciprocal-bridge-plan',
  name: 'Reciprocal Multi-Graph Bridge Contract',
  declaresKind: 'plan',
  purpose: 'Define and verify the reciprocal bridge contract for a semantic node declared across graphs.',
  primaryNodeViewId: `${prefix}-detail-view`,
  declaration: {
    kind: 'graph',
    targetMode: 'artifact',
    artifactKind: 'plan',
    interfaceContract: { version: 1, implicitRootPort: true },
    defaultSurfaceId: 'plan',
    surfaces: [{
      id: 'plan',
      kind: 'port',
      label: 'Reciprocal Bridge Plan',
      portNodeId: `${prefix}-port`,
      viewNodeId: `${prefix}-summary-view`,
      exposes: { views: { mode: 'allow' }, declarations: { mode: 'allow' } },
    }],
  },
};

function configureInterfaceNode(suffix, id, label, position, data) {
  const node = templateNode(suffix);
  node.id = id;
  node.label = label;
  node.position = position;
  node.data = { ...node.data, ...data, identity: { graphId } };
  return node;
}

const detailView = configureInterfaceNode('detail-view', `${prefix}-detail-view`, 'Reciprocal Bridge Plan Detail', { x: -1180, y: -500 }, {
  content: { kind: 'markdown', value: '# Reciprocal Multi-Graph Bridge Contract\n\nA node spans graphs only when both declarations share the same `nodeId` and carry reciprocal bridges. Each declaration retains its own `graphId`.' },
});
const summaryView = configureInterfaceNode('summary-view', `${prefix}-summary-view`, 'Reciprocal Bridge Plan Summary', { x: -1180, y: -160 }, {
  content: { kind: 'markdown', value: '## Reciprocal Bridge Plan\n\nFour phases cover durable identity, authoring enforcement, verified expansion, and diagnostic legacy loading.' },
});
const iconView = configureInterfaceNode('icon-view', `${prefix}-icon-view`, 'Reciprocal Bridge Plan Icon', { x: -1180, y: 180 }, {
  content: { kind: 'svg', value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='24' fill='#102a43'/><circle cx='104' cy='102' r='42' fill='#d9e2ec' stroke='#2cb67d' stroke-width='8'/><circle cx='216' cy='102' r='42' fill='#d9e2ec' stroke='#f4b942' stroke-width='8'/><path d='M142 83h36l-10-10m10 10-10 10M178 121h-36l10-10m-10 10 10 10' fill='none' stroke='#fff' stroke-width='9' stroke-linecap='round' stroke-linejoin='round'/><text x='160' y='184' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='18' font-weight='700'>RECIPROCAL</text></svg>" },
});
const glyph = configureInterfaceNode('glyph', `${prefix}-glyph`, 'Reciprocal Bridge Glyph', { x: -700, y: -850 }, {
  glyph: { kind: 'icon', name: 'SyncAlt' },
});
const landing = configureInterfaceNode('landing-surface', `${prefix}-landing-surface`, 'Reciprocal Bridge Plan Landing Surface', { x: -620, y: -500 }, {
  content: { kind: 'markdown', value: '# Reciprocal Multi-Graph Bridge Contract\n\nPlan the contract, enforcement boundaries, expansion gate, and legacy diagnostics for reciprocal same-node bridges.' },
});
const port = configureInterfaceNode('summary-port', `${prefix}-port`, 'Reciprocal Bridge Plan', { x: -700, y: -160 }, {
  surfaceId: 'plan',
  direction: 'output',
  dataType: 'plan',
  sourceNodeId: 'reciprocal-bridge-plan',
  sourcePayload: 'node.web',
  renderedNodeType: 'plan',
  view: { intent: 'node', payload: 'node.web', nodeType: 'plan' },
  presentation: {
    detail: { mode: 'own', viewNodeId: 'reciprocal-bridge-plan' },
    summary: { mode: 'own', viewNodeId: 'reciprocal-bridge-plan' },
    icon: { mode: 'own', viewNodeId: `${prefix}-icon-view` },
    glyph: { mode: 'own', viewNodeId: `${prefix}-glyph` },
  },
});

graph.nodes.push(detailView, summaryView, iconView, glyph, landing, port);

for (const type of planClassTypes) {
  const instance = graph.nodes.find((node) => node.type === type && node.data?._classBinding?.sourceRef);
  if (!instance) continue;
  const classRef = instance.data._classBinding.sourceRef;
  graph.nodes.push({
    id: `${prefix}-class-bridge-${type}`,
    type: 'bridge',
    label: `${type} class`,
    position: { x: -1680, y: -700 + planClassTypes.indexOf(type) * 150 },
    width: 280,
    height: 110,
    visible: true,
    showLabel: true,
    ports: [{ id: 'root', key: 'root', label: 'root', direction: 'bidirectional', dataType: 'any', angle: 180 }],
    handles: [{ id: 'root', key: 'root', portId: 'root', label: 'root', direction: 'bidirectional', dataType: 'any', angle: 180 }],
    data: {
      target: { mode: 'bridge', label: 'Create', kind: 'node-class', key: type, ref: classRef, resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'] },
      intent: 'external',
      resourceKind: 'node-class',
      scope: 'focused-graph',
      grants: ['create'],
      authority: 'bridge',
      bridge: { ref: classRef, resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'] },
      _classBinding: { ...instance.data._classBinding, key: type, ref: classRef },
      _bridge: { sourceRef: classRef, entryPort: 'root', kind: 'node-class', targetKind: 'node-class', classKey: type, classRef },
      identity: { graphId },
    },
  });
}

const interfaceEdges = [
  ['default-view', detailView.id, 'default view'],
  ['summary-view', summaryView.id, 'summary view'],
  ['icon-view', iconView.id, 'icon view'],
  ['glyph', glyph.id, 'glyph'],
  ['landing-surface', landing.id, 'landing surface'],
  ['port', port.id, 'plan port'],
].map(([sourceHandle, target, label], index) => ({
  id: `${prefix}-interface-${String(index + 1).padStart(2, '0')}`,
  source: graphId,
  sourceHandle,
  target,
  targetHandle: 'root',
  label,
  type: sourceHandle === 'default-view' ? 'default-view' : 'reference',
  data: {
    role: sourceHandle === 'default-view' ? 'default-view' : sourceHandle === 'summary-view' ? 'shared-summary' : sourceHandle === 'icon-view' ? 'shared-icon' : sourceHandle === 'glyph' ? 'shared-glyph' : sourceHandle === 'landing-surface' ? 'landing-surface' : 'exposes-port',
    semanticRole: sourceHandle === 'default-view' ? 'default-view' : sourceHandle === 'summary-view' ? 'shared-summary' : sourceHandle === 'icon-view' ? 'shared-icon' : sourceHandle === 'glyph' ? 'shared-glyph' : sourceHandle === 'landing-surface' ? 'landing-surface' : 'exposes-port',
  },
}));

graph.edges = graph.edges.map((edge) => ({
  ...edge,
  sourceHandle: edge.sourceHandle || 'root',
  targetHandle: edge.targetHandle || 'root',
}));
graph.edges.push(...interfaceEdges);

fs.writeFileSync(graphPath, `${JSON.stringify(graph, null, 2)}\n`);
