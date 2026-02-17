# 5. Review general track content quality

One notable finding:

- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/session-management-data.ts`, line 668: `"Write this assuming the reader knows nothing about the project."` -- This is inside a copyable prompt template, so it's part of an instruction the user would give to Claude. It is acceptable in context (it's telling Claude how to write the handoff document), but technically uses "the reader" to refer to the recipient of the handoff document, not the current app user. This is borderline acceptable.

---

Now I have all the data I need to write the comprehensive report.

---

# Content Quality Review: General Track Sections and Shared Pages

## Summary

Reviewed 10 files across general track sections, shared pages, and the governance template. Found **3 meta-narrative instances** (should be at most 1), **borderline editorial annotations** in the governance section, and **no significant third-person language issues** or **editorial notes accidentally left in production**. Placeholder handling in the governance template is well-designed but not interactively editable. Section introductions are generally strong.

---

## 1. Editorial Notes Left in Production

### GovernancePolicySection.tsx -- Borderline Annotations

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/GovernancePolicySection.tsx`

Each policy section has an `annotation` field displayed under a "Why this matters" callout. While these are intentionally user-facing, several read more like authorial meta-commentary about the design of the policy than guidance for the reader:

| Line | Annotation Text | Assessment |
|------|----------------|------------|
| 218 | "This sets the tone for the whole policy: proportionate, not bureaucratic. The key message is that governance exists to enable confident adoption, not to create red tape." | **Borderline** -- describes the design intent rather than explaining to the reader why the section matters to them. |
| 233-234 | "Covers everything across all Claude surfaces. The scope is deliberately broad so nothing slips through the cracks..." | **Borderline** -- "deliberately broad" is authorial voice. |
| 256 | "One clear owner (the AI Lead) keeps things simple. This does not need to be a developer..." | **Acceptable** -- practical guidance. |
| 270 | "Three tiers keep it simple. Most day-to-day extensions will be Tier 1..." | **Acceptable** -- reassuring context. |
| 296-297 | "The process scales with risk. Tier 1 takes 30 seconds (just log it). Tier 2 takes a day or two." | **Acceptable** -- practical time estimates. |
| 330 | "These standards ensure internal extensions are reliable and reusable. The key principle: another team member should understand the extension without explanation from the author." | **Borderline** -- "The key principle" reads like authorial summary. |
| 342 | "The register does not need to be complex -- a shared spreadsheet works well for a team of 10." | **Acceptable** -- practical advice. |
| 365 | "The quarterly review is 30 minutes, not a full audit." | **Acceptable** -- time context. |
| 382 | "This section is critical for Phew! given the safeguarding context." | **Borderline** -- reads like a note about why the section was written, not guidance for the reader. |
| 400 | "Seven clear steps, starting with the most important one: stop using it." | **Acceptable** -- emphasises the key takeaway. |

**Recommendation:** Lines 218, 233-234, 330, and 382 should be reworded to address the reader directly rather than describing the policy's design decisions.

### All Other Files

No editorial notes, meta-commentary, or "this section should..." style content found in any other reviewed file.

---

## 2. Third-Person Language

**No issues found across any reviewed file.** All user-facing content consistently uses "you/your" to address the reader.

The only instances of "the user" or "the reader" appear inside:
- Skill file examples (SKILL.md content embedded as code blocks), where "the user" correctly refers to the Claude user within instructions TO Claude. These are appropriate.
- One handoff prompt template in `session-management-data.ts` line 668: `"Write this assuming the reader knows nothing about the project."` -- acceptable because "the reader" refers to the person who will receive the handoff document, not the current app user.

---

## 3. Meta-Narrative Instances (App Built with AI/Claude)

**Found 3 instances. The requirement is a maximum of 1.**

### Instance 1: SessionManagementSection.tsx
**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/SessionManagementSection.tsx`
**Lines:** 425-431
```tsx
<CalloutCard variant="info" className="mt-4">
  <p className="text-xs">
    This playbook itself was built using the atomic task principle —
    each section was a separate session with its own handoff prompt and
    fresh context window.
  </p>
</CalloutCard>
```
**Context:** Appears in the "Breaking Tasks into Subtasks" part of session management.

### Instance 2: WelcomeSection.tsx (the designated one)
**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/WelcomeSection.tsx`
**Lines:** 415-451
```tsx
{/* ── How This Was Built (Meta-narrative) ──────────── */}
<section aria-labelledby="how-built-heading">
  <h2 ...>How This Playbook Was Built</h2>
  <p ...>
    This playbook was built using the exact tools and workflows it
    describes. The content was planned and researched using Claude with
    structured prompts and session handoffs — the same techniques covered
    in your training. The app itself was built by parallel Claude Code
    agents, each working from a detailed spec...
  </p>
  ...
</section>
```
**Context:** A full dedicated section on the Welcome page. The comment even labels it "Meta-narrative". This appears to be the intended single instance.

### Instance 3: HomePage.tsx
**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/layout/HomePage.tsx`
**Lines:** 123-127
```tsx
{/* Meta-narrative note */}
<p className="mt-8 text-center text-xs text-muted-foreground/70">
  This playbook was itself built using Claude and the workflows it
  describes.
</p>
```
**Context:** Footer-style note on the homepage, below the track selection cards. The comment labels it "Meta-narrative note".

**Recommendation:** Keep Instance 2 (WelcomeSection.tsx) as the single canonical meta-narrative. Remove Instance 1 (SessionManagementSection callout) and Instance 3 (HomePage footer note). Instance 1 is the most jarring because it interrupts a practical section about task decomposition with self-referential commentary.

---

## 4. Introduction Quality

| Section | File | Rating | Notes |
|---------|------|--------|-------|
| 1.2 Context Window | `ContextSimulatorSection.tsx` | **Good** | Explains context window with a "desk" analogy, provides token count, explains why it matters, introduces the simulator. Clear and accessible. |
| 1.3 Session Management | `SessionManagementSection.tsx` | **Good** | Opens with the key takeaway as a callout, then explains when/why to stop sessions. Strong framing. |
| 1.4 Skills & Extensions | `SkillsExtensionsSection.tsx` | **Good** | Explains the concept of extensions, categorises them (always-on, on-demand, background), previews the decision tree. Mentions Phew! context. |
| 1.5 Governance Policy | `GovernancePolicySection.tsx` | **Good** | Immediately sets the right tone ("not about red tape"), explains the template format, shows placeholder badges. |
| 1.6 Brand Voice | `BrandVoiceSection.tsx` | **Good** | Two-part structure (UK English + Brand Voice) with time estimates. Explains the US English default issue concisely. |
| 1.7 Recurring Tasks | `RecurringTasksSection.tsx` | **Good** | Honest about limitations upfront ("no built-in scheduler"), then immediately provides alternatives. Builds trust. |
| 1.8 Measuring ROI | `RoiMeasurementSection.tsx` | **Good** | Practical framing ("every licence needs to earn its keep"), provides an actionable starting point ("pick one task"). |
| Welcome | `WelcomeSection.tsx` | **Good** | Contextualises the playbook relative to the training sessions, explains navigation, highlights quick wins. |
| Starter Kit | `StarterKitSection.tsx` | **Good** | Explains what the kit is, provides the marketplace vs manual distinction, ties back to governance. |
| Home Page | `HomePage.tsx` | **Good** | Clean two-track selection with section previews. Minimal but effective. |

All introductions explain what is covered, why it matters, and what tools/resources are available. No section rated "Needs Work" or "Poor".

---

## 5. Governance Template Placeholders

### In-App Experience (GovernancePolicySection.tsx)

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/GovernancePolicySection.tsx`

The governance template UI works as follows:

- **Placeholder rendering:** `{{PLACEHOLDER}}` values are rendered as interactive `PlaceholderBadge` components -- styled badges with a hover tooltip showing the description and example value.
- **Hover/tap tooltips:** Each badge shows "Description" + "e.g. Example value" on hover or tap.
- **Copy functionality:** Users can copy the full policy text via a CopyButton or download as markdown. The copied/downloaded text contains the raw `{{PLACEHOLDER}}` strings.
- **NOT interactively editable:** Users cannot type replacement values into the placeholders within the app. They must copy the document and perform find-and-replace in their own editor.
- **Full customisation reference table:** A table at the bottom lists all 9 placeholders with descriptions and example values.

### Standalone Template (starter-kit/templates/governance-policy-template.md)

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/starter-kit/templates/governance-policy-template.md`

The standalone template contains raw `{{PLACEHOLDER}}` values as expected.

### Placeholder Name Inconsistency

The in-app version and the standalone template use **different placeholder names** for some fields:

| Concept | In-App (GovernancePolicySection) | Standalone Template |
|---------|--------------------------------|---------------------|
| Person responsible | `{{POLICY_OWNER}}`, `{{AI_LEAD_NAME}}`, `{{AI_LEAD_ROLE}}` | `{{ADMIN_CONTACT}}` |
| Review schedule | `{{NEXT_REVIEW}}` | `{{REVIEW_FREQUENCY}}` |

The in-app version is more granular (separating the policy owner from the AI Lead name/role), while the standalone template uses a single `{{ADMIN_CONTACT}}` for all responsible-person references and `{{REVIEW_FREQUENCY}}` for the schedule. These represent the same governance policy but with different parameterisation schemes, which could confuse users who reference both.

---

## Files Reviewed

1. `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/sections.ts`
2. `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/ContextSimulatorSection.tsx`
3. `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/SessionManagementSection.tsx`
4. `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/SkillsExtensionsSection.tsx`
5. `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/GovernancePolicySection.tsx`
6. `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/BrandVoiceSection.tsx`
7. `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/RecurringTasksSection.tsx`
8. `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/RoiMeasurementSection.tsx`
9. `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/WelcomeSection.tsx`
10. `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/StarterKitSection.tsx`
11. `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/layout/HomePage.tsx`
12. `/Users/liamj/Documents/development/ai-smb-playbook/starter-kit/templates/governance-policy-template.md`

---

**Files referenced:**
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/sections.ts`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/ContextWindowSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/ContextSimulatorSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/SessionManagementSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/SkillsExtensionsSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/GovernancePolicySection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/BrandVoiceSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/RecurringTasksSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/RoiMeasurementSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/WelcomePage.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/WelcomeSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/StarterKitSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/layout/HomePage.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/starter-kit/templates/governance-policy-template.md`

---
*Agent: `abd3712` | Session: `46d06ca6-d7d3-4777-a0d1-d02ea203421f` | Rows: 79*
*2026-02-17T14:13:34.035Z -> 2026-02-17T14:17:31.824Z*