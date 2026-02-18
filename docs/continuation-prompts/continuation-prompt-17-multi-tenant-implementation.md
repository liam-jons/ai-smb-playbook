# Continuation Prompt 17 — Multi-Tenant Implementation: Plan to Spec & Execution

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. Three outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** -- Internal process documentation

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## What This Session Does

Convert the confirmed implementation plan at `.planning/plan-files/reusability-implementation-plan.md` into executable specifications and begin implementation. The plan defines 6 phases for transforming the app from a single-client deployment into a multi-tenant runtime architecture (Option C: single Vite SPA + runtime JSON config per client + Vercel Routing Middleware).

**This session's goals:**
1. Read the implementation plan and understand the phase structure
2. Convert phases into executable specs with file-level detail
3. Begin implementation, parallelising where dependencies allow

**Implementation approach:** Phases 0 and 3 are independent and can run in parallel. Phases 1 -> 2 -> 4 -> 5 are sequential. Use parallel sub-agents or agent teams to maximise throughput.

---

## Previous Session Summary (Session 16)

### What Was Accomplished
- **Revised implementation plan COMPLETE** at `.planning/plan-files/reusability-implementation-plan.md`
  - Replaced fork-and-customise approach with Option C architecture
  - 6 phases, ~29-43 hours total estimated effort
  - Full file-by-file change lists, JSON schema, cost projections
- **Phase 0 Quick Wins IN PROGRESS** (two agents were running at session end):
  - Agent 1: 18 Category C genericisations (replacing `siteConfig.companyShortName`/`companyName` with generic language across 8 files)
  - Agent 2: Process route removal (4 files) + starter kit genericisation (3 files)
  - **CHECK STATUS:** These agents may have completed. Verify by:
    1. `cd app && bun run build` -- if it passes, Phase 0 is likely done
    2. `grep -r "siteConfig.companyShortName" app/src/content/developer/` -- should return 0 results if Category C is done
    3. `grep -r "ProcessDocPage" app/src/` -- should return 0 results if process route removed
    4. `grep -r "Phew!" starter-kit/` -- should return 0 results if starter kit fixed
    5. Check `git diff --stat` for the changes made

### All Confirmed Decisions (do not re-evaluate)

| Decision | Detail |
|----------|--------|
| **Architecture** | Option C: single Vite SPA + runtime JSON config + Vercel Routing Middleware. No Next.js migration. |
| **Content authoring** | JSON config files created by consultant after training. Not a CMS. |
| **LLM-agnostic** | Soft yes -- use "your AI tool" where natural, but no mass replacement. Claude remains primary. |
| **Developer track** | `hasDeveloperTrack` flag gates the entire developer track per client. |
| **Starter kit** | Base set for all clients + custom additions per engagement. `tier` and `customCategory` fields. |
| **Governance** | Separate concern. Not part of the multi-tenant work. |
| **Database** | Turso available if needed later. Not required initially. |
| **Client JSON storage** | Start with `public/clients/` in repo. Migrate to Vercel Blob later. |

---

## Phase Structure and Parallelisation Strategy

```
Phase 0 (Quick Wins) -- likely DONE from previous session
  ├──→ Phase 1 (Content Extraction) ──→ Phase 2 (Config Provider) ──→ Phase 4 (Middleware)
  └──→ Phase 3 (Dev Track Content)                                        │
                                                                          ▼
                                                                    Phase 5 (Docs)
```

### Recommended Parallelisation

**Wave 1 (if Phase 0 not complete):** Finish Phase 0 quick wins

**Wave 2 (parallel):**
- **Agent/Team A:** Phase 1 (Content Extraction to JSON) + Phase 2 (Client Config Provider) -- these are sequential but handled by one agent
- **Agent/Team B:** Phase 3 (Developer Track Content Extraction) -- independent of Phases 1-2

**Wave 3:**
- Phase 4 (Routing Middleware) -- depends on Phase 2 completion

**Wave 4:**
- Phase 5 (Documentation) -- depends on everything else

### Phase Summary

| Phase | Name | Effort | Status |
|-------|------|--------|--------|
| 0 | Quick Wins (genericisation, cleanup) | 3-4 hrs | **CHECK** -- agents were running |
| 1 | Content Extraction (overlays to JSON) | 5-7 hrs | PENDING |
| 2 | Client Config Provider (React context) | 8-12 hrs | PENDING |
| 3 | Developer Track Content Extraction | 4-6 hrs | PENDING |
| 4 | Routing Middleware & Multi-Tenant | 6-10 hrs | PENDING |
| 5 | Documentation & Onboarding | 3-4 hrs | PENDING |

---

## Key Files

### Plan and Architecture
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project conventions, tech stack, critical rules |
| `.planning/plan-files/reusability-implementation-plan.md` | **THE PLAN** -- read this first. Contains full phase detail, JSON schema, file-by-file change lists |

### Current siteConfig and Content Architecture
| File | Purpose |
|------|---------|
| `app/src/config/site.ts` | Current siteConfig (~30 fields) -- becomes the bundled default |
| `app/src/content/shared/sections.ts` | Section registry with track assignments |
| `app/src/content/shared/starter-kit-data.ts` | Starter kit file definitions (needs tier/customCategory) |
| `app/src/content/shared/brand-voice-data.ts` | Data file with clientExample fields needing overlay treatment |
| `app/src/content/shared/roi-data.ts` | ROI data with clientExample fields needing overlay treatment |
| `app/src/routes/router.tsx` | Router config |

### Developer Track Sections (for Phase 3 content extraction)
| File | Purpose |
|------|---------|
| `app/src/content/developer/HallucinationsSection.tsx` | HIGH value for general track extraction |
| `app/src/content/developer/ClaudeMdSection.tsx` | MEDIUM -- extract "Map Not Encyclopaedia" principle |
| `app/src/content/developer/DocumentationSection.tsx` | MEDIUM -- extract "knowledge in heads is invisible" |

### Layout Components (need config migration in Phase 2)
| File | Purpose |
|------|---------|
| `app/src/components/layout/Header.tsx` | Uses siteConfig for title |
| `app/src/components/layout/Footer.tsx` | Uses siteConfig |
| `app/src/components/layout/Sidebar.tsx` | Needs hasDeveloperTrack gating |
| `app/src/components/layout/HomePage.tsx` | Track selector -- needs hasDeveloperTrack gating |
| `app/src/components/layout/FeedbackWidget.tsx` | Uses feedback email from siteConfig |

---

## Critical Implementation Notes

### Data Files at Module Scope
Files like `sections.ts`, `starter-kit-data.ts`, `brand-voice-data.ts`, and `roi-data.ts` use `siteConfig` at module scope (top-level `const`). These **cannot use React hooks**. The plan recommends converting to factory functions: `getSections(config: SiteConfig): Section[]`. This is a key architectural decision for Phase 2.

### No-Duplication Constraint (Phase 3)
When extracting developer track content to general track, there must be **no duplication**. Content should not exist in both tracks. The developer track originals must be reworked to provide developer-specific depth that complements (not repeats) the general version. After extraction, grep for duplicated prose across tracks.

### Client JSON in public/
Client configs go in `app/public/clients/`. These are static files served by Vercel CDN. The SPA fetches them at runtime based on the subdomain.

### Vercel Routing Middleware
`middleware.ts` lives at the Vercel project root (which is `app/` for this project). It is framework-agnostic and works with Vite SPAs. It extracts the subdomain and can set headers, but the SPA should also parse the hostname directly for resilience.

---

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format       # Prettier -- format all files
cd app && bun run format:check # Prettier -- check without writing
```

---

## Verification After This Session

### Phase 0 (verify complete from previous session)
- [ ] No `siteConfig.companyShortName` / `companyName` in developer track sections (Category C done)
- [ ] No `/process` route in router.tsx
- [ ] `ProcessDocPage.tsx` deleted
- [ ] `app/public/docs/repeatable-workflow.md` deleted
- [ ] WelcomeSection.tsx process doc link removed
- [ ] Starter kit "Phew!" references removed (3 files)

### Phase 1 (if reached)
- [ ] `ClientConfig` interface defined in `client-config-schema.ts`
- [ ] `phew.json` created in `app/public/clients/`
- [ ] `_template.json` created in `app/public/clients/`
- [ ] Data files accept overlay content with generic fallbacks
- [ ] Starter kit has `tier`/`customCategory` fields

### Phase 2 (if reached)
- [ ] `ClientConfigContext` + provider created
- [ ] `useClientConfig()` / `useSiteConfig()` hooks created
- [ ] App wrapped in `<ClientConfigProvider>`
- [ ] ~25 files migrated from static siteConfig import to hooks
- [ ] Data files converted to factory functions where needed

### Phase 3 (if reached)
- [ ] General-track "Reliable Output" section created
- [ ] "Persistent Context" subsection added to general track
- [ ] Developer track originals reworked -- no duplicated content
- [ ] `hasDeveloperTrack` flag gates developer track
- [ ] Section visibility respects enabled/disabled config

### Build status
- [ ] `cd app && bun run build` passes
- [ ] `cd app && bun run lint` -- 0 errors
- [ ] `cd app && bun run format:check` passes

---

## Important Notes

- **All decisions are confirmed.** Do not re-ask or re-evaluate the architecture, developer track, starter kit, or LLM-agnostic decisions.
- **The plan at `.planning/plan-files/reusability-implementation-plan.md` is the source of truth.** Read it in full before starting any work. It contains the complete JSON schema, file-by-file change lists, and phase details.
- **UK English throughout** -- all content, examples, and copy must use UK English spelling and grammar.
- **No framework migration.** Vite SPA stays as-is. Vercel Routing Middleware is framework-agnostic.
- **Phase 0 agents were running at session end.** Verify their work before proceeding.
