const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const boardPath = path.join(root, 'workboard', 'root.node');
const archivePath = path.join(root, 'tasks', 'archive', '2026', 'q3.node');
const board = JSON.parse(fs.readFileSync(boardPath, 'utf8'));
const archive = JSON.parse(fs.readFileSync(archivePath, 'utf8'));

const completedId = 'workboard-next-template-standardization';
board.nodes = board.nodes.filter((node) => node.id !== completedId);
board.edges = board.edges.filter((edge) => (
  edge.source !== completedId &&
  edge.target !== completedId &&
  !(edge?.data?.relation === 'board-sequence' && edge?.data?.lane === 'now')
));

const nowOrder = [
  'workboard-now-customer-acquisition',
  'workboard-now-interaction-roadmap',
  'workboard-now-template-video-ui-polish'
];
nowOrder.forEach((id, index) => {
  const task = board.nodes.find((node) => node.id === id);
  if (!task) throw new Error(`Missing workboard task ${id}`);
  task.data = task.data || {};
  task.data.board = {
    ...(task.data.board || {}),
    laneMode: 'manual',
    lane: 'now',
    rank: index + 1,
    pinned: true,
    reviewedAt: '2026-08-28',
    sourceState: { status: 'fresh', checkedAt: '2026-08-28' }
  };
});

const sequence = [
  ['workboard-lane-now', nowOrder[0], 'now · 1'],
  [nowOrder[0], nowOrder[1], 'then · 2'],
  [nowOrder[1], nowOrder[2], 'then · 3']
];
sequence.forEach(([source, target, label], index) => {
  board.edges.push({
    id: `workboard-edge-now-rank-${index + 1}`,
    type: 'reference', source, target,
    sourcePort: 'bottom', targetPort: 'top',
    label, style: { curved: true },
    data: { relation: 'board-sequence', lane: 'now', rank: index + 1 }
  });
});
board.nodeCount = board.nodes.length;
board.edgeCount = board.edges.length;
board.timestamp = new Date().toISOString();

const archiveId = 'task-archive-template-standardization';
if (!archive.nodes.some((node) => node.id === archiveId)) {
  const handles = [
    ['root', 'root', 'bidirectional', 'any', 210],
    ['top', 'top', 'bidirectional', 'value', 270],
    ['right', 'right', 'bidirectional', 'value', 0],
    ['bottom', 'bottom', 'bidirectional', 'value', 90],
    ['left', 'left', 'bidirectional', 'value', 180]
  ].map(([id, label, direction, dataType, angle]) => ({ id, label, direction, dataType, angle, portId: id }));
  archive.nodes.push({
    id: archiveId,
    type: 'portal',
    label: 'Template Standardization and Derivation',
    position: { x: 2100, y: 1080 },
    width: 500, height: 320,
    handles,
    ports: handles.map(({ id, label, direction, dataType, angle }) => ({ id, label, direction, dataType, angle })),
    visible: true, showLabel: false,
    data: {
      memo: 'Archived projection of the completed Template Standardization and Derivation task graph.',
      authority: 'navigate', intent: 'external', security: 'prompt', visibilityRole: 'browser',
      src: 'github://twilite-zone/public/tasks/graph-organization/template-library/template-standardization/root.node',
      ref: 'github://twilite-zone/public/tasks/graph-organization/template-library/template-standardization/root.node',
      sourceRef: 'github://twilite-zone/public/tasks/graph-organization/template-library/template-standardization/root.node',
      sourceNodeId: 'template-standardization-derivation-root-port',
      sourcePayload: 'node.web.summary', surfaceId: 'summary',
      endpoint: 'github://twilite-zone/public/tasks/graph-organization/template-library/template-standardization/root.node:template-standardization-derivation-root-port',
      target: {
        endpoint: 'github://twilite-zone/public/tasks/graph-organization/template-library/template-standardization/root.node:template-standardization-derivation-root-port',
        ref: 'github://twilite-zone/public/tasks/graph-organization/template-library/template-standardization/root.node',
        mode: 'navigate', portId: 'template-standardization-derivation-root-port', handleId: 'template-standardization-derivation-root-port', surfaceId: 'template-standardization-derivation-root-port', label: 'Open Template Standardization and Derivation'
      },
      identity: { graphId: 'task-archive-2026-q3' },
      archive: {
        status: 'done', completedAt: '2026-08-28T00:00:00.000Z',
        outcome: 'Modernized the advertised template library and established the current derivation baseline.',
        sourcePreserved: true
      }
    }
  });
  archive.edges.push({
    id: 'task-archive-template-standardization-edge', type: 'reference',
    source: 'task-archive-2026-q3-root-port', target: archiveId,
    sourcePort: 'bottom', targetPort: 'top', targetHandle: 'top',
    label: 'completed task graph', style: { curved: true, route: 'curved' },
    data: { relation: 'archive-projection' }
  });
}
archive.nodeCount = archive.nodes.length;
archive.edgeCount = archive.edges.length;
archive.timestamp = new Date().toISOString();

fs.writeFileSync(boardPath, `${JSON.stringify(board, null, 2)}\n`);
fs.writeFileSync(archivePath, `${JSON.stringify(archive, null, 2)}\n`);
console.log(`Workboard now has ${board.nodes.length} nodes; archive has ${archive.nodes.length}.`);
