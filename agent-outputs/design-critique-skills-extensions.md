# Design Critique: Skills, Extensions & Decision Tree

**File:** `app/src/content/general/SkillsExtensionsSection.tsx`
**Lines:** 1,797
**Date:** 2026-02-17
**Session:** 23

## Executive Summary

The Skills, Extensions & Decision Tree page is the most content-dense page in the playbook (~1,800 lines). The data architecture is well-typed, track filtering works correctly, and the content is genuinely useful. However, three structural problems degrade the experience: (1) the decision tree is visually indistinguishable from the reference card accordion, violating Design Principle 3; (2) up to six horizontally-scrolling tables create cognitive overload on mobile; and (3) three client-specific strings are hardcoded.

**Overall weighted score: 3.3 / 5**

## Score Table

| # | Dimension | Score | Key Notes |
|---|-----------|:-----:|-----------|
| 1 | Visual Hierarchy | 3 | Headings consistent; two identical accordion sections create ambiguity |
| 2 | Component Quality | 4 | Well-typed data, clean sub-components, good shadcn/ui usage |
| 3 | Responsiveness | 3 | ScrollArea wraps tables, but 3+ horizontal-scroll tables on one page is poor |
| 4 | Accessibility | 2 | Broken aria-labelledby, no focus management on scroll-to-card, TooltipTrigger on td |
| 5 | Interactivity | 3 | Decision tree functional but visually undifferentiated; setTimeout cross-link is fragile |
| 6 | Content Density | 2 | 6+ tables/accordions on dev track; no table of contents for this long page |
| 7 | Code Quality | 4 | Good TypeScript, minimal prop drilling, minor inline object concern |
| 8 | Design Principle Compliance | 2 | Clear Principle 3 violation; Principle 5 partially met |
| 9 | Reusability | 3 | Three hardcoded "Phew!" references; data model otherwise parameterisable |
| 10 | Mobile UX | 2 | 3+ horizontally-scrolling tables, no card fallback, ScrollBar invisible on touch |

## Prioritised Fix List

### Critical

| # | Issue | Lines | Effort |
|---|-------|-------|--------|
| C1 | Decision tree lacks visual distinction from reference cards (Principle 3) | 1040-1121 vs 1345-1519 | 1-2 hours |
| C2 | Broken `aria-labelledby="intro-heading"` references non-existent element | 980 | 5 min |
| C3 | `scrollToCard` doesn't move focus — keyboard users lose place | 966-975 | 30 min |
| C4 | Add scroll affordance to horizontally-scrolling tables on mobile | 1139-1198, 1589-1660 | 1 hour |

### Important

| # | Issue | Lines | Effort |
|---|-------|-------|--------|
| I1 | Three hardcoded "Phew!" references — parameterise with siteConfig | 419, 998-999, 1078 | 30 min |
| I2 | Replace setTimeout(100) with reliable post-animation scroll | 969-974 | 45 min |
| I3 | Card-based mobile layout for availability/cost tables | 1139-1198, 1589-1660 | 3-4 hours |
| I4 | Increase "Learn more" button touch target to 44px | 1108-1115 | 15 min |
| I5 | Add page-level section navigation for this dense page | top-level | 2-3 hours |

### Nice-to-Have

| # | Issue | Lines | Effort |
|---|-------|-------|--------|
| N1 | Hoist PlatformBadge colours to module scope | 816-821 | 5 min |
| N2 | Replace string-based filters with devOnly boolean | 933-963 | 1 hour |
| N3 | Convert combination patterns table to cards | 1678-1724 | 1 hour |
| N4 | Extract data arrays (~710 lines) to data file | 102-811 | 30 min |
| N5 | Wrap filtered arrays in useMemo | 926-964 | 15 min |
| N6 | Style Collapsible trigger to match accordion | 1229-1242 | 30 min |
