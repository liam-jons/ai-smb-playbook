# Design Triage: AI Governance Policy

> **Route:** `/general/governance`
> **Component:** `app/src/content/general/GovernancePolicySection.tsx`
> **Triaged:** 17 February 2026
> **Screenshots:** Browser MCP tools were non-functional during this session; analysis is code-based only. Screenshots should be taken manually to verify visual findings.

---

## Verdict

**Cross-page fixes are sufficient** -- with two page-specific content/parameterisation issues that need addressing before templatisation.

This page is one of the strongest in the application. The governance template is genuinely well-designed: it uses `{{PLACEHOLDER}}` variables correctly in the policy text, offers both a walkthrough (accordion) and full-document view mode, provides copy-to-clipboard and download-as-markdown functionality, and includes interactive placeholder badges with tooltip explanations. The risk tier cards are visually differentiated with semantic colour tokens. The page structure is logical (intro -> quick start -> risk tiers -> full policy -> customisation reference -> register template -> appendix -> related sections).

The two page-specific issues that need attention are: (1) a hardcoded "Phew!" reference in descriptive text (line 1067), and (2) a significant amount of Phew-specific content in the register template and risk tier examples that is baked into the component data rather than being parameterised or abstracted.

---

## Known Cross-Page Issues Present

- [x] **C1 Routing bug** -- PRESENT. This page uses `TrackLayout.tsx` as its layout wrapper (confirmed via `SectionPage.tsx` -> `TrackLayout.tsx` outlet pattern). The routing bug on viewport resize affects this page equally.
- [x] **I4 Dark mode card/surface contrast** -- PRESENT. Multiple uses of `bg-muted/30`, `bg-muted/20`, `bg-muted/40`, and `bg-card/50` across the policy content boxes, table rows, and risk tier cards. These will suffer from the same insufficient dark mode contrast identified on other pages.
- [x] **I17 CalloutCard `role="alert"` misuse** -- PRESENT. The page uses `CalloutCard` in two contexts:
  - **Walkthrough mode:** Every accordion section has a `CalloutCard variant="info"` for "Why this matters" annotations (up to 10 instances when all sections are expanded).
  - **Developer track:** Three additional `CalloutCard` instances (`variant="info"`, `variant="tip"`, `variant="warning"`).
  - This means up to 13 `role="alert"` elements could be present on a single page render (developer track, all accordions expanded). This is the worst case of the `role="alert"` misuse across the application -- screen readers will be severely disrupted.
- [x] **I1 Content area narrow at 1440px** -- PRESENT. The content is constrained by `TrackLayout.tsx` `max-w-[75ch]`. The risk tier cards use `lg:grid-cols-3` which works well at wider widths, but the 75ch constraint means the three-column grid is fighting for space. The customisation reference table and register template would benefit from wider content area. The full policy document view (walkthrough mode off) is particularly affected since it's a wall of text in a narrow column.
- [x] **N31 Pagination nav width mismatch** -- PRESENT. `TrackLayout.tsx` uses `max-w-[75ch]` for content but the pagination nav also uses `max-w-[75ch]` (was originally `max-w-[65ch]` per the synthesis doc -- this may have been fixed already; current code shows `max-w-[75ch]` on line 150). If still at `65ch`, the mismatch is visible.
- [x] **N56 Feedback FAB overlap on mobile** -- PRESENT (global). The `FeedbackWidget` FAB is `fixed bottom-20 right-6 md:hidden`. At 375px, it will overlap the bottom of scrollable content and the "Related Sections" cross-reference links. No `pb-16` safe zone padding is present.

---

## Page-Specific Findings

### Critical

None unique to this page. All critical issues are cross-page.

### Important

#### I-GOV-1: Hardcoded "Phew!" reference in descriptive text (line 1067)

The register template description reads:

```
A starting register pre-populated with the extensions from the Phew! starter kit.
```

This is not inside the `{{PLACEHOLDER}}` template -- it is in the page's descriptive UI text (line 1066-1067). It should either:
- Reference `siteConfig.companyName` or a similar parameterised value, or
- Be made generic: "A starting register pre-populated with the extensions from the starter kit."

**File:** `app/src/content/general/GovernancePolicySection.tsx`, line 1067

#### I-GOV-2: Register template contains Phew-specific extensions

The `registerTemplate` constant (lines 406-412) includes Phew-specific entries:

| Extension | Why it's Phew-specific |
|-----------|----------------------|
| `uk-english` | Part of Phew's starter kit |
| `brand-voice` | Part of Phew's starter kit |
| `brand-review` | Part of Phew's starter kit |
| `context7` | From Phew's plugin setup |
| `coderabbit` | From Phew's plugin setup |

These are reasonable examples, but they should either be: (a) parameterised per-client via a data file or config, or (b) documented as "example entries -- replace with your extensions" more prominently. Currently the template presents them as if the reader already has these installed.

#### I-GOV-3: Risk tier examples reference Phew-specific tools and domain context

The `riskTiers` data array contains references that are specific to Phew Design's context:

- **Tier 2 examples:** "Britfix (UK English post-processing)" -- Phew-specific hook
- **Tier 3 characteristics:** "safeguarding information" -- Phew's industry domain (safeguarding software)
- **Tier 3 examples:** "safeguarding data or personal information" -- Phew's industry domain
- **Section 9 (Data Protection):** References "GDPR, ISO 27001, and Cyber Essentials Plus" and "safeguarding case data, child protection information, or vulnerable person records" -- all specific to Phew's compliance posture and industry

These are embedded in the `policySections` and `riskTiers` data constants. For templatisation, these would need to be abstracted into a per-client data overlay or made more generic. Currently, the `{{INDUSTRY}}` placeholder exists but the surrounding examples are still safeguarding-specific.

#### I-GOV-4: No `siteConfig` usage at all

The component imports `useTrack` and many UI components but never imports or references `siteConfig` from `@/config/site.ts`. The entire component is self-contained with its own data. While the `{{PLACEHOLDER}}` system is correct for the governance template itself (users fill in their own values), the descriptive text around the template (line 1067 "Phew! starter kit", the register template entries) should use `siteConfig` values.

### Nice-to-Have

#### N-GOV-1: Full policy document view has no markdown rendering

The "Full Document" tab (lines 973-985) renders the entire `fullPolicyText` string using `renderContentWithPlaceholders()` inside a `whitespace-pre-line` div. This means markdown syntax (headings with `##`, bold with `**`, tables with `|`, horizontal rules with `---`) is rendered as raw text, not as formatted HTML. The walkthrough mode handles this well through structured components, but the full document view is significantly less usable.

**Suggested fix:** Either render the full policy with a markdown renderer, or remove the "Full Document" view in favour of the download/copy buttons which already provide the raw markdown.

#### N-GOV-2: Risk tier cards at 375px will stack to single column but may be cramped

The grid is `sm:grid-cols-1 lg:grid-cols-3`. At mobile, all three cards stack. Each card contains substantial text (4 characteristics + 3 examples + approval text). This is a lot of scrolling on mobile. Consider whether a collapsed/expandable format would work better for mobile.

#### N-GOV-3: Accordion sections could use consistent spacing

The walkthrough accordion uses `className="space-y-1"` (line 932) which creates tight spacing between accordion items. This is fine, but the `AccordionContent` also has `space-y-4 pb-5 pt-1` which creates inconsistent internal padding compared to other accordion usages in the application.

#### N-GOV-4: Full policy download filename is generic

The download button (line 814) uses `a.download = 'ai-governance-policy.md'`. Consider using a more descriptive filename that includes the organisation context, e.g. `ai-extension-governance-policy.md`.

#### N-GOV-5: "Extension Type Quick Reference" table not in a scroll container at mobile

The appendix table (lines 1091-1180) uses `overflow-x-auto` on a wrapper div but does not use the `ScrollArea` component with `ScrollBar` like the customisation reference table does. At 375px, the 5-column table may clip without visible scroll affordance.

---

## Content Quality

- **Meta-narrative context:** None found. No "this section covers..." or "as we discussed..." phrasing.
- **Third-person language:** Not present. The page uses direct second-person ("your team", "you do not need") which is correct for the audience.
- **Editorial notes:** None found. No TODO, FIXME, or placeholder-looking content (beyond the intentional `{{PLACEHOLDER}}` variables).
- **Client-specific content:** Multiple instances found (catalogued below).

---

## Parameterisation Status

### Properly parameterised (correct)

These values use the `{{PLACEHOLDER}}` pattern within the governance policy template, which is the intended design -- users replace them with their own values:

| Placeholder | Usage |
|-------------|-------|
| `{{COMPANY_NAME}}` | Used throughout policy text (Sections 1-9) |
| `{{INDUSTRY}}` | Used in Section 9 (Data Protection) |
| `{{TEAM_SIZE}}` | Used in Section 1 (Purpose) |
| `{{EFFECTIVE_DATE}}` | Used in register template and policy header |
| `{{LAST_REVIEWED}}` | Used in policy header |
| `{{POLICY_OWNER}}` | Used in policy header |
| `{{AI_LEAD_NAME}}` | Used in Section 3 (Roles) |
| `{{AI_LEAD_ROLE}}` | Used in Section 3 (Roles) |
| `{{NEXT_REVIEW}}` | Used in register template |

The placeholder system is well-implemented with interactive badges, tooltips, and a customisation reference table.

### Hardcoded client-specific values (need attention for templatisation)

| Location | Hardcoded Content | Severity |
|----------|------------------|----------|
| Line 81 | `example: 'Phew Design Limited'` (placeholder example value) | Low -- example values are acceptable, but should be reviewed per client |
| Line 83 | `example: 'Safeguarding and public sector software'` | Low -- same as above |
| Line 1067 | `"the extensions from the Phew! starter kit"` | **Medium** -- descriptive UI text, not in template |
| Lines 408-412 | Register template rows: `uk-english`, `brand-voice`, `brand-review`, `context7`, `coderabbit` | **Medium** -- these are Phew's specific starter kit extensions |
| Line 157 | `'Britfix (UK English post-processing)'` in Tier 2 examples | Low -- reasonable example but Phew-specific |
| Lines 168, 176 | `'safeguarding information'`, `'safeguarding data or personal information'` in Tier 3 | **Medium** -- industry-specific to Phew |
| Lines 373-380 | Section 9: `'ISO 27001, and Cyber Essentials Plus'`, `'safeguarding case data, child protection information'` | **Medium** -- compliance framework and industry domain specific to Phew |
| Lines 447-452 | Extension type examples: `commit-commands, pr-review-toolkit, security-guidance, coderabbit`, `/brand-review, /revise-claude-md`, `Britfix` | Low -- reasonable generic examples but include Phew-specific tools |
| Lines 1266, 1270, 1281 | Developer implementation notes reference `uk-english`, `brand-review`, `Britfix` | Low -- could be made generic |

### Summary

The `{{PLACEHOLDER}}` system for the template itself is excellent. The issue is that the **surrounding descriptive content, examples, and register template** contain Phew-specific references that are not parameterised. For templatisation, these would need to be either:
1. Moved into a per-client data file (similar to how `siteConfig.ts` works), or
2. Made generic with a note to customise, or
3. Documented as "example content -- replace for your client"

---

## Accessibility Notes

- **CalloutCard `role="alert"` (I17):** This page is the worst offender. Up to 13 alert roles on a single page (developer track, all accordions expanded). Priority fix.
- **Table semantics:** Both tables (`role="table"` on the customisation table, standard `<table>` on the appendix) use proper semantic markup with `<thead>`, `<th scope="col">`, and `<tbody>`. Good.
- **Accordion keyboard navigation:** Uses shadcn/ui `Accordion` which handles keyboard navigation correctly via Radix primitives.
- **Tooltip accessibility:** Placeholder badges use `cursor-help` and `TooltipProvider` from Radix. Tooltip content is accessible.
- **Heading hierarchy:** Clean hierarchy: H2 for each major section, no H3/H4 used. Heading IDs are properly set for `aria-labelledby` on section elements.
- **Section landmarks:** Sections use `<section aria-labelledby="...">` pattern consistently.

---

## Architecture Assessment

The component is well-structured at 1338 lines. The separation between data (types, constants) and rendering (sub-components, main component) is clean. The `renderContentWithPlaceholders()` function is a clever approach to inline placeholder highlighting.

**Reusability concern:** All data is co-located in the component file rather than in a separate data file. For templatisation, the `policySections`, `riskTiers`, `quickStartSteps`, `placeholders`, `registerTemplate`, and `fullPolicyText` constants would need to be extracted to a per-client data file or a shared data file with client overlays. This is a structural change, not a design issue.

---

## Screenshots

Browser MCP tools (both Playwright and Chrome DevTools) were non-functional during this triage session -- tools accepted commands without errors but did not produce output files. Visual verification should be done manually at:
- Desktop: 1440x900, light mode
- Mobile: 375x812, light mode
- Desktop: 1440x900, dark mode (to verify I4 card contrast)

Key visual areas to check:
1. Risk tier cards at `lg:grid-cols-3` -- do they fit within the `max-w-[75ch]` constraint?
2. Full policy document view -- how does raw markdown look in the `whitespace-pre-line` container?
3. Customisation reference table at 375px -- does the `ScrollArea` horizontal scroll indicator appear?
4. Appendix table at 375px -- does `overflow-x-auto` provide adequate scroll affordance?
5. Feedback FAB overlap with "Related Sections" links at 375px
