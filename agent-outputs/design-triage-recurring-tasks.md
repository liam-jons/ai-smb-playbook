# Design Triage: Recurring & Scheduled Tasks

> **Route:** `/general/recurring-tasks`
> **Component:** `app/src/content/general/RecurringTasksSection.tsx`
> **Date:** 17 February 2026
> **Method:** Source code review + Playwright browser navigation at 1440px and 375px viewports (light mode)

---

## Verdict

**Full critique NOT needed -- cross-page fixes are sufficient, plus one parameterisation sweep.**

This page is well-structured, uses appropriate components, and follows the playbook's design patterns consistently. There are no interactive tools requiring the "tools feel distinct" treatment (the prompts already use the `PromptExample` card component which provides clear visual differentiation). The primary page-specific concern is the volume of hardcoded client-specific content ("Phew!") that needs parameterisation before templatisation. This is a content/config task, not a design critique task.

---

## Known Cross-Page Issues Present

- [x] **C1 Routing bug** -- PRESENT. This page uses `TrackLayout.tsx` as its layout wrapper (all content pages do). The viewport-resize routing bug described in the synthesis applies here. No page-specific mitigation needed; the fix is in `TrackLayout.tsx`.
- [x] **I4 Dark mode card/surface contrast** -- PRESENT. The `PromptExample` component uses `<Card>` which renders with `bg-card`. The pattern cards use `border border-border` containers without explicit background (inherits page background), and the "Phew! example" blocks use `bg-muted/30`. The dark mode contrast issue from the synthesis (card vs page background too subtle) applies to the 7 `PromptExample` cards on this page. The pattern cards themselves are border-only and may fare slightly better.
- [x] **I17 CalloutCard `role="alert"` misuse** -- PRESENT. This page uses 3 `CalloutCard` instances:
  1. `variant="important"` -- "The practical takeaway" (line 357). This is informational, not an alert. `role="alert"` is inappropriate.
  2. `variant="info"` -- "Current limitations" (line 437). Informational. `role="alert"` is inappropriate.
  3. `variant="warning"` -- "Limitations" within Pattern 2 Browser Automation (line 721/817). This is arguably closer to a genuine warning, but still static content that does not require assertive announcement.
  All three inherit `role="alert"` from the underlying `Alert` component in `components/ui/alert.tsx` (line 30). The shared-component fix covers this.
- [x] **I1 Content area narrow at 1440px** -- PRESENT. Content is constrained by `max-w-[75ch]` in `TrackLayout.tsx:139`. The pattern cards, prompt examples, and getting-started steps would all benefit from more horizontal space at wide viewports. This is a shared layout issue.
- [x] **N31 Pagination nav width mismatch** -- PRESENT. Pagination is rendered by `TrackLayout.tsx` with `max-w-[65ch]` (line 150) while content uses `max-w-[75ch]` (line 139). This 10ch difference creates a visible alignment mismatch at wider viewports. Shared fix.
- [x] **N56 Feedback FAB overlap on mobile** -- PRESENT. The `FeedbackWidget` renders a fixed button at `bottom-20 right-6` on mobile (`md:hidden`). At 375px, this overlaps the bottom of visible content, particularly the "Related Sections" links and pagination navigation at the end of the page. Shared fix (add `pb-16` on mobile to content area).

---

## Page-Specific Findings

### Critical

None. No critical issues unique to this page.

### Important

1. **Hardcoded client-specific content requires parameterisation (see Content Quality section below).** This is the single most significant page-specific finding. The page has 10+ instances of "Phew!" and Phew-specific business context (LMS, safeguarding partnership, "Accessibility as a Service", client onboarding). These are not referenced from `siteConfig` -- they are hardcoded strings in the component's data arrays. Before templatisation, these must either be moved to a client-specific data file or parameterised through the config system.

2. **`phewExample` field name in the `AutomationPattern` type.** The type interface itself uses `phewExample` as a field name (line 41). This is a structural coupling to the current client that will need renaming (e.g., `clientExample`) during templatisation.

3. **`<ol>` elements use `role="list"`.** Lines 684 and 779 add `role="list"` to `<ol>` elements. This is redundant -- `<ol>` already has an implicit list role. While not harmful, it suggests the author was working around a VoiceOver/Safari quirk where `list-style: none` strips the implicit role. If that is the intention, a comment would clarify; otherwise, it can be removed.

### Nice-to-Have

1. **Pattern cards (desktop) and accordion (mobile) are a good responsive pattern.** The desktop card layout (`hidden sm:block`) and mobile accordion (`block sm:hidden`) is a solid approach. No issues found with the transition between views.

2. **"What is likely coming" collapsible section uses a custom Collapsible implementation.** The `ChevronDown` rotation animation (`rotate-180`) works but uses a manual state toggle. This is fine but slightly different from the `Accordion` pattern used elsewhere on the page. Consistency is a minor concern but not worth changing.

3. **The "Getting Started" section subtitle references "Phew! staff" directly in the JSX** (line 588). This is a rendering string, not a data constant, making it slightly harder to find during parameterisation sweeps.

4. **No entrance animations.** Consistent with issue I3 from the synthesis -- this page loads with no motion choreography. The pattern cards and prompt examples could benefit from staggered entrance animations, but this is a cross-page polish item.

5. **Seven prompt examples in sequence is a long scroll.** The "Ready-to-Use Prompts" section contains 7 `PromptExample` cards stacked vertically. At 1440px this creates a very long section. An accordion or tabbed interface could improve scannability, but the current approach is functional and consistent with other pages.

---

## Content Quality

### Meta-narrative context
**None found.** The page does not reference itself as a playbook page, does not contain "this section will cover..." meta-narrative, and does not break the fourth wall. Content quality is good.

### Third-person language
**Not present.** The page addresses the reader directly ("you", "your team") throughout. Tone is appropriate.

### Editorial notes
**None found.** No TODO comments, placeholder text, or editorial markers in the rendered content.

### Client-specific content
**EXTENSIVE -- this is the primary finding for this page.** The page was flagged in the synthesis as "contains client-specific examples" and this is confirmed. Here is a comprehensive catalogue:

#### Data-level client references (in component data arrays, lines 68-223)

| Location | Content | Type |
|----------|---------|------|
| Line 83-86 | Pattern 1 `phewExample`: "Weekly training report" -- references "LMS data export", "safeguarding partnership team" | Phew-specific business process |
| Line 105-108 | Pattern 2 `phewExample`: "Website accessibility monitoring" -- references "Accessibility as a Service" offering, "client websites" | Phew-specific service offering |
| Line 111-114 | Pattern 2 `additionalExamples`: "Deal / opportunity monitoring" -- references "as discussed during the training" | Training-session-specific reference |
| Line 139-142 | Pattern 3 `phewExample`: "Client onboarding checklist" -- references "setting up a new LMS client" | Phew-specific business process |
| Line 161-163 | Pattern 4 `phewExample`: "Automated code quality check" -- generic enough to keep | Borderline generic |
| Line 199 | Getting Started step 1: "Examples from Phew!: training completion reports, client site accessibility checks, proposal formatting, audit report generation" | Direct Phew! name + specific tasks |

#### Template/prompt-level client references (lines 225-320)

| Location | Content | Type |
|----------|---------|------|
| Lines 225-236 | `weeklyReportPrompt`: references "safeguarding partnership team", training data, completion rates | Phew-specific prompt |
| Lines 238-250 | `websiteChangePrompt`: references "accessibility compliance" | Somewhat generic but Phew-aligned |
| Lines 271-282 | `contractExtractionPrompt` | Generic -- no client specifics |
| Lines 284-294 | `pdfSummaryPrompt` | Generic -- no client specifics |
| Lines 296-305 | `knowledgeBasePrompt` | Generic -- no client specifics |
| Lines 307-320 | `taskIdentifierPrompt` | Generic -- no client specifics |

#### JSX-level client references

| Location | Content | Type |
|----------|---------|------|
| Line 588 | "Practical, actionable steps for Phew! staff to begin automating recurring work." | Direct Phew! name in JSX |
| Line 529 | `whenToUse` for Weekly Training Report: "for the safeguarding partnership team" | Phew-specific |
| Line 536 | `whenToUse` for Website Change Detection: "monitoring client websites" | Somewhat Phew-aligned |
| Lines 700-706, 793-800 | PatternContent and PatternCard render "Phew! example: {title}" as labels | Hardcoded "Phew!" label |
| Lines 708-717, 803-815 | Additional examples also render "Phew! example: {title}" | Hardcoded "Phew!" label |

#### Summary of parameterisation needed

- **Field renaming:** `phewExample` -> `clientExample` in the `AutomationPattern` type and all usages
- **Label renaming:** "Phew! example:" -> parameterised label (e.g., `${siteConfig.companyName} example:` or a generic "Example:")
- **Content extraction:** The 4 `phewExample` objects and `additionalExamples` should be moved to a client-specific data file or made configurable
- **Prompt parameterisation:** `weeklyReportPrompt` references Phew-specific processes and should either be made generic or moved to client config
- **JSX string:** Line 588 needs `siteConfig.companyName` or a generic phrasing
- **Training reference:** Line 113 "as discussed during the training" is a session-specific reference that should be removed or generalised

**Total client-specific items: 14 distinct references across 6 categories.**

---

## Interactive Tools Assessment

This page has **no interactive tools** in the design-principle sense (no calculators, simulators, or step wizards). The interactive elements are:

1. **Accordion** (mobile pattern view) -- standard UI pattern, works correctly
2. **Collapsible** ("What is likely coming") -- standard UI pattern, works correctly
3. **PromptExample cards** with copy buttons -- already visually distinct via the `Card` container component with `Badge variant="outline"` and bordered code blocks

The "interactive tools feel distinct" design principle is not heavily tested on this page. The prompt examples are the closest thing to interactive tools and they already have adequate visual differentiation.

---

## Screenshots

- Viewport screenshot taken at 1440x900 (desktop, light mode) -- page renders correctly with sidebar, content area, and pagination visible
- Viewport screenshot taken at 375x812 (mobile, light mode) -- page renders with mobile header, accordion pattern view, and stacked content
- Accessibility snapshot captured at both viewports -- all interactive elements (accordion triggers, collapsible trigger, copy buttons, navigation links) are present and labelled

---

## Recommendation

**No full design critique needed.** The page is well-built and follows established patterns. The work needed is:

1. **Cross-page fixes** from the synthesis (C1, I4, I17, I1, N31, N56) will address all design/accessibility issues found on this page
2. **Parameterisation sweep** (Important, page-specific) -- 14 client-specific references need extraction before templatisation. This is a content/config task, not a design task. Estimated effort: 1-2 hours.
