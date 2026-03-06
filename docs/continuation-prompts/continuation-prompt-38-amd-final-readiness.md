# Continuation Prompt 38: AMD Final Readiness Audit

## Context

AMD Group is a general-track-only client (`hasDeveloperTrack: false`) with 10 sections. The playbook-review skill gave it a GO verdict (Session 37), but manual testing revealed three bugs that need fixing before send. After fixing those, we need a page-by-page visual audit using the `frontend-design:audit` and `frontend-design:critique` skills to ensure production quality.

**Client config:** `app/public/clients/amd.json`
**Production URL:** `https://ai-smb-playbook.vercel.app/?client=amd`
**Local dev URL:** `http://localhost:4100/?client=amd`

## Phase 1: Fix Known Bugs (3 items)

### Bug 1: AMD logo invisible in light mode

**File:** `app/src/components/content/ClientLogo.tsx`
**Problem:** The AMD logo (`/clients/logos/amd.webp`) has white text on a transparent background. In light mode, the white text is invisible against the light background. Only the coloured chevron arrows are visible. The component handles dark mode (wraps logo in a white container when no dark variant exists) but does NOT handle the reverse case -- a white-text logo on a light background.

**Fix approach (choose one):**
- **Option A (preferred):** Request/create a dark-text variant of the AMD logo for light mode. Save as `/clients/logos/amd-light.webp`. Update `amd.json` to set `clientLogoUrl` to the light variant and `clientLogoDarkUrl` to the current `/clients/logos/amd.webp`.
- **Option B:** Add light-mode handling to `ClientLogo.tsx` -- detect when the logo needs a dark container in light mode. This could use a new config field like `logoNeedsDarkBackground: true` or invert the container logic.

**Verify:** Open `http://localhost:4100/?client=amd` in light mode and confirm the full AMD logo (including text) is visible.

### Bug 2: Header link drops `?client=` query parameter

**File:** `app/src/components/layout/Header.tsx` (and systemic across all `Link` components)
**Problem:** The header title link uses `to="/"` which navigates to `/` without preserving the `?client=amd` query parameter. On Vercel (where the domain is `ai-smb-playbook.vercel.app`, not a subdomain), the client config is determined by the `?client=` param. Losing it means the next page refresh reverts to the default config -- showing developer track, wrong company name, etc.

**Affected files (all internal `Link` components that use static paths):**
- `Header.tsx`: lines 26 (`to="/"`), 39 (`to="/general"`), 52 (`to="/developer"`), 111, 124
- `HomePage.tsx`: lines 109 (`to="/general"`), 141 (`to="/developer"`)
- `Sidebar.tsx`: line 177 (`to="/developer"`), line 194 (`to={\`/${track}/${section.slug}\`}`)
- `StarterKitSection.tsx`: line 1163 (`to="/"`)
- `NotFoundPage.tsx`: lines 25, 32, 41
- Various section cross-references (e.g. `to={\`/${track}/documentation\`}`)

**Fix approach:** Create a `useClientLink` hook or utility that preserves the `?client=` search param on all internal navigation when one is present. Options:
1. **Custom hook approach:** `useClientLink()` returns a function `clientLink(path: string)` that appends the current `?client=` param if present. All `Link to=` props call this function.
2. **React Router wrapper:** Create a `ClientLink` component that extends `Link` and automatically preserves search params.
3. **Global search param preservation:** Use React Router's `useSearchParams` in the router/layout level to persist the `client` param across navigations.

Option 3 is cleanest -- investigate whether React Router v7 supports a search param persistence mechanism at the layout level. If not, Option 1 is the most pragmatic.

**Verify:** Navigate around the AMD playbook clicking header links, sidebar links, and cross-references. Confirm the URL always retains `?client=amd`. Refresh any page and confirm AMD config persists.

### Bug 3: Unicode escapes in JSON source files

**Files:** `app/public/clients/phew.json`, `app/public/clients/_template.json`
**Problem:** These JSON files contain `\u2014` (em dash), `\u2013` (en dash), and `\u00a3` (pound sign) escape sequences instead of actual UTF-8 characters. While these are valid JSON and render correctly after parsing, they reduce source readability and are inconsistent with `amd.json` which uses actual UTF-8 characters.

**Fix:** Replace all unicode escapes with their UTF-8 equivalents:
- `\u2014` -> `--` (em dash)
- `\u2013` -> `--` (en dash)
- `\u00a3` -> pound sign

This is in `phew.json` (3 instances) and `_template.json` (6 instances). `amd.json` is clean.

**Verify:** Run `grep -rn '\\u[0-9a-fA-F]\{4\}' app/public/clients/` and confirm zero results. Run `bun run build` to confirm valid JSON.

## Phase 2: Page-by-Page Visual Audit

After fixing the three bugs, start the dev server (`cd app && bun run dev`) and systematically audit each AMD page.

Deploy parallel agents who should each use agent-browser with the --session flag and the agent-browser skill to complete the audit for their page.

### Audit approach

For each page:
1. Navigate to the page
2. Run `frontend-design:critique` -- assess visual hierarchy, information architecture, emotional resonance, design quality
3. Run `frontend-design:audit` -- check accessibility, performance, theming, responsive design
4. Record findings with severity (blocking / should-fix / nice-to-have)

### Pages to audit (11 total)

| # | Page | URL Path | Key things to check |
|---|------|----------|---------------------|
| 1 | Homepage | `/` | AMD logo visible (light + dark), company name correct, only General Users card (no developer card), training date, consultant name |
| 2 | Welcome & Orientation | `/general/welcome` | Training date, consultant name, no developer track link |
| 3 | How Context Works | `/general/context` | Generic content OK, context window simulator works |
| 4 | Session Management | `/general/sessions` | Worked examples render, no client-specific issues |
| 5 | Getting Reliable Output | `/general/reliable-output` | Uses "MEP" from primaryProduct in pattern 1 prompt |
| 6 | Extending Claude | `/general/skills-extensions` | Licence line says "Claude Teams licences for all staff" WITHOUT "and Claude Code access for developers" |
| 7 | AI Governance Policy | `/general/governance` | Company name "AMD Group", industry "Construction and engineering", sensitive data references correct |
| 8 | Brand Voice & UK English | `/general/brand-voice` | All 7 framework examples render with AMD-specific content (MEP, construction, 50+ years, etc.) |
| 9 | Task Automation | `/general/recurring-tasks` | 4 AMD-specific examples (PQQ preparation, weekly report, compliance tracking, O&M manual). Check "the bid team" (not "Sonia's team") |
| 10 | Measuring ROI | `/general/roi-measurement` | 3 AMD ROI examples (PQQ preparation, contract review, policy maintenance). ROI calculator works. |
| 11 | Starter Kit Contents | `/general/starter-kit` | 13 items visible (10 base + 3 business-development). No developer items shown. Download buttons work. |

### Additional checks

- **404 page:** Navigate to `/nonexistent?client=amd` -- confirm it shows AMD title, no developer link
- **Mobile responsive:** Resize browser to mobile width, check each page renders correctly
- **Dark mode:** Toggle dark mode, verify all pages look correct (especially logo container)
- **Sidebar:** Verify only 10 sections listed, no developer track link, correct icons and titles
- **Copy buttons:** Test copy-to-clipboard on at least 3 prompt/code blocks across different sections
- **Print/PDF:** Test the reference card print from the Welcome section

## Phase 3: Consolidate and Fix

After the audit:
1. Compile all findings into a prioritised fix list (blocking > should-fix > nice-to-have)
2. Implement blocking and should-fix items
3. Re-test fixed pages
4. Run `bun run build && bun run lint && bun run format:check` to confirm clean
5. Commit with a descriptive message

## Phase 4: Final Verification

1. Push to main and verify the Vercel preview deployment
2. Open `https://ai-smb-playbook.vercel.app/?client=amd` and spot-check 3-4 pages
3. Confirm the three original bugs are fixed on production
4. Update `.planning/client-specific/01-amd/review-report-2026-02-19.md` with a "Post-Audit" addendum noting the fixes applied

## Deliverables

- All three bugs fixed and committed
- Page-by-page audit findings documented
- All blocking/should-fix items resolved
- Clean build on Vercel
- AMD playbook ready to send to client
