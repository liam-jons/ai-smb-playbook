# Phase 7 Continuation — Theme System: Accessibility Modes & Creative Themes

## Context

The Phew! AI Playbook is a React app (Vite + React 19 + Tailwind v4 + TypeScript) delivered to a UK-based design agency. It's live at https://ai-smb-playbook.vercel.app. The app currently has light/dark/system mode via a `useTheme` hook and `ThemeToggle` dropdown.

This session should produce a **build spec** for adding a comprehensive theme system that combines accessibility modes with creative themes. Implementation will happen in a separate session after the spec is approved.

**Read first:** `CLAUDE.md` at the project root for conventions, tech stack, and critical rules.

---

## What Was Done in the Previous Session

Phase 6B sidebar UX improvements + collapsible sidebar (commits `377b9a7`, `43945a3`):
- Collapsible desktop sidebar (w-72 to w-14) with Cmd+B toggle and localStorage persistence
- Group headers (Core Topics / Developer Topics) replacing gap notes
- Shortened sidebar titles via `sidebarTitle` field (1.4, 1.7, 1.15)
- Section 1.7 made available on both tracks
- Starter Kit visual prominence (primary tint, Package icon, divider)
- Welcome page Starter Kit callout card
- Sidebar title truncation fix (items-start + wrapping)
- Dev server port configured to 4100
- Tooltips in collapsed sidebar mode using existing Tooltip component

Two parallel research agents were deployed and completed. Their findings are the primary input for this session's spec.

---

## Research Documents to Read

These documents contain all the research findings. **Read both completely before creating the spec.**

### 1. Accessibility Styling Research
**File:** `.planning/research/accessibility-styling-research.md`

Key findings:
- **Dyslexia-friendly mode** should be a combined theme (font + spacing + background + colour), not individual toggles
- **Atkinson Hyperlegible Next** (2025, Google Fonts, 7 weights) is the recommended accessibility default font
- **OpenDyslexic** (SIL-OFL, available via Fontsource npm) offered as an option within the dyslexia mode
- Research shows spacing adjustments (letter-spacing, line-height, word-spacing) help more than font alone
- Background should shift to warm cream tint; line-height 1.8; letter-spacing 0.05–0.12em; left-aligned; 18px minimum
- Implementation via `data-a11y-mode` attribute on `<html>` — orthogonal to light/dark (not replacing it)
- `font-size-adjust` CSS property handles OpenDyslexic's larger rendering
- Other modes prioritised: High contrast (P2), Large text (P3), Focus/reading mode (P4)
- Includes ready-to-use CSS variable definitions and WCAG compliance checklist

### 2. Creative Themes Research
**File:** `.planning/research/creative-themes-research.md`

Key findings:
- Full colour palettes, font pairings, and visual treatment for each theme
- Technical approach: `data-theme` attribute, CSS custom property overrides
- Creative themes **replace** light/dark rather than combining with it (each theme defines its own light/dark or is single-mode)
- Font loading via Google Fonts or Fontsource
- View Transitions API for smooth theme switching
- Shiki syntax highlighting theme mapping per creative theme

---

## Approved Theme Selection

The following themes have been selected for implementation:

### Accessibility Modes
1. **Dyslexia-Friendly Mode** — Combined theme: Atkinson Hyperlegible Next font (with OpenDyslexic option), warm cream background, enhanced spacing, larger text. Works in both light and dark variants.
2. **High Contrast Mode** — Increased contrast ratios, bolder borders, stronger colour differentiation. Also works in both light and dark.
3. **Large Text Mode** — Root font-size scaling (e.g. 125%), no other visual changes. Orthogonal — works with any theme.
4. **Focus/Reading Mode** — Reduced visual clutter, simplified sidebar, muted decorative elements. Consider as lower priority.

### Creative Themes
1. **Retro Terminal** — Green phosphor CRT aesthetic. Green-on-black, monospace fonts (VT323 headings + JetBrains Mono body), scanline overlay effect, phosphor glow. Single-mode (dark only).
2. **Synthwave / Neon** — Deep purple background, neon pink and cyan accents, glow box-shadows, Space Grotesk headings. Single-mode (dark only).
3. **Minimal Ink** — High-contrast monochrome with a single warm red accent, sharp rectangles (border-radius: 0), bold typography (Fraunces variable serif headings + Inter body). Works in both light and dark.

---

## What This Session Should Produce

### A Build Spec Document

Write a comprehensive build spec to: `.planning/specs/phase-7-theme-system-spec.md`

The spec should cover:

#### 1. Theme Architecture
- How the theme system integrates with the existing `useTheme` hook and `ThemeToggle`
- Data model: how themes, accessibility modes, and light/dark interact
- Storage: localStorage keys and structure (use existing `phew-playbook` prefix)
- CSS architecture: `data-theme` / `data-a11y-mode` attributes, custom property layering
- How Tailwind v4's CSS-based theming (`@theme` in `index.css`) is extended

#### 2. Theme Switcher UI
- How the current ThemeToggle dropdown evolves to support all modes
- Consider: a settings panel/dialog vs an expanded dropdown vs a sidebar panel
- Should accessibility modes and creative themes be in separate sections of the UI?
- Theme preview approach (colour swatches, thumbnails, or live preview?)
- Mobile-friendly switching

#### 3. Font Loading Strategy
- Which fonts need loading for each theme (Google Fonts, Fontsource, or self-hosted)
- Performance: lazy-load fonts only when their theme is selected
- Fallback fonts while loading
- Impact on bundle size

#### 4. Per-Theme Definitions
For each of the 7 modes/themes, specify:
- CSS custom property overrides (mapping to existing design tokens)
- Font stacks (heading + body + monospace)
- Border radius, shadow, and border styles
- Special effects (scanlines, glow, grid patterns where applicable)
- Shiki syntax highlighting theme name
- Whether it supports light, dark, or is single-mode

#### 5. Component Changes
- Which existing components need modification
- Any new components needed (ThemeSwitcher, ThemePreview, etc.)
- How the sidebar, header, code blocks, cards, and callouts adapt per theme

#### 6. Accessibility Compliance
- WCAG 2.2 AA requirements for each mode
- Contrast ratio verification approach
- `prefers-contrast` and `prefers-reduced-motion` media query integration
- Keyboard navigation for the theme switcher

#### 7. Implementation Plan
- Ordered list of implementation steps
- Which changes can be parallelised
- Estimated file count and complexity per step
- Dependencies between steps

#### 8. Meta-Narrative
- How to frame the creative themes within the playbook's narrative (this was built with the tools it teaches)
- Where/how to reference this in the UI or welcome page

### Research Synthesis Agent

Before writing the spec, deploy a sub-agent to read both research documents thoroughly and produce a synthesis that:
- Identifies any conflicts or gaps between the two research documents
- Maps accessibility mode CSS tokens to creative theme CSS tokens (ensuring they use the same property names)
- Produces a unified token/variable naming scheme
- Recommends the interaction model (how do accessibility modes + creative themes + light/dark combine?)

Use the synthesis to inform the spec. The synthesis can be written to `.planning/research/theme-system-synthesis.md`.

---

## Current Theme Infrastructure

### Existing Files
```
app/src/hooks/useTheme.ts              # Theme hook: light/dark/system, localStorage persistence
app/src/components/layout/ThemeToggle.tsx  # Dropdown: Light/Dark/System with Sun/Moon/Monitor icons
app/src/index.css                      # Tailwind v4 theme — @theme inline {} with CSS custom properties
app/src/config/site.ts                 # localStoragePrefix: 'phew-playbook'
```

### Current Theme Model
- `useTheme()` returns `{ theme, setTheme, resolvedTheme }`
- Theme type: `'light' | 'dark' | 'system'`
- Applied via `dark` class on `<html>` element
- Stored in `localStorage` as `phew-playbook-theme`
- System preference tracked via `prefers-color-scheme` media query

### Sidebar Collapse State
- Stored in `localStorage` as `sidebar-collapsed`
- Applied via state in `TrackLayout.tsx`, passed to `Sidebar.tsx`

### Existing UI Components
```
app/src/components/ui/tooltip.tsx       # Already installed — used for collapsed sidebar
app/src/components/ui/dropdown-menu.tsx # Used by current ThemeToggle
app/src/components/ui/dialog.tsx        # Available for settings panel
app/src/components/ui/tabs.tsx          # Available for theme category tabs
app/src/components/ui/select.tsx        # Available for font selection
```

---

## Multi-Client Reusability Consideration

A reusability audit has already been completed (`.planning/research/reusability-audit.md`) that outlines what's needed to make this application usable for other clients beyond Phew. The current base theme is derived to some degree from Phew's design system, and a future phase will address full multi-client theming.

**This matters for the theme spec because:**
- The theme system architecture should be designed so that a client's **base brand theme** (colours, fonts, identity) is a separate concern from **accessibility modes** and **creative themes**
- Creative themes should override the base theme entirely (they're self-contained visual experiences), but accessibility modes need to work on top of whatever the base brand theme is
- When the reusability work happens, swapping the base brand theme for a different client should not require touching the accessibility or creative theme definitions
- The spec should account for this layering: **base brand → light/dark → accessibility mode → creative theme override**
- Consider how `config/site.ts` (which already centralises client-specific values) might also reference a client's base theme token set

Read `.planning/research/reusability-audit.md` for full context on the multi-client requirements. The theme spec doesn't need to implement multi-client support, but the architecture should not paint us into a corner.

---

## Key Constraints

- **UK English** throughout all content and UI labels
- **Tailwind v4** — CSS-based theming via `@theme inline {}` in `index.css`. No JS config file.
- **Package manager:** bun (not npm)
- **Performance:** Font loading must not block initial render. Lazy-load non-default fonts.
- **Existing dark mode users:** Must not break. Light/Dark/System should continue to work as-is for users who don't select a creative theme.
- **Mobile:** Theme switcher must work well on mobile (375px+)
- **Accessibility modes are orthogonal:** Dyslexia-friendly mode should work whether you're in light mode, dark mode, or a creative theme (where applicable). Large text should work with everything.
- **No over-engineering:** The spec should be implementable by a small number of agents in a single session. Prefer CSS custom properties over complex JS logic.

---

## Key Files Reference

### Theme System
```
app/src/hooks/useTheme.ts              # Extend this hook
app/src/components/layout/ThemeToggle.tsx  # Replace/extend this component
app/src/index.css                      # Add theme CSS custom property overrides
```

### Layout (may need minor changes)
```
app/src/components/layout/AppLayout.tsx    # Outer shell — may need data attributes
app/src/components/layout/Header.tsx       # Header — theme switcher location
app/src/components/layout/Sidebar.tsx      # Sidebar — themed styling
app/src/components/layout/TrackLayout.tsx   # Layout wrapper
```

### Content (special effects)
```
app/src/components/content/CodeBlock.tsx    # Shiki theme switching
app/src/components/content/SectionPage.tsx  # Page wrapper
```

### Research Inputs
```
.planning/research/accessibility-styling-research.md   # Accessibility research findings
.planning/research/creative-themes-research.md         # Creative themes research findings
```

### Build & Dev Commands
```bash
cd app && bun install        # Install dependencies
cd app && bun run dev        # Local dev server (port 4100)
cd app && bun run build      # TypeScript check + production build
cd app && bun run format     # Prettier — format all files
```

### Deployment
- **Production:** https://ai-smb-playbook.vercel.app
- **GitHub:** https://github.com/liam-jons/ai-smb-playbook
- Auto-deploys on push to `main`
