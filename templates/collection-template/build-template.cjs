const fs = require('node:fs');
const path = require('node:path');
const { bindHandles, makeModernInterface } = require('../_support/modern-template.cjs');

const output = path.join(__dirname, 'root.node');
const current = JSON.parse(fs.readFileSync(output, 'utf8'));
const prefix = 'collection-template';
const description = 'A directory-backed collection that discovers direct graph members and presents them through a bounded semantic window.';
const modern = makeModernInterface({
  prefix,
  graphId: 'collection-template',
  nodeId: 'collection',
  name: 'Collection Template',
  kind: 'collection',
  description,
  glyph: '▦',
  exposePort: 'collection-template-root-port',
  dependencies: ['script', 'portal']
});

const retainedIds = new Set([
  'collection-template-root-port',
  'collection-template-window-controller',
  'collection-template-repo-home',
  'collection-template-guidance'
]);
const retained = current.nodes.filter((node) => retainedIds.has(node.id)).map((node) => ({
  ...node,
  handles: bindHandles(node.ports || [])
}));
const root = retained.find((node) => node.id === 'collection-template-root-port');
root.label = 'Collection Surface';
root.data = {
  ...(root.data || {}),
  identity: { graphId: 'collection-template', portId: 'collection', name: 'Collection Surface' },
  surfaceId: 'collection',
  direction: 'bidirectional',
  dataType: 'collection',
  presentation: {
    detail: { mode: 'shared', viewNodeId: modern.ids.detailId },
    summary: { mode: 'shared', viewNodeId: modern.ids.summaryId },
    icon: { mode: 'shared', viewNodeId: modern.ids.iconId }
  },
  view: { intent: 'node', payload: 'node.web.summary' }
};

const declaration = modern.nodes.find((node) => node.id === modern.ids.declaration);
declaration.data.collection = {
  collectionRef: 'github://owner/repository/path/to/collection/root.node',
  membership: {
    source: 'repository-directory',
    includeDirectNodeFiles: true,
    includeDirectChildRoots: true,
    recursive: false
  },
  view: { mode: 'windowed', windowSize: 10, payload: 'node.web.icon', columns: 3 }
};
declaration.data.document.url = 'github://owner/repository/path/to/collection/root.node';

const edge = (id, source, target, sourceHandle, targetHandle, label, semanticRole) => ({
  id, type: 'reference', source, target, sourceHandle, targetHandle, label,
  data: { relationship: label, semanticRole }
});
const edges = [
  ...modern.edges,
  edge('collection-template-edge-controller', 'collection-template-root-port', 'collection-template-window-controller', 'bottom', 'trigger', 'runs collection window', 'collection.controller'),
  edge('collection-template-edge-repo', 'collection-template-root-port', 'collection-template-repo-home', 'right', 'left', 'returns to repository', 'navigation'),
  edge('collection-template-edge-guidance', 'collection-template-root-port', 'collection-template-guidance', 'bottom', 'top', 'explains membership', 'guidance')
];

const graph = {
  ...current,
  metadata: {
    ...(current.metadata || {}),
    title: 'Collection Template',
    description,
    graphId: 'collection-template',
    version: '1.0.0',
    kind: 'template'
  },
  nodes: [...modern.nodes, ...retained],
  edges,
  nodeCount: modern.nodes.length + retained.length,
  edgeCount: edges.length
};
fs.writeFileSync(output, `${JSON.stringify(graph, null, 2)}\n`);
