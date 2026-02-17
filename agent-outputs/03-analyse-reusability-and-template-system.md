# 3. Analyse reusability and template system

Now I have a thorough understanding of the codebase. Let me compile my comprehensive research report.

---

# Reusability Research Report: AI SMB Playbook

## 1. Tier 2 Assessment: Parametrise vs. Make Generic

### Current State

The reusability audit identified approximately 50 inline "Phew!" references across 16 content section files. The `siteConfig` object (`/Users/liamj/Documents/development/ai-smb-playbook/app/src/config/site.ts`) already centralises shell/layout values (Tier 1), and is consumed by 10 files (Header, Footer, HomePage, WelcomeSection, sections.ts, useTheme, useAccessibility, FeedbackWidget). However, none of the 16 content section files currently import or use `siteConfig`.

Examining the actual inline "Phew!" references, they fall into three distinct categories:

#### Category A: Simple company name substitutions (should use `siteConfig.companyName`)

These are straightforward parametrisations where the company name appears in running prose:

| File | Line | Reference | Replacement |
|------|------|-----------|-------------|
| `RecurringTasksSection.tsx` | 588 | "Practical, actionable steps for Phew! staff" | `siteConfig.companyName + " staff"` |
| `RecurringTasksSection.tsx` | 199 | "Examples from Phew!:" | `siteConfig.companyName` |
| `SessionManagementSection.tsx` | 659 | "role at Phew!" | `siteConfig.companyName` |
| `GovernancePolicySection.tsx` | 81 | `example: 'Phew Design Limited'` | `siteConfig.companyName` |
| `GovernancePolicySection.tsx` | 772 | "Phew! can use it" | `siteConfig.companyName` |
| `RoiMeasurementSection.tsx` | 83 | "Generated with the Phew! AI Playbook ROI Calculator" | `siteConfig.appTitle` |
| `SkillsExtensionsSection.tsx` | 419 | "Our company is Phew Design Limited" | `siteConfig.companyName` |
| `TechnicalDebtSection.tsx` | 291 | "Phew!'s size" | `siteConfig.companyName` |
| `context-simulator-data.ts` | 188 | "Typical Phew! setup" | `siteConfig.companyName` |

**Count:** ~15 references. **Effort:** Low. Simple string interpolation.

#### Category B: "Phew! example" labels and callout titles (should be made generic)

These use "Phew!" as a label for client-specific examples. Rather than parametrising to `siteConfig.companyName + " example"`, these should use a more generic label like "Your organisation" or "Client example":

| File | Lines | Pattern |
|------|-------|---------|
| `RecurringTasksSection.tsx` | 41, 82, 104, 138, 160, 701, 714, 796, 809 | `phewExample` data structure + "Phew! example:" labels in rendered JSX |
| `BrandVoiceSection.tsx` | 51, 256-310, 612, 657, 660 | `phewExample` field in `frameworkSections` + "Phew! example" / "Head start for Phew!" labels |
| `RoiMeasurementSection.tsx` | 377 | "Phew! example & related section" collapsible trigger |
| `roi-data.ts` | 188, 254, 360 | `clientExample.title` fields containing "Phew!" |

**Recommendation:** Rename `phewExample` to `clientExample` in the data structures. Change the rendered labels from "Phew! example:" to "Example for your organisation:" or dynamically use `siteConfig.companyName + " example"`. The data content itself is Tier 3 (see below).

#### Category C: References that should become generic regardless of client

These would be better as universal content even for Phew:

| File | Line | Current | Generic Alternative |
|------|------|---------|-------------------|
| `RegressionTestingSection.tsx` | 234 | "it works well for Phew!'s current needs" | "it works well for many teams" |
| `RegressionTestingSection.tsx` | 245 | "a practical path for Phew!" | "a practical path for your team" |
| `RegressionTestingSection.tsx` | 426, 457 | "Phew! starting point:" | "Starting point:" |
| `ClaudeMdSection.tsx` | 634 | "primary supported interface for Phew!" | "primary supported interface" |
| `CodebaseMappingSection.tsx` | 354 | "primary use case for Phew!" | "common use case" |
| `DocumentationSection.tsx` | 421, 634 | "For Phew!" / "Recommendation for Phew!" | "For your team" / "Recommendation:" |
| `McpUsageSection.tsx` | 450 | "Recommended MCPs for Phew!" | "Recommended MCPs" |
| `McpUsageSection.tsx` | 470 | "Why it matters for Phew!" | "Why it matters for your team:" |
| `PluginsSection.tsx` | 97, 174, 187, 200, 283 | Various "Phew!" references | Generic equivalents |

**Recommendation:** Make these generic now. They do not benefit from parametrisation -- saying "Recommended MCPs for [Company]" adds no value over "Recommended MCPs for your team". The personalisation comes from the examples, not from inserting a name into every heading.

### Analysis and Recommendations

**Approach:** A hybrid strategy.

1. **Parametrise Category A** (15 references): These genuinely benefit from showing the client name. Use `siteConfig.companyName`.

2. **Genericise Category C** (20+ references): These are better as universal content. Replace "Phew!" with "your team" / "your organisation". This reduces reusability friction and improves the content quality for all clients.

3. **Restructure Category B** (~15 references): Rename `phewExample` to `clientExample` everywhere. Change rendered labels to use `siteConfig.companyName`. The example *content* is Tier 3 -- handled separately.

**Dependencies:** Category B restructuring should happen before Tier 3 content separation, as it establishes the data structure pattern that Tier 3 will build on.

---

## 2. Tier 3 Analysis: Client-Specific Content That Could Be Universal

### Ghost Inspector References

**Current state:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/developer/RegressionTestingSection.tsx` has approximately 20 references to Ghost Inspector. The entire section is structured as "Ghost Inspector vs AI-driven testing", with a comparison table, migration prompts ("Migrate a Ghost Inspector Test"), and getting-started steps ("Do not cancel Ghost Inspector yet").

**Analysis:**
- The *concept* is universal: "comparing your current testing tool to AI-driven alternatives".
- The *specific tool* (Ghost Inspector) is not. Other clients use Selenium, Cypress, BrowserStack, Rainforest QA, or no automated testing at all.
- Many non-technical SMB clients will not build software at all, making this entire section irrelevant.

**Recommendation:** This section should become **conditional content gated by the developer track** (which it already is). The Ghost Inspector specifics should be extracted into a client overlay pattern:

```typescript
// Generic structure
interface TestingToolComparison {
  currentTool: string;           // "Ghost Inspector", "Cypress", etc.
  comparisonRows: ComparisonRow[];
  migrationPrompt: string;
  gettingStartedSteps: Step[];
}

// Client overlay
const phewTestingOverlay: TestingToolComparison = {
  currentTool: 'Ghost Inspector',
  // ... Phew-specific content
};
```

If no `currentTool` is specified in the client config, the section should show a generic "Traditional vs AI-Driven Testing" comparison without tool-specific migration guidance.

### Brand Voice Section

**Current state:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/BrandVoiceSection.tsx` (1017 lines). The section has two parts: UK English enforcement (universal) and brand voice setup (framework is universal, examples are Phew-specific).

**Analysis:**
- **Part 1 (UK English):** Entirely universal for UK clients. No changes needed.
- **Part 2 (Brand Voice Framework):** The seven-section framework (Brand Personality, Voice Attributes, Audience Awareness, Core Messaging, Tone Spectrum, Style Rules, Terminology) is universally valuable. Every SMB benefits from brand voice documentation.
- **The `phewExample` fields** within `frameworkSections` (lines 250-313) contain deeply Phew-specific content (safeguarding terminology, LSCP references, ISO certifications).
- **The CalloutCard** "Head start for Phew!" (line 612) references a website scrape.
- **The guided prompt** (lines 88-113) is already generic and uses `[Company name]` placeholders.

**Recommendation:** The framework structure is already generic and valuable. The only changes needed:
1. Extract `phewExample` content into a client overlay data file.
2. Make the "Head start" callout conditional -- only show if client-specific brand context exists.
3. The guided setup prompt is already template-friendly.

This section is one of the **strongest candidates for remaining as-is** with minimal changes, because the framework genuinely helps any SMB build context/knowledge base files.

### ASP.NET/C#/SQL Server/WordPress References

**Current state:** Found in 5 developer track files:
- `ClaudeMdSection.tsx` -- ASP.NET template is one of three CLAUDE.md templates (alongside Complete and Minimal). Lines 295-376.
- `HallucinationsSection.tsx` -- Code examples reference C#, SQL Server, safeguarding audit forms.
- `RegressionTestingSection.tsx` -- Playwright prompts reference ASP.NET/C# LMS application.
- `CodebaseMappingSection.tsx` -- Codebase mapping examples.
- `McpUsageSection.tsx` -- Playwright config references "LMS, Audit System, PDMS".
- `PluginsSection.tsx` -- php-lsp plugin described as "Particularly relevant for Phew!'s WordPress work."

**Analysis:** These are the hardest Tier 3 items. The tech stack examples are woven into prompt templates, code blocks, and prose. They cannot be simply parametrised -- they need to be rewritten for each client's tech stack.

**Recommendation:** A **content schema approach** with tech stack profiles:

```typescript
interface TechStackProfile {
  primaryLanguage: string;        // "C#", "TypeScript", "Python"
  framework: string;              // "ASP.NET", "Next.js", "Django"
  database: string;               // "SQL Server", "PostgreSQL"
  testingTool?: string;           // "Ghost Inspector", "Cypress"
  cms?: string;                   // "WordPress", null
  products: string[];             // ["LMS", "Audit System", "PDMS"]
  industry: string;               // "Safeguarding", "E-commerce"
  industryTerms: Record<string, string>;  // Terminology substitutions
}
```

Developer track content would then reference this profile for examples, prompts, and code samples. This is the biggest content authoring effort and should be phased.

### Content Schema Approach for Tier 3

**Option 1: Client overlay files (simplest)**
- Keep the generic content in components.
- Create per-client data files (e.g., `content/clients/phew-overlays.ts`) with `clientExample`, `techStackExamples`, `industryExamples`.
- Components check for overlays and render them if present; omit the callout/example block if not.

**Option 2: Full content data files (most flexible)**
- Extract ALL text content from components into data files.
- Components become pure renderers consuming typed data.
- Per-client content files swap in entirely.

**Recommendation:** Option 1 for the near term (next 3-6 months, <50 clients). Option 2 only if/when the content authoring pipeline demands it.

---

## 3. Content Schema Design for Scale

### At 50 Clients

**Simplest viable approach:** Fork-and-customise.

- Create a `template` branch with all Phew-specific content stripped to placeholders.
- Per-client branches (`client/phew`, `client/acme`, etc.) from the template.
- `siteConfig.ts` handles branding.
- A `clientOverlays.ts` file per client handles Tier 3 examples.
- Each client gets a separate Vercel project with its own domain.

**Architecture:**
```
template branch (generic)
  ├── client/phew (branch per client)
  ├── client/acme
  └── client/xyz
```

**Deployment:** One Vercel project per client. Each branch auto-deploys to its client's domain.

**Security:** Minimal concern -- each deployment is independent. No shared data.

**Analytics:** Vercel Web Analytics per project. No aggregate view without manual consolidation.

**Codebase management:** Monorepo with branches. Upstream improvements merge from `template` into client branches. This works at 50 clients but merge conflicts become painful.

**Estimated cost:** Vercel Pro ($20/month) supports unlimited projects. Domain cost per client.

### At 1,000 Clients

**Required infrastructure:** Build-time content injection.

- **Content storage:** JSON/YAML files per client in a content repository (or a headless CMS like Sanity, Contentful, or Strapi).
- **Build pipeline:** A single app codebase reads client config at build time and produces a static build per client.
- **Deployment:** A CI/CD pipeline triggers per-client builds when content changes, deploying to a CDN (Vercel, Cloudflare Pages, or Netlify).

**Architecture:**
```
App codebase (single)
Content repo (separate)
  ├── clients/
  │   ├── phew/
  │   │   ├── config.json      (siteConfig equivalent)
  │   │   ├── overlays.json    (Tier 3 examples)
  │   │   └── assets/          (logo, favicon)
  │   ├── acme/
  │   └── ...
Build pipeline
  ├── For each client:
  │   ├── Read config + overlays
  │   ├── Inject into app build
  │   └── Deploy to client domain
```

**Security:** Client content files are isolated. Build pipeline ensures no cross-contamination. Access control on the content repo limits who can edit which client's content.

**Analytics:** Centralised analytics platform (Plausible, Fathom, or PostHog). Per-client site IDs. Dashboard for aggregate insights across all clients.

**Codebase management:** Single app repo + single content repo. No branches per client. Changes to the app deploy to all clients. Content changes deploy only to the affected client.

**Key decisions at this scale:**
- Headless CMS vs file-based content? CMS is better for non-developer content authors but adds a dependency.
- Build-time vs runtime content? Build-time is simpler, faster, and cheaper. Runtime only needed if clients need real-time content updates without rebuilds.

### At 10,000 Clients

**Architectural requirements:** Multi-tenant runtime content injection.

- **Single deployment:** One app deployment serves all clients. Content is loaded at runtime based on domain/subdomain.
- **Database-backed content:** Client configurations and content stored in a database (PostgreSQL or similar). Admin dashboard for onboarding.
- **CDN edge caching:** Content served from edge, cached per client domain. Cache invalidation on content changes.
- **Client dashboard:** Self-service portal for clients to customise their content, upload logos, set branding.

**Architecture:**
```
Single app deployment
  ├── Content API (edge function or API route)
  │   └── Reads from database per request domain
  ├── Client dashboard (separate app)
  │   └── CRUD for client config, overlays, branding
  └── Database
      ├── clients table (config, branding)
      ├── overlays table (section-level content)
      └── assets table (logos, favicons)
```

**Security considerations at this scale:**
- **Data isolation:** Row-level security in the database. Each client can only access their own content.
- **Authentication:** Client dashboard requires SSO or auth (Clerk, Auth0).
- **Content access control:** Playbook content behind client-specific authentication if needed (some clients may want private playbooks).
- **GDPR:** Client data stored in UK/EU regions. Data deletion workflows for offboarded clients.
- **Audit trail:** Who changed what content, when.

**Analytics at scale:**
- **Per-client:** Section views, calculator usage, time-on-page, completion rates.
- **Aggregate:** Which sections are most visited, which content overlays drive engagement, churn correlation with usage patterns.
- **Platform:** PostHog or similar product analytics. Custom events for interactive elements (calculator, copy buttons).

**Codebase management at scale:**
- Monorepo for the app + API + dashboard.
- Semantic versioning for the content schema.
- Feature flags for rolling out new sections to subsets of clients.
- A/B testing infrastructure for content improvements.

### Transition Path

The beauty of starting with the fork-and-customise approach is that each transition is evolutionary, not revolutionary:

1. **Now to 50:** Branches + `siteConfig` + `clientOverlays.ts`. Cost: engineering time only.
2. **50 to 1,000:** Extract content to JSON files, build a pipeline. The component architecture remains the same -- only the content source changes.
3. **1,000 to 10,000:** Move content to a database, add an API layer, build a dashboard. The components remain the same -- only the content delivery mechanism changes.

The critical decision is **how the components consume content**. If components are written to accept content as props/data (which the ROI section already demonstrates), the transition is smooth. If content is inline JSX (which most sections currently are), each transition requires extracting content.

---

## 4. ROI Section Reusability Verification

### Current State

The ROI section (`/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/RoiMeasurementSection.tsx` and `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/roi-data.ts`) was built most recently and explicitly designed with reusability in mind.

### What Was Done Well

1. **Data separated from presentation:** All content lives in `roi-data.ts` with full TypeScript interfaces. The component file (`RoiMeasurementSection.tsx`) is a pure renderer.

2. **Client overlays as optional fields:** The `TaskTemplate` interface includes `clientExample?: { title: string; description: string; }` -- an optional overlay pattern. Templates without client examples still work fine.

3. **Calculator defaults are configurable:** `calculatorDefaults` includes currency, symbol, rate ranges, and defaults -- all swappable per client.

4. **Client context is explicit:** The `clientContext` object (lines 114-125 of `roi-data.ts`) clearly separates client-specific context (company name, team size, tools, use cases).

5. **Track-aware filtering:** Templates are tagged with `track: 'general' | 'developer' | 'both'`, and the component filters accordingly.

### What Still Has Phew-Specific Content

1. **`clientContext` object** (line 115): `companyName: 'Phew Design Limited'`, tools include "Claude Teams/Code", use cases include "Ghost Inspector replacement" and "safeguarding".

2. **Three `clientExample` objects** in `taskTemplates` (lines 187-191, 253-257, 359-363): "Phew! bid writing", "Phew! ISO documentation", "Phew! Ghost Inspector replacement".

3. **ROI Calculator export text** (line 83 of `RoiMeasurementSection.tsx`): `Generated with the Phew! AI Playbook ROI Calculator` -- should use `siteConfig.appTitle`.

4. **Collapsible trigger text** (line 377 of `RoiMeasurementSection.tsx`): `'Phew! example & related section'` -- should use `siteConfig.companyName` or be genericised.

### Changes Needed for Full Reusability

1. **Minimal changes:**
   - Line 83: Replace `Phew!` with `siteConfig.appTitle`.
   - Line 377: Replace with `siteConfig.companyName + ' example & related section'` or generic "Client example & related section".
   - `clientContext.companyName`: Should reference `siteConfig.companyName`.

2. **Content swap for new clients:**
   - Replace the `clientContext` object content.
   - Replace the three `clientExample` entries.
   - Everything else (task templates, frameworks, mistakes, KPIs, getting-started steps) is universal.

### Assessment

The ROI section is the **best example of reusability-aware architecture** in the codebase. It demonstrates the pattern other sections should follow: typed data files with optional client overlays, pure rendering components, and configurable defaults. Only 5 references need fixing, and the content swap path is clear.

**This section should be treated as the reference implementation for other sections.**

---

## 5. Claude References for Non-Claude Clients

### Prevalence Analysis

374 occurrences of "Claude" across 17 content files. Breaking these down by type:

**Structural references (the app is fundamentally about Claude):**
- `ClaudeMdSection.tsx` (20 occurrences) -- the section is literally about CLAUDE.md files
- `PluginsSection.tsx` (14) -- about Claude Code plugins
- `McpUsageSection.tsx` (27) -- about Claude's MCP protocol
- `SessionManagementSection.tsx` (27) -- about managing Claude sessions
- `SkillsExtensionsSection.tsx` (60) -- about Claude skills and extensions
- `ContextSimulatorSection.tsx` (35) -- about Claude's context window
- `RecurringTasksSection.tsx` (31) -- about automating tasks with Claude

**Incidental references (could be generalised):**
- `GovernancePolicySection.tsx` (19) -- mentions "Claude" but the governance framework applies to any AI tool
- `BrandVoiceSection.tsx` (22) -- mentions "Claude" but brand voice applies to any LLM
- `RoiMeasurementSection.tsx` (2) -- just "Claude Teams is roughly L20/person/month"
- `HallucinationsSection.tsx` (24) -- hallucination patterns apply to all LLMs, but examples use Claude Code

### Assessment

The app is **fundamentally a Claude playbook**. It is not an LLM-agnostic guide with Claude examples bolted on. The entire architecture -- CLAUDE.md files, Claude Code, MCP servers, Anthropic's CoWork, Claude's context window, Claude-specific skills and extensions -- is built around Claude's specific capabilities and workflow patterns.

**Adapting for other LLMs would require:**
- Rewriting 8 of 17 content sections from scratch (CLAUDE.md, MCP, plugins, regression testing, codebase mapping, documentation, context window, skills/extensions)
- Removing all Claude Code-specific tooling references
- Replacing the starter kit entirely (skills, commands, templates are Claude-specific)
- Rewriting the context window simulator for different LLM architectures

This is effectively building a different product.

### Recommendation

**Stay Claude-focused.** The value proposition is deep Claude expertise for SMBs, not shallow LLM-agnostic advice. The approach should be:

1. **Title the product honestly:** "AI Playbook" (not "Claude Playbook") -- the general track content (governance, brand voice, ROI, recurring tasks) genuinely applies to any AI tool.
2. **Add a brief intro caveat:** "This playbook focuses on Claude and Claude Code as the primary AI tools, but many principles -- governance, brand voice, ROI measurement, session management -- apply to any AI tool."
3. **Keep the developer track Claude-specific:** The developer track is entirely about Claude Code, and this specificity is its value.
4. **Do not attempt LLM-agnostic rewrites:** This would dilute the content and require maintaining multiple versions.

For future clients using ChatGPT or Copilot, the better path is building a separate playbook product for those tools, reusing the universal sections (governance, brand voice, ROI) as shared content.

---

## 6. Process Document Considerations

### Current State

The process document exists in three locations:
1. `/Users/liamj/Documents/development/ai-smb-playbook/docs/repeatable-workflow.md` -- the source document
2. `/Users/liamj/Documents/development/ai-smb-playbook/app/public/docs/repeatable-workflow.md` -- served as a static asset
3. Rendered via `ProcessDocPage.tsx` at the `/process` route

The `ProcessDocPage` component (`/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/ProcessDocPage.tsx`) fetches the markdown file at runtime and renders it with a custom lightweight markdown parser.

### What the Process Document Contains

The document describes a 7-step repeatable workflow for producing post-training follow-up deliverables:

1. **Record and Transcribe** -- tools (Granola, Otter.ai), tips, Phew example
2. **Summarise and Identify Focus Areas** -- review process, Phew example
3. **Provide Context to Claude and Plan** -- planning prompts, Phew example
4. **Produce Detailed Specs** -- spec-writing templates, Phew example
5. **Build with Parallel Agents** -- agent dispatch patterns, Phew example
6. **Deploy the Deliverable** -- deployment process, Phew example
7. **Bundle and Deliver** -- delivery note template, Phew example

It also includes:
- Four template prompts (planning, spec writing, agent dispatch, delivery note)
- "Adapting for Different Clients" section with guidance on simpler deliverables, non-technical clients, larger teams, different tech stacks, budget constraints

### Value for the Replication Workflow

This document is **extremely valuable** for the consultant/operator replicating the playbook for new clients. It contains:
- The exact process used to create the Phew deployment
- Template prompts that accelerate future deployments
- Timing estimates for each step
- Phew-specific worked examples that demonstrate the process

### Where It Should Live

The process document should be **removed from the client-facing app** and preserved in the repository's docs:

1. **Keep at:** `/Users/liamj/Documents/development/ai-smb-playbook/docs/repeatable-workflow.md` (already exists)
2. **Remove from:** `/Users/liamj/Documents/development/ai-smb-playbook/app/public/docs/repeatable-workflow.md`
3. **Remove from app:** Delete the `/process` route in `router.tsx` (line 18-19) and the `ProcessDocPage.tsx` component.
4. **Update any links:** Check if any app content links to `/process`.

The eight "Phew! example:" callouts in the process doc should be preserved as-is -- they are valuable worked examples for the consultant, not client-facing content.

### Router Changes Required

In `/Users/liamj/Documents/development/ai-smb-playbook/app/src/routes/router.tsx`:
- Remove the import of `ProcessDocPage` (line 7)
- Remove the route definition (lines 17-19)

Check for any links to `/process` in the app (HomePage, sidebar, etc.).

---

## 7. Brand Voice Section Genericisation

### Current Phew-Specific Content

The brand voice section (`/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/BrandVoiceSection.tsx`) has the following Phew-specific content:

1. **`frameworkSections` data** (lines 250-313): Seven `phewExample` strings containing:
   - Brand personality: Safeguarding technology, "never talks down to you"
   - Voice attributes: "jargon-free", "five minutes"
   - Audience: "safeguarding leads and public sector decision-makers"
   - Core messaging: "Safeguarding made simpler", ISO certifications
   - Tone spectrum: "The Phew! voice is always present"
   - Style rules: UK English, DD/MM/YYYY
   - Terminology: "safeguarding partnership", "LMS"

2. **CalloutCard** (lines 611-618): "Head start for Phew!" -- references a website scrape with IMPACT values and sector terminology.

### What a Generic Version Would Look Like

The section is already 90% generic. The framework (seven sections, the guided setup prompt, UK English enforcement, storage options, brand review skill) applies to any SMB. Only the example content is client-specific.

**Generic version changes:**
1. Rename `phewExample` to `clientExample` in the `FrameworkSection` interface.
2. Provide generic example text that works for any SMB:
   - Brand Personality: "If [Company] were a person, they would be... [consider what makes you unique, how you treat clients, what you stand for]"
   - Voice Attributes: "Professional: We are knowledgeable and reliable. We are not stiff or corporate. Sounds like: 'Here is how to get started -- it takes about five minutes.'"
   - Audience: "Primary: [describe your main customer]. They need [what they care about]. They are experts in [their domain] but not necessarily in [your domain]."
3. Make the "Head start" callout conditional: only show if a client-specific brand context file exists.
4. Add a note: "The examples below are illustrative. Your brand voice will be unique to your organisation."

### Connection to "Building Context Files" Narrative

The brand voice section is one of the most valuable for the broader narrative of **teaching SMBs to build persistent context for AI tools**. It demonstrates:
- How to create a structured knowledge base document (the brand voice doc)
- How to store it where Claude can access it (project knowledge, skills, CLAUDE.md)
- How to use it for ongoing quality checks (brand-review skill)
- The "living document" concept (review when brand evolves)

This same pattern applies to:
- Company policies and procedures
- Client onboarding checklists
- Product documentation
- Industry terminology glossaries
- Compliance requirements

The brand voice section should be positioned as the **first practical exercise in context file creation** -- "Start here because everyone has a brand, and the output is immediately useful."

### Recommendation

1. Extract `phewExample` content into a client overlay.
2. Provide generic example text as the default.
3. Make the "Head start" callout data-driven (show only if client brand context exists).
4. Add a narrative hook connecting brand voice to the broader "building context files" concept.
5. Keep the seven-section framework, guided prompt, UK English enforcement, and brand-review skill as universal content.

---

## Prioritised Action List

### Phase 1: Quick Wins (can be done now, low risk)

1. **Genericise Category C references** -- Replace ~20 "Phew!" references that should say "your team" / "your organisation" regardless. No config changes needed, just string replacements.
   - Files: `RegressionTestingSection.tsx`, `ClaudeMdSection.tsx`, `CodebaseMappingSection.tsx`, `DocumentationSection.tsx`, `McpUsageSection.tsx`, `PluginsSection.tsx`
   - **Effort:** 1-2 hours
   - **Dependencies:** None

2. **Fix ROI section Phew references** -- Replace the 2 remaining inline "Phew!" strings with `siteConfig` references.
   - Files: `RoiMeasurementSection.tsx` (lines 83, 377)
   - **Effort:** 15 minutes
   - **Dependencies:** None

3. **Remove process document from app** -- Delete the `/process` route and `ProcessDocPage.tsx`. Keep `docs/repeatable-workflow.md`.
   - Files: `router.tsx`, `ProcessDocPage.tsx`, `app/public/docs/repeatable-workflow.md`
   - **Effort:** 30 minutes
   - **Dependencies:** Check for any links to `/process` in app content

### Phase 2: Structural Renaming (low risk, prepares for Phase 3)

4. **Rename `phewExample` to `clientExample`** across all data structures and JSX.
   - Files: `RecurringTasksSection.tsx`, `BrandVoiceSection.tsx`
   - **Effort:** 1 hour
   - **Dependencies:** None

5. **Parametrise Category A references** -- Import `siteConfig` into content sections and replace ~15 company name strings.
   - Files: All 14 content files with "Phew!" references
   - **Effort:** 2-3 hours
   - **Dependencies:** None

### Phase 3: Content Separation (moderate effort, enables scaling)

6. **Extract client overlay data** -- Create a `content/shared/client-overlays.ts` file containing all Phew-specific example content. Components check for overlay presence and render conditionally.
   - **Effort:** 4-6 hours
   - **Dependencies:** Phase 2 (renamed data structures)
   - **Files to create:** `content/shared/client-overlays.ts`
   - **Files to modify:** All sections currently containing Phew-specific examples

7. **Create a tech stack profile interface** -- Define the `TechStackProfile` type. Move ASP.NET/C#/Ghost Inspector content into a Phew tech stack profile.
   - **Effort:** 6-8 hours
   - **Dependencies:** Phase 2

8. **Genericise brand voice examples** -- Replace Phew-specific brand voice examples with universal defaults while keeping Phew examples as overlay data.
   - **Effort:** 2-3 hours
   - **Dependencies:** Phase 2 (renamed `clientExample` field)

### Phase 4: Template Branch (enables multi-client deployment)

9. **Create a `template` branch** -- Strip all Phew-specific content, leaving working placeholders and the client overlay infrastructure from Phase 3.
   - **Effort:** 4-6 hours
   - **Dependencies:** Phases 1-3 complete

10. **Document the client onboarding process** -- Create a checklist/guide for setting up a new client deployment, covering `siteConfig`, client overlays, tech stack profile, deployment, and domain.
    - **Effort:** 2-3 hours
    - **Dependencies:** Phase 4

### Phase 5: Scale Infrastructure (when approaching 50+ clients)

11. **Extract content to JSON files** -- Move all content from inline TypeScript data to JSON files that can be swapped per client.
12. **Build a content pipeline** -- Automated per-client builds from a content repository.
13. **Centralised analytics** -- Per-client tracking with aggregate dashboard.

### Total Estimated Effort

- **Phases 1-2:** 5-7 hours (immediate, low risk)
- **Phase 3:** 12-17 hours (near-term, moderate effort)
- **Phase 4:** 6-9 hours (after Phase 3)
- **Phase 5:** Project-level work (when scale demands it)

### Key Insight

The ROI section (`roi-data.ts` + `RoiMeasurementSection.tsx`) is the architectural model to follow. It demonstrates typed data files with optional client overlays, configurable defaults, and pure rendering components. The effort required to bring other sections to this level of reusability is proportional to how much inline content they contain -- and the sections with the most inline content (SkillsExtensions at 60 Claude references, RecurringTasks at 31, SessionManagement at 27) are also the ones most likely to remain unchanged across clients because their content is fundamentally about Claude workflows, not client-specific context.

---

**Files referenced:**
- `/Users/liamj/Documents/development/ai-smb-playbook/.planning/research/reusability-audit.md`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/config/site.ts`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/roi-data.ts`
- `/Users/liamj/Documents/development/ai-smb-playbook/.planning/plan-files/roi-section-implementation.md`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/sections.ts`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/RecurringTasksSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/BrandVoiceSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/RoiMeasurementSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/developer/RegressionTestingSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/developer/ClaudeMdSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/developer/McpUsageSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/developer/PluginsSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/docs/repeatable-workflow.md`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/ProcessDocPage.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/routes/router.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/developer/HallucinationsSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/context-simulator-data.ts`

---
*Agent: `a4f2e21` | Session: `46d06ca6-d7d3-4777-a0d1-d02ea203421f` | Rows: 83*
*2026-02-17T14:12:17.058Z -> 2026-02-17T14:16:34.209Z*