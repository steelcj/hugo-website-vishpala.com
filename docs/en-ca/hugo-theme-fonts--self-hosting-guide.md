---
title: "Hugo Theme Fonts: Self-Hosting Guide"
slug: hugo-theme-fonts--self-hosting-guide
version: 0.1.0
status: draft
date: 2026-06-13
author: Christopher Steel
dc:creator: Christopher Steel
dc:subject: Hugo, typography, self-hosting, OFL, variable fonts
dc:description: >
  Instructions for downloading, placing, and declaring the three typefaces
  used in the chrissteel.com Hugo theme — Playfair Display, Source Serif 4,
  and Inter — as self-hosted variable fonts under SIL OFL 1.1.
dc:language: en-CA
dc:rights: CC BY-SA 4.0
---

# Hugo Theme Fonts: Self-Hosting Guide

## Licence summary

All three typefaces are released under the SIL Open Font Licence, Version 1.1
(OFL-1.1). Self-hosting, redistribution, and embedding in a website are
explicitly permitted. Selling the font files alone is not permitted. No
attribution is required in rendered output, though it is good practice to
retain the licence files alongside the font files in the repository.

| Typeface | Designer | Maintainer | Licence |
| --- | --- | --- | --- |
| Playfair Display | Claus Eggers Sørensen | Google Fonts | OFL-1.1 |
| Source Serif 4 | Frank Grießhammer | Adobe / Google Fonts | OFL-1.1 |
| Inter | Rasmus Andersson | rsms | OFL-1.1 |

## Why variable fonts

Each typeface is available as a variable font (`.woff2`). A variable font
encodes the full weight axis in a single file rather than a separate file per
weight. For this stack:

- Playfair Display variable: weights 300–900 (roman and italic) — 2 files
- Source Serif 4 variable: weights 200–900 (roman and italic) — 2 files
- Inter variable: weights 100–900 — 1 file

Total: 5 files instead of the 20+ static files that covering the same range
would require. Woff2 variable fonts are supported by all major browsers since
2020.

## Typographic role mapping

| Role | Typeface | Weights used |
| --- | --- | --- |
| Display headings (h1, h2) | Playfair Display | 600, 700 |
| Body prose, long-form content | Source Serif 4 | 400, 400i |
| UI chrome (nav, labels, meta, footer) | Inter | 400, 500, 600 |

## Download instructions

### Option A — Google Fonts download (recommended)

Google Fonts provides a direct download of the variable font files.

**Playfair Display**

1. Visit `https://fonts.google.com/specimen/Playfair+Display`
2. Click **Get font** → **Download all**
3. Unzip the archive
4. Locate `PlayfairDisplay-VariableFont_wght.ttf` and
   `PlayfairDisplay-Italic-VariableFont_wght.ttf`
5. Convert to woff2 (see below)

**Source Serif 4**

1. Visit `https://fonts.google.com/specimen/Source+Serif+4`
2. Click **Get font** → **Download all**
3. Unzip the archive
4. Locate `SourceSerif4-VariableFont_opsz,wght.ttf` and
   `SourceSerif4-Italic-VariableFont_opsz,wght.ttf`
5. Convert to woff2 (see below)

**Inter**

1. Visit `https://fonts.google.com/specimen/Inter`
2. Click **Get font** → **Download all**
3. Unzip the archive
4. Locate `Inter-VariableFont_opsz,wght.ttf`
5. Convert to woff2 (see below)

### Option B — Upstream GitHub releases (canonical source)

Fetching from the upstream repositories avoids any intermediary and gives
access to the canonical release files.

```bash
# Playfair Display (upstream)
# https://github.com/clauseggers/Playfair-Display/releases

# Source Serif 4 (upstream)
# https://github.com/adobe-fonts/source-serif/releases

# Inter (upstream)
# https://github.com/rsms/inter/releases
```

Download the latest release `.zip` from each repository and extract the
variable font `.ttf` files as above.

### Converting TTF to WOFF2

Google Fonts archives contain TTF files. Convert to woff2 for web use.
The `woff2_compress` tool from the `woff2` package handles this:

```bash
# Ubuntu / Debian
sudo apt install woff2

# Convert each file
woff2_compress PlayfairDisplay-VariableFont_wght.ttf
woff2_compress PlayfairDisplay-Italic-VariableFont_wght.ttf
woff2_compress SourceSerif4-VariableFont_opsz,wght.ttf
woff2_compress SourceSerif4-Italic-VariableFont_opsz,wght.ttf
woff2_compress Inter-VariableFont_opsz,wght.ttf
```

Each command produces a `.woff2` file alongside the source `.ttf`.

Note: the `opsz` axis in Source Serif 4 encodes optical sizes. The woff2
variable font retains this axis, allowing the CSS `font-optical-sizing: auto`
property to use it automatically.

## Repository placement

Place font files and licence copies in `static/fonts/` within the Hugo
repository. Hugo copies everything in `static/` to the root of the built
site verbatim.

```
static/
  fonts/
    playfair-display/
      PlayfairDisplay-VariableFont_wght.woff2
      PlayfairDisplay-Italic-VariableFont_wght.woff2
      OFL.txt
    source-serif-4/
      SourceSerif4-VariableFont_opsz,wght.woff2
      SourceSerif4-Italic-VariableFont_opsz,wght.woff2
      OFL.txt
    inter/
      Inter-VariableFont_opsz,wght.woff2
      OFL.txt
```

The `OFL.txt` file is included in each upstream release archive. Copy it
alongside the font files. This is not strictly required by the licence for
web embedding but is good practice and keeps the repository self-documenting.

## @font-face declarations

Add the following to `assets/css/tokens.css` before the `:root` block. The
`font-display: swap` descriptor ensures body text renders in a system fallback
immediately, replacing it with the custom font once loaded — avoiding invisible
text during load (FOIT).

```css
/* ============================================================
   Font face declarations — self-hosted variable fonts
   All three typefaces: SIL OFL 1.1
   ============================================================ */

@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/playfair-display/PlayfairDisplay-VariableFont_wght.woff2')
       format('woff2-variations');
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/playfair-display/PlayfairDisplay-Italic-VariableFont_wght.woff2')
       format('woff2-variations');
  font-weight: 300 900;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Source Serif 4';
  src: url('/fonts/source-serif-4/SourceSerif4-VariableFont_opsz,wght.woff2')
       format('woff2-variations');
  font-weight: 200 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Source Serif 4';
  src: url('/fonts/source-serif-4/SourceSerif4-Italic-VariableFont_opsz,wght.woff2')
       format('woff2-variations');
  font-weight: 200 900;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter/Inter-VariableFont_opsz,wght.woff2')
       format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

## Token declarations

Add the following font tokens to the `:root` block in `assets/css/tokens.css`.
Component CSS references these tokens rather than font family names directly,
so a future typeface swap requires only token changes.

```css
:root {
  /* Typography tokens */
  --font-display:  'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-prose:    'Source Serif 4', Georgia, 'Times New Roman', serif;
  --font-ui:       'Inter', system-ui, -apple-system, sans-serif;

  /* Type scale (base 1rem = 16px) */
  --type-xs:   0.75rem;   /*  12px — labels, meta */
  --type-sm:   0.875rem;  /*  14px — footer, captions */
  --type-base: 1rem;      /*  16px — body default */
  --type-md:   1.125rem;  /*  18px — lead prose */
  --type-lg:   1.25rem;   /*  20px — small headings */
  --type-xl:   1.5rem;    /*  24px — h3 */
  --type-2xl:  2rem;      /*  32px — h2 */
  --type-3xl:  2.5rem;    /*  40px — h1 */

  /* Line height */
  --leading-tight:  1.2;
  --leading-snug:   1.4;
  --leading-base:   1.6;
  --leading-relaxed: 1.75;

  /* Font optical sizing */
  font-optical-sizing: auto;
}
```

## Usage in component CSS

```css
/* Navigation and UI chrome */
.site-header,
nav,
footer,
.theme-selector,
.search-input {
  font-family: var(--font-ui);
  font-size: var(--type-sm);
  font-weight: 500;
}

/* Page headings */
h1, h2 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: var(--leading-tight);
}

/* Body prose */
main p,
main li,
main blockquote {
  font-family: var(--font-prose);
  font-size: var(--type-md);
  line-height: var(--leading-relaxed);
}
```

## Preload hints

Add `<link rel="preload">` hints for the fonts most likely to be needed on
first paint. Inter (UI font) and Source Serif 4 regular (body) are highest
priority. Add to `layouts/partials/head.html`:

```html
<link rel="preload"
      href="/fonts/inter/Inter-VariableFont_opsz,wght.woff2"
      as="font" type="font/woff2" crossorigin>
<link rel="preload"
      href="/fonts/source-serif-4/SourceSerif4-VariableFont_opsz,wght.woff2"
      as="font" type="font/woff2" crossorigin>
```

Playfair Display is used only for headings, which are not critical to initial
text render, so it is not preloaded. Preloading all three fonts would increase
the number of high-priority requests and delay other critical resources.

## Fallback stack rationale

Each `font-family` declaration includes a fallback stack that approximates
the custom font's character until it loads:

- `Georgia` — the closest system serif to both Playfair Display and
  Source Serif 4 in terms of x-height and weight
- `'Times New Roman'` — universal system serif fallback
- `system-ui` / `-apple-system` — OS default sans-serif for Inter fallback

The `font-display: swap` descriptor means the fallback renders immediately and
is replaced once the woff2 file is available, with a brief layout shift.
`font-display: optional` is an alternative that suppresses the shift by only
using the custom font if it loads within a short threshold — appropriate if
layout stability is prioritised over guaranteed custom font rendering.

## .gitignore note

Font binary files should be committed to the repository, not ignored. They are
static assets that must be present for the build to succeed and are not
regenerated by the build process. Do not add `*.woff2` or `static/fonts/` to
`.gitignore`.

## References

Andersson, R. (2017). *Inter* (Version 4.1) [Typeface]. SIL OFL 1.1.
https://rsms.me/inter/

Grießhammer, F. (2021). *Source Serif 4* (Version 4.004) [Typeface].
Adobe Systems. SIL OFL 1.1.
https://github.com/adobe-fonts/source-serif

SIL International. (2010). *SIL Open Font Licence, Version 1.1*.
https://openfontlicense.org

Sørensen, C. E. (2017). *Playfair Display* (Version 40) [Typeface].
SIL OFL 1.1. https://github.com/clauseggers/Playfair-Display
