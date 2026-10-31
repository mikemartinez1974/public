# What a canon template is

Status: Approved 2026-10-21. Each rule is short, says why, and says how it is checked: eleven can be checked mechanically, and two are judgement.

## What it is

A **canon template** is a starter graph in the Twilite Zone library (`library/templates/<name>/`) that other graphs are made from, and that follows these rules.

## 1. One surface, three looks

A canon template presents through one Surface: a Detail, then a Summary, then a Glyph. It has no Icon view: the Icon is left off, and one is added only for a compelling reason, which is written next to it.

*Why:* The glyph is the floor: it stands for the graph at small sizes and hands over to the lowest view once that view can be read.

*Checked by:* Test (mechanical).

## 2. One shape

The Detail defines the graph's shape, and the views behind it take it. Each view's own size says when it appears: the Summary is smaller than the Detail and appears sooner.

*Why:* Views that share a shape look the same in a workspace tile, a portal and the graph itself, whatever the zoom.

*Checked by:* faceShapeIssues (mechanical).

## 3. Derived, not typed

The Detail, the Summary and the Glyph are written by the template's own Method, which a graph.changed event runs through an invokes edge. There is no stored summary node and no copy that is kept in step by hand. The saved file holds the current views.

*Why:* A summary that is typed goes stale, and a stale one is worse than none.

*Checked by:* Test: the stored views equal what the Method derives (mechanical).

## 4. Each look is the graph at that size

The Glyph says what kind of thing the graph is, and carries its state if it has one. The Summary is the graph in miniature. The Detail is the graph. If graphs of this template have a state someone has to act on (for example the status of a task, or an open question), it is shown on every look, so no one has to open the graph to find out whether they need to.

*Why:* A look should answer the question its size can answer. The state rule applies only to templates that have a state.

*Checked by:* Judgement; each look and each state is a case in the tests of the template itself.

## 5. A view fits its page, or is one page that scrolls

A view is measured from its own width (cqw inside an outer container, never on the container itself) and is one of two things. A **card** fits its fixed page and says how many more when there is more than fits. A **page** is one scrolling area, the whole view, which the workspace can scroll at every size by the wheel, the thumb and the track. A scrolling area nested inside a fixed card is not allowed for now, because the workspace cannot carry it yet; that can change if a template needs one.

*Why:* The app already scrolls a page view at every size and moves the nodes with it. It cannot yet scroll a region inside a card, so a card that needed one would show a scrollbar nobody could use.

*Checked by:* Test: a card has no scrolling area, a long list still fits, and a page has exactly one (mechanical).

## 6. A window of its own shape

The graph's window (the root's membrane bounds) is authored in the Detail's shape and holds everything the graph has.

*Why:* A new graph is the size of a graph, and its Detail fills it without stretching.

*Checked by:* Test (mechanical).

## 7. Pieces are classes, and relationships have names

Each kind of thing in the template is a node class, imported through a Bridge, and each node carries the class's ports. Relationships are edge classes between named ports (precedes leaves next and arrives at previous). Nothing is drawn by side, and nothing depends on one particular edge being present: deleting an edge changes how the graph is drawn, not what it says.

*Why:* Names say what a connection means; sides do not.

*Checked by:* Test (mechanical).

## 8. One export

The template hands on its classes and its Method through a single export with an allowlist. A graph made from it imports once.

*Why:* One Bridge is a thing to read; ten are a thing to maintain.

*Checked by:* Test (mechanical).

## 9. Canon addresses, and an identity of its own

Everything the template points at is a canon address (tlz://twilite.zone/...) and nothing personal. A copy gets its own graph id and node ids.

*Why:* Canon has to stand on its own, and copies must not be drawn as one node.

*Checked by:* Test (mechanical).

## 10. Events run through edges

A Method runs only through an invokes edge from an event port to a Method in the same graph. There are no Event Handler nodes.

*Why:* One model for events; this is already the rule everywhere.

*Checked by:* The validator (mechanical).

## 11. Generic, complete starter content

The template shows each state it can be in, with placeholder content and nobody's real work. Its landing page says what it is, what it derives and what it exports.

*Why:* A starter is copied; real work in it is a mistake waiting to be copied.

*Checked by:* Judgement; read at approval.

## 12. It is tested

A canon template has tests for the rules above, so it cannot drift: a valid graph, the shape, the stored views, each state, and a long list.

*Why:* The standard is only a standard if breaking it fails.

*Checked by:* The audit in tests/helpers/templateStandard.js runs the mechanical rules over every template.

## 13. An environment

A canon template has an environment: a face of its own on an `environment` edge from the root, the backdrop its interior sits on. It is never the Detail, the Summary or the Glyph.

*Why:* A graph's interior is the room its work happens in. A template that sets none leaves every graph made from it on whatever backdrop the app falls back to, so it cannot say what kind of room this is.

*Checked by:* Test (mechanical).

## What it is not

It is not a demo with someone's real work in it, not a copy of a primitives page, and not two templates folded into one: the plan template and the Task Template stay separate.

