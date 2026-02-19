# Known Issues

Issues discovered during previous reviews. Agents should check whether these have been fixed but should not report them as new findings.

*Updated after each review session. Format: date, client, issue, status.*

## Active Known Issues

### Generic sections without full parameterisation
- **Date:** 2026-02-19
- **Affects:** All clients
- **Sections:** Context (1.2)
- **Detail:** The Context section has zero client-specific content. This is by design — it teaches universal Claude concepts.
- **Status:** Documented as expected. Do not flag as blocking.

### HallucinationsSection hardcoded ASP.NET references
- **Date:** 2026-02-19
- **Affects:** Non-ASP.NET clients (not Phew)
- **Sections:** Avoiding Hallucinations (1.12)
- **Detail:** `getPatterns()` extracts `techStack` from config but two prompts hardcode "ASP.NET" (lines 54, 114-116) instead of using the variable. Pattern 4 also references "ASP.NET Core Identity" which is framework-specific.
- **Status:** Advisory. Does not affect Phew or AMD (AMD has no developer track). Should be fixed before deploying to a client with a different tech stack.

### Developer section tabs show ASP.NET for all clients
- **Date:** 2026-02-19
- **Affects:** Non-ASP.NET clients
- **Sections:** CLAUDE.md Files (1.9), Documentation Structure (1.10)
- **Detail:** Tabbed template examples have hardcoded "ASP.NET / C#" tab labels alongside Node.js tabs. These are multi-stack educational examples, but could confuse clients on different stacks.
- **Status:** Advisory. Low priority — consider conditionally showing tabs based on `techStack`.

## Resolved Issues

### SkillsExtensionsSection hardcoded licence line
- **Date resolved:** 2026-02-19 (Session 37)
- **Original issue:** Hardcoded "Your team has Claude Teams licences for all staff and Claude Code access for developers" — wrong for clients without developer track.
- **Fix:** Now uses `useSiteConfig().hasDeveloperTrack` to conditionally show "and Claude Code access for developers".

### ReliableOutputSection generic example
- **Date resolved:** 2026-02-19 (Session 37)
- **Original issue:** Used "a client proposal for a new website redesign project" — Phew-specific.
- **Fix:** Now uses `useSiteConfig().primaryProduct` to generate a contextual project description (e.g. "a new MEP project" for AMD, "a new LMS project" for Phew).
