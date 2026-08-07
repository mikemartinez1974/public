---
name: lionel-v1
description: Create, derive, or maintain Lionel episode graphs from the class-backed Lionel v1 grammar derived from transcript-grounded observation studies. Use for Lionel thesis episodes, live streams, media reactions, adversarial audits, multi-source commentary, and guest appearances.
---

# Lionel Template v1

Use `root.node` as the executable template. It is now class-backed. Preserve the declaration, declared `root` port, local node-class bridges, `_classBinding` / `_bridge` provenance, semantic edge-class bridges, and authority edges before replacing starter content.

The template provides vocabulary, not a cage.

## Derive an Episode Graph

1. Copy `root.node` structurally.
2. Retarget graph identity, declaration identity, primitive root-port identity, GitHub settings, starter instance identities, and bridge identities.
3. Preserve local node-class bridges and their `class authority` edges. `dependencies.nodeTypes` does not grant runtime class authority.
4. Preserve semantic edge-class bridges and their `edge authority` edges.
5. Configure the singular `lionel-episode` anchor before expanding the graph.
6. Replace starter content with transcript-grounded content. Delete optional starter structures that the episode does not need.
7. Duplicate repeatable `issue-scope`, `topic-thread`, `lionel-operation`, `media-source`, `media-segment`, `actor-field`, `research-funnel`, and `coalition` nodes only when the episode supports them.
8. Re-evaluate every starter relationship. Keep, retarget, or remove it so every remaining semantic edge is truthful.
9. Preserve timestamps, source references, attribution, and uncertainty.
10. Validate JSON, class refs, bridge refs, edge-class refs, endpoints, and ports.

## Episode Configuration

The `lionel-episode` class carries three independent dimensions.

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

Do not infer one dimension from another. A live episode can be mostly linear. A thesis episode can contain source media. An episode containing many clips is not necessarily queue-driven.

## Node Roles

Keep one `lionel-episode` anchor per modeled episode or appearance.

Repeat as needed:

- `issue-scope` — the analytical question being answered
- `topic-thread` — where the conversation currently travels
- `lionel-operation` — a reusable Lionel rhetorical or analytical move
- `media-source` — an outside media object
- `media-segment` — an exact timed range inside a media source
- `actor-field` — a set of actors whose relationships or movement matter
- `research-funnel` — an information-flow structure for tips, filtering, verification, and promoted leads
- `coalition` — actors aligned around a scoped priority despite possible disagreement elsewhere

The starter Side Thread, media objects, Actor Field, Research Funnel, and Coalition are optional demonstrations. Delete them when absent.

## Conversation Topology Is Not Argument Topology

A `topic-thread` answers **where the conversation went**.

An `issue-scope` answers **what question a claim, operation, source, or analytical object bears on**.

Do not collapse these concepts. A fact may be interesting to the conversation while irrelevant to a particular issue scope.

## Lionel Operations

Use the single `lionel-operation` class with `operationRole` rather than multiplying tiny classes.

Supported v1 roles:

- `frames`
- `states-thesis`
- `performs-issue-analysis`
- `comments-on-media`
- `adds-context`
- `analogizes`
- `simulates-scenario`
- `models-another-perspective`
- `maps-actors`
- `synthesizes`
- `qualifies`
- `incorporates-audience`

Use `roleDetail` for narrower variants. For example, `simulates-scenario` can represent a future projection, juror proof test, reconstructed answer, strategic countermove, or parodic opponent model without creating a new node class.

## Media Modeling

Use `media-source` for the complete outside source and `media-segment` for the exact range Lionel addresses.

Keep Lionel's commentary range on the `lionel-operation` node and the source range on the `media-segment` node. Do not merge the two timelines.

Nested media is allowed: a source discussed by Lionel may itself contain another source. Preserve the provenance chain rather than flattening it.

## Relationship Rules

- `lionel.belongsToIssue` means the source content is analytically assigned to the target Issue Scope.
- `lionel.relevantTo` means the source content materially bears on the target Issue Scope.
- `lionel.triggersBranch` opens a Topic Thread as a branch.
- `lionel.returnsTo` resumes a Topic Thread after a branch.
- `lionel.alignsOn` expresses issue-scoped alignment by an Actor Field or Coalition. It does not imply general ideological agreement.
- `lionel.containsSegment` connects a Media Source to a Timed Media Segment drawn from it.
- `lionel.referencesMedia` connects a Lionel Operation to the exact Timed Media Segment it comments on, interprets, audits, replays, or otherwise addresses.

Do not add a generic relationship when one of these semantic classes states the meaning more precisely.

## Attribution Discipline

A transcript contains speaker claims, interpretations, allegations, hypotheticals, jokes, uncertainty, and structural behavior. Keep these distinct.

- Do not turn Lionel's claim into an independently established fact.
- Do not turn audience suggestions into evidence merely because Lionel discusses them.
- Do not turn research activity into evidence merely because it produces a lead.
- Preserve uncertainty when Lionel marks uncertainty.
- Keep analyst structural observations separate from speaker claims.

## Composition Presets

These are conveniences, not separate contracts:

- Thesis Episode
- Live Episode
- Media Episode
- Guest Appearance

Specialize them through episode configuration and instantiated structures rather than cloning separate template families.

## Research Basis

This grammar was derived from `github://mikemartinez1974/public/graphs/observations-on-lionel/observation1.node` through `observation10.node`.

The discovery pattern converged: later specimens mostly recombined or compressed existing machinery rather than requiring new episode families. A regression trial in this v1 folder confirmed that the grammar fit an already-studied long live specimen and exposed authoring ergonomics, which triggered this class-backed promotion.

## Validation

- Parse every touched `.node` file as JSON.
- Verify the declaration exposes a real primitive `port` as `root`.
- Verify every typed instance has matching `definitionKey`, `_classBinding.key`, and full canonical GitHub class refs.
- Verify every node-class bridge has focused-graph `create` authority.
- Verify declaration → node bridge edges are labeled `class authority`.
- Verify node bridge → class instance edges are labeled `instantiates`.
- Verify every semantic edge points to its matching file under `classes/edges/`.
- Verify declaration → edge-class bridge edges are labeled `edge authority`.
- Verify all edge endpoints and named ports exist.
- Re-evaluate starter semantic edges after derivation; template examples are not facts about a new episode.
- Prefer role values and repeated instances over inventing new classes during ordinary episode authoring.
