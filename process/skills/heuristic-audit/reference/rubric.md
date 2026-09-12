# Audit rubric

Nielsen's ten, sharpened into things you can actually observe, plus four that
matter in enterprise and regulated software.

| # | Heuristic | What counts as evidence |
|---|---|---|
| 1 | Visibility of system status | A state change with no feedback; a wait with no indicator; a saved thing that doesn't say it saved |
| 2 | Match to the real world | Interface language that isn't the user's language; ordering that follows the data model, not the task |
| 3 | User control and freedom | No undo; no exit from a flow; destructive action with no confirm or no recovery |
| 4 | Consistency and standards | The same action named two ways; the same control behaving two ways; platform conventions broken without reason |
| 5 | Error prevention | Input that can be wrong but isn't constrained; irreversible action adjacent to a common one |
| 6 | Recognition over recall | Information needed here shown only there; codes the user must memorise |
| 7 | Flexibility and efficiency | No path for the expert; bulk work only available one row at a time |
| 8 | Aesthetic and minimalist design | Competing emphasis; more than one primary action; decoration carrying no information |
| 9 | Error recovery | Errors that state a code, not a cause; errors with no next step; errors that lose the user's input |
| 10 | Help and documentation | Help that isn't where the task is |
| 11 | Data density and legibility | Dense data with no hierarchy; numbers not right-aligned or not tabular; tables with no fixed reference column |
| 12 | State coverage | Empty, loading, partial, error, permission-denied, offline — any one missing is a finding |
| 13 | Trust and explainability | Automated or AI output with no confidence signal, no source, and no correction path |
| 14 | Auditability | An action with consequences that leaves no visible record |

## Scoring a component or pattern

Five axes, 0–3 each. Anything scoring 0 on states or accessibility is a finding
regardless of total.

| Axis | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| States | Default only | Some | Most | All, documented |
| Accessibility | Barriers | Partial | Conformant | Conformant and documented |
| Documentation | None | A screenshot | Usage guidance | Usage, do/don't, code parity |
| Adoption | Unused | One team | Most teams | Everywhere it should be |
| Code parity | No coded twin | Exists, diverged | Matches visually | Matches in name, structure, behaviour |
