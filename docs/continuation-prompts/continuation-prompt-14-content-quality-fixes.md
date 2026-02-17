# Content Quality Fixes -- Session Continuation Prompt

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
All research outputs in `.planning/research/`.

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
New "Measuring AI ROI" section (1.8) built with interactive calculator, 15 task templates, three measurement frameworks, getting-started checklist. Research synthesis from 13 articles at `docs/reference/roi-article-synthesis.md`.

### Current Phase (Research/Analysis)
Agent-based reviews completed. Outputs in `agent-outputs/` directory (files 02, 03, 05, 06). This session addresses the content quality findings from agents 05 (general track) and 06 (developer track).

### Build Status

- `cd app && bun run build` -- passes
- `cd app && bun run lint` -- 0 errors
- `cd app && bun run format:check` -- passes

---

## What This Session Does: Content Quality Fixes

This session resolves content quality issues identified across both the general and developer tracks. The issues come from `agent-outputs/05-review-general-track-content-quality.md` and `agent-outputs/06-review-developer-track-content-quality.md`. There are 5 work packages.

### Work Package 1: Remove Meta-Narrative Instances (Must-Fix)

**Issue:** The app should have at most ONE meta-narrative reference (where the playbook references itself being built with AI). Currently there are 4 instances. The canonical instance is in `WelcomeSection.tsx` (lines 415-451) and must be kept. Remove the other 3.

**Note on WelcomeSection (lines 415-451):** This is the **one to keep**, but it currently links to the `/process` route (line 444-450). When/if the process route is removed in the reusability session, this link will need updating. For now, keep the section as-is.

#### Instance to Remove 1: HomePage.tsx

**File:** `app/src/components/layout/HomePage.tsx`
**Lines:** 123-127
**Remove this entire block:**
```tsx
{/* Meta-narrative note */}
<p className="mt-8 text-center text-xs text-muted-foreground/70">
  This playbook was itself built using Claude and the workflows it
  describes.
</p>
```

#### Instance to Remove 2: SessionManagementSection.tsx

**File:** `app/src/content/general/SessionManagementSection.tsx`
**Lines:** 424-431
**Remove this entire block:**
```tsx
{/* Meta-narrative */}
<CalloutCard variant="info" className="mt-4">
  <p className="text-xs">
    This playbook itself was built using the atomic task principle —
    each section was a separate session with its own handoff prompt and
    fresh context window.
  </p>
</CalloutCard>
```

#### Instance to Remove 3: ClaudeMdSection.tsx

**File:** `app/src/content/developer/ClaudeMdSection.tsx`
**Lines:** 1034-1041
**Remove this entire block:**
```tsx
{/* Meta-narrative */}
<CalloutCard variant="info">
  <p className="text-xs">
    This playbook&apos;s own CLAUDE.md file guided the Claude Code agents
    that built every section you are reading &mdash; the same pattern
    described above, applied at scale.
  </p>
</CalloutCard>
```

#### Instance to Check: StarterKitSection.tsx

**File:** `app/src/content/shared/StarterKitSection.tsx`
**Lines:** 940-942
**Current text:**
```tsx
Everything here was built during the training sessions and refined based on Phew's specific needs.
```

This is borderline meta-narrative ("built during the training sessions") and also contains a client-specific "Phew" reference. **Rewrite** to be client-agnostic and remove the "built during" framing. Suggested replacement:
```tsx
Everything here is ready to drop into your Claude environment and start using straight away.
```

---

### Work Package 2: Update Hallucinations Section Introduction (Must-Fix)

**File:** `app/src/content/developer/HallucinationsSection.tsx`
**Issue:** The section jumps straight into a mini-nav (table of contents) and then directly into pattern cards. There is no introductory paragraph explaining what AI hallucinations are in the coding context, why they are a particular risk for developers, or what this section provides.

**Fix:** Before the mini-nav/table of contents, add 2-3 paragraphs covering:

1. **What hallucinations are** in the AI/coding context -- AI confidently generating code that looks correct but contains fabricated API calls, non-existent library methods, or subtly wrong logic.
2. **Why they are a particular risk for developers** -- unlike prose hallucinations (which are usually caught on reading), code hallucinations can pass code review, compile successfully, and fail silently in production. They are especially dangerous when working with unfamiliar APIs, less common libraries, or complex business logic.
3. **What this section provides** -- seven specific patterns for preventing and catching hallucinations, plus a combined verification harness that brings all patterns together. Each pattern includes a practical prompt template that can be copied and used immediately.

**Tone guidance:** Keep it practical and non-condescending. The audience are developers who already use Claude Code -- they may have experienced hallucinations but not systematically addressed them. Avoid academic language about "large language models" -- just explain the practical risk and the tools to manage it.

**Structural guidance:** Follow the introduction pattern used in other developer sections (e.g., `TechnicalDebtSection.tsx` or `McpUsageSection.tsx`) -- a heading, 2-3 paragraphs of context, and optionally a CalloutCard with a key insight.

---

### Work Package 3: Resolve Governance Template Placeholder Inconsistency (Should-Fix)

**Issue:** The in-app governance template and the standalone starter-kit template use different placeholder names for the same concepts.

| Concept | In-App (`GovernancePolicySection.tsx`) | Standalone (`starter-kit/templates/governance-policy-template.md`) |
|---------|---------------------------------------|------------------------------------------------------------------|
| Person responsible | `{{POLICY_OWNER}}`, `{{AI_LEAD_NAME}}`, `{{AI_LEAD_ROLE}}` | `{{ADMIN_CONTACT}}` |
| Review schedule | `{{NEXT_REVIEW}}` | `{{REVIEW_FREQUENCY}}` |

The in-app version is more granular (separating policy owner, AI Lead name, and AI Lead role). The standalone template collapses these into a single `{{ADMIN_CONTACT}}`.

**Files to modify:**
- `app/src/content/general/GovernancePolicySection.tsx` (lines 77-123 for placeholder definitions, plus all occurrences in policy content)
- `starter-kit/templates/governance-policy-template.md`

**Fix -- choose one approach:**
- **Option A (preferred):** Update the standalone template to match the in-app version. Replace `{{ADMIN_CONTACT}}` with `{{POLICY_OWNER}}`, `{{AI_LEAD_NAME}}`, and `{{AI_LEAD_ROLE}}` as appropriate for each occurrence. Replace `{{REVIEW_FREQUENCY}}` with `{{NEXT_REVIEW}}` or add both (frequency for the policy text, next date for the header).
- **Option B:** Simplify the in-app version to match the standalone template. Less granular but simpler.

The key requirement is consistency -- a user who downloads the standalone template and also views the in-app version should see the same placeholder names.

---

### Work Package 4: Reword Borderline Governance Annotations (Should-Fix)

**File:** `app/src/content/general/GovernancePolicySection.tsx`
**Issue:** Four annotation strings read more like authorial meta-commentary about the policy's design than guidance for the reader. They should address the reader directly rather than describing policy design decisions.

#### Line 217-218 (Section 1: Purpose)
**Current:**
```
'This sets the tone for the whole policy: proportionate, not bureaucratic. The key message is that governance exists to enable confident adoption, not to create red tape.'
```
**Reword to something like:**
```
'The goal here is proportionate governance, not bureaucracy. Having a clear process means your team can adopt new AI tools confidently without second-guessing whether they need permission first.'
```

#### Lines 233-234 (Section 2: Scope)
**Current:**
```
'Covers everything across all Claude surfaces. The scope is deliberately broad so nothing slips through the cracks, but the risk tiers (Section 4) ensure the process is proportionate to the actual risk.'
```
**Reword to something like:**
```
'This covers all Claude surfaces and extension types. The broad scope means nothing gets overlooked, but you will not be doing a full review for every low-risk extension -- the risk tiers in Section 4 keep the process proportionate.'
```

#### Line 330 (Section 6: Development Standards)
**Current:**
```
'These standards ensure internal extensions are reliable and reusable. The key principle: another team member should understand the extension without explanation from the author.'
```
**Reword to something like:**
```
'The practical test for any internal extension: could another team member pick it up and understand it without the author explaining it? If yes, it meets the standard.'
```

#### Line 382 (Section 9: Data Protection)
**Current:**
```
'This section is critical for Phew! given the safeguarding context. The safeguarding data clause is a hard line — no exceptions without the full Tier 3 process.'
```
**Issues:** (1) Contains "Phew!" which should use `siteConfig.companyName` or be genericised. (2) Reads as authorial commentary.
**Reword to something like:**
```
'Data protection is especially important if your organisation handles sensitive information. The key rule: any extension that could access sensitive or personal data must go through the full Tier 3 review process, no exceptions.'
```
Note: If `siteConfig` is not already imported in this file, the generic version above is preferable to adding the import just for one annotation.

---

### Work Package 5: Rework Governance Policy Intro Text (Must-Fix)

**File:** `app/src/content/general/GovernancePolicySection.tsx`
**Lines:** 771-774
**Issue:** The current intro text is client-specific and positions the template as something made for "Phew!" that "can be adapted for other organisations":

```tsx
The policy below is a fill-in-the-blanks template — Phew! can use it
as-is by filling in a few details, and it can be adapted for other
organisations by changing the highlighted variables.
```

This framing is wrong for a reusable product. The template IS for the client's organisation -- it should not reference "Phew!" or suggest "other organisations" need it adapted.

**Fix:** Replace lines 771-774 with text that addresses any SMB directly:

```tsx
The policy below is a fill-in-the-blanks template for your organisation's
AI governance. Fill in the highlighted variables with your details and you
will have a complete, practical policy ready to share with your team.
```

This is client-agnostic, addresses the reader directly ("your organisation"), and removes both the "Phew!" reference and the "other organisations" framing.

---

## Agent Allocation

| Agent | Responsibility | Files Owned |
|-------|---------------|-------------|
| **Agent A** | Work Packages 1 (meta-narrative removal) + 5 (governance intro) | `HomePage.tsx`, `SessionManagementSection.tsx`, `ClaudeMdSection.tsx`, `StarterKitSection.tsx` |
| **Agent B** | Work Package 2 (Hallucinations intro) | `HallucinationsSection.tsx` |
| **Agent C** | Work Packages 3 (placeholder consistency) + 4 (annotation rewording) | `GovernancePolicySection.tsx`, `starter-kit/templates/governance-policy-template.md` |

No file ownership overlaps between agents.

---

## Current File Structure

### Files Modified in This Session
```
app/src/
  components/
    layout/
      HomePage.tsx                       # WP1: Remove meta-narrative
  content/
    general/
      SessionManagementSection.tsx       # WP1: Remove meta-narrative
      GovernancePolicySection.tsx        # WP3, WP4, WP5: Placeholders, annotations, intro
    developer/
      ClaudeMdSection.tsx                # WP1: Remove meta-narrative
      HallucinationsSection.tsx          # WP2: Add introduction
    shared/
      StarterKitSection.tsx              # WP1: Rewrite borderline meta-narrative
starter-kit/
  templates/
    governance-policy-template.md        # WP3: Harmonise placeholders
```

### Reference Files
```
agent-outputs/
  05-review-general-track-content-quality.md    # Source of findings (general track)
  06-review-developer-track-content-quality.md  # Source of findings (developer track)
app/src/content/
  shared/WelcomeSection.tsx                     # Reference: the ONE meta-narrative to KEEP
  developer/TechnicalDebtSection.tsx             # Reference: good introduction pattern
  developer/McpUsageSection.tsx                  # Reference: good introduction pattern
```

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar. Use GBP not USD.
- **Path aliases:** `@/` maps to `app/src/` (configured in `tsconfig.app.json` and `vite.config.ts`).
- **Semantic tokens:** Use `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border` etc. No hardcoded palette classes.
- **Site config:** All client-specific values centralised in `config/site.ts`. Import as `import { siteConfig } from '@/config/site'`.
- **Copy-to-clipboard:** Every copyable code block, prompt, or template must have a copy button.
- **Track detection:** `useTrack()` hook returns `{ track, isDev, isGeneral }` for conditional rendering.
- **Tailwind v4:** No `tailwind.config.js`. Theme customisation in `app/src/index.css` via `@theme inline {}`.
- **Tone:** Practical, non-condescending, SMB-appropriate. Address the reader as "you/your". No third-person language.

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

- [ ] Meta-narrative: Only ONE instance remains (in `WelcomeSection.tsx` lines 415-451)
- [ ] Meta-narrative: `HomePage.tsx` no longer contains the footer meta-narrative paragraph
- [ ] Meta-narrative: `SessionManagementSection.tsx` no longer contains the CalloutCard meta-narrative
- [ ] Meta-narrative: `ClaudeMdSection.tsx` no longer contains the CalloutCard meta-narrative
- [ ] Meta-narrative: `StarterKitSection.tsx` intro text rewritten -- no "built during training sessions" or "Phew"
- [ ] Hallucinations: `HallucinationsSection.tsx` has 2-3 introductory paragraphs before the mini-nav
- [ ] Hallucinations: Introduction explains what hallucinations are, why they are risky for developers, and what the section provides
- [ ] Governance placeholders: In-app and standalone template use consistent placeholder names
- [ ] Governance annotations: Lines 218, 233-234, 330, 382 reworded to address the reader directly
- [ ] Governance annotations: No "Phew!" reference remains in line 382 annotation
- [ ] Governance intro: Lines 771-774 rewritten -- no "Phew!" reference, no "other organisations" framing
- [ ] `cd app && bun run build` passes
- [ ] `cd app && bun run lint` shows 0 errors
- [ ] `cd app && bun run format:check` passes (or run `format` to fix)

---

## Open Items

1. **WelcomeSection `/process` link** -- The canonical meta-narrative in `WelcomeSection.tsx` (lines 444-450) links to `/process`. If the process route is removed in the reusability session (prompt 15), this link will break. For now, leave it. The reusability session will handle this.
2. **Governance template interactivity** -- The current placeholder experience is hover/tap tooltips only. Whether placeholders should be interactively editable (fill in values within the app) is a future consideration, not part of this session.

---

## Documents to Read Before Starting

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Project conventions, tech stack, critical rules |
| `agent-outputs/05-review-general-track-content-quality.md` | Full general track content quality review with all findings |
| `agent-outputs/06-review-developer-track-content-quality.md` | Full developer track content quality review with all findings |
| `app/src/content/shared/WelcomeSection.tsx` | The canonical meta-narrative instance to KEEP -- read to understand what is already covered |
| `app/src/content/general/GovernancePolicySection.tsx` | Primary file for WP3, WP4, WP5 -- read the placeholder definitions (lines 77-123), annotations, and intro text |
| `starter-kit/templates/governance-policy-template.md` | Standalone governance template for placeholder harmonisation |
| `app/src/content/developer/HallucinationsSection.tsx` | The file needing an introduction (WP2) -- read to understand current structure |
| `app/src/content/developer/TechnicalDebtSection.tsx` | Reference for a well-structured introduction pattern |
