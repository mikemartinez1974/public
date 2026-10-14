# Behaviour in Twilite, as it works today

How something happening in a graph leads to something being done, traced through the app's code and the graphs as of 2026-10-14. This describes what is, so we can decide what should be. Old words (Declaration, Bridge node, field) are used where they are what the code says today.

---

## The short version

```
something changes ──► an event ──► something listening ──► a Method runs ──► it changes the graph
   (a Property,          (property.changed,    (an Event Handler node,      (its own code, or its
    a node, the graph)    node.changed, ...)    or a trigger edge)           template's, through
                                                                              the Bridge)
```

Beside that chain, **Scripts** run on their own, when the graph loads or changes, with nothing listening and nothing declared.

---

## The pieces

| Piece | What it is today | In current graphs |
|---|---|---|
| **Event** | A named thing that happened, raised by a node: `property.changed`, `node.changed`, `graph.structure.changed`, or a custom one like `collection:next`. | not stored as nodes (the old `event-declaration` node is still read, never written) |
| **Event Handler** | A node that listens for one event, either from **one node** or from **every node of a class**, and runs the Methods it is joined to, in edge order. | 183 nodes; every primitive page has five |
| **trigger edge** | An edge straight from a node's `event:<key>` port to a Method's `trigger` port. No handler in between. The editor offers it on the Method ("Triggers"). | 3 edges, all in templates and smoke tests |
| **Method** | Code that runs when invoked, with its **effects declared**: which nodes it may change and how. The app refuses any change outside the declaration. | 49 nodes |
| **Script** | Code that runs by itself: on load (`autoRunOnLoad`), on any graph change (`autoRunOnGraphChange`), or by hand from the Script panel. No declared effects: it may change anything (`allowMutations`). | 78 nodes, plus a top-level `scripts` list in 87 graphs |
| **Subscription** | Listening across graphs. Stored on an **import Bridge**; only works if the matching **export Bridge** exposes the event. (Old `subscription` nodes are still delivered.) | a handful, in the Bridge template and smoke tests |

---

## A worked example: a primitive page rebuilding itself

Every primitive page (Port, Portal, Bridge ...) is built from the Page Template. It carries:

- **Five Event Handlers.** Four listen **by class**: "when any `page-masthead` / `page-route` / `page-section` / `page-settings` node raises `node.changed`". The fifth listens to the page's own Declaration for `graph.structure.changed`.
- **One Method**, *Assemble page*. It has no code of its own: it runs the Page Template's code, reached through the Bridge that imports the template. Its declared effects: it may update the four face nodes (icon, summary, detail, landing).
- Five `invokes` edges, handler → Method, and three `derived-view` edges, Method → the views it writes.

So: you edit a section → that section raises `node.changed` → the handler listening to every `page-section` hears it → it runs *Assemble page* → the Method fetches the template's code, runs it, and rewrites the faces, which the app allows because they are in its declared effects.

---

## Where events come from

- **`property.changed`**: raised when a Property's value changes. Only the `property` node type declares it as its own; the app announces it by comparing nodes before and after an edit.
- **`node.changed`**: raised when any node is edited.
- **`graph.structure.changed`**: raised by the Declaration when nodes or edges are added or removed.
- **Custom events**: declared on a node, then raised by code (`collection:next`, `widget.ready` ...). A node's events can be declared in **five places**: its own `data.events`, its `data.contract.events`, and three places inside its class binding. Plus the built-in ones for its type.

Safety: an event raised by a Method carries its cause, and a chain stops after 32 steps. A Property firing too fast is dropped with a warning ("a Handler may be writing the Property it listens to").

## Where a Method's code comes from

In this order: its own `source`; a `scriptRef` address; or, if it has neither, its **template's** Method, reached through the Bridge it names. The last is what lets every primitive page share one *Assemble page*.

## How a Method gets started

1. An **Event Handler** it is joined to hears its event (one node, or every node of a class).
2. A **trigger edge** from a node's event port, one node only.
3. A **Subscription** on an import Bridge, for an event exposed by another graph's export Bridge.

There is no way for one Method to start another directly. It can only raise a custom event that something else listens for.

---

## Method and Script

They run on the same runtime and are written the same way. The differences:

| | Method | Script |
|---|---|---|
| Started by | an event, through a handler, trigger edge or subscription | itself: on load, on any change, or by hand |
| Effects | declared, and enforced by the app | none declared; may change anything |
| Shared from a template | yes, through the Bridge | no |
| Used for today | rebuilding pages from their Properties | summary updaters, workboard reconcilers, collection window controllers; mostly in old task graphs |

Everything a Script does can be said as a Method: "on load" and "on change" are events like any other. What a Script adds is only the freedom to change anything without saying so, which is what the Method was made to stop.

---

## Where the design is weak

1. **Two ways to say "when this happens, run that".** The Event Handler node and the trigger edge do the same job. The code already calls handler nodes *legacy*, but canon uses only handlers, because:
2. **The trigger edge can only listen to one node.** "Any section changed" needs a handler node, since there is no single node to draw the edge from. That one gap is what keeps handler nodes alive.
3. **Events are declared in five places**, plus built-in ones, plus the old `event-declaration` node.
4. **What a Method changes is said twice**: in its declared effects (the face node ids) and again as `derived-view` edges to those faces. They can disagree.
5. **Method to Method only through a made-up event.** If a Method should run after another, the first has to raise an event for the second to hear.
6. **Listening across graphs is the heaviest part**: an event must be exposed by an export Bridge, the subscription lives on the import Bridge, and the handler must be joined to that. Three things to line up for one connection; little uses it.
7. **Scripts are a way around the effect rule.** Anything that can't be declared can still be done by a Script.
8. **`property.changed` is only built in for the `property` type**, so once `field` becomes `property` (Collision 3) every Property raises it. Today a `field` node relies on `node.changed`.

---

## A shape to start from (not a proposal yet)

Put next to Bridge, where we just found the same thing: a node whose only job is to stand between two others is really an edge.

- **The Event Handler becomes an edge class**, say `on`: from what raises the event to the Method, naming the event. Drawn from a node, it listens to that node. Drawn from a **class** (its import), it listens to every node of the class, which closes gap 2. One way to bind, not two.
- **Methods are the only code.** Scripts retire. "On load" and "on change" are events from the root (`graph.loaded`, `graph.changed`), heard by an `on` edge like any other.
- **A Method can start a Method** with the same edge: every Method raises `method.done` (and `method.failed`), and an `on` edge from it to the next Method says "then run this". A sequence is a chain of edges you can see.
- **Effects are said once**: as edges from the Method to what it may change. The declaration is read from the edges, and `derived-view` goes.
- **Events are declared in one place**: the node's class. Built-in events are documented on each primitive's page.
- **Across graphs** stays as it is until something real needs it.

Questions this leaves for you:
- Does a Property invoke a Method directly (an `on` edge from the Property), or always through an event name on the edge? (The shape above says: always an event, and `property.changed` is just the usual one.)
- Is "every node of a class" something a page needs, or could a page listen to its sections one by one?
- Do you want a Method to be able to run by hand (a button), the one thing Scripts do that events don't cover?
