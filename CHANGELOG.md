# Changelog — hugo-website-vishpala

All notable changes to this project are documented in this file.

This project informally follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) convention. Formal adoption is tracked in `ROADMAP.md`.

Versions correspond to the site package version, not the Hugo site version in `VERSION`.

## [Unreleased]

## [0.1.20] — 2026-06-28

### Added
- `netlify.toml` — Netlify build configuration; pins Hugo to v0.162.0 and Python to 3.11; build command is `python scripts/build.py`; publish directory is `site`
- `requirements.txt` — Python dependency declaration for Netlify; declares `pyyaml` as the only non-standard-library dependency
- `docs/en-ca/netlify-deployment-v0.1.0.md` — step-by-step Netlify deployment guide covering project preparation, Netlify connection, ongoing workflow, custom domain setup, and troubleshooting

### Changed
- `hugo.toml` — `baseURL` reverted to `https://vishpala.com/`; Netlify handles URL assignment independently and overrides this value for preview deployments
- `.gitignore` — `site/` remains untracked; Netlify builds from source on every push so built output does not need to be committed

## [0.1.19] — 2026-06-28

### Changed
- `hugo.toml` — `baseURL` updated from `https://vishpala.com/` to `https://steelcj.github.io/hugo-website-vishpala.com/` for GitHub Pages demo deployment

### Notes
- After extracting this zip, run `python scripts/build.py` to build the site into `site/`, then commit `site/` and push; in GitHub repo settings set Pages to serve from the `site/` folder on `main`
- Revert `baseURL` to `https://vishpala.com/` when deploying to production

## [0.1.18] — 2026-06-28

### Changed
- `.gitignore` — `site/` and `site/pagefind/` entries removed; built output is now committed to the repository for GitHub Pages deployment; comment added explaining the intentional tracking of `site/`

## [0.1.17] — 2026-06-28

### Added
- `docs/en-ca/vishpala-demo-assessment-v0.1.0.md` — demo readiness assessment for accelerator application; covers what the site does well, how it maps to the Universal Cake framework, and what still needs to be done; written for a non-technical but accessibility-aware audience in web-ready unrendered markdown with APA 7 references

## [0.1.16] — 2026-06-28

### Fixed
- `assets/css/main.css` — all three header control buttons (globe, `Aa`, search) now share a single sizing rule: `height: 2rem; padding: 0 6px; display: flex; align-items: center; justify-content: center; box-sizing: border-box`; previously each button had its own padding-based height which varied with font metrics and icon size; a shared explicit `height` guarantees all three are always identical regardless of active font, viewport, or operating system

## [0.1.15] — 2026-06-28

### Fixed
- `assets/css/main.css` — font switcher panel buttons changed from `min-height` with block display to `height: 2.75rem` with `display: flex; align-items: center`; panel height was still shrinking when switching to system font because Atkinson Hyperlegible's taller ascenders cause the browser to allocate more height per line regardless of `min-height` on a block element; fixed `height` with flex alignment removes the dependency on line-height entirely

### Changed
- `content/en-ca/resources/system-fonts/index.md` — rewritten to v1.1.0; title updated; content now accurately describes the current implementation: system-ui as default, Atkinson Hyperlegible as a self-hosted user-selectable option, font switcher explained
- `content/fr-ca/resources/polices-systeme/index.md` — same update in French
- `content/es/resources/fuentes-sistema/index.md` — same update in Spanish

## [0.1.14] — 2026-06-28

### Fixed
- `assets/css/main.css` — font switcher panel buttons given `min-height: 2.5rem`; panel height was shorter when system font was active because Atkinson Hyperlegible has a larger line height than system-ui, making each button taller; fixed `min-height` ensures both options are always the same height regardless of active font

## [0.1.13] — 2026-06-28

### Fixed
- `assets/css/main.css` — font switcher panel given a fixed `width: 200px` instead of `min-width: 160px`; panel was shrinking when switching from Atkinson Hyperlegible to System font because the panel width was driven by the text content of the active option; fixed width ensures the panel is always the same size regardless of which font is selected or active; `box-sizing: border-box` added to panel buttons to ensure padding is included in the fixed width calculation

## [0.1.12] — 2026-06-28

### Fixed
- `assets/css/main.css` — `.lang-switcher` CSS block was missing its opening rule (`position: relative; display: flex; align-items: center`) due to a bad str_replace in v0.1.11; hover panel was not positioning correctly; now restored
- Font toggle redesigned as a `.font-switcher` panel matching the lang-switcher pattern — hover/focus reveals a panel listing available fonts by name, each rendered in its own typeface; "System font" in the UI language, "Atkinson Hyperlegible" always in Atkinson; `aria-pressed` on each option reflects the active choice; `aria-expanded` on the trigger maintained by JS on hover and focus events

## [0.1.11] — 2026-06-28

### Added
- Atkinson Hyperlegible font — self-hosted, no external dependencies, SIL OFL 1.1 licence; eight woff2 files in `static/fonts/` covering regular, italic, bold, and bold-italic in latin and latin-extended ranges; designed by the Braille Institute for low-vision readers
- Font toggle button (`Aa`) in site header alongside globe and search; activates Atkinson Hyperlegible via `[data-font="atkinson"]` on `<html>`; preference persisted in `localStorage`; `aria-pressed` state maintained for screen readers; button label translated in all three languages
- Early `<script>` in `<head>` reads `localStorage` and sets `data-font` before render — prevents flash of system font on page load for users with the preference saved

### Changed
- `assets/css/main.css` — `@font-face` declarations added for Atkinson Hyperlegible; `.font-toggle` button styles added; `[data-font="atkinson"]` overrides `font-family` on `body` and form elements; toggle button renders in Atkinson when active, self-demonstrating the font choice

## [0.1.10] — 2026-06-28

### Fixed
- `layouts/_default/list.html` — section hero block class now derived from `.Section` (the content directory name, always in English: `about`, `areas`, `resources`, `projects`) instead of `.Title | urlize`; the previous approach was unreliable for non-ASCII titles — Hugo's `urlize` on `"À propos"` did not produce `a-propos` consistently, causing the French About and all Spanish section hero blocks to fall through to the default `block-projects` class and render red instead of their correct colours

## [0.1.9] — 2026-06-28

### Fixed
- `hugo.toml` — home menu entries for all three languages changed from `url = "/"` to `pageRef = "/"` so Hugo resolves the home link to the correct language root rather than the site root; with `defaultContentLanguageInSubdir = true` a hardcoded `url = "/"` always resolves to the default language home regardless of which language the user is currently in
- `site/` — stale built output removed from project; was causing apparent colour discrepancies in French and Spanish homepages that were not present in the source; run `python scripts/build.py` followed by `hugo server` to rebuild

## [0.1.8] — 2026-06-28

### Added
- Full Spanish (`es`) content translation — 20 files across all five sections

  `content/es/_index.md` — homepage

  `content/es/about/` — `_index.md`, `acerca-de/`, `accesibilidad/`, `legal/`, `privacidad/`, `sostenibilidad/`

  `content/es/areas/` — `_index.md`, `accesibilidad/`, `diseno/`, `infraestructura/`

  `content/es/projects/` — `_index.md`, `pila-soberana/`, `sistema-diseno-agencia/`

  `content/es/resources/` — `_index.md`, `lista-verificacion-accesibilidad/`, `introduccion-design-tokens/`, `guia-auditoria-infraestructura/`, `marco-decision-autoalojamiento/`, `fuentes-sistema/`

### Notes
- "design token" left untranslated throughout — consistent with Spanish-language technical writing convention
- VPAT, WCAG, PIPEDA, CC BY-SA, MIT Licence left in original form as standards identifiers and proper names
- "We work in English and French" in `acerca-de/index.md` left as-is — reflects actual studio operating languages; update when Spanish operations are formally established

## [0.1.7] — 2026-06-28

### Added
- `scripts/build.yaml` — YAML pipeline definition; all build steps declared explicitly in order; `deploy` stage stubbed pending definition
- `docs/en-ca/site-deploy-pipeline-v0.1.0.md` — full pipeline documentation with Mermaid diagram linking to section anchors; stub sections for deploy, verify, notify, and production

### Changed
- `scripts/build.py` — rewritten as a thin YAML executor; reads `scripts/build.yaml`; no hardcoded steps; accepts optional stage argument (`python scripts/build.py [stage]`); requires PyYAML
- `scripts/build.sh` — removed; all steps now declared in `scripts/build.yaml`
- `README.md` — build command description updated to reference `build.yaml`; project structure updated
- `ROADMAP.md` — deploy, verify, notify, and PyYAML dependency added as planned items

### Fixed
- Build step order corrected: `hugo --minify` now runs before `pagefind --site site`

## [0.1.6] — 2026-06-28

### Added
- Globe language switcher — accessible hover + focus-within panel listing available translations; each link labelled in its own language and script with correct `lang` and `hreflang` attributes
- `hugo.toml` — `shortLabel` param added to all three language blocks (`English`, `Français`, `Español`)

### Changed
- `layouts/_default/baseof.html` — `lang-switch` links replaced with `.lang-switcher` globe button and panel; JS updated to manage `aria-expanded` on hover and focus events
- `assets/css/main.css` — `.lang-switch` styles replaced with `.lang-switcher` component styles
- `i18n/en-ca.toml`, `i18n/fr-ca.toml`, `i18n/es.toml` — `language_toggle` key removed; no longer needed
- `docs/en-ca/adding-a-language-translation-v0.1.2.md` — i18n example updated to remove `language_toggle`; `hugo.toml` language block example updated to include `shortLabel`

### Removed
- `language_toggle` i18n key from all language files — superseded by the globe switcher which uses `shortLabel` from `hugo.toml` directly

## [0.1.5] — 2026-06-28

### Added
- Spanish (`es`) language support
- `i18n/es.toml` — Spanish i18n strings
- `content/es/` — Spanish content directory (empty; ready for translation)
- `hugo.toml` — `[languages.es]` block, `[params.description_es]`, `[params.sectionDescriptions_es]`, `[[menus.main_es]]` entries
- `layouts/_default/baseof.html` — Spanish conditions added to menu selection, nav aria-label, search aria-label, search label, search placeholder, and close button aria-label
- `layouts/_default/list.html` — Spanish empty-section fallback message added

### Notes
- `language_toggle` in `i18n/es.toml` is set to `"English"` as a placeholder; the multi-language switcher design is tracked in `ROADMAP.md`

## [0.1.4] — 2026-06-28

### Changed
- `CHANGELOG.md` — updated from author review; version bumped to 0.1.4
- `VERSION` — bumped to 0.1.4

## [0.1.3] — 2026-06-28

### Added
- `CHANGELOG.md` — this file
- `ROADMAP.md` — project-level forward-looking items and radar
- `scripts/build.py` — cross-platform Python build script replacing `scripts/build.sh`
- `docs/en-ca/` — language-rooted documentation directory structure; all existing docs migrated from `docs/`

### Changed
- `scripts/build.sh` — removed in favour of `scripts/build.py`; `npx` fallback dropped as inconsistent with project dependency philosophy; `pagefind` on PATH is now required with a clear error on failure
- `docs/` — flat structure replaced by `docs/<language-root>/` to support translated project documentation
- `README.md` — updated build command references from `build.sh` to `build.py`

### Policy
- Cross-platform scripting: Python is the default scripting language for this project. Shell scripts are not used for build or automation tasks. See `ROADMAP.md` for planned migration of any remaining shell scripts.

## [0.1.2] — 2026-06-28

### Added
- `docs/en-ca/adding-a-language-translation-v0.1.2.md` — language translation guide; heading numbering removed; i18n TOML format corrected to Hugo `[key] / other` convention

### Changed
- `i18n/en-ca.toml`, `i18n/fr-ca.toml` — rewritten to correct Hugo i18n TOML format (`[key] / other = "value"`)
- `assets/css/main.css` — `letter-spacing: 0.05em` added to `.menu-toggle` to match `.lang-switch`

## [0.1.1] — 2026-06-28

### Added
- `docs/adding-a-language-translation-v0.1.1.md` — initial language translation guide (superseded by v0.1.2)
- `i18n/en-ca.toml`, `i18n/fr-ca.toml` — `menu` key added to both files

### Changed
- `layouts/_default/baseof.html` — burger menu button added; `id="site-nav"` added to nav; toggle script added before `</body>`
- `assets/css/main.css` — `.menu-toggle` styles added; `600px` breakpoint updated to show/hide nav via `[data-open]`
