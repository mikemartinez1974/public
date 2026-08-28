const fs = require('fs');
const path = require('path');
const { bindHandles, makeModernInterface } = require('../templates/_support/modern-template.cjs');

const graphId = 'edge-label-navigation-smoke-declaration';
const prefix = 'edge-label-navigation-smoke';
const rootPort = (direction = 'bidirectional', angle = 180) => ({
  id: 'root', key: 'root', label: 'root', direction, dataType: 'any', angle,
});
const doorPort = (id, label, angle) => ({
  id, key: id, label, direction: 'output', dataType: 'navigation', angle,
  role: 'navigation.door', metadata: { structural: true, relationship: true, role: 'navigation.door' },
});
const contentNode = ({ id, label, position, markdown, ports = [rootPort()] }) => ({
  id, type: 'content', label, position, width: 420, height: 280,
  ports, handles: bindHandles(ports), visible: true, showLabel: true,
  data: {
    content: { kind: 'markdown', value: markdown },
    renderShape: { kind: 'markdown' },
    identity: { graphId },
  },
});

const iface = makeModernInterface({
  prefix,
  graphId,
  nodeId: 'edge-label-navigation-smoke',
  name: 'Edge and Label Navigation Smoke Test',
  kind: 'smoke-test',
  description: 'Prove opposite-endpoint focus, logical door navigation, elevator choice, navigation history, portal entry, and edit-mode non-interference.',
  glyph: '⇥',
  origin: { x: -1200, y: -1200 },
});

const lobbyPorts = [
  rootPort('input', 180),
  doorPort('single-door', 'single door', 0),
  doorPort('elevator', 'elevator', 90),
  doorPort('prior-art', 'prior art', 270),
];
const nodes = [
  ...iface.nodes,
  contentNode({
    id: `${prefix}-lobby`, label: 'Focused Lobby', position: { x: -260, y: -120 }, ports: lobbyPorts,
    markdown: '# Focused Lobby\n\nBegin focused here. Activating a relationship chooses the endpoint opposite this node.\n\n- **single door** has one destination\n- **elevator** has two destinations and must ask\n- **prior art** enters a portal',
  }),
  contentNode({
    id: `${prefix}-room-a`, label: 'Room A', position: { x: 420, y: -260 },
    markdown: '# Room A\n\nThe single-door edge should focus this node immediately and frame this surface.',
  }),
  contentNode({
    id: `${prefix}-room-b`, label: 'Room B', position: { x: 260, y: 360 },
    markdown: '# Room B\n\nOne elevator destination. It must not be selected until the user chooses it.',
  }),
  contentNode({
    id: `${prefix}-room-c`, label: 'Room C', position: { x: 780, y: 360 },
    markdown: '# Room C\n\nThe other elevator destination. Both choices share the Lobby elevator port and handle.',
  }),
  {
    id: `${prefix}-focus-model-portal`, type: 'portal', label: 'Focus Model',
    position: { x: -900, y: -120 }, width: 360, height: 240,
    ports: [rootPort('input', 180)], handles: bindHandles([rootPort('input', 180)]),
    visible: true, showLabel: true,
    data: {
      ref: 'github://mikemartinez1974/public/ideas/focus-model.node',
      target: { mode: 'navigate', ref: 'github://mikemartinez1974/public/ideas/focus-model.node' },
      authority: 'navigate', visibilityRole: 'browser', identity: { graphId },
    },
  },
  contentNode({
    id: `${prefix}-criteria`, label: 'Pass Criteria', position: { x: 1240, y: -80 },
    markdown: '# Pass Criteria\n\n1. At zoom ≥ 1, clicking **single door** or its edge focuses Room A.\n2. From the Lobby, either elevator edge or its shared label opens a Room B/Room C choice.\n3. From Room A, activating the connecting edge focuses the opposite endpoint: Lobby.\n4. Portal entry navigates through Focus Model rather than merely selecting the portal.\n5. Back restores the prior focused node and viewport.\n6. In Edit mode, focused-edge endpoint controls win over navigation.\n7. No edge stores a semantic port separately from its handle; the handle routes to `portId`.',
  }),
];

const navEdge = ({ id, source, sourceHandle, target, label, role = 'navigation.door' }) => ({
  id, type: 'reference', source, sourceHandle, target, targetHandle: 'root', label,
  data: { semanticRole: role, navigation: { mode: 'focus-opposite-endpoint', minimumZoom: 1 } },
});
const edges = [
  ...iface.edges,
  navEdge({
    id: `${prefix}-single-door-edge`, source: `${prefix}-lobby`, sourceHandle: 'single-door',
    target: `${prefix}-room-a`, label: 'single door',
  }),
  navEdge({
    id: `${prefix}-elevator-room-b-edge`, source: `${prefix}-lobby`, sourceHandle: 'elevator',
    target: `${prefix}-room-b`, label: 'elevator · Room B',
  }),
  navEdge({
    id: `${prefix}-elevator-room-c-edge`, source: `${prefix}-lobby`, sourceHandle: 'elevator',
    target: `${prefix}-room-c`, label: 'elevator · Room C',
  }),
  navEdge({
    id: `${prefix}-prior-art-edge`, source: `${prefix}-lobby`, sourceHandle: 'prior-art',
    target: `${prefix}-focus-model-portal`, label: 'focus model', role: 'navigation.portal-entry',
  }),
];

const now = new Date().toISOString();
const graph = {
  fileVersion: '1.0',
  metadata: {
    title: 'Edge and Label Navigation Smoke Test',
    description: 'Interaction specimen for relationship-driven focus navigation.',
    graphId, version: '0.1.0', kind: 'graph', created: now, modified: now,
    tags: ['smoke-test', 'navigation', 'focus', 'edges'], preferredViewer: 'https://dev.twilite.zone',
  },
  nodes, edges, timestamp: now, nodeCount: nodes.length, edgeCount: edges.length,
};

fs.writeFileSync(path.join(__dirname, 'edge-label-navigation-smoke.node'), `${JSON.stringify(graph, null, 2)}\n`);
