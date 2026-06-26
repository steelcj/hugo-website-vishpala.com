---
title: "Hugo Theme Enhancement: Goals and Design Rationale"
slug: hugo-theme-enhancement--goals
version: 0.1.0
status: draft
date: 2026-06-13
author: Christopher Steel
dc:creator: Christopher Steel
dc:subject: Hugo, theme development, accessibility, WCAG 2.2
dc:description: >
  Goals and design rationale for enhancing the chrissteel.com Hugo theme
  with improved navigation, search, theming, and accessibility features
  drawing on patterns from Material for MkDocs.
dc:language: en-CA
dc:rights: CC BY-SA 4.0
---

# Hugo Theme Enhancement: Goals and Design Rationale

## Overview

This document establishes the goals, rationale, and design constraints for a
planned enhancement of the Hugo theme used at chrissteel.com. The existing
theme is a minimal, semantically correct implementation with strong
accessibility foundations. The enhancement aims to add interaction-layer
features — mobile navigation, site-wide search, adaptive theming — without
introducing framework dependencies or regressing on accessibility conformance.

The primary reference for interaction patterns is Material for MkDocs
(Donath, 2016), a well-regarded documentation theme built on Material Design
principles. Selected patterns are adapted for a Hugo context and a personal
portfolio/writing site rather than a documentation corpus.

## Current State Assessment

The existing theme exhibits the following strengths:

- Semantic HTML structure with correct landmark regions
- Skip-to-content link present and functional
- Flat, keyboard-navigable navigation
- Minimal CSS footprint with no runtime framework dependency
- Correct `lang` attribute scoped to locale (`en-CA`)
- Licence and copyright attribution in footer

The following capabilities are absent or underdeveloped:

- Mobile navigation collapses to a flat link list with no drawer mechanism
- No site search
- No user-selectable colour scheme or contrast preference
- Header has no scroll-aware behaviour
- Footer is functional but not optimally compact

## Goals

### Goal 1 — Accessible mobile navigation

Implement a burger menu pattern for viewports below 768 px. The control shall
meet the following criteria:

- Rendered as a `<button>` element with `aria-expanded` and `aria-controls`
  attributes reflecting drawer state
- Visible focus indicator meeting WCAG 2.2 Success Criterion (SC) 2.4.11
  (Focus Appearance)
- Drawer opens and closes via both pointer and keyboard (`Enter`, `Space`,
  `Escape`)
- Focus moves to the first nav item on open; returns to the trigger on close
- Backdrop/scrim dismisses the drawer on pointer interaction
- All transitions respect `prefers-reduced-motion` (WCAG 2.2 SC 2.3.3)

The implementation shall use no external JavaScript library. Target: under
60 lines of vanilla JS and 50 lines of CSS additions.

### Goal 2 — Site-wide search

Implement client-side full-text search across all pages. The preferred
approach is Pagefind (CloudCannon, 2022), a post-build static search tool
that generates its own index and ships a composable UI. Key criteria:

- Index generated as part of the GitHub Actions build pipeline
- Search input located in the site header, expanding on focus to a full-width
  overlay on mobile
- Results rendered with page title, section heading, and excerpt
- Results list announced to screen readers via `aria-live="polite"` region
- Keyboard navigable result list (arrow keys, `Enter` to follow, `Escape` to
  close)
- No external network requests at runtime (fully self-hosted index)

Hugo's built-in JSON output format shall be evaluated as a fallback corpus
source if Pagefind integration presents complications with the GitHub Pages
build context.

### Goal 3 — Three-mode colour scheme selector

Implement a user-selectable colour scheme toggle offering three modes:

- **Light** — default light theme (current implicit theme)
- **Dark** — dark background with adjusted contrast ratios
- **High contrast** — WCAG 2.2 AAA-compliant contrast ratios (≥ 7:1 for
  normal text, ≥ 4.5:1 for large text) suitable for users with low vision

The selector shall:

- Persist the user's choice to `localStorage` across sessions
- Respect the `prefers-color-scheme` media query as the default initial state
  when no stored preference exists
- Respect `prefers-contrast: more` as a signal to default to high-contrast
  mode
- Be implemented entirely with CSS custom properties (`var(--token-name)`)
  and a `data-theme` attribute on `<html>`, with no colour values hard-coded
  in component CSS
- Render as a three-position control in the site header, accessible by
  keyboard, with each option labelled for screen readers
- Degrade gracefully in the absence of JavaScript: the `prefers-color-scheme`
  CSS media query fallback activates automatically

Material for MkDocs provides a two-position light/dark toggle (Donath, 2016).
The addition of a high-contrast mode is a divergence from that reference,
motivated by the site author's commitment to WCAG 2.2 AAA targets where
feasible and by the relevance of the Three Spheres framework to inclusive
design audiences.

### Goal 4 — Slim, scroll-aware header

Refine the header to:

- Maintain a fixed height of approximately 56 px on all viewports
- Adopt `position: sticky` with `top: 0` and a `z-index` above content
- Add a subtle `box-shadow` on scroll (toggled via a scroll event listener
  adding a CSS class)
- Optionally implement hide-on-scroll-down / reveal-on-scroll-up behaviour,
  consistent with Material for MkDocs (Donath, 2016)

### Goal 5 — Compact footer

Reduce the footer to a single-line strip containing copyright notice and
licence link, aligned to the content column max-width. The footer shall retain
`role="contentinfo"` and remain visually distinct from body content via a
top border rather than padding mass.

## Design Constraints

The following constraints apply to all implementation work:

**No CSS framework.** The theme shall remain framework-free. Styling uses
authored CSS custom properties and utility patterns only.

**No runtime JavaScript framework.** All interactivity is implemented in
vanilla JavaScript (ES2020 or later). No React, Vue, Alpine, or equivalent.

**Hugo template compatibility.** All changes operate within Hugo's template
system (`layouts/`). No modifications to Hugo's core or use of unsupported
build hooks.

**WCAG 2.2 AA minimum; AAA where feasible.** Contrast, focus appearance,
motion, and name/role/value requirements apply to all new components. The
high-contrast mode explicitly targets AAA contrast ratios.

**British English throughout.** All user-facing strings, aria labels, and
documentation use British English spelling conventions.

**Performance budget.** The theme enhancement shall not increase page weight
by more than 20 KB uncompressed (JS + CSS combined, excluding the Pagefind
index which loads lazily).

## Success Criteria

The enhancement is considered complete when:

- All five goals above are implemented and functional
- The site passes an automated axe-core audit with zero critical or serious
  violations
- Manual keyboard navigation of all new components (burger menu, search,
  theme selector) is verified
- All three colour modes meet their respective contrast targets as verified
  by a contrast checker against the token palette
- The GitHub Actions pipeline successfully builds the Pagefind index and the
  search is functional on the deployed site
- No regressions are introduced to existing content pages

## References

CloudCannon. (2022). *Pagefind: Static low-bandwidth search at scale*.
https://pagefind.app

Donath, M. (2016). *Material for MkDocs* (Version 9.x) [Software].
https://squidfunk.github.io/mkdocs-material/

World Wide Web Consortium. (2023). *Web Content Accessibility Guidelines
(WCAG) 2.2*. https://www.w3.org/TR/WCAG22/
