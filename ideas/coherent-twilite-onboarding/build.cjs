const fs = require('fs');
const path = require('path');

const graphId = 'coherent-twilite-onboarding';
const title = 'A Coherent Twilite Onboarding Path';
const graphRef = `github://mikemartinez1974/public/ideas/${graphId}/root.node`;
const templatePath = path.resolve(__dirname, '../../templates/idea-template/root.node');
const outputPath = path.resolve(__dirname, 'root.node');
const graph = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
const now = new Date().toISOString();

const idMap = new Map();
for (const node of graph.nodes) {
  if (node.id.startsWith('idea-template-')) idMap.set(node.id, node.id.replace(/^idea-template-/, `${graphId}-`));
}
for (const node of graph.nodes) {
  node.id = idMap.get(node.id) || node.id;
  if (node.data?.identity) node.data.identity.graphId = graphId;
}
for (const edge of graph.edges) {
  edge.id = edge.id.replace(/^idea-template-/, `${graphId}-`);
  edge.source = idMap.get(edge.source) || edge.source;
  edge.target = idMap.get(edge.target) || edge.target;
}

const get = (suffix) => graph.nodes.find((node) => node.id === `${graphId}-${suffix}`);
const set = (suffix, patch) => {
  const node = get(suffix);
  if (!node) throw new Error(`Missing template node: ${suffix}`);
  const priorData = node.data || {};
  Object.assign(node, patch);
  if (patch.data) node.data = { ...priorData, ...patch.data };
  return node;
};

graph.metadata = {
  ...graph.metadata,
  title,
  description: 'Unify account, entitlement, GitHub persistence, and optional LLM setup into one progressive, state-aware onboarding journey.',
  graphId,
  version: '0.1.0',
  kind: 'idea',
  modified: now,
  tags: ['idea', 'onboarding', 'account', 'github', 'llm', 'activation', 'first-run']
};

const declaration = get('declaration');
declaration.label = title;
declaration.data.identity = {
  graphId,
  nodeId: graphId,
  name: title,
  version: '0.1.0',
  description: 'Design the shortest honest path from first visit to a saved graph and optional AI collaboration.'
};
declaration.data.declaration = { ...declaration.data.declaration, kind: 'idea', artifactKind: 'idea-graph' };
declaration.data.document = { url: graphRef };
declaration.data.settings = {
  ...declaration.data.settings,
  github: { repo: 'mikemartinez1974/public', path: `ideas/${graphId}/root.node`, branch: 'main' }
};

set('idea', {
  label: 'One Journey · Progressive Commitment',
  data: {
    title: 'Give every newcomer one next action based on what they want to accomplish',
    statement: 'Twilite should begin with useful exploration, introduce account and persistence setup only when the user chooses durable work, and offer LLM onboarding only when the user chooses AI collaboration. One state-aware guide should carry the user across those thresholds without making optional setup look mandatory.',
    status: 'framed',
    confidence: 'promising',
    notes: 'This is a draft experience proposal. It should be tested against the deployed account, entitlement, GitHub App, repository, and handshake flows before becoming product law.'
  }
});

set('idea-problem', {
  label: 'Six Surfaces · No Journey',
  data: {
    title: 'The necessary steps exist but do not read as one onboarding path',
    statement: 'Public browsing, Twilite account creation, production entitlement, GitHub connection, GitHub App installation, repository selection, save-home mapping, and LLM handshake are exposed through different controls with no shared progress model.',
    impact: 'A new user cannot tell what is required, what is optional, what has already succeeded, or what action unlocks the next useful outcome. Setup feels longer and riskier than it is.',
    urgency: 'critical'
  }
});

set('idea-audience', {
  label: 'A New Twilite Creator',
  data: {
    title: 'Someone who wants to understand Twilite and preserve a first useful graph',
    description: 'A visitor may arrive only to explore, may decide to create durable work, or may want an LLM to collaborate on the graph. Those are progressive intentions rather than one mandatory persona.',
    needs: 'Immediate value before setup, one clear next action, automatic detection of completed steps, plain explanations of why GitHub or payment is being requested, and a visible success moment when the first graph is saved.'
  }
});

set('idea-proposed-approach', {
  label: 'State-Aware Onboarding Guide',
  data: {
    title: 'One guide with Explore, Save Your Work, and Add an LLM stages',
    description: 'Place a persistent onboarding guide on the landing surface and account workspace. It reads live account, entitlement, provider, installation, repository, mapping, first-save, and handshake state; shows one primary next action; lets the user skip optional stages; and resumes where they stopped.',
    differentiator: 'The path is organized around outcomes rather than systems. Users choose Explore, Save Your Work, or Add an LLM; Twilite reveals only the setup required for that outcome.'
  }
});

set('idea-question', {
  label: 'Entitlement Timing',
  data: {
    title: 'When should Twilite ask a new creator to subscribe?',
    question: 'Should production entitlement be requested immediately after account verification, only when the first save is attempted, or after a temporary first graph demonstrates value?',
    status: 'open',
    answer: 'Draft direction: let the user create a temporary first graph, explain durability at the save threshold, and request entitlement there. Validate this against business and data-loss requirements.'
  }
});

set('idea-assumption', {
  label: 'Intent Before Infrastructure',
  data: {
    title: 'Users complete setup more readily after choosing a concrete outcome',
    statement: 'A person who has explored Twilite or made a first temporary graph will understand why account, subscription, repository, and App permissions are needed and will perceive them as enabling durability rather than as an entrance fee.',
    importance: 'critical',
    status: 'untested'
  }
});

set('idea-research', {
  label: 'Current Onboarding Audit',
  data: {
    title: 'The runtime already exposes the required state, but the UI does not compose it',
    findings: 'Public browsing and free authoring work without an account. Saving checks authenticated premiumEditor access. Account creation uses email verification. GitHub provider state, installations, repositories, selected installation, save mappings, and billing state are separately available. The browser bar independently copies the LLM handshake.',
    sourceUrl: 'github://TwiliteLLC/twilite/components/Browser/Browser.js',
    sourceType: 'runtime-and-live-site-audit'
  }
});

set('idea-evidence', {
  label: 'Existing State Signals',
  data: {
    title: 'Twilite can already detect nearly every onboarding milestone',
    observation: 'The account session reports Twilite and GitHub sessions plus premium entitlement; GitHub endpoints list installations and repositories; workspace settings persist repository mappings; the save flow knows whether a target is confirmed; and the handshake action has a stable published prompt.',
    kind: 'implementation-observation',
    strength: 'strong',
    citationSourceId: 'github://TwiliteLLC/twilite/app/api/account/session/route.js'
  }
});

set('idea-alternative', {
  label: 'Mandatory Setup Wizard',
  data: {
    title: 'Require every account, GitHub, repository, payment, and LLM step up front',
    description: 'Present a conventional linear wizard before the user reaches the working graph.',
    tradeoffs: 'Easy to specify and measure, but falsely treats GitHub and LLM collaboration as requirements for exploration. It delays the first useful experience and asks for permissions before their value is visible.'
  }
});

set('idea-risk', {
  label: 'Temporary Work Feels Unsafe',
  data: {
    title: 'Deferred setup can let users mistake unsaved work for durable work',
    description: 'If Twilite permits meaningful guest or pre-entitlement authoring, a user may close the browser before understanding that the graph has no durable save destination.',
    likelihood: 'medium',
    impact: 'high',
    mitigation: 'Show persistent but calm durability state from the first edit, preserve a recoverable local session where possible, and make Save Your Work the dominant action before navigation or closure can lose work.'
  }
});

set('idea-next-step', {
  label: 'Prototype the Unified Guide',
  data: {
    title: 'Build one state machine and test it with a brand-new account',
    action: 'Create a reviewable onboarding surface backed by existing session, billing, GitHub installation, repository mapping, persistence, and handshake signals. Walk one new user through browse, temporary creation, account verification, entitlement, GitHub App access, repository selection, first save, and optional LLM handshake.',
    expectedEvidence: 'At every point the user can state what is complete, why the current action is requested, what remains optional, and whether the graph is durable. The first saved graph and first accepted LLM transaction are separately measurable successes.',
    status: 'todo'
  }
});

const draft = `# Draft · Twilite onboarding journey

## Opening choice

**What would you like to do?**

- **Explore Twilite** — Open the public graph. No account required.
- **Create something** — Start a temporary first graph. We will help you save it when you are ready.
- **Continue setup** — Resume the first incomplete durability step.

Never display GitHub, payment, and LLM setup as one wall before the product can be used.

## Stage 1 · Experience Twilite

The visitor can browse public graphs and create a temporary graph immediately.

Persistent status: **This graph is currently stored only in this browser session.**

Primary action after the first meaningful edit: **Save your work**

## Stage 2 · Save your work

Show one checklist, one current explanation, and one primary action:

1. **Create your Twilite account**  
   Name and email, followed by the emailed verification code.
2. **Enable durable saving**  
   Explain the production entitlement at the moment saving becomes relevant. Do not imply that payment is required for public exploration.
3. **Connect GitHub**  
   Explain that GitHub stores and versions the user's graph files.
4. **Choose where the graph lives**  
   If no suitable repository exists, link directly to GitHub's new-repository flow. Then install or configure the Twilite GitHub App and grant that repository access.
5. **Select the repository and folder**  
   Twilite should choose the only valid installation automatically when possible. Ask for branch, path, or save slot only when the default is ambiguous.
6. **Save the first graph**  
   Confirm the durable address and show **Saved to GitHub** as the completion moment.

Each completed step collapses into a checkmark. Returning users resume at the first incomplete step. Expired GitHub provider access becomes **Reconnect GitHub**, not a restart of onboarding.

## Stage 3 · Add an LLM · optional

After a graph is visible, offer:

**Want an AI collaborator?**

1. Copy the Twilite bootstrap handshake.
2. Paste it into the user's chosen LLM.
3. Paste the returned transaction into Twilite.
4. Confirm that the transaction is valid and applied.

Label this stage **Optional**. It teaches an external model Twilite's graph mutation contract; it does not configure the user's Twilite account or GitHub storage.

## State model

- guest browsing
- temporary authoring
- Twilite account verified
- durable saving entitled
- GitHub provider connected
- GitHub App installation available
- writable repository selected
- save destination confirmed
- first graph saved
- LLM handshake copied
- LLM handshake applied

The UI derives progress from these states. It should not ask users to remember or repeat completed work.

## Copy principles

- Name the outcome before the system being configured.
- Explain why each permission or payment step is needed.
- Keep optional work visibly optional.
- Present one primary next action.
- Preserve access to the graph throughout setup.
- Treat the first durable save as onboarding success; treat LLM connection as a separate optional success.

## Open product decisions

- Exact subscription timing and trial language.
- Whether Twilite should guide repository creation or eventually create one with explicit authorization.
- Whether repository mapping belongs in the first-save dialog, workspace settings, or both.
- Whether the LLM handshake should remain copy/paste-first when MCP is available.
`;

set('instructions', {
  type: 'content',
  label: 'Draft Onboarding Journey',
  data: {
    content: { kind: 'markdown', value: draft },
    interfaceContract: { version: 1, receivesViewContent: true },
    identity: { graphId }
  }
});

set('detail-view', { label: `${title} Detail`, data: { content: { kind: 'markdown', value: '# A Coherent Twilite Onboarding Path\n\nMove from immediate exploration to durable saving, then offer LLM collaboration as an optional next capability.' } } });
set('summary-view', { label: `${title} Summary`, data: { content: { kind: 'markdown', value: '## One journey, progressive commitment\n\nExplore without setup. Introduce account, entitlement, and GitHub only when the user chooses durable work. Offer LLM onboarding separately and optionally.' } } });
set('icon-view', { label: `${title} Icon`, data: { content: { kind: 'svg', value: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'><rect width='320' height='220' rx='28' fill='#101827'/><path d='M44 110h54l25-38 38 76 30-48h85' fill='none' stroke='#68ddff' stroke-width='10' stroke-linecap='round' stroke-linejoin='round'/><circle cx='44' cy='110' r='15' fill='#a970ff'/><circle cx='276' cy='100' r='15' fill='#5ee6a8'/><path d='M258 100l10 10 22-26' fill='none' stroke='#fff' stroke-width='6' stroke-linecap='round'/><text x='160' y='198' text-anchor='middle' fill='#fff' font-family='system-ui' font-size='15' font-weight='800'>ONE CLEAR PATH</text></svg>" } } });
set('glyph', { label: `${title} Glyph`, data: { glyph: { kind: 'icon', name: 'Route' } } });
set('landing-surface', {
  label: `${title} Landing Surface`,
  data: { content: { kind: 'markdown', value: '# One clear path into Twilite\n\nHow can Twilite deliver value immediately, introduce durable setup only when it becomes relevant, and keep LLM collaboration clearly optional?\n\nUse **Explore idea** to open the proposed journey and its full draft.' } }
});

graph.timestamp = now;
graph.nodeCount = graph.nodes.length;
graph.edgeCount = graph.edges.length;
fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
