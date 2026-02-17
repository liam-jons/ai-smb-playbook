# Phew! AI Playbook -- Developer Track UX Review
## Tested as Matt Bushby, Full-Stack Developer

---

## 1. Page-by-Page Review

### Homepage (`/`)
- **First impression:** Clean, two-card layout. Easy to spot the "Developers" track (15 sections vs 8). The code icon differentiates it clearly from the General track.
- **Comprehension:** Immediately clear what to do. The "Get started" CTA is prominent.
- **Actionability:** One click to enter the dev track. Good.
- **Problems found:**
  - None. This page works well.

### 1.1 Welcome & Orientation (`/developer/welcome`)
- **First impression:** The "1.1" badge with "All users" label makes it clear this is a shared section. The sidebar navigation is comprehensive with all 15 sections visible.
- **Comprehension:** Good intro, references the 11 February training by date. Feels personal.
- **Actionability:** "Quick Wins" section links go to `/general/brand-voice`, `/general/governance`, `/general/sessions`, `/general/skills-extensions` instead of `/developer/` equivalents. **This is a bug** -- clicking "Go to Brand Voice" as a developer takes you to the general track version.
- **Problems found:**
  - **CRITICAL: Missing section 1.7 in sidebar navigation.** Sidebar jumps from 1.6 (Brand Voice) to 1.8 (CLAUDE.md Files). Section 1.7 does not appear. Either it was not built or the routing is broken.
  - **BUG: Quick Wins links point to general track routes.** All four "Go to..." links use `/general/` URLs, which would switch the user out of the developer track.

### 1.2 How Context Works (`/developer/context`)
- **First impression:** Content loads with a brief "Loading section..." flash before rendering. The context simulator is immediately engaging.
- **Comprehension:** Excellent. The "Technical note" callout about the 1M-token API window adds developer depth. The "Moderate (Typical Phew! setup)" preset shows MCP servers and CLAUDE.md size sliders.
- **ASP.NET relevance:** Neutral -- the simulator is stack-agnostic, which is correct.
- **Problems found:**
  - Momentary "Loading section..." text visible during lazy loading (seen on every section). Not a showstopper but gives a slightly unpolished feel.

### 1.3 Session Management (`/developer/sessions`)
- **First impression:** Rich content. The "Rules of Thumb" accordion section is practical. Token-aware session management table is excellent.
- **Comprehension:** Very good. The `/cost` and `/compact` commands are documented. The developer handoff templates are distinct from general ones.
- **Actionability:** 7 copyable handoff templates including "Session Handoff -- Developer" and "Emergency Session Save -- Developer". Excellent.
- **Problems found:**
  - The handoff scenario percentages add up to more than 100% (67% + 14% + 10% + 24% + 14% = 129%). This is likely intentional (overlapping categories) but could confuse Matt without a note explaining this.

### 1.4 Skills, Extensions & Decision Tree (`/developer/skills-extensions`)
- **First impression:** The "I want to..." interactive decision tree is a standout feature. Goal-oriented rather than feature-oriented.
- **Comprehension:** Comprehensive platform availability matrix covers claude.ai, Desktop, Code, and CoWork. The context cost summary table is particularly valuable.
- **ASP.NET relevance:** Stack-agnostic, which is appropriate for this section.
- **Problems found:**
  - None significant.

### 1.5 AI Governance Policy (`/developer/governance`)
- **First impression:** The parameterised policy template with `{{COMPANY_NAME}}` variables is immediately practical.
- **Comprehension:** Risk tier cards (Tier 1/2/3) are clear. The "Implementation Notes for Developers" section adds specific technical value.
- **Actionability:** Copy full policy button, download as Markdown, pre-populated extension register template.
- **Problems found:**
  - None significant.

### 1.6 Brand Voice & UK English (`/developer/brand-voice`)
- **First impression:** Auto-selects the "Claude Code" tab for the UK English setup, which is correct for the developer track.
- **Comprehension:** Good. Step 1 (CLAUDE.md rule, 30 seconds) and Step 2 (Britfix hook, 5 minutes) are developer-specific and practical.
- **ASP.NET relevance:** The code context rule about `const color = getColor()` uses JavaScript syntax. An equivalent C# note (e.g., `var color = GetColor()`) would help Matt see this applies to him too.
- **Problems found:**
  - None critical.

### 1.8 CLAUDE.md Files (`/developer/claude-md`) -- DEV-ONLY
- **First impression:** The "impact" callout immediately sells the value proposition: "15-30 minutes for a first version." The file types table showing project root, local overrides, global defaults is clear.
- **Comprehension:** Excellent. The "Map, Not Encyclopedia" principle is the key insight. The 10-section structure guide is practical.
- **Actionability:** Strong. "Getting Started: Your First CLAUDE.md" is a 6-step walkthrough. The Complete Template and Minimal Template tabs let Matt pick his entry point.
- **ASP.NET relevance:** **CRITICAL ISSUE.** The Complete CLAUDE.md Template uses exclusively Node.js/React/TypeScript examples:
  - Commands: `npm install`, `npm run dev`, `npm run build`, `npm test`, `npm run lint`
  - Architecture: `components/`, `hooks/`, `types/` (React structure)
  - Code Style: "TypeScript strict mode", "Zod schemas", "PascalCase for components"
  - Testing: "Vitest", `vi.mock()`
  - Key Files: `src/main.tsx`, `src/routes.tsx`

  Matt works with ASP.NET/C# and WordPress. A template showing `dotnet build`, `dotnet run`, `/Controllers/`, `/Services/`, `/Models/`, or even a WordPress `wp-config.php` structure would be far more useful. The current template may make Matt feel this section is not for him.
- **Problems found:**
  - **RENDERING BUG:** The "impact" callout displays `15\u201330` literally instead of "15-30" (the `\u2013` en dash is not being rendered). This appears as garbled text on screen.
  - **Stack bias:** Template is 100% Node/React/TypeScript. No ASP.NET/C# or WordPress alternative provided.

### 1.9 Documentation Structure (`/developer/documentation`) -- DEV-ONLY
- **First impression:** The "anything it cannot access in-context effectively does not exist" quote is a great hook.
- **Comprehension:** The progressive disclosure concept (CLAUDE.md -> /docs) is clearly explained. The flow diagram showing how Claude navigates documentation is excellent.
- **Actionability:** Good. The scaffold command (`mkdir -p docs/architecture docs/conventions...`) and doc gardening prompt are immediately usable.
- **ASP.NET relevance:** **Same issue as 1.8.** The architecture overview example uses Node.js/React/PostgreSQL/Express. The code style example references `.tsx` files, `express`, `zod`, and Node.js built-ins. No ASP.NET/C# or SQL Server equivalents. The "Request Lifecycle" example describes an Express.js pipeline -- Matt's request lifecycle is ASP.NET middleware/controllers.
- **Problems found:**
  - Stack bias: All examples are Node.js/React ecosystem only.

### 1.10 Codebase Mapping (`/developer/codebase-mapping`) -- DEV-ONLY
- **First impression:** The "For Phew!" callout explicitly mentions WordPress and ASP.NET/C# -- a welcome change from the previous two sections.
- **Comprehension:** The 4-agent parallel architecture is well-explained. The ASCII art diagram of parallel agents is effective.
- **Actionability:** The `/gsd:map-codebase` command is a single copy-paste action. The "When to use / When to skip" guidance is practical.
- **ASP.NET relevance:** Good. The "For Phew!" callout directly addresses Matt's stack.
- **Problems found:**
  - None significant.

### 1.11 Avoiding Hallucinations (`/developer/hallucinations`) -- DEV-ONLY
- **First impression:** The "On this page" table of contents with anchor links is a great navigation aid -- only page in the dev track to have one. Seven numbered patterns with a culminating "Agent Harness" workflow.
- **Comprehension:** Excellent. Each pattern has a clear "When to use" line and an "Also useful for General users" tag where applicable.
- **Actionability:** Outstanding. Every prompt is immediately usable and uses Phew!-relevant examples.
- **ASP.NET relevance:** **This is the gold standard section for Matt.** Prompt examples include:
  - "migrate the safeguarding audit form from the legacy ASP.NET Web Forms page to a Razor Pages implementation"
  - "Our stack is ASP.NET/C# with SQL Server"
  - "update the user authentication flow in our ASP.NET application"
  - "our WordPress site's contact form and the existing .NET CRM system"
  - "Read the existing controller files in /Controllers/"
  - References to OWASP, ISO 27001, Ghost Inspector

  Every example feels like something Matt would actually do at Phew!.
- **Problems found:**
  - None. This is the best section in the entire playbook.

### 1.12 AI-Driven Regression Testing (`/developer/regression-testing`) -- DEV-ONLY
- **First impression:** Three capability cards (CoWork, Playwright MCP, Computer Use API) with "Available now" and "API only" status badges.
- **Comprehension:** The Ghost Inspector comparison table is immediately practical for Phew! (they already use Ghost Inspector). The "Honest Limitations" callout is refreshingly transparent.
- **Actionability:** The 6-step "Practical Starting Points" progression is pragmatic ("Do not cancel Ghost Inspector yet").
- **ASP.NET relevance:** Good. The Playwright test example references an "LMS application (ASP.NET/C#, running locally at http://localhost:5000)".
- **Problems found:**
  - None significant.

### 1.13 Safe MCP Usage (`/developer/mcp-usage`) -- DEV-ONLY
- **First impression:** The context/flow diagram (Context7 <- Claude Code -> Playwright) communicates the concept visually. The "10% context window" cost is highlighted early.
- **Comprehension:** Excellent. The three configuration levels (local, project, user) are clear. The "Silent Failures" warning is critical safety information.
- **Actionability:** Good. The MCP Safety Checklist is a practical team artefact.
- **ASP.NET relevance:** The "Why it matters for Phew!" note for deepwiki mentions "WordPress plugins, ASP.NET libraries" directly. Good.
- **Problems found:**
  - The recommended MCP config examples use `npx` (Node.js). Matt may wonder if he needs Node.js installed for MCPs. A brief note would help.

### 1.14 Plugin Recommendations (`/developer/plugins`) -- DEV-ONLY
- **First impression:** Clear "Installing vs Copying" distinction. Plugin catalogue with expandable category groups.
- **Comprehension:** Good. The "Recommended Starter Set" batch install script is actionable.
- **Actionability:** One-line install commands. Plugin approval checklist is a team-ready artefact.
- **ASP.NET relevance:** The recommended set includes `php-lsp` (for WordPress projects) -- relevant for Matt.
- **Problems found:**
  - **RENDERING BUG:** Em dashes display as literal `\u2014` text throughout the page. Visible in "Minimal \u2014 one command", "Burst cost \u2014 can be significant", etc. This is the same encoding issue as on the CLAUDE.md page.
  - **RENDERING BUG:** Right single quotes display as literal `\u2019` in some places.

### 1.15 Codebase Auditing & Technical Debt (`/developer/technical-debt`) -- DEV-ONLY
- **First impression:** The "21KB concerns file" anecdote from the training anchors the concept in a real demonstration Matt witnessed.
- **Comprehension:** The two-part structure (auditing then remediation) is logical. The P1-P4 priority framework is practical.
- **Actionability:** Security audit, performance audit, dependency health audit -- all as expandable prompts. The architecture drift detection prompt is particularly valuable.
- **ASP.NET relevance:** The documented technical debt example uses Stripe webhooks with TypeScript file paths (`app/api/webhooks/stripe/route.ts`). An ASP.NET equivalent would be more relatable for Matt.
- **Problems found:**
  - The debt documentation example references TypeScript/Next.js file paths rather than ASP.NET patterns.

### 1.16 Starter Kit Contents (`/developer/starter-kit`)
- **First impression:** The "Quick Start" roadmap with time estimates (Week 1: 2 min, Week 2: 15-30 min, etc.) is outstanding for adoption planning.
- **Comprehension:** Clear. The file browser with tabs (Skills, Commands, Templates, Prompts, GSD Mapper, Plugins) organises everything neatly.
- **Actionability:** Excellent. "Download All as ZIP" button, tabbed installation instructions for each platform, and common install commands.
- **Problems found:**
  - The "Claude Desktop" tab is selected by default in "How to Install". For the developer track, "Claude Code" would be a better default.

---

## 2. Cross-Cutting Concerns

### A. Unicode Rendering Bug (HIGH PRIORITY)
Escaped unicode sequences (`\u2014`, `\u2013`, `\u2019`, `\u201330`) are rendered as literal text strings in multiple sections. Confirmed on:
- **1.8 CLAUDE.md Files:** "15\u201330 minutes"
- **1.14 Plugin Recommendations:** "Minimal \u2014 one command", "Burst cost \u2014", "More work \u2014"
- Likely present in other sections' data files too (14 files matched in the `src/content/` directory).

The root cause appears to be escaped unicode in JSX text content that is not being interpreted. In JavaScript strings (inside quotes or template literals), `\u2014` is correctly interpreted as an em-dash. But in JSX text content (between tags), the `\u2014` is treated as literal characters.

### B. ASP.NET/C# Underrepresentation (MEDIUM PRIORITY)
The developer track's code examples and templates lean heavily towards Node.js/React/TypeScript:
- **Section 1.8** (CLAUDE.md): Template is 100% Node/React/TypeScript
- **Section 1.9** (Documentation): Architecture example uses Express/React/PostgreSQL
- **Section 1.15** (Technical Debt): Debt example uses TypeScript file paths

In contrast, the **hallucinations section (1.11)** and **regression testing section (1.12)** provide excellent ASP.NET/C# examples. This inconsistency means the most important "getting started" sections (CLAUDE.md and Documentation Structure) feel foreign to Matt, while later sections feel tailored to him.

### C. Sidebar Navigation Gap (MEDIUM PRIORITY)
Section 1.7 is missing from the developer track sidebar. Navigation goes directly from 1.6 to 1.8. This may indicate that 1.7 (Recurring Tasks) is not included in the developer track, or is a routing issue. It creates a visible numbering gap.

### D. Loading State Flash
Every lazy-loaded section displays "Loading section..." text for a fraction of a second. While brief, it creates a flash of incomplete content. A skeleton loader or instant render would feel more polished.

### E. Quick Wins Links Route to Wrong Track
On the Welcome page, "Quick Wins" links (Go to Brand Voice, Go to Governance, Go to Sessions, Go to Skills) all use `/general/` URLs instead of `/developer/` URLs, which would eject the user from the developer track.

### F. Copy Buttons
Copy buttons are present on all code blocks and prompt cards throughout the developer track. Consistently placed and visually identifiable with a clipboard icon.

---

## 3. Summary Table of Critical Issues

| Priority | Issue | Page(s) | Impact |
|----------|-------|---------|--------|
| P1 | Unicode rendering bug -- `\u2014`, `\u2013` display as literal text | 1.8, 1.14, likely others | Text appears garbled/broken to users |
| P1 | Quick Wins links route to `/general/` track | 1.1 Welcome | Clicking ejects developer users from their track |
| P2 | CLAUDE.md template is 100% Node/React/TypeScript | 1.8 CLAUDE.md | Matt cannot use the template directly; most impactful dev section feels irrelevant |
| P2 | Documentation examples are Node/React only | 1.9 Documentation | Architecture and code style templates do not match Phew!'s stack |
| P2 | Section 1.7 missing from sidebar | All pages | Visible numbering gap (1.6 -> 1.8) |
| P3 | Tech debt example uses TypeScript paths | 1.15 Technical Debt | Minor inconsistency with other sections' ASP.NET examples |
| P3 | Starter Kit defaults to "Claude Desktop" install tab | 1.16 Starter Kit | Developer track should default to "Claude Code" tab |
| P3 | "Loading section..." flash on every page | All sections | Minor polish issue |
| P4 | Handoff scenario percentages total 129% | 1.3 Sessions | Could confuse detail-oriented readers |
| P4 | MCP config examples use `npx` without noting Node.js requirement | 1.13 MCP | Minor gap for non-Node developers |

---

## 4. Matt's Overall Verdict

> "The Avoiding Hallucinations section is brilliant -- those ASP.NET prompts are exactly what I'd use on Monday morning. The CLAUDE.md section sold me on the concept, but then the template was all React/TypeScript and I couldn't just copy-paste it for our .NET projects. Same with the Documentation Structure examples. If those two sections had an ASP.NET/C# variant alongside the Node one, I'd have been up and running in 15 minutes. The governance policy is thorough but not overwhelming, the regression testing comparison with Ghost Inspector is genuinely useful, and the starter kit's week-by-week adoption plan takes the pressure off. Fix the weird character encoding, add a .NET template option, and this is exactly what I asked for in the training."
