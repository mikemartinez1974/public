const fs = require('fs');
const path = require('path');

const graphId = 'mcp-copy-paste-workflow';
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

graph.metadata = {
  ...graph.metadata,
  title: 'MCP Without Losing Copy/Paste',
  description: 'Define which Twilite users benefit from MCP and how it complements the existing human-reviewed copy/paste transaction workflow.',
  graphId,
  version: '0.1.0',
  kind: 'idea',
  modified: '2026-08-29T00:00:00.000Z',
  tags: ['idea', 'mcp', 'copy-paste', 'agents', 'transactions', 'authorization']
};

const declaration = get('declaration');
declaration.label = 'MCP Without Losing Copy/Paste';
declaration.data.identity = {
  graphId,
  nodeId: graphId,
  name: 'MCP Without Losing Copy/Paste',
  version: '0.1.0',
  description: 'Explore MCP as an optional connected transport for live graph collaboration while preserving copy/paste as Twilite’s universal reviewed workflow.'
};
declaration.data.declaration = {
  ...declaration.data.declaration,
  kind: 'idea',
  artifactKind: 'idea-graph'
};
declaration.data.dependencies = {
  ...declaration.data.dependencies,
  nodeTypes: [...new Set((declaration.data.dependencies?.nodeTypes || []).filter((type) => type !== 'markdown').concat('content'))]
};

set('idea', {
  label: 'MCP Complements Copy/Paste',
  data: {
    title: 'MCP should shorten the loop without replacing the clipboard',
    statement: 'Twilite can expose live graph context and bounded mutation tools through MCP for connected agents while keeping copy/paste as the portable, inspectable, human-approved path into the same transaction interpreter.',
    status: 'framed',
    confidence: 'promising',
    notes: 'The invariant is the transaction contract. Clipboard paste and MCP are transports with different setup, context, review, and automation characteristics.'
  }
});

set('idea-problem', {
  label: 'Two Bad Extremes',
  data: {
    title: 'Manual transfer is costly, but mandatory integration excludes users',
    statement: 'Copy/paste makes every read-modify-verify cycle manual and can leave an agent working from stale context. Requiring MCP would add installation, authorization, client compatibility, and trust complexity to a workflow that currently works with almost any AI assistant.',
    impact: 'Twilite either remains unnecessarily laborious for connected-agent users or sacrifices its unusually accessible cross-assistant workflow.',
    urgency: 'medium'
  }
});

set('idea-audience', {
  label: 'Three User Modes',
  data: {
    title: 'Clipboard users, connected-agent users, and integrators',
    description: 'Clipboard users collaborate with any assistant and deliberately review each transaction. Connected-agent users work through Codex, an IDE, a desktop client, or another MCP host that can maintain live context. Integrators administer repositories, permissions, shared tools, and repeatable automation.',
    needs: 'Clipboard users need portability and an obvious consent boundary. Connected agents need live reads, bounded tools, results, and fewer context transfers. Integrators need stable schemas, auditability, revocation, and repository-scoped authorization.'
  }
});

set('idea-proposed-approach', {
  label: 'One Contract · Two Transports',
  data: {
    title: 'Keep one interpreter behind clipboard paste and MCP',
    description: 'Continue accepting pasteable transaction envelopes in the UI. Add a Twilite MCP server that exposes addressed graphs as resources and exposes the existing bounded read, validate, propose, apply, save, and verify operations as tools. Both paths enter the same validator and mutation interpreter and return the same result shape.',
    differentiator: 'MCP supplies live context, session continuity, and lower-friction round trips; it does not create a second graph API or bypass Twilite’s transaction and authority rules.'
  }
});

set('idea-question', {
  label: 'First MCP Boundary',
  data: {
    title: 'What is the first bounded MCP promise?',
    question: 'Should the first slice be read-only graph resources, validated mutation proposals requiring in-app approval, or authorized direct application with a returned diff and verification result?',
    status: 'open',
    answer: 'The safest useful progression appears to be read current graph, propose the same transaction used by copy/paste, then require explicit Twilite approval before apply. Direct application can remain a later permission.'
  }
});

set('idea-assumption', {
  label: 'Transaction Contract Is the Invariant',
  data: {
    title: 'MCP and paste can share one command language',
    statement: 'The existing paste interpreter and GraphCRUD operations are sufficiently bounded and structured to become the internal execution contract behind MCP tools without inventing parallel mutation semantics.',
    importance: 'critical',
    status: 'untested'
  }
});

set('idea-research', {
  label: 'Current Clipboard Workflow',
  data: {
    title: 'Twilite already interprets transactional AI output',
    findings: 'The current product accepts AI-generated graph JSON and command envelopes through paste, validates and interprets them, applies GraphCRUD operations, lays out results, and exposes success or failure. The clipboard currently supplies transport, user review, and consent in one manual step.',
    sourceUrl: 'github://twilite-zone/public/library/documentation/OnboardLLM.md',
    sourceType: 'graph-documentation'
  }
});

set('idea-evidence', {
  label: 'Existing Interpreter Surface',
  data: {
    title: 'Paste actions already map to bounded graph operations',
    observation: 'Twilite’s paste handler and interpreter already route named operations such as create, update, delete, expand, and collapse into GraphCRUD and return structured results. MCP can invoke this same layer rather than becoming a privileged back door.',
    kind: 'code-observation',
    strength: 'strong',
    sourceRef: 'github://twilite-zone/public'
  }
});

set('idea-alternative', {
  label: 'MCP Replaces Copy/Paste',
  data: {
    title: 'Make connected tool use the primary authoring path',
    description: 'Require users to connect an MCP-capable assistant and let it read and mutate graphs directly.',
    tradeoffs: 'This reduces manual transfer but excludes assistants and environments without MCP, obscures the consent checkpoint, increases support and security burden, and risks maintaining separate semantics for connected and clipboard users.'
  }
});

set('idea-risk', {
  label: 'Invisible Authority Escalation',
  data: {
    title: 'Convenience could silently remove review and scope boundaries',
    description: 'A connected agent may read more graph or repository context than intended, apply stale or overly broad mutations, or make direct tool execution feel equivalent to the deliberately reviewed paste workflow when it is not.',
    likelihood: 'medium',
    impact: 'high',
    mitigation: 'Scope resources and tools to addressed graphs, reuse transaction validation, show proposed deltas in Twilite, require explicit approval by default, record results, and make direct apply a separately granted capability.'
  }
});

set('idea-next-step', {
  label: 'One Operation · Two Paths',
  data: {
    title: 'Compare a Content-node update through paste and MCP',
    action: 'Specify one small operation: read an addressed Content node, change its text, validate the delta, apply it, and verify the result. Express the identical operation once as a pasteable transaction and once as MCP resource/tool calls.',
    expectedEvidence: 'Both paths reach the same interpreter and yield the same graph delta and result; MCP eliminates manual context transfer while Twilite retains an explicit approval boundary.',
    status: 'todo'
  }
});

set('instructions', {
  type: 'content',
  label: 'Working Distinction',
  data: {
    content: {
      kind: 'markdown',
      value: '# Working distinction\n\n## Copy/paste\n- works with nearly any assistant\n- requires no account connection or protocol host\n- makes the proposed transaction visible before application\n- uses manual context transfer and verification\n\n## MCP\n- serves users with a connected MCP-capable agent\n- can read current addressed graph state directly\n- shortens repeated read, change, and verify loops\n- requires explicit resource, tool, authorization, and audit boundaries\n\n## Product rule\n\nMCP must call the same bounded transaction contract. It should remove transport friction, not remove user agency.',
    },
    interfaceContract: { version: 1, receivesViewContent: true },
    identity: { graphId }
  }
});

set('detail-view', {
  label: 'MCP and Copy/Paste Detail',
  data: { content: { kind: 'markdown', value: '# MCP Without Losing Copy/Paste\n\nDefine MCP as an optional connected-agent transport over Twilite’s existing graph transaction contract.' } }
});
set('summary-view', {
  label: 'MCP and Copy/Paste Summary',
  data: { content: { kind: 'markdown', value: '## One contract · two transports\n\nCopy/paste remains universal and reviewed. MCP adds live context and shorter loops for connected-agent users.' } }
});
set('icon-view', {
  label: 'MCP and Copy/Paste Icon',
  data: { content: { kind: 'svg', value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='28' fill='#111827'/><rect x='42' y='60' width='92' height='100' rx='18' fill='#818cf8'/><rect x='186' y='60' width='92' height='100' rx='18' fill='#34d399'/><path d='M134 92h52M134 128h52' stroke='#f8fafc' stroke-width='12' stroke-linecap='round'/><circle cx='160' cy='92' r='8' fill='#f8fafc'/><circle cx='160' cy='128' r='8' fill='#f8fafc'/><text x='160' y='194' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='17' font-weight='800'>ONE CONTRACT · TWO PATHS</text></svg>" } }
});
set('glyph', { label: 'Connected Paths Glyph', data: { glyph: { kind: 'character', value: '⇄' } } });
set('landing-surface', {
  label: 'MCP and Copy/Paste Landing Surface',
  data: { content: { kind: 'markdown', value: '# MCP Without Losing Copy/Paste\n\nWho needs a connected agent, what should it be allowed to do, and how can MCP shorten the loop without replacing Twilite’s portable reviewed workflow?' } }
});

graph.timestamp = '2026-08-29T00:00:00.000Z';
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
console.log(`Wrote ${graph.nodes.length} nodes and ${graph.edges.length} edges to ${outputPath}`);
