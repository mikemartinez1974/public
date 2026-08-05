import fs from 'node:fs';

const path = 'tasks/type-and-instance-presentation/root.node';
const graph = JSON.parse(fs.readFileSync(path, 'utf8'));
const declaration = graph.nodes.find((node) => node?.id === 'type-instance-task-declaration');
if (!declaration) throw new Error('Type and instance task declaration not found');
if (declaration?.data?.intent?.kind !== 'task') {
  throw new Error('Task intent kind must remain task');
}
declaration.data.declaration = {
  ...(declaration.data.declaration || {}),
  kind: 'graph',
  targetMode: 'artifact',
  artifactKind: 'graph'
};
const rootSurface = declaration.data.declaration.surfaces?.find((surface) => surface?.id === 'root');
if (!rootSurface || rootSurface.kind !== 'port' || rootSurface.viewNodeId !== 'type-instance-task-root-port') {
  throw new Error('Task root surface contract is invalid');
}
fs.writeFileSync(path, `${JSON.stringify(graph, null, 2)}\n`, 'utf8');
console.log('Task intent remains task; declaration now describes a graph artifact.');
