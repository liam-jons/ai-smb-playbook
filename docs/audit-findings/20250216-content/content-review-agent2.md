# Content Review — Agent 2 Findings

Review date: 2026-02-16
Components reviewed: GovernancePolicySection, BrandVoiceSection, RecurringTasksSection, ClaudeMdSection, DocumentationSection, CodebaseMappingSection

---

## GovernancePolicySection (`content/general/GovernancePolicySection.tsx`)

### Issues Found

- [ ] **[Content continuity]** The full policy text (`fullPolicyText`, line 608) jumps from Section 10 directly to "Appendix B -- Extension Type Quick Reference" with no Appendix A. This implies a missing appendix. Either rename it to "Appendix A" or add the missing Appendix A (e.g., the Extension Register template, which logically precedes the quick reference).

- [ ] **[Copyable content]** The `fullPolicyText` (lines 414--617) includes the register template via string interpolation (`${registerTemplate}`). The register template itself contains `{{EFFECTIVE_DATE}}` and `{{NEXT_REVIEW}}` placeholders, which is correct and intended. However, when a user copies the full policy via the CopyButton at line 795, the raw `{{PLACEHOLDER}}` strings will be pasted verbatim. This is by design for a template, but there is no explicit note near the copy button warning the user to fill in placeholders before distributing.

- [ ] **[Content continuity — terminology]** The Appendix B quick reference table (lines 1108--1151) uses "Team lead approval" for MCPs and Hooks, while the body of the policy uses "AI Lead" throughout. This creates a terminology inconsistency. "Team lead" should be "AI Lead" to match the rest of the policy.

- [ ] **[Component rendering]** The accordion walkthrough section (lines 928--968) numbers sections with `{index + 1}` based on the filtered array. For the general track, Section 6 (Technical Standards for Internal Extensions) is filtered out because it has `tracks: ['developer']`. This means the general track walkthrough shows sections numbered 1--9, but the numbers will not match the policy section numbers (1--5, then jumps to 7--10, skipping 6). This could confuse a general-track user who expects section numbers to match the policy. Consider using `section.number` instead of `index + 1`.

- [ ] **[General readability]** The introduction section (lines 764--789) lacks an `id` heading. The `aria-labelledby="gov-intro-heading"` references an ID that does not exist in the JSX. No `<h2 id="gov-intro-heading">` is rendered. This is an accessibility issue -- the `aria-labelledby` points to nothing.

### No Issues

- UK English: Consistent throughout. Uses "organisation", "behaviour", "minimise", "customise", "colour", "licence" (noun), "defence", "offence", "proportionate" correctly.
- Currency: Uses GBP references where relevant.
- Cross-references: Links to Section 1.4, 1.13, and 1.14 are implemented as working `<Link>` components with correct track-relative paths.
- PromptExample: No PromptExample components are used in this section, so no copyable-prompt issues.

---

## BrandVoiceSection (`content/general/BrandVoiceSection.tsx`)

### Issues Found

- [ ] **[Copyable content — non-prompt text in prompt]** The `brandVoiceSetupPrompt` (lines 88--113) contains instructional placeholders like `[Company name]`, `[Brief description]`, `[Primary audience]`, `[Paste 2-3 examples of on-brand content -- website copy, emails, social posts]`, `[Paste any examples that felt off-brand]`, and `[Paste or describe any existing brand/style guidelines]`. While these are intended as fill-in prompts (the user fills in the bracketed parts before pasting), the prompt is structured so that the instructional header text ("I'd like to create a comprehensive brand voice document...") is mixed with the fill-in template. This is acceptable prompt design, but the `[Paste 2-3 examples...]` instructions are arguably non-prompt text that will be meaningless if pasted as-is. The `context` prop on the PromptExample could be used to note "Fill in the bracketed sections before pasting" -- currently no `context` prop is set for this prompt (line 681).

- [ ] **[Content continuity — terminology]** The section refers to "the brand-voice skill" (line 562) as a pre-existing skill, and the framework description mentions "The brand-voice skill guides you through seven areas" (line 627). However, there is no actual `brand-voice` skill file shown or referenced in the collapsible sections -- only the `uk-english` skill and the `brand-review` skill are shown. The brand-voice skill file content is never displayed, so a user looking for it may be confused. If a brand-voice SKILL.md exists in the starter kit, it should be viewable here.

- [ ] **[Content continuity]** The developer-only callout (lines 851--862) says "The brand-voice SKILL.md file is an example of well-structured skill design" but the brand-voice skill file is never displayed anywhere in this section. Only the `brand-review` skill file is shown in the collapsible. The reference is to a file the user cannot see on this page.

- [ ] **[General readability]** In the "How It All Fits Together" section (Part 3), the summary cards (lines 888--978) list items without explicit connection to the learning steps above. The "Quick win" card references "Profile preferences", "Project instructions", and "UK English skill (belt and braces)" -- the parenthetical should be "belt-and-braces" (hyphenated as a compound adjective, matching line 223 where it says "belt-and-braces"). Line 929 uses "belt and braces" without hyphens.

### No Issues

- UK English: Consistent throughout. Uses "organisation", "colour", "organise", "behaviour", "centre", "analyse", "customise" correctly, including within embedded skill file content.
- Currency: The UK English skill file correctly uses the pound sign and references GBP.
- Cross-references: Links to Section 1.4 and 1.5 use proper `<Link>` components with correct paths.
- PromptExample: The prompt prop contains only the prompt text. The description is correctly separated into the `description` prop.
- CodeBlock: Skill file contents are appropriate for copy buttons (users would paste these as skill files).

---

## RecurringTasksSection (`content/general/RecurringTasksSection.tsx`)

### Issues Found

- [ ] **[Copyable content — non-prompt text in prompt]** The `selfUpdatingSkillPrompt` (lines 252--269) is structured as a skill template rather than a paste-into-Claude prompt. It contains meta-instructions like `[task name]`, `[describe the task]`, `[Parameter 1]: [value]`, `[Step 1]`, etc. This is more of a template than a prompt. When copied and pasted into Claude verbatim, the bracketed placeholders would be meaningless. The PromptExample at line 539 does include a `context` prop that says "Replace the bracketed placeholders with your specific task details", which mitigates this issue. However, the title "Self-Updating Skill Template" and the nature of the content suggest this might be better presented as a `CodeBlock` (template) rather than a `PromptExample` (prompt), since it is not something you would paste directly into Claude as-is.

- [ ] **[Content continuity — cross-reference]** The "Related Sections" cross-reference for Pattern 4 (lines 650--654) says "For implementation details on Pattern 4 (external triggers), see the **Developer track**." This is a vague reference with no `<Link>` component. It does not specify which developer section covers external triggers. There is no dedicated developer section for "external triggers" -- the closest would be the general RecurringTasksSection itself (which is track: 'both'). This cross-reference may be a dead-end for the user.

- [ ] **[Content continuity — terminology]** The section uses "CoWork" (lines 97--123) to describe Anthropic's browser automation environment. This is introduced and explained well here, but the term "CoWork" does not appear in any other reviewed section. If CoWork is referenced elsewhere in the playbook (e.g., in MCP Usage or Skills/Extensions sections), the terminology should be consistent. This section provides a good introduction, but if a user arrives from another section expecting the term "computer use" or "browser automation", they may not immediately connect it.

- [ ] **[General readability]** The `taskIdentifierPrompt` (lines 307--320) ends with "Let's start with the first question -- what recurring tasks does your team handle?" which is Claude speaking to itself -- when pasted into Claude, Claude would read this as its own output instruction and respond by asking the user the question. This is correct prompt design. No issue here on re-examination.

- [ ] **[Component rendering]** The section uses a responsive layout with accordion on mobile (`block sm:hidden`) and cards on desktop (`hidden sm:block`) for the automation patterns (lines 387--419). The same `PatternContent` and `PatternCard` sub-components duplicate all the content. This is functionally correct but means the DOM contains two copies of all pattern content (one hidden by CSS). This is not a content issue per se but could affect performance on content-heavy pages.

### No Issues

- UK English: Consistent throughout. Uses "summarise", "analyse", "organised", "prioritise", "behaviour", "colour" correctly.
- Currency: No currency references (appropriate for this section).
- PromptExample usage: Prompts generally contain only prompt text. The `whenToUse` and `description` props are correctly separated.
- Cross-references: Links to Section 1.3 and 1.4 use proper `<Link>` components.

---

## ClaudeMdSection (`content/developer/ClaudeMdSection.tsx`)

### Issues Found

- [ ] **[Cross-references — not linked]** All cross-references to other sections use plain `<strong>` text or `<span>` rather than `<Link>` components. Specifically:
  - Line 566: "Section 1.9 -- Documentation Structure" is rendered as `<span className="font-medium text-foreground">` with no link.
  - Line 1039--1041: "Section 1.9 -- Documentation Structure" is rendered inside a `<strong>` tag with no link.
  - Line 442: Data string references "Section 1.9 covers setting up a /docs structure" as plain text.
  This is inconsistent with the general track sections (GovernancePolicySection, BrandVoiceSection, RecurringTasksSection) which all use `<Link>` components for cross-references. Developer track users cannot click to navigate to the referenced section.

- [ ] **[Copyable content]** The `COMPLETE_TEMPLATE` (lines 186--268), `MINIMAL_TEMPLATE` (lines 270--291), and `ASPNET_TEMPLATE` (lines 293--374) are rendered inside `<CodeBlock>` components. These templates contain placeholder text like `[Project Name]`, `[install command]`, `[One-line description]`. This is appropriate for templates -- the user is expected to fill these in. No issue with these being copyable. However, the code example snippets within the accordion sections (lines 65--126, the `claudeMdSections` data) also render inside `<CodeBlock>`. These example snippets contain illustrative content (e.g., "A learning management system built with ASP.NET Core and React, serving safeguarding training for UK organisations") that is not meant to be copied verbatim. A user might copy an example thinking it is a template. Consider adding a visual indicator or note distinguishing "examples" from "templates".

- [ ] **[Content continuity — IDE callout placement]** The "IDE alternatives" callout (lines 624--632) about Windsurf, Cursor, and Warp appears between the "Map, Not Encyclopedia" section and the "How to Structure a CLAUDE.md File" section, at the same level as both. It visually interrupts the flow between two related concepts. It would read more naturally if it were placed at the end of the section or within the opening section, rather than mid-flow.

- [ ] **[General readability]** The meta-narrative callout at the bottom (lines 1029--1035) uses a `CalloutCard variant="info"` without a title. Immediately below it (lines 1038--1042) is another `CalloutCard variant="info"` with the title "Next step". Having two adjacent info callouts with no separator between them may visually merge into one block. Consider combining them or adding a separator.

- [ ] **[Content continuity — section number reference]** The getting started step 5 (line 442) says "note that Section 1.9 covers setting up a /docs structure." This is correct -- Section 1.9 is DocumentationSection.

### No Issues

- UK English: Consistent throughout. Uses "initialise", "colour", "organisation", "organised", "behaviour" correctly.
- PromptExample: The two prompts ("Audit your CLAUDE.md" and "Capture session learnings") contain only prompt text in the `prompt` prop. Descriptions are correctly separated.
- Heading hierarchy: Follows a logical h2 > h3 progression throughout.

---

## DocumentationSection (`content/developer/DocumentationSection.tsx`)

### Issues Found

- [ ] **[Cross-references — not linked]** Same pattern as ClaudeMdSection. All cross-references use `<strong>` text rather than `<Link>` components:
  - Line 582: "Section 1.10 -- Codebase Mapping" is rendered as `<strong>` text, not a link.
  - Line 756--757: "context7 MCP (Section 1.14)" is rendered as `<strong>` text, not a link.
  This is inconsistent with the general track sections that use `<Link>` components.

- [ ] **[Content continuity — terminology]** Line 98 and lines 756--757 refer to "the context7 MCP (Section 1.14)". This is potentially misleading because:
  1. Section 1.14 is "Plugin Recommendations", not an MCP section. The MCP section is Section 1.13 ("Safe MCP Usage").
  2. context7 is described in the Plugins section (1.14) as a plugin, not as an MCP server. While context7 does have both an MCP server and a plugin form (as noted in McpUsageSection line 45), calling it "the context7 MCP" in a section about documentation may confuse users who then navigate to the Plugins section expecting MCP content.
  Consider clarifying: "the context7 plugin (Section 1.14)" or "the context7 tool (available as both a plugin and an MCP server -- see Section 1.13 and Section 1.14)".

- [ ] **[Content continuity — cross-reference to Section 1.10]** The getting started Phase 2 (line 191) says "Use the gsd-codebase-mapper (Section 1.10) to analyse your existing codebase". This correctly references Section 1.10 (Codebase Mapping). Good.

- [ ] **[Copyable content]** The `SCAFFOLD_COMMAND` (line 209) is a simple bash command -- appropriate for CodeBlock. The `CLAUDE_MD_POINTERS` (lines 212--220) is a markdown snippet intended to be pasted into CLAUDE.md -- appropriate for CodeBlock. The architecture and conventions templates are all appropriate for copying. The Doc Gardening Prompt (line 683) is rendered as a `PromptExample` and contains only prompt text -- correct. No issues with copyable content.

- [ ] **[General readability]** The `llms.txt` callout at the very end of the section (lines 747--758) is not separated from the preceding "Copyable Templates" section by a `<Separator />`. All other major sections use separators between them. This callout appears to float at the end without visual distinction from the templates section above it.

### No Issues

- UK English: Consistent throughout. Uses "organisation", "behaviour", "organised", "minimise" correctly.
- Currency: No currency references (appropriate).
- Heading hierarchy: Logical h2 > h3 > h4 progression throughout.
- Content flow: The progressive disclosure concept is well-explained and connects logically to CLAUDE.md (Section 1.8) and Codebase Mapping (Section 1.10).

---

## CodebaseMappingSection (`content/developer/CodebaseMappingSection.tsx`)

### Issues Found

- [ ] **[Cross-references — not linked]** Same pattern as ClaudeMdSection and DocumentationSection. Cross-references use `<strong>` text rather than `<Link>` components:
  - Line 689: "the /docs structure described in Section 1.9" is plain text, not a link.
  - Line 773: "Section 1.9 -- Documentation Structure" is rendered as `<strong>` text, not a link.
  This is inconsistent with the general track sections.

- [ ] **[Content continuity — cross-reference accuracy]** The callout at line 402 says "For Phew!" and mentions "WordPress site, an ASP.NET/C# application, or a new project". The reference to WordPress is not corroborated by other sections in the playbook (which focus on ASP.NET/C# and web development). If Phew! does have WordPress sites, this is fine; if not, it could be confusing. The source context documents would clarify this, but within the playbook content itself, this is the only mention of WordPress in the reviewed developer sections.

- [ ] **[Copyable content]** The `FLOW_DIAGRAM` (lines 299--317) is rendered inside a `<CodeBlock>`. This is a visual diagram showing the parallel agent architecture, not code or configuration that a user would copy and paste. Having a copy button on a visual diagram is slightly misleading -- copying the box-drawing characters would not be useful. However, this is a minor issue since the CodeBlock is used for its formatting, and the copy button is unobtrusive.

- [ ] **[General readability]** The "Common Mapper Inaccuracies" callout (lines 413--449) is placed between the opening section and "The 7 Output Documents" section without a `<Separator />` before it. It visually belongs to the opening section but is structurally a standalone callout at the same level as the sections. This creates a slight visual flow issue. It reads well, but is not wrapped in a `<section>` element like the other content blocks.

- [ ] **[Content continuity]** The section mentions "200k token context" (line 557) when describing agents. This is consistent with the terminology used elsewhere in the playbook (e.g., SessionManagementSection uses "200,000-token context window", ContextSimulatorSection uses "200,000 tokens"). The abbreviation "200k" is slightly inconsistent with the more formal "200,000" used in other sections, but this is minor and appropriate for a developer audience.

- [ ] **[General readability — step 2 missing period]** Getting started step 2 (line 329) says "Execute /gsd:map-codebase. Optionally specify a focus area: /gsd:map-codebase api" -- this line is missing a trailing period. All other step descriptions end with periods.

### No Issues

- UK English: Consistent throughout. Uses "organised", "organisation" correctly.
- Currency: No currency references (appropriate).
- Heading hierarchy: Logical h2 progression throughout.
- Content flow: Logical progression from "what it is" to "what it produces" to "how it works" to "how to run it" to "how the output connects to /docs".
- No PromptExample components used in this section.

---

## Cross-Cutting Issues (Affecting Multiple Components)

### Issues Found

- [ ] **[Cross-references — systemic inconsistency]** All three developer track sections (ClaudeMdSection, DocumentationSection, CodebaseMappingSection) use `<strong>` text for cross-references to other sections. All three general track sections (GovernancePolicySection, BrandVoiceSection, RecurringTasksSection) use `<Link>` components with correct routing. This is a systemic inconsistency that should be standardised. Developer track sections should import `Link` from `react-router` and use it for cross-references, matching the general track pattern.

- [ ] **[Content continuity — "context window" terminology]** Terminology is largely consistent across sections. "Context window" is the standard term used throughout. The one variation is "200k token context" in CodebaseMappingSection (line 557) vs "200,000-token context window" in other sections. Minor but worth standardising.

- [ ] **[Content continuity — Section 1.8 to 1.9 to 1.10 learning progression]** The three developer sections reviewed form a natural sequence: CLAUDE.md files (1.8) introduce the "map, not encyclopedia" principle and point to /docs; Documentation Structure (1.9) explains the /docs structure and references the codebase mapper; Codebase Mapping (1.10) explains the mapper tool and references /docs. This chain is well-constructed and cross-references are accurate. The learning progression is sound.

- [ ] **[Content continuity — general to developer progression]** The general track sections (GovernancePolicySection, BrandVoiceSection, RecurringTasksSection) correctly use track-aware rendering to show/hide developer-specific content. GovernancePolicySection filters sections by track. BrandVoiceSection shows platform-specific tabs. RecurringTasksSection is the same for both tracks. The developer track sections (ClaudeMdSection, DocumentationSection, CodebaseMappingSection) are developer-only by nature. No contradictions found between the tracks.

- [ ] **[Content continuity — skill terminology]** "Skills" is used consistently across all sections to mean Claude skill files (SKILL.md). GovernancePolicySection references skills in the risk tiers and technical standards. BrandVoiceSection references the uk-english and brand-review skills. RecurringTasksSection references building skills for recurring tasks. ClaudeMdSection focuses on CLAUDE.md but mentions skills tangentially. This is consistent.
