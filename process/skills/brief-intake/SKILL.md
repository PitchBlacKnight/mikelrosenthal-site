---
name: brief-intake
description: Turn raw client material — a brief, a transcript, a slide deck, an email thread — into one structured project file with problem, metric, users, constraints, ranked assumptions and open questions. Use at the very start of any engagement, before any design work, and re-run when scope changes materially.
---

# Brief intake

A model amplifies whatever context it is given. A vague brief buys confident,
plausible, wrong output at speed. This skill exists to make the context good
before anything is generated against it.

## When to use

- New engagement, new feature, new client
- Scope has drifted and nobody can say what "done" means any more
- You are about to run any other skill in this library and there is no project file yet

## Procedure

1. **Read everything once, produce nothing.** Note every question the material
   raises. Do not start structuring on the first pass.
2. **Separate solution from problem.** Most briefs arrive describing a solution.
   Write the problem underneath it in the client's own words — quote them.
3. **Find the metric.** What number is this supposed to move? If the material does
   not say, that is an open question, not something to invent. Mark it `UNRESOLVED`.
4. **List the users and the job.** Who, and what they are hiring the product to
   finish. Not personas — jobs.
5. **Pull the constraints.** Platform, data, integrations, compliance, timeline,
   team. Flag which came from the brief and which need an engineer to confirm.
6. **Rank the assumptions.** Every ambiguity becomes a row with an owner and a cost
   of being wrong. Sort by cost descending.
7. **Write the three questions** whose answers change the shape of the work. Three,
   not thirty. Anything else goes in the assumption register.
8. **Fill `templates/project-brief.md`** and save it. This file is now the context
   every later skill reads from.

## Output

`project-brief.md`, using `templates/project-brief.md`.

## Rules

- Quote the client verbatim for the problem statement. Paraphrase is drift.
- Never fill a metric you were not given. `UNRESOLVED` is the correct answer.
- Every assumption needs a named owner. "The team" is not an owner.
- If the material contradicts itself, record both positions and what each costs.
  Do not quietly pick one.

## Bundled files

- `templates/project-brief.md` — the output format
- `reference/question-bank.md` — questions by engagement type, for step 7
