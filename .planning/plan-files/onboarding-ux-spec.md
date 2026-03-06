# Onboarding UX Spec: First-Time & Returning User Experience

**Date:** 2026-03-06
**Status:** Ready for implementation
**Estimated effort:** Medium-large (3-4 hours across multiple agents)
**Reference:** Serene Zone onboarding (propel-pathways-39761), Session 41 design review

---

## 1. Problem Statement

The playbook currently treats every visit identically. A first-time visitor arriving from a training email and a returning user checking a specific section four weeks later see the same Welcome page with the same content. There is no progress tracking, no "welcome back" differentiation, and no way for users to know which sections they have already explored.

**Impact:** Returning users (the primary use case -- people dipping back in over weeks) get no signal of progress, no continuity, and no personalised guidance. The playbook feels static rather than alive.

---

## 2. Design Principles (Adapted for This Context)

1. **Lightweight, not ceremonial.** This is a reference tool, not a SaaS product. No modals, no forced tours, no "step 1 of 5" wizards. Users should feel guided, not onboarded.
2. **State without accounts.** All tracking via localStorage. No server-side persistence. Graceful degradation if storage is unavailable.
3. **Respect the returning user.** The biggest gap is returning-user experience. First-run improvements are secondary -- the current first-run flow is already decent.
4. **Progressive, not prescriptive.** Show progress and suggest next steps. Never block access or impose a reading order.
5. **Consistent with existing design language.** Use existing Tailwind tokens, shadcn/ui primitives, and motion patterns. No separate design system needed (unlike Serene Zone, which warranted its own tokens due to complete visual separation).

---

## 3. Feature Set

### 3.1 Visited-State Tracking (Sidebar)

**What:** Subtle visual indicator next to each section in the sidebar showing whether the user has visited it.

**localStorage key:** `playbook-visited-sections`
**Value:** JSON array of section slugs, e.g. `["welcome","context","sessions"]`

**Tracking trigger:** A section is marked as visited when:
- The user navigates to a section route (via React Router)
- The section component mounts and remains visible for 3+ seconds (prevents drive-by marking from fast navigation)

**Visual design:**
- Unvisited: No indicator (current behaviour)
- Visited: Small check icon (Lucide `Check`, 12px) in `text-muted-foreground/50`, positioned to the right of the section title
- Current/active section: Existing active highlight (no change)
- Animation: Fade in on first mark (`opacity 0 -> 1`, 0.3s ease)

**Sidebar changes:**
```
Core Topics
  > Welcome & Orientation          [active highlight]
    How Context Works              check-icon
    Session Management
    Getting Reliable Output
    Extending Claude               check-icon
    ...
```

**Implementation notes:**
- Create a custom hook: `useVisitedSections()` returning `{ visitedSlugs: string[], markVisited: (slug: string) => void, isVisited: (slug: string) => boolean, visitedCount: number, totalCount: number }`
- Hook reads/writes `playbook-visited-sections` in localStorage
- The 3-second delay prevents accidental marking -- use a `setTimeout` in a `useEffect` that clears on unmount
- SSR-safe: guard all localStorage access with `typeof window !== 'undefined'`
- Wrap reads in try/catch (private browsing, full storage)

**Inspired by:** Serene Zone's `serene-breathing-visited` localStorage flag, but extended to per-section granularity.

---

### 3.2 Progress Summary (Welcome Page)

**What:** A compact progress bar/indicator on the Welcome page showing how many sections the user has visited out of the total.

**Placement:** Between the hero section and the Recommended Starting Path / Quick Wins.

**Visual design (returning users with 1+ visited sections):**
```
+----------------------------------------------------------+
|  Your Progress                                3 of 10    |
|  [====------]                                            |
|                                                          |
|  Continue with: Session Management                    -> |
|  (next unvisited section in recommended order)           |
+----------------------------------------------------------+
```

- Rounded-lg card with border, consistent with existing card styling
- Progress bar: thin (4px), `bg-primary` fill on `bg-muted` track, rounded-full
- "Continue with" link: the next unvisited section, determined by section order in the registry
- If all sections visited: replace with a subtle celebration message ("You have explored all sections. Use the sidebar to revisit any topic.")

**Visual design (first-time visitors with 0 visited sections):**
- Do not render the progress card. Show the existing "Recommended Starting Path" block instead.
- The progress card appears on second visit onwards.

**Implementation notes:**
- Uses the `useVisitedSections()` hook
- Section order comes from `getFilteredSectionsForTrack()` (already used in sidebar)
- "Next unvisited" logic: iterate sections in order, return first with `!isVisited(slug)`

---

### 3.3 First-Run vs Returning Welcome Content (Welcome Page)

**What:** Conditional content blocks on the Welcome page based on whether the user has visited before.

**localStorage key:** `playbook-first-visit-ts`
**Value:** ISO timestamp of first visit, e.g. `"2025-10-14T10:30:00.000Z"`

**First visit (no timestamp in localStorage):**
- Show "Recommended Starting Path" block (already implemented)
- Show "How to Use This Playbook" section (already implemented)
- Show "Quick Wins" prominently (already implemented)
- Set `playbook-first-visit-ts` to `new Date().toISOString()`

**Returning visit (timestamp exists):**
- Replace "Recommended Starting Path" with the Progress Summary card (3.2)
- Collapse "How to Use This Playbook" into a subtle expandable (Collapsible from Radix) -- heading visible, content hidden by default, with a "Show tips" toggle
- Keep Quick Wins visible (they remain useful on repeat visits)
- Add a subtle "Welcome back" qualifier to the hero heading: "Welcome back to the General Users Guide" (only if `visitedCount > 0`)

**Implementation notes:**
- Simple check: `localStorage.getItem('playbook-first-visit-ts') !== null`
- The timestamp enables future features (e.g., "You first visited 3 weeks ago") but initially just acts as a boolean flag
- Collapsible pattern matches Serene Zone's "Learn More" approach -- information available but not forced

---

### 3.4 Quick Wins Time Estimates

**What:** Add estimated completion time to each Quick Win card.

**Data change:** Add `timeEstimate: string` field to Quick Win items.

```typescript
const QUICK_WINS_GENERAL = [
  {
    title: 'Set up UK English enforcement',
    description: 'A one-line instruction that ensures...',
    timeEstimate: '~1 min',
    linkSlug: 'brand-voice',
    linkLabel: 'Go to Brand Voice',
  },
  // ...
];
```

**Visual:** Small muted badge/text to the right of each card title:
```
Set up UK English enforcement                    ~1 min
A one-line instruction that ensures...
Go to Brand Voice ->
```

- Use `text-xs text-muted-foreground/60` for the time estimate
- Position: flex-row with title, estimate pushed to right via `ml-auto`

**Time estimates:**
| Quick Win (General) | Estimate |
|---------------------|----------|
| Set up UK English enforcement | ~1 min |
| Review the governance policy | ~5 min |
| Learn session handoff prompts | ~2 min |
| Explore the starter kit | ~3 min |

| Quick Win (Developer) | Estimate |
|----------------------|----------|
| Set up your CLAUDE.md file | ~5 min |
| Review the governance policy | ~5 min |
| Learn session handoff prompts | ~2 min |
| Explore the starter kit | ~3 min |

---

### 3.5 Collapse "How This Playbook Was Built"

**What:** Move the meta-information section to a collapsible, or relocate to footer.

**Recommendation:** Make it a `Collapsible` (already used across the app). Keep the heading visible with a chevron toggle. Default to closed.

```tsx
<Collapsible>
  <CollapsibleTrigger className="flex items-center gap-2">
    <h2>How This Playbook Was Built</h2>
    <ChevronDown className="h-4 w-4 transition-transform" />
  </CollapsibleTrigger>
  <CollapsibleContent>
    <p>This playbook was built using the same tools...</p>
  </CollapsibleContent>
</Collapsible>
```

This removes ~60px of visual weight from the Welcome page while keeping the content accessible.

---

## 4. What We're NOT Doing

These were considered but rejected for this context:

- **Spotlight/tooltip onboarding overlay** (Serene Zone pattern): Too heavy for a reference tool. The playbook's UI is simple enough (sidebar + content) that it doesn't need element-by-element guidance.
- **Separate onboarding route/page:** The Welcome page IS the onboarding. No need for a separate flow.
- **Achievement/badge system:** Would feel patronising for a professional B2B audience. Simple progress tracking is sufficient.
- **Audio/ambient effects:** Wrong context (Serene Zone warranted this for relaxation; a work reference tool does not).
- **Dedicated design tokens:** The playbook's existing design language works. No need for a separate token system.
- **Server-side persistence:** Adds complexity without proportional value. localStorage is sufficient for "which sections have I read."

---

## 5. Component Architecture

### New Files

| File | Purpose |
|------|---------|
| `app/src/hooks/useVisitedSections.ts` | Custom hook: localStorage-backed visited section tracking |
| `app/src/components/content/ProgressSummary.tsx` | Progress card for Welcome page (bar + continue link) |

### Modified Files

| File | Change |
|------|--------|
| `app/src/components/layout/Sidebar.tsx` | Add visited check icons using `useVisitedSections()` |
| `app/src/content/shared/WelcomeSection.tsx` | Conditional first-run/returning content, progress card, collapsible "How It Was Built", time estimates on Quick Wins |
| `app/src/components/layout/TrackLayout.tsx` | Call `markVisited(slug)` with 3-second delay on section mount |

### No Changes Needed

| File | Reason |
|------|--------|
| `HomePage.tsx` | Already has track decision context; no onboarding changes needed |
| `config/` | No config changes -- all state is client-side localStorage |
| `Sidebar.tsx` layout structure | Only adding a small icon; no structural changes |

---

## 6. localStorage Schema

| Key | Type | Default | Purpose |
|-----|------|---------|---------|
| `playbook-visited-sections` | `string[]` (JSON) | `[]` | List of visited section slugs |
| `playbook-first-visit-ts` | `string` (ISO date) | `null` | Timestamp of first visit (acts as first-run flag) |

**Namespace convention:** All keys prefixed with `playbook-` to avoid collision with the existing `playbook-client-config-*` cache keys.

**Storage budget:** ~200 bytes total. No risk of exceeding localStorage limits.

**Cleanup:** No TTL needed. Visited sections and first-visit timestamp should persist indefinitely.

---

## 7. Accessibility Requirements

- Visited check icons: `aria-hidden="true"` (decorative; screen readers already announce the section title)
- Progress bar: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax={totalCount}`, `aria-label="Section progress"`
- Collapsible: Already handled by Radix Collapsible primitive (keyboard, ARIA states)
- All animations: Respect `prefers-reduced-motion` (existing pattern via `useAccessibility` hook)
- "Welcome back" heading change: No ARIA impact (heading level and structure unchanged)

---

## 8. Implementation Sequence

### Wave 1: Core Hook + Sidebar (can be parallelised)

**Agent A: `useVisitedSections` hook**
1. Create `app/src/hooks/useVisitedSections.ts`
2. Implement read/write/check/count functions
3. SSR-safe, try/catch wrapped

**Agent B: Section visit tracking in TrackLayout**
1. Read `TrackLayout.tsx` to understand current mount behaviour
2. Add `useVisitedSections()` call
3. Implement 3-second delay marking on section mount
4. Set `playbook-first-visit-ts` on first visit

### Wave 2: Sidebar + Progress Card (depends on Wave 1)

**Agent C: Sidebar visited indicators**
1. Import `useVisitedSections()` in `Sidebar.tsx`
2. Add check icon next to visited sections
3. Fade-in animation on first mark

**Agent D: Progress Summary component**
1. Create `app/src/components/content/ProgressSummary.tsx`
2. Progress bar + section count + "Continue with" link
3. Uses `useVisitedSections()` + `getFilteredSectionsForTrack()`

### Wave 3: Welcome Page Integration (depends on Waves 1-2)

**Agent E: Welcome page conditional content**
1. First-run vs returning detection
2. Swap "Recommended Starting Path" for Progress Summary on return visits
3. Collapse "How to Use This Playbook" for returning users
4. "Welcome back" heading qualifier
5. Time estimates on Quick Win cards
6. Collapse "How This Playbook Was Built"

### Wave 4: Verification

1. `bun run build && bun run lint && bun run format:check`
2. Browser verification: first visit flow
3. Browser verification: returning visit flow (manually set localStorage)
4. Browser verification: sidebar indicators
5. Browser verification: progress bar accuracy

---

## 9. Visual Reference: Serene Zone Patterns Applied

| Serene Zone Pattern | Playbook Adaptation |
|---------------------|---------------------|
| `serene-onboarding-complete` localStorage flag | `playbook-first-visit-ts` timestamp (richer, same purpose) |
| `serene-breathing-visited` per-feature flag | `playbook-visited-sections` array (per-section granularity) |
| Quick Start card for returning users | Progress Summary card with "Continue with" link |
| Collapsible "Learn More" on prep page | Collapsible "How to Use" + "How It Was Built" for returning users |
| Spotlight overlay with step progression | NOT used (too heavy for this context) |
| `createPortal` for overlay rendering | NOT needed (no overlays) |
| `data-onboarding` target attributes | NOT needed (no spotlight targeting) |
| Focus trap in overlays | NOT needed (no overlays) |
| 3-second visibility delay | Adapted for section visit marking (prevent drive-by marking) |

---

## 10. Success Criteria

- [ ] Returning users see their progress at a glance (sidebar + Welcome page)
- [ ] First visit and return visit feel distinct but not jarring
- [ ] "Continue with" suggestion points to the right next section
- [ ] Progress data survives browser refresh and persists across sessions
- [ ] No visual regression on first visit (current experience preserved)
- [ ] Quick Win time estimates reduce "how long will this take?" friction
- [ ] All features degrade gracefully if localStorage is unavailable
- [ ] `bun run build && bun run lint && bun run format:check` all clean
- [ ] Accessible: ARIA roles, keyboard nav, reduced motion support
