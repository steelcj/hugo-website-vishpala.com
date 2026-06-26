---
title: "Hugo Theme Enhancement: Implementation Plan"
slug: hugo-theme-enhancement--implementation-plan
version: 0.1.0
status: draft
date: 2026-06-13
author: Christopher Steel
dc:creator: Christopher Steel
dc:subject: Hugo, theme development, implementation, Pagefind, CSS custom properties
dc:description: >
  Phased implementation plan for the Hugo theme enhancement described in
  hugo-theme-enhancement--goals v0.1.0, covering file changes, sequencing,
  testing, and rollout.
dc:language: en-CA
dc:rights: CC BY-SA 4.0
---

# Hugo Theme Enhancement: Implementation Plan

## Scope

This document describes the phased implementation of the five goals specified
in *Hugo Theme Enhancement: Goals and Design Rationale* (Steel, 2026). It is
addressed to the site author working in the `chrissteel.com` Hugo repository
and assumes familiarity with Hugo's template system and GitHub Actions.

Each phase is designed to be independently deployable and non-breaking with
respect to existing content.

---

## Phase 1 — CSS token layer and compact footer

**Rationale.** Establishing a CSS custom property token layer first makes all
subsequent phases easier: colour scheme switching, contrast mode, and
component styling all depend on tokens being defined before components
reference them. The footer is a low-risk, high-visibility win.

### 1.1 Token architecture

Create `assets/css/tokens.css`. This file defines all design tokens as custom
properties on `:root` and on `[data-theme]` attribute selectors. No colour
values appear anywhere else in the CSS codebase after this change.

Token categories:

- `--colour-bg-*` — background surfaces (page, header, footer, overlay)
- `--colour-fg-*` — foreground text (primary, secondary, muted, link,
  link-hover)
- `--colour-border-*` — border and divider colours
- `--colour-focus` — focus ring colour
- `--colour-accent` — interactive accent (buttons, active nav)
- `--space-*` — spacing scale (4 px base unit)
- `--type-*` — font size scale
- `--radius-*` — border radius values
- `--shadow-header` — header scroll shadow value
- `--transition-base` — default transition duration/easing

Three theme blocks are defined:

```css
/* Default: respects OS preference */
:root {
  color-scheme: light dark;
  --colour-bg-page: #ffffff;
  /* ... all tokens ... */
}

/* Light explicit */
[data-theme="light"] {
  color-scheme: light;
  --colour-bg-page: #ffffff;
  /* ... */
}

/* Dark */
[data-theme="dark"] {
  color-scheme: dark;
  --colour-bg-page: #1a1a1a;
  /* ... */
}

/* High contrast */
[data-theme="high-contrast"] {
  color-scheme: light;
  --colour-bg-page: #000000;
  --colour-fg-primary: #ffffff;
  --colour-fg-link: #ffff00;
  --colour-border-focus: #ffffff;
  /* Target: 7:1 minimum for all text pairs */
  /* ... */
}

/* OS-level preference fallbacks (no JS) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --colour-bg-page: #1a1a1a;
    /* ... mirrors [data-theme="dark"] ... */
  }
}

@media (prefers-contrast: more) {
  :root:not([data-theme]) {
    /* ... mirrors [data-theme="high-contrast"] ... */
  }
}
```

All existing component CSS is refactored in this phase to reference tokens
rather than hard-coded values.

### 1.2 Footer refactor

Edit `layouts/partials/footer.html`. Target structure:

```html
<footer role="contentinfo">
  <div class="footer-inner">
    <span>© {{ now.Year }} Christopher Steel</span>
    <span>
      <a href="https://creativecommons.org/licenses/by-sa/4.0/"
         rel="license noopener noreferrer">CC BY-SA 4.0</a>
    </span>
  </div>
</footer>
```

CSS: single-line flex row, `min-height: 2.5rem`, top border using
`var(--colour-border-default)`, font-size `var(--type-sm)`.

### 1.3 Files changed in phase 1

- `assets/css/tokens.css` — new
- `assets/css/main.css` — refactored to reference tokens; footer styles added
- `layouts/partials/footer.html` — simplified markup
- `layouts/partials/head.html` — add `tokens.css` import or merge into
  pipeline

**Verification.** Confirm no colour literals remain in `main.css` by grepping
for hex codes and `rgb(`. Confirm footer renders correctly in light and dark OS
modes without JavaScript.

---

## Phase 2 — Slim, scroll-aware header

**Rationale.** The header is the frame for the burger menu and theme selector
added in later phases. Establishing its final dimensions and scroll behaviour
first avoids layout shifts when those components are added.

### 2.1 Header CSS

Modify `assets/css/main.css`:

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 3.5rem; /* 56 px */
  display: flex;
  align-items: center;
  background: var(--colour-bg-header);
  transition: box-shadow var(--transition-base);
}

.site-header--scrolled {
  box-shadow: var(--shadow-header);
}
```

### 2.2 Scroll shadow script

Create `assets/js/header-scroll.js`:

```javascript
(function () {
  'use strict';
  const header = document.querySelector('.site-header');
  if (!header) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle('site-header--scrolled', !entry.isIntersecting);
    },
    { threshold: 0 }
  );

  // Observe a sentinel element immediately after the header
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  header.insertAdjacentElement('afterend', sentinel);
  observer.observe(sentinel);
}());
```

An `IntersectionObserver` on a sentinel element is preferred over a scroll
event listener: it has no scroll-event overhead and requires no
`requestAnimationFrame` throttling.

### 2.3 Files changed in phase 2

- `assets/css/main.css` — header sticky/shadow styles
- `assets/js/header-scroll.js` — new
- `layouts/partials/head.html` — add script reference (deferred)

**Verification.** Confirm `position: sticky` does not clip the header on any
page with a long `<main>`. Confirm shadow appears and disappears correctly
on scroll. Confirm no layout shift is introduced on page load.

---

## Phase 3 — Three-mode colour scheme selector

**Rationale.** Placing the theme selector before the burger menu means it can
be tested in the desktop header before the mobile drawer exists.

### 3.1 Control markup

Add to `layouts/partials/header.html`:

```html
<div class="theme-selector" role="group" aria-label="Colour scheme">
  <button class="theme-btn" data-theme-value="light"
          aria-pressed="false" title="Light theme">
    <!-- SVG sun icon, aria-hidden="true" -->
    <span class="visually-hidden">Light</span>
  </button>
  <button class="theme-btn" data-theme-value="dark"
          aria-pressed="false" title="Dark theme">
    <!-- SVG moon icon, aria-hidden="true" -->
    <span class="visually-hidden">Dark</span>
  </button>
  <button class="theme-btn" data-theme-value="high-contrast"
          aria-pressed="false" title="High contrast theme">
    <!-- SVG contrast icon, aria-hidden="true" -->
    <span class="visually-hidden">High contrast</span>
  </button>
</div>
```

Three `<button>` elements with `aria-pressed` is preferred over a `<select>`
or radio group for this use case: it provides one-tap access to each mode
without expanding a list, and `aria-pressed` communicates the active state
clearly to assistive technology.

### 3.2 Theme script

Create `assets/js/theme.js`:

```javascript
(function () {
  'use strict';

  const STORAGE_KEY = 'cs-theme';
  const html = document.documentElement;
  const buttons = document.querySelectorAll('.theme-btn');

  function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    if (window.matchMedia('(prefers-contrast: more)').matches) {
      return 'high-contrast';
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    buttons.forEach(btn => {
      btn.setAttribute('aria-pressed',
        String(btn.dataset.themeValue === theme));
    });
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) { /* storage unavailable */ }
  }

  // Apply immediately to avoid flash
  applyTheme(getInitialTheme());

  buttons.forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.themeValue));
  });
}());
```

This script must load as early as possible — ideally as an inline `<script>`
in `<head>` before the CSS, or at minimum before the first paint — to prevent
a flash of the default theme on page load for users with a stored preference.

### 3.3 High-contrast token palette

The high-contrast token values shall be validated against WCAG 2.2 SC 1.4.6
(Contrast Enhanced, AAA, 7:1 ratio) using the WebAIM contrast checker or
equivalent. The palette shall be documented in a companion token reference
file for future maintenance.

Initial palette targets (subject to verification):

- Background: `#000000`
- Primary text: `#ffffff` (21:1 against background)
- Body links: `#ffff00` (19.56:1 against black)
- Visited links: `#ff9900`
- Focus ring: `#ffffff` with `outline-offset: 3px`
- Border: `#ffffff`
- Header background: `#000000`
- Button text: `#000000` on `#ffffff` background

### 3.4 Files changed in phase 3

- `assets/js/theme.js` — new
- `layouts/partials/header.html` — theme selector markup added
- `layouts/partials/head.html` — inline theme script added (anti-flash)
- `assets/css/tokens.css` — high-contrast token block completed
- `assets/css/components/theme-selector.css` — new

**Verification.** Test all three modes. Verify `aria-pressed` updates
correctly. Verify `localStorage` persistence across page loads and browser
restarts. Verify OS-preference default applies correctly with JS disabled.
Run contrast checks on all three palettes.

---

## Phase 4 — Burger menu (mobile navigation drawer)

### 4.1 Markup changes

Modify `layouts/partials/header.html` to wrap the existing nav in a drawer
structure and add the trigger button:

```html
<!-- Burger trigger (visible < 768px only) -->
<button class="nav-toggle" aria-expanded="false"
        aria-controls="site-nav" aria-label="Open navigation menu">
  <span class="nav-toggle__bar" aria-hidden="true"></span>
  <span class="nav-toggle__bar" aria-hidden="true"></span>
  <span class="nav-toggle__bar" aria-hidden="true"></span>
</button>

<!-- Backdrop -->
<div class="nav-backdrop" aria-hidden="true" hidden></div>

<!-- Navigation drawer -->
<nav id="site-nav" class="site-nav" aria-label="Site navigation">
  <!-- existing nav links -->
</nav>
```

### 4.2 CSS

Add to `assets/css/components/nav.css`:

```css
@media (max-width: 767px) {
  .nav-toggle {
    display: flex;
    /* burger bar styles */
  }

  .site-nav {
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    width: min(18rem, 85vw);
    background: var(--colour-bg-nav);
    transform: translateX(-100%);
    transition: transform var(--transition-base);
    overflow-y: auto;
    z-index: 200;
  }

  .site-nav--open {
    transform: translateX(0);
  }

  .nav-backdrop {
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 0.4);
    z-index: 150;
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .nav-backdrop--visible {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .site-nav,
    .nav-backdrop {
      transition: none;
    }
  }
}

@media (min-width: 768px) {
  .nav-toggle,
  .nav-backdrop {
    display: none;
  }
}
```

### 4.3 JavaScript

Create `assets/js/nav.js`:

```javascript
(function () {
  'use strict';

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const backdrop = document.querySelector('.nav-backdrop');
  if (!toggle || !nav || !backdrop) return;

  let isOpen = false;
  let lastFocused = null;

  function getFocusable() {
    return Array.from(nav.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  function open() {
    isOpen = true;
    lastFocused = document.activeElement;
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('site-nav--open');
    backdrop.removeAttribute('hidden');
    // Trigger transition on next frame
    requestAnimationFrame(() => backdrop.classList.add('nav-backdrop--visible'));
    document.body.style.overflow = 'hidden';
    const focusable = getFocusable();
    if (focusable.length) focusable[0].focus();
  }

  function close() {
    isOpen = false;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('site-nav--open');
    backdrop.classList.remove('nav-backdrop--visible');
    document.body.style.overflow = '';
    backdrop.addEventListener('transitionend', () => {
      backdrop.setAttribute('hidden', '');
    }, { once: true });
    if (lastFocused) lastFocused.focus();
  }

  toggle.addEventListener('click', () => isOpen ? close() : open());
  backdrop.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) close();
  });

  // Focus trap
  nav.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
}());
```

### 4.4 Files changed in phase 4

- `layouts/partials/header.html` — burger trigger, backdrop, nav wrapper
- `assets/css/components/nav.css` — new
- `assets/js/nav.js` — new
- `layouts/partials/head.html` or `layouts/partials/scripts.html` — script
  reference added

**Verification.** Test on mobile viewport (360 px, 390 px, 430 px). Verify
focus trap prevents Tab escaping the drawer while open. Verify Escape closes
the drawer and returns focus to the trigger. Verify backdrop click closes.
Verify body scroll is locked while drawer is open.

---

## Phase 5 — Pagefind search integration

### 5.1 Hugo output configuration

Add to `hugo.toml`:

```toml
[outputs]
  home = ["HTML", "RSS"]
  # Pagefind indexes the built HTML directly; no JSON output needed
```

Confirm that all content pages render as standard HTML with visible text
content (no JavaScript-only rendering), as Pagefind indexes the static output.

### 5.2 GitHub Actions build step

Add the Pagefind indexing step after the Hugo build in `.github/workflows/`:

```yaml
- name: Build Hugo site
  run: hugo --minify

- name: Index with Pagefind
  run: npx -y pagefind --site public --output-path public/pagefind
```

The `--output-path` places the index inside the `public/` directory so it is
included in the GitHub Pages deployment artifact.

### 5.3 Search UI markup

Add to `layouts/partials/header.html`:

```html
<div class="search-container" role="search">
  <label for="site-search" class="visually-hidden">Search this site</label>
  <input id="site-search" class="search-input" type="search"
         placeholder="Search…" autocomplete="off"
         aria-expanded="false" aria-controls="search-results"
         aria-autocomplete="list">
  <div id="search-results" class="search-results" role="listbox"
       aria-label="Search results" aria-live="polite" hidden></div>
</div>
```

### 5.4 Search script

Pagefind provides a JavaScript API that can be called without using its
default UI bundle, enabling full control over markup and styling. Create
`assets/js/search.js`:

```javascript
(function () {
  'use strict';

  const input = document.getElementById('site-search');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  let pagefind;

  async function loadPagefind() {
    if (pagefind) return;
    // Pagefind is loaded lazily on first search interaction
    const mod = await import('/pagefind/pagefind.js');
    pagefind = mod;
    await pagefind.init();
  }

  async function search(query) {
    if (!query.trim()) {
      results.setAttribute('hidden', '');
      input.setAttribute('aria-expanded', 'false');
      return;
    }
    await loadPagefind();
    const response = await pagefind.search(query);
    const data = await Promise.all(response.results.slice(0, 8).map(r => r.data()));
    renderResults(data);
  }

  function renderResults(items) {
    results.innerHTML = '';
    if (!items.length) {
      results.innerHTML = '<p class="search-empty">No results found.</p>';
    } else {
      const list = document.createElement('ul');
      list.setAttribute('role', 'none');
      items.forEach(item => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.innerHTML = `
          <a href="${item.url}" class="search-result">
            <span class="search-result__title">${item.meta.title}</span>
            <span class="search-result__excerpt">${item.excerpt}</span>
          </a>`;
        list.appendChild(li);
      });
      results.appendChild(list);
    }
    results.removeAttribute('hidden');
    input.setAttribute('aria-expanded', 'true');
  }

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => search(input.value), 200);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      results.setAttribute('hidden', '');
      input.setAttribute('aria-expanded', 'false');
      input.value = '';
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-container')) {
      results.setAttribute('hidden', '');
      input.setAttribute('aria-expanded', 'false');
    }
  });
}());
```

### 5.5 Excluding pages from the index

Pages that should not appear in search results (e.g. the contact placeholder)
can be excluded by adding the Pagefind meta tag to their front matter or
template:

```html
<meta name="pagefind-ignore" content="all">
```

### 5.6 Files changed in phase 5

- `.github/workflows/deploy.yml` — Pagefind build step added
- `layouts/partials/header.html` — search markup added
- `assets/js/search.js` — new
- `assets/css/components/search.css` — new
- `hugo.toml` — outputs verified (no changes expected)

**Verification.** Verify the Pagefind index builds without errors in CI. Verify
search returns results for known content. Verify `aria-live` region is
announced by VoiceOver and NVDA when results appear. Verify Pagefind bundle
is not fetched until the user interacts with the search input (lazy load).

---

## Testing and acceptance

### Automated

- `axe-core` CLI (`npx axe-cli https://steelcj.github.io/chrissteel.com/`)
  against all five top-level pages, zero critical or serious violations
- Lighthouse accessibility audit score ≥ 95 on all pages
- HTML validation via Nu Html Checker on all pages

### Manual

- Keyboard-only navigation of all new components in Chrome, Firefox, and Safari
- Screen reader testing: VoiceOver (macOS/iOS), NVDA (Windows)
- Colour contrast verification of all three themes using browser DevTools
  colour picker or Colour Contrast Analyser
- `prefers-reduced-motion` verified: toggle OS setting, confirm no transitions
  fire
- `prefers-color-scheme` and `prefers-contrast` verified: toggle OS settings,
  confirm correct default theme is applied without stored preference

### Regression

- Existing page content renders correctly in all three themes
- Skip link functional in all themes
- No horizontal overflow introduced at any viewport width

---

## Sequencing and dependencies

```
Phase 1 (tokens + footer)
  └── Phase 2 (header CSS + scroll)
        ├── Phase 3 (theme selector)
        └── Phase 4 (burger menu)
              └── Phase 5 (search)
```

Phases 3 and 4 are independent of each other but both depend on Phase 2.
Phase 5 depends on Phase 4 (search input lives in the header, which is
fully structured after Phase 4). Each phase is deployable independently
without breaking the live site.

---

## References

CloudCannon. (2022). *Pagefind documentation*. https://pagefind.app/docs/

Donath, M. (2016). *Material for MkDocs* (Version 9.x) [Software].
https://squidfunk.github.io/mkdocs-material/

Steel, C. (2026). *Hugo theme enhancement: Goals and design rationale*
(v0.1.0) [Internal document].

World Wide Web Consortium. (2023). *Web Content Accessibility Guidelines
(WCAG) 2.2*. https://www.w3.org/TR/WCAG22/
