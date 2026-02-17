# Content Review Findings — Consolidated Report

**Date:** 16 February 2026
**Scope:** All 17 unique page components across both tracks
**Reviewers:** 3 parallel review agents covering the full page catalogue

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Must fix | 9 |
| Should fix | 12 |
| Low priority | 15 |
| **Total** | **36** |

**Key themes:**
1. **Developer track cross-references are not clickable** — all 8 developer-only sections use `<strong>` text instead of `<Link>` components (systemic, affects 5+ sections)
2. **Governance policy has structural gaps** — missing Appendix A, numbering mismatch, broken aria-labelledby, terminology inconsistency
3. **A few copyable blocks contain non-prompt text** — instructional/educational content inside CodeBlock components that get copy buttons
4. **Cross-reference accuracy** — two incorrect section references and several incomplete/vague references
5. **UK English compliance is excellent** — no American spellings found in narrative content across all 17 components

---

## Must Fix (9 issues)

### MF-1: Developer track cross-references not linked (SYSTEMIC)

**Severity:** Must fix
**Components:** ClaudeMdSection, DocumentationSection, CodebaseMappingSection, HallucinationsSection, RegressionTestingSection, McpUsageSection, PluginsSection, TechnicalDebtSection
**Issue:** All developer-track sections use `<strong>` or `<span>` text for cross-references to other sections, while all general-track sections use `<Link>` components from React Router. Developer-track users cannot click to navigate to referenced sections.

**Examples:**
- `ClaudeMdSection.tsx:566` — "Section 1.9 -- Documentation Structure" rendered as `<span>`, not a link
- `DocumentationSection.tsx:582` — "Section 1.10 -- Codebase Mapping" rendered as `<strong>`, not a link
- `CodebaseMappingSection.tsx:773` — "Section 1.9 -- Documentation Structure" rendered as `<strong>`, not a link

**Fix:** Import `Link` from `react-router` in all developer sections and convert cross-references to clickable links using `/${track}/<slug>` pattern, matching the general-track convention.

---

### MF-2: WelcomeSection — incorrect plugin install command

**Severity:** Must fix
**Component:** `content/shared/WelcomeSection.tsx`
**Line:** 93 (in `QUICK_REFERENCE_ITEMS_ALL`)
**Issue:** Quick Reference Card contains `'Use /plugin install for: pr-review-toolkit, security-guidance, context7.'` — the `/plugin install` syntax is incorrect. Claude Code uses `claude plugin install <name>`, not a slash command.
**Fix:** Change to `'Use claude plugin install for: pr-review-toolkit, security-guidance, context7.'`

---

### MF-3: SkillsExtensionsSection — instructional text in copyable CodeBlock

**Severity:** Must fix
**Component:** `content/general/SkillsExtensionsSection.tsx`
**Lines:** 1538-1541 and 1774-1777
**Issue:** The `naturalLanguageTriggerGuide` is educational text explaining how skills work ("To use your skills on claude.ai... You DON'T need to type a command..."), placed inside a `CodeBlock` which gives it a copy button. Copying this text and pasting into Claude would be meaningless — it is guidance, not a prompt.
**Fix:** Replace `CodeBlock` with a `CalloutCard` or regular formatted text. Remove the copy affordance.

---

### MF-4: GovernancePolicySection — missing Appendix A

**Severity:** Must fix
**Component:** `content/general/GovernancePolicySection.tsx`
**Line:** ~608 (in `fullPolicyText`)
**Issue:** The full policy text jumps from Section 10 directly to "Appendix B -- Extension Type Quick Reference" with no Appendix A. This implies a missing appendix.
**Fix:** Either rename "Appendix B" to "Appendix A", or add the missing Appendix A (e.g., the Extension Register template, which logically precedes the quick reference).

---

### MF-5: GovernancePolicySection — accordion numbering mismatch

**Severity:** Must fix
**Component:** `content/general/GovernancePolicySection.tsx`
**Lines:** 928-968
**Issue:** The walkthrough accordion numbers sections with `{index + 1}` based on a filtered array. For general-track users, Section 6 (Technical Standards for Internal Extensions) is filtered out, so sections after it are misnumbered (the walkthrough shows 1-9, but the actual policy numbers are 1-5, 7-10, skipping 6).
**Fix:** Use `section.number` (or the section's own numbering) instead of `index + 1`.

---

### MF-6: GovernancePolicySection — broken aria-labelledby

**Severity:** Must fix
**Component:** `content/general/GovernancePolicySection.tsx`
**Lines:** 764-789
**Issue:** The introduction section uses `aria-labelledby="gov-intro-heading"` but no element with that `id` exists in the JSX. The attribute points to nothing.
**Fix:** Either add `id="gov-intro-heading"` to the introduction heading, or remove the `aria-labelledby` attribute.

---

### MF-7: GovernancePolicySection — "Team lead" vs "AI Lead" terminology

**Severity:** Must fix
**Component:** `content/general/GovernancePolicySection.tsx`
**Lines:** 1108-1151
**Issue:** The Appendix B quick reference table uses "Team lead approval" for MCPs and Hooks, while the body of the policy consistently uses "AI Lead". This terminology inconsistency could confuse users about who approves what.
**Fix:** Change "Team lead" to "AI Lead" in the quick reference table to match the rest of the policy.

---

### MF-8: TechnicalDebtSection — incorrect subagent cross-reference

**Severity:** Must fix
**Component:** `content/developer/TechnicalDebtSection.tsx`
**Line:** 371
**Issue:** CalloutCard references "the subagent pattern from Section 1.10". Section 1.10 (Codebase Mapping) does not discuss subagents. The subagent pattern is introduced in Section 1.4 (Skills, Extensions & Decision Tree).
**Fix:** Change the reference to "the subagent pattern from Section 1.4" and convert to a `<Link>`.

---

### MF-9: DocumentationSection — "context7 MCP" mislabel

**Severity:** Must fix
**Component:** `content/developer/DocumentationSection.tsx`
**Lines:** 98, 756-757
**Issue:** References "the context7 MCP (Section 1.14)". Section 1.14 is Plugin Recommendations, where context7 is described as a plugin, not an MCP server. Calling it "the context7 MCP" here is misleading.
**Fix:** Change to "the context7 plugin (Section 1.14)" or "the context7 tool (available as both a plugin and an MCP server -- see Sections 1.13 and 1.14)".

---

## Should Fix (12 issues)

### SF-1: WelcomeSection vs SkillsExtensionsSection — skills description inconsistency

**Component:** `WelcomeSection.tsx` vs `SkillsExtensionsSection.tsx`
**Issue:** WelcomeSection Quick Reference says "Place .md files in .claude/skills/" while SkillsExtensionsSection says skills are "directories containing a SKILL.md file." Both are technically correct but the phrasing should be aligned.
**Fix:** Standardise on the canonical description (directory-based with SKILL.md).

---

### SF-2: BrandVoiceSection — brand-voice skill referenced but never shown

**Component:** `content/general/BrandVoiceSection.tsx`
**Lines:** 562, 627, 851-862
**Issue:** The section repeatedly references "the brand-voice skill" and says its SKILL.md is a "well-structured example", but the skill file is never displayed. Only the `uk-english` and `brand-review` skills are viewable in collapsibles.
**Fix:** Add a collapsible showing the brand-voice SKILL.md content, or remove/modify the references.

---

### SF-3: RecurringTasksSection — vague developer-track cross-reference

**Component:** `content/general/RecurringTasksSection.tsx`
**Lines:** 650-654
**Issue:** Cross-reference for Pattern 4 (external triggers) says "see the **Developer track**" without specifying which section. No developer section specifically covers external triggers. The reference is a dead-end.
**Fix:** Either link to a specific section or remove the vague cross-reference.

---

### SF-4: RecurringTasksSection — selfUpdatingSkillPrompt is template, not prompt

**Component:** `content/general/RecurringTasksSection.tsx`
**Lines:** 252-269, 539
**Issue:** The `selfUpdatingSkillPrompt` is structured as a skill template with many bracketed placeholders, presented via `PromptExample`. It is not something a user would paste directly into Claude — they would save it as a file. A `CodeBlock` with a title like "Self-Updating Skill Template" may be more appropriate.
**Fix:** Consider converting from `PromptExample` to `CodeBlock`, or keep as `PromptExample` with a clear context note that this is a file template, not a direct prompt.

---

### SF-5: HallucinationsSection — incomplete section title in cross-reference

**Component:** `content/developer/HallucinationsSection.tsx`
**Line:** 355
**Issue:** Cross-reference to "Skills & Extensions" is incomplete. The actual section title is "Skills, Extensions & Decision Tree" (Section 1.4).
**Fix:** Use the full title or the sidebar label.

---

### SF-6: HallucinationsSection — .planning/ directory convention is project-specific

**Component:** `content/developer/HallucinationsSection.tsx`
**Line:** 59 (Pattern 2 explanation)
**Issue:** References saving plans to "a .planning/ directory" as if it is a universal convention. This is specific to this project and the GSD workflow. For Phew!'s own projects, they may not use this directory.
**Fix:** Frame as a suggestion: "a dedicated planning directory (e.g., `.planning/`)" or reference the Documentation Structure section for recommended folder conventions.

---

### SF-7: PluginsSection — "data handling policies" inconsistent reference

**Component:** `content/developer/PluginsSection.tsx`
**Line:** 117
**Issue:** References "your data handling policies (Section 1.5)" but Section 1.5 is titled "AI Governance Policy". Other references in the same file correctly say "governance policy (Section 1.5)".
**Fix:** Change to "governance policy (Section 1.5)" for consistency.

---

### SF-8: McpUsageSection — orphaned /mcp CodeBlock

**Component:** `content/developer/McpUsageSection.tsx`
**Lines:** 762-767
**Issue:** The CodeBlock wrapping the `/mcp` command sits outside the main section structure, appearing after the Governance CalloutCard but not inside any `<section>` element. It is visually orphaned.
**Fix:** Move into the troubleshooting section or the safety section where `/mcp` is repeatedly referenced.

---

### SF-9: McpUsageSection — "Local" config level naming

**Component:** `content/developer/McpUsageSection.tsx`
**Lines:** 357-383
**Issue:** The three configuration levels are named "Local", "Project", and "User". "Local" refers to `.mcp.json` in the project root, which Claude Code's own documentation typically calls "project-level" MCP config. The naming could confuse users who consult the official docs.
**Fix:** Align terminology with Claude Code's documentation, or add a note explaining the mapping.

---

### SF-10: TechnicalDebtSection — CONVENTIONS.md referenced without explanation

**Component:** `content/developer/TechnicalDebtSection.tsx`
**Line:** 264
**Issue:** References "CONVENTIONS.md" as a file to update after fixing debt, but does not explain where this file comes from. It is one of the GSD codebase mapper outputs (Section 1.10). Users who haven't read Section 1.10 may not understand the reference.
**Fix:** Add "(see Section 1.10)" after the reference, and convert to a link.

---

### SF-11: TechnicalDebtSection — "/docs structure" ambiguous in closing callout

**Component:** `content/developer/TechnicalDebtSection.tsx`
**Lines:** 650-657
**Issue:** The text "update your CLAUDE.md and /docs structure (Sections 1.8 and 1.9)" is ambiguous — "/docs" could mean the project's `/docs` directory or the Documentation Structure section concept.
**Fix:** Clarify: "update your CLAUDE.md (Section 1.8) and documentation structure (Section 1.9)".

---

### SF-12: GovernancePolicySection — no placeholder warning on full policy copy

**Component:** `content/general/GovernancePolicySection.tsx`
**Line:** ~795
**Issue:** When a user copies the full policy via the CopyButton, the raw `{{PLACEHOLDER}}` strings (like `{{EFFECTIVE_DATE}}`, `{{NEXT_REVIEW}}`) are pasted verbatim. There is no note near the copy button warning the user to fill in placeholders before distributing.
**Fix:** Add a brief note or tooltip near the copy button: "Remember to replace the {{PLACEHOLDER}} values before distributing."

---

## Low Priority (15 issues)

### LP-1: ProcessDocPage — markdown parser limitations

**Component:** `content/shared/ProcessDocPage.tsx`
**Issue:** The lightweight markdown parser does not support ordered lists, nested lists, tables, or italic text. If the process document uses these features, they will render incorrectly.

### LP-2: BrandVoiceSection — "belt and braces" hyphenation inconsistency

**Component:** `content/general/BrandVoiceSection.tsx`
**Lines:** 223 vs 929
**Issue:** Line 223 uses "belt-and-braces" (hyphenated as compound adjective); line 929 uses "belt and braces" (unhyphenated).

### LP-3: BrandVoiceSection — brandVoiceSetupPrompt placeholder note

**Component:** `content/general/BrandVoiceSection.tsx`
**Line:** 681
**Issue:** The brandVoiceSetupPrompt has fill-in placeholders but no `context` prop on the PromptExample noting "Fill in the bracketed sections before pasting".

### LP-4: ClaudeMdSection — example vs template confusion in CodeBlocks

**Component:** `content/developer/ClaudeMdSection.tsx`
**Lines:** 65-126
**Issue:** Example content in accordion CodeBlocks (e.g., "A learning management system built with ASP.NET Core...") could be mistaken for templates. Consider distinguishing examples from templates visually.

### LP-5: ClaudeMdSection — IDE alternatives callout placement

**Component:** `content/developer/ClaudeMdSection.tsx`
**Lines:** 624-632
**Issue:** The "IDE alternatives" callout about Windsurf, Cursor, and Warp interrupts the flow between "Map, Not Encyclopedia" and "How to Structure a CLAUDE.md File".

### LP-6: ClaudeMdSection — two adjacent info callouts without separator

**Component:** `content/developer/ClaudeMdSection.tsx`
**Lines:** 1029-1042
**Issue:** Two adjacent `CalloutCard variant="info"` blocks may visually merge. Consider combining or adding a separator.

### LP-7: DocumentationSection — llms.txt callout missing separator

**Component:** `content/developer/DocumentationSection.tsx`
**Lines:** 747-758
**Issue:** The `llms.txt` callout at the end is not separated from the preceding "Copyable Templates" section by a `<Separator />`.

### LP-8: CodebaseMappingSection — WordPress mention

**Component:** `content/developer/CodebaseMappingSection.tsx`
**Line:** 402
**Issue:** References "WordPress site" as one of Phew!'s potential projects. WordPress is not mentioned elsewhere. Verify this is accurate for the client.

### LP-9: CodebaseMappingSection — FLOW_DIAGRAM in CodeBlock

**Component:** `content/developer/CodebaseMappingSection.tsx`
**Lines:** 299-317
**Issue:** A visual box-drawing diagram is in a `CodeBlock` with a copy button. Copying the diagram is not useful.

### LP-10: CodebaseMappingSection — "200k" vs "200,000" format inconsistency

**Component:** `content/developer/CodebaseMappingSection.tsx`
**Line:** 557
**Issue:** Uses "200k token context" while other sections use "200,000-token context window".

### LP-11: CodebaseMappingSection — missing trailing period

**Component:** `content/developer/CodebaseMappingSection.tsx`
**Line:** 329
**Issue:** Getting started step 2 is missing a trailing period. All other steps end with periods.

### LP-12: HallucinationsSection — [describe task] placeholder prominence

**Component:** `content/developer/HallucinationsSection.tsx`
**Line:** 192
**Issue:** The `[describe task]` placeholder in the HARNESS_PROMPT is embedded mid-text. Could benefit from being on its own line.

### LP-13: RegressionTestingSection — double-stop punctuation

**Component:** `content/developer/RegressionTestingSection.tsx`
**Line:** 204
**Issue:** "(See Section 1.11.)" has a period before the closing parenthesis, creating a double stop. Other references use `(see Section 1.11)`.

### LP-14: PluginsSection — /plugin missing code formatting

**Component:** `content/developer/PluginsSection.tsx`
**Line:** 758
**Issue:** "Check for plugin errors in the /plugin Errors tab" — `/plugin` should be in `<code>` tags for consistency with how it is formatted elsewhere.

### LP-15: McpUsageSection — unidirectional arrows in architecture diagram

**Component:** `content/developer/McpUsageSection.tsx`
**Lines:** 251-270
**Issue:** The architecture diagram uses unidirectional arrows when MCP is bidirectional. Minor pedagogical concern.

---

## Clean Components (No Issues)

The following components had no content issues:

| Component | Notes |
|-----------|-------|
| **HomePage** | Clean. Uses `siteConfig` correctly, no copyable content, accurate section counts. |
| **SessionManagementSection** | Excellent. Explicit terminology disambiguation callout ("handoff prompt" = "continuation prompt"). Well-structured copyable prompts. All cross-references accurate. |
| **ContextSimulatorSection** | Clean. Consistent terminology, accurate cross-references, appropriate copyable content. |
| **StarterKitSection** | Clean. Well-implemented track-conditional rendering, appropriate copyable content. |

---

## Cross-Cutting Observations

### UK English Compliance: PASS

No American spellings found in narrative content across all 17 components. All instances of "organise", "behaviour", "colour", "centre", "analyse", "customise", "licence" (noun), "defence", "prioritise", "summarise", "minimise", "catalogue" are correctly spelled. Technical identifiers (e.g., plugin agent names like "comment-analyzer") are correctly left in their original form.

### Terminology Consistency: MOSTLY CONSISTENT

| Term | Status |
|------|--------|
| Context window | Consistent across all sections |
| Handoff prompt / continuation prompt | Explicitly disambiguated in SessionManagementSection |
| Skills | Consistent ("reusable instruction files") |
| CLAUDE.md / Project custom instructions | Correctly differentiated by platform |
| Context compaction | Consistent |
| AI Lead | Consistent except MF-7 (GovernancePolicySection quick reference uses "Team lead") |
| Governance policy | Consistent except SF-7 (PluginsSection says "data handling policies") |

### Learning Progression: SOUND

The section ordering provides a logical learning path:
1. Context fundamentals (1.2) > Session management (1.3) > Extension ecosystem (1.4) > Policy (1.5) > Brand voice (1.6) > Recurring tasks (1.7)
2. Developer progression: CLAUDE.md (1.8) > Documentation (1.9) > Codebase mapping (1.10) > Hallucinations (1.11) > Testing (1.12) > MCP (1.13) > Plugins (1.14) > Technical debt (1.15)

Cross-references between sections are generally accurate, with two exceptions (MF-8, MF-9).

### Content Continuity: GOOD

Given that the 17 sections were built from independent specs, content continuity is remarkably strong. The main gaps are:
1. Developer sections use `<strong>` instead of `<Link>` for cross-references (MF-1)
2. Two incorrect cross-reference targets (MF-8, MF-9)
3. A few incomplete or vague cross-references (SF-3, SF-5)
4. Minor format/style inconsistencies between sections built at different times

---

## Recommended Fix Order

1. **MF-1** (systemic cross-reference linking) — highest impact, affects all developer sections
2. **MF-2 through MF-9** — individual must-fix issues
3. **SF-1 through SF-12** — should-fix issues, in component order
4. **LP-1 through LP-15** — low priority, fix opportunistically

---

## Source Reports

Individual agent reports are preserved at:
- `.planning/audit/content-review-agent1.md` (7 components: HomePage, Welcome, StarterKit, ProcessDoc, ContextSimulator, Sessions, SkillsExtensions)
- `.planning/audit/content-review-agent2.md` (6 components: Governance, BrandVoice, RecurringTasks, ClaudeMd, Documentation, CodebaseMapping)
- `.planning/audit/content-review-agent3.md` (5 components: Hallucinations, RegressionTesting, McpUsage, Plugins, TechnicalDebt)
