---
name: copy-standards
description: Write and review interface copy — errors, empty states, labels, buttons, confirmations — in the product's own voice, with real strings at real lengths. Use during high-fidelity design and before any handoff; lorem in an error state is an unfinished design.
---

# Copy standards

Error and empty-state copy written by the designer, reviewed with the client, and
tested at the longest string in the database. Microcopy is not a content task that
happens later — it is the part of the interface people read most carefully, because
they only read it when something has gone wrong.

## Procedure

1. **Establish the voice** from what the product already says, not from a brand
   deck. Three adjectives, and three phrases the product would never use.
2. **Inventory every string** in the flow: labels, buttons, placeholders, helper
   text, empty states, errors, confirmations, success messages, tooltips.
3. **Rewrite against `reference/message-patterns.md`.**
4. **Test at length.** Longest realistic string, every language shipped. Then the
   shortest — one-character names break layouts too.
5. **Review with the client.** Legal and compliance language in regulated products
   is theirs to approve, not yours to draft alone.

## Rules

- Errors state the cause and the next step. Never a code alone, never "something
  went wrong" where you know what went wrong.
- Never blame the user. "That email is already registered", not "You entered an
  invalid email".
- Buttons are verbs, and they say what happens: "Send invoice", not "Submit".
- Empty states teach. First-run empty and cleared empty are different messages.
- Never lorem. A placeholder string in a shipped spec becomes a shipped string.
- Sentence case everywhere unless the design system says otherwise.

## Bundled files

- `reference/message-patterns.md`
