---
name: brainstorm-template
description: Create or maintain loose Twilite brainstorm graphs whose ideas, questions, constraints, references, and outcomes may acquire structure before promotion into Idea or Task artifacts.
---

# Brainstorm Template

Use `root.node` as the executable template. A Brainstorm is a generative staging ground, not an Idea graph with weaker fields and not a Task graph without a schedule.

## Derivation

1. Preserve the declaration, landing surface, Detail, Summary, Icon, Glyph, exposed Brainstorm port, and central Brainstorm provider.
2. Retarget every graph identity and GitHub path.
3. Replace starter thoughts with real material while keeping the graph loose.
4. Use the provider handles as optional authoring affordances; free-form edges remain valid.
5. Treat spatial proximity as an authoring cue, never as durable semantics without confirmation.

## Roles

- `brainstorm`: the singular graph-owned provider and central framing.
- `idea`: a thought that may later graduate into an Idea graph.
- `idea-question`: unresolved uncertainty.
- `constraint`: a durable limitation or requirement.
- `content`: notes, observations, evidence, quotations, and references until a stronger type is justified.
- `decision`: an outcome that has crystallized enough to preserve.

Do not add a separate Topic node unless the brainstorm genuinely contains multiple independently addressable topics. The Brainstorm provider normally supplies the topic.

## Relationships

Prefer a small ordinary-edge vocabulary: `relates-to`, `supports`, `contradicts`, `depends-on`, `answers`, `raises`, `constrains`, and `derived-from`. Store the meaning in `data.semanticRole`. Do not create edge classes until a relationship requires its own behavior, validation, or presentation.

## Promotion

Promotion creates a new authoritative artifact and leaves the brainstorm as provenance:

- Promote a coherent proposition into an Idea graph.
- Promote committed work into a Task graph only when it has a goal and at least one task or open question.
- Link the resulting artifact through an ordinary portal; do not copy its future state back into the brainstorm.

## Validation

- Parse every touched graph as JSON.
- Require declaration relationships for default view, summary view, icon view, glyph, and landing surface.
- Keep the exposed Brainstorm port optional structurally but present in this reusable template.
- Verify every edge endpoint and named port exists.
- Verify declaration-to-landing-surface geometry, not default-view placement, defines the interface frame.
- Do not require task status, workboard metadata, or a task-summary updater.
