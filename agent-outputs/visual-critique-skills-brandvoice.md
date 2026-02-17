# Visual Critique: Skills, Extensions & Decision Tree

**URL:** http://localhost:4100/general/skills-extensions
**Date:** 2026-02-17

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Visual Quality | 8/10 | Strong typography hierarchy, good use of semantic colours in badges and callouts. Code block area is well-presented with syntax highlighting. Minor: the full-page screenshot reveals very long vertical scroll — consider whether all sections need to be expanded by default. |
| Layout & Responsiveness | 7/10 | Desktop layout is clean with sidebar and max-width constraint. Tablet view properly hides the sidebar and shows the hamburger menu. Mobile view uses card layouts for tables (good). However, the "On this page" TOC at the top uses a two-column layout that may feel cramped at smaller viewport widths. The code block in the UK English Skill example truncates horizontally without a clear scroll affordance on first glance. |
| Interaction Design | 7/10 | Decision tree accordion and reference card accordion both work. The "Learn more in the reference card" button with scroll-to-card behaviour is a nice touch. Copy button on code blocks is present. However, the "Advanced / Developer features" collapsible button lacks a clear visual indicator that it is expandable at a glance — the chevron is subtle. Accordion items in the decision tree section lack visual distinction from the reference card accordions below — they look identical. |
| Content Quality | 9/10 | Excellent UK English throughout. All company references use siteConfig (parameterised). Tone is practical, non-condescending, SMB-appropriate. Content is well-structured with clear section headings. The general-track view appropriately hides developer-only content and uses friendly language like "Claude's working memory" instead of "context cost". |
| Accessibility | 8/10 | Proper aria-labelledby on sections. Tables have scope="col" on headers. Check and Minus icons have aria-labels. Mobile card alternatives are provided for all tables (good). The TooltipTrigger pattern avoids wrapping table cells. Minor concern: the TOC navigation could benefit from aria-current or similar when scrolled to a section. |
| **Overall** | **7.8/10** | A well-structured, content-rich page that serves both general and developer audiences effectively. The main weakness is the sheer length of the page which could benefit from better wayfinding cues as you scroll. |

## Issues Found

### Critical (must fix before templatisation)
- [ ] **Navigation instability on page transitions** — When navigating to `/general/skills-extensions` from certain browser states or after interacting with the page, the URL sometimes silently redirects to other pages (`/general/context`, `/general/welcome`, `/general/starter-kit`). This was reproducible across multiple fresh browser sessions. The full-page screenshot consistently renders correctly when the URL is initially set, but subsequent viewport screenshots sometimes show a different page's content. This appears to be a React Router or Sidebar interaction issue rather than a visual issue per se, but it directly affects the user experience. — All viewports

### Important (should fix)
- [ ] **Code block horizontal truncation** — The UK English Skill code block (`Example: UK English Skill` section) shows text cut off at the right edge with no visible horizontal scrollbar or scroll affordance. Lines like `description: >  Enforce UK English spelling, grammar, and con...` are truncated. Users may not realise there is more content to see. — Desktop 1440px
- [ ] **TOC "On this page" section label mismatch** — The TOC lists "Context Cost Summary" but the rendered section heading for general users says "Impact on Claude's Working Memory". The TOC should show the audience-appropriate label. — Desktop, all viewports
- [ ] **Very long page with no scroll-to-top or sticky TOC** — The page is approximately 4,800px tall at desktop. Once users scroll past the "On this page" navigation at the top, there is no way to quickly jump back or navigate between sections. A sticky TOC or floating back-to-top button would significantly improve usability. — Desktop 1440px, Tablet 768px
- [ ] **Decision tree and Reference card accordions look identical** — Both use the same visual treatment (rounded-lg border, same padding, same typography). The decision tree should feel more interactive/prominent since it is the page's primary interactive tool. The reference cards are a secondary lookup resource. — Desktop 1440px

### Minor (nice to have)
- [ ] **"Advanced / Developer features" collapsible button** — The full-width button with a subtle chevron does not clearly communicate that it is expandable. Consider adding a dashed border or different background treatment to distinguish it from the surrounding content. — Desktop 1440px
- [ ] **Platform Availability table column alignment** — The checkmarks and dashes in the availability matrix are centred, but the "Feature" column text is left-aligned. This is correct behaviour, but the empty cells with the Minus icon feel visually sparse. Consider a light background tint for unavailable cells to improve scannability. — Desktop 1440px
- [ ] **Combination pattern cards have minimal visual hierarchy** — The "How Extensions Work Together" section uses a 2-column grid of cards that all look identical with the same border treatment. Adding an icon or colour accent per pattern would improve scannability. — Desktop 1440px
- [ ] **TOC two-column layout breaks reading order on narrow viewports** — The `columns-1 sm:columns-2` layout means items flow top-to-bottom in column 1, then column 2, which is correct. However, on exactly sm breakpoint (640px), the two-column layout may feel cramped with long labels like "Using Skills with Natural Language". — Tablet 768px

## What Works Well
- The decision tree is an excellent interactive element that guides users to the right extension mechanism. The "What do you want Claude to do?" framing is approachable and user-friendly.
- Proper use of `siteConfig` throughout — company name references are all parameterised, making templatisation straightforward.
- The general/developer track filtering is well-implemented: general users see simplified language ("Claude's working memory" vs "context cost"), and developer-only rows/sections are properly hidden.
- Mobile card alternatives for all table data (Platform Availability, Context Cost) demonstrate thoughtful responsive design.
- The callout card at the top ("You don't need to type a command") immediately reassures general users.
- The "On this page" navigation provides a useful overview of the page structure.
- Semantic HTML with proper heading hierarchy (h2 for section headings, h4 for sub-elements) and aria-labelledby attributes on all sections.
- PlatformBadge component uses distinct colours for each platform, making them easy to scan.
- CostIndicator badges use semantic colours (green for low, yellow for moderate, red for high) that communicate meaning independent of the label text.

---

# Visual Critique: Brand Voice & UK English

**URL:** http://localhost:4100/general/brand-voice
**Date:** 2026-02-17

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Visual Quality | 8/10 | Well-structured with clear visual hierarchy across three parts. The Part badges (Part 1, Part 2, Part 3) with time estimates provide excellent scannability. The green/amber/orange preparation tiers in "What to Prepare" are visually distinct and semantically meaningful. Dark mode rendering is clean. |
| Layout & Responsiveness | 8/10 | Desktop layout is well-contained within max-w-3xl. Tablet view transitions smoothly with the sidebar hidden. The storage options table correctly switches to card layout on mobile (sm:hidden / hidden sm:block pattern). The "How It All Fits Together" section uses a 2-column grid that stacks on mobile. SetupStepCards maintain readable layout at all widths. |
| Interaction Design | 7/10 | Collapsible skill file viewers work well with clear "View full UK English skill file" / "View full brand-review skill file" buttons. The framework sections accordion is functional. PromptExample card has copy button with proper hover reveal pattern. However, the copy button on SetupStepCard's copyable text areas uses `sm:opacity-0 sm:group-hover:opacity-100` which means the copy button is invisible until hover on desktop — users may not know it is copyable. |
| Content Quality | 9/10 | Excellent UK English throughout. Parameterised company name via siteConfig in framework section examples, callout titles, and developer notes. Tone is practical and non-condescending. The three-part structure (UK English quick win, Brand Voice deeper exercise, How it all fits together) creates a clear progression. The "Team session recommended" callout is a nice practical touch. |
| Accessibility | 8/10 | Motion.section elements have proper aria-labelledby attributes. Tables have scope="col" on headers. Collapsible triggers use Button with asChild for proper keyboard handling. The preparation tier blocks use semantic colour classes. Minor: the time estimate badges inside SetupStepCards are purely visual — they could benefit from an aria-label like "Estimated time: 30 seconds". |
| **Overall** | **8.0/10** | A well-crafted page that clearly guides users through a progression from quick win to deeper exercise. The content quality is high and the visual structure effectively communicates the effort/reward balance. |

## Issues Found

### Critical (must fix before templatisation)
- [ ] **Same navigation instability as Skills page** — The Brand Voice page experiences the same routing issue where navigating to `/general/brand-voice` sometimes resolves to `/general/context` or `/general/sessions`. This appears to be a systemic issue affecting all section pages, not specific to Brand Voice. — All viewports

### Important (should fix)
- [ ] **Copy button invisible on desktop for SetupStepCard copyable text** — The CopyButton in SetupStepCard uses `sm:opacity-0 sm:group-hover:opacity-100`, meaning on desktop the copy button is completely invisible until the user hovers over the text area. There is no visual cue that the text is copyable. This breaks the project principle that "every copyable code block, prompt, or template must have a copy button" — the button exists but is not discoverable. — Desktop 1440px, Tablet 768px
- [ ] **PromptExample copy button also hidden until hover** — Same pattern as SetupStepCard: `sm:opacity-0 sm:group-hover:opacity-100`. The brand voice setup prompt is a large, important copyable element but the copy button is invisible on desktop until hover. Consider keeping copy buttons always visible, or at minimum showing them at reduced opacity. — Desktop 1440px
- [ ] **Framework sections accordion items have no "expand all" option** — There are 7 framework sections, each requiring individual clicks to explore. For users preparing for the brand voice exercise, an "Expand all" button would be helpful. — Desktop 1440px
- [ ] **Part 2 "Brand Voice Setup" section is very long** — This section contains: What to Prepare, Seven Framework Sections, Kick Off the Brand Voice Setup, Where to Save, Using Brand Review. It spans a significant portion of the page. Consider whether sub-navigation or a local TOC (similar to the Skills page's "On this page" nav) would help users find what they need. — Desktop 1440px

### Minor (nice to have)
- [ ] **Time estimate badges inconsistent across parts** — Part 1 has a green badge ("2 minutes"), Part 2 has an amber badge ("30-60 minutes"), but Part 3 has no time estimate badge. Adding a brief estimate for Part 3 (even "5 minutes reading") would maintain consistency. — Desktop 1440px
- [ ] **"Related Sections" at the bottom feels disconnected** — The related sections links at the very bottom of the page may never be seen by users who navigate away after finding what they need in Parts 1-3. Consider placing cross-references inline within the relevant sections instead. — Desktop 1440px
- [ ] **Preparation tier blocks use different border-left colours** — The three preparation tiers use `border-success/40`, `border-info/40`, and `border-important/40`. While the colour coding is intentional (green = minimum, blue = recommended, orange = nice-to-have), the priority ordering may not be immediately obvious. Consider adding a subtle numbered indicator or explicit priority label. — Desktop 1440px
- [ ] **Collapsible skill file viewers use ghost Button variant** — The "View full UK English skill file" and "View full brand-review skill file" buttons use `variant="ghost"` with full width. They look like plain text links rather than expandable sections. The chevron icon helps, but adding a subtle border or background would improve discoverability. — Desktop 1440px
- [ ] **Dark mode: preparation tier blocks have slightly low contrast** — The border-left colours on the preparation tiers (green, blue, orange) become quite subtle in dark mode. The text content is still readable, but the colour-coded left border — which is the primary visual differentiator — loses impact. — Dark mode 1440px

## What Works Well
- The three-part structure (UK English, Brand Voice, How It Fits Together) creates an excellent progression from quick win to deeper exercise. This matches the "confidence + trust" emotional goal.
- SetupStepCard component is well-designed with numbered circles, title + time badge, description, and optional copyable text. It provides a clear step-by-step experience.
- The preparation tier blocks ("Minimum required", "Strongly recommended", "Nice to have") are a smart design pattern that sets realistic expectations.
- Framework sections accordion provides just enough detail per section without overwhelming the page. The `siteConfig.companyName` examples make it concrete and relatable.
- The PromptExample component for the brand voice setup prompt is well-structured with title, description, prompt body, context note, and when-to-use note.
- The "How It All Fits Together" section with side-by-side Quick Win and Deeper Exercise cards provides an excellent visual summary of the page's two main activities.
- Cross-references to related sections (Skills & Extensions, AI Governance Policy) help users navigate the broader playbook.
- The developer track appropriately shows additional content (CLAUDE.md rule, Britfix hook, platform tabs) without cluttering the general track.
- Dark mode rendering is generally good — text is readable, semantic colours maintain their meaning, and the overall structure remains clear.
- All company-specific references use `siteConfig`, making the page fully parameterised for client rebranding. The framework section examples dynamically reference `siteConfig.companyName`, `siteConfig.complianceArea`, `siteConfig.primaryProduct`, and `siteConfig.primaryProductDescription`.
