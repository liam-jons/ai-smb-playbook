# UX Review Gap Analysis — Production Readiness

## Status Key
- DONE = Fixed in Phase 5 (commit `1a56478`)
- NEW = Built in Phase 6 (this session)
- TODO = Outstanding — needs implementation
- VERIFY = Needs manual verification

---

## Priority 0: Critical (Blocking)

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 0.1 | Direct URL navigation returns 404 (SPA rewrite not applied) | **TODO — P0** | vercel.json at repo root not picked up by Vercel (root dir is `app/`). All sub-routes 404 on refresh/bookmark/share. Confirmed by user. |

---

## Priority 1: Bugs (Must Fix)

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 1.1 | Unicode rendering bug (`\u2014`, `\u2013`, `\u2019`) across 14 files | DONE | Phase 5 |
| 1.2 | Quick Wins links route to wrong track | DONE | Phase 5 |
| 1.3 | Editorial note left in RecurringTasksSection | DONE | Phase 5 |

---

## Priority 2: Content Gaps (High Impact)

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 2.1 | ASP.NET/C# CLAUDE.md template | DONE | Phase 5 |
| 2.2 | ASP.NET/C# documentation examples | DONE | Phase 5 |
| 2.3 | CLAUDE.md references leak into general track | DONE | Phase 5 — track-conditional content |
| 2.4 | Skills & Extensions overwhelming for general users | DONE | Phase 5 — simplified |

---

## Priority 3: UX Polish (Moderate Impact)

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 3.1 | Section numbering gap (1.7 → 1.16) | DONE | Phase 5 — sidebar note added |
| 3.2 | Loading state flash ("Loading section...") | DONE | Phase 5 — skeleton loading states |
| 3.3 | Related section references not hyperlinked | DONE | Phase 5 — clickable links |
| 3.4 | Replace "parameterised" with plain English | TODO | WelcomeSection, GovernancePolicySection, starter-kit-data, sections.ts |
| 3.5 | Starter Kit install tab defaults to Claude Desktop on dev track | TODO | Should default to Claude Code when on developer track |
| 3.6 | Add CoWork definition where first mentioned | TODO | Skills & Extensions section — one sentence |
| 3.7 | Rename "Atomic Task Principle" for general track | TODO | Session Management — "Breaking Big Tasks into Smaller Pieces" |
| 3.8 | Quick Reference Card track filtering | DONE | Phase 5 — track-conditional |

---

## Priority 4: Nice-to-Haves

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 4.1 | Track completion message at end of Starter Kit | TODO | "You've completed the [track]!" with link to other track/homepage |
| 4.2 | Quick audit prompt (shorter version) | TODO | TechnicalDebtSection — "Quick Health Check" |
| 4.3 | Duplicate meta-narrative sections in Welcome | TODO | Consolidate "How this playbook was built" + "How We Built This" |
| 4.4 | MCP discovery guidance | TODO | McpUsageSection — "Discovering MCP Servers" subsection |
| 4.5 | Common mapper inaccuracies callout | TODO | CodebaseMappingSection — top 3-4 things to verify |
| 4.6 | Sidebar truncation on long section names | TODO | Consider shorter display names or tooltip on hover |
| 4.7 | Missing sidebar icon for section 1.16 | DONE | Phase 5 (Package icon added in sections.ts) |
| 4.8 | Save patterns as skills callout | TODO | HallucinationsSection — suggest saving patterns as skills |
| 4.9 | Context window session hygiene guidance | TODO | ContextSimulatorSection — "my session is slow, what do I do?" |
| 4.10 | TypeScript example in context tips | DONE | Phase 5 — track-conditional tips |

---

## New Items from Phase 6 Walkthrough

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 6.1 | Double track selection (homepage + WelcomeSection) | TODO | Key UX issue — user sees track choice twice. Evaluate: remove from Welcome, or merge Welcome into homepage |
| 6.2 | Feedback widget uses mailto: (silently fails) | NEW | Replaced with Resend API integration this session |
| 6.3 | WelcomeSection "What's Covered" shows both tracks | TODO | Should show only current track's highlights |
| 6.4 | Starter kit "repository reference" irrelevant for general users | TODO | Remove/replace "grab the starter-kit/ folder" for general track |
| 6.5 | Skill descriptions too brief in Starter Kit | TODO | "Writing Plans — Writing plan creation" not descriptive enough |
| 6.6 | MCP config examples use `npx` without Node.js note | TODO | McpUsageSection — brief note for non-Node developers |
| 6.7 | Mobile responsiveness untested | VERIFY | Full mobile walkthrough needed |
| 6.8 | Dark mode rendering untested | VERIFY | All sections need dark mode verification |
| 6.9 | PDF download button verification | VERIFY | Does Quick Reference PDF generate/download correctly? |
| 6.10 | "Download All as ZIP" verification | VERIFY | Does /starter-kit.zip exist and serve correctly? |

---

## Summary Counts

| Status | Count |
|--------|-------|
| DONE (Phase 5) | 13 |
| NEW (Phase 6) | 1 |
| TODO (incl P0) | 17 |
| VERIFY | 4 |
| **Total items** | **35** |

---

## Recommended Implementation Order for Remaining TODOs

### Sprint 0: P0 Fix (do FIRST)
0. **0.1** Direct URL 404 — fix vercel.json SPA rewrite (copy into app/ or change Vercel root dir)

### Sprint A: Critical UX (address second)
1. **6.1** Double track selection — resolve homepage/Welcome redundancy
2. **6.3** WelcomeSection "What's Covered" — show only current track
3. **4.3** Consolidate duplicate meta-narrative in Welcome

### Sprint B: Polish (quick wins)
4. **3.4** Replace "parameterised" with "fill-in-the-blanks"
5. **3.5** Starter Kit tab default → Claude Code on dev track
6. **3.6** Add CoWork one-sentence definition
7. **3.7** Rename "Atomic Task Principle" for general track
8. **4.1** Track completion message
9. **6.4** Remove repository reference for general users
10. **6.5** Improve skill descriptions in Starter Kit

### Sprint C: Content additions
11. **4.2** Quick audit prompt in Technical Debt
12. **4.4** MCP discovery guidance
13. **4.5** Common mapper inaccuracies callout
14. **4.8** Save patterns as skills callout
15. **4.9** Session hygiene guidance
16. **6.6** Node.js note for MCP config

### Sprint D: Verification
17. **6.7** Full mobile walkthrough
18. **6.8** Dark mode verification
19. **6.9** PDF download test
20. **6.10** ZIP download test
