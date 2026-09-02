const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'root.node');
const templateDir = path.resolve(__dirname, '../../templates/plan-template');
const classDir = path.join(templateDir, 'classes', 'nodes');
const graph = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
const templateGraph = JSON.parse(fs.readFileSync(path.join(templateDir, 'root.node'), 'utf8'));

const graphId = 'public-root-arrival-declaration';
const classTypes = [
  'plan',
  'plan-goal',
  'plan-phase',
  'plan-action',
  'plan-milestone',
  'plan-decision',
  'plan-constraint',
  'plan-risk',
  'plan-contingency',
];

const classPorts = new Map(classTypes.map((type) => {
  const classGraph = JSON.parse(fs.readFileSync(path.join(classDir, `${type}.node-class.node`), 'utf8'));
  const declaration = classGraph.nodes.find((node) => node.type === 'declaration');
  return [type, declaration.data.nodeClass.nodeDef.ports];
}));

const clone = (value) => JSON.parse(JSON.stringify(value));
const handlesFor = (ports) => ports.map((item) => ({ ...item, portId: item.id }));
const layer = (name) => ({ presentation: { layer: name } });

const positions = {
  'public-root-arrival-plan': { x: 720, y: 0 },
  'public-root-arrival-goal': { x: 1240, y: 0 },
  'public-root-arrival-inventory': { x: 0, y: 360 },
  'public-root-arrival-paths': { x: 480, y: 360 },
  'public-root-arrival-disclosure': { x: 960, y: 360 },
  'public-root-arrival-validate': { x: 1440, y: 360 },
  'public-root-arrival-inventory-action': { x: 0, y: 720 },
  'public-root-arrival-learn-action': { x: 480, y: 720 },
  'public-root-arrival-explore-action': { x: 480, y: 1080 },
  'public-root-arrival-reveal-action': { x: 960, y: 720 },
  'public-root-arrival-state-action': { x: 960, y: 1080 },
  'public-root-arrival-qa-action': { x: 1440, y: 720 },
  'public-root-arrival-decision': { x: 0, y: 1080 },
  'public-root-arrival-milestone': { x: 1440, y: 1080 },
  'public-root-arrival-boundary': { x: 0, y: 1440 },
  'public-root-arrival-semantic': { x: 960, y: 1440 },
  'public-root-arrival-risk': { x: 1440, y: 1440 },
  'public-root-arrival-contingency': { x: 1920, y: 1440 },
};

for (const node of graph.nodes) {
  if (!classPorts.has(node.type)) continue;
  const ports = clone(classPorts.get(node.type));
  node.ports = ports;
  node.handles = handlesFor(ports);
  node.width = 360;
  node.height = 220;
  node.position = positions[node.id] || node.position;
}

const declaration = graph.nodes.find((node) => node.id === graphId);
declaration.data.identity.version = '1.1.0';
declaration.data.document = { url: 'github://mikemartinez1974/public/plans/public-root-arrival/root.node' };
declaration.data.dependencies = {
  ...(declaration.data.dependencies || {}),
  portContracts: ['core', 'plan-edge-port-contract@0.1.0'],
  skills: ['plan-template'],
};

const templateDeclaration = templateGraph.nodes.find((node) => node.type === 'declaration');
const declarationPorts = clone(templateDeclaration.ports);
declaration.ports = declarationPorts;
declaration.handles = handlesFor(declarationPorts);

const roleConfig = {
  'plan.achieves': { sourcePort: 'goal', targetPort: 'plan', color: '#059669', width: 3 },
  'plan.precedes': { sourcePort: 'next', targetPort: 'previous', color: '#1d4ed8', width: 2 },
  'plan.produces': { sourcePort: 'outcome', targetPort: 'input', color: '#15803d', width: 3 },
  'plan.gates': { sourcePort: 'outcomes', targetPort: 'gate', color: '#b45309', width: 2 },
  'plan.constrained-by': { sourcePort: 'support', targetPort: 'subject', color: '#64748b', width: 2, dash: [8, 6] },
  'plan.threatened-by': { sourcePort: 'support', targetPort: 'subject', color: '#be123c', width: 2, dash: [8, 6] },
  'plan.mitigated-by': { sourcePort: 'mitigation', targetPort: 'trigger', color: '#6d28d9', width: 2 },
};

const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
const contractRoles = new Set([
  'default-view', 'shared-summary', 'shared-icon', 'shared-glyph',
  'landing-surface', 'exposes-port', 'class-authority', 'instantiates',
]);

for (const edge of graph.edges) {
  const role = String(edge.data?.semanticRole || edge.data?.role || '').trim();
  const sourceNode = nodeById.get(edge.source);
  const targetNode = nodeById.get(edge.target);
  const isPlanSemantic = role.startsWith('plan.');

  if (isPlanSemantic) {
    let config = roleConfig[role];
    if (role === 'plan.contains') {
      config = sourceNode?.type === 'plan'
        ? { sourcePort: 'phases', targetPort: 'parent', color: '#334155', width: 2 }
        : { sourcePort: 'actions', targetPort: 'parent', color: '#1d4ed8', width: 2 };
    } else if (role === 'plan.constrained-by' && sourceNode?.type === 'plan') {
      config = { ...config, sourcePort: 'constraints' };
    } else if (role === 'plan.produces' && targetNode?.type === 'plan-decision') {
      config = { ...config, targetPort: 'input' };
    }
    if (!config) throw new Error(`No endpoint contract for ${role} on edge ${edge.id}.`);
    edge.type = role;
    edge.sourcePort = config.sourcePort;
    edge.sourceHandle = config.sourcePort;
    edge.targetPort = config.targetPort;
    edge.targetHandle = config.targetPort;
    edge.style = { stroke: config.color, strokeWidth: config.width, dash: config.dash || [], curved: true };
    edge.data = { ...(edge.data || {}), semanticRole: role, ...layer('semantic') };
    continue;
  }

  const inferredRole = String(edge.data?.role || edge.label || '').trim().toLowerCase();
  if (contractRoles.has(inferredRole) || sourceNode?.type === 'declaration' || sourceNode?.type === 'bridge') {
    edge.hidden = true;
    edge.label = '';
    edge.style = { stroke: '#64748b', strokeWidth: 1, opacity: 0.03 };
    edge.data = { ...(edge.data || {}), role: inferredRole, ...layer('contract') };
    if (inferredRole === 'class-authority') {
      edge.sourcePort = 'class-authority';
      edge.sourceHandle = 'class-authority';
      edge.targetPort = 'root';
      edge.targetHandle = 'root';
    } else if (inferredRole === 'instantiates') {
      edge.sourcePort = 'root';
      edge.sourceHandle = 'root';
      edge.targetPort = 'root';
      edge.targetHandle = 'root';
    } else {
      edge.sourcePort = edge.sourcePort || edge.sourceHandle;
      edge.targetPort = edge.targetPort || edge.targetHandle || 'root';
      edge.sourceHandle = edge.sourceHandle || edge.sourcePort;
      edge.targetHandle = edge.targetHandle || edge.targetPort;
    }
  }
}

const bridgeNodes = graph.nodes.filter((node) => node.type === 'bridge');
bridgeNodes.forEach((node, index) => {
  node.position = { x: -1900, y: -700 + index * 125 };
  node.width = 250;
  node.height = 90;
});

graph.metadata.version = '1.1.0';
graph.metadata.modified = '2026-09-02T19:00:00.000Z';
graph.metadata.template = {
  ref: 'github://mikemartinez1974/public/templates/plan-template/root.node',
  version: '0.4.0',
  edgePortContract: '0.1.0',
};
graph.settings = {
  ...graph.settings,
  snapToGrid: true,
  gridSize: 20,
  edgeRouting: 'orthogonal',
  layout: { mode: 'manual', defaultLayout: 'layered', direction: 'RIGHT', edgeLaneGapPx: 18 },
};

fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
