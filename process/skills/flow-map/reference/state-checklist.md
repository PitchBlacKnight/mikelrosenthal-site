# State checklist

Walk every screen against this. Mark: **designed**, **n/a + reason**, or **outstanding**.

## Data states

| State | The question |
|---|---|
| Empty — first run | Never had data. What teaches the user what goes here? |
| Empty — cleared | Had data, now none. Different copy from first run. |
| Empty — no results | A filter or search returned nothing. Offers a way back. |
| Loading — initial | Skeleton or spinner, and what the user can do meanwhile |
| Loading — more | Pagination, infinite scroll, background refresh |
| Partial | Some data arrived, some didn't. What is shown, what is marked missing |
| Stale | Data is old. Is the user told, and can they refresh? |
| One item | Layouts tuned for many often break at one |
| Maximum | Ten times the expected content. Where does it break? |
| Long strings | The longest name in the database, in every language you ship |

## Interaction states

Per interactive element: default, hover, focus-visible, active, disabled, loading,
selected, read-only. **Focus-visible is not optional and is the one most often missing.**

## System states

| State | The question |
|---|---|
| Error — validation | Inline, specific, states the cause and the fix, preserves input |
| Error — server | What the user can do now; never a bare code |
| Error — partial failure | Nine of ten succeeded. What does the screen say? |
| Permission denied | Hidden or disabled-with-reason? Decide deliberately |
| Offline / reconnecting | Queued actions, and what happens to them |
| Timeout | Distinct from error. Is the work lost? |
| Destructive confirm | Proportional to the consequence, and reversible if possible |
| Success | Confirmed visibly, and the next action is obvious |

## Environment states

Narrowest supported width · largest supported width · keyboard only · screen reader ·
200% zoom · reduced motion · dark mode, if shipped · print, if relevant

## The rule

If a state is not in the library, it is not designed — and it will be invented in
code, at 6pm, by someone without the context.
