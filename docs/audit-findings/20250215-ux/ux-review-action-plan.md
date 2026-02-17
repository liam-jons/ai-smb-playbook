# UX Review: Consolidated Action Plan

## Sources
- `.planning/ux-review-general-track.md` — Content review (Amanda Kelly persona)
- `.planning/ux-review-developer-track.md` — Content review (Matt Bushby persona)
- `.planning/ux-review-browser-general-track.md` — Browser testing, general track (9 pages)
- `.planning/ux-review-browser-developer-track.md` — Browser testing, developer track (16 pages)

---

## Priority 1: Bugs (Must Fix Before Delivery)

### 1.1 Unicode Rendering Bug
**Impact:** Text displays as garbled escape sequences (`\u2014`, `\u2013`, `\u2019`) across 14 files, ~122 occurrences in JSX text content.
**Root cause:** Literal `\u2014` escape sequences in JSX text content (between tags) are not interpreted as Unicode characters. Only escapes inside JavaScript strings (quotes/template literals) render correctly.
**Fix:** Replace all literal `\u{XXXX}` escape sequences in JSX text content with actual Unicode characters:
- `\u2014` -> `—` (em dash)
- `\u2013` -> `–` (en dash)
- `\u2019` -> `'` (right single quote)

**Files affected:** ClaudeMdSection.tsx, HallucinationsSection.tsx, DocumentationSection.tsx, GovernancePolicySection.tsx, RecurringTasksSection.tsx, PluginsSection.tsx, session-management-data.ts, TechnicalDebtSection.tsx, BrandVoiceSection.tsx, McpUsageSection.tsx, RegressionTestingSection.tsx, SkillsExtensionsSection.tsx, CodebaseMappingSection.tsx, context-simulator-data.ts

### 1.2 Quick Wins Links Route to Wrong Track
**Impact:** Developer track Welcome page "Quick Wins" links use `/general/` URLs, ejecting developers from their track.
**Fix:** Make Quick Wins links track-aware. Use the current track prefix (`/general/` or `/developer/`) when generating link hrefs in WelcomeSection.tsx.

### 1.3 Editorial Note Left in Production Content
**Impact:** RecurringTasksSection.tsx line 423 displays: "Honest about the gaps. This builds trust — the playbook is not overselling." This is an internal spec annotation, not user-facing content.
**Fix:** Replace with: "It is important to be clear about what Claude cannot do yet, so you can plan accordingly." Or remove the paragraph entirely and let the section heading speak for itself.

---

## Priority 2: Content Gaps (High Impact, Moderate Effort)

### 2.1 ASP.NET/C# CLAUDE.md Template
**Impact:** The CLAUDE.md section (1.8) — the most important "getting started" section for developers — uses exclusively Node/React/TypeScript examples. Matt cannot copy-paste it for his ASP.NET projects.
**Fix:** Add a third tab in Copyable Templates: "ASP.NET / C# Template" with:
- Commands: `dotnet build`, `dotnet run`, `dotnet test`
- Architecture: `/Controllers/`, `/Services/`, `/Models/`, `/Views/`
- Key Files: `Program.cs`, `appsettings.json`, `*.csproj`
- Code Style: C# conventions, nullable reference types
- Testing: xUnit, `IClassFixture<T>`
- Gotchas: ASP.NET-specific patterns

### 2.2 ASP.NET/C# Documentation Examples
**Impact:** Section 1.9 (Documentation Structure) architecture overview and code style examples are Node.js/Express only.
**Fix:** Add ASP.NET/C# variants alongside existing examples:
- Architecture overview using ASP.NET middleware/controller pipeline
- Code style example using C# conventions
- Request lifecycle using ASP.NET request pipeline

### 2.3 CLAUDE.md References Leak into General Track
**Impact:** Multiple general track sections reference "CLAUDE.md" — a developer concept Amanda doesn't know.
**Locations:**
- Welcome Quick Reference Card
- Context Simulator tips 3 and 5
- Context Simulator budget section
**Fix:** Add track-conditional rendering. For general track, replace CLAUDE.md references with "profile preferences" or "project custom instructions."

### 2.4 Skills & Extensions Overwhelming for General Users
**Impact:** Platform Availability matrix shows 13 features including Subagents, Agent Teams, Hooks, LSP servers — all developer concepts. "Impact on Claude's Working Memory" table contains developer syntax.
**Fix:**
- Hide developer-only rows (Subagents, Agent Teams, Hooks, Plugins, LSP servers) in general track view
- Collapse matrices behind "Advanced details" toggle for general users
- Lead with natural language trigger guide

---

## Priority 3: UX Polish (Moderate Impact, Quick Fixes)

### 3.1 Section Numbering Gap
**Impact:** General track jumps from 1.7 to 1.16. Developer track jumps from 1.6 to 1.8 (missing 1.7). Users wonder about "missing" sections.
**Fix options:**
- Option A: Add a brief note in the sidebar or section footer explaining: "Sections 1.8-1.15 are in the Developer track" (for general users)
- Option B: Use track-relative numbering (general: 1-8, developer: 1-15)
- Option C: Add section 1.7 (Recurring Tasks) to developer track sidebar

### 3.2 Loading State Flash
**Impact:** Every lazy-loaded section shows "Loading section..." text briefly. Makes the app feel slow.
**Fix options:**
- Replace text with skeleton/shimmer loading state
- Preload adjacent sections when a page loads
- Use `React.startTransition` or `Suspense` with a better fallback

### 3.3 Related Section References Not Hyperlinked
**Impact:** Governance, Brand Voice, and Recurring Tasks sections reference other sections as bold text but not clickable links.
**Fix:** Replace `<strong>Section 1.4 — Skills, Extensions & Decision Tree</strong>` with `<Link to="/${track}/skills-extensions">Section 1.4 — Skills, Extensions & Decision Tree</Link>`.

### 3.4 Replace "parameterised" with Plain English
**Impact:** Used in Welcome, Governance, and Starter Kit sections. General users may not understand the term.
**Locations:** sections.ts, WelcomeSection.tsx, starter-kit-data.ts, GovernancePolicySection.tsx
**Fix:** Replace with "fill-in-the-blanks" or "customisable template." (Note: "parameterised queries" in DocumentationSection.tsx is correct technical usage — leave as-is.)

### 3.5 Starter Kit Install Tab Default
**Impact:** Developer track defaults to "Claude Desktop" tab in How to Install section.
**Fix:** Default to "Claude Code" tab when viewing the developer track.

### 3.6 Add CoWork Definition
**Impact:** CoWork appears in Skills & Extensions and Recurring Tasks without introduction.
**Fix:** Add one-sentence definition where CoWork first appears: "CoWork is Anthropic's browser automation environment — it lets Claude control a web browser to complete tasks on websites."

### 3.7 Rename "Atomic Task Principle"
**Impact:** Jargon for general users.
**Fix:** For general track, rename heading to "Breaking Big Tasks into Smaller Pieces."

### 3.8 Quick Reference Card Track Filtering
**Impact:** General users see developer tips (CLAUDE.md, project root) in the printable Quick Reference Card.
**Fix:** Filter Quick Reference Card content based on current track.

---

## Priority 4: Nice-to-Haves (Low Impact, Consider for V2)

### 4.1 Track Completion Message
Add a "You've completed the [General/Developer] track!" message at the end of Starter Kit page with a link back to the homepage or the other track.

### 4.2 Quick Audit Prompt
Add a shorter "Quick Health Check" prompt in Technical Debt section alongside the comprehensive audit prompts.

### 4.3 Duplicate Meta-Narrative Sections
Welcome page has both "How this playbook was built" alert and "How We Built This" heading. Consolidate into one.

### 4.4 MCP Discovery Guidance
Add "Discovering MCP Servers" subsection in MCP Usage section with starting points: Anthropic MCP directory, npm packages, community registry.

### 4.5 Common Mapper Inaccuracies Callout
Add to Codebase Mapping section listing top 3-4 things to verify after running the mapper.

### 4.6 Sidebar Truncation
Long section names truncated in sidebar. Consider shorter display names or tooltip on hover.

### 4.7 Missing Sidebar Icon for 1.16
Add icon for Starter Kit section to match other sections.

### 4.8 Save Patterns as Skills Callout
Add callout in Hallucinations section suggesting developers save most-used patterns as Claude Code skills.

### 4.9 Context Window Session Hygiene
Add guidance on what to do when "my session is getting slow and Claude is forgetting things."

### 4.10 TypeScript Example in Context Tips
Replace "If you said 'always use TypeScript' ten messages ago" with "If you told Claude 'always use UK English' ten messages ago" for general track.

---

## Recommended Implementation Order

**Sprint 1 (Critical bugs — do first):**
1. Fix Unicode rendering bug (1.1) — automated find-and-replace across 14 files
2. Fix Quick Wins links (1.2) — track-aware link generation
3. Remove editorial note (1.3) — single line change

**Sprint 2 (High-impact content):**
4. Add ASP.NET/C# CLAUDE.md template (2.1)
5. Add ASP.NET documentation examples (2.2)
6. Filter CLAUDE.md references from general track (2.3)
7. Simplify Skills & Extensions for general users (2.4)

**Sprint 3 (Polish):**
8. Fix section numbering gap (3.1)
9. Improve loading states (3.2)
10. Hyperlink section references (3.3)
11. Replace "parameterised" (3.4)
12. Fix starter kit tab default (3.5)
13. Add CoWork definition (3.6)
14. Rename "Atomic Task Principle" (3.7)
15. Filter Quick Reference Card (3.8)

**Sprint 4 (Nice-to-haves):**
16-25. Priority 4 items as time permits.

---

## Verification Needed

- [ ] PDF download button on Welcome page — does it generate/download a PDF?
- [ ] "Download All as ZIP" on Starter Kit page — does `/starter-kit.zip` exist and serve correctly?
- [ ] Dark mode rendering — untested across all pages
- [ ] Mobile responsiveness — untested (only floating feedback button has `md:hidden`)
