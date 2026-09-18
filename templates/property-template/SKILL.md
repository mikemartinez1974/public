---
name: property-template
description: Create Property nodes with explicit value resolution and an on-node editor.
---

# Property Template

Use `root.node` with `property.node-class.node`. Import the class through a bridge before creating Property instances. The example in the root graph is deliberately unset with a default value.

## Instance contract

- `data.name` identifies the property and appears in icon view.
- `data.valueType` is `text`, `number`, `boolean`, or `json` in this first release.
- Omit `data.value` for unset; use `null` for explicit null. Do not serialize unset as an empty string.
- `data.defaultValue` is optional. `data.inherited` is an ordered list of supplied contributions with optional `nodeId` and `ref` provenance.
- `data.valueKind` is `stored` or `computed`. The first computed form is `data.computation: { "kind": "constant", "value": ... }`; it is a definition, not a stored result.
- `data.access.write` governs ordinary local value writes. Definition editing remains a separate graph-authoring action.

The first-release resolver uses computed, explicit, inherited, default, then unset. Its result reports state, value, and source. This order belongs to the resolver, not to each view. A future policy may replace it.

## Editing

Enter graph edit mode and explicitly open the node editor. The inline editor has Value and Definition tabs. Value editing distinguishes Unset, Explicit null, and Value. A computed result is read-only; edit its definition instead. Apply updates the local graph through GraphCRUD, then re-resolves. Save the graph to persist the authored change to its repository.

The first release does not define event emission, a general computation language, or an inheritance language. Use the adjacent smoke graph at `../../tasks/property-node-inline-editor/property-smoke/root.node` for the five resolution cases.
