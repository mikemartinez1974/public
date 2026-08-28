const fs = require('fs');

for (const file of process.argv.slice(2)) {
  const graph = JSON.parse(fs.readFileSync(file, 'utf8'));

  for (const node of graph.nodes || []) {
    const handles = [...(node.handles || [])];
    for (const port of node.ports || []) {
      if (handles.some((handle) => handle.id === port.id)) continue;
      handles.push({
        id: port.id,
        label: port.label || port.id,
        direction: port.direction || 'bidirectional',
        dataType: port.dataType || 'any',
        ...(port.angle == null ? {} : { angle: port.angle }),
        ...(port.position == null ? {} : { position: port.position }),
      });
    }
    node.handles = handles;
  }

  for (const edge of graph.edges || []) {
    if (edge.sourceHandle == null && edge.sourcePort != null) edge.sourceHandle = edge.sourcePort;
    if (edge.targetHandle == null && edge.targetPort != null) edge.targetHandle = edge.targetPort;
    delete edge.sourcePort;
    delete edge.targetPort;
    delete edge.sourceAnchor;
    delete edge.targetAnchor;
  }

  fs.writeFileSync(file, `${JSON.stringify(graph, null, 2)}\n`);
}
