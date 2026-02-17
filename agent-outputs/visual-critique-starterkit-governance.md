# Visual Critique: Starter Kit Contents

**URL:** http://localhost:4100/general/starter-kit
**Date:** 2026-02-17

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Visual Quality | 8/10 | Clean typography hierarchy, good spacing, well-differentiated interactive sections. Quick Start cards and file browser are visually distinct from prose. |
| Layout & Responsiveness | 7/10 | Desktop and mobile both work well. Tablet (768px) with sidebar leaves narrow content area. Code blocks truncate horizontally. |
| Interaction Design | 7/10 | File browser expand/collapse works smoothly. Tabs for Skills/Templates/Prompts are intuitive. "Show all 11 files" button is helpful. Copy buttons present. |
| Content Quality | 9/10 | UK English throughout. Practical tone. Clear section titles. Well-organised adoption roadmap in Quick Start. |
| Accessibility | 7/10 | Proper heading hierarchy. Tab panels use ARIA roles. Accordion items are buttons. Some touch targets may be tight on mobile for the tab list. |
| **Overall** | **7.5/10** | Solid, well-structured page. Main concerns are navigation reliability (URL redirect bug), horizontal overflow in code blocks, and minor mobile layout issues. |

## Issues Found

### Critical (must fix before templatisation)

- [ ] **URL routing instability for Starter Kit page** -- When navigating directly to `/general/starter-kit` via browser address bar (not sidebar click), the page intermittently redirects to `/general/context` or other sections within seconds. This was reproducible across multiple browser sessions. The redirect does not happen when clicking the sidebar link. Likely a race condition in React Router or the track layout redirect logic. This means users who bookmark or share the direct URL may not reach the intended page. -- Desktop, all viewports.

### Important (should fix)

- [ ] **Code block horizontal overflow in Common Install Commands** -- The `Always use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse)...` code block text extends beyond the visible container width on desktop (1440px). The text is truncated with no visible scrollbar or scroll affordance. Users cannot read the full content without interacting with the block. -- Desktop 1440px, all viewports.
- [ ] **Extension Register markdown code block horizontal truncation** -- The markdown table in the "Extension Register Template" section is very wide and gets cut off horizontally. While the code block may support horizontal scrolling, there is no visible scroll affordance (scrollbar or shadow gradient) indicating more content exists to the right. -- Desktop 1440px, mobile 375px.
- [ ] **"How to Customise" table third column truncated on mobile** -- The "Example Value" column in the placeholder table is cut off on mobile (375px), showing partial values like "[To" instead of "[To be confirmed]" and "01/" instead of full dates. The table needs horizontal scroll or a responsive stacked layout at small widths. -- Mobile 375px.
- [ ] **Extension Type Quick Reference table "Maintenance" column hidden on mobile** -- The five-column table loses its rightmost column ("Maintenance") entirely on mobile with no scroll affordance, meaning users on mobile cannot see maintenance requirements for each extension type. -- Mobile 375px.
- [ ] **Floating feedback button overlaps content** -- The circular floating feedback button in the bottom-right corner overlaps with tab labels in the file browser ("Templates" tab text) and with code block content on mobile. It also partially covers the Previous/Next navigation text on the Governance page. -- Mobile 375px.

### Minor (nice to have)

- [ ] **Tab list wraps to two rows on mobile** -- The file browser category tabs (Skills, Templates, Prompts) wrap to two lines at 375px. While functional, this takes up vertical space and could be improved with a horizontally scrollable tab bar. -- Mobile 375px.
- [ ] **No visible selected/active state on file browser tabs at rest** -- The currently active tab (e.g., "Skills 11") has a subtle underline but the visual distinction is minimal. A stronger indicator (background fill or bolder underline) would improve scanability. -- Desktop 1440px.
- [ ] **"Show all 11 files" button placement** -- The button to reveal remaining files sits centred below the visible 5 items, which is acceptable, but after clicking it, there is no way to collapse back to the original 5. This is a one-way expansion with no reverse action. -- Desktop 1440px.
- [ ] **Tablet sidebar consumes significant content width** -- At 768px, the sidebar takes roughly a third of the screen, leaving the main content quite narrow. Line lengths become very short (approximately 45-50 characters). Consider collapsing the sidebar by default at the `md` breakpoint. -- Tablet 768px.
- [ ] **File path in Starter Kit intro uses monospace inline code** -- The path `starter-kit/templates/governance-policy-template.md` in the introduction paragraph renders in monospace inline code style, which is correct but could break awkwardly on narrow viewports. -- Mobile 375px.

## What Works Well

- **Quick Start section is excellent.** The numbered weekly adoption plan with time estimates ("2 minutes", "30-60 minutes", "30 minutes + team discussion") is practical and actionable. The green numbered indicators and faint green background give it a strong visual identity.
- **File browser is well-designed.** The expand/collapse pattern with badges ("All users", "Recommended") provides clear at-a-glance categorisation. The expanded view shows installation instructions per platform (Claude Desktop, claude.ai, Teams Admin) with copy buttons.
- **"How to Install" platform tabs.** Clean tab interface with icons for Claude Desktop, claude.ai, and Teams Admin. The numbered installation steps are clear. The green "Automatic invocation" callout is a helpful explainer.
- **"Download All as ZIP" button.** Prominent placement above the file browser provides a quick bulk action for users who want everything.
- **Copy buttons on every copyable block.** Every code block and installation command has a copy button, consistent with the project's design principles.
- **Completion banner at page bottom.** The "You've completed the General track" banner with links to the homepage and Developer track provides a satisfying endpoint and clear next steps.
- **Dark mode renders well.** Good contrast throughout, the file browser cards adapt properly, and the code blocks have appropriate dark styling.

---

# Visual Critique: AI Governance Policy

**URL:** http://localhost:4100/general/governance
**Date:** 2026-02-17

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Visual Quality | 8/10 | Strong visual hierarchy. Risk category cards with colour coding are effective. Accordion sections are clean. Placeholder badges are distinctive. |
| Layout & Responsiveness | 7/10 | Three-column risk categories stack properly at mobile. Tables overflow on mobile. Tablet view is functional but cramped with sidebar. |
| Interaction Design | 8/10 | Walkthrough/Full Document toggle is useful. Accordion expand/collapse works well. Placeholder tooltips (hover) add discoverability. Copy and Download buttons prominent. |
| Content Quality | 9/10 | Excellent UK English. Parameterised placeholders use siteConfig values correctly. Practical, non-condescending tone. "This is not about creating red tape" sets the right expectation. |
| Accessibility | 7/10 | Accordion uses proper ARIA patterns. Placeholder tooltips require hover (not keyboard-accessible). Tables lack responsive alternatives. Risk category colour-coding alone does not convey tier meaning (but text labels help). |
| **Overall** | **8/10** | One of the strongest pages in the playbook. Well-structured governance content with practical quick-start guidance. Main issues are table responsiveness on mobile and the missing section 6 numbering gap. |

## Issues Found

### Critical (must fix before templatisation)

- [ ] **Section 6 numbering gap in General track accordion** -- The policy accordion shows sections 1, 2, 3, 4, 5, 7, 8, 9, 10. Section 6 ("Technical Standards for Internal Extensions") is correctly hidden for the General track (it is developer-only), but the gap from 5 to 7 looks like a bug to general users who have no context about the developer track. The numbering should either be sequential for each track or include a note explaining the gap. -- Desktop 1440px, all viewports.

### Important (should fix)

- [ ] **Placeholder table overflow on mobile** -- The "How to Customise the Template" table has three columns (Placeholder, Description, Example Value) and the third column is clipped at 375px. Values like "[To be confirmed]" show as "[To" and dates show truncated. This table needs horizontal scroll with a visible scrollbar, or should stack vertically on small screens. -- Mobile 375px.
- [ ] **Extension Type Quick Reference table truncated on mobile** -- The five-column reference table (Type, Risk Tier, Approval, Context Cost, Maintenance) loses its last column on mobile. Users cannot see maintenance requirements. Needs horizontal scroll or a card-based responsive layout. -- Mobile 375px.
- [ ] **Extension Register markdown code block horizontal overflow** -- The pre-formatted markdown register table is very wide and truncates without visible scroll affordance. The rightmost columns (Review Date, Status, Notes) are completely hidden. -- Desktop 1440px, mobile 375px.
- [ ] **Risk category card background colours too subtle in dark mode** -- The green/amber/red background tints on the Tier 1/2/3 risk cards are barely perceptible in dark mode. While the "Tier 1", "Tier 2", "Tier 3" text labels with colour badges compensate, the card backgrounds should have stronger dark-mode variants to maintain the visual grouping effect. -- Dark mode, desktop 1440px.
- [ ] **No interactive form for parameterised values** -- The governance page describes a "fill-in-the-blanks" template approach, but the user must copy the raw markdown and manually find/replace placeholder values. A simple interactive form where users type their company name, industry, team size, etc. and see the values substituted in real time would significantly improve usability and justify calling it "parameterised." Currently the parameterisation is manual. -- All viewports.

### Minor (nice to have)

- [ ] **Placeholder tooltip only accessible via hover** -- The `{{EXAMPLE}}` badges throughout the policy text have tooltips that appear on hover showing what to substitute. These tooltips are not accessible via keyboard focus or screen readers. Adding `tabIndex={0}` to the badge or using a focusable trigger would improve keyboard accessibility. -- Desktop 1440px, all viewports.
- [ ] **"Full Document" view shows raw markdown formatting** -- The Full Document view renders `**bold**`, `##`, and `---` as literal text rather than formatted markdown. While this is intentional (users copy the raw markdown), the visual presentation may confuse users who expect rendered output. A brief note explaining "This is the raw markdown source you can copy and customise" would help set expectations. -- Desktop 1440px.
- [ ] **Quick Start cards lack interaction** -- The three Quick Start cards ("Designate an AI Lead", "Lock down installation permissions", "Build the initial register") look clickable with their card styling, hover state potential, and icons, but they are static display elements. Either make them visually non-interactive (remove card borders/shadows) or link them to relevant sections. -- Desktop 1440px.
- [ ] **"Phew! starter kit" missing space** -- In the Extension Register Template description, "from the Phew!starter kit" is missing a space between "Phew!" and "starter". Should read "from the Phew! starter kit". -- Desktop 1440px, all viewports.
- [ ] **Tablet content area too narrow with sidebar** -- At 768px, the sidebar plus content leaves limited horizontal space for the three-column risk categories and tables. Consider defaulting to collapsed sidebar at this breakpoint. -- Tablet 768px.
- [ ] **Accordion items have identical chevron size** -- All 9 visible accordion items use the same chevron/icon size. No visual weight differentiation between them. For a 10-section policy, sub-grouping (e.g., "Foundation" sections 1-3, "Process" sections 4-6, "Operational" sections 7-10) could improve scanability. -- Desktop 1440px.

## What Works Well

- **"This is not about creating red tape" opening.** The intro immediately addresses the reader's likely concern (bureaucracy) and reframes governance as lightweight and practical. Excellent tone.
- **Quick Start: Three Things to Do This Week.** The three action items with icons and day/week timing badges provide an immediately actionable entry point. Users don't have to read the entire policy to start being compliant.
- **Risk Categories three-tier visual system.** The colour-coded cards (green for Low Risk, amber for Medium Risk, red for High Risk) with characteristics, examples, and approval processes make the tiering system immediately understandable. The cards are visually distinct from the surrounding prose.
- **Walkthrough / Full Document toggle.** Offering both an accordion walkthrough (with annotations per section) and a raw full-document view is a strong design choice. Different users can access the content in their preferred way.
- **Parameterised placeholders are visually distinctive.** The `{{COMPANY_NAME}}` style badges in a monospace code-style font with slight purple/grey background make placeholders immediately identifiable throughout the document. The tooltip on hover showing example substitution values adds discoverability.
- **Accordion annotations ("Why this matters").** Each expanded accordion section includes a "Why this matters" or practical annotation that explains the real-world reason for that policy section. This aligns with the project's principle of practical, non-condescending communication.
- **Extension Type Quick Reference table.** Clean, well-structured table summarising Skills, Plugins, MCPs, Commands, Hooks, and Subagents with their risk tier, approval process, context cost, and maintenance requirements. Provides a useful at-a-glance reference.
- **Copy and Download buttons at the top.** "Copy full policy to clipboard" and "Download as Markdown" are placed prominently, allowing users who just want the file to get it immediately without scrolling through the entire walkthrough.
- **Correct UK date formatting.** All dates use DD/MM/YYYY format and GBP references are UK-appropriate. No American spellings detected.
- **Dark mode is functional and readable.** Text contrast is adequate, accordion items render properly, and the code blocks have appropriate dark styling. Only the risk category background tints need strengthening.

---

## Cross-Page Observations

### Shared Issues
1. **Table responsiveness on mobile is the most consistent weakness.** Both pages have tables that truncate on 375px without scroll affordance. This affects the How to Customise table, Extension Type Quick Reference, and Extension Register Template.
2. **Floating feedback button overlap.** Both pages show the feedback button overlapping interactive content on mobile, particularly tab labels and navigation links.
3. **Tablet sidebar width.** At 768px, the sidebar consumes too much horizontal space, leaving the content area cramped for both pages.

### Shared Strengths
1. **Consistent visual language.** Both pages use the same card styles, callout patterns, code block formatting, and badge system. They feel like parts of the same product.
2. **UK English is flawless.** Both pages use correct UK spellings, date formats, currency references, and business terminology throughout.
3. **Practical, action-oriented structure.** Both pages lead with a "Quick Start" or adoption roadmap before diving into detail. This respects the user's time and provides immediate value.
4. **Dark mode works well across both pages.** Minor risk-category colour issue on Governance aside, both pages render cleanly in dark mode with appropriate contrast.
