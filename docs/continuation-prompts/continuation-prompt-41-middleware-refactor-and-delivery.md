# Continuation Prompt 41: Middleware, TOC Refactor, UX Onboarding & Delivery

## Context

This is the AI SMB Playbook — a reusable React application providing interactive Claude AI guidance for UK-based SMBs. Multi-tenant SPA deployed on Vercel. Two outputs per client:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

**Read first:** `docs/reference/application-overview.md` — architecture, content model, parameterisation, and client onboarding steps.
**CLAUDE.md** is at repo root with critical rules (UK English, copy-to-clipboard on every prompt, two-track content, never import site.ts directly).

**Current deployment:** AMD Group (general-track only, `hasDeveloperTrack: false`)
**Production URL:** `https://ai-smb-playbook.vercel.app/?client=amd`
**Local dev URL:** `http://localhost:4100/?client=amd`

**Note:** WellBeing People onboarding and browser verification are handled in separate sessions.

---

## Completed Work

### Sessions 1–39 — Complete
Full application build, multi-tenant config system, 17 content sections across two tracks, client onboarding skill, playbook-review skill, AMD client config with overlays. See `.planning/` for full history.

### Session 40 (TOC, Readability, Sidebar) — Complete

| Fix | Files Changed |
|-----|--------------|
| TOC navigation added to GovernancePolicySection (8 entries, track-conditional) | `GovernancePolicySection.tsx` |
| TOC navigation added to RecurringTasksSection (5 entries) | `RecurringTasksSection.tsx` |
| TOC navigation added to RoiMeasurementSection (8 entries, dev-conditional) | `RoiMeasurementSection.tsx` |
| `{{TEAM_SIZE}}` placeholder uses `config.teamSize` instead of hardcoded "10" | `GovernancePolicySection.tsx` |
| Introduction heading added to SkillsExtensionsSection | `SkillsExtensionsSection.tsx` |
| Sidebar tooltip: CSS truncation + Radix tooltip in expanded mode | `Sidebar.tsx` |
| Backlog audit: 20/22 items confirmed fixed, 1 partially fixed (E2 — now done), 1 needs browser check (0.1) | Audit only |

### Build Status
- `cd app && bun run build` — clean
- `cd app && bun run lint` — clean
- `cd app && bun run format:check` — clean

---

## What This Session Does

### Task 1: Implement Vercel Routing Middleware (HIGH PRIORITY)

**Spec:** `.planning/plan-files/vercel-middleware-spec.md` — read this first, it contains the complete implementation plan.

Client JSON config files are currently publicly accessible static assets. Any user can access any client's config by changing the URL. This must be fixed before delivering to more clients.

**Implementation steps:**
1. Create `app/middleware.ts` — Vercel Routing Middleware that restricts `/clients/*.json` access
2. Create `app/tsconfig.middleware.json` + update `app/tsconfig.json` references
3. Modify `app/src/config/config-loader.ts` — forward `?client=` param on fetch URL so middleware can verify
4. Test locally with `bunx vercel dev`
5. Test on Vercel preview deployment before merging

**Key rules from the spec:**
- Logo files (`/clients/logos/*`) always pass through
- `_template.json` blocked outside localhost
- Subdomain requests only access their own config
- Non-subdomain requests require `?client=` param matching the requested slug
- Return 404 (not 403) for blocked requests
- Localhost is always whitelisted

**Verify:** All scenarios in Section 10 of the spec pass. SPA loads correctly on all environments.

### Task 2: TOC Component Extraction Refactor (MEDIUM)

**Plan:** `.planning/plan-files/toc-extraction-plan.md` — read this first.

10 section pages have copy-pasted TOC markup. Extract into a shared `<TableOfContents>` component at `app/src/components/content/TableOfContents.tsx`.

**Implementation steps:**
1. Create the shared component (interface: `entries: TocEntry[], className?: string`)
2. Update 7 Variant A files (mechanical: import + replace inline nav block)
3. Update 2 Variant B files (build entries array + replace, normalise styling)
4. Verify all 10 pages render correctly

### Task 3: First-Time User Experience Improvements (MEDIUM)

Run `/frontend-design:onboard` targeting the Welcome page and Homepage to get structured recommendations, then implement the highest-impact items identified in Session 40's analysis:

**Quick wins (low effort, high impact):**
- **4c:** Elevate Quick Wins on Welcome page — move above "How to Use This Playbook" section
- **4g:** Make Welcome page work without training context — conditional opening paragraph when `trainingDate` is empty/default
- **4a:** Add track decision context to homepage — 2-sentence explanation + time estimate + "Not sure? Start with General Users"
- **4h:** Add recommended path for newcomers — suggest 3 sections to start with

**Medium effort:**
- **4b:** First-run detection via localStorage — orientation banner on first visit, "continue where you left off" for returning users
- **4d:** Visited-state indicators in sidebar — localStorage-tracked checkmarks

**Reference:** Session 40's onboard analysis identified 8 gaps (4a-4h). The `/frontend-design:onboard` command at `.claude/commands/frontend-design/onboard.md` provides the methodology.

### Task 4: Delivery Assets (SHOULD)

Create assets for post-training playbook delivery to clients:

1. **Branded PDF one-pager** — "Your AI Playbook Access" with:
   - Client logo and company name
   - Playbook URL as readable plain text (survives email Safe Links rewriting)
   - QR code linking to the playbook URL
   - Brief "Getting Started" instructions (3-4 bullet points)
   - Consultant contact details

2. **Email template** — plain text / minimal HTML follow-up email template referencing the training session

**Reference:** Existing client report PDF at `can-i-ai-this/docs/client/client-report.pdf` and its HTML source for design inspiration. Training PDFs at `aisolutionhub-v2/training/` for brand reference.

**Email configuration:**
- Current Resend setup uses `feedback.aisolutionhub.co.uk` subdomain for the feedback widget
- Main AI Solution Hub uses `hello@aisolutionhub.co.uk`, `no-reply@`, `updates@`
- For playbook delivery, consider a new sender like `training@aisolutionhub.co.uk` or `playbook@aisolutionhub.co.uk`
- Verify SPF/DKIM/DMARC for `aisolutionhub.co.uk` via MXToolbox or Resend dashboard

### Task 5: Homepage Scroll Check (QUICK)

Backlog item 0.1: verify whether the homepage requires scrolling at 1280x800 with a client config active. Use browser agent to check. If scroll exists, adjust padding/spacing.

---

## Remaining Backlog (Not for This Session)

These are tracked but handled separately:

- **WellBeing People onboarding** — separate session (see `continuation-prompt-39`)
- **Borough Engineering onboarding** — pending (website was down, needs consultant input)
- **Browser verification pass (Group F)** — separate session after all changes are in
- **Future enhancement:** Add `companyShortName` to generic section examples for personalisation

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar. Use £ not $.
- **Never import `site.ts` directly in components.** Use context hooks: `useSiteConfig()`, `useOverlays()`, etc.
- **Copy-to-clipboard on every prompt/template.** Every copyable code block, prompt, or template must have a copy button.
- **Two-track content.** General track (non-technical) and Developer track (technical depth). Gate developer content behind `hasDeveloperTrack`.
- **Tailwind v4 — no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`.
- **Client JSON is source of truth.** To configure a new client, create `app/public/clients/<slug>.json`. Don't edit `site.ts`.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
cd app && bunx vercel dev      # Vercel dev server (tests middleware)
```

## Deployment

- **Production:** https://ai-smb-playbook.vercel.app
- **GitHub:** https://github.com/liam-jons/ai-smb-playbook
- Auto-deploys on push to `main` via Vercel

## Verification After This Session

- [ ] Vercel middleware blocks cross-client config access
- [ ] Middleware allows legitimate config fetches on all environments
- [ ] `_template.json` blocked in production, accessible on localhost
- [ ] Logo files always accessible
- [ ] TOC markup extracted to shared `<TableOfContents>` component across all 10 pages
- [ ] All TOC pages render correctly with working anchor links
- [ ] Welcome page Quick Wins elevated for faster time-to-value
- [ ] Welcome page works for cold visitors (no training context)
- [ ] Homepage provides track decision context
- [ ] Branded PDF one-pager created for client delivery
- [ ] Homepage scroll at 1280x800 verified
- [ ] `bun run build && bun run lint && bun run format:check` all clean

## Documents to Read Before Starting

| Document | Purpose |
|----------|---------|
| `.planning/plan-files/vercel-middleware-spec.md` | Full middleware implementation spec (Task 1) |
| `.planning/plan-files/toc-extraction-plan.md` | TOC refactor plan (Task 2) |
| `.claude/commands/frontend-design/onboard.md` | Onboarding design methodology (Task 3) |
| `docs/reference/application-overview.md` | Architecture and content model reference |
