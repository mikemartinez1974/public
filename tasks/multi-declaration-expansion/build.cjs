const fs = require('fs');
const path = require('path');

const prefix = 'multi-declaration-expansion-task';
const graphId = `${prefix}-declaration`;
const templatePath = path.resolve(__dirname, '../../../../twilite-zone/public/library/classes/nodes/task-planning/task-graph-template.node');
const outputPath = path.resolve(__dirname, 'root.node');
const graph = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

const idMap = new Map();
for (const node of graph.nodes) {
  if (node.id.startsWith('task-graph-template-')) {
    idMap.set(node.id, node.id.replace(/^task-graph-template-/, `${prefix}-`));
  }
}
for (const node of graph.nodes) {
  node.id = idMap.get(node.id) || node.id;
  if (node.data?.identity) node.data.identity.graphId = graphId;
  if (node.data?._bridge?.sourceNodeId) node.data._bridge.sourceNodeId = idMap.get(node.data._bridge.sourceNodeId) || node.data._bridge.sourceNodeId;
  if (node.data?._bridge?.sourceBridgeNodeId) node.data._bridge.sourceBridgeNodeId = idMap.get(node.data._bridge.sourceBridgeNodeId) || node.data._bridge.sourceBridgeNodeId;
}
for (const edge of graph.edges) {
  edge.id = edge.id.replace(/^task-graph-template-/, `${prefix}-`);
  edge.source = idMap.get(edge.source) || edge.source;
  edge.target = idMap.get(edge.target) || edge.target;
}

const get = (suffix) => graph.nodes.find((node) => node.id === `${prefix}-${suffix}`);
const set = (suffix, patch) => {
  const node = get(suffix);
  if (!node) throw new Error(`Missing node ${suffix}`);
  const priorData = node.data || {};
  Object.assign(node, patch);
  if (patch.data) node.data = { ...priorData, ...patch.data };
  return node;
};

graph.metadata = {
  ...graph.metadata,
  title: 'Prove Multi-Declaration Expansion',
  description: 'Prove reversible same-node expansion across two explicitly participating graph declarations.',
  graphId,
  version: '0.1.0',
  kind: 'task',
  modified: '2026-08-29T00:00:00.000Z',
  tags: ['task', 'expansion', 'multi-graph', 'declaration', 'graph-lab']
};

const declaration = get('declaration');
declaration.label = 'Prove Multi-Declaration Expansion';
declaration.data.identity = {
  graphId,
  nodeId: 'task',
  name: 'Prove Multi-Declaration Expansion',
  version: '0.1.0',
  description: 'Prove that one semantic node can expand an explicitly participating graph into the current canvas without losing identity or ownership.',
  updatedAt: '2026-08-29T00:00:00.000Z'
};
declaration.data.intent = { kind: 'task', scope: 'shared' };
declaration.data.summaryNodeId = `${prefix}-summary`;
declaration.data.name = 'Prove Multi-Declaration Expansion';
declaration.data.declaresKind = 'task';
declaration.data.purpose = 'Turn the multi-declaration expansion idea and partial runtime implementation into a small, independently verifiable contract.';
declaration.data.primaryNodeViewId = `${prefix}-detail-view`;
declaration.data.declaration = {
  ...declaration.data.declaration,
  kind: 'task',
  artifactKind: 'task-graph',
  surfaces: [{
    id: 'summary',
    kind: 'port',
    label: 'Multi-Declaration Expansion Summary',
    portNodeId: `${prefix}-summary-port`,
    viewNodeId: `${prefix}-summary-view`,
    exposes: { views: { mode: 'allow' }, declarations: { mode: 'allow' } }
  }]
};

set('goal', {
  label: 'Prove reversible same-node expansion across two graphs',
  data: {
    body: 'Establish a minimal, graph-native proof that two declarations with the same nodeId and distinct graphIds can participate explicitly, expand into one canvas, and collapse without changing semantic identity or source ownership.',
    priority: 'critical',
    status: 'done',
    owner: 'Michael',
    successMetrics: [
      'A paired host/participant fixture expresses the contract without directory discovery',
      'Expansion materializes namespaced nodes with source provenance and focuses the declared landing surface',
      'Collapse removes only the projection and leaves the host node unchanged',
      'Identity mismatch and ambiguous participation fail visibly and deterministically',
      'Alias-aware automated tests, production build, and visual Graph Lab proof pass'
    ]
  }
});

const taskBase = get('task');
const taskSpecs = [
  {
    suffix: 'task-contract',
    label: '1 · Freeze the same-node expansion contract',
    status: 'done',
    body: 'Completed in the prior implementation slice: nodeId is semantic identity, graphId is the contributing declaration, target.mode expand is distinct from navigation, public surfaces define exposure, projected IDs are namespaced, and collapse removes only expansion provenance.',
    acceptanceCriteria: ['The compatibility path accepts same-node participants and rejects mismatched nodeIds', 'Landing-surface selection and projection provenance are explicit']
  },
  {
    suffix: 'task-fixtures',
    label: '2 · Build the paired two-graph fixture',
    status: 'done',
    body: 'Create tiny host and participant graphs with one shared nodeId, distinct graphIds, explicit participation, one expand target, one public landing surface, and enough child structure to make materialization and collapse observable.',
    acceptanceCriteria: ['Both fixtures parse and resolve independently', 'No broad existing expansion fixture is required to understand the proof', 'The host distinguishes expand from ordinary navigation']
  },
  {
    suffix: 'task-tests',
    label: '3 · Complete alias-aware runtime tests',
    status: 'done',
    body: 'Run and repair the focused GraphCRUD and declaration-contract tests through the repository-supported environment so graphRefLoader aliases resolve.',
    acceptanceCriteria: ['Same-node compatibility, mismatch rejection, landing-surface resolution, materialization, deduplication, and collapse pass', 'The test command uses the supported alias-aware runner']
  },
  {
    suffix: 'task-build',
    label: '4 · Prove the production build',
    status: 'done',
    body: 'Run the Twilite production build after the focused expansion tests and separate pre-existing toolchain failures from expansion regressions.',
    acceptanceCriteria: ['The production build passes or a precise unrelated blocker is recorded']
  },
  {
    suffix: 'task-visual',
    label: '5 · Verify expansion and collapse in Graph Lab',
    status: 'done',
    body: 'Open the paired fixture in Twilite and verify replacement-style expansion: the reference disappears, the participant landing Content node occupies its position with a Collapse control, participant structure remains source-owned, and collapse restores the original reference and authored edges.',
    acceptanceCriteria: ['Expansion replaces the visible reference without deleting its hidden authored anchor', 'The landing Content node exposes Collapse and participant nodes retain provenance', 'Collapse restores the original reference, position, visibility, and edge presentation', 'The idea graph receives implementation evidence and any resolved decisions']
  }
];

const taskNodes = [];
for (let index = 0; index < taskSpecs.length; index += 1) {
  const spec = taskSpecs[index];
  const node = index === 0 ? taskBase : JSON.parse(JSON.stringify(taskBase));
  node.id = `${prefix}-${spec.suffix}`;
  node.label = spec.label;
  node.position = { x: 40 + (index % 2) * 520, y: -520 + Math.floor(index / 2) * 360 };
  node.data = {
    ...node.data,
    title: spec.label,
    body: spec.body,
    priority: index < 3 ? 'critical' : 'high',
    status: spec.status,
    owner: 'Michael',
    estimateHours: index === 0 ? '' : '1',
    externalRef: 'github://mikemartinez1974/public/ideas/multi-declaration-expansion/root.node',
    acceptanceCriteria: spec.acceptanceCriteria,
    identity: { graphId }
  };
  taskNodes.push(node);
}
graph.nodes = graph.nodes.filter((node) => node !== taskBase);
graph.nodes.push(...taskNodes);

set('question', {
  label: 'How is participation explicitly discovered?',
  data: {
    body: 'Choose the smallest authored relationship that makes another same-node declaration discoverable without treating shared nodeId or directory proximity as sufficient authority.',
    status: 'resolved',
    owner: 'Michael',
    resolutionPath: 'An explicitly authored graph reference with target.mode expand establishes participation; shared nodeId validates compatibility but does not independently authorize discovery.',
    prominence: 'high'
  }
});

set('decision', {
  label: 'Expansion replaces the reference presentation',
  data: {
    rationale: 'Leaving a portal beside its expanded participant duplicates the same doorway and weakens the spatial meaning of expansion. A hidden authored anchor preserves identity and reversibility without remaining visible.',
    status: 'decided',
    decidedAt: '2026-08-29',
    owner: 'Michael',
    body: 'Use an explicit expand target for same-node projection. While expanded, hide the authored reference and its connected edges, place the participant landing node at the reference position, and expose Collapse on that landing node. Collapse removes only the projection and restores the reference exactly. Ordinary navigation remains separate.'
  }
});

const summary = set('summary', {
  label: 'Prove Multi-Declaration Expansion',
  data: {
    goal: 'Prove reversible same-node expansion across two graphs',
    title: 'Prove reversible same-node expansion across two graphs',
    status: 'done',
    priority: 'critical',
    owner: 'Michael',
    taskProgress: { completed: 5, total: 5 },
    questionProgress: { answered: 1, total: 1 },
    taskTitles: taskSpecs.map((task) => task.label),
    questionTitles: ['How is participation explicitly discovered?'],
    taskListText: taskSpecs.map((task, index) => `${index + 1}. ${task.label}`).join('\n'),
    questionListText: '1. How is participation explicitly discovered?',
    body: `Goal: Prove reversible same-node expansion across two graphs\nStatus: done\n\nTasks completed:\n${taskSpecs.map((task, index) => `${index + 1}. ${task.label}`).join('\n')}\n\nResolved questions:\n1. How is participation explicitly discovered?`,
    summarySource: 'node-updater',
    updatedAt: '2026-08-29T00:00:00.000Z',
    nextAction: 'Completed. Preserve the paired fixtures as the regression case for replacement-style same-node expansion.',
    blockedReason: '',
    health: 'complete',
    completedAt: '2026-08-29T00:00:00.000Z',
    outcome: 'Delivered explicit Expand and Collapse controls, Content-node fixtures, same-node compatibility checks, replacement-style projection over a preserved hidden reference, and exact restoration of the authored reference and edges.',
    externalRef: 'github://mikemartinez1974/public/ideas/multi-declaration-expansion/root.node'
  }
});
summary.data.definitionKey = 'task';

const updater = get('updater');
updater.data.summaryNodeId = `${prefix}-summary`;
updater.data.source = updater.data.source.replaceAll('task-graph-template-summary', `${prefix}-summary`);

set('summary-port', {
  label: 'Prove Multi-Declaration Expansion',
  data: {
    surfaceId: 'summary',
    sourceNodeId: `${prefix}-summary`,
    sourcePayload: 'node.web',
    renderedNodeType: 'task',
    identity: { graphId }
  }
});
for (const level of ['detail', 'summary', 'icon', 'glyph']) {
  get('summary-port').data.presentation[level].viewNodeId = `${prefix}-summary`;
}

set('detail-view', { label: 'Multi-Declaration Expansion Detail', data: { content: { kind: 'markdown', value: '# Multi-Declaration Expansion\n\nProve one semantic identity across two explicitly participating graph declarations, with reversible in-canvas projection.' } } });
set('summary-view', { label: 'Multi-Declaration Expansion Summary', data: { content: { kind: 'markdown', value: '## Multi-Declaration Expansion\n\nOne identity, explicit participation, reversible projection, independently verified.' } } });
set('icon-view', { label: 'Multi-Declaration Expansion Icon', data: { content: { kind: 'svg', value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='28' fill='#0f172a'/><circle cx='160' cy='110' r='34' fill='#38bdf8'/><circle cx='78' cy='72' r='24' fill='#818cf8'/><circle cx='242' cy='72' r='24' fill='#34d399'/><path d='M101 82L132 99M219 82L188 99' stroke='#e2e8f0' stroke-width='10' stroke-linecap='round'/><text x='160' y='184' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='18' font-weight='800'>EXPAND</text></svg>" } } });
set('glyph', { label: 'Expansion Glyph', data: { glyph: { kind: 'character', value: '◎' } } });
set('landing-surface', { label: 'Multi-Declaration Expansion Landing Surface', data: { content: { kind: 'markdown', value: '# Prove Multi-Declaration Expansion\n\nStart with the paired host and participant fixture. Keep expansion explicit, identity singular, provenance durable, and collapse reversible.' } } });

graph.edges = graph.edges.filter((edge) => edge.id !== `${prefix}-edge-002`);
for (let index = 0; index < taskNodes.length; index += 1) {
  graph.edges.push({
    id: `${prefix}-goal-task-${index + 1}`,
    type: 'reference',
    source: `${prefix}-goal`,
    target: taskNodes[index].id,
    label: index === 0 ? 'establishes' : 'task',
    style: {},
    data: { sequence: index + 1 },
    sourceHandle: 'right',
    targetHandle: 'left'
  });
}

graph.timestamp = '2026-08-29T00:00:00.000Z';
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
console.log(`Wrote ${graph.nodes.length} nodes and ${graph.edges.length} edges to ${outputPath}`);
