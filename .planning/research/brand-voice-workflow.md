# Brand Voice Workflow Research

## Phase 0.4 Output — Brand Voice Skill & Brand Review Command

---

## Overview

The brand-voice skill and brand-review command form a two-part system:

1. **brand-voice** (skill) provides a comprehensive framework for *documenting* a brand's voice, style rules, terminology, and tone guidelines. It does not run a wizard or produce an output file on its own — it is a reference framework that Claude uses when helping a user define or apply brand voice.

2. **brand-review** (command) provides a structured *review process* that evaluates content against those documented brand guidelines. It checks voice, terminology, messaging pillars, style compliance, and legal/compliance concerns.

The workflow is: **define your brand voice using the skill's framework** --> **save the output as a brand voice document** --> **use brand-review to check content against that document**.

---

## What the Brand Voice Skill Actually Is

The brand-voice skill (`starter-kit/skills/brand-voice/SKILL.md`) is **not** a step-by-step wizard. It is a structured reference framework — a SKILL.md file that Claude loads into context to guide conversations about brand voice. When a user asks Claude to help document their brand voice, Claude uses this framework to ensure completeness.

The skill covers seven areas, each of which represents a section the user should define:

### The Seven Framework Sections

| # | Section | What It Covers |
|---|---------|---------------|
| 1 | **Brand Personality** | Defining the brand as if it were a person — its character traits and how it relates to people |
| 2 | **Voice Attributes** | 3-5 defining attributes of how the brand communicates, each with "we are / we are not / sounds like / does not sound like" definitions |
| 3 | **Audience Awareness** | Who the brand speaks to, what they care about, their expertise level, how they expect to be addressed |
| 4 | **Core Messaging Pillars** | 3-5 key themes the brand consistently communicates, their hierarchy, and how they connect to audience needs |
| 5 | **Tone Spectrum** | How the voice adapts across channels (blog, social, email, support, etc.) and situations (launches, incidents, onboarding, bad news) while remaining recognisably the same brand |
| 6 | **Style Rules** | Specific grammar choices (Oxford comma, contractions, sentence case vs title case, number formatting, date format, etc.) and formatting conventions (heading hierarchy, bold/italic usage, link text, emoji policy) |
| 7 | **Terminology** | Preferred vs avoided terms, product/feature name capitalisation, inclusive language standards, jargon management, competitor/category language |

### What It Provides Beyond Structure

The skill includes:

- **Voice attribute spectrums** — seven common spectrum pairs (formality, authority, emotion, complexity, energy, humour, innovation) to help users position their brand
- **Attribute definition template** — a structured format ("We are / We are not / This sounds like / This does NOT sound like")
- **Tone adaptation tables** — pre-built tables showing how tone shifts by channel (blog, LinkedIn, Twitter/X, email, sales, support, press, error messages) and by situation (product launch, incident, customer success, onboarding, bad news, competitive comparison)
- **Style rule options** — a comprehensive table of grammar/mechanics decisions to be made, with common options listed
- **Terminology patterns** — example preferred/avoided term pairs and guidance on product names, inclusive language, jargon, and competitor terms

---

## Step-by-Step Setup Process

Since the skill is a framework rather than a wizard, the setup process is conversational. Here is the recommended sequence:

### Step 1: Gather Existing Materials

Before starting, the user should collect whatever brand materials already exist:

- **Existing brand guidelines** (if any) — style guides, tone of voice documents, brand books
- **Example content** that represents the brand well — website copy, marketing emails, social posts that "sound right"
- **Example content** that does NOT represent the brand — content that felt off-brand, so Claude can understand boundaries
- **Product/feature name list** — official names with correct capitalisation
- **Terminology preferences** — any known "say this, not that" rules
- **Target audience descriptions** — who the brand speaks to

If the user has none of these, that is fine — the skill's framework is designed to build from scratch through conversation.

### Step 2: Start the Brand Voice Conversation

The user initiates a conversation with Claude (in Claude Desktop, claude.ai, or Claude Code) with the brand-voice skill loaded. Claude uses the framework to guide the user through each section.

### Step 3: Work Through Each Section

Claude works through the seven framework sections conversationally:

1. **Brand Personality** — "If your brand were a person, how would you describe them?"
2. **Voice Attributes** — Select and define 3-5 attributes using the spectrum pairs and the "we are / we are not" template
3. **Audience Awareness** — Define primary and secondary audiences, their expertise, expectations
4. **Core Messaging Pillars** — Identify 3-5 key themes, rank them, connect to audience needs
5. **Tone Spectrum** — Define how tone adapts across the channels and situations relevant to the user
6. **Style Rules** — Make decisions on grammar mechanics (Oxford comma, contractions, etc.) and formatting conventions
7. **Terminology** — Build preferred/avoided term lists, product name rules, jargon policy

### Step 4: Produce the Brand Voice Document

The output of this process is a **brand voice document** — a comprehensive markdown file containing all seven sections filled in with the user's specific brand decisions.

### Step 5: Save the Document

The user saves the brand voice document where Claude can access it in future sessions. The options are:

- **As a project knowledge file** in Claude Desktop or claude.ai (added to a project's knowledge base)
- **As a skill file** in Claude Code (saved to `~/.claude/skills/` or a project's skills directory)
- **As a standalone file** referenced in CLAUDE.md or provided at the start of sessions

---

## What Inputs the User Needs to Prepare

### Minimum Required

- A willingness to make decisions about how the brand communicates. No prior documentation is strictly necessary — the framework guides the user through building one from scratch.

### Strongly Recommended

- **2-3 examples of on-brand content** — existing website copy, marketing materials, emails, or social posts that represent how the brand wants to sound
- **A basic understanding of the target audience** — who the brand speaks to and what they care about
- **Known terminology preferences** — product names, industry terms, any existing "say this, not that" rules

### Nice to Have

- An existing brand style guide or tone of voice document (the skill can assess and expand it)
- Examples of off-brand content (helps define boundaries)
- Competitor examples (to clarify differentiation)

---

## What Outputs Are Produced and Where They Are Stored

### The Brand Voice Document

The primary output is a **brand voice document** — a structured markdown file. This is not automatically generated or saved to a predefined location. The user and Claude create it together through conversation, and the user decides where to save it.

### Recommended Storage Locations

| Environment | Where to Store | How It Works |
|------------|---------------|-------------|
| **Claude Desktop / claude.ai** | Project knowledge file | Add the brand voice document to a project's knowledge base. Claude loads it automatically for all conversations in that project. |
| **Claude Code** | Skill file in `~/.claude/skills/` or project skills directory | Claude loads skill files into context automatically when relevant. |
| **Claude Code** | Referenced in `CLAUDE.md` | Add a reference to the brand voice file location in CLAUDE.md so Claude knows where to find it. |
| **Any environment** | Pasted into conversation | The user can paste the document at the start of any session. Least efficient but always works. |

### Maintenance

The brand voice document should be treated as a living document:

- **Review periodically** — when the brand evolves, messaging changes, or new products launch
- **Update terminology** — as new products/features are added or naming changes
- **Refine tone guidance** — as the team identifies new channels or situations
- **brand-review feedback loop** — if brand-review consistently flags the same issues, update the brand voice document to address them

---

## How Brand Review Checks Content

The brand-review command (`starter-kit/commands/brand-review.md`) defines a structured review process. When invoked, it operates in one of two modes:

### With Brand Guidelines Configured

If a brand voice document is available (loaded as a project knowledge file, skill, or provided in the conversation), brand-review evaluates content across four dimensions:

1. **Voice and Tone** — Does content match defined voice attributes? Is tone appropriate for the content type? Are there inconsistent shifts? Flags specific deviating sentences with explanations.

2. **Terminology and Language** — Are preferred terms used correctly? Are "avoid" terms present? Is jargon appropriate for the audience? Are product/feature names correctly capitalised and formatted?

3. **Messaging Pillars** — Does content align with defined messaging pillars? Are claims consistent with approved messaging? Does it reinforce or contradict brand positioning?

4. **Style Guide Compliance** — Grammar and punctuation per style guide rules. Formatting conventions. Number and date formatting. Acronym usage.

### Without Brand Guidelines

If no brand voice document is available, brand-review falls back to a generic review covering:

- **Clarity** — Is the main message clear? Are sentences concise? Is structure logical?
- **Consistency** — Is tone consistent throughout? Are terms used consistently? Is formatting consistent?
- **Professionalism** — Free of errors? Appropriate tone? Claims supported?

### Always Checked (Both Modes)

Regardless of whether brand guidelines exist, brand-review always flags:

- Unsubstantiated claims (superlatives without evidence)
- Missing disclaimers (financial, health, guarantee claims)
- Comparative claims against competitors
- Regulatory language needing compliance review
- Testimonial issues (missing attribution or disclosure)
- Copyright concerns (closely paraphrased content)

### Review Output Format

Brand-review produces:

1. **Summary** — overall alignment assessment, top strengths, most important improvements
2. **Detailed Findings Table** — each issue with location, severity (High/Medium/Low), and suggestion
3. **Revised Sections** — before/after rewrites for the top 3-5 highest-severity issues
4. **Legal/Compliance Flags** — separate section with recommended actions

### Input Formats Accepted

Content for review can be provided as:

- Text pasted directly into the conversation
- A file path or knowledge base reference
- A URL to a published page
- Multiple pieces for batch review

---

## Copyable Prompt to Kick Off Brand Voice Setup

The following prompt can be used in Claude Desktop, claude.ai, or Claude Code to start the brand voice documentation process. It assumes the brand-voice skill is loaded as a project knowledge file or skill.

```
I'd like to create a comprehensive brand voice document for our company. Please guide me through the process step by step, covering all seven areas:

1. Brand Personality
2. Voice Attributes (3-5 attributes with "we are / we are not / sounds like" definitions)
3. Audience Awareness
4. Core Messaging Pillars
5. Tone Spectrum (how our voice adapts across channels and situations)
6. Style Rules (grammar, formatting, punctuation decisions)
7. Terminology (preferred terms, product names, inclusive language)

Here's what I can share to start:

**Company:** [Company name]
**What we do:** [Brief description]
**Who we serve:** [Primary audience]

**Examples of content that sounds like us:**
[Paste 2-3 examples of on-brand content — website copy, emails, social posts]

**Examples of content that does NOT sound like us (if available):**
[Paste any examples that felt off-brand]

**Existing guidelines (if any):**
[Paste or describe any existing brand/style guidelines]

Please work through each section one at a time, asking me questions and presenting options before moving to the next. When we're done, compile everything into a single brand voice document I can save and reuse.
```

If the user has no existing materials, a simpler version:

```
I'd like to create a brand voice document for our company from scratch. We don't have existing brand guidelines yet.

**Company:** [Company name]
**What we do:** [Brief description]
**Who we serve:** [Primary audience]

Please guide me through defining our brand voice step by step. Start with brand personality and work through voice attributes, audience, messaging pillars, tone, style rules, and terminology. Ask me questions and present options at each stage.
```

---

## Platform-Specific Considerations and Limitations

### Where Brand Voice Can Be Used

| Platform | Brand Voice Skill | Brand Review Command | Notes |
|----------|------------------|---------------------|-------|
| **Claude Desktop** | Yes — as a project knowledge file | Yes — as a project knowledge file (invoked by natural language, not slash command) | Best option for non-developers. Add both SKILL.md and brand-review.md to a project's knowledge base. |
| **claude.ai** | Yes — as a project knowledge file | Yes — as a project knowledge file | Same as Claude Desktop. |
| **Claude Code** | Yes — as a skill file | Yes — as a slash command (`/brand-review`) | Full functionality. Slash command invocation works natively. |

### Key Limitations

1. **No automatic file generation** — The brand-voice skill guides conversation but does not automatically create or save files. The user must manually save the output document.

2. **No persistent state between sessions** — Unless the brand voice document is saved as a project knowledge file or skill, it needs to be re-provided each session.

3. **brand-review does not auto-detect brand guidelines** — The command says it checks "if a brand style guide is configured in local settings" but in practice this means the document needs to be accessible in the current context (loaded as a skill, project file, or provided in conversation). There is no separate "configuration" step.

4. **Slash command availability** — The `/brand-review` slash command syntax only works in Claude Code. In Claude Desktop and claude.ai, users invoke the same functionality by asking naturally (e.g., "Review this content against our brand guidelines") with the command file loaded as project knowledge.

5. **Context window cost** — The brand-voice SKILL.md is approximately 180 lines. The brand-review command is approximately 117 lines. Both loaded together consume a modest portion of the context window but should be considered alongside other loaded skills and project files.

6. **No automated enforcement** — Neither the skill nor the command integrates into a CI/CD pipeline or automated workflow. Brand review is always a manual, conversational process.

---

## Summary: The Complete Workflow

```
DEFINE                          SAVE                           USE

brand-voice skill               Brand voice document           brand-review command
(framework for defining)   -->  (the output you create)   -->  (checks content against it)

Loaded as skill or              Saved as project knowledge     Invoked via /brand-review
project knowledge file          file, skill, or standalone     (Claude Code) or natural
                                document                       language (Desktop/claude.ai)
```

1. **Load** the brand-voice skill into your environment
2. **Run** the setup prompt to work through all seven sections
3. **Save** the resulting brand voice document where Claude can access it
4. **Load** the brand-review command into the same environment
5. **Review** content by invoking brand-review with content to check
6. **Iterate** on both the content and the brand voice document over time
