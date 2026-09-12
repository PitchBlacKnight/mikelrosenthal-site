---
name: ds-inventory
description: Inventory a design system from what actually ships, extract the tokens in real use, diff them against what the system declares, and report drift with a cost and a sequenced fix list. Use for a design-system audit, a pre-rebrand assessment, or before contributing to a system you did not build.
---

# Design system inventory

The library always claims more coverage than it has. Inventory from what ships —
the code and the screens — never from the library's own contents page.

## When to use

- Track A of an evaluation — the design-system entry point
- Before a rebrand, a re-theme, or a platform expansion
- Joining a mature system and needing to know what is real

## Procedure

1. **Inventory what ships.** Walk the production screens and the front-end source.
   Record every component instance: name, where used, whether it comes from the
   library or is a detached or bespoke copy.
2. **Extract the tokens in real use.** Every colour, type size, spacing value,
   radius and shadow that appears in shipped code. Not the declared set — the used set.
3. **Diff.** Declared versus used, in both directions:
   - Declared and unused → dead weight, or a documentation failure
   - Used and undeclared → drift, and the reason re-theming is impossible
   - Used under two names → a naming failure that will break Code Connect
4. **Build the coverage matrix.** Screens down, components across. Mark library /
   detached / bespoke. The detached percentage is the single most predictive number
   in the report.
5. **Score each component** on the five axes in `heuristic-audit/reference/rubric.md`
   — states, accessibility, documentation, adoption, code parity.
6. **Check parity properly.** A component matches its code when the *name*, the
   *structure* and the *behaviour* match — not when it looks the same. Verify through
   Dev Mode and Code Connect with a front-end engineer, not by eye.
7. **Attach a cost to every finding** and sequence the fixes. Report using
   `templates/drift-report.md`.

## Rules

- Count, don't estimate. If you cannot count it, say so and say why.
- Never report a component as adopted because it exists in the library.
- Drift is not a moral failing. Report the cost, not the sin — the team has to
  work with you afterward.
- A fix to a primitive that closes twelve findings is the headline. Lead with it.

## Bundled files

- `reference/token-schema.md` — the three-tier token architecture to diff against
- `templates/drift-report.md` — the output format
