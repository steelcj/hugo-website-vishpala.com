# Vishpala.com — Demo Readiness Assessment

Version: 0.1.0
Status: Draft

## Abstract

This document describes what vishpala.com does well right now, where it stands in relation to the Universal Cake framework, and what remains to be done before it can be considered a complete public product. It is written for an accelerator audience that understands inclusive design and accessible technology, but not necessarily the technical details of how websites are built. The assessment is honest — the site is a strong, principled prototype with real gaps, and both deserve to be named clearly.

## Sources and Acknowledgements

The Universal Cake framework referenced throughout this document is the work of <a name="apa-uc-citation"></a>[Steel (1999–2026)](#apa-uc-reference). Accessibility standards referenced are those of the <a name="apa-wcag-citation"></a>[Web Content Accessibility Guidelines 2.2 (W3C, 2023)](#apa-wcag-reference). The Atkinson Hyperlegible typeface used as the site's accessible font option was designed by the <a name="apa-braille-citation"></a>[Braille Institute (2021)](#apa-braille-reference) specifically for readers with low vision. The inclusive design principles that inform the site's approach are those of the <a name="apa-idrc-citation"></a>[Inclusive Design Research Centre, OCAD University (Treviranus, 2020)](#apa-idrc-reference).

## What the site does well right now

### It works in three languages simultaneously

The site operates in Canadian English, Canadian French, and Spanish. Every page — content, navigation, section headings, search, accessibility labels, and interface controls — is available in all three languages. Switching languages does not reload the page from scratch; it takes you to the equivalent page in the language you choose. The language switcher is a globe icon that appears consistently in the header regardless of screen size. Each language is labelled in its own name and script, so a Spanish-speaking visitor who cannot read English or French can still find and use the switcher. This is not a translation layer applied to an English site — it is a genuinely multilingual architecture where each language is a first-class participant.

### Search works within the language you are using

The site includes full-text search that operates within the currently selected language. A visitor reading in French who searches for a term will receive results from the French content only, not a mixture of all three languages. Search results appear instantly as you type, without loading a new page or connecting to an external search service. The search index is built locally and served from the site's own infrastructure, with no dependency on Google, Algolia, or any other third-party search provider.

### Typography respects the visitor's needs

The site offers two typeface options, accessible from a clearly labelled button in the header. The default is the device's own system font — whatever the operating system provides — which means it honours any font preferences the visitor has set at the system level. The alternative is Atkinson Hyperlegible, a typeface designed specifically for people with low vision, in which each letter is drawn to be as distinct from every other letter as possible. Both options are stored so the site remembers your choice on future visits. Atkinson Hyperlegible is served entirely from the site's own infrastructure — no connection to a font delivery network is made.

### No tracking, no surveillance, no third-party dependencies

The site makes no connection to any third-party service during a normal visit. There are no analytics scripts, no advertising trackers, no social media widgets, no external font loaders, and no content delivery networks operated by other companies. A visitor's behaviour on the site is not observed by anyone other than the site operator. This is a deliberate architectural choice grounded in the privacy principles documented on the site itself.

### The keyboard works

Every function on the site — navigation, language switching, font switching, search, closing the search panel — is fully operable using a keyboard alone. Focus indicators are visible throughout. The language and font switcher panels open on focus as well as on hover, so keyboard users and screen reader users have the same access as mouse users. A skip link at the top of every page allows keyboard users to bypass the header and go directly to the main content.

### The site is honest about what it is

The About, Privacy, Accessibility, Legal, and Sustainability sections document the studio's commitments and the current state of the site clearly and without marketing language. The accessibility statement identifies the testing that has been done and the known state of conformance. The privacy policy explains what data is and is not collected in plain terms. The sustainability commitment acknowledges what has not yet been measured. This transparency is itself an accessibility practice — it treats visitors as people who deserve accurate information rather than optimistic copy.

### The infrastructure is documented and reproducible

Every step required to build and deploy the site is declared in a human-readable configuration file (`scripts/build.yaml`) that anyone can read without knowing how to program. The build process is automated and cross-platform. The project maintains a versioned changelog and a roadmap. The documentation is in the same repository as the code and is versioned alongside it.

## What the Universal Cake framework says about it

The site as it stands addresses the following Universal Cake pillars meaningfully:

**Accessibility** — the site is designed to WCAG 2.2 Level AA as a minimum, with keyboard navigation, visible focus indicators, semantic HTML structure, appropriate colour contrast, and meaningful alternative text throughout. The font switcher adds a layer of user control over typography that goes beyond the standard requirement.

**Language** — three active languages with complete content is a strong foundation. Language is treated as the primary accessibility gate — the first thing a visitor needs before anything else on the site is useful to them.

**Sovereignty** — the site runs on infrastructure the operator controls directly. No essential function depends on a third-party service. Fonts, search, and content are all served from the operator's own infrastructure.

**Privacy** — no tracking, no third-party data collection, and a clear public statement of what is and is not collected.

**Sustainability** — the site is a static HTML site with no server-side processing on page load. It is fast, requires minimal server resources, and does not generate unnecessary network traffic. The sustainability commitment on the site acknowledges what has not yet been measured.

**Transparency** — the project is fully documented, versioned, and the documentation is accessible to non-technical readers.

## What still needs to be done

### The deploy pipeline is not yet defined

The build process compiles the site correctly, but the step that transfers it to a live server is documented as a placeholder. The site cannot be demonstrated at a public URL without completing this step. This is the most pressing practical gap.

### The site has not been tested with assistive technology users

The accessibility statement describes testing with VoiceOver and NVDA by the development team. It has not been tested with people who use assistive technology as their primary means of access. This is a meaningful gap — automated testing and developer testing catch roughly thirty percent of accessibility barriers. User testing with disabled participants is the only way to find the rest.

### The Spanish content has not been reviewed by a native speaker

The Spanish translations were produced with care but have not been reviewed by a fluent native speaker. For a demo this is acceptable with appropriate framing. For a public product it needs to be corrected.

### The language switcher shows only alternate languages, not the current one

This is a deliberate design decision — showing the current language in the switcher risks users clicking it unnecessarily. However, it means a visitor who arrives mid-site may not be immediately certain which language they are reading. A visible language indicator in the header would address this without adding a redundant link.

### Search is not yet indexed across page updates automatically

The search index must be rebuilt manually each time content changes. In a live publishing workflow, this should happen automatically as part of the deploy process. The infrastructure for this is designed but not yet implemented.

### The multi-language switcher has a placeholder for the language toggle label

When a third language (Spanish) was added, the single language toggle label used by the previous switcher design became redundant and was removed. The current globe-based switcher handles multiple languages correctly, but the i18n file previously used for this has been cleaned up. This is resolved, but worth noting for completeness.

### Content is a prototype

The projects, areas, and resources described on the site are illustrative. They represent the kind of work the studio does and the values it holds, but they are not drawn from completed client engagements. For a demo to an accelerator audience this is appropriate — the site demonstrates the infrastructure and the approach, not a live client portfolio.

## For the accelerator application

The site demonstrates that accessible, multilingual, privacy-respecting web infrastructure is achievable without large budgets, complex tooling, or dependency on major platform providers. It is a working proof of concept for the Universal Cake approach applied to a studio's own web presence. The gaps are real and should be named, not hidden — they are also the kinds of gaps that the accelerator support would help address.

## References

<a name="apa-uc-reference"></a>Steel, C. (1999–2026). *Universal Cake framework*. https://github.com/steelcj/universalcake-corpus
[Return to citation](#apa-uc-citation)

<a name="apa-wcag-reference"></a>W3C Web Accessibility Initiative. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. World Wide Web Consortium. https://www.w3.org/TR/WCAG22/
[Return to citation](#apa-wcag-citation)

<a name="apa-braille-reference"></a>Braille Institute. (2021). *Atkinson Hyperlegible font*. https://brailleinstitute.org/freefont
[Return to citation](#apa-braille-citation)

<a name="apa-idrc-reference"></a>Treviranus, J. (2020). *Inclusive design: The work to do*. Inclusive Design Research Centre, OCAD University. https://idrc.ocadu.ca/about/philosophy/
[Return to citation](#apa-idrc-citation)

## Changelog

| Version | Status | Notes |
|---------|--------|-------|
| 0.1.0 | Draft | Initial assessment for accelerator application demo readiness |
