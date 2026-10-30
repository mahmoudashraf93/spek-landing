# Free web translator review — October 30, 2026

Review URL: https://spek-web.africanlord-apps.workers.dev/translate/

## Completed verification

- The production build validates 14 HTML pages and six existing articles for
  metadata, unique canonicals, links, anchors, discoverability, sitemap and RSS.
- All five existing blog/publication-boundary regression checks pass.
- Eight backend tests pass in the Cloudflare runtime, covering Unicode limits,
  empty/oversized/unsupported input, cross-origin and missing-session rejection,
  Turnstile hostname/action/failure checks, Google request parameters and response
  decoding, duplicate request IDs, concurrent shared-budget reservations, IP
  limits despite session rotation, provider errors, and daily/monthly boundaries.
- The current pinned development dependencies have zero reported npm audit
  vulnerabilities; the deployed Worker has no third-party runtime packages.
- The public preview returns noindex response headers, keeps usespek.com
  canonicals and leaves DNS unchanged. API responses disable caching.
- Browser review at 390px and 320px widths found no horizontal page overflow.
  The 320px homepage navigation fits within the viewport. Arabic input renders
  right-to-left, swapping changes source/target, and character counts update.
- A 501-character input displays an error and disables submission. Clear returns
  to an empty input; the script restores the appropriate status after shortening
  oversized text. Copy remains disabled without a result.
- The Portugal page selects `pt-PT` explicitly and has the expected canonical.
  Desktop review at 1280px found no horizontal overflow or captured browser errors.
- Google's daily general-model quota was successfully changed from zero to
  30,000 characters. Worker limits also enforce 30,000/day and 900,000/month.

## Activation still required

The Google project initially contains no API keys. Creating the restricted
server API key requires the specific browser confirmation requested in chat.
Until the key is stored in Cloudflare, `TRANSLATION_ENABLED` is false and public
health reports `setup`. Real Google translation and a real Turnstile-protected
browser submission must be tested after activation; mocked backend tests are not
a claim of live translation or translation quality.

The preview is publicly reachable for review but is not yet the canonical SEO
deployment. Connect usespek.com only in the later, separately requested cutover.
