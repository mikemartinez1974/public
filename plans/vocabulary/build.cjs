// Builds this plan from the Plan Template, the same way plans/whats-next/build.cjs does.
//   node plans/vocabulary/build.cjs
// To record progress, change `statuses` below and run it again.
const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.join(__dirname, 'root.node');
const templateDir = path.resolve(__dirname, '../../templates/plan-template');
const template = JSON.parse(fs.readFileSync(path.join(templateDir, 'root.node'), 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));

const prefix = 'vocabulary';
const graphId = `${prefix}-declaration`;
const nodeId = `${prefix}-plan`;
const graphRef = `github://mikemartinez1974/public/plans/${prefix}/root.node`;
const templateClassPrefix = 'github://mikemartinez1974/public/templates/plan-template/classes/';
const title = 'Twilite’s vocabulary, in layers';
const description = 'Twilite has about thirty words of its own. Every reader meets all of them at once, several pairs collide, and some name the machinery rather than what it is for. This plan sorts them into three layers and settles the collisions, without renaming anything stored in a file.';
const now = '2026-10-13T18:00:00.000Z';
const replaceTemplateText = (value) => {
  if (Array.isArray(value)) return value.map(replaceTemplateText);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, replaceTemplateText(entry)]));
  if (typeof value !== 'string') return value;
  if (value.startsWith(templateClassPrefix)) return value;
  return value
    .replaceAll('github://mikemartinez1974/public/templates/plan-template/root.node', graphRef)
    .replaceAll('plan-template', prefix)
    .replaceAll('Plan Template', `${title} Plan`);
};

const graph = replaceTemplateText(clone(template));
const semanticTypes = new Set(['plan', 'plan-goal', 'plan-phase', 'plan-action', 'plan-milestone', 'plan-decision', 'plan-constraint', 'plan-risk', 'plan-contingency']);
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
  makeNode('plan', 'the-plan', 'Twilite’s vocabulary, in layers', at(0, 0),
    'Sort Twilite’s own words into three layers, so each reader meets only the words their work needs, and settle the pairs of words that collide.'),
  makeNode('plan-goal', 'goal', 'A visitor reads Twilite with five words', at(1, 0),
    'Graph, node, edge, page and Portal are enough to read anything in the Twilite Zone. Every further word arrives when the work calls for it, introduced by what it does.'),

  // What is decided.
  makeNode('plan-decision', 'decision-layers', 'Three layers: reading, making, building', at(2, 0),
    'Reading: graph, node, edge, page, Portal. Making your own graph: content, link, scene, ground, and how a graph looks from far away (Detail, Summary, Icon, Glyph). Building templates and classes: Declaration, Surface, Port, Bridge, Property, Edge Class, Method, Event Handler, Script, Membrane, Specification.',
    { decision: 'Agreed by Michael, 2026-10-13, “directionally”. The exact list in each layer is worked out in this plan.' }),
  makeNode('plan-decision', 'decision-stored', 'No stored name changes', at(3, 0),
    'The type names in .node files and in the app’s code stay as they are. Only what a person reads changes: labels, menus, pages and tutorials. Renaming stored types would touch every graph in both libraries for nothing a reader can see.',
    { decision: 'Agreed by Michael, 2026-10-13.' }),
  makeNode('plan-decision', 'decision-property', 'Property, not Field', at(4, 0),
    'The word is Property. A Property is made from the Field primitive, and the two serve the same purpose, so a reader needs only one word; the events a Property announces stay as they are.',
    { decision: 'Decided by Michael, 2026-10-13: “We keep property … Let’s go with property and keep the events.”' }),
  makeNode('plan-decision', 'decision-ground', 'Ground, not landing surface, for readers', at(5, 0),
    'What a visitor stands on inside a graph is its ground. “Landing surface” stays the name of the relationship for people building templates. It also stops “landing surface” sounding like a kind of Surface, which it is not.',
    { decision: 'Recommended by Claude and accepted by Michael, 2026-10-13.' }),
  makeNode('plan-decision', 'decision-portal', 'A Portal is a door; Port waits for layer three', at(6, 0),
    'Portal and Port look alike and do different jobs. A Portal is always explained by what it does, a door to another graph. Port is only introduced to people building templates.',
    { decision: 'Recommended by Claude and accepted by Michael, 2026-10-13.' }),
  makeNode('plan-decision', 'decision-specification', 'Specification is “the page that defines a primitive”', at(7, 0),
    'A newcomer cannot tell Declaration and Specification apart by their names. Declaration keeps its name. Wherever Specification appears it is described by what it is: the page that defines a primitive.',
    { decision: 'Recommended by Claude and accepted by Michael, 2026-10-13.' }),

  // What is still open.
  makeNode('plan-decision', 'decision-root', 'Should the Declaration read as the graph’s root?', at(8, 1),
    'Michael’s idea: a reader might understand the Declaration better as the graph’s root. Only the word a reader sees would change, not the system.',
    { decision: 'Open. Michael, 2026-10-13: “I don’t want to reengineer the system because of an idea.”' }),
  makeNode('plan-decision', 'decision-distinctive', 'Which strange words to keep for being strange', at(8, 2),
    'Membrane and Bridge are unusual words. A distinctive word that is introduced well can be an asset; one that is never explained is a wall.',
    { decision: 'Open.' }),
  makeNode('plan-decision', 'decision-faces', 'One phrase for “how a graph looks from far away”', at(8, 3),
    'Surface, View, Detail, Summary, Icon and Glyph all belong to one idea: the faces a graph shows from outside, getting smaller with distance. Making your own graph needs that idea in one phrase, not six words.',
    { decision: 'Open.' }),

  // The work, in order.
  makeNode('plan-phase', 'phase-inventory', '1. Find every word where it is used', at(0, 1),
    'Every term, and every place a reader meets it: the app’s menus and panels, the canon pages, the tutorials, and the guides written for AI.'),
  makeNode('plan-phase', 'phase-wording', '2. Propose the wording', at(1, 1),
    'For each layer, the words and one line each. For each collision, the exact sentences that settle it. Michael approves before anything is written.'),
  makeNode('plan-phase', 'phase-canon', '3. Canon follows', at(2, 1),
    'The primitives index grouped by layer, a glossary in canon, and the pages whose wording changes.'),
  makeNode('plan-phase', 'phase-app', '4. The app follows', at(3, 1),
    'The words people read in the app follow the layers: a person browsing sees layer one, a person making a graph layer two, the template builder everything.'),
  makeNode('plan-phase', 'phase-tutorials', '5. The tutorials are written in it', at(4, 1),
    'The tutorials in the What’s next plan introduce words in layer order.'),

  makeNode('plan-action', 'action-inventory-app', 'The app’s words', at(0, 2),
    'Menus, panels, buttons, the create menu and messages: every Twilite term a person can read in the app, and where.'),
  makeNode('plan-action', 'action-inventory-canon', 'Canon’s words', at(0, 3),
    'Every term on the canon pages: the primitives, the edge classes, the navigation scheme, the Page Template.'),
  makeNode('plan-action', 'action-inventory-ai', 'The words AI is taught', at(0, 4),
    'OnboardLLM.md and AGENTS.md teach other models the vocabulary. They must say the same as canon, and show which stored name each reading word stands for.'),

  makeNode('plan-action', 'action-layers', 'The three lists', at(1, 2),
    'The words in each layer, with one line each saying what the thing is for.'),
  makeNode('plan-action', 'action-collisions', 'The collisions, in sentences', at(1, 3),
    'Port and Portal; Surface and ground; Field and Property; Declaration and Specification. The exact text for each.'),
  makeNode('plan-action', 'action-open', 'Settle the open questions', at(1, 4),
    'The Declaration as root, the distinctive words, and one phrase for a graph’s faces.'),

  makeNode('plan-action', 'action-glossary', 'A glossary in canon', at(2, 2),
    'One page, in three layers, giving each reading word and the stored name it stands for.'),
  makeNode('plan-action', 'action-index', 'The primitives index by layer', at(2, 3),
    'The index scene regrouped so the template builder’s words are clearly the third layer, not the first thing a visitor sees.'),
  makeNode('plan-action', 'action-pages', 'The pages whose words change', at(2, 4),
    'The Field page reads as Property; pages that say “landing surface” to a reader say “ground”; Specification described by what it is.'),

  makeNode('plan-action', 'action-labels', 'Labels and menus', at(3, 2),
    'The names the app shows for node types and relationships, mapped from stored names to reading words in one place.'),
  makeNode('plan-action', 'action-create', 'The create menu by layer', at(3, 3),
    'Making a graph offers layer-two things first; the template builder’s parts are a step further in.'),

  makeNode('plan-milestone', 'milestone-wording', 'The wording is approved', at(1, 5),
    'Michael has approved the three lists and the sentences that settle each collision.'),
  makeNode('plan-milestone', 'milestone-done', 'Readers meet five words', at(4, 2),
    'A visitor reading the Twilite Zone meets graph, node, edge, page and Portal, and nothing else unless they go looking.'),

  makeNode('plan-constraint', 'constraint-approval', 'Canon wording is proposed first', at(6, 2),
    'Statements in canon are shown to Michael as wording and written only after his yes.'),
  makeNode('plan-constraint', 'constraint-stored', 'Stored names stay', at(6, 3),
    'No type key, field name or file address changes as part of this plan.'),
  makeNode('plan-risk', 'risk-two-names', 'Two names for one thing', at(6, 4),
    'If a reader sees “ground” and a file says landing-surface, or the app says Property and a file says field, the two can be confused, by people and by AI reading the files.'),
  makeNode('plan-contingency', 'contingency-map', 'One map from reading word to stored name', at(7, 4),
    'The glossary, the app’s label table and the AI guides all carry the same map, so whoever reads a file can find the word they know.')
];

// Where the work stands. Anything not listed is still a draft, not started. Change this and run the build again.
const statuses = {
  'the-plan': 'in-progress',
  'decision-layers': 'done', 'decision-stored': 'done', 'decision-property': 'done', 'decision-ground': 'done',
  'decision-portal': 'done', 'decision-specification': 'done'
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
const known = new Set(contentNodes.map((node) => node.id));
const addEdge = (name, type, source, target, ports = edgePorts[type]) => {
  if (!known.has(id(source)) || !known.has(id(target))) throw new Error(`edge ${name}: ${source} or ${target} is not a node of this plan`);
  graph.edges.push({
    id: id(`edge-${name}`), type, label: type.replace('plan.', '').replaceAll('-', ' '), source: id(source), target: id(target),
    sourcePort: ports[0], sourceHandle: ports[0], targetPort: ports[1], targetHandle: ports[1],
    style: { ...edgeStyle[type], curved: true, dash: edgeStyle[type]?.dash || [] },
    data: { semanticRole: type, presentation: { layer: 'semantic' } }
  });
};

addEdge('goal', 'plan.achieves', 'the-plan', 'goal');
const phases = ['inventory', 'wording', 'canon', 'app', 'tutorials'];
phases.forEach((phase) => addEdge(`plan-${phase}`, 'plan.contains', 'the-plan', `phase-${phase}`, ['phases', 'parent']));
phases.slice(1).forEach((phase, index) => addEdge(`phase-${index + 1}-${index + 2}`, 'plan.precedes', `phase-${phases[index]}`, `phase-${phase}`));
const phaseActions = {
  inventory: ['inventory-app', 'inventory-canon', 'inventory-ai'], wording: ['layers', 'collisions', 'open'],
  canon: ['glossary', 'index', 'pages'], app: ['labels', 'create']
};
for (const [phase, actions] of Object.entries(phaseActions)) {
  for (const action of actions) addEdge(`${phase}-${action}`, 'plan.contains', `phase-${phase}`, `action-${action}`, ['actions', 'parent']);
}
addEdge('wording-milestone', 'plan.produces', 'action-open', 'milestone-wording');
['root', 'distinctive', 'faces'].forEach((question) => addEdge(`question-${question}`, 'plan.gates', 'milestone-wording', `decision-${question}`));
addEdge('done-milestone', 'plan.produces', 'action-create', 'milestone-done');
addEdge('approval', 'plan.constrained-by', 'action-collisions', 'constraint-approval');
addEdge('stored', 'plan.constrained-by', 'action-labels', 'constraint-stored');
addEdge('two-names', 'plan.threatened-by', 'action-pages', 'risk-two-names');
addEdge('map', 'plan.mitigated-by', 'risk-two-names', 'contingency-map');

for (const node of contentNodes) {
  graph.edges.push({
    id: `${node.id}-instantiates`, type: 'reference', label: '', source: `${prefix}-class-bridge-${node.type}`, target: node.id,
    sourcePort: 'root', sourceHandle: 'root', targetPort: 'root', targetHandle: 'root', hidden: true,
    style: { stroke: '#64748b', strokeWidth: 1, opacity: 0.03 },
    data: { role: 'instantiates', semanticRole: 'instantiates', presentation: { layer: 'contract' } }
  });
}

graph.metadata = { ...graph.metadata, title, description, graphId, version: '0.1.0', created: now, modified: now,
  tags: ['plan', 'vocabulary', 'twilite-zone'], preferredViewer: 'https://dev.twilite.zone' };
declaration.label = `${title} Plan`;
declaration.data.identity = { ...declaration.data.identity, graphId, nodeId, name: title, version: '0.1.0', description };
declaration.data.document = { url: graphRef };
declaration.data.dependencies = { ...(declaration.data.dependencies || {}), skills: ['plan-template'] };

const rootPort = graph.nodes.find((node) => node.id === `${prefix}-root-port`);
rootPort.label = `${title} Plan`;
rootPort.data.title = title;
rootPort.data.summary = description;
rootPort.data.identity = { ...rootPort.data.identity, graphId, nodeId };

// The views draw the three layers, widest at the bottom.
const count = (type) => contentNodes.filter((node) => node.type === type).length;
const done = contentNodes.filter((node) => node.data.status === 'done').length;
const text = (x, y, value, size, fill, weight = 400) => `<text x="${x}" y="${y}" fill="${fill}" font-family="system-ui,sans-serif" font-size="${size}" font-weight="${weight}">${value}</text>`;
const layers = [['Reading', 'graph · node · edge · page · Portal', 260], ['Making', '+ content · link · scene · ground · faces', 420], ['Building', '+ the template builder’s eleven words', 600]];
const stack = (x, y) => layers.map(([name, words, width], index) => {
  const top = y + index * 62, left = x + (600 - width) / 2;
  return `<rect x="${left}" y="${top}" width="${width}" height="52" rx="10" fill="${index ? '#1e293b' : '#2e1065'}" stroke="${index ? '#64748b' : '#a78bfa'}" stroke-width="2"/>`
    + text(left + 14, top + 22, name.toUpperCase(), 12, index ? '#94a3b8' : '#c4b5fd', 800) + text(left + 14, top + 41, words, 13, index ? '#cbd5e1' : '#ede9fe');
}).join('');
const detailSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 440" role="img" aria-label="${title}"><rect width="720" height="440" rx="20" fill="#0f172a"/>`
  + text(42, 62, 'PLAN · IN PROGRESS', 14, '#a78bfa', 800) + text(42, 108, 'Twilite’s vocabulary, in layers', 34, '#f8fafc', 700)
  + text(42, 142, 'Each reader meets only the words their work needs.', 17, '#cbd5e1')
  + stack(60, 182) + text(42, 410, `${count('plan-phase')} phases · ${count('plan-action')} actions · ${count('plan-decision')} decisions · ${done} done`, 14, '#94a3b8') + `</svg>`;
const summarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" role="img" aria-label="${title}"><rect width="520" height="320" rx="20" fill="#0f172a"/>`
  + text(32, 54, 'PLAN · IN PROGRESS', 13, '#a78bfa', 800) + text(32, 96, 'Vocabulary, in layers', 30, '#f8fafc', 700)
  + text(32, 134, 'Reading, making, building: five words to', 16, '#cbd5e1') + text(32, 156, 'read, more as the work calls for them.', 16, '#cbd5e1')
  + text(32, 270, `${count('plan-phase')} phases · ${count('plan-action')} actions · ${done} done`, 14, '#94a3b8') + `</svg>`;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" role="img" aria-label="${title}"><rect width="320" height="220" rx="18" fill="#0f172a"/>`
  + `<rect x="110" y="40" width="100" height="34" rx="8" fill="#2e1065" stroke="#a78bfa" stroke-width="3"/><rect x="80" y="84" width="160" height="34" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="3"/><rect x="50" y="128" width="220" height="34" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="3"/>`
  + text(40, 200, 'Words', 16, '#ede9fe', 700) + `</svg>`;
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
instructions.position = at(9, 0);
instructions.height = Math.min(instructions.height || 320, 320);
instructions.data.markdown = '# How to read this plan\n\n'
  + '- The five numbered **phases** run left to right and are done in that order. Each holds the **actions** beneath it.\n'
  + '- The **decisions** along the top are made. The three in the right-hand column are still open.\n'
  + '- **The wording is approved** is the gate before canon and the app change anything.\n'
  + '- **Constraints** are how the work is done. The **risk** has its **contingency** beside it.\n\n'
  + 'Status is kept in `plans/vocabulary/build.cjs`, in the `statuses` list. Change it there and run `node plans/vocabulary/build.cjs`.';

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
