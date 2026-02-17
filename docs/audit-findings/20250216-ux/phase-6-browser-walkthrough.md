# Phase 6 Browser Walkthrough Report

**Tester persona:** Amanda Kelly, non-technical marketing manager at Phew Design Limited
**Production URL:** https://ai-smb-playbook.vercel.app
**Date:** 16 February 2026
**Viewport tested:** Desktop (1280x900), Mobile (375x812 / 390x844)

---

## CRITICAL BUG: Direct URL Navigation Returns 404

**Severity: P0 — Blocking**

Every sub-route returns a Vercel `404: NOT_FOUND` when accessed via direct URL (typed, bookmarked, shared, or refreshed):
- `https://ai-smb-playbook.vercel.app/general` — 404
- `https://ai-smb-playbook.vercel.app/general/welcome` — 404
- `https://ai-smb-playbook.vercel.app/process` — 404

**Confirmed by user in incognito session.**

**Impact:** If Amanda bookmarks a section, shares a link with a colleague, or refreshes the page, she gets a blank error page. This makes the playbook fundamentally broken for sharing and return visits.

**Root cause:** The `vercel.json` file at the repo root contains an SPA rewrite rule (`"source": "/(.*)", "destination": "/index.html"`), but Vercel's root directory is configured to `app/` in the dashboard. The rewrite rules in the root-level `vercel.json` may not be applied because Vercel looks for config within the root directory.

**Fix options:**
1. Move `vercel.json` into the `app/` directory (adjust paths as needed)
2. Create a separate `vercel.json` inside `app/` with just the rewrites/headers
3. Change the Vercel dashboard root directory to the repo root and set build command to `cd app && bun run build`

---

## Step 1: Homepage

**What I see:** Clean, centred layout with "Phew! AI Playbook" title, two large track cards (General Users / Developers), section previews, and "Get started" CTAs. Header has track buttons, feedback icon, and theme toggle.

**Assessment:** Good. Clear purpose, clear action. The homepage does its job well.

**Issues:**
- Header already has "General Users" and "Developers" buttons, duplicating the track selection in the cards. Three ways to choose a track on the homepage (header buttons, card links, "Get started" links).

---

## Step 2: Entering the General Track

Clicking General Users navigates to `/general/welcome`. Sidebar appears with 8 sections (1.1-1.7 + 1.16). "Sections 1.8-1.15 are in the Developer track" note present.

**Assessment:** Clear navigation. "All users" badge helpful.

---

## Step 3: Welcome Section — The Duplicate Track Selector (KEY ISSUE)

Scrolling down reveals "Choose Your Track" with two full-size cards — the same track selection the user already completed on the homepage.

**The user has now seen track selection THREE times:**
1. Homepage — two large cards (where they clicked to arrive)
2. Header — "General Users" / "Developers" buttons (persistent)
3. Welcome section — another "Choose Your Track" with two cards

**Clicking "Start the General track" from within the Welcome section creates a circular loop** — it navigates to `/general` which loads the same Welcome section.

### Recommended Approach
1. **Remove the "Choose Your Track" section from Welcome entirely.** Header buttons provide persistent track switching.
2. **Filter "What's Covered" to only show the current track.**
3. **Consolidate the two "How this was built" sections** at the bottom of Welcome.

---

## Step 4: Full Welcome Section Content

**Subsections reviewed:**
- Your AI Playbook — Good opening, references training date
- How to Use This Playbook — Clear, actionable
- Choose Your Track — REDUNDANT (see above)
- What's Covered — Shows both tracks (should filter to current)
- Quick Wins — Excellent, immediately actionable
- Quick Reference Card — Very useful cheat sheet, PDF download button
- How this playbook was built — Meta-narrative callout
- Feedback — Send Feedback button
- How We Built This — Process doc link (near-duplicate of meta-narrative above)

**Issue:** Two nearly identical sections: "How this playbook was built" (callout) and "How We Built This" (link). Should consolidate.

---

## Step 5: Section 1.2 — How Context Works

Outstanding content. Interactive Context Window Simulator makes abstract concept tangible. "Moderate (Typical Phew! setup)" preset personalises the experience. Desk metaphor is excellent.

**Issues for Amanda:** Terms like "MCP Servers", "CLAUDE.md", "Response Buffer" are technical. The "Full attention" badge isn't explained.

---

## Step 6: Section 1.4 — Skills, Extensions & Decision Tree

Decision tree approach ("What do you want Claude to do?") is user-friendly. Natural language callout is essential and well-placed.

**Issues:** Platform Availability matrix dense for non-technical users. "CoWork" referenced without introduction. Section is very long.

---

## Step 7: Section 1.16 — Starter Kit Contents

Quick Start card with weekly schedule and time estimates is excellent. "How to Install" tabs are practical.

**Issues:** "Download All as ZIP" link needs verification. "starter-kit/ folder from the project repository" irrelevant for Amanda.

---

## Step 8: Homepage Return

Homepage feels redundant once in a track. No "return to where I was" memory.

**Recommendation:** Consider localStorage-based track memory, or have logo return to current track's Welcome.

---

## Step 9: Mobile Viewport

Homepage: Cards stack vertically, clean layout. Section pages: Sidebar collapses to hamburger menu, content full-width. Context simulator adjusts to viewport.

**Issues:** Previous/next pagination is the primary mobile navigation (sidebar hidden). Tables may need horizontal scroll on mobile.

---

## Summary of All Findings

| Priority | Issue | Status |
|----------|-------|--------|
| P0 | Direct URL navigation returns 404 (SPA rewrite not applied) | **CONFIRMED — must fix** |
| P1 | Triple track selection (homepage + header + Welcome section) | TODO |
| P1 | "Start the General track" creates circular loop in Welcome | TODO |
| P2 | "What's Covered" shows both tracks regardless of current track | TODO |
| P2 | Duplicate "How this was built" / "How We Built This" sections | TODO |
| P2 | Scroll past section end auto-navigates to next section | Investigate |
| P3 | Homepage has no track memory (always shows selector) | Nice-to-have |
| P3 | Technical terminology in general sections (MCP, CLAUDE.md) | Partially addressed in Phase 5 |
| P3 | Starter Kit references "project repository" (irrelevant for general users) | TODO |
| P3 | Mobile table rendering needs verification | VERIFY |
