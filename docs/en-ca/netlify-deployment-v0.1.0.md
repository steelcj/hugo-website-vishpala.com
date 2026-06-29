# Deploying vishpala.com to Netlify

Version: 0.1.0
Status: Draft

## Abstract

This document describes how to deploy vishpala.com to Netlify from the GitHub repository. Netlify builds the site automatically on every push, runs the Pagefind search indexer, and publishes the result to a public URL. No built files need to be committed to the repository. The procedure assumes you have a GitHub account with the `hugo-website-vishpala.com` repository already pushed, and a Netlify account (free tier is sufficient).

## Before you begin

Two files need to be added to the project before Netlify can build it successfully. These are included in v0.1.20 of the project package. If you are working from an earlier version, create them manually as described in the preparation section below.

## Part one — prepare the project

### Add a requirements.txt file

Netlify installs Python dependencies declared in a `requirements.txt` file at the project root before running the build command. The only dependency `build.py` requires beyond the Python standard library is PyYAML. Create `requirements.txt` at the project root containing one line:

```
pyyaml
```

### Add a netlify.toml file

Netlify reads `netlify.toml` at the project root for build configuration. Create it with the following content:

```toml
[build]
  command       = "python scripts/build.py"
  publish       = "site"

[build.environment]
  HUGO_VERSION  = "0.162.0"
  PYTHON_VERSION = "3.11"
```

The `command` tells Netlify what to run to build the site. The `publish` directory tells Netlify where to find the built output to serve. The environment variables pin Hugo and Python to the versions the project was developed against.

### Verify baseURL in hugo.toml

The `baseURL` in `hugo.toml` should be set to your production domain rather than a GitHub Pages URL. Netlify handles the public URL independently of this value during preview deployments, but it should reflect where the site will ultimately live:

```toml
baseURL = 'https://vishpala.com/'
```

If you do not yet have a custom domain, leave it as `https://vishpala.com/` for now — Netlify will override it with the assigned subdomain for preview builds, and you can connect the custom domain later.

### Commit and push

Once both files are in place:

```bash
git add requirements.txt netlify.toml
git commit -m "chore: add Netlify build configuration"
git push
```

## Part two — connect to Netlify

### Create a Netlify account

Go to [netlify.com](https://netlify.com) and sign up using your GitHub account. This gives Netlify permission to access your repositories.

### Add a new site

From the Netlify dashboard:

- Click **Add new site**
- Choose **Import an existing project**
- Choose **GitHub** as the Git provider
- Authorise Netlify to access your repositories if prompted
- Select `hugo-website-vishpala.com` from the list

### Confirm build settings

Netlify will read `netlify.toml` and pre-fill the build settings. Confirm they show:

- **Base directory** — leave blank
- **Build command** — `python scripts/build.py`
- **Publish directory** — `site`

If they do not match, enter them manually.

### Deploy the site

Click **Deploy site**. Netlify will:

- Clone the repository
- Install Hugo at the pinned version
- Install Python dependencies from `requirements.txt`
- Run `python scripts/build.py`, which runs `hugo --minify` then `pagefind --site site`
- Publish the contents of `site/` to a public URL

The first build takes two to three minutes. Netlify shows a live build log so you can follow progress and diagnose any errors.

### Find your URL

Once the build completes, Netlify assigns a URL in the form `https://<random-name>.netlify.app`. This is your demo URL. It is public and shareable immediately.

## Part three — every subsequent push

From this point forward, every push to the `main` branch triggers a new build automatically. You do not need to run `python scripts/build.py` locally or commit any built files. The workflow is:

- Edit content in `content/<lang>/`
- Commit and push
- Netlify builds and publishes within two to three minutes

## Part four — connecting a custom domain (optional)

When you are ready to use `vishpala.com` as the production domain:

- In the Netlify dashboard, go to **Site settings → Domain management**
- Click **Add a domain**
- Enter `vishpala.com`
- Follow the instructions to update your DNS records to point to Netlify
- Netlify provisions an SSL certificate automatically via Let's Encrypt

## Troubleshooting

**Build fails with "hugo: command not found"** — the `HUGO_VERSION` in `netlify.toml` may not match a version Netlify supports. Check the Netlify Hugo documentation for the currently supported version range and update accordingly.

**Build fails with "No module named yaml"** — `requirements.txt` is missing or was not committed. Confirm the file exists at the project root and contains `pyyaml`.

**Pages load but search returns no results** — the Pagefind index was not built. This usually means `build.py` exited before running `pagefind`. Check the build log for errors in the Hugo step that may have prevented Pagefind from running.

**Language switcher links go to the wrong URL** — `baseURL` in `hugo.toml` may be set to a GitHub Pages URL from a previous version. Update it to `https://vishpala.com/` or your Netlify subdomain and push again.

## Changelog

| Version | Status | Notes |
|---------|--------|-------|
| 0.1.0 | Draft | Initial deployment guide for Netlify |
