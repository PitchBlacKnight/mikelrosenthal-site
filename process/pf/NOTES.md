# Pathfinder 2.0 — extraction notes

Source: `uploads/PATHFINDER DESIGN SYSTEM 2.0.make` (Figma Make export, zip). Inner git repo at `make_repos/lh15rr.zip`; reconstructed at commit 36ee887d (2026-08-25) into `pf/repo/` (60 text files). Missing blobs (LFS/unresolved): package.json, Shell.tsx, Typography.tsx, semantic.ts, spacing.ts, pathfinder-tokens.json, Guidelines.md, DatePicker/FileUpload/Pagination/Progress/Select pages, DataViz, Icons.

## Facts used in the case study (all counted or quoted)
- Client: AVANT Communications · partner portal/experience. Résumé dates May 2021 – Aug 2024. 2.0 site releases Jun 1 – Aug 6 2026 (v2.0.0 → v2.1.0, six releases).
- Published claims (Overview.tsx): 350+ tokens, 29 components, 6 foundations (card copy says 9), 2 themes, 6 patterns, 3 dashboards.
- Counted in src/index.css: 1,146 unique custom props = 852 camelCase `--pfXxx` alias + 294 kebab (51 `--pf-primitive-*`, 243 semantic). Light theme overrides 75. 18 `.pf-*` classes, 69 `.ds-*` classes, 2,088 lines.
- Component pages on disk: 24; foundations 7 (+2 missing = 9); patterns 5 (+DataViz = 6); dashboards 3.
- Drift findings: tier-2 kebab layer documented as consumed, components read `--pfContent_*`; Accessibility.tsx:24–30 contrast table uses `sapContent_*` names; contrast ratios are literals (16.1, 7.4, 3.1, 5.8, 4.7, 4.6); 350+ vs 1,146; 6 vs 9 foundations; 18 classes vs 29 components.
- Brand: bg #05101f, shell #030a14, raised #0f1e35, accent #27BDFA, brand #0080ff; Barlow Condensed 800 uppercase display, Inter body 13px, JetBrains Mono data. Logo SVG paths in Overview.tsx.

## Project state
- Live case study: `Pathfinder Case Study v4.dc.html` (Nocturne skin, gutter line art, Tweaks: showBackdrop/showCritique/showMeasurement/showUnresolved). v1–v3 deleted.
- Start Here header: black block, white text, `assets/spectral-arc.gif` right column at 126% width, clipped to column.
- Goji Labs mentions removed everywhere.
- Open: résumé PDF still linked from `uploads/` on Start Here — move to `assets/` before publishing.
