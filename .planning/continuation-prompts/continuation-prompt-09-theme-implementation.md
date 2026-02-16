# Phase 7 Implementation — Theme System: Accessibility Modes & Creative Themes

## Context

The Phew! AI Playbook is a React app (Vite + React 19 + Tailwind v4 + TypeScript) delivered to a UK-based design agency. It's live at https://ai-smb-playbook.vercel.app.

This session implements the theme system designed in the Phase 7 spec. The spec, research, and synthesis documents are all complete and approved.

**Read first:** `CLAUDE.md` at the project root for conventions, tech stack, and critical rules.

---

## What Was Done in the Previous Sessions

Phase 6B sidebar UX improvements (commits `377b9a7`, `43945a3`):
- Collapsible desktop sidebar, group headers, Starter Kit prominence, tooltips

Phase 7 spec session (no code changes — planning only):
- Two research agents produced accessibility and creative themes findings
- A synthesis agent resolved conflicts and unified the token naming scheme
- A comprehensive build spec was written covering architecture, UI, and all theme definitions

---

## Documents to Read Before Starting

Read these in order. **The build spec is the primary implementation guide — it contains everything you need.**

### 1. Build Spec (PRIMARY — read completely)
**File:** `.planning/specs/phase-7-theme-system-spec.md`

Contains:
- Full theme architecture (data model, CSS cascade, interaction rules)
- Complete oklch colour palettes for all 6 themes/modes
- Typography stacks, shape tokens, and effect definitions
- Theme switcher UI design (settings dialog layout)
- Font loading strategy (lazy dynamic imports via Fontsource)
- Component changes list (8 modified, 6 new, 1 deleted)
- Shiki theme integration approach
- 8-step implementation plan with dependency graph and parallelisation opportunities
- WCAG compliance requirements

### 2. Research Synthesis (supporting reference)
**File:** `.planning/research/theme-system-synthesis.md`

Contains:
- Token override matrix (which tokens each theme overrides)
- CSS cascade layer ordering
- All 24 valid state combinations
- localStorage key definitions
- Reusability layer separation

### 3. Research Documents (deep reference — consult if needed)
- `.planning/research/accessibility-styling-research.md` — Evidence-based dyslexia/readability findings
- `.planning/research/creative-themes-research.md` — Theme palettes, font pairings, CSS effects

---

## What This Session Should Build

Implement the complete theme system as specified. The spec's Section 13 defines 8 implementation steps:

### Step 1: CSS Framework & New Tokens
- Create `app/src/styles/a11y.css` — all accessibility mode CSS overrides
- Create `app/src/styles/themes.css` — all creative theme CSS overrides
- Extend `app/src/index.css` — new token defaults in `@theme inline`, updated `body` rule, heading/code font-family rules, `prefers-contrast` and `forced-colors` media queries, import the two new CSS files

### Step 2: Hooks
- Extend `app/src/hooks/useTheme.ts` — add `creativeTheme` / `setCreativeTheme`, dark-only enforcement, light/dark preference preservation
- Create `app/src/hooks/useAccessibility.ts` — `data-a11y-mode`, `data-a11y-font` management, font loading, `prefers-contrast` auto-detection
- Add View Transitions API wrapper for smooth switching

### Step 3: Font Installation
```bash
cd app && bun add @fontsource/atkinson-hyperlegible-next @fontsource/opendyslexic @fontsource/vt323 @fontsource/jetbrains-mono @fontsource/space-grotesk @fontsource-variable/fraunces @fontsource-variable/inter
```
Also check if `switch`, `radio-group`, and `label` shadcn/ui components exist — install any missing ones via `bunx shadcn add <component>`.

### Step 4: Theme Registry
- Create `app/src/themes/index.ts` — metadata for each theme (id, label, description, swatch colours, mode support, Shiki theme mapping)

### Step 5: Theme Switcher UI
- Create `app/src/components/layout/ThemeSettings.tsx` — settings dialog with three sections (colour mode, accessibility, creative themes)
- Create `app/src/components/layout/ThemePreview.tsx` — colour swatch component
- Update `app/src/components/layout/Header.tsx` — import ThemeSettings, change icon to Palette
- Delete `app/src/components/layout/ThemeToggle.tsx`

### Step 6: CodeBlock & Shiki Updates
- Update `app/src/components/content/ShikiHighlighter.tsx` — add Shiki themes with lazy loading
- Update `app/src/components/content/CodeBlock.tsx` — theme-aware Shiki resolution

### Step 7: Layout Updates
- Update `app/src/components/layout/AppLayout.tsx` — add `theme-scanline-container` class
- Update `app/src/components/content/SectionPage.tsx` — add `content-area` class

### Step 8: Testing & Verification
- Build: `cd app && bun run build`
- Lint: `cd app && bun run lint`
- Format: `cd app && bun run format`
- Visual verification of key state combinations

### Parallelisation

Steps 1, 3, and 4 have no dependencies and can run in parallel.
Steps 2 and 5 depend on their predecessors.
Step 6 depends on Step 2.
Step 7 depends on Step 1.

```
    ┌─── Step 1 (CSS) ──────────────────────────────┐
    │                                                │
    ├─── Step 3 (Fonts) ──┐                          │
    │                     │                          │
    ├─── Step 4 (Registry)┤                          │
    │                     │                          │
    │              Step 2 (Hooks) ─── Step 5 (UI) ──┤
    │                     │                          │
    │                     └── Step 6 (CodeBlock) ────┤
    │                                                │
    │              Step 7 (Layout) ──────────────────┤
    │                                                │
    └───────────────────── Step 8 (Test) ────────────┘
```

---

## Key Architecture Decisions (Already Made)

These decisions are documented in the spec. Do not deviate from them.

1. **Three independent dimensions** on `<html>`: `.dark` class (light/dark), `data-a11y-mode` attribute (accessibility), `data-theme` attribute (creative theme)

2. **CSS cascade order:** Base brand tokens → Creative themes → Accessibility overrides. Source order enforces priority. Accessibility always wins over creative themes for typography.

3. **Creative themes and light/dark:** Retro Terminal and Synthwave force `.dark` class and disable the light/dark toggle. Minimal Ink respects the user's light/dark preference.

4. **Accessibility modes and creative themes can coexist.** A11y typography tokens (spacing, font, weight) always take precedence. Creative theme colours apply (except high-contrast mode, which overrides everything including creative theme colours).

5. **Font loading is lazy.** Fonts are installed as npm packages but only imported when their theme/mode is first activated. No render-blocking.

6. **UI is a settings dialog** (not a dropdown). Trigger button uses Palette icon. Dialog has three sections: Colour Mode, Accessibility, Creative Themes.

7. **Theme switcher replaces ThemeToggle.tsx entirely.** The old dropdown is deleted.

8. **Shiki themes are lazy-loaded** per creative theme. Only `github-light` and `github-dark` load eagerly.

---

## Existing Infrastructure

### Current Theme System
```
app/src/hooks/useTheme.ts              # Returns { theme, setTheme, resolvedTheme }
app/src/components/layout/ThemeToggle.tsx  # Light/Dark/System dropdown — TO BE REPLACED
app/src/index.css                      # @theme inline, :root, .dark colour tokens
app/src/config/site.ts                 # localStoragePrefix: 'phew-playbook'
```

### Layout Components
```
app/src/components/layout/AppLayout.tsx    # Root div — add scanline container class
app/src/components/layout/Header.tsx       # ThemeToggle lives here — swap to ThemeSettings
app/src/components/layout/Sidebar.tsx      # Themed via CSS variables (no changes needed)
app/src/components/layout/TrackLayout.tsx  # Content wrapper with max-w-[65ch]
```

### Content Components
```
app/src/components/content/CodeBlock.tsx          # Uses resolvedTheme for Shiki
app/src/components/content/ShikiHighlighter.tsx   # Loads github-light + github-dark themes
app/src/components/content/SectionPage.tsx        # Page wrapper — add content-area class
```

### Available shadcn/ui Components
```
app/src/components/ui/dialog.tsx           # For settings panel
app/src/components/ui/dropdown-menu.tsx     # Currently used by ThemeToggle
app/src/components/ui/tooltip.tsx           # Already installed
app/src/components/ui/tabs.tsx             # Available
app/src/components/ui/select.tsx           # Available
```

### localStorage Keys (existing)
- `phew-playbook-theme` → `'light' | 'dark' | 'system'`
- `sidebar-collapsed` → `'true' | 'false'`

### localStorage Keys (new — add these)
- `phew-playbook-creative-theme` → `'retro-terminal' | 'synthwave' | 'minimal-ink'` or absent
- `phew-playbook-a11y-mode` → `'dyslexia' | 'high-contrast' | 'large-text'` or absent
- `phew-playbook-a11y-font` → `'atkinson' | 'opendyslexic'` or absent

---

## Colour Values Reference

All colour values in the spec use `oklch()` format to match the existing `index.css` conventions. The creative themes research provided hex values — these have been converted to oklch in the spec. Use the spec's oklch values, not the research's hex values.

---

## Critical Constraints

- **UK English** in all UI labels and copy ("Colour Mode", "Minimise", etc.)
- **Tailwind v4** — CSS-based theming via `@theme inline {}`. No `tailwind.config.js`.
- **Package manager:** `bun` (not npm)
- **No render-blocking fonts** — lazy-load via dynamic CSS imports
- **Existing light/dark/system must work unchanged** for users who don't engage with themes
- **Mobile-friendly** settings dialog (375px+)
- **WCAG 2.2 AA** contrast ratios for all theme palettes
- **`prefers-reduced-motion`** respected for view transitions and glow effects
- **`siteConfig.localStoragePrefix`** used for all new localStorage keys

---

## Build & Dev Commands

```bash
cd app && bun install        # Install dependencies
cd app && bun run dev        # Local dev server (port 4100)
cd app && bun run build      # TypeScript check + production build
cd app && bun run lint       # ESLint
cd app && bun run format     # Prettier — format all files
cd app && bunx tsc --noEmit  # Type check only
```

## Deployment

- **Production:** https://ai-smb-playbook.vercel.app
- **GitHub:** https://github.com/liam-jons/ai-smb-playbook
- Auto-deploys on push to `main`

---

## Verification Checklist

Before finishing, verify:

1. [ ] `cd app && bun run build` passes cleanly
2. [ ] `cd app && bun run lint` passes
3. [ ] `cd app && bun run format` applied
4. [ ] Default light/dark/system mode works exactly as before (no regressions)
5. [ ] Each creative theme applies correctly (colours, fonts, radius, effects)
6. [ ] Retro Terminal scanline overlay visible but subtle
7. [ ] Synthwave glow effects on headings and cards
8. [ ] Minimal Ink supports both light and dark variants
9. [ ] Dyslexia mode applies Atkinson Hyperlegible font, warm background, enhanced spacing
10. [ ] OpenDyslexic option works within dyslexia mode
11. [ ] High contrast mode achieves 7:1+ contrast ratios, suppresses glow/scanline effects
12. [ ] Large text mode scales all text proportionally
13. [ ] Creative theme + accessibility mode combination works (e.g. Retro Terminal + Dyslexia)
14. [ ] Dark-only themes force dark mode and disable the light/dark toggle
15. [ ] Theme settings dialog works on mobile (375px)
16. [ ] Keyboard navigation works in the settings dialog
17. [ ] Code blocks update their Shiki theme when creative theme changes
18. [ ] Fonts lazy-load without blocking initial render
19. [ ] View Transitions animate theme switching (Chrome/Safari)
20. [ ] `prefers-contrast: more` auto-activates high contrast mode
