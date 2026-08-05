import fs from 'node:fs';

const completedAt = process.env.COMPLETED_AT || new Date().toISOString();
const taskRef = 'github://mikemartinez1974/public/tasks/type-and-instance-presentation/root.node';
const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const write = (path, graph) => {
  graph.nodeCount = Array.isArray(graph.nodes) ? graph.nodes.length : 0;
  graph.edgeCount = Array.isArray(graph.edges) ? graph.edges.length : 0;
  fs.writeFileSync(path, `${JSON.stringify(graph, null, 2)}\n`, 'utf8');
};
const ports = [
  { id: 'root', label: 'root', direction: 'bidirectional', dataType: 'any', angle: 210 },
  { id: 'top', label: 'top', direction: 'bidirectional', dataType: 'value', angle: 270 },
  { id: 'right', label: 'right', direction: 'bidirectional', dataType: 'value', angle: 0 },
  { id: 'bottom', label: 'bottom', direction: 'bidirectional', dataType: 'value', angle: 90 },
  { id: 'left', label: 'left', direction: 'bidirectional', dataType: 'value', angle: 180 }
];

const activePath = 'tasks/root.node';
const active = read(activePath);
active.nodes = (active.nodes || []).filter((node) => node?.id !== 'task-collection-type-instance-presentation');
active.edges = (active.edges || []).filter((edge) => edge?.id !== 'task-collection-edge-type-instance-presentation');
active.metadata = { ...(active.metadata || {}), modified: completedAt };
write(activePath, active);

const archivePath = 'tasks/archive/2026/q3.node';
const archive = read(archivePath);
archive.metadata = { ...(archive.metadata || {}), modified: completedAt };
const portal = {
  id: 'task-archive-type-instance-presentation',
  type: 'portal',
  label: 'Type and Instance Presentation',
  position: { x: 1080, y: 80 },
  width: 500,
  height: 320,
  ports,
  visible: true,
  showLabel: true,
  data: {
    memo: 'Archived projection of the completed Type and Instance Presentation task graph.',
    authority: 'navigate',
    intent: 'external',
    src: taskRef,
    ref: taskRef,
    sourceRef: taskRef,
    sourceNodeId: 'type-instance-task-root-port',
    sourcePayload: 'node.web.summary',
    surfaceId: 'root',
    endpoint: `${taskRef}:root`,
    target: {
      endpoint: `${taskRef}:root`,
      ref: taskRef,
      mode: 'navigate',
      portId: 'root',
      surfaceId: 'root',
      handleId: 'root',
      label: 'Open Type and Instance Presentation'
    },
    identity: { graphId: 'task-archive-2026-q3' },
    security: 'prompt',
    visibilityRole: 'browser',
    archive: {
      status: 'done',
      completedAt,
      outcome: 'Implemented the durable Document contract, stable Legend type identity, authored node specimens, and labeled compact edge specimens.'
    }
  }
};
const existingNodeIndex = archive.nodes.findIndex((node) => node?.id === portal.id);
if (existingNodeIndex >= 0) archive.nodes[existingNodeIndex] = portal;
else archive.nodes.push(portal);

const edge = {
  id: 'task-archive-type-instance-presentation-edge',
  type: 'reference',
  source: 'task-archive-2026-q3-root-port',
  target: portal.id,
  sourcePort: 'bottom',
  targetPort: 'top',
  label: 'completed task graph',
  style: { curved: true, route: 'curved' },
  data: {}
};
const existingEdgeIndex = archive.edges.findIndex((candidate) => candidate?.id === edge.id);
if (existingEdgeIndex >= 0) archive.edges[existingEdgeIndex] = edge;
else archive.edges.push(edge);

const ids = new Set(archive.nodes.map((node) => node.id));
for (const candidate of archive.edges) {
  if (!ids.has(candidate.source) || !ids.has(candidate.target)) {
    throw new Error(`Archive edge ${candidate.id} has a missing endpoint`);
  }
}
write(archivePath, archive);
console.log('Completed task portal moved into the 2026 Q3 archive.');
