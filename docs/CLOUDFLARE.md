# Cloudflare review deployment

This branch deploys the Jekyll site and free text translator at
https://spek-web.africanlord-apps.workers.dev/.
The usespek.com DNS and existing GitHub Pages deployment are unchanged.

## Deployment shape

Workers Static Assets serves the prebuilt Jekyll HTML, CSS, images and frontend
JavaScript. Only `/api/*` invokes `cloudflare/worker.mjs`. This is a single
Wrangler deployment with the same frontend/backend origin, rather than a Pages
project and a separately addressed Worker. Static asset requests do not consume
Worker invocations. A SQLite-backed Durable Object coordinates usage counters.

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
`X-Robots-Tag: noindex, nofollow` on all static pages; canonicals remain on
usespek.com. The preview is a public review address, not password-protected.

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

## Activation and later domain connection

`TRANSLATION_ENABLED` remains false until the restricted Google API credential is
installed, the provider quota is configured, and real translation is verified.
Use Wrangler secrets for all private credentials. Never commit or paste keys
into documents. Public `/api/health` reports `ready` only when required settings
and credentials exist; it does not itself call Google.

For the later domain cutover: verify the Cloudflare site against the current
live site, add usespek.com to the Worker host allowlist and Turnstile widget,
configure the custom domain, and test routing/HTTPS. Remove review-only noindex
headers for the production hostname, retaining them on workers.dev. Preserve all
existing URLs, canonical metadata, sitemap and RSS paths. Check the new translator
pages in Search Console after the domain is connected. Do not change DNS as part
of the preview deployment.
