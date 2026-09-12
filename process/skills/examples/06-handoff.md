# Meridian payoff quote — handoff

> **Composite example.**

> Design source: {Figma link} · Prototype: {link} · Built against: release 2026.3
> Walkthrough held: 2026-04-18 — 3 engineers, QA, PM · Office hours: Thursdays 10–11 CT

## What this is

The borrower-facing flow for requesting and viewing a loan payoff quote. It exists to
make the top-ranked call reason completable in the portal; the metric is self-service
completion on that task, baselined in `01-project-brief.md`.

## Tokens

Export: `tokens/meridian-2026.3.json`. Naming follows `category.role.variant.state`
and matches the front-end variable names exactly.

| New token | Value | Tier | Why it was needed |
|---|---|---|---|
| `color.status.pending.surface` | `neutral.100` | semantic | No existing status covered "requested, not yet available" |
| `color.status.pending.text` | `neutral.700` | semantic | Contrast 7.4:1 — measured |
| `color.status.pending.border` | `neutral.300` | semantic | 3.1:1 against surface — measured |

No new primitives. The pending status reuses the neutral ramp deliberately: it is a
waiting state, not a warning, and the existing warning colour tested as alarming.

## Components

| Component | New / changed / reused | States delivered | Outstanding |
|---|---|---|---|
| Status chip | changed — pending variant added | all 8 | — |
| Quote card | new | default, loading, partial, stale, expired | — |
| Countdown | new | default, <1h, expired | Screen-reader announcement interval — see below |
| Date picker | reused — **blocked** | — | Keyboard path missing; see drift report finding 3. **Do not ship this flow until the primitive is fixed.** |

## Screens

### 3 — Pending

Focus order: 1 back · 2 reference number (copyable) · 3 cancel request · 4 support link.

Accessible names: "Copy reference number Q-88421" on the copy control — not "Copy".
Cancel is "Cancel payoff quote request", not "Cancel".

**Behaviour rules**

| Condition | Consequence |
|---|---|
| Request older than 24h | Stale treatment, refresh action appears |
| Content column < 480px | Reference and status stack; reference stays first |
| 5 concurrent requests on the account | Request button disabled, reason stated inline |
| Principal returned without fees | Partial state — show principal, mark fees pending, do not show a total |
| Loan mid-transfer (200, empty body) | "No quote available" copy, not a server error |

### 4 — Quote

Focus order: 1 back · 2 amount · 3 expiry · 4 download · 5 print · 6 support.

The amount is the page's `h1` for screen-reader users, visually presented as the
largest element. Expiry is announced on load, then at 1 hour remaining — **not
continuously.** The continuous countdown is visual only, marked `aria-hidden`.

## Data and failure

| Screen | Data needed | Source | Late | Partial | Absent |
|---|---|---|---|---|---|
| Pending | request status, ref | servicing API | keep pending, no spinner past 3s | principal only → partial state | server error state |
| Quote | principal, fees, escrow, expiry | nightly batch | stale state | hide escrow line, show note | "no quote available" |

## Accessibility

Full record: `a11y/meridian-payoff-wcag22.md`. 2.2 AA, all criteria recorded.
Two marked engineering-owned (4.1.2 name/role/value on the countdown; 4.1.3 status
message announcement). One outstanding: the countdown announcement interval.

## Content

All strings final and client-approved, including the compliance disclosure on screen 2
(approved by Meridian legal 2026-04-11 — do not edit without re-review).

Longest-case examples marked in the file. Legal entity names run to 60 characters.

## Open questions for engineering

| # | Question | Owner | Needed by |
|---|---|---|---|
| 1 | Can the batch return a partial result, or is it all-or-nothing? Design assumes partial is possible. | Lead eng | Sprint 12 planning |
| 2 | Is the quote cached client-side? Decides the offline state and is a compliance question. | Eng + Compliance | Sprint 12 |
| 3 | Does the reference number survive a session expiry? | Lead eng | Sprint 12 |

## Design QA

`qa/meridian-payoff.md`, filled before the build started. Sign-off on staging,
before release — not after.
