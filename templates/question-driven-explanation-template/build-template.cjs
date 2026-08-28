const fs = require('node:fs');
const path = require('node:path');
const { bindHandles, makeModernInterface, withHandles, rootPort } = require('../_support/modern-template.cjs');

const output = path.join(__dirname, 'root.node');
const description = 'Explain a subject through explicit questions, direct answers, sources, examples, caveats, and synthesis.';
const modern = makeModernInterface({
  prefix: 'qa-template',
  graphId: 'question-driven-explanation-template',
  nodeId: 'question-driven-explanation',
  name: 'Question-Driven Explanation Template',
  kind: 'template',
  description,
  glyph: '?',
  dependencies: ['bridge', 'qa-topic', 'qa-question', 'qa-answer', 'qa-source', 'qa-example', 'qa-caveat', 'qa-summary']
});

const classes = [
  ['qa-topic', 'Topic', { x: -120, y: -420 }],
  ['qa-question', 'Question', { x: 380, y: -420 }],
  ['qa-answer', 'Answer', { x: 880, y: -420 }],
  ['qa-source', 'Source', { x: 880, y: 20 }],
  ['qa-example', 'Example', { x: 1380, y: 20 }],
  ['qa-caveat', 'Caveat', { x: 1880, y: 20 }],
  ['qa-summary', 'Summary', { x: 1380, y: 460 }]
];

const bridgeNodes = [];
const specimenNodes = [];
for (const [key, label, position] of classes) {
  const ref = `github://mikemartinez1974/public/templates/question-driven-explanation-template/classes/nodes/${key}.node-class.node`;
  const classGraph = JSON.parse(fs.readFileSync(path.join(__dirname, 'classes', 'nodes', `${key}.node-class.node`), 'utf8'));
  const classDeclaration = classGraph.nodes.find((node) => node.type === 'declaration');
  const nodeClass = classDeclaration?.data?.nodeClass || {};
  const nodeDef = nodeClass.nodeDef || { key, ref, defaults: {} };
  const ports = nodeDef.defaults?.ports || [rootPort('bidirectional', 180)];
  bridgeNodes.push({
    id: `qa-template-${key}-bridge`, type: 'bridge', label: `${label} Authority`,
    position: { x: position.x, y: position.y - 260 }, width: 360, height: 120,
    ports: [], handles: [], visible: false, showLabel: true,
    data: {
      authority: 'bridge', resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'],
      bridge: { ref, role: 'import', resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'] },
      target: { ref, mode: 'bridge', kind: 'node-class', resourceKind: 'node-class', key, label, grants: ['create'] },
      _bridge: { classKey: key, classRef: ref, sourceRef: ref, entryPort: 'root', kind: 'node-class', targetKind: 'node-class' },
      _classBinding: { key, sourceRef: ref, ref, nodeDef },
      identity: { graphId: 'question-driven-explanation-template' }
    }
  });
  specimenNodes.push({
    id: `qa-template-${key}`, type: key, label, position, width: 420, height: 300,
    ports, handles: bindHandles(ports), visible: true, showLabel: true,
    data: {
      ...(nodeDef.defaults?.data || {}),
      title: label,
      identity: { graphId: 'question-driven-explanation-template' },
      definitionKey: key,
      _classBinding: { key, sourceRef: ref, ref, nodeDef },
      _bridge: { classKey: key, classRef: ref, sourceRef: ref, entryPort: 'root', kind: 'node-class', targetKind: 'node-class' }
    }
  });
}

const notes = withHandles({
  id: 'qa-template-notes', type: 'content', label: 'Explanation Grammar',
  position: { x: -900, y: -760 }, width: 520, height: 360,
  ports: [rootPort('bidirectional', 180)], visible: true, showLabel: true,
  data: {
    content: { kind: 'markdown', value: '# Explanation Grammar\n\nTopic raises Question. Question receives Answer. Answer may be supported by Source, illustrated by Example, qualified by Caveat, and condensed into Summary.' },
    renderShape: { kind: 'markdown' }, identity: { graphId: 'question-driven-explanation-template' }
  }
});

const byKey = Object.fromEntries(classes.map(([key]) => [key, `qa-template-${key}`]));
const edge = (id, source, target, sourceHandle, targetHandle, label) => ({
  id, type: 'reference', source, target, sourceHandle, targetHandle, label,
  data: { semanticRole: label.toLowerCase().replace(/\s+/g, '-') }
});
const domainEdges = [
  edge('qa-template-topic-question', byKey['qa-topic'], byKey['qa-question'], 'right', 'left', 'raises'),
  edge('qa-template-question-answer', byKey['qa-question'], byKey['qa-answer'], 'right', 'left', 'answers'),
  edge('qa-template-answer-source', byKey['qa-answer'], byKey['qa-source'], 'bottom', 'top', 'supported by'),
  edge('qa-template-answer-example', byKey['qa-answer'], byKey['qa-example'], 'right', 'left', 'illustrated by'),
  edge('qa-template-answer-caveat', byKey['qa-answer'], byKey['qa-caveat'], 'right', 'left', 'qualified by'),
  edge('qa-template-answer-summary', byKey['qa-answer'], byKey['qa-summary'], 'bottom', 'top', 'synthesized as')
];

const declaration = modern.nodes.find((node) => node.id === modern.ids.declaration);
declaration.data.kit = {
  coreNodeClasses: classes.map(([key]) => ({
    key,
    ref: `github://mikemartinez1974/public/templates/question-driven-explanation-template/classes/nodes/${key}.node-class.node`
  }))
};

const graph = {
  type: 'nodegraph-data', version: '1.0.0',
  metadata: {
    title: 'Question-Driven Explanation Template', description,
    graphId: 'question-driven-explanation-template', version: '1.0.0', kind: 'template'
  },
  nodes: [...modern.nodes, notes, ...bridgeNodes, ...specimenNodes],
  edges: [...modern.edges, ...domainEdges]
};
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
fs.writeFileSync(output, `${JSON.stringify(graph, null, 2)}\n`);
