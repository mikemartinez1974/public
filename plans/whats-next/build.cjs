// Builds this plan from the Plan Template, the same way plans/canon-at-twilite-zone/build.cjs does.
//   node plans/whats-next/build.cjs
// To record progress, change `statuses` below and run it again.
const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.join(__dirname, 'root.node');
const templateDir = path.resolve(__dirname, '../../templates/plan-template');
const template = JSON.parse(fs.readFileSync(path.join(templateDir, 'root.node'), 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));

const prefix = 'whats-next';
const graphId = `${prefix}-declaration`;
const nodeId = `${prefix}-plan`;
const graphRef = `github://mikemartinez1974/public/plans/${prefix}/root.node`;
const templateClassPrefix = 'github://mikemartinez1974/public/templates/plan-template/classes/';
const title = 'What’s next';
const description = 'The work in front of us after the new Twilite Zone root: the rooms behind it, how a person moves between them, and what is carried until later.';
const now = '2026-10-12T18:00:00.000Z';
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
  const role = String(edge.type || '').trim();
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
  makeNode('plan', 'the-plan', 'Make the Twilite Zone walkable', at(0, 0),
    'The root is new and so are its two indexes. Next: the rooms it leads to, a settled way of moving between graphs, and the places behind those rooms.'),
  makeNode('plan-goal', 'goal', 'Every way in from the root leads somewhere current', at(1, 0),
    'A visitor who starts at tlz://twilite.zone/root.node can go through any Portal, find a graph built the way we now build them, and get back without the graph having to provide the way.'),
  makeNode('plan-decision', 'decision-scene', 'A graph is a scene by default', at(2, 0),
    'Its nodes are placed by hand and its edges are drawn. A document is the special case: it hides its pieces and shows a page assembled from them.',
    { decision: 'Decided by Michael, 2026-10-11. Written into canon on the Declaration page and the Page Template’s own page. So a scene needs no template.' }),
  makeNode('plan-decision', 'decision-ground', 'A ground is a pinned landing surface', at(3, 0),
    'Landing says “you arrive here”; pinning says “this is fixed to the canvas”. Together they make a floor. Pinned means held against the ordinary drag: the body pans, the title bar moves it.',
    { decision: 'Decided by Michael, 2026-10-11. Written into canon on the landing-surface, Declaration and Surface pages.' }),
  makeNode('plan-decision', 'decision-bundled', 'The app’s bundled content copy stays for now', at(4, 0),
    'The app repository carries an old copy of the content in its public folder. The home page no longer depends on it, but other bare paths on the dev site still reach it.',
    { decision: 'Decided by Michael, 2026-10-12: “don’t remove it yet. I think if we do that we are going to regret it.”' }),
  makeNode('plan-decision', 'decision-hand', 'A scene can be made by hand', at(5, 0),
    'A fifteen-step procedure in the editor: put a picture in a Content node, draw the landing surface, pin it, place nodes, name an edge, add a Portal, zoom, browse, save and reload.',
    { decision: 'Run by Michael, 2026-10-12: every step passed, including pasting an image.' }),

  makeNode('plan-decision', 'decision-free', 'Without the workspace, one graph at a time', at(8, 0),
    'A free account works as a web browser does. Going through a Portal puts you wholly in the other graph. The border of the graph is never seen.',
    { decision: 'Decided by Michael, 2026-10-12. Going through a connection puts you at its far end, the Port; going back puts you at the end you left. Written into the navigation scheme as “Without the workspace”.' }),

  makeNode('plan-decision', 'decision-double', 'Double-click is the end of the line', at(8, 4),
    'It does the last step for a thing at once, from any distance. Double-click a Portal that is only an icon or a mark, and it navigates.',
    { decision: 'Decided by Michael, 2026-10-12. Written into the navigation scheme under rule 1 and “Keys and modifiers”.' }),

  makeNode('plan-phase', 'phase-demos', '1. Look at the room demos', at(0, 1),
    'The three rooms behind the root are built as demos in the personal library. Looking at them is the next thing, and what is seen feeds the navigation work.'),
  makeNode('plan-phase', 'phase-navigation', '2. Navigation', at(1, 1),
    'How a person moves around, and what the app provides so that graphs do not have to. Settled before more rooms are built, because every scene so far carries a way back that was placed by hand.'),
  makeNode('plan-phase', 'phase-rooms', '3. Move the rooms to canon', at(2, 1),
    'The Commons, the Boulevard and Twilite, rebuilt at their real addresses with whatever navigation decided.'),
  makeNode('plan-phase', 'phase-places', '4. The places behind the Boulevard', at(3, 1),
    'The Boulevard’s doors open onto older graphs. Once it is live they are the next visible gap.'),
  makeNode('plan-phase', 'phase-cycle', '5. The water cycle in canon', at(4, 1),
    'The reference scene, with proper pictures, and the canon example the primitive pages can point at.'),
  makeNode('plan-phase', 'phase-tutorials', '6. The tutorials', at(5, 1),
    'The largest piece and mostly writing. The root’s Learn region and the Boulevard’s closed door are both waiting on it.'),
  makeNode('plan-phase', 'phase-carried', 'Carried, not scheduled', at(6, 1),
    'Things that are known and waiting. None blocks the phases; each can be picked up when it matters.'),

  makeNode('plan-action', 'action-commons-demo', 'The Commons demo', at(0, 2),
    'graphs/commons-demo: a poster with a Public spaces region. One real Portal, to Mike Martinez’s public space, and two outlines marked as room for the next. The “Be listed” line is still a placeholder.'),
  makeNode('plan-action', 'action-boulevard-demo', 'The Boulevard demo', at(0, 3),
    'graphs/boulevard-demo: a street as the ground, each door a Portal. Three open (Twilite LLC, Gallery, Research) and two drawn closed (Tutorial, and room for another). The picture is a stand-in.'),
  makeNode('plan-action', 'action-twilite-demo', 'The Twilite demo', at(0, 4),
    'graphs/twilite-demo: a document from the Page Template. Four sections carried over from the product story, an At a glance list, and three ways out drawn as Portal-style cards in the flow.'),

  makeNode('plan-action', 'action-inventory', 'Write down what moving around does today', at(1, 2),
    'Done: graphs/navigation-today. What each click, drag and key does now, read from the code, set against the scheme: seven things that already match, twelve that differ, and a build order in seven steps.'),
  makeNode('plan-action', 'action-proposal', 'Propose how navigation should work', at(1, 3),
    'Written and agreed: “A click means closer”. It is a canon document, tlz://twilite.zone/library/documentation/navigation/root.node, and navigation is built to it.'),
  makeNode('plan-action', 'action-build-navigation', 'Build what is agreed', at(1, 4),
    'Built to the scheme as written, in the seven steps set out in Navigation today. Steps 1 to 5, the node ladder, the tile ladder with stepping out, one history with the trail, going through, and travel along edges, are built and seen working. Step 6, walking with the arrow keys, is built and seen working. Step 7, removing the drawn way-back Portals, is done in the demos and in canon. Five smaller questions are listed at the end of the scheme and are settled as the work reaches them.'),

  makeNode('plan-action', 'action-commons', 'The Commons, at its canon address', at(2, 2),
    'tlz://twilite.zone/github/the-commons/root.node. Needs the rule for how a public space comes to be listed.'),
  makeNode('plan-action', 'action-boulevard', 'The Boulevard, at its canon address', at(2, 3),
    'tlz://twilite.zone/boulevard/root.node. Needs a picture, and the list of places that belong on the street.'),
  makeNode('plan-action', 'action-twilite', 'Twilite, at its canon address', at(2, 4),
    'tlz://twilite.zone/products/twilite/root.node. Needs a call on length (the old story has nine sections; the demo has four) and on whether to mention a trial that is not yet offered.'),
  makeNode('plan-action', 'action-card', 'Put the Portal-style card into the Page Template', at(2, 5),
    'The demo carries its own copy of the page Method with this one addition, and a test makes an exception for it. The addition moves into the template, the route class declares the setting so the editor shows it, and the exception is removed.'),

  makeNode('plan-action', 'action-company', 'Twilite LLC', at(3, 2), 'tlz://twilite.zone/company/root.node. An older graph. A scene or a document, once it is known what it should hold.'),
  makeNode('plan-action', 'action-gallery', 'Gallery', at(3, 3), 'tlz://twilite.zone/gallery/root.node. “A curated exhibition of current Twilite graphs.” Curated from what exists now.'),
  makeNode('plan-action', 'action-research', 'Research', at(3, 4), 'tlz://twilite.zone/research/root.node. “Graph Theory for Twilite.” An older graph.'),

  makeNode('plan-action', 'action-move-cycle', 'Move the water cycle to canon', at(4, 2),
    'Five scene graphs joined by Portals, now in graphs/water-cycle-demo. With proper pictures in place of the flat drawings.'),
  makeNode('plan-action', 'action-examples', 'Give four primitives a canon example', at(4, 3),
    'The Port, Declaration, Membrane and Script pages still point at graphs in the personal library and say so. The water cycle can serve several of them.'),

  makeNode('plan-action', 'action-write-tutorials', 'Rewrite the tutorials', at(5, 2),
    'The old ones are not carried over. Written for the model as it now is: scenes by default, documents for prose, grounds, Portals.'),
  makeNode('plan-action', 'action-open-learn', 'Open the Learn region and the Tutorial door', at(5, 3),
    'The root’s Learn region gets its Portal, and the Boulevard’s closed door opens.'),

  makeNode('plan-action', 'action-edges', 'Workspace edges: the rest', at(6, 2),
    'Ports, handles, trunks and wraps are built. Still to do: Tidy placing graphs on the side their ports face, naming each edge up close, arrowheads at the ports. Waiting until Michael has a firmer view of the problem.'),
  makeNode('plan-action', 'action-editor', 'Editor cleanup', at(6, 3),
    'Raised several times. Becomes work once there is a short list of specific annoyances.'),
  makeNode('plan-action', 'action-small', 'Small things', at(6, 4),
    'The band at the top of every tile, reserved for a title bar that has moved above it. The Detail backdrop that duplicates the ground behind an open graph. New pages not being pinned automatically.'),
  makeNode('plan-action', 'action-sorting', 'The sorting board', at(6, 5),
    'plans/canon-or-personal. Eleven groups still await a call on whether they are canon or personal.'),

  makeNode('plan-action', 'action-rooting', 'Rooting', at(6, 6),
    'To root is to select several graphs in the workspace and make a new graph from them, with a root of its own. Named in the vocabulary glossary, 2026-10-14; not built. Needs a design conversation first: how the new graph holds the graphs it was made from, and whether they stay where they were.'),
  makeNode('plan-action', 'action-trail-ui', 'A face for history and bookmarks', at(6, 7),
    'The trail and the one history work, but have little to look at. History and bookmarks need their own UI, using the icons and Glyphs graphs and nodes already have. Raised by Michael, 2026-10-14; needs a design first.'),
  makeNode('plan-action', 'action-web-pages', 'Web pages in the workspace', at(6, 8),
    'A link is an edge on the web, and it should be drawn wherever its ends are in the workspace, web pages included. How web pages show in the workspace has had little attention so far. Raised by Michael, 2026-10-14.'),
  makeNode('plan-action', 'action-behaviour', 'Behaviour along the edges', at(6, 9),
    'Decided with Michael, 2026-10-14 (plans/vocabulary/behaviour-today.md): every source draws its own invokes edge to the Method; Methods invoke Methods through an invokes port; a button raises an event; Scripts and Event Handler nodes retire; listening across graphs is redesigned in the same shape. Rebuild the primitive pages and templates on it.'),
  makeNode('plan-action', 'action-api-example', 'An API node, as an example', at(6, 10),
    'The old API node (fetch a URL when triggered) is retired in the vocabulary pass. Once behaviour runs along the edges, build the same thing from a class and a Method, and keep it as the worked example of making your own node. Michael, 2026-10-14.'),
  makeNode('plan-decision', 'decision-back', 'Going back', at(7, 1), 'Does every graph need its own way back, or is that the app’s job?', { decision: 'Agreed by Michael, 2026-10-12: it is the app’s job. Back returns to the same graph, node and distance; no graph draws a way back.' }),
  makeNode('plan-decision', 'decision-up', 'Going up', at(7, 2), 'Is there a place above this one: an index above a primitive page, the root above the index?', { decision: 'Agreed by Michael, 2026-10-12: there is no separate “up”. In the workspace the trunk shows what a graph was opened from.' }),
  makeNode('plan-decision', 'decision-where', 'Knowing where you are', at(7, 3), 'With several graphs open, what tells you which one you are in and how you got there?', { decision: 'Agreed by Michael, 2026-10-12: a trail near the address bar names the graphs you came through.' }),
  makeNode('plan-decision', 'decision-open', 'Replace, or open alongside', at(7, 4), 'When does following a Portal replace what you are looking at, and when does it open beside it?', { decision: 'Agreed by Michael, 2026-10-12: going through always opens beside and never closes anything. Ctrl-click opens beside without travelling.' }),
  makeNode('plan-decision', 'decision-walk', 'Walking', at(7, 5), 'Stepping next, next, next through a sequence inside a graph, and possibly from graph to graph.', { decision: 'Agreed by Michael, 2026-10-12: the arrow keys walk along the edge leaving the node in focus. Whether they are the right keys is one of the five questions the scheme leaves open.' }),

  makeNode('plan-milestone', 'milestone-proposal', 'A navigation proposal is written', at(8, 3),
    'It answers the five questions to its left. Each is decided by Michael before anything is built.'),
  makeNode('plan-milestone', 'milestone-demos', 'Three room demos are built', at(0, 5),
    'In the personal library, checked by their build, not yet looked at in the app.'),
  makeNode('plan-decision', 'decision-review', 'Michael looks at the demos', at(0, 6),
    'What changes, and which is built first.', { decision: 'Open.' }),
  makeNode('plan-milestone', 'milestone-rooms', 'The three rooms are live', at(2, 6),
    'Every Portal on the root opens a graph built the way we now build them.'),
  makeNode('plan-milestone', 'milestone-walkable', 'The Zone is walkable', at(5, 4),
    'From the root, every way in leads somewhere current, and there is always a way back that no graph had to draw.'),

  makeNode('plan-constraint', 'constraint-wording', 'Canon wording is proposed first', at(1, 6),
    'A statement of how Twilite works, on a primitive page, a class page, a template’s page or the root, is shown as exact wording and written only after Michael says yes.'),
  makeNode('plan-constraint', 'constraint-demo', 'A design, then a demo, then the real graph', at(3, 5),
    'Shown on the canvas, built as a copy in the personal library, and moved to its real address on Michael’s say-so.'),
  makeNode('plan-constraint', 'constraint-publish', 'Michael commits, publishes and deploys', at(4, 4),
    'Changes are left uncommitted. Order: the Twilite Zone repo and publish, then the app, then the personal library.'),
  makeNode('plan-constraint', 'constraint-tlz', 'Nothing in canon has a GitHub address', at(3, 6),
    'Official graphs are tlz://twilite.zone/... The one honest exception is a Portal in the Commons to someone’s own public space.'),

  makeNode('plan-risk', 'risk-wayback', 'Ways back are baked into content', at(4, 5),
    'The root’s indexes and all three room demos each carry a way-back Portal placed by hand. If navigation makes that the app’s job, each has to be taken out again.'),
  makeNode('plan-contingency', 'contingency-order', 'Settle navigation before moving the rooms', at(4, 6),
    'Phase 2 comes before phase 3 for this reason. The two indexes already in canon are the only ones to revisit.'),
  makeNode('plan-risk', 'risk-legacy', 'New rooms open onto old graphs', at(5, 5),
    'The Boulevard’s doors, and the cards on the Twilite page, lead to graphs built on templates that are no longer how we build.'),
  makeNode('plan-contingency', 'contingency-places', 'Phase 4, and doors that say so', at(5, 6),
    'A place that is not ready is drawn as a closed door, the way the Tutorial is, until it has been rebuilt.'),
  makeNode('plan-risk', 'risk-setting', 'A setting the editor cannot show', at(6, 6),
    'A route becomes a Portal-style card through a field the route class does not declare, so only a script can set it.'),
  makeNode('plan-contingency', 'contingency-declare', 'Declare it when the template takes it', at(7, 6),
    'The route class declares the field, and its editor gains the control, in the same change that moves the card into the Page Template.')
];
// The two documents navigation is built from stand beside its column, each as a Portal.
const linked = (key, label, ref, memo, position) => ({ id: `${prefix}-${key}`, type: 'portal', label, position, width: 360, height: 240,
  ports: [{ id: 'root', label: 'root', direction: 'bidirectional', dataType: 'any', angle: 210 }, { id: 'left', label: 'left', direction: 'bidirectional', dataType: 'value', angle: 180 }],
  visible: true, showLabel: true,
  data: { identity: { graphId }, memo, authority: 'navigate', intent: 'external', src: ref, ref, endpoint: ref, sourceRef: ref, sourcePayload: 'node.web.detail', surfaceId: 'root',
    target: { ref, mode: 'navigate', portId: 'root', surfaceId: 'root', label: `Open ${label}` }, visibilityRole: 'browser' } });
const linkedGraphs = [
  linked('link-scheme', 'The navigation scheme', 'tlz://twilite.zone/library/documentation/navigation/root.node', 'A click means closer: what each click should do. Agreed 12 October 2026; navigation is built to it.', at(8, 1)),
  linked('link-today', 'Navigation today', 'github://mikemartinez1974/public/graphs/navigation-today/root.node', 'What each click does now, read from the code, with the differences and a build order.', at(8, 2))
];
// Where the work stands. Anything not listed is still a draft, not started. Change this and run the build again.
const statuses = {
  'the-plan': 'in-progress',
  'decision-scene': 'done', 'decision-double': 'done', 'decision-free': 'done', 'decision-ground': 'done', 'decision-bundled': 'done', 'decision-hand': 'done',
  'phase-demos': 'in-progress', 'action-commons-demo': 'done', 'action-boulevard-demo': 'done', 'action-twilite-demo': 'done', 'milestone-demos': 'done',
  'phase-navigation': 'in-progress', 'action-build-navigation': 'done', 'action-inventory': 'done', 'action-proposal': 'done', 'milestone-proposal': 'done',
  'decision-back': 'done', 'decision-up': 'done', 'decision-where': 'done', 'decision-open': 'done', 'decision-walk': 'done',
  'action-edges': 'in-progress'
};
contentNodes.forEach((node) => {
  const status = statuses[node.id.slice(prefix.length + 1)];
  if (status) node.data.status = status;
});
graph.nodes.push(...contentNodes, ...linkedGraphs);

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
    sourcePort: ports[0], targetPort: ports[1],
    style: { ...edgeStyle[type], curved: true, dash: edgeStyle[type]?.dash || [] },
    data: { presentation: { layer: 'semantic' } }
  });
};

addEdge('goal', 'plan.achieves', 'the-plan', 'goal');
const phases = ['demos', 'navigation', 'rooms', 'places', 'cycle', 'tutorials'];
[...phases, 'carried'].forEach((phase) => addEdge(`plan-${phase}`, 'plan.contains', 'the-plan', `phase-${phase}`, ['phases', 'parent']));
phases.slice(1).forEach((phase, index) => addEdge(`phase-${index + 1}-${index + 2}`, 'plan.precedes', `phase-${phases[index]}`, `phase-${phase}`));
const phaseActions = {
  demos: ['commons-demo', 'boulevard-demo', 'twilite-demo'], navigation: ['inventory', 'proposal', 'build-navigation'],
  rooms: ['commons', 'boulevard', 'twilite', 'card'], places: ['company', 'gallery', 'research'], cycle: ['move-cycle', 'examples'],
  tutorials: ['write-tutorials', 'open-learn'], carried: ['edges', 'editor', 'small', 'sorting', 'rooting', 'trail-ui', 'web-pages', 'behaviour', 'api-example']
};
for (const [phase, actions] of Object.entries(phaseActions)) {
  for (const action of actions) addEdge(`${phase}-${action}`, 'plan.contains', `phase-${phase}`, `action-${action}`, ['actions', 'parent']);
}
addEdge('demos-milestone', 'plan.produces', 'action-twilite-demo', 'milestone-demos');
addEdge('review-gate', 'plan.gates', 'milestone-demos', 'decision-review');
addEdge('rooms-milestone', 'plan.produces', 'action-card', 'milestone-rooms');
addEdge('walkable-milestone', 'plan.produces', 'action-open-learn', 'milestone-walkable');
addEdge('proposal-milestone', 'plan.produces', 'action-proposal', 'milestone-proposal');
['back', 'up', 'where', 'open', 'walk'].forEach((question) => addEdge(`question-${question}`, 'plan.gates', 'milestone-proposal', `decision-${question}`));
addEdge('wording', 'plan.constrained-by', 'action-proposal', 'constraint-wording');
addEdge('demo-first', 'plan.constrained-by', 'action-company', 'constraint-demo');
addEdge('publish', 'plan.constrained-by', 'action-move-cycle', 'constraint-publish');
addEdge('tlz', 'plan.constrained-by', 'action-commons', 'constraint-tlz');
addEdge('wayback', 'plan.threatened-by', 'action-boulevard', 'risk-wayback');
addEdge('legacy', 'plan.threatened-by', 'action-twilite', 'risk-legacy');
addEdge('setting', 'plan.threatened-by', 'action-card', 'risk-setting');
addEdge('order', 'plan.mitigated-by', 'risk-wayback', 'contingency-order');
addEdge('places', 'plan.mitigated-by', 'risk-legacy', 'contingency-places');
addEdge('declare', 'plan.mitigated-by', 'risk-setting', 'contingency-declare');

for (const node of contentNodes) {
  graph.edges.push({
    id: `${node.id}-instantiates`, type: 'instantiates', label: '', source: `${prefix}-class-bridge-${node.type}`, target: node.id,
    sourcePort: 'root', targetPort: 'root', hidden: true,
    style: { stroke: '#64748b', strokeWidth: 1, opacity: 0.03 },
    data: { presentation: { layer: 'contract' } }
  });
}

graph.metadata = { ...graph.metadata, title, description, graphId, version: '0.1.0', created: now, modified: now,
  tags: ['plan', 'twilite-zone', 'navigation', 'rooms'], preferredViewer: 'https://dev.twilite.zone' };
declaration.label = `${title} Plan`;
declaration.data.identity = { ...declaration.data.identity, graphId, nodeId, name: title, version: '0.1.0', description };
declaration.data.document = { url: graphRef };
declaration.data.dependencies = { ...(declaration.data.dependencies || {}), skills: ['plan-template'] };

const rootPort = graph.nodes.find((node) => node.id === `${prefix}-root-port`);
rootPort.label = `${title} Plan`;
rootPort.data.title = title;
rootPort.data.summary = description;
rootPort.data.identity = { ...rootPort.data.identity, graphId, nodeId };

// The views draw the road: six phases in order, with the one under way marked.
const count = (type) => contentNodes.filter((node) => node.type === type).length;
const done = contentNodes.filter((node) => node.data.status === 'done').length;
const text = (x, y, value, size, fill, weight = 400) => `<text x="${x}" y="${y}" fill="${fill}" font-family="system-ui,sans-serif" font-size="${size}" font-weight="${weight}">${value}</text>`;
const steps = ['Room demos', 'Navigation', 'Rooms to canon', 'Behind the doors', 'Water cycle', 'Tutorials'];
const road = (x, y, width) => steps.map((step, index) => {
  const left = x + index * (width / steps.length), current = index === 0;
  return `<rect x="${left}" y="${y}" width="${width / steps.length - 10}" height="64" rx="10" fill="${current ? '#2e1065' : '#1e293b'}" stroke="${current ? '#a78bfa' : '#64748b'}" stroke-width="2"/>`
    + text(left + 12, y + 26, String(index + 1), 13, current ? '#c4b5fd' : '#94a3b8', 800) + text(left + 12, y + 48, step, 12, current ? '#ede9fe' : '#cbd5e1', current ? 700 : 400);
}).join('');
const detailSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 440" role="img" aria-label="${title}"><rect width="720" height="440" rx="20" fill="#0f172a"/>`
  + text(42, 62, 'PLAN · IN PROGRESS', 14, '#a78bfa', 800) + text(42, 112, title, 38, '#f8fafc', 700)
  + text(42, 148, 'The rooms behind the root, how a person moves between them,', 17, '#cbd5e1') + text(42, 172, 'and what is carried until later.', 17, '#cbd5e1')
  + road(40, 232, 640) + text(42, 340, 'Navigation is settled before the rooms move, because every scene', 14, '#c4b5fd') + text(42, 360, 'so far carries a way back that was placed by hand.', 14, '#c4b5fd')
  + text(42, 410, `${count('plan-phase') - 1} phases · ${count('plan-action')} actions · ${done} done`, 14, '#94a3b8') + `</svg>`;
const summarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" role="img" aria-label="${title}"><rect width="520" height="320" rx="20" fill="#0f172a"/>`
  + text(32, 54, 'PLAN · IN PROGRESS', 13, '#a78bfa', 800) + text(32, 98, title, 30, '#f8fafc', 700)
  + text(32, 136, 'Room demos, then navigation, then the rooms', 16, '#cbd5e1') + text(32, 158, 'themselves, and the places behind them.', 16, '#cbd5e1')
  + text(32, 270, `${count('plan-phase') - 1} phases · ${count('plan-action')} actions · ${done} done`, 14, '#94a3b8') + `</svg>`;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" role="img" aria-label="${title}"><rect width="320" height="220" rx="18" fill="#0f172a"/>`
  + `<path d="M50 110 H250" stroke="#a78bfa" stroke-width="6" stroke-linecap="round"/><path d="M222 82 L254 110 L222 138" fill="none" stroke="#a78bfa" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`
  + text(40, 196, 'Next', 16, '#ede9fe', 700) + `</svg>`;
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
instructions.data.content = { kind: 'markdown', value: '# How to read this plan\n\n'
  + '- The six numbered **phases** run left to right and are done in that order. Each holds the **actions** beneath it.\n'
  + '- **Carried, not scheduled** is the seventh column: known work that blocks nothing.\n'
  + '- The **decisions** along the top are made. The five in the right-hand column are the open questions navigation has to answer.\n'
  + '- **Michael looks at the demos** is the gate on phase 1.\n'
  + '- **Constraints** are how the work is done. **Risks** each have a **contingency** beside them.\n\n'
  + 'Status is kept in `plans/whats-next/build.cjs`, in the `statuses` list. Change it there and run `node plans/whats-next/build.cjs`.\n\n'
  + 'Two Portals stand beside the navigation questions: **The navigation scheme**, the agreed document in canon, and **Navigation today**, what the app does now and the order to build the difference in.\n\n'
  + 'The demos are at `graphs/commons-demo`, `graphs/boulevard-demo` and `graphs/twilite-demo`. The designs are on the canvas, in the row headed “The rooms behind the root”.' };

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
