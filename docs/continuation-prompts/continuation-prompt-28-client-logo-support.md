# Client Logo Support — Session Continuation Prompt

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients. Two outputs per client deployment:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

**Read first:** `CLAUDE.md` at the project root — conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Sessions 17–19: Multi-tenant implementation — Complete
Full multi-tenant architecture: client config schema, JSON loading, overlay consumption (brand voice, recurring tasks, ROI), section visibility gating, starter kit tier display. All in `app/src/config/`.

### Session 20a: Generic default config — Complete
`site.ts` updated with generic neutral defaults. `DEFAULT_CONFIG` has empty overlays and starterKit. All Phew-specific values moved to `phew.json`. Footer shows "Delivered by AI Solution Hub" with conditional "Built for {companyName}". Prose reviewed across 15+ files — all generic interpolation reads naturally. Both generic and Phew configurations browser-tested.

### Session 20: Cleanup and onboarding skill — Complete
Obsolete files removed, non-blocking audit concerns resolved (shared slug utility, feedback identifier, build validation). Client onboarding skill created.

### Build Status

- `cd app && bun run build` — pass
- `cd app && bun run lint` — pass
- `cd app && bun run format:check` — pass

---

## What This Session Does: Client Logo Support

Add optional client logo display to the playbook. When a client config includes logo fields, the logo appears in the home page hero area (matching the "Prepared for" pattern from the client report). When no logo is configured, the playbook falls back to the current text-only behaviour. This is a progressive enhancement — no client configs are required to change.

### Feasibility Assessment (from session 20a research)

The previous session concluded this is straightforward (30–60 min). Key findings:

- **Placement:** Home page hero area, below the subtitle — "Prepared for {logo}" pattern matching `docs/design/client-report.html`
- **Schema:** 4 optional fields on `siteConfig`
- **Component:** A `<ClientLogo>` component with dark-background container treatment
- **Dark mode:** Dual-asset approach (light logo + dark logo) for clean theme switching
- **Generic default:** No logo shown — text-only branding (current behaviour preserved)

---

### Task 1: Add logo fields to the client config schema

**File:** `app/src/config/client-config-schema.ts`

Add 4 optional fields to the `siteConfig` interface, grouped together with a comment:

```typescript
// Client branding (optional — text-only fallback when omitted)
clientLogoUrl?: string;          // Path to logo for light mode (e.g. "/clients/logos/acme-light.png")
clientLogoDarkUrl?: string;      // Path to logo for dark mode (optional — falls back to clientLogoUrl)
clientLogoAlt?: string;          // Alt text for the logo (e.g. "Acme Industries logo")
clientLogoMaxWidth?: number;     // Max width in pixels (default: 200, capped at 280)
```

Place these after the existing `welcomeSubtitle` field (end of the "Required" group), before the "Recommended" group.

**Why dual URLs instead of a `darkBg` boolean:** The client report uses a dark container to handle any logo on a light background — that works for print/static content. But in the playbook, clients may have proper transparent logos designed for each mode. The dual-URL approach is more flexible and avoids the dated look of wrapping every logo in a dark pill. If a client only provides `clientLogoUrl`, it's used in both modes.

### Task 2: Create the `<ClientLogo>` component

**File:** `app/src/components/content/ClientLogo.tsx` (new file)

A small, focused component that:

1. Reads `siteConfig` via `useSiteConfig()`
2. Returns `null` if `clientLogoUrl` is not set (graceful fallback)
3. Renders an `<img>` tag with:
   - `src` switched based on current theme (dark mode uses `clientLogoDarkUrl` if provided, otherwise `clientLogoUrl`)
   - `alt` from `clientLogoAlt` (default: `"{companyName} logo"`)
   - `max-width` from `clientLogoMaxWidth` (default: `200`, capped: `280`)
   - `height: auto` for aspect ratio preservation
   - CSS classes for clean presentation (no decorative container — let the logo speak for itself)
4. Uses the `useTheme` hook to detect dark mode for asset switching

**Design notes:**
- Keep it minimal — no decorative wrapping, borders, or backgrounds. The logo should sit cleanly in the hero area.
- The component should be importable by any layout component, though the initial placement is the home page only.
- Add `loading="eager"` since the logo is above the fold.
- Include `decoding="async"` for paint performance.

### Task 3: Integrate the logo into the home page hero

**File:** `app/src/components/layout/HomePage.tsx`

Add the `<ClientLogo>` component to the hero area. It should appear between the subtitle line ("Prepared by {consultantName}...") and the main heading, matching the visual hierarchy from the client report screenshot:

```
Prepared by Liam · 11 February 2026     ← existing subtitle
                                          ← logo appears here (when configured)
Your practical guide to working with...  ← existing heading
```

The pattern from the client report (`docs/design/Screenshot 2026-02-18 at 15.43.45.png`) shows:
- "Prepared for" label in muted text above the logo
- Client logo rendered below
- Clean spacing with `margin-top` / `margin-bottom`

**Conditional rendering:** Only show the "Prepared for" label + logo block when `clientLogoUrl` is present. When absent, the hero renders exactly as it does today — no layout shift, no empty space.

**Implementation detail:** The `<ClientLogo>` component returns `null` when no logo is configured, so wrapping it is safe. But the "Prepared for" label needs to be conditional too — wrap both in a container that checks `siteConfig.clientLogoUrl`.

### Task 4: Add Phew logo to the client assets

**Source file:** `docs/design/phew-logo-full-colour-rgb-1.webp` (3 KB, full-colour logo on transparent background — works on light backgrounds)

**Steps:**
1. Create the directory `app/public/clients/logos/` if it doesn't exist
2. Copy the Phew logo into it as `phew.webp` (or convert to PNG if broader compatibility is preferred — webp is fine for all modern browsers)
3. If a dark-mode variant is available or can be derived, add it as `phew-dark.webp`. If not, the single logo will be used for both modes (acceptable for Phew's logo which has sufficient contrast on both backgrounds)

**Assessment of the Phew logo:** The logo (`docs/design/phew-logo-full-colour-rgb-1.webp`) uses dark blue text ("Phew!") with a green underline on a transparent background. This works well on light backgrounds. On dark backgrounds, the blue text may have reduced contrast — check visually and decide whether a dark-mode variant is needed.

### Task 5: Update phew.json with logo config

**File:** `app/public/clients/phew.json`

Add the logo fields to the Phew client config:

```json
{
  "siteConfig": {
    ...existing fields...
    "clientLogoUrl": "/clients/logos/phew.webp",
    "clientLogoAlt": "Phew Design Limited logo",
    "clientLogoMaxWidth": 160
  }
}
```

Only add `clientLogoDarkUrl` if a dark variant was created in Task 4. The `maxWidth` of 160 is a suggested starting point — adjust based on visual testing (the Phew logo is a horizontal wordmark that reads well at this size).

### Task 6: Update the template and documentation

**Files:**
- `app/public/clients/_template.json` — Add the 4 optional logo fields with placeholder values
- `CUSTOMISATION.md` — Add a "Client Logo" section to the field reference documenting the new fields, asset storage conventions, and the dual-asset approach for dark mode

**Template additions:**
```json
{
  "siteConfig": {
    ...existing fields...
    "clientLogoUrl": "",
    "clientLogoDarkUrl": "",
    "clientLogoAlt": "[Company Name] logo",
    "clientLogoMaxWidth": 200
  }
}
```

**CUSTOMISATION.md section** (add after the "Required" fields table, or as a new subsection under "Recommended"):

Document:
- The 4 fields and their types/defaults
- Asset storage convention: `app/public/clients/logos/{slug}.{ext}`
- Supported formats (PNG, WebP, SVG — recommend SVG or WebP for quality + size)
- Dark mode handling: provide `clientLogoDarkUrl` for logos that need a different treatment, otherwise the single logo is used
- Max width guidance: 140–220px works well for most horizontal logos; the cap is 280px
- Alt text: always include for accessibility

### Task 7: Browser testing

Start the dev server and test all configurations:

1. **Generic default:** `http://localhost:4100` (no `?client=` param)
   - Confirm NO logo appears
   - Confirm no "Prepared for" label appears
   - Confirm hero layout is unchanged from current state
   - Confirm no layout shift or empty space where the logo would be

2. **Phew client:** `http://localhost:4100?client=phew`
   - Confirm "Prepared for" label appears in muted text
   - Confirm Phew logo renders below it
   - Confirm logo sizing is appropriate (not too large, not too small)
   - Confirm logo looks good in both light and dark mode
   - Toggle dark mode and verify the correct asset loads (or that the single logo has sufficient contrast)

3. **Responsive check:**
   - Confirm logo scales appropriately on mobile viewports
   - Confirm the hero area doesn't overflow or become cramped

---

## Design Reference Files

| File | Purpose |
|------|---------|
| `docs/design/phew-logo-full-colour-rgb-1.webp` | Phew Design logo — full colour, transparent background (3 KB) |
| `docs/design/aish-logo-light-no-icon.png` | AI Solution Hub wordmark (11 KB) — provider logo, not used in this task but available for future footer enhancement |
| `docs/design/AMD-Group-design-mep-facilities-management--215x57.png` | AMD Group logo (10 KB) — example of a logo that needs a dark container treatment |
| `docs/design/client-report.html` | HTML report with "Prepared for" logo pattern (lines 127–145 for CSS, lines 1390–1403 for markup) |
| `docs/design/Screenshot 2026-02-18 at 15.43.45.png` | Screenshot showing the report cover page layout — visual reference for the "Prepared for" pattern |

---

## Key Reference Files

| File | Purpose |
|------|---------|
| `app/src/config/client-config-schema.ts` | `ClientConfig` TypeScript interface (add logo fields here) |
| `app/src/config/site.ts` | Default siteConfig values (no changes needed — logo fields are optional) |
| `app/src/config/config-loader.ts` | `DEFAULT_CONFIG`, `loadClientConfig()`, `mergeWithDefaults()` (no changes needed — spread handles optional fields) |
| `app/src/hooks/useClientConfig.ts` | React hooks: `useSiteConfig()`, `useOverlays()`, `useSectionsConfig()` |
| `app/src/hooks/useTheme.ts` | Theme hook for dark mode detection |
| `app/src/components/layout/HomePage.tsx` | Home page hero area (primary integration point) |
| `app/src/components/layout/Footer.tsx` | Footer (reference for conditional `isGeneric` pattern) |
| `app/public/clients/phew.json` | Phew client config (add logo fields) |
| `app/public/clients/_template.json` | Template JSON (add logo field placeholders) |
| `CUSTOMISATION.md` | Client deployment guide (add logo documentation) |

---

## Key Conventions Reminder

- **UK English throughout.** All content, copy, and code comments use UK English spelling and grammar.
- **Build check after changes:** `cd app && bun run build` (TypeScript + Vite build). Also `bun run lint` and `bun run format:check`.
- **Tailwind v4 — no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`. Don't create a JS config file.
- **Path aliases:** `@/` maps to `app/src/`.
- **Component patterns:** App components in `components/layout/` and `components/content/`. The `<ClientLogo>` belongs in `components/content/` as it renders client-specific content.
- **Overlay fallback:** When `siteConfig` fields are absent or undefined, components should gracefully fall back. The logo component returns `null` when unconfigured.
- **No over-engineering.** The logo feature should be minimal — just the schema, component, and one integration point. Don't add a logo to the header, footer, or sidebar unless explicitly requested.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format       # Prettier — format all files
cd app && bun run format:check # Prettier — check without writing
```

## Verification After This Session

- [ ] `ClientConfig` schema includes 4 optional logo fields (`clientLogoUrl`, `clientLogoDarkUrl`, `clientLogoAlt`, `clientLogoMaxWidth`)
- [ ] `<ClientLogo>` component exists in `components/content/ClientLogo.tsx`
- [ ] Component returns `null` when no `clientLogoUrl` is set
- [ ] Component switches to dark URL in dark mode when `clientLogoDarkUrl` is provided
- [ ] Home page hero shows "Prepared for" + logo when `clientLogoUrl` is set
- [ ] Home page hero is unchanged when no logo is configured (generic default)
- [ ] Phew logo asset exists in `app/public/clients/logos/`
- [ ] `phew.json` includes logo fields
- [ ] `_template.json` includes logo field placeholders
- [ ] `CUSTOMISATION.md` documents the logo fields and asset conventions
- [ ] Build passes: `cd app && bun run build`
- [ ] Lint passes: `cd app && bun run lint`
- [ ] Format passes: `cd app && bun run format:check`
- [ ] Generic default (localhost, no client param): no logo, no empty space
- [ ] Phew client (localhost with `?client=phew`): logo visible, correct sizing
- [ ] Logo looks acceptable in both light and dark mode
- [ ] Logo scales appropriately on mobile viewports
