import fs from 'node:fs';

const completedAt = process.env.COMPLETED_AT || new Date().toISOString();
const implementationCommit = process.env.IMPLEMENTATION_COMMIT || '';
const implementationPr = process.env.IMPLEMENTATION_PR || '';
const implementationRepo = 'github://mikemartinez1974/nodegraph-editor';
const taskRef = 'github://mikemartinez1974/public/tasks/type-and-instance-presentation/root.node';
const ideaRef = 'github://mikemartinez1974/public/ideas/type-and-instance-presentation.node';

const readGraph = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const writeGraph = (path, graph) => {
  graph.nodeCount = Array.isArray(graph.nodes) ? graph.nodes.length : 0;
  graph.edgeCount = Array.isArray(graph.edges) ? graph.edges.length : 0;
  fs.writeFileSync(path, `${JSON.stringify(graph, null, 2)}\n`, 'utf8');
};
const nodeById = (graph, id) => graph.nodes.find((node) => node?.id === id);
const appendUnique = (values, value) => {
  const list = Array.isArray(values) ? [...values] : [];
  if (!list.includes(value)) list.push(value);
  return list;
};
const upsertNode = (graph, node) => {
  const index = graph.nodes.findIndex((candidate) => candidate?.id === node.id);
  if (index >= 0) graph.nodes[index] = { ...graph.nodes[index], ...node };
  else graph.nodes.push(node);
};
const upsertEdge = (graph, edge) => {
  const index = graph.edges.findIndex((candidate) => candidate?.id === edge.id);
  if (index >= 0) graph.edges[index] = { ...graph.edges[index], ...edge };
  else graph.edges.push(edge);
};
const standardPorts = () => [
  { id: 'root', label: 'root', direction: 'bidirectional', dataType: 'any', angle: 210 },
  { id: 'top', label: 'top', direction: 'bidirectional', dataType: 'value', angle: 270 },
  { id: 'right', label: 'right', direction: 'bidirectional', dataType: 'value', angle: 0 },
  { id: 'bottom', label: 'bottom', direction: 'bidirectional', dataType: 'value', angle: 90 },
  { id: 'left', label: 'left', direction: 'bidirectional', dataType: 'value', angle: 180 }
];
const assertTouchedGraph = (graph, path) => {
  const ids = new Set();
  for (const node of graph.nodes || []) {
    if (!node?.id) throw new Error(`${path}: node without id`);
    if (ids.has(node.id)) throw new Error(`${path}: duplicate node id ${node.id}`);
    ids.add(node.id);
  }
  for (const edge of graph.edges || []) {
    if (!edge?.id || !edge?.source || !edge?.target) throw new Error(`${path}: invalid edge`);
    if (!ids.has(edge.source) || !ids.has(edge.target)) {
      throw new Error(`${path}: dangling edge ${edge.id}`);
    }
  }
};

const taskPath = 'tasks/type-and-instance-presentation/root.node';
const task = readGraph(taskPath);
task.metadata = {
  ...(task.metadata || {}),
  version: '1.0.0',
  modified: completedAt
};
const declaration = nodeById(task, 'type-instance-task-declaration');
if (!declaration) throw new Error('Task declaration missing');
declaration.data.identity = {
  ...(declaration.data.identity || {}),
  version: '1.0.0',
  updatedAt: completedAt
};
declaration.data.declaration = {
  ...(declaration.data.declaration || {}),
  kind: 'task',
  targetMode: 'artifact',
  artifactKind: 'graph',
  defaultSurfaceId: 'root'
};
const surfaces = Array.isArray(declaration.data.declaration.surfaces)
  ? declaration.data.declaration.surfaces.filter((surface) => surface?.id !== 'root')
  : [];
declaration.data.declaration.surfaces = [
  {
    id: 'root',
    kind: 'port',
    label: 'Type and Instance Presentation',
    portNodeId: 'type-instance-task-root-port',
    viewNodeId: 'type-instance-task-root-port',
    memo: 'Canonical completed-task entry surface.',
    exposes: {
      views: { mode: 'allow' },
      declarations: { mode: 'allow' }
    }
  },
  ...surfaces
];
declaration.data.dependencies.nodeTypes = appendUnique(declaration.data.dependencies.nodeTypes, 'portal');
declaration.data.completion = {
  status: 'done',
  completedAt,
  implementationRepo,
  implementationCommit,
  implementationPr
};

const rootPort = nodeById(task, 'type-instance-task-root-port');
if (!rootPort) throw new Error('Task root port missing');
rootPort.data.identity = {
  ...(rootPort.data.identity || {}),
  graphId: 'type-and-instance-presentation-task',
  portId: 'root'
};
rootPort.data.view = {
  ...(rootPort.data.view || {}),
  surfaceId: 'root'
};
rootPort.data.description = 'Completed implementation task for the Type and Instance Presentation contract.';

const goal = nodeById(task, 'type-instance-task-goal');
Object.assign(goal.data, {
  status: 'done',
  completedAt,
  outcome: 'Twilite now keeps stable type identity in the Legend while Elements renders bounded authored node specimens and labeled edge specimens. Document content has one durable format-aware contract with legacy compatibility.',
  evidence: [implementationRepo, implementationCommit, implementationPr].filter(Boolean)
});

const taskOutcomes = {
  'type-instance-task-document': {
    outcome: 'Added a native Document type and a format-aware document content contract for Markdown, sanitized HTML, and plain text while preserving legacy markdown, html, text, and memo data.',
    acceptanceCriteria: [
      'Document format and content are stored under data.document.',
      'Legacy markdown, html, text, and memo payloads remain readable.',
      'Runtime input updates preserve the durable document contract.'
    ]
  },
  'type-instance-task-legend': {
    outcome: 'Verified and preserved the Legend glyph path so creatable type identity remains stable and is not replaced by authored instance previews.',
    acceptanceCriteria: [
      'Legend entries continue to resolve stable type metadata glyphs.',
      'Authored node instance views are not rendered in the Legend.'
    ]
  },
  'type-instance-task-elements': {
    outcome: 'Elements now renders compact node specimens. Rich inline payloads win, class-authored node.web.icon views are preferred for class-backed instances, and stable type glyphs remain the final fallback.',
    acceptanceCriteria: [
      'Class-backed nodes resolve node.web.icon before summary or legacy views.',
      'Inline SVG, HTML, and image payloads remain visible.',
      'Nodes without authored presentation receive a stable type glyph.'
    ]
  },
  'type-instance-task-edges': {
    outcome: 'Elements now draws a bounded miniature of each edge using its route, stroke, dash, opacity, arrows, and semantic label directly on the list item.',
    acceptanceCriteria: [
      'The edge label is drawn on the specimen rather than repeated as plain primary text.',
      'The specimen reflects route, dash, width, opacity, and arrow settings.',
      'The source and target remain visible as secondary context.'
    ]
  },
  'type-instance-task-compat': {
    outcome: 'Added focused tests for document compatibility, authored-view resolution, template binding, GitHub class references, and compact edge semantics, then validated the production build.',
    acceptanceCriteria: [
      'Automated tests pass.',
      'The production bundle builds successfully.',
      'Existing markdown nodes continue to render through the compatibility path.'
    ]
  }
};
for (const [id, completion] of Object.entries(taskOutcomes)) {
  const taskNode = nodeById(task, id);
  if (!taskNode) throw new Error(`Task node missing: ${id}`);
  Object.assign(taskNode.data, {
    status: 'done',
    completedAt,
    nextAction: '',
    blockedReason: '',
    health: 'complete',
    ...completion,
    evidence: [implementationRepo, implementationCommit, implementationPr].filter(Boolean)
  });
}

const decision = nodeById(task, 'type-instance-task-decision');
decision.data.rationale = 'The Legend identifies creatable types with stable glyphs. Elements presents actual instances. Nodes use bounded authored compact views with glyph fallback. Edges use a Legend-sized path specimen with the semantic label drawn directly on the specimen.';
decision.data.implementedAt = completedAt;

const question = nodeById(task, 'type-instance-task-edge-question');
Object.assign(question.data, {
  status: 'answered',
  answeredAt: completedAt,
  resolution: 'Keep edge instances similar in scale and visual weight to Legend entries. Draw a bounded miniature edge in the Elements list item and place its semantic label directly on that specimen, with source and target shown only as secondary context.'
});

const notes = nodeById(task, 'type-instance-task-notes');
notes.data.markdown = `# Type and Instance Presentation\n\n**Status:** Complete\n\nThe shipped contract follows one rule: **the Legend explains what can be created; Elements shows what currently exists.**\n\n- Document is the durable content primitive; Markdown, sanitized HTML, and plain text are formats.\n- Legend keeps stable type glyphs.\n- Elements prefers rich inline presentation, then class-authored icon views, then stable glyph fallback.\n- Edge list items draw a compact styled edge with the semantic label on the specimen itself.\n- Compatibility tests and the production build passed.\n\n**Implementation:** ${implementationCommit || implementationRepo}${implementationPr ? `\n\n**Pull request:** ${implementationPr}` : ''}`;
notes.data.completedAt = completedAt;

assertTouchedGraph(task, taskPath);
writeGraph(taskPath, task);

const collectionPath = 'tasks/root.node';
const collection = readGraph(collectionPath);
collection.metadata = { ...(collection.metadata || {}), modified: completedAt };
const collectionDeclaration = nodeById(collection, 'task-collection-declaration');
collectionDeclaration.data.dependencies.nodeTypes = appendUnique(collectionDeclaration.data.dependencies.nodeTypes, 'portal');
upsertNode(collection, {
  id: 'task-collection-type-instance-presentation',
  type: 'portal',
  label: 'Type and Instance Presentation',
  root: false,
  position: { x: 500, y: 790 },
  width: 450,
  height: 340,
  ports: standardPorts(),
  visible: true,
  showLabel: true,
  data: {
    authority: 'navigate',
    intent: 'external',
    src: taskRef,
    ref: taskRef,
    endpoint: `${taskRef}:root`,
    sourceRef: taskRef,
    sourceNodeId: 'type-instance-task-root-port',
    sourcePayload: 'node.web.summary',
    surfaceId: 'root',
    target: {
      ref: taskRef,
      endpoint: `${taskRef}:root`,
      mode: 'navigate',
      portId: 'root',
      surfaceId: 'root',
      label: 'Open Type and Instance Presentation',
      handleId: 'root'
    },
    identity: { graphId: 'michael-task-collection' },
    security: 'prompt',
    visibilityRole: 'browser'
  }
});
upsertEdge(collection, {
  id: 'task-collection-edge-type-instance-presentation',
  type: 'reference',
  source: 'task-collection-introduction',
  target: 'task-collection-type-instance-presentation',
  sourcePort: 'bottom',
  targetPort: 'top',
  label: 'completed task graph',
  style: { curved: true, route: 'curved' },
  data: {}
});
assertTouchedGraph(collection, collectionPath);
writeGraph(collectionPath, collection);

const ideaPath = 'ideas/type-and-instance-presentation.node';
const idea = readGraph(ideaPath);
idea.metadata = { ...(idea.metadata || {}), modified: completedAt };
const ideaDeclaration = nodeById(idea, 'type-and-instance-presentation-declaration');
ideaDeclaration.data.dependencies.nodeTypes = appendUnique(ideaDeclaration.data.dependencies.nodeTypes, 'portal');
const nextStep = nodeById(idea, 'type-and-instance-presentation-idea-next-step');
Object.assign(nextStep.data, {
  status: 'done',
  completedAt,
  result: 'The presentation contract was implemented and validated. Open the linked task graph for the implementation record.'
});
upsertNode(idea, {
  id: 'type-and-instance-presentation-task-portal',
  type: 'portal',
  label: 'Implementation Task',
  root: false,
  position: { x: 650, y: 700 },
  width: 560,
  height: 320,
  ports: standardPorts(),
  visible: true,
  showLabel: true,
  data: {
    authority: 'navigate',
    intent: 'external',
    src: taskRef,
    ref: taskRef,
    endpoint: `${taskRef}:root`,
    sourceRef: taskRef,
    sourceNodeId: 'type-instance-task-root-port',
    sourcePayload: 'node.web.summary',
    surfaceId: 'root',
    target: {
      ref: taskRef,
      endpoint: `${taskRef}:root`,
      mode: 'navigate',
      portId: 'root',
      surfaceId: 'root',
      label: 'Open Implementation Task',
      handleId: 'root'
    },
    identity: { graphId: 'type-and-instance-presentation' },
    security: 'prompt',
    visibilityRole: 'browser'
  }
});
upsertEdge(idea, {
  id: 'type-and-instance-presentation-task-edge',
  type: 'reference',
  source: 'type-and-instance-presentation-idea-next-step',
  target: 'type-and-instance-presentation-task-portal',
  sourcePort: 'bottom',
  targetPort: 'top',
  label: 'implemented by',
  style: { curved: true, route: 'curved', width: 2 },
  data: {}
});
assertTouchedGraph(idea, ideaPath);
writeGraph(ideaPath, idea);

console.log('Task, collection, and idea graph completion mutations are ready.');
