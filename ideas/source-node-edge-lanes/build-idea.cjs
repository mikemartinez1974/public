const fs = require('fs');
const path = require('path');
const source = path.resolve(__dirname, '../../templates/idea-template/root.node');
const output = path.join(__dirname, 'root.node');
const graph = JSON.parse(fs.readFileSync(source, 'utf8'));
const oldPrefix = 'idea-template-';
const prefix = 'source-node-edge-lanes-';
const remap = value => {
  if (Array.isArray(value)) return value.map(remap);
  if (!value || typeof value !== 'object') {
    if (value === 'idea-template') return 'source-node-edge-lanes';
    if (typeof value === 'string' && value.startsWith(oldPrefix)) return prefix + value.slice(oldPrefix.length);
    return value;
  }
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, remap(child)]));
};
const result = remap(graph);
const now = new Date().toISOString();
const byId = suffix => result.nodes.find(node => node.id === prefix + suffix);
const setData = (suffix, patch) => Object.assign(byId(suffix).data, patch);
for (const node of result.nodes || []) {
  const handles = [...(node.handles || [])];
  for (const port of node.ports || []) {
    if (handles.some(handle => handle.id === port.id)) continue;
    handles.push({ id: port.id, key: port.key || port.id, portId: port.id,
      label: port.label || port.id, direction: port.direction || 'bidirectional',
      dataType: port.dataType || 'any', ...(port.angle == null ? {} : { angle: port.angle }),
      ...(port.role == null ? {} : { role: port.role }) });
  }
  node.handles = handles;
}
result.metadata = { ...result.metadata,
  title: 'Source-Hugging Edge Lanes',
  description: 'Explore View-owned edge lanes whose routes leave ordinary handles, hug their source nodes, and merge into stable corridors.',
  graphId: 'source-node-edge-lanes-declaration', version: '0.2.0', created: now, modified: now,
  tags: ['idea', 'edges', 'routing', 'lanes', 'intersections', 'ports', 'handles', 'workspace'] };
Object.assign(byId('declaration'), { label: 'Source-Hugging Edge Lanes Declaration' });
Object.assign(byId('detail-view'), { label: 'Source-Hugging Edge Lanes Detail View' });
setData('detail-view', { content: { kind: 'markdown', value: `# Source-Hugging Edge Lanes

**Candidate route:** handle → normal exit → source shoulder → lane merge → corridor → target approach.

Ports and handles behave normally. The containing graph View or workspace View owns the routing surface and derives the route around its visible obstacles. The authored edge remains one typed relationship with one identity at either scale.

## Intersection vocabulary

- **Crossing:** unrelated routes overlap in projection. Draw a stable hop or bridge; do not create a junction.
- **Junction:** routes intentionally merge into or split from a shared corridor. Draw explicit merge/split geometry.
- **Endpoint:** a relationship terminates at its authored handle, Port, or bridge aperture.

Several edges may occupy one corridor as parallel strands while retaining type, direction, selection, and identity. Bundling is deferred until it can expand back into those member edges without ambiguity.

## First implementation boundary

Use deterministic parallel lanes, non-semantic crossing hops, ordinary typed-edge rendering, and route pins as presentation constraints. Do not introduce lane nodes, manufacture relationships at crossings, or collapse member edges into bundles.` } });
Object.assign(byId('summary-view'), { label: 'Source-Hugging Edge Lanes Summary View' });
setData('summary-view', { content: { kind: 'markdown', value: '## Edge lanes without new graph primitives\n\nAn edge leaves its ordinary handle, stays close to its source node until it reaches a stable lane, then follows that View-owned corridor.' } });
Object.assign(byId('icon-view'), { label: 'Source-Hugging Edge Lanes Icon View' });
setData('icon-view', { content: { kind: 'svg', value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 220' role='img' aria-label='Edges hugging a source node before merging into lanes'><rect width='360' height='220' rx='28' fill='#0b1220'/><rect x='30' y='45' width='100' height='130' rx='22' fill='#24324a' stroke='#67e8f9' stroke-width='4'/><circle cx='130' cy='78' r='7' fill='#f8fafc'/><circle cx='130' cy='142' r='7' fill='#f8fafc'/><path d='M137 78h24q18 0 18 18v16q0 14 14 14h130' fill='none' stroke='#f59e0b' stroke-width='8' stroke-linecap='round'/><path d='M137 142h42q18 0 18-18v-42q0-14 14-14h112' fill='none' stroke='#a78bfa' stroke-width='8' stroke-linecap='round'/><path d='m310 112 16 14-16 14M310 54l16 14-16 14' fill='none' stroke='#f8fafc' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/></svg>" } });
Object.assign(byId('glyph'), { label: 'Edge Lane Glyph' });
setData('glyph', { glyph: { kind: 'icon', name: 'Route' } });
Object.assign(byId('landing-surface'), { label: 'Source-Hugging Edge Lanes Landing Surface' });
setData('landing-surface', { content: { kind: 'markdown', value: '# Source-Hugging Edge Lanes\n\nLet ordinary Ports and handles remain ordinary. Give each edge a calm, legible route that stays with its source node until it merges into a View-owned lane.' } });
setData('idea', {
  title: 'Edges Join Lanes From a Source Shoulder',
  statement: 'After leaving an ordinary handle along its normal, an edge should route close to its source-node boundary until it can merge into a stable lane owned by the current View.',
  status: 'framed', confidence: 'plausible',
  notes: 'The shoulder visually preserves source ownership while the lane organizes longer travel. Neither is a new semantic primitive.'
});
setData('idea-problem', {
  title: 'Edges Enter Shared Space Too Abruptly',
  statement: 'Direct free-space routing makes dense typed relationships fan out immediately, cross nearby content, and lose their visual attachment to the source node.',
  impact: 'Readers struggle to see which node emitted an edge and authors cannot predict how several edges will organize.', urgency: 'high'
});
setData('idea-audience', {
  title: 'Graph Readers and Authors',
  description: 'People reading dense graphs, arranging graph-backed nodes in workspaces, and authoring several relationships from nearby Ports.',
  needs: 'Ordinary handle gestures, stable source attribution, readable parallel routes, and consistent behavior at graph and workspace scales.'
});
setData('idea-proposed-approach', {
  title: 'Derive a Five-Phase Route',
  description: 'Keep the endpoint at the authored handle. Exit along the handle normal for clearance, turn into a source-hugging shoulder, merge into a deterministic lane, follow the corridor, then use an ordinary target approach. Apply the same algorithm inside graph Views and workspace Views; only their coordinate systems and obstacle sets differ.',
  differentiator: 'It organizes presentation across both scales without changing Port semantics, edge identity, direction, type, class, or graph topology.'
});
setData('idea-question', {
  title: 'How Do Intersections Preserve Meaning?',
  question: 'How can crossings, intentional junctions, and endpoints remain visually distinct without creating false graph relationships?',
  status: 'answered', answer: 'A crossing receives a stable non-semantic hop, a junction receives explicit merge or split geometry, and an endpoint retains the existing typed handle or aperture treatment. Crossing order affects presentation only.'
});
setData('idea-assumption', {
  title: 'Lane Assignment Can Remain Derived',
  assumption: 'Stable ordering and crossing priority can be computed from source side, handle position, destination direction, edge identity, and edge class without persisting lane nodes, splitting edges, or changing semantics.',
  status: 'testing', validation: 'Move and resize nodes repeatedly; unchanged topology should return the same non-conflicting lane order.'
});
setData('idea-research', {
  title: 'Existing Routing Machinery',
  question: 'Which current mechanisms can support the experiment?',
  findings: 'Twilite already has ordinary Port/handle endpoint resolution, typed EdgeLayer rendering, route pins, bridge aperture spacing, layout.edgeLaneGapPx, and graph/workspace View ownership. Contract: github://twilite-zone/public/library/documentation/contracts/edges/edge-lane-contract.md'
});
setData('idea-evidence', {
  title: 'Boundary Apertures Already Demonstrate Stable Separation',
  claim: 'Workspace bridge apertures already separate several routes deterministically at a boundary while preserving each edge as an ordinary typed relationship. The same separation principle can produce parallel strands in graph-space and workspace corridors.',
  source: 'Current workspace bridge routing and smoke tests.', strength: 'moderate'
});
setData('idea-alternative', {
  title: 'Bundle Shared Corridors Immediately',
  description: 'Collapse edges traveling together into one aggregate trunk as soon as they enter a shared lane.',
  tradeoff: 'Reduces visual weight, but immediately raises unresolved questions about type, direction, labels, selection, and expansion. Begin with parallel strands and treat bundling as a later semantic-zoom representation.'
});
setData('idea-risk', {
  title: 'Routing Geometry Invents Semantics',
  description: 'A crossing can look like a relationship, a shared corridor can look like one edge, and fixed shoulders can collide with Ports, labels, chrome, corners, or one another.',
  likelihood: 'medium', impact: 'high',
  mitigation: 'Use distinct crossing and junction grammar, retain parallel typed strands, allocate shoulders by source side, preserve corner exclusion zones, collapse unnecessary phases for short routes, and keep derived geometry out of graph semantics.'
});
setData('idea-next-step', {
  title: 'Build a Two-Scale Routing Smoke Matrix',
  action: 'Render equivalent typed-edge arrangements inside one graph and between graph-shaped workspace nodes. Include crossings without relationships, intentional lane merges and splits, parallel shared corridors, targets in every quadrant, and one route-pin override.',
  expectedEvidence: 'Both scales use the same route grammar and typed-edge renderer; handles stay fixed; edges hug their sources; crossings never imply junctions; parallel strands retain identity; ordering is deterministic; short routes remain sensible; route pins constrain presentation only.',
  status: 'todo'
});
result.timestamp = now;
result.nodeCount = result.nodes.length;
result.edgeCount = result.edges.length;
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
