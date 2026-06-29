# Adding a Language Translation — Vishpala.com

Version: 0.1.2
Status: Draft
Style Guides: style-guide--technical-documentation-for-technologists-v0.2.0.md, web-ready-unrendered-markdown-using-apa-7-v0_2_2.md

## Abstract

This document describes how to add a new language to vishpala.com. The site uses Hugo as its static site generator and is currently available in Canadian English (`en-ca`) and Canadian French (`fr-ca`). Adding a language is a two-part process: first, configuring the site to recognise and serve the language; second, translating the content. These two parts are independent — a language can be declared and partially translated, and the site will serve whatever content exists. This document covers both parts, beginning with the site configuration required by a contributor comfortable editing code and configuration files, followed by the content translation work, which any contributor can do independently once the site configuration is in place.

## Sources and Acknowledgements

The Hugo multilingual configuration described in this document follows the <a name="apa-hugo-multilingual-citation"></a>[Hugo documentation on multilingual mode (The Hugo Authors, 2025)](#apa-hugo-multilingual-reference). Language tag conventions follow the <a name="apa-bcp47-citation"></a>[IETF BCP 47 standard (Phillips & Davis, 2009)](#apa-bcp47-reference), which defines the language tags used as content directory names and Hugo language keys throughout this project.

## Language identification convention

Every language on this site is identified by a BCP 47 language tag. This tag is used in three places: as the name of the content directory under `content/`, as the language key in `hugo.toml`, and as the URL path prefix for that language on the live site. The tag may be a base language (`en`, `fr`, `es`), a language with a region (`en-ca`, `fr-ca`, `en-gb`), or a language with a region and script where needed. The presence of a content directory with a recognised BCP 47 tag signals intent to add that language. No other mechanism is needed to declare that a new language is being worked on — create the directory, and the work can begin.

The currently active language tags are:

- `en-ca` — Canadian English (default language)
- `fr-ca` — Canadian French

Examples of tags that would be valid additions:

- `en-gb` — British English
- `es` — Spanish
- `fr` — French (France)
- `pt-br` — Brazilian Portuguese

## Part one — site configuration

Site configuration is the prerequisite for a new language to be served. It requires editing three files: `hugo.toml`, `i18n/<tag>.toml`, and `layouts/_default/baseof.html`. A contributor adding a language should complete all steps in this section before translating any content.

### Add the language to hugo.toml

`hugo.toml` is the central configuration file for the site. It declares every language Hugo is expected to serve. To add a language, add a `[languages.<tag>]` block and a corresponding `[[menus.main_<tag>]]` menu.

In this example we are going to add support for Español.

```bash
nano hugo.toml
```

#### `[params]` section

Add the localised site description to the `[params]` section of `hugo.toml`. The existing pattern uses a `_<tag>` suffix with underscores replacing hyphens. The full `[params]` block after adding Spanish looks like this:

```toml
[params]
  description    = "Technology, design, and infrastructure for greater agency."
  description_fr = "Technologie, design et infrastructure pour une plus grande agentivité."
  description_es = "Tecnología, diseño e infraestructura para una mayor agencia."
```

Similarly, if section descriptions are used, add a `[params.sectionDescriptions_es]` block following the pattern of `[params.sectionDescriptions_fr]`.

#### `[languages]` section

The language block goes in the `[languages]` section. Using Spanish (`es`) as an example:

```toml
[languages.es]
  locale     = 'es'
  label      = 'Español'
  contentDir = 'content/es'
  weight     = 3
  [languages.es.params]
    shortLabel = 'Español'
```

The `weight` controls the order in which languages appear in navigation. Assign the next available integer after the existing languages. The `contentDir` value must match the content directory name exactly, including capitalisation (use lowercase throughout).

The `label` is the human-readable name of the language as it appears to users. Use the language's own name for itself — "Español" not "Spanish", "Français" not "French".

#### `[[menus.main_es]]` section

Each language has its own navigation menu declared as `[[menus.main_<tag>]]` entries. The menu key for a language with tag `es` is `main_es`. Add one entry per navigation item, in weight order:

```toml
[[menus.main_es]]
  name   = "Inicio"
  url    = "/"
  weight = 1

[[menus.main_es]]
  name    = "Proyectos"
  pageRef = "/projects"
  weight  = 2

[[menus.main_es]]
  name    = "Áreas"
  pageRef = "/areas"
  weight  = 3

[[menus.main_es]]
  name    = "Recursos"
  pageRef = "/resources"
  weight  = 4

[[menus.main_es]]
  name    = "Acerca de"
  pageRef = "/about"
  weight  = 5
```

The `pageRef` values point to the content sections and do not change between languages — Hugo resolves them against the correct language content directory automatically. Only the `name` values are translated.

### Wire the menu into the header template

The site header in `layouts/_default/baseof.html` selects the correct menu based on the current language. The relevant block currently reads:

```html
{{ $menu := "main" }}
{{ if eq .Site.Language.Lang "fr-ca" }}{{ $menu = "main_fr" }}{{ end }}
```

Add a condition for the new language:

```html
{{ $menu := "main" }}
{{ if eq .Site.Language.Lang "fr-ca" }}{{ $menu = "main_fr" }}{{ end }}
{{ if eq .Site.Language.Lang "es" }}{{ $menu = "main_es" }}{{ end }}
```

The same file also contains two `aria-label` attributes and one search placeholder that are currently hard-coded with `fr-ca` conditions. Add the new language to each. For example, the nav `aria-label`:

```html
aria-label="{{ if eq .Site.Language.Lang `fr-ca` }}Navigation principale{{ else if eq .Site.Language.Lang `es` }}Navegación principal{{ else }}Main navigation{{ end }}"
```

Apply the same pattern to the search `aria-label`, the search `placeholder`, and the close button `aria-label` in the same file.

The `list.html` template also contains a hard-coded fallback message for empty sections:

```html
{{ if eq .Site.Language.Lang "fr-ca" }}Aucune entrée pour l'instant.{{ else }}No entries yet.{{ end }}
```

Add the new language:

```html
{{ if eq .Site.Language.Lang "fr-ca" }}Aucune entrée pour l'instant.{{ else if eq .Site.Language.Lang "es" }}Ninguna entrada por el momento.{{ else }}No entries yet.{{ end }}
```

### Create the i18n strings file

The `i18n/` directory contains one TOML file per language. Hugo loads the file matching the current language and uses its strings wherever `{{ i18n "key" }}` appears in the templates. Create `i18n/es.toml` with all required keys:

```toml
[all_projects]
other = "Todos los proyectos"

[all_areas]
other = "Todas las áreas"

[all_resources]
other = "Todos los recursos"

[read_more]
other = "Leer más"

[back_to]
other = "Volver a"

[skip_to_content]
other = "Ir al contenido principal"

[copyright]
other = "Todos los derechos reservados."

[license]
other = "CC BY-SA 4.0"

[menu]
other = "menú"
```

### Create the content directory

Create the directory `content/<tag>/`. For Spanish:

```bash
mkdir -p content/es
```

The directory may be empty at this point. Hugo will serve the language with no pages until content is added. The site will still build and the language will appear in navigation if any pages exist in the other languages — Hugo handles missing translations gracefully by falling back to the default language or omitting the page from the language's navigation, depending on configuration.

## Part two — translating content

Content translation does not require any code or configuration changes. It requires creating markdown files in the new language's content directory, following the same directory structure as the default language. A translator does not need to understand Hugo beyond the conventions described in this section.

### Content directory structure

The content directory for each language mirrors the same section structure:

```text
content/
  en-ca/
    _index.md
    projects/
      _index.md
      sovereign-stack/
        index.md
    areas/
    resources/
    about/
  fr-ca/
    (same structure)
  es/
    (same structure, to be created)
```

Each page in the default language (`en-ca`) has a corresponding file at the same relative path in each translation. A file at `content/en-ca/projects/sovereign-stack/index.md` is translated by creating `content/es/projects/sovereign-stack/index.md`. The directory name (`sovereign-stack`) does not change between languages — only the content of the file changes.

### Frontmatter

Every content file begins with a frontmatter block delimited by `---`. The frontmatter for a translated page should preserve the same structure as the original, with the `title` and `description` fields translated. Other fields (`date`, `params`, `weight`) should be carried over unchanged. A minimal example:

```markdown
---
title: "Pila soberana"
description: "Infraestructura diseñada para durar, libre de dependencias propietarias."
---
```

Do not translate the frontmatter keys themselves (`title`, `description`, `date`) — only their values.

### Section index files

Each section directory contains an `_index.md` file that provides the section title and description shown on the section listing page. This file must be translated for each section. The `_index.md` at the root of a language directory (`content/es/_index.md`) provides the homepage content.

### Homepage content

The homepage (`content/<tag>/_index.md`) typically contains inline HTML blocks that make up the homepage grid. These blocks must be translated in full. Copy the default language homepage file and translate all visible text within it, leaving the HTML structure, class names, and Hugo shortcodes unchanged.

### What does not require translation

The following do not require translation and should be left as-is in translated content files: HTML element names and attributes, Hugo template syntax (`{{ }}`), image paths, URLs, and frontmatter keys. Only human-readable text values require translation.

## Resources

### Hugo documentation
- [Hugo multilingual mode](#apa-hugo-multilingual-reference)

### Language standards
- [IETF BCP 47](#apa-bcp47-reference)

## References

<a name="apa-hugo-multilingual-reference"></a>The Hugo Authors. (2025). *Multilingual mode*. Hugo. https://gohugo.io/content-management/multilingual/
[Return to citation](#apa-hugo-multilingual-citation)

<a name="apa-bcp47-reference"></a>Phillips, A., & Davis, M. (Eds.). (2009). *Tags for identifying languages* (BCP 47). IETF. https://www.rfc-editor.org/rfc/bcp/bcp47.txt
[Return to citation](#apa-bcp47-citation)

## Changelog

| Version | Status | Notes |
|---------|--------|-------|
| 0.1.2 | Draft | Removed heading numbering; corrected i18n TOML format to Hugo `[key] / other` convention; fixed broken TOML closing quote in params example |
| 0.1.1 | Draft | Manually reorganised; added `nano` example; expanded params section |
| 0.1.0 | Draft | Initial draft — manual process only; automation deferred to a later iteration |
