# Plan Edge and Port Contract

Status: Accepted; template implementation complete  
Contract version: 0.1.0  
Applies to: `templates/plan-template` and graphs derived from it

This contract defines how plan relationships attach to nodes and how different
edge categories appear. It does not change the semantic vocabulary of a plan.
The graph remains complete when an edge category is not currently rendered.

The class and template requirements are implemented by plan template `0.4.0`.
Runtime edge-layer controls, stricter validation, and legacy migration remain
pending and are identified below.

## Objectives

1. Make the ordinary plan readable without exposing class and graph machinery.
2. Give every semantic relationship an intentional source and target port.
3. Keep semantic meaning independent from node position while giving the router
   enough stable geometry to produce predictable paths.
4. Preserve older root-only graphs during migration.
5. Give human and agent authors one deterministic edge-authoring procedure.

## Edge Categories

Every edge belongs to exactly one category.

### Semantic

Semantic edges express the plan itself. Examples include `achieves`, `contains`,
`precedes`, `produces`, `gates`, `branches to`, `constrained by`, `threatened by`,
and `mitigated by`.

Semantic edges are visible in the default plan view.

### Contract

Contract edges support declarations, ports, views, class authority, and class
instantiation. They remain loaded and inspectable but are hidden in the default
plan view.

Examples include `default-view`, `shared-summary`, `shared-icon`, `shared-glyph`,
`landing-surface`, `exposes-port`, `class authority`, and `instantiates`.

### Expansion

Expansion edges represent reciprocal bridge continuity between contributing
graphs. They remain loaded and inspectable but are hidden in the default plan
view unless the user is inspecting graph boundaries or expansion state.

### Proposed persisted classification

```json
{
  "data": {
    "presentation": {
      "layer": "semantic"
    }
  }
}
```

Allowed values are `semantic`, `contract`, and `expansion`.

This field is proposed and requires runtime support. Until that support exists,
the runtime may infer category from a known edge role, but newly authored edges
must eventually persist the category explicitly.

## Semantic Endpoint Model

An edge attaches to semantic ports through `sourcePort` and `targetPort`.
Visible handles mirror those ports through `portId`; handle placement is not a
substitute for the semantic endpoint.

Each semantic port declares:

- A stable `id` and `key`.
- `direction`: `input`, `output`, or deliberately `bidirectional`.
- `dataType` compatible with the connected endpoint.
- `angle` for stable initial handle placement.
- The semantic relationship roles it accepts.
- Whether the relationship may repeat.

The existing implicit `root` port remains a compatibility fallback. It is not
the default endpoint for new plan-template semantic edges.

## Plan Port Vocabulary

Angles use the existing convention: `0` right, `90` bottom, `180` left, and
`270` top.

| Node class | Port | Direction | Angle | Accepted relationship |
| --- | --- | --- | ---: | --- |
| Plan | `goal` | output | 0 | `achieves` |
| Plan | `phases` | output | 65 | `contains` |
| Plan | `constraints` | output | 115 | `constrained by` |
| Goal | `plan` | input | 180 | `achieves` |
| Phase | `parent` | input | 270 | `contains` |
| Phase | `previous` | input | 180 | `precedes` |
| Phase | `next` | output | 0 | `precedes` |
| Phase | `actions` | output | 65 | `contains` |
| Phase | `support` | output | 115 | `constrained by`, `threatened by` |
| Action | `parent` | input | 270 | `contains` |
| Action | `gate` | input | 180 | `gates` |
| Action | `outcome` | output | 340 | `produces` |
| Action | `decision` | output | 20 | `gates`, `branches to` |
| Action | `support` | output | 90 | `requires`, `constrained by`, `threatened by` |
| Milestone | `input` | input | 270 | `produces` |
| Milestone | `next` | output | 0 | `gates` |
| Decision | `input` | input | 180 | `produces`, `gates` |
| Decision | `outcomes` | output | 0 | `gates`, `branches to` |
| Constraint | `subject` | input | 270 | `constrained by`, `requires` |
| Risk | `subject` | input | 270 | `threatened by` |
| Risk | `mitigation` | output | 0 | `mitigated by` |
| Contingency | `trigger` | input | 180 | `mitigated by`, `branches to` |

The port name describes its semantic participation, not merely its visual side.
Angles provide a default layout hint and may be changed only as part of a
coherent template-wide layout change.

Every port on one node class must have a unique angle. Materialized handle
centers on the same node edge must retain enough pixel distance for both the
handles and their labels. The implicit `root` port uses `225` so it does not
overlap left-side semantic inputs or top-side containment inputs.

## Canonical Semantic Mappings

| Relationship | Source endpoint | Target endpoint |
| --- | --- | --- |
| Plan `achieves` Goal | `plan.goal` | `goal.plan` |
| Plan `contains` Phase | `plan.phases` | `phase.parent` |
| Phase `precedes` Phase | `phase.next` | `phase.previous` |
| Phase `contains` Action | `phase.actions` | `action.parent` |
| Action `produces` Milestone | `action.outcome` | `milestone.input` |
| Milestone `gates` Decision | `milestone.next` | `decision.input` |
| Decision `gates` Action | `decision.outcomes` | `action.gate` |
| Decision `branches to` Contingency | `decision.outcomes` | `contingency.trigger` |
| Plan `constrained by` Constraint | `plan.constraints` | `constraint.subject` |
| Phase `constrained by` Constraint | `phase.support` | `constraint.subject` |
| Action `constrained by` Constraint | `action.support` | `constraint.subject` |
| Phase `threatened by` Risk | `phase.support` | `risk.subject` |
| Action `threatened by` Risk | `action.support` | `risk.subject` |
| Risk `mitigated by` Contingency | `risk.mitigation` | `contingency.trigger` |

A relationship not listed here may use `root` only when no compatible named
port exists. Authors should extend this contract when a recurring relationship
needs a stable endpoint.

## Layout Contract

The default plan template reads from left to right for sequence and from top to
bottom for containment.

- Plan and Goal occupy the header band.
- Phases occupy one left-to-right sequence lane.
- Actions appear beneath their owning Phase.
- Milestones and Decisions follow the Action that produces or gates them.
- Constraints, Risks, and Contingencies occupy a supporting lane below the main
  execution path.
- A child should remain within the horizontal territory of its parent whenever
  practical.
- An edge should not cross an unrelated sibling column merely to reach a
  structurally convenient node.

Layout does not create meaning. Repositioning a node must not require changing
its semantic port unless the graph deliberately changes reading direction.

## Minimum-Edge Rule

Create the smallest set of edges that states the plan truthfully.

- Use containment to express ownership.
- Use sequence only where order is meaningful.
- Do not connect every Plan directly to every descendant.
- Do not add a sequence edge merely because two nodes are adjacent.
- Do not duplicate a relationship for visual emphasis.
- Do not route semantic relationships through class or bridge nodes.

## Authoring Procedure

Human and agent authors should follow this order:

1. Create the semantic nodes.
2. Assign nodes to the template's layout bands and lanes.
3. Add containment edges through named parent and child ports.
4. Add only the sequence and dependency edges required by the plan.
5. Add supporting constraints, risks, decisions, and contingencies.
6. Verify that every semantic edge has compatible named endpoints.
7. Inspect the semantic-only presentation for crossings and ambiguous flow.
8. Inspect contract and expansion layers separately when validating structure.

Authors must not solve routing problems by inventing false semantic nodes or
relationships.

## Validation Policy

### Load mode

Legacy graphs continue to load. Emit warnings for:

- A semantic edge using `root -> root` when compatible named ports exist.
- A semantic edge missing `sourcePort` or `targetPort`.
- An inferred rather than explicit edge category.
- A typed plan class that exposes only the implicit `root` port.

### Mutation mode

For graphs using the current contract, reject:

- A semantic edge whose source or target port does not exist.
- Directionally incompatible endpoints.
- A relationship role not accepted by either endpoint.
- A contract or expansion edge classified as semantic.
- A semantic edge classified as contract or expansion.
- `root -> root` when the canonical named endpoint pair exists.

Geometric crossing checks are advisory because rendering and node movement can
change geometry after validation.

## Presentation Controls

The editor should eventually expose edge layers as a visibility control:

- Semantic
- Contracts
- Expansion
- All

Changing edge visibility must not unload edges, remove references, change graph
identity, or alter save output.

## Migration Policy

Migration should be deterministic and idempotent.

1. Classify known contract and expansion roles.
2. Classify remaining plan-domain relationships as semantic.
3. Resolve endpoint node classes.
4. Map known relationship and class pairs to the canonical ports above.
5. Preserve `root` and report a warning when no mapping is safe.
6. Materialize the updated class ports on graph instances.
7. Preserve edge IDs and semantic labels.
8. Validate in load and mutation modes.
9. Visually review the semantic-only graph before publishing.

Migration must not infer a relationship that is absent from the source graph.

## Implementation Sequence

After approval of this draft:

1. Confirm the persisted edge-category field and port role metadata shape.
2. Update all nine plan node-class declarations and increment their versions.
3. Update the plan template edges and layout.
4. Add load warnings and mutation enforcement to graph validation.
5. Add semantic, contract, and expansion edge-layer filtering to the editor.
6. Add migration and audit tooling.
7. Migrate representative plan graphs, beginning with
   `plans/public-root-arrival/root.node`.
8. Audit the remaining templates using the accepted general rules.

## Review Questions

1. Should supporting relationships share `support`, or should Constraint and
   Risk receive separate source ports?
2. Should edge category be persisted under `data.presentation.layer`, or under
   a more general edge classification field?
3. Should current-contract mutation reject unnecessary root fallback
   immediately, or begin with warnings for one release?
4. Should contract and expansion edges share one infrastructure visibility
   toggle or remain independently controllable?
