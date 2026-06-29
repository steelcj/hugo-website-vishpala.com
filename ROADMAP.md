# Roadmap — hugo-website-vishpala

Forward-looking items, deferred decisions, and the project radar. Items move from this file to `CHANGELOG.md` when completed.

## Planned

### Define the deploy stage

`scripts/build.yaml` declares a `deploy` stage with no steps. The deploy step will transfer the built `site/` directory to the production server. The mechanism — rsync, scp, Caddy API, or other — is not yet decided. Once defined it should be added to `build.yaml` as a step under `stages.deploy`, following the same pattern as the build steps. The full pipeline is documented in `docs/en-ca/site-deploy-pipeline-v0.1.0.md`.

### Define the verify stage

After deploy, a smoke test should confirm the site is responding correctly at the production URL before the notify step runs. Not yet defined — add to `build.yaml` under a `verify` stage when ready.

### Define the notify stage

After a successful deploy and verify, contributors and editors should receive confirmation. The mechanism is not yet decided. Add to `build.yaml` under a `notify` stage when ready.

### PyYAML dependency

`scripts/build.py` requires PyYAML (`pip install pyyaml --break-system-packages`). This is the only Python dependency outside the standard library. Consider whether to vendor it, document it more prominently, or replace it with a stdlib alternative (`tomllib` with a TOML pipeline file, or a simple line-by-line YAML parser for the subset we use).

### Automate language detection from content directory

The current process for adding a language requires manual edits to `hugo.toml`, `layouts/_default/baseof.html`, and `layouts/_default/list.html`. The goal is a script that reads the `content/` directory, detects new language roots (BCP 47 directory names not yet declared in `hugo.toml`), and either updates configuration automatically or produces a checklist for a contributor to follow. Manual process is documented in `docs/en-ca/adding-a-language-translation-v0.1.2.md`.

### Generalise hard-coded language conditions in templates

`layouts/_default/baseof.html` and `layouts/_default/list.html` contain hard-coded `fr-ca` conditions for aria labels, search placeholder text, and empty-section fallback messages. Each new language requires manual additions to these conditions. These should be driven by i18n strings so that adding a language requires no template edits.

### Windows support for build script

`scripts/build.py` is written in Python and is cross-platform in principle, but has not been tested on Windows. Hugo and Pagefind binary availability on PATH should be verified on Windows and any platform-specific handling documented or added.

### Translate project documentation

`docs/en-ca/` contains all project documentation in Canadian English. A `docs/fr-ca/` directory should be created as translations are completed. The translation guide at `docs/en-ca/adding-a-language-translation-v0.1.2.md` applies to project documentation as well as site content.

## Radar

Items under consideration, not yet committed.

### Keep a Changelog (convention)

The project informally follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) for `CHANGELOG.md`. Formal adoption would mean committing to its versioning and category conventions (`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`) and documenting this in the style guide. Currently noted as a good fit; decision deferred until the style guide has a broader review.

### Semantic versioning for the site package

Package versions (`0.1.x`) currently increment by patch for all changes. A more deliberate use of semantic versioning — minor for new features, patch for fixes and documentation — would make the changelog more informative. Consider aligning package versioning with the style guide versioning rules when the style guide reaches a stable release.
