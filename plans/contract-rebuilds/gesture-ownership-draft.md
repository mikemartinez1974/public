# Gesture ownership

Every press, drag and turn of the wheel on the canvas has one owner, chosen once, by what was touched. How a thing looks changes with zoom; who owns a gesture does not.

## One law across every renderer

The host classifies the target of a gesture before any renderer acts. Mouse, pointer, touch and wheel input use the same words: the target is one of resize handle, connection handle, control, portal or link, editable content, edge, scroll region, embedded frame, node body, workspace tile or canvas, and each has one owner. Native nodes, authored HTML, Portals and Methods adapt to this; none of them invents its own rule for who gets a press (`components/NodeGraph/interactionArbiter.js`).

## Who owns a press

The first of these that applies owns it:

1. A resize handle resizes.
2. A connection handle (a Port's handle) starts a connection.
3. A control (a button, an input, a select, anything a surface declares as a control) is activated.
4. A Portal or a link navigates.
5. Editable content is edited.
6. A scroll region scrolls.
7. An edge is selected.
8. An embedded frame keeps the press, unless its surface says it is canvas-first, when the press goes to the canvas.
9. A node's body drags the node. If the node is pinned, the press goes to the canvas and pans the view.
10. A workspace tile is selected.
11. Empty canvas pans the view.

Selecting is a deliberate act, never a side effect of dragging.

## The wheel

A scroll region owns the wheel while it can scroll in the direction asked. Once it cannot, the wheel goes back to the canvas and zooms. An embedded frame owns the wheel unless its surface is canvas-first.

## Pinned nodes

Pinning changes only who owns a press on a node's body. A press on the body of a pinned node pans the canvas, even where that body holds or scrolls content. Nothing about a pinned node is dead: its controls, links, fields, scrollbars and frames still answer, and it is moved by its title bar, where its buttons are still buttons.

## What a node's content answers

A node's content is its face. A click on it is a click on the node, and brings you a step closer to it (the navigation scheme's node ladder). The content answers on its own in two cases only: what was pressed is something a person operates (a link, a button, a field), or you are inside the node.

## Zoom chooses views, not rules

Glyph, icon, summary, detail and the other bands choose what is drawn. They do not change who owns a gesture. Each surface says whether it is content-first, where the controls, links, scrolling and editing it declares answer, or canvas-first, where every other press is the canvas's.

## A renderer must not patch the rule

The law has failed when a renderer repairs itself with a private `stopPropagation`, `pointer-events` or frame exception that changes how another surface behaves. A press that is classified wrongly is fixed in the shared classification (`classifyGestureTarget`), not hidden in the renderer that noticed it.

## Evidence

`tests/interactionArbiter.test.js` holds the precedence, the wheel rule, the pinned-body rule, the title bar and the workspace tile. `components/NodeGraph/interactionArbiter.js` is the one place the order is written.
