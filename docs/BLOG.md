# Spek blog foundations

The existing Jekyll / GitHub Pages site serves `/blog/` and `/blog/{slug}/`. The article layout implements the selected Field Notes design. There is one starter guide in this PR; merging is its publication approval. No scheduler, automatic merge, or Google credential is added.

## Writing and review

Answer the reader’s full question before promoting Spek. For a general how-to, cover relevant built-in tools and credible alternatives with actionable instructions, primary sources, and their material limitations. Explain when a reader can finish the task without another app. Include Spek as a clearly identified option where its verified workflow helps; keep its screenshots with its own section and retain a relevant download CTA. Do not claim comparative accuracy, superiority, hands-on tests, or keyword demand without supporting evidence.

Start new work in `_drafts/{slug}.md`, or use `published: false` in a dated `_posts/YYYY-MM-DD-{slug}.md`. Both stay out of the production build, hub, related reading, RSS, and sitemap. Future-dated posts are also excluded; they still need a build after their date to appear. Do not use `--drafts`, `--unpublished`, or `--future` in production.

Copy the starter front matter for a new guide. Required fields: title, description, subtitle, date with timezone, updated, author (default from config), reading_time, topic, feature, tags, image, image_alt, image_caption, sections. Optional: title_lines (explicit editorial wrapping), screenshot, screenshot_alt, screenshot_caption, sources, product_note, cta_title. For different source sizes provide image_width/image_height and screenshot_width/screenshot_height. Section IDs must exist in the Markdown/HTML content. Use a 4:3 cover image; include the source screenshot at its native aspect ratio.

Keep `updated` tied to a substantive edit. Verify product instructions against the shipped app, cite primary sources, and validate any dialect examples before approving them. The menu guide covers Apple Camera, Photos, Apple Translate, Google Translate, and Spek. Apple and Google controls were checked against their official documentation; Spek controls were checked against the image translation view and view model, not a new device test. The existing illustrative French menu screenshot appears within the Spek section; no native-speaker review or comparative accuracy test is claimed. The App Store link is country-neutral; storefront routing on a non-US iPhone still needs a device check.

Prepare a draft PR, review the rendered pages, and publish no more than one approved article per day. This PR provides the foundations, not an automated publishing rate limiter. Adding a future date does not schedule a build.

## Links and discovery

The homepage and global navigation link to Guides; the hub links to every published article. Each guide links back through breadcrumbs and to useful product sections. Related reading selects up to two other published posts with matching tags, excludes itself, and fills unused slots with real feature-section links. Never link to drafts or empty category pages. Use contextual, descriptive links in the body as new guides become available.

The sitemap combines normal HTML pages, the legacy `pages` legal collection, and published posts. Post `lastmod` uses the article's explicit updated date. RSS includes the newest 20 published posts. Article descriptions, canonicals, social metadata, BlogPosting and BreadcrumbList data are generated from the same front matter. JSON-LD is the only script content; the site needs no client JavaScript.

Download buttons share `appstore_link` in `_config.yml`: https://apps.apple.com/app/id6748774580. This retains the app ID without forcing `/us/`; territory availability remains controlled in App Store Connect.

## Local preview and checks

```sh
bundle install
JEKYLL_ENV=production bundle exec jekyll serve --destination _preview --host 127.0.0.1 --port 8768
bundle exec jekyll build
python3 scripts/validate-site.py _site
python3 -m unittest discover -s scripts -p 'test_*.py'
```

For a private draft preview, use a separate destination (`jekyll serve --drafts --destination _preview`) and keep it local. Do not commit generated `_site` or preview output. CI checks discovery from the homepage, links and fragment IDs, unique metadata, schema, sitemap/RSS coverage, and draft/future exclusion with a real Jekyll fixture build.

## Assets

`assets/blog/cafe-menu.webp`, `florence-banner.webp`, and `paris-signs.webp` are generated editorial illustrations matching the selected mock. The hero/menu photograph is not a real customer photo or a device test. Product screenshots and icon are the supplied existing assets. Arrows are unmodified Heroicons assets under their MIT license in `assets/icons/LICENSE`. Review captures are under `docs/review/blog` and are excluded from the published site.
