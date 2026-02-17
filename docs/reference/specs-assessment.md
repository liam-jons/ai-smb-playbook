# Specs Assessment: Generic Value vs Client-Specific History

**Date:** 2026-02-17
**Assessed by:** Claude (reorganisation review)
**Scope:** All 20 files in `.planning/specs/` (17 section specs, 1 phase-7 spec, 3 verification files)

---

## Section 1: Recommendation

**Verdict: Move all specs to `client-specific/00-phew/specs/` as a complete set. Do NOT extract individual patterns into separate reference files.**

### Rationale

After sampling all 20 files, the assessment is clear:

1. **The specs are overwhelmingly client-specific build instructions.** Every spec is addressed to a specific "Phase 2 build agent," references Phew-specific source materials (training transcripts, site content, feedback), and contains Phew-contextualised examples throughout (safeguarding audits, Ghost Inspector, ASP.NET/C# projects, WordPress sites, LMS training reports).

2. **The generic patterns within specs are not unique to the specs.** The reusable architectural decisions (component patterns, interaction designs, UI conventions) are already captured in the built application itself and in `.planning/research/` files (app-tech-stack.md, frontend-skills-review.md). The specs reference these research files as inputs; they do not originate the patterns.

3. **Extracting patterns would require significant editorial work for marginal value.** The useful patterns are deeply interwoven with Phew-specific content, source references, and agent instructions. Surgically extracting them would produce decontextualised fragments that are less useful than simply reading the existing codebase.

4. **The verification files are purely historical.** They document the consistency, coverage, and cross-reference integrity of the Phew build specs at the time of Phase 1 completion. They have zero ongoing utility outside understanding the Phew engagement.

5. **The phase-7-theme-system-spec is the only spec with substantial reusable architecture**, but its content (accessibility modes, creative themes, CSS cascade design) should be documented as part of the living app architecture in `docs/` or `CLAUDE.md` if it gets implemented -- not preserved as a detached spec.

**One exception worth noting:** Spec 1.5 contains a complete parameterised governance policy template (with `{{PLACEHOLDER}}` variables) that is designed to be reusable for any client. However, that template already exists as a standalone file at `starter-kit/templates/governance-policy.md`. The spec itself is still Phew-specific build instructions for how to present that template in the app.

---

## Section 2: Per-Spec Assessment Table

| Spec | Generic Value | Client-Specific | Recommendation |
|------|---------------|-----------------|----------------|
| **1.1 — Welcome & Orientation** | Low. Track selector pattern is trivial. | High. References Phew training dates, feedback, IMPACT values, team size, safeguarding sector. Opening copy directly addresses Phew staff. | Move to client-specific |
| **1.2 — Context Simulator** | Medium. Contains detailed interaction design for the simulator widget (segment data, degradation stages, slider parameters, compaction animation). | High. Framed for "Phew staff", Phew-specific presets ("typical Phew setup"), source references to Phew training materials. | Move to client-specific. The simulator component itself (already built) is the reusable artefact. |
| **1.3 — Session Management** | Low-Medium. Session management rules of thumb are generic Claude knowledge, not app-specific. | High. Phew-specific examples (safeguarding policy review), agent assignment, source references to Phew training materials. | Move to client-specific |
| **1.4 — Skills, Extensions & Decision Tree** | Medium. The decision tree entry points and platform availability matrix are well-structured. | High. Phew-specific examples throughout, "contextualised for Phew's setup (Claude Teams, Desktop, Code)". | Move to client-specific. The built component is the reusable artefact. |
| **1.5 — AI Governance Policy** | Medium. Contains a full parameterised governance policy template. | Medium-High. Template is parameterised but the spec wraps it in Phew-specific build instructions. The template itself already lives in `starter-kit/templates/governance-policy.md`. | Move to client-specific. The starter-kit template is the reusable artefact. |
| **1.6 — Brand Voice & UK English** | Low. UK English enforcement is Claude usage guidance, not app architecture. | High. Phew brand voice observations, IMPACT values, Phew-specific seed data, Britfix hook. | Move to client-specific |
| **1.7 — Recurring & Scheduled Tasks** | Low. Content is Claude capability documentation, not app patterns. | High. Phew-specific automation examples (LMS reports, accessibility monitoring, deal monitoring from training). | Move to client-specific |
| **1.8 — CLAUDE.md Files** | Low-Medium. "Map not encyclopedia" principle is generic advice. | High. "Teaches Phew's developers", Phew-specific examples, references to Phew training session. | Move to client-specific |
| **1.9 — Documentation Structure** | Low-Medium. The /docs structure recommendation is generic. | High. "Scaled down for Phew", "Calibrate for Phew's maturity", OpenAI/Reddit approach adapted specifically for a 10-person team. | Move to client-specific |
| **1.10 — Codebase Mapping** | Low. Documents the gsd-codebase-mapper tool which exists independently in `starter-kit/`. | High. "Directly applicable to Phew's WordPress and ASP.NET/C# projects", Phew-specific framing throughout. | Move to client-specific |
| **1.11 — Avoiding Hallucinations** | Low-Medium. Anti-hallucination patterns are generic Claude usage advice. | High. Prompts contextualised for Phew's tech stack (ASP.NET/C#, safeguarding compliance, ISO processes, LMS). | Move to client-specific |
| **1.12 — AI-Driven Regression Testing** | Low. Documents CoWork, Playwright MCP, Computer Use API capabilities. | High. Positioned as Ghost Inspector comparison specifically for Phew's workflow. | Move to client-specific |
| **1.13 — Safe MCP Usage** | Low-Medium. MCP setup patterns are generic Claude Code documentation. | High. "Two MCPs most relevant to Phew's workflow (deepwiki and chrome-devtools)". | Move to client-specific |
| **1.14 — Plugin Recommendations** | Low. Plugin catalogue will date rapidly. | High. "Curated catalogue" selected for Phew's tech stack (WordPress/PHP, ASP.NET/C#). | Move to client-specific |
| **1.15 — Codebase Auditing & Tech Debt** | Low-Medium. Audit prompt patterns are generic. | High. "For Phew, this is immediately practical — their WordPress and ASP.NET/C# projects". | Move to client-specific |
| **1.16 — Starter Kit Contents** | Low. File inventory of the Phew-specific starter kit delivery. | High. Complete inventory with Phew-specific status assessments, track assignments, and file browser component design. | Move to client-specific |
| **1.17 — Repeatable Workflow Process Doc** | Medium. The 7-step consultant workflow is genuinely reusable. | High. Every step uses the Phew engagement as the worked example. | Move to client-specific. The output (`docs/repeatable-workflow.md`) is the reusable artefact. |
| **phase-7-theme-system-spec** | High. Contains a well-designed, reusable theme architecture: accessibility modes (dyslexia, high contrast, large text), creative themes (retro terminal, synthwave, minimal ink), CSS cascade framework, orthogonal dimensions model. | Medium. Uses `phew-playbook` localStorage prefix, references "Phew AI Playbook". Architecture is portable. | Move to client-specific. If implemented, document the architecture in app docs. |
| **_verification-consistency** | None. Historical QA artefact. | High. Documents consistency of the Phew spec set at Phase 1 completion. | Move to client-specific |
| **_verification-coverage-audit** | None. Historical QA artefact. | High. Maps Phew's coverage checklist to spec coverage. | Move to client-specific |
| **_verification-cross-references** | None. Historical QA artefact. | High. Validates cross-references within the Phew spec set. | Move to client-specific |

---

## Section 3: Extracted Patterns

**No patterns extracted.**

After reviewing all specs, no content warrants extraction into standalone reference files. The reasons:

1. **The built application IS the reusable artefact.** The context simulator component, the decision tree component, the governance walkthrough, the track selector -- these are all implemented in the codebase. A future client engagement would reuse the code, not re-read the spec.

2. **The phase-7 theme architecture is the strongest candidate**, but it has not been implemented yet. If/when it is implemented, the architecture should be documented as part of the app's own documentation (CLAUDE.md or `/docs/architecture/`), not preserved as a detached planning spec.

3. **The consultant workflow (spec 1.17)** is genuinely reusable, but its output already exists at `docs/repeatable-workflow.md`. The spec is the build instructions for that document, not the document itself.

4. **Generic Claude usage patterns** (session management rules, anti-hallucination techniques, MCP setup guidance) are Claude platform documentation, not app-specific patterns. They will date as Claude evolves. If they need to be preserved, they belong in the app's content sections, which already contain them.

### Summary

All 20 files should move to `client-specific/00-phew/specs/` as a cohesive set documenting the Phew engagement's build process. They are valuable as a historical record of how this specific client's playbook was planned and built, and could serve as a reference when planning a new client engagement -- but that reference value comes from reading them as a complete set in context, not from extracting fragments.
