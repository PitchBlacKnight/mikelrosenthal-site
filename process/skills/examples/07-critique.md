# Critique — Meridian payoff quote flow

> **Composite example.** Run against my own work before internal review.

Seven fronts, ranked by cost. Every objection carries a proposal.

## 1 — CRITICAL · The flow assumes a metric nobody has produced

The brief lists both primary metrics as UNRESOLVED and they are still unresolved at
handoff. This flow is being built on the belief that completable tasks reduce calls —
which the research supports at 7 of 8, but which has never been measured here.

**Proposal:** do not ship without instrumentation on the three named tasks, in the same
release. If the baseline still does not exist, ship the instrumentation *first*, in a
release of its own. Shipping the redesign into an unmeasured environment means we will
never know whether it worked, and the next engagement will start with the same argument.

## 2 — CRITICAL · It depends on a component we have documented as broken

The flow reuses the date picker. The drift report scores it 0 on states, accessibility
and code parity, and finding 3 records that it has no keyboard path — on a contract
that names WCAG 2.2 AA.

**Proposal:** the handoff already marks this blocked, which is right, but "blocked" in a
spec is weak. Make the primitive rebuild a dependency in the sprint plan with a named
owner, or cut the date field from v1 and default to the standard payoff date. The second
option is worse design and ships legally.

## 3 — MAJOR · The partial state is designed on an assumption engineering has not confirmed

Open question 1 asks whether the batch can return principal without fees. The partial
state is already designed, specified and in the state matrix. If the answer is no, that
work is wasted; if the answer is yes but the split is different, it is worse than wasted
because it is wrong and looks finished.

**Proposal:** get the answer before sprint 12 planning, not during it. This is one
conversation and I should have had it during flow-map, not after.

## 4 — MAJOR · The structurally different approach was never on the table

The whole flow assumes the borrower waits for a batch. Nobody costed a same-day quote
path — an on-demand calculation for the straightforward cases, with the batch as fallback
for the complex ones. Most payoffs are probably simple.

**Proposal:** ask engineering what share of loans could be quoted on demand. If it is
over half, the pending state becomes an exception rather than the primary path, and the
product is substantially better. I did not ask because the batch constraint arrived early
and I accepted it as total.

## 5 — MAJOR · Research says the dashboard doesn't matter, and the engagement still leads with it

Insight 4: 8 of 8 participants ignored the dashboard entirely. The brief names the
dashboard redesign as the deliverable. We have not formally raised the contradiction — we
have just quietly worked on the flows instead.

**Proposal:** raise it in writing, with the evidence, and propose reallocating the
dashboard budget to the hardship flow (research insight 3, call-reason rank 2, currently
unaudited because it sat behind a flag). Quietly doing the right work is not the same as
getting agreement to do it.

## 6 — MODERATE · Three outstanding states are carried into handoff

Partial failure on pending, offline on quote, and the countdown announcement interval.
Two have owners and dates; one is a compliance question that has been open since the
walkthrough.

**Proposal:** acceptable to hand off with these marked, but the compliance question needs
escalating now — it has been open three weeks and it blocks a state, not a detail.

## 7 — MODERATE · The expiry countdown is the average solution

A ticking countdown on a financial quote is what every product does. It creates mild
urgency on a page where the borrower is making a large, considered decision, and it
required an accessibility workaround to keep it from being unusable.

**Proposal:** test a plain expiry statement — "this quote is valid until midnight on
14 May" — against the countdown. If it performs the same, the simpler version is better
and the accessibility problem disappears rather than being mitigated.

---

## The single weakest decision

**Accepting the nightly-batch constraint as total, in week one, without asking what share
of quotes could bypass it.** Everything downstream — the pending state, the reference
number, the countdown, three of the seven objections above — descends from that
unexamined acceptance. It is the same mistake as last time: taking a stated constraint
into wireframes without testing its edges with an engineer first.
