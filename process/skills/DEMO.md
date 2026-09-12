# Demo runbook

Ten minutes, live, on a laptop. The point is not to show that a model can write —
everyone knows that. The point is to show that the **output has a fixed shape**,
that the shape came from a rubric someone wrote deliberately, and that the skill
refuses to make things up.

## Before you start

1. Open a Claude project with `skills/` loaded.
2. Have a real brief to hand — theirs is best. A paragraph of a job description or
   a product page works if they don't offer one.
3. Have `examples/` open in a second window, so you can jump to a finished artifact
   if the room wants to see the end state rather than watch it build.

## The four beats

### 1 — The library is cheap until it isn't (30 seconds)

> "There are nine skills loaded here. At rest, only the one-line description of each
> is in context — about forty words a skill. The procedure, the rubric and the
> templates only load when a task actually matches. So the library scales without
> costing me anything to carry."

Show `README.md`, then open one `SKILL.md` and point at the frontmatter versus the body.

### 2 — Intake, live (3 minutes)

Paste their brief. Then:

```
Run brief-intake on this.
```

**What to point at in the output:**
- The problem restated in *their* words, quoted — not paraphrased.
- `UNRESOLVED` in the metric row. Say: *"It didn't invent a number. That's the
  most important thing on this screen."*
- The assumption register sorted by cost of being wrong, each with an owner.
- Exactly three questions back — not thirty.

> "This file is now the context every other skill reads from. A model amplifies
> whatever context you hand it, so this is the only part where being slow pays."

### 3 — The fork (3 minutes)

> "From here it splits. If the question is about a design system, that's a counting
> exercise — I start with artifacts. If it's about a product, it's a people exercise —
> I start with users. Getting this fork wrong wastes the first two weeks."

Pick whichever is closer to their world and run one:

```
Run ds-inventory against this repo / these screens.
```
```
Run heuristic-audit on the checkout flow. Two critical paths.
```

**What to point at:** the severity scale, and the **Cost** column.

> "A finding without a cost is trivia, and nobody funds trivia. The fix list is
> sequenced by where the fix *lands* — one primitive often closes ten findings."

If time is short, skip running it and open `examples/02-drift-report.md` instead.

### 4 — Critique on my own work (3 minutes)

This is the beat that lands. Take something you just made — in the demo, the output
from step 3 — and run:

```
Run critique on that audit. Attack it on all seven fronts.
```

> "It's arguing against my own work before anyone else has to. If the output is
> encouraging, the skill has failed — that's written into it."

Then close:

> "What I never delegate: the problem statement, talking to users, the final visual
> call, and anything stated as a fact. The tooling compresses the loop. It doesn't
> decide what the loop is for."

## If they push

**"Couldn't anyone do this with a good prompt?"**
> "For one project, yes. The difference is that the rubric is a file — versioned,
> improved after every engagement, and runnable by another designer who gets the
> same shape of output. That's the difference between a prompt and a practice."

**"How do you know it isn't making things up?"**
> "Five house rules run through every skill. The first is never invent a number —
> every quantity traces to a named source or it gets cut. The second is say what you
> couldn't determine. You saw both fire in the intake."

**"What happens when it's wrong?"**
> "It's wrong regularly, and confidently. Which is why nothing leaves my hands
> without the critique pass and my own read. The library makes the first draft fast
> and consistent — it doesn't make it final."

## Timing

| Beat | Minutes |
|---|---|
| Library structure | 0:30 |
| Intake, live | 3:00 |
| The fork | 3:00 |
| Critique | 3:00 |
| Close | 0:30 |
