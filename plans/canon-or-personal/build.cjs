// A sorting board, built from the Plan Template: one Decision card for each group of graphs in this library, in a
// column for where it is suggested to go. The facts on each card come from census.json (a count of the library made
// on the day the board was built). Change a card's decision, status and notes in the editor to sort it.
//   node plans/canon-or-personal/build.cjs
const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.join(__dirname, 'root.node');
const templateDir = path.resolve(__dirname, '../../templates/plan-template');
const template = JSON.parse(fs.readFileSync(path.join(templateDir, 'root.node'), 'utf8'));
const census = JSON.parse(fs.readFileSync(path.join(__dirname, 'census.json'), 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));

const prefix = 'canon-or-personal';
const graphId = `${prefix}-declaration`;
const nodeId = `${prefix}-plan`;
const graphRef = `github://mikemartinez1974/public/plans/${prefix}/root.node`;
const templateClassPrefix = 'github://mikemartinez1974/public/templates/plan-template/classes/';
const title = 'Canon or Personal';
const description = 'A sorting board for this library: which graphs are canon and move to the Twilite Zone library, which are personal and stay, and which are finished with.';
const now = '2026-10-10T22:00:00.000Z';
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

// --- The groups. `units` are census rows: an exact name, or a prefix ending in "/" that takes every row under it. -------------
const CANON = 'canon', PERSONAL = 'personal', RETIRE = 'retire', CALL = 'call';
const GROUPS = [
  // Suggested canon: brought to the current standard, and other canon graphs or the app depend on them.
  [CANON, 'page-template', 'Page Template', ['templates/page-template'], 'Move. Every page is built from it: the primitives, the core edge classes and three other templates bridge it.'],
  [CANON, 'declaration-template', 'Declaration Template', ['templates/declaration-template'], 'Move. It is the model for a new graph, and it hands on the Custom Declaration class.'],
  [CANON, 'node-templates', 'Node Template and Node Class Template', ['templates/node-template', 'templates/node-class-template'], 'Move. Both were rebuilt this month as the standard for a node and for a node class.'],
  [CANON, 'edge-class-template', 'Edge Class Template', ['templates/edge-class-template'], 'Move. The eight core edge classes are built from it, and it holds the Stroke class they use.'],
  [CANON, 'property-and-stroke', 'Property Template and Stroke Control', ['templates/property-template', 'templates/stroke-control'], 'Move. The Property class is used by every edge class and by the Node Class Template.'],
  [CANON, 'primitive-templates', 'The templates for single primitives', ['templates/bridge-template', 'templates/content-template', 'templates/glyph-template', 'templates/handle-template', 'templates/membrane-template', 'templates/method-template', 'templates/port-template', 'templates/portal-template', 'templates/view-template', 'templates/smoke-test-template'],
    'Move. One template per primitive, all on the current standard and all from this month.'],
  [CANON, 'core-edge-classes', 'Core edge classes', ['classes/edges'], 'Move. The app loads these to decide which edges are legal, so the app\'s own address for them changes with the move.'],
  [CANON, 'primitives', 'Primitives', ['primitives'], 'Move. The sixteen specifications, now pages. The Twilite Zone library already links to all sixteen. The index graph is still on old wiring and needs rebuilding as a page.'],
  [CANON, 'pages', 'Pages', ['pages/'], 'Move. The Edge Class Page and its summary and icon companions.'],
  [CANON, 'plan-template', 'Plan Template', ['templates/plan-template'], 'Move, after a refresh. Nine plans are built from it and it is on standard wiring, but it still has a Bridge per class and has not had the page treatment.'],

  // Needs your call: in use, but either old, or it is not clear whose it is.
  [CALL, 'idea-template', 'Idea Template', ['templates/idea-template'], 'Yours to call. Almost every idea graph is built from it, but half of its own graphs have no Surface. Canon if ideas are a Twilite feature; personal if they are your notebook.'],
  [CALL, 'topic-template', 'Topic Template and Topics', ['templates/topic-template', 'topics'], 'Yours to call. Standard wiring and in use by the eleven topic graphs. Are topics documentation for Twilite, or your own notes?'],
  [CALL, 'qa-template', 'Question-Driven Explanation Template and QA', ['templates/question-driven-explanation-template', 'qa'], 'Yours to call. The QA graphs are built from it; most of the template\'s own graphs have no Surface.'],
  [CALL, 'collection', 'Collection Template and its window controller', ['templates/collection-template', 'templates/collection-window-controller'], 'Yours to call. Old wiring, but widely used, including by the core edge classes\' index and the pages index. If it moves it needs rebuilding first.'],
  [CALL, 'arrival', 'Public Arrival Template and Getting Started', ['templates/public-arrival-template', 'getting-started'], 'Retire once the Twilite Zone root is rebuilt. The Page Template replaced it; the Twilite Zone root and the getting-started graphs are the last things built on it.'],
  [CALL, 'other-templates', 'Workboard, Wikipedia Article, Brainstorm and Event templates', ['templates/workboard-template', 'templates/wikipedia-article-template', 'templates/brainstorm-template', 'events/template', 'templates/(loose files)', 'templates/_support'], 'Yours to call. Older templates, each with a few graphs built from it. The Twilite Zone repo points at the Workboard one.'],
  [CALL, 'loose-classes', 'Loose node classes', ['classes/(loose files)'], 'Yours to call. Three class files outside any template, such as chat provenance.'],
  [CALL, 'plans', 'Plans', ['plans/'], 'Yours to call. Plans for Twilite itself, including this board and this week\'s two. The Twilite Zone repo has its own tasks and roadmaps folders; these may belong beside them, not in the library.'],
  [CALL, 'ideas', 'Ideas', ['ideas/'], 'Yours to call. About 75 idea graphs, most about Twilite\'s design. Same question as plans. The chemistry set (20 graphs) is content, not design.'],
  [CALL, 'tasks', 'Tasks', ['tasks/'], 'Yours to call. About 45 task graphs for Twilite work, many finished. The Twilite Zone repo already has 211 task graphs.'],
  [CALL, 'smokes', 'Smoke tests and loose graphs', ['graphs/(loose files)', 'graphs/cross-graph-focus-smoke', 'graphs/multi-declaration-expansion-smoke', 'graphs/script-capability-smoke', 'graphs/twilite-front-door-smoke', 'graphs/folder-contents'],
    'Yours to call. Test fixtures and one-off graphs. The app\'s tests read three of them and the Twilite Zone repo points at a few.'],

  // Suggested personal: your own content.
  [PERSONAL, 'people-orgs-works', 'People, Organizations, Works and Events', ['people', 'organizations', 'works', 'events/(loose files)'], 'Stay. Your own knowledge graph: 129 graphs that refer mostly to each other. The Twilite Zone repo points at a handful of them, which would need a look.'],
  [PERSONAL, 'lionel', 'Lionel', ['templates/lionel', 'graphs/observations-on-lionel'], 'Stay. Thirty graphs of your own material; the template is only used by it.'],
  [PERSONAL, 'personal-misc', 'Root, workboard, workspaces and the rest', ['(root files)', 'workboard', 'workspaces', 'intro-videos', 'secret', '4-27-2026', 'scripts'], 'Stay. Your library\'s own front page and a few single graphs.']
];

const rowsFor = (units) => census.filter((row) => units.some((unit) => unit.endsWith('/') ? row.name.startsWith(unit) : row.name === unit));
const used = new Set();
const cards = GROUPS.map(([column, id, label, units, suggestion]) => {
  const rows = rowsFor(units);
  rows.forEach((row) => used.add(row.name));
  const graphs = rows.reduce((sum, row) => sum + row.graphs, 0);
  const wiring = {};
  for (const row of rows) for (const [key, count] of Object.entries(row.wiring)) wiring[key] = (wiring[key] || 0) + count;
  const newest = rows.map((row) => row.newest).sort().pop() || '';
  const inside = new Set(rows.map((row) => row.name));
  const usedBy = {};
  for (const row of rows) for (const [user, count] of Object.entries(row.usedBy)) if (!inside.has(user)) usedBy[user] = (usedBy[user] || 0) + count;
  const name = (key) => ({ standard: 'on the standard Surface', none: 'with no Surface', legacy: 'on old wiring', 'legacy-glyph-only': 'on old wiring, showing only a glyph', 'no-declaration': 'with no Declaration', unreadable: 'unreadable' }[key] || key);
  const wiringText = Object.entries(wiring).sort((a, b) => b[1] - a[1]).map(([key, count]) => `${count} ${name(key)}`).join(', ');
  const outsiders = ['THE APP', 'TESTS', 'TWILITE ZONE'].filter((key) => usedBy[key]).map((key) => ({ 'THE APP': 'the app', TESTS: 'the app\'s tests', 'TWILITE ZONE': 'the Twilite Zone repo' }[key]));
  const others = Object.entries(usedBy).filter(([key]) => !['THE APP', 'TESTS', 'TWILITE ZONE'].includes(key)).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([key]) => key.replace('/(loose files)', ''));
  const facts = `${graphs} graph${graphs === 1 ? '' : 's'}${newest ? `, last changed ${newest.slice(0, 10)}` : ''}. ${wiringText ? `${wiringText[0].toUpperCase()}${wiringText.slice(1)}.` : ''}`
    + (outsiders.length ? ` Pointed at by ${outsiders.join(', ')}.` : '')
    + (others.length ? ` Used by: ${others.join(', ')}.` : ' Nothing else in this library uses it.');
  return { column, id, label, graphs, facts, suggestion, where: units.map((unit) => unit.replace('/(loose files)', ' (loose files)')).join(', ') };
});
const leftover = census.filter((row) => !used.has(row.name) && row.graphs);
if (leftover.length) throw new Error(`not on the board: ${leftover.map((row) => row.name).join(', ')}`);

// --- Layout: four columns, each headed by a phase card, to the right of the template's own nodes. ----------------------------
const declaration = graph.nodes.find((node) => node.id === graphId);
const origin = { x: declaration.position.x + 1100, y: declaration.position.y };
const COLUMNS = [
  [CANON, 'Suggested: canon', 'Moves to the Twilite Zone library. Brought to the current standard, and other canon graphs or the app depend on it.'],
  [CALL, 'Needs your call', 'In use, but old, or it is not clear whether it is Twilite\'s or yours. Each card says what the question is.'],
  [PERSONAL, 'Suggested: personal', 'Stays in this library. Your own content.'],
  [RETIRE, 'Finished with', 'Nothing is suggested here yet. Move a card here when you decide it should be archived or deleted.']
];
const makeNode = (type, id, label, position, text, extra = {}, size = [400, 260]) => {
  const node = replaceTemplateText(clone(exemplars.get(type)));
  node.id = `${prefix}-${id}`;
  node.label = label;
  node.position = position;
  [node.width, node.height] = size;
  node.data = { ...node.data, title: label, description: text, status: 'draft', ...extra };
  return node;
};
const contentNodes = [
  makeNode('plan', 'the-plan', 'Sort this library', { x: origin.x, y: origin.y },
    'Decide, group by group, what is canon and what is personal, before anything moves. Nothing on this board has been decided; every card carries a suggestion and the facts behind it.', {}, [400, 220]),
  makeNode('plan-goal', 'goal', 'Every group has a home', { x: origin.x + 480, y: origin.y },
    `${cards.reduce((sum, card) => sum + card.graphs, 0)} graphs in ${cards.length} groups. Canon moves to the Twilite Zone library; personal stays here; the rest is archived or deleted. When every card is decided, the move can be planned from the canon column alone.`, {}, [400, 220])
];
const columnX = (index) => origin.x + index * 480;
COLUMNS.forEach(([key, label, text], index) => {
  const inColumn = cards.filter((card) => card.column === key);
  contentNodes.push(makeNode('plan-phase', `column-${key}`, `${label} (${inColumn.reduce((sum, card) => sum + card.graphs, 0)} graphs)`, { x: columnX(index), y: origin.y + 300 }, text, {}, [400, 200]));
  inColumn.forEach((card, row) => {
    contentNodes.push(makeNode('plan-decision', `group-${card.id}`, card.label, { x: columnX(index), y: origin.y + 560 + row * 300 },
      `${card.facts}\n\nWhere: ${card.where}`, { decision: `Suggested: ${card.suggestion}`, notes: '' }));
  });
});
graph.nodes.push(...contentNodes);

const id = (suffix) => `${prefix}-${suffix}`;
const addEdge = (name, type, source, target, ports, stroke) => graph.edges.push({
  id: id(`edge-${name}`), type, label: type.replace('plan.', ''), source: id(source), target: id(target),
  sourcePort: ports[0], sourceHandle: ports[0], targetPort: ports[1], targetHandle: ports[1],
  style: { stroke, strokeWidth: 2, curved: true, dash: [] }, data: { semanticRole: type, presentation: { layer: 'semantic' } }
});
addEdge('goal', 'plan.achieves', 'the-plan', 'goal', ['goal', 'plan'], '#059669');
COLUMNS.forEach(([key]) => addEdge(`column-${key}`, 'plan.contains', 'the-plan', `column-${key}`, ['phases', 'parent'], '#334155'));
for (const node of contentNodes) {
  graph.edges.push({
    id: `${node.id}-instantiates`, type: 'reference', label: '', source: `${prefix}-class-bridge-${node.type}`, target: node.id,
    sourcePort: 'root', sourceHandle: 'root', targetPort: 'root', targetHandle: 'root', hidden: true,
    style: { stroke: '#64748b', strokeWidth: 1, opacity: 0.03 },
    data: { role: 'instantiates', semanticRole: 'instantiates', presentation: { layer: 'contract' } }
  });
}

graph.metadata = { ...graph.metadata, title, description, graphId, version: '0.1.0', created: now, modified: now,
  tags: ['plan', 'library', 'canon', 'sorting'], preferredViewer: 'https://dev.twilite.zone' };
declaration.label = title;
declaration.data.identity = { ...declaration.data.identity, graphId, nodeId, name: title, version: '0.1.0', description };
declaration.data.document = { url: graphRef };
declaration.data.dependencies = { ...(declaration.data.dependencies || {}), skills: ['plan-template'] };
const rootPort = graph.nodes.find((node) => node.id === `${prefix}-root-port`);
rootPort.label = title;
rootPort.data.title = title;
rootPort.data.summary = description;
rootPort.data.identity = { ...rootPort.data.identity, graphId, nodeId };

// The views: the four columns and how much is in each.
const text = (x, y, value, size, fill, weight = 400) => `<text x="${x}" y="${y}" fill="${fill}" font-family="system-ui,sans-serif" font-size="${size}" font-weight="${weight}">${value}</text>`;
const tally = COLUMNS.map(([key, label]) => { const inColumn = cards.filter((card) => card.column === key); return { label, groups: inColumn.length, graphs: inColumn.reduce((sum, card) => sum + card.graphs, 0) }; });
const colours = ['#a78bfa', '#fbbf24', '#38bdf8', '#94a3b8'];
const bars = (x, y, width) => tally.map((entry, index) => {
  const columnWidth = width / tally.length - 16;
  const left = x + index * (width / tally.length);
  return `<rect x="${left}" y="${y}" width="${columnWidth}" height="92" rx="10" fill="#1e293b" stroke="${colours[index]}" stroke-width="2"/>`
    + text(left + 14, y + 40, String(entry.graphs), 30, '#f8fafc', 700) + text(left + 14, y + 62, `graphs in ${entry.groups} group${entry.groups === 1 ? '' : 's'}`, 12, '#cbd5e1')
    + text(left + 14, y + 80, entry.label, 12, colours[index], 700);
}).join('');
const detailSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 440" role="img" aria-label="${title}"><rect width="720" height="440" rx="20" fill="#0f172a"/>`
  + text(42, 62, 'SORTING BOARD · NOTHING DECIDED YET', 14, '#a78bfa', 800) + text(42, 112, title, 38, '#f8fafc', 700)
  + text(42, 148, 'Which graphs in this library are canon and move to the Twilite Zone', 17, '#cbd5e1') + text(42, 172, 'library, which are yours and stay, and which are finished with.', 17, '#cbd5e1')
  + bars(42, 230, 652) + text(42, 392, 'Each card is one group of graphs, with the facts and a suggestion.', 14, '#94a3b8') + `</svg>`;
const summarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" role="img" aria-label="${title}"><rect width="520" height="320" rx="20" fill="#0f172a"/>`
  + text(32, 54, 'SORTING BOARD', 13, '#a78bfa', 800) + text(32, 98, title, 30, '#f8fafc', 700)
  + tally.map((entry, index) => text(32, 150 + index * 30, `${entry.graphs} graphs · ${entry.label}`, 16, colours[index], 600)).join('') + `</svg>`;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" role="img" aria-label="${title}"><rect width="320" height="220" rx="18" fill="#0f172a"/>`
  + colours.map((colour, index) => `<rect x="${40 + index * 62}" y="${50 + index * 12}" width="50" height="${110 - index * 24}" rx="8" fill="#1e293b" stroke="${colour}" stroke-width="3"/>`).join('')
  + text(40, 204, 'Canon or personal', 16, '#ede9fe', 700) + `</svg>`;
for (const [suffix, svg] of [['detail-view', detailSvg], ['summary-view', summarySvg], ['icon-view', iconSvg]]) {
  const view = graph.nodes.find((node) => node.id === `${prefix}-${suffix}`);
  view.label = `${title} ${suffix.replace('-view', '')}`;
  view.data.content = { kind: 'svg', value: svg };
  view.data.identity = { ...view.data.identity, graphId, nodeId };
}
const landing = graph.nodes.find((node) => node.id === `${prefix}-landing-content`);
landing.label = title;
landing.data.content = { kind: 'svg', value: detailSvg };
landing.data.identity = { ...landing.data.identity, graphId, nodeId };

const instructions = graph.nodes.find((node) => node.id === `${prefix}-instructions`);
instructions.label = 'How to use this board';
instructions.position = { x: origin.x + 960, y: origin.y };
instructions.data.markdown = '# How to use this board\n\nNothing here has been decided. Each card is one group of graphs from this library.\n\n'
  + '- **Description** holds the facts: how many graphs, when they last changed, whether they are on the standard Surface, and what points at them.\n'
  + '- **Decision** holds a suggestion and the reason for it. Replace it with your own: *canon*, *personal*, or *retire*.\n'
  + '- Set **status** to done when a card is settled, and use **notes** for anything that has to happen first.\n'
  + '- The four columns are only where a card starts. Drag a card to another column when you change your mind.\n\n'
  + '"Pointed at by the app" means the app or its tests name these graphs by address, so moving them means changing the app too. '
  + '"Pointed at by the Twilite Zone repo" means a graph over there already links to them.\n\n'
  + 'The facts come from a count of the library taken on 2026-10-10, saved beside this graph as `census.json`.';

for (const node of graph.nodes) if (node.data?.identity?.graphId) node.data.identity.graphId = graphId;
graph.settings = { ...graph.settings, snapToGrid: true, gridSize: 20, edgeRouting: 'orthogonal',
  layout: { mode: 'manual', defaultLayout: 'layered', direction: 'DOWN', edgeLaneGapPx: 20 } };
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
graph.timestamp = now;

fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
console.log(`wrote ${path.relative(process.cwd(), outputPath)}: ${graph.nodes.length} nodes, ${graph.edges.length} edges`);
for (const entry of tally) console.log(`  ${entry.label}: ${entry.groups} groups, ${entry.graphs} graphs`);
