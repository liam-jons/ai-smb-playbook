# Phase 7 Build Spec: Theme System — Accessibility Modes & Creative Themes

**Date:** 16 February 2026
**Status:** Draft — pending approval
**Depends on:** All previous phases complete (Phases 0–6B)
**Research inputs:**
- `.planning/research/accessibility-styling-research.md`
- `.planning/research/creative-themes-research.md`
- `.planning/research/theme-system-synthesis.md`
- `.planning/research/reusability-audit.md`

---

## 1. Overview

Add a comprehensive theme system to the Phew AI Playbook that layers **accessibility modes** (functional reading needs) and **creative themes** (aesthetic experiences) on top of the existing light/dark mode. The system must be:

- **Orthogonal:** Accessibility modes work independently of creative themes and light/dark
- **Cascading:** CSS custom properties layer cleanly — base brand tokens < creative theme < accessibility overrides
- **Performant:** Fonts load lazily; no render-blocking resources
- **Reusable:** Architecture separates brand tokens (client-specific) from accessibility modes (universal) and creative themes (portable)
- **Accessible:** WCAG 2.2 AA compliant across all mode combinations

### What ships

| Category | Items |
|----------|-------|
| **Accessibility modes** | Dyslexia-friendly, High contrast, Large text |
| **Creative themes** | Retro Terminal, Synthwave / Neon, Minimal Ink |
| **Infrastructure** | Extended `useTheme` hook, new `useAccessibility` hook, theme registry, theme switcher UI, CSS cascade framework |
| **Deferred** | Focus/Reading mode (P4 — design only, no implementation) |

---

## 2. Theme Architecture

### 2.1 Data Model

Three independent dimensions stored on `<html>`:

```
<html
  class="dark"                           ← Light/dark mode (existing)
  data-a11y-mode="dyslexia"              ← Accessibility mode (new)
  data-a11y-font="opendyslexic"          ← Font override within dyslexia mode (new, optional)
  data-theme="retro-terminal"            ← Creative theme (new)
>
```

| Dimension | Attribute/Class | Values | Persistence Key |
|-----------|----------------|--------|-----------------|
| Light/dark | `.dark` class | present / absent | `phew-playbook-theme` (`'light'` \| `'dark'` \| `'system'`) |
| Creative theme | `data-theme` | `'retro-terminal'` \| `'synthwave'` \| `'minimal-ink'` \| absent | `phew-playbook-creative-theme` |
| Accessibility mode | `data-a11y-mode` | `'dyslexia'` \| `'high-contrast'` \| `'large-text'` \| absent | `phew-playbook-a11y-mode` |
| Accessibility font | `data-a11y-font` | `'atkinson'` \| `'opendyslexic'` \| absent | `phew-playbook-a11y-font` |

All localStorage keys use the existing `siteConfig.localStoragePrefix` (`phew-playbook`).

### 2.2 Interaction Rules

**Creative themes and light/dark:**

| Creative Theme | Mode Support | Behaviour |
|---------------|-------------|-----------|
| Retro Terminal | Dark only | Forces `.dark` class on `<html>`. Light/dark toggle disabled. User's previous preference preserved in localStorage for restoration. |
| Synthwave | Dark only | Same as Retro Terminal. |
| Minimal Ink | Light + Dark | Respects the user's light/dark toggle. Provides both `:root[data-theme="minimal-ink"]` and `.dark[data-theme="minimal-ink"]` overrides. |

**Accessibility modes and creative themes (can coexist):**

| Scenario | Colour tokens | Typography tokens | Shape tokens | Effects |
|----------|--------------|-------------------|-------------|---------|
| A11y mode only (no creative theme) | A11y mode overrides base brand colours where defined (e.g. dyslexia warm cream) | A11y mode sets spacing, font, weight | Inherited from base | None |
| Creative theme only (no a11y mode) | Creative theme overrides all colours | Creative theme sets fonts | Creative theme sets radius, shadows | Creative theme effects (scanlines, glow) |
| Both active | Creative theme colours apply (except high-contrast, which overrides everything) | **A11y typography always wins** — body font, spacing, line-height, weight from a11y layer | Creative theme shapes apply | Effects apply unless high-contrast mode (which suppresses glow, scanlines) |

**Priority rule:** Accessibility needs > aesthetic preferences. The CSS cascade enforces this by ordering accessibility overrides after creative theme overrides.

### 2.3 CSS Cascade Architecture

The override order from lowest to highest priority:

```
Layer 1: Base brand tokens       →  :root, .dark                          (existing)
Layer 2: Creative theme tokens   →  [data-theme="..."]                    (new)
Layer 3: Accessibility overrides →  [data-a11y-mode="..."]                (new)
Layer 4: Combined state fixes    →  [data-a11y-mode="..."][data-theme="..."]  (new)
Layer 5: System forced colours   →  @media (forced-colors: active)        (new)
```

Source order in the CSS file enforces this. All selectors use attribute/class selectors at specificity (0,1,0) or (0,2,0) for combined states, so cascade position determines the winner.

### 2.4 New CSS Custom Properties

**Typography tokens** (added to `@theme inline` in `index.css`):

| Token | Default | Purpose |
|-------|---------|---------|
| `--font-heading` | `var(--font-sans)` | Heading font family — creative themes override this for distinct heading fonts |
| `--font-mono` | `ui-monospace, 'SFMono-Regular', monospace` | Monospace font family — used by code blocks, overridden by Retro Terminal |

**Accessibility typography tokens** (defined in `:root`, consumed by `body`):

| Token | Default | Purpose |
|-------|---------|---------|
| `--a11y-letter-spacing` | `normal` | Letter spacing — dyslexia mode sets `0.05em` |
| `--a11y-word-spacing` | `normal` | Word spacing — dyslexia mode sets `0.16em` |
| `--a11y-line-height` | `1.5` | Line height — dyslexia mode sets `1.8` |
| `--a11y-font-weight` | `400` | Body font weight — dyslexia mode sets `500` |
| `--a11y-paragraph-spacing` | `1em` | Paragraph margin — dyslexia mode sets `1.5em` |
| `--a11y-max-width` | `none` | Content max-width — dyslexia mode sets `70ch` |
| `--a11y-font-size-scale` | `1` | Root font-size multiplier — large-text mode sets `1.25` |

**Theme effect tokens** (defined in `:root`, consumed by components):

| Token | Default | Purpose |
|-------|---------|---------|
| `--theme-heading-glow` | `none` | Text-shadow on headings — Retro Terminal/Synthwave set glow values |
| `--theme-shadow` | `none` | Card/interactive shadow — Synthwave sets coloured glow |
| `--theme-border-width` | `1px` | Border width — high-contrast sets `2px` |
| `--theme-scanline-opacity` | `0` | Scanline overlay opacity — Retro Terminal sets `0.06` |

### 2.5 Extending Tailwind v4

In `index.css`, extend the `@theme inline` block:

```css
@theme inline {
  /* ...existing mappings (unchanged)... */

  /* New typography tokens */
  --font-heading: var(--font-heading);
  --font-mono: var(--font-mono);
}
```

Add a custom variant for optional per-component a11y overrides (rarely needed):

```css
@custom-variant dyslexia (&:is([data-a11y-mode="dyslexia"] *));
@custom-variant high-contrast (&:is([data-a11y-mode="high-contrast"] *));
```

---

## 3. Per-Theme Definitions

### 3.1 Dyslexia-Friendly Mode

**Purpose:** Combine evidence-based typography adjustments (spacing, weight, line-height) with a readability-optimised font and warm background tint. Works in both light and dark.

**Attribute:** `data-a11y-mode="dyslexia"`

**Default font:** Atkinson Hyperlegible Next (2025, Braille Institute, 7 weights, Google Fonts / Fontsource)
**Optional font:** OpenDyslexic (selected via `data-a11y-font="opendyslexic"`)

**Typography overrides (always applied regardless of creative theme):**

| Property | Value | Evidence |
|----------|-------|----------|
| `--font-sans` | `'Atkinson Hyperlegible Next', ui-sans-serif, system-ui, sans-serif` | Braille Institute — maximised character differentiation |
| `--a11y-letter-spacing` | `0.05em` | Zorzi et al. (2012, PNAS) — doubled accuracy |
| `--a11y-word-spacing` | `0.16em` | WCAG 1.4.12 AA minimum |
| `--a11y-line-height` | `1.8` | BDA Style Guide 2023 |
| `--a11y-font-weight` | `500` | Smashing Magazine pattern |
| `--a11y-paragraph-spacing` | `1.5em` | WCAG 1.4.12 AA |
| `--a11y-max-width` | `70ch` | BDA guidance (60–70 chars optimal) |

**Colour overrides (only when no creative theme is active):**

```css
/* Light + dyslexia */
:root[data-a11y-mode="dyslexia"]:not([data-theme]) {
  --background: oklch(0.97 0.01 80);      /* Warm cream */
  --card: oklch(0.985 0.008 80);
  --foreground: oklch(0.15 0.01 60);      /* Warm near-black */
  --muted: oklch(0.94 0.01 80);
  --border: oklch(0.88 0.01 80);
  --sidebar: oklch(0.96 0.01 80);
  --sidebar-foreground: oklch(0.15 0.01 60);
  --sidebar-border: oklch(0.88 0.01 80);
}

/* Dark + dyslexia */
.dark[data-a11y-mode="dyslexia"]:not([data-theme]) {
  --background: oklch(0.18 0.01 60);      /* Warm dark grey */
  --card: oklch(0.22 0.01 60);
  --foreground: oklch(0.92 0.008 80);     /* Warm light */
  --muted: oklch(0.28 0.01 60);
  --border: oklch(0.32 0.01 60);
  --sidebar: oklch(0.2 0.01 60);
  --sidebar-foreground: oklch(0.92 0.008 80);
  --sidebar-border: oklch(0.32 0.01 60);
}
```

**OpenDyslexic font override:**

```css
[data-a11y-font="opendyslexic"] {
  --font-sans: 'OpenDyslexic', ui-sans-serif, system-ui, sans-serif;
  font-size-adjust: 0.5;  /* Normalise x-height — Baseline July 2024 */
}
```

**Shiki theme:** Inherited from light/dark or creative theme (no change).

---

### 3.2 High Contrast Mode

**Purpose:** Increase contrast ratios to 7:1+ (WCAG AAA) for all text. Strengthens borders, removes subtle colour distinctions. Overrides creative theme colours when both are active.

**Attribute:** `data-a11y-mode="high-contrast"`

**Auto-detection:** Activate automatically when `prefers-contrast: more` media query matches and no user override is stored.

```css
/* Light + high contrast */
:root[data-a11y-mode="high-contrast"] {
  --background: oklch(1.0 0 0);          /* Pure white */
  --foreground: oklch(0.0 0 0);          /* Pure black */
  --card: oklch(1.0 0 0);
  --card-foreground: oklch(0.0 0 0);
  --popover: oklch(1.0 0 0);
  --popover-foreground: oklch(0.0 0 0);
  --primary: oklch(0.3 0.15 250);
  --primary-foreground: oklch(1.0 0 0);
  --secondary: oklch(0.9 0 0);
  --secondary-foreground: oklch(0.1 0 0);
  --muted: oklch(0.95 0 0);
  --muted-foreground: oklch(0.2 0 0);
  --accent: oklch(0.9 0 0);
  --accent-foreground: oklch(0.1 0 0);
  --destructive: oklch(0.45 0.25 25);
  --border: oklch(0.0 0 0);
  --input: oklch(0.0 0 0);
  --ring: oklch(0.0 0 0);
  --sidebar: oklch(0.97 0 0);
  --sidebar-foreground: oklch(0.0 0 0);
  --sidebar-primary: oklch(0.3 0.15 250);
  --sidebar-primary-foreground: oklch(1.0 0 0);
  --sidebar-accent: oklch(0.9 0 0);
  --sidebar-accent-foreground: oklch(0.1 0 0);
  --sidebar-border: oklch(0.0 0 0);
  --sidebar-ring: oklch(0.0 0 0);
  --theme-heading-glow: none;             /* Suppress creative theme effects */
  --theme-shadow: none;
  --theme-scanline-opacity: 0;
  --theme-border-width: 2px;
}

/* Dark + high contrast */
.dark[data-a11y-mode="high-contrast"] {
  --background: oklch(0.0 0 0);          /* Pure black */
  --foreground: oklch(1.0 0 0);          /* Pure white */
  --card: oklch(0.05 0 0);
  --card-foreground: oklch(1.0 0 0);
  --popover: oklch(0.05 0 0);
  --popover-foreground: oklch(1.0 0 0);
  --primary: oklch(0.75 0.15 250);
  --primary-foreground: oklch(0.0 0 0);
  --secondary: oklch(0.15 0 0);
  --secondary-foreground: oklch(0.95 0 0);
  --muted: oklch(0.1 0 0);
  --muted-foreground: oklch(0.8 0 0);
  --accent: oklch(0.15 0 0);
  --accent-foreground: oklch(0.95 0 0);
  --destructive: oklch(0.65 0.25 25);
  --border: oklch(1.0 0 0);
  --input: oklch(1.0 0 0);
  --ring: oklch(1.0 0 0);
  --sidebar: oklch(0.05 0 0);
  --sidebar-foreground: oklch(1.0 0 0);
  --sidebar-primary: oklch(0.75 0.15 250);
  --sidebar-primary-foreground: oklch(0.0 0 0);
  --sidebar-accent: oklch(0.15 0 0);
  --sidebar-accent-foreground: oklch(0.95 0 0);
  --sidebar-border: oklch(1.0 0 0);
  --sidebar-ring: oklch(1.0 0 0);
  --theme-heading-glow: none;
  --theme-shadow: none;
  --theme-scanline-opacity: 0;
  --theme-border-width: 2px;
}
```

**Shiki theme:** `github-light` (light) / `github-dark` (dark) — inherited from base.

---

### 3.3 Large Text Mode

**Purpose:** Scale all text proportionally by increasing the root font size. No colour or layout changes. Works with everything.

**Attribute:** `data-a11y-mode="large-text"`

```css
[data-a11y-mode="large-text"] {
  --a11y-font-size-scale: 1.25;  /* 125% — 16px base becomes 20px */
}
```

**Note:** Because the app uses `rem`-based sizing throughout, everything scales proportionally. The `body` rule applies: `font-size: calc(1rem * var(--a11y-font-size-scale, 1))`.

**Limitation:** Only one `data-a11y-mode` value can be active at a time (it's a single attribute, not a list). If a user needs both dyslexia mode and large text, the dyslexia mode should offer a "larger text" sub-option within its settings. See Section 4 for the UI approach.

---

### 3.4 Retro Terminal (Creative Theme)

**Concept:** Classic 1980s CRT terminal — green phosphor text on black, monospace typography, scanline overlay, phosphor glow.
**Mode:** Dark only (forces `.dark` class)
**Attribute:** `data-theme="retro-terminal"`

**Colour palette (oklch):**

| Token | Value | Visual |
|-------|-------|--------|
| `--background` | `oklch(0.07 0 0)` | Near-black |
| `--foreground` | `oklch(0.75 0.2 140)` | Phosphor green |
| `--card` | `oklch(0.12 0 0)` | Slightly lighter |
| `--card-foreground` | `oklch(0.75 0.2 140)` | Phosphor green |
| `--popover` | `oklch(0.12 0 0)` | Matches card |
| `--popover-foreground` | `oklch(0.75 0.2 140)` | Green |
| `--primary` | `oklch(0.7 0.25 145)` | Bright green |
| `--primary-foreground` | `oklch(0.07 0 0)` | Black text on green |
| `--secondary` | `oklch(0.15 0.04 140)` | Dark green tint |
| `--secondary-foreground` | `oklch(0.75 0.2 140)` | Green |
| `--muted` | `oklch(0.1 0 0)` | Subtle dark |
| `--muted-foreground` | `oklch(0.5 0.15 140)` | Dim green |
| `--accent` | `oklch(0.15 0.08 140)` | Deep green |
| `--accent-foreground` | `oklch(0.75 0.2 140)` | Green |
| `--destructive` | `oklch(0.6 0.25 25)` | Red (visible on dark) |
| `--border` | `oklch(0.2 0.06 140)` | Green-tinted border |
| `--input` | `oklch(0.2 0.06 140)` | Matches border |
| `--ring` | `oklch(0.7 0.25 145)` | Bright green |

**Sidebar tokens:**

| Token | Value |
|-------|-------|
| `--sidebar` | `oklch(0.08 0 0)` |
| `--sidebar-foreground` | `oklch(0.75 0.2 140)` |
| `--sidebar-primary` | `oklch(0.7 0.25 145)` |
| `--sidebar-primary-foreground` | `oklch(0.07 0 0)` |
| `--sidebar-accent` | `oklch(0.12 0.06 140)` |
| `--sidebar-accent-foreground` | `oklch(0.75 0.2 140)` |
| `--sidebar-border` | `oklch(0.2 0.06 140)` |
| `--sidebar-ring` | `oklch(0.7 0.25 145)` |

**Typography:**
- `--font-sans`: `'JetBrains Mono', ui-monospace, monospace` (monospace body)
- `--font-heading`: `'VT323', monospace` (CRT character glyphs)
- `--font-mono`: `'JetBrains Mono', ui-monospace, monospace`

**Shape:**
- `--radius`: `0` (sharp rectangles — terminals don't have rounded corners)

**Effects:**
- `--theme-heading-glow`: `0 0 5px oklch(0.75 0.2 140), 0 0 10px oklch(0.75 0.2 140 / 0.5)`
- `--theme-shadow`: `none`
- `--theme-scanline-opacity`: `0.06`

**Scanline overlay** — applied via `::after` pseudo-element on `.theme-scanline-container`:
```css
[data-theme="retro-terminal"] .theme-scanline-container::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  background: repeating-linear-gradient(
    transparent,
    transparent 2px,
    oklch(0 0 0 / var(--theme-scanline-opacity, 0)) 2px,
    oklch(0 0 0 / var(--theme-scanline-opacity, 0)) 4px
  );
}
```

The `theme-scanline-container` class should be added to the root `<div>` in `AppLayout.tsx`. The `::after` only renders when `--theme-scanline-opacity > 0` (i.e. only for Retro Terminal).

**Shiki theme:** `vitesse-dark` with CSS overrides for green tint:
```css
[data-theme="retro-terminal"] [data-shiki-theme] {
  color: oklch(0.7 0.2 140) !important;
  background-color: oklch(0.09 0 0) !important;
}
```

Alternatively, bundle the `vitesse-dark` theme in `ShikiHighlighter.tsx` and map to it in the theme registry.

---

### 3.5 Synthwave / Neon (Creative Theme)

**Concept:** 1980s retrowave — deep purple background, neon pink and cyan, glow effects, gradient accents.
**Mode:** Dark only (forces `.dark` class)
**Attribute:** `data-theme="synthwave"`

**Colour palette (oklch):**

| Token | Value | Visual |
|-------|-------|--------|
| `--background` | `oklch(0.15 0.05 300)` | Deep purple-black |
| `--foreground` | `oklch(0.88 0.04 300)` | Soft lavender white |
| `--card` | `oklch(0.18 0.04 300)` | Slightly lighter purple |
| `--card-foreground` | `oklch(0.88 0.04 300)` | Lavender |
| `--popover` | `oklch(0.18 0.04 300)` | Matches card |
| `--popover-foreground` | `oklch(0.88 0.04 300)` | Lavender |
| `--primary` | `oklch(0.6 0.25 350)` | Hot pink (neon) |
| `--primary-foreground` | `oklch(0.15 0.05 300)` | Dark on pink |
| `--secondary` | `oklch(0.2 0.04 300)` | Mid purple |
| `--secondary-foreground` | `oklch(0.88 0.04 300)` | Lavender |
| `--muted` | `oklch(0.2 0.04 300)` | Subtle surface |
| `--muted-foreground` | `oklch(0.55 0.06 300)` | Muted lavender |
| `--accent` | `oklch(0.65 0.2 195)` | Cyan neon |
| `--accent-foreground` | `oklch(0.15 0.05 300)` | Dark on cyan |
| `--destructive` | `oklch(0.6 0.22 25)` | Red |
| `--border` | `oklch(0.28 0.04 300)` | Purple-tinted border |
| `--input` | `oklch(0.28 0.04 300)` | Matches border |
| `--ring` | `oklch(0.6 0.25 350)` | Hot pink |

**Sidebar tokens:**

| Token | Value |
|-------|-------|
| `--sidebar` | `oklch(0.13 0.05 300)` |
| `--sidebar-foreground` | `oklch(0.88 0.04 300)` |
| `--sidebar-primary` | `oklch(0.6 0.25 350)` |
| `--sidebar-primary-foreground` | `oklch(0.15 0.05 300)` |
| `--sidebar-accent` | `oklch(0.2 0.04 300)` |
| `--sidebar-accent-foreground` | `oklch(0.88 0.04 300)` |
| `--sidebar-border` | `oklch(0.28 0.04 300)` |
| `--sidebar-ring` | `oklch(0.6 0.25 350)` |

**Typography:**
- `--font-heading`: `'Space Grotesk', system-ui, sans-serif` (geometric, futuristic)
- `--font-sans`: inherited (Plus Jakarta Sans — keep body readable, colour provides personality)
- `--font-mono`: inherited

**Shape:**
- `--radius`: `0.5rem` (slightly rounded, modern)

**Effects:**
- `--theme-heading-glow`: `0 0 5px oklch(0.6 0.25 350), 0 0 10px oklch(0.6 0.25 350 / 0.3)`
- `--theme-shadow`: `0 0 15px oklch(0.6 0.25 350 / 0.3)` (cards)
- `--theme-scanline-opacity`: `0`

**Gradient accent in header:**
```css
[data-theme="synthwave"] .header-accent {
  background: linear-gradient(90deg, oklch(0.6 0.25 350), oklch(0.65 0.2 195));
  height: 2px;
}
```

**Shiki theme:** `dracula-soft`

---

### 3.6 Minimal Ink (Creative Theme)

**Concept:** High-contrast monochrome with a single warm red accent. Sharp rectangles, bold typography, ink-on-paper.
**Mode:** Light + Dark (respects user's light/dark toggle)
**Attribute:** `data-theme="minimal-ink"`

**Colour palette — Light variant:**

| Token | Value | Visual |
|-------|-------|--------|
| `--background` | `oklch(1.0 0 0)` | Pure white |
| `--foreground` | `oklch(0.1 0 0)` | Near-black |
| `--card` | `oklch(0.99 0 0)` | Very subtle grey |
| `--card-foreground` | `oklch(0.1 0 0)` | Near-black |
| `--popover` | `oklch(0.99 0 0)` | Matches card |
| `--popover-foreground` | `oklch(0.1 0 0)` | Near-black |
| `--primary` | `oklch(0.45 0.18 25)` | Deep warm red |
| `--primary-foreground` | `oklch(1.0 0 0)` | White on red |
| `--secondary` | `oklch(0.96 0 0)` | Light grey |
| `--secondary-foreground` | `oklch(0.1 0 0)` | Near-black |
| `--muted` | `oklch(0.96 0 0)` | Subtle grey |
| `--muted-foreground` | `oklch(0.5 0 0)` | Medium grey |
| `--accent` | `oklch(0.45 0.18 25)` | Same red (unified) |
| `--accent-foreground` | `oklch(1.0 0 0)` | White |
| `--destructive` | `oklch(0.45 0.18 25)` | Same red |
| `--border` | `oklch(0.85 0 0)` | Light grey |
| `--input` | `oklch(0.85 0 0)` | Matches border |
| `--ring` | `oklch(0.45 0.18 25)` | Red |

**Colour palette — Dark variant:**

| Token | Value |
|-------|-------|
| `--background` | `oklch(0.1 0 0)` |
| `--foreground` | `oklch(0.95 0 0)` |
| `--card` | `oklch(0.14 0 0)` |
| `--card-foreground` | `oklch(0.95 0 0)` |
| `--primary` | `oklch(0.55 0.18 25)` |
| `--primary-foreground` | `oklch(1.0 0 0)` |
| `--secondary` | `oklch(0.16 0 0)` |
| `--muted` | `oklch(0.16 0 0)` |
| `--muted-foreground` | `oklch(0.6 0 0)` |
| `--accent` | `oklch(0.55 0.18 25)` |
| `--accent-foreground` | `oklch(1.0 0 0)` |
| `--destructive` | `oklch(0.6 0.2 25)` |
| `--border` | `oklch(0.25 0 0)` |
| `--input` | `oklch(0.25 0 0)` |
| `--ring` | `oklch(0.55 0.18 25)` |

Both variants include matching sidebar tokens (derived from main tokens — sidebar slightly offset from background).

**Typography:**
- `--font-heading`: `'Fraunces', serif` (variable font with "wonk" axis — adds personality)
- `--font-sans`: `'Inter', system-ui, sans-serif` (clean, neutral)
- `--font-mono`: inherited

**Shape:**
- `--radius`: `0` (sharp rectangles, print-inspired)

**Effects:**
- All effect tokens set to `none` (completely flat, no glow, no shadows)

**Shiki theme:** `min-light` (light variant) / `min-dark` (dark variant)

---

## 4. Theme Switcher UI

### 4.1 Approach: Settings Dialog

Replace the current `ThemeToggle` dropdown with a **settings dialog** that organises themes into clear sections. The trigger button remains in the header (same position, same ghost icon button), but opens a `Dialog` instead of a `DropdownMenu`.

**Why a dialog over an expanded dropdown:**
- Accommodates 7+ options without a cramped dropdown
- Provides space for colour swatches and descriptions
- Mobile-friendly (dialog becomes a bottom sheet on mobile via shadcn/ui)
- Room for the dyslexia font sub-option
- Cleaner separation between accessibility and creative themes

### 4.2 Dialog Layout

```
┌──────────────────────────────────────────────┐
│  Appearance Settings                     [X] │
│                                              │
│  ┌─ Colour Mode ───────────────────────────┐ │
│  │  ○ Light    ○ Dark    ○ System          │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  ┌─ Accessibility ─────────────────────────┐ │
│  │  ☐ Dyslexia-friendly                   │ │
│  │    └─ Font: Atkinson Hyperlegible | ▾   │ │
│  │  ☐ High contrast                       │ │
│  │  ☐ Large text                          │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  ┌─ Creative Themes ──────────────────────┐  │
│  │  [●●●] Default          (active)       │  │
│  │  [●●●] Retro Terminal   Dark only      │  │
│  │  [●●●] Synthwave        Dark only      │  │
│  │  [●●●] Minimal Ink      Light + Dark   │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌─ ─────────────────────────────────────┐   │
│  │  These themes were designed             │ │
│  │  collaboratively with Claude — the same │ │
│  │  AI covered in this playbook.           │ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### 4.3 UI Behaviour Details

**Colour mode section:**
- Radio group: Light / Dark / System (same as current)
- When a dark-only creative theme is active, these radios are disabled with a tooltip: "This theme is dark-only"
- When Minimal Ink is active, the radios remain enabled

**Accessibility section:**
- Toggle switches (not radio buttons — only one `data-a11y-mode` can be active, so selecting one deselects others)
- Dyslexia-friendly: when toggled on, shows a font selector below it (Atkinson Hyperlegible Next / OpenDyslexic)
- High contrast: simple toggle
- Large text: simple toggle
- Toggling dyslexia mode off also clears `data-a11y-font`

**Creative themes section:**
- List of theme options with colour swatches (3-4 small coloured circles per theme showing background, primary, accent)
- "Default" option to clear the creative theme and return to the base brand palette
- Clicking a theme applies it immediately (live preview)
- "Dark only" label shown for Retro Terminal and Synthwave
- Selected theme highlighted with a border/ring

**Meta-narrative note:**
- Small muted text at the bottom of the dialog
- Only shown when a creative theme is active (not on default)

### 4.4 Trigger Button

Replace the current Sun/Moon icon with a more general **Palette** icon (from lucide-react: `import { Palette } from 'lucide-react'`). The button retains `variant="ghost" size="icon"` styling.

When a creative theme or accessibility mode is active, add a small indicator dot on the button to signal non-default settings.

### 4.5 Mobile Considerations

On mobile (< 768px), the dialog should:
- Use shadcn/ui's `DialogContent` which is already responsive
- Stack sections vertically
- Touch-friendly toggle sizes (min 44px tap targets per WCAG 2.5.8)
- The theme swatches should be large enough to distinguish colours on small screens

### 4.6 Keyboard Navigation

- Dialog opens/closes with Escape (standard shadcn/ui dialog behaviour)
- Tab through all controls within the dialog
- Radio groups navigable with arrow keys
- Toggle switches activatable with Space/Enter
- All interactive elements have visible focus indicators

---

## 5. Font Loading Strategy

### 5.1 Fonts Required

| Font | Theme/Mode | Weight(s) | Approx Size | Source |
|------|-----------|-----------|-------------|--------|
| Atkinson Hyperlegible Next | Dyslexia mode | 400, 500, 700 | ~60KB | `@fontsource/atkinson-hyperlegible-next` |
| OpenDyslexic | Dyslexia mode (optional) | 400, 700 | ~80KB | `@fontsource/opendyslexic` |
| VT323 | Retro Terminal (headings) | 400 | ~15KB | `@fontsource/vt323` |
| JetBrains Mono | Retro Terminal (body) | 400, 700 | ~100KB | `@fontsource/jetbrains-mono` |
| Space Grotesk | Synthwave (headings) | 400, 700 | ~40KB | `@fontsource/space-grotesk` |
| Fraunces | Minimal Ink (headings) | Variable | ~120KB | `@fontsource-variable/fraunces` |
| Inter | Minimal Ink (body) | Variable | ~100KB | `@fontsource-variable/inter` |

**Total if all loaded:** ~515KB. Not loaded eagerly — see strategy below.

### 5.2 Loading Strategy: Lazy Dynamic Imports

Fonts are installed as npm packages via `bun add` but only loaded when their theme/mode is first activated. This avoids blocking initial render and keeps the default bundle size unchanged.

```typescript
// In useAccessibility.ts or a dedicated font-loader utility
async function loadFontsForMode(mode: string, font?: string) {
  switch (mode) {
    case 'dyslexia':
      if (font === 'opendyslexic') {
        await import('@fontsource/opendyslexic/400.css');
        await import('@fontsource/opendyslexic/700.css');
      } else {
        await import('@fontsource/atkinson-hyperlegible-next/400.css');
        await import('@fontsource/atkinson-hyperlegible-next/500.css');
        await import('@fontsource/atkinson-hyperlegible-next/700.css');
      }
      break;
  }
}

async function loadFontsForTheme(theme: string) {
  switch (theme) {
    case 'retro-terminal':
      await import('@fontsource/vt323/400.css');
      await import('@fontsource/jetbrains-mono/400.css');
      await import('@fontsource/jetbrains-mono/700.css');
      break;
    case 'synthwave':
      await import('@fontsource/space-grotesk/400.css');
      await import('@fontsource/space-grotesk/700.css');
      break;
    case 'minimal-ink':
      await import('@fontsource-variable/fraunces');
      await import('@fontsource-variable/inter');
      break;
  }
}
```

**Fallback during loading:** The `font-family` stacks include system fallbacks (e.g. `ui-monospace, monospace` for JetBrains Mono). The CSS `font-display: swap` behaviour from Fontsource means text renders in the fallback immediately, then swaps once the font is loaded (typically < 200ms on modern connections).

**On page load with a persisted theme:** If a user refreshes with Retro Terminal active, the hook calls `loadFontsForTheme('retro-terminal')` on mount. There will be a brief FOUT (flash of unstyled text) as fonts load — this is acceptable and standard practice.

### 5.3 Package Installation

```bash
cd app && bun add @fontsource/atkinson-hyperlegible-next @fontsource/opendyslexic @fontsource/vt323 @fontsource/jetbrains-mono @fontsource/space-grotesk @fontsource-variable/fraunces @fontsource-variable/inter
```

---

## 6. Component Changes

### 6.1 Modified Existing Components

| File | Changes |
|------|---------|
| `hooks/useTheme.ts` | Extend to manage creative themes. Add `creativeTheme` / `setCreativeTheme` to the return value. Handle forcing `.dark` for dark-only themes. Preserve user's light/dark preference when a dark-only theme is activated. Restore it when deactivated. |
| `components/layout/ThemeToggle.tsx` | Replace with `ThemeSettings.tsx` — a dialog-based settings panel. Remove the old dropdown. Keep the trigger button in the same location. |
| `components/layout/Header.tsx` | Import `ThemeSettings` instead of `ThemeToggle`. Update the trigger icon from Sun/Moon to Palette. |
| `components/layout/AppLayout.tsx` | Add `theme-scanline-container` class to the root `<div>` to enable the scanline overlay pseudo-element. |
| `components/content/CodeBlock.tsx` | Update Shiki theme resolution. Instead of `resolvedTheme === 'dark' ? 'github-dark' : 'github-light'`, use a `getShikiTheme()` function that checks the active creative theme and falls back to light/dark defaults. |
| `components/content/ShikiHighlighter.tsx` | Add additional Shiki theme imports (`vitesse-dark`, `dracula-soft`, `min-light`, `min-dark`) to `SUPPORTED_THEMES` and the highlighter initialisation. Lazy-load these theme modules to avoid bloating the initial bundle. |
| `components/content/SectionPage.tsx` | Add `content-area` class to the content container (for `--a11y-max-width` support). Currently the max-width is set in `TrackLayout.tsx` via `max-w-[65ch]` — the `--a11y-max-width` override should work alongside this. |
| `index.css` | Add new token defaults to `@theme inline`. Add `body` rule consuming a11y tokens (letter-spacing, word-spacing, line-height, font-weight, font-size). Add heading/code font-family rules. Add `prefers-contrast` and `forced-colors` media queries. Import `themes.css`. |

### 6.2 New Components

| File | Purpose |
|------|---------|
| `hooks/useAccessibility.ts` | New hook managing `data-a11y-mode` and `data-a11y-font` attributes. Handles localStorage persistence, font loading, and `prefers-contrast` auto-detection. |
| `components/layout/ThemeSettings.tsx` | New settings dialog component. Contains the full theme switcher UI (colour mode radios, accessibility toggles, creative theme gallery). Uses shadcn/ui `Dialog`, `RadioGroup`, `Switch`, and `Label` components. |
| `components/layout/ThemePreview.tsx` | Small component rendering 3-4 colour swatch circles for a theme. Used in the creative themes gallery within `ThemeSettings`. |
| `styles/themes.css` | All creative theme CSS custom property overrides. Imported by `index.css`. Keeps theme definitions separate from base brand tokens. |
| `styles/a11y.css` | All accessibility mode CSS custom property overrides and typography rules. Imported by `index.css`. |
| `themes/index.ts` | Theme registry — exports metadata for each theme (id, label, description, mode support, swatch colours, Shiki theme name). |

### 6.3 New shadcn/ui Components Needed

These may need to be added if not already present:

| Component | Purpose |
|-----------|---------|
| `switch.tsx` | Toggle switches for accessibility mode options |
| `radio-group.tsx` | Radio group for colour mode selection |
| `label.tsx` | Labels for form controls |

Check if these exist in `components/ui/` first. If not, install via `bunx shadcn add switch radio-group label`.

---

## 7. Shiki Theme Integration

### 7.1 Theme Mapping

```typescript
// In themes/index.ts or a utility
export const shikiThemeMap: Record<string, { light: string; dark: string }> = {
  default: { light: 'github-light', dark: 'github-dark' },
  'retro-terminal': { light: 'vitesse-dark', dark: 'vitesse-dark' },
  'synthwave': { light: 'dracula-soft', dark: 'dracula-soft' },
  'minimal-ink': { light: 'min-light', dark: 'min-dark' },
};
```

### 7.2 CodeBlock Resolution

The `CodeBlock` component currently reads `resolvedTheme` (light/dark) from `useTheme`. Extend this:

```typescript
function getShikiTheme(resolvedTheme: 'light' | 'dark', creativeTheme: string | null): string {
  if (creativeTheme && shikiThemeMap[creativeTheme]) {
    const themeEntry = shikiThemeMap[creativeTheme];
    return resolvedTheme === 'dark' ? themeEntry.dark : themeEntry.light;
  }
  return resolvedTheme === 'dark' ? 'github-dark' : 'github-light';
}
```

### 7.3 Lazy Theme Loading

To avoid bundling all Shiki themes eagerly, load them on demand:

```typescript
// In ShikiHighlighter.tsx — extend the highlighter to load themes dynamically
const themeImports: Record<string, () => Promise<unknown>> = {
  'github-light': () => import('shiki/themes/github-light.mjs'),
  'github-dark': () => import('shiki/themes/github-dark.mjs'),
  'vitesse-dark': () => import('shiki/themes/vitesse-dark.mjs'),
  'dracula-soft': () => import('shiki/themes/dracula-soft.mjs'),
  'min-light': () => import('shiki/themes/min-light.mjs'),
  'min-dark': () => import('shiki/themes/min-dark.mjs'),
};
```

The highlighter instance can load themes via `highlighter.loadTheme()` when a creative theme is first activated. This keeps the initial bundle at the current 2 themes.

---

## 8. View Transitions (Theme Switch Animation)

Use the View Transitions API for a smooth crossfade when switching themes:

```typescript
function applyThemeWithTransition(callback: () => void) {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    callback();
    return;
  }

  if (!document.startViewTransition) {
    callback(); // Fallback: instant swap
    return;
  }

  document.startViewTransition(() => {
    callback();
  });
}
```

**Browser support:** Chrome, Edge, Safari 18+. Firefox falls back to instant swap (functional, not animated).

Apply this wrapper in `useTheme` when `setCreativeTheme` is called, and in `useAccessibility` when mode changes.

---

## 9. System Media Query Integration

### 9.1 `prefers-contrast: more`

Auto-detect and apply high-contrast mode:

```typescript
// In useAccessibility.ts
useEffect(() => {
  const storedMode = getStoredA11yMode();
  if (storedMode !== 'default') return; // User has explicitly set a preference

  const contrastQuery = window.matchMedia('(prefers-contrast: more)');
  if (contrastQuery.matches) {
    applyA11yMode('high-contrast');
  }

  const handler = (e: MediaQueryListEvent) => {
    if (e.matches && getStoredA11yMode() === 'default') {
      applyA11yMode('high-contrast');
    }
  };
  contrastQuery.addEventListener('change', handler);
  return () => contrastQuery.removeEventListener('change', handler);
}, []);
```

### 9.2 `forced-colors: active`

Handle Windows High Contrast Mode:

```css
@media (forced-colors: active) {
  :root {
    --theme-heading-glow: none;
    --theme-shadow: none;
    --theme-scanline-opacity: 0;
  }
}
```

No JS needed — the browser handles all colour enforcement. We just suppress effects that could interfere.

### 9.3 `prefers-reduced-motion`

Already handled in `index.css`. Additionally:
- View Transitions are skipped when reduced motion is preferred (see Section 8)
- Theme glow animations should respect this (use `transition: none` in reduced motion)

---

## 10. Accessibility Compliance

### 10.1 WCAG 2.2 AA Requirements

| Criterion | Requirement | How Each Mode Complies |
|-----------|-------------|----------------------|
| 1.4.3 Contrast (AA) | 4.5:1 normal, 3:1 large | All colour palettes must be verified. High-contrast mode exceeds 7:1 (AAA). Creative themes must meet 4.5:1 minimum. |
| 1.4.4 Resize Text (AA) | 200% without loss | Large-text mode scales to 125%. App must also handle browser zoom to 200% without layout breakage. |
| 1.4.8 Visual Presentation (AAA) | ≤80 chars/line, 1.5 leading, no justify, user colours | Dyslexia mode meets all criteria. Default mode meets most. |
| 1.4.12 Text Spacing (AA) | line-height ≥1.5x, letter ≥0.12em, word ≥0.16em, para ≥2em | Dyslexia mode exceeds minimums. Content must not break when these values are applied. |
| 2.4.7 Focus Visible (AA) | All interactive elements have visible focus | Focus ring (`--ring`) defined per theme/mode. |
| 2.5.8 Target Size (AA) | Minimum 24x24px, recommended 44x44px | All toggle switches and theme selectors ≥44px tap target on mobile. |

### 10.2 Contrast Verification

During implementation, verify contrast ratios for each theme using:
- Chrome DevTools colour contrast checker
- `oklch()` contrast calculation tools
- Key pairs to check per theme: `--foreground` on `--background`, `--primary-foreground` on `--primary`, `--muted-foreground` on `--background`, `--card-foreground` on `--card`

### 10.3 Screenreader Considerations

- Theme settings dialog must have a descriptive `DialogTitle` ("Appearance Settings")
- Toggle switches need `aria-label` or associated `<label>` elements
- Creative theme options need `role="radiogroup"` semantics
- Status changes (e.g. "Retro Terminal theme activated") should be announced via `aria-live="polite"` region
- The active theme/mode indicator on the header button needs `aria-label` update

---

## 11. Meta-Narrative Integration

### 11.1 In the Theme Switcher Dialog

When any creative theme is selected, show a small note at the bottom of the dialog:

> "These themes were designed collaboratively with Claude — the same AI covered in this playbook. Each started as a natural language description and was refined through conversation."

Use muted text styling. Not shown when on the default theme.

### 11.2 On the Welcome Page

Add a brief mention in the existing "Built using the tools and workflows covered in this guide" copy in the footer or welcome section:

> "Even the creative themes — from the Retro Terminal's phosphor glow to Synthwave's neon gradients — were designed using the conversational workflow you'll learn in this playbook."

Only add if it flows naturally and doesn't feel forced.

### 11.3 Developer Track Reference

In the relevant developer section (likely 1.8 or the skills section), mention the theme system as a concrete example of iterative AI-assisted design:

> "The playbook's own theme system was built by describing each creative theme in natural language — colour palettes, font pairings, CSS effects — and refining through conversation."

---

## 12. File Structure

### 12.1 New Files

```
app/src/
  hooks/
    useAccessibility.ts          ← New: accessibility mode management
  components/
    layout/
      ThemeSettings.tsx          ← New: settings dialog (replaces ThemeToggle)
      ThemePreview.tsx           ← New: colour swatch component
  styles/
    themes.css                   ← New: creative theme CSS overrides
    a11y.css                     ← New: accessibility mode CSS overrides
  themes/
    index.ts                     ← New: theme registry (metadata, Shiki mapping)
```

### 12.2 Modified Files

```
app/src/
  hooks/useTheme.ts              ← Extend with creative theme support
  components/layout/Header.tsx   ← Import ThemeSettings, change icon
  components/layout/AppLayout.tsx ← Add scanline container class
  components/content/CodeBlock.tsx ← Use theme-aware Shiki resolution
  components/content/ShikiHighlighter.tsx ← Add Shiki themes, lazy loading
  components/content/SectionPage.tsx ← Add content-area class
  index.css                      ← New tokens, body rules, imports
  config/site.ts                 ← No changes needed (localStorage prefix reused)
```

### 12.3 Deleted Files

```
app/src/components/layout/ThemeToggle.tsx  ← Replaced by ThemeSettings.tsx
```

---

## 13. Implementation Plan

### Step 1: Infrastructure — CSS Framework & New Tokens
**Files:** `index.css`, `styles/a11y.css`, `styles/themes.css`
**Complexity:** Medium
**Details:**
- Create `styles/a11y.css` with all accessibility mode CSS overrides (dyslexia, high-contrast, large-text)
- Create `styles/themes.css` with all creative theme CSS overrides (retro-terminal, synthwave, minimal-ink)
- Extend `index.css`: add new token defaults to `@theme inline` (`--font-heading`, `--font-mono`), update `body` rule to consume a11y tokens, add heading/code font-family rules, add `@custom-variant` declarations, add `prefers-contrast` and `forced-colors` media queries, import the two new CSS files
- Add the scanline `::after` pseudo-element rule to `themes.css`

### Step 2: Hooks — `useTheme` Extension & `useAccessibility`
**Files:** `hooks/useTheme.ts`, `hooks/useAccessibility.ts`
**Complexity:** Medium
**Dependencies:** Step 1 (CSS tokens must exist)
**Details:**
- Extend `useTheme` to add `creativeTheme`, `setCreativeTheme`, and Shiki theme resolution. Handle dark-only enforcement, light/dark preference preservation/restoration, and `data-theme` attribute management.
- Create `useAccessibility` hook managing `data-a11y-mode` and `data-a11y-font` attributes, localStorage persistence, font loading (dynamic imports), and `prefers-contrast` auto-detection.
- Add View Transitions API wrapper for smooth theme switching.

### Step 3: Font Installation
**Files:** `package.json` (via `bun add`)
**Complexity:** Low
**Dependencies:** None (can run in parallel with Steps 1–2)
**Details:**
- Install all Fontsource packages: `@fontsource/atkinson-hyperlegible-next`, `@fontsource/opendyslexic`, `@fontsource/vt323`, `@fontsource/jetbrains-mono`, `@fontsource/space-grotesk`, `@fontsource-variable/fraunces`, `@fontsource-variable/inter`
- Install any missing shadcn/ui components: `switch`, `radio-group`, `label`

### Step 4: Theme Registry
**Files:** `themes/index.ts`
**Complexity:** Low
**Dependencies:** None
**Details:**
- Create the theme registry exporting metadata for each theme/mode: id, label, description, swatch colours, mode support (light/dark/both), Shiki theme mapping, font requirements.

### Step 5: Theme Switcher UI
**Files:** `components/layout/ThemeSettings.tsx`, `components/layout/ThemePreview.tsx`, `components/layout/Header.tsx`
**Complexity:** Medium-High
**Dependencies:** Steps 2, 4 (hooks and registry must exist)
**Details:**
- Build the `ThemeSettings` dialog component with three sections (colour mode, accessibility, creative themes).
- Build the `ThemePreview` swatch component.
- Update `Header.tsx` to import `ThemeSettings` instead of `ThemeToggle`. Change icon to Palette.
- Delete `ThemeToggle.tsx`.

### Step 6: Component Updates — CodeBlock & Shiki
**Files:** `components/content/CodeBlock.tsx`, `components/content/ShikiHighlighter.tsx`
**Complexity:** Medium
**Dependencies:** Step 2 (useTheme extension)
**Details:**
- Update `ShikiHighlighter` to support additional themes with lazy loading.
- Update `CodeBlock` to use theme-aware Shiki resolution.

### Step 7: Layout Updates
**Files:** `components/layout/AppLayout.tsx`, `components/content/SectionPage.tsx`
**Complexity:** Low
**Dependencies:** Step 1 (CSS must have scanline rules)
**Details:**
- Add `theme-scanline-container` class to AppLayout root div.
- Add `content-area` class to SectionPage content container.

### Step 8: Testing & Verification
**Complexity:** Medium
**Dependencies:** All previous steps
**Details:**
- Verify all 24 valid state combinations (see synthesis document Appendix A) render correctly.
- Check contrast ratios for each creative theme's key colour pairs.
- Test font loading/FOUT behaviour.
- Test on mobile (375px).
- Verify keyboard navigation in the settings dialog.
- Check that existing light/dark/system mode works unchanged for users who don't engage with the new system.
- Build check (`bun run build`), lint, and format.

### Parallelisation

Steps 1, 3, and 4 can run in parallel (no dependencies between them).
Steps 2 and 5 must run sequentially after their dependencies.
Step 6 depends on Step 2 only.
Step 7 depends on Step 1 only.

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

### Estimated File Count

| Step | New Files | Modified Files | Deleted Files |
|------|-----------|----------------|---------------|
| 1 | 2 | 1 | 0 |
| 2 | 1 | 1 | 0 |
| 3 | 0 | 1 (package.json) | 0 |
| 4 | 1 | 0 | 0 |
| 5 | 2 | 1 | 1 |
| 6 | 0 | 2 | 0 |
| 7 | 0 | 2 | 0 |
| **Total** | **6** | **8** | **1** |

---

## 14. Multi-Client Reusability Notes

The architecture separates concerns to support future multi-client use:

| Layer | Location | Reusability |
|-------|----------|-------------|
| Base brand tokens | `index.css` (`:root`, `.dark`) | Client-specific — swap these for a different client's palette |
| Accessibility modes | `styles/a11y.css`, `hooks/useAccessibility.ts` | Universal — ship with every client unchanged |
| Creative themes | `styles/themes.css`, `themes/index.ts` | Portable — can be included/excluded per client via registry |
| Theme infrastructure | `hooks/useTheme.ts` (extended), `ThemeSettings.tsx` | Universal — works regardless of brand tokens |
| Theme selection | `themes/index.ts` entries | Client-curated — enable/disable themes per client |

**Key architectural rule:** Creative themes override the base brand entirely (they define their own complete palette), but accessibility modes layer on top of whatever is beneath them (base brand or creative theme). This means:
- Adding a new client = change `:root`/`.dark` tokens + `site.ts` config
- Accessibility modes work immediately on any client's palette
- Creative themes are self-contained — removing one is deleting a CSS file and a registry entry

---

## 15. Critical Rules Checklist

- [ ] UK English throughout all UI labels and copy ("Colour Mode" not "Color Mode", "Minimise" not "Minimize")
- [ ] No `tailwind.config.js` — all theming via CSS in `@theme inline` and custom properties
- [ ] `bun` as package manager (not npm)
- [ ] No render-blocking font loads — all theme fonts lazy-loaded
- [ ] Existing light/dark/system users unaffected — default experience unchanged
- [ ] Copy-to-clipboard on every prompt/template (existing, don't regress)
- [ ] Mobile-friendly settings dialog (375px+)
- [ ] Accessibility modes orthogonal to creative themes
- [ ] `siteConfig.localStoragePrefix` used for all new localStorage keys
- [ ] WCAG 2.2 AA contrast ratios verified for all theme palettes
- [ ] `prefers-reduced-motion` respected for view transitions and glow effects

---

*Spec compiled 16 February 2026. Based on research from `.planning/research/accessibility-styling-research.md`, `.planning/research/creative-themes-research.md`, and `.planning/research/theme-system-synthesis.md`.*
