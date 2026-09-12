# Meridian — payoff quote flow, state matrix

> **Composite example.**

> Flow: request a payoff quote · 4 screens · Walked with the lead engineer 2026-04-02
> **D** designed · **N/A** not applicable, with reason · **OUT** outstanding

| State | Entry | Confirm | Pending | Quote |
|---|---|---|---|---|
| **Data** | | | | |
| Empty — first run | D | N/A — always follows entry | N/A | N/A |
| Empty — cleared | N/A — no user content | N/A | D — request cancelled | N/A |
| Empty — no results | N/A | N/A | N/A | D — no quote available, loan in transfer |
| Loading — initial | D | D | D | D |
| Loading — more | N/A — single record | N/A | N/A | N/A |
| Partial | N/A | N/A | D — fees returned, principal pending | D — quote without escrow detail |
| Stale | N/A | N/A | D — >24h, offers refresh | D — quote expires at midnight, countdown shown |
| One item | N/A | N/A | N/A | D |
| Maximum | N/A | N/A | D — 5 concurrent requests | N/A |
| Long strings | D — 60-char legal entity name | D | D | D |
| **Interaction** | | | | |
| default / hover / active | D | D | D | D |
| focus-visible | D | D | D | D |
| disabled | D — outside quote window | D | N/A | N/A |
| loading (button) | D | D | N/A | N/A |
| **System** | | | | |
| Error — validation | D | N/A | N/A | N/A |
| Error — server | D | D | D | D |
| Error — partial failure | N/A — single request | N/A | **OUT** | N/A |
| Permission denied | D — joint loan, not primary | D | D | D |
| Offline / reconnecting | D — queued with notice | D | D | **OUT** |
| Timeout | D | D | N/A | N/A |
| Destructive confirm | N/A | N/A | D — cancel request | N/A |
| Success | N/A | D | N/A | D |
| **Environment** | | | | |
| 320px | D | D | D | D |
| 200% zoom | D | D | D | D |
| Keyboard only | D | D | D | D |
| Screen reader | D | D | D | **OUT** — live region for expiry countdown |
| Reduced motion | D | D | D | D |
| Print | N/A | N/A | N/A | D — borrowers print quotes; confirmed on call |

## Outstanding — 3

| # | State | Why it's open | Owner | Needed by |
|---|---|---|---|---|
| 1 | Pending → partial failure | Engineering confirmed the batch can return principal without fees. Needs a design. | Me | Sprint 12 |
| 2 | Quote → offline | Undecided whether an expiring quote should be cached at all. **Compliance question, not a design one.** | Compliance | Sprint 12 |
| 3 | Quote → screen reader, expiry countdown | A live region announcing every second is unusable. Needs a considered interval. | Me | Sprint 13 |

## Notes from the engineering walkthrough

- Payoff figures come from a nightly batch. **A same-day quote is not possible.** The
  flow is built around a requested → pending → available sequence for that reason —
  this was found at lo-fi and would have cost a sprint at hi-fi.
- A loan mid-transfer returns a 200 with an empty body, not an error. Handled as
  "no quote available" rather than a server error, with different copy.
