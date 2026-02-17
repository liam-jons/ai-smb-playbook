# Design Triage: Brand Voice & UK English

## Verdict
**Full critique needed -- here's why:**
This page is a key reusability target, but it contains **significant hardcoded client-specific content** that is not parameterised through `config/site.ts`. Seven detailed "Phew! example" blocks, a Phew-specific callout, and multiple references to Phew's industry (safeguarding, IMPACT values, ISO certifications) are baked directly into the component's data constants. These would need to be extracted into a client-configurable data layer or config overlay before the page can be reused for another client. Beyond the reusability issue, the page also has the I17 `role="alert"` accessibility misuse affecting all five CalloutCard instances.

## Known Cross-Page Issues Present
- [ ] **C1 Routing bug on viewport resize** -- Not applicable to this page specifically. `TrackLayout.tsx` is used (the page renders inside it via `<Outlet />`), so the cross-page fix applies here. No page-specific routing logic.
- [x] **I4 Dark mode card/surface contrast** -- Present. Multiple `bg-muted/40`, `bg-muted/30`, `bg-muted/20`, and `bg-muted/50` patterns used for copyable text boxes, table headers, table row striping, accordion content backgrounds, and collapsible trigger hover states (lines 398, 442, 655, 715, 746, 514, 811). These low-opacity muted backgrounds may lack sufficient contrast in dark mode.
- [x] **I17 CalloutCard `role="alert"` misuse** -- Present. The underlying `Alert` component (`app/src/components/ui/alert.tsx`, line 30) has `role="alert"` hardcoded. This page uses **5 CalloutCard instances** (lines 491, 610, 689, 791, 839, 852), all of which are static informational/tip content -- not live alerts. Screen readers will announce these as alerts, which is semantically incorrect and can be disorienting.
- [x] **I1 Content area narrow at 1440px** -- Present. `TrackLayout.tsx` constrains content to `max-w-[75ch]` (line 139). At 1440px with the sidebar open (w-72 = 288px), the content area is limited to approximately 75 characters width. The page has a data table (storage options, line 712) that may feel cramped.
- [x] **N31 Pagination nav width mismatch** -- Present. Content area uses `max-w-[75ch]` (TrackLayout line 139) but pagination nav uses `max-w-[65ch]` (TrackLayout line 150). The "Previous/Next" navigation will be narrower than the content above it.
- [ ] **N56 Feedback FAB overlap on mobile** -- Not directly verifiable via source code (requires visual check). The Feedback FAB is rendered in `AppLayout`, not in this component. Likely present as a cross-page issue but cannot confirm overlap with specific elements on this page without screenshots.

## Page-Specific Findings

### Critical
None.

### Important

1. **Client-specific content is deeply embedded, not parameterised (Reusability blocker)**
   The entire "Seven Framework Sections" area contains hardcoded Phew! examples in a `frameworkSections` data array (lines 250-314). Each of the 7 sections has a `phewExample` field with Phew-specific brand voice content. The callout on line 610-618 ("Head start for Phew!") references IMPACT values and a "website scrape" that only applies to Phew Design. None of this content flows from `config/site.ts`. To reuse this page for another client, a developer would need to:
   - Extract all 7 `phewExample` strings into a client-configurable data source
   - Conditionalize or remove the "Head start for Phew!" callout
   - Replace or parameterise all Phew-specific industry terms (safeguarding, LSCP, ISO 9001/27001, Cyber Essentials Plus, "learning management system")

2. **Five CalloutCard instances with incorrect `role="alert"` (I17)**
   All five callouts on this page are static content:
   - "Code context rule" (info variant, line 491)
   - "Head start for Phew!" (tip variant, line 610)
   - "Team session recommended" (tip variant, line 689)
   - "Session management tip" (info variant, line 791)
   - "Governance note" (tip variant, line 839)
   - "Skill design reference" (info variant, line 852)

   None of these represent live, time-sensitive alerts. They should use `role="note"` or `role="complementary"`, or no ARIA role at all (with appropriate semantic HTML).

### Nice-to-Have

1. **CopyButton visibility relies on hover (lines 399-401, 443-445)**
   The `CopyButton` on the general track's copyable text boxes uses `opacity-0 group-hover:opacity-100`. This makes the copy affordance invisible until hover, which is not discoverable on touch devices or for keyboard-only users. The developer track uses `CodeBlock` which presumably has a persistently visible copy button -- the general track should match.

2. **Data table may be cramped on narrow viewports**
   The "Where to Save the Brand Voice Document" table (line 712) uses `overflow-x-auto` which is correct, but at 375px mobile width the three-column table will likely require horizontal scrolling. Consider a stacked card layout for mobile.

3. **Collapsible button full-width styling**
   The "View full UK English skill file" and "View full brand-review skill file" collapsible triggers (lines 511-525, 808-821) use `w-full` with `justify-between`, which creates a large tap target but may look visually heavy as a full-width ghost button. Minor polish concern.

4. **Accordion items have border gap**
   The accordion uses `className="space-y-1"` (line 631) creating 4px gaps between items. This is a stylistic choice but means the borders of adjacent items don't merge -- the visual rhythm is slightly irregular compared to a seamless accordion. Very minor.

## Content Quality
- **Meta-narrative context:** None found. No "in this section you will learn..." framing or editorial meta-narrative.
- **Third-person language:** Not present. The content uses second-person ("you", "your") throughout, which is appropriate for an instructional guide.
- **Editorial notes:** None found. No TODO markers, draft placeholders, or editorial comments in the rendered content.
- **Client-specific content:** **EXTENSIVE -- detailed catalogue below.**

### Client-Specific Content Catalogue (Reusability Target)

This is the most significant finding for this page. All items below would need parameterisation or extraction for multi-client reuse:

| Location | Line(s) | Content | Type |
|----------|---------|---------|------|
| `frameworkSections[0].phewExample` | 256-258 | "If Phew! were a person, they would be the knowledgeable colleague who explains safeguarding technology simply..." | Hardcoded example |
| `frameworkSections[1].phewExample` | 265-267 | "Approachable: We are friendly, clear, and jargon-free..." | Hardcoded example |
| `frameworkSections[2].phewExample` | 274-276 | "Primary: safeguarding leads and public sector decision-makers..." | Hardcoded example |
| `frameworkSections[3].phewExample` | 283-284 | "Pillar 1: Safeguarding made simpler... ISO 9001/27001, Cyber Essentials Plus" | Hardcoded example |
| `frameworkSections[4].phewExample` | 292-293 | "Product launch: dial up confidence... The Phew! voice is always present..." | Hardcoded example |
| `frameworkSections[5].phewExample` | 301-303 | "UK English throughout... Sentence case for headings..." | Hardcoded example (less Phew-specific) |
| `frameworkSections[6].phewExample` | 310-311 | 'Use "safeguarding partnership" (not "LSCP")... "safeguarding professionals"' | Hardcoded example |
| CalloutCard title | 612 | "Head start for Phew!" | Hardcoded client name |
| CalloutCard body | 615-617 | "The website scrape has already captured brand-relevant content -- IMPACT values, tone observations, and sector terminology." | Hardcoded reference to Phew-specific deliverable |
| Accordion label | 657 | "Phew! example" (repeated 7 times in UI) | Hardcoded client name |
| Interface type field | 51 | `phewExample: string` | Hardcoded type name |

**Recommendation:** Extract the `frameworkSections` data into a client-configurable file (e.g., `config/brand-voice-examples.ts` or integrate into `config/site.ts`). Rename the `phewExample` field to something generic like `clientExample`. Make the "Head start" callout conditional on whether client-specific preparation data exists.

## Screenshots
Screenshots could not be captured during this session due to a Playwright/Chrome DevTools MCP file output issue. The analysis is based entirely on source code review. The following screenshots should be captured in a follow-up:
- Desktop light mode (1440px) -- full page
- Mobile light mode (375px) -- full page, with attention to the storage options table and feedback FAB overlap
- Dark mode (1440px) -- to verify `bg-muted/*` contrast issues (I4)

## Component Details
- **File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/BrandVoiceSection.tsx` (1017 lines)
- **No external data file imports** -- all data is defined inline in the component file
- **Track-aware:** Uses `useTrack()` hook to show different content for general vs developer tracks
- **Interactive elements:** Tabs (dev track only), Accordion (7 items), 2 Collapsible sections, CopyButton on text blocks, PromptExample with copy
- **No SectionPage wrapper** -- renders directly as a `<div className="space-y-12">`
- **Dependencies:** Accordion, Badge, Tabs, Separator, Collapsible, Button, CodeBlock, PromptExample, CalloutCard, CopyButton (all from project components/ui)
