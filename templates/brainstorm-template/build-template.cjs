const fs = require('fs');
const path = require('path');

const repo = path.resolve(__dirname, '../..');
const ideaPath = path.join(repo, 'templates/idea-template/root.node');
const taskPath = path.resolve(repo, '../../twilite-zone/public/library/classes/nodes/task-planning/task-graph-template.node');
const constraintPath = path.resolve(repo, '../../twilite-zone/public/library/classes/nodes/task-planning/constraint.node-class.node');
const idea = JSON.parse(fs.readFileSync(ideaPath, 'utf8'));
const task = JSON.parse(fs.readFileSync(taskPath, 'utf8'));
const constraintClass = JSON.parse(fs.readFileSync(constraintPath, 'utf8'));

const clone = value => JSON.parse(JSON.stringify(value));
const byId = (graph, id) => clone(graph.nodes.find(node => node.id === id));
const now = '2026-08-27T18:00:00.000Z';

function replaceDeep(value, from, to) {
  if (typeof value === 'string') return value.split(from).join(to);
  if (Array.isArray(value)) return value.map(item => replaceDeep(item, from, to));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceDeep(item, from, to)]));
  }
  return value;
}

function cleanNode(node, graphId) {
  delete node.root;
  node.data ||= {};
  if (node.data.identity) node.data.identity.graphId = graphId;
  return node;
}

function port(id, label, direction, angle, role, behavior) {
  const result = {
    id, key: id, label, direction, dataType: 'any', angle, role,
    metadata: { structural: true, relationship: true, role, required: false, repeatable: true }
  };
  if (behavior) result.metadata.behaviors = [behavior];
  return result;
}

function handleFromPort(p) {
  return { id: p.id, key: p.key, portId: p.id, label: p.label, direction: p.direction, dataType: p.dataType, angle: p.angle, role: p.role };
}

function makeBrainstormProvider(prefix, graphId, title, framing, position) {
  const ports = [
    port('root', 'root', 'bidirectional', 180, 'brainstorm.root'),
    port('ideas', 'ideas', 'output', 330, 'brainstorm.ideas', { trigger: 'drag-create', action: 'create-node', nodeType: 'idea', targetPort: 'root' }),
    port('questions', 'questions', 'output', 345, 'brainstorm.questions', { trigger: 'drag-create', action: 'create-node', nodeType: 'idea-question', targetPort: 'root' }),
    port('constraints', 'constraints', 'output', 0, 'brainstorm.constraints', { trigger: 'drag-create', action: 'create-node', nodeType: 'constraint', targetPort: 'root' }),
    port('references', 'references', 'output', 15, 'brainstorm.references', { trigger: 'drag-create', action: 'create-node', nodeType: 'content', targetPort: 'root' }),
    port('outcomes', 'outcomes', 'output', 30, 'brainstorm.outcomes', { trigger: 'drag-create', action: 'create-node', nodeType: 'decision', targetPort: 'root' })
  ];
  return {
    id: `${prefix}-brainstorm`, type: 'content', label: title, position, width: 520, height: 340,
    ports, handles: ports.map(handleFromPort), visible: true, showLabel: true,
    data: {
      identity: { graphId, nodeId: 'brainstorm' },
      semanticType: 'brainstorm', title, framing,
      content: { kind: 'markdown', value: `# ${title}\n\n${framing}` },
      renderShape: { kind: 'markdown' },
      interfaceContract: { version: 1, role: 'brainstorm-provider', freeformEdgesAllowed: true, spatialClustersAreAdvisory: true }
    }
  };
}

function makeExposedPort(prefix, graphId, providerId) {
  const root = port('root', 'root', 'bidirectional', 180, 'port.root');
  return {
    id: `${prefix}-port`, type: 'port', label: 'Brainstorm', position: { x: -980, y: 620 }, width: 360, height: 240,
    ports: [root], handles: [handleFromPort(root)], visible: true, showLabel: true,
    data: {
      identity: { graphId, nodeId: 'brainstorm-port' }, surfaceId: 'brainstorm', direction: 'bidirectional', dataType: 'brainstorm',
      sourceScope: 'graph', sourceNodeId: providerId, sourcePayload: 'content', renderedNodeType: 'brainstorm',
      presentation: { detail: { mode: 'shared' }, summary: { mode: 'shared' }, icon: { mode: 'shared' } },
      authority: { consume: true, navigate: true }
    }
  };
}

function structuralNodes(prefix, graphId, title, description, githubPath) {
  const map = {
    'idea-template-declaration': `${prefix}-declaration`,
    'idea-template-detail-view': `${prefix}-detail-view`,
    'idea-template-summary-view': `${prefix}-summary-view`,
    'idea-template-icon-view': `${prefix}-icon-view`,
    'idea-template-glyph': `${prefix}-glyph`,
    'idea-template-landing-surface': `${prefix}-landing-surface`
  };
  return Object.entries(map).map(([sourceId, id]) => {
    let node = replaceDeep(byId(idea, sourceId), 'idea-template', prefix);
    node.id = id;
    cleanNode(node, graphId);
    if (sourceId.endsWith('declaration')) {
      node.label = `${title} Declaration`;
      node.data.identity = { graphId, nodeId: 'brainstorm', name: title, version: '0.1.0', description, createdAt: now, updatedAt: now };
      node.data.intent = { kind: 'brainstorm', scope: 'shared' };
      node.data.dependencies = {
        nodeTypes: ['declaration', 'content', 'view', 'glyph', 'port', 'bridge', 'idea', 'idea-question', 'constraint', 'decision'],
        portContracts: ['core'],
        skills: ['brainstorm-template'],
        schemaVersions: { nodes: '>=1.0.0', ports: '>=1.0.0' },
        optional: []
      };
      node.data.declaration.kind = 'brainstorm';
      node.data.declaration.artifactKind = 'brainstorm';
      node.data.declaration.defaultSurfaceId = 'brainstorm';
      node.data.declaration.surfaces = [{ id: 'brainstorm', kind: 'port', label: title, presentation: { detail: { mode: 'shared', viewNodeId: `${prefix}-detail-view` }, summary: { mode: 'shared', viewNodeId: `${prefix}-summary-view` }, icon: { mode: 'shared', viewNodeId: `${prefix}-icon-view` } }, exposes: { views: { mode: 'allow' }, declarations: { mode: 'allow' } } }];
    }
    if (sourceId.endsWith('detail-view')) node.data.content.value = `# ${title}\n\n${description}`;
    if (sourceId.endsWith('summary-view')) node.data.content.value = `## ${title}\n\nA loose graph where ideas, questions, constraints, references, and outcomes can acquire structure.`;
    if (sourceId.endsWith('icon-view')) node.data.content = { kind: 'svg', value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='28' fill='#172554'/><circle cx='95' cy='105' r='28' fill='#fbbf24'/><circle cx='160' cy='70' r='22' fill='#a78bfa'/><circle cx='225' cy='120' r='25' fill='#38bdf8'/><path d='M115 92L140 79M180 80L205 105M120 116L200 120' stroke='#fff' stroke-width='8' stroke-linecap='round'/><text x='160' y='190' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='20' font-weight='800'>BRAINSTORM</text></svg>" };
    if (sourceId.endsWith('glyph')) node.data.glyph = { kind: 'character', value: '✦' };
    if (sourceId.endsWith('landing-surface')) node.data.content.value = `# ${title}\n\n${description}`;
    return node;
  });
}

function typedSeed(sourceGraph, sourceId, bridgeId, prefix, graphId, id, label, position, dataPatch = {}) {
  let node = byId(sourceGraph, sourceId);
  node.id = id; node.label = label; node.position = position; node.data = { ...node.data, ...dataPatch };
  cleanNode(node, graphId);
  let bridge = byId(sourceGraph, bridgeId);
  bridge.id = `${id}-bridge`; bridge.label = label; bridge.position = { x: position.x - 420, y: position.y };
  cleanNode(bridge, graphId);
  return [node, bridge];
}

function constraintSeed(prefix, graphId, specimen) {
  const declaration = constraintClass.nodes.find(node => node.type === 'declaration');
  const defaults = clone(declaration.data.nodeClass.nodeDef.defaults);
  const classRef = declaration.data.nodeClass.nodeDef.ref;
  const node = {
    id: `${prefix}-constraint`, type: 'constraint', label: specimen ? 'Bridge-required data belongs behind authority' : 'A constraint belongs here',
    position: { x: -40, y: -480 }, width: defaults.size.width, height: defaults.size.height,
    ports: defaults.ports.map(p => ({ ...p, key: p.id })), visible: true, showLabel: defaults.showLabel,
    data: {
      ...defaults.data,
      body: specimen ? 'A node must not carry cached class data whose meaning depends on a Bridge. It may carry domain data and an optional bridgeRef.' : 'Name a fact, limit, cost, assumption, or requirement that the brainstorm must respect.',
      type: specimen ? 'architecture' : 'boundary', severity: 'hard', scope: 'graph',
      definitionKey: 'constraint',
      _classBinding: { key: 'constraint', ref: classRef, sourceRef: classRef },
      _bridge: { classKey: 'constraint', classRef, entryPort: 'root', kind: 'node-class', sourceRef: classRef, targetKind: 'node-class' },
      identity: { graphId }
    }
  };
  node.handles = node.ports.map(handleFromPort);
  const bridge = byId(task, 'task-graph-template-bridge-decision');
  bridge.id = `${prefix}-constraint-bridge`;
  bridge.label = 'Constraint';
  bridge.position = { x: -460, y: -480 };
  bridge.data.identity = { graphId };
  bridge.data.target = { ...bridge.data.target, key: 'constraint', ref: classRef };
  bridge.data.bridge = { ...bridge.data.bridge, ref: classRef };
  bridge.data._classBinding = { key: 'constraint', sourceRef: classRef, ref: classRef, defaults, nodeDef: clone(declaration.data.nodeClass.nodeDef) };
  bridge.data._bridge = { sourceRef: classRef, entryPort: 'root', kind: 'node-class', targetKind: 'node-class', classKey: 'constraint', classRef };
  cleanNode(bridge, graphId);
  return [node, bridge];
}

function edge(id, source, target, sourcePort, label, semanticRole) {
  return { id, type: 'reference', source, target, sourcePort, targetPort: 'root', label, style: {}, data: { semanticRole } };
}

function build({ prefix, graphId, title, description, githubPath, specimen = false }) {
  const nodes = structuralNodes(prefix, graphId, title, description, githubPath);
  const declaration = `${prefix}-declaration`;
  const provider = makeBrainstormProvider(prefix, graphId, title, description, { x: -100, y: 0 });
  const exposed = makeExposedPort(prefix, graphId, provider.id);
  nodes.push(provider, exposed);

  const seeds = [];
  seeds.push(...typedSeed(idea, 'idea-template-idea', 'idea-template-bridge-idea', prefix, graphId, `${prefix}-idea`, specimen ? 'Remove redundant root property' : 'An idea can begin here', { x: 620, y: -320 }, specimen ? { title: 'Remove redundant root property', statement: 'Stop writing top-level root metadata and derive root semantics from the declaration interface while retaining legacy read compatibility.', status: 'spark', confidence: 'medium' } : { title: 'An idea can begin here', statement: 'A short thought that may or may not survive contact with the rest of the graph.', status: 'spark', confidence: 'unproven' }));
  seeds.push(...typedSeed(idea, 'idea-template-idea-question', 'idea-template-bridge-idea-question', prefix, graphId, `${prefix}-question`, specimen ? 'Where should aspect ratio live?' : 'What does this expose?', { x: 620, y: 80 }, specimen ? { title: 'Where should aspect ratio live?', question: 'Should interface aspect ratio be explicit declaration metadata, inferred from landing-surface geometry, or an authored constraint combined with that geometry?', status: 'open' } : { title: 'What does this expose?', question: 'What question becomes visible once the idea is placed beside its constraints?', status: 'open' }));
  seeds.push(...typedSeed(task, 'task-graph-template-decision', 'task-graph-template-bridge-decision', prefix, graphId, `${prefix}-outcome`, specimen ? 'Bridge authority must remain visible' : 'An outcome can crystallize later', { x: 620, y: 480 }, specimen ? { body: 'Nodes carry domain data plus an optional bridgeRef. Bridge resolution supplies external type authority; failures must be explicit unless the graph opts into a safe fallback.', rationale: 'Silent fallback would conceal broken authority.', status: 'proposed' } : { body: 'A conclusion belongs here only after the brainstorm earns it.', rationale: 'Keep generation separate from commitment.', status: 'proposed' }));
  seeds.push(...constraintSeed(prefix, graphId, specimen));
  nodes.push(...seeds);

  const reference = { id: `${prefix}-reference`, type: 'content', label: specimen ? 'Bridge resolution sketch' : 'Reference / Note', position: { x: -100, y: 520 }, width: 460, height: 260, ports: [port('root', 'root', 'bidirectional', 180, 'content.root')], visible: true, showLabel: true, data: { identity: { graphId }, content: { kind: 'markdown', value: specimen ? '## Resolution sketch\n\n`node → bridgeRef → graph-local Bridge → external class/type`\n\nFallback should be explicit, inspectable, and never disguise lost authority.' : '## Reference / Note\n\nSupporting material can remain ordinary Content until stronger semantics emerge.' }, renderShape: { kind: 'markdown' } } };
  reference.handles = reference.ports.map(handleFromPort);
  nodes.push(reference);

  const edges = [
    edge(`${prefix}-default-view-edge`, declaration, `${prefix}-detail-view`, 'default-view', 'default view', 'default-view'),
    edge(`${prefix}-summary-view-edge`, declaration, `${prefix}-summary-view`, 'summary-view', 'summary view', 'shared-summary'),
    edge(`${prefix}-icon-view-edge`, declaration, `${prefix}-icon-view`, 'icon-view', 'icon view', 'shared-icon'),
    edge(`${prefix}-glyph-edge`, declaration, `${prefix}-glyph`, 'glyph', 'glyph', 'shared-glyph'),
    edge(`${prefix}-landing-edge`, declaration, `${prefix}-landing-surface`, 'landing-surface', 'landing surface', 'landing-surface'),
    edge(`${prefix}-port-edge`, declaration, exposed.id, 'port', 'exposes brainstorm', 'exposes-port'),
    edge(`${prefix}-idea-edge`, provider.id, `${prefix}-idea`, 'ideas', 'idea', 'brainstorm.idea'),
    edge(`${prefix}-question-edge`, provider.id, `${prefix}-question`, 'questions', 'raises', 'raises'),
    edge(`${prefix}-constraint-edge`, provider.id, `${prefix}-constraint`, 'constraints', 'constrained by', 'constrains'),
    edge(`${prefix}-reference-edge`, provider.id, reference.id, 'references', 'derived from', 'derived-from'),
    edge(`${prefix}-outcome-edge`, provider.id, `${prefix}-outcome`, 'outcomes', 'suggests', 'relates-to')
  ];
  if (specimen) {
    edges.push(edge(`${prefix}-bridge-depends`, `${prefix}-idea`, reference.id, 'right', 'depends on', 'depends-on'));
    edges.push(edge(`${prefix}-decision-constrains`, `${prefix}-outcome`, `${prefix}-idea`, 'left', 'constrains', 'constrains'));
  }

  return {
    fileVersion: '1.0',
    metadata: { title, description, graphId, version: '0.1.0', kind: 'brainstorm', created: now, modified: now, author: '', tags: ['brainstorm', specimen ? 'architecture' : 'template'], preferredViewer: 'https://dev.twilite.zone' },
    nodes, edges, clusters: [],
    settings: { theme: null, backgroundImage: null, defaultNodeColor: '#1e3a8a', defaultEdgeColor: '#64748b', snapToGrid: false, gridSize: 20, edgeRouting: 'auto', layout: { mode: 'manual' }, github: { repo: 'mikemartinez1974/public', path: githubPath, branch: 'main', autoCreateRepo: true, repoVisibility: 'public', seedOnCommit: false, enableGithubPages: false, installationId: '120403738' }, autoSave: false },
    scripts: []
  };
}

const template = build({ prefix: 'brainstorm-template', graphId: 'brainstorm-template', title: 'Brainstorm Template', description: 'A loose semantic staging ground where ideas, questions, constraints, references, and outcomes can acquire structure before promotion.', githubPath: 'templates/brainstorm-template/root.node' });
const specimen = build({ prefix: 'graph-interface-authority-brainstorm', graphId: 'graph-interface-authority-brainstorm', title: 'Graph Interface and Bridge Authority', description: 'Explore removal of redundant root metadata, graph-authored aspect ratio, and direct bridge-mediated type resolution.', githubPath: 'graphs/graph-interface-authority-brainstorm.node', specimen: true });

fs.writeFileSync(path.join(__dirname, 'root.node'), `${JSON.stringify(template, null, 2)}\n`);
fs.writeFileSync(path.join(repo, 'graphs/graph-interface-authority-brainstorm.node'), `${JSON.stringify(specimen, null, 2)}\n`);
