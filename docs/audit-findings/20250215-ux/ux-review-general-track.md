# UX Review: General Track (Amanda Kelly's Perspective)

## Evaluator Profile
Amanda Kelly, non-technical staff member at Phew Design Limited. Uses Claude for general tasks. Attended the training on 11 February 2026. Wants practical, immediately usable takeaways.

---

## Section Rankings (Best to Worst for Amanda)

1. **Brand Voice (1.6)** — Outstanding. Clear structure, immediate quick win, well-paced, relevant examples. The model for all other sections.
2. **Session Management (1.3)** — Strong. Good rules of thumb, excellent metaphor ("saving a game"), useful templates. Minor jargon issues.
3. **Welcome (1.1)** — Good. Quick Wins and Quick Reference Card are exactly what was asked for. Quick Reference Card needs track filtering.
4. **Governance (1.5)** — Good. Quick Start steps are excellent. Risk tiers are visually clear. Some developer content leaks through.
5. **Recurring Tasks (1.7)** — Good. Honest about limitations. Useful prompts. One spec annotation left in user-facing copy.
6. **Context Simulator (1.2)** — Mixed. The desk metaphor is brilliant, but developer concepts leak through and the token budget section may lose Amanda.
7. **Starter Kit (1.16)** — Functional but could be simpler for general users.
8. **Skills & Extensions (1.4)** — Needs the most work for general users. Overwhelming number of tables, matrices, and developer concepts.

---

## Section-by-Section Review

### Section 1.1: Welcome & Orientation

**First impression:** Good. "Your AI Playbook" heading is clear; opening paragraph references the training sessions directly.

**Jargon issues:**
- "context management" mentioned without explanation
- "session handling" — what is a "session"? Is it just a conversation?
- "CLAUDE.md" appears in Quick Reference Card under "UK English" — developer term leaking to general users
- "project root" — developer language
- "primacy bias" — research terminology, meaningless to Amanda

**Actionability:** Very good. Quick Wins section is excellent — four things to do right now with links. Quick Reference Card with print/download is exactly what Matthew asked for.

**Key problem:** Quick Reference Card mixes developer and general content. Lines like "Put critical instructions in CLAUDE.md" and "Claude Code: Place .md files in .claude/skills/ in your project root" would confuse Amanda.

**Recommendation:** Make the Quick Reference Card track-aware. Remove CLAUDE.md references and "For Developers" section from the printable version for general users, or add a track filter.

---

### Section 1.2: Context Simulator

**First impression:** Excellent opening. The desk metaphor ("Think of it as a desk: the more you pile on, the harder it is to find what you need") is immediately understandable.

**Jargon issues:**
- "CLAUDE.md" in tips 3 and 5 — developer concept leaking into general track
- "primacy bias" — unnecessary research terminology
- "system prompt" — Amanda does not know what this is
- "large language models" — not explained
- "MCP server" in budget section — unexplained for general users
- TypeScript example in tip 5 ("If you said 'always use TypeScript' ten messages ago") — meaningless to Amanda

**Key strength:** The desk metaphor is the single best analogy in the entire playbook.

**Key problem:** Developer concepts leak into general track view. Tip 3 references CLAUDE.md; tip 5 uses TypeScript; MCP servers mentioned in budget section.

**Recommendation:** Rewrite tip 3 for general track as: "Put critical instructions in your profile preferences or project custom instructions." Replace TypeScript example with: "If you told Claude 'always use UK English' ten messages ago, it may have faded."

---

### Section 1.3: Session Management

**First impression:** Strong. The opening callout — "A fresh session with a good handoff beats a long degrading session every time" — is clear.

**Jargon issues:**
- "atomic task" — computer science terminology. Amanda would understand "Breaking tasks into smaller pieces"
- "continuation prompt" vs "handoff prompt" — terminology callout helps

**Key strength:** The "saving a game" analogy for session handoffs is excellent. Safeguarding policy worked example is directly relevant to Phew.

**Key problem:** "The Atomic Task Principle" heading uses unnecessary jargon.

**Recommendation:** Rename to "Breaking Big Tasks into Smaller Pieces" for the general track. Remove the word "atomic" entirely.

---

### Section 1.4: Skills, Extensions & Decision Tree

**First impression:** Most problematic section for general users. Even the section title "Decision Tree" is technical modelling terminology.

**Jargon issues (extensive):**
- "extension mechanism" — should be "add-on" or "feature"
- "always-on context" / "on-demand capabilities" / "background automation" — framework categories
- "availability matrix" — spreadsheet terminology
- "MCP (Model Context Protocol)" — deeply technical even with expansion
- "YAML frontmatter" — in skill file example
- "Skills (model-invocable)" / "Skills (manual-only)" — in cost table
- "disable-model-invocation: true" — developer config in general-user table
- "CoWork" — mentioned as platform but never explained

**Key strength:** The decision tree approach ("What do you want Claude to do?") is excellent — goal-based, not technology-based. The natural language trigger guide ("You DON'T need to type a command") is the key message.

**Key problem:** This section tries to be a comprehensive reference for both tracks and overwhelms general users. Amanda needs 3 things: (1) set rules Claude always follows, (2) skills are reference manuals, (3) trigger by describing what you want.

**Recommendation:** Radically simplify general track view. Show only 3-4 relevant decision tree entries. Remove/collapse availability matrix and cost tables behind "Advanced details" toggle. Lead with natural language trigger guide. Add one-sentence CoWork definition.

---

### Section 1.5: Governance Policy

**First impression:** Good tone-setting. "This is not about creating red tape" immediately reassures.

**Actionability:** Excellent. "Quick Start: Three Things to Do This Week" with timeframe badges (Day 1, Week 1) is outstanding.

**Key strength:** Risk tier cards (colour-coded green/amber/red) are visually clear and immediately understandable. GDPR/UK regulatory references are well-tailored.

**Key problem:** Extension Type Quick Reference table at bottom includes "MCPs", "Hooks", "Subagents" without filtering for general track.

**Recommendation:** Filter Quick Reference table by track, or add note that MCPs/Hooks/Subagents are developer tools general users don't need to worry about.

---

### Section 1.6: Brand Voice & UK English

**First impression:** Excellent. Two-part structure (Part 1: UK English, Part 2: Brand Voice) is immediately clear. "2 minutes" badge makes it feel achievable.

**Actionability:** Outstanding — the most actionable section in the entire playbook. Copyable one-line instruction for UK English. Step-by-step brand voice setup prompt. All ready to use immediately.

**Key strength:** The entire section is the gold standard for general-user content. Step 1 "No technical skills needed" is reassuring. Phew-specific examples reference safeguarding partnerships, LMS, and IMPACT values.

**Key problem:** Very minor — "Where to Save" table correctly filters out Claude Code entries for general users. Well handled.

**Recommendation:** Other sections should follow this pattern.

---

### Section 1.7: Recurring & Scheduled Tasks

**First impression:** Honest and clear. "Claude does not have a built-in scheduler" is refreshingly direct.

**Jargon issues:**
- "CoWork" — described as "Anthropic's browser agent environment" — minimal explanation
- "CI/CD pipeline", "API", "cron job" — Pattern 4 correctly tagged "With dev support"

**Key strength:** The "Think of Claude as a highly capable executor that you initiate, rather than a background service" metaphor is excellent for setting expectations.

**Key problem:** A spec annotation left in user-facing copy. The heading description reads: "Honest about the gaps. This builds trust — the playbook is not overselling." This is an internal note, not user-facing content.

**Recommendation:** Replace with: "It is important to be clear about what Claude cannot do yet, so you can plan accordingly."

---

### Section 1.16: Starter Kit

**First impression:** Clear name. Opening explains what it is.

**Actionability:** Good. Quick Start section has clear adoption order with effort estimates. Installation guides have step-by-step numbered instructions.

**Key problem:** File browser is powerful but potentially overwhelming. Amanda sees 10+ skills and doesn't know which matter. "Recommended" badges help but could be more prominent.

**Recommendation:** Consider a simpler "Start here" view for general users showing only top 3-4 files.

---

## Cross-Cutting Issues

### 1. CLAUDE.md Leakage into General Track
The single biggest systemic issue. CLAUDE.md is developer-specific but appears in:
- Welcome Quick Reference Card ("Add to your project instructions or CLAUDE.md")
- Context Simulator tips ("Put critical instructions in CLAUDE.md")
- Context Simulator tips ("Do not rely on mid-conversation instructions... Put it in CLAUDE.md instead")

**Fix:** Replace every general-track CLAUDE.md reference with "profile preferences" or "project custom instructions."

### 2. CoWork Never Properly Introduced
Appears in Skills & Extensions and Recurring Tasks but never gets a proper introduction. Needs one-sentence definition: "CoWork is Anthropic's browser automation environment — it lets Claude control a web browser to complete tasks on websites."

### 3. "Parameterised" Throughout
Used in Welcome ("parameterised AI governance template") and Governance sections. Replace with "fill-in-the-blanks" or "customisable template."

### 4. Spec Annotation in User-Facing Copy
Recurring Tasks has: "Honest about the gaps. This builds trust — the playbook is not overselling." This is not user-facing content.

### 5. Inconsistent "Session" vs "Conversation"
The playbook alternates without consistently defining the relationship. For Amanda, these are the same thing. Standardise on "conversation" for general track.

---

## Top 8 Recommendations (Priority Order)

1. **Filter CLAUDE.md references from general track content.** Replace with "profile preferences" or "project custom instructions."
2. **Radically simplify Skills & Extensions for general users.** Lead with natural language trigger guide. Collapse matrices and cost tables behind "Advanced" toggles.
3. **Remove the spec annotation** in Recurring Tasks.
4. **Add a one-sentence definition of CoWork** where it first appears.
5. **Replace "parameterised" with "fill-in-the-blanks"** throughout.
6. **Make the Quick Reference Card track-aware** so general users don't see developer-only tips when they print.
7. **Rename "The Atomic Task Principle"** to "Breaking Big Tasks into Smaller Pieces" for general track.
8. **Replace the TypeScript example** in Context tips with a general example ("always use UK English" instead of "always use TypeScript").
