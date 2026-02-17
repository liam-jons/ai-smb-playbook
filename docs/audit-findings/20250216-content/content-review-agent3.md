# Content Review — Agent 3 Findings

## HallucinationsSection (`content/developer/HallucinationsSection.tsx`)

### Issues Found

- [ ] **[Content continuity]** Line 355: Cross-reference to "Skills & Extensions" section is incomplete. The actual section title (1.4) is "Skills, Extensions & Decision Tree". The reference currently reads `<strong>Skills &amp; Extensions</strong>` and should include the full title or at minimum match the sidebar title "Extending Claude" for recognisability. As written, a user looking for this section in the sidebar or nav might not find it.

- [ ] **[Copyable prompt — placeholder clarity]** Line 192 (HARNESS_PROMPT): The prompt ends with `Here is the task: [describe task]` followed by `Start with step 1...`. The `[describe task]` placeholder is clear enough, but when a user copies the entire harness prompt, they might overlook the placeholder embedded mid-text. This is a minor usability concern rather than an error — the placeholder is inside the copyable block as intended, but could benefit from being on its own line for visual prominence.

- [ ] **[General readability]** Line 59 (Pattern 2 explanation): The explanation text contains `\n\n` for paragraph splitting, and the second paragraph reads: "For larger tasks, write the plan as a specification document saved to a .planning/ directory." This references the `.planning/` convention, which is specific to this playbook project's structure. For Phew!'s own projects, they might not use a `.planning/` directory. This could be slightly confusing — consider making it more generic (e.g., "a dedicated planning directory") or acknowledging it as a suggestion.

### Clean Areas
- All 7 prompts contain only prompt text appropriate for copying — no descriptions or instructional prose leak into the `prompt` prop.
- UK English is consistently used throughout (e.g., "prioritise", "behaviour", "recognise").
- In-page anchor navigation (`#pattern-1` through `#pattern-7` and `#agent-harness`) all have corresponding `id` attributes.
- Heading hierarchy is consistent: h2 for main sections, h3 for pattern titles.
- The follow-up prompt Collapsible for Pattern 6 renders correctly with proper open/close state management.
- No currency references that need UK localisation.


## RegressionTestingSection (`content/developer/RegressionTestingSection.tsx`)

### Issues Found

- [ ] **[Content continuity — cross-reference accuracy]** Line 62: Reference to "(see Section 1.11)" for hallucinated selectors is accurate. Line 168: Reference to "See Section 1.13 for installation guidance" for Playwright MCP is accurate. Line 204: Reference to "(See Section 1.11.)" is accurate but has inconsistent punctuation — the period after the closing parenthesis creates a double stop `.)`. Other references in the same file use `(see Section 1.11)` without a trailing period inside. This should be `(see Section 1.11)` for consistency, or the period should be outside: `(See Section 1.11).`

- [ ] **[General readability — CodeBlock as example vs template]** Lines 582–602: The CodeBlock at the bottom contains a markdown test catalogue entry example titled "Example: Natural-Language Test Catalogue Entry". This content gets a copy button via CodeBlock. While the content is useful as a template, it is an example with specific LMS-related content ("Admin user exists", "Training Management module"). A user copying this would need significant modification. This is acceptable as-is (it is labelled as an "Example"), but worth noting as a pattern difference — other sections use `PromptExample` for copyable templates and `CodeBlock` for config/code. This CodeBlock is neither config nor code; it is a markdown document example.

- [ ] **[UK English]** Line 180 (gettingStartedSteps, step 3): Uses "catalogue" — correct UK English. Line 524 (PromptExample title): Uses "Natural-Language Test Scenario Template" — no issue. Line 601 (CodeBlock title): Uses "Natural-Language Test Catalogue Entry" — correct. No American English issues found.

### Clean Areas
- All PromptExample `prompt` props contain only prompt text suitable for pasting into Claude — no instructional prose in the copyable blocks.
- Placeholders in prompts are clearly marked with `[brackets]`.
- The Tabs component for Conservative/Progressive approaches renders correctly with default "conservative" tab.
- Comparison table is well-structured with proper `scope="col"` on headers.
- The highlight row for "Self-healing tests" in the comparison table uses appropriate visual treatment.
- No broken links (no external links in this component).
- Content flow is logical: landscape overview, capabilities, comparison, approaches, getting started, limitations, prompts.
- No currency references.


## McpUsageSection (`content/developer/McpUsageSection.tsx`)

### Issues Found

- [ ] **[Content continuity — terminology]** Line 45 (deepwiki extraNote): States "Context7 (covered in Section 1.14 as a plugin)" — this is accurate (Section 1.14 is Plugin Recommendations). However, Context7 is also mentioned in Section 1.4 (Skills & Extensions) as an MCP server example. Users encountering it first in Section 1.13 (this section) might be confused by the forward reference to 1.14 when they may have already seen it in 1.4. Not necessarily an error, but worth noting for continuity.

- [ ] **[General readability — architecture diagram semantics]** Lines 251–270: The architecture diagram uses HTML entity arrows (`&larr;`, `&rarr;`, `&uarr;`, `&darr;`) between Context7, Claude Code, and Playwright. On desktop, the arrows point Context7 <-- Claude Code --> Playwright. This visually suggests data flows from Claude Code outward to the MCP servers. However, MCP is bidirectional (Claude sends requests, servers return responses). The unidirectional arrows may slightly misrepresent the protocol. This is a minor pedagogical concern — the diagram serves its purpose of showing the relationship.

- [ ] **[Copyable content — CodeBlock appropriateness]** Lines 762–767: The CodeBlock wrapping `/mcp` (a single bash command) is placed outside the main section structure — it appears after the Governance CalloutCard but not inside any `<section>` element. It is visually orphaned. It would read better inside the troubleshooting section or the safety section, where `/mcp` is repeatedly referenced.

- [ ] **[General readability — configuration level description]** Lines 357–383: The three configuration levels are described as "Local", "Project", and "User", with Local described as `.mcp.json` in the project root and Project as `.claude/settings.json`. In Claude Code's actual terminology, `.mcp.json` is typically called the "project-level" MCP config, while `.claude/settings.json` is the "project settings" for other settings. The naming here uses "Local" for `.mcp.json` which may not match Claude Code's own documentation terminology, potentially causing confusion.

### Clean Areas
- All PromptExample `prompt` props contain only prompt text.
- UK English is consistent throughout: "programme" (line 232), "categorised" (line 537).
- External links (nodejs.org, GitHub MCP repo, Anthropic Discord) all have proper `target="_blank"` and `rel="noopener noreferrer"` attributes.
- The context cost table is well-structured and informative.
- Troubleshooting accordion items are well-scoped with actionable steps.
- The "MCP vs Other Extension Options" table accurately cross-references Section 1.4.
- Safety section thoroughly covers the three main risks (silent failures, context cost, credentials).
- The safety checklist in the CodeBlock is appropriate copyable content (a markdown checklist).
- No currency references.


## PluginsSection (`content/developer/PluginsSection.tsx`)

### Issues Found

- [ ] **[UK English — technical name exception]** Line 54: Plugin description for `pr-review-toolkit` lists agent names including "comment-analyzer", "pr-test-analyzer", and "type-design-analyzer". These use the American "-zer" suffix rather than "-ser". However, these are the actual names of the agents within the plugin (technical identifiers), so they are legitimate exceptions — they should not be changed to British spelling. No action required, but noting for completeness.

- [ ] **[Content continuity — inconsistent section reference phrasing]** Line 117: The `coderabbit` plugin security note says "Ensure this is acceptable under your data handling policies (Section 1.5)." However, Section 1.5 is titled "AI Governance Policy", not "data handling policies". Other references in the same file correctly say "governance policy (Section 1.5)" (lines 719, 795) and "AI Governance Policy (Section 1.5)" (line 795). The line 117 reference should say "governance policy" or "AI Governance Policy" for consistency.

- [ ] **[General readability — batch install comment]** Lines 282–288 (BATCH_INSTALL): The CodeBlock for batch install starts with a comment `# Recommended starter set for Phew! developers`. This is inside a copyable CodeBlock. The comment is fine for context, but when a user copies this, they get a bash comment that is not harmful but is unnecessary in their terminal. Minor — comments in copyable bash are common practice.

- [ ] **[Component rendering — Badge inside AccordionTrigger]** Lines 480–485: A `<Badge>` component is rendered inside `<AccordionTrigger>`. The AccordionTrigger from shadcn/ui typically renders as a button, and nesting interactive or complex elements inside can sometimes cause styling issues. However, a Badge is non-interactive, so this should render fine. Just noting the pattern.

- [ ] **[General readability — "Errors tab" reference]** Line 758: Text says "Check for plugin errors in the /plugin Errors tab." This references a UI element ("/plugin Errors tab") without code formatting. The `/plugin` command should be in `<code>` tags for consistency with how it is formatted elsewhere in the section (e.g., line 738 where `/plugin` is rendered as a CodeBlock). Minor formatting inconsistency.

### Clean Areas
- All CodeBlock contents are appropriate for copying (install commands, checklists).
- The PluginsSection does not use PromptExample at all — it uses CodeBlock for install commands, which is the correct component choice.
- UK English is consistent in narrative text: "specialised" (line 51), "Analyses" (line 39).
- Cross-references to other sections (1.5, 1.8, 1.9, 1.12, 1.13) are all accurate per the section registry.
- The Tabs component for Browse/Quick Reference renders correctly.
- The Accordion for plugin categories supports `type="multiple"` allowing several categories open at once — good UX choice.
- The "Other Recommended Tools" section clearly distinguishes non-plugin tools with "Not a plugin" badges.
- No broken links (no external links in this component).
- No currency references.


## TechnicalDebtSection (`content/developer/TechnicalDebtSection.tsx`)

### Issues Found

- [ ] **[Content continuity — inaccurate cross-reference]** Line 371: CalloutCard references "the subagent pattern from Section 1.10". Section 1.10 is "Codebase Mapping" (CodebaseMappingSection), which does NOT mention subagents. Subagents are introduced and explained in Section 1.4 (Skills, Extensions & Decision Tree) and referenced in Session Management (1.3). The codebase mapping section discusses the GSD mapper tool but not subagent patterns for breaking work into parallel tasks. This cross-reference should point to Section 1.4 or at minimum say "the subagent pattern (see Section 1.4) used in the codebase mapping workflow".

- [ ] **[Copyable prompt — mixed instructional and prompt content]** Lines 484–502 (Prioritise Technical Debt prompt): The prompt ends with `Here are the items:\n[paste your CONCERNS.md content or audit findings here]`. This is appropriate — the placeholder is clearly marked. However, the `description` prop says "Use a structured framework to prioritise documented debt items" while the prompt itself says "prioritise them using this framework" — consistent and correct.

- [ ] **[General readability — heading hierarchy]** Lines 322 and 345/376/398: The "Part 1: Codebase Auditing" section (h2) contains sub-sections using h3 ("The Audit Workflow", "Multi-File Cross-Reference Analysis", "Audit Prompts by Focus Area", "Quick Health Check"). Similarly, "Part 2" has h3 sub-headings. This is a correct heading hierarchy. No issue.

- [ ] **[Content continuity — CONVENTIONS.md reference]** Line 264 (remediationPrinciples, "Update the documentation"): References "CONVENTIONS.md" as a file to update after fixing debt. This file naming convention is introduced in the Codebase Mapping section (1.10) as part of the GSD mapper output. Users who have not read Section 1.10 first might not understand what CONVENTIONS.md is. Consider adding "(see Section 1.10)" after the reference for clarity.

- [ ] **[General readability — cross-reference block]** Lines 650–657: The final CalloutCard provides cross-references to Sections 1.10, 1.11, 1.8, and 1.9. The text says "After fixing debt, update your CLAUDE.md and /docs structure (Sections 1.8 and 1.9)." The "/docs" reference without context could be confusing — is it the `/docs` directory in the project or the Documentation Structure section? Adding "documentation structure" would clarify: "update your CLAUDE.md (Section 1.8) and documentation structure (Section 1.9)".

### Clean Areas
- All PromptExample `prompt` props contain only text that would be pasted into Claude — no instructional text leaks into copyable blocks.
- UK English is consistently used: "authorisation" (line 40), "sanitisation" (line 42), "optimisation" (line 59), "Unoptimised" (line 69), "analyse" (lines 54, 103, 128, 147, 292, 350), "organisation" (line 122), "licence" (lines 78, 93).
- CodeBlock contents for the debt documentation format and example are appropriate copyable templates.
- The Accordion for audit types works correctly with `type="single" collapsible`.
- Priority badges (P1-P4) use appropriate colour coding.
- Workflow steps have consistent visual treatment with numbered circles.
- No broken links (no external links in this component).
- No currency references.
- Content flow is logical: why audit, how to audit, audit prompts, quick check, documenting debt, prioritising debt, remediating debt, architecture drift, ongoing maintenance.


## Cross-Section Consistency Summary

### Terminology Consistency
- **Context window**: Used consistently across all five sections. HallucinationsSection uses "200k token context window" (line 38), McpUsageSection uses "context window" and "10% of the context window" (line 288). Consistent.
- **Subagent/subagents**: Referenced in TechnicalDebtSection (line 371) but with an incorrect section cross-reference (points to 1.10 instead of 1.4).
- **MCP**: Consistently introduced and used. McpUsageSection and PluginsSection both explain MCP servers — McpUsageSection in depth, PluginsSection as a component type within plugins. No contradictions.
- **Hallucination/hallucinated**: Used consistently. RegressionTestingSection references "hallucinated selectors" (lines 62, 204) and correctly points to Section 1.11 (HallucinationsSection).
- **Ghost Inspector**: Mentioned in RegressionTestingSection (primary) and McpUsageSection (line 52, brief reference). Consistent framing as a current tool to potentially complement/replace.
- **CONCERNS.md**: Referenced in TechnicalDebtSection (lines 241, 304, 502, 638) and correctly traced back to Section 1.10 (Codebase Mapping).
- **Governance policy**: Consistently referenced as Section 1.5 in McpUsageSection and PluginsSection, except for the one "data handling policies" variant in PluginsSection line 117.

### Learning Progression
- The five sections build appropriately on each other and on earlier general-track concepts.
- McpUsageSection (1.13) logically precedes PluginsSection (1.14) as plugins bundle MCP servers.
- TechnicalDebtSection (1.15) builds on Codebase Mapping (1.10), Hallucinations (1.11), and Regression Testing (1.12) concepts.
- HallucinationsSection (1.11) is self-contained and provides foundational patterns referenced by later sections.

### No Contradictions Found
- No conflicting advice between sections.
- The McpUsageSection and PluginsSection both recommend Context7 and Playwright, with consistent guidance to "choose Context7 or deepwiki, not both".
