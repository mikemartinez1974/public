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
  description: 'Make one logical edge durable as a connected set of ordinary segments across any number of nodes and graph documents without ejecting the author from the composed canvas.',
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
  description: 'Coordinate a connected family of edge segments under one logical identity and save every affected document without disrupting spatial context.'
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
    title: 'Treat one logical edge as a connected family of ordinary segments',
    statement: 'An edge may connect any number of nodes through uniquely identified binary segments that share one logical edge ID. Every segment in that family must form one connected component, and Save coordinates every affected graph while preserving focus, expansion, selection, pan, and zoom.',
    status: 'framed',
    confidence: 'promising',
    notes: 'The model remains useful for simple edges: a normal two-node edge has one segment. Repeating the logical ID extends that same edge through more nodes or graph boundaries without requiring a class-based relationship object.'
  }
});

set('idea-problem', {
  label: 'One Edge Dirties Two Graphs',
  data: {
    title: 'Single-document save cannot finish an edge spanning several graph documents',
    statement: 'Creating, extending, or deleting a logical edge may change segment references in two, three, or more graphs. Saving only the focused file can leave the edge disconnected or undiscoverable elsewhere, while reloading the canvas after save destroys the author’s working context.',
    impact: 'Authors can believe an edge is durable when only part of its connected segment family exists, encounter split relationships after reload, or accidentally save the wrong expanded graph.',
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
  label: 'One Edge · Connected Segments · One Save Set',
  data: {
    title: 'Track the connected edge family and persist every affected document as one logical operation',
    description: 'Give every rendered segment a unique physical ID and let related segments repeat one logical edge ID. The union of segments sharing that logical ID must be connected. Every graph containing participating nodes keeps its local segments or boundary references. Editing the family marks the unique set of affected documents dirty; Save remains in place and Save All persists that set.',
    differentiator: 'This extends ordinary binary edges instead of introducing a special relationship primitive. Parallel edges remain distinct because they use different logical IDs.'
  }
});

set('idea-question', {
  label: 'Atomicity and Authority',
  data: {
    title: 'How should connectivity and atomicity be verified across graph boundaries?',
    question: 'How does Twilite prove that every segment sharing a logical edge ID belongs to one connected component when the participating nodes may be spread across several files, repositories, or independently loaded canvases?',
    status: 'open',
    answer: 'Proposed boundary: validate the complete composed union when it is available, persist addressed boundary continuity in each participating graph, and use a relationship index for independent discovery. Commit same-repository files atomically; otherwise retain an explicit incomplete and retryable dirty set until every segment reference succeeds.'
  }
});

set('idea-assumption', {
  label: 'A Dirty Set Is Understandable',
  data: {
    title: 'Users can understand one action affecting more than one graph',
    statement: 'A concise snackbar and inspectable dirty-document list can communicate that the focused graph was saved while one or more related graphs still need persistence, without forcing navigation or a modal workflow.',
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
    description: 'After drawing or extending the edge, visit and save every graph containing a participating node or boundary segment.',
    tradeoffs: 'Simple implementation, but the burden grows with every participating graph, is easy to forget, and makes connectedness depend on navigation order and procedural bookkeeping.'
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
  label: 'Build the Connected-Edge Save Smoke',
  data: {
    title: 'Prove a connected logical edge across local and intergraph segments',
    action: 'Extend the canonical smoke pair with three participating nodes: two may live in one graph and one in the expanded fragment. Represent the logical edge with uniquely identified segments sharing one logical ID. Add a dirty-document tray, non-navigating Save, Save All, expected-revision guards, and partial-failure recovery.',
    expectedEvidence: 'After one Save All, opening either graph discovers its participation in the same logical edge; the composed union is connected; disconnected reuse of the logical ID fails validation; a parallel edge with a different logical ID remains valid; the canvas stays in place; and simulated conflict leaves an honest retryable dirty state.',
    status: 'todo'
  }
});

set('instructions', {
  type: 'content',
  label: 'Proposed Multi-Document Save Contract',
  data: {
    content: {
      kind: 'markdown',
      value: '# Proposed multi-document save contract\n\n## Logical edge and segments\n\n- Every physical segment retains a unique runtime and persistence `id`\n- Segments may repeat a `logicalEdgeId`\n- All segments sharing a logical ID must form one connected component\n- A normal two-node edge is one segment; chains, branches, and cycles may contain more\n- Disconnected reuse of a logical ID is an error\n- Parallel edges use different logical IDs\n\n## Graph participation\n\nEvery graph containing a participating node stores the local segment or addressed boundary reference needed to discover its participation. The same model works for several nodes in one file, nodes spread across many files, or both at once.\n\n## Dirty documents\n\nCreating, extending, editing, reversing, or deleting the logical edge marks the unique set of affected graph documents dirty. Dirty state belongs to graph documents, not merely the current canvas.\n\n## Save\n\nSave writes the active graph and remains in place. It preserves focus, expansion, pan, zoom, and selection. A snackbar reports success and offers **Save all** when related documents remain dirty.\n\n## Save all\n\nPreflight connectedness, addresses, permissions, expected revisions, and payload ownership for the complete dirty set. Files in one repository and branch should share one Git commit. Cross-repository work may complete in stages, but unsaved documents remain visible and retryable.\n\n## First implementation boundary\n\nThe persistence and dirty-set contract supports any number of segments and documents. The first UI may continue creating ordinary two-node segments; extending an existing logical edge can arrive as a later authoring gesture.\n\n## Failure rule\n\nNever silently split a logical edge, discard a segment reference, reload the root, or report a healthy durable edge after partial success.'
    },
    interfaceContract: { version: 1, receivesViewContent: true },
    identity: { graphId }
  }
});

set('detail-view', { label: 'Multi-Document Save Detail', data: { content: { kind: 'markdown', value: '# Multi-Document Intergraph Save\n\nOne logical edge identity, uniquely identified connected segments across any number of nodes and graphs, a visible dirty set, and save behavior that never ejects the author from the composed canvas.' } } });
set('summary-view', { label: 'Multi-Document Save Summary', data: { content: { kind: 'markdown', value: '## Save the connected edge without losing the place\n\nSegments sharing one logical edge ID must remain connected. Save stays in place; Save All makes every affected graph reference durable.' } } });
set('icon-view', { label: 'Multi-Document Save Icon', data: { content: { kind: 'svg', value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='28' fill='#0f172a'/><rect x='35' y='55' width='95' height='110' rx='16' fill='#1d4ed8'/><rect x='190' y='55' width='95' height='110' rx='16' fill='#059669'/><path d='M130 93h60M190 127h-60' stroke='#f8fafc' stroke-width='12' stroke-linecap='round'/><path d='m176 77 18 16-18 16M144 111l-18 16 18 16' fill='none' stroke='#f8fafc' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/><circle cx='82' cy='110' r='18' fill='#bfdbfe'/><circle cx='238' cy='110' r='18' fill='#a7f3d0'/><text x='160' y='200' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='16' font-weight='800'>SAVE SET</text></svg>" } } });
set('glyph', { label: 'Multi-Document Save Glyph', data: { glyph: { kind: 'icon', name: 'Save' } } });
set('landing-surface', {
  label: 'Multi-Document Intergraph Save Landing Surface',
  data: { content: { kind: 'markdown', value: '# Save the connected edge without losing your place\n\nHow should one logical edge span multiple nodes and graph documents, remain connected and discoverable, save every affected file, and preserve the author’s exact canvas context?\n\nUse **Explore idea** to enter the working graph.' } }
});

graph.timestamp = now;
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
