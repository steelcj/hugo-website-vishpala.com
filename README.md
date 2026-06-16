# hugo-website-vishpala

Hugo static site with Pagefind search and bilingual support (en-ca / fr-ca).

This is a site mockup for vishpala.com

## Recommended

This will work fine with standard hugo and pagefind installs, however, using the tools below puts you in full control, no npm or other installers required, safe. Relativly easy to setup support for Windows versions as well, best of all very easy to remove these tools without a trace, if you decide you do not like them.

### hugo-tool

Isolated and os agnostic tool that does not make changes to the host OS

* https://github.com/steelcj/hugo-tool

Custom tool pattern install of all things hugo isolated from host os.

Currently supports nix like os but shoudl not be very difficult to support windows

- Hugo extended v0.163.1 or later

### pagefind-tool

Isolated and os agnostic tool that does not make changes to the host OS

**npm not required**

* https://github.com/steelcj/pagefind-tool

Custom tool pattern install of all things pagefind, isolated from host os. 

- Pagefind v1.5.1 or later — see `docs/` for installation guide

## Project structure

```
content/
├── en-ca/     English content
└── fr-ca/     French content
layouts/
├── index.html             Homepage template
└── _default/
    ├── baseof.html        Base template (header, nav, search, footer)
    ├── list.html          Section list pages with De Stijl hero row
    └── single.html        Individual content pages
assets/css/main.css        All styles
static/
├── img/vishpala-mark.svg  Logo mark
└── js/search.js           Pagefind headless search
scripts/build.sh           Hugo + Pagefind build script
```

## Development

### pagefind-tool

See the pagefind-tool documentation for information on setting up pagefind services for the site search function.

### hugo-tool

Once hugo tool is setup you can run your hugo commands and update hugo anywhere in your directory without installing hugo...

```bash
hugo server
```

Search requires a built index — run `bash scripts/build.sh` first then `hugo server` to have search available.

## Build, Test and Deploy

### General Testing Process

```bash
bash scripts/build.sh
```

the above command setsup the pagefind search index by running these two command for you:

```bash
hugo --minify
pagefind --site site
```

Output is in `site/`.

To test locally on your system:

```bash
hugo server
```

Open the URL and away you go...

## Fonts

`system-ui, sans-serif` throughout. No external font dependencies. See `content/en-ca/resources/system-fonts/` for the rationale.

## Licence

Content: CC BY-SA 4.0. Code: 
