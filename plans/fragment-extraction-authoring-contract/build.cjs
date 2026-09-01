const fs = require('fs');
const path = require('path');

const templatePath = path.resolve(__dirname, '../../../../twilite-zone/public/library/classes/nodes/task-planning/task-graph-template.node');
const outputPath = path.join(__dirname, 'root.node');
const oldPrefix = 'task-graph-template';
const prefix = 'fragment-extraction-authoring';
const graphId = `${prefix}-declaration`;

const templateText = fs.readFileSync(templatePath, 'utf8').replaceAll(oldPrefix, prefix);
const graph = JSON.parse(templateText);
const clone = (value) => JSON.parse(JSON.stringify(value));
const byId = (id) => graph.nodes.find((node) => node.id === id);

const declaration = byId(graphId);
declaration.label = 'Fragment Extraction Authoring Contract';
declaration.data.identity = {
  graphId,
  nodeId: 'fragment-extraction-authoring-contract',
  name: 'Fragment Extraction Authoring Contract',
  version: '1.0.0',
  description: 'Plan the explicit authoring workflow that turns an inline semantic node into a reciprocally bridged fragment without changing its identity.',
  updatedAt: '2026-09-01T00:00:00.000Z',
};
declaration.data.intent = { kind: 'plan', scope: 'implementation' };
declaration.data.document = { url: 'github://mikemartinez1974/public/plans/fragment-extraction-authoring-contract/root.node' };
declaration.data.name = 'Fragment Extraction Authoring Contract';
declaration.data.declaresKind = 'plan';
declaration.data.purpose = 'Define the UI, agent guidance, identity rules, and atomic graph transaction for extracting or attaching fragments.';
declaration.data.declaration.kind = 'graph';
declaration.data.declaration.artifactKind = 'plan';

const goal = byId(`${prefix}-goal`);
goal.label = 'Explicit fragment authoring';
Object.assign(goal.data, {
  title: 'Make fragment extraction explicit and identity-preserving',
  body: 'A plan can begin inline or standalone, then become part of another graph without copying its logic, changing its semantic nodeId, or leaving a one-way bridge.',
  status: 'active',
  successCriteria: [
    'Extraction preserves semantic identity',
    'Both graph files validate before either is committed',
    'UI and agent instructions invoke the same operation',
  ],
});

const baseTask = byId(`${prefix}-task`);
const baseQuestion = byId(`${prefix}-question`);
const baseDecision = byId(`${prefix}-decision`);

const taskSpecs = [
  ['identity', 'Define stable identity and contribution ownership', 'Assign nodeId when the semantic node is first authored; preserve it through extraction and attachment while graphId records each contributing graph.', ['Document nodeId and graphId invariants', 'Define which graph owns each mutable field']],
  ['transaction', 'Implement the atomic Extract as Fragment transaction', 'Create the fragment, move owned content, retain the host participant, create both bridge declarations, migrate edges, validate both files, and commit together.', ['No partial extraction can be persisted', 'Rollback leaves the original graph unchanged']],
  ['edges', 'Define deterministic node and edge migration', 'Classify selected content, internal edges, external host edges, public ports, and graph-local placement before writing either graph.', ['External edges remain connected through public ports', 'Moved node IDs do not collide after namespacing']],
  ['ui', 'Add fragment lifecycle commands and validation UI', 'Expose Extract as Fragment, Attach to Graph, Open Fragment, Show Contributions, and Detach Fragment with identity and closure diagnostics.', ['Preview the transaction before applying it', 'Show reciprocal closure and content authority after extraction']],
  ['agents', 'Publish equivalent agent authoring guidance', 'Map natural-language requests to inline creation, standalone creation, attachment, or extraction without copying content or creating one-way bridges.', ['Agent verbs match UI operations', 'Guidance prohibits identity changes and partial reciprocal writes']],
  ['closure', 'Integrate extraction with complete bridge-closure loading', 'After authoring, treat all reciprocal same-node contributions as one semantic node and expose explicit loading, incomplete, and invalid states.', ['Rendering may be selective while loading is complete', 'Missing reciprocal contributions produce actionable diagnostics']],
];

const tasks = taskSpecs.map(([key, title, body, acceptance], index) => {
  const node = clone(baseTask);
  node.id = `${prefix}-task-${key}`;
  node.label = title;
  node.position = { x: -820 + (index % 3) * 520, y: 260 + Math.floor(index / 3) * 360 };
  Object.assign(node.data, { title, body, status: 'todo', priority: index < 3 ? 'critical' : 'high', acceptanceCriteria: acceptance });
  return node;
});

const questionSpecs = [
  ['selection', 'What exactly moves when a user extracts a selected plan?', 'Define the default selection boundary and how the preview handles ambiguous supporting nodes.', 'open'],
  ['detach', 'What does Detach Fragment mean when host edges depend on fragment ports?', 'Decide whether detach is blocked, requires rewiring, or materializes an inline contribution.', 'open'],
];
const questions = questionSpecs.map(([key, title, body, status], index) => {
  const node = clone(baseQuestion);
  node.id = `${prefix}-question-${key}`;
  node.label = title;
  node.position = { x: 820, y: 260 + index * 360 };
  Object.assign(node.data, { title, body, status, priority: 'high' });
  return node;
});

const decisionSpecs = [
  ['identity', 'Fragmentation changes storage, not semantic identity', 'Preserve nodeId across inline, standalone, attached, and extracted forms. Use graphId only for contribution provenance.'],
  ['authority', 'The fragment owns plan content; the host owns project relationships', 'Do not duplicate status, tasks, rules, or summary authority into the host participant.'],
];
const decisions = decisionSpecs.map(([key, title, rationale], index) => {
  const node = clone(baseDecision);
  node.id = `${prefix}-decision-${key}`;
  node.label = title;
  node.position = { x: -560 + index * 760, y: 1040 };
  Object.assign(node.data, { title, rationale, status: 'decided', owner: 'Michael' });
  return node;
});

graph.nodes = graph.nodes.filter((node) => ![baseTask.id, baseQuestion.id, baseDecision.id, `${prefix}-deprecation-note`].includes(node.id));
graph.nodes.push(...tasks, ...questions, ...decisions);

const summary = byId(`${prefix}-summary`);
Object.assign(summary.data, {
  goal: goal.data.title,
  title: goal.data.title,
  body: `Goal: ${goal.data.title}\n\nTasks in scope:\n${tasks.map((task, index) => `${index + 1}. ${task.data.title}`).join('\n')}\n\nOpen questions:\n${questions.map((question, index) => `${index + 1}. ${question.data.title}`).join('\n')}`,
  status: 'todo',
  taskProgress: { completed: 0, total: tasks.length },
  questionProgress: { answered: 0, total: questions.length },
  taskTitles: tasks.map((task) => task.data.title),
  questionTitles: questions.map((question) => question.data.title),
  taskListText: tasks.map((task, index) => `${index + 1}. ${task.data.title}`).join('\n'),
  questionListText: questions.map((question, index) => `${index + 1}. ${question.data.title}`).join('\n'),
  nextAction: 'Define the extraction selection boundary and transaction schema.',
  priority: 'critical',
  owner: 'Michael',
});

byId(`${prefix}-detail-view`).data.content = {
  kind: 'svg',
  value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'><rect width='640' height='400' rx='20' fill='#f8fafc'/><rect width='640' height='70' rx='20' fill='#17324d'/><rect y='50' width='640' height='20' fill='#17324d'/><text x='30' y='44' fill='#fff' font-family='system-ui' font-size='23' font-weight='700'>EXTRACT AS FRAGMENT</text><rect x='42' y='112' width='210' height='210' rx='16' fill='#dbeafe' stroke='#2563eb' stroke-width='5'/><text x='147' y='151' text-anchor='middle' fill='#1e3a8a' font-family='system-ui' font-size='18' font-weight='700'>HOST GRAPH</text><rect x='91' y='185' width='112' height='72' rx='10' fill='#fff' stroke='#4f46e5' stroke-width='4'/><text x='147' y='216' text-anchor='middle' fill='#312e81' font-family='system-ui' font-size='14' font-weight='700'>PLAN</text><text x='147' y='238' text-anchor='middle' fill='#475569' font-family='monospace' font-size='11'>nodeId: P</text><path d='M274 194h92l-16-16m16 16-16 16M366 242h-92l16-16m-16 16 16 16' fill='none' stroke='#334155' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/><rect x='388' y='112' width='210' height='210' rx='16' fill='#dcfce7' stroke='#16a34a' stroke-width='5'/><text x='493' y='151' text-anchor='middle' fill='#14532d' font-family='system-ui' font-size='18' font-weight='700'>PLAN FRAGMENT</text><text x='493' y='208' text-anchor='middle' fill='#166534' font-family='monospace' font-size='14'>nodeId: P</text><text x='493' y='235' text-anchor='middle' fill='#166534' font-family='monospace' font-size='13'>graphId: fragment</text><text x='320' y='365' text-anchor='middle' fill='#334155' font-family='system-ui' font-size='15' font-weight='700'>IDENTITY PRESERVED - CONTENT MOVED - BRIDGES RECIPROCAL</text></svg>",
};
byId(`${prefix}-summary-view`).data.content = {
  kind: 'svg',
  value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'><rect width='640' height='400' rx='20' fill='#17324d'/><text x='30' y='48' fill='#fff' font-family='system-ui' font-size='22' font-weight='700'>FRAGMENT AUTHORING CONTRACT</text><g font-family='system-ui'><rect x='34' y='88' width='572' height='54' rx='10' fill='#2563eb'/><text x='56' y='121' fill='#fff' font-size='17' font-weight='700'>1  Preserve semantic nodeId</text><rect x='34' y='156' width='572' height='54' rx='10' fill='#16a34a'/><text x='56' y='189' fill='#fff' font-size='17' font-weight='700'>2  Move owned content atomically</text><rect x='34' y='224' width='572' height='54' rx='10' fill='#d97706'/><text x='56' y='257' fill='#fff' font-size='17' font-weight='700'>3  Write and validate both bridges</text><rect x='34' y='292' width='572' height='54' rx='10' fill='#7c3aed'/><text x='56' y='325' fill='#fff' font-size='17' font-weight='700'>4  Keep UI and agent operations equivalent</text></g></svg>",
};
byId(`${prefix}-landing-surface`).data.content = {
  kind: 'markdown',
  value: '# Fragment Extraction Authoring Contract\n\nPlan the identity-preserving transaction, UI workflow, agent guidance, and complete bridge-closure behavior.',
};

const infrastructureEdges = graph.edges.filter((edge) =>
  edge.source === graphId || edge.source === `${prefix}-updater`
);
const semanticEdges = [
  ...tasks.map((task, index) => ({ id: `${prefix}-edge-task-${index + 1}`, source: goal.id, sourceHandle: index % 2 ? 'left' : 'right', target: task.id, targetHandle: 'root', type: 'default', label: 'task' })),
  ...questions.map((question, index) => ({ id: `${prefix}-edge-question-${index + 1}`, source: goal.id, sourceHandle: 'bottom', target: question.id, targetHandle: 'root', type: 'default', label: 'question' })),
  { id: `${prefix}-edge-summary`, source: goal.id, sourceHandle: 'bottom', target: summary.id, targetHandle: 'top', type: 'default', label: 'document' },
  ...decisions.map((decision, index) => ({ id: `${prefix}-edge-decision-${index + 1}`, source: summary.id, sourceHandle: index ? 'right' : 'left', target: decision.id, targetHandle: 'root', type: 'default', label: 'decision' })),
];
graph.edges = [...infrastructureEdges, ...semanticEdges];

fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
