const fs = require('fs');
const path = require('path');

const graphId = 'focus-defined-save-scope';
const title = 'Focus-Defined Save Scope';
const graphRef = `github://mikemartinez1974/public/ideas/${graphId}/root.node`;
const templatePath = path.resolve(__dirname, '../../templates/idea-template/root.node');
const outputPath = path.resolve(__dirname, 'root.node');
const graph = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
const now = new Date().toISOString();

const idMap = new Map();
for (const node of graph.nodes) {
  if (node.id.startsWith('idea-template-')) {
    idMap.set(node.id, node.id.replace(/^idea-template-/, `${graphId}-`));
  }
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
  if (!node) throw new Error(`Missing template node: ${suffix}`);
  const priorData = node.data || {};
  Object.assign(node, patch);
  if (patch.data) node.data = { ...priorData, ...patch.data };
  return node;
};

graph.metadata = {
  ...graph.metadata,
  title,
  description: 'Let graph focus select graph persistence and the absence of graph focus select workspace persistence, while keeping destination and dirty child writes explicit.',
  graphId,
  version: '0.1.0',
  kind: 'idea',
  modified: now,
  tags: ['idea', 'save', 'workspace', 'focus', 'persistence', 'github', 'multi-graph']
};

const declaration = get('declaration');
declaration.label = title;
declaration.data.identity = {
  graphId,
  nodeId: graphId,
  name: title,
  version: '0.1.0',
  description: 'Define the object saved by the ordinary Save command from focused graph scope.'
};
declaration.data.declaration = { ...declaration.data.declaration, kind: 'idea', artifactKind: 'idea-graph' };
declaration.data.document = { url: graphRef };
declaration.data.settings = {
  ...declaration.data.settings,
  github: { repo: 'mikemartinez1974/public', path: `ideas/${graphId}/root.node`, branch: 'main' }
};

set('idea', {
  label: 'Save What Focus Names',
  data: {
    title: 'Graph focus chooses graph save; no graph focus chooses workspace save',
    statement: 'The ordinary Save command should persist exactly one visible authoring scope. If a graph is focused, save that graph to its bound destination. If no graph is focused, save the workspace as its own graph document. Selection does not alter save scope.',
    status: 'framed',
    confidence: 'promising',
    notes: 'Focus means focused graph ownership. Focusing a node or fragment identifies its owning graph. Clicking the workspace clears graph focus and deliberately promotes the workspace to the save scope.'
  }
});

set('idea-problem', {
  label: 'Save Has No Visible Object',
  data: {
    title: 'The current commands conflate persistence, composition, and destination',
    statement: 'Authors can see several graphs, select several graphs, and press Save without a dependable rule for whether Twilite writes one graph, every dirty graph, or a new parent graph. Destination choices then look like payload choices, which makes accidental replacement hard to predict.',
    impact: 'A user cannot confidently answer which node file will change before committing to GitHub or disk.',
    urgency: 'high'
  }
});

set('idea-audience', {
  label: 'Spatial Graph Authors',
  data: {
    title: 'People authoring one graph inside a composed workspace',
    description: 'Authors who spread several graph documents across the canvas, move between focused graph interiors and the surrounding workspace, and expect Save to follow that visible scope.',
    needs: 'One predictable save target, an exact destination preview, safe create-versus-update behavior, and preservation of unrelated open graphs.'
  }
});

set('idea-proposed-approach', {
  label: 'Resolve Scope Before Destination',
  data: {
    title: 'Build one save plan from focus, then choose where it is written',
    description: 'Resolve focusedGraph first. A focused graph produces a one-document graph save plan. No focused graph produces a one-document workspace save plan. The workspace document contains its own declaration, views, graph projections, arrangement, camera, and workspace relationships; child graph bodies remain external and are referenced by durable addresses. GitHub versus local file changes only the destination adapter.',
    differentiator: 'The UI never infers a multi-file write from selection. Save All Dirty remains a separate reviewed operation.'
  }
});

set('idea-question', {
  label: 'Unsaved Child State',
  data: {
    title: 'What should workspace Save do when referenced children are dirty?',
    question: 'Should saving an unfocused workspace be allowed while one or more referenced graph documents contain unsaved edits?',
    status: 'open',
    answer: 'Proposed rule: save the workspace document without silently saving its children, then report the remaining dirty graphs. Their durable references are valid independently of their pending content edits. If a new child has no durable address, block workspace save or require that child to be saved first because the workspace cannot write a durable reference to it.'
  }
});

set('idea-assumption', {
  label: 'Focus Is Deliberate Scope',
  data: {
    title: 'Graph focus is a strong enough authoring signal to choose persistence scope',
    statement: 'Entering a graph frame means the author is working on that graph; clicking the surrounding workspace means the author is arranging or composing the workspace itself.',
    importance: 'critical',
    status: 'testing'
  }
});

set('idea-research', {
  label: 'Current Save Paths',
  data: {
    title: 'Existing runtime already separates graph snapshots, workspace capture, and multi-file Save All',
    findings: 'Primary Save targets the active graph. Save selection as graph constructs a parent from references. Save All walks every dirty addressed graph. Local and GitHub paths currently serialize through different code paths. The missing piece is one explicit focus-derived save plan shared by both destinations.',
    sourceUrl: 'github://mikemartinez1974/public/ideas/multi-document-intergraph-save/root.node',
    sourceType: 'runtime-inspection-and-prior-idea'
  }
});

set('idea-evidence', {
  label: 'Workspace Is Already Graph-Shaped',
  data: {
    title: 'A workspace can be represented without embedding child graph bodies',
    observation: 'The existing workspace capture machinery creates a declaration-first graph whose local nodes project addressed child graphs and whose edges preserve workspace relationships. This provides the payload shape needed for an unfocused workspace save, although capture currently replaces the live workspace and must be separated from persistence.',
    kind: 'runtime-inspection',
    strength: 'strong',
    citationSourceId: graphRef
  }
});

set('idea-alternative', {
  label: 'Selection Chooses Save Scope',
  data: {
    title: 'Treat selected graphs as the documents saved by Save',
    description: 'Use marquee selection to determine which graph files are written.',
    tradeoffs: 'Selection already serves manipulation and composition. Making it a persistence switch creates accidental multi-file writes and leaves Save ambiguous when both a graph and other graphs are selected.'
  }
});

set('idea-risk', {
  label: 'Focus Can Be Transient',
  data: {
    title: 'Incidental focus loss could change Save from graph to workspace',
    description: 'If opening a menu, editing chrome, or clicking a control clears graph focus, the same Save button could suddenly target the workspace.',
    likelihood: 'medium',
    impact: 'high',
    mitigation: 'Define graph focus as durable authoring scope. Only an intentional workspace-surface action clears it. Always show the resolved scope and exact destination in the Save affordance before writing.'
  }
});

set('idea-next-step', {
  label: 'Prototype the Save Resolver',
  data: {
    title: 'Prove focused and unfocused saves cannot cross destinations',
    action: 'Create a save-plan resolver and smoke workspace with two addressed graphs plus one workspace address. Save with each graph focused, then with the workspace focused, and exercise an unaddressed child, dirty child, read-only graph, fragment focus, local destination, and GitHub destination.',
    expectedEvidence: 'Each action previews and writes exactly one intended document; graph saves never contain sibling graphs; workspace saves contain references and layout but no child bodies; unrelated files remain byte-identical; unaddressed references cannot enter a durable workspace save.',
    status: 'todo'
  }
});

set('instructions', {
  type: 'content',
  label: 'Focus-Defined Save Contract',
  data: {
    content: {
      kind: 'markdown',
      value: '# Focus-defined save contract\n\n## Resolve the object first\n\n**Focused graph:** save that graph document. Node and fragment focus resolve through provenance to the owning graph.\n\n**No focused graph:** save the workspace document. The workspace owns its declaration, exposed views, projections, arrangement, camera, and workspace relationships. It references child graphs by durable address and does not embed their bodies.\n\n## Selection is orthogonal\n\nSelection chooses objects for movement, connection, deletion, or creating a new graph from a selection. It never changes the ordinary Save payload.\n\n## Dirty children stay explicit\n\nWorkspace Save does not silently write child graph documents. It reports remaining dirty children. An unaddressed child must receive a durable address before the workspace can reference it. Multi-file persistence remains an explicit **Save All Dirty** operation with a target review.\n\n## Destination follows scope\n\nGitHub and local file are destination adapters for the same resolved document. Before writing, show the document title, graphId, nodeId, exact destination, and whether the action creates or updates a file.\n\n## Focus stability\n\nOpening menus and using graph chrome must not clear graph focus. Clicking the surrounding workspace deliberately clears graph focus.\n\n## Save invariant\n\nOne ordinary Save resolves one scope, serializes one document, and writes one exact destination.'
    },
    interfaceContract: { version: 1, receivesViewContent: true },
    identity: { graphId }
  }
});

set('detail-view', { label: `${title} Detail`, data: { content: { kind: 'markdown', value: '# Focus-Defined Save Scope\n\nSave follows the visible authoring scope: the focused graph or, when no graph is focused, the workspace graph. Each ordinary save serializes one document and writes one exact destination.' } } });
set('summary-view', { label: `${title} Summary`, data: { content: { kind: 'markdown', value: '## Save what focus names\n\nFocused graph → save that graph. No graph focus → save the workspace graph of references and arrangement. Selection never silently creates a multi-file write.' } } });
set('icon-view', { label: `${title} Icon`, data: { content: { kind: 'svg', value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='28' fill='#111827'/><rect x='28' y='38' width='264' height='144' rx='18' fill='#1e293b' stroke='#67e8f9' stroke-width='6'/><rect x='64' y='66' width='86' height='82' rx='10' fill='#7c3aed' stroke='#e9d5ff' stroke-width='4'/><rect x='170' y='66' width='86' height='82' rx='10' fill='#334155'/><circle cx='107' cy='107' r='15' fill='#fff'/><path d='M160 164v30M143 194h34' stroke='#f8fafc' stroke-width='8' stroke-linecap='round'/><text x='160' y='212' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='14' font-weight='800'>SAVE SCOPE</text></svg>" } } });
set('glyph', { label: `${title} Glyph`, data: { glyph: { kind: 'icon', name: 'Save' } } });
set('landing-surface', {
  label: `${title} Landing Surface`,
  data: { content: { kind: 'markdown', value: '# Save what focus names\n\nWhen a graph is focused, Save writes that graph. When no graph is focused, Save writes the workspace as its own graph of references, arrangement, and relationships.\n\nUse **Explore idea** to inspect the proposed contract and its open question.' } }
});

// Retarget the template relationships so each claim in this derived graph is truthful.
const retarget = (edgeSuffix, targetSuffix) => {
  const edge = graph.edges.find((candidate) => candidate.id === `${graphId}-${edgeSuffix}`);
  if (!edge) throw new Error(`Missing template edge: ${edgeSuffix}`);
  edge.target = `${graphId}-${targetSuffix}`;
};
retarget('question-questions', 'idea-proposed-approach');
retarget('evidence-supports', 'idea-proposed-approach');
retarget('alternative-questions', 'idea-proposed-approach');

graph.timestamp = now;
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
