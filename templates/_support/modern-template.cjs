const relationshipPort = ({ id, label, angle, role, nodeType, required = true, repeatable = false }) => ({
  id,
  key: id,
  label,
  direction: 'output',
  dataType: 'any',
  angle,
  role,
  allowedEdgeTypes: [id === 'default-view' ? 'default-view' : 'reference'],
  metadata: {
    structural: true,
    relationship: true,
    role,
    required,
    repeatable,
    behaviors: [{ trigger: 'drag-create', action: 'create-node', nodeType, targetPort: 'root' }]
  }
});

const bindHandles = (ports) => ports.map((port) => ({
  id: port.id,
  key: port.key || port.id,
  portId: port.id,
  label: port.label || port.id,
  direction: port.direction || 'bidirectional',
  dataType: port.dataType || 'any',
  angle: port.angle,
  ...(port.role ? { role: port.role } : {})
}));

const rootPort = (direction = 'input', angle = 270) => ({
  id: 'root', key: 'root', label: 'root', direction, dataType: 'any', angle
});

const withHandles = (node) => {
  const ports = Array.isArray(node.ports) ? node.ports : [];
  return { ...node, handles: bindHandles(ports) };
};

const makeView = ({ id, label, graphId, semanticLevel, position, content }) => {
  const ports = [
    rootPort('input', 270),
    relationshipPort({
      id: 'surface-delegate', label: 'surface delegate', angle: 90,
      role: 'view.content', nodeType: 'content', required: false
    })
  ];
  return {
    id, type: 'view', label, position, width: 420, height: semanticLevel === 'detail' ? 300 : 240,
    ports, handles: bindHandles(ports), visible: true, showLabel: true,
    data: {
      view: { intent: 'node', payload: `node.web.${semanticLevel}` },
      semanticLevel,
      content,
      interfaceContract: { version: 1, ownsContent: true, surfaceDelegation: true },
      identity: { graphId }
    }
  };
};

const makeModernInterface = ({
  prefix, graphId, nodeId, name, kind, description, glyph = '◆',
  origin = { x: -900, y: -1400 }, dependencies = [], exposePort = null
}) => {
  const specs = [
    ['default-view', 'default view', 165, 'default-view', 'view', true, false],
    ['summary-view', 'summary view', 180, 'shared-summary', 'view', true, false],
    ['icon-view', 'icon view', 195, 'shared-icon', 'view', true, false],
    ['glyph', 'glyph', 270, 'shared-glyph', 'glyph', true, false],
    ['port', 'port', 90, 'exposes-port', 'port', false, true],
    ['landing-surface', 'landing surface', 0, 'landing-surface', 'content', true, false]
  ];
  const ports = specs.map(([id, label, angle, role, type, required, repeatable]) =>
    relationshipPort({ id, label, angle, role, nodeType: type, required, repeatable }));
  const detailId = `${prefix}-detail-view`;
  const summaryId = `${prefix}-summary-view`;
  const iconId = `${prefix}-icon-view`;
  const glyphId = `${prefix}-glyph`;
  const landingId = `${prefix}-landing-surface`;
  const declaration = {
    id: `${prefix}-declaration`, type: 'declaration', label: `${name} Declaration`,
    position: origin, width: 360, height: 240, ports, handles: bindHandles(ports),
    visible: true, showLabel: true,
    data: {
      identity: { graphId, nodeId, name, version: '1.0.0', description },
      intent: { kind, scope: 'shared' },
      declaration: {
        kind, targetMode: 'artifact', artifactKind: kind,
        interfaceContract: { version: 1, implicitRootPort: true },
        defaultSurfaceId: nodeId,
        surfaces: [{
          id: nodeId, kind: 'port', label: name,
          presentation: {
            detail: { mode: 'shared', viewNodeId: detailId },
            summary: { mode: 'shared', viewNodeId: summaryId },
            icon: { mode: 'shared', viewNodeId: iconId }
          },
          exposes: { views: { mode: 'allow' }, declarations: { mode: 'allow' } }
        }],
        sharedPresentation: {
          detailViewNodeId: detailId, summaryViewNodeId: summaryId,
          iconViewNodeId: iconId, glyphNodeId: glyphId
        }
      },
      dependencies: {
        nodeTypes: ['declaration', 'content', 'view', 'glyph', 'port', ...dependencies],
        portContracts: ['core'], schemaVersions: { nodes: '>=1.0.0', ports: '>=1.0.0' }
      },
      authority: {
        mutation: { allowCreate: true, allowUpdate: true, allowDelete: true, appendOnly: false },
        actors: { humans: true, agents: true, tools: true }, styleAuthority: 'descriptive'
      },
      settings: { layout: { mode: 'manual' }, autoSave: false },
      document: { url: '' }
    }
  };
  const nodes = [
    declaration,
    makeView({ id: detailId, label: `${name} Detail`, graphId, semanticLevel: 'detail',
      position: { x: origin.x - 600, y: origin.y - 80 }, content: { kind: 'markdown', value: `# ${name}\n\n${description}` } }),
    makeView({ id: summaryId, label: `${name} Summary`, graphId, semanticLevel: 'summary',
      position: { x: origin.x - 600, y: origin.y + 260 }, content: { kind: 'markdown', value: `## ${name}\n\n${description}` } }),
    makeView({ id: iconId, label: `${name} Icon`, graphId, semanticLevel: 'icon',
      position: { x: origin.x - 600, y: origin.y + 560 }, content: { kind: 'markdown', value: glyph } }),
    withHandles({
      id: glyphId, type: 'glyph', label: `${name} Glyph`, position: { x: origin.x, y: origin.y - 400 },
      width: 220, height: 140, ports: [rootPort('input', 270)], visible: true, showLabel: true,
      data: { glyph: { kind: 'character', value: glyph }, interfaceContract: { version: 1, receivesGlyphDefinition: true }, identity: { graphId } }
    }),
    withHandles({
      id: landingId, type: 'content', label: `${name} Landing Surface`, position: { x: origin.x + 620, y: origin.y - 40 },
      width: 520, height: 320, ports: [rootPort('input', 180)], visible: true, showLabel: true,
      data: { content: { kind: 'markdown', value: `# ${name}\n\n${description}` }, renderShape: { kind: 'markdown' }, identity: { graphId } }
    })
  ];
  const relations = [
    ['default-view', detailId, 'default view', 'default-view'],
    ['summary-view', summaryId, 'summary view', 'shared-summary'],
    ['icon-view', iconId, 'icon view', 'shared-icon'],
    ['glyph', glyphId, 'glyph', 'shared-glyph'],
    ['landing-surface', landingId, 'landing surface', 'landing-surface']
  ];
  if (exposePort) relations.push(['port', exposePort, 'exposes port', 'exposes-port']);
  const edges = relations.map(([sourceHandle, target, label, semanticRole]) => ({
    id: `${prefix}-${sourceHandle}-edge`, type: sourceHandle === 'default-view' ? 'default-view' : 'reference',
    source: declaration.id, target, sourceHandle, targetHandle: 'root', label,
    data: { semanticRole }
  }));
  return { nodes, edges, ids: { declaration: declaration.id, detailId, summaryId, iconId, glyphId, landingId } };
};

module.exports = { bindHandles, makeModernInterface, rootPort, withHandles };
