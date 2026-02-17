# Design Critique: Brand Voice & UK English

**File:** `app/src/content/general/BrandVoiceSection.tsx`
**Lines:** ~1,017
**Date:** 2026-02-17
**Session:** 23

## Executive Summary

Well-structured, content-rich instructional page with strong three-part structure and good progressive disclosure. Primary weakness is reusability: seven hardcoded `phewExample` blocks, a Phew-specific callout, and industry terminology are embedded directly rather than parameterised. Secondary concerns: hover-only copy button visibility for general track (a11y gap), storage table cramped on mobile, absence of entrance animations.

**Overall weighted score: 3.7 / 5**

## Score Table

| # | Dimension | Score | Key Notes |
|---|-----------|:-----:|-----------|
| 1 | Visual Hierarchy | 4 | Strong three-part structure with badges, time estimates. No entrance animations. |
| 2 | Component Quality | 4 | Clean composition. Duplicated step-rendering JSX between tracks. |
| 3 | Responsiveness | 3 | overflow-x-auto on table, sm: breakpoints. Table cramped on mobile. |
| 4 | Accessibility | 4 | aria-labelledby, aria-hidden, roles correct. Hover-only copy buttons gap. |
| 5 | Interactivity | 4 | Copy buttons on all content. CopyButton hidden on touch devices for general track. |
| 6 | Content Density | 4 | Well-balanced. Progressive disclosure manages load. Part 2 slightly dense. |
| 7 | Code Quality | 4 | Clean TypeScript. Duplicated JSX, hardcoded language detection. |
| 8 | Design Principle Compliance | 4 | Follows P1, P2, P5 well. No decorative excess. |
| 9 | Reusability | 2 | Seven phewExample blocks + callout + labels all hardcoded. Major blocker. |
| 10 | Mobile UX | 4 | Good touch targets. CopyButton invisible on touch for general track. |

## Prioritised Fix List

### Critical

| # | Issue | Lines | Effort |
|---|-------|-------|--------|
| C1 | Add group-focus-within:opacity-100 to general track CopyButtons | 401, 445 | 5 min |
| C2 | Use sm:opacity-0 pattern (visible on mobile) for general track CopyButtons | 399-401, 443-445 | 10 min |
| C3 | Rename phewExample to clientExample in interface and data | 51, 257+ | 15 min |
| C4 | Extract frameworkSections examples into configurable data layer | 250-314 | 1-2 hours |
| C5 | Parameterise "Head start for Phew!" callout | 610-618 | 30 min |
| C6 | Replace hardcoded "Phew! example" label with dynamic text | 657 | 10 min |

### Important

| # | Issue | Lines | Effort |
|---|-------|-------|--------|
| I1 | Extract duplicated step-rendering JSX into shared component | 377-410, 421-454 | 30 min |
| I2 | Replace storage table with responsive card layout for mobile | 712-762 | 45 min |
| I3 | Add language field to SetupStep; remove hardcoded step.number check | 43, 482 | 15 min |
| I4 | Extract data constants to brand-voice-data.ts file | 36-337 | 30 min |

### Nice-to-Have

| # | Issue | Lines | Effort |
|---|-------|-------|--------|
| N1 | Add entrance animations consistent with peer pages | 348+ | 20 min |
| N2 | Use LucideIcon type instead of typeof Palette | 52 | 2 min |
| N3 | Add scroll-to-anchor support for section IDs | 361, 554, 878 | 15 min |
| N4 | Add visual separators between Part 2 sub-sections | 569-834 | 10 min |
