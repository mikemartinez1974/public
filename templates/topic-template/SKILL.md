---
name: topic-template
description: Create or maintain Twilite topic graphs for complex subjects using concepts, claims, mechanisms, perspectives, sources, and synthesis.
---

# Topic Template

Use `root.node` and the adjacent node-class graphs as one versioned package.

## Purpose

Use this template when the job is **understand a complex subject**, rather than answer one question, evaluate one idea, or manage one body of work.

## Core roles

- `topic`: the bounded subject and entry point.
- `topic-concept`: a major idea, component, term, or subtopic.
- `topic-claim`: a proposition asserted about the topic or a concept.
- `topic-mechanism`: an explanation of how or why something works.
- `topic-perspective`: an interpretation, framework, school, or competing viewpoint.
- `topic-source`: provenance that informs claims, mechanisms, or perspectives.
- `topic-synthesis`: a compressed account of what the graph currently establishes.

Duplicate Concepts, Claims, Mechanisms, Perspectives, and Sources freely. Keep one primary Topic and usually one current Synthesis.

## Relationship guidance

Prefer explicit meaning over generic reference edges when a relationship becomes stable. Useful meanings include: contains, defines, explains, causes, supports, contradicts, exemplifies, interprets, contrasts-with, implies, and sourced-by.

The graph should expose the structure of the subject rather than serialize it into a document. Use expansion when detail would otherwise overwhelm the primary graph.

## Composition

A Topic graph may compose with other templates instead of absorbing their vocabularies. Use a Q&A graph for a concentrated question, an Idea graph for an uncertain proposal, and a Task graph when understanding turns into coordinated work.

## Validation

- Preserve the modern declaration, Detail, Summary, Icon, Glyph, and Landing Surface.
- Preserve bridge authority for every custom node type used by the graph.
- Keep graph identity consistent across graph-owned nodes.
- Use declared ports/handles for edges.
- Keep sources as provenance; a source does not become a claim merely because it says something.
- Synthesis should summarize the current graph, not introduce unsupported conclusions.
