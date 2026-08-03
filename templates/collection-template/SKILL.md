---
name: collection-template
description: Create and maintain Twilite collection graphs whose membership comes from repository-directory structure and whose browse surface presents a transient window of ordinary member root cards. Use when creating a collection, converting a portal index into automatic membership, or adding collection browsing without authoring one portal per member.
---

# Collection Template

Treat this file and the adjacent `root.node` as one versioned package.

## Derive a collection

1. Copy `root.node` into the target collection directory.
2. Retarget declaration identity, scope, root labels, repository-home portal, and graph-local IDs.
3. Preserve `intent.kind: collection`, the canonical `root` surface, and the `data.collection` contract.
4. Put member graphs in the collection directory:
   - include direct `.node` files except the collection's own `root.node`;
   - include `root.node` from each direct child directory;
   - do not recursively flatten deeper descendants.
5. Retarget `data.collection.collectionRef` to the collection graph's durable `github://` address.
6. Preserve the graph-owned Collection Window Controller and its `collection-window.js` reference. Do not replace it with collection-specific application code.
7. Do not create authored member portals. The controller discovers and projects member roots at runtime.
8. Keep intentional navigation portals, such as repository home or a related collection, separate from membership.

## Collection view contract

- `membership.source` must be `repository-directory`.
- `membership.recursive` must remain `false`.
- `view.mode` must be `windowed`.
- `view.windowSize` controls the bounded visible group; use `10` unless the user asks otherwise.
- `view.payload` must remain `node.web` so each member owns its card.
- Placement and card dimensions are presentation settings owned by the collection graph.

The graph-owned controller owns membership discovery, window state, placement, and Previous/Refresh/Next events. The app supplies only generic script execution, authorized repository listing, graph reads, portal rendering, and transient-node persistence protection.

The live window may load and unload transient portal cards. Never persist those runtime projections into the graph file, and never rewrite member graphs while browsing.

## Repository boundary

Discover members only inside the repository containing the collection graph. Public and authorized private repositories use the same rule. A portal may navigate to another repository, but its destination never becomes a member through traversal.

## Validation

- Confirm the declaration exposes exactly one canonical `root` port.
- Confirm adding a direct `.node` member requires no edit to `root.node`.
- Confirm child directories without `root.node` are ignored.
- Confirm only the visible window resolves member graphs.
- Confirm desktop controls, wheel movement, touch swipes, and portal navigation work.
- Save and verify that no node with `data._runtime` entered the authored graph.
