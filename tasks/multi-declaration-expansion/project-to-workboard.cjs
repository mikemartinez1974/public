const fs = require('fs');
const path = require('path');

const boardPath = path.resolve(__dirname, '../../workboard/root.node');
const archivePath = path.resolve(__dirname, '../archive/2026/q3.node');
const board = JSON.parse(fs.readFileSync(boardPath, 'utf8'));
const archive = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
const activeId = 'workboard-now-multi-declaration-expansion';
const archiveId = 'task-archive-multi-declaration-expansion';
const sourceRef = 'github://mikemartinez1974/public/tasks/multi-declaration-expansion/root.node';
const sourceNodeId = 'multi-declaration-expansion-task-summary-port';

board.nodes = board.nodes.filter((node) => node.id !== activeId);
board.edges = board.edges.filter((edge) => edge.source !== activeId && edge.target !== activeId && !/^workboard-edge-now-rank-/.test(edge.id));

const nowOrder = [
  'workboard-now-customer-acquisition',
  'workboard-now-interaction-roadmap',
  'workboard-now-template-video-ui-polish'
];
for (let index = 0; index < nowOrder.length; index += 1) {
  const node = board.nodes.find((entry) => entry.id === nowOrder[index]);
  if (!node?.data?.board) throw new Error(`Now-lane node missing: ${nowOrder[index]}`);
  node.data.board.rank = index + 1;
  node.data.board.reviewedAt = '2026-08-29';
  node.data.board.sourceState = { status: 'fresh', checkedAt: '2026-08-29' };
  board.edges.push({
    id: `workboard-edge-now-rank-${index + 1}`,
    type: 'reference',
    source: index === 0 ? 'workboard-lane-now' : nowOrder[index - 1],
    target: nowOrder[index],
    label: index === 0 ? 'now · 1' : `then · ${index + 1}`,
    style: { curved: true },
    data: { relation: 'board-sequence', lane: 'now', rank: index + 1 },
    sourceHandle: 'bottom',
    targetHandle: 'top'
  });
}

if (!archive.nodes.some((node) => node.id === archiveId)) {
  const model = archive.nodes.find((node) => node.id === 'task-archive-template-standardization');
  if (!model) throw new Error('Archive portal model missing');
  const portal = JSON.parse(JSON.stringify(model));
  portal.id = archiveId;
  portal.label = 'Prove Multi-Declaration Expansion';
  portal.position = { x: 2660, y: 1080 };
  portal.data = {
    ...portal.data,
    memo: 'Archived projection of the completed replacement-style multi-declaration expansion proof.',
    src: sourceRef,
    ref: sourceRef,
    sourceRef,
    sourceNodeId,
    sourcePayload: 'node.web',
    surfaceId: 'summary',
    endpoint: `${sourceRef}:${sourceNodeId}`,
    target: {
      endpoint: `${sourceRef}:${sourceNodeId}`,
      ref: sourceRef,
      mode: 'navigate',
      portId: sourceNodeId,
      handleId: sourceNodeId,
      surfaceId: 'summary',
      label: 'Open Prove Multi-Declaration Expansion'
    },
    identity: { graphId: 'task-archive-2026-q3' },
    archive: {
      status: 'done',
      completedAt: '2026-08-29T00:00:00.000Z',
      outcome: 'Delivered explicit replacement-style same-node expansion with a preserved hidden reference, landing-node Collapse control, provenance, and exact restoration.',
      sourcePreserved: true
    }
  };
  archive.nodes.push(portal);
  archive.edges.push({
    id: `${archiveId}-edge`,
    type: 'reference',
    source: 'task-archive-2026-q3-root-port',
    target: archiveId,
    sourcePort: 'bottom',
    targetPort: 'top',
    targetHandle: 'top',
    label: 'completed task graph',
    style: { curved: true, route: 'curved' },
    data: { relation: 'archive-projection' }
  });
}

board.timestamp = '2026-08-29T00:00:00.000Z';
board.nodeCount = board.nodes.length;
board.edgeCount = board.edges.length;
archive.timestamp = '2026-08-29T00:00:00.000Z';
archive.nodeCount = archive.nodes.length;
archive.edgeCount = archive.edges.length;
fs.writeFileSync(boardPath, `${JSON.stringify(board, null, 2)}\n`);
fs.writeFileSync(archivePath, `${JSON.stringify(archive, null, 2)}\n`);
console.log(`Archived ${archiveId}; active Now lane has ${nowOrder.length} tasks.`);
