const fs = require('fs');
const path = require('path');

const graphId = 'multi-document-intergraph-save';
const templatePath = path.resolve(__dirname, '../../templates/idea-template/root.node');
const outputPath = path.resolve(__dirname, 'root.node');
const graph = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
const now = new Date().toISOString();

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
  title: 'Multi-Document Intergraph Save',
  description: 'Make one intergraph relationship durable and discoverable from both participating graphs without ejecting the author from the composed canvas.',
  graphId,
  version: '0.1.0',
  kind: 'idea',
  modified: now,
  tags: ['idea', 'intergraph-edge', 'multi-document', 'save', 'github', 'authoring']
};

const declaration = get('declaration');
declaration.label = 'Multi-Document Intergraph Save';
declaration.data.identity = {
  graphId,
  nodeId: graphId,
  name: 'Multi-Document Intergraph Save',
  version: '0.1.0',
  description: 'Coordinate graph-local references to one shared edge identity and save every affected document without disrupting spatial context.'
};
declaration.data.declaration = { ...declaration.data.declaration, kind: 'idea', artifactKind: 'idea-graph' };
declaration.data.document = { url: `github://mikemartinez1974/public/ideas/${graphId}/root.node` };
declaration.data.settings = {
  ...declaration.data.settings,
  github: { repo: 'mikemartinez1974/public', path: `ideas/${graphId}/root.node`, branch: 'main' }
};

set('idea', {
  label: 'Save the Relationship, Keep the Place',
  data: {
    title: 'Treat intergraph editing as one relationship change across multiple documents',
    statement: 'An intergraph edge has one stable identity, each participating graph keeps a reference to it, and Save coordinates every dirty graph while preserving focus, expansion, selection, pan, and zoom.',
    status: 'framed',
    confidence: 'promising',
    notes: 'The relationship is singular. Its graph-local references make it discoverable from either endpoint without pretending that either graph exclusively owns the edge.'
  }
});

set('idea-problem', {
  label: 'One Edge Dirties Two Graphs',
  data: {
    title: 'Single-document save cannot finish a shared intergraph edit',
    statement: 'Creating or deleting an intergraph relationship changes what both endpoint graphs must know. Saving only the focused file leaves the opposite graph unable to discover the relationship, while reloading the canvas after save destroys the author’s working context.',
    impact: 'Authors can believe an edge is durable when only one endpoint reference exists, encounter partial relationships after reload, or accidentally save the wrong expanded graph.',
    urgency: 'critical'
  }
});

set('idea-audience', {
  label: 'Graph Authors',
  data: {
    title: 'People connecting nodes across an expanded graph boundary',
    description: 'Authors who expand a fragment, draw an edge between graphs, inspect either endpoint, and expect the relationship to remain visible and discoverable after saving and reopening either graph.',
    needs: 'Clear dirty-state ownership, a safe primary Save, an obvious Save All path, conflict reporting, and no involuntary return to the host root.'
  }
});

set('idea-proposed-approach', {
  label: 'Shared Edge · Two References · One Save Set',
  data: {
    title: 'Track affected documents and persist them as one logical operation',
    description: 'Give the edge a stable ID and canonical relationship payload. Store a graph-local reference in both endpoint graphs. Creating, editing, reversing, or deleting the edge marks both documents dirty. Save preserves the canvas and reports remaining work; Save All persists the complete dirty set.',
    differentiator: 'The save unit becomes an explicit set of documents without changing the author’s active spatial context or duplicating the relationship’s identity.'
  }
});

set('idea-question', {
  label: 'Atomicity and Authority',
  data: {
    title: 'How atomic can Save All be across repositories and permissions?',
    question: 'Should same-repository files be committed atomically in one Git commit while cross-repository changes use a resumable two-phase save with explicit partial-success state?',
    status: 'open',
    answer: 'Proposed boundary: one Git commit for files sharing repo, branch, installation, and authority. Otherwise preflight every target, save independently, retain the unsaved remainder, and never claim the relationship is fully durable until all endpoint references succeed.'
  }
});

set('idea-assumption', {
  label: 'A Dirty Set Is Understandable',
  data: {
    title: 'Users can understand one action affecting more than one graph',
    statement: 'A concise snackbar and inspectable dirty-document list can communicate that the focused graph was saved while a related graph still needs persistence, without forcing navigation or a modal workflow.',
    importance: 'critical',
    status: 'untested'
  }
});

set('idea-research', {
  label: 'Current Save Boundary',
  data: {
    title: 'Twilite currently commits one graph path per save request',
    findings: 'Focus now identifies the active graph and the serializer can reconstruct an expanded child using canonical IDs. The GitHub commit endpoint still writes one path, and intergraph boundary persistence is intentionally blocked until relationship ownership and multi-document behavior are explicit.',
    sourceUrl: 'github://mikemartinez1974/public/graphs/twilite-front-door-smoke/root.node',
    sourceType: 'runtime-and-smoke-observation'
  }
});

set('idea-evidence', {
  label: 'Host Overwrite Incident',
  data: {
    title: 'Address preview and payload ownership previously diverged during save',
    observation: 'With an expanded child focused, Twilite displayed the child address but paired the child payload with the host destination. The incident demonstrates that target identity, serialized owner, and write operation must be captured together and validated before persistence.',
    kind: 'observed-save-failure',
    strength: 'strong',
    citationSourceId: 'github://mikemartinez1974/public/graphs/twilite-front-door-smoke/root.node'
  }
});

set('idea-alternative', {
  label: 'Manual Double Save',
  data: {
    title: 'Require the author to focus and save each graph separately',
    description: 'After drawing the edge, save the focused graph, focus the opposite endpoint, then save its graph.',
    tradeoffs: 'Simple implementation, but easy to forget, makes relationship durability depend on navigation order, and turns a single graph gesture into procedural bookkeeping.'
  }
});

set('idea-risk', {
  label: 'Partial Relationship Commit',
  data: {
    title: 'One endpoint reference may save while the other conflicts or lacks authority',
    description: 'Cross-repository permissions, stale SHAs, network errors, or concurrent edits can leave only one graph updated.',
    likelihood: 'medium',
    impact: 'high',
    mitigation: 'Preflight every destination, use expected revisions, commit same-repository changes atomically, retain failed documents in the dirty set, expose retry details, and render incomplete relationship state as a warning rather than a healthy edge.'
  }
});

set('idea-next-step', {
  label: 'Build the Two-Graph Save Smoke',
  data: {
    title: 'Prove creation, Save All, reload, and deletion from both directions',
    action: 'Extend the canonical host-and-fragment smoke pair with one stable bidirectional edge ID and graph-local references in both files. Add a dirty-document tray, non-navigating Save, Save All, expected-revision guards, and partial-failure recovery.',
    expectedEvidence: 'After one edge gesture and one Save All, opening either graph independently discovers the same edge ID; the composed canvas remains in place; deleting from either side removes both references; simulated conflict leaves an honest retryable dirty state.',
    status: 'todo'
  }
});

set('instructions', {
  type: 'content',
  label: 'Proposed Multi-Document Save Contract',
  data: {
    content: {
      kind: 'markdown',
      value: '# Proposed multi-document save contract\n\n## Relationship identity\n\n- One canonical `edgeId` and relationship payload\n- One graph-local edge reference in every participating graph\n- References name the local endpoint and the addressed remote endpoint\n- A two-way edge is discoverable when either graph is opened first\n\n## Dirty documents\n\nCreating, editing, reversing, or deleting an intergraph edge marks both endpoint graphs dirty. Dirty state belongs to graph documents, not merely the current canvas.\n\n## Save\n\nSave writes the active graph and remains in place. It preserves focus, expansion, pan, zoom, and selection. A snackbar reports success and offers **Save all** when related documents remain dirty.\n\n## Save all\n\nPreflight addresses, permissions, expected revisions, and payload ownership for the complete dirty set. Files in one repository and branch should share one Git commit. Cross-repository work may complete in stages, but unsaved documents remain visible and retryable.\n\n## Failure rule\n\nNever discard an endpoint reference, reload the root, or report a healthy durable relationship after partial success.'
    },
    interfaceContract: { version: 1, receivesViewContent: true },
    identity: { graphId }
  }
});

set('detail-view', { label: 'Multi-Document Save Detail', data: { content: { kind: 'markdown', value: '# Multi-Document Intergraph Save\n\nOne relationship identity, references in both participating graphs, a visible dirty set, and save behavior that never ejects the author from the composed canvas.' } } });
set('summary-view', { label: 'Multi-Document Save Summary', data: { content: { kind: 'markdown', value: '## Save the relationship without losing the place\n\nIntergraph edits dirty both endpoint documents. Save remains in place; Save All makes both graph-local references durable.' } } });
set('icon-view', { label: 'Multi-Document Save Icon', data: { content: { kind: 'svg', value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='28' fill='#0f172a'/><rect x='35' y='55' width='95' height='110' rx='16' fill='#1d4ed8'/><rect x='190' y='55' width='95' height='110' rx='16' fill='#059669'/><path d='M130 93h60M190 127h-60' stroke='#f8fafc' stroke-width='12' stroke-linecap='round'/><path d='m176 77 18 16-18 16M144 111l-18 16 18 16' fill='none' stroke='#f8fafc' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/><circle cx='82' cy='110' r='18' fill='#bfdbfe'/><circle cx='238' cy='110' r='18' fill='#a7f3d0'/><text x='160' y='200' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='16' font-weight='800'>SAVE SET</text></svg>" } } });
set('glyph', { label: 'Multi-Document Save Glyph', data: { glyph: { kind: 'icon', name: 'Save' } } });
set('landing-surface', {
  label: 'Multi-Document Intergraph Save Landing Surface',
  data: { content: { kind: 'markdown', value: '# Save the relationship without losing your place\n\nHow should one intergraph edge remain discoverable from both graphs, save every affected document, and preserve the author’s exact canvas context?\n\nUse **Explore idea** to enter the working graph.' } }
});

graph.timestamp = now;
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
