const fs = require('fs');
const path = require('path');

const dir = __dirname;
const stamp = '2026-08-31T18:00:00.000Z';
const hostRef = 'github://mikemartinez1974/public/graphs/twilite-front-door-smoke/root.node';
const startedRef = 'github://mikemartinez1974/public/graphs/twilite-front-door-smoke/get-started.node';
const demoRef = 'github://mikemartinez1974/public/graphs/twilite-front-door-smoke/see-it.node';

const port = (id, direction = 'bidirectional', dataType = 'any', angle = 0) => ({ id, key: id, label: id, direction, dataType, angle });
const node = (id, type, label, x, y, width, height, data = {}, ports = [port('root')]) => ({
  id, type, label, position: { x, y }, width, height,
  ports, handles: ports.map(p => ({ ...p, portId: p.id })), data
});
const edge = (id, source, target, label, sourceHandle = 'root', targetHandle = 'root', semanticRole = 'navigation') => ({
  id, source, target, sourceHandle, targetHandle, label, type: 'default', data: { semanticRole }
});
const content = (id, label, x, y, value, graphId, root = false, width = 360, height = 210) => ({
  ...node(id, 'content', label, x, y, width, height, { content: { kind: 'markdown', value }, identity: { graphId } }), root
});
const setPorts = (target, ports) => {
  target.ports = ports;
  target.handles = ports.map(p => ({ ...p, portId: p.id }));
  return target;
};
const view = (id, payload, x, y, html, graphId, width = 320, height = 180) => node(id, 'view', payload, x, y, width, height, {
  html, view: { payload }, identity: { graphId }, visibilityRole: 'editor'
}, [port('root', 'input', 'any', 180)]);
const glyph = (id, x, y, graphId) => node(id, 'glyph', 'Twilite', x, y, 90, 90, {
  glyph: '\u2726', view: { payload: 'node.web.glyph' }, identity: { graphId }, visibilityRole: 'editor'
}, [port('root', 'input', 'any', 180)]);

function declarationSet({ graphId, semanticId, title, ref, landingId, summary, kind = 'graph', artifactKind = 'smoke-test', allowEntry = false }) {
  const prefix = graphId;
  const declaration = node(`${prefix}-declaration`, 'declaration', title, -1100, -500, 460, 340, {
    identity: { graphId, nodeId: semanticId, name: title, version: '1.0.0' },
    intent: { kind: 'graph', scope: 'public' },
    declaration: {
      kind, targetMode: 'artifact', artifactKind,
      interfaceContract: { version: 1, implicitRootPort: true },
      defaultSurfaceId: 'detail', landingSurfaceId: 'landing',
      surfaces: [
        { id: 'detail', kind: 'view', payload: 'node.web.detail', viewNodeId: `${prefix}-detail` },
        { id: 'summary', kind: 'view', payload: 'node.web.summary', viewNodeId: `${prefix}-summary` },
        { id: 'icon', kind: 'view', payload: 'node.web.icon', viewNodeId: `${prefix}-icon` },
        { id: 'glyph', kind: 'glyph', payload: 'node.web.glyph', viewNodeId: `${prefix}-glyph` },
        { id: 'landing', kind: 'content', payload: 'node.web.landing', viewNodeId: landingId },
        { id: 'public-summary', kind: 'port', payload: 'node.web.summary', portNodeId: `${prefix}-summary-port`, viewNodeId: `${prefix}-summary` }
      ]
    },
    settings: { autoSave: false, ...(allowEntry ? { expansion: { allowGraphEntry: true } } : {}), layout: { mode: 'manual', direction: 'RIGHT' } },
    document: { url: ref }, visibilityRole: 'editor'
  }, [
    { ...port('default-view', 'output', 'any', 165), role: 'default-view' },
    { ...port('summary-view', 'output', 'any', 180), role: 'shared-summary' },
    { ...port('icon-view', 'output', 'any', 195), role: 'shared-icon' },
    { ...port('glyph', 'output', 'any', 270), role: 'shared-glyph' },
    { ...port('landing-surface', 'output', 'any', 0), role: 'landing-surface' },
    { ...port('port', 'output', 'any', 90), role: 'exposes-port' }
  ]);
  declaration.handles = declaration.ports.map(p => ({ ...p, portId: p.id }));
  const safeTitle = title.replace(/&/g, '&amp;');
  const nodes = [
    declaration,
    view(`${prefix}-detail`, 'node.web.detail', -1100, -80, `<article style="padding:24px;font-family:system-ui;background:#f8fafc;color:#0f172a;height:100%;box-sizing:border-box"><h2 style="margin:0 0 10px">${safeTitle}</h2><p style="color:#334155">${summary}</p></article>`, graphId, 400, 220),
    view(`${prefix}-summary`, 'node.web.summary', -650, -500, `<div style="padding:20px;font-family:system-ui;background:#f8fafc;color:#0f172a;height:100%;box-sizing:border-box"><strong>${safeTitle}</strong><p style="color:#334155">${summary}</p></div>`, graphId),
    node(`${prefix}-icon`, 'view', 'node.web.icon', -650, -260, 180, 130, {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect x="4" y="4" width="152" height="92" rx="18" fill="#172554" stroke="#60a5fa" stroke-width="4"/><circle cx="42" cy="50" r="13" fill="#93c5fd"/><path d="M60 50h55m-15-15 16 15-16 15" fill="none" stroke="#93c5fd" stroke-width="7"/></svg>`,
      view: { payload: 'node.web.icon' }, identity: { graphId }, visibilityRole: 'editor'
    }, [port('root', 'input', 'any', 180)]),
    glyph(`${prefix}-glyph`, -420, -240, graphId),
    node(`${prefix}-summary-port`, 'port', 'Public summary', -620, 20, 280, 150, {
      sourceNodeId: `${prefix}-summary`, sourcePayload: 'node.web.summary', payload: 'node.web.summary', identity: { graphId }, visibilityRole: 'editor'
    }, [port('root', 'input', 'any', 180)])
  ];
  const edges = [
    edge(`${prefix}-detail-edge`, `${prefix}-declaration`, `${prefix}-detail`, 'default view', 'default-view', 'root', 'default-view'),
    edge(`${prefix}-summary-edge`, `${prefix}-declaration`, `${prefix}-summary`, 'summary view', 'summary-view', 'root', 'shared-summary'),
    edge(`${prefix}-icon-edge`, `${prefix}-declaration`, `${prefix}-icon`, 'icon view', 'icon-view', 'root', 'shared-icon'),
    edge(`${prefix}-glyph-edge`, `${prefix}-declaration`, `${prefix}-glyph`, 'glyph', 'glyph', 'root', 'shared-glyph'),
    edge(`${prefix}-landing-edge`, `${prefix}-declaration`, landingId, 'landing surface', 'landing-surface', 'root', 'landing-surface'),
    edge(`${prefix}-port-edge`, `${prefix}-declaration`, `${prefix}-summary-port`, 'public summary', 'port', 'root', 'exposes-port')
  ];
  return { nodes, edges };
}

function graph(metadata, nodes, edges) {
  return {
    fileVersion: '1.0', metadata: { ...metadata, created: stamp, modified: stamp, preferredViewer: 'https://dev.twilite.zone' },
    nodes, edges,
    settings: { theme: null, snapToGrid: false, gridSize: 20, edgeRouting: 'auto', layout: { mode: 'manual', defaultLayout: 'layered', direction: 'RIGHT' } }
  };
}

const hostIdentity = 'twilite-front-door';
const hostDecl = declarationSet({ graphId: 'twilite-front-door-smoke-host', semanticId: hostIdentity, title: 'Twilite Front Door Smoke', ref: hostRef, landingId: 'front-door-welcome', summary: 'A quiet lobby that teaches Twilite by being navigated.' });
const welcome = setPorts(content('front-door-welcome', 'Welcome to Twilite', 85, 80, '# Welcome to Twilite\n\nTurn information, work, and ideas into things you can navigate.\n\nChoose a route. Each edge is part of the experience.', 'twilite-front-door-smoke-host', true, 430, 240), [
  port('root', 'bidirectional', 'any', 180),
  port('get-started', 'output', 'navigation', 70),
  port('see-it', 'output', 'navigation', 90),
  port('explore', 'output', 'navigation', 110)
]);
const portal = (id, label, x, targetRef, landingId, mode, memo) => node(id, 'portal', label, x, 430, 330, 210, {
  sourceRef: targetRef, sourceNodeId: landingId, sourcePayload: 'node.web.landing',
  target: { ref: targetRef, mode, kind: 'graph', entryPort: 'root', label: mode === 'expand' ? `Expand ${label}` : `Open ${label}` },
  memo, security: 'prompt', authority: 'navigate', intent: 'external', identity: { graphId: 'twilite-front-door-smoke-host' }
}, [port('root', 'bidirectional', 'graph', 180)]);
const getStartedPortal = portal('front-door-get-started', 'Get Started', -600, startedRef, 'get-started-landing', 'expand', 'A short path from first visit to a useful shared workspace.');
const seeItPortal = portal('front-door-see-it', 'See What It Does', 100, demoRef, 'see-it-landing', 'expand', 'A small ordinary subject that demonstrates focus, traversal, expansion, and semantic zoom.');
const explorePortal = portal('front-door-explore', 'Explore', 800, 'github://twilite-zone/public/root.node', 'public-root-view', 'navigate', 'Enter the existing public Twilite world without crowding the lobby.');
setPorts(getStartedPortal, [port('root', 'bidirectional', 'graph', 180), port('get-started-entry', 'input', 'navigation', 270)]);
setPorts(seeItPortal, [port('root', 'bidirectional', 'graph', 180), port('see-it-entry', 'input', 'navigation', 270)]);
setPorts(explorePortal, [port('root', 'bidirectional', 'graph', 180), port('explore-entry', 'input', 'navigation', 270)]);
explorePortal.data.sourcePayload = 'node.web.summary';
explorePortal.data.target.entryPort = 'public-root-view';
const host = graph({ title: 'Twilite Front Door Smoke', description: 'Reviewable Graph Lab prototype for the future Twilite public root.', graphId: 'twilite-front-door-smoke-host', version: '1.0.0', kind: 'smoke-test', tags: ['graph-lab','onboarding','front-door','smoke-test'] },
  [...hostDecl.nodes, welcome, getStartedPortal, seeItPortal, explorePortal],
  [...hostDecl.edges,
    edge('front-door-edge-get-started', 'front-door-welcome', 'front-door-get-started', 'get started', 'get-started', 'get-started-entry'),
    edge('front-door-edge-see-it', 'front-door-welcome', 'front-door-see-it', 'see it', 'see-it', 'see-it-entry'),
    edge('front-door-edge-explore', 'front-door-welcome', 'front-door-explore', 'explore', 'explore', 'explore-entry')]
);

function fragment({ graphId, title, ref, landingId, landingLabel, landingCopy, steps }) {
  const decl = declarationSet({ graphId, semanticId: hostIdentity, title, ref, landingId, summary: landingCopy.replace(/^# .+\n\n/, ''), kind: 'graph', artifactKind: 'fragment', allowEntry: true });
  const cards = steps.map((s, i) => content(s.id, s.label, 560 + i * 560, 390, s.copy, graphId, false, 330, 210));
  const landing = content(landingId, landingLabel, 0, 380, landingCopy, graphId, true, 400, 230);
  const relationships = [{ label: 'begin', source: landing, target: cards[0], edgeId: `${graphId}-start` }];
  for (let i = 0; i < cards.length - 1; i++) relationships.push({
    label: steps[i].edge || 'continue', source: cards[i], target: cards[i + 1], edgeId: `${graphId}-step-${i + 1}`
  });
  const endpointPorts = new Map([[landing.id, [port('root', 'bidirectional', 'any', 180)]], ...cards.map(card => [card.id, [port('root', 'bidirectional', 'any', 180)]])]);
  const nav = relationships.map((relationship, index) => {
    const slug = relationship.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const sourceHandle = `${slug}-out-${index + 1}`;
    const targetHandle = `${slug}-in-${index + 1}`;
    endpointPorts.get(relationship.source.id).push(port(sourceHandle, 'output', 'navigation', 0));
    endpointPorts.get(relationship.target.id).push(port(targetHandle, 'input', 'navigation', 180));
    return edge(relationship.edgeId, relationship.source.id, relationship.target.id, relationship.label, sourceHandle, targetHandle);
  });
  for (const item of [landing, ...cards]) setPorts(item, endpointPorts.get(item.id));
  return graph({ title, description: landingCopy.replace(/[#\n]/g, ' ').trim(), graphId, version: '1.0.0', kind: 'graph-fragment', tags: ['graph-lab','front-door','fragment'] }, [...decl.nodes, landing, ...cards], [...decl.edges, ...nav]);
}

const started = fragment({
  graphId: 'twilite-front-door-get-started', title: 'Twilite Get Started', ref: startedRef, landingId: 'get-started-landing', landingLabel: 'Get Started',
  landingCopy: '# Get Started\n\nBuild one useful shared workspace. You do not need to understand every Twilite feature first.',
  steps: [
    { id: 'get-started-home', label: 'Choose where graphs live', copy: '# Choose where graphs live\n\nBrowse public graphs freely. Connect a repository when you are ready to create and keep your own work.', edge: 'then create' },
    { id: 'get-started-first-graph', label: 'Open or create something', copy: '# Open or create something\n\nStart with a template or open a graph you already have. The useful artifact comes before the tutorial.', edge: 'meet the controls' },
    { id: 'get-started-interface', label: 'Meet the interface', copy: '# Meet the interface\n\nFocus a node. Follow an edge. Expand a fragment. Zoom out to see structure instead of detail.', edge: 'share the workspace' },
    { id: 'get-started-ai', label: 'Connect an AI', copy: '# Connect an AI\n\nUse MCP so a connected agent can read the same durable graph you are looking at, while copy and paste remains available.', edge: 'do real work' },
    { id: 'get-started-ready', label: "You're ready", copy: "# You're ready\n\nYou now have a workspace both you and an agent can operate. Pick a real idea or task and keep going." }
  ]
});

const demo = fragment({
  graphId: 'twilite-front-door-see-it', title: 'See Twilite in Motion', ref: demoRef, landingId: 'see-it-landing', landingLabel: 'See What It Does',
  landingCopy: '# See What It Does\n\nThis is not a slide deck. Follow the edge through the information itself, then zoom out and back in.',
  steps: [
    { id: 'see-it-coffee', label: 'Coffee', copy: '# Coffee\n\nA familiar subject is enough. Focus this node, then follow the edge.', edge: 'comes from' },
    { id: 'see-it-beans', label: 'Beans', copy: '# Beans\n\nCoffee begins as the seed of a fruit. The graph can keep context close without showing everything at once.', edge: 'prepared by' },
    { id: 'see-it-brewing', label: 'Brewing', copy: '# Brewing\n\nWater extracts soluble compounds from ground coffee. Traverse again and notice that focus follows the connection.', edge: 'may deliver' },
    { id: 'see-it-caffeine', label: 'Caffeine', copy: '# Caffeine\n\nZoom out until these cards become icons and glyphs, then return. The information stays the same while its presentation changes.' }
  ]
});

for (const [name, value] of [['root.node', host], ['get-started.node', started], ['see-it.node', demo]]) {
  fs.writeFileSync(path.join(dir, name), JSON.stringify(value, null, 2) + '\n');
}
console.log(`Wrote front-door smoke: ${host.nodes.length} host nodes, ${started.nodes.length} onboarding nodes, ${demo.nodes.length} demo nodes.`);
