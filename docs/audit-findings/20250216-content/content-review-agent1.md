# Content Review — Agent 1 Findings

Review date: 16 February 2026
Reviewer scope: HomePage, WelcomeSection, StarterKitSection, ProcessDocPage, ContextSimulatorSection, SessionManagementSection, SkillsExtensionsSection

---

## HomePage (`app/src/components/layout/HomePage.tsx`)

### Issues Found

- [ ] **[Copyable prompts / non-prompt text]** Not applicable — no copyable prompts or code blocks in this component. Clean.
- [ ] **[Content continuity]** The Developer track card description (line 94-95) says "Covers Claude Code, CLAUDE.md files, codebase mapping, testing, and technical workflows." This is accurate against the section registry, which includes those topics. However, the developer track also includes sections on hallucinations, safe MCP usage, plugin recommendations, and technical debt — none of which are mentioned. This is a minor representational gap but acceptable given space constraints. No action needed.
- [ ] **[UK English]** Line 31: `siteConfig.metaDescription` resolves to "Practical guidance for getting the most from Claude AI" — no UK English issues. All text checked, no American spellings found.

### No Issues

HomePage is clean. It uses `siteConfig` values correctly, has no copyable content, uses appropriate link targets (`/general`, `/developer`), and the section counts are dynamically generated. The meta-narrative footer (line 124-127) is appropriate and concise.

---

## WelcomeSection (`app/src/content/shared/WelcomeSection.tsx`)

### Issues Found

- [ ] **[UK English]** Line 69 in `QUICK_REFERENCE_ITEMS_ALL` — "Skills" section item reads: `"Skills are reusable instruction files that shape Claude's behaviour."` — Correct UK spelling ("behaviour"). No issues found after full check.

- [ ] **[Copyable prompts / non-prompt text]** No `PromptExample` or `CodeBlock` components in this file. The Quick Reference Card is rendered as plain text, not copyable blocks. The print-to-PDF feature generates an HTML document from the same data. Clean.

- [ ] **[Track-conditional rendering]** The `getQuickReferenceItems()` function correctly filters by track. The "Skills (Developer)" and "For Developers" sections have `track: 'developer'` and are only shown to developer-track users. The Quick Wins section uses track-aware link paths (`/${track}/brand-voice`, etc.). This is correct.

- [ ] **[General readability]** Line 93 in `QUICK_REFERENCE_ITEMS_ALL`: `'Use /plugin install for: pr-review-toolkit, security-guidance, context7.'` — The command syntax should be `claude plugin install` (not `/plugin install`). The `/plugin install` format is not a valid Claude Code command. This is a factual error that would confuse developers.

- [ ] **[Content continuity]** The Quick Wins section references four sections: Brand Voice, Governance, Sessions, and Starter Kit. All four links use correct slugs matching the section registry. The cross-references are accurate.

- [ ] **[Content continuity]** The "How This Playbook Was Built" section (lines 428-435) references "Skills, CLAUDE.md files, and the governance principles described here were used throughout." This is a meta-narrative claim. It cross-references the process document via a link to `/process` (line 446). This is correct.

### Summary of Actual Issues

1. **[Factual error]** Line 93: `'Use /plugin install for: pr-review-toolkit, security-guidance, context7.'` should be `'Use claude plugin install for: pr-review-toolkit, security-guidance, context7.'` The `/plugin install` syntax is incorrect — Claude Code uses `claude plugin install <name>`, not a slash command.

---

## StarterKitSection (`app/src/content/shared/StarterKitSection.tsx`)

### Issues Found

- [ ] **[Copyable prompts / non-prompt text — CodeBlock]** Line 494-498: The "Profile preferences" CodeBlock contains instructional text that doubles as a copyable instruction string: `"Always use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (£) for currency."` This is intended to be pasted into Claude's profile preferences field, so this is actually correct — it IS the content the user would paste. Clean.

- [ ] **[Copyable prompts / non-prompt text — CodeBlock]** Line 507-509: The CLAUDE.md UK English rule CodeBlock contains: `"- **UK English throughout.** All output must use UK English spelling and grammar..."` — This is a markdown snippet intended for CLAUDE.md. Appropriate for a copyable block. Clean.

- [ ] **[Copyable prompts / non-prompt text — CodeBlock]** Lines 519, 530, 540, 551: Install command CodeBlocks contain bash commands (`cp -r ...`, `claude plugin install <plugin-name>`). These are correct — they are copyable terminal commands. Clean.

- [ ] **[Component rendering issues]** The `FileBrowser` component uses `getCategoriesForTrack(track)` to determine which tab categories to show. The `defaultTab` is set to `categories[0] || 'skill'`. If no categories exist for a track (unlikely but possible), the fallback to `'skill'` would show a tab that has no matching `TabsContent`, which would render as blank. In practice this is not an issue since both tracks have files, but it is a defensive coding gap.

- [ ] **[Track-conditional rendering]** The `FileCard` component (line 208-211) filters out `claudeCode` install instructions for general track users. This is correct — general users should not see Claude Code instructions. The `InstallationGuides` component (line 571) sets the default tab to `'code'` for developers and `'desktop'` for general users. The Claude Code tab is only rendered for developers (line 589-595, 723-763). This is correct.

- [ ] **[UK English]** Line 769: "Provisioning Skills Organisation-Wide" — correct UK spelling ("Organisation"). Full check passed.

- [ ] **[Content continuity]** The PluginGuidanceCallout (line 441-476) links to `/${track}/governance` for the governance policy. The governance section slug is `'governance'` in the registry. Correct.

- [ ] **[Content continuity]** The track completion message (lines 1042-1044) for general users says "from context management to skills, governance, and brand voice." This accurately reflects the general track sections (context, sessions, skills-extensions, governance, brand-voice, recurring-tasks, starter-kit). Correct.

### Summary of Actual Issues

No significant issues found. StarterKitSection is well-structured with correct track-conditional rendering, appropriate copyable content, and accurate cross-references.

---

## ProcessDocPage (`app/src/content/shared/ProcessDocPage.tsx`)

### Issues Found

- [ ] **[Component rendering issues]** The markdown parser (line 22-120) handles headings (h1-h4), paragraphs, lists (unordered with `-`), blockquotes, fenced code blocks, and horizontal rules. However, it does NOT handle:
  - **Ordered lists** (numbered `1. 2. 3.` lists) — these will be parsed as paragraphs, losing their numbering and structure.
  - **Nested lists** — any sub-items will be treated as separate list items or paragraphs.
  - **Tables** — markdown tables will be rendered as plain text paragraphs.
  The process document (`docs/repeatable-workflow.md`) does NOT appear to use ordered lists or tables in its first 50 lines, but this is a limitation worth noting if the document grows.

- [ ] **[Broken or missing links]** Line 278: The document fetches from `/docs/repeatable-workflow.md`. This assumes the file exists in the `public/docs/` directory at build time. The file does exist (confirmed). However, the path must be served by Vercel's SPA rewrites. The `vercel.json` includes a rewrite rule `{ "source": "/(.*)", "destination": "/index.html" }` which would catch this path — but this means the markdown file would return the SPA HTML, not the raw markdown. This is a potential issue: the fetch may return HTML instead of markdown content. **However**, Vercel's rewrite rules are evaluated after static files, so if `dist/docs/repeatable-workflow.md` exists as a static asset, it would be served correctly. This depends on whether the docs folder is included in the build output.

- [ ] **[Copyable prompts / non-prompt text]** The "Copy full document" button (lines 338-340) copies the raw markdown content of the process document. This is appropriate — the user would paste the entire document into another context. Clean.

- [ ] **[General readability]** The `renderInline` function (lines 123-171) handles bold, inline code, and links. It does NOT handle italic (`*text*` or `_text_`), strikethrough, or images. If the process document uses italic formatting, it would be rendered as plain text with asterisks.

- [ ] **[UK English]** The process document content itself is fetched at runtime, so UK English compliance depends on the source file. The component code is clean.

### Summary of Actual Issues

1. **[Component rendering limitation]** The markdown parser does not support ordered lists (`1. 2. 3.`), nested lists, or tables. If the process document uses these features, they will render incorrectly as plain paragraphs.
2. **[Component rendering limitation]** The inline renderer does not support italic text (`*text*`). Italic content would show with literal asterisks.

---

## ContextSimulatorSection (`app/src/content/general/ContextSimulatorSection.tsx`)

### Issues Found

- [ ] **[Copyable prompts / non-prompt text]** Line 543-548: The `PromptExample` component uses `prompt={sessionHandoffPrompt}`. Checking the `sessionHandoffPrompt` value in `context-simulator-data.ts` (line 287-296), the copyable text is:

  ```
  I need to wrap up this session and continue in a fresh one. Before we stop, please write a comprehensive handoff summary that I can paste into a new session. Include:

  1. **What we were working on** — the overall goal and current task
  2. **What we accomplished** — key decisions made, files created or modified, patterns established
  3. **Current state** — what is working, what is partially complete, what is not started
  4. **Important context** — any conventions, constraints, or requirements that a fresh session needs to know
  5. **Next steps** — what should be done next, in priority order
  6. **Open questions** — anything unresolved that needs attention

  Format this as a single message I can paste at the start of a new session. Write it as instructions to your future self — assume the new session has no memory of this conversation.
  ```

  This is all prompt text — appropriate for copying into Claude. The markdown bold formatting (`**text**`) within the prompt is acceptable since Claude interprets markdown. Clean.

- [ ] **[Copyable prompts / non-prompt text]** Lines 571-575: The `CodeBlock` for `compactInstructions` contains markdown text intended for CLAUDE.md. The content is:

  ```markdown
  ## Compact Instructions

  When compacting this conversation, always preserve:
  - Current task goals and acceptance criteria
  - File paths and function signatures for in-progress work
  - Architecture decisions and their rationale
  - Testing patterns and conventions established
  - Any known issues or edge cases identified
  ```

  This is content the user would paste into their CLAUDE.md file. Appropriate for a copyable block. Clean.

- [ ] **[UK English]** Full check of all text content. No American spellings found. "organise" (line 495 of starter-kit data), "behaviour" (line 69 of context-simulator-data), "customise" (line 552) — all UK. Clean.

- [ ] **[Content continuity]** Line 138-144: Cross-reference to Session Management section uses `/${track}/sessions` link. The section registry slug for Session Management is `'sessions'` (section 1.3). Correct.

- [ ] **[Content continuity]** Line 581-591: Cross-reference to Session Management at the bottom of the section uses the same `/${track}/sessions` link. Correct.

- [ ] **[Content continuity]** The section uses the term "context window" consistently throughout. The session management section also uses "context window." Consistent terminology.

- [ ] **[Content continuity]** The handoff prompt in this section (`sessionHandoffPrompt`) is different from but complementary to the handoff prompts in the Session Management section (`copyablePrompts`). The context section has a single general handoff prompt, while the session management section has multiple specialised prompts (general, developer, emergency, task decomposition, review, delegation). This is appropriate — the context section provides a quick-access version, and the session management section provides the full set. The cross-reference (line 581-591) correctly directs users to the session management section for "more copyable handoff templates."

- [ ] **[General readability]** The heading hierarchy is logical: Introduction (no heading, uses section intro) > Context Window Simulator (h2) > My Session Feels Slow (h2) > Understanding Context (h2 with accordion) > Token Usage and Your Budget (h2) > Session Handoff Prompt (h2). All h2 level within the SectionPage wrapper. Clean.

### Summary of Actual Issues

No issues found. ContextSimulatorSection is clean across all review criteria.

---

## SessionManagementSection (`app/src/content/general/SessionManagementSection.tsx`)

### Issues Found

- [ ] **[Copyable prompts / non-prompt text]** The copyable prompts are rendered via `<PromptExample>` components (lines 812-823), with data from `copyablePrompts` in `session-management-data.ts`. Checking each prompt:

  1. **"Session Handoff — General"** (id: `general-handoff`): The prompt content starts with `"Before we finish, I need you to create a handoff summary..."`. This is pure prompt text. Clean.

  2. **"Session Handoff — Developer"** (id: `developer-handoff`): Starts with `"Create a structured continuation prompt for the next session. Save it as a markdown file."` Contains structured sections with markdown headers (`## Project Context`, etc.). All of this is instruction text for Claude. Clean.

  3. **"Emergency Session Save"** (id: `emergency-general`): Starts with `"Our conversation is getting long and I want to save our progress..."`. Pure prompt. Clean.

  4. **"Emergency Session Save — Developer"** (id: `emergency-dev`): Starts with `"Context is running low. Create an emergency continuation prompt immediately."`. Pure prompt. Clean.

  5. **"Break Down a Large Task"** (id: `task-decomposition`): Contains `"[Describe your task here]"` placeholder. This is a prompt template with a placeholder, which is appropriate. The user would fill in the bracketed section. Clean.

  6. **"Review This Session Before Wrapping Up"** (id: `session-review`): Starts with `"Before we wrap up this session..."`. Pure prompt. Clean.

  7. **"Hand Off to a Colleague"** (id: `delegation`): Contains structured sections with `## Project Overview`, `## Current State`, etc. All instruction text for Claude. Clean.

- [ ] **[Copyable prompts / non-prompt text — CodeBlock]** Line 706-716: The `CodeBlock` for the "recency-weighted summary example" contains example markdown text showing how to format a recency-weighted handoff. This is reference content (an example), not a prompt to paste. It is presented in a CodeBlock which gives it a copy button. This is borderline — a user might want to copy this as a template, but it is example text rather than an actionable prompt. The title "Recency-weighted summary example" makes it clear this is an example. Acceptable.

- [ ] **[UK English]** Full check completed. All text uses UK English. "summarise" (line 200), "recognise" (line 176 of data file), "organised" (confirmed). No American spellings found.

- [ ] **[Content continuity — terminology]** Line 191-196: The terminology callout says: "Throughout this playbook, we use 'handoff prompt' as the primary term for the structured summary you create when ending a session. This is also called a 'continuation prompt' — they mean the same thing." This is excellent — it explicitly addresses a potential terminology confusion between the two terms used across different sections. The ContextSimulatorSection uses "Session Handoff Prompt" (line 529) and the session management data uses both terms. Consistent.

- [ ] **[Content continuity]** Line 167-175: Cross-reference to Context Simulator uses `/${track}/context`. The section slug for "How Context Works" is `'context'` in the registry. Correct.

- [ ] **[Content continuity]** Line 239-244: Link to Skills & Extensions section for general users, pointing to `/${track}/skills-extensions`. The section slug is `'skills-extensions'` in the registry. Correct. The link text says "Project" in the context of setting up a "Project" in claude.ai. This is appropriate — the Skills & Extensions section covers Projects as a reference card.

- [ ] **[General readability]** The heading hierarchy is logical and consistent. Part 1 (When to Stop), Part 2 (Handoff Workflow), Part 3 (Breaking Tasks into Subtasks), Platform Differences, Memory Feature, Developer extras, and Copyable Templates all use h2 headings. Clean.

- [ ] **[Track-conditional rendering]** The `rulesOfThumb` data is filtered by track (line 67). The `tokenAwarenessBands` and `handoffScenarios` are shown only for developers (lines 86, 252). The `workedExamples` are filtered by track (line 364). The `copyablePrompts` are filtered by track (line 813). All track-conditional rendering is correct.

### Summary of Actual Issues

No significant issues found. SessionManagementSection is well-structured with correct cross-references, appropriate copyable prompts, and proper track-conditional rendering.

---

## SkillsExtensionsSection (`app/src/content/general/SkillsExtensionsSection.tsx`)

### Issues Found

- [ ] **[Copyable prompts / non-prompt text — CodeBlock]** Lines 1538-1541: The `naturalLanguageTriggerGuide` CodeBlock contains instructional/explanatory text:

  ```
  To use your skills on claude.ai or Claude Desktop:

  You DON'T need to type a command. Simply describe what you want:

    "I need to write a client proposal in our brand voice"
    -> Claude automatically loads your brand-voice skill
  ...
  ```

  This is educational/instructional text presented in a CodeBlock with a copy button. It is NOT a prompt to paste into Claude — it is guidance on how to use skills. A user copying this and pasting it into Claude would get nonsensical results. This should either (a) not be in a CodeBlock (use regular text/callout instead), or (b) have the copy button removed. The same content appears in the developer track section as well (line 1774-1777).

- [ ] **[Copyable prompts / non-prompt text — CodeBlock]** Lines 1558-1562: The `ukEnglishSkillExample` CodeBlock contains a full skill file example:

  ```markdown
  ---
  name: uk-english
  description: >
    Enforce UK English spelling, grammar, and conventions in all output.
  ...
  ```

  This is a complete SKILL.md file that a user might want to copy and save as a file. Having a copy button here is appropriate — the user would save this content as `SKILL.md`. Clean.

- [ ] **[UK English]** Line 109: `'Always use UK English. Never deploy to production without tests. Use our naming conventions for CSS classes.'` — correct UK spelling. Full check of all data constants: "organise" (line 780), "colour" (line 781), "behaviour" (line 781), "centre" (line 781), "licence" (line 783), "travelling" (line 785), "grey" (line 786). All UK. Clean.

- [ ] **[UK English]** Line 147: `generalNote` says `'You don't type a command.'` — uses a typographic straight apostrophe. Not a UK English issue but worth noting for consistency — other places use curly/smart quotes via `&ldquo;`/`&rdquo;` or JSX `&apos;`. Not a blocking issue.

- [ ] **[Content continuity]** The decision tree entries reference card IDs that match the `referenceCards` array IDs: `'claudemd'`, `'skills'`, `'mcp'`, `'subagents'`, `'agent-teams'`, `'hooks'`, `'plugins'`. All matches checked and correct. The `scrollToCard` function (line 966-974) uses `document.getElementById(`ref-card-${cardId}`)` which matches the `id` prop on `AccordionItem` (line 1356). Correct.

- [ ] **[Content continuity]** The `referenceCards` for general track include: `'projects'` (Projects/Custom Instructions) and `'skills'` (Skills) and `'mcp'` (MCP). The developer track additionally includes: `'claudemd'`, `'subagents'`, `'agent-teams'`, `'hooks'`, `'plugins'`. The track filtering is correct — general users see a simpler subset.

- [ ] **[Content continuity]** The section introduction (line 981-1001) mentions "Phew! has Claude Teams licences for all staff and Claude Code access for developers." The word "licences" uses UK English (noun form). Correct.

- [ ] **[Content continuity — cross-section terminology]** The decision tree entry for "I want Claude to always follow certain rules" (line 103-118) recommends "CLAUDE.md / Project custom instructions." The general user note says "On claude.ai and Claude Desktop, use Projects with custom instructions." The context section and session management section also refer to "project custom instructions" and "Projects." Consistent terminology.

- [ ] **[Component rendering issues]** The availability matrix uses `ScrollArea` with horizontal scrolling for smaller screens (line 1139). The `AvailabilityCell` component uses a `<td>` element returned from a function component — this works correctly because it is rendered inside a `<tr>` in the table. However, the `TooltipProvider` wrapping individual `<td>` elements (line 852-873) could cause hydration issues in some React versions if the Tooltip portal renders outside the table structure. This is a minor potential rendering concern but unlikely to cause visible issues with Radix UI's implementation.

- [ ] **[General readability]** The section is very long (~1790 lines). While it is well-structured with clear headings, separators, and accordion groupings, the sheer length could be overwhelming for general users. The content is appropriate for the scope (it covers the entire extension ecosystem), but the general track view correctly hides developer-only content (subagents, agent teams, hooks, plugins reference cards, feature layering rules).

- [ ] **[Content continuity]** Line 132 in data: The Skills reference card `devDetails` says `'Skills are filesystem-based, stored in .claude/skills/ as directories containing a SKILL.md file. Invoke explicitly with /skill-name or let Claude auto-load based on task relevance.'` The WelcomeSection Quick Reference Card says `'Claude Code: Place .md files in .claude/skills/ in your project root.'` — There is a slight inconsistency: the Skills reference card says "directories containing a SKILL.md file" while the Welcome section says "Place .md files in .claude/skills/". Both are technically correct (a skill can be a directory with SKILL.md or a single .md file), but the phrasing is inconsistent.

### Summary of Actual Issues

1. **[Copyable prompts containing non-prompt text]** Lines 1538-1541 and 1774-1777: The `naturalLanguageTriggerGuide` is educational/instructional text (explaining how skills work) placed inside a `CodeBlock` with a copy button. This is not content a user would paste into Claude. It should be displayed as regular formatted text, or the copy button should be removed.

2. **[Content continuity]** Minor inconsistency between SkillsExtensionsSection ("directories containing a SKILL.md file") and WelcomeSection Quick Reference Card ("Place .md files in .claude/skills/") regarding how skills are described. The former implies a directory structure, the latter implies placing individual files.

---

## Cross-Section Content Continuity Summary

### Terminology Consistency

| Term | Usage Across Sections | Status |
|------|----------------------|--------|
| Context window | Used consistently in ContextSimulatorSection, SessionManagementSection, WelcomeSection, SkillsExtensionsSection | Consistent |
| Handoff prompt / continuation prompt | Both terms used; SessionManagement explicitly notes they are synonyms (line 191-196) | Addressed |
| Session / conversation | Both used interchangeably, which is appropriate since Claude calls them "conversations" on claude.ai and "sessions" in Claude Code | Acceptable |
| Skills | Described consistently as reusable instruction files across all sections | Consistent |
| CLAUDE.md / Project custom instructions | Correctly differentiated by platform (Code vs claude.ai/Desktop) across all sections | Consistent |
| Context compaction | ContextSimulatorSection and SessionManagementSection both use this term | Consistent |

### Cross-Reference Accuracy

| From | To | Link | Status |
|------|-----|------|--------|
| ContextSimulatorSection | SessionManagementSection | `/${track}/sessions` | Correct |
| SessionManagementSection | ContextSimulatorSection | `/${track}/context` | Correct |
| SessionManagementSection | SkillsExtensionsSection | `/${track}/skills-extensions` | Correct |
| WelcomeSection | StarterKitSection | `/${track}/starter-kit` | Correct |
| WelcomeSection | Brand Voice | `/${track}/brand-voice` | Correct |
| WelcomeSection | Governance | `/${track}/governance` | Correct |
| WelcomeSection | Sessions | `/${track}/sessions` | Correct |
| WelcomeSection | Process Doc | `/process` | Correct |
| StarterKitSection | Governance | `/${track}/governance` | Correct |

### Learning Progression

The section ordering (Context > Sessions > Skills/Extensions > Governance > Brand Voice > Recurring Tasks > Starter Kit for general; plus developer sections) provides a logical learning progression:

1. Context management fundamentals (ContextSimulatorSection) introduces the core concept
2. Session management (SessionManagementSection) builds on context by teaching when to stop and hand off
3. Skills & Extensions (SkillsExtensionsSection) teaches how to extend Claude, referencing context costs from section 1
4. Starter Kit (StarterKitSection) provides the practical files discussed in previous sections

The handoff prompt appearing in both the Context section and the Session Management section is appropriate — the Context section provides a quick-access version with a cross-reference to the full set in Session Management.

---

## Complete Issue Summary

### Must Fix

1. **WelcomeSection** — Line 93: Incorrect command syntax `'/plugin install'` should be `'claude plugin install'`. This is a factual error that would confuse developers.

2. **SkillsExtensionsSection** — Lines 1538-1541 and 1774-1777: The `naturalLanguageTriggerGuide` is instructional/educational text placed in a copyable `CodeBlock`. Copying this text and pasting into Claude would be meaningless. Should be presented as regular text or a `CalloutCard` instead.

### Should Fix

3. **WelcomeSection** — Minor inconsistency: Skills described as "Place .md files in .claude/skills/" in the Quick Reference Card, but described as "directories containing a SKILL.md file" in SkillsExtensionsSection. Should align the wording.

### Worth Noting (Low Priority)

4. **ProcessDocPage** — The markdown parser does not support ordered lists, nested lists, tables, or italic text. These limitations would cause rendering issues if the process document uses these features.

5. **StarterKitSection** — No issues found. Well-implemented track-conditional rendering and appropriate copyable content.

6. **SessionManagementSection** — No issues found. Excellent terminology disambiguation callout and comprehensive copyable prompts.

7. **ContextSimulatorSection** — No issues found. Clean cross-references and appropriate copyable content.

8. **HomePage** — No issues found. Clean and well-structured.
