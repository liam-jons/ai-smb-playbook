# Creative & Fun Viewing Themes -- Research Findings

**Date:** 16 February 2026
**Purpose:** Research creative/fun theme options for the Phew AI Playbook app, which currently supports light/dark mode via CSS custom properties and Tailwind v4's `@theme inline` directive.

---

## Recommended Themes (Top 5)

After evaluating over a dozen theme concepts against the criteria of a text-heavy, professional-but-fun B2B deliverable for a design agency, these five themes stand out as the strongest candidates. Each is distinctive enough to feel like more than a colour swap, remains readable for long-form reference content, and carries a conceptual hook that reinforces the playbook's meta-narrative about AI capability.

### 1. Retro Terminal (Green Phosphor)

**Concept:** Classic 1980s terminal aesthetic -- green-on-black text, monospace typography, subtle scanline overlay, phosphor glow effects on interactive elements.

**Why it works:**
- Immediately recognisable and delightful -- everyone has a mental image of "the hacker screen"
- Creates a strong visual contrast from the default theme, making it feel genuinely different
- Monospace typography actually suits a reference/documentation app well
- Natural thematic connection: "this is what computing looked like before AI"
- The design agency audience will appreciate the craft involved in getting the details right
- Well-documented CSS techniques (scanlines via repeating gradients, text-shadow for glow)

**Key properties to change:** Font family (monospace), background (near-black), all text colours (green spectrum), glow effects via text-shadow, subtle scanline overlay via pseudo-element, squared-off border-radius, code blocks styled as native terminal output

**Font pairing:** VT323 (headings, for that authentic CRT character look) + JetBrains Mono (body text, for actual readability in longer passages)

---

### 2. Newspaper / Editorial

**Concept:** Broadsheet newspaper layout feel -- warm sepia/cream background, serif typography, high-contrast black text, thin ruled borders, masthead-style header, columnar visual cues.

**Why it works:**
- A design agency will immediately appreciate the typographic craft
- Serif fonts on a warm background are genuinely pleasant to read for long-form content
- Creates an authoritative, "established publication" feel that suits reference material
- The contrast with the default modern sans-serif theme is dramatic and satisfying
- Clean implementation -- mostly typography and colour changes, no complex effects needed
- Newspaper layouts are a core competency for a design agency, so this resonates culturally

**Key properties to change:** Font family (serif heading + serif/readable body), warm cream background, high-contrast near-black text, thin ruled borders (1px solid), reduced border-radius (sharp corners suit editorial), masthead-style header treatment, code blocks styled with monospace on slightly darker cream

**Font pairing:** Playfair Display (headings -- classic editorial display serif) + Lora (body text -- designed for screen reading, calligraphic roots, works beautifully at paragraph length)

---

### 3. Synthwave / Neon

**Concept:** 1980s retrowave aesthetic -- deep purple/navy backgrounds, neon pink and cyan accent colours, glow effects, gradient accents, slightly futuristic typography.

**Why it works:**
- The most visually striking option -- will genuinely make people smile
- Excellent dark-mode-only theme that showcases what CSS can do (gradients, glows, shadows)
- Strong cultural moment -- synthwave aesthetic remains popular and instantly recognisable
- Neon glow effects on interactive elements (buttons, links, hover states) feel rewarding
- Well-suited to a technical playbook -- the aesthetic says "cutting edge" and "digital"
- The Synthwave '84 VS Code theme (800k+ installs) proves this aesthetic works for code-adjacent tools

**Key properties to change:** Dark purple/navy background, neon pink primary, cyan secondary, gradient accents on cards, glow box-shadows on interactive elements, slightly rounded shapes, code blocks with dark background and neon syntax colours, header with subtle gradient

**Font pairing:** Space Grotesk (headings -- geometric, slightly futuristic) + Inter or Plus Jakarta Sans (body -- keep body readable, the colour palette provides all the personality needed)

---

### 4. Blueprint / Architect

**Concept:** Technical drawing / blueprint aesthetic -- deep blue background, white/light blue line work, grid pattern, technical-drawing-style typography, diagrammatic feel.

**Why it works:**
- Directly relevant to a design agency audience -- they work with blueprints, schematics, layouts
- The grid-background pattern adds depth without affecting readability
- White-on-blue is a well-established high-contrast combination
- Creates a satisfying "work in progress" / "behind the scenes" feel
- Code blocks styled as annotation boxes feel natural in this context
- Distinctive enough that switching to it feels like entering a different mode

**Key properties to change:** Deep blue background (#0d47a1 to #1a237e range), white/light-blue text, grid-pattern background (via repeating CSS gradients), thin white borders, monospace or technical font for headings, code blocks as "annotation boxes" with dashed borders, header styled as title block

**Font pairing:** IBM Plex Sans (headings -- technical, precise, designed for information density) + IBM Plex Mono or IBM Plex Sans (body -- maintains the technical drawing feel while remaining readable)

---

### 5. Minimal Ink (High-Contrast Monochrome)

**Concept:** Stripped-back, high-contrast black-and-white with a single accent colour. Think: premium print design, Swiss/International style, ink-on-paper.

**Why it works:**
- Feels premium and considered -- a design agency will recognise the restraint as intentional
- Maximum readability -- pure focus on content
- The single accent colour (could be a warm red or deep blue) provides just enough visual interest
- Works as both a "creative" theme and a subtle accessibility improvement (high contrast)
- Demonstrates that good design is often about removal, not addition
- Pairs well with the playbook's educational content -- nothing distracts from the material

**Key properties to change:** Pure white background, true black text, single accent colour for links/interactive elements, no border-radius (sharp rectangles), minimal shadows (or none), heavier font weights for hierarchy, code blocks with light grey background and black text, header with bold typographic treatment

**Font pairing:** Fraunces (headings -- variable serif with "wonk" axis, adds personality without colour) + Inter (body -- clean, neutral, lets the typography do the work)

---

## Honourable Mentions (Considered but Not Recommended)

| Theme | Reason for Exclusion |
|-------|---------------------|
| **Ocean / Nature / Forest** | Too ambient -- colour palettes tend to reduce contrast and make text harder to read. Better suited to meditation apps than reference docs. |
| **Vintage Paper / Parchment** | Overlaps too much with the Newspaper theme. The sepia/aged look without the editorial typography feels incomplete. |
| **Cyberpunk 2077** | Too aggressive for a B2B deliverable. The neon yellows and harsh angles feel gimmicky in a text-heavy context. Synthwave captures the same cultural moment with more restraint. |
| **Dracula / Catppuccin** | These are excellent code editor themes but don't transform the feel of a full application enough. They're essentially dark mode with different accent colours -- the user would feel it was "just a colour swap." |
| **Solarized** | Similar issue to Dracula -- respected in developer circles but doesn't feel like a "fun creative theme" to a general audience. |

---

## What Makes a Theme "Feel Complete"

A colour swap alone does not constitute a theme. Based on analysis of the most successful theme implementations (VS Code themes, Obsidian themes, terminal emulators, Notion), a theme feels complete when it addresses all of the following:

### 1. Colour Palette (Mandatory)

The foundation. Every theme must define values for:
- **Background** (page, card, popover surfaces)
- **Foreground** (primary text, secondary text, muted text)
- **Primary** (brand/accent colour for interactive elements)
- **Secondary** (supporting accent)
- **Borders** (dividers, card edges, input outlines)
- **Destructive** (error states, delete actions)
- **Muted** (subtle backgrounds, disabled states)

The existing CSS custom property system in `index.css` already maps all of these. Each theme simply needs to provide alternative values.

### 2. Typography (High Impact)

Font family changes create the most dramatic perceived difference between themes. Even subtle shifts (sans-serif to serif, or geometric sans to humanist sans) make a theme feel distinct.

**What to change:**
- `--font-sans` (mapped in `@theme inline` already)
- Potentially heading font weight or letter-spacing
- Potentially body line-height adjustments (some fonts read better with more or less leading)

**What NOT to change:**
- Base font sizes -- these should remain consistent for accessibility
- Heading hierarchy ratios -- the information architecture shouldn't change with the theme

### 3. Shape Language (Medium Impact)

- **Border radius:** Sharp corners feel editorial/technical; rounded corners feel friendly/modern; pill shapes feel playful
- **Border width:** Thin (1px) feels refined; thicker (2px) feels bold/technical
- **Shadow style:** Soft diffuse shadows feel modern; hard/no shadows feel flat/editorial; coloured shadows (glow) feel retro/neon

The `--radius` custom property is already defined and used throughout. Themes can override this single value to affect all components.

### 4. Code Block Styling (Essential for This App)

The playbook is heavy on code examples. The code block theme needs to harmonise with the surrounding page theme. The current implementation uses Shiki with `github-light` / `github-dark` themes.

**Shiki built-in themes relevant to creative themes:**
- `dracula` or `dracula-soft` -- works for Synthwave
- `nord` -- works for Blueprint (cool tones)
- `vitesse-dark` / `vitesse-light` -- versatile, adaptable
- `github-dark` -- works for Retro Terminal (green text could be added via CSS overrides)
- `min-dark` / `min-light` -- works for Minimal Ink

For the Retro Terminal theme specifically, Shiki's built-in themes won't provide the green-on-black look natively. The recommended approach is to use a dark base theme and override code block colours via CSS custom properties or a thin wrapper.

### 5. Sidebar Styling (Important)

The sidebar has its own set of CSS custom properties (`--sidebar`, `--sidebar-foreground`, etc.). Themes must address these to avoid a jarring mismatch between sidebar and main content. The existing property structure already supports this.

### 6. Header Styling (Important)

The header anchors the visual identity. Each theme should consider:
- Background colour/gradient
- Logo or title treatment
- Border/shadow at the bottom edge

### 7. Animation / Transition Feel (Nice to Have)

- **Retro Terminal:** Slightly slower transitions, perhaps a subtle "flicker" on page load
- **Synthwave:** Smooth, slightly longer transitions with glow pulse effects
- **Newspaper:** Minimal/no animation -- crisp, immediate
- **Blueprint:** Grid-snap feel to transitions
- **Minimal Ink:** Fast, clean transitions

This is low-priority for a first implementation but adds polish.

---

## Technical Implementation Pattern

### Current Architecture

The app already uses the ideal pattern for multi-theme support:

1. **`@theme inline`** in `index.css` maps semantic tokens (e.g., `--color-primary`) to CSS custom properties (e.g., `var(--primary)`)
2. **`:root`** defines light mode values
3. **`.dark`** class overrides values for dark mode
4. **`useTheme` hook** manages theme state, persists to localStorage, and applies/removes the `.dark` class on `<html>`

### Extending to Multiple Themes

The cleanest approach for Tailwind v4 is to use a `data-theme` attribute on `<html>` alongside the existing `.dark` class:

```css
/* In index.css or a dedicated themes.css file */

/* Default (light) -- already defined in :root */
/* Dark -- already defined in .dark */

/* Creative themes override both light and dark */
[data-theme="retro-terminal"] {
  --background: #0a0a0a;
  --foreground: #33ff33;
  --card: #111111;
  --card-foreground: #33ff33;
  --primary: #00ff41;
  --primary-foreground: #0a0a0a;
  --secondary: #1a3a1a;
  --secondary-foreground: #33ff33;
  --muted: #1a1a1a;
  --muted-foreground: #22aa22;
  --accent: #003300;
  --accent-foreground: #33ff33;
  --border: #1a3a1a;
  --input: #1a3a1a;
  --ring: #00ff41;
  /* ...sidebar properties... */
  /* ...chart properties... */
  --radius: 0;
  /* Typography -- handled via font-family on body */
}

[data-theme="newspaper"] {
  --background: #f5f0e8;
  --foreground: #1a1a1a;
  /* ...etc... */
  --radius: 0;
}
```

### Theme and Dark Mode Interaction

There are two viable models:

**Model A: Creative themes replace light/dark (Recommended)**
- When a creative theme is active, it provides its own fixed colour scheme
- Retro Terminal is inherently dark; Newspaper is inherently light; etc.
- The light/dark toggle is hidden or disabled when a creative theme is active
- Simpler to implement, each theme is self-contained

**Model B: Creative themes work alongside light/dark**
- Each creative theme has both a light and dark variant
- The light/dark toggle remains active
- More flexible but doubles the design work and most creative themes only make sense in one mode

Model A is recommended. The theme switcher UI would show: Light, Dark, System, [separator], Retro Terminal, Newspaper, Synthwave, Blueprint, Minimal Ink. Selecting a creative theme overrides the light/dark choice entirely.

### Theme File Structure

```
app/src/
  themes/
    index.ts          -- Theme registry (names, labels, descriptions, metadata)
    retro-terminal.css
    newspaper.css
    synthwave.css
    blueprint.css
    minimal-ink.css
```

Or, for simplicity (fewer files), all creative theme CSS can live in a single `themes.css` file imported into `index.css`. This keeps all colour definitions in one place for easy maintenance.

### Updating the useTheme Hook

The hook needs to expand from `'light' | 'dark' | 'system'` to include creative theme identifiers:

```typescript
export type ThemeMode = 'light' | 'dark' | 'system';
export type CreativeTheme = 'retro-terminal' | 'newspaper' | 'synthwave' | 'blueprint' | 'minimal-ink' | null;

// When a creative theme is set:
// 1. Set data-theme attribute on <html>
// 2. Remove .dark class (theme controls its own colours)
// 3. Persist to localStorage
```

### Font Loading

Creative themes that use different fonts need those fonts loaded. Options:

1. **Google Fonts link tags** -- simplest, loaded on demand
2. **`@fontsource` packages** -- self-hosted, better performance, installed via bun
3. **Dynamic loading** -- only load the font CSS when the theme is activated (avoids loading 5 font families upfront)

Recommended: Use `@fontsource` for the 2-3 most impactful fonts (VT323, Playfair Display, Lora) since they're small. Load them eagerly but only apply them when the theme is active via CSS. Alternatively, use Google Fonts `<link>` tags injected dynamically when a theme is first selected.

### Shiki Theme Mapping

Each creative theme should specify which Shiki syntax highlighting theme to use. The `CodeBlock` component already reads `resolvedTheme` to choose between `github-light` and `github-dark`. This can be extended:

```typescript
const shikiThemeMap: Record<string, string> = {
  'light': 'github-light',
  'dark': 'github-dark',
  'retro-terminal': 'vitesse-dark',  // or custom overrides
  'newspaper': 'github-light',
  'synthwave': 'dracula',
  'blueprint': 'nord',
  'minimal-ink': 'min-light',
};
```

### Theme Transition Animation

For switching between themes, the View Transitions API provides a polished effect:

```typescript
function switchTheme(newTheme: string) {
  if (!document.startViewTransition) {
    applyTheme(newTheme); // Fallback for unsupported browsers
    return;
  }
  document.startViewTransition(() => {
    applyTheme(newTheme);
  });
}
```

This creates a smooth crossfade between the old and new theme states. More elaborate effects (expanding circle from the toggle button) are possible but a simple crossfade is sufficient and respects `prefers-reduced-motion`.

Browser support: Chrome, Edge, Safari 18+. Firefox fallback is an instant swap (still functional, just not animated).

### Theme Preview Thumbnails

For the theme selector UI, small preview swatches are more effective than text labels alone. Options:

1. **Colour dot swatches** -- a row of 3-4 small coloured circles showing the theme's key colours (background, primary, accent). Simple, compact, works in a dropdown.
2. **Mini preview cards** -- a tiny card (80x50px) showing the rough layout with theme colours applied. More informative but takes more space.
3. **CSS-generated previews** -- small `<div>` elements styled inline with the theme's CSS variables. No images to maintain.

Recommended: Colour dot swatches for compactness, with the theme name and a one-line description. The selector could use a popover or dropdown panel.

---

## Existing Examples and Inspiration

### VS Code Themes (Most Relevant Precedent)

VS Code's theme ecosystem is the best reference for how a code-adjacent tool handles creative themes. Key observations:

- **Synthwave '84** by Robb Owen (800k+ installs): Proves neon/retrowave works for productivity tools. Uses CSS text-shadow for glow effects on code. Key learning: the glow effect is optional and togglable -- users who find it distracting can keep the colours without the effects.
  - Source: [Synthwave '84](https://robbowen.digital/wrote-about/synthwave-84/)
  - GitHub: [robb0wen/synthwave-vscode](https://github.com/robb0wen/synthwave-vscode)

- **One Dark Pro** and **Dracula Official**: Most-downloaded themes. Balanced, not extreme. Their success comes from careful colour calibration rather than dramatic visual effects.
  - Source: [GitKraken -- 10 Popular VS Code Themes 2025](https://www.gitkraken.com/blog/10-best-vs-code-color-themes-2025)

- **Houston** (space-inspired), **2077** (cyberpunk): Show that creative/narrative themes have a real audience. The theme name and story matter as much as the colours.
  - Source: [GeeksforGeeks -- 20 Best VSCode Themes](https://www.geeksforgeeks.org/blogs/best-vscode-themes/)

- **Catppuccin** (4 variants: Latte, Frappe, Macchiato, Mocha): Demonstrates how a theme system can offer graduated intensity. Pastel, soothing colours designed to reduce eye strain while remaining visually distinctive.
  - Source: [Catppuccin Palette](https://catppuccin.com/palette/)

### Note-Taking / Documentation Apps

- **Obsidian**: Rich theme ecosystem with 100+ community themes. Notable examples include "Minimal" (clean, customisable), "Things" (macOS-native feel), and "Cybertron" (synthwave). Key learning: themes that change typography alongside colour feel much more transformative.
  - Source: [BloggingX -- Obsidian Themes](https://bloggingx.com/best-obsidian-themes/)

- **Bear** (macOS/iOS): Offers ~20 built-in themes with names like "Charcoal," "Dieci," "Olive Dunk," "Panic Mode." Each changes only the colour palette but the names and curation make them feel special. Key learning: naming and personality matter.

### Terminal Emulators

- **cool-retro-term**: CRT terminal emulator with configurable scanlines, bloom, burn-in, and phosphor glow. Demonstrates how far the retro terminal aesthetic can go.
  - Source: [HairyDuck/terminal](https://github.com/HairyDuck/terminal)

- **Hyper** terminal: Supports themes via plugins. Synthwave and retro themes are among the most popular.

### Retro CSS Frameworks

- **BOOTSTRA.386**: A Twitter Bootstrap theme that recreates the DOS text-mode aesthetic. Extreme but demonstrates the concept.
- **system.css**: Recreates Apple System OS (1984-1991). Charming for novelty.
- **NES.css**: NES-style CSS framework. Pixel borders, 8-bit aesthetic.
  - Source: [matt-auckland/retro-css](https://github.com/matt-auckland/retro-css)

### Web Design References

- **Max Bock's colour theme switcher** (mxb.dev): A well-documented example of a multi-colour-theme system with CSS custom properties. Includes theme preview swatches and smooth transitions.
  - Source: [mxb.dev/blog/color-theme-switcher](https://mxb.dev/blog/color-theme-switcher/)

- **CSS Retro Style Examples** (freefrontend.com): Collection of CSS techniques for retro effects including CRT scanlines, neon glow, and pixel aesthetics.
  - Source: [freefrontend.com/css-retro-style](https://freefrontend.com/css-retro-style/)

---

## Detailed Theme Specifications

### Theme 1: Retro Terminal

**Colour Palette:**
| Token | Value | Notes |
|-------|-------|-------|
| Background | `#0a0a0a` | Near-black, not pure black |
| Foreground | `#33ff33` | Classic phosphor green |
| Card | `#111111` | Slightly lighter surface |
| Card Foreground | `#33ff33` | Same green |
| Primary | `#00ff41` | Bright green for interactive |
| Primary Foreground | `#0a0a0a` | Black text on green buttons |
| Secondary | `#1a3a1a` | Dark green tint |
| Muted | `#1a1a1a` | Subtle dark surface |
| Muted Foreground | `#22aa22` | Dimmer green |
| Border | `#1a3a1a` | Subtle green-tinted border |
| Accent | `#003300` | Deep green |
| Destructive | `#ff3333` | Red, stays visible on dark |

**Typography:**
- Headings: VT323 (Google Fonts, SIL Open Font License) -- authentic CRT terminal character glyphs, designed from DEC VT320 terminal
- Body: JetBrains Mono (Google Fonts, SIL OFL) -- modern monospace, excellent readability, ligature support
- Fallback: `'Courier New', monospace`

**Shape Language:**
- Border radius: `0` (sharp rectangles -- terminals don't have rounded corners)
- Border width: 1px solid, green-tinted
- Shadows: None (flat), but text-shadow glow on headings and interactive elements

**Special Effects:**
- Scanline overlay: `background: repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)` applied via `::after` pseudo-element on the page container
- Phosphor glow on headings: `text-shadow: 0 0 5px #33ff33, 0 0 10px #33ff3380`
- Cursor blink effect on the page title (optional, CSS animation)
- Subtle CRT screen curvature via `border-radius` on the outermost container (optional, very subtle)

**Shiki Theme:** `vitesse-dark` with CSS overrides for green tones, or custom Shiki theme

**Sidebar:** Dark background with green text, active item highlighted with brighter green

---

### Theme 2: Newspaper / Editorial

**Colour Palette:**
| Token | Value | Notes |
|-------|-------|-------|
| Background | `#f5f0e8` | Warm cream / newsprint |
| Foreground | `#1a1a1a` | Near-black, high contrast |
| Card | `#faf7f2` | Slightly lighter cream |
| Card Foreground | `#1a1a1a` | Same dark |
| Primary | `#8b0000` | Dark red (editorial accent) |
| Primary Foreground | `#faf7f2` | Cream on red |
| Secondary | `#ede8df` | Muted cream |
| Muted | `#ede8df` | Subtle cream surface |
| Muted Foreground | `#6b6b6b` | Medium grey |
| Border | `#1a1a1a` | Thin black rules |
| Accent | `#e8e3da` | Warm light |
| Destructive | `#cc0000` | Red |

**Typography:**
- Headings: Playfair Display (Google Fonts, SIL OFL) -- classic editorial display serif, beautiful at large sizes, strong contrast between thick and thin strokes
- Body: Lora (Google Fonts, SIL OFL) -- contemporary serif with calligraphic roots, optimised for screen reading, works beautifully at paragraph length
- Fallback: `Georgia, 'Times New Roman', serif`

**Shape Language:**
- Border radius: `0` (sharp corners -- editorial / print)
- Border width: 1px solid black (thin rules, like column dividers)
- Shadows: None (flat, print-like)

**Special Effects:**
- Header styled as a newspaper masthead (centred title, date line, thin ruled borders above and below)
- Horizontal rules (`<hr>`) styled as decorative dividers (thin line with small ornament)
- Slight letter-spacing increase on uppercase elements
- Code blocks with a slightly darker cream background and monospace serif (Courier)
- Optional: drop-cap styling on the first paragraph of each section

**Shiki Theme:** `github-light` (neutral, doesn't fight the editorial palette)

**Sidebar:** Cream background, dark text, section headings in small-caps

---

### Theme 3: Synthwave / Neon

**Colour Palette:**
| Token | Value | Notes |
|-------|-------|-------|
| Background | `#1a1025` | Deep purple-black |
| Foreground | `#e0d0ff` | Soft lavender white |
| Card | `#241735` | Slightly lighter purple |
| Card Foreground | `#e0d0ff` | Same lavender |
| Primary | `#ff2975` | Hot pink (neon) |
| Primary Foreground | `#1a1025` | Dark on pink |
| Secondary | `#2d1f45` | Mid purple |
| Muted | `#2d1f45` | Subtle surface |
| Muted Foreground | `#9580c0` | Muted lavender |
| Border | `#3d2d55` | Purple-tinted border |
| Accent | `#00e5ff` | Cyan neon |
| Accent Foreground | `#1a1025` | Dark on cyan |
| Destructive | `#ff5555` | Red |

**Typography:**
- Headings: Space Grotesk (Google Fonts, SIL OFL) -- geometric sans-serif, slightly futuristic, works well at large sizes
- Body: Plus Jakarta Sans (already loaded -- the default font) or Inter. Keep body readable; the colour palette provides the personality.
- Fallback: `system-ui, sans-serif`

**Shape Language:**
- Border radius: `0.5rem` (slightly rounded, modern)
- Border width: 1px, possibly with subtle glow
- Shadows: Coloured glow shadows -- `box-shadow: 0 0 15px rgba(255, 41, 117, 0.3)` on cards, `0 0 10px rgba(0, 229, 255, 0.2)` on interactive elements

**Special Effects:**
- Gradient accent line in the header (hot pink to cyan)
- Neon glow on hover states: `box-shadow: 0 0 20px var(--primary), 0 0 40px var(--primary)50`
- Subtle gradient backgrounds on cards (very subtle, from dark purple to slightly lighter)
- Optional: animated gradient on the header border-bottom
- Code blocks with Dracula-family colours (purple background, vibrant syntax colours)

**Shiki Theme:** `dracula` or `dracula-soft`

**Sidebar:** Deep purple background, neon pink active item highlight, subtle glow on hover

---

### Theme 4: Blueprint / Architect

**Colour Palette:**
| Token | Value | Notes |
|-------|-------|-------|
| Background | `#0d2b45` | Deep blueprint blue |
| Foreground | `#e8f0ff` | Light blue-white |
| Card | `#0f3358` | Slightly lighter blue |
| Card Foreground | `#e8f0ff` | Same light |
| Primary | `#ffffff` | White (primary lines) |
| Primary Foreground | `#0d2b45` | Blue on white |
| Secondary | `#1a4a6e` | Mid blue |
| Muted | `#0f3358` | Subtle surface |
| Muted Foreground | `#7eaacc` | Muted light blue |
| Border | `#2a6090` | Blue border |
| Accent | `#ff8c42` | Orange (annotation colour) |
| Accent Foreground | `#0d2b45` | Blue on orange |
| Destructive | `#ff4444` | Red |

**Typography:**
- Headings: IBM Plex Sans (Google Fonts, SIL OFL) -- technical, precise, designed for information-dense interfaces, neutral but authoritative
- Body: IBM Plex Sans (same family, lighter weight) or IBM Plex Mono for a more technical feel
- Fallback: `'Helvetica Neue', Arial, sans-serif`

**Shape Language:**
- Border radius: `2px` (nearly sharp, technical precision)
- Border width: 1px, consistent
- Shadows: None (flat, diagrammatic)

**Special Effects:**
- Grid background pattern: `background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 20px 20px;`
- Dashed borders on code blocks (like annotation boxes on a blueprint)
- Section headings with a small "reference number" prefix (e.g., styled to look like technical drawing labels)
- Cards with subtle "drawing border" -- thin white outline
- Orange accent used sparingly for highlights and annotations

**Shiki Theme:** `nord` (cool blue tones harmonise with the blueprint palette)

**Sidebar:** Deep blue, light text, active item with white left-border (like a drawing callout)

---

### Theme 5: Minimal Ink

**Colour Palette:**
| Token | Value | Notes |
|-------|-------|-------|
| Background | `#ffffff` | Pure white |
| Foreground | `#111111` | Near-black |
| Card | `#fafafa` | Very subtle grey |
| Card Foreground | `#111111` | Same dark |
| Primary | `#c0392b` | Deep warm red (the single accent) |
| Primary Foreground | `#ffffff` | White on red |
| Secondary | `#f5f5f5` | Light grey |
| Muted | `#f0f0f0` | Subtle grey |
| Muted Foreground | `#777777` | Medium grey |
| Border | `#e0e0e0` | Light grey border |
| Accent | `#c0392b` | Same red (unified accent) |
| Accent Foreground | `#ffffff` | White on red |
| Destructive | `#c0392b` | Red (same as accent in this theme) |

**Typography:**
- Headings: Fraunces (Google Fonts, SIL OFL) -- variable font with "wonk" axis, expressive Old Style serif, adds character and warmth without colour. The wonk axis can be set to add personality at display sizes.
- Body: Inter (Google Fonts, SIL OFL) -- clean, neutral sans-serif, excellent screen readability, variable font with optical sizing
- Fallback: `system-ui, sans-serif`

**Shape Language:**
- Border radius: `0` (sharp rectangles, print-inspired)
- Border width: 1px, light grey (subtle, not heavy)
- Shadows: None (completely flat)

**Special Effects:**
- Bold typographic hierarchy -- heavier heading weights, generous spacing
- Generous whitespace / padding (more spacious than default)
- Links styled with underlines rather than colour changes (ink-on-paper convention)
- Code blocks with very light grey background, no border, monospace text
- Single accent colour used only for interactive elements and key callouts

**Shiki Theme:** `min-light`

**Sidebar:** White/very light grey, dark text, active item indicated by red left-border or bold text (no background highlight)

---

## Font Pairing Reference

All fonts listed are available on Google Fonts under the SIL Open Font License 1.1, which permits free use in commercial and non-commercial projects, modification, and redistribution. This makes them fully suitable for a client deliverable.

| Theme | Heading Font | Body Font | Vibe |
|-------|-------------|-----------|------|
| Retro Terminal | [VT323](https://fonts.google.com/specimen/VT323) | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | Authentic CRT + readable code |
| Newspaper | [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) | [Lora](https://fonts.google.com/specimen/Lora) | Classic editorial + screen-optimised serif |
| Synthwave | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) | Plus Jakarta Sans (already loaded) | Futuristic geometric + clean modern |
| Blueprint | [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) | [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) | Technical precision + consistent |
| Minimal Ink | [Fraunces](https://fonts.google.com/specimen/Fraunces) | [Inter](https://fonts.google.com/specimen/Inter) | Expressive wonky serif + clean neutral |

### Additional Font Options Considered

- **Space Mono** (Google Fonts): Quirky fixed-width font. Good alternative for Blueprint headings.
- **IBM Plex Mono** (Google Fonts): More conservative monospace. Alternative body font for Blueprint.
- **Cormorant Garamond** (Google Fonts): Elegant display serif. Alternative heading font for Newspaper (more refined than Playfair).
- **Old Standard TT** (Google Fonts): Academic/literary serif. Another option for Newspaper or Minimal Ink headings.
- **Fira Code** (Google Fonts): Monospace with programming ligatures. Alternative for Retro Terminal body text.

### Font Loading Considerations

- **VT323:** Very small file (~15KB). Minimal loading cost.
- **JetBrains Mono:** ~100KB for regular weight. Widely used, likely cached.
- **Playfair Display:** ~90KB for regular + bold. Standard editorial font.
- **Lora:** ~70KB for regular + italic. Efficient.
- **Space Grotesk:** ~40KB for regular + bold. Small.
- **IBM Plex Sans:** ~80KB for regular + bold. Moderate.
- **Fraunces:** Variable font, ~120KB. Larger but highly flexible.
- **Inter:** Variable font, ~100KB. Extremely popular, often cached by browsers.

Total additional font weight if all themes are loaded eagerly: approximately 600KB. This is acceptable for a progressive web app but could be optimised by loading fonts on demand (only when a theme is first activated).

---

## The Meta-Narrative Angle

### Dogfooding and Self-Demonstration

The playbook teaches people how to use AI tools effectively. Having creative themes that were visibly produced with AI assistance creates a powerful meta-demonstration:

- "This entire Synthwave theme -- colours, typography choices, CSS effects -- was designed by describing the desired aesthetic to Claude in natural language."
- "The Retro Terminal scanline effect was generated from a single prompt: 'Add a subtle CRT scanline overlay using CSS only.'"

This connects directly to the playbook's educational content about prompt engineering, specificity, and iterative refinement.

### How to Frame It

A small note in the theme selector (or in a tooltip) could say something like:

> "These themes were designed collaboratively with Claude -- the same AI covered in this playbook. Each one started as a natural language description and was refined through conversation."

This is not gimmicky because it is true -- and it demonstrates the exact workflow the playbook teaches. It is a concrete example of the "AI as design collaborator" concept.

### Precedent: Products That Showcase Their Own Capabilities

- **Notion** uses Notion pages for their own documentation and help centre
- **Figma** uses Figma files for their own design system documentation
- **Stripe** uses Stripe to process payments on their own documentation site's examples
- **Meta** tested React internally before public release
- **Strava** is largely built and refined by employees who actively use their own product

The playbook's creative themes serve the same purpose: they are artefacts of the workflow being taught, making the educational content feel authentic rather than theoretical.

Source: [Dogfood.ing](https://dogfood.ing/), [Examples of Dogfooding at Meta, Google](https://medium.com/@superplugsco/examples-of-dogfooding-at-meta-google-4396050664a1)

---

## Implementation Priority and Effort Estimates

| Theme | Implementation Effort | Visual Impact | Recommended Priority |
|-------|----------------------|---------------|---------------------|
| Retro Terminal | Medium (needs font loading, scanline effect, glow CSS) | Very High | 1st -- most distinctive, most fun |
| Newspaper | Low-Medium (mostly typography and colour) | High | 2nd -- elegant, design-agency-appropriate |
| Synthwave | Medium (needs font loading, glow effects, gradients) | Very High | 3rd -- visually striking, crowd-pleaser |
| Minimal Ink | Low (mostly colour and typography changes) | Medium | 4th -- quick to implement, good contrast option |
| Blueprint | Medium (needs grid background, font loading) | High | 5th -- distinctive but more niche |

### Suggested MVP Scope

For an initial release, implement **3 themes**: Retro Terminal, Newspaper, and Synthwave. These three provide the widest range of visual variety (dark/technical, light/editorial, dark/vibrant) and are the most likely to delight users. Minimal Ink and Blueprint can be added later as they share infrastructure with the first three.

---

## Technical Reference Links

### Tailwind v4 Theming
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme)
- [Tailwind v4 Multi-Theme Strategy -- simonswiss](https://simonswiss.com/posts/tailwind-v4-multi-theme)
- [Flawless Multi-Theme System with Tailwind v4 + React](https://medium.com/render-beyond/build-a-flawless-multi-theme-ui-using-new-tailwind-css-v4-react-dca2b3c95510)
- [Tailwind v4 Theming Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/18471)

### Colour Palettes and Theme Specs
- [Dracula Theme Specification](https://draculatheme.com/spec)
- [Catppuccin Palette](https://catppuccin.com/palette/)
- [Nord Theme Colours and Palettes](https://www.nordtheme.com/docs/colors-and-palettes)

### CSS Effects
- [CSS Retro Style Examples](https://freefrontend.com/css-retro-style/)
- [Synthwave CSS & JavaScript Snippets](https://speckyboy.com/css-javascript-snippets-synthwave/)
- [CRT Terminal CSS + JS](https://codesandbox.io/s/crt-terminal-in-css-js-tlijm)
- [Using CSS Animations to Mimic CRT Monitors](https://medium.com/@dovid11564/using-css-animations-to-mimic-the-look-of-a-crt-monitor-3919de3318e2)
- [Recreating Cyberpunk 2077 UI Elements in CSS](https://www.csskitsune.com/blog/recreating-cyberpunk-2077-ui-elements)
- [Cybercore.css -- Cyberpunk CSS Framework](https://www.cssscript.com/cyberpunk-css-framework-cybercore/)

### Theme Transition Animation
- [View Transition API Theme Toggle](https://akashhamirwasia.com/blog/full-page-theme-toggle-animation-with-view-transitions-api/)
- [Theme Switcher Using View Transition](https://iankduffy.com/articles/creating-a-theme-switcher-using-view-transition/)
- [React Theme Switch Animation (npm package)](https://github.com/MinhOmega/react-theme-switch-animation)
- [Animated Dark Mode Toggle with View Transitions API in React](https://notanumber.in/blog/animated-dark-mode-toggle-with-view-transitions-api-in-react)

### Font Resources
- [Google Fonts](https://fonts.google.com/)
- [Best Google Font Pairings for UI Design 2025](https://medley.ltd/blog/best-google-font-pairings-for-ui-design-in-2025/)
- [14 Retro Google Fonts](https://octet.design/journal/retro-google-fonts/)
- [30+ Retro & Vintage Google Fonts](https://cssauthor.com/best-free-retro-vintage-google-fonts/)

### Theme Switcher UI
- [Max Bock -- Color Theme Switcher](https://mxb.dev/blog/color-theme-switcher/)
- [Building a Theme Switch Component (web.dev)](https://web.dev/articles/building/a-theme-switch-component)
- [Inclusive Components -- Theme Switcher](https://inclusive-components.design/a-theme-switcher/)

### Shiki Syntax Highlighting
- [Shiki Themes](https://shiki.style/themes)
- [Shiki Guide](https://shiki.style/guide/)

### Retro CSS Frameworks (Reference/Inspiration)
- [Retro CSS Frameworks List](https://github.com/matt-auckland/retro-css)
- [Synthwave '84 VS Code Theme](https://github.com/robb0wen/synthwave-vscode)

---

## Key Decisions for the Spec Phase

The following decisions should be resolved before writing build specs:

1. **How many themes for MVP?** Recommendation: 3 (Retro Terminal, Newspaper, Synthwave). The remaining 2 can follow.

2. **Theme + dark mode interaction model?** Recommendation: Model A (creative themes replace light/dark, each has a fixed colour scheme).

3. **Font loading strategy?** Recommendation: `@fontsource` packages installed via bun for self-hosting. Load eagerly (total ~600KB for all themes, acceptable). Alternative: Google Fonts CDN with `font-display: swap`.

4. **Theme CSS structure?** Recommendation: Single `themes.css` file imported into `index.css` for simplicity. Can be split later if the file grows large.

5. **Theme transition animation?** Recommendation: View Transitions API with crossfade. Fallback to instant swap. Respect `prefers-reduced-motion`.

6. **Scanline/glow effects -- always on or toggleable?** Recommendation: Always on for the Retro Terminal theme, but subtle enough not to impair readability. The scanline overlay should have low opacity (0.05-0.1).

7. **Where do creative themes appear in the UI?** Recommendation: In the existing theme/mode switcher, grouped separately from Light/Dark/System with a visual separator and a "Creative Themes" label.
