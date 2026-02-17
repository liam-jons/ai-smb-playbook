# Reusability Review & Assessment -- Session Continuation Prompt

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. Three outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** -- Internal process documentation

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).
**CLAUDE.md** is at the repo root with critical rules: UK English throughout, two-track content model, copy-to-clipboard on every prompt/template, parameterised governance policy.

---

## Completed Work

### Phase 0 (Research) -- Complete
All research outputs in `.planning/research/`. Includes the original reusability audit at `.planning/research/reusability-audit.md`.

### Phase 1 (Specs) -- Complete
All specs in `.planning/specs/`. Verified with audits.

### Phases 2-4 (Build) -- Complete
Full application built: 17 content sections across general and developer tracks, interactive context window simulator, governance policy template, starter kit browser, feedback widget.

### Phase 5 (Audit Fixes) -- Complete
All 17 frontend design audit issues resolved (0 critical, 3 high, 8 medium, 6 low). Score improved from 82/100.

### Phase 6 (Content Review) -- Complete
36 content review issues identified and resolved across all 17 page components.

### Phase 7 (Theme System) -- Complete
Three independent theming dimensions: light/dark mode, accessibility modes (dyslexia-friendly, high-contrast, large-text), creative themes. 28 status tokens, 8 segment tokens. Semantic token migration across 17 component files. Zero hardcoded palette classes remaining.

### Phase 8 (ROI Section) -- Complete
New "Measuring AI ROI" section (1.8) built with interactive calculator, 15 task templates, three measurement frameworks, getting-started checklist. Research synthesis from 13 articles at `docs/reference/roi-article-synthesis.md`. Data separated from presentation (roi-data.ts + RoiMeasurementSection.tsx) -- this is the best-architected section for reusability.

### Current Phase (Research/Analysis)
Agent-based reviews completed. Outputs in `agent-outputs/` directory. Specifically, `agent-outputs/03-analyse-reusability-and-template-system.md` contains the reusability analysis that this session will critically review. This session is a REVIEW session, not an implementation session.

### Build Status

- `cd app && bun run build` -- passes
- `cd app && bun run lint` -- 0 errors
- `cd app && bun run format:check` -- passes

---

## What This Session Does: Reusability Review & Critical Assessment

**This is a REVIEW session.** The primary output is a comprehensive implementation plan, not code changes. The session will review the reusability agent's analysis, cross-reference it with the original workstream D requirements and the user's notes, critically assess the proposed approach, and produce an implementation plan.

Do NOT make code changes in this session (except potentially removing the `/process` route if that decision is confirmed during review).

### Work Package 1: Review the Reusability Agent's Output (Must-Do)

**File to read:** `agent-outputs/03-analyse-reusability-and-template-system.md`

Read the full output and critically assess each of the 7 research areas:

1. **Tier 2 Assessment (Section 1):** The agent proposes a three-category split:
   - **Category A** (~15 references): Simple company name substitutions -- use `siteConfig.companyName`
   - **Category B** (~15 references): `phewExample` labels -- rename to `clientExample`, change rendered labels
   - **Category C** (~20 references): Should become generic regardless ("your team" / "your organisation")

   **Questions to assess:**
   - Is the three-category split the right approach? Could any Category A items actually be better as Category C (generic)?
   - Are all ~50 references accounted for across the three categories?
   - Is the agent's recommendation to genericise Category C (rather than parametrise) correct?

2. **Tier 3 Analysis (Section 2):** Ghost Inspector, Brand Voice, ASP.NET/C#/SQL Server content.

   **Questions to assess:**
   - Is the client overlay approach (`content/shared/client-overlays.ts`) the right pattern for Tier 3?
   - The agent recommends a `TechStackProfile` interface -- is this overengineering for the near term?
   - Should the Brand Voice section examples be extracted or simply made generic?

3. **Content Schema Design for Scale (Section 3):** Three tiers: 50 clients (fork-and-customise), 1,000 clients (build-time injection), 10,000 clients (multi-tenant runtime).

   **Questions to assess:**
   - Is the phased approach (50, 1,000, 10,000) realistic? What is the actual expected client count in the next 12 months?
   - For the 50-client tier (fork-and-customise with branches), how does merge conflict management work practically?
   - At what point does a headless CMS become justified?
   - How does the content schema handle sections that do not exist for some clients (e.g., regression testing for non-software SMBs)?

4. **ROI Section Reusability Verification (Section 4):** The agent declares the ROI section the "best example of reusability-aware architecture" and recommends it as the reference implementation.

   **Questions to assess:**
   - Is the ROI section truly the right reference implementation? It benefits from having data in a separate file (`roi-data.ts`), but most sections have inline JSX content. Is the pattern transferable?
   - How much effort is required to bring other sections to the same level?
   - Is the `clientExample` optional field pattern scalable to sections with much more client-specific content?

5. **Claude References (Section 5):** 374 occurrences of "Claude" across 17 files. Agent recommends staying Claude-focused.

   **Critical question from the user's notes:** *"Not all clients will yet be using Claude."* The agent recommends staying Claude-focused and building separate products for other LLMs. Is this the right call? Consider:
   - What percentage of target clients currently use Claude vs other LLMs?
   - Could the general track sections (governance, brand voice, ROI, recurring tasks) be made LLM-agnostic with minimal effort?
   - Should the developer track remain Claude-specific while the general track becomes more tool-agnostic?
   - Is "AI Playbook" the right product name, or does it need to explicitly mention Claude?

6. **Process Document Considerations (Section 6):** Agent recommends removing `/process` route from the client-facing app.

   **Questions to assess:**
   - Is there any client-facing value in the process document, or is it purely internal?
   - What links exist to it? (Answer: only `WelcomeSection.tsx` line 445 links to `/process`)
   - When removed, what happens to the "How This Playbook Was Built" section in WelcomeSection.tsx (lines 415-451) which links to it?
   - Should the process document be enhanced as an internal tool for the replication workflow?

7. **Brand Voice Genericisation (Section 7):** Agent recommends extracting `phewExample` content into client overlay, providing generic defaults.

   **Questions to assess:**
   - The user's note says this section "could actually be a really helpful section if made generic, to help SMBs start to build context/knowledge base files." Does the agent's recommendation achieve this?
   - Should the section be repositioned as "Building Context Files" rather than just "Brand Voice"?

---

### Work Package 2: Review Workstream D from Continuation Prompt 12 (Must-Do)

**File to read:** `docs/continuation-prompts/continuation-prompt-12-audit-fixes-content-review.md` (lines 277-339 -- the Workstream D section)

Cross-reference the original workstream D description with the agent's analysis. The original plan called for:

1. Replace all Tier 2 inline "Phew!" strings with `siteConfig.companyName` or similar config references
2. Rename `phewExample` data structures to `clientExample`
3. Create a `template` branch that strips Phew-specific Tier 3 content to generic placeholders
4. Document the forking/customisation process
5. Consider a content schema that separates structure from content

**Assessment questions:**
- Has the agent addressed all 5 items from the original plan?
- Are there gaps between the original requirements and the agent's recommendations?
- Is the original plan's sequencing still correct given what we now know?

---

### Work Package 3: Review the User's Original Notes (Must-Do)

**File to read:** `roi-and-reusability-next-steps.md` (at repo root)

The "Reusability Next Steps" section contains specific requirements. Cross-reference each with the agent's analysis:

1. *"Before completing any tier 2 changes... check whether it is logical to make the ~50 inline references parametrised or whether some could/should be made more generic"* -- Does the agent's three-category split address this?

2. *"Some of the tier 3 items could be valuable across multiple clients e.g., Phew use Ghost Inspector, other clients will use something different"* -- Does the agent's `TechStackProfile` approach handle this?

3. *"Rather than the brand voice work being something specific to Phew!, this could actually be a really helpful section if made generic"* -- Does the agent's recommendation achieve the user's vision?

4. *"Think about how this works if we scaled -- e.g., 50, 1000, 10,000 clients -- security, analytics and codebase management"* -- Does the agent adequately address all three (security, analytics, codebase management) at each scale tier?

5. *"Not all clients will yet be using Claude"* -- How well does the agent address this concern?

6. *"The Repeatable Workflow Process Doc and section should be removed from the app"* -- Is the agent's removal plan complete?

7. *"This document needs to be reviewed, as the information contained provides extremely valuable context for how the application will need to function"* -- Has the process document been reviewed for replication value?

8. Content review requirements (editorial notes, third-person language, meta-narrative) -- These are addressed in prompts 13 and 14. Note any overlap or gaps.

---

### Work Package 4: Assess the "Stay Claude-Focused" Recommendation (Should-Do)

The agent recommends staying Claude-focused. This is a strategic decision that affects:
- Product positioning and naming
- Content authoring effort for new clients
- Market size and addressable audience
- Technical architecture decisions

**Assessment framework:**
- What would an LLM-agnostic version of the general track look like? How much content would change?
- What would need to happen to the developer track for a non-Claude client?
- Is it feasible to have a "core" product that works for any LLM with a "Claude-specific" overlay for Claude clients?
- What is the business risk of being Claude-only vs the engineering cost of being LLM-agnostic?

Document the assessment with a clear recommendation and rationale.

---

### Work Package 5: Process Document Removal Planning (Should-Do)

**Files involved:**
- `app/src/routes/router.tsx` -- lines 17-19 (route definition), line 7 (import)
- `app/src/content/shared/ProcessDocPage.tsx` -- the component
- `app/public/docs/repeatable-workflow.md` -- the static asset served to the app
- `docs/repeatable-workflow.md` -- the source document (KEEP this)
- `app/src/content/shared/WelcomeSection.tsx` -- line 445 links to `/process`

**Plan the removal:**
1. Remove the route from `router.tsx` (lines 7, 17-19)
2. Delete `ProcessDocPage.tsx`
3. Delete `app/public/docs/repeatable-workflow.md`
4. Update `WelcomeSection.tsx` to remove or replace the `/process` link (lines 444-450)
5. Verify no other files reference `/process`

**Decision needed:** What replaces the "View the process document" link in WelcomeSection? Options:
- Remove the entire "How This Playbook Was Built" section (it is the meta-narrative, and we may want to keep it)
- Keep the section but remove the link
- Replace the link with something else (e.g., a note that the process document is available separately)

**Note:** If the meta-narrative removal from prompt 14 has already been completed, the WelcomeSection meta-narrative section should still exist (it is the ONE canonical instance). This work package only removes the `/process` link within it, not the section itself.

---

### Work Package 6: Create Implementation Plan (Must-Do)

After completing the review (Work Packages 1-5), create a comprehensive implementation plan at `.planning/plan-files/reusability-implementation-plan.md`.

The plan should cover:

1. **Executive summary** -- what problem we are solving and the recommended approach
2. **Architecture decisions** -- content schema, client overlay pattern, config structure
3. **Phase 1: Quick wins** -- Category C genericisation, ROI section fixes, process route removal
4. **Phase 2: Structural renaming** -- `phewExample` to `clientExample`, Category A parametrisation
5. **Phase 3: Content separation** -- client overlay data files, tech stack profiles, brand voice genericisation
6. **Phase 4: Template branch** -- creating the generic template, documenting the forking process
7. **LLM-agnostic considerations** -- what changes (if any) to make for non-Claude clients
8. **Scale roadmap** -- what additional infrastructure is needed at 50/100/1,000 clients
9. **File-by-file change list** -- every file that needs modification, what changes, and in which phase
10. **Effort estimates** -- hours per phase
11. **Dependencies and sequencing** -- what must happen before what
12. **Open questions** -- decisions that need user input before proceeding

---

## Current File Structure

### Key Files for This Review
```
agent-outputs/
  03-analyse-reusability-and-template-system.md  # Primary review subject
docs/
  continuation-prompts/
    continuation-prompt-12-audit-fixes-content-review.md  # Workstream D original spec
  reference/
    roi-article-synthesis.md                    # Context for how research feeds content
  repeatable-workflow.md                        # Process document (to be preserved)
roi-and-reusability-next-steps.md               # User's original notes (repo root)
```

### Codebase Files to Examine
```
app/src/
  config/
    site.ts                    # Current centralised config (15 values)
  content/
    shared/
      roi-data.ts              # Reference implementation for data separation
      sections.ts              # Section registry/metadata
      registry.ts              # Lazy-loaded component registry
      ProcessDocPage.tsx        # Process document renderer (to be removed)
    general/
      RoiMeasurementSection.tsx  # Reference implementation for rendering
      GovernancePolicySection.tsx # Placeholder/template pattern reference
      BrandVoiceSection.tsx      # Key genericisation target
      RecurringTasksSection.tsx  # Contains phewExample data
    developer/
      RegressionTestingSection.tsx  # Ghost Inspector references
      ClaudeMdSection.tsx           # ASP.NET template
  routes/
    router.tsx                 # Process route to remove
```

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar. Use GBP not USD.
- **Path aliases:** `@/` maps to `app/src/` (configured in `tsconfig.app.json` and `vite.config.ts`).
- **Site config:** All client-specific values centralised in `config/site.ts`. Currently has 15 values.
- **Content architecture:** Section content in `content/{general,developer}/` as React components, registered in `content/shared/registry.ts`. Metadata in `content/shared/sections.ts`.
- **Track system:** `useTrack()` hook returns `{ track, isDev, isGeneral }`. Sections tagged `'both'`, `'general'`, or `'developer'`.
- **Tailwind v4:** CSS-based. No `tailwind.config.js`. Theme in `app/src/index.css` via `@theme inline {}`.
- **Routing:** `/:track/:section` where track is `general` or `developer`. Homepage at `/`. Process doc at `/process` (to be reviewed for removal).
- **This is a REVIEW session.** Primary output is a plan document, not code changes.

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

## Deployment

- **Production:** https://ai-smb-playbook.vercel.app
- **Repository:** https://github.com/liam-jons/ai-smb-playbook
- Auto-deploys on push to `main` via Vercel

---

## Verification After This Session

- [ ] All 7 research areas from the agent output have been critically assessed with documented findings
- [ ] Workstream D requirements from continuation-prompt-12 cross-referenced -- no gaps
- [ ] User's original notes from `roi-and-reusability-next-steps.md` fully addressed
- [ ] "Stay Claude-focused" recommendation assessed with clear rationale documented
- [ ] Process document removal plan documented (files to change, links to update, decision on WelcomeSection)
- [ ] Implementation plan created at `.planning/plan-files/reusability-implementation-plan.md`
- [ ] Plan includes: phased approach, file-by-file change list, effort estimates, dependencies, open questions
- [ ] LLM-agnostic considerations documented with recommendation
- [ ] Scale roadmap (50/100/1,000 clients) documented with architecture decisions at each tier
- [ ] No code changes made (unless process route removal was confirmed and executed)

---

## Open Items

1. **LLM-agnostic vs Claude-focused** -- This is a strategic decision that needs user input. The review should present options with trade-offs, not make the final call unilaterally.
2. **Client count expectations** -- The scale tiers (50/1,000/10,000) need to be anchored in realistic projections. If the expected count is 5-20 in the next year, the architecture decisions are very different from 100+.
3. **Content authoring workflow** -- Who creates the client-specific content for each deployment? A developer? A non-technical consultant? This affects whether a CMS or file-based approach is better.
4. **Starter kit reusability** -- The agent's analysis focuses on the app, but the starter kit (`starter-kit/`) also contains Phew-specific content (skills, commands, templates). This needs to be included in the reusability plan.

---

## Documents to Read Before Starting

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Project conventions, tech stack, critical rules |
| `agent-outputs/03-analyse-reusability-and-template-system.md` | The primary document to review -- full reusability analysis with 7 research areas |
| `docs/continuation-prompts/continuation-prompt-12-audit-fixes-content-review.md` | Workstream D original spec (lines 277-339) |
| `roi-and-reusability-next-steps.md` | User's original notes with specific requirements |
| `.planning/research/reusability-audit.md` | Original reusability audit -- the starting point the agent built upon |
| `app/src/config/site.ts` | Current centralised config -- understand what Tier 1 already covers |
| `docs/reference/roi-article-synthesis.md` | Context for how research feeds into content -- relevant for understanding the content creation pipeline |
| `app/src/content/shared/roi-data.ts` | Reference implementation for data-separated architecture |
| `docs/repeatable-workflow.md` | The process document -- review for replication value before deciding on removal |
