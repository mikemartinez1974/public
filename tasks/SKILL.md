---
name: task-collection
description: Maintain Michael's Twilite task collection, task archive, and task-graph lifecycle. Use when any agent adds, completes, promotes, projects, archives, restores, or validates work under github://mikemartinez1974/public/tasks/.
---

# Task Collection

Treat [root.node](root.node) as the active task collection and [archive/root.node](archive/root.node) as the bounded archive index. Preserve declaration-first structure, exposed primitive ports, task class bindings, bridge authority, source-backed portals, and durable `github://` identity.

## Active Work

- Keep literal `task` nodes in `root.node` only while their status is active: `todo`, `in-progress`, `blocked`, or `waiting`.
- Keep external work source-owned. Represent a promoted task graph with an ordinary portal to its exposed task surface.
- Do not copy external summaries into the collection or invent a separate project semantic type.
- Promote a local task when it needs subordinate tasks, questions, decisions, risks, independent authority, or a durable external surface.

## Completion And Archival

1. Finish the source task first and materialize its final summary when it owns a graph.
2. Preserve final status, completion time, outcome or resolution path, and durable artifact references.
3. Move completed local tasks into the current bounded partition under `archive/<year>/` before removing them from `root.node`.
4. For a promoted task graph, preserve the source graph and move its portal from the active collection to the archive partition.
5. Add a new yearly or quarterly partition when the current one would become unbounded; link it from `archive/root.node` through a normal portal.
6. Delete only accidental, duplicate, test, legally removed, or explicitly valueless records.

Archival changes active membership, not identity or provenance. Never silently replace a durable source address with copied text.

## Child Task Graphs

- Load a nearer graph-adjacent `SKILL.md` when a child task graph or template provides one; otherwise use this skill as the lifecycle fallback.
- Only call an artifact a task graph when it contains a `goal` and at least one associated `task` or `open-question`.
- Preserve graph-owned summaries and updaters. Run the updater before publishing or refreshing a consuming portal.
- Keep `task` as the effective semantic type in collections and workboards.

## Validation

- Parse every touched `.node` file as JSON.
- Verify declaration surfaces point to real primitive ports.
- Verify every edge endpoint and named handle.
- Verify every portal's `sourceRef`, `sourceNodeId`, `sourcePayload`, and surface against the source graph.
- Verify task class bindings and bridge references.
- Confirm the active collection contains no unintended `done` or `cancelled` task nodes.
- Confirm each archived task has an outcome or resolution path and each archive partition remains reachable from the archive index.
