---
dc:title: "caddy--web-server"
dc:creator: "Christopher Steel"
dc:contributor: "Claude (Anthropic)"
dc:subject:
  - "radar"
  - "web-server"
  - "tls"
  - "infrastructure"
  - "hugo-hosting-stack"
dc:description: "Radar entry for Caddy, a Go-based web server with automatic TLS, assessed for use in the Hugo hosting stack as a replacement for Apache2."
dc:publisher: ""
dc:date: "2026-06-16"
dc:modified: "2026-06-16"
dc:type: "radar-entry"
dc:format: "text/markdown"
dc:language: "en"
dc:language_bcp47: "en-CA"
dc:source: "https://caddyserver.com"
dc:relation: "hugo-hosting-stack"
dc:identifier: "caddy--web-server"
dc:rights: "TODO"
---

# caddy--web-server

## What it is

Caddy is an open-source web server and reverse proxy written in Go, maintained by the Caddy authors under Apache License 2.0. Its defining characteristic is automatic TLS certificate provisioning and renewal via ACME (Let's Encrypt and ZeroSSL by default), requiring no manual certificate management or cron jobs. Configuration is expressed in a single Caddyfile or via a JSON API. Current stable release: 2.11.2 (6 March 2026).

## Why interesting

The Hugo hosting stack currently uses Apache2 (httpd) for static site and webstore delivery. Apache2 requires separate TLS tooling (typically Certbot with cron-based renewal), explicit virtual host configuration per site, module management, and distro-level packaging that varies across providers. Caddy eliminates all of these: TLS is automatic by default, virtual hosts are a few lines of Caddyfile, and Caddy ships as a single static binary with no external runtime dependencies. This matters directly for provider portability — a sovereign stack that needs to move between Digital Ocean, Canadian providers, and Icelandic providers benefits from infrastructure that is configuration-identical across environments. Caddy's single-binary deployment is provider-agnostic in a way that Apache2's distro-packaged form is not.

For static Hugo sites specifically, Caddy's file server is production-ready with correct `Content-Type` handling, `ETag` support, directory browsing control, and compression out of the box. No additional modules are required.

Caddy 2.10 introduced automated Encrypted ClientHello (ECH) support, which hides the server name indicator (SNI) from passive observers during TLS handshakes — a meaningful privacy improvement for multi-tenant hosting. Caddy 2.11 (current stable) defaults to the X25519MLKEM768 hybrid key exchange group, incorporating post-quantum primitives into the TLS handshake.

## Concerns

**Outbound connections are structural.** Caddy's automatic TLS requires outbound HTTPS connections to Let's Encrypt (acme-v02.api.letsencrypt.org) and ZeroSSL (acme.zerossl.com) at startup and at renewal intervals (typically every 60–90 days). This is not optional for automatic TLS — it is the mechanism. Operators who need fully air-gapped deployments must either configure a private ACME CA, supply certificates manually, or disable automatic TLS. For internet-facing static hosting this is not a practical concern, but it must be understood as a deliberate design constraint rather than a hidden behaviour.

**Telemetry history warrants explicit note.** Caddy v1 (0.11.x) shipped with opt-out telemetry that reported server metrics to a remote endpoint. This was controversial and widely criticised. The telemetry feature was made a no-op before Caddy v2 was released and does not exist in any v2 release. There is no phone-home telemetry in Caddy 2.x. This history is noted here because it is frequently cited in comparisons and assessments; the concern is resolved in the version being assessed.

**Recent CVEs in the 2.11.x series.** The 2.11.2 release patched six CVEs, including: a glob-character sanitization issue in the file matcher (CVE-2026-27585) that could bypass security protections; a Host matcher case-sensitivity failure for large host lists enabling route bypass (CVE-2026-27588); a Path matcher bypass via escape sequence case normalization (CVE-2026-27587); and a TLS client authentication silent fail-open when CA certificate files are missing or malformed (CVE-2026-27586). These are patched in 2.11.2. The cadence and character of these CVEs — primarily matcher and TLS edge cases — is consistent with a mature project with active security research, not indicative of a systemic security architecture problem. Operators should pin to 2.11.2 or later and maintain a clear upgrade path.

**Market share is low.** As of March 2026, Caddy is used by approximately 0.2% of scanned sites (W3Techs). This is not a technical concern but has ecosystem implications: community knowledge, hosting panel support, and third-party tooling is less abundant than for Nginx or Apache2. Documentation is good; community support is adequate but smaller.

**Commercial licensing for enterprise features.** The core Caddy server is Apache 2.0. Some enterprise features (commercial support, certain plugins) are offered under a separate commercial licence by the maintainer. For the Hugo hosting stack use case — static file serving with automatic TLS — the Apache 2.0 core covers all required functionality. Commercial licensing is not relevant to this assessment.

## Security assessment

**Applies to:** Caddy 2.11.2, assessed June 2026.

**Network behaviour:**
- [x] Outbound connections during normal use — ACME certificate issuance and renewal to Let's Encrypt (acme-v02.api.letsencrypt.org) and ZeroSSL (acme.zerossl.com). Frequency: at startup for new certificates, then at renewal intervals (configurable, default ~60 days before expiry). Data sent: domain name, ACME account key, challenge responses. No user request data is transmitted.
- [x] Update checks — none. Caddy does not perform version or update checks. No silent outbound connections beyond ACME.
- [x] Telemetry or usage data — absent in all v2 releases. Telemetry existed in v1 (0.11.x) and was removed before v2 shipped. Confirmed absent.
- [ ] Licence server contact — not present. Apache 2.0 licence requires no runtime licence validation.
- [x] Affects networking of content served — Caddy enforces TLS by default for all public domains. Content served over Caddy is encrypted. ECH (2.10+) additionally conceals SNI from passive observers.

**File system behaviour:**
- [x] Creates hidden or metadata files alongside content — Caddy stores TLS certificates and ACME account keys in a configured storage path (default: `$HOME/.local/share/caddy` on Linux). These are not created alongside content; they are in a dedicated Caddy data directory. The storage path is fully configurable.
- [ ] Caches content outside the working directory — Caddy does not cache site content. Static file serving reads directly from the configured root.
- [ ] Stores recent file history outside the archive — not applicable.
- [ ] Writes to unexpected locations — not observed. All writes are to the configured data directory and log output.

**Content exposure:**
- [ ] Sends any content to a remote service — Caddy does not transmit site content. ACME challenges involve domain validation only, not content.
- [ ] Stores content in a cloud service by default — not applicable.
- [ ] Auto-save or backup features that copy content externally — not applicable.

**Assessment method:** Review of Caddy 2.11.2 release notes, official documentation (caddyserver.com/docs), GitHub release history (github.com/caddyserver/caddy/releases), CVE patch notes, and community discussion. Network behaviour assessed via documentation review and community sources. No independent network capture performed at time of this entry; this is flagged as a gap for adoption.

**Assessment status:** Assess. Network capture verification pending before adoption.

## Relationship to project — Hugo hosting stack

Caddy maps to the web server tier of the Hugo hosting stack — the layer that receives HTTP requests and serves pre-built static content from disk, manages TLS termination, and handles virtual hosting for multiple domains or sites on a single server.

In the current stack, Apache2 occupies this tier. Caddy is assessed as a candidate replacement. It does not affect the orchestration tier (Ansible), the content pipeline (Hugo build and git push), or the shim layer (Terraform / provider-specific provisioning).

The Ansible orchestration roles that currently install and configure Apache2 would require rewriting for Caddy, but the surface area is significantly smaller: Caddy has no module management, no separate TLS tooling, and a single configuration file. The shim layer is unaffected.

A Universal Cake praxis evaluation for Caddy in the Hugo hosting stack context accompanies this entry.

## Status notes

**Ring: Assess**

Caddy is in assess because the security assessment has not been completed with an independent network capture, and the Ansible role rewrite has not been scoped. The technical case for adoption is strong: automatic TLS, single-binary deployment, simpler configuration surface, post-quantum TLS defaults, and provider-agnostic packaging all align with the stack's sovereignty and portability goals.

What would move it to **adopt:** independent network capture confirming outbound connections match documented behaviour (ACME only, no other egress); Ansible role drafted and tested against a staging Droplet; Universal Cake praxis evaluation completed and reviewed.

What would move it to **hold:** discovery of undocumented outbound connections; licence change affecting core functionality; a pattern of unpatched security issues inconsistent with the current CVE cadence.

- Last reviewed: 2026-06-16
- Accompanying document: Universal Cake praxis evaluation — Caddy in the Hugo hosting stack

## Links

- https://caddyserver.com
- https://github.com/caddyserver/caddy
- https://caddyserver.com/docs/automatic-https
- https://github.com/caddyserver/caddy/releases/tag/v2.11.2

## License (for this document)

TODO
