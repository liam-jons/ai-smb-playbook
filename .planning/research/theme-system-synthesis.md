# Theme System Synthesis

**Date:** 16 February 2026
**Sources:**
- `accessibility-styling-research.md` (accessibility modes)
- `creative-themes-research.md` (creative themes)
- `app/src/index.css` (current token definitions)
- `reusability-audit.md` (client separation concerns)

**Purpose:** Unify findings from the accessibility and creative-themes research into a single, implementable theme system specification. Resolve conflicts, define the token naming scheme, establish the CSS cascade order, and produce a token override matrix.

---

## 1. Conflicts and Gaps

### 1.1 Variable Naming Conflicts

| Area | Accessibility Research | Creative Themes Research | Resolution |
|------|----------------------|--------------------------|------------|
| **Font variable** | Uses `--font-sans` directly in `[data-a11y-mode]` selectors | Uses `--font-sans` from `@theme inline` for creative font swaps | No conflict -- both override the same token. But if both are active simultaneously (e.g. dyslexia + a creative theme), the cascade must define who wins. See Section 4. |
| **Background colour format** | Uses `oklch()` values (e.g. `oklch(0.97 0.01 80)`) | Uses hex values (e.g. `#0a0a0a`, `#f5f0e8`) | **Gap.** Adopt a single format. The existing `index.css` uses `oklch()` throughout, so all new token values should use `oklch()` for consistency. The creative themes research provided hex values as design intent; these need converting to `oklch()` at implementation time. |
| **Typography tokens** | Introduces `--a11y-letter-spacing`, `--a11y-word-spacing`, `--a11y-line-height`, `--a11y-font-weight` as new custom properties | Does not define any new typography tokens -- assumes font changes are applied directly via `font-family` on `body` | **Gap.** The accessibility tokens are new and necessary. Creative themes that need typography adjustments (e.g. Retro Terminal's monospace body) should use the same `--font-sans` mechanism, not introduce parallel tokens. Typography tokens like `--font-heading` are needed for themes with distinct heading/body font pairings (Retro Terminal, Minimal Ink, Newspaper). |
| **Border radius** | Not addressed | Overrides `--radius` per theme (e.g. `0` for Retro Terminal, `0.5rem` for Synthwave) | No conflict -- accessibility modes do not alter `--radius`. |
| **Sidebar tokens** | Not addressed (sidebar styling not discussed) | Notes that sidebar tokens must be addressed per theme to avoid mismatch | **Gap.** Both research documents omit concrete sidebar token values for their respective modes. Each theme and accessibility mode that changes background/foreground colours must also provide sidebar variants. |

### 1.2 Light/Dark Interaction Conflicts

The two documents propose subtly different models for how their layers interact with light/dark mode:

| Layer | Proposed Model | Conflict? |
|-------|---------------|-----------|
| **Accessibility modes** | Orthogonal to light/dark. Dyslexia mode has both light and dark variants (cream light, warm dark). The `.dark` class remains active. | No conflict -- this is clean. |
| **Creative themes** | **Model A (recommended):** Creative themes replace light/dark entirely. Each theme has a fixed colour scheme (Retro Terminal is dark-only, Newspaper is light-only, etc.). The light/dark toggle is disabled. | **Potential conflict with accessibility modes.** If a creative theme replaces light/dark, and the user also has an accessibility mode active, the accessibility mode's light/dark-specific overrides (e.g. `.dark[data-a11y-mode="dyslexia"]`) have no reliable anchor. Resolution: see Section 3. |

### 1.3 Gaps Not Covered by Either Document

| Gap | Impact | Resolution |
|-----|--------|------------|
| **No heading font token.** Creative themes pair different heading and body fonts (e.g. VT323 + JetBrains Mono), but no `--font-heading` or `--font-mono` token exists. | Typography themes will need to set font-family on heading elements directly, or a new token is needed. | Introduce `--font-heading` and `--font-mono` tokens. See Section 2. |
| **No Shiki theme token.** Creative themes need to signal which Shiki syntax theme to use. This is a JS-level concern, not CSS. | The `CodeBlock` component needs a way to resolve the active Shiki theme. | Handle in the theme registry (JS/TS), not CSS tokens. The `useTheme` hook returns the active theme; `CodeBlock` maps that to a Shiki theme name. |
| **Chart colour tokens.** Neither document addresses `--chart-1` through `--chart-5`. | Creative themes with radically different palettes will look odd if chart colours remain default. | Each creative theme should override chart colours. Accessibility modes can inherit defaults. |
| **Popover tokens.** Neither document addresses `--popover` and `--popover-foreground`. | Same surface concern as sidebar -- popovers need to match the active theme. | Popover tokens should follow `--card` / `--card-foreground` unless a theme explicitly differentiates them. |
| **Large-text mode specifics.** The accessibility research mentions large-text mode but gives no concrete token values. | Needs defining. | Large-text scales `font-size` on `:root` (e.g. 125%, 150%). No colour tokens change. See Section 6. |
| **`prefers-contrast: more` auto-detection.** The accessibility research recommends responding to this media query, but no concrete implementation is given. | High-contrast mode should activate automatically when the OS preference is set. | The `useAccessibility` hook should check `window.matchMedia('(prefers-contrast: more)')` on mount and apply high-contrast mode if no user override is stored. |

---

## 2. Unified Token Naming

### 2.1 Existing Tokens (from `index.css`)

These tokens are already defined in `:root` and `.dark` and are consumed by Tailwind v4's `@theme inline` mapping. All theme layers override these same tokens.

**Colour tokens:**
| Token | Tailwind Mapping | Purpose |
|-------|-----------------|---------|
| `--background` | `--color-background` | Page background |
| `--foreground` | `--color-foreground` | Primary text colour |
| `--card` | `--color-card` | Card/surface background |
| `--card-foreground` | `--color-card-foreground` | Card text colour |
| `--popover` | `--color-popover` | Popover background |
| `--popover-foreground` | `--color-popover-foreground` | Popover text colour |
| `--primary` | `--color-primary` | Primary brand/interactive colour |
| `--primary-foreground` | `--color-primary-foreground` | Text on primary colour |
| `--secondary` | `--color-secondary` | Secondary surface colour |
| `--secondary-foreground` | `--color-secondary-foreground` | Text on secondary |
| `--muted` | `--color-muted` | Muted/subtle surface |
| `--muted-foreground` | `--color-muted-foreground` | Muted text |
| `--accent` | `--color-accent` | Accent surface |
| `--accent-foreground` | `--color-accent-foreground` | Text on accent |
| `--destructive` | `--color-destructive` | Error/destructive actions |
| `--border` | `--color-border` | Border colour |
| `--input` | `--color-input` | Input field border |
| `--ring` | `--color-ring` | Focus ring colour |
| `--chart-1` to `--chart-5` | `--color-chart-*` | Chart/data visualisation colours |

**Sidebar tokens:**
| Token | Tailwind Mapping | Purpose |
|-------|-----------------|---------|
| `--sidebar` | `--color-sidebar` | Sidebar background |
| `--sidebar-foreground` | `--color-sidebar-foreground` | Sidebar text |
| `--sidebar-primary` | `--color-sidebar-primary` | Sidebar active/primary item |
| `--sidebar-primary-foreground` | `--color-sidebar-primary-foreground` | Text on sidebar primary |
| `--sidebar-accent` | `--color-sidebar-accent` | Sidebar hover/accent |
| `--sidebar-accent-foreground` | `--color-sidebar-accent-foreground` | Text on sidebar accent |
| `--sidebar-border` | `--color-sidebar-border` | Sidebar border |
| `--sidebar-ring` | `--color-sidebar-ring` | Sidebar focus ring |

**Shape token:**
| Token | Tailwind Mapping | Purpose |
|-------|-----------------|---------|
| `--radius` | Base radius, plus `--radius-sm` through `--radius-4xl` derived | Border radius scale |

**Typography token:**
| Token | Tailwind Mapping | Purpose |
|-------|-----------------|---------|
| `--font-sans` | `--font-sans` | Primary body font family |

### 2.2 New Tokens Required

These tokens do not currently exist in `index.css` and need to be added to the `@theme inline` block and/or defined in `:root`.

**Typography tokens (new):**
| Token | Proposed Tailwind Mapping | Purpose | Used By |
|-------|--------------------------|---------|---------|
| `--font-heading` | `--font-heading` | Heading font family (falls back to `--font-sans` if not set) | Creative themes with distinct heading fonts (Retro Terminal: VT323, Minimal Ink: Fraunces, Newspaper: Playfair Display) |
| `--font-mono` | `--font-mono` | Monospace font family | Code blocks, Retro Terminal body text |

**Accessibility typography tokens (new):**
| Token | Default Value | Purpose | Used By |
|-------|--------------|---------|---------|
| `--a11y-letter-spacing` | `normal` | Letter spacing override | Dyslexia mode (`0.05em`) |
| `--a11y-word-spacing` | `normal` | Word spacing override | Dyslexia mode (`0.16em`) |
| `--a11y-line-height` | `1.5` | Line height override | Dyslexia mode (`1.8`) |
| `--a11y-font-weight` | `400` | Body font weight override | Dyslexia mode (`500`) |
| `--a11y-paragraph-spacing` | `1em` | Paragraph bottom margin | Dyslexia mode (`1.5em`) |
| `--a11y-max-width` | `none` | Content max-width constraint | Dyslexia mode (`70ch`) |
| `--a11y-font-size-scale` | `1` | Root font-size multiplier | Large-text mode (`1.25` or `1.5`) |

**Theme effect tokens (new, optional):**
| Token | Default Value | Purpose | Used By |
|-------|--------------|---------|---------|
| `--theme-heading-glow` | `none` | Text-shadow for headings | Retro Terminal (phosphor glow), Synthwave (neon glow) |
| `--theme-border-width` | `1px` | Default border width | Creative themes |
| `--theme-shadow` | `none` | Card/interactive shadow | Synthwave (coloured glow shadows) |

### 2.3 Token Registration in `@theme inline`

New tokens that need Tailwind utility class access should be added to the `@theme inline` block:

```css
@theme inline {
  /* ...existing mappings... */
  --font-heading: var(--font-heading, var(--font-sans));
  --font-mono: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
}
```

Accessibility tokens (`--a11y-*`) do **not** need Tailwind utility class mappings -- they are consumed directly by `body` and content container styles, not by individual utility classes.

---

## 3. Interaction Model

### 3.1 The Three Layers

```
┌─────────────────────────────────────────────┐
│  Layer 1: Light / Dark Mode                 │
│  Mechanism: .dark class on <html>           │
│  Scope: All colour tokens                   │
│  Toggle: Theme switcher or system pref      │
├─────────────────────────────────────────────┤
│  Layer 2: Accessibility Mode                │
│  Mechanism: data-a11y-mode attr on <html>   │
│  Scope: Typography + select colours         │
│  Toggle: Accessibility settings panel       │
├─────────────────────────────────────────────┤
│  Layer 3: Creative Theme                    │
│  Mechanism: data-theme attr on <html>       │
│  Scope: All tokens (colour, shape, type)    │
│  Toggle: Theme gallery / selector           │
└─────────────────────────────────────────────┘
```

### 3.2 Approved Themes and Their Mode Constraints

| Creative Theme | Light Variant | Dark Variant | Behaviour |
|---------------|---------------|--------------|-----------|
| **Retro Terminal** | No | Yes (dark-only) | Forces dark. `.dark` class is added; light/dark toggle disabled. |
| **Synthwave** | No | Yes (dark-only) | Forces dark. `.dark` class is added; light/dark toggle disabled. |
| **Minimal Ink** | Yes | Yes | Respects light/dark toggle. Provides both `:root[data-theme="minimal-ink"]` and `.dark[data-theme="minimal-ink"]` values. |

### 3.3 Can You Have an Accessibility Mode AND a Creative Theme?

**Yes, with constraints.**

Accessibility modes and creative themes serve fundamentally different purposes:
- Accessibility modes are **functional requirements** (the user needs them to read comfortably)
- Creative themes are **aesthetic preferences** (the user wants them for enjoyment)

A user's accessibility need should never be overridden by an aesthetic choice. Therefore:

**Rule: Accessibility mode tokens take precedence over creative theme tokens where they conflict.**

In practice:
- **Typography tokens** (`--a11y-letter-spacing`, `--a11y-word-spacing`, `--a11y-line-height`, `--a11y-font-weight`, `--a11y-paragraph-spacing`): Accessibility mode values always win. If a user has dyslexia mode active, the increased spacing applies even within a creative theme.
- **Font family**: This is the one genuine conflict. Dyslexia mode sets `--font-sans` to Atkinson Hyperlegible Next; Retro Terminal sets it to JetBrains Mono. **Resolution: Accessibility font takes precedence.** The creative theme's visual identity may be diluted, but the user's reading needs come first. The heading font (`--font-heading`) can still be theme-specific (VT323 for Retro Terminal) since headings are short text.
- **Colour tokens** (`--background`, `--foreground`, etc.): The creative theme's colour palette applies. The dyslexia mode's warm cream override is overridden by the creative theme's colours. Exception: high-contrast mode overrides all colours, including creative theme colours, because contrast is a functional accessibility requirement.
- **Shape tokens** (`--radius`): Creative theme values apply. Accessibility modes do not alter shape.

### 3.4 How Does Light/Dark Interact with Single-Mode Creative Themes?

When a dark-only creative theme (Retro Terminal, Synthwave) is active:

1. The `data-theme` attribute is set on `<html>`
2. The `.dark` class is added to `<html>` (regardless of the user's previous light/dark preference)
3. The light/dark toggle is visually disabled or hidden in the UI
4. The user's light/dark preference is preserved in localStorage so it can be restored when the creative theme is deactivated

When Minimal Ink is active:
1. The `data-theme="minimal-ink"` attribute is set
2. The `.dark` class is controlled by the user's light/dark preference as normal
3. The light/dark toggle remains active

### 3.5 What Happens: Dyslexia Mode + Retro Terminal?

Concrete scenario: `<html class="dark" data-a11y-mode="dyslexia" data-theme="retro-terminal">`

| Token Category | Value Source | Rationale |
|---------------|-------------|-----------|
| `--background` | Retro Terminal (`#0a0a0a` / near-black) | Creative theme colours apply |
| `--foreground` | Retro Terminal (`#33ff33` / phosphor green) | Creative theme colours apply |
| `--primary` | Retro Terminal (`#00ff41`) | Creative theme colours apply |
| `--font-sans` (body) | Dyslexia mode (Atkinson Hyperlegible Next) | Accessibility font wins |
| `--font-heading` | Retro Terminal (VT323) | Heading font is theme-specific; headings are short and legibility is less critical |
| `--a11y-letter-spacing` | Dyslexia mode (`0.05em`) | Accessibility typography always wins |
| `--a11y-line-height` | Dyslexia mode (`1.8`) | Accessibility typography always wins |
| `--a11y-word-spacing` | Dyslexia mode (`0.16em`) | Accessibility typography always wins |
| `--a11y-font-weight` | Dyslexia mode (`500`) | Accessibility typography always wins |
| `--radius` | Retro Terminal (`0`) | Shape is theme-specific |
| Scanline effect | Retro Terminal (visible) | Visual effects are theme-specific |

**Net result:** The user sees Retro Terminal's colours, shapes, and visual effects, but with dyslexia-friendly body text (Atkinson Hyperlegible with enhanced spacing). The heading font (VT323) is preserved. This is a reasonable compromise -- the theme retains its visual identity whilst the user's reading needs are met.

### 3.6 What Happens: High-Contrast Mode + Retro Terminal?

Concrete scenario: `<html class="dark" data-a11y-mode="high-contrast" data-theme="retro-terminal">`

High-contrast mode is more aggressive than dyslexia mode -- it overrides **all** colours to ensure maximum contrast. In this scenario:

| Token Category | Value Source | Rationale |
|---------------|-------------|-----------|
| `--background` | High-contrast (pure black) | Contrast is a hard accessibility requirement |
| `--foreground` | High-contrast (pure white) | Contrast is a hard accessibility requirement |
| `--primary` | High-contrast (high-visibility colour) | Contrast takes priority |
| `--font-heading` | Retro Terminal (VT323) | Font is not a contrast concern |
| `--radius` | Retro Terminal (`0`) | Shape is not a contrast concern |
| Scanline effect | **Disabled** | Scanline overlay reduces contrast; it must be suppressed in high-contrast mode |

**Implementation:** High-contrast mode should set `--theme-scanline-opacity: 0` and `--theme-heading-glow: none` to disable effects that reduce contrast.

---

## 4. CSS Cascade Order

### 4.1 Cascade Layers

The CSS layers are ordered from lowest to highest specificity/priority:

```
Layer 0: Tailwind base (resets, base styles)
Layer 1: Brand colour tokens        — :root, .dark
Layer 2: Creative theme tokens      — [data-theme="..."]
Layer 3: Accessibility mode tokens   — [data-a11y-mode="..."]
Layer 4: Combined state overrides   — [data-a11y-mode="..."][data-theme="..."]
Layer 5: User agent / forced-colors — @media (forced-colors: active)
```

### 4.2 Implementation with CSS `@layer`

```css
/* === Layer 1: Brand tokens (already in index.css) === */
@layer base {
  :root {
    --background: oklch(0.98 0.004 250);
    --foreground: oklch(0.16 0.012 250);
    /* ...all existing light mode tokens... */
  }

  .dark {
    --background: oklch(0.16 0.012 250);
    --foreground: oklch(0.94 0.006 250);
    /* ...all existing dark mode tokens... */
  }
}

/* === Layer 2: Creative themes === */
@layer themes {
  /* Dark-only themes force their own palette */
  [data-theme="retro-terminal"] {
    --background: oklch(0.07 0 0);
    --foreground: oklch(0.75 0.2 140);
    --font-heading: 'VT323', monospace;
    --font-sans: 'JetBrains Mono', ui-monospace, monospace;
    --radius: 0;
    /* ...full palette... */
  }

  [data-theme="synthwave"] {
    --background: oklch(0.15 0.05 300);
    --foreground: oklch(0.88 0.04 300);
    --font-heading: 'Space Grotesk', system-ui, sans-serif;
    --radius: 0.5rem;
    /* ...full palette... */
  }

  /* Light + dark theme: light variant */
  :root[data-theme="minimal-ink"] {
    --background: oklch(1.0 0 0);
    --foreground: oklch(0.1 0 0);
    --font-heading: 'Fraunces', serif;
    --radius: 0;
    /* ...full palette... */
  }

  /* Light + dark theme: dark variant */
  .dark[data-theme="minimal-ink"] {
    --background: oklch(0.1 0 0);
    --foreground: oklch(0.95 0 0);
    /* ...full palette... */
  }
}

/* === Layer 3: Accessibility mode overrides === */
@layer a11y {
  /* Dyslexia mode — typography (applies regardless of theme) */
  [data-a11y-mode="dyslexia"] {
    --font-sans: 'Atkinson Hyperlegible Next', ui-sans-serif, system-ui, sans-serif;
    --a11y-letter-spacing: 0.05em;
    --a11y-word-spacing: 0.16em;
    --a11y-line-height: 1.8;
    --a11y-font-weight: 500;
    --a11y-paragraph-spacing: 1.5em;
    --a11y-max-width: 70ch;
  }

  /* Dyslexia mode — colour overrides (only when NO creative theme is active) */
  :root[data-a11y-mode="dyslexia"]:not([data-theme]) {
    --background: oklch(0.97 0.01 80);
    --card: oklch(0.985 0.008 80);
    --foreground: oklch(0.15 0.01 60);
    --muted: oklch(0.94 0.01 80);
    --border: oklch(0.88 0.01 80);
  }

  .dark[data-a11y-mode="dyslexia"]:not([data-theme]) {
    --background: oklch(0.18 0.01 60);
    --card: oklch(0.22 0.01 60);
    --foreground: oklch(0.92 0.008 80);
    --muted: oklch(0.28 0.01 60);
    --border: oklch(0.32 0.01 60);
  }

  /* High-contrast mode — overrides everything including creative themes */
  [data-a11y-mode="high-contrast"] {
    --background: oklch(1.0 0 0);
    --foreground: oklch(0.0 0 0);
    --card: oklch(1.0 0 0);
    --card-foreground: oklch(0.0 0 0);
    --border: oklch(0.0 0 0);
    --primary: oklch(0.3 0.15 250);
    --primary-foreground: oklch(1.0 0 0);
    --muted: oklch(0.95 0 0);
    --muted-foreground: oklch(0.2 0 0);
    --ring: oklch(0.0 0 0);
    --theme-heading-glow: none;
  }

  .dark[data-a11y-mode="high-contrast"] {
    --background: oklch(0.0 0 0);
    --foreground: oklch(1.0 0 0);
    --card: oklch(0.05 0 0);
    --card-foreground: oklch(1.0 0 0);
    --border: oklch(1.0 0 0);
    --primary: oklch(0.75 0.15 250);
    --primary-foreground: oklch(0.0 0 0);
    --muted: oklch(0.1 0 0);
    --muted-foreground: oklch(0.8 0 0);
    --ring: oklch(1.0 0 0);
    --theme-heading-glow: none;
  }

  /* Large-text mode — scale only, no colour changes */
  [data-a11y-mode="large-text"] {
    --a11y-font-size-scale: 1.25;
  }
}

/* === Layer 4: Combined state overrides === */
@layer a11y {
  /* High-contrast + creative theme: suppress visual effects */
  [data-a11y-mode="high-contrast"][data-theme="retro-terminal"],
  [data-a11y-mode="high-contrast"][data-theme="synthwave"] {
    --theme-heading-glow: none;
    --theme-shadow: none;
    /* Scanline overlay also disabled via a CSS variable or conditional class */
  }
}

/* === Layer 5: System-level forced colours === */
@media (forced-colors: active) {
  /* Browser handles all colours — do not fight it */
  :root {
    --theme-heading-glow: none;
    --theme-shadow: none;
  }
}
```

### 4.3 Specificity Notes

- `:root` and `.dark` have low specificity (0,1,0 for class, 0,0,1 for `:root`)
- `[data-theme="..."]` attribute selector has specificity 0,1,0 -- **same as `.dark`**
- `[data-a11y-mode="..."]` attribute selector also has specificity 0,1,0
- Combined selectors like `.dark[data-a11y-mode="dyslexia"]` have specificity 0,2,0
- Combined selectors like `[data-a11y-mode="high-contrast"][data-theme="retro-terminal"]` have specificity 0,2,0

Because attribute selectors and class selectors have equal specificity, **source order in the CSS file determines the winner when specificity is equal.** This is why the layer ordering above is critical:

1. Brand tokens defined first (lowest priority at equal specificity)
2. Creative theme tokens defined second (override brand tokens)
3. Accessibility tokens defined third (override creative themes)

Using `@layer` makes this explicit and robust even if future CSS is added in a different file order.

### 4.4 The `body` Style Rule

The `body` element consumes accessibility tokens to apply typography:

```css
@layer base {
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
    letter-spacing: var(--a11y-letter-spacing, normal);
    word-spacing: var(--a11y-word-spacing, normal);
    line-height: var(--a11y-line-height, 1.5);
    font-weight: var(--a11y-font-weight, 400);
    font-size: calc(1rem * var(--a11y-font-size-scale, 1));
    font-feature-settings: 'cv11', 'ss01';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading, var(--font-sans));
  }

  code, pre, kbd, samp {
    font-family: var(--font-mono, ui-monospace, monospace);
  }

  p + p, .prose p + p {
    margin-top: var(--a11y-paragraph-spacing, 1em);
  }

  .content-area {
    max-width: var(--a11y-max-width, none);
  }
}
```

---

## 5. Reusability Layer

Based on the reusability audit, the theme system separates into three distinct reusability tiers:

### 5.1 Universal Layer (Ship with Every Client)

**Accessibility modes** are universal. They are not client-specific and should work identically for any deployment of the playbook.

| Component | Reusability | Notes |
|-----------|------------|-------|
| `useAccessibility` hook | Universal | No client references |
| Dyslexia mode CSS | Universal | Evidence-based, applies everywhere |
| High-contrast mode CSS | Universal | WCAG compliance, applies everywhere |
| Large-text mode CSS | Universal | Simple scaling, applies everywhere |
| `prefers-contrast` media query support | Universal | OS-level integration |
| `forced-colors` media query support | Universal | Windows accessibility |
| Accessibility settings panel UI | Universal | Standard widget |

These should live in a clearly separated location (e.g. `app/src/styles/a11y.css` or within `index.css` under a labelled section) so they are trivially portable to a template branch.

### 5.2 Base Brand Theme Layer (Client-Specific)

The `:root` and `.dark` token values in `index.css` define the **client's brand identity**. For Phew, this is the warm slate palette with blue-tinted accents.

| Component | Reusability | Notes |
|-----------|------------|-------|
| `:root` colour tokens | Client-specific | Palette chosen for Phew's brand |
| `.dark` colour tokens | Client-specific | Dark variant of Phew's palette |
| `--font-sans` default | Client-specific | Plus Jakarta Sans chosen for Phew |
| Site config values | Client-specific | Already centralised in `config/site.ts` |

For a template branch:
- Replace the colour values with a neutral "starter" palette
- Document which tokens to change for rebranding
- The `site.ts` config (Tier 1 from the audit) already handles non-CSS branding

### 5.3 Creative Themes Layer (Potentially Universal or Client-Curated)

Creative themes sit between universal and client-specific:

| Component | Reusability | Notes |
|-----------|------------|-------|
| Retro Terminal theme | Universal | Not brand-specific; fun for any tech-adjacent audience |
| Synthwave theme | Universal | Same reasoning |
| Minimal Ink theme | Universal | High-contrast monochrome is universally applicable |
| Theme infrastructure (`useTheme` extension, theme registry, CSS framework) | Universal | The mechanism is client-agnostic |
| Theme selection / curation | Client-specific | A client might want only certain themes, or custom themes that match their brand |
| Meta-narrative copy ("These themes were designed with Claude") | Client-specific | Ties to the specific playbook's educational content |

**Recommendation for template branch:**
- Ship all three approved themes as available options
- The theme registry (`themes/index.ts`) should make it trivial to enable/disable themes per client
- Creative themes should live in a dedicated `themes/` directory, not interleaved with base brand CSS
- Each theme CSS file should be self-contained (all token overrides in one place) so a theme can be removed by deleting one file and one registry entry

### 5.4 File Structure Reflecting Reusability

```
app/src/
  styles/
    a11y.css                    ← Universal (accessibility modes)
  themes/
    index.ts                    ← Universal (registry mechanism)
    retro-terminal.css          ← Universal (creative theme)
    synthwave.css               ← Universal (creative theme)
    minimal-ink.css             ← Universal (creative theme)
  index.css                     ← Client-specific (brand tokens) + universal (base rules)
  hooks/
    useTheme.ts                 ← Universal (extended for themes)
    useAccessibility.ts         ← Universal (new hook)
  config/
    site.ts                     ← Client-specific
```

---

## 6. Token Override Matrix

The following matrix shows which tokens each theme/mode overrides. "inherited" means the token value comes from the underlying layer (`:root` or `.dark` brand tokens, or the active creative theme).

### 6.1 Colour Tokens

| Token | Dyslexia Mode | High-Contrast Mode (Light) | High-Contrast Mode (Dark) | Retro Terminal | Synthwave | Minimal Ink (Light) | Minimal Ink (Dark) | Large-Text Mode |
|-------|--------------|---------------------------|--------------------------|----------------|-----------|--------------------|--------------------|----------------|
| `--background` | `oklch(0.97 0.01 80)` / `oklch(0.18 0.01 60)` | `oklch(1.0 0 0)` | `oklch(0.0 0 0)` | `oklch(0.07 0 0)` | `oklch(0.15 0.05 300)` | `oklch(1.0 0 0)` | `oklch(0.1 0 0)` | inherited |
| `--foreground` | `oklch(0.15 0.01 60)` / `oklch(0.92 0.008 80)` | `oklch(0.0 0 0)` | `oklch(1.0 0 0)` | `oklch(0.75 0.2 140)` | `oklch(0.88 0.04 300)` | `oklch(0.1 0 0)` | `oklch(0.95 0 0)` | inherited |
| `--card` | `oklch(0.985 0.008 80)` / `oklch(0.22 0.01 60)` | `oklch(1.0 0 0)` | `oklch(0.05 0 0)` | `oklch(0.12 0 0)` | `oklch(0.18 0.04 300)` | `oklch(0.99 0 0)` | `oklch(0.14 0 0)` | inherited |
| `--card-foreground` | inherited | `oklch(0.0 0 0)` | `oklch(1.0 0 0)` | `oklch(0.75 0.2 140)` | `oklch(0.88 0.04 300)` | `oklch(0.1 0 0)` | `oklch(0.95 0 0)` | inherited |
| `--popover` | inherited | `oklch(1.0 0 0)` | `oklch(0.05 0 0)` | `oklch(0.12 0 0)` | `oklch(0.18 0.04 300)` | `oklch(0.99 0 0)` | `oklch(0.14 0 0)` | inherited |
| `--popover-foreground` | inherited | `oklch(0.0 0 0)` | `oklch(1.0 0 0)` | `oklch(0.75 0.2 140)` | `oklch(0.88 0.04 300)` | `oklch(0.1 0 0)` | `oklch(0.95 0 0)` | inherited |
| `--primary` | inherited | `oklch(0.3 0.15 250)` | `oklch(0.75 0.15 250)` | `oklch(0.7 0.25 145)` | `oklch(0.6 0.25 350)` | `oklch(0.45 0.18 25)` | `oklch(0.55 0.18 25)` | inherited |
| `--primary-foreground` | inherited | `oklch(1.0 0 0)` | `oklch(0.0 0 0)` | `oklch(0.07 0 0)` | `oklch(0.15 0.05 300)` | `oklch(1.0 0 0)` | `oklch(1.0 0 0)` | inherited |
| `--secondary` | inherited | `oklch(0.9 0 0)` | `oklch(0.15 0 0)` | `oklch(0.15 0.04 140)` | `oklch(0.2 0.04 300)` | `oklch(0.96 0 0)` | `oklch(0.16 0 0)` | inherited |
| `--secondary-foreground` | inherited | `oklch(0.1 0 0)` | `oklch(0.95 0 0)` | `oklch(0.75 0.2 140)` | `oklch(0.88 0.04 300)` | `oklch(0.1 0 0)` | `oklch(0.95 0 0)` | inherited |
| `--muted` | `oklch(0.94 0.01 80)` / `oklch(0.28 0.01 60)` | `oklch(0.95 0 0)` | `oklch(0.1 0 0)` | `oklch(0.1 0 0)` | `oklch(0.2 0.04 300)` | `oklch(0.96 0 0)` | `oklch(0.16 0 0)` | inherited |
| `--muted-foreground` | inherited | `oklch(0.2 0 0)` | `oklch(0.8 0 0)` | `oklch(0.5 0.15 140)` | `oklch(0.55 0.06 300)` | `oklch(0.5 0 0)` | `oklch(0.6 0 0)` | inherited |
| `--accent` | inherited | `oklch(0.9 0 0)` | `oklch(0.15 0 0)` | `oklch(0.15 0.08 140)` | `oklch(0.65 0.2 195)` | `oklch(0.45 0.18 25)` | `oklch(0.55 0.18 25)` | inherited |
| `--accent-foreground` | inherited | `oklch(0.1 0 0)` | `oklch(0.95 0 0)` | `oklch(0.75 0.2 140)` | `oklch(0.15 0.05 300)` | `oklch(1.0 0 0)` | `oklch(1.0 0 0)` | inherited |
| `--destructive` | inherited | `oklch(0.45 0.25 25)` | `oklch(0.65 0.25 25)` | `oklch(0.6 0.25 25)` | `oklch(0.6 0.22 25)` | `oklch(0.45 0.18 25)` | `oklch(0.6 0.2 25)` | inherited |
| `--border` | `oklch(0.88 0.01 80)` / `oklch(0.32 0.01 60)` | `oklch(0.0 0 0)` | `oklch(1.0 0 0)` | `oklch(0.2 0.06 140)` | `oklch(0.28 0.04 300)` | `oklch(0.85 0 0)` | `oklch(0.25 0 0)` | inherited |
| `--input` | inherited | `oklch(0.0 0 0)` | `oklch(1.0 0 0)` | `oklch(0.2 0.06 140)` | `oklch(0.28 0.04 300)` | `oklch(0.85 0 0)` | `oklch(0.25 0 0)` | inherited |
| `--ring` | inherited | `oklch(0.0 0 0)` | `oklch(1.0 0 0)` | `oklch(0.7 0.25 145)` | `oklch(0.6 0.25 350)` | `oklch(0.45 0.18 25)` | `oklch(0.55 0.18 25)` | inherited |

### 6.2 Sidebar Tokens

| Token | Dyslexia Mode | High-Contrast (Light) | High-Contrast (Dark) | Retro Terminal | Synthwave | Minimal Ink (Light) | Minimal Ink (Dark) | Large-Text |
|-------|--------------|----------------------|---------------------|----------------|-----------|--------------------|--------------------|------------|
| `--sidebar` | inherited | `oklch(0.97 0 0)` | `oklch(0.05 0 0)` | `oklch(0.08 0 0)` | `oklch(0.13 0.05 300)` | `oklch(0.98 0 0)` | `oklch(0.08 0 0)` | inherited |
| `--sidebar-foreground` | inherited | `oklch(0.0 0 0)` | `oklch(1.0 0 0)` | `oklch(0.75 0.2 140)` | `oklch(0.88 0.04 300)` | `oklch(0.1 0 0)` | `oklch(0.95 0 0)` | inherited |
| `--sidebar-primary` | inherited | `oklch(0.3 0.15 250)` | `oklch(0.75 0.15 250)` | `oklch(0.7 0.25 145)` | `oklch(0.6 0.25 350)` | `oklch(0.45 0.18 25)` | `oklch(0.55 0.18 25)` | inherited |
| `--sidebar-primary-foreground` | inherited | `oklch(1.0 0 0)` | `oklch(0.0 0 0)` | `oklch(0.07 0 0)` | `oklch(0.15 0.05 300)` | `oklch(1.0 0 0)` | `oklch(1.0 0 0)` | inherited |
| `--sidebar-accent` | inherited | `oklch(0.9 0 0)` | `oklch(0.15 0 0)` | `oklch(0.12 0.06 140)` | `oklch(0.2 0.04 300)` | `oklch(0.94 0 0)` | `oklch(0.14 0 0)` | inherited |
| `--sidebar-accent-foreground` | inherited | `oklch(0.1 0 0)` | `oklch(0.95 0 0)` | `oklch(0.75 0.2 140)` | `oklch(0.88 0.04 300)` | `oklch(0.1 0 0)` | `oklch(0.95 0 0)` | inherited |
| `--sidebar-border` | inherited | `oklch(0.0 0 0)` | `oklch(1.0 0 0)` | `oklch(0.2 0.06 140)` | `oklch(0.28 0.04 300)` | `oklch(0.85 0 0)` | `oklch(0.25 0 0)` | inherited |
| `--sidebar-ring` | inherited | `oklch(0.0 0 0)` | `oklch(1.0 0 0)` | `oklch(0.7 0.25 145)` | `oklch(0.6 0.25 350)` | `oklch(0.45 0.18 25)` | `oklch(0.55 0.18 25)` | inherited |

### 6.3 Typography Tokens

| Token | Dyslexia Mode | High-Contrast | Retro Terminal | Synthwave | Minimal Ink | Large-Text |
|-------|--------------|---------------|----------------|-----------|-------------|------------|
| `--font-sans` | `'Atkinson Hyperlegible Next', ui-sans-serif, system-ui, sans-serif` | inherited | `'JetBrains Mono', ui-monospace, monospace` | inherited (Plus Jakarta Sans) | `'Inter', system-ui, sans-serif` | inherited |
| `--font-heading` | inherited | inherited | `'VT323', monospace` | `'Space Grotesk', system-ui, sans-serif` | `'Fraunces', serif` | inherited |
| `--font-mono` | inherited | inherited | `'JetBrains Mono', ui-monospace, monospace` | inherited | inherited | inherited |
| `--a11y-letter-spacing` | `0.05em` | inherited | inherited | inherited | inherited | inherited |
| `--a11y-word-spacing` | `0.16em` | inherited | inherited | inherited | inherited | inherited |
| `--a11y-line-height` | `1.8` | inherited | inherited | inherited | inherited | inherited |
| `--a11y-font-weight` | `500` | inherited | inherited | inherited | inherited | inherited |
| `--a11y-paragraph-spacing` | `1.5em` | inherited | inherited | inherited | inherited | inherited |
| `--a11y-max-width` | `70ch` | inherited | inherited | inherited | inherited | inherited |
| `--a11y-font-size-scale` | inherited | inherited | inherited | inherited | inherited | `1.25` |

### 6.4 Shape and Effect Tokens

| Token | Dyslexia Mode | High-Contrast | Retro Terminal | Synthwave | Minimal Ink | Large-Text |
|-------|--------------|---------------|----------------|-----------|-------------|------------|
| `--radius` | inherited | inherited | `0` | `0.5rem` | `0` | inherited |
| `--theme-heading-glow` | inherited | `none` | `0 0 5px oklch(0.75 0.2 140), 0 0 10px oklch(0.75 0.2 140 / 0.5)` | `0 0 5px oklch(0.6 0.25 350), 0 0 10px oklch(0.6 0.25 350 / 0.3)` | `none` | inherited |
| `--theme-shadow` | inherited | `none` | `none` | `0 0 15px oklch(0.6 0.25 350 / 0.3)` | `none` | inherited |
| `--theme-border-width` | inherited | `2px` | `1px` | `1px` | `1px` | inherited |

### 6.5 Chart Colour Tokens

| Token | Dyslexia Mode | High-Contrast | Retro Terminal | Synthwave | Minimal Ink | Large-Text |
|-------|--------------|---------------|----------------|-----------|-------------|------------|
| `--chart-1` | inherited | high-visibility palette | green spectrum | neon pink | warm red | inherited |
| `--chart-2` | inherited | high-visibility palette | green spectrum | cyan | medium grey | inherited |
| `--chart-3` | inherited | high-visibility palette | green spectrum | purple | dark grey | inherited |
| `--chart-4` | inherited | high-visibility palette | green spectrum | yellow | light grey | inherited |
| `--chart-5` | inherited | high-visibility palette | green spectrum | orange | black | inherited |

*(Chart colour exact oklch values to be determined during implementation with contrast checking.)*

---

## Appendix A: State Combinations Summary

All valid combinations of the three layers:

| # | `.dark` | `data-a11y-mode` | `data-theme` | Notes |
|---|---------|-----------------|--------------|-------|
| 1 | No | None | None | Default light mode |
| 2 | Yes | None | None | Default dark mode |
| 3 | No | `dyslexia` | None | Light + dyslexia |
| 4 | Yes | `dyslexia` | None | Dark + dyslexia |
| 5 | No | `high-contrast` | None | Light + high contrast |
| 6 | Yes | `high-contrast` | None | Dark + high contrast |
| 7 | No | `large-text` | None | Light + large text |
| 8 | Yes | `large-text` | None | Dark + large text |
| 9 | Yes | None | `retro-terminal` | Retro Terminal (forces dark) |
| 10 | Yes | None | `synthwave` | Synthwave (forces dark) |
| 11 | No | None | `minimal-ink` | Minimal Ink light |
| 12 | Yes | None | `minimal-ink` | Minimal Ink dark |
| 13 | Yes | `dyslexia` | `retro-terminal` | Retro Terminal + dyslexia (a11y typography, theme colours) |
| 14 | Yes | `dyslexia` | `synthwave` | Synthwave + dyslexia |
| 15 | No | `dyslexia` | `minimal-ink` | Minimal Ink light + dyslexia |
| 16 | Yes | `dyslexia` | `minimal-ink` | Minimal Ink dark + dyslexia |
| 17 | Yes | `high-contrast` | `retro-terminal` | Retro Terminal + high contrast (a11y colours override theme) |
| 18 | Yes | `high-contrast` | `synthwave` | Synthwave + high contrast (a11y colours override theme) |
| 19 | No | `high-contrast` | `minimal-ink` | Minimal Ink light + high contrast |
| 20 | Yes | `high-contrast` | `minimal-ink` | Minimal Ink dark + high contrast |
| 21 | Yes | `large-text` | `retro-terminal` | Retro Terminal + large text |
| 22 | Yes | `large-text` | `synthwave` | Synthwave + large text |
| 23 | No | `large-text` | `minimal-ink` | Minimal Ink light + large text |
| 24 | Yes | `large-text` | `minimal-ink` | Minimal Ink dark + large text |

**Invalid combinations:**
- `data-theme="retro-terminal"` without `.dark` -- the JS hook must enforce adding `.dark` when this theme is activated
- `data-theme="synthwave"` without `.dark` -- same enforcement
- Multiple `data-a11y-mode` values simultaneously -- the attribute is a single value, not a space-separated list. If a user needs both dyslexia mode and large text, dyslexia mode should incorporate the large-text scaling as an option within its settings.

---

## Appendix B: localStorage Keys

| Key | Type | Values | Purpose |
|-----|------|--------|---------|
| `phew-playbook-theme` | `string` | `'light'` \| `'dark'` \| `'system'` | Base light/dark preference (existing) |
| `phew-playbook-creative-theme` | `string \| null` | `'retro-terminal'` \| `'synthwave'` \| `'minimal-ink'` \| `null` | Active creative theme (new) |
| `phew-playbook-a11y-mode` | `string` | `'default'` \| `'dyslexia'` \| `'high-contrast'` \| `'large-text'` | Accessibility mode (new) |
| `phew-playbook-a11y-font` | `string` | `'default'` \| `'atkinson'` \| `'opendyslexic'` | Font override within dyslexia mode (new) |

---

*Synthesis compiled 16 February 2026. Draws on accessibility-styling-research.md, creative-themes-research.md, reusability-audit.md, and the existing app/src/index.css token definitions.*
