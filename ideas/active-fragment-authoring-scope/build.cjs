const fs = require('fs');
const path = require('path');

const graphId = 'active-fragment-authoring-scope';
const title = 'Active Fragment Authoring Scope';
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
  description: 'Make creation follow the active writable graph fragment so focus, address provenance, ownership, and persistence remain aligned.',
  graphId,
  version: '0.1.0',
  kind: 'idea',
  modified: now,
  tags: ['idea', 'multi-graph', 'fragment', 'authoring', 'provenance', 'focus', 'address-bar', 'persistence']
};

const declaration = get('declaration');
declaration.label = title;
declaration.data.identity = {
  graphId,
  nodeId: graphId,
  name: title,
  version: '0.1.0',
  description: 'Define active fragment focus as an authoring scope, not only a presentation preview.'
};
declaration.data.declaration = { ...declaration.data.declaration, kind: 'idea', artifactKind: 'idea-graph' };
declaration.data.document = { url: graphRef };
declaration.data.settings = {
  ...declaration.data.settings,
  github: { repo: 'mikemartinez1974/public', path: `ideas/${graphId}/root.node`, branch: 'main' }
};

set('idea', {
  label: 'Create Where Focus Says You Are',
  data: {
    title: 'Creation should follow the active writable fragment',
    statement: 'When an author focuses a node in an expanded writable fragment, newly created nodes should belong to that fragment, inherit its durable provenance, preserve fragment focus, and save back to the fragment document.',
    status: 'framed',
    confidence: 'promising',
    notes: 'The address bar should report ownership already established by the node. It must not be patched to display fragment identity while the created node remains host-owned.'
  }
});

set('idea-problem', {
  label: 'Creation Falls Back to Host',
  data: {
    title: 'A new node can silently escape the fragment being authored',
    statement: 'The normal Add Node path creates a node without fragment provenance. Focusing that node clears the fragment address preview and returns the address bar to the committed host because Twilite now considers the node host-owned.',
    impact: 'The visual canvas suggests fragment authoring while ownership and persistence select the host. Authors cannot confidently predict which document will receive their work.',
    urgency: 'high'
  }
});

set('idea-audience', {
  label: 'Multi-Graph Authors',
  data: {
    title: 'People editing expanded fragments inside a host canvas',
    description: 'Authors who focus fragment content, add or connect nodes, inspect the address bar, and expect saving to update the document they are working inside.',
    needs: 'One visible and testable authoring scope whose focus, creation, provenance, address, execution, dirty state, and save destination agree.'
  }
});

set('idea-proposed-approach', {
  label: 'Resolve One Authoring Context',
  data: {
    title: 'Resolve the destination once and apply it throughout creation',
    description: 'Derive an authoring context from the focused node and active fragment. If the fragment is writable, stamp new nodes with canonical identity plus fragment instance and source provenance, retain fragment focus, mark the fragment document dirty, and serialize the node into that fragment. Root focus creates in the host. Read-only fragments reject creation or require an explicit destination choice.',
    differentiator: 'This repairs ownership at the mutation boundary instead of treating the address bar as navigation or preserving a misleading presentation-only preview.'
  }
});

set('idea-question', {
  label: 'Writable Fragment Boundary',
  data: {
    title: 'How is fragment writability resolved before creation?',
    question: 'Which combination of source reference, repository authority, expected revision, expansion mode, and active focus proves that a fragment can accept a new canonical node?',
    status: 'open',
    answer: 'Proposed boundary: resolve an explicit authoring context before mutation. It must name the destination graph reference, fragment instance, canonical-ID policy, persistence target, and capability result. No writable context means no implicit host fallback.'
  }
});

set('idea-assumption', {
  label: 'Focus Can Select Authoring Scope',
  data: {
    title: 'Focused fragment is the least surprising default destination',
    statement: 'When the focused node belongs to a writable fragment, authors expect Add Node to continue authoring that fragment until they explicitly return focus to the host.',
    importance: 'critical',
    status: 'observed'
  }
});

set('idea-research', {
  label: 'Current Creation and Preview Paths',
  data: {
    title: 'Fragment focus and address preview exist, but normal creation does not inherit them',
    findings: 'Focus derives a reloadable fragment ID from node provenance. The address preview derives the fragment URL from `_origin.ref` or `_expansion.sourceRef`. Plugin creation stamps fragment instance metadata, while the normal GraphCRUD creation path assigns host graph identity and does not inherit the active fragment source reference.',
    sourceUrl: 'github://mikemartinez1974/public/ideas/multi-declaration-expansion/root.node',
    sourceType: 'runtime-inspection-and-prior-idea'
  }
});

set('idea-evidence', {
  label: 'Observed Content Node Escape',
  data: {
    title: 'Focusing a newly created Content node returned the address to the host',
    observation: 'With host and fragment open, an existing fragment node was selected. A Content node was created. When that node received focus, the address bar returned to the host. The behavior matches missing fragment provenance on the new node rather than an independent address navigation.',
    kind: 'debug-session-observation',
    strength: 'strong',
    citationSourceId: graphRef
  }
});

set('idea-alternative', {
  label: 'Keep the Fragment Address Visible',
  data: {
    title: 'Suppress address-preview clearing after node creation',
    description: 'Leave the fragment address in the bar even when the focused node lacks fragment provenance.',
    tradeoffs: 'Visually smooth but false: the node remains host-owned, dirty state targets the wrong document, and save can persist somewhere different from the displayed address.'
  }
});

set('idea-risk', {
  label: 'Projected IDs Leak Into Storage',
  data: {
    title: 'Runtime expansion identity may be mistaken for canonical fragment identity',
    description: 'A new node can be scoped to the fragment instance yet serialize with a runtime-namespaced ID or incomplete provenance, producing unstable IDs or duplicates after collapse and reload.',
    likelihood: 'medium',
    impact: 'high',
    mitigation: 'Generate or reserve a canonical node ID at creation, keep runtime instance identity separate, round-trip through fragment serialization, and verify collapse/re-expand stability.'
  }
});

set('idea-next-step', {
  label: 'Build the Fragment Creation Smoke',
  data: {
    title: 'Prove node creation remains inside a writable fragment',
    action: 'Create a minimal host/fragment smoke pair. Expand the fragment, focus one fragment node, add a Content node through the ordinary UI, edit it, save, collapse, and re-expand. Repeat from host focus and with a read-only fragment.',
    expectedEvidence: 'Fragment creation retains the fragment address, carries complete provenance, dirties and saves only the fragment, survives collapse/reload with a stable canonical ID, and does not alter the host. Host focus creates in the host. Read-only fragment creation never silently falls back to the host.',
    status: 'todo'
  }
});

set('instructions', {
  type: 'content',
  label: 'Active Fragment Authoring Contract',
  data: {
    content: {
      kind: 'markdown',
      value: '# Active fragment authoring contract\n\n## One resolved context\n\nBefore a create mutation, resolve one context containing the destination graph reference, fragment instance, canonical-ID policy, capability result, expected revision, and persistence target.\n\n## Writable fragment\n\nIf focus belongs to a writable expanded fragment, creation belongs to that fragment. Stamp complete provenance, preserve focus, dirty the fragment document, and save the canonical node there.\n\n## Host\n\nIf focus belongs to the root host, creation belongs to the host. Returning to host focus is the explicit way to resume host authoring.\n\n## Read-only or unresolved fragment\n\nDo not silently fall back to the host. Reject creation with a clear capability result or require an explicit destination choice.\n\n## Address bar\n\nThe address is evidence of the focused node’s real provenance. It does not choose ownership and must not conceal missing provenance.\n\n## Runtime and persistence identity\n\nKeep fragment instance identity separate from the new node’s canonical persistent ID. Collapse and re-expansion must reproduce the same canonical node exactly once.\n\n## Success invariant\n\nFocused scope, mutation destination, node provenance, dirty document, visible address, and save target all name the same graph.'
    },
    interfaceContract: { version: 1, receivesViewContent: true },
    identity: { graphId }
  }
});

set('detail-view', { label: `${title} Detail`, data: { content: { kind: 'markdown', value: '# Active Fragment Authoring Scope\n\nCreation, focus, provenance, address preview, dirty state, and persistence should resolve to the same writable graph document.' } } });
set('summary-view', { label: `${title} Summary`, data: { content: { kind: 'markdown', value: '## Create where focus says you are\n\nA node created while authoring a writable fragment belongs to that fragment and saves there. Missing fragment authority must never silently redirect creation into the host.' } } });
set('icon-view', { label: `${title} Icon`, data: { content: { kind: 'svg', value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='24' fill='#111827'/><rect x='30' y='42' width='116' height='136' rx='12' fill='#2563eb'/><rect x='174' y='42' width='116' height='136' rx='12' fill='#059669'/><path d='M146 110h28' stroke='#f8fafc' stroke-width='10'/><circle cx='232' cy='110' r='30' fill='#d1fae5'/><path d='M232 92v36M214 110h36' stroke='#047857' stroke-width='9' stroke-linecap='round'/><text x='160' y='205' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='15' font-weight='800'>AUTHOR HERE</text></svg>" } } });
set('glyph', { label: `${title} Glyph`, data: { glyph: { kind: 'icon', name: 'AddLocation' } } });
set('landing-surface', {
  label: `${title} Landing Surface`,
  data: { content: { kind: 'markdown', value: '# Create where focus says you are\n\nHow should Twilite keep a newly created node inside the writable fragment currently being authored, with honest address provenance and durable fragment persistence?\n\nUse **Explore idea** to enter the working graph.' } }
});

graph.timestamp = now;
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
