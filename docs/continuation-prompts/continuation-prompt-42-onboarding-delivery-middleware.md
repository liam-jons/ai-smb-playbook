# Continuation Prompt 42: Onboarding UX, Delivery Assets & Middleware Verification

## Context

This is the AI SMB Playbook -- a reusable React application providing interactive Claude AI guidance for UK-based SMBs. Multi-tenant SPA deployed on Vercel. Two outputs per client:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy

**Read first:** `.planning/plan-files/onboarding-ux-spec.md` -- the complete onboarding implementation spec (Task 1, this session's primary work).
**CLAUDE.md** is at repo root with critical rules (UK English, copy-to-clipboard on every prompt, two-track content, never import site.ts directly).

**Current deployment:** AMD Group (general-track only, `hasDeveloperTrack: false`)
**Production URL:** `https://ai-smb-playbook.vercel.app/?client=amd`
**Local dev URL:** `http://localhost:4100/?client=amd`

---

## Completed Work

### Sessions 1-39 -- Complete
Full application build, multi-tenant config system, 17 content sections across two tracks, client onboarding skill, playbook-review skill, AMD client config with overlays. See `.planning/` for full history.

### Session 40 (TOC, Readability, Sidebar) -- Complete
TOC navigation added to 3 pages, readability fixes, sidebar tooltip improvements.

### Session 41 (Middleware, TOC Refactor, UX) -- Complete

| Task | Files Changed | Status |
|------|--------------|--------|
| Vercel Edge Middleware -- restricts `/clients/*.json` access per-client | `app/middleware.ts` (new), `app/tsconfig.middleware.json` (new), `app/tsconfig.json`, `app/src/config/config-loader.ts` | Deployed, needs verification |
| TOC component extraction -- shared `<TableOfContents>` across 9 section pages | `TableOfContents.tsx` (new), 7 general sections, 2 developer sections | Complete |
| Welcome page Quick Wins elevated above "How to Use" | `WelcomeSection.tsx` | Complete |
| Welcome page conditional intro (training date aware) | `WelcomeSection.tsx` | Complete |
| Homepage track decision context + "Not sure? Start with General Users" | `HomePage.tsx` | Complete |
| Recommended starting path (3 track-aware sections) on Welcome page | `WelcomeSection.tsx` | Complete |
| Homepage scroll tightened at 1280x800 -- hero fits viewport | `HomePage.tsx` | Complete |
| Client report PDF/HTML copied to `docs/reference/delivery-assets/` | Reference files for Task 3 | Complete |
| Onboarding UX spec created | `.planning/plan-files/onboarding-ux-spec.md` | Spec complete |

### Build Status
- `cd app && bun run build` -- clean
- `cd app && bun run lint` -- clean
- `cd app && bun run format:check` -- clean

---

## What This Session Does

### Task 1: Onboarding UX Implementation (PRIMARY -- use agents)

**Spec:** `.planning/plan-files/onboarding-ux-spec.md` -- read this first. It contains the complete implementation plan with component architecture, localStorage schema, visual design, accessibility requirements, and 4-wave implementation sequence.

**Summary of features to build:**

1. **`useVisitedSections` hook** -- localStorage-backed tracking of which sections the user has visited. SSR-safe, try/catch wrapped. Keys: `playbook-visited-sections` (JSON array of slugs), `playbook-first-visit-ts` (ISO timestamp).

2. **Section visit tracking in TrackLayout** -- call `markVisited(slug)` with a 3-second delay on section mount (prevents drive-by marking from fast navigation). Set `playbook-first-visit-ts` on first visit.

3. **Sidebar visited indicators** -- small check icon (Lucide `Check`, 12px) next to visited sections in the sidebar. `text-muted-foreground/50`, `aria-hidden="true"`. Fade-in animation on first mark.

4. **Progress Summary card** -- new component at `app/src/components/content/ProgressSummary.tsx`. Shows visited count, thin progress bar, and "Continue with: [next unvisited section]" link. Only rendered for returning visitors (1+ visited sections).

5. **Welcome page conditional content** -- First-run vs returning user differentiation:
   - Returning: show Progress Summary instead of "Recommended Starting Path"
   - Returning: collapse "How to Use This Playbook" (Radix Collapsible, default closed)
   - Returning: "Welcome back to the General Users Guide" heading
   - Always: collapse "How This Playbook Was Built" (Collapsible, default closed)
   - Always: time estimates on Quick Win cards (`~1 min`, `~2 min`, `~5 min`)

**Agent allocation (4 waves):**

| Wave | Agent | Responsibility | Files Owned |
|------|-------|---------------|-------------|
| 1A | Hook agent | Create `useVisitedSections.ts` hook | `app/src/hooks/useVisitedSections.ts` (new) |
| 1B | Tracking agent | Add visit marking to TrackLayout | `app/src/components/layout/TrackLayout.tsx` |
| 2A | Sidebar agent | Add visited check icons | `app/src/components/layout/Sidebar.tsx` |
| 2B | Progress agent | Create ProgressSummary component | `app/src/components/content/ProgressSummary.tsx` (new) |
| 3 | Welcome agent | Conditional content, collapsibles, time estimates | `app/src/content/shared/WelcomeSection.tsx` |
| 4 | Verification | Build + browser check | All files |

**Dependencies:** Wave 2 depends on Wave 1 (hook must exist). Wave 3 depends on Waves 1+2 (uses hook + ProgressSummary). Wave 4 is final verification.

### Task 2: Middleware Verification (MUST)

The Vercel Edge Middleware deployed in Session 41 needs verification on the live production URL. Test the scenarios from the spec (`.planning/plan-files/vercel-middleware-spec.md`, Section 10):

**Production tests (use browser agent or curl):**
- `https://ai-smb-playbook.vercel.app/clients/amd.json?client=amd` -- should serve (200)
- `https://ai-smb-playbook.vercel.app/clients/amd.json` -- should 404 (no param)
- `https://ai-smb-playbook.vercel.app/clients/phew.json?client=amd` -- should 404 (mismatch)
- `https://ai-smb-playbook.vercel.app/clients/_template.json` -- should 404
- `https://ai-smb-playbook.vercel.app/clients/logos/amd-logo.webp` -- should serve (logos always pass)
- `https://ai-smb-playbook.vercel.app/?client=amd` -- SPA should load correctly with AMD config

If any test fails, fix the middleware and redeploy.

### Task 3: Delivery Assets (SHOULD)

Create assets for post-training playbook delivery to clients. Reference the example at `docs/reference/delivery-assets/client-report-example.html` for design inspiration.

**3a. Branded PDF one-pager** -- "Your AI Playbook Access":
- Client logo and company name (parameterised)
- Playbook URL as readable plain text (survives email Safe Links rewriting)
- QR code linking to the playbook URL
- Brief "Getting Started" instructions (3-4 bullet points)
- Consultant contact details
- Clean, professional design matching the playbook aesthetic

**3b. Email template** -- plain text / minimal HTML follow-up email:
- References the training session
- Links to the playbook
- Mentions the starter kit
- Consultant signature

**Resend configuration (from the-ai-solution-hub repo):**
- Domain `aisolutionhub.co.uk` is verified in Resend
- Existing senders: `hello@`, `admin@`, `updates@updates.`, `feedback@feedback.`
- For playbook delivery, use a new sender like `training@aisolutionhub.co.uk`
- SPF/DKIM/DMARC should already be configured for the root domain

---

## Remaining Backlog (Not for This Session)

- **WellBeing People onboarding** -- separate session (see `continuation-prompt-39`)
- **Borough Engineering onboarding** -- pending (website was down, needs consultant input)
- **Browser verification pass (Group F)** -- separate session after all changes are in
- **Future enhancement:** Add `companyShortName` to generic section examples for personalisation

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar. Use £ not $.
- **Never import `site.ts` directly in components.** Use context hooks: `useSiteConfig()`, `useOverlays()`, etc.
- **Copy-to-clipboard on every prompt/template.** Every copyable code block, prompt, or template must have a copy button.
- **Two-track content.** General track (non-technical) and Developer track (technical depth). Gate developer content behind `hasDeveloperTrack`.
- **Tailwind v4 -- no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`.
- **Client JSON is source of truth.** To configure a new client, create `app/public/clients/<slug>.json`. Don't edit `site.ts`.
- **localStorage keys prefixed with `playbook-`** to avoid collision with existing `playbook-client-config-*` cache keys.

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

- [ ] `useVisitedSections` hook tracks visits in localStorage correctly
- [ ] Sections marked as visited after 3-second delay, not on immediate navigation
- [ ] Sidebar shows check icons next to visited sections
- [ ] Progress Summary card shows correct count and "Continue with" link
- [ ] First visit shows "Recommended Starting Path" (no progress card)
- [ ] Return visit shows Progress Summary + collapsed "How to Use"
- [ ] "Welcome back" heading appears for returning users
- [ ] Quick Win cards show time estimates
- [ ] "How This Playbook Was Built" is collapsible, default closed
- [ ] All features degrade gracefully if localStorage unavailable
- [ ] Middleware blocks cross-client config access on production
- [ ] Middleware allows legitimate config fetches with `?client=` param
- [ ] SPA loads correctly on production with `?client=amd`
- [ ] Branded PDF one-pager created for client delivery
- [ ] `bun run build && bun run lint && bun run format:check` all clean

## Documents to Read Before Starting

| Document | Purpose |
|----------|---------|
| `.planning/plan-files/onboarding-ux-spec.md` | Full onboarding implementation spec (Task 1) |
| `.planning/plan-files/vercel-middleware-spec.md` | Middleware spec with test scenarios (Task 2) |
| `docs/reference/delivery-assets/client-report-example.html` | Design reference for PDF one-pager (Task 3) |
| `docs/reference/application-overview.md` | Architecture and content model reference |
