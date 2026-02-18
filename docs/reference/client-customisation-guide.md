# Developer Track -- Per-Client Customisation Guide

This guide is for consultants preparing a new client deployment of the AI SMB Playbook. It documents which developer track sections need content rewriting per client, and which are universally applicable.

## Customisation Categories

Developer track sections fall into three categories:

1. **Fully parameterised** -- content adapts automatically via `useSiteConfig()`. No manual changes needed.
2. **Mostly parameterised** -- main content adapts via config fields, but some examples, prompts, or recommendations reference specific technologies or services. Review and optionally adjust.
3. **Universally applicable** -- content is framework-agnostic and contains no client-specific references. No changes needed regardless of client.

For each section below, the guide lists exactly which `siteConfig` fields drive the parameterisation, what still requires manual review, and the estimated effort.

---

## Section-by-Section Guide

### 1. CLAUDE.md Files (`claude-md`) -- Category 1 + 3

**What it covers:** What CLAUDE.md files are, the "map not encyclopedia" principle, how to structure a CLAUDE.md, best practices, the claude-md-management plugin, getting started steps, and copyable templates.

**Parameterisation:**
- Calls `useSiteConfig()` and passes the config to `getClaudeMdSections()`.
- Fields used: `primaryProduct`, `primaryProductDescription`, `techStack`, `complianceArea`.
- These fields are interpolated into the example CLAUDE.md section content (project description example).

**What may need manual review:**
- The copyable templates (`COMPLETE_TEMPLATE`, `MINIMAL_TEMPLATE`, `ASPNET_TEMPLATE`) are hardcoded strings using generic project examples (Node.js/React, ASP.NET). They are intentionally generic and serve as starting points, so they work for any client. However, if a client's stack is notably different (e.g. Python/Django, Ruby on Rails), you may wish to add or swap template tabs.
- The ASP.NET template tab is included because the original client (Phew Design) uses .NET. For clients with no .NET exposure, this tab is still useful as a reference but could optionally be hidden via the sections config.

**Effort:** None for most clients. 15 minutes if you want to add a stack-specific template tab.

---

### 2. Documentation Structure (`documentation`) -- Category 3

**What it covers:** Why documentation structure matters for AI, the recommended `/docs` directory layout, progressive disclosure, getting started phases, maintenance levels, what not to document, and copyable templates.

**Parameterisation:**
- Does **not** call `useSiteConfig()`.
- Uses `useTrack()` for navigation links only.

**What may need manual review:**
- Nothing. The content is entirely framework-agnostic. It covers directory structures (`docs/architecture/`, `docs/conventions/`, etc.), documentation principles, and templates that apply to any tech stack.
- The architecture templates include both Node.js/React and ASP.NET/C# tabs, which are generic enough for any client.

**Effort:** None.

---

### 3. Codebase Mapping (`codebase-mapping`) -- Category 3

**What it covers:** The GSD Codebase Mapper tool, its 7 output documents, the 4-agent parallel architecture, how to run it, connecting output to the `/docs` structure, and how other commands use the output.

**Parameterisation:**
- Does **not** call `useSiteConfig()`.
- Uses `useTrack()` for navigation links only.

**What may need manual review:**
- The section describes the `gsd-codebase-mapper` command (`/gsd:map-codebase`), which is part of the starter kit. If the client will not receive the GSD Mapper in their starter kit, this section would need adjustment or could be disabled via the sections config.
- The example snippets in the 7 output documents (STACK.md, INTEGRATIONS.md, etc.) use generic examples (Next.js, Stripe, PostgreSQL). These are illustrative and do not need client-specific adjustment.
- One callout mentions "WordPress site, an ASP.NET/C# application" as examples -- this is slightly tailored to the original client but reads naturally for any web development agency.

**Effort:** None for most clients. If the client will not use the GSD Mapper, consider disabling this section entirely rather than rewriting it.

---

### 4. Avoiding Hallucinations (`hallucinations`) -- Category 1

**What it covers:** Seven anti-hallucination patterns for developers, each with explanatory text and a copyable prompt template, plus the combined "agent harness" workflow.

**Parameterisation:**
- Calls `useSiteConfig()` and passes the full config to `getPatterns()`.
- Fields used: `testingTool`, `testingToolDocs`, `primaryProduct`, `complianceArea`, `sensitiveDataLabel`, `techStack`, `database`, `domainSpecificForm`.
- These fields are heavily interpolated throughout the 7 prompt templates. For example:
  - Pattern 1 references `domainSpecificForm` ("migrate the [form] from legacy ASP.NET...")
  - Pattern 3 references `complianceArea`, `primaryProduct`, `techStack`, `database`
  - Pattern 4 references `sensitiveDataLabel`
  - Pattern 5 references `testingTool`, `testingToolDocs`
  - Pattern 7 references `complianceArea`

**What may need manual review:**
- Pattern 1's prompt references "legacy ASP.NET Web Forms" to "Razor Pages migration" as the example task. While `domainSpecificForm` is parameterised, the ASP.NET framing is hardcoded. For a client on a completely different stack (e.g. Python), this prompt example would feel out of place.
- Pattern 4's prompt references "ASP.NET Core Identity" and "OWASP authentication guidelines" -- these are hardcoded, not parameterised.
- Pattern 6's prompt references "WordPress site" and ".NET CRM system via a REST API" -- these are hardcoded and specific to the original client's ecosystem.
- The explanatory prose for each pattern is universally applicable; only the prompt templates contain these hardcoded references.

**Effort:** Low to moderate. The `siteConfig` fields handle most personalisation automatically. If the client has no .NET or WordPress exposure, review patterns 1, 4, and 6 to swap the technology references in the example prompts. Approximately 20--30 minutes.

---

### 5. AI-Driven Regression Testing (`regression-testing`) -- Category 2

**What it covers:** The shifting testing landscape, current AI testing capabilities (CoWork, Playwright MCP, Computer Use API), comparison with the client's existing tool, integration approaches, practical starting points, limitations, and copyable prompts.

**Parameterisation:**
- Calls `useSiteConfig()` and passes the config to `getGettingStartedSteps()` and `getLimitations()`.
- Fields used: `testingTool`, `testingToolDocs`, `primaryProduct`, `techStack`.
- `testingTool` is referenced extensively -- it appears in section headings, comparison table headers, getting started steps, limitation notes, and multiple prompt templates (e.g. "Migrate a [testingTool] Test").
- `primaryProduct` and `techStack` appear in the prompt examples.

**What may need manual review:**
- The comparison table (`comparisonRows`) compares AI-driven testing against "existing tool" generically. The column headers use `siteConfig.testingTool`, but the row content (e.g. "Built-in browser extension recorder", "Subscription-based per test run") describes a tool like Ghost Inspector. If the client uses a different testing paradigm (e.g. Cypress, Selenium, or no testing tool at all), these row descriptions need updating.
- The "Integration Approaches" section (conservative and progressive tabs) references `siteConfig.testingTool` throughout, which auto-adapts.
- The prompt examples reference the training module creation flow (`primaryProduct` admin dashboard) -- if the client's domain is very different, these examples may feel generic.
- If the client has **no existing regression testing tool**, the entire comparison framing needs rethinking. Consider disabling this section or rewriting the introduction.

**Effort:** Low if the client uses a similar browser-based testing tool (the `testingTool` field handles naming). Moderate (30--45 minutes) if the client uses a fundamentally different testing approach or has no testing tool.

---

### 6. Safe MCP Usage (`mcp-usage`) -- Category 2

**What it covers:** What MCP servers are, context window cost, configuration, recommended MCPs, discovering MCP servers, safety considerations, troubleshooting, and MCP vs other extension options.

**Parameterisation:**
- Calls `useSiteConfig()` and passes the config to `getRecommendedMcps()`.
- Fields used: `webApplications`, `testingTool`.
- `webApplications` is interpolated into the Playwright MCP's "why it matters" description.
- `testingTool` is referenced in the Playwright MCP description.

**What may need manual review:**
- The "Recommended MCPs" section currently recommends exactly 2 servers: **deepwiki** and **Playwright (chrome-devtools)**. This is a curated list -- for a client that does not build web applications, Playwright may be less relevant. For a client that uses specific services (e.g. a CRM, an ERP), additional MCP server recommendations might be warranted.
- The "Discovering MCP Servers" section and all other content (context cost, configuration, safety, troubleshooting) are universally applicable.
- The generic templates (`GENERIC_HTTP_TEMPLATE`, `GENERIC_STDIO_TEMPLATE`) and the safety checklist (`SAFETY_CHECKLIST`) are framework-agnostic.

**Effort:** Low. Review the recommended MCPs list (5--10 minutes). Add client-specific MCP recommendations if their toolchain warrants it (15--20 minutes per additional recommendation).

---

### 7. Plugin Recommendations (`plugins`) -- Category 3

**What it covers:** What plugins are, installing vs copying, context cost, a catalogue of 14 plugins across 5 categories, official vs third-party marketplaces, plugin management, and the recommended starter set.

**Parameterisation:**
- Does **not** call `useSiteConfig()`.
- Uses `useTrack()` for navigation links only.

**What may need manual review:**
- The plugin catalogue is hardcoded with 14 specific plugins. Most are universally applicable (commit-commands, pr-review-toolkit, security-guidance, claude-md-management, etc.).
- The **php-lsp** plugin is included because the original client works with WordPress/PHP. For a client with no PHP exposure, this plugin is irrelevant. It would not cause confusion (it is in the "Language & Code Intelligence" category with a clear description), but you may wish to add LSP plugins for the client's actual languages instead (e.g. a C# LSP for .NET clients).
- The **recommended starter set** (`BATCH_INSTALL`) includes `php-lsp` and `github`. Adjust this list to match the client's actual toolchain.
- The **plugin approval checklist** (`APPROVAL_CHECKLIST`) is universally applicable.
- One plugin description mentions "Particularly relevant for your WordPress work" -- this is hardcoded and specific to the original client.

**Effort:** Minimal. Review the recommended starter set and the php-lsp inclusion (10--15 minutes). Swap language-specific plugins as needed.

---

### 8. Codebase Auditing & Technical Debt (`technical-debt`) -- Category 3

**What it covers:** Why audit with AI, the audit workflow, multi-file cross-reference analysis, 6 focused audit prompts (security, performance, dependencies, architecture, test coverage, code quality), a quick health check, technical debt documentation, prioritisation, remediation, architecture drift detection, and ongoing maintenance.

**Parameterisation:**
- Does **not** call `useSiteConfig()`.
- Uses `useTrack()` for navigation links only.

**What may need manual review:**
- Nothing. All audit prompts are intentionally framework-agnostic. They reference generic patterns (package.json, NuGet, Composer, npm) to cover multiple ecosystems.
- The quick health check prompt explicitly mentions "NuGet packages (ASP.NET/C#) or Composer/npm packages (WordPress)" -- this covers a broad range but is slightly tilted toward the original client's stack. For a client using only Python/pip, this parenthetical could be adjusted, but it does not break anything.
- The debt documentation format, prioritisation framework, and remediation approach are all universally applicable.

**Effort:** None.

---

## Summary Table

| Section | Slug | Category | Auto-Parameterised Fields | Manual Review Needed | Effort |
|---------|------|----------|--------------------------|---------------------|--------|
| CLAUDE.md Files | `claude-md` | Fully parameterised | `primaryProduct`, `primaryProductDescription`, `techStack`, `complianceArea` | Template tabs (optional) | None |
| Documentation Structure | `documentation` | Universal | -- | None | None |
| Codebase Mapping | `codebase-mapping` | Universal | -- | GSD Mapper availability | None |
| Avoiding Hallucinations | `hallucinations` | Fully parameterised | `testingTool`, `testingToolDocs`, `primaryProduct`, `complianceArea`, `sensitiveDataLabel`, `techStack`, `database`, `domainSpecificForm` | Hardcoded ASP.NET/WordPress refs in patterns 1, 4, 6 | Low |
| Regression Testing | `regression-testing` | Mostly parameterised | `testingTool`, `testingToolDocs`, `primaryProduct`, `techStack` | Comparison table row content, prompt domain examples | Low |
| Safe MCP Usage | `mcp-usage` | Mostly parameterised | `webApplications`, `testingTool` | Recommended MCP server list | Low |
| Plugin Recommendations | `plugins` | Universal | -- | php-lsp inclusion, starter set list | Minimal |
| Code Auditing & Debt | `technical-debt` | Universal | -- | None | None |

---

## Bottom Line

For a client with a **similar tech stack** (web development agency, mixed .NET/WordPress/JS):
- Zero manual work needed. The `siteConfig` fields handle all personalisation.

For a client with a **different tech stack** (e.g. Python shop, mobile development, data engineering):
- Expect **30--60 minutes** reviewing the "mostly parameterised" sections (regression testing, MCP usage, hallucinations prompt examples).
- Expect **10--15 minutes** adjusting the plugin recommendations (swap php-lsp, update the starter set).
- The remaining 4 sections (documentation, codebase mapping, CLAUDE.md, technical debt) require no manual effort.

The highest-effort item is the **regression testing** section if the client has no existing browser-based testing tool, as the entire comparison framing assumes one exists. In that case, consider disabling the section via the `sections.disabled` config array rather than rewriting it.
