---
name: collection-template
description: Create and maintain Twilite collection graphs whose membership comes from repository-directory structure and whose browse surface presents a transient window of handle-free member Portals. Use when creating a collection, converting a portal index into automatic membership, or adding collection browsing without authoring one portal per member.
---

# Collection Template

Treat this file and the adjacent `root.node` as one versioned package.

## Derive a collection

1. Copy `root.node` into the target collection directory.
2. Retarget declaration identity, scope, root labels, repository-home portal, and graph-local IDs. For a new collection, bring the host graph up to the current Declaration relationship model instead of copying legacy Port-as-View structure forward.
3. Preserve `intent.kind: collection`, the Declaration's implicit root interface, and the `data.collection` contract. Occupy required Declaration relationships: default, summary, icon, glyph, and landing surface. Additional exposed Ports remain optional.
4. Put member graphs in the collection directory:
   - include direct `.node` files except the collection's own `root.node`;
   - include `root.node` from each direct child directory;
   - do not recursively flatten deeper descendants.
5. Retarget `data.collection.collectionRef` to the collection graph's durable `github://` address.
6. Preserve the graph-owned Collection Window Controller and its inline `source`. Keep `collection-window.js` as the maintainable source copy; `scriptRef` is provenance and fallback, not a deployment dependency. Do not replace the controller with collection-specific application code.
7. Treat projected members as reusable window slots. Update those slots in place as the window moves, keep durable member identity in `_origin.ref`, and delete only surplus slots on a short final window. This keeps the canvas and minimap on the same canonical node set.
8. Do not create authored member portals. The controller discovers members and projects transient Portals at runtime.
9. Keep intentional navigation portals, such as repository home or a related collection, separate from membership.

## Collection view contract

- `membership.source` must be `repository-directory`.
- `membership.recursive` must remain `false`.
- `view.mode` must be `windowed`.
- `view.windowSize` controls the bounded visible group; use `10` unless the user asks otherwise.
- `view.payload` names the member Port initially consumed by the collection. It is a semantic baseline, not a locked View.
- Placement and card dimensions are presentation settings owned by the collection graph.
- A requested member surface controls projection and card sizing only. Never rewrite a projected member's `data.presentation.baseLevel`; preserve the member's authored semantic baseline so ordinary zoom bands still promote it.

The graph-owned controller owns membership discovery, window state, placement, and Previous/Refresh/Next events. It reconciles each window with one `applyDeltas` transaction so the prior member set cannot survive beside the next one. The app supplies only generic script execution, authorized repository listing, graph reads, atomic graph deltas, portal rendering, and transient-node persistence protection.

The controller is an operational node at every semantic level from icon upward. Its class owns one event vocabulary and presents it with increasing depth:

- `node.web.icon`: Previous and Next, plus the current range.
- `node.web.summary`: Previous, Apply Size, Refresh, Next, range, and run status.
- `node.web.detail`: Previous, Refresh, Next, range, configuration status, source, requirements, effects, and grants.
- `editor.web`: configuration only, entered explicitly through the node context menu.

Keep those buttons inside the authored card surfaces with `controlsPlacement: content`. They emit `collection:previous`, `collection:page-size`, `collection:refresh`, and `collection:next`; they do not contain or duplicate execution logic. The class-backed Script node receives each event and runs the bridged collection script. Semantic zoom may change the presentation depth, but must not remove the controller's core paging operation from icon, summary, or detail.

Until the deployed runtime exposes authorized repository listing to graph scripts, `collection.compatibilityMembers` may hold a temporary explicit index. Keep it synchronized with the directory and remove it after the runtime primitive is available; it is fallback data, not the collection's membership authority.

The live window loads and unloads transient Portal projections of members. A projected Portal:

- preserves member identity in `_origin.ref` and the target Glyph in `data.presentation.glyph`;
- addresses the member Declaration or exposed Port and negotiates icon, summary, and detail Views through semantic zoom;
- exposes no Ports or handles of its own;
- navigates to the addressed member when activated;
- uses the authored-frame minimap only as fallback when no semantic View resolves.

Never copy a member's semantic instance into the collection as though it were locally instantiated. Never persist runtime projections into the graph file, and never rewrite member graphs while browsing.

## Repository boundary

Discover members only inside the repository containing the collection graph. Public and authorized private repositories use the same rule. A portal may navigate to another repository, but its destination never becomes a member through traversal.

## Edge contract

- Author edge endpoints with `sourceHandle` and `targetHandle`. Do not emit the legacy edge-record aliases `sourcePort` or `targetPort`.
- Every handle named by an edge must exist as an authored handle or exposed Port on the corresponding endpoint node.
- Keep relationship intent explicit in the edge label and `data.semanticRole`; endpoint handles describe attachment, not meaning.
- Preserve `targetPort` inside behavior metadata such as `drag-create`. There it names the semantic input Port on a newly created node and is not an edge endpoint field.

## Validation

- Confirm the Declaration supplies the implicit root interface and all required presentation/frame relationships are occupied.
- Confirm every authored edge uses `sourceHandle` and `targetHandle`, contains no edge-record `sourcePort` or `targetPort`, and resolves both handles against its endpoint nodes.
- Confirm every runtime member is a handle-free Portal carrying the target Glyph and semantic View address.
- Confirm adding a direct `.node` member requires no edit to `root.node`.
- Confirm child directories without `root.node` are ignored.
- Confirm only the visible window resolves member graphs.
- Confirm desktop controls, wheel movement, touch swipes, and portal navigation work.
- Save and verify that no node with `data._runtime` entered the authored graph.
