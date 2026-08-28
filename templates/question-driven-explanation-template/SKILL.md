---
name: question-driven-explanation-template
description: Create or maintain Twilite explanations organized as a topic, explicit questions, direct answers, sources, examples, caveats, and synthesis.
---

# Question-Driven Explanation Template

Treat `root.node`, its seven class graphs, and this guidance as one versioned package.

## Derivation

1. Preserve the declaration, Detail, Summary, Icon, Glyph, Landing Surface, and all seven class-authority bridges.
2. Retarget graph identity and every graph-local node identity.
3. Replace the example Topic, Question, Answer, Source, Example, Caveat, and Summary with the subject being explained.
4. Keep only relationships supported by the authored material. A Source supports an Answer; it does not replace one.
5. Add Questions freely. Add an Answer only when the graph can state one directly.
6. Use Caveats for bounded qualifications, not as a dumping ground for unresolved questions.
7. Let Summary synthesize the explanation after the important Questions have Answers.

## Domain roles

- `qa-topic`: the bounded subject.
- `qa-question`: an explicit lens or unresolved request.
- `qa-answer`: a direct response to a Question.
- `qa-source`: evidence or provenance supporting an Answer.
- `qa-example`: a concrete illustration.
- `qa-caveat`: a qualification or important exception.
- `qa-summary`: a synthesis of the current explanation.

Do not create a second class for the same role merely to obtain a different presentation. Semantic views belong to the class and are selected by zoom or consumption context.

## Validation

- Require the modern declaration relationships and landing-surface geometry.
- Require one bridge authority for every custom node type used by the graph.
- Require handle-only edge endpoints; each handle routes to its semantic port through `portId`.
- Confirm every class reference resolves and every example relationship is truthful.
- Derive at least one explanation containing multiple Questions before changing the role vocabulary.
