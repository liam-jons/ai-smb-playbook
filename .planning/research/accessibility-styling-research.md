# Accessibility-Focused Styling Research: Dyslexia & Readability

**Date:** 16 February 2026
**Scope:** Dyslexia-friendly viewing modes, readability enhancements, and accessibility theme implementation for the Phew AI Playbook React app (Vite + React + Tailwind v4 + shadcn/ui)

---

## Key Findings Summary

1. **Specialised dyslexia fonts (OpenDyslexic, Dyslexie) have weak scientific evidence** supporting their effectiveness. Multiple peer-reviewed studies show no significant improvement in reading speed or accuracy. However, many dyslexic users report subjective preference and comfort — and user choice matters.

2. **What actually helps dyslexic readers is well-evidenced:** increased letter spacing, increased line spacing, warm/cream background colours, left-aligned text, appropriate line lengths, and generous word spacing. These typography adjustments have stronger research support than font changes alone.

3. **A combined "dyslexia-friendly mode" is the right approach** — bundling font, spacing, colour, and layout changes together is more effective and less confusing than individual toggles. This aligns with what Smashing Magazine, the Agastya widget, and the BDA Style Guide all recommend.

4. **Atkinson Hyperlegible Next (2025)** is the standout accessibility font — it now has 7 weights, 150+ language support, a monospace variant, and is available on Google Fonts and via npm/Fontsource. It has stronger evidence backing than OpenDyslexic and is suitable as both a readability font and the primary dyslexia-mode font.

5. **The existing codebase architecture supports this well.** The app already uses CSS custom properties via Tailwind v4's `@theme inline`, a `useTheme` hook with localStorage persistence, and a `dark` class-based variant. Adding accessibility modes as additional data attributes or classes is a natural extension.

6. **Recommended priority:** Dyslexia-friendly mode (high value, evidence-based) > High contrast mode (useful, straightforward) > Large text mode (simple) > Focus/reading mode (nice-to-have). Colour-blind adjustments are lower priority given the app's existing design choices.

---

## 1. Dyslexia-Friendly Fonts (2025-2026 State of the Art)

### 1.1 OpenDyslexic

- **Current version:** OpenDyslexic 3 (ground-up redesign)
- **Licence:** SIL Open Font License (SIL-OFL) — free for all uses including commercial
- **Availability:**
  - npm: `@fontsource/opendyslexic` (v5.2.5)
  - CDN: CDNFonts.com, Fontsource
  - Direct download: [opendyslexic.org](https://opendyslexic.org/)
  - GitHub: [antijingoist/open-dyslexic](https://github.com/antijingoist/open-dyslexic)
- **Weights:** Regular and Bold
- **Design approach:** Heavier bottom-weighted letterforms intended to "anchor" letters; distinct shapes for commonly confused letters (b/d, p/q)
- **Key concern:** Renders noticeably larger than standard fonts at the same CSS font-size, requiring layout adjustments. The CSS `font-size-adjust` property (Baseline as of July 2024) can help normalise the x-height across font switches.

**Sources:**
- [OpenDyslexic official site](https://opendyslexic.org/)
- [Fontsource OpenDyslexic](https://fontsource.org/fonts/opendyslexic)
- [CDNFonts OpenDyslexic](https://www.cdnfonts.com/opendyslexic.font)

### 1.2 Atkinson Hyperlegible Next (2025 — Recommended)

- **Released:** February 2025, by the Braille Institute
- **Licence:** SIL Open Font License (OFL-1.1)
- **Availability:**
  - Google Fonts: [Atkinson Hyperlegible Next](https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next)
  - npm: `@fontsource/atkinson-hyperlegible-next`
  - GitHub: [googlefonts/atkinson-hyperlegible](https://github.com/googlefonts/atkinson-hyperlegible)
- **Key improvements over original (2019):**
  - 7 weights (Light to Extrabold) — up from 2
  - Variable font version available
  - 150+ language support — up from 27
  - New monospace variant: Atkinson Hyperlegible Mono
- **Design approach:** Maximises character differentiation through exaggerated letter features, open counters, and distinct letterforms. Designed for low vision but also benefits dyslexic readers.
- **Research backing:** Developed through collaboration with visual impairment specialists; focused on legibility rather than dyslexia-specific claims.

**This is the recommended primary accessibility font.** It has stronger evidence, better design versatility (7 weights), broader language support, and does not carry the "pseudoscience" baggage of fonts marketed specifically for dyslexia.

**Sources:**
- [Braille Institute announcement (February 2025)](https://www.brailleinstitute.org/about-us/news/braille-institute-launches-enhanced-atkinson-hyperlegible-font-to-make-reading-easier/)
- [Atkinson Hyperlegible Next on Google Fonts](https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next)
- [Fontsource installation guide](https://fontsource.org/fonts/atkinson-hyperlegible-next/install)

### 1.3 Other Notable Fonts

| Font | Type | Licence | Notes |
|------|------|---------|-------|
| **Lexie Readable** | Sans-serif | Free for individuals, education, charity; commercial licence needed | Designed as a "mature Comic Sans" by Keith Bates (K-Type). Long ascenders/descenders, generous spacing. |
| **Sylexiad** | Serif & Sans | Commercial (Dr. Robert Hillier) | Academic research-backed; tested with adult dyslexic readers who showed clear preference. Not freely available for web use. |
| **Luciole** | Sans-serif | Creative Commons Attribution (CC BY 4.0) | Designed for low vision (not dyslexia specifically) by French specialists. Research shows slight advantage over OpenDyslexic. New Luciole Math extension released 2025 under OFL. |
| **Dyslexie** | Sans-serif | Commercial (paid licence required) | Dutch design; research results are mixed. A 2018 PMC study found no benefit over Arial. |
| **Comic Sans** | Sans-serif | Bundled with Microsoft products | Often anecdotally preferred by dyslexic readers. BDA lists it as recommended. Carries unprofessional associations. |

**Sources:**
- [Lexie Readable — K-Type](https://www.k-type.com/fonts/lexie-readable/)
- [Sylexiad download page](https://www.sylexiad.com/download-typefaces/sylexiad-serif/index.html)
- [Luciole official site](https://www.luciole-vision.com/)
- [Luciole research paper (ScienceDirect, 2023)](https://www.sciencedirect.com/science/article/pii/S0001691823001026)
- [Dyslexie Font](https://dyslexiefont.com/)

### 1.4 The Research Debate: Do Dyslexia Fonts Actually Help?

This is an important and nuanced topic. The evidence landscape as of late 2025 is as follows:

#### Studies Finding No Benefit

- **Rello & Baeza-Yates (2013, 2016):** Tested OpenDyslexic and found no statistically significant improvement in reading speed or accuracy compared to standard fonts. Published in ACM Transactions on Accessible Computing.
- **Kuster et al. (2018):** Dyslexie font did not benefit reading in children with or without dyslexia, compared to Arial. Published in Annals of Dyslexia (PMC5934461). The majority of participants preferred Arial.
- **Wery & Diliberto (2017):** OpenDyslexic actually reduced reading speed and accuracy compared to Arial and Times New Roman. Published in Annals of Dyslexia (PMC5629233).
- **Gruber / Daring Fireball (December 2025):** Referenced Adrian Roselli's comprehensive debunking, calling specialised dyslexia fonts "based on voodoo pseudoscience." The core argument: dyslexia is a phonological deficit, not a visual one, so visually altering letterforms addresses the wrong problem.

#### Studies Finding Some Benefit

- **Hillier (Sylexiad research):** Adult dyslexic readers showed clear preference for Sylexiad typefaces, though preference does not necessarily equal improved performance.
- **Zorzi et al. (2012, PNAS):** Extra-large letter spacing (not font changes) improved reading speed by 20% and doubled accuracy in dyslexic children. This is strong evidence — but it supports *spacing* changes, not *font* changes.
- **Frontiers in Computer Science (2025):** A Greek font study found that identifying preferable fonts for readers with dyslexia has value, though the benefit may be more about comfort than measurable performance.

#### Current Consensus

**The weight of peer-reviewed evidence does not support specialised dyslexia fonts as an evidence-based intervention for reading speed or accuracy.** However:

1. Many dyslexic users express subjective comfort and preference for these fonts
2. The features that help (spacing, distinct letterforms, larger x-height) can be achieved through CSS adjustments and well-designed standard fonts
3. Offering user choice is itself an accessibility practice — even if the benefit is primarily psychological comfort rather than measurable reading improvement
4. **Spacing changes have the strongest evidence** — this is where implementation effort should be concentrated

**Practical recommendation:** Offer OpenDyslexic as an option (users expect it and some strongly prefer it), but default the dyslexia-friendly mode to Atkinson Hyperlegible Next + enhanced spacing. Do not make medical claims about font effectiveness.

**Sources:**
- [PMC5629233 — Wery & Diliberto (2017)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5629233/)
- [PMC5934461 — Kuster et al. (2018)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5934461/)
- [PNAS — Zorzi et al. (2012)](https://www.pnas.org/doi/10.1073/pnas.1205566109)
- [Daring Fireball (December 2025)](https://daringfireball.net/linked/2025/12/12/dyslexia-fonts-pseudoscience)
- [Pimp my Type — Dyslexia fonts analysis](https://pimpmytype.com/dyslexia-fonts/)
- [Edutopia — Do Dyslexia Fonts Actually Work?](https://www.edutopia.org/article/do-dyslexia-fonts-actually-work/)
- [Frontiers in Computer Science (2025) — Greek font design](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1610349/full)

### 1.5 New Fonts Released in 2025-2026

- **Atkinson Hyperlegible Next** (February 2025) — the major release in this period, as detailed above
- **Luciole Math** (2025) — extension of Luciole for mathematical symbols, released under OFL
- **Atkinson Hyperlegible Mono** (2025) — monospace variant for coding/tables
- No entirely new dyslexia-specific fonts have been identified in 2025-2026. The trend is towards improving legibility fonts with strong design principles rather than creating new "dyslexia fonts"

---

## 2. Beyond Fonts — What Actually Helps Dyslexic Readers

This section covers evidence-based typography and layout adjustments. These have *stronger research support* than font changes.

### 2.1 Background Colour

**Research findings:**
- The British Dyslexia Association (BDA) uses and recommends cream/off-white backgrounds on their own website
- A W3C study found that warm background colours (peach, orange, yellow) significantly improved reading performance over cool backgrounds
- Turquoise backgrounds also showed benefit in some studies
- Pure white backgrounds create more glare and visual stress
- Individual variation is significant — what helps one person may not help another

**Recommended values for light dyslexia mode:**
- Background: Cream/warm off-white (e.g., `#FBF7F0` or `oklch(0.97 0.01 80)`)
- Avoid pure white (`#FFFFFF`)
- Card/surface backgrounds: Slightly warmer than the page background

**For dark dyslexia mode:**
- Maintain the warm tint: dark warm grey rather than cool/blue-tinted dark
- Reduced brightness contrast between text and background (not pure white on pure black)

**Sources:**
- [W3C — Optimal Colors for Readability](https://www.w3.org/WAI/RD/2012/text-customization/r11)
- [CMU — Good Background Colors for Readers](https://www.cs.cmu.edu/~jbigham/pubs/pdfs/2017/colors.pdf)
- [Dyslexic Help — What Colour Paper?](https://dyslexichelp.org/what-colour-paper-is-best-for-dyslexia/)
- [Centre for Educational Neuroscience (2025)](http://www.educationalneuroscience.org.uk/2025/11/14/reading-coloured-overlays-and-visual-stress/)

### 2.2 Line Spacing (Leading)

**Research findings:**
- BDA Style Guide 2023: Line spacing should be at least 1.5 (150%)
- WCAG 1.4.12 (AA): Line height at least 1.5 times the font size
- WCAG 1.4.8 (AAA): Space-and-a-half within paragraphs
- Zorzi et al. (2012): Extra-large line spacing improved reading in dyslexic children

**Recommended value:** `line-height: 1.8` for body text in dyslexia mode (above the 1.5 minimum, providing extra comfort)

### 2.3 Letter Spacing (Tracking)

**Research findings:**
- Zorzi et al. (2012, PNAS): Extra-wide letter spacing **doubled accuracy and increased reading speed by 20%+** in dyslexic children aged 8-14. This is one of the strongest findings in dyslexia readability research.
- BDA Style Guide 2023: "Larger inter-letter/character spacing improves readability, ideally around 35% of the average letter width"
- WCAG 1.4.12 (AA): Letter spacing at least 0.12em
- The benefit appears to be related to reducing "crowding" — a phenomenon where neighbouring letters interfere with identification. Dyslexic readers are more affected by crowding than typical readers.
- Children *without* reading challenges showed no benefit from extra spacing, confirming the specificity of this intervention.

**Recommended value:** `letter-spacing: 0.05em` to `0.12em` for dyslexia mode (conservative but noticeable). The Smashing Magazine implementation uses `0.35ch` which is more aggressive.

### 2.4 Word Spacing

**Research findings:**
- BDA Style Guide 2023: Inter-word spacing should be at least 3.5 times the inter-letter spacing
- WCAG 1.4.12 (AA): Word spacing at least 0.16em
- Increased word spacing helps reduce crowding between words

**Recommended value:** `word-spacing: 0.16em` to `0.35em` for dyslexia mode

### 2.5 Line Length / Measure

**Research findings:**
- General optimal: 50-75 characters per line, with 66 characters as the "sweet spot"
- WCAG 1.4.8 (AAA): No more than 80 characters per line
- BDA guidance: Shorter lines preferred, around 60-70 characters
- For dyslexic readers specifically: 45-60 characters may be optimal
- CSS implementation: `max-width: 65ch` or similar on content containers

**Recommended value:** `max-width: 70ch` for content areas in dyslexia mode (the app may already constrain this)

### 2.6 Text Alignment

**Research findings:**
- BDA Style Guide 2023: Left-align text, without justification
- WCAG 1.4.8 (AAA): Text is not justified
- Justified text creates uneven word spacing that produces "rivers of white space" running through paragraphs, making it harder for dyslexic readers to track lines
- Left-aligned text provides a consistent left edge for the eye to return to

**Recommended value:** `text-align: left` (remove any justification in dyslexia mode). The current app likely already uses left alignment.

### 2.7 Font Size

**Research findings:**
- BDA Style Guide 2023: 12-14pt minimum (equivalent to 16-19px or 1-1.2em)
- WCAG 1.4.4 (AA): Text can be resized up to 200% without loss of content
- Larger text is generally better for dyslexic readers, but excessively large text reduces words per line and can impair reading flow

**Recommended value:** Base font size of at least 16px (already standard); dyslexia mode could bump to 18px (`font-size: 1.125rem`)

### 2.8 Paragraph Spacing

**Research findings:**
- WCAG 1.4.12 (AA): Paragraph spacing at least 2em (twice the font size)
- WCAG 1.4.8 (AAA): Paragraph spacing at least 1.5 times the line spacing
- Clear paragraph separation helps readers track their position in the text

**Recommended value:** `margin-bottom: 1.5em` on paragraphs in dyslexia mode

### 2.9 Font Weight

**Research findings:**
- The Smashing Magazine implementation uses `font-weight: 600` (demi-bold) to counteract the visual "thinning" effect of extra spacing
- Slightly heavier text is easier to read for many users with visual or cognitive difficulties

**Recommended value:** `font-weight: 500` or `600` for body text in dyslexia mode

### 2.10 Contrast Considerations

WCAG requires minimum contrast ratios of:
- 4.5:1 for normal text (AA)
- 3:1 for large text (AA)
- 7:1 for normal text (AAA)

Dyslexia-friendly modes must maintain these ratios while using warmer/softer colours. The cream background approach actually works well here — dark text on cream has sufficient contrast while being gentler on the eyes.

### 2.11 Summary of WCAG Requirements

| WCAG Criterion | Level | Requirement |
|----------------|-------|-------------|
| 1.4.4 Resize text | AA | Text resizable to 200% without loss |
| 1.4.8 Visual Presentation | AAA | Line length <= 80 chars, line spacing >= 1.5, no justification, user-selectable colours |
| 1.4.12 Text Spacing | AA | Line height >= 1.5x font, paragraph spacing >= 2x font, letter spacing >= 0.12em, word spacing >= 0.16em |

**Sources:**
- [BDA Style Guide 2023 (PDF)](https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf)
- [WCAG 2.2 — Text Spacing (1.4.12)](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [WCAG 2.2 — Visual Presentation (1.4.8)](https://www.w3.org/WAI/WCAG21/Understanding/visual-audio-contrast-visual-presentation.html)
- [Smashing Magazine — Adding A Dyslexia-Friendly Mode To A Website](https://www.smashingmagazine.com/2021/11/dyslexia-friendly-mode-website/)
- [PNAS — Extra-large letter spacing improves reading in dyslexia](https://www.pnas.org/doi/10.1073/pnas.1205566109)
- [PMC7188700 — Inter-letter spacing, inter-word spacing, and font study](https://pmc.ncbi.nlm.nih.gov/articles/PMC7188700/)
- [The A11Y Collective — Text Spacing WCAG](https://www.a11y-collective.com/blog/text-spacing-wcag/)

---

## 3. Combined Theme Approach

### 3.1 Existing Implementations

#### Smashing Magazine's Dyslexia-Friendly Mode

The most well-documented implementation. Key approach:
- Adds a `.dyslexia-mode` class to `<body>`
- Bundles: OpenDyslexic font, increased letter spacing (`0.35ch`), word spacing (`1.225ch`), font weight 600, palegoldenrod zebra striping on lists, removal of decorative background images
- Toggle via JavaScript with localStorage persistence
- CSS-only visual changes (no layout restructuring)

**Source:** [Smashing Magazine (November 2021)](https://www.smashingmagazine.com/2021/11/dyslexia-friendly-mode-website/)

#### Agastya by Oswald Labs

Commercial accessibility widget:
- Dyslexia mode bundles: black-on-yellow colour scheme, OpenDyslexic font, high contrast, removal of unnecessary elements
- Also provides: night mode, read-aloud, GDPR-compliant analytics
- One-line JavaScript integration
- User can customise which modes appear on the home screen
- Active/deactive modes tracked and resettable

**Source:** [Agastya Dyslexia-Friendly Mode](https://oswaldlabs.com/platform/agastya/features/dyslexia-friendly-mode/)

#### UserWay Accessibility Widget

- Offers font switching (including "dyslexia-friendly font")
- Provides: text enlargement, link highlighting, line height adjustment, letter spacing, word spacing
- Each feature is an individual toggle rather than a bundled mode

**Source:** [UserWay — Improving Websites for People with Dyslexia](https://userway.org/blog/improving-websites-for-users-with-dyslexia/)

#### Accessibilik (Open Source React Widget)

- React-based widget for accessibility
- Includes: visual impairment mode (enhanced contrast + larger text), zoom, big cursor, reading guide
- Built with Tailwind CSS and React
- Preferences saved via localStorage
- Open source on GitHub

**Source:** [GitHub — RosenGray/accessibilik](https://github.com/RosenGray/accessibilik)

### 3.2 Recommended Bundle for Dyslexia-Friendly Mode

Based on the research, the dyslexia-friendly mode should bundle these changes together:

| Property | Default Value | Dyslexia Mode Value | Evidence Level |
|----------|--------------|---------------------|----------------|
| Font family | Plus Jakarta Sans | Atkinson Hyperlegible Next (with OpenDyslexic as secondary option) | Moderate |
| Background | Cool-tinted off-white | Warm cream (#FBF7F0 / oklch ~0.97 0.01 80) | Moderate |
| Line height | ~1.5 | 1.8 | Strong |
| Letter spacing | Normal | 0.05em | Strong |
| Word spacing | Normal | 0.16em | Strong |
| Font weight | 400 | 500 | Moderate |
| Font size | 16px | 18px (1.125rem) | Moderate |
| Max line width | Existing | 70ch | Moderate |
| Text alignment | Left | Left (ensure no justification) | Strong |
| Paragraph spacing | ~1em | 1.5em | Moderate |
| Decorative elements | Visible | Hidden/reduced | Weak (subjective) |

### 3.3 User Preference Persistence

The current app uses `localStorage` with the prefix `phew-playbook`. The pattern for accessibility preferences:

```
phew-playbook-theme          → 'light' | 'dark' | 'system'     (existing)
phew-playbook-a11y-mode      → 'default' | 'dyslexia' | 'high-contrast' | 'large-text'
phew-playbook-a11y-font      → 'default' | 'atkinson' | 'opendyslexic'
```

Alternatively, a single JSON blob for all accessibility preferences:

```json
{
  "mode": "dyslexia",
  "font": "atkinson",
  "fontSize": "large"
}
```

**Recommendation:** Store accessibility mode as a single string (`phew-playbook-a11y-mode`). Allow an optional font override within dyslexia mode. This keeps the API simple and the persistence lightweight.

### 3.4 Handling OpenDyslexic's Larger Rendering

OpenDyslexic renders significantly larger than standard fonts at the same `font-size`. Solutions:

1. **`font-size-adjust` (Recommended):** Now in Baseline (July 2024), supported in all major browsers. Normalises the x-height across font families:
   ```css
   .dyslexia-mode {
     font-size-adjust: 0.5; /* Adjust to match x-height of default font */
   }
   ```

2. **Reduce font-size when using OpenDyslexic:**
   ```css
   .dyslexia-opendyslexic {
     font-size: 0.9em; /* Compensate for larger rendering */
   }
   ```

3. **Use `@font-face` `size-adjust`:**
   ```css
   @font-face {
     font-family: 'OpenDyslexic';
     src: url(...);
     size-adjust: 90%; /* Normalise relative to other fonts */
   }
   ```

**Source:** [web.dev — CSS font-size-adjust is now in Baseline](https://web.dev/blog/font-size-adjust)

---

## 4. Other Accessibility Viewing Modes Worth Considering

### 4.1 High Contrast Mode (Recommended — Priority 2)

**What it does:** Increases colour contrast beyond default, particularly useful for users with low vision.

**Implementation approach:**
- Use CSS custom properties to define high-contrast colour values
- Respond to `prefers-contrast: more` media query for automatic detection
- Also allow manual toggle via UI
- Use the existing CSS variable architecture (override the `--background`, `--foreground`, `--primary`, etc. variables)
- Key changes: Stronger borders, higher text contrast ratios (7:1+ for all text), no subtle colour distinctions

**CSS media queries to respect:**
```css
@media (prefers-contrast: more) {
  /* High contrast overrides */
}
@media (forced-colors: active) {
  /* Windows High Contrast Mode — 93% browser support as of late 2024 */
}
```

**Effort:** Low-medium. The existing CSS variable architecture makes this straightforward.

**Sources:**
- [MDN — prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)
- [Smashing Magazine — Creating A High-Contrast Design System With CSS Custom Properties](https://www.smashingmagazine.com/2023/01/creating-high-contrast-design-system-css-custom-properties/)
- [LogRocket — Boost accessibility for high-contrast users with CSS](https://blog.logrocket.com/boost-accessibility-high-contrast-users-css/)

### 4.2 Large Text Mode (Recommended — Priority 3)

**What it does:** Increases base font size across the app.

**Implementation approach:**
- Scale the root `font-size` (e.g., from 16px to 20px or 24px)
- Because the app uses `rem` units, everything scales proportionally
- Consider offering 2-3 size steps: Default, Large (125%), Extra Large (150%)
- Ensure layouts do not break at larger sizes (WCAG 1.4.4 requires up to 200%)

**Effort:** Low, if the app already uses `rem`-based sizing consistently.

### 4.3 Reduced Motion (Already Partially Handled)

The current `index.css` already includes:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This is correct. The app could also expose a manual toggle for users who want reduced motion without changing their OS preference, but this is lower priority.

**Source:** [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

### 4.4 Focus / Reading Mode (Nice-to-Have — Priority 4)

**What it does:** Reduces visual clutter to help users concentrate on content.

**Possible changes:**
- Hide sidebar navigation (full-width content)
- Remove decorative elements, background patterns
- Simplify header to minimal
- Increase content area padding
- Optional: dim/blur everything except the currently focused section

**Relevance:** Beneficial for ADHD and neurodivergent users. Duolingo's "Focus Mode" was praised for helping neurodivergent users minimise cognitive overload.

**Effort:** Medium. Requires conditional rendering of layout elements.

### 4.5 Colour-Blind Friendly Adjustments (Lower Priority)

**Why lower priority for this app:**
- The app's design does not rely heavily on colour-coded information
- The primary content is text-based
- Any colour-only indicators should already use secondary cues (icons, labels) per WCAG 1.4.1

**If implemented:**
- Use blue/orange colour combinations (distinguishable across most colour vision deficiencies)
- Ensure all links are underlined (not colour-only)
- Add patterns or icons alongside colour-coded elements
- Test with Chrome DevTools' colour vision deficiency emulation

**Sources:**
- [Secret Stache — Designing UI with colour blind users](https://www.secretstache.com/blog/designing-for-color-blind-users/)
- [Equalize Digital — Color-Blind Accessible](https://equalizedigital.com/website-accessibility-color-blind/)
- [Chrome DevTools CVD simulation](https://developer.chrome.com/docs/chromium/cvd)

---

## 5. Implementation Patterns

### 5.1 Architecture: Data Attributes + CSS Custom Properties

The recommended approach for the existing Tailwind v4 + React codebase:

**Strategy:** Use a `data-a11y-mode` attribute on `<html>` alongside the existing `dark` class. Define accessibility mode CSS variables that layer on top of the colour theme.

```css
/* In index.css — accessibility mode overrides */

/* Dyslexia-friendly mode */
[data-a11y-mode="dyslexia"] {
  --font-sans: 'Atkinson Hyperlegible Next', ui-sans-serif, system-ui, sans-serif;
  --a11y-letter-spacing: 0.05em;
  --a11y-word-spacing: 0.16em;
  --a11y-line-height: 1.8;
  --a11y-font-weight: 500;
}

/* Dyslexia mode — light theme background override */
:root[data-a11y-mode="dyslexia"] {
  --background: oklch(0.97 0.01 80);  /* Warm cream */
  --card: oklch(0.98 0.008 80);
}

/* Dyslexia mode — dark theme background override */
.dark[data-a11y-mode="dyslexia"] {
  --background: oklch(0.18 0.01 60);  /* Warm dark grey */
  --card: oklch(0.22 0.01 60);
}

/* High contrast mode */
[data-a11y-mode="high-contrast"] {
  --foreground: oklch(0.0 0 0);       /* Pure black */
  --background: oklch(1.0 0 0);       /* Pure white */
  --border: oklch(0.0 0 0);
  /* ... all variables at maximum contrast */
}

/* Apply typography properties */
body {
  letter-spacing: var(--a11y-letter-spacing, normal);
  word-spacing: var(--a11y-word-spacing, normal);
  line-height: var(--a11y-line-height, 1.5);
}
```

**Why this works well with the existing codebase:**
- The app already uses CSS custom properties via `@theme inline`
- The `dark` class variant already establishes the pattern of class/attribute-based theming
- shadcn/ui components automatically pick up CSS variable changes
- No need to modify individual component styles

### 5.2 Tailwind v4 Multi-Theme Pattern

In Tailwind v4, the recommended approach for multiple themes is:

1. Define theme variables in `@theme inline` (already done)
2. Override variables using `@layer base` with attribute selectors
3. Optionally use `@custom-variant` for Tailwind utility classes

```css
/* Define a custom variant for dyslexia mode */
@custom-variant dyslexia (&:is([data-a11y-mode="dyslexia"] *));

/* Then use in components: dyslexia:font-bold, dyslexia:text-lg, etc. */
```

However, the CSS variable approach is cleaner for most cases — the custom variant approach is only needed for one-off component overrides.

**Sources:**
- [Medium — Build a Multi-Theme System using Tailwind CSS v4 & React](https://medium.com/render-beyond/build-a-flawless-multi-theme-ui-using-new-tailwind-css-v4-react-dca2b3c95510)
- [simonswiss — Tailwind CSS v4 Multi-Theme Strategy](https://simonswiss.com/posts/tailwind-v4-multi-theme)
- [Tailwind CSS Discussions — Multi-theme with data attributes](https://github.com/tailwindlabs/tailwindcss/discussions/16292)

### 5.3 Interaction with Light/Dark Mode

The accessibility mode and colour scheme (light/dark) are **orthogonal** — a user can be in dyslexia mode with dark theme, or high-contrast mode with light theme, etc.

**Implementation pattern:**
```
<html class="dark" data-a11y-mode="dyslexia" data-a11y-font="opendyslexic">
```

The CSS cascade handles this naturally:
1. `:root` sets light theme defaults
2. `.dark` overrides colours for dark mode
3. `[data-a11y-mode="dyslexia"]` overrides spacing/font, and can override colours further
4. `.dark[data-a11y-mode="dyslexia"]` handles the intersection (dark + dyslexia)

### 5.4 React Hook Pattern

Extend the existing `useTheme` pattern:

```typescript
type A11yMode = 'default' | 'dyslexia' | 'high-contrast' | 'large-text';
type A11yFont = 'default' | 'atkinson' | 'opendyslexic';

function useAccessibility() {
  const [mode, setMode] = useState<A11yMode>(getStoredA11yMode);
  const [font, setFont] = useState<A11yFont>(getStoredA11yFont);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'default') {
      root.removeAttribute('data-a11y-mode');
    } else {
      root.setAttribute('data-a11y-mode', mode);
    }
  }, [mode]);

  // ... persistence to localStorage, font loading, etc.
}
```

### 5.5 Font Loading Strategy

For accessibility fonts that may not be used by most visitors:

1. **Do not load accessibility fonts eagerly.** Only load when the mode is activated.
2. **Use Fontsource for self-hosting** (already used for Plus Jakarta Sans likely):
   ```typescript
   // Dynamically import when mode is activated
   if (font === 'atkinson') {
     await import('@fontsource/atkinson-hyperlegible-next/400.css');
     await import('@fontsource/atkinson-hyperlegible-next/500.css');
     await import('@fontsource/atkinson-hyperlegible-next/700.css');
   }
   if (font === 'opendyslexic') {
     await import('@fontsource/opendyslexic/400.css');
     await import('@fontsource/opendyslexic/700.css');
   }
   ```
3. **Alternative: Use Google Fonts CDN** for Atkinson Hyperlegible Next (widely cached, fast)

### 5.6 CSS Media Queries to Respect

The app should respond to these system-level preferences:

| Media Query | Purpose | Current Status |
|-------------|---------|----------------|
| `prefers-color-scheme` | Light/dark mode | Handled (via `useTheme` hook) |
| `prefers-reduced-motion` | Reduce animations | Handled (in `index.css`) |
| `prefers-contrast` | High contrast preference | **Not yet handled** |
| `forced-colors` | Windows High Contrast Mode | **Not yet handled** |

Adding support for `prefers-contrast` and `forced-colors` would be a quick win.

**Source:** [MDN — Using media queries for accessibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using_for_accessibility)

### 5.7 No Established React Library for This

There is no widely-adopted, well-maintained React library specifically for accessibility theme management. The closest options are:
- **Accessibilik** — open-source React widget, but immature
- **react-css-theme-switcher** — general theme switcher, not accessibility-specific
- **next-themes** — Next.js specific, but the pattern is portable

**Recommendation:** Build a custom `useAccessibility` hook. The implementation is straightforward given the existing architecture, and avoids a dependency for what amounts to ~100 lines of code.

---

## 6. Recommendations Summary

### Must-Have (Priority 1)

- **Dyslexia-friendly mode** as a combined theme toggle:
  - Atkinson Hyperlegible Next as default font
  - OpenDyslexic as optional secondary font
  - Warm cream background (light) / warm dark grey background (dark)
  - Increased letter spacing (0.05em), word spacing (0.16em), line height (1.8)
  - Font weight 500 for body text
  - Ensure all content max-width is capped at ~70ch
  - Left text alignment enforced (remove any justification)
- localStorage persistence using existing `phew-playbook` prefix
- Dynamic font loading (only load accessibility fonts when mode is active)

### Should-Have (Priority 2)

- **High contrast mode** via CSS variable overrides
- Respond to `prefers-contrast: more` media query automatically
- Respond to `forced-colors: active` for Windows High Contrast Mode
- Accessibility settings panel/dropdown in the header (alongside the existing theme toggle)

### Nice-to-Have (Priority 3-4)

- **Large text mode** (scale root font-size by 125% and 150%)
- **Focus/reading mode** (hide sidebar, reduce visual clutter)
- Manual **reduced motion toggle** (supplement the existing CSS media query)
- **Colour-blind safe** colour scheme option

### Not Recommended

- Building or adopting a full accessibility overlay widget (these are controversial in the accessibility community and often poorly implemented)
- Making medical claims about dyslexia font effectiveness
- Providing too many individual toggles (cognitive overload for the user; the combined mode approach is better)

---

## 7. Appendix: Quick Reference CSS Values

### Dyslexia-Friendly Mode — Complete CSS Override Set

```css
[data-a11y-mode="dyslexia"] {
  /* Typography */
  --font-sans: 'Atkinson Hyperlegible Next', ui-sans-serif, system-ui, sans-serif;
  letter-spacing: 0.05em;
  word-spacing: 0.16em;
  line-height: 1.8;
  font-weight: 500;

  /* Paragraph spacing */
  --a11y-paragraph-spacing: 1.5em;
}

/* Light theme + dyslexia */
:root[data-a11y-mode="dyslexia"] {
  --background: oklch(0.97 0.01 80);      /* Warm cream */
  --card: oklch(0.985 0.008 80);
  --foreground: oklch(0.15 0.01 60);      /* Warm near-black */
  --muted: oklch(0.94 0.01 80);
  --border: oklch(0.88 0.01 80);
}

/* Dark theme + dyslexia */
.dark[data-a11y-mode="dyslexia"] {
  --background: oklch(0.18 0.01 60);      /* Warm dark */
  --card: oklch(0.22 0.01 60);
  --foreground: oklch(0.92 0.008 80);     /* Warm light */
  --muted: oklch(0.28 0.01 60);
  --border: oklch(0.32 0.01 60);
}

/* OpenDyslexic override (when user specifically selects it) */
[data-a11y-font="opendyslexic"] {
  --font-sans: 'OpenDyslexic', ui-sans-serif, system-ui, sans-serif;
  font-size-adjust: 0.5;  /* Normalise x-height to prevent layout breaking */
}
```

### WCAG Compliance Checklist

| Criterion | Requirement | Dyslexia Mode Meets? |
|-----------|-------------|---------------------|
| 1.4.3 Contrast (AA) | 4.5:1 normal, 3:1 large | Check with warm colours |
| 1.4.4 Resize Text (AA) | 200% without loss | Must test |
| 1.4.8 Visual Presentation (AAA) | <=80ch, 1.5 leading, no justify, user colours | Yes |
| 1.4.12 Text Spacing (AA) | line-height 1.5x, letter 0.12em, word 0.16em, para 2em | Yes |
| 1.4.13 Content on Hover (AA) | Dismissible, hoverable, persistent | N/A (no change) |

---

*Research compiled 16 February 2026. Sources span 2012-2026 with emphasis on 2024-2026 findings where available.*
