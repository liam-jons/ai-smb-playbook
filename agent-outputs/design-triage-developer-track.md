# Design Triage: Developer Track Pages (Consolidated)

**Date:** 2026-02-17
**Scope:** 7 developer track pages -- lightweight source-code-only triage
**Context:** These pages will undergo significant content rewriting during templatisation. Focus is on (a) pre-templatisation fixes and (b) critical UX issues.

---

## Summary Table

| Page | Verdict | CalloutCards (info/tip : warning/important) | bg-muted containers | Client-Specific Content | Key Issues |
|------|---------|---------------------------------------------|---------------------|------------------------|------------|
| Documentation Structure | Cross-page fixes sufficient | 5 info/tip : 1 important | 0 | 3 instances ("For Phew!", ASP.NET templates) | ASP.NET templates are reusable examples, not hardcoded client content |
| Codebase Mapping | Cross-page fixes sufficient | 2 info : 0 | 1 (bg-muted/30) | 3 instances ("For Phew!", ASP.NET/WordPress refs) | Low severity -- all in contextual callouts |
| Avoiding Hallucinations | Cross-page fixes sufficient | 1 tip : 2 important | 2 (bg-muted/30) | Heavy -- 7 prompts reference ASP.NET, LMS, safeguarding, Ghost Inspector, WordPress | All in prompt examples; templatisation will replace |
| Regression Testing | Cross-page fixes sufficient | 1 tip, 2 info : 1 warning | 0 | Very heavy -- Ghost Inspector throughout (16+ refs), Phew! (4), LMS/ASP.NET in prompts | Entire page structured around Ghost Inspector comparison |
| Safe MCP Usage | Cross-page fixes sufficient | 3 info : 3 warning | 1 (bg-muted/20) | Medium -- "Phew!" (3), Ghost Inspector, LMS/PDMS/Audit System, WordPress/ASP.NET | Hardcoded "Recommended MCPs for Phew!" heading |
| Plugin Recommendations | Cross-page fixes sufficient | 2 info : 1 important | 0 | Medium -- "Phew!" (5), WordPress refs in plugin descriptions | Plugin descriptions are product-specific, not client-specific |
| Technical Debt | Cross-page fixes sufficient | 2 info, 1 tip : 0 | 0 | Light -- "Phew!" (1), ASP.NET/WordPress in prompt template | Mostly generic; templatisation-ready |

---

## Per-Page Details

### 1. Documentation Structure
**File:** `app/src/content/developer/DocumentationSection.tsx` (777 lines)

**CalloutCards (6 total):**
- 4x `info` (role="note") -- correct
- 1x `tip` (role="note") -- correct
- 1x `important` (role="alert") -- correct

**Dark mode bg-muted:** Only on inline `<code>` elements (line 451). No container-level bg-muted concerns.

**Client-specific content:**
- Line 421: `title="For Phew!"` -- callout with Phew-specific encouragement
- Line 634: `Recommendation for Phew!:` -- maintenance level recommendation
- Lines 303-356: ASP.NET architecture/conventions templates -- these are **reusable examples** shown in tabs alongside Node.js. They demonstrate stack variety and are appropriate for templatisation as-is.

**Page-specific issues:** None critical. The page is well-structured with good progressive disclosure via accordions and tabs. The ASP.NET templates are a strength, not a liability -- they show the documentation approach works across stacks.

**Verdict: Cross-page fixes sufficient.** Replace "For Phew!" callout titles/content with parameterised equivalents during templatisation.

---

### 2. Codebase Mapping
**File:** `app/src/content/developer/CodebaseMappingSection.tsx` (793 lines)

**CalloutCards (3 total):**
- 2x `info` (role="note") -- correct
- 1x `important` (role="alert") at line 416 -- "Common Mapper Inaccuracies" -- **standalone CalloutCard not nested in a section**, placed between two `<section>` elements. Structurally unusual but not a bug.

**Dark mode bg-muted:** Line 669: `bg-muted/30` on "When to skip" container. This is the I4 pattern -- low contrast in dark mode. However, this already has a `border-border` which provides visual distinction.

**Client-specific content:**
- Line 354: `the primary use case for Phew!` -- in "when to use" list
- Line 405: `title="For Phew!"` -- callout
- Line 407: `WordPress site, an ASP.NET/C# application` -- stack references in the Phew callout

**Page-specific issues:** None critical. The ASCII flow diagram (FLOW_DIAGRAM constant) is well-done. Seven accordion items for output documents provide good scannability.

**Verdict: Cross-page fixes sufficient.** Parameterise client references in callouts.

---

### 3. Avoiding Hallucinations
**File:** `app/src/content/developer/HallucinationsSection.tsx` (533 lines)

**CalloutCards (3 total):**
- 1x `tip` (role="note") -- correct
- 2x `important` (role="alert") -- both appropriate (one is about selective usage, one introduces the harness)

**Dark mode bg-muted:**
- Line 300: `bg-muted/30` on mini-nav "On this page" section
- Line 363: `bg-muted` on non-active harness step numbers (conditional)
- Line 422: `bg-muted/30` on key takeaways container

The mini-nav and takeaways containers are low-contrast in dark mode. Both have `border-border` which mitigates.

**Client-specific content (HEAVY):**
All 7 prompt examples contain Phew-specific scenarios:
1. "safeguarding audit form", "ASP.NET Web Forms", "Razor Pages"
2. "LMS admin dashboard"
3. "safeguarding training in the LMS", "ASP.NET/C# with SQL Server"
4. "ASP.NET application", "ASP.NET Core Identity", "ISO 27001"
5. "Ghost Inspector", "SSO authentication"
6. "WordPress site's contact form", ".NET CRM system"
7. "safeguarding audit reports", "/Controllers/", "/Services/"

This is the most heavily client-specific page. However, all instances are within **prompt template examples** -- the instructional prose around them is generic and reusable. Templatisation should replace the prompt scenarios with parameterised or industry-neutral alternatives.

**Page-specific issues:**
- The `PatternCard` sub-component uses `<h3>` inside `<section>` without an `<h2>` parent -- the `aria-labelledby` on `<section>` points to the `<h3>` id. This is semantically valid but unusual heading hierarchy.
- The Collapsible follow-up prompt pattern (Pattern 6) is good UX -- reveals complexity progressively.

**Verdict: Cross-page fixes sufficient.** The prompts need full replacement during templatisation, but the page structure and instructional content are solid.

---

### 4. AI-Driven Regression Testing
**File:** `app/src/content/developer/RegressionTestingSection.tsx` (654 lines)

**CalloutCards (4 total):**
- 1x `tip` (role="note") -- correct
- 2x `info` (role="note") -- correct, both inside TabsContent (conservative/progressive approaches)
- 1x `warning` (role="alert") -- correct ("Honest Limitations")

**Dark mode bg-muted:** None at container level.

**Client-specific content (VERY HEAVY -- most of any page):**
- **Ghost Inspector:** 16+ references throughout. The entire comparison table, integration approaches, getting-started steps, and prompts are structured around a Ghost Inspector migration narrative.
- **Phew!:** 4 direct references ("Phew!'s current needs", "practical path for Phew!", two "Phew! starting point:" callouts)
- **LMS/ASP.NET:** In prompt examples (Playwright test prompt references "LMS application (ASP.NET/C#)")
- **Ghost Inspector migration prompt:** Lines 615-625 are entirely about Ghost Inspector

This page has the highest templatisation burden. The Ghost Inspector comparison is the page's structural backbone, not just a detail. Templatisation will need to either:
(a) Replace "Ghost Inspector" with a parameterised `{existingTestTool}` variable, or
(b) Rewrite the page around a generic "existing test tool vs AI-driven" framing

**Page-specific issues:**
- The comparison table (lines 339-378) is a plain HTML table with good semantic markup (thead, th scope="col"). No accessibility issues.
- The Tabs component for integration approaches (conservative/progressive) works well.

**Verdict: Cross-page fixes sufficient** for design/UX. Content templatisation will require significant rewriting of the comparison narrative, but no structural or interactive design changes needed.

---

### 5. Safe MCP Usage
**File:** `app/src/content/developer/McpUsageSection.tsx` (812 lines)

**CalloutCards (6 total):**
- 3x `info` (role="note") -- correct
- 3x `warning` (role="alert") -- all appropriate (context window warning, credential warning, silent failures warning)

**Dark mode bg-muted:**
- Line 254: `bg-muted/20` on the architecture diagram container. This is a visual element showing Context7 / Claude Code / Playwright connections. At 0.20 opacity on muted, this may be very subtle in dark mode.

**Client-specific content:**
- Line 35: "WordPress plugins, ASP.NET libraries" -- in deepwiki description
- Line 54: "Phew! builds web applications (LMS, Audit System, PDMS)" -- Playwright description
- Line 54: "Ghost Inspector workflows" -- in Playwright description
- Line 410: ".NET, C#" -- in Node.js requirement callout (this is actually generic/reusable advice)
- Line 450: "Recommended MCPs for Phew!" -- section heading
- Line 470: "Why it matters for Phew!:" -- repeated per MCP entry

**Page-specific issues:**
- The architecture diagram (lines 254-273) is a custom flex layout, not a true diagram component. It uses directional arrows (`&larr;`, `&rarr;`, `&uarr;`, `&darr;`) with responsive switching between horizontal (sm+) and vertical (mobile) layout. This is clever but the arrows are plain text, not visually distinctive. The "tools feel distinct" principle is only mildly violated -- this is informational, not interactive.
- The Accordion for troubleshooting (lines 718-733) is good pattern.

**Verdict: Cross-page fixes sufficient.** Parameterise "Phew!" references and tool-specific mentions.

---

### 6. Plugin Recommendations
**File:** `app/src/content/developer/PluginsSection.tsx` (911 lines)

**CalloutCards (3 total):**
- 2x `info` (role="note") -- correct
- 1x `important` (role="alert") -- correct (starter kit reference copies warning)

**Dark mode bg-muted:** None at container level.

**Client-specific content:**
- Line 97: "all of Phew!'s web applications" -- security-guidance plugin description
- Line 174: "If Phew! uses or plans to use Sentry" -- sentry plugin
- Line 187: "If Phew! uses Asana" -- asana plugin
- Line 200: "Particularly relevant for Phew!'s WordPress work" -- php-lsp
- Line 283: "Recommended starter set for Phew! developers" -- batch install comment

The plugin descriptions themselves (what each plugin does, capabilities, install commands) are **product-specific, not client-specific** -- they describe real Claude Code plugins. The Phew! references are in contextual "when to use" guidance. The "Other Recommended Tools" section (Mintlify, agent-browser) is also generic.

**Page-specific issues:**
- The plugin catalogue with nested Accordion inside Tabs (Browse Catalogue / Quick Reference) is a complex UI pattern. It works well -- the Browse view gives detail, Quick Reference gives scannable table.
- The `bg-primary/5` highlight on the "Install via marketplace" row (line 373) is a nice touch for the recommended option.

**Verdict: Cross-page fixes sufficient.** Parameterise "Phew!" mentions in whenToUse descriptions. Plugin data itself is reusable.

---

### 7. Codebase Auditing & Technical Debt
**File:** `app/src/content/developer/TechnicalDebtSection.tsx` (727 lines)

**CalloutCards (3 total):**
- 2x `info` (role="note") -- correct
- 1x `tip` (role="note") -- correct

**Dark mode bg-muted:** None at container level.

**Client-specific content (LIGHT):**
- Line 291: "a team of Phew!'s size" -- in opening prose
- Line 443: "NuGet packages (ASP.NET/C#) or Composer/npm packages (WordPress)" -- in quick health check prompt (this is actually generic multi-stack advice)

This is the most templatisation-ready page. Almost all content is generic audit/debt methodology.

**Page-specific issues:**
- The 6 audit type prompts inside Accordion (lines 408-422) are excellent -- long prompts hidden behind collapsible panels with PromptExample components.
- The priority badges section (lines 535-548) uses colour coding effectively (destructive for P1, warning for P2, default for P3, secondary for P4). The P2 badge uses a custom `bg-warning/80` class which is non-standard but functional.

**Verdict: Cross-page fixes sufficient.** Minimal changes needed -- just the one "Phew!'s size" reference.

---

## Cross-Cutting Observations

### 1. CalloutCard role="alert" -- Already Fixed
Across all 7 pages, there are 22 CalloutCards total:
- **info:** 12 instances (role="note") -- correct
- **tip:** 5 instances (role="note") -- correct
- **important:** 4 instances (role="alert") -- all appropriate (genuinely important warnings)
- **warning:** 4 instances (role="alert") -- all appropriate (security/safety warnings)

The I17 fix is properly applied. No over-alerting.

### 2. Dark Mode bg-muted Containers (I4)
Only 4 container-level `bg-muted/XX` instances across all 7 pages:
- `bg-muted/30` x3 (CodebaseMapping, Hallucinations x2)
- `bg-muted/20` x1 (McpUsage architecture diagram)

All have `border-border` which provides visual distinction. These are low-severity in dark mode given the lightness increase to 0.23. The inline `<code>` elements using `bg-muted` are standard and not an issue.

### 3. Client-Specific Content -- Templatisation Burden Ranking
From heaviest to lightest:
1. **Regression Testing** -- Ghost Inspector is structural (16+ refs), not just mentioned
2. **Hallucinations** -- All 7 prompt examples are Phew-specific scenarios
3. **MCP Usage** -- "Recommended MCPs for Phew!" as section heading, tool descriptions reference Phew projects
4. **Plugins** -- "Phew!" in 5 plugin descriptions
5. **Documentation** -- "For Phew!" callouts (3), ASP.NET templates (reusable)
6. **Codebase Mapping** -- "For Phew!" callout (1), stack references
7. **Technical Debt** -- Single "Phew!'s size" reference

### 4. No Interactive Tools Violating "Tools Feel Distinct"
None of these 7 pages contain interactive tools (calculators, simulators, wizards). They are all content/reference pages with prompt templates. The MCP architecture diagram is the closest thing to a visual tool, and it is informational only.

### 5. Structural Quality Is Consistently Good
All pages follow the same patterns:
- `aria-labelledby` on sections with matching `id` on headings
- `max-w-prose` on body text
- Consistent heading hierarchy (`h2` for sections, `h3` for sub-sections)
- Proper table semantics (`thead`, `th scope="col"`)
- Accordions for long/repetitive content
- Tabs for alternative views (Node.js/ASP.NET, Browse/Quick Ref, Conservative/Progressive)

### 6. No Editorial Notes or Third-Person Language Issues
No TODO/FIXME/TBD markers found. Content is written in second person ("you", "your") consistently. No third-person references to the user.

### 7. Pre-Templatisation Fix Recommendation
The only fix worth making before templatisation: **none**. All issues found are either already fixed (CalloutCard roles) or are client-specific content that will be replaced wholesale during templatisation. Making individual fixes to "Phew!" references now would be wasted effort since the content rewrite will touch those same lines.
