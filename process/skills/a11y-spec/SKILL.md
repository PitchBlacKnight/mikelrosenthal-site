---
name: a11y-spec
description: Produce a per-screen accessibility specification — focus order, roles, names, contrast pairs with measured ratios, target sizes — and audit designs against WCAG 2.2 AA. Use during design and at handoff; accessibility is a spec line, not a final-week audit.
---

# Accessibility spec

Held as a gate, not a cleanup pass. A contrast ratio is measured, not eyeballed,
and it goes in the spec next to the colour it applies to.

## Procedure

1. **Focus order** for every screen, numbered on the frame. It follows the visual
   reading order. Where it cannot, say why and what handles it.
2. **Name, role, value** for every interactive element. The accessible name is
   written out — not inferred from the visual label, which may be an icon.
3. **Contrast pairs.** Every foreground/background pair in the design, with the
   measured ratio and the threshold it must clear:
   - Body text: 4.5:1
   - Large text (≥24px, or ≥19px bold): 3:1
   - Interface components and graphical objects: 3:1
   - Focus indicators: 3:1 against adjacent colours
4. **Target sizes.** 44×44px minimum for touch. WCAG 2.2 AA requires 24×24 CSS px
   minimum with spacing exceptions — 44 is the design standard, 24 is the floor.
5. **Keyboard path.** Walk the whole flow with no pointer. Every action reachable,
   nothing trapped, focus visible at every step, focus moved deliberately after
   dialogs and route changes.
6. **Motion and timing.** A reduced-motion alternative for anything that moves.
   No timeout without a way to extend it.
7. **Run `reference/wcag22-checklist.md`** and record the result per criterion.

## Rules

- Never write "AA compliant" without the criterion-by-criterion record behind it.
- Colour is never the only carrier of meaning. Check every status indicator.
- Placeholder text is not a label.
- Disabled controls still need to explain why they're disabled.
- New in 2.2 and most often missed: focus not obscured, dragging alternatives,
  target size, consistent help, redundant entry, accessible authentication.

## Bundled files

- `reference/wcag22-checklist.md`
