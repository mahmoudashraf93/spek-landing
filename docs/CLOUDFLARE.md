# Cloudflare production deployment

The Jekyll site and free text translator are live at https://usespek.com/.
The review address is https://spek-web.africanlord-apps.workers.dev/.
On October 30, 2026, only usespek.com was changed at GoDaddy: its nameservers are
`bristol.ns.cloudflare.com` and `clay.ns.cloudflare.com`. Registration, renewal,
privacy settings and other domains are unchanged.

## Deployment shape

Workers Static Assets serves the prebuilt Jekyll HTML, CSS, images and frontend
JavaScript. Only `/api/*` invokes `cloudflare/worker.mjs`. This is a single
Wrangler deployment with the same frontend/backend origin, rather than a Pages
project and a separately addressed Worker. Static asset requests do not consume
Worker invocations. A SQLite-backed Durable Object coordinates usage counters.
The production connection is the `usespek.com/*` zone route in wrangler.jsonc.
This preserves the previous apex A records for rollback instead of deleting them
to create a Worker Custom Domain. They are proxied and all matching paths are
handled by spek-web; the Worker does not fetch the former GitHub origin.

The Google API key, Turnstile secret, and IP hashing key are Cloudflare Worker
secrets, never generated HTML or frontend JavaScript. Wrangler telemetry is
disabled in deployment commands. Runtime observability is disabled to avoid
request-body or content logging. Provider infrastructure can still process
access information as disclosed in the privacy policy.

## Build, check and deploy

```sh
bundle install
npm ci
npm test
npm run build
WRANGLER_SEND_METRICS=false npx wrangler deploy
```

Wrangler is pinned in package.json; use `npx wrangler` for this project. The
Miniflare simulator is pinned to the version used by that Wrangler release.
Tests use the real Worker and SQLite Durable Object runtime with fake upstream
responses. Test credentials never reach the public deployment.

The build validates site links, canonicals, sitemap coverage, metadata and draft
exclusion before writing Cloudflare-only headers. Preview response headers set
`X-Robots-Tag: noindex, nofollow` only on the workers.dev hostname; usespek.com
pages are indexable. Canonicals remain on usespek.com. The preview is a public
review address, not password-protected. API responses remain noindex everywhere.

## Limits and accounting

- 500 Unicode code points per submitted text, one target per request, NMT only.
- 3 successful admissions per minute per session and per daily IP hash.
- 10 admitted requests per session/day, 30 per daily IP hash/day.
- 12 attempts/minute per daily IP hash before bot verification.
- 30,000 characters/day and 900,000/month for the entire deployment.
- Counters reset by UTC day/month. Google's daily quota has its own reset time.
- Characters and request counts are reserved atomically before calling Google.
  Failed and ambiguous upstream requests stay charged against these counters.
  Requests are never automatically retried. Request IDs prevent duplicates.
- Turnstile must pass server verification with the expected hostname and action.
- No cross-origin API access. Origin checks supplement Turnstile and limits;
  they are not relied upon as authentication by themselves.
- Provider/ledger/verification errors fail closed.

These are character limits, not a guaranteed dollar spending cap. At standard
NMT rates, 900,000 source characters represents $18 before the recurring $10
free-tier credit, when that credit is available to this billing account. Taxes,
other projects sharing credits, or changes to pricing can affect the final bill.
Only the Worker can choose Google's request parameters; clients cannot request
another model, another service, or multiple targets.

## Data lifecycle

Text and translated output stay in the request/response path and are not saved.
The necessary HttpOnly/Secure/SameSite=Strict session cookie lasts seven days.
The ledger stores random session/request IDs, counts, and a keyed IP hash whose
input changes each UTC day. Session/IP and deduplication entries expire within
two days plus the daily cleanup interval. Monthly aggregate entries expire
within 32 days plus cleanup. The ledger's alarm deletes expired entries.

The unmodified Google attribution badge is `png/color-regular@2x.png` from
https://cloud.google.com/static/translate/images/google-translate-attribution.zip,
displayed at its intended half dimensions next to the result. The Terms page
includes Google's required translation disclaimer and links to the provider's
attribution requirements. No Google endorsement or comparative accuracy is
claimed.

## Production cutover

`TRANSLATION_ENABLED` is true. On October 30, 2026, the approved server key was
created in Google project `spek-web-translator`, restricted to Cloud Translation
API, and installed as encrypted `GOOGLE_TRANSLATE_API_KEY` in Cloudflare. The
Google daily general-model quota is 30,000 characters. Real browser submissions
verified English with Spanish, Arabic, and European Portuguese in both directions.
Use Worker secrets for all private credentials. Never commit or paste keys into
documents. Public `/api/health` reports `ready` only when required settings and
credentials exist; it does not itself call Google.

usespek.com is allowed in both the Worker and Turnstile. Universal SSL is active,
Always Use HTTPS is enabled, and a permanent Redirect Rule sends
`https://www.usespek.com/*` to `https://usespek.com/${1}` with query preservation.
The www CNAME points to usespek.com and is proxied. Existing TXT records for
Google verification, GitHub verification and DMARC were preserved; the
_domainconnect CNAME remains DNS-only. No MX records existed at GoDaddy.

Keep GitHub Pages available while old DNS answers expire. The former apex
records are 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153.
To roll back serving, remove the Worker route and return those records to
DNS-only; leave all verification and mail-policy records in place. DNS caches
can delay a rollback too. Do not disable GitHub Pages until propagation is over.

Native Workers Builds is connected to `mahmoudashraf93/spek-landing`, production
branch `master`, with previews disabled. The user approved adding only this
repository to the existing Cloudflare GitHub app. The connection reuses an
existing Cloudflare build token; no new credential was created. Build caching is
enabled, with `RUBY_VERSION=3.3.13` (the Ruby version that passed GitHub validation)
and `NODE_VERSION=22.23.4`.

Build command:
```sh
bundle install && npm test && python3 -m unittest discover -s scripts -p 'test_*.py' && npm run build
```
Deploy command:
```sh
WRANGLER_SEND_METRICS=false npx wrangler deploy
```

Cloudflare installs the npm dependencies from the lockfile before the custom
build command. A failed test or site validation prevents deployment. No runtime
translation secrets are copied into GitHub. Existing GitHub Pages builds are
separate from Workers Builds and remain available during DNS propagation.
Search Console should discover the new translator URLs through the existing
production sitemap; indexing is not instant.
