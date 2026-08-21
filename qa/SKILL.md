---
name: twilite-qa-graphs
description: Create, edit, and validate public Twilite question-and-answer graphs under github://mikemartinez1974/public/qa using the question-driven explanation node set. Use for QA topics, questions, answers, sources, examples, caveats, summaries, and collection publication.
---

# Twilite QA Graphs

Maintain QA artifacts as inspectable question-driven graphs, not as prose documents split into arbitrary cards.

## Source Contract

- Use `../templates/question-driven-explanation-template/root.node` as the current derivation source.
- Preserve the Declaration, declared root Port, class-authority Bridges, typed-node bindings, and meaningful semantic edges.
- Start from one `qa-topic` and organize the explanation around real `qa-question` nodes.
- Use `qa-answer`, `qa-source`, `qa-example`, and `qa-caveat` only when they have an explicit relationship to the question or answer they qualify.
- Use `qa-summary` to synthesize the graph; do not make it a disconnected duplicate of the answers.
- Treat older QA graphs without local Bridges as compatibility artifacts. Do not copy their missing authority into new work.

## Author Visible Fields

Before writing or resolving a typed node, inspect its node-class editor and rendered views. Put the authored fact in the field those views actually consume.

- A field present in JSON is not necessarily visible in the graph.
- Do not record a resolution only in auxiliary fields such as `notes`, `resolutionPath`, `confidence`, or `validation` when the class renders a different canonical field.
- For the Idea Template's `idea-question`, write the resolution to `data.answer` and set `data.status` to `answered`. The Detail View renders `answer`; `notes` and `resolutionPath` do not substitute for it.
- For `idea-assumption`, put the proposition in `data.statement`, its lifecycle in `data.status`, and priority in `data.importance`. Use supported class values such as `supported` and `critical` rather than inventing display state in `confidence` alone.
- Apply the same rule to QA classes: inspect the relevant `qa-*` node-class and populate the fields used by its editor and Detail/Summary views.

When a user says they cannot see an update, check field-to-view bindings before assuming a browser cache or publication failure.

## Evidence And Answers

- Keep the question text concise enough to remain recognizable across Detail and Summary views.
- Put the substantive response in the canonical answer field of the answer-bearing class.
- Connect sources to the exact claim or answer they support. Research context is not evidence merely because it agrees.
- Separate caveats from contradictions: a caveat limits an answer; contrary evidence challenges it.
- Preserve unresolved questions explicitly instead of smoothing uncertainty into confident summary prose.

## Collection And Publication

- `root.node` is the public QA collection.
- Keep the QA graph as source authority and link to it through ordinary Portals; do not copy its answer text into the collection.
- Use durable `github://mikemartinez1974/public/qa/...` addresses.
- Remember that a `github://` consumer may read the published repository rather than local working-tree changes. Diagnose local-versus-published state separately from graph correctness, and do not commit unrelated dirty files merely to publish one QA edit.

## Validation

After editing a QA graph:

1. Parse every touched `.node` file as JSON.
2. Verify the Declaration exposes a real root Port and that its `portNodeId` and `viewNodeId` resolve.
3. Verify every typed node has matching `definitionKey`, `_classBinding.key`, and `_bridge.classKey`.
4. Verify local class-authority Bridges exist for every custom type used by new graphs.
5. Verify every edge endpoint and named Port or handle exists.
6. Inspect the applicable node-class views and confirm the new content is stored in fields those views render.
7. Validate every Portal's `sourceRef`, `sourceNodeId`, payload, and surface against its source graph.
8. Report structural validation and published/visual confirmation separately.
