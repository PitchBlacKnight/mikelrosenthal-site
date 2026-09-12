---
name: heuristic-audit
description: Evaluate a live product or a set of screens against usability heuristics and WCAG 2.2, producing severity-rated findings with a cost and a sequenced fix list. Use for a UX audit, a product overview of something that already exists, or a competitive teardown.
---

# Heuristic audit

An audit that lists sins is worthless. An audit that ranks findings by frequency ×
severity, attaches a cost, and sequences the fixes is a plan.

## When to use

- A product exists and the question is whether it works
- Track B of an evaluation — the product-overview entry point
- Teardown of a competitor, for the same rubric applied consistently

## Procedure

1. **Read `project-brief.md` first.** Audit against the job the product is supposed
   to do, not against generic best practice.
2. **Pick the flows.** Two or three critical paths, end to end. An audit of "the
   product" is an audit of nothing.
3. **Walk each flow in every state you can reach** — first run, empty, populated,
   error, slow network, keyboard only.
4. **Score against `reference/rubric.md`.** Every finding gets: heuristic violated,
   evidence (screen + what happened), severity, frequency, cost.
5. **Run the accessibility pass separately** using the WCAG 2.2 checklist in
   `a11y-spec/reference/wcag22-checklist.md`. Do not fold it into the general pass —
   it has different evidence rules.
6. **Sequence the fixes.** Group by where the fix lands (a primitive, a pattern, a
   screen). Fixing one primitive often closes ten findings — say so.
7. **Write the report** using `templates/audit-report.md`.

## Severity scale

| Level | Meaning |
|---|---|
| 1 — Cosmetic | Noticed, not blocking. Fix when nearby. |
| 2 — Minor | Slows people down or looks unconsidered. |
| 3 — Major | People fail the task or work around it. Fix this release. |
| 4 — Critical | Data loss, a dead end, a compliance exposure, or an accessibility barrier. Fix now. |

Frequency: how many users hit it, how often. Severity 2 at high frequency outranks
severity 3 at the margins — say which you are recommending and why.

## Rules

- Every finding carries evidence. "Feels cluttered" is not evidence; "seven primary
  actions compete at equal weight in the header" is.
- Never report a count you did not count.
- Say what you could not test — no account, no data, no device.
- Findings without a cost get cut, not softened.

## Bundled files

- `reference/rubric.md` — the heuristics, with what evidence each requires
- `templates/audit-report.md` — the output format
