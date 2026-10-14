# Twilite glossary: first draft

A draft for Michael to mark up. Nothing in canon, the app or the files has changed yet. Each entry gives the word a reader sees, what it is in one line, and how it is stored. The **→** marks a proposed change to the stored name.

Numbers in **Collisions** are there so you can answer by number.

**Decided so far** (Michael, 2026-10-14):
- **Root replaces Declaration**, everywhere: in the files, the app, canon and the guides. It is a noun and a verb: to root graphs is to select several in the workspace and make a new graph from them (not built yet).
- **Faces** is the word for how a graph looks from further away. Face names are the author's to choose: Detail, Summary and Icon are the usual names, not the only ones, and a graph with faces named anything else works the same way.
- **Membrane** stays, and is the only word for a graph's boundary. Frame, border and wrap are retired.
- **Import** and **export** are the two ends; a **Bridge** is the connection between them.
- **The Glyph is not a face.** It stays its own primitive, with its own editor and a fixed name. The faces end at it.

---

## Layer 1: Reading

These are the only words a visitor needs to read anything in the Twilite Zone.

**Graph or node.** The same thing is a graph or a node depending on where you stand. Inside it, it is a graph, with nodes of its own. From outside, it is a node: it has faces and a Glyph, and it sits in the workspace or behind a Portal like any other node. The glossary uses whichever word fits where the reader is standing.

| Word | What it is | Stored as |
|---|---|---|
| **graph** | A thing you can open: a set of nodes and the edges between them, saved as one `.node` file with its own address. | the file; `tlz://host/path/root.node` |
| **node** | One thing inside a graph. | an entry in `nodes` |
| **edge** | A named connection between two nodes. Its name says what the connection means. Click the name to read about that kind of connection. | an entry in `edges` |
| **page** | What a graph or a node looks like when you are close enough to read it. | its first, largest face (see faces) |
| **Portal** | A door to another graph. Click it to go through. | node type `portal` |

## Layer 2: Making your own graph

Words that arrive when someone starts making things.

| Word | What it is | Stored as |
|---|---|---|
| **content** | The words, pictures or markup a node shows. | node type `content` with `data.content.kind`; today also node type `markdown` (1,069 nodes) **→ `content` only** (Collision 1) |
| **link** | An edge on the web: a connection to a graph or a web page, written in content or set on a node. It is drawn as an edge, and should be wherever its ends are in the workspace, including web pages. | `data.link`, `url`, `href`, or a link in content, drawn by the `link` edge class |
| **ground** | What you stand on inside a graph: where you land when you go in. A graph with graph content has one; a document has none. | edge `reference` with role `landing-surface` **→ edge `ground`, from the root's `ground` port** (Collision 2) |
| **document** | A graph that is only a page. It has no ground. *Under review: see Design talks.* | no marker: a graph with no ground |
| **scene** | A graph laid out as a picture, its nodes pinned where they belong. The Twilite Zone's front page and the Boulevard are scenes. *Under review: see Design talks.* | nothing of its own: pinned nodes |
| **faces** | How a graph or node looks from further away, largest to smallest. The author names them; the usual names are **Detail**, **Summary** and **Icon**. The first face is the page. What the app shows depends on a face's place in the order and the room it has, never on its name. The order ends at the Glyph. | `view` nodes joined by `view-sequence`, ending in a `glyph` node **→ `face` nodes joined by `next-face`**, ending in the `glyph` (Collision 11) |
| **Glyph** | A node's mark: the symbol that stands for it. Faces are how a node looks; the Glyph is how it is recognised. A graph has one because, seen from outside, a graph is a node. It is shown when there is no room for even the smallest face, and wherever the node is named in a small space: lists, the trail, link chips, tabs, bookmarks. It has its own editor and its name is always Glyph. | node type `glyph` |
| **template** | A graph you start a new graph from. | a graph made to be copied; kept under `templates/` |
| **collection** | A graph whose job is to list other graphs. *Under review: see Design talks.* | a graph of Portals |
| **workspace** | Where open graphs sit side by side. | not stored in graphs |

## Layer 3: Building templates and classes

Words for the template builder. A visitor never needs them.

| Word | What it is | Stored as |
|---|---|---|
| **root** (noun) | The node a graph begins from. It says what the graph is (its name, description and faces) and everything else in the graph hangs from it. Every graph has exactly one. The file is already called `root.node`. | node type `declaration` **→ `root`**; older graphs `manifest` (357 graphs, all retired). Collision 10. |
| **root** (verb) | To select several graphs in the workspace and make a new graph from them, with a root of its own. It is what Twilite has instead of grouping. *Not built yet.* It works on graphs only: lifting nodes out of a graph into a new one is copy and paste, at least in the free version. | — |
| **Surface** | One ordered set of faces a graph shows from outside. A graph can have more than one. | edge `surface` from the root to the first face |
| **Port** | A named place where a graph offers something to other graphs. The root is the graph's root Port. | node type `port`; on edges, `sourcePort`/`targetPort` **and** `sourceHandle`/`targetHandle` **→ `sourcePort`/`targetPort` only** (Collision 5) |
| **export** | What a graph offers to other graphs: a class, a set of classes, or the whole graph. | node type `bridge` with role `export` **→ node type `export`** (Collision 12) |
| **import** | What a graph uses from another graph's export. A class used in a graph must come in through an import. | node type `bridge` with role `import` **→ node type `import`** (Collision 12) |
| **Bridge** | The connection from an export to the import that uses it: one graph drawing on another. A Bridge is a classed edge (the `bridge` edge class), not a class of node. Drawn in the workspace between the two graphs, and what Tidy arranges by. | not stored: worked out from the imports and exports of open graphs |
| **class** | The definition a node or edge follows: which Properties it has and how it looks. | `classKey` and `classRef` on nodes; `edgeClassRef` on edges; `relationshipRef` in the app's code **→ on nodes and edges alike, `type` is the class key and `classRef` the class graph's address** (Collisions 4 and 6) |
| **Edge Class** | A class for edges: what a kind of connection means and what it may join. | a graph built from the Edge Class template |
| **Property** | One named value on a node, as its class defines it. Every Property announces `property.changed` when its value changes; nothing happens unless an edge is drawn from it. A Property with no edge out is what a field used to be. | node type `field` (186) **and** node type `property` (204, in edge classes) **→ `property`** (Collision 3) |
| **Method** | The only code in a graph. It runs when something invokes it, and declares what it may change; the app refuses anything else. A Method has an `invokes` port of its own, so one Method can run the next. | node type `method` |
| **invokes** | The edge that makes something happen: from what raises an event (a Property, a node, a button, a Method) to the Method it runs, naming the event. Every source draws its own edge: structure matters. *Name proposed.* | edge `invokes`; today also the `event-handler` node, trigger edges and `listens` edges, all retired |
| **Membrane** | A graph's boundary: what it holds in, and where its ports sit for things to cross. A graph grows from its root and is held by its membrane. | node type `membrane` (its control points), edge `membrane`; also stored as the "authored frame" **→ membrane only** (Collision 13) |
| **Specification** | The page that defines a primitive. | an ordinary graph under `library/primitives/` |
| **primitive** | One of the sixteen parts every graph is made of. Each has a Specification. | — |

## In the app (navigation)

Already in canon on the navigation page. Listed here so the glossary is complete.

| Word | What it is |
|---|---|
| **inside** | Where you are after entering a graph: standing on its ground. |
| **trail** | The path at the top of the window: Workspace › graph › node › Inside. |
| **going through** | Following a Portal, or the end of a line, to where it leads. |
| **Tidy** | Arranging the workspace: graphs joined by a Bridge close together (imports on the left, exports on the right), Portal graphs further out. |

---

## Design talks

Raised by Michael reading the tables, 2026-10-14. The words in these areas are not settled until the talk is had.

- **A. Behaviour.** Decided with Michael, 2026-10-14; see `behaviour-today.md`, "Decided". Event handling runs along the edges: every source draws its own `invokes` edge to the Method, Methods invoke Methods through their own `invokes` port, a button is a node that raises an event, and Scripts and Event Handler nodes retire. Listening across graphs stays and is redesigned in the same shape.
- **B. Document, scene and collection.** What each one is, whether they are kinds of graph or ways of laying one out, and how a reader tells them apart.
- **C. Web pages in the workspace.** A link is an edge on the web and should be drawn. Web pages in the workspace have had little attention so far.

## Collisions found in the files

Each is a place where two stored names mean one thing, or one name means two things. Answered by Michael, 2026-10-14.

### Agreed

1. **content, not markdown.** Every `markdown` node becomes a `content` node with `kind: 'markdown'`. There are no more markdown nodes, and the app stops knowing the type.
2. **ground, not landing surface.** "Landing surface" is retired everywhere: the files, the app, the edge class page, the guides. The ground is joined to the root by a `ground` edge that leaves from a **`ground` port on the root**, so the root shows where its ground is attached the way it shows its other ports.
3. **Property, not Field.** `field` nodes become `property` nodes, and the Field Specification becomes the Property Specification. **The events keep their names:** `property.changed` when a Property's value changes and `node.changed` for its node. They already say Property, so after the change every Property raises them, whether it was a `field` or a `property` before.
4. **Edges and nodes store their class the same way.** Today some edges carry their kind as `type` (`surface`, `view-sequence`, `invokes`) and others are `type: 'reference'` with the kind in `data.semanticRole` or `data.role`; nodes carry `type`, `classKey` and `classRef`. **Agreed:** edges and nodes behave the same. `type` is always the class key (`ground`, `surface`, `next-face`, `invokes`, `exposes-port`, `instantiates`; `task`, `goal`, `property`), and `classRef` is the address of the class graph. `classKey`, `semanticRole`, `role` and the `reference` edge type go.
5. **Port, not handle.** Every edge stores its ends twice, as `sourcePort` and `sourceHandle`. **Agreed:** files store `sourcePort` and `targetPort` only. "Handle" stays a word inside the code, for the spot you grab on screen, and is never saved.
6. **Three names for an edge's class.** `edgeClassRef` in files, `relationshipRef` in the app, and the app's list of edge types starts with one called Relationship. **Agreed:** `classRef` on edges and nodes alike; "relationship" is retired as a stored word. See 4.
7. **Groups are retired.** The app calls them Groups and the file stores them as `clusters`. Of 804 graphs with a `clusters` key, 5 hold any group and none of them is current. In Twilite the thing that groups nodes is a graph: a group is a graph that isn't allowed to be one, with no root, address, faces or ports, and every job it does is done better by a membrane, faces, a root or a scene. **Agreed:** groups leave the app (`GroupManager` and the group menus) and the `clusters` key leaves current graphs. "Cluster" then means only how the workspace arranges graphs, and is never stored. What people reach for a group to do, select several things and make them one, is **rooting**.
8. **The graph's name in two places.** `metadata.title`/`description` and the root's `identity.name`/`description` hold the same thing and can disagree. **Agreed:** the root is the only source; `metadata` keeps only what the root doesn't (dates, version of the file format). Also drop `nodeCount`, `edgeCount` and `timestamp`, which the app can work out.
9. **Graph Reference is retired.** No graph uses it on purpose: the 8 graphs holding one are old material or the two multi-declaration smoke tests. Its only live use is the app itself: dragging from the root's "default handle" into empty space makes one (`declarationRelationshipHandles.js`). **Agreed:** the `graph-reference` type goes, and that drag makes a Portal instead, since a Portal is how one graph points at another.
10. **Declaration, manifest and root.** Decided: **root**. Node type `declaration` becomes `root`; `data.declaration` (its `kind`) becomes `data.root`; ids like `plan-template-declaration` become `plan-template-root`. In the app, `manifestUtils.js`, `validateManifestNodes` and every "declaration" in the code are renamed with it. The Declaration Specification becomes the Root Specification. The existing `root` names already fit: the file `root.node`, and the port called `root` on every node. One does not: templates also carry a separate Port node, `<name>-root-port`, joined to the Declaration by `exposes-port`, holding a copy of the title and summary. With the root as the graph's root Port, that node is a second root. **Agreed:** it goes, and whatever reads it reads the root.
11. **View, face and the fixed face names.** Decided: **faces**, with names the author chooses. **Agreed:** node type `view` becomes `face`, edge `view-sequence` becomes `next-face`, and a face's name is a plain field (`data.name`). The app stops looking for Detail, Summary or Icon by name: the first face is the page, the rest are tried in order as room runs out, and when none fits the app shows the Glyph. Anything in the app that asks for "the Detail view" asks for the first face instead.
12. **A Bridge node is half a bridge.** A `bridge` node is only ever one end, an import or an export, while the line drawn between two graphs is also called a Bridge. Decided: the ends are **import** and **export**. **Agreed:** node types `import` and `export` replace `bridge` and its `role` field (2,862 nodes, mostly the class imports in templates); ids like `plan-template-class-bridge-plan-goal` become `…-import-plan-goal`. The Bridge Specification becomes the page for imports and exports, and the Bridge edge class keeps its name for the connection.
13. **Membrane, frame, border, wrap.** Four words for a graph's boundary: the Membrane page, the stored "authored frame", the app's "border ports", the workspace's "wraps". Decided: **Membrane**. **Agreed:** wherever the boundary is stored it is stored as the membrane; the app's code and labels say membrane (membrane ports, not border ports).

## Retiring

Node types the app knows that no current graph uses, or that only old graphs use. **Agreed** (Michael, 2026-10-14): removed from the app.

- Old generation: `manifest`, `dictionary`, `legend` (16 left, all in old graph material), `promotable-markdown`, `subscription`, `event-declaration`, `graph-reference` (Collision 9).
- Behaviour: `event-handler`, `script` and the top-level `scripts` list, `subscription`, the `listens` edge, trigger edges, listening by class. See Design talk A.
- Groups (Collision 7): the `clusters` key in files, `GroupManager` and the group menus in the app.
- Unused utilities: `default`, `fixed`, `div`, `timer`, `toggle`, `counter`, `gate`, `delay`, `value-trigger`, `background-rpc`, `3d`, and probably `api` and `canvas` (one graph each).
- Old face wiring on the root: `default-view`, `summary-view`, `icon-view`, `editor-view`, `derived-view`, `shared-summary`, `shared-icon`, `shared-glyph`. The app still reads these as a Surface. The reading is deleted; current graphs that still use them are converted.
- Address forwarding (`MOVED_TO_CANON`): old GitHub addresses for graphs that moved to canon. The addresses in current graphs are rewritten and the forwarding is deleted.

Kept, because the app makes them while it runs and they are never saved: `route-pin`, `web-content`, `unavailable-resource`.

## Old graph material

Graphs still on `manifest` are the previous generation. **Agreed** (Michael, 2026-10-14): they are **kept, not deleted and not converted.** Once the app stops knowing the old words it will no longer render them, but the files can still be read, and they are needed for reference.

Where they are:

- **Twilite Zone:** `Roadmaps/` (16), `Sections/` (4), `next/` (2), `research/`, `twilite/storage-closet/`, most of `tasks/` (about 100 across `archive`, `nodeset-planning`, `dictionary-demotion`, `ui-analysis` and others), `tutorial/archive/` (39), `library/classes/` (123 of 160), `library/documentation/` (65 of 82).
- **The app's bundled `public/`:** a copy of the same.
- **Personal library:** one graph in `templates/idea-template`.

Because they stay in the repositories, the sweep for retired words skips them. Two of these folders sit inside canon, `library/classes` and `library/documentation`; what belongs there now is a question for the canon work, not this plan.
