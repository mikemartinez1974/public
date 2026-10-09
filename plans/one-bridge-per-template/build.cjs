// Builds this plan from the Plan Template, the same way plans/direct-edge-routing/build.cjs does.
//   node plans/one-bridge-per-template/build.cjs
const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.join(__dirname, 'root.node');
const templateDir = path.resolve(__dirname, '../../templates/plan-template');
const template = JSON.parse(fs.readFileSync(path.join(templateDir, 'root.node'), 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));

const prefix = 'one-bridge-per-template';
const graphId = `${prefix}-declaration`;
const nodeId = `${prefix}-plan`;
const graphRef = `github://mikemartinez1974/public/plans/${prefix}/root.node`;
const templateClassPrefix = 'github://mikemartinez1974/public/templates/plan-template/classes/';
const title = 'One Bridge per Template';
const description = 'Plan for letting a single Bridge to a template carry everything the template exports, so a graph does not need a Bridge per class.';
const now = '2026-10-09T21:00:00.000Z';
const replaceTemplateText = (value) => {
  if (Array.isArray(value)) return value.map(replaceTemplateText);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, replaceTemplateText(entry)]));
  }
  if (typeof value !== 'string') return value;
  if (value.startsWith(templateClassPrefix)) return value;
  return value
    .replaceAll('github://mikemartinez1974/public/templates/plan-template/root.node', graphRef)
    .replaceAll('plan-template', prefix)
    .replaceAll('Plan Template', `${title} Plan`);
};

const graph = replaceTemplateText(clone(template));
const semanticTypes = new Set([
  'plan', 'plan-goal', 'plan-phase', 'plan-action', 'plan-milestone',
  'plan-decision', 'plan-constraint', 'plan-risk', 'plan-contingency'
]);
const exemplars = new Map(template.nodes.filter((node) => semanticTypes.has(node.type)).map((node) => [node.type, node]));
graph.nodes = graph.nodes.filter((node) => !semanticTypes.has(node.type));
graph.edges = graph.edges.filter((edge) => {
  const role = String(edge.data?.semanticRole || '').trim();
  return !role.startsWith('plan.') && role !== 'instantiates';
});

// The plan's own nodes sit to the right of the template's declaration, views and class bridges, on a 480 by 360 grid.
const declaration = graph.nodes.find((node) => node.id === graphId);
const origin = { x: declaration.position.x + 1100, y: declaration.position.y };
const at = (column, row) => ({ x: origin.x + column * 480, y: origin.y + row * 360 });
const makeNode = (type, id, label, position, text, extra = {}) => {
  const node = replaceTemplateText(clone(exemplars.get(type)));
  node.id = `${prefix}-${id}`;
  node.label = label;
  node.position = position;
  node.width = 360;
  node.height = 220;
  node.data = { ...node.data, title: label, description: text, status: 'draft', ...extra };
  return node;
};

const contentNodes = [
  makeNode('plan', 'the-plan', 'Use a template through one Bridge', at(0, 0),
    'Let one Bridge to a template carry every class the template exports, used in place and not copied into the graph.'),
  makeNode('plan-goal', 'goal', 'A graph uses a template through one reference', at(1, 0),
    'A graph that uses the Page Template has a single Bridge to it and can create a Masthead, Route, Section or Settings from it. No Bridge per class, and nothing copied in.'),
  makeNode('plan-decision', 'decision-in-place', 'Exports are used in place, not copied', at(2, 0),
    'Today a Bridge to a whole template copies its exports into the graph as local Bridges plus a template node. That copying stops.',
    { decision: 'A template Bridge is the authority for what the template exports. Nothing is materialized in the consuming graph.' }),
  makeNode('plan-decision', 'decision-direct', 'A direct class Bridge stays valid', at(3, 0),
    'Graphs that point straight at a class file keep working unchanged. The template Bridge becomes the usual way, not the only way.',
    { decision: 'No forced migration. Legacy graphs are converted only when they are reauthored.' }),

  makeNode('plan-phase', 'phase-prove', '1. Prove the shape on a demo', at(0, 1),
    'Fix what "working" means before any app code changes, on a copy that cannot hurt a real graph.'),
  makeNode('plan-phase', 'phase-create', '2. Create through the template', at(1, 1),
    'Make the one Bridge useful: the create menu offers the template\'s classes, and choosing one makes a node.'),
  makeNode('plan-phase', 'phase-authority', '3. Count the template as the authority', at(2, 1),
    'Everything that asks "may this graph hold this type" accepts a class that arrives through a template.'),
  makeNode('plan-phase', 'phase-show', '4. Show the connection', at(3, 1),
    'In the workspace the graph visibly plugs into the template it uses.'),
  makeNode('plan-phase', 'phase-convert', '5. Convert the graphs that matter', at(4, 1),
    'Move the current templates and the primitive set onto one Bridge each, and write the rule down.'),

  makeNode('plan-action', 'action-demo', 'Build a demo graph with one Page Template Bridge', at(0, 2),
    'A copy of the Edge Class Template whose Page Section class Bridge is replaced by a single Bridge to the Page Template. It already holds two Page Sections, so it tests existing nodes as well as new ones.'),
  makeNode('plan-action', 'action-checks', 'Write the checks that must pass', at(0, 3),
    'Tests for the four behaviours below, written first and failing: the menu lists the classes, a node is created, validation is clean, the workspace draws the connection.'),
  makeNode('plan-action', 'action-menu', 'List a template\'s exports in the create menu', at(1, 2),
    'A Bridge to a template offers each class named by the template\'s export Bridges. Asked today, the Page Template offers none.'),
  makeNode('plan-action', 'action-stamp', 'Create a node from the class an export names', at(1, 3),
    'Creating follows the export to its class file and stamps the node from it. Today this is refused: "Bridge target must be a node-class graph (received template)".'),
  makeNode('plan-action', 'action-validate', 'Validation accepts classes that arrive through a template', at(2, 2),
    'A graph with one template Bridge raises no missing class authority warning for the types that template exports.'),
  makeNode('plan-action', 'action-lookups', 'Find every other place a class is loaded from a Bridge', at(2, 3),
    'Editors, views, event Handlers that listen by class, and reloads each read a Bridge\'s class. List them and route each through the same lookup.'),
  makeNode('plan-action', 'action-line', 'Plug the import into the template\'s exports', at(3, 2),
    'With both graphs open, one connection runs from the graph\'s import on its left edge to the template\'s exports on its right edge.'),
  makeNode('plan-action', 'action-convert', 'Convert the current templates and primitives', at(4, 2),
    'Edge Class Template, Node Class Template, Declaration Template, the Edge Class page, and the eight core edge classes: each goes from one Bridge per class to one Bridge to the Page Template.'),
  makeNode('plan-action', 'action-guidance', 'Record the rule for agents', at(4, 3),
    'AGENTS.md says how a graph uses a template, that exports are used in place, and that direct class Bridges remain valid.'),

  makeNode('plan-milestone', 'milestone-demo', 'The demo works with one Bridge', at(5, 1),
    'On the demo graph: the menu lists four classes, a new Page Section can be created, the existing two still render, validation is clean, and the workspace shows one connection.'),
  makeNode('plan-decision', 'decision-review', 'Michael reviews the demo', at(5, 2),
    'Nothing in the real library changes until the demo has been looked at in the app.',
    { decision: 'Open. Go ahead with conversion, adjust the design, or stop.' }),
  makeNode('plan-milestone', 'milestone-done', 'Templates and primitives point back to the Page Template', at(5, 3),
    'The graphs being authored now each hold one Bridge to the template they use. Structure reinforces itself: creating a template is enough to make it usable.'),

  makeNode('plan-constraint', 'constraint-nodes', 'Existing nodes must not break', at(0, 4),
    'A node already stamped carries its own record of its class. Removing a per-class Bridge must leave it rendering and editable.'),
  makeNode('plan-constraint', 'constraint-fields', 'No new stored fields', at(1, 4),
    'A template Bridge is the same Bridge node it is today, pointed at a template. Nothing new is saved on it to make this work.'),
  makeNode('plan-constraint', 'constraint-sides', 'Imports on the left, exports on the right', at(3, 4),
    'An import is what other graphs plug into, so it stays on the left edge. Exports face outward on the right.'),
  makeNode('plan-risk', 'risk-missed', 'A class is loaded somewhere we did not find', at(2, 4),
    'Class refs are read in several places. One missed path means a menu, an editor or an event that quietly finds nothing.'),
  makeNode('plan-risk', 'risk-clash', 'Two templates export the same class key', at(1, 5),
    'A graph bridged to both would have two sources for one type, and no rule yet for which wins.'),
  makeNode('plan-risk', 'risk-order', 'Converted graphs reach an app that cannot read them', at(4, 4),
    'A graph with only a template Bridge cannot create nodes on a build without this change.'),
  makeNode('plan-contingency', 'contingency-both', 'Keep the per-class Bridges until every path passes', at(2, 5),
    'A graph may carry the template Bridge and its old class Bridges together during the changeover. The old ones come out last.'),
  makeNode('plan-contingency', 'contingency-refuse', 'Refuse the second source and say so', at(0, 5),
    'If two template Bridges offer the same class key, creation names both and asks for one to be removed, and does not pick silently.'),
  makeNode('plan-contingency', 'contingency-deploy', 'Deploy the app before pushing converted graphs', at(4, 5),
    'Conversion is pushed only after the build that understands a template Bridge is live.')
];
// Where the work stands. Anything not listed is still a draft, not started.
const statuses = {
  'the-plan': 'in-progress', goal: 'done', 'decision-direct': 'done',
  'phase-prove': 'done', 'action-demo': 'done', 'action-checks': 'done',
  'phase-create': 'done', 'action-menu': 'done', 'action-stamp': 'done',
  'phase-authority': 'done', 'action-validate': 'done', 'action-lookups': 'done',
  'phase-show': 'done', 'action-line': 'done',
  'milestone-demo': 'done', 'decision-review': 'done',
  'phase-convert': 'done', 'action-convert': 'done', 'action-guidance': 'done', 'contingency-both': 'done',
  'constraint-nodes': 'done', 'constraint-fields': 'done', 'constraint-sides': 'done'
};
contentNodes.forEach((node) => {
  const status = statuses[node.id.slice(prefix.length + 1)];
  if (status) node.data.status = status;
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
  'plan.gates': ['next', 'input'],
  'plan.constrained-by': ['support', 'subject'],
  'plan.threatened-by': ['support', 'subject'],
  'plan.mitigated-by': ['mitigation', 'trigger']
};
const id = (suffix) => `${prefix}-${suffix}`;
const addEdge = (name, type, source, target, ports = edgePorts[type]) => {
  graph.edges.push({
    id: id(`edge-${name}`), type, label: type.replace('plan.', '').replaceAll('-', ' '), source: id(source), target: id(target),
    sourcePort: ports[0], sourceHandle: ports[0], targetPort: ports[1], targetHandle: ports[1],
    style: { ...edgeStyle[type], curved: true, dash: edgeStyle[type]?.dash || [] },
    data: { semanticRole: type, presentation: { layer: 'semantic' } }
  });
};

addEdge('goal', 'plan.achieves', 'the-plan', 'goal');
const phases = ['prove', 'create', 'authority', 'show', 'convert'];
phases.forEach((phase) => addEdge(`plan-${phase}`, 'plan.contains', 'the-plan', `phase-${phase}`, ['phases', 'parent']));
phases.slice(1).forEach((phase, index) => addEdge(`phase-${index + 1}-${index + 2}`, 'plan.precedes', `phase-${phases[index]}`, `phase-${phase}`));
const phaseActions = { prove: ['demo', 'checks'], create: ['menu', 'stamp'], authority: ['validate', 'lookups'], show: ['line'], convert: ['convert', 'guidance'] };
for (const [phase, actions] of Object.entries(phaseActions)) {
  for (const action of actions) addEdge(`${phase}-${action}`, 'plan.contains', `phase-${phase}`, `action-${action}`, ['actions', 'parent']);
}
addEdge('demo-milestone', 'plan.produces', 'action-line', 'milestone-demo');
addEdge('review-gate', 'plan.gates', 'milestone-demo', 'decision-review');
addEdge('done-milestone', 'plan.produces', 'action-guidance', 'milestone-done');
addEdge('in-place', 'plan.produces', 'action-stamp', 'decision-in-place');
addEdge('direct', 'plan.produces', 'action-convert', 'decision-direct');
addEdge('nodes', 'plan.constrained-by', 'action-demo', 'constraint-nodes');
addEdge('fields', 'plan.constrained-by', 'action-stamp', 'constraint-fields');
addEdge('sides', 'plan.constrained-by', 'action-line', 'constraint-sides');
addEdge('missed', 'plan.threatened-by', 'action-lookups', 'risk-missed');
addEdge('clash', 'plan.threatened-by', 'action-menu', 'risk-clash');
addEdge('order', 'plan.threatened-by', 'action-convert', 'risk-order');
addEdge('both', 'plan.mitigated-by', 'risk-missed', 'contingency-both');
addEdge('refuse', 'plan.mitigated-by', 'risk-clash', 'contingency-refuse');
addEdge('deploy', 'plan.mitigated-by', 'risk-order', 'contingency-deploy');

for (const node of contentNodes) {
  graph.edges.push({
    id: `${node.id}-instantiates`, type: 'reference', label: '', source: `${prefix}-class-bridge-${node.type}`, target: node.id,
    sourcePort: 'root', sourceHandle: 'root', targetPort: 'root', targetHandle: 'root', hidden: true,
    style: { stroke: '#64748b', strokeWidth: 1, opacity: 0.03 },
    data: { role: 'instantiates', semanticRole: 'instantiates', presentation: { layer: 'contract' } }
  });
}

graph.metadata = { ...graph.metadata, title, description, graphId, version: '0.1.0', created: now, modified: now,
  tags: ['plan', 'bridges', 'templates', 'exports'], preferredViewer: 'https://dev.twilite.zone' };
declaration.label = `${title} Plan`;
declaration.data.identity = { ...declaration.data.identity, graphId, nodeId, name: title, version: '0.1.0', description };
declaration.data.document = { url: graphRef };
declaration.data.dependencies = { ...(declaration.data.dependencies || {}), skills: ['plan-template'] };

const rootPort = graph.nodes.find((node) => node.id === `${prefix}-root-port`);
rootPort.label = `${title} Plan`;
rootPort.data.title = title;
rootPort.data.summary = description;
rootPort.data.identity = { ...rootPort.data.identity, graphId, nodeId };

// The views draw the idea: several Bridges on the left becoming one on the right.
const text = (x, y, value, size, fill, weight = 400) => `<text x="${x}" y="${y}" fill="${fill}" font-family="system-ui,sans-serif" font-size="${size}" font-weight="${weight}">${value}</text>`;
const box = (x, y, w, h, fill, stroke) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const picture = (x, y) => [0, 1, 2, 3].map((row) => `<path d="M${x + 96} ${y + 18 + row * 34} H${x + 150}" stroke="#64748b" stroke-width="2" stroke-dasharray="5 5"/>${box(x, y + 4 + row * 34, 96, 26, '#1e293b', '#64748b')}`).join('')
  + box(x + 150, y, 110, 136, '#1e293b', '#64748b') + text(x + 172, y + 74, 'template', 14, '#cbd5e1')
  + `<path d="M${x + 300} ${y + 68} H${x + 340} M${x + 330} ${y + 58} L${x + 342} ${y + 68} L${x + 330} ${y + 78}" fill="none" stroke="#a78bfa" stroke-width="3"/>`
  + box(x + 380, y + 55, 96, 26, '#2e1065', '#a78bfa') + `<path d="M${x + 476} ${y + 68} H${x + 530}" stroke="#a78bfa" stroke-width="3"/>`
  + box(x + 530, y, 110, 136, '#2e1065', '#a78bfa') + text(x + 552, y + 74, 'template', 14, '#ede9fe');
const detailSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 440" role="img" aria-label="${title}"><rect width="720" height="440" rx="20" fill="#0f172a"/>`
  + text(42, 62, 'PLAN · DRAFT FOR REVIEW', 14, '#a78bfa', 800) + text(42, 112, title, 38, '#f8fafc', 700)
  + text(42, 148, 'A graph that uses a template should need one reference to it,', 17, '#cbd5e1') + text(42, 172, 'not one for every class the template offers.', 17, '#cbd5e1')
  + picture(40, 230) + text(42, 410, 'Today: a Bridge per class.', 14, '#94a3b8') + text(420, 410, 'Goal: one Bridge to the template.', 14, '#c4b5fd') + `</svg>`;
const summarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" role="img" aria-label="${title}"><rect width="520" height="320" rx="20" fill="#0f172a"/>`
  + text(32, 54, 'PLAN · DRAFT', 13, '#a78bfa', 800) + text(32, 98, title, 30, '#f8fafc', 700)
  + text(32, 136, 'One Bridge to a template carries every', 16, '#cbd5e1') + text(32, 158, 'class the template exports.', 16, '#cbd5e1')
  + text(32, 270, '5 phases · 9 actions · 2 milestones · 3 risks', 14, '#94a3b8') + `</svg>`;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" role="img" aria-label="${title}"><rect width="320" height="220" rx="18" fill="#0f172a"/>`
  + box(40, 97, 90, 26, '#2e1065', '#a78bfa') + `<path d="M130 110 H190" stroke="#a78bfa" stroke-width="4"/>` + box(190, 50, 90, 120, '#2e1065', '#a78bfa')
  + text(40, 200, 'One Bridge', 16, '#ede9fe', 700) + `</svg>`;
for (const [suffix, svg] of [['detail-view', detailSvg], ['summary-view', summarySvg], ['icon-view', iconSvg]]) {
  const view = graph.nodes.find((node) => node.id === `${prefix}-${suffix}`);
  view.label = `${title} ${suffix.replace('-view', '')}`;
  view.data.content = { kind: 'svg', value: svg };
  view.data.identity = { ...view.data.identity, graphId, nodeId };
}
const landing = graph.nodes.find((node) => node.id === `${prefix}-landing-content`);
landing.label = `${title} Plan`;
landing.data.content = { kind: 'svg', value: detailSvg };
landing.data.identity = { ...landing.data.identity, graphId, nodeId };

const instructions = graph.nodes.find((node) => node.id === `${prefix}-instructions`);
instructions.label = 'How to read this plan';
instructions.position = at(4, 0);
instructions.data.markdown = '# How to read this plan\n\nThis is a draft for review. Nothing in it has been started.\n\n'
  + '- The five **phases** run left to right. Each holds the **actions** beneath it.\n'
  + '- Phase 1 changes no app code. Phases 2 to 4 are the app work. Phase 5 is the only one that changes real graphs.\n'
  + '- **Michael reviews the demo** is a gate: conversion does not begin until that decision is made.\n'
  + '- **Constraints** are things the work must not break. **Risks** each have a **contingency** below them.\n\n'
  + 'What was measured before writing this: pointed at the Page Template, a class Bridge is refused today, and the template offers no classes when asked. A Bridge to the whole template does find its four exports, then copies them in.';

for (const node of graph.nodes) {
  if (node.data?.identity?.graphId) node.data.identity.graphId = graphId;
}
graph.settings = { ...graph.settings, snapToGrid: true, gridSize: 20, edgeRouting: 'orthogonal',
  layout: { mode: 'manual', defaultLayout: 'layered', direction: 'RIGHT', edgeLaneGapPx: 20 } };
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
graph.timestamp = now;

fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
console.log(`wrote ${path.relative(process.cwd(), outputPath)}: ${graph.nodes.length} nodes, ${graph.edges.length} edges`);
