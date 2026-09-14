---
name: smoke-test-template
description: Create or maintain focused Twilite smoke-test graphs with a quiet test bench, explicit setup and expected-result contracts, and current declaration-owned semantic views.
---

# Smoke Test Template

Use `root.node` as the executable template. Preserve its Declaration, Detail, Summary, Icon, Glyph, Landing Surface, stage layout, and GitHub settings structure when deriving a smoke test.

## Derive A Smoke Test

1. Copy `root.node` into a dedicated task or QA folder and retarget every graph identity plus `settings.github`.
2. Replace the Test Subject placeholder with the smallest real fixture that exercises one behavior.
3. State initial conditions in Setup, the visible pass condition in Expected Result, and actual observations in Observations.
4. Add only the nodes and edges required to demonstrate the behavior. Keep class bridges, declarations, and other authoring machinery outside the central stage unless they are the subject of the test.
5. Preserve the quiet Detail View. It is the graph-owned test environment and should remain passive beneath the fixture.

## Visual Contract

- The central stage is reserved for the thing being tested.
- Setup sits to the left, Expected Result to the right, and Observations below.
- Use authored Views for anything whose semantic zoom behavior is part of the test.
- Avoid opaque decorative backgrounds and oversized placeholder content.
- A screenshot at the intended zoom must show the test subject and enough context to judge the result.

## Validation

- Parse the graph as JSON and run graph-invariant validation.
- Require Declaration relationships for Detail, Summary, Icon, Glyph, and Landing Surface.
- Verify the Landing Surface navigates to the Test Subject.
- Verify every named edge handle exists.
- Record both structural validation and the interactive visual result; one does not substitute for the other.
