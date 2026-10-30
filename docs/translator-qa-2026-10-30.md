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

## Live activation

With the user's explicit approval, created the server key in Google project
`spek-web-translator`, restricted it to Cloud Translation API, and stored it as
encrypted `GOOGLE_TRANSLATE_API_KEY` in Cloudflare. No key value is stored in this
repository. `TRANSLATION_ENABLED` is true and public health reports `ready`.

Real Turnstile-protected browser submissions succeeded in all six directions:
English ↔ Spanish, English ↔ Arabic, and English ↔ European Portuguese. Examples
included “Hello, how are you?” → “¿Hola, cómo estás?” and “Where is the bus stop?”
→ “Onde fica o ponto de autocarro?”. Copy displayed its successful “Copied” state.
These are functional checks, not a translation-quality benchmark.

The automated Chrome profile encountered Turnstile challenge error 300030. An
independent browser passed the real widget automatically and completed the above
requests; bot protection remains enabled. During a live burst check, a widget
refresh could overwrite backend error text. The frontend now preserves error
messages after a fresh challenge token arrives, clearing them on input changes.
After deploying that fix, three consecutive real requests succeeded and the
fourth displayed “Please wait a minute before translating again.” The message
retained its error state after the real widget refreshed and the button became
enabled again. The rejected request did not consume the remaining daily request.

## Production launch

The user subsequently approved the domain cutover. GoDaddy's usespek.com page
was verified before each nameserver edit; no other domain was changed. GoDaddy
confirmed bristol.ns.cloudflare.com and clay.ns.cloudflare.com. Cloudflare's
Universal SSL certificate is active, the usespek.com/* Worker route serves the
site, and HTTPS plus the www-to-apex redirect preserve paths and query strings.
The previous apex A records are retained behind the route for rollback.

Chrome passed the real production Turnstile widget. Real usespek.com submissions
returned Spanish, Arabic, and European Portuguese results. All 14 URLs in the
new production sitemap returned 200 without noindex when checked at Cloudflare's
edge with the real hostname and certificate. robots.txt and RSS returned 200;
the API reported ready; source/config/documentation paths returned 404. The
workers.dev preview still returns noindex. Local DNS caches temporarily returned
the previous GitHub addresses, so GitHub Pages remains available during
propagation. Native GitHub build integration awaits GitHub passkey confirmation.
