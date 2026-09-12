# Message patterns

## Errors

**Pattern:** what happened → why → what to do now.

| Don't | Do |
|---|---|
| Error 422 | We couldn't save this — the invoice date is before the contract start. Pick a later date. |
| Invalid input | Card numbers are 16 digits. This one has 15. |
| Something went wrong | We couldn't reach the payment service. Nothing was charged. Try again in a moment. |
| You failed to complete required fields | Three fields still need an answer — they're marked below. |

Never lose the user's input on an error. Ever.

## Partial failure

State the split, name the failures, offer one action.

> 9 of 10 jobs were rescheduled. **Job 4417** failed — the technician is no longer
> available that day. [Reschedule job 4417]

## Empty states

| Kind | Pattern |
|---|---|
| First run | What this is for · what to do first · the action |
| Cleared | What used to be here · how to get more · the action |
| No results | What was searched · why nothing matched · how to widen it |
| Permission | What this is · who can grant access · how to ask |

## Buttons

Verb + object, sentence case. "Send invoice", "Delete draft", "Add technician".
Not "Submit", "OK", "Yes".

The confirm button in a destructive dialog names the destruction: "Delete 14 jobs",
not "Confirm".

## Confirmations

Only for the irreversible or the expensive. Name the consequence and the count.
If you can offer undo instead, offer undo instead.

## Loading

Under 1s: nothing. 1–3s: an indicator. Over 3s: say what is happening and,
if you can, how far along it is. Over 10s: let them leave and tell them when it's done.

## Voice

Write it like a competent colleague who is slightly in a hurry: plain, specific,
never cute in an error. No exclamation marks in failure states. No apology theatre —
one "sorry" per product, at most, and not in routine validation.
