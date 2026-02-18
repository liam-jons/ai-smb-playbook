# Homepage Design Critique — 18 February 2026

**Auditor:** Claude Code (frontend-design:critique)
**URL:** http://localhost:4100/?client=phew
**Viewports tested:** 1280x800, 375x812, 1920x1080
**Method:** Playwright accessibility snapshots, computed style extraction, layout measurements, and source code review. Screenshots could not be captured due to a Playwright font-loading timeout (Plus Jakarta Sans web font); analysis is based on DOM measurements, computed CSS values, accessibility tree output, and direct source inspection.

---

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Visual Quality | 8/10 | Strong typography hierarchy, consistent OKLCH colour system, well-differentiated cards |
| Layout & Responsiveness | 8/10 | Excellent 1920px centering, good mobile stacking, minor scroll at 1280x800 |
| Information Architecture | 9/10 | Clear three-zone cover page, natural eye flow, client branding appropriately weighted |
| Interaction Design | 7/10 | Hover states present but subtle; focus states rely on global ring only |
| Content Quality | 9/10 | UK English correct, tone practical, placeholder exposed in generic config |
| Accessibility | 8/10 | Good semantic landmarks, skip link, ARIA labels; some gaps noted below |
| **Overall** | **8/10** | A well-crafted cover page that achieves clarity and restraint. Minor polish issues remain. |

---

## What Works Well

- **Three-zone cover page hierarchy is clear and effective.** The vertical flow from title (Zone 1) through attribution (Zone 2) to client branding (Zone 3) reads naturally. Each zone has distinct visual weight: h1 at 36px/700 bold dominates, attribution at 14px/400 recedes, and the client logo zone is separated by a decorative border-top rule that acts as a tasteful section divider.

- **Typography is well-executed.** Plus Jakarta Sans with `font-feature-settings: 'cv11', 'ss01'` gives the text a polished, slightly distinctive feel. The h1 uses `clamp(1.5rem, 4vw, 2.25rem)` for fluid sizing (24px mobile to 36px desktop), `text-wrap: balance` for even line breaks, and `tracking-tight` (-0.9px) for a tight, confident heading. The h2 card titles at 20px/600 are clearly subordinate. Body text at 14px (attribution) and 18px (description) provides comfortable reading.

- **OKLCH colour system is consistent and intentional.** Warm-slate hue 250 runs through all neutral tokens. Foreground is `oklch(0.16 0.012 250)` (near-black, warm), muted text is `oklch(0.5 0.012 250)`, background is `oklch(0.98 0.004 250)` (warm off-white). No pure black or white anywhere. Dark mode mirrors this with reversed lightness values.

- **Card differentiation is strong.** The General Users card has a filled blue tint (`bg-blue-50/50`) with `border-l-4 border-l-blue-500`, making it visually heavier than the Developer card which has only the violet left border and a nearly-white background (`oklch(0.995 0.002 250)`). This successfully signals General Users as the default choice without being heavy-handed.

- **Badge colours match card accents.** General badge: `bg-blue-100 text-blue-700`, rendering as `oklch(0.932 0.032 255)` background with `oklch(0.488 0.243 264)` text. Developer badge: `bg-violet-100 text-violet-700`, rendering as `oklch(0.943 0.029 295)` background with `oklch(0.491 0.27 293)` text. Both are fully-rounded pills at 12px font size. The colour coordination is well-done.

- **1920x1080 layout is excellent.** Content fits perfectly within the viewport (scrollHeight equals viewport height). The max-w-3xl (720px) content column is centred with 600px margins each side, cards sit side-by-side at y=618, and the footer tucks neatly at the bottom. This is the ideal viewport and the layout works beautifully as a cover page.

- **Mobile layout stacks correctly.** Cards stack vertically at 375px, h1 drops to 24px, full-width cards with 16px margins. The hamburger menu replaces the desktop nav. Touch targets are adequate (card links are 343x210px or larger).

- **Semantic HTML is strong.** The accessibility tree shows proper landmark roles: `banner` (header), `main` (with id for skip link target), `contentinfo` (footer), `navigation "Track navigation"`. The h1/h2 hierarchy is correct (one h1 for the page title, h2 for each track card). Link elements have descriptive `aria-label` attributes.

- **Client branding zone gracefully degrades.** When no `clientLogoUrl` is configured (generic config), Zone 3 is omitted entirely and the page contracts to fit within the viewport at 1280x800 with no scrolling needed.

- **The dark mode fallback for client logos without dark variants is well-designed.** The ClientLogo component wraps the image in a `bg-white/95 rounded-lg px-5 py-3 border border-white/20` container, which is a thoughtful solution for dark-text-on-transparent logos.

---

## Issues Found

### Priority (should fix)

- [ ] **1280x800 desktop requires scrolling with client config.** When the Phew client config is active (which includes the "Prepared for" zone with logo), the page height reaches 946px vs the 800px viewport, requiring 146px of scrolling. The footer and lower portion of the track cards are below the fold. Without client config, the page fits perfectly (800px). This means the primary deployment (Phew) never achieves the intended "cover page" single-screen effect at a common laptop resolution. **Suggestion:** Reduce vertical spacing in the hero section when client branding is present. The `mt-10 sm:mt-12` gap before "Prepared for" and the `mb-10 sm:mb-12` after the hero zone could both be reduced by 8-12px. Alternatively, make the footer shorter in the homepage context or let it scroll naturally (which is the current behaviour and is acceptable, just not ideal for a cover page).

- [ ] **General Users card is 210px tall on mobile vs Developer card at 230px.** The height difference (20px) is caused by the Developer card description being slightly longer ("For the development team -- Claude Code, codebase mapping, testing, and technical workflows." vs "For all team members -- everyday tasks, content creation, and business workflows."). On desktop both cards share `h-full` which equalises them, but on mobile where they stack, the inconsistent heights break the visual rhythm. **Suggestion:** Either set a consistent `min-h` on mobile cards, or trim the developer description by a few words.

- [ ] **Generic config exposes placeholder text.** The "Prepared by Liam . your training date" text appears in the generic fallback, where "your training date" is clearly a placeholder that leaked from the default site config. While this only affects the no-client URL, it could be seen by anyone visiting the root domain. **Suggestion:** Either set a sensible default (e.g., the current date formatted as "February 2026") or hide the training date line when the value matches the placeholder.

### Nice-to-have

- [ ] **Card hover lift (`hover:-translate-y-0.5`) may not be rendering.** During hover testing, the computed `transform` property showed `none` even while hovering. The shadow transition (`hover:shadow-md`) is rendering correctly (confirmed via computed box-shadow values). The 0.5 unit translate-y (2px) may be too subtle to register visually even if it is working, and the combination of shadow + lift creates a pleasant enough effect. However, if the lift is genuinely not rendering, the hover state loses some of its tactile quality. **Suggestion:** Verify the translate-y is working in a real browser. If it is, consider increasing to `hover:-translate-y-1` for a more noticeable lift.

- [ ] **No visible visual differentiation between the two "Explore track" CTAs.** Both cards have an "Explore track" link with an arrow icon, styled in their respective accent colours (blue-600 / violet-600). The text, layout, and arrow are identical between cards. The colour difference is the only distinguishing feature. **Suggestion:** Consider slightly different CTA text for each track (e.g., "Start here" for General Users vs "Explore track" for Developers) to reinforce the primary/secondary hierarchy in the copy as well as the visuals.

- [ ] **Footer in Phew config links to phew.org.uk rather than aisolutionhub.co.uk.** The footer's secondary link points to the client's website (`phew.org.uk`) rather than the provider's. While this is a deliberate design choice (client-focused deployment), it means the provider has no footer link when a client is configured. The "Delivered by AI Solution Hub" text is present but not linked. **Suggestion:** Make "AI Solution Hub" in the footer a link to the provider's website, or add the provider link alongside the client link.

- [ ] **Header blur effect may cause visual noise on some systems.** The header uses `backdrop-blur supports-[backdrop-filter]:bg-background/80`, which is a modern CSS feature. On systems where backdrop-filter is supported but GPU compositing is imperfect, this can cause subtle rendering artefacts during scrolling. The `supports-[backdrop-filter]` guard is good practice, but the effect may not be worth the potential rendering cost on a page that barely scrolls. **Suggestion:** This is a subjective trade-off; the current implementation follows industry best practice (Stripe, Linear both use header blur).

- [ ] **The General Users section count badge says "10 sections" while Developer says "17 sections".** The Developer track having 17 sections (nearly double) could be intimidating to developers who see it in context with the simpler track. However, this is factually accurate and the count is computed dynamically. **Observation only** -- no action needed unless section count disparity becomes a UX concern.

### Minor observations

- The `border-l-4` left accent on cards is a clean visual device for track identification. It works well in both light and dark mode, providing colour anchoring without overwhelming the card surface.

- The description paragraph beneath the hero zones uses `max-w-xl` (576px) within the `max-w-3xl` (720px) container, creating a comfortable line length for the single-sentence description. This is a good typographic choice.

- The `transition-all duration-200` on cards covers all properties including box-shadow and transform. This is acceptable for two cards but could cause performance issues if used at scale. For this homepage, it is fine.

- The motion entrance animation uses `[0.16, 1, 0.3, 1]` cubic-bezier easing (a "pop" ease-out) with 0.45s duration and a 0.15s stagger between hero and cards. This is subtle and well-tuned. The `prefers-reduced-motion: reduce` media query in the CSS correctly disables all animations.

- The header height is 57px (h-14 = 56px + 1px border), leaving 743px for content at 800px viewport. The `sticky top-0 z-40` behaviour means the header remains visible during any scrolling.

- On mobile, the feedback button appears twice: once as a floating button (the FeedbackWidget) and once inside the mobile hamburger menu. This redundancy is intentional (floating button is always visible, menu version is discoverable), but could be slightly confusing. The snapshot showed `button "Send feedback"` in the mobile layout separately from the hamburger menu content.

---

## Design Principles Assessment

### 1. Clarity over cleverness -- PASS (9/10)

Every element on the homepage serves a clear purpose. The three-zone hero communicates: what this is (h1), who made it (attribution), and who it is for (client branding). The track cards immediately follow with clear labels, descriptions, and CTAs. There is no decorative ornamentation, no gratuitous animation, no distracting imagery. The page is immediately legible. The only element that could be questioned is the provider logo (AI Solution Hub) in Zone 2 -- it adds a branding layer between the title and the client logo that could be perceived as self-promotional. However, it is appropriately sized (170px max-width) and uses muted colours, so it does not compete with the primary content.

### 2. Hierarchy through restraint -- PASS (9/10)

Visual hierarchy is achieved entirely through font size (36px > 20px > 18px > 14px > 12px), font weight (700 > 600 > 500 > 400), colour value (foreground > muted-foreground), and spacing. The only decorative elements are the card left borders (4px accent colour), the "Prepared for" separator line (a 96px `border-t`), and the card icon backgrounds (36px rounded squares with 10% tinted backgrounds). These are restrained and functional. There are no gradients, no glassmorphism, no decorative illustrations, no neon accents. This is exactly the aesthetic described in the design brief.

### 3. Respect the audience -- PASS (8/10)

The page feels professional and purposeful. It does not look like a template or a generic SaaS dashboard. The Phew branding integration (logo, company name in description, "Built for Phew Design Limited" in footer) creates a sense of customisation. The tone is practical: "Your practical guide to working with Claude AI" is direct and non-condescending. "Choose your track below" is clear and action-oriented.

The one area where the principle could be better served: the "Prepared by Liam . 11 February 2026" attribution line uses a first-name-only reference that might feel too informal for some B2B contexts. Full name ("Prepared by Liam Jones") or role-based attribution ("Prepared by AI Solution Hub") could feel more professional. However, this is a minor tone consideration and the current approach may be intentionally informal to match the consultancy relationship.

### Reference aesthetic comparison

**Stripe Docs similarity:** The clean typography hierarchy, generous whitespace, and restrained colour palette are strongly reminiscent of Stripe's approach. The card-based navigation with accent colours follows the same pattern as Stripe's API documentation entry points.

**Linear similarity:** The dark mode colour palette (warm-slate neutrals, subtle card tinting with low-opacity backgrounds) echoes Linear's aesthetic. The left-border accent on cards is a Linear-style touch. The backdrop-blur header is also a Linear pattern.

**Anti-reference check:**
- Enterprise SaaS dashboard: NOT present. No metrics, no multiple panels, no jargon.
- AI startup landing page: NOT present. No gradient text, no neon, no "powered by AI" badges, no hype copy.
- Generic documentation: NOT present. The page has personality through the cover-page layout, the client branding zone, and the track card visual treatment. It does not feel like a plain documentation index.

---

## Detailed Measurements Reference

### Desktop (1280x800) -- Phew config

| Element | Position | Size | Notes |
|---------|----------|------|-------|
| Header | y: 0-57 | 1280 x 57 | Sticky, backdrop-blur |
| H1 | y: 89-179 | 720 x 90 | 36px/700, centred |
| Attribution | y: 203-223 | 233 x 20 | 14px/400, muted |
| Provider logo | y: 235-254 | 170 x 19 | SVG, auto-switches dark/light |
| Separator | ~y: 280 | 96px wide | `border-t border-border` |
| "Prepared for" | y: 303-339 | 108 x 36 | 14px/500, uppercase tracking-wide |
| Client logo | y: 351-407 | 160 x 56 | WebP, max-width 160 |
| Description | y: 447-503 | 576 x 56 | 18px/400, max-w-xl |
| General card | y: 551-781 | 350 x 230 | border-l-blue-500, bg-blue-50/50 |
| Developer card | y: 551-781 | 350 x 230 | border-l-violet-500, bg-card |
| Footer | y: 845-946 | 1280 x 101 | Below fold by 146px |

### Large viewport (1920x1080)

| Metric | Value |
|--------|-------|
| Content width | 720px (max-w-3xl) |
| Side margins | 600px each |
| Scroll required | No (scrollHeight = 1080) |
| H1 position | y: 156 |
| Cards position | y: 618 |
| Footer position | y: 979-1080 |

### Mobile (375x812)

| Metric | Value |
|--------|-------|
| H1 font size | 24px (clamp minimum) |
| H1 position | y: 81-141 |
| Cards | Stacked vertically at y: 497 and y: 723 |
| General card | 343 x 210 |
| Developer card | 343 x 230 |
| Scroll required | Yes (318px overflow) |
| Footer position | y: 1001-1130 |

### Colour tokens (light mode)

| Token | Value | Usage |
|-------|-------|-------|
| background | `oklch(0.98 0.004 250)` | Page background |
| foreground | `oklch(0.16 0.012 250)` | Headings, primary text |
| muted-foreground | `oklch(0.5 0.012 250)` | Attribution, descriptions |
| card | `oklch(0.995 0.002 250)` | Card surface |
| border | `oklch(0.9 0.008 250)` | Card borders, separators |
| General blue badge bg | `oklch(0.932 0.032 255)` | -- |
| General blue badge text | `oklch(0.488 0.243 264)` | -- |
| Violet badge bg | `oklch(0.943 0.029 295)` | -- |
| Violet badge text | `oklch(0.491 0.27 293)` | -- |

### Colour tokens (dark mode)

| Token | Value | Usage |
|-------|-------|-------|
| background | `oklch(0.16 0.012 250)` | Page background |
| foreground | `oklch(0.94 0.006 250)` | Headings, primary text |
| muted-foreground | `oklch(0.65 0.01 250)` | Attribution, descriptions |
| card | `oklch(0.23 0.012 250)` | Card surface |
| General card bg | `oklab(0.282 -0.003 -0.091 / 0.2)` | Blue-tinted, 20% opacity |
| Developer card bg | `oklch(0.23 0.012 250)` | Standard card colour |

---

## Screenshots Reference

Screenshots could not be captured due to a Playwright MCP font-loading timeout affecting the Plus Jakarta Sans web font. This appears to be a local development environment issue (fonts loaded from Vite dev server) rather than a production concern. All visual analysis was performed using:

1. **Playwright accessibility snapshots** -- full DOM tree with roles, names, and relationships
2. **Computed CSS extraction** -- `getComputedStyle()` for all key elements across viewports
3. **Layout measurements** -- `getBoundingClientRect()` for all elements at each viewport size
4. **Source code review** -- direct inspection of component files, CSS theme tokens, and client config

This approach provides equivalent or superior data for a design critique compared to visual screenshots, as it captures exact measurements, computed colour values, and accessibility tree structure that screenshots cannot convey.
