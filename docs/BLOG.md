# Spek blog foundations

The existing Jekyll / GitHub Pages site serves `/blog/` and `/blog/{slug}/`. The article layout implements the selected Field Notes design. Only approved posts in `_posts` are published. Draft PRs can include unpublished articles without adding them to the live site. There is no scheduler or automatic merge.

## Writing and review

Answer the reader’s full question before promoting Spek. For a general how-to, cover relevant built-in tools and credible alternatives with actionable instructions, primary sources, and their material limitations. Explain when a reader can finish the task without another app. Include Spek as a clearly identified option where its verified workflow helps; keep its screenshots with its own section and retain a relevant download CTA. Do not claim comparative accuracy, superiority, hands-on tests, or keyword demand without supporting evidence.

Spek is a multilingual translator with country-specific language and dialect choices. A niche article about Egyptian Arabic is one topic in that broader coverage, not a change to the product’s positioning. Select future country or language topics from evidence and reader needs rather than repeatedly defaulting to Egypt.

Start new work in `_drafts/{slug}.md`, or use `published: false` in a dated `_posts/YYYY-MM-DD-{slug}.md`. Both stay out of the production build, hub, related reading, RSS, and sitemap. Future-dated posts are also excluded; they still need a build after their date to appear. Do not use `--drafts`, `--unpublished`, or `--future` in production.

Copy the starter front matter for a new guide. Required fields: title, description, subtitle, date with timezone, updated, author (default from config), reading_time, topic, feature, tags, image, image_alt, image_caption, sections. Optional: title_lines (explicit editorial wrapping), screenshot, screenshot_alt, screenshot_caption, sources, product_note, cta_title. For different source sizes provide image_width/image_height and screenshot_width/screenshot_height. Section IDs must exist in the Markdown/HTML content. Use a 4:3 cover image; include the source screenshot at its native aspect ratio.

Keep `updated` tied to a substantive edit. Verify product instructions against the shipped app, cite primary sources, and validate any dialect examples before approving them. The menu guide covers Apple Camera, Photos, Apple Translate, Google Translate, and Spek. Apple and Google controls were checked against their official documentation; Spek controls were checked against the image translation view and view model, not a new device test. The existing illustrative French menu screenshot appears within the Spek section; no native-speaker review or comparative accuracy test is claimed. The App Store link is country-neutral; storefront routing on a non-US iPhone still needs a device check.

Prepare a draft PR, review the rendered pages, and publish no more than one approved article per day. This PR provides the foundations, not an automated publishing rate limiter. Adding a future date does not schedule a build.

## Egyptian Arabic draft: evidence and review

The 20 October 2026 research supports a small, focused experiment around `egyptian arabic translator`, with `english to egyptian arabic` and `egyptian arabic to english` as related intent. Google Keyword Planner displayed 1K–10K average monthly searches for each, with All locations, English selected, Google Search, and October 2025–September 2026 selected. These are broad ranges for keywords and close variants; overlapping terms must not be added together. The explicit `egyptian arabic app` and `egyptian arabic translator app` phrases each showed 10–100. Advertiser competition is not organic ranking difficulty. This does not establish demand inside ChatGPT or Claude, likely traffic to Spek, or an easy ranking opportunity.

Gum’s historical metrics operation was inspected and attempted, but its current shared authorization lacks the Google Ads scope. The ranges were therefore read in the existing signed-in Chrome Keyword Planner account. No authentication, scopes, billing, or ad campaigns were changed. Local screenshots and raw accessible data are retained under `/Users/mahmoud/.codex/visualizations/2026/10/20/spek-keywords/`; the sanitized data, source URLs, and cover prompt are in `docs/research/egyptian-arabic-2026-10-20.json`.

Google Trends was checked separately using search terms, Worldwide, Past 12 months, All categories, and Web Search. Its relative indices are not monthly volumes. The exact “best Egyptian Arabic translator” phrase had insufficient signal; no breakout trend or seasonal claim is justified. The draft therefore uses “what to choose” rather than claiming tested winners.

The draft compares Apple, Google, a specialist Egyptian Arabic app, and Spek using official documentation and developer listings. Before publication, review the draft on mobile and desktop and verify instructions against current app versions. Any comparative accuracy ranking or Arabic example requires actual tests and fluent Egyptian Arabic review first; neither is claimed in this draft. A stronger follow-up would record the same phrases, directions, devices, app versions, settings, and speaker assessments for every app. After an approved publication, check index status and Search Console queries over several weeks; do not infer success or failure from the first day.

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

`assets/blog/cairo-conversation.webp` is an AI-generated editorial illustration for the Egyptian Arabic draft, optimized from a 1448×1086 PNG using WebP quality 80. It is not a real customer photograph, location record, or product test. Its caption discloses generation; its exact prompt and built-in imagegen mode are recorded in the research JSON.
