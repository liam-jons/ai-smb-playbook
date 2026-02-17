# Design Triage: Skills, Extensions & Decision Tree

## Verdict
**Full critique needed** -- the decision tree (the page's centrepiece interactive tool) does not feel visually distinct from the surrounding prose/reference sections. Multiple tables may be problematic at mobile widths, and there are several content quality and accessibility issues unique to this page.

## Known Cross-Page Issues Present
- [x] **C1 Routing bug** -- PRESENT. `TrackLayout.tsx` is used (all content pages use it). The viewport-resize routing bug applies here.
- [x] **I4 Dark mode card/surface contrast** -- PRESENT. Extensive use of `bg-muted/20`, `bg-muted/30`, `bg-muted/40` throughout tables, example boxes, and collapsible sections. These low-opacity muted backgrounds may wash out or lose distinction in dark mode.
- [x] **I17 CalloutCard `role="alert"` misuse** -- PRESENT. The underlying `Alert` component (`components/ui/alert.tsx`, line 30) hardcodes `role="alert"` on every instance. This page uses CalloutCard in multiple places: "tip" variant for natural language callout (line 1017), "tip"/"info" variants inside reference cards (lines 1414, 1419), "warning" variants (line 1460), and "info" variants in copyable examples sections (lines 1538, 1778). Most of these are informational tips/notes, not urgent alerts -- screen readers will announce them all as alerts, which is disruptive. **At least 6-8 CalloutCards on this page depending on track.**
- [x] **I1 Content area narrow at 1440px** -- PRESENT. `TrackLayout.tsx` line 139 constrains content to `max-w-[75ch]`. On a 1440px screen with the 288px sidebar, the content area will appear narrow -- especially for the wide data tables (availability matrix, context cost table, combination patterns) which are forced into horizontal scroll at 540-600px minimum widths.
- [x] **N31 Pagination nav width mismatch** -- PRESENT. Content area uses `max-w-[75ch]` (line 139 of TrackLayout) but pagination nav uses `max-w-[65ch]` (line 150 of TrackLayout). The prev/next links will be visually narrower than the content above.
- [ ] **N56 Feedback FAB overlap on mobile** -- UNABLE TO VERIFY visually (browser tools not producing screenshots). Likely present as it is a cross-page issue in the layout shell.

## Page-Specific Findings

### Critical

1. **Decision tree lacks visual distinction from prose (Design Principle 3 violation)**
   The decision tree -- the primary interactive tool on this page -- uses the same `Accordion` pattern and visual treatment as the "Extension Reference" section below it. Both are bordered accordion items with identical styling (`rounded-lg border border-border px-4`). Per Design Principle 3: "Interactive tools feel distinct. Calculators, simulators, and step wizards must be visually differentiated from surrounding prose." The decision tree should have a distinct background, container treatment, or visual framing to signal "this is the interactive tool, not just more content."

2. **`TooltipTrigger` wrapping `<td>` element (invalid HTML)**
   In the `AvailabilityCell` component (lines 854-856), `TooltipTrigger asChild` renders the child `<td>` element. However, `TooltipTrigger` may inject additional DOM attributes or wrapper elements that break the `<table>` > `<tbody>` > `<tr>` > `<td>` hierarchy requirement. This could cause hydration warnings and accessibility tree issues.

### Important

3. **Six data tables on a single page -- cognitive overload risk**
   This page contains:
   - Decision tree accordion (9 entries, dev track)
   - Platform availability matrix table
   - Advanced/Developer features table (general track collapsible)
   - Reference cards accordion (8 entries, dev track)
   - Context cost summary table
   - Combination patterns table
   - Feature layering rules (dev track only)

   For the general track, users still see at least 4 tables plus 2 accordions. This is a lot of structured data on one page with no clear "start here" visual anchor beyond the decision tree.

4. **Accordion-within-accordion pattern for reference cards linked from decision tree**
   The decision tree entries have a "Learn more in the reference card" button that programmatically opens the corresponding reference card accordion item and scrolls to it. This creates an interaction where users click inside one accordion, scroll down to another accordion that auto-opens. The `setTimeout(() => ..., 100)` delay (line 969) for scroll-into-view is fragile -- the accordion animation may not have completed in 100ms, leading to incorrect scroll position.

5. **Horizontal scroll tables at mobile widths**
   The availability matrix (min-width 540px), context cost table (min-width 600px), and combination patterns table (overflow-x-auto) all require horizontal scrolling on mobile. Three horizontally-scrollable tables on one page is a poor mobile experience. The `ScrollArea` + `ScrollBar` wrapper may not be obviously scrollable on touch devices.

6. **Client-specific content hardcoded in component (not in `site.ts`)**
   - Line 419: `"Always use UK English. Our company is Phew Design Limited."` -- hardcoded in Projects setup step
   - Line 998-999: `"Phew! has Claude Teams licences for all staff and Claude Code access for developers."` -- hardcoded in intro text
   - Line 1078: `"Example for Phew!"` -- label on every decision tree example box

   Per the architecture, all client-specific values should be in `config/site.ts`. These references would need manual updates for rebranding.

### Nice-to-Have

7. **"Example for Phew!" label repeated in every decision tree entry**
   Every expanded decision tree item shows a box labelled "Example for Phew!" (line 1078). While the examples themselves are appropriate (UK English, naming conventions, deployment), the repeated label is redundant. Consider showing it once in the section intro or using a more generic label like "Example" with the client name in the section header.

8. **Duplicate "Using Skills with Natural Language" content**
   The natural language trigger guide and UK English skill example appear in two places:
   - For general track: standalone sections (lines 1527-1570)
   - For developer track: in the "Copyable Examples" section (lines 1763-1793)
   This content duplication means both tracks get the same material, which is fine, but the section headers and framing differ slightly which could cause maintenance drift.

9. **Collapsible "Advanced / Developer features" pattern (general track)**
   For general users, developer-only features are hidden behind a `Collapsible` component (lines 1228-1326) labelled "Advanced / Developer features". This is a reasonable progressive disclosure pattern, but the `Button variant="ghost"` trigger has `w-full` which makes the entire width clickable but doesn't look like a standard expandable section -- it looks like a ghost button. Consider using a visual treatment more consistent with the accordions above it.

10. **`role="list"` on `<ul>` and `<ol>` elements is redundant**
    Lines 1373, 1396, 1431 add `role="list"` to `<ul>` and `<ol>` elements. This is technically redundant since these elements have implicit list roles. While it doesn't cause harm, it adds noise to the accessibility tree. (Note: Safari VoiceOver strips list semantics when `list-style: none` is applied via CSS, so this may actually be intentional -- verify with Safari testing.)

## Content Quality

- **Meta-narrative context:** Minimal. One instance at line 985: "This section helps you find the right extension mechanism" -- acceptable as a section introduction, not meta-narrative about the playbook itself.
- **Third-person language:** Not present. Content uses second-person ("you") consistently throughout, which is appropriate.
- **Editorial notes:** Not present. No TODO, FIXME, HACK, or placeholder markers found.
- **Client-specific content found:**
  - `"Phew Design Limited"` -- hardcoded in Projects setup step (line 419)
  - `"Phew!"` -- appears as "Phew! has Claude Teams licences" (line 998) and "Example for Phew!" (line 1078, repeated per accordion entry)
  - No Ghost Inspector or ASP.NET references on this page.

## Accessibility Notes

- **`role="alert"` on all CalloutCards** is the most significant a11y issue. This page has 6-8 CalloutCards (varying by track), all announced as alerts by screen readers. Only the "warning" variant CalloutCards (e.g., "MCP connections can fail silently") arguably merit `role="alert"`.
- **Accordion keyboard navigation** relies on Radix primitives which handle arrow keys and focus management correctly.
- **Tables have proper `<th scope="col">` headers** -- good practice.
- **The `scrollToCard` function** uses `scrollIntoView` which will work for keyboard users but the focus does not move to the opened accordion item -- a keyboard user may lose their place after the scroll.
- **Platform badges** lack explicit text -- the colour alone carries meaning. The badge text (e.g., "claude.ai", "Desktop") provides the accessible name, which is fine, but the colour coding is decorative and not explained in a legend.

## Screenshots

Unable to capture screenshots -- both the Playwright MCP and Chrome DevTools MCP tools were non-functional during this session (commands returned without output or saved files). Visual verification should be performed manually at:
- Desktop: `http://localhost:4100/general/skills-extensions` at 1440px width
- Mobile: same URL at 375px width
- Developer track: `http://localhost:4100/developer/skills-extensions`
- Dark mode: toggle via theme settings

## Recommendation

This page warrants a **full design critique** because:
1. The decision tree -- the page's centrepiece interactive -- violates Design Principle 3 (interactive tools must feel distinct)
2. The density of tables and accordions creates cognitive overload, especially for the general audience
3. Three horizontally-scrolling tables on mobile is a significant responsive concern
4. Client-specific content is hardcoded rather than parameterised
5. The `role="alert"` issue is amplified here due to the high number of CalloutCards

A full critique should focus on: (a) visual differentiation of the decision tree, (b) table consolidation or alternative mobile layouts (e.g., card-based), (c) the cross-accordion linking interaction, and (d) parameterising client content.
