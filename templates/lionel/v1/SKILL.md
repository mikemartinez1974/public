---
name: lionel-template-v1
description: Create or analyze Lionel episode graphs with the first unified Lionel grammar draft derived from ten transcript-grounded observation studies.
---

# Lionel Template v1

Use `root.node` as the grammar-first starter. This version intentionally uses primitive Twilite nodes rather than frozen custom class artifacts. The objective is to validate the authoring grammar on fresh episodes before promoting stable roles into node classes and edge classes.

## Core Principle

Do not treat the Lionel template as one fixed episode layout. Model each episode as an independent combination of container mode, sequence controller, navigation mode, analytical structure, source/media structure, Lionel rhetorical operations, and audience/production events.

The template provides vocabulary, not a cage.

## Episode Configuration

### Container mode
- `recorded-lionel-owned`
- `live-lionel-owned`
- `guest-appearance`

### Sequence controller
- `thesis`
- `evidence-audit`
- `host-interaction`
- `source-timeline`
- `opponent-argument`
- `media-queue`
- `live-thematic-thread`

### Navigation mode
- `mostly-linear`
- `serial`
- `source-bound`
- `queue-driven`
- `branch-and-return`

Do not infer one dimension from another. A live episode may be mostly linear, and a thesis-driven episode may contain source media.

## Keep Conversation and Argument Topology Separate

Use Topic Thread / Thread Set objects for where the conversation goes.

Use Issue Scope, Claim, Standard, Evidence Item, Evidence Bundle, and Hypothesis objects for what the argument means.

A source, claim, or fact can be interesting to one thread while irrelevant to another issue scope.

Prefer explicit relationships such as `belongsToIssue`, `relevantTo`, `irrelevantTo`, `answers`, `doesNotAnswer`, `supports`, `contradicts`, and `qualifies`.

## Media Modeling

Use Media Source and timed ranges when outside media matters. A source may function as the spine of an annotated reaction, an exhibit inside Lionel's thesis, an item in a media queue, or an embedded source inside another source.

Preserve source and commentary ranges independently. Support nested media references.

## Lionel Operations

Start with a compact rhetorical palette:

- Frames
- States Thesis
- Performs Issue Analysis
- Comments on Media
- Adds Context
- Analogizes
- Simulates Scenario
- Models Another Perspective
- Maps Actors
- Synthesizes
- Qualifies
- Incorporates Audience

Prefer role properties over multiplying classes. For example, `Simulates Scenario` may use roles such as `future-projection`, `proof-test`, `counterfactual-response`, `strategic-intervention`, and `parodic-opponent-model`.

Likewise `Comments on Media` should use a commentary role instead of a separate class for every type of interpretation.

## Audience Input

Audience input can trigger a branch, answer a poll, propose a hypothesis, supply a lead, correct a detail, or build rapport. Do not silently promote audience suggestions into evidence.

## Actor and Research Structures

Use Actor Field and Coalition when Lionel reasons about changing alignments around a particular issue.

Use Research Funnel when the episode discusses how tips, contributors, specialist analysis, verification, rejection, and promotion of material flow through a research network.

## Production Grammar

Keep sponsor breaks, live-presence events, programming announcements, deferred topics, continuation promises, and ritual outros separate from the argument ontology.

## Derive an Episode Graph

1. Copy `root.node`.
2. Retarget graph identity, root port identity, and source metadata.
3. Set the episode configuration.
4. Delete unused starter nodes.
5. Duplicate Issue Scope, Topic Thread, Media/Source, Evidence/Claim, Lionel Move, Audience Input, Actor Field, Research Funnel, and Production Event nodes only as needed.
6. Connect conversation topology separately from argument topology.
7. Preserve timestamps, source ranges, attribution, and uncertainty.
8. Do not invent a new episode family because the subject changes.
9. Do not promote a one-off rhetorical shade into a permanent class.
10. Validate the derived episode against the grammar before changing the template.

## Composition Presets

These are conveniences, not separate contracts:

- Thesis Episode
- Live Episode
- Media Episode
- Guest Appearance

Use configuration values to specialize them.

## Research Basis

This draft is derived from `github://mikemartinez1974/public/graphs/observations-on-lionel/observation1.node` through `github://mikemartinez1974/public/graphs/observations-on-lionel/observation10.node`.

Studies 7–10 mostly validated, recombined, or compressed previously observed machinery rather than requiring new episode families.

## Promotion Gate

Do not freeze custom classes yet merely because a role exists in this draft.

After at least one fresh episode is comfortably authored with v1:

1. identify the nodes authors actually needed repeatedly
2. promote stable shared primitives into class artifacts
3. promote stable Lionel-specific moves into class artifacts
4. create semantic edge classes
5. add local class-authority bridges
6. derive another fresh episode from the class-backed version

The authoring experience is the next validation test.
