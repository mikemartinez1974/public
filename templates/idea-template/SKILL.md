---
name: idea-template
description: Create, derive, or maintain Twilite idea graphs from the canonical Idea Template package. Use when framing a new idea, testing assumptions, collecting research and evidence, comparing alternatives, tracking risks, defining uncertainty-reducing next steps, or promoting a supported idea into coordinated task work.
---

# Idea Template

Use `root.node` as the executable template. Preserve its declaration, Idea landing surface, reader-facing relationship ports, semantic Views, Glyph, custom node bridges, class bindings, and semantic edge-class authority before replacing example content. Treat starter content and starter relationships as demonstrations, not facts about the derived idea.

## Derive An Idea Graph

1. Copy `root.node` structurally.
2. Retarget graph identity, declaration identity, semantic View identities, Idea landing-surface edge and any nonredundant navigation edges, Glyph identity, GitHub settings, every content-node identity, and every bridge identity.
3. Preserve the local bridges and `_classBinding` / `_bridge` data on typed nodes. `dependencies.nodeTypes` does not grant runtime class authority.
4. Replace the starter content with the real idea. Re-evaluate every starter relationship; keep, retarget, or remove it so every remaining edge is truthful.
5. Duplicate repeatable working nodes as needed; do not create multiple competing anchor nodes without an explicit reason.
6. Validate JSON, surfaces, bridge refs, class bindings, edge endpoints, handles, and edge-class refs.

## Landing Navigation Contract

The primary Idea node is the landing surface and the reader's starting point.

- Connect the declaration's `landing-surface` port directly to the primary `idea` node's `root` port. That authored edge alone selects landing; changing its target changes the landing node.
- Keep meaning-bearing `idea.*` relationships directed. Readers may traverse a focused relationship port in either direction to the opposite endpoint.
- Give relationship ports reader-facing labels such as `Problem`, `Risks`, `Questions`, and `Evidence`. Preserve stable port IDs and edge-class meaning.
- Do not add parallel `navigation` edges to every working node. The semantic path from Idea through Problem to Audience, or through Assumption to Question and Research, is the intended route.
- Add an ordinary labeled `navigation` edge only when a separate authored section has no meaningful relationship path into the idea. Remove it when that section acquires a truthful semantic path.
- When deriving an idea, remove relationship and navigation edges whose destination or authored claim is absent.

## Node Roles

Keep these as singular anchors:

- `idea`
- `idea-problem`
- `idea-audience`
- `idea-proposed-approach`

Duplicate these as the investigation grows:

- `idea-question`
- `idea-assumption`
- `idea-research`
- `idea-evidence`
- `idea-alternative`
- `idea-risk`
- `idea-next-step`

## Relationship Rules

- Use `idea.motivates` from a problem to the idea it makes worth pursuing.
- Use `idea.affects` from an audience to the problem it experiences.
- Use `idea.assumes` from an idea or approach to a necessary assumption.
- Use `idea.questions` when a question or alternative challenges a specific target.
- Use `idea.informs` for research that adds relevant context.
- Use `idea.supports` or `idea.contradicts` only from observable evidence to the proposition it changes confidence in.
- Use `idea.tests` from a next step to the assumption, question, or approach it evaluates.
- Use `idea.threatens` from a risk to the idea or approach it could weaken.
- Use `idea.advances` from an approach or next step that moves the idea toward a better-supported state.

Do not add a generic relationship when a more precise class applies. Do not treat research as evidence merely because it agrees with the idea.

Do not preserve a starter `supports`, `contradicts`, `tests`, or other meaning-bearing edge when the derived graph lacks the content needed to justify it. An empty evidence placeholder does not support an assumption.

## Lifecycle

Use idea lifecycle values `spark`, `framed`, `testing`, `supported`, `rejected`, or `dormant`. Promotion into a task graph is optional and only appropriate when the idea has become coordinated work with a goal and at least one task or open question.

When promoting work, leave the idea graph as the durable reasoning record. Create an ordinary portal from the idea graph to the resulting task graph instead of copying the idea's evidence into task summaries.

## Validation

- Parse every touched `.node` file as JSON.
- Verify the declaration supplies its implicit root interface and occupies `default-view`, `summary-view`, `icon-view`, `glyph`, and `landing-surface`. An additional authored `port` is optional unless the idea exposes a distinct named surface.
- Verify declaration-to-Idea landing-surface geometry defines the node frame; the default View selects content and navigation focus but does not determine geometry.
- Verify the primary Idea node is the landing target and each visible relationship port has a valid meaning-bearing edge to a working node. Navigation edges are optional and should serve only disconnected sections.
- Verify every typed node has matching `definitionKey`, `_classBinding.key`, and class refs.
- Verify each custom node class is an inspectable graph artifact, not a loose manifest with adjacent views. It must contain one real `declaration`, one explanatory `markdown` contract node, and visible primitive `port` nodes for `editor.web`, `node.web.detail`, `node.web.summary`, and `node.web.icon`.
- Verify the class declaration owns every exposed surface through `declaration.surfaces`, exposes `root` through the detail port, names `root` as its default, retains named detail, summary, icon, and editor surfaces, and connects directly to the contract note and each surface port with meaningful `contract` or `surface` edges.
- Verify every class node and surface has complete `ports`, `inputs`, and `outputs` shapes and a deliberate position matching the canonical People class-artifact layout.
- Verify every editor field is represented in the detail surface; summaries may use a deliberate subset and icon surfaces must remain identity-scale.
- Verify every edge endpoint and named handle exists.
- Verify every semantic edge points to the matching file under `classes/edges/`.
- Derive at least one real idea graph before changing the package contract.
