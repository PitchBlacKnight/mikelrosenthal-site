---
name: research-synthesis
description: Turn interview transcripts, support tickets, session recordings or analytics into at most ten insights, each with a participant count, a verbatim quote and a design implication. Use after any user research, or when a pile of qualitative material needs to become decisions.
---

# Research synthesis

Ten insights, maximum. Every one has a "so what" or it does not ship. An insight
without a design implication is a fact, and facts do not change products.

## Procedure

1. **Read `project-brief.md`.** Synthesis is scoped to the decisions it has to
   inform. Findings that inform nothing get parked, explicitly.
2. **Tag without theorising.** First pass: tag observations only — what someone did
   or said. No interpretation yet.
3. **Cluster.** Group tags that share a cause, not a topic. "Slow" and "confusing"
   are topics; "the system gives no feedback between submit and confirmation" is a cause.
4. **Count.** Every cluster carries `n of N participants`. A cluster of one is an
   anecdote — keep it only if the cost of it being real is high, and label it as n=1.
5. **Write the implication.** Each insight ends in a sentence starting "So we
   should…". If you cannot write that sentence, the insight is not finished.
6. **Triangulate.** Where analytics exist, confirm or contradict each insight with
   the data. Contradictions are the most valuable output you have.
7. **Cut to ten.** Rank by (frequency × cost of ignoring). Park the rest in writing.
8. **Write up** using `templates/insight.md`.

## Rules — see `reference/evidence-rules.md`

- Never aggregate a count you did not observe.
- One verbatim quote per insight, attributed to a participant ID, never a name.
- Separate what they *did* from what they *said they'd do*. The second is a much
  weaker signal and must be labelled.
- If the research contradicts a stakeholder assumption from the brief, say so
  explicitly and reference the assumption number.

## Bundled files

- `reference/evidence-rules.md`
- `templates/insight.md`
