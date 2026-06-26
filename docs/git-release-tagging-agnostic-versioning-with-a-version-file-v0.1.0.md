# Git Release Tagging — Agnostic Versioning with a VERSION File

Version: 0.1.0
Status: Draft
Style Guides: style-guide--technical-documentation-for-technologists-v0.2.0.md, web-ready-unrendered-markdown-using-apa-7-v0_2_2.md

## Abstract

This document describes a platform-agnostic approach to versioning and release tagging for git repositories. It covers the use of a `VERSION` file as the single source of truth for the current release version, a shell script that reads that file to create and push annotated git tags, and the conventions that make this pattern reproducible across any git hosting provider — GitHub, GitLab, Codeberg, Gitea, or a self-hosted remote. No CI pipeline, no hosting-provider API, and no third-party tooling are required. The approach is intentionally minimal: version management is a human decision recorded in a file; the script automates only the mechanical steps that follow that decision.

## Sources and Acknowledgements

Git tagging conventions referenced in this document follow the <a name="apa-git-docs-citation"></a>[git-tag documentation (Torvalds et al., 2024)](#apa-git-docs-reference). Semantic versioning conventions follow the <a name="apa-semver-citation"></a>[Semantic Versioning 2.0.0 specification (Preston-Werner, 2013)](#apa-semver-reference). The `VERSION` file pattern is a widely established convention in open source projects; a representative description appears in the <a name="apa-keepachangelog-citation"></a>[Keep a Changelog specification (Gallagher, 2023)](#apa-keepachangelog-reference).

## 1. Principles

We separate two concerns that are often conflated: deciding what the version is, and mechanically recording that decision in git. The version number is a human judgement. It is recorded in a plain text `VERSION` file committed to the repository. The tagging script reads that file and does nothing except create the tag and push it. This separation means the version is always visible in the repository without running any tool, the script has no logic of its own, and the workflow is identical regardless of which git hosting provider is in use.

### 1.1 Why annotated tags

Git has two kinds of tags: lightweight and annotated. A lightweight tag is a pointer to a commit with no additional metadata. An annotated tag is a full git object with a tagger identity, a timestamp, and a message. We use annotated tags because they are designed for releases, they appear correctly in `git describe` output, and hosting providers surface them as release points in their UI. The difference in practice is the `-a` flag and a `-m` message.

### 1.2 Why a VERSION file rather than deriving the version from git

Deriving the version from git — for example, by counting commits or parsing tag history — introduces a dependency on the repository's history that breaks in clones, shallow clones, and fresh checkouts. A `VERSION` file is always present, always readable, and always correct. It is also human-readable without any git tooling.

## 2. Repository setup

### 2.1 The VERSION file

Create a plain text file named `VERSION` in the project root. It contains exactly one line: the current version number in `MAJOR.MINOR.PATCH` format with no prefix, no trailing newline, and no other content.

```text
1.0.0
```

Commit this file to the repository on initial setup. Every subsequent version bump is a commit that changes this file.

### 2.2 Semantic versioning conventions

We follow Semantic Versioning 2.0.0. The three components have defined meanings:

| Component | Increment when |
|-----------|---------------|
| `MAJOR` | A breaking change incompatible with the previous release |
| `MINOR` | New functionality added in a backward-compatible way |
| `PATCH` | Backward-compatible bug fixes or corrections |

For documentation and content projects where "breaking change" is less clearly defined, we apply the same logic at the content level: a MAJOR bump signals a fundamental restructure, a MINOR bump signals new sections or significant additions, and a PATCH bump signals corrections, typo fixes, or minor clarifications.

### 2.3 The tag-release script

Create the following script at `scripts/tag-release.sh`:

```bash
#!/usr/bin/env bash
# tag-release.sh — reads VERSION file, creates an annotated git tag, pushes it.
#
# Usage: bash scripts/tag-release.sh
#
# Requirements: git must be installed and the working directory must be
# inside a git repository with a configured remote named "origin".
# The VERSION file must exist in the project root.
# The working tree must be clean (no uncommitted changes).

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
VERSION_FILE="${ROOT}/VERSION"

if [ ! -f "$VERSION_FILE" ]; then
  echo "ERROR: VERSION file not found at ${VERSION_FILE}" >&2
  exit 1
fi

VERSION=$(cat "$VERSION_FILE" | tr -d '[:space:]')
TAG="v${VERSION}"

if [ -z "$VERSION" ]; then
  echo "ERROR: VERSION file is empty." >&2
  exit 1
fi

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "ERROR: Tag ${TAG} already exists. Bump VERSION before tagging." >&2
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: Working tree has uncommitted changes. Commit before tagging." >&2
  exit 1
fi

echo "Creating annotated tag ${TAG}..."
git tag -a "${TAG}" -m "Release ${TAG}"

echo "Pushing tag ${TAG} to origin..."
git push origin "${TAG}"

echo ""
echo "Done. Release ${TAG} tagged and pushed."
```

Make the script executable:

```bash
chmod +x scripts/tag-release.sh
```

Commit the script to the repository:

```bash
git add scripts/tag-release.sh
git commit -m "Add tag-release script"
```

## 3. Release workflow

### 3.1 Standard release steps

Every release follows the same sequence:

1. Complete and commit all work for the release
2. Bump the version in `VERSION`
3. Update the changelog
4. Commit both changes together
5. Run the tag script

Steps 2, 3, and 4 as a single commit:

```bash
echo "1.0.1" > VERSION
# edit CHANGELOG or relevant document
git add VERSION CHANGELOG.md
git commit -m "Release v1.0.1"
```

Then tag:

```bash
bash scripts/tag-release.sh
```

Expected output:

```text
Creating annotated tag v1.0.1...
Pushing tag v1.0.1 to origin...

Done. Release v1.0.1 tagged and pushed.
```

### 3.2 What the script checks

The script performs three safety checks before creating any tag:

- **VERSION file exists** — exits with an error if the file is missing.
- **Tag does not already exist** — prevents accidentally re-tagging a version. If `v1.0.1` already exists, the script will not overwrite it.
- **Working tree is clean** — prevents tagging uncommitted work. Both tracked and staged changes must be committed before the script will proceed.

### 3.3 Verifying the tag

After the script runs, verify the tag was created and pushed correctly:

```bash
git tag
```

Expected output includes the new tag:

```text
v1.0.0
v1.0.1
```

To inspect the tag:

```bash
git show v1.0.1
```

This displays the tag message, the tagger identity, the timestamp, and the commit the tag points to.

To verify the tag is present on the remote:

```bash
git ls-remote --tags origin
```

## 4. Listing and navigating releases

To list all release tags in reverse chronological order:

```bash
git tag --sort=-version:refname
```

To check out the code at a specific release:

```bash
git checkout v1.0.0
```

This puts the repository in a detached HEAD state at that tag. To return to the main branch:

```bash
git checkout main
```

To find the most recent tag reachable from the current commit:

```bash
git describe --tags --abbrev=0
```

## 5. Hosting provider behaviour

Annotated git tags are a git standard and are handled correctly by all major hosting providers.

| Provider | Where tags appear |
|----------|-----------------|
| GitHub | *Releases* tab; also visible under *Tags* |
| GitLab | *Deployments → Releases* and *Repository → Tags* |
| Codeberg | *Releases* tab |
| Gitea | *Releases* tab |
| Self-hosted | Available via `git ls-remote --tags` from any clone |

No provider-specific configuration is required. Pushing an annotated tag is sufficient for it to appear in the hosting provider's release interface. Provider-specific features such as release notes, asset uploads, or automated changelogs can be added later without changing this workflow; they layer on top of the tag, they do not replace it.

## 6. Recovering from a mistaken tag

If a tag is pushed incorrectly — pointing to the wrong commit, or with the wrong version number — it must be deleted both locally and on the remote before a corrected tag can be created.

Delete the tag locally:

```bash
git tag -d v1.0.1
```

Delete the tag on the remote:

```bash
git push origin --delete v1.0.1
```

Then fix the underlying issue, commit if necessary, and run the tag script again.

Note: deleting a pushed tag is a destructive operation. If other people or systems have already fetched the tag, they will retain it in their local repositories. For this reason, the tag script's pre-flight check prevents re-tagging an existing version — it is better to bump to a new patch version (`v1.0.2`) than to delete and re-create a pushed tag.

## Resources

### Git documentation
- [git-tag documentation](#apa-git-docs-reference)

### Versioning
- [Semantic Versioning 2.0.0](#apa-semver-reference)
- [Keep a Changelog](#apa-keepachangelog-reference)

## References

<a name="apa-git-docs-reference"></a>Torvalds, L., Hamano, J., & contributors. (2024). *git-tag — create, list, delete or verify a tag object signed with GPG*. Git. https://git-scm.com/docs/git-tag
[Return to citation](#apa-git-docs-citation)

<a name="apa-keepachangelog-reference"></a>Gallagher, O. (2023). *Keep a changelog*. https://keepachangelog.com/
[Return to citation](#apa-keepachangelog-citation)

<a name="apa-semver-reference"></a>Preston-Werner, T. (2013). *Semantic versioning 2.0.0*. https://semver.org/
[Return to citation](#apa-semver-citation)

## Changelog

| Version | Status | Notes |
|---------|--------|-------|
| 0.1.0 | Draft | Initial draft |
