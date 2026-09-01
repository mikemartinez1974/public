const fs = require('fs');
const path = require('path');

const templatePath = path.resolve(__dirname, '../../templates/plan-template/root.node');
const outputPath = path.join(__dirname, 'root.node');
const oldPrefix = 'plan-template';
const prefix = 'fragment-extraction-authoring';
const graphId = `${prefix}-declaration`;

const graph = JSON.parse(fs.readFileSync(templatePath, 'utf8').replaceAll(oldPrefix, prefix));
const clone = (value) => JSON.parse(JSON.stringify(value));
const byId = (id) => graph.nodes.find((node) => node.id === id);
const configure = (node, { id, title, description, status = 'planned', notes = '', position }) => {
  node.id = id;
  node.label = title;
  node.position = position;
  Object.assign(node.data, { title, description, status, notes });
  return node;
};

const declaration = byId(graphId);
declaration.label = 'Fragment Extraction Authoring Contract';
declaration.data.identity = {
  graphId,
  nodeId: 'fragment-extraction-authoring-contract',
  name: 'Fragment Extraction Authoring Contract',
  version: '1.0.0',
  description: 'Plan the identity-preserving authoring workflow for extracting an inline semantic node into a reciprocally bridged fragment.',
};
declaration.data.intent = { kind: 'plan', scope: 'implementation' };
declaration.data.declaration.kind = 'graph';
declaration.data.declaration.artifactKind = 'plan';
declaration.data.declaration.surfaces[0].label = 'Fragment Extraction Authoring Contract';
declaration.data.document = { url: 'github://mikemartinez1974/public/plans/fragment-extraction-authoring-contract/root.node' };

const rootPort = byId(`${prefix}-root-port`);
rootPort.label = 'Fragment Extraction Authoring Contract';
Object.assign(rootPort.data, {
  title: 'Fragment Extraction Authoring Contract',
  summary: 'Preserve identity while moving a semantic node from inline storage into a reciprocal fragment.',
  identity: { graphId, nodeId: 'fragment-extraction-authoring-contract' },
});

const detailView = byId(`${prefix}-detail-view`);
detailView.label = 'Fragment Extraction Plan Detail';
detailView.data.identity = { graphId, nodeId: 'fragment-extraction-authoring-contract' };
detailView.data.content = {
  kind: 'svg',
  value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'><rect width='640' height='400' rx='20' fill='#f8fafc'/><rect width='640' height='70' rx='20' fill='#17324d'/><rect y='50' width='640' height='20' fill='#17324d'/><text x='30' y='44' fill='#fff' font-family='system-ui' font-size='23' font-weight='700'>EXTRACT AS FRAGMENT</text><rect x='42' y='112' width='210' height='210' rx='16' fill='#dbeafe' stroke='#2563eb' stroke-width='5'/><text x='147' y='151' text-anchor='middle' fill='#1e3a8a' font-family='system-ui' font-size='18' font-weight='700'>HOST GRAPH</text><rect x='91' y='185' width='112' height='72' rx='10' fill='#fff' stroke='#4f46e5' stroke-width='4'/><text x='147' y='216' text-anchor='middle' fill='#312e81' font-family='system-ui' font-size='14' font-weight='700'>PLAN</text><text x='147' y='238' text-anchor='middle' fill='#475569' font-family='monospace' font-size='11'>nodeId: P</text><path d='M274 194h92l-16-16m16 16-16 16M366 242h-92l16-16m-16 16 16 16' fill='none' stroke='#334155' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/><rect x='388' y='112' width='210' height='210' rx='16' fill='#dcfce7' stroke='#16a34a' stroke-width='5'/><text x='493' y='151' text-anchor='middle' fill='#14532d' font-family='system-ui' font-size='18' font-weight='700'>PLAN FRAGMENT</text><text x='493' y='208' text-anchor='middle' fill='#166534' font-family='monospace' font-size='14'>nodeId: P</text><text x='493' y='235' text-anchor='middle' fill='#166534' font-family='monospace' font-size='13'>graphId: fragment</text><text x='320' y='365' text-anchor='middle' fill='#334155' font-family='system-ui' font-size='15' font-weight='700'>IDENTITY PRESERVED - CONTENT MOVED - BRIDGES RECIPROCAL</text></svg>",
};

const summaryView = byId(`${prefix}-summary-view`);
summaryView.label = 'Fragment Extraction Plan Summary';
summaryView.data.identity = { graphId, nodeId: 'fragment-extraction-authoring-contract' };
summaryView.data.content = {
  kind: 'svg',
  value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'><rect width='640' height='400' rx='20' fill='#17324d'/><text x='30' y='48' fill='#fff' font-family='system-ui' font-size='22' font-weight='700'>FRAGMENT AUTHORING PLAN</text><g font-family='system-ui'><rect x='34' y='88' width='572' height='54' rx='10' fill='#2563eb'/><text x='56' y='121' fill='#fff' font-size='17' font-weight='700'>1  Define identity and ownership</text><rect x='34' y='156' width='572' height='54' rx='10' fill='#16a34a'/><text x='56' y='189' fill='#fff' font-size='17' font-weight='700'>2  Design the atomic extraction transaction</text><rect x='34' y='224' width='572' height='54' rx='10' fill='#d97706'/><text x='56' y='257' fill='#fff' font-size='17' font-weight='700'>3  Implement UI and agent operations</text><rect x='34' y='292' width='572' height='54' rx='10' fill='#7c3aed'/><text x='56' y='325' fill='#fff' font-size='17' font-weight='700'>4  Integrate complete bridge-closure loading</text></g></svg>",
};

const iconView = byId(`${prefix}-icon-view`);
iconView.label = 'Fragment Extraction Plan Icon';
iconView.data.identity = { graphId, nodeId: 'fragment-extraction-authoring-contract' };
iconView.data.content = {
  kind: 'svg',
  value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='24' fill='#17324d'/><rect x='34' y='58' width='86' height='104' rx='12' fill='#dbeafe' stroke='#38bdf8' stroke-width='6'/><rect x='200' y='58' width='86' height='104' rx='12' fill='#dcfce7' stroke='#2cb67d' stroke-width='6'/><path d='M137 90h46l-12-12m12 12-12 12M183 130h-46l12-12m-12 12 12 12' fill='none' stroke='#fff' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/><text x='160' y='194' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='18' font-weight='700'>FRAGMENT</text></svg>",
};
byId(`${prefix}-glyph`).data.identity = { graphId, nodeId: 'fragment-extraction-authoring-contract' };
const landing = byId(`${prefix}-landing-content`);
landing.data.identity = { graphId, nodeId: 'fragment-extraction-authoring-contract' };
landing.data.content = { kind: 'markdown', value: '# Fragment Extraction Authoring Contract\n\nCoordinate identity, extraction, authoring interfaces, and complete reciprocal bridge loading.' };

const plan = configure(byId(`${prefix}-plan`), {
  id: `${prefix}-plan`, title: 'Turn semantic nodes into explicit fragments',
  description: 'Define one authoring operation that supports inline creation, standalone creation, later attachment, and identity-preserving fragment extraction.',
  status: 'planned', notes: 'Fragmentation changes storage and contribution boundaries, not semantic identity.', position: { x: 0, y: 0 },
});
const goal = configure(byId(`${prefix}-plan-goal`), {
  id: `${prefix}-goal`, title: 'An explicit, atomic, identity-preserving fragment workflow',
  description: 'UI and agents perform the same validated transaction without copying plan logic, changing nodeId, or persisting a one-way bridge.',
  status: 'target', position: { x: 0, y: -360 },
});

const basePhase = byId(`${prefix}-plan-phase`);
const phaseSpecs = [
  ['identity', '1. Define identity and contribution ownership', 'Specify nodeId preservation, graphId provenance, and one authoritative owner for every mutable field.'],
  ['transaction', '2. Design the extraction transaction', 'Define selection, file creation, content migration, participant retention, reciprocal bridge creation, validation, commit, and rollback.'],
  ['authoring', '3. Implement UI and agent authoring operations', 'Expose equivalent commands for inline creation, standalone creation, attachment, extraction, inspection, and detachment.'],
  ['closure', '4. Integrate complete bridge-closure loading', 'Resolve every reciprocal same-node contribution before treating the semantic node as complete while allowing selective rendering.'],
];
const phases = phaseSpecs.map(([key, title, description], index) => configure(clone(basePhase), {
  id: `${prefix}-phase-${key}`, title, description, position: { x: -780 + index * 520, y: 360 },
}));

const baseAction = byId(`${prefix}-plan-action`);
const actionSpecs = [
  ['identity', 'Write the identity and authority contract', 'Assign nodeId at first authoring, preserve it across transformations, and prevent duplicated plan authority.', 0],
  ['selection', 'Define deterministic extraction selection', 'Classify moved nodes, internal edges, retained host edges, public ports, and ambiguous supporting content.', 1],
  ['atomic', 'Implement two-graph atomic persistence', 'Write both reciprocal bridge contributions only after both graphs validate; rollback leaves the inline graph unchanged.', 1],
  ['ui', 'Add fragment lifecycle UI', 'Provide Extract as Fragment, Attach to Graph, Open Fragment, Show Contributions, and Detach Fragment with a transaction preview.', 2],
  ['agents', 'Publish equivalent agent guidance', 'Map natural language to the same operations and prohibit copies, nodeId changes, and one-sided bridges.', 2],
  ['loader', 'Load the complete reciprocal closure', 'Expose loading, complete, incomplete, and invalid states for the assembled semantic node.', 3],
];
const actions = actionSpecs.map(([key, title, description, phase], index) => configure(clone(baseAction), {
  id: `${prefix}-action-${key}`, title, description, position: { x: -900 + index * 360, y: 720 + (index % 2) * 270 }, notes: `Phase ${phase + 1}`,
}));

const baseMilestone = byId(`${prefix}-plan-milestone`);
const milestones = [
  configure(clone(baseMilestone), { id: `${prefix}-milestone-authoring`, title: 'Extraction is safe to author', description: 'The UI and agent perform the same atomic transaction with preserved identity and valid reciprocal bridges.', status: 'acceptance', position: { x: -420, y: 1280 } }),
  configure(clone(baseMilestone), { id: `${prefix}-milestone-loading`, title: 'Fragments load as one complete semantic node', description: 'All reciprocal contributions resolve before the node is presented as complete; rendering remains selective.', status: 'acceptance', position: { x: 420, y: 1280 } }),
];

const baseDecision = byId(`${prefix}-plan-decision`);
const decisions = [
  configure(clone(baseDecision), { id: `${prefix}-decision-identity`, title: 'Fragmentation changes storage, not identity', description: 'Preserve nodeId across inline, standalone, attached, and extracted forms; graphId identifies contributions.', status: 'decided', position: { x: -420, y: 1600 } }),
  configure(clone(baseDecision), { id: `${prefix}-decision-authority`, title: 'The fragment owns plan content', description: 'The host owns project-specific placement and relationships; it does not duplicate status, tasks, rules, or summary authority.', status: 'decided', position: { x: 420, y: 1600 } }),
];

const constraint = configure(byId(`${prefix}-plan-constraint`), {
  id: `${prefix}-constraint-atomic`, title: 'No partial reciprocal transaction', description: 'Neither graph may be committed unless identity, both bridge contributions, and migrated edges validate together.', status: 'required', position: { x: -820, y: 1600 },
});
const risk = configure(byId(`${prefix}-plan-risk`), {
  id: `${prefix}-risk-duplicate-authority`, title: 'Extraction creates a second editable plan', description: 'Duplicated status or plan logic would turn node expansion into distributed declarations.', status: 'active', position: { x: 820, y: 1600 },
});
const contingency = configure(byId(`${prefix}-plan-contingency`), {
  id: `${prefix}-contingency-rollback`, title: 'Rollback to the original inline graph', description: 'If either graph or any migrated edge fails validation, discard the fragment write and leave the original graph unchanged.', status: 'prepared', position: { x: 820, y: 1910 },
});

graph.nodes = graph.nodes.filter((node) => ![basePhase.id, baseAction.id, baseMilestone.id, baseDecision.id, `${prefix}-instructions`].includes(node.id));
graph.nodes.push(...phases, ...actions, ...milestones, ...decisions);

const planTypes = ['plan', 'plan-goal', 'plan-phase', 'plan-action', 'plan-milestone', 'plan-decision', 'plan-constraint', 'plan-risk', 'plan-contingency'];
for (const type of planTypes) {
  const instance = graph.nodes.find((node) => node.type === type);
  const classRef = instance.data._classBinding.sourceRef;
  graph.nodes.push({
    id: `${prefix}-class-bridge-${type}`,
    type: 'bridge',
    label: `${type} class`,
    position: { x: -1900, y: -700 + planTypes.indexOf(type) * 145 },
    width: 280,
    height: 110,
    visible: true,
    showLabel: true,
    ports: [{ id: 'root', key: 'root', label: 'root', direction: 'bidirectional', dataType: 'any', angle: 180 }],
    handles: [{ id: 'root', key: 'root', portId: 'root', label: 'root', direction: 'bidirectional', dataType: 'any', angle: 180 }],
    data: {
      target: { mode: 'bridge', label: 'Create', kind: 'node-class', key: type, ref: classRef, resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'] },
      intent: 'external', resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'], authority: 'bridge',
      bridge: { ref: classRef, resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'] },
      _classBinding: { ...instance.data._classBinding, key: type, ref: classRef },
      _bridge: { sourceRef: classRef, entryPort: 'root', kind: 'node-class', targetKind: 'node-class', classKey: type, classRef },
      identity: { graphId },
    },
  });
}

const interfaceRole = {
  'default-view': 'default-view',
  'summary-view': 'shared-summary',
  'icon-view': 'shared-icon',
  glyph: 'shared-glyph',
  port: 'exposes-port',
  'landing-surface': 'landing-surface',
};
const interfaceEdges = graph.edges.filter((edge) => edge.source === graphId).map((edge) => ({
  ...edge,
  data: { role: interfaceRole[edge.sourceHandle], semanticRole: interfaceRole[edge.sourceHandle] },
}));
const edge = (id, type, source, target, label, color, dash) => ({
  id: `${prefix}-${id}`, type, source, target, sourceHandle: 'root', targetHandle: 'root', label,
  style: { stroke: color, strokeWidth: type === 'plan.achieves' || type === 'plan.produces' ? 3 : 2, ...(dash ? { dash } : {}) },
  data: { semanticRole: type },
});
const semanticEdges = [
  edge('achieves', 'plan.achieves', plan.id, goal.id, 'achieves', '#059669'),
  ...phases.map((phase, index) => index === 0
    ? edge(`contains-phase-${index + 1}`, 'plan.contains', plan.id, phase.id, 'contains', '#4f46e5')
    : edge(`precedes-phase-${index + 1}`, 'plan.precedes', phases[index - 1].id, phase.id, 'precedes', '#4f46e5')),
  ...actions.map((action, index) => edge(`contains-action-${index + 1}`, 'plan.contains', phases[actionSpecs[index][3]].id, action.id, 'contains', '#2563eb')),
  edge('produces-authoring', 'plan.produces', `${prefix}-action-ui`, milestones[0].id, 'produces', '#16a34a'),
  edge('produces-loading', 'plan.produces', `${prefix}-action-loader`, milestones[1].id, 'produces', '#16a34a'),
  edge('decision-identity', 'plan.gates', milestones[0].id, decisions[0].id, 'gates', '#d97706'),
  edge('decision-authority', 'plan.gates', milestones[0].id, decisions[1].id, 'gates', '#d97706'),
  edge('constraint', 'plan.constrained-by', `${prefix}-action-atomic`, constraint.id, 'constrained by', '#64748b', [8, 6]),
  edge('risk', 'plan.threatened-by', `${prefix}-action-atomic`, risk.id, 'threatened by', '#e11d48', [8, 6]),
  edge('contingency', 'plan.mitigated-by', risk.id, contingency.id, 'mitigated by', '#7c3aed'),
];
graph.edges = [...interfaceEdges, ...semanticEdges];

fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
