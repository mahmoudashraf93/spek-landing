# Spek blog foundations

The existing Jekyll / GitHub Pages site serves `/blog/` and `/blog/{slug}/`. The article layout implements the selected Field Notes design. Only approved posts in `_posts` are published. Draft PRs can include unpublished articles without adding them to the live site. There is no scheduler or automatic merge.

## Writing and review

Answer the reader’s full question before promoting Spek. For a general how-to, cover relevant built-in tools and credible alternatives with actionable instructions, primary sources, and their material limitations. Explain when a reader can finish the task without another app. Include Spek as a clearly identified option where its verified workflow helps; keep its screenshots with its own section and retain a relevant download CTA. Do not claim comparative accuracy, superiority, hands-on tests, or keyword demand without supporting evidence.

Spek is a multilingual translator with country-specific language and dialect choices. A niche article about Egyptian Arabic is one topic in that broader coverage, not a change to the product’s positioning. Select future country or language topics from evidence and reader needs rather than repeatedly defaulting to Egypt.

Start new work in `_drafts/{slug}.md`, or use `published: false` in a dated `_posts/YYYY-MM-DD-{slug}.md`. Both stay out of the production build, hub, related reading, RSS, and sitemap. Future-dated posts are also excluded; they still need a build after their date to appear. Do not use `--drafts`, `--unpublished`, or `--future` in production.

Copy the starter front matter for a new guide. Required fields: title, description, subtitle, date with timezone, updated, author (default from config), reading_time, topic, feature, tags, image, image_alt, image_caption, sections. Optional: title_lines (explicit editorial wrapping), screenshot, screenshot_alt, screenshot_caption, sources, product_note, cta_title. For different source sizes provide image_width/image_height and screenshot_width/screenshot_height. Section IDs must exist in the Markdown/HTML content. Use a 4:3 cover image; include the source screenshot at its native aspect ratio.

Keep `updated` tied to a substantive edit. Verify product instructions against the shipped app, cite primary sources, and validate any dialect examples before approving them. The menu guide covers Apple Camera, Photos, Apple Translate, Google Translate, and Spek. Apple and Google controls were checked against their official documentation; Spek controls were checked against the image translation view and view model, not a new device test. The existing illustrative French menu screenshot appears within the Spek section; no native-speaker review or comparative accuracy test is claimed. The App Store link is country-neutral; storefront routing on a non-US iPhone still needs a device check.

Prepare a draft PR, review the rendered pages, and publish no more than one approved article per day. The foundations do not include an automated publishing rate limiter. Adding a future date does not schedule a build.

## Egyptian Arabic article: evidence and review

The 20 October 2026 research supports a small, focused experiment around `egyptian arabic translator`, with `english to egyptian arabic` and `egyptian arabic to english` as related intent. Google Keyword Planner displayed 1K–10K average monthly searches for each, with All locations, English selected, Google Search, and October 2025–September 2026 selected. These are broad ranges for keywords and close variants; overlapping terms must not be added together. The explicit `egyptian arabic app` and `egyptian arabic translator app` phrases each showed 10–100. Advertiser competition is not organic ranking difficulty. This does not establish demand inside ChatGPT or Claude, likely traffic to Spek, or an easy ranking opportunity.

Gum’s historical metrics operation was inspected and attempted, but its current shared authorization lacks the Google Ads scope. The ranges were therefore read in the existing signed-in Chrome Keyword Planner account. No authentication, scopes, billing, or ad campaigns were changed. Local screenshots and raw accessible data are retained under `/Users/mahmoud/.codex/visualizations/2026/10/20/spek-keywords/`; the sanitized data, source URLs, and cover prompt are in `docs/research/egyptian-arabic-2026-10-20.json`.

Google Trends was checked separately using search terms, Worldwide, Past 12 months, All categories, and Web Search. Its relative indices are not monthly volumes. The exact “best Egyptian Arabic translator” phrase had insufficient signal; no breakout trend or seasonal claim is justified. The article therefore uses “what to choose” rather than claiming tested winners.

The article compares Apple, Google, a specialist Egyptian Arabic app, and Spek using official documentation and developer listings. The mobile and desktop layout was reviewed, and the user approved publication on 20 October 2026. Instructions were checked against the linked documentation and Spek source, not a new device test. Any comparative accuracy ranking or Arabic example requires actual tests and fluent Egyptian Arabic review first; neither is claimed in this article. A stronger follow-up would record the same phrases, directions, devices, app versions, settings, and speaker assessments for every app. After publication, check index status and Search Console queries over several weeks; do not infer success or failure from the first day.

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

`assets/blog/cairo-conversation.webp` is an AI-generated editorial illustration for the Egyptian Arabic article, optimized from a 1448×1086 PNG using WebP quality 80. It is not a real customer photograph, location record, or product test. Its caption discloses generation; its exact prompt and built-in imagegen mode are recorded in the research JSON.

`assets/blog/mexico-city-conversation.webp` follows the same disclosure and encoding approach for the 22 October Mexican Spanish guide. Its sources, source-code checks, exact cover prompt, and keyword evidence are in [the article research record](research/mexican-spanish-2026-10-22.json). The comparison distinguishes country-specific wording, speech/playback settings, and regional dictionary labels; it does not rank translation accuracy.

## Seven-article plan — researched 20 October 2026

The original 20 October plan started with two live articles: the menu guide (19 October) and the Egyptian Arabic comparison (20 October). Five additional guides would bring the total to seven. This plan covers English-language content for international iPhone users and deliberately expands beyond Arabic. The original 21–25 October dates were proposed targets, not scheduled jobs. No article shipped on 21 October. The Mexican Spanish guide shipped third on 22 October; the user's next publication request ships the queued screenshot guide fourth on 26 October, leaving three proposed guides. Publish at most one approved article per Cairo day; do not catch up by publishing two.

One-per-day is an editorial pace, not a Google safety threshold. Google's [generative-content guidance](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content/) and [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) focus on reader value, accuracy, and the purpose of the content. Avoid five near-identical country substitutions, even at one per day.

### Research method and limits

The complete evidence and briefs are in [the research JSON](research/seven-article-plan-2026-10-20.json). Google Keyword Planner was used in the existing Chrome account for **40 manually supplied English keyword phrases**, with Google Search, **All languages** (the historical-metrics interface locks this setting), and **October 2025–September 2026** selected. Each phrase was checked worldwide and separately in the United States. This differs from the earlier Egyptian research's English-selected discovery view; scopes are recorded with each dataset. Gum's existing profile was used for Search Console reads; its shared credentials and scopes were not changed. No ad campaign or billing change was made.

Ranges include close variants and must not be summed. They are searches, not unique people, traffic forecasts, app downloads, or LLM prompt counts. The Ads competition column measures advertisers, not organic difficulty. A dash means no available metric, not zero demand. Current search-result types were reviewed, but no geo-controlled Google top-ten, backlink, or numeric SEO difficulty audit is claimed. App-vendor lists were used to understand existing coverage, not as independent accuracy evidence.

Search Console had only **8 preliminary impressions and 0 clicks** across the property for 1–20 October at the check. That is too small and too early to prioritize topics from Spek's own ranking performance. Google Trends was also checked for the five primary phrases: Worldwide, Past 12 months, All categories, Web Search, search terms. Relative indices are not monthly counts. European Portuguese and some other exact phrases were sparse; there is no defensible recurring-seasonality claim. For `voice translator iphone`, the mean relative index was 20.8 in the first 13 displayed weeks and 40.1 in the last 13 complete weeks. That is a descriptive observation, not a doubling of searches or a causal claim. The exact Japanese “best” phrase was sparse recently, so it is not a trend-driven urgent priority.

Local screenshots and raw accessible tables remain under `/Users/mahmoud/.codex/visualizations/2026/10/20/spek-seven-article-plan/`. The repository JSON contains sanitized metrics and primary sources without Google account identifiers.

### Calendar and measured primary keywords

The calendar below reflects the 26 October publication. Remaining dates are earliest proposals and require editorial work and approval; no scheduler is installed. Rows use the measured primary phrase; related phrases have their own ranges in the original research JSON.

| # | Date / status | Proposed article | Measured primary phrase | Worldwide / month | US / month |
| --- | --- | --- | --- | --- | --- |
| 1 | 19 Oct — live | How to translate a menu on your iPhone | Existing guide | — | — |
| 2 | 20 Oct — live | Egyptian Arabic translator apps for iPhone: what to choose | Earlier research retained separately | — | — |
| 3 | 22 Oct — live | Mexican Spanish translator apps for iPhone | `mexican spanish translator` | 1K–10K | 1K–10K |
| 4 | 26 Oct — published in this release | How to translate a screenshot on your iPhone | `translate screenshot iphone` | 100–1K | 10–100 |
| 5 | 27 Oct — proposed | European Portuguese translator apps for iPhone: choosing Portuguese for Portugal | `european portuguese translator` | 100–1K | 100–1K |
| 6 | 28 Oct — proposed | How to translate an in-person conversation on iPhone | `voice translator iphone` | 100–1K | 10–100 |
| 7 | 29 Oct — proposed | Japanese translator apps for iPhone: menus, signs, and conversations | `best japanese translator app` | 1K–10K | 100–1K |

### Screenshot translation brief — published fourth on 26 October

This is a saved-screen task across languages, not another restaurant-camera tutorial. Start with Photos / Live Text and Apple Translate's Photo Library path, then show Google Translate Gallery and Spek Photo Library as alternatives. Explain missing Translate controls, text recognition versus translation-language support, legibility, and what each path needs online. `how to translate a screenshot` also showed 100–1K worldwide and in the US, but overlaps the primary phrase and is not additive.

The useful original contribution is a current, demonstrated screenshot workflow with troubleshooting, using owned non-private sample screens. Record device/iOS, app version, language and method for real demonstrations; otherwise label instructions documentation-based. Spek can import an image; do not imply it automatically translates another running app. Link to the existing menu guide for restaurant tasks and `/#photo-translation`; add the Japanese guide only after it exists.

Primary references: [Apple Photos / Live Text](https://support.apple.com/en-us/120004), [Apple Translate Camera and Photo Library](https://support.apple.com/guide/iphone/translate-with-the-camera-iphea8b95631/ios), [Apple availability](https://www.apple.com/ios/feature-availability/), and [Google image translation](https://support.google.com/translate/answer/6142483?co=GENIE.Platform%3DiOS&hl=en). Apple support and existing tutorials make this competitive; the recommendation rests on task clarity and fit, not presumed easy rankings.

The published guide uses documentation-based instructions, clearly disclosed in its product note; no fresh device demonstration or translated-output comparison is claimed. It adds troubleshooting for mixed-language screens, missing controls, low-resolution captures, PDF-versus-image imports, and offline expectations. The cover is generated editorial imagery, not an app screenshot. Primary sources, Spek source checks, the exact cover prompt, and validation evidence are recorded in [the 26 October research record](research/screenshot-translation-2026-10-26.json). The menu article links to it without changing the menu article's substantive update date. Gum's Search Console refresh failed with `AUTH_REFRESH_FAILED`; no new performance counts or indexing claims are reported, and shared Google credentials were not changed.

### Mexican Spanish brief — published third on 22 October

Compare Google Translate, Apple Translate, SpanishDictionary.com and Spek for a concrete choice: conversation, message wording or vocabulary lookup. Explain how a Mexico output choice differs from a Latin American dictionary label or a playback-accent setting. Spek's country list contains Mexico / Spanish (Mexican). Apple's current Translate App availability list names Spanish (Spain), which is a label distinction, not evidence that it cannot handle Mexican speech.

The related `english to mexican spanish` phrase showed 10K–100K worldwide and in the US, but much of that intent can be an instant translation task. The explicit `mexican spanish translator app` phrase was only 10–100 in both markets. Do not present the large head-term range as the potential audience or traffic of the comparison.

Verify regional controls for each input method before giving steps. Published translated examples or quality claims require matched inputs and fluent Mexican Spanish review. The 22 October article uses a documentation-based task comparison. It links to the existing menu guide and `/#dialect-choices`; the screenshot guide is not live yet. Add screenshot and conversation links when those destinations exist.

Primary references: [SpanishDictionary's regional coverage](https://help.spanishdict.com/article/105-what-type-of-spanish-does-spanishdictionarycom-use), [regional pronunciations](https://help.spanishdict.com/article/146-regional-audio-pronunciations), [Google speech settings](https://support.google.com/translate/answer/6142468?co=GENIE.Platform%3DiOS&hl=en), and [Apple availability](https://www.apple.com/ios/feature-availability/). The observed search snapshot mixed generic app directories and dictionary/translator intent; it did not establish low organic competition.

### Article 5: Portuguese for Portugal

Compare DeepL, Google Translate, Apple Translate and Spek for users who specifically want Portuguese for Portugal. The decision is about output variety, playback and input method, not an argument that one country's Portuguese is universally unusable elsewhere. Explain Spek's separate Portugal / Portuguese (European) and Brazil / Portuguese (Brazilian) choices. Include DeepL as a credible alternative rather than reducing the article to a promotion.

`english to european portuguese` showed 1K–10K worldwide and 100–1K in the US; the explicit app phrase showed 10–100 in both. Apple's Translate App list currently names Portuguese (Brazil). DeepL's developer listing names Portuguese and Portuguese (Brazilian), but its current iPhone picker and per-feature behavior still need verification before exact variety-selection instructions are written. API language availability alone is not proof of a consumer-app control.

Any example comparison needs fluent European Portuguese review. Link to the screenshot and menu guides where those tasks arise, and to `/#dialect-choices`; add article 6 when live. Keep the scope translation for Portugal, rather than another list of language-learning courses.

Primary references: [Apple availability](https://www.apple.com/ios/feature-availability/), [DeepL mobile help](https://support.deepl.com/hc/en-us/articles/360020662260-DeepL-mobile-apps), [DeepL's developer listing](https://apps.apple.com/app/id1552407475), and [Google speech settings](https://support.google.com/translate/answer/6142468?co=GENIE.Platform%3DiOS&hl=en). Existing commercial Portuguese comparisons already cover this space; smaller volume does not imply easy ranking.

### Article 6: in-person conversations

Cover two people taking turns on one phone. Compare Apple Translate Conversation / face-to-face, Google's current iPhone options, and Spek's hold, release, review and swap workflow. Address short turns, background noise, names and connectivity. Explicitly separate this from phone-call, FaceTime, continuous background or AirPods translation; those have different requirements.

`translate conversation iphone` showed 10–100 worldwide and in the US. The broader `live translation iphone` showed 1K–10K in both, but mixes other intents and is not used as the article's primary demand estimate. Google's September 2026 iOS announcement makes a current-feature check particularly important. Never describe Spek as offline, a call translator or continuous live interpretation without evidence of those features.

Use a non-private sample exchange if demonstrating the workflow, recording current versions and settings. Link to the already published Egyptian, Mexican and Portuguese guides where readers need a country choice, plus `/#features` for Spek's voice workflow. The homepage has no `#voice-translation` fragment.

Primary references: [Apple in-person conversations](https://support.apple.com/en-euro/guide/iphone/n4pjjxr31uel/ios), [Apple Live Translation requirements](https://support.apple.com/en-us/123720), [Google's 4 September 2026 update](https://blog.google/products-and-platforms/products/translate/google-translate-ios-android-upgrades/), and [Google speech instructions](https://support.google.com/translate/answer/6142468?co=GENIE.Platform%3DiOS&hl=en).

### Article 7: Japan travel toolkit

Compare by task: a menu, a station sign, or a short spoken exchange. Include Apple Translate, Google Translate, the free NICT VoiceTra app and Spek. Give a real offline fallback through a tool that supports the required input method; Spek and VoiceTra require internet. NICT's current site also requires a recent supported VoiceTra version, so recheck this before writing. Link to the menu, screenshot and conversation guides instead of copying their complete tutorials.

Both `best japanese translator app` and `japanese translator app` showed 1K–10K worldwide and 100–1K in the US. `japanese voice translator` showed 100–1K in both. These overlap and are not additive. The longer `japanese translation app for travel` returned no available metric; do not call it zero demand. The exact “best” Trends phrase was sparse recently, and a single year is not proof of Japan travel seasonality.

This is the most competitive proposed comparison: established destination guides and app vendors already cover it. It goes last so there is time to assemble useful evidence. A readable owned Japanese sample and fluent review are needed for any published output-quality comparisons. Use a factual task matrix and ownership disclosure; do not award Spek an overall accuracy win without tests.

Primary references: [VoiceTra's current NICT site](https://voicetra.nict.go.jp/en/), [its FAQ](https://voicetra.nict.go.jp/en/faq.html), [Apple availability](https://www.apple.com/ios/feature-availability/), and [Google image instructions](https://support.google.com/translate/answer/6142483?co=GENIE.Platform%3DiOS&hl=en). Search observations such as [Inside Kyoto](https://www.insidekyoto.com/best-japanese-translation-apps-for-japan-travel) and [an app-vendor comparison](https://airapps.co/blog/best-japanese-translator-app-for-travel) establish existing coverage, not an independent quality benchmark.

### Topics deliberately deferred

- **Offline translator roundup:** real demand, but poor direct Spek fit while it requires internet. Cover offline alternatives honestly inside the relevant guides.
- **WhatsApp messages / voice notes:** `translate whatsapp messages iphone` showed 100–1K in both markets, and the broader `whatsapp translator` showed 10K–100K worldwide. [WhatsApp already documents native message translation](https://blog.whatsapp.com/introducing-message-translations). Spek has no verified direct integration or voice-note import; a manual copy/screenshot workaround alone is a weaker distinctive first-seven article. The announcement's whole-chat automation applied to Android; do not casually promise it on iPhone.
- **Darija / Moroccan Arabic:** broad `darija translator` showed 10K–100K worldwide, but a -90% quarterly and yearly change in that view, versus 1K–10K in the US. There is demand to revisit, but it would repeat the regional-Arabic format before establishing breadth. `darija translator app` showed just 10–100 in both markets.
- **Arabic image translation / OCR:** a potential follow-up, with 1K–10K worldwide for `arabic image to english translation`. One early site impression is not enough to prioritize it over broadening coverage. Cover relevant recognition limitations in the screenshot guide first; pure OCR/document extraction is a different task.
- **Generic best AI translator / best iPhone translator:** existing broad competition and a weak distinctive claim. `best ai translation app` showed 100–1K worldwide; `best translator app for iphone` showed 1K–10K. Neither is evidence of LLM recommendation demand. Specific task and language guides are the current editorial choice.

### Publication and measurement

Prepare one draft PR per article. Check current controls and primary sources, disclose Spek's ownership, and verify every example or mark the comparison documentation-based. Only publish after approval, at most once per Cairo day. A future date in Jekyll does not create a scheduled build. No scheduler, automatic merge, or new article is created by this plan.

Add contextual links when the destination becomes live; do not publish dead links to future guides or bump update dates for cosmetic link changes. Preserve the existing hub, schema, sitemap, RSS and mobile layout checks. After deployment, verify the production page and discovery files, then inspect crawl/index status when Search Console has data.

Review indexing and early query relevance around seven days after each publication. Use at least 28 days of observations before judging acquisition performance, with longer observation if counts remain tiny. Distinguish non-brand impressions, website clicks, App Store CTA clicks and downloads; Search Console does not measure downloads. CTA analytics and attribution would need separate implementation.

For LLM visibility, use a fixed balanced prompt set, consistent model/date/location settings and repeated samples, tracking recommendations and source citations separately. Search volumes and publishing cadence do not demonstrate ChatGPT or Claude visibility. Google's [AI-search guidance](https://developers.google.com/search/docs/appearance/ai-features) supports ordinary discoverability and helpful content, not a special best-list or schema shortcut.

### Search Console update — 22 October 2026

Gum reads for 1–21 October returned **26 impressions and 0 clicks** with `dataState: all`, compared with 8 preliminary impressions recorded on 20 October. This includes newer data and backfill, so it is not a like-for-like growth rate. Google marks 20 October as the first incomplete date; 20–21 October remain preliminary. The menu guide has 4 impressions, the Egyptian guide 1, and the homepage 21 across its reported HTTP/HTTPS rows. All disclosed query rows belong to the homepage; no article keyword ranking can be inferred from them.

URL Inspection confirms the two older articles and the blog hub are indexed, fetch successfully, allow crawling and indexing, and use the expected HTTPS Google canonical. The new Mexican Spanish guide has not yet been inspected after publication. Search Console does not measure App Store downloads. The dated metrics and inspection results are saved in [the update record](research/search-console-2026-10-22.json). The original plan JSON remains an unchanged historical snapshot.
