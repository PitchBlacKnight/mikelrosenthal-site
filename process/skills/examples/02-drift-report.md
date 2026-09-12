# Meridian design system — inventory and drift

> **Composite example.** All numbers invented for illustration.

> Inventoried from: `web-portal` @ `release/2026.2`, `agent-console` @ `main`,
> and 48 production screens captured 2026-03-18
> Not inventoried: the native iOS shell (no source access), three admin screens behind
> a role we were not granted
> Date: 2026-03-20

## Headline

Sixty-one per cent of production screens contain at least one detached component,
and the portal ships 31 grey values against a declared ramp of 6. Together these mean
the announced 2027 rebrand cannot be executed by changing tokens — it would be a
manual edit of roughly 400 instances.

**Fix the colour primitives first.** One change — collapsing greys onto the declared
ramp and re-pointing components at semantic tokens — closes eleven of the nineteen
findings below and is the precondition for every other fix.

## Coverage

| | Count |
|---|---|
| Components in the library | 84 |
| Components actually used in production | 52 |
| Library components used nowhere | 32 |
| Bespoke components not in the library | 27 |
| Screens audited | 48 |
| Screens with at least one detached instance | 29 (61%) |

Thirty-two unused library components is the more interesting number. Six of them
duplicate bespoke components teams built instead — which is a discoverability
failure, not a discipline failure.

## Token diff

| Token | Declared | Used | Finding | Cost |
|---|---|---|---|---|
| Greys | 6 steps | 31 distinct values | Used and undeclared | Re-theming impossible; 400+ manual edits |
| Brand blue | `color.brand.500` | 4 near-values (#1B5FD9, #1C5FD9, #1B60DA, #2060D9) | Copy-paste drift | Reads as sloppy at scale; no single source |
| Spacing | 8px scale | 17 values, 9 off-scale | Off-scale usage | Vertical rhythm reads accidental |
| `color.text.primary` | declared | components reference `color.neutral.900` directly | Tier bypass | Dark mode would require touching every component |
| Radius | 4 steps | 4 steps | Clean | — |
| `button.danger.*` | declared | unused | Dead weight | Documented but nobody found it; two teams built their own |
| Type scale | 9 steps | 14 sizes | 5 undeclared | Hierarchy is inconsistent between the two apps |

## Component scores

Five axes, 0–3. Anything scoring 0 on states or accessibility is a finding regardless
of total. Ten most-used components shown.

| Component | States | A11y | Docs | Adoption | Code parity | Total |
|---|---|---|---|---|---|---|
| Button | 3 | 2 | 2 | 3 | 2 | 12 |
| Text input | 2 | 2 | 2 | 3 | 2 | 11 |
| Select | 1 | 1 | 1 | 3 | 1 | 7 |
| Data table | 1 | 0 | 1 | 2 | 1 | 5 |
| Modal | 2 | 1 | 1 | 2 | 2 | 8 |
| Tabs | 1 | 0 | 0 | 2 | 1 | 4 |
| Card | 2 | 2 | 1 | 3 | 2 | 10 |
| Alert / banner | 2 | 1 | 1 | 2 | 1 | 7 |
| Date picker | 0 | 0 | 0 | 2 | 0 | 2 |
| Pagination | 1 | 1 | 0 | 1 | 1 | 4 |

Date picker scores 0 on states, accessibility and code parity while appearing on
every payment-related screen. It is the highest-risk component in the system.

## Findings

| # | Finding | Count | Cost | Fix | Closes |
|---|---|---|---|---|---|
| 1 | Greys off the declared ramp | 31 values | Re-theming impossible | Collapse to 6, re-point components | 1, 4, 7, 9, 11, 12, 14, 15, 16, 18, 19 |
| 2 | Detached instances in production | 29 screens | Library fixes stop propagating | Re-link the top 10 flows | 2, 6 |
| 3 | Date picker has no keyboard path | 1 component, 14 screens | WCAG 2.2 failure on a contractual requirement | Rebuild the primitive | 3, 10 |
| 4 | Components reference primitives directly | 38 instances | No theming layer; dark mode impossible | Insert semantic tier | — |
| 5 | Data table has no focus management | 1 component, 9 screens | Keyboard users cannot operate the core screen | Rebuild | — |
| 6 | Two button implementations in code | 2 | Every screen re-decides | Collapse, deprecate one | — |
| 7 | Off-scale spacing | 9 values | Rhythm reads accidental | Snap to the 8pt scale | — |

*(Findings 8–19 continue in the same format.)*

## Sequenced fixes

### Now — the primitives
1. Collapse the grey ramp and insert the semantic tier. Closes 11 findings.
2. Rebuild the date picker. Contractual WCAG exposure on 14 screens.
3. Fix data-table focus management.

### This quarter
4. Re-link detached instances across the top ten flows.
5. Collapse the two button implementations; deprecate with a dated notice.
6. Snap spacing to the 8-point scale.

### Parked — with the reason
- Deleting the 32 unused library components. Parked until the discoverability problem
  is understood; six of them duplicate bespoke work, which suggests the docs are the
  fault, not the components.
- Type-scale consolidation. Real, but low-cost until the rebrand lands.

## What I could not determine

- The native iOS shell — no source access. Its drift is unmeasured and likely worse,
  since it has no coded library at all.
- Three admin screens behind a role we were not granted.
- Whether Code Connect is configured; the engineer who set it up has left. Parity
  scores above are from a manual read of the source, not from tooling, and should be
  treated as approximate.
