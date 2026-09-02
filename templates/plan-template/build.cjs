const fs = require('fs');
const path = require('path');

const VERSION = '0.4.0';
const GRAPH_ID = 'plan-template-declaration';
const ROOT_REF = 'github://mikemartinez1974/public/templates/plan-template/root.node';
const CLASS_BASE = 'github://mikemartinez1974/public/templates/plan-template/classes/nodes';
const outputPath = path.join(__dirname, 'root.node');
const classDir = path.join(__dirname, 'classes', 'nodes');

const rootPort = { id: 'root', key: 'root', label: 'root', direction: 'bidirectional', dataType: 'any', angle: 225 };
const port = (id, direction, angle, roles, repeatable = true) => ({
  id,
  key: id,
  label: id.replaceAll('-', ' '),
  direction,
  dataType: 'any',
  angle,
  allowedEdgeTypes: roles,
  metadata: { semantic: true, roles, repeatable },
});

const classes = [
  {
    key: 'plan', label: 'Plan', color: '#334155', accent: '#38bdf8', icon: 'Route',
    meaning: 'The coordinated path from current state to desired outcome.',
    ports: [port('goal', 'output', 0, ['plan.achieves'], false), port('phases', 'output', 80, ['plan.contains']), port('constraints', 'output', 100, ['plan.constrained-by']), rootPort],
  },
  {
    key: 'plan-goal', label: 'Goal', color: '#047857', accent: '#34d399', icon: 'Flag',
    meaning: 'The desired end state the plan is intended to achieve.',
    ports: [port('plan', 'input', 180, ['plan.achieves'], false), rootPort],
  },
  {
    key: 'plan-phase', label: 'Phase', color: '#1d4ed8', accent: '#60a5fa', icon: 'Layers',
    meaning: 'A meaningful stage of execution.',
    ports: [port('parent', 'input', 270, ['plan.contains'], false), port('previous', 'input', 180, ['plan.precedes'], false), port('next', 'output', 0, ['plan.precedes'], false), port('actions', 'output', 80, ['plan.contains']), port('support', 'output', 100, ['plan.constrained-by', 'plan.threatened-by']), rootPort],
  },
  {
    key: 'plan-action', label: 'Action', color: '#0e7490', accent: '#22d3ee', icon: 'Play',
    meaning: 'Something that should happen within the plan.',
    ports: [port('parent', 'input', 270, ['plan.contains'], false), port('outcome', 'output', 350, ['plan.produces']), port('decision', 'output', 10, ['plan.gates', 'plan.branches-to']), port('support', 'output', 90, ['plan.requires', 'plan.constrained-by', 'plan.threatened-by']), rootPort],
  },
  {
    key: 'plan-milestone', label: 'Milestone', color: '#15803d', accent: '#4ade80', icon: 'CheckCircle',
    meaning: 'A checkpoint or achieved state that marks progress.',
    ports: [port('input', 'input', 180, ['plan.produces']), port('next', 'output', 0, ['plan.gates']), rootPort],
  },
  {
    key: 'plan-decision', label: 'Decision', color: '#b45309', accent: '#fbbf24', icon: 'GitFork',
    meaning: 'A branch whose outcome changes the path.',
    ports: [port('input', 'input', 180, ['plan.produces', 'plan.gates']), port('outcomes', 'output', 90, ['plan.gates', 'plan.branches-to']), rootPort],
  },
  {
    key: 'plan-constraint', label: 'Constraint', color: '#475569', accent: '#94a3b8', icon: 'Fence',
    meaning: 'A condition that limits available paths.',
    ports: [port('subject', 'input', 270, ['plan.constrained-by', 'plan.requires']), rootPort],
  },
  {
    key: 'plan-risk', label: 'Risk', color: '#be123c', accent: '#fb7185', icon: 'TriangleAlert',
    meaning: 'Something that may derail or degrade the plan.',
    ports: [port('subject', 'input', 270, ['plan.threatened-by']), port('mitigation', 'output', 0, ['plan.mitigated-by']), rootPort],
  },
  {
    key: 'plan-contingency', label: 'Contingency', color: '#6d28d9', accent: '#a78bfa', icon: 'ShieldCheck',
    meaning: 'A prepared response to an adverse condition or outcome.',
    ports: [port('trigger', 'input', 180, ['plan.mitigated-by', 'plan.branches-to']), rootPort],
  },
];

const classRef = (key) => `${CLASS_BASE}/${key}.node-class.node`;
const handlesFor = (ports) => ports.map((item) => ({ ...item, portId: item.id }));
const layer = (name) => ({ presentation: { layer: name } });

function cardHtml(def, level) {
  const titleSize = level === 'detail' ? 24 : 18;
  const body = level === 'detail' ? '<p style="margin:10px 0 0;color:#475569;font-size:14px;line-height:1.45">{{data.description}}</p>' : '';
  return `<div style="box-sizing:border-box;height:100%;overflow:hidden;border:1px solid #cbd5e1;border-top:5px solid ${def.accent};border-radius:6px;background:#ffffff;color:#0f172a;padding:16px 18px;font-family:system-ui"><div style="color:${def.color};font-size:12px;font-weight:800;text-transform:uppercase">${def.label}</div><div style="margin-top:8px;font-size:${titleSize}px;font-weight:750;line-height:1.15">{{data.title}}</div>${body}<div style="margin-top:12px;color:#64748b;font-size:11px;text-transform:uppercase">{{data.status}}</div></div>`;
}

function contractEdge(id, source, target, sourcePort, targetPort, role) {
  return {
    id,
    type: role === 'default-view' ? 'default-view' : 'reference',
    hidden: true,
    source,
    target,
    sourceHandle: sourcePort,
    targetHandle: targetPort,
    sourcePort,
    targetPort,
    label: '',
    style: { stroke: '#64748b', strokeWidth: 1, opacity: 0.03 },
    data: { role, semanticRole: role, ...layer('contract') },
  };
}

function buildClass(def) {
  const graphId = `${def.key}-class`;
  const declarationId = `${def.key}-declaration`;
  const interfacePorts = [
    port('default-view', 'output', 165, ['default-view'], false),
    port('summary-view', 'output', 180, ['reference'], false),
    port('icon-view', 'output', 195, ['reference'], false),
    port('glyph', 'output', 270, ['reference'], false),
    port('port', 'output', 90, ['reference']),
    port('landing-surface', 'output', 0, ['reference'], false),
  ];
  const identity = { graphId, nodeId: def.key };
  const nodes = [
    {
      id: declarationId,
      type: 'declaration',
      label: `${def.label} Declaration`,
      position: { x: 0, y: -480 },
      width: 400,
      height: 340,
      ports: interfacePorts,
      handles: handlesFor(interfacePorts),
      data: {
        identity: { ...identity, name: `${def.label} Node Class`, version: VERSION, description: def.meaning },
        intent: { kind: 'node-class', scope: 'local' },
        declaration: {
          kind: 'node-class',
          targetMode: 'artifact',
          artifactKind: 'node-class',
          defaultSurfaceId: 'root',
          interfaceContract: { version: 1, implicitRootPort: true },
          surfaces: [{
            id: 'root', kind: 'port', label: def.label, portNodeId: `${def.key}-root-port`,
            presentation: {
              detail: { mode: 'shared', viewNodeId: `${def.key}-detail-view` },
              summary: { mode: 'shared', viewNodeId: `${def.key}-summary-view` },
              icon: { mode: 'shared', viewNodeId: `${def.key}-icon-view` },
            },
          }],
          sharedPresentation: {
            detailViewNodeId: `${def.key}-detail-view`,
            summaryViewNodeId: `${def.key}-summary-view`,
            iconViewNodeId: `${def.key}-icon-view`,
            glyphNodeId: `${def.key}-glyph`,
          },
          primaryNodeViewId: `${def.key}-detail-view`,
          primaryEditorViewId: `${def.key}-editor-view`,
          portViewNodeId: `${def.key}-root-port`,
        },
        nodeClass: {
          contractVersion: '1.1.0',
          key: def.key,
          label: def.label,
          meaning: def.meaning,
          requiredDataKeys: ['title'],
          nodeDef: {
            key: def.key,
            ref: classRef(def.key),
            source: 'local',
            version: `>=${VERSION}`,
            defaults: {
              label: def.label,
              size: { width: 360, height: 220 },
              color: def.color,
              showLabel: false,
              data: { title: '', description: '', status: 'draft', notes: '', presentation: { glyph: { kind: 'icon', name: def.icon } } },
            },
            ports: def.ports,
          },
        },
        dependencies: { nodeTypes: ['declaration', 'port', 'view', 'content', 'glyph'], portContracts: ['core', 'plan-edge-port-contract@0.1.0'] },
      },
    },
    {
      id: `${def.key}-root-port`, type: 'port', label: `${def.label} Root Port`, position: { x: 520, y: -440 }, width: 320, height: 180,
      ports: def.ports, handles: handlesFor(def.ports),
      data: { identity, title: def.label, interfaceContract: { version: 1, role: 'class.root' } },
    },
    {
      id: `${def.key}-detail-view`, type: 'view', label: `${def.label} Detail`, position: { x: -520, y: 0 }, width: 400, height: 250,
      ports: [rootPort], handles: handlesFor([rootPort]), data: { identity, view: { intent: 'node', payload: 'node.web.detail' }, semanticLevel: 'detail', html: cardHtml(def, 'detail') },
    },
    {
      id: `${def.key}-summary-view`, type: 'view', label: `${def.label} Summary`, position: { x: -520, y: 310 }, width: 340, height: 180,
      ports: [rootPort], handles: handlesFor([rootPort]), data: { identity, view: { intent: 'node', payload: 'node.web.summary' }, semanticLevel: 'summary', html: cardHtml(def, 'summary') },
    },
    {
      id: `${def.key}-icon-view`, type: 'view', label: `${def.label} Icon`, position: { x: -520, y: 550 }, width: 240, height: 140,
      ports: [rootPort], handles: handlesFor([rootPort]),
      data: { identity, view: { intent: 'node', payload: 'node.web.icon' }, semanticLevel: 'icon', html: `<div style="box-sizing:border-box;height:100%;border:1px solid #cbd5e1;border-top:5px solid ${def.accent};border-radius:6px;background:#fff;padding:14px;font-family:system-ui;color:${def.color};font-size:12px;font-weight:800;text-transform:uppercase">${def.label}<div style="margin-top:9px;color:#0f172a;font-size:16px;text-transform:none">{{data.title}}</div></div>` },
    },
    {
      id: `${def.key}-editor-view`, type: 'view', label: `${def.label} Editor`, position: { x: 0, y: 390 }, width: 420, height: 220,
      ports: [rootPort], handles: handlesFor([rootPort]), data: { identity, view: { intent: 'editor', payload: 'node.editor' }, semanticLevel: 'editor' },
    },
    {
      id: `${def.key}-glyph`, type: 'glyph', label: `${def.label} Glyph`, position: { x: 520, y: -200 }, width: 220, height: 140,
      ports: [rootPort], handles: handlesFor([rootPort]), data: { identity, glyph: { kind: 'icon', name: def.icon, color: def.color } },
    },
    {
      id: `${def.key}-landing-content`, type: 'content', label: `${def.label} Landing Surface`, position: { x: 520, y: 40 }, width: 400, height: 200,
      ports: [rootPort], handles: handlesFor([rootPort]), data: { identity, content: { kind: 'markdown', value: `## ${def.label}\n\n${def.meaning}` }, renderShape: { kind: 'markdown' } },
    },
  ];
  const edges = [
    contractEdge(`${def.key}-default-view`, declarationId, `${def.key}-detail-view`, 'default-view', 'root', 'default-view'),
    contractEdge(`${def.key}-summary-view`, declarationId, `${def.key}-summary-view`, 'summary-view', 'root', 'shared-summary'),
    contractEdge(`${def.key}-icon-view`, declarationId, `${def.key}-icon-view`, 'icon-view', 'root', 'shared-icon'),
    contractEdge(`${def.key}-glyph-edge`, declarationId, `${def.key}-glyph`, 'glyph', 'root', 'shared-glyph'),
    contractEdge(`${def.key}-port-edge`, declarationId, `${def.key}-root-port`, 'port', 'root', 'exposes-port'),
    contractEdge(`${def.key}-landing-surface`, declarationId, `${def.key}-landing-content`, 'landing-surface', 'root', 'landing-surface'),
  ];
  return {
    fileVersion: '1.0',
    metadata: { title: `${def.label} Node Class`, description: def.meaning, graphId, version: VERSION, tags: ['node-class', 'plan-template'], preferredViewer: 'https://twilite.zone' },
    nodes,
    edges,
    clusters: [],
    settings: { edgeRouting: 'orthogonal', layout: { mode: 'manual', defaultLayout: 'layered', direction: 'RIGHT' }, autoSave: false },
  };
}

function semanticNode(def, id, position) {
  return {
    id,
    type: def.key,
    label: def.label,
    position,
    width: 360,
    height: 220,
    ports: def.ports,
    handles: handlesFor(def.ports),
    data: {
      title: def.label,
      description: def.meaning,
      status: 'draft',
      notes: '',
      definitionKey: def.key,
      _classBinding: { key: def.key, sourceRef: classRef(def.key) },
      _bridge: { classKey: def.key, classRef: classRef(def.key) },
      presentation: { glyph: { kind: 'icon', name: def.icon } },
    },
  };
}

function semanticEdge(id, type, source, target, sourcePort, targetPort, label, color, dash = []) {
  return {
    id,
    type,
    source,
    target,
    sourceHandle: sourcePort,
    targetHandle: targetPort,
    sourcePort,
    targetPort,
    label,
    style: { stroke: color, strokeWidth: type === 'plan.achieves' || type === 'plan.produces' ? 3 : 2, dash, curved: true },
    data: { semanticRole: type, ...layer('semantic') },
  };
}

function templateSvg(kind) {
  if (kind === 'icon') return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='12' fill='#f8fafc'/><path d='M50 110h58m24 0h56m24 0h58' stroke='#64748b' stroke-width='7' stroke-linecap='round'/><circle cx='50' cy='110' r='25' fill='#334155'/><circle cx='120' cy='110' r='25' fill='#2563eb'/><circle cx='200' cy='110' r='25' fill='#0e7490'/><circle cx='270' cy='110' r='25' fill='#15803d'/><path d='m264 110 7 7 14-18' fill='none' stroke='#fff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/><text x='160' y='176' text-anchor='middle' fill='#0f172a' font-family='system-ui' font-size='17' font-weight='700'>PLAN</text></svg>";
  if (kind === 'summary') return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'><rect width='640' height='360' rx='12' fill='#f8fafc'/><text x='34' y='46' fill='#0f172a' font-family='system-ui' font-size='22' font-weight='750'>PLAN TEMPLATE</text><text x='34' y='73' fill='#64748b' font-family='system-ui' font-size='14'>A readable path from intent to outcome</text><path d='M80 164h110m70 0h110m70 0h110' stroke='#94a3b8' stroke-width='5'/><rect x='34' y='120' width='92' height='88' rx='6' fill='#334155'/><rect x='178' y='120' width='92' height='88' rx='6' fill='#2563eb'/><rect x='322' y='120' width='92' height='88' rx='6' fill='#0e7490'/><rect x='466' y='120' width='140' height='88' rx='6' fill='#15803d'/><g fill='#fff' font-family='system-ui' font-size='13' font-weight='700' text-anchor='middle'><text x='80' y='169'>PLAN</text><text x='224' y='169'>PHASE</text><text x='368' y='169'>ACTION</text><text x='536' y='169'>MILESTONE</text></g><g font-family='system-ui' font-size='12'><circle cx='116' cy='272' r='8' fill='#475569'/><text x='132' y='276' fill='#334155'>constraint</text><circle cx='270' cy='272' r='8' fill='#be123c'/><text x='286' y='276' fill='#334155'>risk</text><circle cx='382' cy='272' r='8' fill='#b45309'/><text x='398' y='276' fill='#334155'>decision</text><circle cx='500' cy='272' r='8' fill='#6d28d9'/><text x='516' y='276' fill='#334155'>contingency</text></g></svg>";
  return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 420'><rect width='720' height='420' rx='12' fill='#f8fafc'/><rect x='0' y='0' width='720' height='72' rx='12' fill='#0f172a'/><rect x='0' y='58' width='720' height='14' fill='#0f172a'/><text x='34' y='44' fill='#fff' font-family='system-ui' font-size='24' font-weight='750'>PLAN TEMPLATE</text><text x='34' y='112' fill='#475569' font-family='system-ui' font-size='14'>Coordinate intent, execution, decisions, and safeguards.</text><path d='M110 206h110m70 0h110m70 0h110' stroke='#94a3b8' stroke-width='5'/><g font-family='system-ui' font-size='14' font-weight='700' text-anchor='middle'><rect x='36' y='158' width='148' height='96' rx='6' fill='#334155'/><text x='110' y='211' fill='#fff'>PLAN</text><rect x='216' y='158' width='148' height='96' rx='6' fill='#2563eb'/><text x='290' y='211' fill='#fff'>PHASE</text><rect x='396' y='158' width='148' height='96' rx='6' fill='#0e7490'/><text x='470' y='211' fill='#fff'>ACTION</text><rect x='576' y='158' width='108' height='96' rx='6' fill='#15803d'/><text x='630' y='211' fill='#fff'>RESULT</text></g><path d='M470 254v54H216' fill='none' stroke='#be123c' stroke-width='4' stroke-dasharray='8 7'/><circle cx='216' cy='308' r='15' fill='#be123c'/><text x='245' y='314' fill='#475569' font-family='system-ui' font-size='13'>Risks and constraints stay below the main path</text><text x='360' y='382' text-anchor='middle' fill='#0f172a' font-family='system-ui' font-size='15' font-weight='700'>SEMANTIC EDGES FIRST. INFRASTRUCTURE REMAINS AVAILABLE.</text></svg>";
}

function buildRoot() {
  const declarationPorts = [
    port('default-view', 'output', 165, ['default-view'], false),
    port('summary-view', 'output', 180, ['reference'], false),
    port('icon-view', 'output', 195, ['reference'], false),
    port('glyph', 'output', 270, ['reference'], false),
    port('port', 'output', 90, ['reference']),
    port('landing-surface', 'output', 0, ['reference'], false),
    port('class-authority', 'output', 225, ['reference']),
  ];
  const identity = { graphId: GRAPH_ID, nodeId: 'plan-graph' };
  const nodes = [
    {
      id: GRAPH_ID, type: 'declaration', label: 'Plan Template Declaration', position: { x: -1900, y: -760 }, width: 400, height: 360,
      ports: declarationPorts, handles: handlesFor(declarationPorts),
      data: {
        identity: { ...identity, name: 'Plan Template', version: VERSION, description: 'Template for coordinating goals, phases, actions, milestones, decisions, constraints, risks, and contingencies.' },
        intent: { kind: 'graph', scope: 'shared' },
        document: { url: ROOT_REF },
        dependencies: { nodeTypes: ['declaration', 'port', 'view', 'content', 'glyph', 'plan', 'plan-goal', 'plan-phase', 'plan-action', 'plan-milestone', 'plan-decision', 'plan-constraint', 'plan-risk', 'plan-contingency'], portContracts: ['core', 'plan-edge-port-contract@0.1.0'], skills: ['plan-template'], schemaVersions: { nodes: '>=1.0.0', ports: '>=1.0.0' }, optional: [] },
        authority: { mutation: { allowCreate: true, allowUpdate: true, allowDelete: true, appendOnly: false }, actors: { humans: true, agents: true, tools: true }, styleAuthority: 'descriptive' },
        declaration: {
          kind: 'template', targetMode: 'artifact', artifactKind: 'graph-template', defaultSurfaceId: 'root', interfaceContract: { version: 1, implicitRootPort: true },
          surfaces: [{ id: 'root', kind: 'port', label: 'Plan Template', portNodeId: 'plan-template-root-port', presentation: { detail: { mode: 'shared', viewNodeId: 'plan-template-detail-view' }, summary: { mode: 'shared', viewNodeId: 'plan-template-summary-view' }, icon: { mode: 'shared', viewNodeId: 'plan-template-icon-view' } }, exposes: { views: { mode: 'allow' }, declarations: { mode: 'allow' } } }],
          sharedPresentation: { detailViewNodeId: 'plan-template-detail-view', summaryViewNodeId: 'plan-template-summary-view', iconViewNodeId: 'plan-template-icon-view', glyphNodeId: 'plan-template-glyph' },
          primaryNodeViewId: 'plan-template-detail-view', iconViewNodeId: 'plan-template-icon-view', portViewNodeId: 'plan-template-root-port',
        },
      },
    },
    { id: 'plan-template-root-port', type: 'port', label: 'Plan Template', position: { x: -1430, y: -760 }, width: 320, height: 180, ports: [rootPort], handles: handlesFor([rootPort]), data: { identity, title: 'Plan Template', summary: 'Coordinate a readable path from intent to outcome.', interfaceContract: { version: 1, role: 'template.root' } } },
    { id: 'plan-template-detail-view', type: 'view', label: 'Plan Template Detail', position: { x: -2450, y: -760 }, width: 480, height: 300, ports: [rootPort], handles: handlesFor([rootPort]), data: { identity, view: { intent: 'node', payload: 'node.web.detail' }, semanticLevel: 'detail', content: { kind: 'svg', value: templateSvg('detail') } } },
    { id: 'plan-template-summary-view', type: 'view', label: 'Plan Template Summary', position: { x: -2450, y: -400 }, width: 420, height: 230, ports: [rootPort], handles: handlesFor([rootPort]), data: { identity, view: { intent: 'node', payload: 'node.web.summary' }, semanticLevel: 'summary', content: { kind: 'svg', value: templateSvg('summary') } } },
    { id: 'plan-template-icon-view', type: 'view', label: 'Plan Template Icon', position: { x: -2450, y: -110 }, width: 300, height: 180, ports: [rootPort], handles: handlesFor([rootPort]), data: { identity, view: { intent: 'node', payload: 'node.web.icon' }, semanticLevel: 'icon', content: { kind: 'svg', value: templateSvg('icon') } } },
    { id: 'plan-template-glyph', type: 'glyph', label: 'Plan Template Glyph', position: { x: -1430, y: -520 }, width: 220, height: 140, ports: [rootPort], handles: handlesFor([rootPort]), data: { identity, glyph: { kind: 'icon', name: 'Route', color: '#334155' }, interfaceContract: { version: 1, receivesGlyphDefinition: true } } },
    { id: 'plan-template-landing-content', type: 'content', label: 'Plan Template Landing Surface', position: { x: -1430, y: -300 }, width: 440, height: 220, ports: [rootPort], handles: handlesFor([rootPort]), data: { identity, content: { kind: 'markdown', value: '## Plan Template\n\nCoordinate goals, phases, actions, milestones, decisions, constraints, risks, and contingencies as one readable path.' }, renderShape: { kind: 'markdown' } } },
  ];

  const positions = {
    plan: { x: 0, y: 0 }, 'plan-goal': { x: 520, y: 0 }, 'plan-phase': { x: 0, y: 360 }, 'plan-action': { x: 0, y: 720 },
    'plan-milestone': { x: 520, y: 720 }, 'plan-decision': { x: 1040, y: 720 }, 'plan-constraint': { x: -520, y: 1080 },
    'plan-risk': { x: 0, y: 1080 }, 'plan-contingency': { x: 520, y: 1080 },
  };
  for (const def of classes) nodes.push(semanticNode(def, `plan-template-${def.key}`, positions[def.key]));

  for (const [index, def] of classes.entries()) {
    nodes.push({
      id: `plan-template-class-bridge-${def.key}`, type: 'bridge', label: `${def.label} class`, position: { x: -1900, y: 40 + index * 125 }, width: 250, height: 90, visible: true, showLabel: true,
      ports: [rootPort], handles: handlesFor([rootPort]),
      data: {
        target: { mode: 'bridge', label: 'Create', kind: 'node-class', key: def.key, ref: classRef(def.key), resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'] },
        intent: 'external', resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'], authority: 'bridge',
        bridge: { ref: classRef(def.key), resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'] },
        _classBinding: { key: def.key, ref: classRef(def.key), sourceRef: classRef(def.key) },
        _bridge: { sourceRef: classRef(def.key), entryPort: 'root', kind: 'node-class', targetKind: 'node-class', classKey: def.key, classRef: classRef(def.key) },
        identity: { graphId: GRAPH_ID },
      },
    });
  }

  nodes.push({
    id: 'plan-template-instructions', type: 'markdown', label: 'Using This Template', position: { x: 1040, y: 0 }, width: 520, height: 260,
    data: { identity: { graphId: GRAPH_ID }, markdown: '## Build a readable path\n\nKeep **Plan** and **Goal** as anchors. Duplicate the remaining vocabulary only when the plan needs it.\n\nUse named semantic ports. Sequence reads left to right, containment reads top to bottom, and supporting conditions stay below the execution path.\n\nSee `SKILL.md` and `EDGE_AND_PORT_CONTRACT.md` before deriving a graph.' },
  });

  const edges = [
    contractEdge('template-default', GRAPH_ID, 'plan-template-detail-view', 'default-view', 'root', 'default-view'),
    contractEdge('template-summary', GRAPH_ID, 'plan-template-summary-view', 'summary-view', 'root', 'shared-summary'),
    contractEdge('template-icon', GRAPH_ID, 'plan-template-icon-view', 'icon-view', 'root', 'shared-icon'),
    contractEdge('template-glyph-edge', GRAPH_ID, 'plan-template-glyph', 'glyph', 'root', 'shared-glyph'),
    contractEdge('template-port-edge', GRAPH_ID, 'plan-template-root-port', 'port', 'root', 'exposes-port'),
    contractEdge('template-landing', GRAPH_ID, 'plan-template-landing-content', 'landing-surface', 'root', 'landing-surface'),
    semanticEdge('plan-edge-achieves', 'plan.achieves', 'plan-template-plan', 'plan-template-plan-goal', 'goal', 'plan', 'achieves', '#059669'),
    semanticEdge('plan-edge-contains-phase', 'plan.contains', 'plan-template-plan', 'plan-template-plan-phase', 'phases', 'parent', 'contains', '#334155'),
    semanticEdge('plan-edge-phase-action', 'plan.contains', 'plan-template-plan-phase', 'plan-template-plan-action', 'actions', 'parent', 'contains', '#2563eb'),
    semanticEdge('plan-edge-action-milestone', 'plan.produces', 'plan-template-plan-action', 'plan-template-plan-milestone', 'outcome', 'input', 'produces', '#15803d'),
    semanticEdge('plan-edge-milestone-decision', 'plan.gates', 'plan-template-plan-milestone', 'plan-template-plan-decision', 'next', 'input', 'gates', '#b45309'),
    semanticEdge('plan-edge-action-constraint', 'plan.constrained-by', 'plan-template-plan-action', 'plan-template-plan-constraint', 'support', 'subject', 'constrained by', '#64748b', [8, 6]),
    semanticEdge('plan-edge-action-risk', 'plan.threatened-by', 'plan-template-plan-action', 'plan-template-plan-risk', 'support', 'subject', 'threatened by', '#be123c', [8, 6]),
    semanticEdge('plan-edge-risk-contingency', 'plan.mitigated-by', 'plan-template-plan-risk', 'plan-template-plan-contingency', 'mitigation', 'trigger', 'mitigated by', '#6d28d9'),
    semanticEdge('plan-edge-decision-contingency', 'plan.branches-to', 'plan-template-plan-decision', 'plan-template-plan-contingency', 'outcomes', 'trigger', 'branches to', '#b45309', [5, 5]),
  ];

  for (const def of classes) {
    edges.push(contractEdge(`plan-template-${def.key}-authority`, GRAPH_ID, `plan-template-class-bridge-${def.key}`, 'class-authority', 'root', 'class-authority'));
    edges.push(contractEdge(`plan-template-${def.key}-instantiates`, `plan-template-class-bridge-${def.key}`, `plan-template-${def.key}`, 'root', 'root', 'instantiates'));
  }

  return {
    fileVersion: '1.0',
    metadata: { title: 'Plan Template', description: 'Declaration-first template for coordinating a readable path from current state to a goal.', graphId: GRAPH_ID, version: VERSION, created: '2026-09-01T16:03:00.000Z', modified: '2026-09-02T18:00:00.000Z', tags: ['graph', 'template', 'plan'], preferredViewer: 'https://twilite.zone' },
    nodes,
    edges,
    clusters: [],
    settings: { theme: null, backgroundImage: null, defaultNodeColor: '#334155', defaultEdgeColor: '#64748b', snapToGrid: true, gridSize: 20, edgeRouting: 'orthogonal', layout: { mode: 'manual', defaultLayout: 'layered', direction: 'RIGHT', edgeLaneGapPx: 18 }, autoSave: false },
  };
}

fs.mkdirSync(classDir, { recursive: true });
for (const def of classes) fs.writeFileSync(path.join(classDir, `${def.key}.node-class.node`), `${JSON.stringify(buildClass(def), null, 2)}\n`);
fs.writeFileSync(outputPath, `${JSON.stringify(buildRoot(), null, 2)}\n`);
