const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '../../templates/idea-template/root.node');
const output = path.join(__dirname, 'root.node');
const graph = JSON.parse(fs.readFileSync(source, 'utf8'));
const prefix = 'edge-label-navigation-';

const remap = (value) => {
  if (Array.isArray(value)) return value.map(remap);
  if (!value || typeof value !== 'object') {
    if (value === 'idea-template') return 'edge-label-navigation';
    if (typeof value === 'string' && value.startsWith('idea-template-')) {
      return `${prefix}${value.slice('idea-template-'.length)}`;
    }
    return value;
  }
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, remap(child)]));
};

const result = remap(graph);
const now = new Date().toISOString();
result.metadata = {
  ...result.metadata,
  title: 'Edge and Label Navigation',
  description: 'Define graph-native focus navigation through edges and edge labels at navigation zoom.',
  graphId: 'edge-label-navigation-declaration',
  version: '0.1.0',
  created: now,
  modified: now,
  tags: ['idea', 'navigation', 'focus', 'edges', 'semantic-zoom'],
};

const byId = (suffix) => result.nodes.find((node) => node.id === `${prefix}${suffix}`);
const setData = (suffix, patch) => Object.assign(byId(suffix).data, patch);

Object.assign(byId('declaration'), {
  label: 'Edge and Label Navigation Declaration',
});
Object.assign(byId('detail-view'), { label: 'Edge and Label Navigation Detail View' });
setData('detail-view', {
  content: {
    kind: 'markdown',
    value: '# Edge and Label Navigation\n\nAt 1× zoom and above, graph relationships become navigation controls. Clicking an edge or its label focuses the destination without erasing the distinction between focus, selection, and editing.',
  },
});
Object.assign(byId('summary-view'), { label: 'Edge and Label Navigation Summary View' });
setData('summary-view', {
  content: {
    kind: 'markdown',
    value: '## Navigate through relationships\n\nUse edges and their labels to move focus, preserve viewport history, and enter the destination through the relationship the author exposed.',
  },
});
Object.assign(byId('icon-view'), { label: 'Edge and Label Navigation Icon View' });
setData('icon-view', {
  content: {
    kind: 'svg',
    value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='28' fill='#0f172a'/><circle cx='78' cy='110' r='24' fill='#60a5fa'/><circle cx='242' cy='70' r='24' fill='#34d399'/><circle cx='242' cy='158' r='24' fill='#f59e0b'/><path d='M102 105 C145 82 176 78 218 72 M102 116 C148 135 176 151 218 157' fill='none' stroke='#e2e8f0' stroke-width='10' stroke-linecap='round'/><path d='M205 58l18 14-20 11M205 143l18 14-20 11' fill='none' stroke='#e2e8f0' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/><text x='160' y='205' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='18' font-weight='800'>NAVIGATE</text></svg>",
  },
});
Object.assign(byId('glyph'), { label: 'Navigation Glyph' });
setData('glyph', { glyph: { kind: 'icon', name: 'Route' } });
Object.assign(byId('landing-surface'), { label: 'Edge and Label Navigation Landing Surface' });
setData('landing-surface', {
  content: {
    kind: 'markdown',
    value: '# Edge and Label Navigation\n\nMake the graph itself navigable at 1× and above: edge labels and edges move focus to their destination, navigation history restores prior focus and viewport, and editing remains unambiguous.',
  },
});

setData('idea', {
  title: 'Relationships Become Navigation Controls',
  statement: 'At navigation zoom, clicking an edge label or edge should focus the destination node and frame its navigation surface.',
  status: 'interesting',
  confidence: 'supported',
  notes: 'Navigation should follow authored graph structure instead of inventing a separate menu hierarchy.',
});
setData('idea-problem', {
  title: 'Visible Structure Is Not Yet Traversable Structure',
  statement: 'Twilite shows meaningful relationships, but users still have to hunt for and click the destination node itself.',
  impact: 'Dense graphs remain diagrams to inspect instead of interfaces to travel through.',
  urgency: 'high',
});
setData('idea-audience', {
  title: 'Graph Browsers and Authors',
  description: 'People navigating with mouse, touch, keyboard, or assistive technology, plus authors who need editing gestures to remain predictable.',
  needs: 'Fast traversal without losing context or accidentally mutating the graph.',
});
setData('idea-proposed-approach', {
  title: 'Focus the Relationship Destination',
  description: 'At 1× or greater, activate edges and labels as navigation surfaces. Resolve a destination, focus it, frame its landing surface, and push the prior focus and viewport onto navigation history.',
  differentiator: 'The graph remains the navigation model; no parallel routing tree is required.',
});
setData('idea-question', {
  title: 'How Does an Edge Choose Its Destination?',
  question: 'For directed, bidirectional, and currently focused edges, which endpoint should a click focus, and when should the UI require an explicit choice?',
  status: 'open',
  answer: '',
});
setData('idea-assumption', {
  title: 'Focus Can Drive Navigation Without Becoming Selection',
  assumption: 'The existing focus model can own navigation context and camera framing while selection remains available for editing.',
  status: 'supported',
  validation: 'Prove the rule in a smoke graph containing directed, bidirectional, portal, and editable edges.',
});
setData('idea-research', {
  title: 'Existing Focus and Interaction Contracts',
  question: 'What prior work constrains this behavior?',
  findings: 'Focus model: github://mikemartinez1974/public/ideas/focus-model.node\nFocus specification: github://mikemartinez1974/public/qa/focus-model-spec.node\nInteraction roadmap: github://mikemartinez1974/public/tasks/interaction-semantic-zoom-roadmap/root.node',
});
setData('idea-evidence', {
  title: 'Twilite Already Has the Required State',
  claim: 'Semantic zoom, focused-node presentation, portals, entry surfaces, browser back, and edge interaction already provide the ingredients for relationship navigation.',
  source: 'Current runtime behavior and the completed focus/semantic-zoom work.',
  strength: 'strong',
});
setData('idea-alternative', {
  title: 'Author Explicit Navigation Targets',
  description: 'Require navigation metadata on every edge instead of inferring the destination from endpoints and current focus.',
  tradeoff: 'More precise, but burdens ordinary graph authoring and duplicates information already present in directed relationships.',
});
setData('idea-risk', {
  title: 'Navigation Collides With Edge Editing',
  description: 'Clicking or dragging an edge can mean focus, selection, endpoint reassignment, or navigation.',
  likelihood: 'high',
  impact: 'high',
  mitigation: 'Browse mode navigates. Edit mode gives focused edge controls priority; a plain activation may navigate only when no edit gesture is underway.',
});
setData('idea-next-step', {
  title: 'Build the Navigation Interaction Smoke Test',
  action: 'Create a small graph that proves edge-label focus, edge focus, back restoration, portal entry, bidirectional choice, and edit-mode non-interference.',
  expectedEvidence: 'Every navigation gesture lands on the intended node and surface, while edge selection and reconnection remain functional.',
  status: 'todo',
});

result.timestamp = now;
result.nodeCount = result.nodes.length;
result.edgeCount = result.edges.length;
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
