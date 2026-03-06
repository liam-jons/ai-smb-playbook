# Continuation Prompt 40: TOC Navigation, Readability Polish & Cleanup

## Context

This is the AI SMB Playbook — a reusable React application providing interactive Claude AI guidance for UK-based SMBs. Multi-tenant SPA deployed on Vercel. Two outputs per client:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

**Read first:** `docs/reference/application-overview.md` — architecture, content model, parameterisation, and client onboarding steps.
**CLAUDE.md** is at repo root with critical rules (UK English, copy-to-clipboard on every prompt, two-track content, never import site.ts directly).

**Current deployment:** AMD Group (general-track only, `hasDeveloperTrack: false`)
**Production URL:** `https://ai-smb-playbook.vercel.app/?client=amd`
**Local dev URL:** `http://localhost:4100/?client=amd`

**Note:** WellBeing People onboarding is handled in a separate session — see `docs/continuation-prompts/continuation-prompt-39-wellbeing-people-onboarding.md`.

---

## Completed Work

### Sessions 1–36 — Complete
Full application build, multi-tenant config system, 17 content sections across two tracks, client onboarding skill, playbook-review skill, AMD client config with overlays. See `.planning/` for full history.

### Session 37 (Playbook Review Skill Testing) — Complete
Playbook-review skill v1.1 tested against AMD config. GO verdict. Generic section fixes applied.

### Session 38 (AMD Final Readiness) — Complete
Fixed 3 original bugs + 6 audit findings + readability improvements:

| Fix | Files Changed |
|-----|--------------|
| AMD logo: created `amd-light.webp` with dark bg + padding, configured light/dark variants | `amd.json`, `ClientLogo.tsx`, `amd-light.webp` (new) |
| Query param persistence via sessionStorage in AppLayout | `AppLayout.tsx` |
| 404 page renders for invalid track paths (was redirecting silently) | `TrackLayout.tsx` |
| "For developers" callout gated by `hasDeveloperTrack` | `ReliableOutputSection.tsx` |
| Combined Approach prompt parameterised with `primaryProduct` | `ReliableOutputSection.tsx` |
| Homepage CTA separated from description for visual hierarchy | `HomePage.tsx` |
| Starter kit descriptions rewritten for general audience (removed TDD jargon) | `starter-kit-data.ts` |
| Unicode escapes replaced with UTF-8 in client JSON files | `phew.json`, `_template.json` |
| Welcome page em dash rendering fix (literal `\u2014` in JSX) | `WelcomeSection.tsx` |
| ROI section spacing: `space-y-6` → `space-y-12`, heading gaps `mb-1` → `mb-2` | `RoiMeasurementSection.tsx` |
| Session Management separator spacing: removed `my-2` overrides | `SessionManagementSection.tsx` |
| Context section callout card gaps: `mt-4` → `mt-6` | `ContextSimulatorSection.tsx` |
| Brand voice callout spacing and dev instructions margin | `BrandVoiceSection.tsx` |
| Starter kit step description gap: `mt-0.5` → `mt-1` | `StarterKitSection.tsx` |
| Logo checklist added to playbook-review and client-onboarding skills | `review-checklist.md`, `validation-checklist.md` |
| `ClientLogo` img gets `rounded-lg` for polished presentation | `ClientLogo.tsx` |

### Build Status
- `cd app && bun run build` — clean
- `cd app && bun run lint` — clean
- `cd app && bun run format:check` — clean

---

## What This Session Does: TOC Navigation, Readability Polish & Cleanup

### Task 1: Add "On this page" TOC Navigation to 3 Pages (MUST)

**Spec:** `.planning/plan-files/toc-navigation-spec.md` — read this first, it contains the full implementation plan with exact section headings, anchor IDs, insertion points, and edge cases.

Three long content pages lack the "On this page" table-of-contents navigation that other pages have:

1. **AI Governance Policy** (`app/src/content/general/GovernancePolicySection.tsx`) — 8 TOC entries, 2 track-conditional
2. **Recurring & Scheduled Tasks** (`app/src/content/general/RecurringTasksSection.tsx`) — 5 TOC entries, simplest case
3. **Measuring AI ROI** (`app/src/content/general/RoiMeasurementSection.tsx`) — 8 TOC entries, 1 dev-only

The existing TOC pattern is a `<nav aria-label="Page contents">` with a heading and `<ul>` of anchor links. See `ContextSimulatorSection.tsx`, `BrandVoiceSection.tsx`, or `ReliableOutputSection.tsx` for working examples.

**Approach:** Implement the TOC directly in each file following the existing pattern. Consider extracting a shared `<TableOfContents>` component as a follow-up if the pattern proves consistent enough.

**Verify:** Each page should show a clickable TOC below the subtitle. Anchor links should scroll to the correct section. Track-conditional entries should appear/disappear based on `hasDeveloperTrack`.

### Task 2: Deferred Readability Items (MUST)

Items identified during Session 38 audits but deferred:

| Item | File | Issue |
|------|------|-------|
| Governance `{{TEAM_SIZE}}` placeholder | `GovernancePolicySection.tsx` | Example hardcoded as "10" instead of deriving from config `teamSize` |
| SkillsExtensions introduction | `SkillsExtensionsSection.tsx` | Introduction section flows from TOC into body text without a heading — consider adding one for visual hierarchy |

### Task 3: Clean Up Audit Screenshots (MUST)

Session 38's parallel audit agents left ~30 screenshot `.png` files in the repo root. These are untracked and should be deleted:
```bash
rm -f amd-*.png brand-voice-*.png homepage-amd.png roi-*.png starterkit-*.png
```

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar. Use £ not $.
- **Never import `site.ts` directly in components.** Use context hooks: `useSiteConfig()`, `useOverlays()`, etc.
- **Copy-to-clipboard on every prompt/template.** Every copyable code block, prompt, or template must have a copy button.
- **Two-track content.** General track (non-technical) and Developer track (technical depth). Gate developer content behind `hasDeveloperTrack`.
- **Tailwind v4 — no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`.
- **Client JSON is source of truth.** To configure a new client, create `app/public/clients/<slug>.json`. Don't edit `site.ts`.
- **localStorage caches client config for 1 hour.** Clear `playbook-client-config-<slug>` when testing config changes.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Deployment

- **Production:** https://ai-smb-playbook.vercel.app
- **GitHub:** https://github.com/liam-jons/ai-smb-playbook
- Auto-deploys on push to `main` via Vercel

## Verification After This Session

- [ ] All 3 TOC navigations render correctly with working anchor links
- [ ] Track-conditional TOC entries hidden/shown appropriately
- [ ] Governance `{{TEAM_SIZE}}` placeholder uses config value
- [ ] SkillsExtensions introduction has improved visual hierarchy
- [ ] Audit screenshots cleaned from repo root
- [ ] `bun run build && bun run lint && bun run format:check` all clean

## Documents to Read Before Starting

| Document | Purpose |
|----------|---------|
| `.planning/plan-files/toc-navigation-spec.md` | Full implementation spec for TOC navigation (Task 1) |
| `docs/reference/application-overview.md` | Architecture and content model reference |
