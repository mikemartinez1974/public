// Builds this plan from the Plan Template, the same way plans/methods-through-the-bridge/build.cjs does.
//   node plans/canon-at-twilite-zone/build.cjs
const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.join(__dirname, 'root.node');
const templateDir = path.resolve(__dirname, '../../templates/plan-template');
const template = JSON.parse(fs.readFileSync(path.join(templateDir, 'root.node'), 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));

const prefix = 'canon-at-twilite-zone';
const graphId = `${prefix}-declaration`;
const nodeId = `${prefix}-plan`;
const graphRef = `github://mikemartinez1974/public/plans/${prefix}/root.node`;
const templateClassPrefix = 'github://mikemartinez1974/public/templates/plan-template/classes/';
const title = 'Canon at twilite.zone';
const description = 'Plan for giving official Twilite Zone graphs addresses of their own, tlz://twilite.zone/..., served by the site and not known by a GitHub address.';
const now = '2026-10-10T23:00:00.000Z';
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
  makeNode('plan', 'the-plan', 'Publish canon at twilite.zone', at(0, 0),
    'Official Twilite Zone graphs get addresses of their own, tlz://twilite.zone/..., and are served by the site. No canon graph is known by a GitHub address.'),
  makeNode('plan-goal', 'goal', 'Canon is known by its own address', at(1, 0),
    'A graph anywhere that uses a primitive, the Page Template or a core edge class names it as tlz://twilite.zone/... What answers that address can change later, from a static file to a server, without any graph changing.'),
  makeNode('plan-decision', 'decision-tlz', 'tlz:// means "this is a node graph"', at(2, 0),
    'A tlz link is opened by Twilite; an http link to the same file is the browser\'s and shows the JSON. tlz://host/path is fetched from https://host/path. It is for any host, not only twilite.zone.',
    { decision: 'Decided by Michael, 2026-10-10. tlz is bigger than one site and has to be.' }),
  makeNode('plan-decision', 'decision-host', 'Canon is published under twilite.zone', at(3, 0),
    'The host name is the part that gets written into every graph that uses canon.',
    { decision: 'Decided by Michael, 2026-10-10: twilite.zone.' }),
  makeNode('plan-decision', 'decision-alias', 'The dev site reads live canon', at(4, 0),
    'The dev site has no copy of canon of its own. It is built to read content from https://twilite.zone, the same published graphs the live site serves.',
    { decision: 'Decided by Michael, 2026-10-10: a site answers for canon only if it really has its own copy, and the dev site does not. So tlz://twilite.zone/... is fetched from twilite.zone wherever the app runs. A canon change is tried by opening it at its repository address before it is published.' }),
  makeNode('plan-decision', 'decision-form', 'One graph, however it is reached', at(5, 0),
    'tlz://twilite.zone/x and https://twilite.zone/x are the same file, and an author may also reach it as github://twilite-zone/public/x.',
    { decision: 'Decided by Michael, 2026-10-10: it should be the same file; for Twilite it is about getting the file, and the constraints are the web\'s. Graphs store the tlz form, and all three compare as the same graph.' }),
  makeNode('plan-decision', 'decision-publish', 'Saving is not publishing', at(6, 1),
    'Saving a graph puts it on disk or in a repository. Publishing puts it on the web. They were separate before Twilite and still are.',
    { decision: 'Decided by Michael, 2026-10-10. Canon is authored and saved in the Twilite Zone repo, and published to twilite.zone by the build. A canon graph is edited where it is saved, not where it is published.' }),

  makeNode('plan-phase', 'phase-address', '1. One meaning for an address', at(0, 1),
    'Before anything is published, the app reads a tlz address the same way everywhere and knows when two addresses are the same graph.'),
  makeNode('plan-phase', 'phase-serve', '2. One copy of the content', at(1, 1),
    'twilite.zone already serves the Twilite Zone repo\'s graphs, published by their own script. What is left is to remove the second, stale copy and make sure other sites may read the first.'),
  makeNode('plan-phase', 'phase-prove', '3. Prove it on a demo', at(2, 1),
    'One canon graph and one graph that uses it, by tlz address, before any real graph moves.'),
  makeNode('plan-phase', 'phase-move', '4. Move the first canon', at(3, 1),
    'The graphs Michael is sure of: the primitives, the Page Template they are built from, and the core edge classes the app itself loads.'),
  makeNode('plan-phase', 'phase-front', '5. A presentable front door', at(4, 1),
    'The Twilite Zone root is rebuilt as a page on top of canon, and the new templates are authored where they will live.'),

  makeNode('plan-action', 'action-parser', 'Read tlz addresses in one place', at(0, 2),
    'Measured today: tlz is parsed separately in the browser shell, twice in the editor and once in the node creator, and not at all by the shared loader that Bridges, the class registry and bridged Methods use. A Bridge to a tlz address would not load. One function turns an address into what to fetch.'),
  makeNode('plan-action', 'action-identity', 'Know when two addresses are one graph', at(0, 3),
    'The workspace pairs an import with an export, and the cache and class records recognise a graph, by comparing addresses as text. Give every address a canonical form, so a graph opened by its GitHub address for editing is the same graph as its tlz address.'),
  makeNode('plan-action', 'action-publish', 'Publishing already exists: use it', at(1, 2),
    'Measured: nginx on the server serves .node files straight from a checkout of the Twilite Zone repo, and scripts/publish-graphs.ps1 pushes the repo and fast-forwards that checkout. It refuses uncommitted changes and verifies the result over HTTPS. Nothing new to build; canon is published the way graphs already are.'),
  makeNode('plan-action', 'action-answer', 'Retire the app\'s bundled copy of the content', at(1, 3),
    'The app repository carries 613 content files in its public folder: an old hand-made copy. The server falls back to it when the content checkout lacks a file, and the dev site serves it at its own paths. It is why root.node on the dev site is a different graph (July) from the published one (September). Remove it, or cut it down to what the app cannot start without.'),
  makeNode('plan-action', 'action-cors', 'Confirm other sites may read canon', at(1, 4),
    'The dev site reads canon from twilite.zone across origins, so the content server has to send cross-origin headers. An older script set them; the routing file kept in the app repository does not. Check what the server sends today and make the repository copy match it.'),
  makeNode('plan-action', 'action-demo', 'Build a canon demo and a graph that uses it', at(2, 2),
    'A copy of one primitive published at a tlz://twilite.zone/ address, and a graph in the personal library that bridges it by that address. Each with its own identity.'),
  makeNode('plan-action', 'action-checks', 'Write the checks that must pass', at(2, 3),
    'Written first and failing: the Bridge loads through the tlz address; the create menu, a bridged Method and the workspace connection all work through it; the same graph opened by its GitHub address is recognised as the same graph; a GitHub address elsewhere still works.'),
  makeNode('plan-action', 'action-first', 'Move the primitives, the Page Template and the core edge classes', at(3, 2),
    'Copied to the Twilite Zone repo under library, with every address inside them rewritten to the tlz form, and checked: every Bridge resolves, every page assembles to the same result, every edge class derives unchanged. The primitives index becomes a page.'),
  makeNode('plan-action', 'action-app', 'Point the app at canon', at(3, 3),
    'The app loads the core edge classes from the personal library today. Its default becomes the canon address, and the tests follow.'),
  makeNode('plan-action', 'action-examples', 'Settle the primitives\' examples', at(3, 4),
    'Their example links point at the Declaration Template, a smoke test and a task graph in the personal library. Each is moved with them, replaced, or dropped, so that a canon page does not link to a personal GitHub address.'),
  makeNode('plan-action', 'action-root', 'Rebuild the Twilite Zone root as a page', at(4, 2),
    'It was built in September from the Public Arrival Template, with a Bridge per class into the personal library. Rebuilt from the Page Template at its canon address.'),
  makeNode('plan-action', 'action-templates', 'Author the new templates in place', at(4, 3),
    'The old templates are not moved. The first set is made new, at canon addresses, so none ever carries a GitHub address, and is what a new user sees first.'),
  makeNode('plan-action', 'action-guidance', 'Record the rule for agents', at(4, 4),
    'AGENTS.md says what tlz means, what a canon address looks like, and that nothing official is addressed by GitHub.'),

  makeNode('plan-milestone', 'milestone-demo', 'A graph uses canon by its tlz address', at(5, 1),
    'On the demo: a Bridge to tlz://twilite.zone/... loads, creates nodes, runs the template\'s Method and draws its connection; the dev site serves it from its own copy.'),
  makeNode('plan-decision', 'decision-review', 'Michael reviews the demo', at(5, 2),
    'Nothing real moves until the demo has been tried in the app.',
    { decision: 'Open. Go ahead with the move, adjust the design, or stop.' }),
  makeNode('plan-milestone', 'milestone-done', 'No canon graph has a GitHub address', at(5, 3),
    'The primitives, the Page Template and the core edge classes are known as tlz://twilite.zone/..., and the root that presents them is a page.'),

  makeNode('plan-constraint', 'constraint-github', 'GitHub addresses keep working', at(0, 5),
    'A graph hosted on GitHub, including the whole personal library, loads and saves exactly as it does now.'),
  makeNode('plan-constraint', 'constraint-dev', 'A stored address never names the dev site', at(1, 5),
    'Canon is tlz://twilite.zone/... wherever it was authored or tested. dev.twilite.zone appears in no graph.'),
  makeNode('plan-constraint', 'constraint-copy', 'Nothing is copied by hand', at(2, 5),
    'One source, the Twilite Zone repo, published by its script. No second copy of the content is kept in the app.'),
  makeNode('plan-constraint', 'constraint-sorted', 'Only what is sorted moves', at(3, 5),
    'The sorting board decides what is canon. Until a group is decided there it stays where it is.'),

  makeNode('plan-risk', 'risk-save', 'An author edits the published copy by mistake', at(0, 6),
    'A graph reached at tlz://twilite.zone/... is the published copy. It has no repository to save to, and an edit made there is lost.'),
  makeNode('plan-risk', 'risk-old', 'Graphs still point at the old addresses', at(2, 6),
    '472 graphs in the personal library name an address in it, and many use the templates that are moving. After the move those addresses no longer have the graph.'),
  makeNode('plan-risk', 'risk-order', 'Moved graphs reach an app that cannot read them', at(4, 6),
    'A Bridge to a tlz address does not load on a build without phase 1.'),
  makeNode('plan-contingency', 'contingency-author', 'The published copy says where it is edited', at(1, 6),
    'A canon graph opened by its tlz address is read-only and offers "edit this", which reopens it by its repository address for someone with write access. Its stored address stays the tlz one, and the change reaches the web when it is published.'),
  makeNode('plan-contingency', 'contingency-forward', 'Old addresses forward to the new ones', at(3, 6),
    'The loader keeps a short table of moved graphs and follows it, so nothing in the personal library has to be rewritten at once. Graphs are rewritten as they are reauthored.'),
  makeNode('plan-contingency', 'contingency-deploy', 'Deploy the app before publishing the move', at(5, 6),
    'The move is published only after the build that reads tlz addresses is live.')
];
// Where the work stands. Anything not listed is still a draft, not started.
const statuses = { 'decision-tlz': 'done', 'decision-host': 'done', 'decision-publish': 'done', 'decision-alias': 'done', 'decision-form': 'done', 'action-publish': 'done',
  'the-plan': 'in-progress', 'phase-address': 'done', 'action-parser': 'done', 'action-identity': 'done', 'constraint-github': 'done',
  'phase-serve': 'in-progress', 'action-cors': 'done', 'phase-prove': 'done', 'action-demo': 'done', 'action-checks': 'done', 'milestone-demo': 'done', 'decision-review': 'done',
  'phase-move': 'in-progress', 'action-first': 'done', 'action-app': 'done', 'constraint-dev': 'done', 'constraint-copy': 'done', 'constraint-sorted': 'done', 'contingency-forward': 'done',
  'risk-order': 'in-progress', 'contingency-deploy': 'in-progress' };
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
const phases = ['address', 'serve', 'prove', 'move', 'front'];
phases.forEach((phase) => addEdge(`plan-${phase}`, 'plan.contains', 'the-plan', `phase-${phase}`, ['phases', 'parent']));
phases.slice(1).forEach((phase, index) => addEdge(`phase-${index + 1}-${index + 2}`, 'plan.precedes', `phase-${phases[index]}`, `phase-${phase}`));
const phaseActions = { address: ['parser', 'identity'], serve: ['publish', 'answer', 'cors'], prove: ['demo', 'checks'], move: ['first', 'app', 'examples'], front: ['root', 'templates', 'guidance'] };
for (const [phase, actions] of Object.entries(phaseActions)) {
  for (const action of actions) addEdge(`${phase}-${action}`, 'plan.contains', `phase-${phase}`, `action-${action}`, ['actions', 'parent']);
}
addEdge('demo-milestone', 'plan.produces', 'action-checks', 'milestone-demo');
addEdge('review-gate', 'plan.gates', 'milestone-demo', 'decision-review');
addEdge('done-milestone', 'plan.produces', 'action-root', 'milestone-done');
addEdge('github', 'plan.constrained-by', 'action-parser', 'constraint-github');
addEdge('dev', 'plan.constrained-by', 'action-answer', 'constraint-dev');
addEdge('copy', 'plan.constrained-by', 'action-publish', 'constraint-copy');
addEdge('sorted', 'plan.constrained-by', 'action-first', 'constraint-sorted');
addEdge('save', 'plan.threatened-by', 'action-identity', 'risk-save');
addEdge('old', 'plan.threatened-by', 'action-first', 'risk-old');
addEdge('order', 'plan.threatened-by', 'action-first', 'risk-order');
addEdge('author', 'plan.mitigated-by', 'risk-save', 'contingency-author');
addEdge('forward', 'plan.mitigated-by', 'risk-old', 'contingency-forward');
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
  tags: ['plan', 'addresses', 'canon', 'hosting'], preferredViewer: 'https://dev.twilite.zone' };
declaration.label = `${title} Plan`;
declaration.data.identity = { ...declaration.data.identity, graphId, nodeId, name: title, version: '0.1.0', description };
declaration.data.document = { url: graphRef };
declaration.data.dependencies = { ...(declaration.data.dependencies || {}), skills: ['plan-template'] };

const rootPort = graph.nodes.find((node) => node.id === `${prefix}-root-port`);
rootPort.label = `${title} Plan`;
rootPort.data.title = title;
rootPort.data.summary = description;
rootPort.data.identity = { ...rootPort.data.identity, graphId, nodeId };

// The views draw the idea: one address, and what answers it can change.
const text = (x, y, value, size, fill, weight = 400) => `<text x="${x}" y="${y}" fill="${fill}" font-family="system-ui,sans-serif" font-size="${size}" font-weight="${weight}">${value}</text>`;
const box = (x, y, w, h, fill, stroke) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const picture = (x, y) => box(x, y + 20, 150, 96, '#1e293b', '#64748b') + text(x + 16, y + 60, 'a graph that', 13, '#cbd5e1') + text(x + 16, y + 80, 'uses canon', 13, '#cbd5e1')
  + `<path d="M${x + 150} ${y + 68} H${x + 232}" stroke="#a78bfa" stroke-width="3"/>`
  + box(x + 232, y + 44, 230, 48, '#2e1065', '#a78bfa') + text(x + 246, y + 74, 'tlz://twilite.zone/library/…', 15, '#ede9fe', 700)
  + `<path d="M${x + 462} ${y + 68} H${x + 520}" stroke="#a78bfa" stroke-width="3" stroke-dasharray="6 5"/>`
  + box(x + 520, y, 124, 40, '#1e293b', '#64748b') + text(x + 534, y + 25, 'a static file', 13, '#cbd5e1')
  + box(x + 520, y + 48, 124, 40, '#1e293b', '#64748b') + text(x + 534, y + 73, 'a server', 13, '#cbd5e1')
  + box(x + 520, y + 96, 124, 40, '#1e293b', '#64748b') + text(x + 534, y + 121, 'a desktop copy', 13, '#cbd5e1');
const detailSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 440" role="img" aria-label="${title}"><rect width="720" height="440" rx="20" fill="#0f172a"/>`
  + text(42, 62, 'PLAN · DRAFT FOR REVIEW', 14, '#a78bfa', 800) + text(42, 112, title, 38, '#f8fafc', 700)
  + text(42, 148, 'Official graphs are known by an address of their own, not by where', 17, '#cbd5e1') + text(42, 172, 'they happen to be hosted. What answers that address can change.', 17, '#cbd5e1')
  + picture(40, 220) + text(42, 410, 'The address is written into graphs. The hosting is not.', 14, '#c4b5fd') + `</svg>`;
const summarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" role="img" aria-label="${title}"><rect width="520" height="320" rx="20" fill="#0f172a"/>`
  + text(32, 54, 'PLAN · DRAFT', 13, '#a78bfa', 800) + text(32, 98, title, 30, '#f8fafc', 700)
  + text(32, 136, 'Canon is addressed as tlz://twilite.zone/…', 16, '#cbd5e1') + text(32, 158, 'and served by the site, not by GitHub.', 16, '#cbd5e1')
  + text(32, 270, '5 phases · 13 actions · 5 decisions made · 3 risks', 14, '#94a3b8') + `</svg>`;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" role="img" aria-label="${title}"><rect width="320" height="220" rx="18" fill="#0f172a"/>`
  + box(40, 80, 240, 56, '#2e1065', '#a78bfa') + text(58, 115, 'tlz://twilite.zone', 22, '#ede9fe', 700)
  + text(40, 196, 'Canon', 16, '#ede9fe', 700) + `</svg>`;
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
instructions.position = at(6, 0);
instructions.height = Math.min(instructions.height || 320, 320);
instructions.data.markdown = '# How to read this plan\n\nThis is a draft for review. Nothing in it has been started.\n\n'
  + '- The five **phases** run left to right. Each holds the **actions** beneath it.\n'
  + '- Phases 1 and 2 are app and site work and change no graph. Phase 4 is the first that moves real graphs.\n'
  + '- All five **decisions** along the top are made: what tlz means, the host name, that saving is not publishing, that the dev site reads live canon, and that a graph is one graph however it is reached.\n'
  + '- **Michael reviews the demo** is a gate: nothing real moves until then.\n'
  + '- **Constraints** are things the work must not break. **Risks** each have a **contingency** beside them.\n\n'
  + 'This plan covers how canon is addressed and served. What is canon is decided on the sorting board, `plans/canon-or-personal`, and only what is decided there moves.\n\n'
  + 'What was measured before writing this: the app accepts github://, https://, a site path, local:// and tlz:// as graph addresses, but tlz is parsed in four separate places and not by the shared loader, so a Bridge to a tlz address would not load today. Graphs are already published: nginx serves them from a checkout of the Twilite Zone repo, updated by scripts/publish-graphs.ps1, and the dev site is built to read that live content. The app\'s public folder still holds an old hand-made copy (613 files; 86 under library differ from the repo), which is what the dev site serves at its own paths. The app loads the core edge classes from the personal library.';

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
