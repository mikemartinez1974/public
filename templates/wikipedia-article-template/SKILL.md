---
name: wikipedia-article-template
description: Create or maintain a graph-backed Wikipedia Article node that resolves a URL, exposes semantic article views, and expands top-level sections into recursively addressable Section nodes.
---

# Wikipedia Article Template

Treat `root.node`, `rebuild-classes.mjs`, and this guidance as one versioned package.

## Derivation

1. Preserve the declaration, Detail, Summary, Icon, Glyph, Landing Surface, and Article and Section class bridges.
2. Retarget graph identity without embedding article content in the class definition.
3. Give each Article instance a canonical Wikipedia URL or article reference.
4. Resolve article content through the declared adapter; do not scrape or reproduce the website inside the node.
5. Expose immediate top-level sections as authored output handles after resolution.
6. Create Section nodes with the selected section locator and article provenance. A Section exposes only its immediate children.

## Presentation

- Detail presents readable article content and provenance.
- Summary presents title, lead, and compact identity.
- Icon presents Wikipedia identity at card scale.
- Glyph is the authored serif `W`; Section uses the section symbol.
- Plumbing nodes remain hidden in Browse mode.

## Validation

- Require the modern declaration relationships and landing-surface geometry.
- Require handle-only edge endpoints and stable handle-to-port bindings.
- Confirm Article and Section bridges resolve through the generic class adapter boundary.
- Test one real article, one created Section, recursive child-section exposure, markdown links, and semantic zoom.
- Keep external network success separate from structural graph validation.
