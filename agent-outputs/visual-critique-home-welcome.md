# Visual Critique: Home Page

**URL:** http://localhost:4100/
**Date:** 2026-02-17

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Visual Quality | 8/10 | Clean, confident design with strong hierarchy. Track cards are well-differentiated with colour-coded left borders. Minor: large vertical gap between hero and track cards creates visual disconnect. |
| Layout & Responsiveness | 8/10 | Good reflow at all breakpoints. Cards stack well on mobile (375px). Tablet (768px) maintains side-by-side cards. Content area well-constrained at desktop. Minor gap/spacing issues. |
| Interaction Design | 7/10 | Track cards are clickable with hover lift effect and arrow affordance. However, "Get started" buttons look like primary CTAs but the entire card is the link, which could confuse users who try to click elsewhere on the card. No visible focus rings in screenshots. |
| Content Quality | 9/10 | UK English throughout. Tone is practical and non-condescending. "Prepared by Liam" and training date are parameterised. "Phew Design" correctly derived from config. No AI hype. Clear track descriptions. |
| Accessibility | 7/10 | Skip-to-content link present. Track cards have aria-labels. Header has nav landmark with aria-label. However: heading hierarchy jumps from h1 to h2 inside CardTitle, which nests an h2 inside a component that may not have the correct DOM hierarchy. No visible focus indicators in screenshots. |
| **Overall** | **7.8/10** | A clean, well-structured landing page that communicates purpose quickly. Follows the Stripe Docs aesthetic direction well -- information hierarchy does the heavy lifting. The two-track concept is immediately clear. |

## Issues Found

### Critical (must fix before templatisation)

- [ ] **Section list on General card starts at 1.5, skipping 1.1--1.4** -- The General Users card shows highlights starting at "1.5 AI Governance Policy", "1.6 Brand Voice & UK English", etc. A new user has no idea what sections 1.1--1.4 are. The "+ 5 more sections" text does not compensate for the confusion of seeing a list that starts mid-way. The Developer card has the same issue (starts at 1.9). This is because the code uses `GENERAL_HIGHLIGHTS` and `DEVELOPER_HIGHLIGHTS` arrays that cherry-pick specific sections. Consider showing the first 4 sections instead, or adding a note like "Including: Welcome, Context, Sessions, Extensions, and..." -- Desktop/tablet/mobile all viewports.

### Important (should fix)

- [ ] **Excessive vertical gap between hero and track cards** -- There is roughly 56-64px of empty space between the subtitle text and the top of the track cards. This pushes the cards below the fold on some laptop screens (at 900px height, the cards are barely visible). Reducing `mb-14 sm:mb-16` on the hero wrapper would bring the cards into view sooner -- Desktop (1440x900).
- [ ] **"Get started" buttons appear as standalone CTAs but the entire card is clickable** -- The purple/blue "Get started" buttons look like the primary interaction point, but the entire card is wrapped in a `<Link>`. Users may click the card body expecting nothing to happen, or may not realise they can click the button specifically. Consider either making only the button clickable, or adding a subtle hover state to the entire card (the lift is there but subtle) -- All viewports.
- [ ] **Footer "Send Feedback" link has no underline or button styling** -- In the footer, "Send Feedback" is a plain text button (`<button>` tag) that looks like a link but has no underline. It only shows a colour change on hover. This is inconsistent with footer link conventions -- Desktop, all viewports.
- [ ] **Dark mode: "Prepared by Liam" text and card text have low contrast** -- In dark mode, the muted text elements (subtitle, card descriptions) appear quite dim against the dark background. The primary coloured accent text ("Prepared by Liam") is readable but the surrounding muted text could benefit from slightly higher luminance -- Dark mode (1440px).
- [ ] **No breadcrumb or "You are here" indicator on the home page** -- When arriving at the home page, neither the "General Users" nor "Developers" nav link is highlighted, which is correct. However, the "Phew! AI Playbook" logo/title in the header has no visual indication that it is the current page. Consider a subtle underline or weight change -- Desktop.

### Minor (nice to have)

- [ ] **Track card section numbers use muted/60 opacity** -- The section numbers (1.5, 1.6, etc.) are very faint at 60% opacity of muted foreground. On some screens this may be hard to read -- All viewports.
- [ ] **Mobile (375px): Feedback FAB overlaps "Get started" button area** -- The floating feedback button (bottom-right circle) sits near the bottom of the General Users card's "Get started" button on mobile. Not a functional overlap but visually close -- Mobile (375px).
- [ ] **Cards do not show any section icons** -- The sidebar shows Lucide icons for each section, but the home page track cards only show section numbers and titles. Adding the icons would provide visual consistency -- All viewports.
- [ ] **Animation timing may frustrate returning users** -- The staggered fade-in animation (0.45s + 0.15s delay on cards) means content is invisible for nearly a second on every visit. Consider reducing duration or only animating on first visit -- All viewports.

## What Works Well

- **Strong visual hierarchy.** The heading ("Your practical guide to working with Claude AI") is the clear focal point. Typography sizing via `clamp()` scales well across breakpoints.
- **Track differentiation is excellent.** Blue for General, violet for Developers -- the left border, icon background, and button colours create a clear visual system without being heavy-handed.
- **Parameterisation is clean.** "Phew Design", "Prepared by Liam", and the training date all come from `siteConfig`. No hardcoded client references visible.
- **Mobile layout is sensible.** Cards stack to single-column, the header collapses to hamburger menu, and touch targets (the entire card) are generously sized.
- **Footer is understated and professional.** "Built for Phew Design Limited" with an external link icon is a nice meta-narrative touch. The "Built using the tools and workflows covered in this guide" line adds credibility.
- **Dark mode is well-executed overall.** Card backgrounds shift to a darker surface, text remains readable, and the accent colours (blue/violet) adapt properly with dark-mode variants.
- **The page avoids all anti-references.** No gradients, neon effects, AI badges, or enterprise dashboard complexity. It feels like a clean documentation site landing page.

---

# Visual Critique: Welcome & Orientation

**URL:** http://localhost:4100/general/welcome
**Date:** 2026-02-17

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Visual Quality | 8/10 | Well-structured content hierarchy. Good use of separators between major sections. Starter Kit callout card is visually distinct. Quick Wins cards have clear borders. Quick Reference Card is cleanly typeset. |
| Layout & Responsiveness | 8/10 | Content area constrained to `max-w-3xl` (672px). Line lengths stay within ~65ch for body text (explicitly set via inline style). Sidebar navigation works well at desktop. Mobile shows correct breadcrumb strip. Tablet sidebar visible with good proportions. |
| Interaction Design | 7/10 | Quick Win cards have arrow links but no hover state on the card itself. Starter Kit callout has a group hover. "Download Quick Reference (PDF)" button is clear. "View the process document" and "Send Feedback" links use standard patterns. Navigation links (Go to Brand Voice, etc.) are well-labelled. |
| Content Quality | 9/10 | UK English used consistently ("organised", "customisable", "behaviour"). Tone is practical, warm, and non-condescending. "Following the AI training sessions with your team on 11 February 2026" is well-personalised. The "How This Playbook Was Built" section adds credibility without being self-congratulatory. |
| Accessibility | 7/10 | Correct use of `aria-labelledby` on each section. Icons marked `aria-hidden="true"`. Heading IDs are unique. Semantic `<section>` elements used throughout. However: the heading hierarchy within the page starts at h2 (because h1 is the page title in SectionPage), which is correct. Bullet points in Quick Reference use decorative dots rather than `<ul>` with proper list semantics -- they use `<ul>` but the dots are `<span>` elements rather than list markers. |
| **Overall** | **7.8/10** | A strong orientation page that fulfils its purpose of guiding new users. Content is scannable, well-organised, and immediately actionable. The Quick Wins section is particularly effective. |

## Issues Found

### Critical (must fix before templatisation)

- [ ] **Lazy-loading skeleton is visible for ~500-800ms on page load** -- When navigating to the Welcome page, the content area shows grey placeholder bars (the Suspense fallback) for a noticeable period before the WelcomeSection component loads. For the very first page new users see after choosing a track, this creates a jarring first impression. The skeleton placeholders are generic (uniform grey bars) and do not hint at the actual content structure. Consider either pre-loading the Welcome section or creating a more meaningful skeleton that matches the page's layout -- All viewports.

### Important (should fix)

- [ ] **"Your AI Playbook" heading is an h2 but reads as the main heading** -- Inside the WelcomeSection, "Your AI Playbook" is rendered as an `<h2>` (correctly, since the page title "Welcome & Orientation" is the h1). However, it is styled as `text-2xl sm:text-3xl font-bold` which makes it visually larger and more prominent than many other h2s on the page. This could confuse users who expect "Welcome & Orientation" to be the primary heading they see, but instead they first see a Suspense skeleton, then "Your AI Playbook" appears. Consider reducing the visual weight of this heading or renaming it to something more specific -- Desktop.
- [ ] **Quick Win cards lack hover feedback** -- The Quick Win cards (Set up UK English enforcement, Review the governance policy, etc.) are styled as bordered cards with arrow links, but hovering over the card body provides no feedback. Only the "Go to..." link itself has hover styling. Users may expect the card to be clickable like the home page track cards -- All viewports.
- [ ] **Quick Reference Card bullet points use very small decorative dots** -- The `<span>` elements used as bullet markers are `h-1 w-1` (4px circles). These are extremely small and may be invisible to some users, particularly those with vision impairments. The dots should be at least 6px, or native list markers should be used -- All viewports.
- [ ] **No copy button on the Quick Reference Card content** -- The Quick Reference Card contains prompts and instructions (e.g., the session handoff prompt). While there is a "Download Quick Reference (PDF)" button, there is no copy-to-clipboard button for the card content itself. This contradicts the playbook's principle that "every copyable prompt/template must have a copy button" -- All viewports.
- [ ] **Dark mode: Starter Kit callout card has low contrast** -- In dark mode, the Starter Kit callout card's `bg-primary/5` background is barely distinguishable from the surrounding page background. The text within it ("Drop-in skill files, commands...") is also quite dim. The card loses its visual distinction -- Dark mode (1440px).
- [ ] **Sidebar width compresses content area on tablet** -- At 768px, the sidebar takes up ~280px (w-72), leaving only ~488px for the main content. This is tight for the Quick Reference Card and the wider content sections. The `max-w-3xl` constraint on the content area means the content does not use the full available width -- Tablet (768px).

### Minor (nice to have)

- [ ] **"How This Playbook Was Built" section could be collapsed by default** -- This meta-narrative section is interesting but not actionable. On mobile it pushes the Feedback section further down. Consider making it an expandable accordion or moving it to the footer -- Mobile (375px).
- [ ] **"View the process document" link does not indicate it goes to a different page type** -- The link to `/process` navigates away from the track layout entirely. An external-link icon or "(opens in new layout)" hint would be helpful -- All viewports.
- [ ] **Download Quick Reference (PDF) button alignment** -- On mobile, the button stacks below the heading with `self-start`, which is correct. On desktop, it sits to the right of the heading via `sm:flex-row sm:items-center sm:justify-between`. The alignment works but the button could be slightly closer to the card it references -- Desktop.
- [ ] **Section number "1.1" badge and "All users" badge are small and easy to miss** -- The badges above the page title use `text-xs` and `variant="outline"` / `variant="secondary"`. They communicate important metadata (section number and audience) but are visually very subtle -- All viewports.
- [ ] **Feedback section at the bottom duplicates the header/footer feedback buttons** -- There are three ways to send feedback: the header icon button, the footer text link, and the in-page "Send Feedback" button. The in-page version is fine for discoverability but may feel redundant to returning users -- All viewports.
- [ ] **Mobile feedback FAB (floating action button) overlaps content while scrolling** -- The circular feedback button fixed at the bottom-right of the viewport overlaps with the Starter Kit callout card and other content as the user scrolls -- Mobile (375px).

## What Works Well

- **Excellent content architecture.** The page flows logically: introduction, how to use it, starter kit callout, quick wins, reference card, meta-narrative, feedback. Each section has a clear heading and purpose.
- **Quick Wins section is immediately actionable.** Each card has a specific task, a one-sentence explanation, and a direct link. This is the standout feature of the page -- it gives users something to do right now.
- **Starter Kit callout is visually distinct from prose.** The light blue background, Package icon, and card border make it immediately recognisable as a navigation element rather than content. This follows the design principle of making interactive tools feel distinct.
- **UK English is consistent throughout.** "organised", "customisable", "behaviour", "summarise" -- all correct UK spellings. No American English detected.
- **Tone is warm without being condescending.** "Following the AI training sessions with your team" acknowledges the context. "Everything here is designed to be immediately usable" is encouraging without overselling. The "How This Playbook Was Built" section builds credibility by showing it practises what it preaches.
- **The Quick Reference Card is genuinely useful.** The printable summary with Context Management, Session Handoff, Skills, and UK English tips provides a take-away that users can pin to their desk. The PDF download button is a thoughtful touch.
- **Parameterisation works correctly.** Training date "11 February 2026", consultant name "Liam", and company references all come from `siteConfig`. The page would rebrand cleanly for another client.
- **Separator usage creates clear visual rhythm.** The `<Separator>` components between sections provide breathing room without needing excessive whitespace. The page feels well-paced.
- **Dark mode maintains readability.** While some elements lose contrast (noted above), the overall dark mode treatment is solid. Text hierarchy remains clear, and the Starter Kit callout adapts its colours.
- **Previous/Next pagination at the bottom is well-implemented.** "Next: How Context Works" with a chevron icon provides clear forward navigation. The absence of a "Previous" link (since this is the first section) is correctly handled with empty space rather than a disabled state.
- **Sidebar correctly highlights the current section.** The "1.1 Welcome & Orientation" link in the sidebar shows with the primary colour background, making the user's position in the playbook immediately clear.

---

## Cross-Page Observations

### Consistent Patterns (Positive)
- **Header is consistent across both pages.** Logo, track links, feedback/settings icons -- identical treatment.
- **Footer is identical.** "Built for Phew Design Limited" with the meta-narrative tagline.
- **Colour system is coherent.** Primary blue for UI controls, violet for developer track, muted foreground for secondary text.
- **Typography hierarchy is consistent.** Page titles use `text-2xl sm:text-3xl font-bold`, section headings use `text-xl font-semibold`, body text uses `text-base` or `text-sm`.

### Systematic Issues (Need Attention)
- **Lazy loading creates visible jank on every page navigation.** The Suspense fallback skeleton appears briefly on every section navigation. For a documentation site where users navigate frequently between sections, this adds up to a noticeable quality-of-life issue. Consider prefetching adjacent sections or using a faster skeleton.
- **Mobile feedback FAB needs position refinement.** The floating button overlaps content on multiple pages and viewports.
- **Focus states are not visible in any screenshot.** This may be a limitation of the screenshot tool, but focus rings should be verified with keyboard testing.

### Templatisation Readiness
- Both pages are well-parameterised via `siteConfig`. Company name, consultant name, training date, and industry context are all sourced from the config.
- The section highlighting system (GENERAL_HIGHLIGHTS / DEVELOPER_HIGHLIGHTS) on the home page hardcodes specific section slugs. These would need updating for clients with different section configurations.
- The Quick Reference Card content in WelcomeSection is partially hardcoded (e.g., "Claude Desktop: Settings > Skills > Add from file."). This is product-specific rather than client-specific, so it is appropriate to keep.
