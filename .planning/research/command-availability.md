# Phase 0.3 Research: Command & Skill Availability Across Claude Platforms

**Date:** 2026-02-14
**Scope:** Determine how slash commands, skills, and project customisation features work across Claude Code, Claude Desktop, claude.ai, and CoWork -- with a focus on packaging session handoff tooling for non-dev users on Claude Teams.

---

## Executive Summary

Skills are the universal extensibility mechanism across all Claude platforms. They work on claude.ai, Claude Desktop, Claude Code, and CoWork. Non-dev users on Claude Teams can receive custom skills via two routes: **(1) admin-provisioned organisation-wide skills** (the recommended approach), or **(2) individual ZIP upload** via Settings > Capabilities. Slash commands (`/command-name`) are a Claude Code-only invocation pattern; on claude.ai and Claude Desktop, skills are invoked automatically via natural language -- Claude decides when to apply them based on the skill's description. For non-dev users, **Projects with custom instructions** remain the simplest zero-setup option, while **admin-provisioned skills** provide the most powerful and scalable delivery mechanism.

---

## Platform-by-Platform Breakdown

### 1. Claude Code (CLI / Terminal)

| Feature | Status |
|---|---|
| Slash commands (`/command`) | Yes -- unified into skills system since v2.1.3 (Jan 2026) |
| Custom skills (SKILL.md) | Yes -- filesystem-based, stored in `.claude/skills/` |
| Skill auto-invocation | Yes -- Claude loads skills based on task relevance |
| Explicit invocation | Yes -- via `/skill-name` slash command |
| Skill scope | Personal (`~/.claude/skills/`), Project (`.claude/skills/`), Plugin |
| Legacy commands | Backward-compatible; `.claude/commands/review.md` still works as `/review` |

**How it works:** Skills are directories containing a `SKILL.md` file with YAML frontmatter (name, description) and markdown instructions. Claude scans available skills' frontmatter, evaluates relevance, and loads matching skills automatically. Users can also invoke explicitly with `/skill-name`.

**Key detail for our use case:** Claude Code skills are the most flexible format. A skill created here can be packaged as a ZIP for distribution to web/desktop users.

---

### 2. Claude Desktop (Native macOS/Windows App)

| Feature | Status |
|---|---|
| Slash commands (`/command`) | No -- not a native invocation pattern |
| Custom skills (ZIP upload) | Yes -- via Settings > Capabilities > Skills |
| Skill auto-invocation | Yes -- Claude automatically identifies and loads relevant skills |
| Explicit invocation by name | No slash command; users describe the task in natural language |
| Admin-provisioned skills | Yes -- Team/Enterprise admins can deploy org-wide |
| Projects | Yes -- with custom instructions and knowledge uploads |
| CoWork | Yes -- available on macOS (and Windows), separate from basic Desktop |

**How skills work on Desktop:**
1. Package the skill folder as a ZIP file (folder containing `SKILL.md` at root)
2. Navigate to Settings > Capabilities > Skills
3. Upload the ZIP file
4. The skill appears in the Skills list and can be toggled on/off
5. Claude automatically uses the skill when the user's task matches the skill's description

**Critical note:** There is **no slash command invocation** on Claude Desktop. Skills are triggered by natural language only -- Claude reads the skill description and decides when to apply it. The quality of the skill's `description` field in the YAML frontmatter directly determines invocation accuracy.

---

### 3. claude.ai (Web Interface)

| Feature | Status |
|---|---|
| Slash commands (`/command`) | No -- not available |
| Custom skills (ZIP upload) | Yes -- via Settings > Capabilities > Skills |
| Skill auto-invocation | Yes -- identical to Desktop behaviour |
| Admin-provisioned skills | Yes -- Team/Enterprise admins can deploy org-wide |
| Projects | Yes -- with custom instructions, knowledge base, and team sharing |
| Skills Directory | Yes -- pre-built skills from Notion, Canva, Figma, Atlassian, etc. |
| Plan requirement | Custom skills require Pro, Max, Team, or Enterprise with code execution enabled |

**How skills work on claude.ai:** Identical to Claude Desktop. ZIP upload via Settings > Capabilities. Claude auto-invokes based on task matching.

**Projects as an alternative:** claude.ai Projects provide a simpler mechanism for non-dev users:
- Custom instructions guide Claude's tone, style, perspective, and approach
- Upload documents (PDF, DOCX, CSV, TXT, HTML, etc.) as project knowledge -- up to 200k tokens
- Share projects with team members (Team/Enterprise plans)
- Members with "Can edit" permissions can modify instructions and knowledge
- No skill creation or ZIP packaging required

---

### 4. CoWork (Autonomous Agent on Desktop)

| Feature | Status |
|---|---|
| Slash commands | Yes -- plugin-provided (e.g., `/sales:call-prep`, `/data:write-query`, `/brief`, `/respond`) |
| Custom skills | Yes -- same SKILL.md format |
| Plugins | Yes -- pre-built plugin ecosystem |
| Cross-session memory | No -- Claude does not retain memory from previous CoWork sessions |
| Session sharing | No -- sessions cannot be shared with others |
| Plan requirement | Pro, Max, Team, or Enterprise |

**Limitation for our use case:** CoWork currently has **no memory across sessions** and **no session sharing**. This makes it unsuitable as a session handoff mechanism. Session handoff prompts would need to be delivered via a different channel (Projects or skills).

---

## Answers to Research Questions

### Q1: Can users save and invoke `/commands` outside of Claude Code and CoWork?

**No.** Slash commands (`/command-name`) are exclusive to Claude Code and CoWork plugins. On claude.ai and Claude Desktop, the equivalent mechanism is **skills**, which are invoked automatically via natural language. Users cannot type `/my-command` in the chat box on claude.ai or Claude Desktop and have it recognised as a command.

**Workaround:** Package the same instructions as a skill with a clear description. When a user describes a task matching that description, Claude will automatically load and follow the skill's instructions.

### Q2: If skills can be invoked via natural language in Claude Desktop/claude.ai, what's the exact mechanism?

The mechanism is **progressive disclosure with automatic matching**:

1. Claude scans all available skills' **frontmatter only** (name + description) -- not the full content
2. When the user's request matches a skill's description, Claude loads the full `SKILL.md` into context
3. Claude follows the skill's instructions to complete the task
4. The `description` field uses a recommended `WHEN` / `WHEN NOT` pattern to improve matching accuracy

**Example SKILL.md frontmatter:**
```yaml
---
name: session-handoff
description: |
  WHEN the user wants to hand off a conversation to another team member,
  summarise a session for continuation, or create a briefing for the next person.
  WHEN NOT the user is simply asking for a summary of the current conversation.
---
```

Users do **not** need to know the skill exists or reference it by name. They simply describe their task naturally (e.g., "I need to hand this session off to Sarah") and Claude matches it to the skill.

**Control option:** Add `disable-model-invocation: true` to frontmatter to prevent automatic invocation, requiring explicit reference. However, on web/desktop there is no slash command mechanism, so this effectively disables the skill unless the user mentions it by name in natural language.

### Q3: How should we package session handoff tooling for non-dev users?

**Recommended approach (primary): Admin-provisioned organisation skills**

Since the client has Claude Teams licences for all staff, the most scalable approach is:

1. Build skills as `SKILL.md` files (with optional supporting scripts/templates)
2. Package each skill as a ZIP file
3. Have the Teams admin upload via organisation settings (admin console)
4. Skills automatically become available to all users in Settings > Capabilities
5. Admin can set skills as enabled-by-default
6. Individual users can toggle skills on/off as needed

This requires **zero action from end users** -- the skills simply appear in their Claude instance.

**Recommended approach (supplementary): Shared Projects**

For session handoff specifically, a shared Team Project is also effective:

1. Create a Project called "Session Handoff & Briefings"
2. Add custom instructions that define the handoff protocol (tone, format, required fields)
3. Upload reference documents (playbook, templates, examples)
4. Share with all team members via the Team sharing feature
5. Users start a new chat within this project when they need to create or consume a handoff

This approach is **more visible and intuitive for non-dev users** -- they see a named project in their sidebar.

**Not recommended:** Asking non-dev users to individually upload ZIP files. While possible, it creates a support burden and version-control problem.

### Q4: What's the current state of Claude Desktop skill/command support?

As of February 2026:

- **Skills:** Fully supported. Upload via Settings > Capabilities > Skills (ZIP format). Auto-invoked via natural language.
- **Skills Directory:** Available -- pre-built skills from third-party partners can be installed in a few clicks.
- **Admin-provisioned skills:** Supported on Team/Enterprise plans since December 2025.
- **Slash commands:** Not supported natively. Only available through CoWork plugins.
- **Claude Code in Desktop:** Claude Code sessions can now run inside the Desktop app, providing access to slash commands within those sessions, but this is a developer-oriented feature.
- **Projects:** Fully supported with custom instructions and document uploads.

### Q5: Does Claude Teams have project-level customisation features (like Projects in claude.ai)?

**Yes.** Claude Teams includes full Projects support:

- **Custom instructions** per project (tone, style, role, approach)
- **Project knowledge base** -- upload documents (PDF, DOCX, CSV, TXT, HTML, ODT, RTF, EPUB; up to 30MB per file; 200k token total context)
- **Team sharing** -- share projects with specific members by email, bulk email lists, or organisation-wide
- **Permission levels** -- members can be given "Can edit" (modify instructions, knowledge, settings) or view-only access
- **Conversation history** -- each project maintains its own chat history
- **Admin-provisioned skills** -- organisation-wide skill deployment via admin console

---

## Recommendations for Packaging Session Handoff Tooling

### Tier 1: Admin-Provisioned Skills (All Users)

**Best for:** Ensuring every team member has access to standardised handoff workflows without any manual setup.

| Step | Action |
|---|---|
| 1 | Create `SKILL.md` files for each handoff workflow (session summary, briefing creator, handoff consumer) |
| 2 | Package as ZIP files following the required structure (folder > SKILL.md at root) |
| 3 | Test on a single admin account before org-wide deployment |
| 4 | Upload via Teams admin console > organisation settings |
| 5 | Set as enabled-by-default for all users |
| 6 | Document the natural language triggers in the playbook (e.g., "To create a handoff, ask Claude to...") |

### Tier 2: Shared Team Projects (Contextual Tooling)

**Best for:** Providing reference materials, templates, and structured workflows that non-dev users can discover via the sidebar.

| Step | Action |
|---|---|
| 1 | Create a Team Project per workflow area (e.g., "Session Handoff", "Follow-up Templates") |
| 2 | Write custom instructions that define the expected behaviour |
| 3 | Upload playbook documents, templates, and examples as project knowledge |
| 4 | Share with all relevant team members |
| 5 | Train users to start conversations within the relevant project |

### Tier 3: Playbook Documentation (Fallback)

**Best for:** Users who need guidance but where skills/projects aren't sufficient.

| Step | Action |
|---|---|
| 1 | Write clear prompt templates users can copy-paste |
| 2 | Include in the playbook with usage instructions |
| 3 | Provide example inputs and expected outputs |

### What NOT to do

- Do not rely on slash commands for non-dev users -- they are not available outside Claude Code
- Do not ask non-dev users to upload ZIP skills individually -- creates support burden
- Do not assume CoWork session sharing -- it does not exist yet
- Do not conflate Claude Code skills (filesystem-based) with claude.ai/Desktop skills (ZIP upload) in documentation

---

## Key Constraints and Caveats

1. **Code execution requirement:** Custom skills on claude.ai and Desktop require code execution to be enabled on the plan. Verify this is active on the client's Teams subscription.
2. **No cross-session memory in CoWork:** Session handoff cannot rely on CoWork's built-in capabilities -- it has no memory across sessions and no session sharing.
3. **Skill invocation is probabilistic:** On claude.ai and Desktop, Claude decides when to apply a skill based on description matching. Well-written descriptions with `WHEN`/`WHEN NOT` patterns improve reliability but do not guarantee invocation. The playbook should instruct users on how to phrase requests to trigger the right skill.
4. **Free tier exclusion:** Skills are not available on the free plan. All users must be on Pro, Max, Team, or Enterprise.
5. **Admin-provisioned skills shipped Dec 2025:** This is a relatively new feature. Verify it is available and stable on the client's specific Teams instance.

---

## Sources

- [Using Skills in Claude - Claude Help Center](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [What are Skills? - Claude Help Center](https://support.claude.com/en/articles/12512176-what-are-skills)
- [What are Projects? - Claude Help Center](https://support.claude.com/en/articles/9517075-what-are-projects)
- [What is the Team Plan? - Claude Help Center](https://support.claude.com/en/articles/9266767-what-is-the-team-plan)
- [How to create custom Skills - Claude Help Center](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Provisioning and managing Skills for your organisation - Claude Help Center](https://support.claude.com/en/articles/13119606-provisioning-and-managing-skills-for-your-organization)
- [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents - Claude Blog](https://claude.com/blog/skills-explained)
- [Skills for organisations, partners, the ecosystem - Claude Blog](https://claude.com/blog/organization-skills-and-directory)
- [Extend Claude with skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [The Definitive Guide to Claude SKILLS: Code vs Web vs Desktop vs API](https://limitededitionjonathan.substack.com/p/the-definitive-guide-to-claude-skills)
- [Getting started with Cowork - Claude Help Center](https://support.claude.com/en/articles/13345190-getting-started-with-cowork)
- [Claude Code Merges Slash Commands Into Skills - Medium](https://medium.com/@joe.njenga/claude-code-merges-slash-commands-into-skills-dont-miss-your-update-8296f3989697)
