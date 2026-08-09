# Lionel Template v1 Classes

Lionel v1 is now class-backed.

The executable `root.node` owns local class-authority bridges for the node classes below and semantic edge-class authority for the meaning-bearing relationships below. Derived episode graphs should preserve those bridges and full canonical GitHub refs.

## Node classes

### Episode and analytical structure

- `lionel-episode` — singular episode/appearance anchor and configuration object
- `issue-scope` — a bounded analytical question with scope, standard, and optional burden
- `topic-thread` — a persistent or temporary conversation thread with branch/return state

### Lionel-specific rhetorical layer

- `lionel-operation` — compact reusable move class with `operationRole`

The v1 operation roles are: frames, states thesis, performs issue analysis, comments on media, adds context, analogizes, simulates scenario, models another perspective, maps actors, synthesizes, qualifies, and incorporates audience.

Use `roleDetail` for narrower variants instead of creating a new class for every rhetorical shade.

### Media layer

- `media-source` — the complete outside source object
- `media-segment` — a timed source range with speaker/transcript context

The separation is intentional. Lionel commentary ranges live on `lionel-operation`; the outside source range lives on `media-segment`.

### Higher-order analytical structures

- `actor-field` — a scoped set of relevant actors and their observed pattern
- `research-funnel` — intake → filtering/verification → promoted information flow
- `coalition` — issue-scoped alignment that can preserve disagreement elsewhere

## Semantic edge classes

- `lionel.belongsToIssue`
- `lionel.relevantTo`
- `lionel.triggersBranch`
- `lionel.returnsTo`
- `lionel.alignsOn`
- `lionel.containsSegment`
- `lionel.referencesMedia`

These live under `classes/edges/` and are exposed to `root.node` through hidden edge-class bridges with declaration-owned `edge authority` edges.

## Design boundary

The package deliberately distinguishes three structures that ordinary transcript/chapter models tend to collapse:

1. **episode composition** — container, sequence controller, navigation mode
2. **conversation topology** — Topic Threads, branches, returns
3. **argument topology** — Issue Scopes and relevance

Media, actor, research, coalition, and rhetorical nodes attach to those structures as needed.

This is the first production grammar draft, not a claim that every possible primitive is frozen forever. A new class should require recurrent structure plus real authoring value, not merely a new subject or a new phrase in a transcript.
