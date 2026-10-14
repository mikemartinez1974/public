# Twilite glossary: first draft

A draft for Michael to mark up. Nothing in canon, the app or the files has changed yet. Each entry gives the word a reader sees, what it is in one line, and how it is stored. The **→** marks a proposed change to the stored name.

Numbers in **Collisions** and **Open questions** are there so you can answer by number.

---

## Layer 1: Reading

These are the only words a visitor needs to read anything in the Twilite Zone.

| Word | What it is | Stored as |
|---|---|---|
| **graph** | A thing you can open: a set of nodes and the edges between them, saved as one `.node` file with its own address. | the file; `tlz://host/path/root.node` |
| **node** | One thing inside a graph. | an entry in `nodes` |
| **edge** | A named connection between two nodes. Its name says what the connection means. Click the name to read about that kind of connection. | an entry in `edges` |
| **page** | What a graph or a node looks like when you are close enough to read it. | the Detail face (see Layer 2) |
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
| **faces** | How a graph or node looks from further away, largest to smallest: **Detail**, **Summary**, **Icon**, **Glyph**. The Detail face is the page. | `view` nodes joined by `view-sequence`, ending in a `glyph` node. See Open question B. |
| **template** | A graph you start a new graph from. | a graph made to be copied; kept under `templates/` |
| **collection** | A graph whose job is to list other graphs. | a graph of Portals |
| **workspace** | Where open graphs sit side by side. | not stored in graphs |

## Layer 3: Building templates and classes

Words for the template builder. A visitor never needs them.

| Word | What it is | Stored as |
|---|---|---|
| **Declaration** | The node that says what a graph is: its name, description and faces. Every graph has exactly one. | node type `declaration`; older graphs `manifest` (357 graphs, all retired). See Open question A. |
| **Surface** | One ordered set of faces a graph shows from outside. A graph can have more than one. | edge `surface` from the Declaration to the first face |
| **Port** | A named place where a graph offers something to other graphs. The Declaration is the graph's root Port. | node type `port`; on edges, `sourcePort`/`targetPort` **and** `sourceHandle`/`targetHandle` (Collision 5) |
| **Bridge** | One graph using what another offers: an import on one side, an export on the other. | node type `bridge` |
| **class** | The definition a node or edge follows: which Properties it has and how it looks. | `classRef` and `classKey` on nodes; `edgeClassRef` on edges; `relationshipRef` in the app's code (Collision 6) |
| **Edge Class** | A class for edges: what a kind of connection means and what it may join. | a graph built from the Edge Class template |
| **Property** | One named value on a node, as its class defines it. Changing it raises an event. | node type `field` (186) **and** node type `property` (204, in edge classes) **→ `property`** (Collision 3) |
| **Method** | Behaviour a graph can run, with its effects declared. | node type `method` |
| **Event Handler** | What runs Methods when an event happens. | node type `event-handler`, edges `invokes` and `listens` |
| **Script** | Code the graph loads and runs. | node type `script`; also top-level `scripts` in the file |
| **Membrane** | A graph's boundary as drawn. | node type `membrane`, edge `membrane` |
| **Specification** | The page that defines a primitive. | an ordinary graph under `library/primitives/` |
| **primitive** | One of the sixteen parts every graph is made of. Each has a Specification. | — |

## In the app (navigation)

Already in canon on the navigation page. Listed here so the glossary is complete.

| Word | What it is |
|---|---|
| **inside** | Where you are after entering a graph: standing on its ground. |
| **trail** | The path at the top of the window: Workspace › graph › node › Inside. |
| **going through** | Following a Portal, or the end of a line, to where it leads. |
| **Tidy** | Arranging the workspace: bridged graphs close together, Portal graphs further out. |

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
8. **The graph's name in two places.** `metadata.title`/`description` and the Declaration's `identity.name`/`description` hold the same thing and can disagree. **Proposed:** the Declaration is the only source; `metadata` keeps only what the Declaration doesn't (dates, version of the file format). Also drop `nodeCount`, `edgeCount` and `timestamp`, which the app can work out.
9. **Portal and Graph Reference.** A `graph-reference` node type (6 nodes in 5 graphs) does what a Portal does. **Proposed:** retire it; those nodes become Portals.

## Retiring

Node types the app knows that no current graph uses, or that only old graphs use. **Proposed:** removed from the app.

- Old generation: `manifest`, `dictionary`, `legend` (16 left, all in old graph material), `promotable-markdown`, `subscription`, `event-declaration`.
- Unused utilities: `default`, `fixed`, `div`, `timer`, `toggle`, `counter`, `gate`, `delay`, `value-trigger`, `background-rpc`, `3d`, and probably `api` and `canvas` (one graph each).
- Old face wiring on the Declaration: `default-view`, `summary-view`, `icon-view`, `editor-view`, `derived-view`, `shared-summary`, `shared-icon`, `shared-glyph`. The app still reads these as a Surface. **Proposed:** convert any graph we keep; delete the reading.
- Address forwarding (`MOVED_TO_CANON`): old GitHub addresses for graphs that moved to canon. **Proposed:** rewrite the addresses in the files and delete the forwarding.

Kept, because the app makes them while it runs and they are never saved: `route-pin`, `web-content`, `unavailable-resource`.

## Open questions

- **A. Declaration as root.** The Specification already says the Declaration is the graph's root Port, and every port named `root` hangs from it. A reader could meet it as "the graph's root" and a builder as "the Declaration". Or rename it `root` everywhere, now that the files can change. Which?
- **B. One phrase for faces.** This draft uses **faces** for readers (Detail, Summary, Icon, Glyph) and keeps **Surface** for the builder's ordered set. If "faces" is right, then stored `view` could become `face`, and `view-sequence` could become `next-face`. Or keep View as the builder's word. Which?
- **C. The strange words.** Membrane and Bridge. Keep both, since both are in layer 3 and introduced by what they do? This draft keeps them.

## Old graph material

Graphs still on `manifest` are the previous generation. Where they are:

- **Twilite Zone:** `Roadmaps/` (16), `Sections/` (4), `next/` (2), `research/`, `twilite/storage-closet/`, most of `tasks/` (about 100 across `archive`, `nodeset-planning`, `dictionary-demotion`, `ui-analysis` and others), `tutorial/archive/` (39), `library/classes/` (123 of 160), `library/documentation/` (65 of 82).
- **The app's bundled `public/`:** a copy of the same.
- **Personal library:** one graph in `templates/idea-template`.

Delete, or convert? `library/classes` and `library/documentation` are the ones to look at first, since they sit inside canon.
