# Spek blog design QA

final result: passed

## Visual target and evidence

- Selected visual: option 2 (Field Notes), retained at `docs/review/blog/selected-option-2.jpg`.
- Source pixels: 1003 × 1568. Matched implementation viewport: 1003 × 1568 CSS pixels, density 1; `article-desktop.jpg` is 1003 × 1568.
- Full implementation: `article-desktop-full.jpg`, 1003 × 2065. Its additional length comes from complete product instructions, the uncropped supplied app screenshot, troubleshooting, source notes, and existing legal/download/footer links.
- Full-view paired comparison: `docs/review/blog/comparison-final.jpg`, 2006 × 2065. Source and implementation retain their original width and scale; unused source canvas is paper-colored, not stretched.
- Focused paired masthead comparison: `docs/review/blog/comparison-masthead.jpg`, 2006 × 590. Used to inspect headline wrapping, hierarchy, brand, spacing, imagery and navigation at readable size.
- Responsive captures: `article-mobile.jpg` (390 × 844), `article-mobile-320.jpg` (320 × 844), `article-tablet.jpg` (768 × 1024), `article-desktop-1440.jpg` (1440 × 1000), plus full mobile article and hub captures.
- States: top-of-article with tips collapsed for source comparison; tips expanded in `mobile-tips-open.jpg`. Wide and tablet captures also cover keyboard focus after the skip link.

## Comparison history

1. Initial paired comparison: `comparison-initial.jpg` / `article-desktop-initial.jpg`.
   - [P2] Headline line breaks and header height drifted from the target. Added optional explicit title lines and compacted the header; the latest masthead comparison shows the selected three-line title and split image composition.
   - [P2] Excessive introductory copy and vertical density pushed the reading flow down. Shortened instructions while preserving real controls, used 17px body copy, and compacted the footer. The current full-view comparison shows the intended reading grid and travel strip; remaining extra length is functional content, not spacing drift.
2. Narrow mobile review:
   - [P2] At 320px the Get Spek text wrapped and crowded the brand. Added non-wrapping links, adjusted the narrow type/gaps, and kept navigation targets at least 44px high. The final 320px capture has a single-line download link and no horizontal overflow.
   - [P2] Hiding the CTA line break joined two words on mobile. The title now uses escaped multiline content, preserving a space when naturally wrapped.
3. Final source/implementation paired comparisons and mobile/hub images inspected after those fixes. No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- **Fonts and typography:** native system sans matches the existing site and selected direction; bold tight headline, explicit source line breaks, readable 17px article text and 15–16px instructions. Real author and three-minute reading estimate replace mock metadata. No clipping in checked widths.
- **Spacing and layout:** split editorial hero, horizontal contents, narrative/screenshot columns, panoramic CTA and related rows retained. Mobile stacks hero and article into one column and wraps chapter links. The longer real article is intentional; no phantom cards or empty sidebar when screenshot is omitted.
- **Colors and tokens:** existing paper, ink and orange palette preserved. Small orange links use darker orange and the download button uses dark text for legibility. Mobile CTA has a light reading surface over the travel photo.
- **Images and icons:** dedicated generated café, Florence and Paris assets match the intended subject/palette; supplied app screenshot and logo remain real source assets. Native screenshot is not distorted. Arrows are licensed Heroicons assets. No div art or placeholder assets.
- **Copy:** usable instructions checked against the app's image view/model; removed mock claims about speed/handwriting. Source note identifies illustrative results, and there is no claim of language-expert review.
- **Access and interaction:** semantic headings/nav, alt text, visible focus styles, keyboard skip link, native expandable advice, descriptive links and reduced-motion handling. Main navigation targets are 44px tall on narrow screens.

## Browser and functional verification

- Article and hub → article paths; header and breadcrumb navigation.
- Contents links scroll to their sections; troubleshooting expands/collapses.
- Related product link reaches `/#photo-translation`; contextual dialect anchor exists.
- Skip-to-content Enter activation focuses `main`.
- Country-neutral App Store destinations verified in rendered links.
- Horizontal overflow absent at 320, 390, 768 and 1440px. Tablet and wide measurements read after screenshot/layout settlement.
- Browser log checked: no console errors returned.
- Build validates all five public pages and one proposed article, including assets, fragment IDs, reachability, metadata, JSON-LD, sitemap and RSS.
- Four regression tests pass, including a real fixture build showing that drafts, unpublished and future posts remain excluded while another published guide appears in related reading.

## Intentional differences and test limits

Related links point to existing feature sections until more approved articles exist. The source mock's unpublished article titles are not exposed as broken destinations. Full product screenshot, troubleshooting and source notes make the real article taller. The sidebar screenshot is static documentation, not a web translator.

No full iPhone app walkthrough, non-US iPhone storefront check, VoiceOver session, 200% browser zoom audit, or Core Web Vitals measurement is claimed. These are outside this foundation/layout check. Future articles still need editorial review.

## Follow-up polish

P3: optional further tuning of the small related-link arrow tint and photographic crop. Does not affect the core layout or interaction.

## Implementation checklist

- [x] Selected desktop direction implemented in existing Jekyll site.
- [x] Mobile hub/article and navigation verified.
- [x] Functional navigation, contextual links and related-content fallback.
- [x] Published-only sitemap/RSS and metadata/schema.
- [x] Draft/future regression build and CI.
- [x] Source/prototype paired review, fixes, and post-fix captures.
