const fs = require('fs');
const path = require('path');

const boardPath = path.resolve(__dirname, '../../workboard/root.node');
const board = JSON.parse(fs.readFileSync(boardPath, 'utf8'));
const id = 'workboard-now-multi-declaration-expansion';
const sourceRef = 'github://mikemartinez1974/public/tasks/multi-declaration-expansion/root.node';

if (!board.nodes.some((node) => node.id === id)) {
  const model = board.nodes.find((node) => node.id === 'workboard-now-interaction-roadmap');
  if (!model) throw new Error('Workboard portal model missing');
  const portal = JSON.parse(JSON.stringify(model));
  portal.id = id;
  portal.label = 'Prove Multi-Declaration Expansion';
  portal.position = { x: -520, y: -373 };
  portal.data = {
    ...portal.data,
    memo: 'Prove same-node expansion with a paired host and participant fixture, supported runtime tests, and reversible visual validation.',
    src: sourceRef,
    ref: sourceRef,
    sourceRef,
    endpoint: `${sourceRef}:summary`,
    sourceNodeId: 'multi-declaration-expansion-task-summary-port',
    sourcePayload: 'node.web',
    surfaceId: 'summary',
    target: {
      endpoint: `${sourceRef}:summary`,
      ref: sourceRef,
      mode: 'navigate',
      portId: 'summary',
      surfaceId: 'summary',
      label: 'Open Multi-Declaration Expansion Task',
      handleId: 'root'
    },
    board: {
      laneMode: 'manual',
      lane: 'now',
      rank: 1,
      pinned: true,
      reviewedAt: '2026-08-29',
      sourceState: { status: 'fresh', checkedAt: '2026-08-29' }
    },
    identity: { graphId: 'public-workboard' }
  };
  board.nodes.push(portal);
}

const nowOrder = [
  id,
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
}

board.edges = board.edges.filter((edge) => !/^workboard-edge-now-rank-/.test(edge.id));
for (let index = 0; index < nowOrder.length; index += 1) {
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

board.timestamp = '2026-08-29T00:00:00.000Z';
board.nodeCount = board.nodes.length;
board.edgeCount = board.edges.length;
fs.writeFileSync(boardPath, `${JSON.stringify(board, null, 2)}\n`);
console.log(`Projected ${id}; Now lane has ${nowOrder.length} ordered tasks.`);
