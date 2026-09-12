# WCAG 2.2 AA — design-side checklist

Criteria a designer owns or materially influences. Mark each: **pass**, **fail**,
**n/a + reason**, or **engineering-owned**.

## Perceivable

| SC | Criterion | Design check |
|---|---|---|
| 1.1.1 | Non-text content | Every image, icon and chart has an intended alt or is marked decorative |
| 1.3.1 | Info and relationships | Headings are headings; tables have real headers; groups are grouped |
| 1.3.2 | Meaningful sequence | Visual order matches DOM order |
| 1.3.4 | Orientation | Works in both, unless essential |
| 1.3.5 | Identify input purpose | Autocomplete named on personal-data fields |
| 1.4.1 | Use of colour | No status, error or category carried by colour alone |
| 1.4.3 | Contrast (minimum) | 4.5:1 body, 3:1 large — measured, recorded |
| 1.4.4 | Resize text | Usable at 200% with no loss of content |
| 1.4.10 | Reflow | 320 CSS px wide, no two-dimensional scrolling |
| 1.4.11 | Non-text contrast | 3:1 for controls, states, focus rings, chart strokes |
| 1.4.12 | Text spacing | Survives increased line, letter, word and paragraph spacing |
| 1.4.13 | Content on hover/focus | Dismissible, hoverable, persistent |

## Operable

| SC | Criterion | Design check |
|---|---|---|
| 2.1.1 | Keyboard | Every action reachable without a pointer |
| 2.1.2 | No keyboard trap | Escape from every dialog, embed and menu |
| 2.2.1 | Timing adjustable | Any timeout can be extended or turned off |
| 2.4.3 | Focus order | Numbered on the frame, matches reading order |
| 2.4.6 | Headings and labels | Descriptive, not generic |
| 2.4.7 | Focus visible | Designed, 3:1, never the browser default removed |
| **2.4.11** | **Focus not obscured (2.2)** | Sticky headers and toolbars don't cover the focused element |
| 2.5.3 | Label in name | Visible label is contained in the accessible name |
| **2.5.7** | **Dragging movements (2.2)** | Every drag has a single-pointer alternative |
| **2.5.8** | **Target size (2.2)** | 24×24 CSS px minimum; design to 44 |

## Understandable

| SC | Criterion | Design check |
|---|---|---|
| 3.2.3 | Consistent navigation | Same order, same place, every screen |
| 3.2.4 | Consistent identification | The same function named the same way throughout |
| **3.2.6** | **Consistent help (2.2)** | Help sits in the same relative place on every screen |
| 3.3.1 | Error identification | Errors named in text, not only in colour |
| 3.3.2 | Labels or instructions | Every input labelled; placeholder is never the label |
| 3.3.3 | Error suggestion | The fix is offered, not just the failure |
| 3.3.4 | Error prevention | Reversible, checked, or confirmed for legal and financial actions |
| **3.3.7** | **Redundant entry (2.2)** | Don't ask twice in one process |
| **3.3.8** | **Accessible authentication (2.2)** | No cognitive-function test with no alternative; allow paste |

## Robust

| SC | Criterion | Design check |
|---|---|---|
| 4.1.2 | Name, role, value | Specified for every custom control |
| 4.1.3 | Status messages | Announced without moving focus |

## Recording format

| SC | Result | Evidence / reason | Owner |
|---|---|---|---|
