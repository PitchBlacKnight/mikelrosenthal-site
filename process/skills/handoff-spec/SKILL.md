---
name: handoff-spec
description: Assemble the developer handoff package — token export, component state matrix, annotated flows written as rules, accessibility spec and a design QA checklist. Use at the end of a design phase, whenever engineering is about to build, and to update the spec when reality disagrees with it.
---

# Handoff spec

When the promise is "development executes it exactly as shown", the spec has to be
good enough to make that true. Handoff is a conversation, not a delivery.

## Procedure

1. **Token export.** Every colour, type step, spacing value, radius and elevation,
   named exactly as the front end names them. Exportable, not screenshotable. See
   `ds-inventory/reference/token-schema.md`.
2. **Component state matrix.** Every component × every state from
   `flow-map/reference/state-checklist.md`. Gaps are marked as gaps, not omitted.
3. **Annotated flows.** Behaviour written as rules, not redlines. Responsive
   behaviour stated as a condition and a consequence.
4. **Accessibility spec** from `a11y-spec`, per screen.
5. **Real content.** The strings that ship, at the lengths they ship at, from
   `copy-standards`.
6. **Design QA checklist** — `reference/qa-checklist.md` — what you will check on
   staging before release, written before the build starts so it is not a surprise.
7. **Present it live.** Walk engineering through the system in a working session.
   Do not post a link and leave.
8. **Stay in the sprint.** Weekly office hours, design review on staging, and you
   update the spec when reality disagrees with it — which it will.

## Rules

- A component that does not match its code in *name, structure and behaviour* is a
  suggestion, not a component.
- Never hand over a state matrix with silent gaps. An outstanding state marked
  outstanding is fine; an absent one is a defect.
- Write rules, not measurements, wherever a rule is possible.
- The flow diagrams must match the screens as built. Update them at handoff.

## Bundled files

- `templates/handoff.md`
- `reference/qa-checklist.md`
