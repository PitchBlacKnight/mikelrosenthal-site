# Meridian servicing portal — UX audit

> **Composite example.** All numbers invented for illustration.

> Scope: three critical paths — make a payment, request a payment-date change,
> request a payoff quote. Walked 2026-03-12 on staging with a seeded test account.
> Not tested: hardship request (behind a flag), agent console (no access), native iOS.
> Method: heuristic evaluation against `heuristic-audit/reference/rubric.md`, plus a
> separate WCAG 2.2 pass. 34 findings.

## Headline

The portal can start all three top tasks and finish only one. Payoff quote and
payment-date change both dead-end in a state that tells the borrower to call — which
is the exact behaviour the engagement is meant to remove. The single most expensive
problem is not visual: it is that a task begun in the portal cannot be completed
there, and the interface does not warn anyone before they begin.

Sequence the "quote requested" state first. It converts a dead end into a tracked
task, and it is a state design problem rather than a back-end change.

## Findings

Severity 3 and 4 only; the full 34 are in the appendix.

| # | Finding | Heuristic | Sev | Freq | Cost | Fix lands on |
|---|---|---|---|---|---|---|
| 1 | Payoff quote ends on "please call us" with no reference number | 9, 12 | 4 | High | The top-ranked task generates the call it was meant to prevent | Flow — add a requested state |
| 2 | Payment-date change silently queues; no confirmation, no pending state | 1, 12 | 4 | High | Borrowers submit repeatedly, then call to check | Flow + component |
| 3 | Session expiry discards a part-completed payment with no warning | 3, 9 | 4 | Med | Data loss on a financial task; direct call driver | Pattern — global |
| 4 | Date picker unreachable by keyboard | 2.1.1 | 4 | Med | WCAG failure on a contractual requirement; blocks the core task | Primitive |
| 5 | Amount field accepts letters, fails after submit | 5, 9 | 3 | High | Avoidable failure at the last step | Primitive |
| 6 | Errors appear only at the top of a long form | 3.3.1 | 3 | High | Users cannot find what to fix | Pattern |
| 7 | "Submit" used for four different outcomes | 4 | 3 | High | Nobody knows what will happen | Copy standard |
| 8 | Statement table has no fixed reference column | 11 | 3 | Med | Horizontal scroll loses the date | Component |
| 9 | Delinquency status carried by red text alone | 1.4.1 | 3 | Med | Invisible to colour-blind users; the most consequential status in the product | Pattern |
| 10 | Two primary buttons on the dashboard | 8 | 3 | High | Competing emphasis on the highest-traffic screen | Screen |

## Sequenced fixes

### Now — fix the primitive or the pattern
- **Date picker rebuild** — closes findings 4, 17, 23, 28.
- **Inline field-level error pattern** — closes 6, 11, 19, 25, 31.
- **Add a "requested / pending" state to the flow vocabulary** — closes 1, 2, 14.
  This is the headline fix and is a design change, not a back-end one.

### This release
- Session-expiry warning with draft preservation (3).
- Input constraints on the amount field (5).
- Button label standard (7).
- Non-colour delinquency indicator (9).

### Next
- Statement table reference column (8).
- Dashboard emphasis hierarchy (10).

### Parked — with the reason
- Full statement-download redesign. Low frequency in the call data; revisit after
  the three top tasks complete in-portal.

## What I could not determine

- Hardship request is behind a feature flag we were not given. Given it is call-reason
  rank 2, this is a material gap in the audit and should be closed before design starts.
- No analytics access, so **frequency ratings are my estimates from the RFP's call-reason
  table, not measurements.** They are labelled High/Med/Low rather than given numbers
  for that reason.
- Screen-reader testing was done with VoiceOver on macOS only. JAWS on Windows is the
  likely primary AT for this user base and was not available.
