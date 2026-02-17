# UX Review: Developer Track (Matt Bushby's Perspective)

## Evaluator Profile
Matt Bushby, full-stack developer at Phew Design Limited. ASP.NET/C#, WordPress, some React. Has Claude Code via IDE but hasn't configured CLAUDE.md, MCP servers, or skills yet. Training recommendation: "Start with CLAUDE.md files across all projects immediately."

## Overall Developer Track Quality: 7.5/10

---

## Section-by-Section Review

### 1. CLAUDE.md Files (1.8)
**Verdict: GOOD**
- **Key strength:** Extremely practical. Getting-started steps, two templates (complete/minimal), quality scoring criteria, file types table. Could have a working CLAUDE.md in 15 minutes. "Map not encyclopedia" principle well articulated.
- **Key problem:** Complete template defaults to React/Node/TypeScript stack. Examples lean heavily towards that world. For ASP.NET/C# and WordPress, only one brief mention of `dotnet run`. Need an ASP.NET-flavoured template.
- **Quick fix:** Add a third tab in Copyable Templates: "ASP.NET / C# Template" with `.csproj`, `dotnet` commands, and `appsettings.json` references.

### 2. Documentation Structure (1.9)
**Verdict: GOOD**
- **Key strength:** Progressive disclosure flow diagram shows exactly how CLAUDE.md and /docs work together at runtime. "What NOT to document" list prevents over-documentation. Maintenance levels (manual, agent-driven, CI-based) give clear growth path.
- **Key problem:** `docs/references/` mentions llms.txt files and context7 MCP but doesn't explain how to obtain/create llms.txt for ASP.NET Core or WordPress. References "Section 1.14" which doesn't exist in dev track numbering.
- **Quick fix:** Add 2-3 lines under `docs/references/` explaining where to find llms.txt files.

### 3. Codebase Mapping (1.10)
**Verdict: GOOD**
- **Key strength:** 4-agent parallel architecture diagram and mapper-to-docs mapping table are excellent. Makes the tool immediately understandable. "When to use" vs "when to skip" boxes are practical.
- **Key problem:** No guidance on what happens when the mapper gets things wrong. Says "review each document for accuracy" but doesn't say what kinds of errors to expect (hallucinated file paths, incorrect dependency versions).
- **Quick fix:** Add a "Common Mapper Inaccuracies" callout listing top 3-4 things to verify.

### 4. Avoiding Hallucinations (1.11)
**Verdict: GOOD**
- **Key strength:** Seven patterns well-structured and practical. Pattern 5 ("Give Claude an Out") and Pattern 7 ("Validate Against Existing Code First") directly address real problems. Agent harness combining all patterns into structured workflow is genuinely useful. Prompts use Phew-relevant examples (ASP.NET, safeguarding, WordPress/CRM).
- **Key problem:** Prompts are long. No mention of saving patterns as reusable skills or commands, or storing as prompt templates in the starter kit.
- **Quick fix:** Add a callout suggesting developers save most-used patterns as Claude Code skills or slash commands, with pointer to relevant starter kit directory.

### 5. AI-Driven Regression Testing (1.12)
**Verdict: NEEDS WORK**
- **Key strength:** Honest limitations section is excellent — refreshingly candid. Ghost Inspector comparison table is practical decision-making material. "Do not cancel Ghost Inspector yet" shows good judgment.
- **Key problem:** Covers too many tools (CoWork, Playwright MCP, Computer Use API) without enough depth on any. No setup guide, no configuration, no indication of how to actually start. Points to Section 1.13 for Playwright MCP but that section doesn't give a step-by-step walkthrough either. Doesn't mention actual test stack or ASP.NET integration.
- **Quick fix:** Cut Computer Use API to 2 lines. Use freed space for concrete "your first Playwright test" walkthrough with actual commands: install, configure, write test, run it.

### 6. Safe MCP Usage (1.13)
**Verdict: GOOD**
- **Key strength:** Context cost section critically important and well-presented. Warning about silent MCP disconnections saves real debugging time. Safety checklist is practical. Troubleshooting accordion covers actual problems.
- **Key problem:** Only two MCPs recommended (deepwiki and Playwright). No database MCP, no file system watchers. No guidance on discovering new MCP servers or evaluating whether one is worth the context cost.
- **Quick fix:** Add "Discovering MCP Servers" subsection with 2-3 starting points: official Anthropic MCP directory, npm `@modelcontextprotocol/*` packages, MCP community registry.

### 7. Plugin Recommendations (1.14)
**Verdict: GOOD**
- **Key strength:** Comprehensive catalogue well-organised by category. Batch install command block immediately useful. Approval checklist and official-vs-third-party comparison show good governance thinking. Context cost breakdown (green/amber dots) is smart visual pattern.
- **Key problem:** `php-lsp` recommended for WordPress but no equivalent for C#/ASP.NET (OmniSharp). Feels written with only WordPress side of Phew in mind.
- **Quick fix:** Add note under Language & Code Intelligence acknowledging C#/OmniSharp LSP plugin not yet available as official plugin but worth watching for, or provide guidance on configuring custom LSP MCP for C# projects.

### 8. Codebase Auditing & Technical Debt (1.15)
**Verdict: GOOD**
- **Key strength:** Six audit types with full prompts immediately usable. Debt documentation format (issue, files, why, impact, fix approach) structured and actionable. Prioritisation framework (P1-P4) adoptable straight away. Architecture drift detection prompt particularly valuable for older projects.
- **Key problem:** All six audit prompts very long (10+ focus areas each). No "quick audit" option — just comprehensive ones. No mention of how long these take or how much context they consume.
- **Quick fix:** Add "Quick Health Check" prompt covering top 3-4 most common issues across all categories in single shorter prompt.

---

## Top 3 Issues Across All Sections

### 1. ASP.NET/C# Stack Under-Represented
Templates, examples, and tool recommendations lean heavily towards Node/TypeScript/React. Phew works primarily in ASP.NET/C# and WordPress. The CLAUDE.md template, CodebaseMapping examples, plugin recommendations (php-lsp but no csharp-lsp) all show JS ecosystem bias. Needs consistent attention across multiple sections.

### 2. Prompts Are Long and Lack "Quick Start" Path
Audit prompts, hallucination patterns, and test generation prompts are thorough but lengthy. Developers are more likely to use a short prompt first, then go deeper. Every section with prompts should have a "quick version" alongside the comprehensive one.

### 3. Setup Walkthroughs Stop Short of End-to-End
Regression testing describes three approaches but doesn't walk through running a test. MCP section configures servers but doesn't show complete workflow. Codebase mapping runs command but doesn't show what to do when output is wrong. Sections need to close the loop from "here is what it is" to "here is what you do when it doesn't work perfectly."

---

## Missing Content Matt Would Expect

1. **A section on using Claude Code with ASP.NET/C# projects specifically.** Even a short one covering `dotnet` commands in CLAUDE.md, NuGet dependency handling, `.csproj` and `appsettings.json` patterns, and Razor Pages conventions.
2. **Guidance on context window management during long sessions.** Several sections mention context cost but none address: "my session is getting slow and Claude is forgetting things — what do I do?" A section on session hygiene would be immediately useful.
3. **A worked example end-to-end.** Take one actual project (e.g., the LMS), show creating the CLAUDE.md, running the mapper, doing a quick audit, fixing one debt item. Narrative walkthrough across sections would tie everything together.

---

## Recommended Priority Order for Fixes

1. **Add ASP.NET/C# templates and examples** across ClaudeMdSection, CodebaseMappingSection, and PluginsSection. Highest-impact change — makes content directly usable for half the work without mental translation.
2. **Add "quick start" versions of the long prompts** in HallucinationsSection and TechnicalDebtSection. Lower the barrier to actually using the content.
3. **Complete the regression testing walkthrough** in RegressionTestingSection. Cut Computer Use API, add concrete first-test walkthrough.
4. **Add MCP discovery guidance** in McpUsageSection and C# LSP note in PluginsSection.
5. **Add "Common Mapper Inaccuracies" callout** in CodebaseMappingSection. Small change, big time-saver.
6. **Add llms.txt sourcing guidance** in DocumentationSection. Quick addition that prevents confusion.
