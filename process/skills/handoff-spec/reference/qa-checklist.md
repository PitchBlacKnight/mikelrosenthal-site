# Design QA checklist

Run on staging, before release. Written before the build starts.

## Tokens and system

- [ ] No raw hex, no off-scale spacing, no unlisted type size in the shipped build
- [ ] Components come from the library — no detached or re-implemented copies
- [ ] Token names in code match the design source exactly

## Layout

- [ ] Narrowest and widest supported widths
- [ ] 200% browser zoom
- [ ] Longest realistic string in every text slot, every shipped language
- [ ] Shortest possible content — one row, one character, no avatar
- [ ] Ten times the expected content

## States

- [ ] Every state in the matrix exists in the build
- [ ] First-run empty and cleared empty are different
- [ ] Errors preserve input and state the cause
- [ ] Partial failure is visible and actionable
- [ ] Loading has an indicator past 1s and a message past 3s

## Interaction

- [ ] Hover, active, disabled and selected match the spec
- [ ] focus-visible present on every interactive element, 3:1 minimum
- [ ] Focus moves deliberately after dialogs and route changes
- [ ] Nothing is keyboard-trapped
- [ ] Whole flow completable with no pointer

## Accessibility

- [ ] Contrast measured on the built page, not the mockup
- [ ] Targets at least 24 CSS px; 44 where the design says so
- [ ] Accessible names present and matching visible labels
- [ ] Status messages announced without stealing focus
- [ ] Reduced-motion alternative honoured

## Content

- [ ] No lorem, no placeholder, no TODO strings
- [ ] Error copy matches what was approved
- [ ] Numbers formatted and aligned as specified

## Sign-off

| Area | Checked by | Date | Result |
|---|---|---|---|
