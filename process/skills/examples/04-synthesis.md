# Meridian borrower research — synthesis

> **Composite example.** All numbers invented for illustration.

> Method: moderated, remote, 45 min · Participants: 8 borrowers
> Recruited: from the servicing contact list, screened for a call in the last 90 days
> **Missing from this sample:** anyone who never calls — that is, the population the
> portal already works for. Findings describe callers, not borrowers generally.
> Informs: assumptions 1, 2 and 3 in `01-project-brief.md`

## Insights

### 1. People call because the portal starts the task and cannot finish it

**Signal:** observed · **7 of 8 participants**

Seven participants attempted a payoff quote or a date change in the portal before
calling. All seven reached a screen instructing them to phone. Six described the call
as the portal's fault rather than their own — the distinction matters, because it is
the portal's design that is generating the contact, not borrower preference.

> "I did it online and then it told me to ring anyway. So now I just ring." — P3

**Triangulation:** consistent with the RFP's call-reason ranking. No analytics access
to confirm sequence.

**So we should:** treat the dead-end states as the primary design problem and add a
tracked "requested" state, rather than redesigning the dashboard's appearance.

---

### 2. The pending state is invisible, so people submit repeatedly

**Signal:** observed · **4 of 8 participants**

Four participants submitted a payment-date change more than once in the session
because nothing on the screen changed after the first submission. Two then called to
ask whether they had done it twice.

> "Did that go? I can't tell if that went." — P6

**Triangulation:** unavailable — no instrumentation on duplicate submissions. **This
is worth instrumenting before design begins**, because it would size the problem.

**So we should:** design the queued state explicitly, with a visible pending status
and a reference the borrower can quote on a call.

---

### 3. Struggling borrowers will not use a self-service hardship flow unaided

**Signal:** observed and stated · **3 of 3 participants who had requested hardship**

All three said they wanted a person. Two attempted the online flow first and abandoned
at the disclosure step — one said she was afraid of agreeing to something she did not
understand.

> "I didn't want to click agree on something I didn't understand. Not with my house." — P7

**Triangulation:** unavailable.

**So we should:** design the hardship path as *assisted* — the portal prepares and
saves the request, a person completes it. **Contradicts assumption 3 directly.**

Caveat stated plainly: n=3. The direction is consistent and the cost of ignoring it is
high, but this is not a finding I would size a roadmap on without more.

---

### 4. Nobody read the dashboard

**Signal:** observed · **8 of 8 participants**

Every participant went straight to the navigation or to search. Not one read the
dashboard summary cards. Two could not say what was on them after using the portal
for ten minutes.

> "I don't look at that bit, I just go to payments." — P1

**So we should:** stop treating the dashboard as the centrepiece of the redesign. The
brief names it first; the evidence does not support it. **Contradicts assumption 1.**

## Contradicts the brief

| Assumption # | What we assumed | What we found | Cost of keeping it |
|---|---|---|---|
| 1 | Call volume is caused by dashboard design | Caused by tasks that cannot be completed (7 of 8) | The engagement redesigns the least-used screen and call volume does not move |
| 3 | Borrowers will complete a hardship request unaided | 3 of 3 wanted a person; 2 abandoned at disclosure | Vulnerable users abandon at the worst possible moment, and the guardrail metric worsens |

## Parked

- Four participants mentioned wanting payment history exported. Real, but informs no
  current decision. Recorded so it is not rediscovered as new in month four.
- Two mentioned the mobile app. Out of scope per the brief.
