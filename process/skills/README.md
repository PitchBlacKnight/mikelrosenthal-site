# Design practice skills

Nine skills that carry a product engagement from a raw brief to a developer handoff.
They encode one designer's method — Mikel Rosenthal, 23 years, five design systems
built from scratch — so the output is the same shape whoever runs it.

## Install

Copy the `skills/` directory into your Claude project. Each subdirectory is one
skill. Claude reads only the `description` line of each `SKILL.md` until a task
matches, so the whole library costs almost nothing at rest.

Paste `PROJECT-INSTRUCTIONS.md` into the project's instructions so the house rules
apply to everything, not only to skill invocations.

## Start here

| File | What it's for |
|---|---|
| `DEMO.md` | A ten-minute live demo runbook, with the exact prompts to type |
| `PROJECT-INSTRUCTIONS.md` | Project-level instructions carrying the five house rules |
| `examples/` | Seven finished artifacts, so the templates aren't the only thing anyone sees |

## The order they run in

| Phase | Skill | Produces |
|---|---|---|
| Intake | `brief-intake` | The structured project file |
| Evaluate (track A) | `ds-inventory` | Component inventory, token diff, drift report |
| Evaluate (track B) | `heuristic-audit` | Severity-rated findings against a live product |
| Evaluate | `research-synthesis` | Ten insights, each with a design implication |
| Map | `flow-map` | Flows plus the full state matrix |
| Design | `copy-standards` | Errors, empty states, labels in the product's voice |
| Design | `a11y-spec` | Focus order, roles, contrast pairs per screen |
| Design | `critique` | An argument against the work before the team sees it |
| Hand off | `handoff-spec` | The developer package |

## Two entry points

Evaluating a **design system** is a counting exercise before it is a taste one —
start with `ds-inventory`, on what actually ships.

A **product overview** is a people exercise — start with `research-synthesis` and
`heuristic-audit`, because a perfectly consistent product can still be the wrong one.

`brief-intake` runs before either.

## House rules every skill inherits

1. Never invent a number. Every quantity traces to a named source, or it is cut.
2. Say what you could not determine. An honest gap beats a confident guess.
3. Attach a cost to every finding. Findings without a cost are trivia.
4. Recommend, don't enumerate. One recommendation, its trade, and the rejected alternative.
5. Output is a file, not a chat reply. Written artifacts are what survive the call.
