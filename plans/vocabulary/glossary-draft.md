# Twilite glossary: first draft

A draft for Michael to mark up. Nothing in canon, the app or the files has changed yet. Each entry gives the word a reader sees, what it is in one line, and how it is stored. The **→** marks a proposed change to the stored name.

Numbers in **Collisions** and **Open questions** are there so you can answer by number.

**Decided so far** (Michael, 2026-10-14):
- **Root replaces Declaration**, everywhere: in the files, the app, canon and the guides. It is a noun and a verb.
- **Faces** is the word for how a graph looks from further away. Face names are the author's to choose: Detail, Summary and Icon are the usual names, not the only ones, and a graph with faces named anything else works the same way.
- **Membrane** stays, and is the only word for a graph's boundary. Frame, border and wrap are retired.
- **Import** and **export** are the two ends; a **Bridge** is the connection between them.

---

## Layer 1: Reading

These are the only words a visitor needs to read anything in the Twilite Zone.

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
| **content** | The words, pictures or markup a node shows. | node type `content` with `data.content.kind`; **also** node type `markdown` (1,069 nodes in current graphs). See Collision 1. |
| **link** | A hyperlink to a graph or a web page, written in content or set on a node. Drawn as a line when both ends are open. | `data.link`, `url`, `href`, or a link in content (not an edge) |
| **ground** | What you stand on inside a graph: where you land when you go in. A graph with graph content has one; a document has none. | edge `reference` with role `landing-surface` **→ edge `ground`** (Collision 2) |
| **document** | A graph that is only a page. It has no ground. | no marker: a graph with no ground |
| **scene** | A graph laid out as a picture, its nodes pinned where they belong. The Twilite Zone's front page and the Boulevard are scenes. | nothing of its own: pinned nodes |
| **faces** | How a graph or node looks from further away, largest to smallest. The author names them; the usual names are **Detail**, **Summary** and **Icon**, ending in the **Glyph**. The first face is the page. What the app shows depends on a face's place in the order and the room it has, never on its name. | `view` nodes joined by `view-sequence`, ending in a `glyph` node **→ `face` nodes joined by `next-face`** (Collision 11) |
| **template** | A graph you start a new graph from. | a graph made to be copied; kept under `templates/` |
| **collection** | A graph whose job is to list other graphs. | a graph of Portals |
| **workspace** | Where open graphs sit side by side. | not stored in graphs |

## Layer 3: Building templates and classes

Words for the template builder. A visitor never needs them.

| Word | What it is | Stored as |
|---|---|---|
| **root** (noun) | The node a graph begins from. It says what the graph is (its name, description and faces) and everything else in the graph hangs from it. Every graph has exactly one. The file is already called `root.node`. | node type `declaration` **→ `root`**; older graphs `manifest` (357 graphs, all retired). Collision 10. |
| **root** (verb) | To give something a root of its own, so it can be opened and gone inside: rooting a node makes it a graph. Proposed meaning; see Open question A. | — |
| **Surface** | One ordered set of faces a graph shows from outside. A graph can have more than one. | edge `surface` from the root to the first face |
| **Port** | A named place where a graph offers something to other graphs. The root is the graph's root Port. | node type `port`; on edges, `sourcePort`/`targetPort` **and** `sourceHandle`/`targetHandle` (Collision 5) |
| **export** | What a graph offers to other graphs: a class, a set of classes, or the whole graph. | node type `bridge` with role `export` **→ node type `export`** (Collision 12) |
| **import** | What a graph uses from another graph's export. A class used in a graph must come in through an import. | node type `bridge` with role `import` **→ node type `import`** (Collision 12) |
| **Bridge** | The connection from an export to the import that uses it: one graph drawing on another. Drawn in the workspace between the two graphs, and what Tidy arranges by. | not stored: worked out from the imports and exports of open graphs |
| **class** | The definition a node or edge follows: which Properties it has and how it looks. | `classRef` and `classKey` on nodes; `edgeClassRef` on edges; `relationshipRef` in the app's code (Collision 6) |
| **Edge Class** | A class for edges: what a kind of connection means and what it may join. | a graph built from the Edge Class template |
| **Property** | One named value on a node, as its class defines it. Changing it raises an event. | node type `field` (186) **and** node type `property` (204, in edge classes) **→ `property`** (Collision 3) |
| **Method** | Behaviour a graph can run, with its effects declared. | node type `method` |
| **Event Handler** | What runs Methods when an event happens. | node type `event-handler`, edges `invokes` and `listens` |
| **Script** | Code the graph loads and runs. | node type `script`; also top-level `scripts` in the file |
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

## Collisions found in the files

Each is a place where two stored names mean one thing, or one name means two things. The proposal is for both the reading word and the stored name.

1. **content and markdown.** Two node types for authored text. `content` is the primitive; `markdown` is older and still in 332 current graphs. **Proposed:** `markdown` nodes become `content` nodes with `kind: 'markdown'`; the `markdown` type is retired.
2. **landing surface and ground.** The stored role sounds like a kind of Surface, and it is not. **Proposed:** the edge is stored as type `ground`; "landing surface" is retired everywhere, including the edge class page and the app.
3. **Field and Property.** Already decided: Property. **Proposed:** `field` nodes become `property` nodes. The Field Specification becomes the Property Specification.
4. **Edges stored two ways.** Some edges carry their kind as `type` (`surface`, `view-sequence`, `invokes`); others are `type: 'reference'` with the kind in `data.semanticRole` or `data.role` (landing-surface, exposes-port, the class "instantiates" edges). The app labels `reference` as legacy. **Proposed:** an edge's `type` is always its class key; `semanticRole` and `role` are dropped.
5. **Port and handle.** Every edge stores its ends twice: `sourcePort` and `sourceHandle`. **Proposed:** `sourcePort`/`targetPort` only. "Handle" stays a word inside the code, never in a file.
6. **Three names for an edge's class.** `edgeClassRef` in files, `relationshipRef` in the app, and the app's list of edge types starts with one called Relationship. Nodes use `classRef`. **Proposed:** `classRef` on edges and nodes alike; "relationship" is retired as a stored word.
7. **Group and cluster.** The app calls them Groups; the file stores them as `clusters`; the workspace now arranges graphs into clusters of its own. **Proposed:** stored as `groups`. "Cluster" is only the workspace's arrangement and is never stored.
8. **The graph's name in two places.** `metadata.title`/`description` and the root's `identity.name`/`description` hold the same thing and can disagree. **Proposed:** the root is the only source; `metadata` keeps only what the root doesn't (dates, version of the file format). Also drop `nodeCount`, `edgeCount` and `timestamp`, which the app can work out.
9. **Portal and Graph Reference.** A `graph-reference` node type (6 nodes in 5 graphs) does what a Portal does. **Proposed:** retire it; those nodes become Portals.
10. **Declaration, manifest and root.** Decided: **root**. Node type `declaration` becomes `root`; `data.declaration` (its `kind`) becomes `data.root`; ids like `plan-template-declaration` become `plan-template-root`. In the app, `manifestUtils.js`, `validateManifestNodes` and every "declaration" in the code are renamed with it. The Declaration Specification becomes the Root Specification. The existing `root` names already fit: the file `root.node`, and the port called `root` on every node. One does not: templates also carry a separate Port node, `<name>-root-port`, joined to the Declaration by `exposes-port`, holding a copy of the title and summary. With the root as the graph's root Port, that node is a second root. **Proposed:** it goes, and whatever reads it reads the root.
11. **View, face and the fixed face names.** Decided: **faces**, with names the author chooses. **Proposed:** node type `view` becomes `face`, edge `view-sequence` becomes `next-face`, and a face's name is a plain field (`data.name`). The app stops looking for Detail, Summary or Icon by name: the first face is the page, the last is the Glyph, and the ones between are tried in order as room runs out. Anything in the app that asks for "the Detail view" asks for the first face instead.
12. **A Bridge node is half a bridge.** A `bridge` node is only ever one end, an import or an export, while the line drawn between two graphs is also called a Bridge. Decided: the ends are **import** and **export**. **Proposed:** node types `import` and `export` replace `bridge` and its `role` field (2,862 nodes, mostly the class imports in templates); ids like `plan-template-class-bridge-plan-goal` become `…-import-plan-goal`. The Bridge Specification becomes the page for imports and exports, and the Bridge edge class keeps its name for the connection.
13. **Membrane, frame, border, wrap.** Four words for a graph's boundary: the Membrane page, the stored "authored frame", the app's "border ports", the workspace's "wraps". Decided: **Membrane**. **Proposed:** wherever the boundary is stored it is stored as the membrane; the app's code and labels say membrane (membrane ports, not border ports).

## Retiring

Node types the app knows that no current graph uses, or that only old graphs use. **Proposed:** removed from the app.

- Old generation: `manifest`, `dictionary`, `legend` (16 left, all in old graph material), `promotable-markdown`, `subscription`, `event-declaration`.
- Unused utilities: `default`, `fixed`, `div`, `timer`, `toggle`, `counter`, `gate`, `delay`, `value-trigger`, `background-rpc`, `3d`, and probably `api` and `canvas` (one graph each).
- Old face wiring on the root: `default-view`, `summary-view`, `icon-view`, `editor-view`, `derived-view`, `shared-summary`, `shared-icon`, `shared-glyph`. The app still reads these as a Surface. **Proposed:** convert any graph we keep; delete the reading.
- Address forwarding (`MOVED_TO_CANON`): old GitHub addresses for graphs that moved to canon. **Proposed:** rewrite the addresses in the files and delete the forwarding.

Kept, because the app makes them while it runs and they are never saved: `route-pin`, `web-content`, `unavailable-resource`.

## Open questions

- **A. Root as a verb.** Decided that root is a noun and a verb. This draft proposes the verb means *giving something a root of its own so it can be gone inside*: you root a node to make it a graph. Is that the meaning you have in mind?
- **B. Is the Glyph a face?** With free names, the Glyph could simply be the last face, named Glyph by habit. Today it is its own primitive (a compact symbol) and ends every chain. Keep it separate, or make it a face like the others?

## Old graph material

Graphs still on `manifest` are the previous generation. Where they are:

- **Twilite Zone:** `Roadmaps/` (16), `Sections/` (4), `next/` (2), `research/`, `twilite/storage-closet/`, most of `tasks/` (about 100 across `archive`, `nodeset-planning`, `dictionary-demotion`, `ui-analysis` and others), `tutorial/archive/` (39), `library/classes/` (123 of 160), `library/documentation/` (65 of 82).
- **The app's bundled `public/`:** a copy of the same.
- **Personal library:** one graph in `templates/idea-template`.

Delete, or convert? `library/classes` and `library/documentation` are the ones to look at first, since they sit inside canon.
