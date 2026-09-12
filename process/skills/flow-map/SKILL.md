---
name: flow-map
description: Produce annotated flow diagrams and a complete state matrix for every screen in a flow — including empty, loading, partial, error, permission-denied and offline. Use before high-fidelity design, and whenever an engineer needs something they can estimate from.
---

# Flow map

Get the structure right while it is still cheap to change. Every state you skip is
a decision an engineer makes alone, late, without context.

## Procedure

1. **Story map first.** What the user is trying to finish, in sequence, before any
   screens exist.
2. **Then the site map.** Where things live. Diff "as it is" against "as it should
   be" if the product already exists.
3. **Then flows.** Two or three critical paths. Each node is a screen or a decision;
   each edge is labelled with the action or condition that causes it.
4. **Then the state matrix.** For every screen, walk
   `reference/state-checklist.md` and mark each state: designed, not applicable
   (with a reason), or outstanding. "Not applicable" always needs a reason.
5. **Content model pass.** What data each screen needs, where it comes from, what
   happens when it is late, partial or absent. This is where `Back — to the data`
   mapping lands.
6. **Feasibility check.** Walk the flow with an engineer before it goes to hi-fi.
   Structural objections are free here and expensive later.

## Output

- Flow diagrams, annotated with conditions
- A state matrix: screens down, states across
- A list of open questions for engineering

## Rules

- Never mark a state "not applicable" without a written reason.
- Model partial failure explicitly. Most services cannot validate a batch
  atomically, and a flow that assumes they can will be rebuilt.
- Annotate behaviour as a *rule*, not a redline: "the rail collapses when the
  content column drops under 480px" survives content the mockup never had.
- The flow diagram and the shipped screens must not diverge. Update it at handoff.

## Bundled files

- `reference/state-checklist.md`
