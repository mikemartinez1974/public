const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.join(__dirname, 'root.node');
const templateDir = path.resolve(__dirname, '../../templates/plan-template');
const template = JSON.parse(fs.readFileSync(path.join(templateDir, 'root.node'), 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));

const prefix = 'direct-edge-routing';
const graphId = `${prefix}-declaration`;
const graphRef = 'github://mikemartinez1974/public/plans/direct-edge-routing/root.node';
const templateClassPrefix = 'github://mikemartinez1974/public/templates/plan-template/classes/';
const now = '2026-09-03T12:00:00.000Z';
const replaceTemplateText = (value) => {
  if (Array.isArray(value)) return value.map(replaceTemplateText);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, replaceTemplateText(entry)]));
  }
  if (typeof value !== 'string') return value;
  if (value.startsWith(templateClassPrefix)) return value;
  return value
    .replaceAll('plan-template', prefix)
    .replaceAll('Plan Template', 'Direct Edge Routing Plan')
    .replaceAll('github://mikemartinez1974/public/templates/plan-template/root.node', graphRef);
};

const graph = replaceTemplateText(clone(template));
const semanticTypes = new Set([
  'plan', 'plan-goal', 'plan-phase', 'plan-action', 'plan-milestone',
  'plan-decision', 'plan-constraint', 'plan-risk', 'plan-contingency'
]);
const exemplars = new Map(
  template.nodes.filter((node) => semanticTypes.has(node.type)).map((node) => [node.type, node])
);

graph.nodes = graph.nodes.filter((node) => !semanticTypes.has(node.type));
graph.edges = graph.edges.filter((edge) => {
  const role = String(edge.data?.semanticRole || '').trim();
  return !role.startsWith('plan.') && role !== 'instantiates';
});

const makeNode = (type, id, label, position, description, extra = {}) => {
  const node = replaceTemplateText(clone(exemplars.get(type)));
  node.id = id;
  node.label = label;
  node.position = position;
  node.width = 360;
  node.height = 220;
  node.data = {
    ...node.data,
    title: label,
    description,
    status: 'draft',
    ...extra
  };
  return node;
};

const contentNodes = [
  makeNode('plan', `${prefix}-plan`, 'Make edge routes directly authorable', { x: 600, y: 0 }, 'Turn edge routing into a visible, persistent authoring surface without changing logical connectivity.'),
  makeNode('plan-goal', `${prefix}-goal`, 'Edges can be shaped without opening Properties', { x: 1080, y: 0 }, 'A user can select, shape, pin, reset, and understand an edge directly on the graph.'),

  makeNode('plan-phase', `${prefix}-phase-contract`, '1. Define routing identity and persistence', { x: 0, y: 360 }, 'Establish route pins as layout-only nodes owned by one logical edge.'),
  makeNode('plan-phase', `${prefix}-phase-editing`, '2. Add direct route editing', { x: 480, y: 360 }, 'Expose route pins and segment manipulation when an edge is selected.'),
  makeNode('plan-phase', `${prefix}-phase-routing`, '3. Preserve routing behavior', { x: 960, y: 360 }, 'Keep straight, curved, and orthogonal routes valid as nodes and pins move.'),
  makeNode('plan-phase', `${prefix}-phase-plumbing`, '4. Add semantic plumbing promotion', { x: 1440, y: 360 }, 'Allow an intentional route location to become a real router or junction node.'),

  makeNode('plan-action', `${prefix}-action-schema`, 'Persist route pins and manual mode', { x: 0, y: 720 }, 'Add a durable route-pin schema, edge ownership, ordering, validation, load, save, copy, and deletion behavior.'),
  makeNode('plan-action', `${prefix}-action-pin`, 'Make Pin Route and Unpin Route real', { x: 0, y: 1080 }, 'Pin materializes the current automatic route; unpin removes layout pins and restores automatic routing.'),
  makeNode('plan-action', `${prefix}-action-overlay`, 'Render selected-edge route controls', { x: 480, y: 720 }, 'Show compact draggable pins only for selected edges or explicit route-edit mode.'),
  makeNode('plan-action', `${prefix}-action-gestures`, 'Support insert, move, delete, and reset', { x: 480, y: 1080 }, 'Drag a segment to author a route, double-click to insert a pin, delete to simplify, and reset to recalculate.'),
  makeNode('plan-action', `${prefix}-action-geometry`, 'Constrain route geometry by edge style', { x: 960, y: 720 }, 'Use control pins for curves, segment-aware pin pairs for orthogonal edges, and manual routing when a straight edge gains a pin.'),
  makeNode('plan-action', `${prefix}-action-endpoints`, 'Keep endpoints attached during edits', { x: 960, y: 1080 }, 'Recalculate endpoint segments while preserving authored interior pins when connected nodes or handles move.'),
  makeNode('plan-action', `${prefix}-action-promote`, 'Promote a route pin to a router node', { x: 1440, y: 720 }, 'Replace layout-only routing with explicit graph topology only when the author requests a semantic junction.'),
  makeNode('plan-action', `${prefix}-action-guidance`, 'Document the authoring distinction', { x: 1440, y: 1080 }, 'Teach agents and UI that route pins alter presentation while router nodes alter graph logic.'),

  makeNode('plan-decision', `${prefix}-decision`, 'Route pins are not logical nodes', { x: 1920, y: 360 }, 'Keep source and target on one logical edge; only explicit router promotion may change topology.', { decision: 'Route pins use node-like layout entities referenced by an edge, but do not become edge endpoints.' }),
  makeNode('plan-constraint', `${prefix}-constraint-identity`, 'One logical edge remains one edge', { x: 0, y: 1440 }, 'Manual routing must never split traversal, port, execution, bridge, or deletion semantics.'),
  makeNode('plan-constraint', `${prefix}-constraint-ownership`, 'A route pin belongs to exactly one edge', { x: 480, y: 1440 }, 'Shared route pins are forbidden; shared topology requires a real router node.'),
  makeNode('plan-risk', `${prefix}-risk-drift`, 'Manual routes drift from moving endpoints', { x: 960, y: 1440 }, 'Stale route points may detach visually or become invalid after node and handle movement.'),
  makeNode('plan-risk', `${prefix}-risk-pollution`, 'Layout entities leak into graph semantics', { x: 1440, y: 1440 }, 'Search, execution, expansion, and agents may misread route pins as concepts unless role boundaries are enforced.'),
  makeNode('plan-contingency', `${prefix}-contingency`, 'Fall back to automatic rerouting', { x: 1920, y: 1440 }, 'When a manual route is invalid, preserve the logical edge, report diagnostics, and offer Reset Route.'),
  makeNode('plan-milestone', `${prefix}-milestone`, 'Direct edge authoring is complete', { x: 1920, y: 720 }, 'Users can shape and pin routes on canvas, persist them, and deliberately promote a pin into semantic plumbing.')
];
const statuses = {
  [`${prefix}-plan`]: 'in-progress',
  [`${prefix}-goal`]: 'in-progress',
  [`${prefix}-phase-contract`]: 'done',
  [`${prefix}-phase-editing`]: 'in-progress',
  [`${prefix}-action-schema`]: 'done',
  [`${prefix}-action-pin`]: 'done',
  [`${prefix}-action-overlay`]: 'done',
  [`${prefix}-action-gestures`]: 'in-progress',
  [`${prefix}-action-endpoints`]: 'done',
  [`${prefix}-decision`]: 'done',
  [`${prefix}-constraint-identity`]: 'done',
  [`${prefix}-constraint-ownership`]: 'done'
};
contentNodes.forEach((node) => {
  if (statuses[node.id]) node.data.status = statuses[node.id];
});
graph.nodes.push(...contentNodes);

const edgeStyle = {
  'plan.achieves': { stroke: '#059669', strokeWidth: 3 },
  'plan.contains': { stroke: '#334155', strokeWidth: 2 },
  'plan.precedes': { stroke: '#1d4ed8', strokeWidth: 2 },
  'plan.produces': { stroke: '#15803d', strokeWidth: 3 },
  'plan.gates': { stroke: '#b45309', strokeWidth: 2 },
  'plan.constrained-by': { stroke: '#64748b', strokeWidth: 2, dash: [8, 6] },
  'plan.threatened-by': { stroke: '#be123c', strokeWidth: 2, dash: [8, 6] },
  'plan.mitigated-by': { stroke: '#6d28d9', strokeWidth: 2 }
};
const edgePorts = {
  'plan.achieves': ['goal', 'plan'],
  'plan.precedes': ['next', 'previous'],
  'plan.produces': ['outcome', 'input'],
  'plan.gates': ['outcomes', 'gate'],
  'plan.constrained-by': ['support', 'subject'],
  'plan.threatened-by': ['support', 'subject'],
  'plan.mitigated-by': ['mitigation', 'trigger']
};
const addEdge = (id, type, source, target, ports = edgePorts[type]) => {
  graph.edges.push({
    id, type, label: type.replace('plan.', '').replaceAll('-', ' '), source, target,
    sourcePort: ports[0], sourceHandle: ports[0], targetPort: ports[1], targetHandle: ports[1],
    style: { ...edgeStyle[type], curved: true, dash: edgeStyle[type]?.dash || [] },
    data: { semanticRole: type, presentation: { layer: 'semantic' } }
  });
};

addEdge(`${prefix}-edge-goal`, 'plan.achieves', `${prefix}-plan`, `${prefix}-goal`);
for (const phase of ['contract', 'editing', 'routing', 'plumbing']) {
  addEdge(`${prefix}-edge-plan-${phase}`, 'plan.contains', `${prefix}-plan`, `${prefix}-phase-${phase}`, ['phases', 'parent']);
}
addEdge(`${prefix}-edge-phase-1-2`, 'plan.precedes', `${prefix}-phase-contract`, `${prefix}-phase-editing`);
addEdge(`${prefix}-edge-phase-2-3`, 'plan.precedes', `${prefix}-phase-editing`, `${prefix}-phase-routing`);
addEdge(`${prefix}-edge-phase-3-4`, 'plan.precedes', `${prefix}-phase-routing`, `${prefix}-phase-plumbing`);

const phaseActions = {
  contract: ['schema', 'pin'], editing: ['overlay', 'gestures'],
  routing: ['geometry', 'endpoints'], plumbing: ['promote', 'guidance']
};
for (const [phase, actions] of Object.entries(phaseActions)) {
  for (const action of actions) {
    addEdge(`${prefix}-edge-${phase}-${action}`, 'plan.contains', `${prefix}-phase-${phase}`, `${prefix}-action-${action}`, ['actions', 'parent']);
  }
}
addEdge(`${prefix}-edge-decision`, 'plan.produces', `${prefix}-action-schema`, `${prefix}-decision`);
addEdge(`${prefix}-edge-identity`, 'plan.constrained-by', `${prefix}-action-schema`, `${prefix}-constraint-identity`);
addEdge(`${prefix}-edge-ownership`, 'plan.constrained-by', `${prefix}-action-pin`, `${prefix}-constraint-ownership`);
addEdge(`${prefix}-edge-drift`, 'plan.threatened-by', `${prefix}-action-endpoints`, `${prefix}-risk-drift`);
addEdge(`${prefix}-edge-pollution`, 'plan.threatened-by', `${prefix}-action-promote`, `${prefix}-risk-pollution`);
addEdge(`${prefix}-edge-contingency`, 'plan.mitigated-by', `${prefix}-risk-drift`, `${prefix}-contingency`);
addEdge(`${prefix}-edge-milestone`, 'plan.produces', `${prefix}-action-guidance`, `${prefix}-milestone`);

for (const node of contentNodes) {
  const bridgeId = `${prefix}-class-bridge-${node.type}`;
  graph.edges.push({
    id: `${node.id}-instantiates`, type: 'reference', label: '', source: bridgeId, target: node.id,
    sourcePort: 'root', sourceHandle: 'root', targetPort: 'root', targetHandle: 'root', hidden: true,
    style: { stroke: '#64748b', strokeWidth: 1, opacity: 0.03 },
    data: { role: 'instantiates', semanticRole: 'instantiates', presentation: { layer: 'contract' } }
  });
}

graph.metadata = {
  ...graph.metadata,
  title: 'Direct Edge Routing and Route Pins',
  description: 'Plan for direct on-canvas edge shaping with persistent layout-only route pins and explicit semantic router promotion.',
  graphId,
  version: '0.1.0',
  created: now,
  modified: now,
  tags: ['plan', 'edges', 'routing', 'route-pins', 'authoring']
};
const declaration = graph.nodes.find((node) => node.id === graphId);
declaration.label = 'Direct Edge Routing Plan';
declaration.data.identity = {
  ...declaration.data.identity,
  graphId,
  nodeId: 'direct-edge-routing-plan',
  name: 'Direct Edge Routing and Route Pins',
  version: '0.1.0',
  description: graph.metadata.description
};
declaration.data.document = { url: graphRef };
declaration.data.dependencies = { ...(declaration.data.dependencies || {}), skills: ['plan-template'] };

const rootPort = graph.nodes.find((node) => node.id === `${prefix}-root-port`);
rootPort.label = 'Direct Edge Routing Plan';
rootPort.data.title = 'Direct Edge Routing and Route Pins';
rootPort.data.identity = { ...rootPort.data.identity, graphId, nodeId: 'direct-edge-routing-plan' };

const detailSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 440" role="img" aria-label="Direct edge routing plan"><rect width="720" height="440" rx="20" fill="#111827"/><text x="42" y="62" fill="#67e8f9" font-family="system-ui,sans-serif" font-size="16" font-weight="800">DIRECT EDGE AUTHORING</text><circle cx="92" cy="220" r="34" fill="#e2e8f0" stroke="#22c55e" stroke-width="6"/><circle cx="628" cy="220" r="34" fill="#e2e8f0" stroke="#f59e0b" stroke-width="6"/><path d="M126 220 H260 V130 H448 V220 H594" fill="none" stroke="#93c5fd" stroke-width="7"/><g fill="#fbbf24" stroke="#111827" stroke-width="4"><circle cx="260" cy="220" r="13"/><circle cx="260" cy="130" r="13"/><circle cx="448" cy="130" r="13"/><circle cx="448" cy="220" r="13"/></g><text x="42" y="380" fill="#f8fafc" font-family="system-ui,sans-serif" font-size="28" font-weight="800">One logical edge. Authorable route.</text></svg>`;
const summarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" role="img" aria-label="Route pin summary"><rect width="520" height="320" rx="20" fill="#0f172a"/><circle cx="64" cy="160" r="24" fill="#dbeafe"/><circle cx="456" cy="160" r="24" fill="#dbeafe"/><path d="M88 160 H190 V92 H330 V160 H432" fill="none" stroke="#38bdf8" stroke-width="6"/><g fill="#f59e0b"><circle cx="190" cy="160" r="10"/><circle cx="190" cy="92" r="10"/><circle cx="330" cy="92" r="10"/><circle cx="330" cy="160" r="10"/></g><text x="34" y="48" fill="#f8fafc" font-family="system-ui,sans-serif" font-size="24" font-weight="800">Route pins</text><text x="34" y="286" fill="#a7f3d0" font-family="system-ui,sans-serif" font-size="16">Layout changes without false topology</text></svg>`;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" role="img" aria-label="Route pin icon"><rect width="320" height="220" rx="18" fill="#111827"/><path d="M34 154 H112 V68 H208 V154 H286" fill="none" stroke="#38bdf8" stroke-width="9"/><g fill="#fbbf24" stroke="#111827" stroke-width="3"><circle cx="112" cy="154" r="12"/><circle cx="112" cy="68" r="12"/><circle cx="208" cy="68" r="12"/><circle cx="208" cy="154" r="12"/></g></svg>`;
for (const [suffix, svg] of [['detail-view', detailSvg], ['summary-view', summarySvg], ['icon-view', iconSvg]]) {
  const view = graph.nodes.find((node) => node.id === `${prefix}-${suffix}`);
  view.label = `Direct Edge Routing ${suffix.replace('-', ' ')}`;
  view.data.content = { kind: 'svg', value: svg };
  view.data.identity = { ...view.data.identity, graphId, nodeId: 'direct-edge-routing-plan' };
}
const landing = graph.nodes.find((node) => node.id === `${prefix}-landing-content`);
landing.label = 'Direct Edge Routing Plan';
landing.data.content = { kind: 'svg', value: detailSvg };
landing.data.identity = { ...landing.data.identity, graphId, nodeId: 'direct-edge-routing-plan' };

const instructions = graph.nodes.find((node) => node.id === `${prefix}-instructions`);
instructions.label = 'Route Authoring Contract';
instructions.data.markdown = '# Route authoring contract\n\n- A route pin changes presentation, never logical connectivity.\n- A route pin belongs to exactly one edge.\n- Pin Route persists the current route; Unpin Route returns it to automatic routing.\n- Shared or branching topology requires an explicit router node.\n- Invalid manual geometry preserves the logical edge and offers Reset Route.';

for (const node of graph.nodes) {
  if (node.data?.identity?.graphId) node.data.identity.graphId = graphId;
}
graph.settings = {
  ...graph.settings,
  snapToGrid: true,
  gridSize: 20,
  edgeRouting: 'orthogonal',
  layout: { mode: 'manual', defaultLayout: 'layered', direction: 'RIGHT', edgeLaneGapPx: 20 }
};
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
graph.timestamp = now;

fs.mkdirSync(__dirname, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
