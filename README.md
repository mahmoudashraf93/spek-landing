# Spek landing page

A static Jekyll site for the Spek iPhone translator. No client-side scripts, analytics, remote font requests or runtime App Store lookups.

## Confirmed deployment

GitHub Pages publishes `master` at repository root using Jekyll. The custom domain is:

https://usespek.com/

`CNAME` and `_config.yml` configure the domain and root paths. GoDaddy DNS points the apex to GitHub Pages and `www` to `mahmoudashraf93.github.io`. The previous GitHub Pages URL redirects to the custom domain. Pushing to `master` triggers the existing Pages deployment.

## Local build

```sh
bundle install
bundle exec jekyll build --destination /tmp/spek-landing-site
python3 scripts/validate-site.py /tmp/spek-landing-site
python3 -m http.server 4173 --directory /tmp/spek-landing-site
```

For a local preview, open http://127.0.0.1:4173/.

`Gemfile.lock` pins the existing GitHub Pages dependency stack. `assets/spek/site.css` is the only stylesheet.

## Asset sources

App icon and current product-view captures come from `mahmoudashraf93/spek`, branch `codex/spek-marketing-p0-p1`, in `marketing/screenshots/raw/` and `MarketingCaptureView.swift`. They contain deterministic non-personal example results rendered through real product views, not a recorded live translation session. The photo capture is scrolled to the successful result. Do not claim these examples prove universal translation quality.

Use Pillow to resize those captures proportionally to 880px wide WebP (quality 86) for this site. Keep the untouched PNG sources in the app repository. Rebuild the editable Open Graph image with `python3 scripts/build-social.py` (Pillow).

## Review

See `docs/review.md` and the desktop/mobile before-and-after images in `docs/review/`.
Privacy and terms changes are review drafts until this PR is approved. The terms link uses Apple's standard EULA already referenced in the App Store listing. Firebase analytics is only in the app; this site adds no tracking.
