import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const classDir = path.join(here, 'classes', 'nodes');

const rootPort = (direction = 'input', angle = 270) => ({
  id: 'root', key: 'root', label: 'root', direction, dataType: 'any', angle,
  metadata: { interface: true, structural: true }
});

const rootHandle = (direction = 'input', angle = 270) => ({
  id: 'root', key: 'root', portId: 'root', label: 'root', direction, dataType: 'any', angle
});

const relationshipPort = ({ id, label, angle, role, nodeType, edgeType = 'reference', required = true, repeatable = false }) => ({
  id, key: id, label, direction: 'output', dataType: 'any', angle, role,
  allowedEdgeTypes: [edgeType],
  metadata: {
    structural: true,
    relationship: true,
    role,
    required,
    repeatable,
    behaviors: [{ trigger: 'drag-create', action: 'create-node', nodeType, targetPort: 'root' }]
  }
});

const declarationPorts = () => [
  relationshipPort({ id: 'default-view', label: 'default view', angle: 165, role: 'default-view', nodeType: 'view', edgeType: 'default-view' }),
  relationshipPort({ id: 'summary-view', label: 'summary view', angle: 180, role: 'shared-summary', nodeType: 'view' }),
  relationshipPort({ id: 'icon-view', label: 'icon view', angle: 195, role: 'shared-icon', nodeType: 'view' }),
  relationshipPort({ id: 'glyph', label: 'glyph', angle: 270, role: 'shared-glyph', nodeType: 'glyph' }),
  relationshipPort({ id: 'port', label: 'port', angle: 90, role: 'exposes-port', nodeType: 'port', required: false, repeatable: true }),
  relationshipPort({ id: 'landing-surface', label: 'landing surface', angle: 0, role: 'landing-surface', nodeType: 'content' })
];

const declarationHandles = (ports) => ports.map((port) => ({
  id: port.id, key: port.id, portId: port.id, label: port.label,
  direction: port.direction, dataType: port.dataType, angle: port.angle, role: port.role
}));

const viewNode = ({ id, label, x, y, width, height, payload, data = {} }) => ({
  id, type: 'view', label, root: false, position: { x, y }, width, height,
  ports: [
    rootPort(),
    relationshipPort({ id: 'surface-delegate', label: 'surface delegate', angle: 90, role: 'view.content', nodeType: 'content', required: false })
  ],
  handles: [
    rootHandle(),
    { id: 'surface-delegate', key: 'surface-delegate', portId: 'surface-delegate', label: 'surface delegate', direction: 'output', dataType: 'any', angle: 90, role: 'view.content' }
  ],
  visible: true,
  showLabel: true,
  data: {
    view: { intent: 'node', payload },
    interfaceContract: { version: 1, ownsContent: true, surfaceDelegation: true },
    ...data
  }
});

const contentNode = ({ id, label, x, y, width, height, kind = 'markdown', value, graphId }) => ({
  id, type: 'content', label, root: false, position: { x, y }, width, height,
  ports: [rootPort()], handles: [rootHandle()], visible: true, showLabel: true,
  data: {
    content: { kind, value },
    interfaceContract: { version: 1, receivesViewContent: true },
    identity: { graphId }
  }
});

const glyphNode = ({ id, label, x, y, graphId, name = 'Language' }) => ({
  id, type: 'glyph', label, root: false, position: { x, y }, width: 240, height: 160,
  ports: [rootPort()], handles: [rootHandle()], visible: true, showLabel: true,
  data: {
    glyph: { kind: 'icon', name },
    interfaceContract: { version: 1, receivesGlyphDefinition: true },
    identity: { graphId }
  }
});

const edge = ({ id, source, sourcePort, target, type = 'reference', label, role }) => ({
  id, type, source, target, sourcePort, targetPort: 'root', label,
  data: { role, semanticRole: role }
});

const attribution = {
  source: 'Wikipedia',
  license: 'CC BY-SA',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/'
};

function declarationNode({ id, nodeId, name, description, classKey, classRef, meaning, defaults, requiredDataKeys, dynamicPorts, position }) {
  const ports = declarationPorts();
  return {
    id, type: 'declaration', label: `${name} Declaration`, root: false,
    position, width: 420, height: 300, ports, handles: declarationHandles(ports), visible: true, showLabel: true,
    data: {
      identity: { graphId: id, nodeId, name, version: '0.2.0', description },
      intent: { kind: 'node-class', scope: 'shared' },
      declaration: {
        kind: 'node-class', targetMode: 'artifact', artifactKind: 'node-class',
        interfaceContract: { version: 1, implicitRootPort: true }, defaultSurfaceId: '', surfaces: []
      },
      nodeClass: {
        contractVersion: '1.0.0', key: classKey, label: name, meaning,
        requiredDataKeys,
        nodeDef: {
          key: classKey, ref: classRef, version: '>=0.2.0',
          defaults,
          dynamicPorts,
          lifecycle: {
            version: 1,
            resolve: {
              trigger: 'authored-identity-change',
              identityPath: classKey === 'wikipedia-article-source' ? 'articleRef' : 'sourceIdentity',
              adapter: classKey === 'wikipedia-article-source' ? 'wikimedia-article-v1' : 'wikimedia-section-v1',
              inputPaths: classKey === 'wikipedia-article-source'
                ? ['articleRef']
                : ['articleRef', 'canonicalUrl', 'articleTitle', 'revisionId', 'sectionId', 'title', 'level', 'order', 'sourceLocator'],
              requiredInputPaths: classKey === 'wikipedia-article-source'
                ? ['articleRef']
                : ['articleRef', 'sectionId', 'sourceLocator'],
              resolverNodeId: classKey === 'wikipedia-article-source' ? 'wikipedia-article-resolver-script' : 'wikipedia-section-resolver-script',
              policy: 'latest-with-revision-provenance',
              preserveLastKnownGoodOnError: true
            }
          }
        }
      }
    }
  };
}

function articleGraph() {
  const graphId = 'wikipedia-article-source-declaration';
  const classRef = 'github://mikemartinez1974/public/templates/wikipedia-article-template/classes/nodes/wikipedia-article-source.node-class.node';
  const dynamicPorts = {
    version: 1,
    sourcePath: 'sections', idPath: 'id', labelPath: 'title', orderPath: 'order',
    direction: 'output', dataType: 'wikipedia-section', placement: { side: 'right' },
    behavior: {
      trigger: 'drag-create', action: 'create-node', nodeType: 'wikipedia-section', targetPort: 'root',
      seed: {
        articleRef: '$node.articleRef', canonicalUrl: '$node.canonicalUrl', articleTitle: '$node.title',
        revisionId: '$node.revisionId', sectionId: '$entry.id', title: '$entry.title',
        level: '$entry.level', order: '$entry.order', sourceLocator: '$entry.sourceLocator'
      }
    }
  };
  const defaults = {
    label: 'Wikipedia Article', size: { width: 680, height: 500 }, showLabel: false,
    ports: [rootPort('input', 180)],
    data: {
      articleRef: '', canonicalUrl: '', title: '', revisionId: '', lead: '', sections: [], attribution,
      resolution: { status: 'idle', resolvedRef: '', lastResolvedAt: '', error: '' }
    }
  };
  const declaration = declarationNode({
    id: graphId, nodeId: 'wikipedia-article-source', name: 'Wikipedia Article Source',
    description: 'A graph-native Wikipedia article with lazy, section-oriented expansion.',
    classKey: 'wikipedia-article-source', classRef,
    meaning: 'A Wikipedia article projection that owns article identity, lead content, provenance, and an immediate section manifest.',
    defaults, requiredDataKeys: ['articleRef'], dynamicPorts, position: { x: -1280, y: 0 }
  });
  const detail = viewNode({ id: 'wikipedia-article-source-detail', label: 'Article Detail', x: -720, y: -300, width: 480, height: 320, payload: 'node.web.detail', data: {
    title: '{{title}}', body: '{{lead}}', footer: 'Source: Wikipedia · {{canonicalUrl}} · revision {{revisionId}} · {{attribution.license}}',
    identity: { graphId }
  }});
  const summary = viewNode({ id: 'wikipedia-article-source-summary', label: 'Article Summary', x: -720, y: 80, width: 420, height: 240, payload: 'node.web.summary', data: {
    title: '{{title}}', body: '{{lead}}', identity: { graphId }
  }});
  const icon = viewNode({ id: 'wikipedia-article-source-icon', label: 'Article Icon', x: -720, y: 380, width: 320, height: 220, payload: 'node.web.icon', data: {
    renderShape: { kind: 'svg' },
    svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 200'><rect x='5' y='5' width='230' height='190' rx='24' fill='#111827' stroke='#d1d5db' stroke-width='3'/><circle cx='120' cy='82' r='48' fill='#f8fafc'/><text x='120' y='102' text-anchor='middle' font-family='Georgia,serif' font-size='60' font-weight='700' fill='#111827'>W</text><text x='120' y='162' text-anchor='middle' font-family='system-ui,sans-serif' font-size='16' font-weight='800' fill='#f8fafc'>ARTICLE</text></svg>",
    identity: { graphId }
  }});
  const glyph = glyphNode({ id: 'wikipedia-article-source-glyph', label: 'Wikipedia Glyph', x: -1180, y: -480, graphId });
  const landing = contentNode({ id: 'wikipedia-article-source-landing', label: 'Article Landing Surface', x: -120, y: -40, width: 680, height: 500, graphId,
    value: '# Wikipedia Article\n\nThe landing surface defines the article node frame. Runtime semantic Views render resolved article data inside this boundary.'
  });
  const contract = contentNode({ id: 'wikipedia-article-source-contract', label: 'Article Source Contract', x: 660, y: -40, width: 560, height: 500, graphId,
    value: '## Wikipedia Article Source\n\nAuthored identity is `articleRef`. Derived state is canonical URL, title, revision provenance, attribution, lead, and an ordered manifest of immediate top-level sections. `firstSection` is not stored. Section bodies resolve lazily. The resolver preserves last-known-good content on transient failure and does not rerun for rendering, focus, or zoom.'
  });
  const script = {
    id: 'wikipedia-article-resolver-script', type: 'script', label: 'Wikipedia Article Resolver', root: false,
    position: { x: 660, y: 540 }, width: 560, height: 360,
    ports: [{ id: 'trigger', label: 'trigger', direction: 'input', dataType: 'trigger', angle: 180 }, { id: 'result', label: 'result', direction: 'output', dataType: 'value', angle: 0 }],
    visible: true, showLabel: true,
    data: {
      scriptName: 'Wikipedia Article Resolver', allowMutations: true, autoRun: false,
      lifecycleRole: 'node-class-resolver', authoredIdentityPath: 'articleRef',
      resolutionPolicy: 'latest-with-revision-provenance', preserveLastKnownGoodOnError: true,
      memo: 'Resolve redirects and normalize articleRef into canonical identity, revision provenance, lead, attribution, and immediate top-level section manifest. The generic runtime lifecycle supplies the owning instance and commits derived state exactly once per authored identity change.',
      status: 'implemented', visibilityRole: 'editor', identity: { graphId }
    }
  };
  const nodes = [declaration, detail, summary, icon, glyph, landing, contract, script];
  const edges = [
    edge({ id: 'article-default-view', source: graphId, sourcePort: 'default-view', target: detail.id, type: 'default-view', label: 'default view', role: 'default-view' }),
    edge({ id: 'article-summary-view', source: graphId, sourcePort: 'summary-view', target: summary.id, label: 'summary view', role: 'shared-summary' }),
    edge({ id: 'article-icon-view', source: graphId, sourcePort: 'icon-view', target: icon.id, label: 'icon view', role: 'shared-icon' }),
    edge({ id: 'article-glyph', source: graphId, sourcePort: 'glyph', target: glyph.id, label: 'glyph', role: 'shared-glyph' }),
    edge({ id: 'article-landing', source: graphId, sourcePort: 'landing-surface', target: landing.id, label: 'landing surface', role: 'landing-surface' })
  ];
  return { type: 'nodegraph-data', nodes, edges, timestamp: new Date().toISOString(), nodeCount: nodes.length, edgeCount: edges.length };
}

function sectionGraph() {
  const graphId = 'wikipedia-section-declaration';
  const classRef = 'github://mikemartinez1974/public/templates/wikipedia-article-template/classes/nodes/wikipedia-section.node-class.node';
  const dynamicPorts = {
    version: 1,
    sourcePath: 'sections', idPath: 'id', labelPath: 'title', orderPath: 'order',
    direction: 'output', dataType: 'wikipedia-section', placement: { side: 'right' },
    behavior: {
      trigger: 'drag-create', action: 'create-node', nodeType: 'wikipedia-section', targetPort: 'root',
      seed: {
        articleRef: '$node.articleRef', canonicalUrl: '$node.canonicalUrl', articleTitle: '$node.articleTitle',
        revisionId: '$node.revisionId', sectionId: '$entry.id', title: '$entry.title',
        level: '$entry.level', order: '$entry.order', sourceLocator: '$entry.sourceLocator'
      }
    }
  };
  const defaults = {
    label: 'Wikipedia Section', size: { width: 620, height: 440 }, showLabel: false,
    ports: [rootPort('input', 180)],
    data: {
      articleRef: '', canonicalUrl: '', articleTitle: '', revisionId: '',
      sectionId: '', title: '', level: 1, order: 0, sourceLocator: '', content: '', sections: [], attribution,
      resolution: { status: 'idle', resolvedIdentity: '', lastResolvedAt: '', error: '' }
    }
  };
  const declaration = declarationNode({
    id: graphId, nodeId: 'wikipedia-section', name: 'Wikipedia Section',
    description: 'A lazy graph-native projection of one Wikipedia article section.',
    classKey: 'wikipedia-section', classRef,
    meaning: 'A lazily resolved Wikipedia section with revision-scoped provenance, readable content, and an immediate child-section manifest.',
    defaults, requiredDataKeys: ['articleRef', 'revisionId', 'sectionId'], dynamicPorts, position: { x: -1280, y: 0 }
  });
  const detail = viewNode({ id: 'wikipedia-section-detail', label: 'Section Detail', x: -720, y: -300, width: 460, height: 300, payload: 'node.web.detail', data: {
    title: '{{title}}', body: '{{content}}', footer: '{{articleTitle}} · revision {{revisionId}} · {{attribution.license}}', identity: { graphId }
  }});
  const summary = viewNode({ id: 'wikipedia-section-summary', label: 'Section Summary', x: -720, y: 60, width: 400, height: 240, payload: 'node.web.summary', data: {
    title: '{{title}}', body: '{{content}}', identity: { graphId }
  }});
  const icon = viewNode({ id: 'wikipedia-section-icon', label: 'Section Icon', x: -720, y: 360, width: 320, height: 220, payload: 'node.web.icon', data: {
    renderShape: { kind: 'svg' },
    svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 180'><rect x='5' y='5' width='230' height='170' rx='22' fill='#172033' stroke='#93c5fd' stroke-width='3'/><path d='M42 55h156M42 88h125M42 121h145' stroke='#dbeafe' stroke-width='9' stroke-linecap='round'/><text x='120' y='158' text-anchor='middle' font-family='system-ui,sans-serif' font-size='14' font-weight='800' fill='#93c5fd'>SECTION</text></svg>",
    identity: { graphId }
  }});
  const glyph = glyphNode({ id: 'wikipedia-section-glyph', label: 'Section Glyph', x: -1180, y: -480, graphId, name: 'Subject' });
  const landing = contentNode({ id: 'wikipedia-section-landing', label: 'Section Landing Surface', x: -120, y: -20, width: 620, height: 440, graphId,
    value: '# Wikipedia Section\n\nThe landing surface defines the Section node frame. The semantic Views present lazily resolved section content.'
  });
  const contract = contentNode({ id: 'wikipedia-section-contract', label: 'Section Contract', x: 620, y: -20, width: 560, height: 440, graphId,
    value: '## Wikipedia Section\n\nA Section is created from a labeled expansion handle. Identity is article identity plus revision identity plus section locator. It owns readable markdown for the current section and an ordered `sections[]` manifest containing immediate children only. Re-expanding the same source may create another graph projection with the same addressed source identity.'
  });
  const script = {
    id: 'wikipedia-section-resolver-script', type: 'script', label: 'Wikipedia Section Resolver', root: false,
    position: { x: 620, y: 500 }, width: 560, height: 340,
    ports: [{ id: 'trigger', label: 'trigger', direction: 'input', dataType: 'trigger', angle: 180 }, { id: 'result', label: 'result', direction: 'output', dataType: 'value', angle: 0 }],
    visible: true, showLabel: true,
    data: {
      scriptName: 'Wikipedia Section Resolver', allowMutations: true, autoRun: false,
      lifecycleRole: 'node-class-resolver', authoredIdentityPath: 'sourceIdentity',
      resolutionPolicy: 'pinned-to-parent-revision', preserveLastKnownGoodOnError: true,
      memo: 'Resolve one section body as markdown and normalize immediate child sections. The generic runtime lifecycle supplies the owning instance and commits derived state once per source identity change.',
      status: 'implemented', visibilityRole: 'editor', identity: { graphId }
    }
  };
  const nodes = [declaration, detail, summary, icon, glyph, landing, contract, script];
  const edges = [
    edge({ id: 'section-default-view', source: graphId, sourcePort: 'default-view', target: detail.id, type: 'default-view', label: 'default view', role: 'default-view' }),
    edge({ id: 'section-summary-view', source: graphId, sourcePort: 'summary-view', target: summary.id, label: 'summary view', role: 'shared-summary' }),
    edge({ id: 'section-icon-view', source: graphId, sourcePort: 'icon-view', target: icon.id, label: 'icon view', role: 'shared-icon' }),
    edge({ id: 'section-glyph', source: graphId, sourcePort: 'glyph', target: glyph.id, label: 'glyph', role: 'shared-glyph' }),
    edge({ id: 'section-landing', source: graphId, sourcePort: 'landing-surface', target: landing.id, label: 'landing surface', role: 'landing-surface' })
  ];
  return { type: 'nodegraph-data', nodes, edges, timestamp: new Date().toISOString(), nodeCount: nodes.length, edgeCount: edges.length };
}

function reconcileTemplate() {
  const templatePath = path.join(here, 'root.node');
  const graph = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  const article = graph.nodes.find((node) => node.id === 'wikipedia-article-specimen');
  if (article) {
    article.data = {
      ...(article.data || {}),
      articleRef: article.data?.articleRef || article.data?.canonicalUrl || 'https://en.wikipedia.org/wiki/Wikipedia',
      canonicalUrl: article.data?.canonicalUrl || '',
      title: article.data?.title || 'Wikipedia',
      revisionId: article.data?.revisionId === 'runtime' ? '' : (article.data?.revisionId || ''),
      lead: article.data?.lead === 'Resolved lead content appears here.'
        ? 'A deterministic authoring fixture for validating semantic presentation and graph-native section expansion.'
        : (article.data?.lead || 'A deterministic authoring fixture for validating semantic presentation and graph-native section expansion.'),
      sections: Array.isArray(article.data?.sections) && article.data.sections.length
        ? article.data.sections
        : [
            { id: 'fixture-history', title: 'History', level: 2, order: 1, sourceLocator: 'fixture:history' },
            { id: 'fixture-organization', title: 'Organization', level: 2, order: 2, sourceLocator: 'fixture:organization' },
            { id: 'fixture-community', title: 'Community', level: 2, order: 3, sourceLocator: 'fixture:community' }
          ],
      attribution: article.data?.attribution || attribution,
      resolution: article.data?.resolution?.resolvedRef
        ? article.data.resolution
        : { status: 'fixture', resolvedRef: '', lastResolvedAt: '', error: '' },
      lifecycle: {
        resolve: {
          trigger: 'authored-identity-change', adapter: 'wikimedia-article-v1',
          inputPaths: ['articleRef'], requiredInputPaths: ['articleRef'],
          preserveLastKnownGoodOnError: true
        }
      },
      dynamicPorts: {
        version: 1,
        sourcePath: 'sections', idPath: 'id', labelPath: 'title', orderPath: 'order',
        direction: 'output', dataType: 'wikipedia-section', placement: { side: 'right' },
        behavior: {
          trigger: 'drag-create', action: 'create-node', nodeType: 'wikipedia-section', targetPort: 'root',
          seed: {
            articleRef: '$node.articleRef', canonicalUrl: '$node.canonicalUrl', articleTitle: '$node.title',
            revisionId: '$node.revisionId', sectionId: '$entry.id', title: '$entry.title',
            level: '$entry.level', order: '$entry.order', sourceLocator: '$entry.sourceLocator'
          }
        }
      }
    };
    delete article.data.firstSection;
    delete article.data.dynamicPortContract;
  }

  const expansion = graph.nodes.find((node) => node.id === 'wikipedia-section-expansion-contract');
  if (expansion) {
    expansion.type = 'content';
    expansion.data = {
      ...(expansion.data || {}),
      content: {
        kind: 'markdown',
        value: '## Section expansion transaction\n\nEach `sections[]` entry derives one labeled output handle. Dragging it creates a `wikipedia-section`, seeds article and revision provenance plus the selected section locator, connects to the child root, and lets the child resolve lazily. Repeated expansion may create another graph projection with the same addressed source identity.'
      }
    };
    delete expansion.data.markdown;
  }

  for (const id of ['wiki-article-v1-design-notes', 'wiki-section-v1-design-notes']) {
    const note = graph.nodes.find((node) => node.id === id);
    if (!note) continue;
    const value = note.data?.content?.value || note.data?.markdown || '';
    note.type = 'content';
    note.data = { ...(note.data || {}), content: { kind: 'markdown', value } };
    delete note.data.markdown;
  }

  graph.timestamp = new Date().toISOString();
  graph.nodeCount = graph.nodes.length;
  graph.edgeCount = graph.edges.length;
  fs.writeFileSync(templatePath, `${JSON.stringify(graph, null, 2)}\n`);
}

function reconcileTaskGraph() {
  const taskPath = path.resolve(here, '..', '..', 'tasks', 'wikipedia-browser-template-design', 'root.node');
  const graph = JSON.parse(fs.readFileSync(taskPath, 'utf8'));
  const byId = (id) => graph.nodes.find((node) => node.id === id);
  const goal = byId('wikipedia-browser-template-design-goal');
  Object.assign(goal.data, {
    status: 'in-progress',
    description: 'Produce a reusable template whose root resolves one Wikipedia article, renders its lead, and exposes immediate sections as lazy graph expansion points.',
    blockedReason: '',
    nextAction: 'Complete the generic instance-resolution lifecycle and prove one live article-to-section expansion.'
  });
  Object.assign(byId('wiki-template-task-source-contract').data, {
    status: 'done',
    outcome: 'Article and Section V1 contracts now define authored identity, revision provenance, immediate-child manifests, lazy bodies, and last-known-good error behavior.'
  });
  Object.assign(byId('wiki-template-task-node-classes').data, {
    status: 'done',
    outcome: 'Article Source and Section class graphs now use declaration, View, Content, Glyph, landing-surface, and recursive dynamic-port contracts.'
  });
  Object.assign(byId('wiki-template-task-specimen').data, {
    status: 'in-progress',
    description: 'Use one real Wikipedia article to prove self-resolution, semantic lead presentation, ordered labeled section handles, and lazy Section expansion.',
    nextAction: 'Refresh the template in Graph Lab, confirm the Article resolves visually, and drag one live section handle through the full Section lifecycle.'
  });
  Object.assign(byId('wiki-template-question-expansion').data, {
    status: 'answered',
    answer: 'A generic data-driven handle derives from each immediate section manifest entry. Dragging creates a new Section projection, seeds revision-scoped source identity, connects to its root, and lets the Section resolve lazily.',
    resolutionPath: 'github://mikemartinez1974/public/templates/wikipedia-article-template/root.node'
  });
  Object.assign(byId('wikipedia-browser-template-design-summary').data, {
    status: 'in-progress',
    summary: 'The V1 Article/Section contract, declaration-first class graphs, generic self-resolution lifecycle, authorized Wikimedia adapters, dynamic handle derivation, and seeded child creation are implemented. Live API validation resolved the Wikipedia article and lazily resolved its History section with immediate children.',
    nextAction: 'Visually confirm the live Article-to-Section interaction in Graph Lab, then complete the end-to-end specimen task.',
    blockedReason: ''
  });
  graph.timestamp = new Date().toISOString();
  graph.nodeCount = graph.nodes.length;
  graph.edgeCount = graph.edges.length;
  fs.writeFileSync(taskPath, `${JSON.stringify(graph, null, 2)}\n`);
}

fs.writeFileSync(path.join(classDir, 'wikipedia-article-source.node-class.node'), `${JSON.stringify(articleGraph(), null, 2)}\n`);
fs.writeFileSync(path.join(classDir, 'wikipedia-section.node-class.node'), `${JSON.stringify(sectionGraph(), null, 2)}\n`);
reconcileTemplate();
reconcileTaskGraph();
