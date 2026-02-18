# Homepage Polish and Logo Dark Mode Fallback — Session Continuation Prompt

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients. Two outputs per client deployment:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

**Read first:** `CLAUDE.md` at the project root — conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Sessions 17–20: Multi-tenant architecture — Complete
Full multi-tenant system: client config schema, JSON loading, overlay consumption (brand voice, recurring tasks, ROI), section visibility gating, starter kit tier display. Generic default config with neutral values. Cleanup and onboarding skill.

### Session 28: Client logo support — Complete
Added 4 optional logo fields to `ClientConfig` schema (`clientLogoUrl`, `clientLogoDarkUrl`, `clientLogoAlt`, `clientLogoMaxWidth`). Created `<ClientLogo>` component with dark mode asset switching via `useTheme()`. Phew logo asset at `app/public/clients/logos/phew.webp`. Phew config and template updated. `CUSTOMISATION.md` documented.

### Session 28 (continued): Homepage cover page redesign — Complete
Transformed the homepage hero from a left-aligned flat layout into a centre-aligned three-zone cover page inspired by the client report design (`docs/design/client-report.html`):

- **Zone 1 — Provider branding:** AI Solution Hub logo (SVG, with dark mode variant) via new `<ProviderLogo>` component
- **Zone 2 — Document title:** Centred heading + "Prepared by {consultant} · {date}" credit line
- **Zone 3 — Client branding (conditional):** Thin divider + "Prepared for" label + `<ClientLogo>` — only renders when `clientLogoUrl` is configured
- **Header fix:** Nav links now truly centred using `flex-1` equal-width siblings instead of `justify-between`

### Key files created/modified this session:
| File | Change |
|------|--------|
| `app/src/config/client-config-schema.ts` | 4 optional logo fields added |
| `app/src/components/content/ClientLogo.tsx` | New — client logo with dark mode switching |
| `app/src/components/content/ProviderLogo.tsx` | New — AISH logo with dark mode switching |
| `app/src/components/layout/HomePage.tsx` | Restructured into three-zone cover page |
| `app/src/components/layout/Header.tsx` | Nav centring fix (`flex-1` siblings) |
| `app/public/branding/aish-logo-light.svg` | New — AI Solution Hub logo (charcoal + orange) |
| `app/public/branding/aish-logo-dark.svg` | New — AI Solution Hub logo (white + orange) |
| `app/public/clients/logos/phew.webp` | Copied from `docs/design/` |
| `app/public/clients/phew.json` | Logo fields added |
| `app/public/clients/_template.json` | Logo field placeholders |
| `CUSTOMISATION.md` | Client branding section added |

### Build Status
- `cd app && bun run build` — pass
- `cd app && bun run lint` — pass
- `cd app && bun run format:check` — pass

---

## What This Session Does: Homepage Polish and Logo Dark Mode Fallback

This session addresses the remaining items from the homepage redesign. The core layout is in place but needs spacing refinements and a universal solution for client logos in dark mode.

### Task 1: Dark mode logo container fallback (Must)

**Problem:** Most SMB clients won't have a dark-mode variant of their logo. The Phew logo (dark navy text on transparent) has poor contrast on dark backgrounds. The current `<ClientLogo>` component falls back to the light-mode logo when no `clientLogoDarkUrl` is provided — which looks bad in dark mode.

**Solution:** When `clientLogoDarkUrl` is absent, render the logo inside a subtle light container (similar to the AMD Group treatment in the client report). This ensures any single-asset logo remains visible in dark mode.

**Design reference:** The client report (`docs/design/client-report.html`, lines 139–145) uses this CSS for the AMD logo container:
```css
.client-branding img {
  max-width: 215px;
  height: auto;
  background-color: #1f2937;
  padding: 0.75em 1em;
  border-radius: 6px;
}
```

For the playbook, the approach should be **inverted** — a light container on dark backgrounds:
- In **light mode** (or when `clientLogoDarkUrl` IS provided): no container, logo renders directly
- In **dark mode** without a dark URL: wrap the logo in a subtle container (white/near-white background, small padding, rounded corners)
- The container should feel deliberate and professional, not like a hack

**File:** `app/src/components/content/ClientLogo.tsx`

**Implementation notes:**
- Use the existing `useTheme()` hook's `resolvedTheme` to detect dark mode
- Only add the container when `isDark && !siteConfig.clientLogoDarkUrl`
- Suggested container styles: `bg-white/95 rounded-md px-4 py-3` (test visually — may need adjustment)
- Consider whether the container should also have a very subtle border (`border border-border/10`) for definition

**Screenshot reference:** View `docs/design/Screenshot 2026-02-18 at 15.43.45.png` to see the AMD report cover page — the dark container around the AMD logo is the inverse of what we need.

### Task 2: Homepage spacing refinements (Should)

**Problem:** The cover page layout is functional but spacing needs visual tuning. The heading was reduced from `clamp(1.75rem, 4vw, 2.5rem)` to `clamp(1.5rem, 3.5vw, 2rem)` to fit above the fold — this may be too small. The overall vertical rhythm needs a visual review.

**What to assess:**
1. **Heading size** — is `clamp(1.5rem, 3.5vw, 2rem)` large enough for a cover page hero? The original was larger. Test both and decide.
2. **Zone spacing** — is the rhythm between provider logo → heading → credit → divider → client logo → description varied enough? Or does it feel uniform/cramped?
3. **Above-the-fold constraint** — at 1280x800 (standard laptop), do the track cards fully appear? This is the hard constraint.
4. **Description text** — is `text-base` the right size, or should it be `text-lg` as before?
5. **The subtle gradient background** — the previous layout had `bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent` on the hero container. The new layout removed it. Should a very subtle tint return to differentiate the hero zone?

**File:** `app/src/components/layout/HomePage.tsx`

**Approach:** Start the dev server, review at 1280x800 and 1440x900 (common viewport sizes), and iterate on spacing values. Use the 4pt grid (4, 8, 12, 16, 24, 32, 48, 64px) from the design guidelines (`docs/reference/frontend-skills-review.md`, section 3).

### Task 3: Track card rework exploration (Nice-to-have)

**Problem:** The two track cards take up significant vertical space due to the section preview lists inside them. This competes with the hero for above-the-fold real estate.

**Options to explore:**
1. **Compact cards** — remove or reduce the section preview lists, keep just the track title, description, section count badge, and "Explore track" CTA. This would roughly halve the card height.
2. **Horizontal layout** — instead of stacked cards, a more compact horizontal arrangement (side by side with less height)
3. **Button-style selectors** — replace cards entirely with prominent track selection buttons, moving the section previews to a secondary area or the track landing pages

**Constraint:** Whatever treatment is chosen, the cards must still clearly communicate:
- Track name (General Users / Developers)
- Brief description of who it's for
- That clicking enters that track
- Visual differentiation between the two tracks (currently blue accent vs violet accent)

**File:** `app/src/components/layout/HomePage.tsx`

**Note:** This is exploratory. If the spacing refinements in Task 2 solve the above-the-fold issue, this may not be needed. Assess after Task 2.

### Task 4: Header alignment visual verification (Should)

**Problem:** A `flex-1` fix was applied to centre the nav links in the header, but it hasn't been visually verified at multiple viewport widths.

**What to check:**
- At 1280px, 1440px, and 1920px widths: are "General Users" and "Developers" nav links visually centred relative to the content below?
- Does the app title on the left look natural (not pushed too far left by the flex-1 expansion)?
- On mobile (375px): does the header still work correctly? (The `flex-1` wrappers are `hidden md:flex`, so mobile shouldn't be affected — but verify)

**File:** `app/src/components/layout/Header.tsx` (only if adjustments needed)

### Task 5: AISH logo SVG quality check (Nice-to-have)

**Current state:** The AISH logo SVGs at `app/public/branding/` use `system-ui` font stack with `font-weight: 600` and `letter-spacing: 0.25em`. They're functional but may not precisely match the original raster logo at `docs/design/aish-logo-light-no-icon.png`.

**What to assess:**
- Compare the SVG rendering in the browser against the original PNG — does the font, weight, and spacing look close enough?
- If not, the user may provide replacement assets. Note any discrepancies for discussion.
- The SVGs use `text-anchor="middle"` and `x="50%"` for centring within the viewBox — verify this renders correctly across browsers

---

## Design Reference Files

| File | Purpose |
|------|---------|
| `docs/design/client-report.html` | HTML report with logo container CSS (lines 127–145) and cover page markup (lines 1390–1403). Key reference for the dark container treatment and the overall cover page aesthetic. |
| `docs/design/Screenshot 2026-02-18 at 15.43.45.png` | Screenshot of the report cover page — shows the "Prepared for" + AMD logo in dark container pattern |
| `docs/design/AMD-Group-design-mep-facilities-management--215x57.png` | AMD Group logo (10 KB) — example of a logo that needs a container treatment |
| `docs/design/phew-logo-full-colour-rgb-1.webp` | Phew Design logo (3 KB) — dark navy text, poor dark mode contrast |
| `docs/design/aish-logo-light-no-icon.png` | Original AISH raster logo — reference for SVG quality comparison |
| `docs/reference/frontend-skills-review.md` | Design guidelines — typography, colour, spacing, motion standards |

## Key Reference Files

| File | Purpose |
|------|---------|
| `app/src/components/layout/HomePage.tsx` | Homepage — primary file for Tasks 2 and 3 |
| `app/src/components/content/ClientLogo.tsx` | Client logo component — primary file for Task 1 |
| `app/src/components/content/ProviderLogo.tsx` | AISH provider logo component — reference for Task 5 |
| `app/src/components/layout/Header.tsx` | Header — file for Task 4 verification |
| `app/src/hooks/useTheme.ts` | Theme hook — `resolvedTheme` for dark mode detection |
| `app/src/hooks/useClientConfig.ts` | Config hooks — `useSiteConfig()` |
| `app/src/config/client-config-schema.ts` | ClientConfig interface with logo fields |
| `app/public/branding/aish-logo-light.svg` | AISH logo light variant (SVG) |
| `app/public/branding/aish-logo-dark.svg` | AISH logo dark variant (SVG) |
| `app/public/clients/phew.json` | Phew client config (has `clientLogoUrl` but no `clientLogoDarkUrl`) |

---

## Key Conventions Reminder

- **UK English throughout.** All content, copy, and code comments use UK English spelling and grammar.
- **Build check after changes:** `cd app && bun run build` (TypeScript + Vite build). Also `bun run lint` and `bun run format:check`.
- **Tailwind v4 — no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`. Don't create a JS config file.
- **Path aliases:** `@/` maps to `app/src/`.
- **Component patterns:** App components in `components/layout/` and `components/content/`.
- **Config access:** Always use React context hooks (`useSiteConfig()`, `useOverlays()`) — never import `site.ts` directly in components.
- **No over-engineering.** Keep changes minimal and focused. Don't add features beyond what's specified.
- **Design principles:** Clarity over cleverness. Hierarchy through restraint. Respect the audience. See `docs/reference/frontend-skills-review.md` for the full guidelines.
- **Logo file format preference:** SVG (ideal for logos — scalable, tiny, themeable). PNG for raster logos when SVG isn't available. WebP is better for photographs than logos.

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

- [ ] `<ClientLogo>` renders inside a light container in dark mode when no `clientLogoDarkUrl` is provided
- [ ] Container looks professional — not a hack, not a heavy border, just a subtle light background
- [ ] In light mode, no container is shown (logo renders directly)
- [ ] When `clientLogoDarkUrl` IS provided, no container is shown in either mode
- [ ] Homepage spacing feels balanced and rhythmic at 1280x800
- [ ] Track cards are fully visible above the fold at 1280x800
- [ ] Heading size feels appropriate for a cover page hero
- [ ] Header nav links are visually centred at common viewport widths
- [ ] AISH SVG logos render cleanly (centred text, correct colours, appropriate sizing)
- [ ] Build passes: `cd app && bun run build`
- [ ] Lint passes: `cd app && bun run lint`
- [ ] Format passes: `cd app && bun run format:check`
- [ ] Generic default (no client): AISH logo, no client zone, clean layout
- [ ] Phew client: AISH logo + divider + "Prepared for" + Phew logo, both light and dark mode
- [ ] Mobile (375px): layout stacks correctly, logos scale appropriately
