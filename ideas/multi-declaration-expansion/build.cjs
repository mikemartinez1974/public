const fs = require('fs');
const path = require('path');

const graphId = 'multi-declaration-expansion';
const templatePath = path.resolve(__dirname, '../../templates/idea-template/root.node');
const outputPath = path.resolve(__dirname, 'root.node');
const graph = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

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
  if (!node) throw new Error(`Missing node ${suffix}`);
  const priorData = node.data || {};
  Object.assign(node, patch);
  if (patch.data) node.data = { ...priorData, ...patch.data };
  return node;
};

const declaration = get('declaration');
declaration.label = 'Multi-Declaration Expansion';
declaration.data.identity = {
  graphId,
  nodeId: graphId,
  name: 'One Node, Multiple Declarations',
  version: '0.1.0',
  description: 'Define how one semantic node participates in multiple graphs and expands another graph without losing identity.'
};
declaration.data.declaration = {
  ...declaration.data.declaration,
  kind: 'idea',
  artifactKind: 'idea-graph'
};

set('idea', {
  label: 'One Node, Multiple Declarations',
  data: {
    title: 'One node can be authored across multiple graphs',
    statement: 'Declarations with the same nodeId and distinct graphIds describe participating graphs of one semantic node; expansion projects another participating graph without creating another identity.',
    status: 'framed',
    confidence: 'plausible',
    notes: 'nodeId answers what the node is. graphId answers which authored graph is currently contributing structure.'
  }
});

set('idea-problem', {
  label: 'Single-Graph Assumption',
  data: {
    title: 'The current authoring model assumes one graph contains the node',
    statement: 'A node may need a product graph, document graph, detail graph, or expandable child graph, but treating those as separate nodes loses shared identity and makes expansion ad hoc.',
    impact: 'Authors duplicate node identity, consumers cannot discover participating graphs reliably, and expansion risks becoming portal-specific navigation.',
    urgency: 'high'
  }
});

set('idea-audience', {
  label: 'Graph Authors and Consumers',
  data: {
    title: 'Graph authors, users, and agents',
    description: 'Anyone authoring or consuming a node whose structure extends beyond one graph.',
    needs: 'They need stable identity, explicit discovery, predictable entry points, and reversible expansion.'
  }
});

set('idea-proposed-approach', {
  label: 'Declaration Membership + Expansion',
  data: {
    title: 'Declare membership; project expansion',
    description: 'Each participating graph contains a declaration with the shared nodeId and its own graphId. The root declaration explicitly relates discoverable participant declarations. A handle selects a participant and expansion projects that graph around the existing node.',
    differentiator: 'Identity remains singular while authored structure, entry ports, navigation, and projection remain graph-local.'
  }
});

set('idea-question', {
  label: 'Root Discovery Contract',
  data: {
    title: 'How does the root discover participating declarations?',
    question: 'Which explicit relationship names graph membership, how are sibling and child declarations addressed, and what happens when more than one participant claims the same role?',
    status: 'open',
    answer: 'Directory discovery may suggest candidates, but authored declaration relationships should establish membership and precedence.'
  }
});

set('idea-assumption', {
  label: 'Shared Node Identity',
  data: {
    title: 'Shared nodeId is the identity invariant',
    statement: 'Two declarations with the same nodeId and different graphIds can safely be treated as contributions to one node when membership is explicitly authored.',
    importance: 'critical',
    status: 'untested'
  }
});

set('idea-research', {
  label: 'Existing Declaration Model',
  data: {
    title: 'Existing graphId and nodeId semantics',
    findings: 'The declaration already separates node identity from graph identity, and class bindings can retain declarations from more than one graph. The missing contract is graph membership discovery and expansion lifecycle.',
    sourceUrl: 'github://twilite-zone/public/products/twilite/root.node',
    sourceType: 'graph'
  }
});

set('idea-evidence', {
  label: 'Observed Multi-Graph Binding',
  data: {
    title: 'The runtime already carries multiple declarations',
    observation: 'Instantiated class bindings have preserved declaration records from root and document graphs while retaining one node definition key.',
    kind: 'observation',
    strength: 'moderate',
    sourceRef: 'github://twilite-zone/public/products/twilite/root.node'
  }
});

set('idea-alternative', {
  label: 'Portal-Only Composition',
  data: {
    title: 'Treat every participating graph as a separate portal node',
    description: 'Keep graph identity separate and navigate between portal instances rather than sharing a semantic node.',
    tradeoffs: 'Simpler discovery, but duplicates identity, weakens semantic continuity, and makes expansion look like ordinary navigation.'
  }
});

set('idea-risk', {
  label: 'Ambiguous Membership',
  data: {
    title: 'Declarations could accidentally merge unrelated graphs',
    description: 'A shared nodeId alone is insufficient authority. Duplicate roles, cycles, unavailable graphs, or conflicting declarations could create ambiguous expansion.',
    likelihood: 'medium',
    impact: 'high',
    mitigation: 'Require explicit membership relationships, stable declaration addresses, deterministic precedence, and visible failure states.'
  }
});

set('idea-next-step', {
  label: 'Two-Graph Expansion Smoke Test',
  data: {
    title: 'Prove one identity across two declarations',
    action: 'Create a root graph and a child graph with the same nodeId, distinct graphIds, explicit membership, one expansion handle, and reversible materialization.',
    expectedEvidence: 'Expansion reveals the child graph around the existing node; navigation enters its declared port; collapse removes only the projection; identity remains unchanged.',
    status: 'todo'
  }
});

set('instructions', {
  label: 'Model Under Discussion',
  data: {
    markdown: '# Model under discussion\n\n- `nodeId` identifies the semantic node.\n- `graphId` identifies one authored graph contributing to it.\n- Explicit declaration relationships establish membership.\n- Ports define graph entry points.\n- Handles invoke navigation or expansion.\n- Expansion projects another participating graph around the same node.\n- Collapse removes the projection, never the node identity.'
  }
});

set('detail-view', {
  label: 'Multi-Declaration Detail',
  data: {
    content: {
      kind: 'markdown',
      value: '# One Node, Multiple Declarations\n\nA node may be authored across several graphs. Expansion should reveal another participating graph without replacing or duplicating the node.'
    }
  }
});
set('summary-view', {
  label: 'Multi-Declaration Summary',
  data: {
    content: {
      kind: 'markdown',
      value: '## Multi-Declaration Expansion\n\nOne identity, several authored graphs, explicit discovery, reversible projection.'
    }
  }
});
set('icon-view', {
  label: 'Multi-Declaration Icon',
  data: {
    content: {
      kind: 'svg',
      value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='28' fill='#0f172a'/><circle cx='160' cy='110' r='34' fill='#38bdf8'/><circle cx='78' cy='72' r='24' fill='#818cf8'/><circle cx='242' cy='72' r='24' fill='#34d399'/><path d='M101 82L132 99M219 82L188 99' stroke='#e2e8f0' stroke-width='10' stroke-linecap='round'/><text x='160' y='184' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='18' font-weight='800'>ONE NODE · MANY GRAPHS</text></svg>"
    }
  }
});
set('glyph', {
  label: 'Expansion Glyph',
  data: { glyph: { kind: 'character', value: '◎' } }
});
set('landing-surface', {
  label: 'Multi-Declaration Landing Surface',
  data: {
    content: {
      kind: 'markdown',
      value: '# Multi-Declaration Expansion\n\nDesign the discovery, navigation, and projection contract for one semantic node authored across multiple graphs.'
    }
  }
});

graph.timestamp = new Date().toISOString();
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
console.log(`Wrote ${graph.nodes.length} nodes and ${graph.edges.length} edges to ${outputPath}`);
