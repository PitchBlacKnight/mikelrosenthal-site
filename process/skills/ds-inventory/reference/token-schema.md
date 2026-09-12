# Token schema

Three tiers. A system that skips the middle tier cannot be re-themed, and a system
that skips the third cannot be handed to engineering without a translation layer.

## Tier 1 — Primitive

Raw values. No meaning. Never referenced directly by a component.

```
color.neutral.100 … 900
color.brand.100 … 900
space.1 … 12          (an 8px base, half-steps where density demands)
radius.none … full
type.size.100 … 1000
type.weight.regular … bold
```

## Tier 2 — Semantic

Meaning, no component. This is the tier that makes theming possible — a mode swaps
what these point at, and nothing downstream changes.

```
color.surface.canvas / raised / inverted / sunken
color.text.primary / secondary / disabled / inverse / accent
color.border.default / strong / focus
color.status.success / warning / danger / info   (each with surface + text + border)
space.inset.sm / md / lg
space.stack.sm / md / lg
```

## Tier 3 — Component

Bound to one component, referencing tier 2 only.

```
button.primary.background.default / hover / active / disabled
button.primary.text.default / …
input.border.default / focus / error
```

## Naming rules

- `category.role.variant.state` — always that order, always lowercase, dot-separated.
- The design source and the coded library use the **same string**. If Figma says
  `color.text.primary` and CSS says `--text-color-main`, you do not have parity —
  you have a translation layer that someone maintains by hand.
- Never encode a value in a name. `color.brand.blue` breaks the day the brand changes.
- Never encode a place. `color.header.background` becomes a lie the first time it's reused.

## What to flag in a diff

| Finding | Cost |
|---|---|
| Used and undeclared | Re-theming is impossible; every instance is a manual edit |
| Declared and unused | Dead weight, or nobody can find it in the docs |
| Same value, two names | Code Connect breaks; two owners diverge |
| Two values, one name | Silent inconsistency; the worse value wins at random |
| Component referencing a primitive directly | Skips the theming layer; will not survive a mode |
| Raw hex in shipped code | The system is advisory, not enforced |
