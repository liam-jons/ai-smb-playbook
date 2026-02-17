# UX Review Report: Phew! AI Playbook -- General User Track
## Persona: Amanda Kelly, Non-Technical Employee at Phew Design Limited

---

## 1. Homepage (http://localhost:5173/)

### First Impression (3-5 seconds)
Amanda sees a clean, professional page with the company name and a clear choice between two tracks. The heading "Phew! AI Playbook" and subtitle "Practical guidance for getting the most from Claude AI at Phew Design" immediately tell her this is the follow-up material from the training session.

### Comprehension
The two-track layout is immediately understandable. "General Users -- For all team members" versus "Developers -- For the development team" is a clear distinction. The section previews (listing 1.1 through 1.4 with "+4 more sections") give Amanda a sense of what she will find. The meta-narrative footer line "This playbook was itself built using Claude and the workflows it describes" is a nice touch but could easily be missed -- it is small grey text.

### Actionability
Excellent. There is one clear action: click the General Users card to get started. The "Get started" call-to-action with an arrow is prominent.

### Visual Quality
Professional, clean, and well-spaced. The two cards are balanced. Good use of whitespace. The header with "General Users" and "Developers" track buttons is clear. The feedback icon and theme toggle in the top-right are subtle and unobtrusive.

### Problems Found
1. **"8 sections" badge is slightly misleading** -- the sidebar later shows sections 1.1 through 1.7 plus 1.16 (Starter Kit). The jump from 1.7 to 1.16 would confuse Amanda -- she might wonder if she is missing sections 1.8 through 1.15. (These are the developer sections, but this is not explained.)
2. **No visual cue for the meta-narrative line** -- "This playbook was itself built using Claude and the workflows it describes" is easy to miss. If the meta-narrative is important, it could be styled more prominently.
3. **Footer has two links to phew.org.uk** -- the "Phew Design Limited" link and the "phew.org.uk" text link. Minor redundancy.

### Console Errors
None -- 0 JavaScript errors.

---

## 2. Welcome & Orientation (/general/welcome)

### First Impression
Amanda sees a well-structured welcome page with a personal reference to the training date ("11 February 2026"). This immediately feels relevant and bespoke to her team.

### Comprehension
The four "How to Use This Playbook" points are clear and actionable: Two tracks, Start anywhere, Copy-to-clipboard, Feedback. The "Choose Your Track" cards repeat the homepage pattern, which is good reinforcement. The "Quick Wins" section at the bottom is excellent for Amanda -- it gives her four things she can do right now in under five minutes.

### Actionability
Very high. The "Quick Wins" section is the standout feature -- each card links directly to the relevant section. Amanda would likely click "Set up UK English enforcement" first, as it is the most immediate and least intimidating.

### Visual Quality
Excellent. The numbered steps, icons, and card layout create a clear visual hierarchy. The "Quick Reference Card" section with the "Download Quick Reference (PDF)" button is a strong practical touch.

### Problems Found
1. **"Quick Reference Card" PDF download** -- I could not verify whether the PDF actually generates/downloads. This needs testing.
2. **Duplicate "How this playbook was built" and "How We Built This" sections** -- There are two very similar sections at the bottom of the page (one alert box titled "How this playbook was built" and a heading "How We Built This" with a link to "/process"). These feel redundant and could be consolidated.
3. **"View the process document" link** points to `/process` -- Amanda might click this and wonder why she is leaving the general track. The link destination is not clearly signposted as being a separate document.
4. **No "All users" badge visible on section 1.7 in the sidebar** -- The sidebar label "1.7 Recurring & Scheduled Tas" is truncated, losing the final letters of "Tasks". On narrower viewports this truncation would be more severe.

### Console Errors
None.

---

## 3. How Context Works (/general/context) -- THE HERO SECTION

### First Impression
Amanda sees a bold opening paragraph comparing the context window to a desk: "Think of it as a desk: the more you pile on, the harder it is to find what you need." This metaphor is excellent for a non-technical user.

### Comprehension
**The desk metaphor works brilliantly.** The "What is a token?" callout box immediately answers the obvious question with a practical answer ("Roughly 0.75 words... the length of two full novels").

**The Context Window Simulator is the centrepiece.** It shows a coloured bar chart with segments for System Prompt, Built-in Tools, CLAUDE.md, MCP Tools, Skills, Environment, Conversation, Response Buffer, and Available space. The preset buttons (Minimal / Moderate / Heavy) and sliders for MCP Servers and CLAUDE.md size are interactive and responsive. When you click "Add a conversation turn", the bar grows visually -- this is genuinely educational.

However, some terminology will confuse Amanda:
- "MCP Tools" -- she will not know what MCP stands for
- "CLAUDE.md" -- she will not know what this is
- "Response Buffer" -- technical term
- "System Prompt" -- she may not know this is invisible to her
- "Compaction" in "Turn 0 of ~22 before compaction" -- what does compaction mean?

### Actionability
The session handoff prompt at the bottom is highly actionable -- it is a copy-paste prompt that Amanda can use immediately. The copy button worked when tested.

### Visual Quality
The simulator visualisation is colourful and intuitive. The bar segments are labelled (when wide enough) and have tooltips. The accordion sections ("Why does this matter?", "Signs your context is getting full", etc.) keep the page scannable.

### Problems Found
1. **"Loading section..." flash** -- When navigating to this page, there is a brief "Loading section..." message visible before content renders. This suggests lazy loading of section content. For Amanda, seeing a loading state might feel like something is wrong.
2. **Technical jargon in the simulator** -- "MCP Tools", "CLAUDE.md", "Response Buffer", "compaction" are all terms that would confuse a non-technical user. The simulator labels need plain-English alternatives or tooltips.
3. **Simulator segment labels get truncated** -- At the default view, segments labelled "Built-in..." and "MCP T..." are cut off. Amanda would not know what these represent without hovering.
4. **"Full attention" badge** -- The green badge reading "Full attention" (vs. presumably something else when context is full) is not explained. Amanda would not know what "Full attention" means in this context.
5. **The "Token Usage and Your Budget" section uses the phrase "Claude Teams has usage limits"** -- This is slightly alarming for Amanda. It might make her nervous about using Claude, fearing she will "use up" the company's allocation. The framing could be more reassuring.
6. **The handoff prompt is duplicated across this page and the Sessions page** -- While intentional for convenience, Amanda might wonder if they are the same.

### Console Errors
None.

---

## 4. Session Management (/general/sessions)

### First Impression
The opening quote "A fresh session with a good handoff beats a long degrading session every time" sets the right tone. Amanda would understand the core message immediately.

### Comprehension
The "Rules of Thumb" accordion is excellent. The labels are plain-English and relatable:
- "The 'one task, one session' rule"
- "The 30-message guideline"
- "The repetition signal"
- "The drift signal"
- "The scope creep signal"
- "The 'good stopping point' principle"

The "Handoff Workflow" is a clear 6-step numbered process. The "Breaking Tasks into Subtasks" section explains the "atomic task principle" simply: "Each task should be broken down to the smallest unit that can be completed independently."

### Actionability
Very high. Five different copyable handoff templates are provided:
1. Session Handoff -- General
2. Emergency Session Save
3. Break Down a Large Task
4. Review This Session Before Wrapping Up
5. Hand Off to a Colleague

Each has a clear "When to use" label. Amanda would likely use the "General" and "Emergency" ones most.

### Visual Quality
Clean and well-organised. The accordion pattern keeps the page from being overwhelming. The platform differences table is well-formatted.

### Problems Found
1. **"Loading section..." flash** -- Same lazy loading issue as the context page.
2. **Platform Differences table includes Claude Code column** -- Amanda is a general user. The "Claude Code" column in the comparison table introduces developer concepts that are not relevant to her. Consider hiding this column in the general track or clearly labelling it as "For developers only."
3. **Terminology note about "handoff prompt" vs "continuation prompt"** -- The callout says these are the same thing. Good for clarity, but it is odd to introduce a second term just to say it means the same thing. This might create more confusion than it resolves.
4. **"Claude's Memory Feature" section** -- While useful, this is a substantial topic introduced somewhat abruptly. Amanda might confuse "memory" (persistent across conversations) with "session handoff" (manual per-session). The distinction could be made clearer with a visual comparison.
5. **Link to "Project" goes to /general/skills-extensions** -- The text says "consider setting up a Project in claude.ai" but links to the Skills section. This is indirectly relevant but might confuse Amanda when she arrives at a page about skills and extensions rather than a page about Projects.

### Console Errors
None.

---

## 5. Skills, Extensions & Decision Tree (/general/skills-extensions)

### First Impression
Amanda sees the title "Skills, Extensions & Decision Tree" with the subtitle "Choosing the right tool for the job". The opening text mentions "extend it -- teaching it your company's conventions, connecting it to your tools, or giving it specialised knowledge." This is accessible.

### Comprehension
**The decision tree ("What do you want Claude to do?") is excellent in concept** -- it frames the choices as goals rather than technical mechanisms:
- "I want Claude to always follow certain rules"
- "I want to give Claude specialist knowledge it can use when needed"
- "I want to trigger a specific workflow with a command"
- "I want Claude to connect to an external service"

This goal-oriented framing is perfect for Amanda.

**However, the Platform Availability matrix is overwhelming.** It lists 13 features (Skills auto-invocation, Skills slash command, Skills admin-provisioned, Skills ZIP upload, Projects, CLAUDE.md, MCP servers, Subagents, Agent Teams, Hooks, Plugins, LSP servers, Slash commands) across 4 platforms (claude.ai, Desktop, Code, CoWork). Amanda would not understand what most of these are:
- "Subagents", "Agent Teams", "Hooks", "Plugins", "LSP servers" are developer concepts
- "CoWork" is a platform she may not have encountered

### Actionability
The "Natural Language Skill Triggers" section is good -- it shows Amanda she does not need commands, just plain English. The UK English Skill example is practical and directly relevant. The "Example: UK English Skill" code block shows the full skill file, which is useful but might be intimidating for a non-technical user.

### Visual Quality
The page is long but well-structured. The decision tree accordion pattern is good. The availability matrix uses checkmarks and crosses, which are visually clear.

### Problems Found
1. **"Loading section..." flash** -- Same issue.
2. **Platform Availability matrix is too technical for general users** -- At least half the rows (Subagents, Agent Teams, Hooks, Plugins, LSP servers) are developer-only concepts. Amanda does not need this information. Consider either hiding these rows in the general track or collapsing them behind an "Advanced / Developer features" toggle.
3. **"CoWork" column in the matrix** -- Not explained. Amanda would not know what CoWork is. (It is introduced later in section 1.7 but not defined here.)
4. **Extension Reference section** -- The accordions for "Projects (Custom Instructions)", "Skills", and "MCP (Model Context Protocol)" are collapsed. The MCP one especially needs a plain-English introduction before the acronym.
5. **"Impact on Claude's Working Memory" table** -- Contains the column "Mitigation" with advice like "Use disable-model-invocation: true for manual-only skills" -- this is developer syntax, not something Amanda would know how to use.
6. **Missing "All users" tag** -- Section 1.7 in the sidebar does not have an "All users" tag on the section header, unlike other sections. (Confirmed: the header shows "1.7" without a badge on the recurring tasks page.)

### Console Errors
None.

---

## 6. AI Governance Policy (/general/governance)

### First Impression
Amanda sees a governance page that starts with a practical, non-bureaucratic tone. The opening text mentions this is a template that can be customised.

### Comprehension
The governance page is well-structured with:
- A copyable top-level summary
- "Quick Start: Three Things to Do This Week" -- excellent for Amanda
- Risk categories (Low / Medium / High) with clear colour-coding
- "The Full Policy" with 9 collapsible sections
- "How to Customise the Template" with a placeholder table

The risk categories are practical and relatable. Amanda would understand "Generating internal email drafts" (Low risk) vs "Processing personal data of data subjects" (High risk).

### Actionability
High. The "Three Things to Do This Week" section gives Amanda three immediate actions:
1. Categorise what AI is used for
2. Establish a human-review practice
3. Walk through the register template

The "Extension Register Template" is a practical table for tracking what extensions are installed.

### Visual Quality
Good. The three risk-category cards with coloured headers (green/amber/red) are visually distinctive. The policy sections as accordions keep the page manageable.

### Problems Found
1. **"Loading section..." flash** -- Same issue.
2. **"How to Customise the Template" table** -- The placeholder values (e.g., `{{COMPANY_NAME}}`, `{{REVIEW_PERIOD}}`) are shown in a format that looks like code. Amanda might not understand these are placeholders she needs to replace. A plain-English instruction like "Replace 'Your Company Name' with your actual company name" would be clearer.
3. **"Extension Type Quick Reference" table** -- Includes columns like "Approval" and "Context Cost" that use terms like "Self-service", "Team-lead approval", "Low/Moderate/High". While accessible, the "Context Cost" column is a concept from the technical context window discussion and might not land here without a refresher.
4. **Related Sections links at the bottom** -- Text says "For more on extension types and the approval process, see Section 1.4" but does not link it -- the section names are bold text, not clickable links. Amanda would have to manually navigate to those sections. These should be hyperlinks.

### Console Errors
None.

---

## 7. Brand Voice & UK English (/general/brand-voice)

### First Impression
Amanda sees a two-part page: "Part 1: UK English Enforcement" (2 minutes) and "Part 2: Brand Voice Setup" (30-60 minutes). The time estimates are immediately reassuring.

### Comprehension
**Part 1 is excellent.** The three numbered steps are crystal clear:
1. Set profile preferences (30 seconds) -- with a copyable one-liner
2. Add project instruction (30 seconds per project) -- with a copyable one-liner
3. Upload the UK English skill (optional, 2 minutes)

Amanda could do Step 1 right now without any help.

**Part 2 is more involved** but well-structured. The "What to Prepare Before Starting" section helpfully tiers requirements (Minimum required / Strongly recommended / Nice to have). The seven framework sections are presented as accordions.

### Actionability
Extremely high. This is arguably the most actionable page in the entire playbook. The UK English setup takes 2 minutes and the results are immediate. The brand voice setup prompt is a single copyable block.

### Visual Quality
Excellent. The numbered steps with time estimates, the colour-coded Part 1/Part 2 badges, and the tiered preparation lists are all well-designed.

### Problems Found
1. **"Loading section..." flash** -- Same issue.
2. **Unicode rendering issue** -- The time estimate next to "Part 2" displays as "30\u201360 minutes" on the page, showing a raw Unicode escape rather than an en-dash. This needs fixing -- it should display as "30-60 minutes" or "30--60 minutes".
3. **"View full UK English skill file" button** -- This expands to show a markdown code block, which is useful for developers but might intimidate Amanda. The button label does not warn that it will show technical content.
4. **"Where to Save the Brand Voice Document" table** -- Lists "Claude Desktop / claude.ai" alongside "Any environment" but does not include a row for "Claude Code" since this is the general track. This is correct and appropriate.
5. **"Session management tip" callout** -- Advises starting a fresh session for brand review. Good advice, well-placed.
6. **Related Sections links at the bottom** -- Same issue as Governance: section references are bold text but not hyperlinks. "Section 1.4 -- Skills, Extensions & Decision Tree" and "Section 1.5 -- AI Governance Policy" should be clickable.

### Console Errors
None.

---

## 8. Recurring & Scheduled Tasks (/general/recurring-tasks)

### First Impression
Amanda sees an honest, direct opening: "Claude does not have a built-in scheduler." This immediately sets expectations correctly. The emphasis on "what Claude can do" versus what it cannot is well-balanced.

### Comprehension
The four patterns are clearly explained with Phew!-specific examples:
1. Manual Trigger, Automated Execution (Everyone) -- weekly training report
2. Browser Automation via CoWork (Everyone) -- website accessibility monitoring
3. Self-Updating Skills (Everyone) -- client onboarding checklist
4. External Trigger + Claude Execution (With dev support) -- automated code quality check

The "What Is Not Yet Possible" section is excellent -- it honestly lists limitations (background monitoring, cron scheduling, persistent sessions, cross-session memory). This builds trust.

### Actionability
High. The "Ready-to-Use Prompts" section provides 7 copyable prompts:
- Weekly Training Report
- Website Change Detection
- Self-Updating Skill Template
- Contract Data Extraction
- PDF Summary with Action Items
- Knowledge Base Builder
- Recurring Task Identifier

The "Getting Started: Recommended First Steps" section provides a 4-step roadmap.

### Visual Quality
Good. The pattern cards with numbered headings, "Everyone" / "With dev support" badges, and Phew!-specific examples create a scannable layout. The "Limitations" callout in the CoWork section uses a yellow/amber alert style appropriately.

### Problems Found
1. **"Loading section..." flash** -- Same issue.
2. **Missing "All users" badge in the header** -- Unlike other sections which show "1.2 All users", this section shows only "1.7" without the audience badge. This is inconsistent.
3. **"Browser Automation via CoWork" section** -- CoWork is introduced here but was already referenced in the Skills page's Platform Availability matrix without explanation. The definition here ("Anthropic's browser agent environment") is good but comes too late for someone who read the playbook in order.
4. **Pattern 4 "External Trigger + Claude Execution"** says "With dev support" -- this is appropriate, but Amanda might feel excluded. A note like "Ask your development team to set this up for you" would make it feel more accessible.
5. **"Honest about the gaps" editorial note** -- The text "Honest about the gaps. This builds trust -- the playbook is not overselling." appears to be an authoring note that was left in the final content. This should be removed -- it reads as meta-commentary about the playbook rather than content for the user.
6. **Prompts section is very long** -- Seven copyable prompts make the page extremely long. Amanda might benefit from a collapsed/tabbed interface for these.

### Console Errors
None.

---

## 9. Starter Kit Contents (/general/starter-kit)

### First Impression
Amanda sees a clear page explaining what the starter kit is and how to get it. The "Quick Start" box with a week-by-week adoption plan is immediately reassuring.

### Comprehension
The Quick Start plan is excellent:
- Week 1: UK English skill + profile preferences (2 minutes)
- Week 1: Session handoff skill (2 minutes to install)
- Week 2: Brand voice setup (30-60 minutes)
- Week 3: Governance policy (30 minutes + team discussion)

The "How to Install" section with tabs for Claude Desktop / claude.ai / Teams Admin is well-designed. The File Browser with tabs for Skills (11) / Templates (1) / Prompts (2) is intuitive.

### Actionability
Very high. The "Download All as ZIP" button is prominent. The file browser lets Amanda browse individual files. The "Common Install Commands" section provides a copyable profile preference.

### Visual Quality
Clean and well-organised. The tabbed interfaces are intuitive. The skill items in the file browser have icons, names, audience badges ("All users" / "General"), and "Recommended" badges where appropriate.

### Problems Found
1. **"Loading section..." flash** -- Same issue.
2. **Section numbered "1.16"** -- In the sidebar and page header, this section is numbered 1.16. For a general user, the jump from 1.7 to 1.16 is confusing. Amanda would wonder "where are sections 1.8 through 1.15?" The answer is that those are developer sections, but this is never explained. This numbering should either be sequential within the track (making it 1.8) or the gap should be acknowledged.
3. **"Download All as ZIP" link points to `/starter-kit.zip`** -- I could not verify whether this file exists and is served correctly. This is a critical feature that needs testing.
4. **`starter-kit/` code reference** -- The text mentions "grab the `starter-kit/` folder from the project repository." Amanda does not have access to the project repository -- she is a non-technical user. This instruction is irrelevant and potentially confusing for the general audience.
5. **"Keeping your starter kit current" callout** -- Mentions "Skills, commands, and templates that you copy manually are your responsibility to maintain." This creates anxiety about maintenance without offering a clear solution. A concrete suggestion like "Add a calendar reminder for the first Monday of each month" would help.
6. **No "Next" pagination button** -- This is the last page in the track, so it only has "Previous: Recurring & Scheduled Tasks". This is correct behaviour, but Amanda might want a "Back to Overview" or "You've completed the General track!" message. The abrupt ending feels incomplete.
7. **Skill descriptions are very brief** -- Items like "Writing Plans -- Writing plan creation" and "Writing Skills -- Writing quality improvement" are not descriptive enough. Amanda would not know the difference between these two skills without clicking into them.

### Console Errors
None.

---

## Cross-Cutting Concerns

### Sidebar Navigation
- **Generally clear and helpful.** The active section is highlighted with a darker background.
- **Truncation problem:** "1.4 Skills, Extensions & Decisi..." and "1.7 Recurring & Scheduled Tas..." are truncated in the sidebar. On wider screens this is less of an issue, but it means Amanda cannot read the full section titles.
- **"1.16" numbering anomaly:** The jump from 1.7 to 1.16 is the most significant navigation confusion in the entire app. This should be addressed.
- **No section icons for 1.16:** All other sections have small icons in the sidebar; section 1.16 (Starter Kit Contents) does not have an icon, making it visually inconsistent.

### Previous/Next Pagination
- **Working correctly** on every page tested. The Previous button appears from page 2 onwards, and the Next button shows the upcoming section name. This is well-implemented.
- The pagination buttons correctly do not appear where not needed (no Previous on page 1, no Next on the last page).

### Feedback Widget
- **Accessible and functional.** The feedback button is in the header (icon) and in the footer ("Send Feedback" text button). Clicking it opens a modal dialog with Category dropdown, Message text area, and Submit/Cancel buttons.
- The dialog title "Send Feedback" and description "Let us know how we can improve this playbook. Your feedback is sent via email." are clear.
- **Minor issue:** The "Send Feedback" button starts disabled until a message is entered, which is good. However, the Category dropdown shows "Choose a category..." but it is unclear if a category is required. The UX should make required fields obvious.

### Copy-to-Clipboard Buttons
- **Visible and functional.** Tested on the context page handoff prompt -- clicking the button changes the icon/text to "Copied to clipboard" briefly. This is standard and well-implemented.
- Every prompt block has a copy button positioned consistently in the top-right corner of the code block.

### "Loading section..." Issue
- **Every page except the Welcome page shows a brief "Loading section..." state** when navigated to. This suggests sections 1.2 through 1.16 are lazy-loaded. While the load time is short (under 2 seconds), it creates a visual flicker. Amanda might think the page is broken, especially on slower connections. Consider either:
  - Adding a skeleton/shimmer loading state instead of text
  - Preloading adjacent sections
  - Making the loading indicator more visually polished

### Dark Mode
- The theme toggle button is present but was not tested. It should be verified that all pages render correctly in dark mode.

---

## Summary of Most Critical Issues

| Priority | Issue | Page(s) | Impact |
|----------|-------|---------|--------|
| HIGH | Section numbering jumps from 1.7 to 1.16 without explanation | Sidebar, Starter Kit | Confuses users about missing content |
| HIGH | "Loading section..." flash on every lazy-loaded page | All except Welcome | Makes the app feel slow or broken |
| HIGH | Unicode rendering bug showing `\u2014` and `\u2013` as raw escape sequences | Brand Voice | Unprofessional display of dashes |
| MEDIUM | Platform Availability matrix too technical for general users (Subagents, Hooks, LSP servers) | Skills & Extensions | Overwhelms non-technical users |
| MEDIUM | Related section references are bold text, not hyperlinks | Governance, Brand Voice, Recurring Tasks | Breaks navigation flow |
| MEDIUM | "Honest about the gaps" editorial note left in production content | Recurring Tasks | Reads as internal commentary, not user-facing |
| MEDIUM | Sidebar text truncation for longer section names | All pages | Reduces navigation clarity |
| MEDIUM | `starter-kit/` repository reference irrelevant for general users | Starter Kit | Confuses non-technical audience |
| LOW | No completion message at end of General track | Starter Kit | Anticlimactic ending |
| LOW | Duplicate "How this playbook was built" / "How We Built This" sections | Welcome | Redundant content |
| LOW | "Download Quick Reference (PDF)" button needs verification | Welcome | Critical deliverable if it does not work |
| LOW | Missing icon for section 1.16 in sidebar | All pages | Visual inconsistency |

---

## Amanda's Overall Verdict

"This is really impressive -- it feels like it was made for us, not just a generic guide. The desk metaphor for context made things click. The copy buttons are brilliant -- I have already set up UK English. A few bits confused me (what is MCP? why does it jump from 1.7 to 1.16?), and some pages flash 'Loading' which made me think something was broken. But overall, I would come back to this regularly. The handoff prompts and the starter kit are the most useful parts. I wish there was a 'congratulations, you have finished!' message at the end instead of just... nothing."
