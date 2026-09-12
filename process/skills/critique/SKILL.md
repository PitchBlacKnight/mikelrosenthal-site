---
name: critique
description: Argue against a design before the team or the client sees it — find the weakest decision, the unexamined assumption and the state that was skipped. Use before every internal review, and whenever work feels finished, which is when it is most dangerous.
---

# Critique

The cheapest quality gate available. Run it on your own work before anyone else has
to. The point is not reassurance — if the output is encouraging, it has failed.

## Procedure

Read `project-brief.md`, then attack the work on seven fronts. For each, produce
the strongest version of the objection, not a token one.

1. **The metric.** Does this move the number in the brief? Trace the path. If the
   trace requires three assumptions, name all three.
2. **The skipped state.** Walk `flow-map/reference/state-checklist.md`. Name every
   state that is missing and say what happens in production when it occurs.
3. **The unexamined assumption.** What is this design taking for granted about the
   data, the user's context, or the organisation? Which assumption, if wrong,
   costs the most?
4. **The alternative not considered.** Argue for the structurally different approach
   that was never on the table. Make the real case for it.
5. **The edges.** Longest string, keyboard only, screen reader, smallest width, no
   network, ten times the content, three years of accumulated cruft.
6. **The engineer's objection.** What will the person building this ask that the
   spec does not answer?
7. **The mean.** Where is this the average solution rather than the right one? What
   is generic here that should be specific to this product?

Then: **name the single weakest decision in the work** and say what you would do
instead.

## Rules

- Never open with what's working. That is a review; this is a critique.
- Every objection needs a proposal attached. "I don't think that works" is noise.
- Rank the objections. One critical objection buried in twelve cosmetic ones will
  be missed.
- If you cannot find a serious objection, you have not understood the work — go back
  to the brief and read the constraints again.

## Bundled files

- `reference/failure-modes.md`
