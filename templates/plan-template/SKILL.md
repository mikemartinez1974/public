---
name: plan-template
description: Create, derive, or maintain Twilite plan graphs that coordinate goals, phases, actions, milestones, decisions, constraints, risks, and contingencies.
---

# Plan Template

Use this template when the central question is **how do we get from here to there?**

## Core grammar

Keep these roles distinct:

- **Plan** — the coordinated path.
- **Goal** — the desired end state.
- **Phase** — a meaningful stage of execution.
- **Action** — something that should happen within the plan.
- **Milestone** — a checkpoint or achieved state.
- **Decision** — a branch whose outcome changes the path.
- **Constraint** — a condition limiting available paths.
- **Risk** — something that may derail or degrade the plan.
- **Contingency** — a prepared response to a risk or adverse decision.

## Relationship vocabulary

Prefer semantic relationships such as:

- `plan.achieves`
- `plan.contains`
- `plan.precedes`
- `plan.requires`
- `plan.produces`
- `plan.gates`
- `plan.branches-to`
- `plan.constrained-by`
- `plan.threatened-by`
- `plan.mitigated-by`

## Boundary with Task

Plans coordinate work; tasks decompose work. An Action may point to or instantiate a dedicated Task graph when execution needs its own breakdown.

## Authoring guidance

Use one Plan and one primary Goal as anchors. Duplicate Phase, Action, Milestone, Decision, Constraint, Risk, and Contingency as needed. Keep the main path legible. Use branches only when outcomes truly alter what happens next.