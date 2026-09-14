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
  graphId: 'source-node-edge-lanes-declaration', version: '0.1.0', created: now, modified: now,
  tags: ['idea', 'edges', 'routing', 'lanes', 'ports', 'handles', 'workspace'] };
Object.assign(byId('declaration'), { label: 'Source-Hugging Edge Lanes Declaration' });
Object.assign(byId('detail-view'), { label: 'Source-Hugging Edge Lanes Detail View' });
setData('detail-view', { content: { kind: 'markdown', value: `# Source-Hugging Edge Lanes

**Candidate route:** handle → normal exit → source shoulder → lane merge → corridor → target approach.

Ports and handles behave normally. The graph View derives routing geometry. The authored edge remains one typed relationship with one identity.` } });
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
  description: 'Keep the endpoint at the authored handle. Exit along the handle normal for clearance, turn into a source-hugging shoulder, merge into a deterministic lane, follow the corridor, then use an ordinary target approach. The owning View derives all routing segments.',
  differentiator: 'It organizes presentation without changing Port semantics, edge identity, direction, type, class, or graph topology.'
});
setData('idea-question', {
  title: 'What Exactly Does Hugging Mean?',
  question: 'Should the shoulder follow the nearest source side at a fixed clearance, follow rounded corners when necessary, or use a short orthogonal shelf chosen from the handle direction?',
  status: 'open', answer: 'Candidate: begin with a side-parallel orthogonal shoulder at a View-defined clearance. Add corner following only when the assigned lane requires another side.'
});
setData('idea-assumption', {
  title: 'Lane Assignment Can Remain Derived',
  assumption: 'Stable ordering can be computed from source side, handle position, destination direction, edge identity, and edge class without persisting lane nodes or splitting edges.',
  status: 'testing', validation: 'Move and resize nodes repeatedly; unchanged topology should return the same non-conflicting lane order.'
});
setData('idea-research', {
  title: 'Existing Routing Machinery',
  question: 'Which current mechanisms can support the experiment?',
  findings: 'Twilite already has ordinary Port/handle endpoint resolution, typed EdgeLayer rendering, route pins, bridge aperture spacing, layout.edgeLaneGapPx, and graph/workspace View ownership. Contract: github://twilite-zone/public/library/documentation/contracts/edges/edge-lane-contract.md'
});
setData('idea-evidence', {
  title: 'Boundary Apertures Already Demonstrate Stable Separation',
  claim: 'Workspace bridge apertures already separate several routes deterministically at a boundary while preserving each edge as an ordinary typed relationship.',
  source: 'Current workspace bridge routing and smoke tests.', strength: 'moderate'
});
setData('idea-alternative', {
  title: 'Route Directly From Handle to Lane',
  description: 'Use the shortest segment from every handle to its assigned corridor without a source shoulder.',
  tradeoff: 'Simpler geometry, but crowded fans begin immediately and weaken the visual claim that the edge belongs to its source.'
});
setData('idea-risk', {
  title: 'Shoulders Become Decorative Spaghetti',
  description: 'Fixed offsets can collide with adjacent Ports, labels, node chrome, corners, or other shoulders and can make short edges longer than necessary.',
  likelihood: 'medium', impact: 'high',
  mitigation: 'Allocate shoulders by source side, preserve a corner exclusion zone, collapse the lane phase for short routes, and expose diagnostics before persisting overrides.'
});
setData('idea-next-step', {
  title: 'Build a Routing-Only Smoke Matrix',
  action: 'Render one source with several handles and typed edges toward targets in each quadrant. Compare graph-space and workspace projections through move, resize, semantic zoom, selection, and one route-pin override.',
  expectedEvidence: 'Handles stay fixed; edges hug the source without overlap; lane ordering is stable; typed styling is unchanged; short routes remain sensible; route pins override only the constrained segment.',
  status: 'todo'
});
result.timestamp = now;
result.nodeCount = result.nodes.length;
result.edgeCount = result.edges.length;
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
