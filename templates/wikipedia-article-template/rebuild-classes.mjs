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

const declarationPorts = ({ includeEditor = false } = {}) => [
  relationshipPort({ id: 'default-view', label: 'default view', angle: 165, role: 'default-view', nodeType: 'view', edgeType: 'default-view' }),
  relationshipPort({ id: 'summary-view', label: 'summary view', angle: 180, role: 'shared-summary', nodeType: 'view' }),
  relationshipPort({ id: 'icon-view', label: 'icon view', angle: 195, role: 'shared-icon', nodeType: 'view' }),
  ...(includeEditor ? [relationshipPort({ id: 'editor-view', label: 'editor view', angle: 210, role: 'editor-view', nodeType: 'view' })] : []),
  relationshipPort({ id: 'glyph', label: 'glyph', angle: 270, role: 'shared-glyph', nodeType: 'glyph' }),
  relationshipPort({ id: 'port', label: 'port', angle: 90, role: 'exposes-port', nodeType: 'port', required: false, repeatable: true }),
  relationshipPort({ id: 'landing-surface', label: 'landing surface', angle: 0, role: 'landing-surface', nodeType: 'content' })
];

const declarationHandles = (ports) => ports.map((port) => ({
  id: port.id, key: port.id, portId: port.id, label: port.label,
  direction: port.direction, dataType: port.dataType, angle: port.angle, role: port.role
}));

const viewNode = ({ id, label, x, y, width, height, payload, intent = 'node', data = {} }) => ({
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
    view: { intent, payload },
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

const glyphNode = ({ id, label, x, y, graphId, name = 'Language', glyph = null }) => ({
  id, type: 'glyph', label, root: false, position: { x, y }, width: 240, height: 160,
  ports: [rootPort()], handles: [rootHandle()], visible: true, showLabel: true,
  data: {
    glyph: glyph || { kind: 'icon', name },
    visibilityRole: 'editor',
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

const wikipediaFallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg';

const articleDetailHtml = `<article style="width:100%;height:100%;box-sizing:border-box;overflow:hidden;border-radius:18px;background:#fff;color:#202122;border:1px solid #a2a9b1;box-shadow:0 12px 32px rgba(0,0,0,.18);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;flex-direction:column"><header style="height:70px;box-sizing:border-box;display:flex;align-items:center;gap:13px;padding:12px 22px;border-bottom:1px solid #c8ccd1;background:#f8f9fa"><div style="width:43px;height:43px;border:1px solid #72777d;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;font:700 29px/1 Georgia,'Times New Roman',serif">W</div><div><div style="font:500 20px/1 Georgia,'Times New Roman',serif;letter-spacing:.08em">WIKIPEDIA</div><div style="font:500 9px/1.4 Georgia,'Times New Roman',serif;letter-spacing:.08em">THE FREE ENCYCLOPEDIA</div></div><div style="margin-left:auto;padding:5px 9px;border:1px solid #a2a9b1;border-radius:999px;background:#fff;font:700 9px/1 sans-serif;color:#54595d">ARTICLE</div></header><div style="min-height:0;flex:1;display:grid;grid-template-columns:minmax(0,1.55fr) minmax(180px,.8fr);gap:22px;padding:22px"><main style="min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden"><h1 style="margin:0;font:400 34px/1.08 Georgia,'Times New Roman',serif;color:#101418">{{data.title}}</h1><div style="width:100%;height:1px;background:#a2a9b1;margin:8px 0 5px;flex:none"></div><div style="font:italic 13px/1.35 Georgia,'Times New Roman',serif;color:#54595d;margin-bottom:15px;flex:none">{{data.description || 'From Wikipedia, the free encyclopedia'}}</div><div style="min-height:0;flex:1;font:400 14px/1.55 Georgia,'Times New Roman',serif;color:#202122;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:8px">{{data.lead}}</div></main><aside style="min-width:0;display:flex;flex-direction:column;gap:10px"><div style="height:228px;border:1px solid #c8ccd1;background:#eaecf0;padding:5px;box-sizing:border-box"><img src="{{data.thumbnailUrl || '${wikipediaFallbackImage}'}}" alt="" style="display:block;width:100%;height:100%;object-fit:cover;background:#fff" /></div><div style="font:600 10px/1.4 sans-serif;color:#54595d;text-align:center">{{data.description || data.title}}</div></aside></div><footer style="height:38px;box-sizing:border-box;display:flex;align-items:center;gap:10px;padding:8px 22px;border-top:1px solid #c8ccd1;background:#f8f9fa;font:500 10px/1 sans-serif;color:#54595d"><span style="color:#36c;font-weight:700">Wikipedia</span><span>revision {{data.revisionId}}</span><span style="margin-left:auto">CC BY-SA</span></footer></article>`;

const articleSummaryHtml = `<article style="width:100%;height:100%;box-sizing:border-box;overflow:hidden;border-radius:16px;background:#fff;color:#202122;border:1px solid #a2a9b1;box-shadow:0 8px 22px rgba(0,0,0,.16);display:grid;grid-template-columns:36% 64%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"><div style="background:#eaecf0;padding:5px;min-width:0"><img src="{{data.thumbnailUrl || '${wikipediaFallbackImage}'}}" alt="" style="width:100%;height:100%;display:block;object-fit:cover;background:#fff" /></div><div style="min-width:0;min-height:0;padding:15px 17px;display:flex;flex-direction:column"><div style="display:flex;align-items:center;gap:7px;color:#54595d;font:700 9px/1 sans-serif;letter-spacing:.1em;flex:none"><span style="width:21px;height:21px;border:1px solid #72777d;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;font:700 15px Georgia,serif;color:#202122;letter-spacing:0">W</span> WIKIPEDIA ARTICLE</div><h2 style="margin:10px 0 4px;font:400 25px/1.08 Georgia,'Times New Roman',serif;color:#101418;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none">{{data.title}}</h2><div style="font:italic 11px/1.3 Georgia,'Times New Roman',serif;color:#54595d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none">{{data.description}}</div><div style="height:1px;background:#c8ccd1;margin:9px 0;flex:none"></div><div style="min-height:0;flex:1;font:400 12px/1.42 Georgia,'Times New Roman',serif;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:6px">{{data.lead}}</div><div style="padding-top:6px;font:600 9px/1 sans-serif;color:#36c;flex:none">Read and explore sections</div></div></article>`;

const sectionDetailHtml = `<article style="width:100%;height:100%;box-sizing:border-box;overflow:hidden;border-radius:18px;background:#fff;color:#202122;border:1px solid #a2a9b1;box-shadow:0 10px 28px rgba(0,0,0,.16);display:grid;grid-template-columns:8px minmax(0,1fr);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"><div style="background:#36c"></div><div style="min-width:0;min-height:0;display:flex;flex-direction:column"><header style="display:flex;align-items:center;gap:9px;padding:13px 18px;border-bottom:1px solid #c8ccd1;background:#f8f9fa;flex:none"><span style="width:27px;height:27px;border:1px solid #72777d;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;font:700 18px Georgia,serif">W</span><div style="min-width:0"><div style="font:700 9px/1.2 sans-serif;letter-spacing:.1em;color:#54595d">WIKIPEDIA · SECTION</div><div style="font:500 11px/1.2 sans-serif;color:#36c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{data.articleTitle}}</div></div></header><main style="min-height:0;flex:1;display:flex;flex-direction:column;overflow:hidden;padding:18px 21px"><h1 style="margin:0;font:400 29px/1.1 Georgia,'Times New Roman',serif;color:#101418;flex:none">{{data.title}}</h1><div style="height:1px;background:#a2a9b1;margin:8px 0 12px;flex:none"></div><div style="min-height:0;flex:1;font:400 13px/1.52 Georgia,'Times New Roman',serif;white-space:pre-wrap;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:8px">{{data.content}}</div></main><footer style="padding:9px 20px;border-top:1px solid #c8ccd1;background:#f8f9fa;font:500 9px/1 sans-serif;color:#54595d;flex:none">Revision {{data.revisionId}} · CC BY-SA</footer></div></article>`;

const sectionSummaryHtml = `<article style="width:100%;height:100%;box-sizing:border-box;overflow:hidden;border-radius:16px;background:#fff;color:#202122;border:1px solid #a2a9b1;box-shadow:0 7px 20px rgba(0,0,0,.14);display:grid;grid-template-columns:7px minmax(0,1fr);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"><div style="background:#36c"></div><div style="min-width:0;min-height:0;padding:15px 17px;display:flex;flex-direction:column"><div style="font:700 9px/1.2 sans-serif;letter-spacing:.1em;color:#54595d;flex:none">WIKIPEDIA SECTION</div><h2 style="margin:8px 0 3px;font:400 23px/1.08 Georgia,'Times New Roman',serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none">{{data.title}}</h2><div style="font:500 10px/1.3 sans-serif;color:#36c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none">{{data.articleTitle}}</div><div style="height:1px;background:#c8ccd1;margin:9px 0;flex:none"></div><div style="min-height:0;flex:1;font:400 12px/1.42 Georgia,'Times New Roman',serif;white-space:pre-wrap;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:6px">{{data.content}}</div></div></article>`;

// A single scrolling pane is more reliable inside the resizable canvas host than
// a nested flex child. Keep the authored chrome intact and let its reading column scroll.
const articleDetailScrollableHtml = articleDetailHtml
  .replace('min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden', 'min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:8px')
  .replace('min-height:0;flex:1;font:400 14px/1.55 Georgia,\'Times New Roman\',serif;color:#202122;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:8px', 'font:400 14px/1.55 Georgia,\'Times New Roman\',serif;color:#202122');
const articleSummaryScrollableHtml = articleSummaryHtml
  .replace('min-width:0;min-height:0;padding:15px 17px;display:flex;flex-direction:column', 'min-width:0;min-height:0;padding:15px 17px;display:flex;flex-direction:column;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable')
  .replace('min-height:0;flex:1;font:400 12px/1.42 Georgia,\'Times New Roman\',serif;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:6px', 'font:400 12px/1.42 Georgia,\'Times New Roman\',serif');
const sectionDetailScrollableHtml = sectionDetailHtml
  .replace('min-height:0;flex:1;display:flex;flex-direction:column;overflow:hidden;padding:18px 21px', 'min-height:0;flex:1;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding:18px 21px')
  .replace('min-height:0;flex:1;font:400 13px/1.52 Georgia,\'Times New Roman\',serif;white-space:pre-wrap;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:8px', 'font:400 13px/1.52 Georgia,\'Times New Roman\',serif;overflow-wrap:anywhere;padding-right:8px')
  .replace('{{data.content}}', '{{data.contentHtml || data.content}}');
const sectionSummaryScrollableHtml = sectionSummaryHtml
  .replace('min-width:0;min-height:0;padding:15px 17px;display:flex;flex-direction:column', 'min-width:0;min-height:0;padding:15px 17px;display:flex;flex-direction:column;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable')
  .replace('min-height:0;flex:1;font:400 12px/1.42 Georgia,\'Times New Roman\',serif;white-space:pre-wrap;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:6px', 'font:400 12px/1.42 Georgia,\'Times New Roman\',serif;white-space:pre-wrap;padding-right:6px')
  .replace('{{data.content}}', '{{data.contentSummary || data.content}}');

function declarationNode({ id, nodeId, name, description, classKey, classRef, meaning, defaults, requiredDataKeys, dynamicPorts, position, includeEditor = false }) {
  const ports = declarationPorts({ includeEditor });
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
                : ['articleRef', 'canonicalUrl', 'articleTitle', 'description', 'thumbnailUrl', 'revisionId', 'sectionId', 'title', 'level', 'order', 'sourceLocator'],
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
        description: '$node.description', thumbnailUrl: '$node.thumbnailUrl',
        revisionId: '$node.revisionId', sectionId: '$entry.id', title: '$entry.title',
        level: '$entry.level', order: '$entry.order', sourceLocator: '$entry.sourceLocator'
      }
    }
  };
  const defaults = {
    label: 'Wikipedia Article', size: { width: 680, height: 500 }, showLabel: false,
    ports: [rootPort('input', 180)],
    data: {
      articleRef: '', canonicalUrl: '', title: '', description: '', pageId: '', revisionId: '', revisionTimestamp: '',
      lead: '', thumbnailUrl: '', thumbnail: null, originalImageUrl: '', sections: [], attribution,
      resolution: { status: 'idle', resolvedRef: '', lastResolvedAt: '', error: '' }
    }
  };
  const declaration = declarationNode({
    id: graphId, nodeId: 'wikipedia-article-source', name: 'Wikipedia Article Source',
    description: 'A graph-native Wikipedia article with lazy, section-oriented expansion.',
    classKey: 'wikipedia-article-source', classRef,
    meaning: 'A Wikipedia article projection that owns article identity, lead content, provenance, and an immediate section manifest.',
    defaults, requiredDataKeys: ['articleRef'], dynamicPorts, position: { x: -1280, y: 0 }, includeEditor: true
  });
  const detail = viewNode({ id: 'wikipedia-article-source-detail', label: 'Article Detail', x: -720, y: -300, width: 480, height: 320, payload: 'node.web.detail', data: {
    renderShape: { kind: 'html' }, html: articleDetailScrollableHtml,
    identity: { graphId }
  }});
  const summary = viewNode({ id: 'wikipedia-article-source-summary', label: 'Article Summary', x: -720, y: 80, width: 420, height: 240, payload: 'node.web.summary', data: {
    renderShape: { kind: 'html' }, html: articleSummaryScrollableHtml, identity: { graphId }
  }});
  const icon = viewNode({ id: 'wikipedia-article-source-icon', label: 'Article Icon', x: -720, y: 380, width: 320, height: 220, payload: 'node.web.icon', data: {
    renderShape: { kind: 'svg' },
    svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 200'><rect x='5' y='5' width='230' height='190' rx='24' fill='#111827' stroke='#d1d5db' stroke-width='3'/><circle cx='120' cy='82' r='48' fill='#f8fafc'/><text x='120' y='102' text-anchor='middle' font-family='Georgia,serif' font-size='60' font-weight='700' fill='#111827'>W</text><text x='120' y='162' text-anchor='middle' font-family='system-ui,sans-serif' font-size='16' font-weight='800' fill='#f8fafc'>ARTICLE</text></svg>",
    identity: { graphId }
  }});
  const editor = viewNode({ id: 'wikipedia-article-source-editor', label: 'Article Editor', x: -720, y: 680, width: 440, height: 260, payload: 'editor.web', intent: 'editor', data: {
    editor: {
      web: {
        layout: {
          mode: 'stack',
          sections: [{ key: 'identity', title: 'Wikipedia Article', summary: 'Choose the article represented by this node.' }]
        },
        fields: [
          {
            key: 'articleRef', label: 'Article', type: 'text', path: 'data.articleRef', section: 'identity', required: true,
            placeholder: 'https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)',
            helperText: 'Enter a Wikipedia article URL or article title. Saving this field triggers resolution of the new article.'
          }
        ]
      }
    },
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
  const nodes = [declaration, detail, summary, icon, editor, glyph, landing, contract, script];
  const edges = [
    edge({ id: 'article-default-view', source: graphId, sourcePort: 'default-view', target: detail.id, type: 'default-view', label: 'default view', role: 'default-view' }),
    edge({ id: 'article-summary-view', source: graphId, sourcePort: 'summary-view', target: summary.id, label: 'summary view', role: 'shared-summary' }),
    edge({ id: 'article-icon-view', source: graphId, sourcePort: 'icon-view', target: icon.id, label: 'icon view', role: 'shared-icon' }),
    edge({ id: 'article-editor-view', source: graphId, sourcePort: 'editor-view', target: editor.id, label: 'editor view', role: 'editor-view' }),
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
        description: '$node.description', thumbnailUrl: '$node.thumbnailUrl',
        revisionId: '$node.revisionId', sectionId: '$entry.id', title: '$entry.title',
        level: '$entry.level', order: '$entry.order', sourceLocator: '$entry.sourceLocator'
      }
    }
  };
  const defaults = {
    label: 'Wikipedia Section', size: { width: 620, height: 440 }, showLabel: false,
    ports: [rootPort('input', 180)],
    data: {
      articleRef: '', canonicalUrl: '', articleTitle: '', description: '', thumbnailUrl: '', revisionId: '',
      sectionId: '', title: '', level: 1, order: 0, sourceLocator: '',
      content: '', contentHtml: '', contentSummary: '', sections: [], attribution,
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
    renderShape: { kind: 'html' }, html: sectionDetailScrollableHtml, identity: { graphId }
  }});
  const summary = viewNode({ id: 'wikipedia-section-summary', label: 'Section Summary', x: -720, y: 60, width: 400, height: 240, payload: 'node.web.summary', data: {
    renderShape: { kind: 'html' }, html: sectionSummaryScrollableHtml, identity: { graphId }
  }});
  const icon = viewNode({ id: 'wikipedia-section-icon', label: 'Section Icon', x: -720, y: 360, width: 320, height: 220, payload: 'node.web.icon', data: {
    renderShape: { kind: 'svg' },
    svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 180'><rect x='5' y='5' width='230' height='170' rx='22' fill='#172033' stroke='#93c5fd' stroke-width='3'/><path d='M42 55h156M42 88h125M42 121h145' stroke='#dbeafe' stroke-width='9' stroke-linecap='round'/><text x='120' y='158' text-anchor='middle' font-family='system-ui,sans-serif' font-size='14' font-weight='800' fill='#93c5fd'>SECTION</text></svg>",
    identity: { graphId }
  }});
  const glyph = glyphNode({
    id: 'wikipedia-section-glyph', label: 'Section Glyph', x: -1180, y: -480, graphId,
    glyph: { kind: 'symbol', name: 'Section', value: '§' }
  });
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
      description: article.data?.description || '',
      pageId: article.data?.pageId || '',
      revisionId: article.data?.revisionId === 'runtime' ? '' : (article.data?.revisionId || ''),
      revisionTimestamp: article.data?.revisionTimestamp || '',
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
      thumbnailUrl: article.data?.thumbnailUrl || '',
      thumbnail: article.data?.thumbnail || null,
      originalImageUrl: article.data?.originalImageUrl || '',
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
            description: '$node.description', thumbnailUrl: '$node.thumbnailUrl',
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
    nextAction: 'Open the dedicated live smoke graph, confirm the Article resolves visually, and drag one live section handle through the full Section lifecycle.'
  });
  Object.assign(byId('wiki-template-question-expansion').data, {
    status: 'answered',
    answer: 'A generic data-driven handle derives from each immediate section manifest entry. Dragging creates a new Section projection, seeds revision-scoped source identity, connects to its root, and lets the Section resolve lazily.',
    resolutionPath: 'github://mikemartinez1974/public/templates/wikipedia-article-template/root.node'
  });
  Object.assign(byId('wikipedia-browser-template-design-summary').data, {
    status: 'in-progress',
    summary: 'The V1 Article/Section contract, declaration-first class graphs, generic self-resolution lifecycle, authorized Wikimedia adapters, dynamic handle derivation, and seeded child creation are implemented. Live API validation resolved the Wikipedia article and lazily resolved its History section with immediate children.',
    nextAction: 'Visually confirm the dedicated live Article-to-Section smoke graph in Graph Lab, then complete the end-to-end specimen task.',
    blockedReason: ''
  });
  graph.timestamp = new Date().toISOString();
  graph.nodeCount = graph.nodes.length;
  graph.edgeCount = graph.edges.length;
  fs.writeFileSync(taskPath, `${JSON.stringify(graph, null, 2)}\n`);
}

function bridgeNode({ id, label, x, y, graphId, classKey, ref }) {
  return {
    id, type: 'bridge', label, position: { x, y }, width: 380, height: 170,
    visible: true, showLabel: true,
    ports: [{ id: 'root', label: 'root', direction: 'bidirectional', dataType: 'any', angle: 210 }],
    data: {
      authority: 'bridge',
      bridge: {
        ref, role: 'import', resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'],
        exposure: { nodeClasses: { mode: 'allow', include: [classKey] }, views: { mode: 'allow' } }
      },
      target: { mode: 'bridge', kind: 'node-class', ref, key: classKey, grants: ['create'] },
      visibilityRole: 'editor', identity: { graphId }
    }
  };
}

function liveSmokeGraph() {
  const graphId = 'wikipedia-article-live-smoke';
  const declarationId = `${graphId}-declaration`;
  const declaration = {
    id: declarationId, type: 'declaration', label: 'Wikipedia Article Live Smoke Test', root: false,
    position: { x: -1500, y: -120 }, width: 400, height: 280,
    ports: declarationPorts(), handles: declarationHandles(declarationPorts()), visible: true, showLabel: true,
    data: {
      identity: { graphId, nodeId: graphId, name: 'Wikipedia Article Live Smoke Test', version: '0.1.0', description: 'Proves live Article resolution and recursive Section expansion.' },
      intent: { kind: 'graph', scope: 'shared' },
      declaration: { kind: 'graph', targetMode: 'artifact', artifactKind: 'graph', interfaceContract: { version: 1, implicitRootPort: true }, defaultSurfaceId: '', surfaces: [] }
    }
  };
  const detail = viewNode({ id: `${graphId}-detail`, label: 'Smoke Detail', x: -980, y: -360, width: 420, height: 260, payload: 'node.web.detail', data: {
    title: 'Wikipedia Article Live Smoke Test', body: 'A real Article instance resolves itself and exposes live section handles.', identity: { graphId }
  }});
  const summary = viewNode({ id: `${graphId}-summary`, label: 'Smoke Summary', x: -980, y: -40, width: 380, height: 220, payload: 'node.web.summary', data: {
    title: 'Wikipedia Live Smoke', body: 'Resolve Article, expand Section, recurse.', identity: { graphId }
  }});
  const icon = viewNode({ id: `${graphId}-icon`, label: 'Smoke Icon', x: -980, y: 240, width: 300, height: 200, payload: 'node.web.icon', data: {
    title: 'Wikipedia Live Smoke', body: 'W', identity: { graphId }
  }});
  const detailContent = contentNode({ id: `${graphId}-detail-content`, label: 'Smoke Detail Content', x: -500, y: -500, width: 420, height: 260, graphId,
    value: '# Wikipedia Article Live Smoke Test\n\nA real Article instance resolves itself and exposes live section handles.'
  });
  const summaryContent = contentNode({ id: `${graphId}-summary-content`, label: 'Smoke Summary Content', x: -460, y: 300, width: 380, height: 220, graphId,
    value: '## Wikipedia Live Smoke\n\nResolve Article, expand Section, recurse.'
  });
  const iconContent = contentNode({ id: `${graphId}-icon-content`, label: 'Smoke Icon Content', x: -80, y: 420, width: 300, height: 200, graphId, kind: 'svg',
    value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'><rect width='300' height='200' rx='24' fill='#111827'/><circle cx='150' cy='82' r='52' fill='#f8fafc'/><text x='150' y='105' text-anchor='middle' fill='#111827' font-family='Georgia,serif' font-size='64' font-weight='700'>W</text><text x='150' y='165' text-anchor='middle' fill='#f8fafc' font-family='system-ui,sans-serif' font-size='16' font-weight='800'>LIVE SMOKE</text></svg>"
  });
  const glyph = glyphNode({ id: `${graphId}-glyph`, label: 'Smoke Glyph', x: -1420, y: -500, graphId });
  const landing = contentNode({ id: `${graphId}-landing`, label: 'Smoke Landing Surface', x: -420, y: -120, width: 560, height: 360, graphId,
    value: '# Wikipedia Article Live Smoke Test\n\nThe Article node below is configured with a real Wikipedia reference. It should resolve automatically and expose its immediate sections as labeled handles.'
  });
  const articleRef = 'https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)';
  const articleClassRef = 'github://mikemartinez1974/public/templates/wikipedia-article-template/classes/nodes/wikipedia-article-source.node-class.node';
  const sectionClassRef = 'github://mikemartinez1974/public/templates/wikipedia-article-template/classes/nodes/wikipedia-section.node-class.node';
  const articleBridge = bridgeNode({ id: `${graphId}-article-class`, label: 'Wikipedia Article Source Class', x: -1400, y: 360, graphId, classKey: 'wikipedia-article-source', ref: articleClassRef });
  const sectionBridge = bridgeNode({ id: `${graphId}-section-class`, label: 'Wikipedia Section Class', x: -960, y: 520, graphId, classKey: 'wikipedia-section', ref: sectionClassRef });
  const article = {
    id: `${graphId}-article`, type: 'wikipedia-article-source', label: 'Graph (discrete mathematics)', root: true,
    position: { x: 260, y: -80 }, width: 680, height: 500, visible: true, showLabel: false,
    ports: [rootPort('input', 180)], handles: [rootHandle('input', 180)],
    data: {
      articleRef, canonicalUrl: '', title: '', description: '', pageId: '', revisionId: '', revisionTimestamp: '',
      lead: '', thumbnailUrl: '', thumbnail: null, originalImageUrl: '', sections: [], attribution,
      resolution: { status: 'idle', resolvedRef: '', lastResolvedAt: '', error: '' },
      lifecycle: {
        resolve: {
          trigger: 'authored-identity-change', adapter: 'wikimedia-article-v1', inputPaths: ['articleRef'],
          requiredInputPaths: ['articleRef'], preserveLastKnownGoodOnError: true
        }
      },
      dynamicPorts: {
        version: 1, sourcePath: 'sections', idPath: 'id', labelPath: 'title', orderPath: 'order',
        direction: 'output', dataType: 'wikipedia-section', placement: { side: 'right' },
        behavior: {
          trigger: 'drag-create', action: 'create-node', nodeType: 'wikipedia-section', targetPort: 'root',
          seed: {
            articleRef: '$node.articleRef', canonicalUrl: '$node.canonicalUrl', articleTitle: '$node.title',
            description: '$node.description', thumbnailUrl: '$node.thumbnailUrl', revisionId: '$node.revisionId',
            sectionId: '$entry.id', title: '$entry.title', level: '$entry.level', order: '$entry.order', sourceLocator: '$entry.sourceLocator'
          }
        }
      },
      definitionKey: 'wikipedia-article-source',
      _classBinding: { key: 'wikipedia-article-source', sourceRef: articleClassRef, ref: articleClassRef },
      _bridge: { classKey: 'wikipedia-article-source', classRef: articleClassRef, sourceRef: articleClassRef, entryPort: 'root', kind: 'node-class', targetKind: 'node-class' },
      identity: { graphId }
    }
  };
  const criteria = contentNode({ id: `${graphId}-criteria`, label: 'Pass Criteria', x: 1040, y: -40, width: 520, height: 500, graphId,
    value: '## Pass criteria\n\n1. Article resolves to **Graph (discrete mathematics)** without a button.\n2. Detail and Summary show resolved title and lead.\n3. Revision provenance is populated.\n4. Immediate top-level sections appear as labeled handles on the right.\n5. Dragging a section creates `wikipedia-section` through its root.\n6. The Section resolves readable content and exposes only its immediate child sections.\n7. Changing `articleRef` triggers one new resolution; zoom and focus do not.'
  });
  const nodes = [declaration, detail, summary, icon, detailContent, summaryContent, iconContent, glyph, landing, articleBridge, sectionBridge, article, criteria];
  const edges = [
    edge({ id: `${graphId}-default-view`, source: declarationId, sourcePort: 'default-view', target: detail.id, type: 'default-view', label: 'default view', role: 'default-view' }),
    edge({ id: `${graphId}-summary-view`, source: declarationId, sourcePort: 'summary-view', target: summary.id, label: 'summary view', role: 'shared-summary' }),
    edge({ id: `${graphId}-icon-view`, source: declarationId, sourcePort: 'icon-view', target: icon.id, label: 'icon view', role: 'shared-icon' }),
    edge({ id: `${graphId}-glyph-edge`, source: declarationId, sourcePort: 'glyph', target: glyph.id, label: 'glyph', role: 'shared-glyph' }),
    edge({ id: `${graphId}-landing-edge`, source: declarationId, sourcePort: 'landing-surface', target: landing.id, label: 'landing surface', role: 'landing-surface' }),
    edge({ id: `${graphId}-detail-content-edge`, source: detail.id, sourcePort: 'surface-delegate', target: detailContent.id, label: 'content', role: 'view.content' }),
    edge({ id: `${graphId}-summary-content-edge`, source: summary.id, sourcePort: 'surface-delegate', target: summaryContent.id, label: 'content', role: 'view.content' }),
    edge({ id: `${graphId}-icon-content-edge`, source: icon.id, sourcePort: 'surface-delegate', target: iconContent.id, label: 'content', role: 'view.content' }),
    { id: `${graphId}-article-import`, type: 'reference', source: articleBridge.id, target: article.id, sourcePort: 'root', targetPort: 'root', label: 'instantiates', data: { role: 'instantiates', semanticRole: 'instantiates' } }
  ];
  return { type: 'nodegraph-data', nodes, edges, timestamp: new Date().toISOString(), nodeCount: nodes.length, edgeCount: edges.length };
}

fs.writeFileSync(path.join(classDir, 'wikipedia-article-source.node-class.node'), `${JSON.stringify(articleGraph(), null, 2)}\n`);
fs.writeFileSync(path.join(classDir, 'wikipedia-section.node-class.node'), `${JSON.stringify(sectionGraph(), null, 2)}\n`);
reconcileTemplate();
reconcileTaskGraph();
fs.writeFileSync(path.resolve(here, '..', '..', 'graphs', 'wikipedia-article-live-smoke.node'), `${JSON.stringify(liveSmokeGraph(), null, 2)}\n`);
