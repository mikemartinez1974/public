---
name: workboard-template
description: Create, derive, repair, or maintain Twilite workboards from the graph-adjacent canonical template. Use when an agent needs to instantiate a workboard, add local or projected tasks, preserve graph-owned reconciliation, configure lanes and ordering, or validate workboard task projections.
---

# Workboard Template

Use [root.node](root.node) as the executable template. Preserve its declaration, declared root port, controller, lane anchors, empty states, reconciler, class bridges, and bindings before replacing example content. Root identity comes from the declaration surface named `root`, never from a node-level `root: true` flag.

## Model

- Keep `task` as the semantic invariant. A task remains a task inside its own graph and when projected into another graph.
- Treat project as a description of scope, not a separate node type.
- Use a local `task` node when the current graph owns the work completely.
- Use a `portal` when another task graph owns the work. The resolved surface must render as `task`; the portal remains only its carrier and provenance.
- Let source task graphs own status, progress, priority, blockers, next actions, and durable summaries.
- Let the workboard own lane, rank, pinning, review time, and source-health state under local `data.board`.
- Install at most one Workboard capability in a graph. The single board owns graph-local placement for every task it can resolve.
- Treat the Workboard Reconciler as `template-only`, not as a standalone Script or selectively placeable Elements entry. Its bounded capability set includes the sole Workboard controller, five lane anchors, their empty states, and the graph-local task carriers it reconciles.
- Use the Script node's `placementMode`, `capabilityRef`, `placementReason`, `requirements`, `effects`, `grants`, and `multiplicity` fields to keep that boundary inspectable without reading source.

## Derive A Workboard

1. Copy `root.node` structurally, not visually.
2. Retarget graph identity, the declaration's `root` surface and primitive root port, GitHub settings, controller identity, and every graph-specific ID.
3. Preserve the hidden `workboard` and `task` class bridges. `dependencies.nodeTypes` does not grant class authority.
4. Preserve the graph-owned reconciler and retarget every embedded node ID it addresses.
5. Replace the example Task Library portal with the intended collection, or remove it deliberately.
6. Add local task nodes or source-backed task portals. Do not copy external summary text into the workboard.
7. Keep automatic placement unpinned with `data.board.laneMode: "auto"`; keep manual placement pinned with `laneMode: "manual"`.
8. Retarget the reconciler's `data.controllerNodeId` and embedded `CONTROLLER_NODE_ID` to the installed workboard controller.
9. Before writing, reject installation if the host graph already contains a Workboard controller. Do not rename IDs or create a second controller.
10. Run reconciliation and save the workboard after source summaries are materialized.

## Promotion Boundary

Promote a local task into its own graph when it needs subordinate tasks, questions, decisions, risks, independent authority, or a durable external surface. The promoted graph still owns a regular task representation. Leave a portal-backed task projection in the collection or workboard; do not change its semantic type to project.

## Reconciliation Rules

- Register local work by the presence of a literal `task` node.
- Register external work only when the resolved portal surface has effective type `task`.
- Resolve effective type from the exposed port override, then source declaration kind, then selected source node type.
- Normalize legacy `task-graph` to `task`.
- Map source status to lanes through controller policy.
- A reconciler must select its own controller by explicit node ID; it must never use the first workboard node it happens to find.
- Exactly one Workboard controller is required. A reconciler must stop with a clear `WORKBOARD_SINGLETON_VIOLATION` result when the graph contains zero or multiple controllers.
- Unscoped tasks remain eligible and reconciliation stamps them with the sole controller ID. New local tasks therefore join the graph's board without an extra enrollment step.
- A task may be projected onto workboards in different graphs, where each graph owns independent local `data.board` placement. Do not place two Workboard controllers in one graph to obtain two placements.
- Preserve manual placement and `data.board` while refreshing source-owned fields.
- Keep the reconciler graph-owned. Do not move projection resolution into application React code.
- Require a second unchanged run after a mutating reconciliation to prove idempotence.

## Validation

- Parse the graph as JSON.
- Verify declaration-first structure and exactly one declared `root` surface backed by a real primitive `port`.
- Verify every edge endpoint and named handle.
- Verify both class bridges and all class bindings.
- Compile the embedded reconciler with the Twilite script wrapper.
- Confirm local tasks and projected tasks both render as `task`.
- Confirm source changes move automatic cards and do not move pinned cards.
- Confirm a second controller is rejected as a Workboard capability collision before it can move tasks.
- Confirm empty-state cards match actual lane contents.

Publish the template or source task graphs before publishing a consumer that depends on their exposed surfaces.
