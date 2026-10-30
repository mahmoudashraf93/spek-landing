# Spek landing page

A Jekyll site for the Spek iPhone translator, with a free browser text translator
on Cloudflare. The site content is prebuilt HTML; a small
frontend script submits translation requests to a protected Worker. No marketing
analytics, remote fonts, or runtime App Store lookups are added.

Production is https://usespek.com/. The review deployment is
https://spek-web.africanlord-apps.workers.dev/ and remains excluded from search.
See [Cloudflare deployment and operating notes](docs/CLOUDFLARE.md).

## Confirmed deployment

Cloudflare Workers Static Assets serves the prebuilt Jekyll site. The custom domain is:

https://usespek.com/

GoDaddy remains the registrar; Cloudflare hosts DNS. The `usespek.com/*` Worker
route serves the site and translation API. Cloudflare redirects HTTP to HTTPS and
`www` to the canonical apex, retaining paths and query strings. `_config.yml`
retains production canonicals. `CNAME` is retained for the old GitHub Pages
deployment during DNS propagation; it is removed from Cloudflare build output.
The old apex A records are retained behind the proxied Worker route for rollback;
the live Worker serves its own assets and does not fetch the GitHub origin.

Pushing to `master` triggers Cloudflare's native GitHub build integration, which
runs backend tests, publication regression checks and the validated Jekyll build
before deploying. Other branches do not deploy. Manual deployment remains
available with `npm run deploy` after Wrangler authentication.

## Local build

```sh
bundle install
bundle exec jekyll build --destination /tmp/spek-landing-site
python3 scripts/validate-site.py /tmp/spek-landing-site
python3 -m http.server 4173 --directory /tmp/spek-landing-site
```

For a local preview, open http://127.0.0.1:4173/.

`Gemfile.lock` pins the Jekyll dependency stack. `assets/spek/site.css` provides
the shared styles; translator pages also load their dedicated CSS and JavaScript.

## Asset sources

App icon and current product-view captures come from `mahmoudashraf93/spek`, branch `codex/spek-marketing-p0-p1`, in `marketing/screenshots/raw/` and `MarketingCaptureView.swift`. They contain deterministic non-personal example results rendered through real product views, not a recorded live translation session. The photo capture is scrolled to the successful result. Do not claim these examples prove universal translation quality.

Use Pillow to resize those captures proportionally to 880px wide WebP (quality 86) for this site. Keep the untouched PNG sources in the app repository. Rebuild the editable Open Graph image with `python3 scripts/build-social.py` (Pillow).

## Review

See `docs/review.md` and the desktop/mobile before-and-after images in `docs/review/`.
Privacy and terms changes are review drafts until this PR is approved. The terms link uses Apple's standard EULA already referenced in the App Store listing. Firebase analytics is only in the app; this site adds no tracking.
