const fs = require('fs');
const path = require('path');

const graphId = 'twilite-front-door';
const ideaRef = `github://mikemartinez1974/public/ideas/${graphId}/root.node`;
const launchRef = 'github://twilite-zone/public/tasks/beta-readiness/launch-content/root.node';
const templatePath = path.resolve(__dirname, '../../templates/idea-template/root.node');
const outputPath = path.resolve(__dirname, 'root.node');
const launchPath = path.resolve(__dirname, '../../../../twilite-zone/public/tasks/beta-readiness/launch-content/root.node');
const graph = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

const idMap = new Map();
for (const node of graph.nodes) {
  if (node.id.startsWith('idea-template-')) idMap.set(node.id, node.id.replace(/^idea-template-/, `${graphId}-`));
}
for (const node of graph.nodes) {
  node.id = idMap.get(node.id) || node.id;
  if (node.data?.identity) node.data.identity.graphId = graphId;
}
for (const edge of graph.edges) {
  edge.id = edge.id.replace(/^idea-template-/, `${graphId}-`);
  edge.source = idMap.get(edge.source) || edge.source;
  edge.target = idMap.get(edge.target) || edge.target;
}

const get = (suffix) => graph.nodes.find((node) => node.id === `${graphId}-${suffix}`);
const set = (suffix, patch) => {
  const node = get(suffix);
  if (!node) throw new Error(`Missing node ${suffix}`);
  const priorData = node.data || {};
  Object.assign(node, patch);
  if (patch.data) node.data = { ...priorData, ...patch.data };
  return node;
};

graph.metadata = {
  ...graph.metadata,
  title: 'Twilite Front Door',
  description: 'Redesign the canonical public root as a calm graph-native lobby that teaches Twilite through traversal, focus, expansion, and semantic zoom.',
  graphId,
  version: '0.1.0',
  kind: 'idea',
  modified: '2026-08-31T01:00:00.000Z',
  tags: ['idea', 'launch', 'onboarding', 'navigation', 'fragments', 'public-root']
};

const declaration = get('declaration');
declaration.label = 'Twilite Front Door';
declaration.data.identity = {
  graphId,
  nodeId: graphId,
  name: 'Twilite Front Door',
  version: '0.1.0',
  description: 'Make the first ninety seconds of Twilite explain the product by letting the visitor navigate it.'
};
declaration.data.declaration = { ...declaration.data.declaration, kind: 'idea', artifactKind: 'idea-graph' };
declaration.data.dependencies = {
  ...declaration.data.dependencies,
  nodeTypes: [...new Set([...(declaration.data.dependencies?.nodeTypes || []), 'portal'])]
};

set('idea', {
  label: 'The Root Becomes a Lobby',
  data: {
    title: 'Turn the public root from a directory into Twilite’s front door',
    statement: 'Keep the canonical public root address, replace its crowded directory experience with Welcome, Get Started, See What It Does, and Explore, and let traversal and fragment expansion teach Twilite through use.',
    status: 'framed',
    confidence: 'promising',
    notes: 'The existing public graph remains valuable as the larger world behind Explore. The lobby is a real graph, not a marketing page disguised as one.'
  }
});

set('idea-problem', {
  label: 'The Root Is a Directory',
  data: {
    title: 'The opening canvas asks newcomers to understand the whole place at once',
    statement: 'The current public root presents many destinations, embeds, release surfaces, and unrelated landmarks before a visitor understands what Twilite is or what to do first.',
    impact: 'New visitors encounter graph complexity before they experience graph navigation, making Twilite feel like a directory or control panel instead of an understandable workspace.',
    urgency: 'high'
  }
});

set('idea-audience', {
  label: 'First-Time Visitors',
  data: {
    title: 'People in their first ninety seconds with Twilite',
    description: 'Curious visitors, prospective customers, new authors, and people arriving from a shared graph who do not yet know Twilite’s spatial language.',
    needs: 'They need one sentence of orientation, one obvious next action, a low-risk way to experience the interface, and a route into deeper material only when they ask for it.'
  }
});

set('idea-proposed-approach', {
  label: 'Lobby · Journeys · World',
  data: {
    title: 'A four-node lobby backed by three purpose-built destinations',
    description: 'Keep github://twilite-zone/public/root.node as a calm lobby. Get Started expands an onboarding fragment, See What It Does expands a compact demonstration, and Explore navigates into the modernized public world preserved from the current root.',
    differentiator: 'The act of entering Twilite demonstrates animated focus, edge traversal, reversible fragment expansion, semantic zoom, and graph-backed navigation instead of explaining those features in a list.'
  }
});

set('idea-question', {
  label: 'First-Run Boundary',
  data: {
    title: 'How much setup belongs before the first useful experience?',
    question: 'Should Get Started ask for GitHub or account setup immediately, or let visitors browse and create a temporary first graph before introducing durable repository-backed authorship?',
    status: 'open',
    answer: 'Default direction: public browsing and the demonstration should require no setup. Introduce GitHub when the visitor chooses durable authorship, and introduce AI connection after the first graph is visible.'
  }
});

set('idea-assumption', {
  label: 'Calm Entry · Deep Graph',
  data: {
    title: 'Fragments can preserve depth without exposing complexity at entry',
    statement: 'A four-node opening canvas can lead into substantial onboarding, demonstration, and public-library graphs without making the root feel empty or concealing important destinations.',
    importance: 'critical',
    status: 'partially-tested'
  }
});

set('idea-research', {
  label: 'Current Root Audit',
  data: {
    title: 'The canonical root currently behaves as a mixed public directory',
    findings: 'The current root contains 20 nodes and 21 edges spanning GitHub, Agent, Tutorial, Gallery, company, personal public space, embeds, 3D, and release presentation infrastructure. Several visible portals still use older https graph references.',
    sourceUrl: 'github://twilite-zone/public/root.node',
    sourceType: 'graph-audit'
  }
});

set('idea-evidence', {
  label: 'Navigation Primitives Exist',
  data: {
    title: 'Twilite now has the interaction vocabulary required for an in-graph welcome',
    observation: 'Animated focus can follow edges, portals own reversible fragment expansion, cross-graph edges retain connectivity, and semantic views can reduce distant nodes to icons and glyphs.',
    kind: 'working-product-observation',
    strength: 'strong',
    citationSourceId: 'github://mikemartinez1974/public/graphs/cross-graph-focus-smoke/host.node'
  }
});

set('idea-alternative', {
  label: 'Polish the Existing Directory',
  data: {
    title: 'Keep every current destination on the opening canvas',
    description: 'Rewrite the central root card, improve layout, and rely on semantic zoom to make the current directory more attractive.',
    tradeoffs: 'This preserves every visible destination but still makes first contact about catalog navigation rather than the product promise and first useful journey.'
  }
});

set('idea-risk', {
  label: 'A Tutorial Disguised as a Homepage',
  data: {
    title: 'The lobby could become a forced walkthrough or marketing funnel',
    description: 'Too many staged steps, modal instructions, or promotional claims would replace one form of friction with another and weaken the feeling that the visitor is freely navigating real information.',
    likelihood: 'medium',
    impact: 'high',
    mitigation: 'Keep the lobby to four visible nodes, make every branch optional and collapsible, require no setup for browsing or the demonstration, and send the final onboarding step into useful work rather than a completion screen.'
  }
});

set('idea-next-step', {
  label: 'Prototype the Four-Node Lobby',
  data: {
    title: 'Build a reviewable lobby and two tiny canonical fragments before replacing root',
    action: 'Create a smoke graph with Welcome, Get Started, See What It Does, and Explore. Connect all routes with modern edges; make the first two expandable fragments and point Explore at a preserved copy of the current public world.',
    expectedEvidence: 'A new visitor sees only the four intended surfaces, can follow focus along each edge, expand and collapse both journeys, and enter the larger public world without losing access to existing destinations.',
    status: 'todo',
    externalRef: launchRef
  }
});

set('instructions', {
  type: 'content',
  label: 'Proposed Experience Contract',
  data: {
    content: {
      kind: 'markdown',
      value: '# Proposed experience contract\n\n## Initial canvas\n\n**Welcome to Twilite**  \nTurn information, work, and ideas into things you can navigate.\n\n- **Get Started** — expand a short onboarding journey\n- **See What It Does** — expand a feature demonstration that uses the product itself\n- **Explore** — enter the preserved public world\n\n## Graph boundaries\n\n1. `root.node` — calm canonical lobby\n2. `onboarding/root.node` — first useful graph, interface, AI connection, real next action\n3. `demo/root.node` — focus, traverse, expand, collapse, and semantic zoom\n4. `explore/root.node` — modernized destination graph derived from the current public root\n\n## Product rule\n\nThe lobby is a real graph. Edges own connectivity, portals own expansion, and no route is merely decorative.'
    },
    interfaceContract: { version: 1, receivesViewContent: true },
    identity: { graphId }
  }
});

set('detail-view', { label: 'Twilite Front Door Detail', data: { content: { kind: 'markdown', value: '# Twilite Front Door\n\nDesign the first ninety seconds as a calm graph-native lobby with expandable journeys and a preserved public world.' } } });
set('summary-view', { label: 'Twilite Front Door Summary', data: { content: { kind: 'markdown', value: '## Lobby, journeys, world\n\nFour visible nodes at entry; substantial depth appears only through traversal, expansion, and exploration.' } } });
set('icon-view', { label: 'Twilite Front Door Icon', data: { content: { kind: 'svg', value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='28' fill='#0f172a'/><path d='M82 184V54c0-15 12-26 26-26h104c14 0 26 11 26 26v130' fill='#172554' stroke='#60a5fa' stroke-width='8'/><path d='M126 184V78h74v106' fill='#1e3a8a' stroke='#bfdbfe' stroke-width='7'/><circle cx='181' cy='132' r='7' fill='#fbbf24'/><path d='M54 184h212' stroke='#f8fafc' stroke-width='10' stroke-linecap='round'/><text x='160' y='210' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='16' font-weight='800'>FRONT DOOR</text></svg>" } } });
set('glyph', { label: 'Front Door Glyph', data: { glyph: { kind: 'character', value: '🚪' } } });
set('landing-surface', {
  label: 'Twilite Front Door Landing Surface',
  data: { content: { kind: 'markdown', value: '# Twilite’s Front Door\n\nHow should the canonical public root use focus, traversal, fragments, and semantic zoom to make the product understandable in its first ninety seconds?\n\nUse **Explore idea** to enter the working graph.' } }
});

const launchPortal = {
  id: `${graphId}-launch-task`,
  type: 'portal',
  label: 'Customer Acquisition and Launch Content',
  position: { x: 260, y: 700 },
  width: 420,
  height: 240,
  visible: true,
  showLabel: true,
  ports: [{ id: 'root', label: 'root', direction: 'bidirectional', dataType: 'any', angle: 210 }],
  data: {
    memo: 'Open the authoritative launch task that owns implementation of this front-door proposal.',
    authority: 'navigate',
    intent: 'external',
    sourceRef: launchRef,
    sourceNodeId: 'launch-content-summary',
    sourcePayload: 'node.web',
    surfaceId: 'summary',
    target: { ref: launchRef, mode: 'navigate', portId: 'summary', surfaceId: 'summary', label: 'Open Launch Task' },
    identity: { graphId }
  }
};
graph.nodes.push(launchPortal);
graph.edges.push({
  id: `${graphId}-edge-next-step-launch-task`,
  type: 'reference',
  source: `${graphId}-idea-next-step`,
  target: launchPortal.id,
  sourceHandle: 'root',
  targetHandle: 'root',
  label: 'promoted into',
  data: { relationship: 'promoted into', semanticRole: 'navigation' }
});

graph.timestamp = '2026-08-31T01:00:00.000Z';
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);

const launch = JSON.parse(fs.readFileSync(launchPath, 'utf8'));
const taskId = 'launch-content-task-front-door';
if (!launch.nodes.some((node) => node.id === taskId)) {
  const sourceTask = launch.nodes.find((node) => node.id === 'launch-content-task-posts');
  const task = structuredClone(sourceTask);
  task.id = taskId;
  task.label = 'Redesign the public root as Twilite’s front door';
  task.position = { x: 960, y: 360 };
  task.data = {
    ...task.data,
    title: 'Redesign the public root as Twilite’s front door',
    body: 'Preserve the canonical public root address while replacing its directory-like opening with a calm four-node lobby backed by expandable onboarding and demonstration fragments plus a navigable Explore world.',
    relatedIdeaRef: ideaRef,
    priority: 'critical',
    status: 'in-progress',
    owner: 'Michael',
    acceptanceCriteria: [
      'The initial root canvas presents only Welcome, Get Started, See What It Does, and Explore',
      'Get Started and See What It Does expand and collapse as canonical fragments',
      'Focus traversal visibly follows authored edges between lobby destinations',
      'Explore preserves access to the existing public destinations through modern declarations and durable github addresses',
      'Public browsing and the demonstration require no account or GitHub setup'
    ],
    nextAction: 'Review the Twilite Front Door idea graph, then build the four-node lobby and two tiny fragment smoke graphs before replacing the canonical root.',
    progressNote: 'Direction captured as a declaration-first idea graph and linked into the authoritative launch task.',
    identity: { graphId: 'launch-content-declaration' }
  };
  launch.nodes.push(task);
  launch.edges.push({ id: 'launch-content-edge-goal-front-door', type: 'reference', source: 'launch-content-goal', target: taskId, sourcePort: 'bottom', targetPort: 'top', label: 'welcomes through', style: {}, data: { relation: 'entry-experience' } });
}

if (!launch.nodes.some((node) => node.id === 'launch-content-portal-front-door-idea')) {
  const sourcePortal = launch.nodes.find((node) => node.id === 'launch-content-portal-paywall-idea');
  const portal = structuredClone(sourcePortal);
  portal.id = 'launch-content-portal-front-door-idea';
  portal.label = 'Open Twilite Front Door Idea';
  portal.position = { x: 1440, y: 700 };
  portal.data = {
    ...portal.data,
    memo: 'Open the durable reasoning and proposed experience contract for the public-root redesign.',
    src: ideaRef,
    ref: ideaRef,
    endpoint: `${ideaRef}:root`,
    sourceRef: ideaRef,
    sourceNodeId: `${graphId}-landing-surface`,
    sourcePayload: 'node.web.detail',
    surfaceId: 'root',
    target: { endpoint: `${ideaRef}:root`, ref: ideaRef, mode: 'navigate', portId: 'root', surfaceId: 'root', handleId: 'root', label: 'Open Twilite Front Door Idea' }
  };
  launch.nodes.push(portal);
  launch.edges.push({ id: 'launch-content-edge-front-door-idea', type: 'reference', source: taskId, target: portal.id, sourcePort: 'right', targetPort: 'left', label: 'specified by', style: {}, data: { relation: 'idea-specification' } });
}

const updater = launch.nodes.find((node) => node.id === 'launch-content-summary-updater');
let launchNodes = launch.nodes;
const api = {
  getNodes: async () => structuredClone(launchNodes),
  updateNode: async (id, patch) => {
    const index = launchNodes.findIndex((node) => node.id === id);
    if (index < 0) throw new Error(`Missing launch node ${id}`);
    launchNodes[index] = { ...launchNodes[index], ...patch, data: patch.data ? { ...(launchNodes[index].data || {}), ...patch.data } : launchNodes[index].data };
    return { success: true };
  }
};

(async () => {
  const runUpdater = new Function('api', `return (async()=>{${updater.data.source}\n})()`);
  const result = await runUpdater(api);
  if (!result?.success) throw new Error(`Launch summary update failed: ${JSON.stringify(result)}`);
  launch.nodes = launchNodes;
  const launchSummary = launch.nodes.find((node) => node.id === 'launch-content-summary');
  launchSummary.data.nextAction = launch.nodes.find((node) => node.id === taskId).data.nextAction;
  launch.metadata.modified = '2026-08-31T01:00:00.000Z';
  launch.timestamp = '2026-08-31T01:00:00.000Z';
  launch.nodeCount = launch.nodes.length;
  launch.edgeCount = launch.edges.length;
  fs.writeFileSync(launchPath, `${JSON.stringify(launch, null, 2)}\n`);
  console.log(`Wrote idea ${graph.nodes.length}/${graph.edges.length} and launch ${launch.nodes.length}/${launch.edges.length}`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
