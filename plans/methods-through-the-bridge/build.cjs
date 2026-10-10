// Builds this plan from the Plan Template, the same way plans/one-bridge-per-template/build.cjs does.
//   node plans/methods-through-the-bridge/build.cjs
const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.join(__dirname, 'root.node');
const templateDir = path.resolve(__dirname, '../../templates/plan-template');
const template = JSON.parse(fs.readFileSync(path.join(templateDir, 'root.node'), 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));

const prefix = 'methods-through-the-bridge';
const graphId = `${prefix}-declaration`;
const nodeId = `${prefix}-plan`;
const graphRef = `github://mikemartinez1974/public/plans/${prefix}/root.node`;
const templateClassPrefix = 'github://mikemartinez1974/public/templates/plan-template/classes/';
const title = 'Methods Through the Bridge';
const description = 'Plan for letting a page run its template\'s Method through the one Bridge it already has, so no page carries a copy and any template a user makes works the same way.';
const now = '2026-10-10T18:00:00.000Z';
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
  makeNode('plan', 'the-plan', 'Run a template\'s Method through the Bridge', at(0, 0),
    'A page uses its template\'s Method through the one Bridge it already holds. The page carries no copy, so there is nothing to keep in step.'),
  makeNode('plan-goal', 'goal', 'Change a template once; its pages follow', at(1, 0),
    'Someone who makes a page template in the editor, with no scripts and no command line, gets pages that pick up a change to the template\'s Method. Today 18 pages each carry their own copy of "Assemble the page", kept the same by a developer script.'),
  makeNode('plan-decision', 'decision-when', 'When a page picks up a change', at(2, 0),
    'A template change could reach its pages at once, or the next time each page is assembled.',
    { decision: 'Proposed: the next time the page is assembled (one of its pieces changes, or it is opened for editing). Nothing is pushed into a graph nobody has open. Open for Michael.' }),
  makeNode('plan-decision', 'decision-missing', 'What a page shows when its template cannot be loaded', at(3, 0),
    'The page already stores its assembled views in its own file.',
    { decision: 'Proposed: the page keeps showing its stored views, assembling is skipped, and the editor says the template could not be reached. A page never goes blank because of its template. Open for Michael.' }),
  makeNode('plan-decision', 'decision-override', 'A page may keep its own Method', at(4, 0),
    'Some pages will need to differ from their template.',
    { decision: 'Proposed: a Method node that holds its own source is a local Method and is used as it is; the editor marks it "local" and offers to go back to the template\'s. Open for Michael.' }),

  makeNode('plan-phase', 'phase-prove', '1. Prove the shape on a demo', at(0, 1),
    'Say what "working" means before the app changes, on copies that cannot hurt a real graph.'),
  makeNode('plan-phase', 'phase-offer', '2. A template offers its Method', at(1, 1),
    'The template says, on its one export, that its Method is handed on, the way it already says which classes are.'),
  makeNode('plan-phase', 'phase-call', '3. A page runs it', at(2, 1),
    'A page\'s Method node points through the Bridge and holds no source. The app fetches the source when the Method is invoked.'),
  makeNode('plan-phase', 'phase-show', '4. Show where it comes from', at(3, 1),
    'In the editor a bridged Method is visibly the template\'s, can be read, and can be made local.'),
  makeNode('plan-phase', 'phase-convert', '5. Convert the pages', at(4, 1),
    'Move the pages off their copies and retire the script that kept the copies the same.'),

  makeNode('plan-action', 'action-demo', 'Build a demo template and a demo page', at(0, 2),
    'A copy of the Page Template and one page that bridges it, each with its own identity so neither merges with the real graphs in the workspace. The page\'s Method node has no source.'),
  makeNode('plan-action', 'action-checks', 'Write the checks that must pass', at(0, 3),
    'Tests written first and failing: the page assembles using the template\'s source; editing the template\'s Method changes what the page assembles; with the template unreachable the page keeps its stored views; a local Method is used as it is.'),
  makeNode('plan-action', 'action-export', 'List a Method on the template\'s export', at(1, 2),
    'The export Bridge\'s exposure names the Methods it hands on, beside the classes. Measured today: a Bridge can already offer Scripts to a Script node when it grants "execute", and Methods are not offered at all.'),
  makeNode('plan-action', 'action-chain', 'Methods pass up the Bridge chain', at(1, 3),
    'A template that reaches another template through its own Bridge may hand that template\'s Method on, the same rule classes follow.'),
  makeNode('plan-action', 'action-resolve', 'Resolve a bridged Method when it is invoked', at(2, 2),
    'When a Handler invokes a Method node that points through a Bridge, the app loads the template, finds the Method the export names, and runs its source against the page.'),
  makeNode('plan-action', 'action-effects', 'The page declares what may be written', at(2, 3),
    'The source comes from the template; the effects stay on the page\'s own Method node. A template\'s Method can only write the nodes the page has named.'),
  makeNode('plan-action', 'action-editor', 'Mark a bridged Method in the editor', at(3, 2),
    'The Method node shows which template it comes from, opens the source read-only, and has two actions: "make a local copy" and "use the template\'s again".'),
  makeNode('plan-action', 'action-convert', 'Convert the 18 pages', at(4, 2),
    'The sixteen primitives, the Declaration Template and the Edge Class Page each drop their copy of "Assemble the page" and point at the Page Template\'s through their Bridge.'),
  makeNode('plan-action', 'action-retire', 'Retire the sync script', at(4, 3),
    'npm run sync:page-method and tests/pageMethodSync.test.js go away once no page carries a copy. AGENTS.md says how a page gets its Method.'),

  makeNode('plan-milestone', 'milestone-demo', 'The demo page follows its template', at(5, 1),
    'On the demo: the page assembles with no source of its own, a change to the template\'s Method shows up the next time the page is assembled, and the page still renders with the template closed.'),
  makeNode('plan-decision', 'decision-review', 'Michael reviews the demo', at(5, 2),
    'No real page changes until the demo has been tried in the app and the three open decisions are made.',
    { decision: 'Open. Go ahead with conversion, adjust the design, or stop.' }),
  makeNode('plan-milestone', 'milestone-done', 'No page carries a copy', at(5, 3),
    'How pages look is decided in the template and nowhere else. A page template made by a user in the editor behaves the same as the Page Template.'),

  makeNode('plan-constraint', 'constraint-stored', 'A page renders without its template', at(0, 4),
    'The assembled views stay stored in the page\'s own file. Opening or browsing a page never needs the template to be loaded.'),
  makeNode('plan-constraint', 'constraint-names', 'Nothing is found by name', at(1, 4),
    'A page reaches its Method by following its Bridge to what the template exports, not by a Method name or a known file path. That is what makes a second template work.'),
  makeNode('plan-constraint', 'constraint-node', 'No new kind of node', at(2, 4),
    'A bridged Method is an ordinary Method node that points through a Bridge. Handlers invoke it the way they invoke any Method.'),
  makeNode('plan-constraint', 'constraint-grant', 'Running needs the "execute" grant', at(3, 4),
    'A Bridge that does not grant "execute" cannot be used to run a template\'s Method. Fetching code from another graph is something a graph has to say it allows.'),

  makeNode('plan-risk', 'risk-break', 'One bad edit breaks every page', at(2, 5),
    'Today a broken copy breaks one page. With one Method, a mistake in the template reaches all of them the next time each is assembled.'),
  makeNode('plan-risk', 'risk-offline', 'Tests and scripts run Methods straight from the file', at(0, 5),
    'Many tests, and the library scripts, run a Method by reading its source off the node. A Method node with no source gives them nothing to run.'),
  makeNode('plan-risk', 'risk-order', 'Converted pages reach an app that cannot run them', at(4, 4),
    'A page whose Method has no source cannot assemble on a build without this change.'),
  makeNode('plan-contingency', 'contingency-keep', 'A failed run leaves the stored page alone', at(3, 5),
    'If the template\'s Method throws, nothing is written: the page keeps the views it had, and the error names the template. A page can also be switched to a local copy while the template is fixed.'),
  makeNode('plan-contingency', 'contingency-helper', 'One helper resolves a Method for tests and scripts', at(1, 5),
    'The lookup the app uses is a plain function that takes a way to fetch a graph. Tests and scripts call it with the library on disk.'),
  makeNode('plan-contingency', 'contingency-deploy', 'Deploy the app before pushing converted pages', at(4, 5),
    'Conversion is pushed only after the build that can run a bridged Method is live. Until then the sync script stays.')
];
// Where the work stands. Anything not listed is still a draft, not started.
const statuses = Object.fromEntries(contentNodes.map((node) => [node.id.slice(prefix.length + 1), 'done']));
// Still to do, and yours: the app must be live before the converted pages are pushed.
Object.assign(statuses, { 'risk-order': 'in-progress', 'contingency-deploy': 'in-progress' });
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
const phases = ['prove', 'offer', 'call', 'show', 'convert'];
phases.forEach((phase) => addEdge(`plan-${phase}`, 'plan.contains', 'the-plan', `phase-${phase}`, ['phases', 'parent']));
phases.slice(1).forEach((phase, index) => addEdge(`phase-${index + 1}-${index + 2}`, 'plan.precedes', `phase-${phases[index]}`, `phase-${phase}`));
const phaseActions = { prove: ['demo', 'checks'], offer: ['export', 'chain'], call: ['resolve', 'effects'], show: ['editor'], convert: ['convert', 'retire'] };
for (const [phase, actions] of Object.entries(phaseActions)) {
  for (const action of actions) addEdge(`${phase}-${action}`, 'plan.contains', `phase-${phase}`, `action-${action}`, ['actions', 'parent']);
}
addEdge('demo-milestone', 'plan.produces', 'action-editor', 'milestone-demo');
addEdge('review-gate', 'plan.gates', 'milestone-demo', 'decision-review');
addEdge('done-milestone', 'plan.produces', 'action-retire', 'milestone-done');
addEdge('when', 'plan.produces', 'action-resolve', 'decision-when');
addEdge('missing', 'plan.produces', 'action-resolve', 'decision-missing');
addEdge('override', 'plan.produces', 'action-editor', 'decision-override');
addEdge('stored', 'plan.constrained-by', 'action-demo', 'constraint-stored');
addEdge('names', 'plan.constrained-by', 'action-export', 'constraint-names');
addEdge('node', 'plan.constrained-by', 'action-resolve', 'constraint-node');
addEdge('grant', 'plan.constrained-by', 'action-resolve', 'constraint-grant');
addEdge('break', 'plan.threatened-by', 'action-resolve', 'risk-break');
addEdge('offline', 'plan.threatened-by', 'action-checks', 'risk-offline');
addEdge('order', 'plan.threatened-by', 'action-convert', 'risk-order');
addEdge('keep', 'plan.mitigated-by', 'risk-break', 'contingency-keep');
addEdge('helper', 'plan.mitigated-by', 'risk-offline', 'contingency-helper');
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
  tags: ['plan', 'bridges', 'templates', 'methods'], preferredViewer: 'https://dev.twilite.zone' };
declaration.label = `${title} Plan`;
declaration.data.identity = { ...declaration.data.identity, graphId, nodeId, name: title, version: '0.1.0', description };
declaration.data.document = { url: graphRef };
declaration.data.dependencies = { ...(declaration.data.dependencies || {}), skills: ['plan-template'] };

const rootPort = graph.nodes.find((node) => node.id === `${prefix}-root-port`);
rootPort.label = `${title} Plan`;
rootPort.data.title = title;
rootPort.data.summary = description;
rootPort.data.identity = { ...rootPort.data.identity, graphId, nodeId };

// The views draw the idea: three pages each holding a copy on the left, three pages pointing at one Method on the right.
const text = (x, y, value, size, fill, weight = 400) => `<text x="${x}" y="${y}" fill="${fill}" font-family="system-ui,sans-serif" font-size="${size}" font-weight="${weight}">${value}</text>`;
const box = (x, y, w, h, fill, stroke) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const chip = (x, y, fill) => `<rect x="${x}" y="${y}" width="34" height="14" rx="4" fill="${fill}"/>`;
const picture = (x, y) => [0, 1, 2].map((row) => box(x, y + row * 46, 110, 36, '#1e293b', '#64748b') + chip(x + 66, y + 11 + row * 46, '#94a3b8')).join('')
  + box(x + 150, y + 26, 100, 84, '#1e293b', '#64748b') + chip(x + 183, y + 61, '#94a3b8') + text(x + 164, y + 50, 'template', 13, '#cbd5e1')
  + `<path d="M${x + 290} ${y + 68} H${x + 330} M${x + 320} ${y + 58} L${x + 332} ${y + 68} L${x + 320} ${y + 78}" fill="none" stroke="#a78bfa" stroke-width="3"/>`
  + [0, 1, 2].map((row) => box(x + 370, y + row * 46, 110, 36, '#2e1065', '#a78bfa') + `<path d="M${x + 480} ${y + 18 + row * 46} L${x + 540} ${y + 68}" stroke="#a78bfa" stroke-width="2"/>`).join('')
  + box(x + 540, y + 26, 100, 84, '#2e1065', '#a78bfa') + chip(x + 573, y + 61, '#c4b5fd') + text(x + 554, y + 50, 'template', 13, '#ede9fe');
const detailSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 440" role="img" aria-label="${title}"><rect width="720" height="440" rx="20" fill="#0f172a"/>`
  + text(42, 62, 'PLAN · DRAFT FOR REVIEW', 14, '#a78bfa', 800) + text(42, 112, title, 38, '#f8fafc', 700)
  + text(42, 148, 'A page should run its template\'s Method through the Bridge it', 17, '#cbd5e1') + text(42, 172, 'already has, and not carry a copy of it.', 17, '#cbd5e1')
  + picture(40, 230) + text(42, 410, 'Today: every page holds a copy.', 14, '#94a3b8') + text(410, 410, 'Goal: one Method, in the template.', 14, '#c4b5fd') + `</svg>`;
const summarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" role="img" aria-label="${title}"><rect width="520" height="320" rx="20" fill="#0f172a"/>`
  + text(32, 54, 'PLAN · DRAFT', 13, '#a78bfa', 800) + text(32, 98, title, 30, '#f8fafc', 700)
  + text(32, 136, 'A page runs its template\'s Method through', 16, '#cbd5e1') + text(32, 158, 'its Bridge. No copies, nothing to sync.', 16, '#cbd5e1')
  + text(32, 270, '5 phases · 9 actions · 3 open decisions · 3 risks', 14, '#94a3b8') + `</svg>`;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" role="img" aria-label="${title}"><rect width="320" height="220" rx="18" fill="#0f172a"/>`
  + box(40, 50, 90, 36, '#2e1065', '#a78bfa') + box(40, 134, 90, 36, '#2e1065', '#a78bfa') + `<path d="M130 68 L190 110 M130 152 L190 110" stroke="#a78bfa" stroke-width="3"/>` + box(190, 70, 90, 80, '#2e1065', '#a78bfa') + chip(218, 103, '#c4b5fd')
  + text(40, 204, 'One Method', 16, '#ede9fe', 700) + `</svg>`;
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
instructions.position = at(5, 0);
instructions.data.markdown = '# How to read this plan\n\nThis is a draft for review. Nothing in it has been started.\n\n'
  + '- The five **phases** run left to right. Each holds the **actions** beneath it.\n'
  + '- Phase 1 changes no app code. Phases 2 to 4 are the app work. Phase 5 is the only one that changes real graphs.\n'
  + '- Three **decisions** along the top are open and each carries a proposal. They are yours to make: when a page picks up a change, what it shows when its template cannot be loaded, and whether a page may keep its own Method.\n'
  + '- **Michael reviews the demo** is a gate: conversion does not begin until then.\n'
  + '- **Constraints** are things the work must not break. **Risks** each have a **contingency** below them.\n\n'
  + 'What was measured before writing this: 18 pages carry a copy of "Assemble the page" (the sixteen primitives, the Declaration Template and the Edge Class Page), kept identical by `npm run sync:page-method`, which only knows the Page Template and finds copies by the Method\'s name. A Bridge can already offer Scripts to a Script node when it grants "execute"; nothing offers a Method to a Handler.';

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
