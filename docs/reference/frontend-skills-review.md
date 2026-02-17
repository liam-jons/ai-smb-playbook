# Frontend Skills Review -- Design & Engineering Guidelines

> **Date:** 2026-02-14
> **Purpose:** Consolidated, actionable guidelines extracted from 6 frontend skill files and their references. Organised by topic, not by source. Referenced by all Phase 1 specs and Phase 2 build agents.
> **Tech stack context:** Vite + React + Tailwind CSS + shadcn/ui + React Router v7 + Motion + Shiki, hosted on Vercel.

---

## 1. Typography

### Type Scale
- Use a **5-size modular scale** with clear contrast between levels. Recommended roles: xs (captions), sm (metadata/secondary UI), base (body), lg (subheadings/lead), xl+ (headlines/hero).
- Pick a ratio (1.25 major third or 1.333 perfect fourth) and commit. Avoid sizes that are too close together (14/15/16/18 creates muddy hierarchy).
- Use **fluid sizing** with `clamp(min, preferred, max)` for headings and hero text. Do NOT use fluid type for buttons, labels, or UI controls -- these must remain consistent.

### Font Selection
- **Do not use:** Inter, Roboto, Arial, Open Sans, Lato, Montserrat. These are generic and create an immediate "AI template" impression.
- **Better alternatives from Google Fonts:** Instrument Sans, Plus Jakarta Sans, Outfit, Figtree, DM Sans, Fraunces, Lora.
- System fonts (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI"`) are a valid choice when performance matters more than personality.
- You often do NOT need a second font. One family in multiple weights creates cleaner hierarchy. Only add a second when genuine contrast is needed (e.g., display headlines + body text).

### Font Loading
- Use `font-display: swap` on all `@font-face` declarations.
- Define a **size-adjusted fallback** to minimise layout shift (match x-height, ascenders, descenders using `size-adjust`, `ascent-override`, etc.).
- Preload critical fonts with `<link rel="preload" as="font" crossorigin>`.

### Readability
- Use `max-width: 65ch` for body text containers.
- Minimum **16px (1rem)** for body text. Use `rem` for font sizes (respects user settings).
- Increase `line-height` slightly (+0.05-0.1) for light text on dark backgrounds.
- Use `font-variant-numeric: tabular-nums` for any data tables or numeric displays.

### Anti-patterns
- Never use monospace typography as lazy shorthand for "technical" vibes.
- Never put large rounded-corner icons above every heading (templated look).
- Never disable browser zoom (`user-scalable=no`).

---

## 2. Colour & Theming

### Colour Space
- Use **OKLCH** (perceptually uniform). As you lighten or darken, reduce chroma proportionally -- high chroma at extreme lightness looks garish.
- Define colours as CSS custom properties using OKLCH values.

### Palette Structure
- **60-30-10 rule** (by visual weight, not pixel count): 60% neutrals/white space, 30% secondary (text, borders), 10% accent (CTAs, highlights). Accent works because it is rare -- overuse kills its power.
- Tint all neutrals towards the brand hue. Even `chroma: 0.01` creates subconscious cohesion. Never use pure gray, pure black (`#000`), or pure white (`#fff`).
- Use a **two-layer token system**: primitive tokens (`--blue-500`) and semantic tokens (`--color-primary: var(--blue-500)`). For dark mode, only redefine the semantic layer.

### Dark Mode
- Dark mode is NOT inverted light mode. Specific differences:
  - Use lighter surfaces for depth (not shadows).
  - Desaturate accent colours slightly.
  - Reduce body text font weight (e.g., 350 instead of 400).
  - Never use pure black backgrounds -- use dark grey (`oklch(12-18%)`).
- Use Tailwind's `darkMode: 'class'` strategy. shadcn/ui supports dark mode out of the box.

### Accessibility (Contrast)
- Body text: **4.5:1 minimum** (AA). Large text (18px+): 3:1 minimum.
- UI components and icons: 3:1 minimum.
- Placeholder text still needs 4.5:1 contrast.
- Never use gray text on coloured backgrounds -- it looks washed out. Use a darker shade of the background colour instead.
- Never rely on colour alone to convey information (8% of men are colour-blind).

### Anti-patterns
- No cyan-on-dark, purple-to-blue gradients, or neon accents on dark backgrounds (the "AI colour palette").
- No gradient text on headings or metrics.
- Heavy alpha/transparency is a design smell -- define explicit colours.

---

## 3. Layout & Spacing

### Spacing System
- Use a **4pt base grid**: 4, 8, 12, 16, 24, 32, 48, 64, 96px.
- Name tokens semantically (`--space-sm`, `--space-lg`), not by value.
- Use `gap` for sibling spacing (eliminates margin collapse hacks).
- Use `clamp()` for fluid spacing that breathes on larger screens.

### Grid Patterns
- Use `repeat(auto-fit, minmax(280px, 1fr))` for responsive grids without breakpoints.
- For complex layouts, use named `grid-template-areas` and redefine at breakpoints.

### Visual Hierarchy
- **The squint test:** Blur your eyes. Can you identify the most important element, the second most important, and clear groupings? If everything looks the same weight, hierarchy is broken.
- Combine **2-3 hierarchy dimensions** simultaneously: size + weight + space. Never rely on size alone.
- Create rhythm through **varied spacing** -- tight groupings and generous separations. Same padding everywhere = monotonous.

### Cards
- Cards are overused. Spacing and alignment create visual grouping naturally.
- Use cards only when content is truly distinct and actionable, or needs clear interaction boundaries.
- **Never nest cards inside cards.** Use spacing, typography, and subtle dividers for internal hierarchy.

### Depth & Z-index
- Create a semantic z-index scale: `dropdown < sticky < modal-backdrop < modal < toast < tooltip`.
- Shadows should be subtle. If clearly visible, probably too strong.

### Anti-patterns
- Do not centre everything -- left-aligned text with asymmetric layouts feels more designed.
- Do not use identical card grids (same-sized cards with icon + heading + text repeated).
- Do not use the hero metric layout template (big number, small label, gradient accent).

---

## 4. Motion & Animation

### Timing
| Duration | Use Case |
|----------|----------|
| 100-150ms | Micro-feedback (hover, click, toggle) |
| 200-300ms | State changes (menu, tooltip, dropdown) |
| 300-500ms | Layout changes (accordion, modal, drawer) |
| 500-800ms | Entrance animations (page load, hero reveals) |

- **Exit animations are faster than entrances** -- use ~75% of enter duration.
- Under 80ms feels instant. This is the target for micro-interactions.

### Easing
- Do NOT use the default `ease`. Use:
  - **ease-out** for entering elements: `cubic-bezier(0.16, 1, 0.3, 1)`
  - **ease-in** for exiting elements: `cubic-bezier(0.7, 0, 0.84, 0)`
  - **ease-in-out** for state toggles: `cubic-bezier(0.65, 0, 0.35, 1)`
- For micro-interactions, prefer **exponential curves** (quart-out, quint-out, expo-out) -- they mimic natural deceleration.
- **Never use bounce or elastic easing.** They are dated and draw attention to the animation rather than the content.

### Properties
- **Only animate `transform` and `opacity`** for 60fps performance. Everything else triggers layout recalculation.
- For height animations (accordions), use `grid-template-rows: 0fr -> 1fr` instead of animating `height`.

### Stagger
- Use CSS custom properties for stagger: `animation-delay: calc(var(--i) * 50ms)`.
- **Cap total stagger duration** -- 10 items at 50ms = 500ms. For many items, reduce per-item delay or limit stagger count.

### Motion Library Usage (this project)
- Use **Motion** (`motion/react`) for: layout animations, AnimatePresence enter/exit, shared layout transitions.
- Use **Tailwind `transition-*`** for: hover states, focus states, simple colour/opacity changes.
- Do NOT use Motion where a CSS transition suffices.

### Reduced Motion (MANDATORY)
- Vestibular disorders affect ~35% of adults over 40. This is not optional.
- Implement `@media (prefers-reduced-motion: reduce)` to disable or replace spatial animations with crossfades.
- In Motion components, use the `useReducedMotion` hook to set `duration: 0` and remove y/x offsets.
- Preserve functional animations (progress bars, spinners) even in reduced motion mode.

### Anti-patterns
- Animating everything causes fatigue. Focus on **one well-orchestrated page load** rather than scattered micro-interactions.
- Never block user input during animations.
- Do not use `will-change` preemptively -- only when animation is imminent.
- Clean up animation listeners/observers on component unmount.

---

## 5. Interaction Design

### Interactive States
Every interactive element must have these states designed:
1. **Default** -- at rest
2. **Hover** -- pointer over (desktop only)
3. **Focus** -- keyboard/programmatic focus (`:focus-visible`)
4. **Active** -- being pressed
5. **Disabled** -- not interactive (reduced opacity, no pointer)
6. **Loading** -- processing (spinner or skeleton)
7. **Error** -- invalid state (red border + message)
8. **Success** -- completed (confirmation)

- Design hover AND focus separately. Keyboard users never see hover states.

### Focus Rings
- **Never `outline: none` without replacement.** This is an accessibility violation.
- Use `:focus-visible` to show focus only for keyboard navigation.
- Focus rings: 2-3px thick, offset from element, 3:1 contrast minimum, consistent across all interactive elements.

### Copy-to-Clipboard Pattern
- Use `navigator.clipboard.writeText()` with the `useCopyToClipboard` custom hook.
- Show visual feedback: icon switches from Copy to Check for 2 seconds.
- Every prompt, template, and code block in the playbook MUST have a copy button.

### Loading States
- **Skeleton screens > spinners** -- they preview content shape and feel faster.
- Show specific loading text ("Saving your draft..." not "Loading...").
- For optimistic updates: update UI immediately, rollback on failure. Use for low-stakes actions only.

### Feedback Patterns
- Toast notifications: slide in from bottom-right, auto-dismiss after 3 seconds, use AnimatePresence for enter/exit.
- Button state transitions: idle -> loading -> success/error -> idle (with animated icon swap).

### Empty States
- Empty states are onboarding moments. Acknowledge briefly, explain value, provide clear action.
- "No projects yet. Create your first one to get started." NOT just "No items".

### UX Writing
- Button labels: specific verb + object ("Save changes", not "OK"). For destructive actions, name the destruction ("Delete 5 items").
- Error messages answer three questions: What happened? Why? How to fix it?
- Never blame the user. "Please enter a date in DD/MM/YYYY format" not "You entered an invalid date".
- Use consistent terminology. Pick one term (e.g., "Delete" not "Remove/Trash") and stick with it throughout.
- **UK English throughout.** Use UK spelling, UK date formats, pound sterling.

---

## 6. Responsive Design

### Approach
- **Mobile-first.** Start with base styles for mobile, use `min-width` queries to layer complexity.
- Three breakpoints usually suffice: 640px, 768px, 1024px. Let content determine where to break.
- Use Tailwind responsive utilities (`sm:`, `md:`, `lg:`).

### Input Method Detection
- Screen size does not indicate input method. Use `@media (pointer: fine)` vs `(pointer: coarse)` for touch/mouse-specific sizing.
- Use `@media (hover: hover)` to gate hover interactions. Never rely on hover for functionality.
- Touch targets: 44px minimum. Use padding or pseudo-elements to expand tap area beyond visual size.

### Container Queries
- Use `@container` for component-level responsiveness. A card in a sidebar should adapt based on its container width, not viewport width.

### Safe Areas
- Handle mobile notches and home indicators with `env(safe-area-inset-*)`.
- Add `viewport-fit=cover` to the viewport meta tag.

### Navigation Adaptation
- Three stages: hamburger + drawer on mobile, horizontal compact on tablet, full with labels on desktop.
- Never hide critical functionality on mobile -- adapt the interface, do not amputate it.

### Testing
- Do not trust DevTools device emulation alone. Test on at least one real iPhone and one real Android device.
- DevTools misses: actual touch interactions, real CPU constraints, font rendering, keyboard appearance.

---

## 7. Performance Optimisation (React/Vite/Vercel)

### Bundle Size (CRITICAL)
- **Avoid barrel file imports.** Import directly from source files: `import Check from 'lucide-react/dist/esm/icons/check'` not `import { Check } from 'lucide-react'`.
- **Lazy-load heavy components** with `React.lazy()` and `Suspense`. For this project, lazy-load the Shiki highlighter and any route-level components.
- **Preload on user intent.** When a user hovers/focuses on a navigation item, start loading the target route's code.
- **Defer non-critical third-party scripts** (analytics, logging) until after initial render.

### Re-render Optimisation (MEDIUM)
- **Derive state during render** -- do not store derived values in state or update them via effects.
- Use **functional `setState`** (`setCount(c => c + 1)`) for stable callbacks.
- Use **lazy state initialisation** (`useState(() => expensiveComputation())`) for expensive initial values.
- Use `useRef` for transient values that change frequently but do not need re-render (e.g., scroll position, mouse coordinates).
- Use `startTransition` for non-urgent updates that should not block user interaction.

### Rendering Performance (MEDIUM)
- Use **`content-visibility: auto`** for long scrollable lists or content-heavy sections. Add `contain-intrinsic-size` to prevent layout jumps.
- Hoist static JSX outside components to avoid re-creation on every render.
- Use explicit ternary operators (`condition ? <A /> : null`) instead of `&&` to prevent rendering `0` or `NaN`.
- Animate `div` wrappers around SVGs, not the SVG elements directly.

### Client-Side Data Patterns
- Use **passive event listeners** (`{ passive: true }`) for scroll and touch handlers.
- Deduplicate global event listeners -- one listener on `window`, not one per component.
- Version and minimise localStorage data. Read once and cache in memory.

### Vite-Specific
- Vite handles code splitting automatically via dynamic imports (`import()`).
- Use React Router's lazy route loading if the bundle grows.

---

## 8. Component Patterns (this project)

### shadcn/ui Conventions
- Components live in `src/components/ui/` (auto-generated by CLI, do not modify directly unless needed).
- Use the `cn()` utility for conditional class merging.
- Use shadcn CSS variables (`--primary`, `--muted`, etc.) for theming consistency.

### Composition Over Configuration
- Build complex UI by composing shadcn primitives. Do not create mega-components with many props.
- Co-locate state as close to usage as possible. Only track selection is truly global (URL param or React context).
- Content as data: playbook content defined as typed TypeScript objects, not hard-coded JSX.

### Import Conventions
- Use `@/` path alias for all internal imports.
- Motion: `import { motion, AnimatePresence } from 'motion/react'`
- Router: `import { createBrowserRouter, useParams } from 'react-router'`

### Naming Conventions
- Components: PascalCase (`CodeBlock.tsx`)
- Hooks: camelCase with `use` prefix (`useCopyToClipboard.ts`)
- Content modules: kebab-case (`context-window-guide.ts`)

---

## 9. Accessibility Requirements

### Non-Negotiable
- **WCAG AA compliance** on all text (4.5:1 body, 3:1 large text/UI).
- **Keyboard navigation** for all interactive elements. Every feature reachable via Tab, Enter, Escape, Arrow keys.
- **Focus indicators** visible for keyboard users (`:focus-visible`).
- **Skip link** ("Skip to main content") as the first focusable element.
- **Semantic HTML:** proper heading hierarchy (h1 -> h2 -> h3), landmarks (`<nav>`, `<main>`, `<footer>`), ARIA labels on icon-only buttons.
- **`prefers-reduced-motion`** respected for all animations.
- **Never disable zoom.** If layout breaks at 200%, fix the layout.
- All images: meaningful `alt` text, or `alt=""` for decorative images.

### Interactive Components
- Tabs: use `role="tablist"`, roving tabindex, arrow key navigation.
- Accordion: use proper `aria-expanded`, `aria-controls` associations (shadcn handles this).
- Modals: focus trapping via `inert` attribute or `<dialog>` element.
- Tooltips: use native Popover API or Radix Tooltip for accessibility.
- Links: standalone meaning in link text ("View pricing plans" not "Click here").

---

## 10. Visual Quality Standards

### The "AI Slop Test"
If someone looked at the interface and immediately said "AI made this", the design fails. Review for these tell-tale AI design patterns and avoid them:
- Glassmorphism/blur effects used decoratively
- Rounded rectangles with generic drop shadows
- Same-sized card grids with icon + heading + text
- Dark mode with glowing neon accents
- Gradient text on headings
- Purple-to-blue gradients everywhere
- Modals for everything
- Sparklines as decoration

### What To Aim For
- **Intentionality.** Every design choice has a reason. Bold maximalism and refined minimalism both work -- the key is commitment, not intensity.
- **Cohesion.** Palette, typography, spacing, and motion should share a mathematical or philosophical foundation.
- **Restraint.** One well-designed interaction beats five mediocre ones.
- **Practical tone.** This is a playbook for a UK SMB. Avoid enterprise jargon, unnecessary complexity, and show-off animations. The design should feel approachable, professional, and clear.

---

## Build Agent Checklist

Copy this checklist into each Phase 2 build spec. Every item must be verified before marking a section complete.

```markdown
### Frontend Quality Checklist

**Typography**
- [ ] Body text >= 16px (1rem), using rem units
- [ ] Max line length: 65ch for body text
- [ ] Fluid type (clamp) on headings; fixed sizes on UI controls
- [ ] Font stacks include size-adjusted fallback
- [ ] No generic fonts (Inter, Roboto, etc.) unless explicitly specified

**Colour & Theming**
- [ ] All custom colours defined in OKLCH via CSS variables
- [ ] Neutrals tinted towards brand hue (not pure grey)
- [ ] No pure black (#000) or pure white (#fff)
- [ ] Dark mode tested and functional (if applicable to section)
- [ ] All text meets WCAG AA contrast (4.5:1 body, 3:1 large/UI)

**Layout & Spacing**
- [ ] Spacing values from the 4pt grid (4, 8, 12, 16, 24, 32, 48, 64, 96)
- [ ] Visual hierarchy uses 2+ dimensions (size, weight, colour, space)
- [ ] No nested cards
- [ ] No identical repeating card grids

**Motion & Animation**
- [ ] Only `transform` and `opacity` animated (no width/height/top/left)
- [ ] Timing follows 100/300/500 rule
- [ ] Easing uses exponential curves (not default `ease` or bounce)
- [ ] `prefers-reduced-motion` handled (crossfade fallback or disable)
- [ ] Exit animations faster than entrances
- [ ] Motion used via Tailwind transitions where CSS suffices; Motion library only for layout/enter/exit

**Interaction**
- [ ] All 8 interactive states designed (default, hover, focus, active, disabled, loading, error, success)
- [ ] `:focus-visible` ring on all interactive elements (2-3px, offset, 3:1 contrast)
- [ ] Touch targets >= 44px
- [ ] Copy-to-clipboard on every prompt/template/code block
- [ ] Skeleton screens for loading states (not generic spinners)

**Accessibility**
- [ ] Semantic HTML (headings, landmarks, labels)
- [ ] Skip link present
- [ ] Keyboard navigation tested (Tab, Enter, Escape, Arrows)
- [ ] `aria-expanded`, `aria-controls` on accordions/collapsibles
- [ ] `aria-label` on icon-only buttons
- [ ] Images have `alt` text (or `alt=""` for decorative)
- [ ] Never `outline: none` without `:focus-visible` replacement

**Performance**
- [ ] No barrel file imports (direct imports from source)
- [ ] Shiki lazy-loaded (not in initial bundle)
- [ ] Derived state computed during render (no useEffect for derived values)
- [ ] `content-visibility: auto` on long scrollable content
- [ ] Passive event listeners on scroll/touch handlers
- [ ] Static JSX hoisted outside components where possible

**Responsive**
- [ ] Mobile-first (base styles for mobile, min-width queries for larger)
- [ ] Tested at 320px, 640px, 768px, 1024px widths
- [ ] No critical functionality hidden on mobile
- [ ] Hover-dependent features have touch alternatives
- [ ] Safe area insets handled for mobile

**UX Writing & Content**
- [ ] UK English throughout (spelling, grammar, currency, date format)
- [ ] Button labels use verb + object pattern
- [ ] Error messages answer: what, why, how to fix
- [ ] Consistent terminology (no synonyms for the same action)
- [ ] Empty states are actionable, not just "Nothing here"

**Code Quality**
- [ ] Tailwind utility classes only (no CSS modules or styled-components)
- [ ] `cn()` utility for conditional class merging
- [ ] `@/` path alias for all imports
- [ ] Components composed from shadcn primitives (not mega-components)
- [ ] Content defined as typed TS objects, not hard-coded JSX
```

---

## Source Skills Referenced

| Skill | Path | Key Contributions |
|---|---|---|
| frontend-design | `.claude/skills/frontend-design/` | Typography, colour, layout, motion, responsive, visual quality, AI slop test |
| interaction-design | `.claude/skills/interaction-design/` | Timing, easing, loading states, gesture patterns, scroll animations, reduced motion |
| web-design-guidelines | `.claude/skills/web-design-guidelines/` | Vercel web interface guidelines compliance (dynamic fetch from GitHub -- use at review time) |
| vercel-react-best-practices | `.claude/skills/vercel-react-best-practices/` | Bundle optimisation, re-render patterns, rendering performance, client-side data |
| canvas-design | `.claude/skills/canvas-design/` | Visual philosophy principles (craftsmanship, spatial hierarchy, colour cohesion, restraint) |
| remotion-best-practices | `.claude/skills/remotion-best-practices/` | Animation timing/sequencing concepts (adapted for web context; Remotion-specific APIs not applicable) |

> **Note on web-design-guidelines:** This skill dynamically fetches the latest rules from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. Build agents should fetch and review this document during the integration/polish phase (Phase 3) for a final compliance audit.
