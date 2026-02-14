# UK English Enforcement Options

## Phase 0.2 Research Output

**Date:** 2026-02-14
**Status:** Complete
**Decision:** Use a layered approach -- profile preferences for claude.ai/Desktop, CLAUDE.md for Claude Code, with a lightweight skill as the portable fallback.

---

## Recommendation Summary

There is no single switch that enforces UK English across all Claude surfaces. However, the simplest reliable approach is a **three-layer strategy** that takes under five minutes to implement per user:

| Layer | Surface | Effort | Reliability |
|-------|---------|--------|-------------|
| 1. **Profile preferences** (claude.ai) | claude.ai, Claude Desktop | 30 seconds | High -- applied to every conversation automatically |
| 2. **CLAUDE.md rule** | Claude Code | 30 seconds | High -- loaded at session start, part of system prompt |
| 3. **Project instructions** (claude.ai) | claude.ai Projects | 30 seconds per project | High -- applied to all conversations within that project |

For teams wanting a belt-and-braces approach, a lightweight **UK English skill** can serve as a portable, shareable reinforcement that works across all surfaces. The full **brand-review command** is overkill for language enforcement alone but remains valuable for comprehensive content auditing.

---

## Options Evaluated

### Option 1: Profile Preferences (claude.ai / Claude Desktop)

**What it is:** A free-text preferences field in claude.ai settings that applies to every conversation. Available under Settings > Profile > "What preferences should Claude consider in responses?"

**How to set it up:**
1. Go to claude.ai > click your initials (bottom-left) > Settings
2. Under "Profile", find the preferences text box
3. Add: `Always use UK English spelling and grammar (e.g., colour, organise, behaviour, centre). Use UK date format (DD/MM/YYYY) and currency (GBP/£).`
4. Save

**Pros:**
- Simplest possible approach -- 30 seconds, no files to create
- Applied automatically to every conversation, every session
- Works in both claude.ai web interface and Claude Desktop app
- No maintenance required
- Already available on all Claude plans (Free, Pro, Team, Enterprise)

**Cons:**
- Per-user setting -- each team member must set it individually
- Not enforceable by an admin; relies on each person doing it
- Claude may occasionally lapse on less common words, though this is rare with clear preferences set
- Does not apply to Claude Code (Claude Code does not read claude.ai profile preferences)

**Verdict:** Primary recommendation for claude.ai and Claude Desktop users. Every Phew! team member should do this.

---

### Option 2: CLAUDE.md Rule (Claude Code)

**What it is:** A line in the project's CLAUDE.md file that instructs Claude Code to use UK English. CLAUDE.md is loaded as part of the system prompt at session start.

**How to set it up:**
Add the following to the project's CLAUDE.md under a "Critical Rules" or "Style" heading:

```markdown
## Style

- **UK English throughout.** All output must use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (£) for currency.
```

This is already present in the current project's CLAUDE.md (line 67):
> "UK English throughout. All content, examples, and copy must use UK English spelling and grammar. Use £ not $, UK regulatory references where relevant."

**Pros:**
- Already standard practice in this project
- Loaded automatically at session start
- Applies to all Claude Code users working in the project
- Version-controlled -- part of the repo, so it is shared with all developers via git
- No per-user setup required (beyond cloning the repo)

**Cons:**
- Only applies to Claude Code, not claude.ai or Desktop
- Only applies within projects that include the rule
- Consumes a small number of context tokens (negligible -- a few dozen tokens)

**Verdict:** Essential for any Claude Code project. Already implemented in this repo. Phew! should include this rule in every project's CLAUDE.md.

---

### Option 3: Project Instructions (claude.ai Projects)

**What it is:** Custom instructions set at the project level in claude.ai. These are applied to every conversation within that project. Available on Team and Enterprise plans.

**How to set it up:**
1. In claude.ai, open or create a Project
2. Click the project name to access settings
3. In the "Custom Instructions" field, add:
   ```
   Always use UK English spelling and grammar in all responses. Examples: colour (not color), organise (not organize), behaviour (not behavior), centre (not center), analyse (not analyze). Use UK date format (DD/MM/YYYY) and GBP (£) for currency.
   ```
4. Save

**Pros:**
- Applied to all conversations within the project
- Shared with team members who have access to the project (Team/Enterprise plans)
- Can include additional brand/style rules alongside the language rule
- Admin or project owner sets it once; all project users benefit

**Cons:**
- Only applies within that specific project -- new projects need it added again
- Only available on paid plans (Team, Enterprise)
- Does not apply to Claude Code
- Does not apply to conversations outside of projects

**Verdict:** Excellent for teams using claude.ai Projects. The closest thing to an "admin-enforced" setting, since the project owner sets it and all team members inherit it.

---

### Option 4: Claude Memory (claude.ai)

**What it is:** Claude's memory feature (available on Team and Enterprise plans) allows Claude to remember preferences across conversations. Users can tell Claude to remember UK English preferences, or edit the memory summary directly.

**How to set it up:**
1. In any conversation, tell Claude: "Please remember that I always want you to use UK English spelling and grammar in all responses."
2. Claude will store this in its memory summary
3. Alternatively, go to Settings > Memory and edit the summary directly to include: "Uses UK English spelling and grammar"

**Pros:**
- Persists across all conversations (not just within a project)
- Natural to set up -- just tell Claude in conversation
- Claude actively applies remembered preferences

**Cons:**
- Per-user -- each team member must set it or tell Claude individually
- Memory can be edited or cleared accidentally
- Memory is supplementary, not a hard rule -- profile preferences are more reliable as a persistent instruction
- Not available on Free plans
- Does not apply to Claude Code

**Verdict:** Useful as reinforcement but not the primary mechanism. Profile preferences (Option 1) are more reliable and explicit. Memory is better suited to complex, evolving preferences rather than a simple fixed rule.

---

### Option 5: Custom Style (claude.ai)

**What it is:** Claude's Styles feature allows users to create named output styles with custom instructions. A "UK English" style could be created and selected for conversations.

**How to set it up:**
1. In claude.ai, click the style dropdown (near the message input)
2. Click "Create & edit styles"
3. Create a new custom style named "UK English"
4. Use "Custom instructions (advanced)" and add:
   ```
   Always use UK English spelling and grammar. Use British conventions:
   - Spelling: colour, organise, behaviour, centre, analyse, programme (not program, unless referring to computer programs)
   - Grammar: collective nouns can take plural verbs ("the team are"), "whilst" and "amongst" are acceptable
   - Dates: DD/MM/YYYY or DD Month YYYY
   - Currency: GBP (£)
   - Punctuation: single quotes for quotation marks, full stop outside closing quotes unless quoting a complete sentence
   ```
5. Select this style for conversations

**Pros:**
- Can encode detailed UK English rules beyond just spelling
- Reusable -- select it whenever needed
- Can be combined with other style instructions (e.g., tone, formality)

**Cons:**
- Must be actively selected for each conversation (not automatic)
- Per-user -- each team member must create or import the style
- Styles are primarily designed for tone and formatting, not language enforcement
- Styles override Claude's default communication approach, which may have unintended effects
- Does not apply to Claude Code (Claude Code has its own output styles feature, which is a different system)

**Verdict:** Overly complex for this purpose. Profile preferences achieve the same result with less friction.

---

### Option 6: Lightweight UK English Skill

**What it is:** A minimal skill file that can be added to any Claude environment. When invoked (by name or naturally during relevant tasks), it instructs Claude to use UK English.

**Proposed skill content:**

```markdown
---
name: uk-english
description: Enforce UK English spelling, grammar, and conventions in all output. Use when writing, reviewing, or editing any content for UK audiences.
---

# UK English

All output must use UK English spelling, grammar, and conventions.

## Spelling Rules

Use British English spellings throughout:
- -ise endings (not -ize): organise, recognise, specialise, optimise
- -our endings (not -or): colour, behaviour, favour, honour
- -re endings (not -er): centre, metre, theatre (except for computer-related "center" in CSS/code)
- -ence endings where applicable: licence (noun), defence, offence
- Double L: travelling, modelling, labelling, cancelled
- Other: grey (not gray), programme (not program, unless computer program), cheque (not check, for banking)

## Grammar Conventions

- Collective nouns may take plural verbs: "the team are working on..."
- "Whilst", "amongst", "towards" are preferred over "while", "among", "toward"
- Past tense: "learnt", "spelt", "dreamt" are acceptable alongside "learned", "spelled", "dreamed"

## Formatting Conventions

- Dates: DD/MM/YYYY or DD Month YYYY (e.g., 14/02/2026 or 14 February 2026)
- Currency: GBP, use £ symbol (e.g., £500, not $500)
- Time: 24-hour format preferred in formal contexts (e.g., 14:00), 12-hour acceptable informally (e.g., 2pm -- no space, no full stops in am/pm)
- Quotation marks: single quotes for primary quotation, double quotes for quotes within quotes
- Full stops and commas go outside closing quotation marks unless part of the quoted material

## In Code Contexts

- Use UK English only in comments, documentation, and user-facing strings
- Never change variable names, function names, CSS properties, or API parameters (these follow their language's conventions, typically US English)
- Example: write `// Initialise the colour palette` but keep `const color = getColor()`
```

**How to deploy:**
- **Claude Code:** Save as a `.md` file in the project's skills directory or in `~/.claude/skills/` for global availability
- **claude.ai / Desktop:** Paste the content into Project instructions, or reference it in a conversation when writing UK-audience content
- **Shareable:** Can be committed to a shared repo, so all team members have access

**Pros:**
- Portable across all Claude surfaces (with slight adaptation per surface)
- Comprehensive -- covers spelling, grammar, formatting, and code contexts
- Shareable via git -- version-controlled, team-wide
- Can be referenced naturally in conversations: "use the uk-english skill" or simply by Claude detecting relevant context
- Includes the code-context nuance that simple preferences miss

**Cons:**
- Not automatic in claude.ai -- needs to be invoked or pasted into project instructions
- In Claude Code, skills consume a small amount of context (loaded when relevant)
- More setup than a one-line preference (but far less than brand-review)

**Verdict:** Recommended as the portable, shareable component of the strategy. Particularly valuable for its code-context rules and as a reference document that captures all UK English conventions in one place.

---

### Option 7: Britfix (Claude Code Post-Processing Hook)

**What it is:** An open-source tool ([github.com/Talieisin/britfix](https://github.com/Talieisin/britfix)) that automatically converts American English spellings to British English in files written by Claude Code, using a post-tool-use hook.

**How it works:**
- Installs as a Claude Code hook that runs after every Write or Edit tool use
- Scans the written/edited file and converts US spellings to UK equivalents
- Context-aware: only converts comments and docstrings in code files, never identifiers or string literals

**Configuration (in `.claude/settings.json`):**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "/absolute/path/to/britfix/run-hook.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

**Pros:**
- Catches any US English that slips through despite CLAUDE.md instructions
- Fully automatic -- no user action needed per session
- Smart about code contexts (preserves identifiers and string literals)
- Belt-and-braces approach on top of CLAUDE.md instruction

**Cons:**
- Only works in Claude Code (not claude.ai or Desktop)
- Requires installation of the britfix tool (Python dependency)
- Post-processing approach -- Claude still generates US English, then it gets converted
- May occasionally make incorrect conversions on edge cases
- Adds processing time to every file write/edit
- Third-party dependency with maintenance considerations (relevant to governance policy)

**Verdict:** A good supplementary tool for teams that want guaranteed UK English in code output, but not essential. The CLAUDE.md instruction handles the vast majority of cases. Worth mentioning in the playbook as an option for teams that need absolute consistency.

---

### Option 8: Brand-Review Command (Existing Starter Kit)

**What it is:** The brand-review command from the Anthropic Marketing plugin. A comprehensive content review tool that checks voice, tone, terminology, style guide compliance, and legal/compliance concerns.

**Does it cover UK English?** Partially. Looking at the command's "Style Guide Compliance" section, it checks:
- Grammar and punctuation per style guide
- Formatting conventions
- Number formatting, date formatting

However, it does **not** specifically check for UK vs US English spelling variants. It relies on whatever brand style guide is configured. If the style guide specifies UK English, brand-review will flag US English spellings as deviations. If no style guide is configured, it performs a generic review focused on clarity, consistency, and professionalism -- with no UK English enforcement.

**To make brand-review enforce UK English:**
1. Configure a brand style guide (using the brand-voice skill) that explicitly specifies UK English conventions
2. Then run `/brand-review` against content to check compliance

**Pros:**
- Comprehensive content review beyond just language
- Checks voice, tone, terminology, messaging, and legal/compliance
- Structured output with severity levels and revision suggestions
- Valuable for marketing content, client-facing documents, and formal communications

**Cons:**
- Massive overhead for simple UK English enforcement
- Requires a configured brand style guide to enforce specific conventions
- Designed as a review tool, not a preventive control -- it checks content after creation, not during
- Not a "set and forget" solution -- requires active invocation
- Only meaningful for content review, not day-to-day coding or conversation

**Verdict:** Not suitable as the primary UK English enforcement mechanism. It is, however, the right tool for comprehensive content auditing when Phew! needs to review marketing materials, client communications, or published content. Recommend as a complementary tool for Section 1.6, not as the language enforcement solution.

---

## Recommended Implementation

### For All Phew! Staff (claude.ai and Claude Desktop)

**Step 1: Set profile preferences** (each team member, once)

Go to claude.ai > Settings > Profile, and add:

```
Always use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (£) for currency.
```

**Step 2: Set project instructions** (project owner, once per project)

For any shared claude.ai Project, add to Custom Instructions:

```
Always use UK English spelling and grammar in all responses. Use colour (not color), organise (not organize), behaviour (not behavior), centre (not center), analyse (not analyze). Dates in DD/MM/YYYY format. Currency in GBP (£).
```

### For Developers (Claude Code)

**Step 3: CLAUDE.md rule** (already implemented in this project)

Ensure every project's CLAUDE.md includes:

```markdown
- **UK English throughout.** All output must use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (£) for currency.
```

### For Everyone (Portable Reference)

**Step 4: UK English skill file** (optional but recommended)

Save the skill file from Option 6 above as `uk-english.md` in the starter kit. This serves as:
- A reference document for all UK English conventions
- A skill that can be loaded in Claude Code projects
- Content that can be pasted into claude.ai project instructions for comprehensive coverage

### Optional Extras

- **Britfix hook** (Option 7): For teams that want guaranteed UK English in Claude Code file output. Mention in the playbook as an advanced option.
- **Brand-review command** (Option 8): For comprehensive content auditing. Cover in Section 1.6 as the tool for reviewing marketing materials and client-facing content.

---

## What to Include in the Playbook (Section 1.6)

1. **Primary recommendation:** Profile preferences + CLAUDE.md rule (simple, covers all surfaces)
2. **Portable reference:** The UK English skill file, presented as a copyable block
3. **Project-level enforcement:** How to set project instructions for shared teams
4. **Advanced option:** Britfix for post-processing in Claude Code
5. **Comprehensive option:** Brand-review for full content auditing (separate from language enforcement)
6. **Key message:** "This takes two minutes to set up and you'll never have to think about it again"

---

## What to Include in the Starter Kit (Section 1.16)

1. `starter-kit/skills/uk-english.md` -- the skill file from Option 6
2. A note in the starter kit README pointing users to the profile preferences setup
3. A copyable CLAUDE.md snippet for developers

---

## Key Finding

Claude defaults to US English because its training data is predominantly American. There is no platform-level "language" setting that switches this globally. However, Claude is highly responsive to explicit instructions -- a one-line preference or CLAUDE.md rule is sufficient to produce consistent UK English output in the vast majority of cases. The layered approach (preferences + CLAUDE.md + optional skill) provides comprehensive coverage across all Claude surfaces with minimal effort.
