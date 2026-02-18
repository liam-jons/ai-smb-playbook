# Continuation Prompt 18 — Multi-Tenant Testing, Gap Analysis & Client Onboarding Skill

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. Three outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** -- Internal process documentation

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## What Was Accomplished (Session 17)

The entire multi-tenant architecture was implemented across 6 phases, all committed to `main`:

```
852714f feat: Phase 5 — documentation & onboarding guides
f6e1c2e feat: Phase 4 — Vercel Edge Middleware, multi-tenant feedback API, config caching
31993ec feat: Phase 2 — replace static siteConfig imports with React context
abc372f feat: Phase 1 — client config schema, Phew JSON, starter kit tiers
fca8d95 feat: Phase 3 — extract developer content to general track
7fb9f53 feat: Phase 0 — genericise client-specific references and remove process route
```

### Architecture Now in Place

- **Single SPA, multiple clients:** One Vite build serves all clients. Client identified by subdomain.
- **Runtime JSON config:** Each client has a JSON file at `app/public/clients/{slug}.json` matching the `ClientConfig` interface in `app/src/config/client-config-schema.ts`.
- **React Context:** `ClientConfigProvider` wraps the app (in `main.tsx`). All components use `useSiteConfig()` hook instead of static imports.
- **Factory functions:** Data files that used `siteConfig` at module scope converted to functions accepting config (e.g., `getFrameworkSections(config)`, `getTaskTemplates(config)`).
- **Vercel Edge Middleware:** `app/middleware.ts` extracts client slug from subdomain, sets `x-client-id` header.
- **Multi-tenant feedback API:** `app/api/feedback.ts` reads Referer header, loads per-client email config from JSON, with slug sanitisation.
- **Config caching:** localStorage with 1-hour TTL for client configs.
- **Local dev testing:** `?client=slug` query param and `VITE_DEFAULT_CLIENT` env var.

### Key Files Created/Modified

| File | Purpose |
|------|---------|
| `app/src/config/client-config-schema.ts` | `ClientConfig` TypeScript interface |
| `app/src/config/config-loader.ts` | `DEFAULT_CONFIG`, `extractClientSlug()`, `loadClientConfig()` with caching |
| `app/src/config/client-config-context.tsx` | `ClientConfigProvider` React context |
| `app/src/hooks/useClientConfig.ts` | `useSiteConfig()`, `useOverlays()`, `useSectionsConfig()` hooks |
| `app/public/clients/phew.json` | Complete Phew Design client config |
| `app/public/clients/_template.json` | Template for new client onboarding |
| `app/middleware.ts` | Vercel Edge Middleware |
| `app/api/feedback.ts` | Multi-tenant feedback API |
| `CUSTOMISATION.md` | Step-by-step client deployment guide |
| `docs/repeatable-workflow.md` | Updated with "Setting up a new client deployment" section |
| `app/src/content/general/ReliableOutputSection.tsx` | New general track section (extracted from dev) |

### Domain Setup (Completed Manually)

- **Production URL:** `playbook.aisolutionhub.co.uk` (default config)
- **Phew subdomain:** `phew.playbook.aisolutionhub.co.uk` (Phew config via JSON)
- **DNS:** NS records for `playbook` delegated to `ns1.vercel-dns.com` / `ns2.vercel-dns.com` (Squarespace DNS)
- **Fallback:** `ai-smb-playbook.vercel.app` still works (default config)

---

## What This Session Does

Four focus areas:

### Focus 1: Browser Testing — Domain & Subdomain Verification

Use Playwright (browser MCP tools) to verify the multi-tenant setup is working correctly in production:

1. **Default site** (`playbook.aisolutionhub.co.uk`):
   - Loads without errors
   - Shows generic/default branding (not Phew-specific)
   - Navigation, sidebar, track selection all work
   - Welcome subtitle shows the default text

2. **Phew subdomain** (`phew.playbook.aisolutionhub.co.uk`):
   - Loads Phew-specific config (company name "Phew Design Limited", welcome subtitle "Getting started with AI at Phew")
   - Brand voice section shows Phew-specific framework examples (from overlays)
   - Recurring tasks section shows Phew-specific examples
   - ROI section shows Phew-specific examples
   - Developer track is visible (`hasDeveloperTrack: true`)
   - Feedback widget sends to correct email

3. **Comparison:** Verify there are visible differences between the default and Phew sites — overlays, company references, welcome text.

4. **Fallback URL** (`ai-smb-playbook.vercel.app`):
   - Still works and shows default config

### Focus 2: Default vs Overlay Content Verification

Beyond just checking the sites load, verify that the overlay system is producing visible differences:

- **Brand Voice section:** Default site should show generic framework examples; Phew site should show the 7 Phew-specific brand voice examples from `phew.json` overlays
- **Recurring Tasks section:** Default should show generic examples; Phew should show training completion reports, accessibility checks, proposal formatting, audit report generation
- **ROI section:** Default should show generic task templates; Phew should show LMS-specific examples
- If the default site is showing Phew content (because the bundled DEFAULT_CONFIG uses Phew values as defaults), this is a known issue — the DEFAULT_CONFIG in `config-loader.ts` uses `site.ts` values which are Phew-specific. Document what needs changing if this is the case.

### Focus 3: Implementation Gap Analysis

Use parallel sub-agents to compare what was implemented against what the implementation plan specified. The plan is at `.planning/plan-files/reusability-implementation-plan.md`.

**Approach:** Launch parallel agents, each responsible for auditing one phase:

- **Agent 1 — Phase 0 audit:** Verify all Category C genericisations are complete. Check that no client-specific hardcoded references remain in content sections.
- **Agent 2 — Phase 1 audit:** Verify the `ClientConfig` schema covers all fields referenced in the plan. Check `phew.json` completeness against the schema. Verify starter kit tier/category assignments.
- **Agent 3 — Phase 2 audit:** Grep for any remaining `import { siteConfig }` or `import { config }` from `@/config/site` — there should be none except in `config-loader.ts`. Verify all data files use factory functions. Check that overlay data (brand voice, recurring tasks, ROI) is actually consumed from the React context, not hardcoded.
- **Agent 4 — Phase 3 audit:** Verify the content extraction from developer to general track. **Known concern:** Some content that was planned for extraction to the general track may still only exist in developer sections. Check specifically:
  - `ReliableOutputSection.tsx` exists and is registered in `sections.ts` and `registry.ts`
  - Session management persistent context subsection was added
  - Cross-references between general and developer tracks are in place
  - The `hasDeveloperTrack` flag actually gates the developer track in the UI (sidebar, section visibility)
- **Agent 5 — Phase 4 audit:** Verify middleware, feedback API, caching, and dev testing all match the plan spec. Check that `?client=phew` works in the config loader.
- **Agent 6 — Phase 5 audit:** Verify documentation completeness against the plan's requirements.

**Output:** A consolidated gap report listing:
1. Items fully implemented as planned
2. Items partially implemented (with specifics of what's missing)
3. Items not implemented
4. Items implemented differently from the plan (with rationale if apparent)
5. New issues discovered (e.g., DEFAULT_CONFIG bundling Phew values as "defaults")

**Priority concerns to investigate:**
- Does `hasDeveloperTrack: false` actually hide the developer track? (sidebar rendering, section filtering, track selection)
- Are overlay values (brand voice examples, recurring task examples, ROI examples) consumed from the context, or are some still hardcoded in components?
- Is the `sections.enabled` / `sections.disabled` config actually used to filter sections, or was this deferred?
- Does the default site show truly generic content, or does it leak Phew-specific values from the bundled defaults?

### Focus 4: Client Onboarding Skill

Create a Claude Code skill that automates the repeatable client onboarding workflow. When invoked, this skill should guide the consultant through the full process from training transcript to live playbook deployment.

**Background:**
- The repeatable workflow is documented in `docs/repeatable-workflow.md` (7-step process: record, summarise, plan, spec, build, deploy, deliver)
- The client customisation guide is at `CUSTOMISATION.md`
- The `plugin-dev` plugin at `starter-kit/plugins/claude-plugins-official/plugin-dev/` can help with skill creation
- There is a transcript from a separate (non-Phew) client meeting available for testing

**What the skill should do:**
1. Accept a training transcript/summary as input
2. Analyse the transcript to extract: client name, industry, team composition, technical maturity, key topics covered, explicit requests, audience segmentation
3. Generate a draft `ClientConfig` JSON based on the extracted information
4. Guide the consultant through reviewing and refining the config
5. Produce the overlay content (brand voice framework, recurring task examples, ROI examples) based on the training context
6. Create the client JSON file in `app/public/clients/`
7. Optionally identify which developer track sections need review per the "Developer Track — Per-Section Customisation Effort" appendix in `CUSTOMISATION.md`

**Testing approach:**
- Use the separate client transcript to test the skill end-to-end
- Evaluate whether the extracted config values are accurate and useful
- Check that the generated JSON is valid against the `ClientConfig` schema

**Skill location:** Create at `.claude/skills/client-onboarding/SKILL.md` (or similar — use the `plugin-dev` plugin's guidance for skill structure)

---

## Key Reference Files

| File | What It Contains |
|------|-----------------|
| `.planning/plan-files/reusability-implementation-plan.md` | Original implementation plan (6 phases) — the source of truth for gap analysis |
| `CLAUDE.md` | Project conventions, tech stack, critical rules |
| `CUSTOMISATION.md` | Step-by-step client deployment guide with field reference |
| `docs/repeatable-workflow.md` | 7-step process from training to delivery |
| `app/src/config/client-config-schema.ts` | `ClientConfig` TypeScript interface (the schema) |
| `app/public/clients/phew.json` | Reference: complete client config example |
| `app/public/clients/_template.json` | Template with placeholder values |
| `app/src/config/config-loader.ts` | Config loading, caching, slug extraction |
| `app/src/config/client-config-context.tsx` | React context provider |
| `starter-kit/plugins/claude-plugins-official/plugin-dev/` | Plugin development helper |

---

## Important Notes

- **Do not re-evaluate architectural decisions.** The multi-tenant architecture is implemented and deployed. This session is about testing and extending, not redesigning.
- **UK English throughout** all content, skill files, and documentation.
- **The user has a test transcript** from a separate client meeting — ask them to provide it when starting Focus 4 (the onboarding skill).
- **DNS propagation:** The wildcard domain was set up on 18 Feb 2026. If `phew.playbook.aisolutionhub.co.uk` doesn't resolve, DNS may still be propagating. Try `playbook.aisolutionhub.co.uk?client=phew` as a fallback test.
- **All commits pushed** to `origin/main` on 18 Feb 2026. Vercel auto-deploys from main, so the production site should reflect the multi-tenant changes.
- **Recommended focus order:** Start with Focus 1 (browser testing) to verify deployment works, then Focus 3 (gap analysis) with parallel agents to surface issues, then Focus 2 (overlay verification — may overlap with browser testing), then Focus 4 (skill creation).
