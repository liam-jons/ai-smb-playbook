import type { Track } from '@/content/shared/types';
import { siteConfig } from '@/config/site';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type StarterKitCategory =
  | 'skill'
  | 'command'
  | 'template'
  | 'prompt'
  | 'plugin'
  | 'gsd-mapper';

export type Priority = 'high' | 'medium' | 'low';

export type PluginRecommendation =
  | 'install-marketplace'
  | 'install-if-needed'
  | 'reference-only';

export interface InstallInstructions {
  claudeCode?: string;
  claudeDesktop?: string;
  claudeAi?: string;
  teamsAdmin?: string;
}

export interface StarterKitFile {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: StarterKitCategory;
  tracks: Track[];
  priority: Priority;
  filePath: string;
  isMultiFile: boolean;
  installInstructions: InstallInstructions;
  pluginRecommendation?: PluginRecommendation;
  installCommand?: string;
  /** Raw file content for inline display with copy button. */
  rawContent?: string;
}

/* ------------------------------------------------------------------ */
/*  Category metadata                                                  */
/* ------------------------------------------------------------------ */

export const CATEGORY_LABELS: Record<StarterKitCategory, string> = {
  skill: 'Skills',
  command: 'Commands',
  template: 'Templates',
  prompt: 'Prompts',
  plugin: 'Plugins',
  'gsd-mapper': 'GSD Mapper',
};

export const CATEGORY_ORDER: StarterKitCategory[] = [
  'skill',
  'command',
  'template',
  'prompt',
  'gsd-mapper',
  'plugin',
];

/* ------------------------------------------------------------------ */
/*  Quick start steps                                                  */
/* ------------------------------------------------------------------ */

export interface QuickStartStep {
  week: string;
  title: string;
  description: string;
  effort: string;
  fileId: string;
}

export const QUICK_START_STEPS: QuickStartStep[] = [
  {
    week: 'Week 1',
    title: 'UK English skill + profile preferences',
    description:
      'Set Claude to use British spelling and grammar across all conversations. A two-minute setup.',
    effort: '2 minutes',
    fileId: 'skill-uk-english',
  },
  {
    week: 'Week 1',
    title: 'Session handoff skill',
    description:
      'Upload once and use whenever you need to continue a conversation in a new session.',
    effort: '2 minutes to install',
    fileId: 'skill-session-handoff',
  },
  {
    week: 'Week 2',
    title: 'Brand voice setup',
    description:
      'A guided 30-60 minute session to document your brand voice, tone, and style rules.',
    effort: '30-60 minutes',
    fileId: 'prompt-brand-voice-setup',
  },
  {
    week: 'Week 2',
    title: 'CLAUDE.md template (dev team)',
    description:
      'Give Claude Code persistent context about your project structure, conventions, and tech stack.',
    effort: '15-30 minutes',
    fileId: 'template-claude-md',
  },
  {
    week: 'Week 3',
    title: 'Governance policy',
    description:
      'Customise the fill-in-the-blanks governance template and share with the team for discussion.',
    effort: '30 minutes + team discussion',
    fileId: 'template-governance-policy',
  },
];

/* ------------------------------------------------------------------ */
/*  Install instruction templates                                      */
/* ------------------------------------------------------------------ */

const SKILL_INSTALL_CLAUDE_CODE =
  'Copy the skill folder to your project: cp -r starter-kit/skills/SKILL_NAME .claude/skills/SKILL_NAME\n\nOr install globally: cp -r starter-kit/skills/SKILL_NAME ~/.claude/skills/SKILL_NAME';

const SKILL_INSTALL_DESKTOP =
  '1. Download the skill ZIP file\n2. Open Claude Desktop > Settings > Capabilities > Skills\n3. Click "Upload skill"\n4. Select the downloaded ZIP file\n5. The skill will appear in your Skills list and activate automatically';

const SKILL_INSTALL_AI =
  '1. Download the skill ZIP file\n2. Open claude.ai > Settings > Capabilities > Skills\n3. Click "Upload skill"\n4. Select the downloaded ZIP file\n5. The skill activates automatically when your task matches its description';

const SKILL_INSTALL_TEAMS =
  '1. Download the skill ZIP file\n2. Open the Teams admin console\n3. Navigate to organisation settings > Skills\n4. Upload the skill ZIP\n5. Set as enabled-by-default for all users';

function skillInstall(skillName: string): InstallInstructions {
  return {
    claudeCode: SKILL_INSTALL_CLAUDE_CODE.replace(/SKILL_NAME/g, skillName),
    claudeDesktop: SKILL_INSTALL_DESKTOP,
    claudeAi: SKILL_INSTALL_AI,
    teamsAdmin: SKILL_INSTALL_TEAMS,
  };
}

/* ------------------------------------------------------------------ */
/*  Raw file contents (embedded for inline display)                    */
/* ------------------------------------------------------------------ */

const RAW_GOVERNANCE_POLICY = `# AI Tool Governance Policy

**Organisation:** {{COMPANY_NAME}}
**Industry:** {{INDUSTRY}}
**Team Size:** {{TEAM_SIZE}}
**Effective Date:** {{EFFECTIVE_DATE}}
**Last Reviewed:** {{LAST_REVIEWED}}
**Policy Owner:** {{ADMIN_CONTACT}}
**Review Frequency:** {{REVIEW_FREQUENCY}}

---

## 1. Purpose and Scope

### 1.1 Purpose

This policy establishes guidelines for the responsible evaluation, approval, installation, and maintenance of AI tool extensions used by {{COMPANY_NAME}}. It ensures that all AI capabilities are adopted with appropriate oversight, data protection, and operational awareness.

### 1.2 Scope

This policy applies to:
- All staff and contractors at {{COMPANY_NAME}} who use Claude or other AI tools
- All extension types: skills, plugins, MCP/connector integrations, commands, agents, and hooks
- All platforms: Claude Code, claude.ai, Claude Desktop, and CoWork
- Both organisation-provisioned and individually installed extensions

### 1.3 Why This Policy Exists

AI tool extensions can access data, execute code, connect to external services, and modify workflows. Whilst these capabilities are valuable, they require thoughtful governance to:
- Protect client data and confidential information
- Comply with GDPR and UK data protection requirements
- Maintain operational security and reliability
- Ensure consistency across the team
- Provide audit trails for regulatory purposes

---

## 2. Definitions

| Term | Definition |
|------|-----------|
| **Skill** | A markdown file (SKILL.md) that gives Claude specialised knowledge or behaviour for a specific task. Skills work on all Claude platforms. |
| **Plugin** | A packaged collection of skills, commands, agents, and/or hooks distributed via the Claude marketplace. Plugins receive automatic updates. |
| **MCP/Connector** | A Model Context Protocol integration that connects Claude to external services (e.g., GitHub, Asana, Sentry). MCPs can read and write data in connected services. |
| **Command** | A slash-invocable instruction file for Claude Code. Commands define specific workflows or processes. |
| **Agent** | A subagent definition file that creates a specialised Claude instance for a focused task (e.g., code review, documentation generation). |
| **Hook** | A script that runs automatically at specific lifecycle events (e.g., before compaction, after a commit). Hooks execute code on the user's machine. |
| **Admin-provisioned** | Extensions deployed organisation-wide by a Teams administrator, automatically available to all users. |

---

## 3. Approved Extension Types

| Extension Type | Risk Level | Approval Required | Maintenance Owner | Auto-Update |
|---------------|-----------|-------------------|-------------------|-------------|
| Official marketplace plugin | Low | Team lead | Plugin maintainer (automatic) | Yes |
| Third-party marketplace plugin | Medium | {{ADMIN_CONTACT}} | Plugin maintainer (automatic) | Yes |
| Internally developed skill | Low | Peer review | Author + team | No (manual) |
| Third-party skill (e.g., skills.sh) | Medium | {{ADMIN_CONTACT}} | Installer + team | No (manual) |
| MCP/Connector integration | Medium-High | {{ADMIN_CONTACT}} | {{ADMIN_CONTACT}} | Varies |
| Command file | Low | Peer review (Code-only) | Author + team | No (manual) |
| Agent file | Low | Peer review (Code-only) | Author + team | No (manual) |
| Hook | High | {{ADMIN_CONTACT}} | Author + {{ADMIN_CONTACT}} | No (manual) |

---

## 4. Approval Workflows

### 4.1 Official Marketplace Plugins

**Risk level:** Low
**Process:**
1. Developer or team member identifies a useful plugin in the Claude marketplace
2. Reviews the plugin description, permissions, and data access
3. Requests approval from their team lead
4. Team lead reviews and approves or escalates to {{ADMIN_CONTACT}}
5. Installer runs \\\`claude plugin install <plugin-name>\\\`
6. Plugin is added to the Approved Extensions appendix

### 4.2 Third-Party Marketplace Plugins

**Risk level:** Medium
**Process:**
1. Requester identifies the plugin and documents the business need
2. {{ADMIN_CONTACT}} reviews the plugin's:
   - Source and publisher reputation
   - Permissions and data access requirements
   - Content of skills, commands, and agents included
   - Privacy policy and terms of service
3. {{ADMIN_CONTACT}} approves, rejects, or requests modifications
4. If approved, added to the Approved Extensions appendix with any usage restrictions

### 4.3 Internally Developed Skills

**Risk level:** Low
**Process:**
1. Author creates the skill following the standard SKILL.md format
2. A peer reviews the skill content for:
   - Accuracy and completeness
   - Appropriate scope (not overly broad)
   - UK English compliance
   - No embedded credentials or sensitive data
3. Skill is added to the shared skills repository or provisioned by {{ADMIN_CONTACT}}
4. Added to the Approved Extensions appendix

### 4.4 Third-Party Skills

**Risk level:** Medium
**Process:**
1. Requester identifies the skill and its source
2. {{ADMIN_CONTACT}} reviews the full content of the SKILL.md and any reference files
3. Checks for:
   - Unexpected instructions or prompt injection patterns
   - Data exfiltration instructions (e.g., 'send this data to...')
   - Overly broad permissions or scope
   - Compliance with {{COMPANY_NAME}} data policies
4. If approved, provisioned via the Teams admin console or shared internally

### 4.5 MCP/Connector Integrations

**Risk level:** Medium-High
**Process:**
1. Requester documents:
   - The service being connected (e.g., GitHub, database)
   - What data the connector can read and write
   - Who will have access through the connection
   - Whether client data may be exposed
2. {{ADMIN_CONTACT}} reviews with consideration for:
   - Data classification of accessible information
   - GDPR implications (especially for personal data)
   - Service-level agreements with the connected service
   - Least-privilege principle (minimum necessary access)
3. If approved, document the connection details, data flows, and access controls
4. Review quarterly (or per {{REVIEW_FREQUENCY}})

### 4.6 Hooks

**Risk level:** High
**Process:**
1. Hooks execute code on the user's machine and require the highest level of scrutiny
2. Author documents exactly what the hook does, when it triggers, and what data it accesses
3. {{ADMIN_CONTACT}} reviews the hook code line by line
4. Hook is tested in a controlled environment before deployment
5. Must be re-reviewed after any modifications

---

## 5. Risk Assessment Criteria

When evaluating any extension, assess the following:

| Criterion | Questions to Ask |
|-----------|-----------------|
| **Data access** | What data can this extension read? Can it access client data, personal data, or confidential information? |
| **External connections** | Does this extension connect to external services? What data is transmitted? |
| **Code execution** | Does this extension execute code on the user's machine? What permissions does it require? |
| **Maintenance status** | Is this extension actively maintained? When was it last updated? |
| **Source reputation** | Who created this extension? Is the publisher known and trusted? |
| **Scope** | Is the extension's scope appropriately narrow, or does it have overly broad capabilities? |
| **Reversibility** | Can the extension's effects be easily undone if problems arise? |
| **Alternatives** | Are there lower-risk alternatives that achieve the same goal? |

---

## 6. Installation and Maintenance

### 6.1 Marketplace Plugins

- Installed via \\\`claude plugin install <plugin-name>\\\` (Claude Code) or the marketplace interface
- **Receive automatic updates** from the plugin maintainer
- {{ADMIN_CONTACT}} monitors update notifications for breaking changes
- If an update introduces concerns, the plugin can be disabled pending review

### 6.2 Manually Copied Files (Skills, Commands, Agents)

- Copied to \\\`.claude/skills/\\\`, \\\`.claude/commands/\\\`, or equivalent directories
- **Do not receive automatic updates** — the team is responsible for maintenance
- {{ADMIN_CONTACT}} schedules a review every {{REVIEW_FREQUENCY}} to:
  - Check for updated versions from the original source
  - Verify the files still meet policy requirements
  - Remove any that are no longer needed
- Admin-provisioned skills should be updated centrally when changes are needed

### 6.3 Version Control

- All internally developed skills, commands, and agents should be stored in a version-controlled repository
- Changes should be reviewed before deployment (standard code review process)
- A changelog should be maintained for significant modifications

---

## 7. Roles and Responsibilities

### {{ADMIN_CONTACT}} (AI Tools Administrator)

- Provisions organisation-wide skills via the Teams admin console
- Reviews and approves medium-risk and high-risk extensions
- Maintains the Approved Extensions list
- Conducts periodic reviews per {{REVIEW_FREQUENCY}}
- Responds to security concerns or incidents involving AI tools
- Stays informed about new extension types and platform changes

### Team Leads

- Approve low-risk extensions (official marketplace plugins)
- Escalate medium-risk and high-risk requests to {{ADMIN_CONTACT}}
- Ensure their team follows this policy
- Report any concerns about extension behaviour

### All Staff

- Follow this policy when installing or using AI tool extensions
- Do not install extensions that have not been approved
- Report any unexpected behaviour from extensions to {{ADMIN_CONTACT}}
- Participate in periodic reviews when requested
- Do not share API keys, credentials, or sensitive data via AI tool extensions

---

## 8. Data and Privacy Considerations

### 8.1 General Data Protection

- Extensions must not be used to process personal data beyond what is necessary for the task
- Client data should not be exposed to extensions that transmit data to external services without explicit approval
- All data processing via AI tools must comply with {{COMPANY_NAME}}'s data protection policies

### 8.2 UK GDPR Compliance

As a UK-based organisation, {{COMPANY_NAME}} must ensure that AI tool extensions comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018:

- **Lawful basis:** Ensure there is a lawful basis for any processing of personal data via AI tools
- **Data minimisation:** Only provide AI tools with the minimum data necessary for the task
- **Storage limitation:** Do not retain personal data in AI tool contexts longer than necessary
- **Transparency:** Where AI tools are used to process personal data, ensure data subjects are informed as required
- **International transfers:** Be aware that AI tool providers may process data outside the UK; verify adequacy decisions or appropriate safeguards are in place

### 8.3 Sector-Specific Considerations

{{COMPANY_NAME}} operates in {{INDUSTRY}}. The following additional considerations apply:

- [ ] **${siteConfig.complianceArea.charAt(0).toUpperCase() + siteConfig.complianceArea.slice(1)} data:** If working with ${siteConfig.complianceArea}-related data, ensure no personal data relating to vulnerable individuals is processed through AI extensions without explicit authorisation and appropriate safeguards
- [ ] **Public sector requirements:** If handling public sector data, verify that AI tool usage complies with relevant departmental policies and security classifications
- [ ] **Professional standards:** Ensure AI tool usage aligns with any professional body requirements relevant to {{INDUSTRY}}

*Customise this section based on your organisation's specific regulatory environment.*

---

## 9. Review Schedule

### Regular Reviews

This policy is reviewed every {{REVIEW_FREQUENCY}} by {{ADMIN_CONTACT}}. Reviews cover:

- The Approved Extensions list (additions, removals, changes)
- Any incidents or concerns since the last review
- New extension types or platform features that may require policy updates
- Changes to UK GDPR guidance or ICO recommendations
- Staff feedback on AI tool usage

### Triggered Reviews

An immediate review is triggered by:

- A security incident involving an AI tool extension
- The introduction of a new extension type not covered by this policy
- Significant changes to the Claude platform or extension mechanisms
- Changes to UK data protection legislation or ICO guidance
- A new client contract with specific AI usage requirements

---

## 10. Appendix: Currently Approved Extensions

*Populate this table with your organisation's approved extensions.*

| Extension | Type | Approved By | Approved Date | Risk Level | Notes |
|-----------|------|------------|---------------|------------|-------|
| | | | | | |

### Recommended Starting Set

The following extensions are recommended for initial approval based on the training programme assessment:

| Extension | Type | Risk Level | Recommendation |
|-----------|------|-----------|----------------|
| uk-english | Skill | Low | Enforce UK English across all AI output |
| session-handoff | Skill | Low | Session continuation and handoff management |
| brand-voice | Skill | Low | Brand voice documentation framework |
| brand-review | Skill/Command | Low | Content review against brand guidelines |
| claude-md-management | Plugin (marketplace) | Low | CLAUDE.md audit and improvement |
| commit-commands | Plugin (marketplace) | Low | Git workflow commands |
| pr-review-toolkit | Plugin (marketplace) | Low | PR review with specialised agents |
| context7 | Plugin (marketplace) | Low | Library documentation lookup |`;

const RAW_CLAUDE_MD_TEMPLATE = `# CLAUDE.md

<!-- One-line description of what this project is -->

## Project

[Project name]: [Brief description of what this project does and who it is for.]

## Tech Stack

<!-- List the core technologies. Keep it to the essentials. -->

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | [e.g., TypeScript] | [e.g., 5.x] |
| Framework | [e.g., Next.js] | [e.g., 15.x] |
| Database | [e.g., PostgreSQL] | [e.g., 16] |
| Hosting | [e.g., Vercel] | |
| Package Manager | [e.g., npm / pnpm / yarn] | |

## Dev Commands

<!-- Copy-paste ready commands. Keep these up to date. -->

\\\`\\\`\\\`bash
# Install dependencies
[e.g., npm install]

# Start development server
[e.g., npm run dev]

# Run tests
[e.g., npm test]

# Run linter
[e.g., npm run lint]

# Build for production
[e.g., npm run build]

# Deploy
[e.g., npm run deploy]
\\\`\\\`\\\`

## Architecture

<!-- Brief directory structure showing the key areas. Not every file — just the map. -->

\\\`\\\`\\\`
project-root/
  src/
    [key-directory]/     # [what it contains]
    [key-directory]/     # [what it contains]
    [key-directory]/     # [what it contains]
  docs/                  # Detailed documentation (see /docs)
  tests/                 # Test files
  [config-files]         # [what they configure]
\\\`\\\`\\\`

<!-- Mention entry points, key files, or unusual patterns -->

**Entry point:** \\\`[e.g., src/index.ts]\\\`
**Main config:** \\\`[e.g., next.config.js]\\\`

## Code Style

<!-- Rules that Claude should follow when writing code for this project -->

- [e.g., Use named exports, not default exports]
- [e.g., Prefer \\\`const\\\` over \\\`let\\\`; never use \\\`var\\\`]
- [e.g., Use descriptive variable names; no single-letter variables except loop counters]
- [e.g., Import order: external packages, then internal modules, then relative imports]
- [e.g., Use \\\`@/\\\` path alias for all imports from \\\`src/\\\`]
- [e.g., Functions over classes unless the framework requires classes]

## Testing

<!-- How tests are structured and what patterns to follow -->

- **Test runner:** [e.g., Vitest / Jest / Playwright]
- **Test location:** [e.g., Co-located with source files as \\\`*.test.ts\\\` / Separate \\\`tests/\\\` directory]
- **Naming:** [e.g., \\\`describe('ModuleName', () => { it('should do something', ...) })\\\`]
- **Coverage target:** [e.g., 80% for new code]
- **Patterns:** [e.g., Prefer integration tests over unit tests for API routes]

## Environment

<!-- Required environment variables and setup steps -->

### Required Environment Variables

\\\`\\\`\\\`
DATABASE_URL=          # [what this connects to]
API_KEY=               # [what service this authenticates with]
[OTHER_VAR]=           # [description]
\\\`\\\`\\\`

### Setup Steps

1. [e.g., Copy \\\`.env.example\\\` to \\\`.env\\\` and fill in values]
2. [e.g., Run database migrations: \\\`npm run db:migrate\\\`]
3. [e.g., Seed test data: \\\`npm run db:seed\\\`]

## Key Gotchas

<!-- Non-obvious patterns, common mistakes, things Claude tends to get wrong -->

- [e.g., The \\\`users\\\` table uses soft deletes — always include \\\`WHERE deleted_at IS NULL\\\`]
- [e.g., API routes require authentication middleware — do not create unprotected endpoints]
- [e.g., The CI pipeline runs on Node 20, not Node 22 — do not use Node 22 features]
- [e.g., CSS modules are used in \\\`/components\\\` but Tailwind is used in \\\`/app\\\`]
- [e.g., Never import from barrel files (\\\`index.ts\\\`) — import directly from the source file]

## Style

<!-- Language and formatting conventions -->

- **UK English throughout.** All output must use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (£) for currency.

<!-- Add any additional style rules specific to your project -->

## Documentation

<!-- Point to /docs for detailed information. This keeps CLAUDE.md lean. -->

For detailed documentation, see:
- \\\`docs/architecture/\\\` — System architecture and domain model
- \\\`docs/conventions/\\\` — Coding standards and patterns
- \\\`docs/integrations/\\\` — Third-party service documentation
- \\\`docs/schemas/\\\` — Database and API schemas`;

const RAW_DOCS_STRUCTURE_TEMPLATE = `# Recommended Documentation Structure

## The Progressive Disclosure Principle

Your CLAUDE.md file should be a map, not an encyclopaedia. Keep it under ~500 lines and point to \\\`/docs\\\` for detailed information. Claude navigates to the right document when it needs deeper context — you do not need to load everything upfront.

This approach works because:
- **CLAUDE.md stays lean** — it loads quickly and does not crowd out the actual task
- **Documentation stays current** — it is easier to maintain many focused files than one massive file
- **Claude finds what it needs** — descriptive file names and a clear structure let Claude navigate on demand
- **New team members benefit too** — the same structure that helps Claude helps humans

## Directory Structure

\\\`\\\`\\\`
docs/
  architecture/        # System architecture, domain model, data flow diagrams
  conventions/         # Coding standards, naming patterns, formatting rules
  integrations/        # Third-party service docs (APIs, webhooks, auth flows)
  schemas/             # Database schemas, API schemas, data models
  references/          # LLM-ready external docs (llms.txt files, vendor docs)
\\\`\\\`\\\`

---

## Getting Started

### Option 1: Manual Setup

\\\`\\\`\\\`bash
mkdir -p docs/{architecture,conventions,integrations,schemas,references}
\\\`\\\`\\\`

Start with the files most relevant to your current work. You do not need to fill in everything at once.

### Option 2: GSD Codebase Mapper

If you have the GSD codebase mapper installed, it can generate initial documentation automatically:

\\\`\\\`\\\`bash
/map-codebase
\\\`\\\`\\\`

### Option 3: AI-Assisted Population

Ask Claude to help populate each directory by analysing your codebase.`;

const RAW_SESSION_HANDOFF_SKILL = `---
name: session-handoff
description: |
  WHEN the user wants to hand off a conversation, create a continuation prompt,
  save session progress, wrap up and start fresh, or preserve context before
  a session ends or degrades.
  WHEN NOT the user is simply asking for a summary of the current conversation
  without intending to continue in a new session.
---

# Session Handoff

Guide users through creating session handoff / continuation prompts to preserve context across sessions.

## Scenario Detection

When invoked, determine which scenario applies by asking a brief clarifying question if unclear:

1. **Planned session boundary** — Work is at a logical stopping point. The user is deliberately closing the session. (Most common.)
2. **Mid-task context overflow** — Context is degrading or has compacted. This is an emergency save.
3. **Task delegation / person handoff** — Handing work to a different person or a differently configured session.
4. **Spec/artifact iteration handoff** — Iterating on a document or deliverable; the handoff captures the artifact's state and next changes.
5. **Multi-workstream handoff** — Multiple parallel work items at different stages need preserving.

## Platform-Adaptive Behaviour

### Claude Code

Generate a structured markdown file. Default output path: \\\`.planning/continuation-prompts/session-N-continuation.md\\\`. Include:

- File-reading directives (ordered list of files the next session must read)
- File tree showing key data locations
- Git context (current branch, recent commits, uncommitted changes)
- Subagent parallelisation hints where applicable

### claude.ai / Claude Desktop

Generate a single copy-paste text block. Follow these principles:

- Avoid technical jargon (no tokens, context windows, compaction)
- Use plain language: 'starting a new conversation', 'picking up where we left off'
- Include a 'How to Use This' instruction at the top
- Use guided questions rather than templates

## Design Principles

- **Be adaptive.** Detect the scenario type and adjust the output accordingly.
- **Weight recency.** Recent work gets more space; older work gets compressed with file references.
- **Include success criteria.** Every handoff should end with a clear definition of what 'done' looks like.
- **Reference rather than repeat.** For persistent context, point to existing files rather than embedding content.
- **Keep it concise.** Target ~500-1,500 words for general users, ~1,000-4,000 words for technical users.
- **Degrade gracefully.** If context is limited, produce a minimal but useful handoff.`;

const RAW_BRAND_VOICE_SETUP_PROMPT = `# Brand Voice Setup Prompt

Copy and paste the following prompt into a new Claude conversation to begin documenting your brand voice. Fill in the bracketed sections with your own details before sending.

---

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

Please work through each section one at a time, asking me questions and presenting options before moving to the next. When we're done, compile everything into a single brand voice document I can save and reuse.`;

const RAW_EXAMPLE_HANDOFF_GENERAL = `# Example: General User Session Handoff

The following is an example of a completed session handoff for a non-technical user. It demonstrates the simplified format — a single text block that can be copied and pasted into a new conversation.

---

**How to Use This:** Paste everything below into a new conversation to continue where you left off.

---

## What We Were Working On

I am working on a series of three blog posts about how technology is improving ${siteConfig.complianceArea} in the education sector. These are for our company blog and will also be shared on LinkedIn. The target audience is school administrators and ${siteConfig.complianceArea} leads — they are knowledgeable about ${siteConfig.complianceArea} but not particularly technical.

**Project:** Blog series — 'Technology and ${siteConfig.complianceArea.charAt(0).toUpperCase() + siteConfig.complianceArea.slice(1)} in Education'
**Started:** 10/02/2026
**Goal:** Three publish-ready blog posts of approximately 800-1,000 words each, with consistent tone and messaging.

---

## What Was Accomplished

- Outlined all three posts and agreed on the structure:
  1. 'Why Digital ${siteConfig.complianceArea.charAt(0).toUpperCase() + siteConfig.complianceArea.slice(1)} Matters More Than Ever' (awareness/problem)
  2. 'Five Questions to Ask When Choosing a ${siteConfig.complianceArea.charAt(0).toUpperCase() + siteConfig.complianceArea.slice(1)} Platform' (evaluation guide)
  3. 'Building a Culture of Digital Safety in Your School' (practical implementation)
- Completed a full draft of Post 1 ('Why Digital ${siteConfig.complianceArea.charAt(0).toUpperCase() + siteConfig.complianceArea.slice(1)} Matters More Than Ever')
- Reviewed the draft against our brand voice guidelines — made adjustments to tone (was too formal in places, needed to be more approachable)
- Agreed on key messaging: lead with the human impact, support with data, avoid fear-mongering
- Decided not to mention specific competitor products by name
- Identified three statistics from DfE reports to include across the series

---

## What Needs to Happen Next

- Write the first draft of Post 2 ('Five Questions to Ask When Choosing a ${siteConfig.complianceArea.charAt(0).toUpperCase() + siteConfig.complianceArea.slice(1)} Platform')
- The five questions should be practical and vendor-neutral — not a sales pitch for our platform
- After drafting Post 2, review both Post 1 and Post 2 together for consistency of tone
- If time allows, begin outlining Post 3 in more detail

---

## Important Things to Remember

- **Tone:** Professional but warm. We are experts sharing knowledge, not lecturing.
- **UK English throughout** — organise, colour, behaviour, etc.
- **No fear-mongering** — do not use scare tactics or worst-case scenarios to sell.
- **No competitor mentions** — keep the content vendor-neutral.
- **Length:** 800-1,000 words per post. Shorter is better — these readers are busy.
- **Post 1 is done** — do not rewrite it unless I specifically ask. It has been approved.

---

## Instructions for Claude

- Continue in the same conversational, expert tone we established in Post 1
- When drafting Post 2, make the five questions genuinely useful
- Do not make the questions leading towards our product; keep them objective
- Ask me before making significant changes to the agreed structure`;

const RAW_EXAMPLE_HANDOFF_TECHNICAL = `# Session 04 Continuation Prompt

**Project:** CaseHub — Internal case management dashboard for school ${siteConfig.complianceArea} teams
**Previous Session:** Session 03 (API route implementation and database schema refinement)
**Date Created:** 12/02/2026
**Repository:** \\\`/home/dev/projects/casehub\\\`

---

## Context Files to Read First

1. \\\`CLAUDE.md\\\` — Project conventions, tech stack, and key gotchas **Critical**
2. \\\`docs/architecture/overview.md\\\` — System architecture and domain model
3. \\\`.planning/continuation-prompts/session-03-continuation.md\\\` — Previous session's handoff
4. \\\`src/app/api/cases/route.ts\\\` — The cases API route (primary file being worked on)
5. \\\`src/lib/db/schema.ts\\\` — Database schema (recently modified)

---

## Cumulative Progress Summary

### Sessions 01-02: Foundation (Complete)

Project scaffolding, tech stack decisions (Next.js 15, PostgreSQL, Drizzle ORM, Tailwind CSS), database schema design, and authentication setup with Auth0.

### Session 03: API Routes and Schema Refinement (Complete)

- Implemented CRUD API routes for \\\`cases\\\` resource
- Added \\\`case_notes\\\` table to the schema with foreign key to \\\`cases\\\`
- Implemented soft delete on cases (\\\`deleted_at\\\` column, filtered by default)
- Set up Drizzle ORM migrations — 3 migrations applied successfully
- Added input validation with Zod on all API endpoints

---

## Session 04 Objectives

### Primary Objective

Implement the \\\`case_notes\\\` API routes and the case detail page UI.

### Secondary Objective (if time permits)

Begin the users sync from Auth0 — resolve the \\\`assigned_to\\\` placeholder issue.

---

## Remaining Work Tracker

| Item | Category | Status | Notes |
|------|----------|--------|-------|
| Project scaffolding | Setup | **Complete** | Session 01 |
| Auth0 authentication | Auth | **Complete** | Session 02 |
| Cases API routes (CRUD) | Backend | **Complete** | Session 03 |
| Case notes API routes (CRUD) | Backend | **In Progress** | Route files created |
| Case detail page UI | Frontend | Not Started | Session 04 primary |
| Users sync from Auth0 | Backend | Not Started | Session 04 secondary |
| Dashboard overview page | Frontend | Not Started | Session 05 |

---

## Success Criteria

This session is complete when:

- [ ] Case notes API routes are fully implemented with Zod validation and audit logging
- [ ] Case detail page displays case information and associated notes
- [ ] Users can add a new note to a case via the UI
- [ ] Users can edit an existing note via the UI
- [ ] All new code has UK English in user-facing strings and comments
- [ ] All existing tests still pass`;

/* ------------------------------------------------------------------ */
/*  File data                                                          */
/* ------------------------------------------------------------------ */

export const STARTER_KIT_FILES: StarterKitFile[] = [
  // ── Skills ────────────────────────────────────────────────────────
  {
    id: 'skill-uk-english',
    name: 'UK English',
    description:
      'Enforce UK English spelling, grammar, and conventions in all output.',
    longDescription:
      'Ensures Claude uses British English throughout — correct spellings (colour, organise, behaviour), UK date formats (DD/MM/YYYY), GBP currency (£), and British grammar conventions. Works on all platforms.',
    category: 'skill',
    tracks: ['general', 'developer'],
    priority: 'high',
    filePath: 'skills/uk-english/SKILL.md',
    isMultiFile: false,
    installInstructions: skillInstall('uk-english'),
    installCommand:
      'cp -r starter-kit/skills/uk-english .claude/skills/uk-english',
  },
  {
    id: 'skill-session-handoff',
    name: 'Session Handoff',
    description: 'Create continuation prompts for session handoffs.',
    longDescription:
      'Guides you through creating structured handoff prompts when you need to preserve context across sessions. Detects five scenario types (planned boundary, context overflow, task delegation, artifact iteration, multi-workstream) and adapts its output for both technical and non-technical users. Includes reference templates and a context awareness guide.',
    category: 'skill',
    tracks: ['general', 'developer'],
    priority: 'high',
    filePath: 'skills/session-handoff/',
    isMultiFile: true,
    installInstructions: skillInstall('session-handoff'),
    installCommand:
      'cp -r starter-kit/skills/session-handoff .claude/skills/session-handoff',
    rawContent: RAW_SESSION_HANDOFF_SKILL,
  },
  {
    id: 'skill-brand-voice',
    name: 'Brand Voice',
    description: 'Framework for documenting brand voice and style.',
    longDescription:
      'A comprehensive framework covering seven areas: brand personality, voice attributes, audience awareness, core messaging pillars, tone spectrum, style rules, and terminology. Works conversationally — Claude guides you through each section and compiles a reusable brand voice document.',
    category: 'skill',
    tracks: ['general', 'developer'],
    priority: 'medium',
    filePath: 'skills/brand-voice/SKILL.md',
    isMultiFile: false,
    installInstructions: skillInstall('brand-voice'),
    installCommand:
      'cp -r starter-kit/skills/brand-voice .claude/skills/brand-voice',
  },
  {
    id: 'skill-brand-review',
    name: 'Brand Review',
    description: 'Review content against brand guidelines.',
    longDescription:
      'Evaluates content across four dimensions: voice and tone, terminology and language, messaging pillar alignment, and style guide compliance. Works best with a brand voice document loaded. Also checks for unsubstantiated claims, missing disclaimers, and regulatory concerns. Includes UK English checks.',
    category: 'skill',
    tracks: ['general', 'developer'],
    priority: 'medium',
    filePath: 'skills/brand-review/SKILL.md',
    isMultiFile: false,
    installInstructions: skillInstall('brand-review'),
    installCommand:
      'cp -r starter-kit/skills/brand-review .claude/skills/brand-review',
  },
  {
    id: 'skill-brainstorming',
    name: 'Brainstorming',
    description: 'Structured brainstorming frameworks.',
    longDescription:
      'Provides structured brainstorming techniques and frameworks for generating ideas, exploring options, and evaluating solutions. Useful for any creative or problem-solving task.',
    category: 'skill',
    tracks: ['general', 'developer'],
    priority: 'low',
    filePath: 'skills/brainstorming/SKILL.md',
    isMultiFile: false,
    installInstructions: skillInstall('brainstorming'),
    installCommand:
      'cp -r starter-kit/skills/brainstorming .claude/skills/brainstorming',
  },
  {
    id: 'skill-writing-plans',
    name: 'Writing Plans',
    description: 'Writing plan creation.',
    longDescription:
      'Helps create structured writing plans for long-form content. Guides you through outlining, structuring arguments, and planning content flow before you start writing.',
    category: 'skill',
    tracks: ['general'],
    priority: 'low',
    filePath: 'skills/writing-plans/SKILL.md',
    isMultiFile: false,
    installInstructions: skillInstall('writing-plans'),
    installCommand:
      'cp -r starter-kit/skills/writing-plans .claude/skills/writing-plans',
  },
  {
    id: 'skill-writing-skills',
    name: 'Writing Skills',
    description: 'Writing quality improvement.',
    longDescription:
      'Enhances writing quality with techniques drawn from Anthropic best practices and persuasion principles. Includes supporting reference files for advanced writing techniques.',
    category: 'skill',
    tracks: ['general'],
    priority: 'low',
    filePath: 'skills/writing-skills/',
    isMultiFile: true,
    installInstructions: skillInstall('writing-skills'),
    installCommand:
      'cp -r starter-kit/skills/writing-skills .claude/skills/writing-skills',
  },
  {
    id: 'skill-proposal-writer',
    name: 'Proposal Writer',
    description: 'Proposal and tender writing.',
    longDescription:
      'Comprehensive proposal writing skill with 11 rule files covering formatting, executive summaries, pricing, RFP response, statement of work, strategy, and more. Designed for professional proposals and tender responses.',
    category: 'skill',
    tracks: ['general'],
    priority: 'low',
    filePath: 'skills/proposal-writer/',
    isMultiFile: true,
    installInstructions: skillInstall('proposal-writer'),
    installCommand:
      'cp -r starter-kit/skills/proposal-writer .claude/skills/proposal-writer',
  },
  {
    id: 'skill-file-organizer',
    name: 'File Organiser',
    description: 'File organisation assistance.',
    longDescription:
      'Helps organise and structure files and directories. Useful for tidying up project structures, naming conventions, and folder hierarchies.',
    category: 'skill',
    tracks: ['general', 'developer'],
    priority: 'low',
    filePath: 'skills/file-organizer/SKILL.md',
    isMultiFile: false,
    installInstructions: skillInstall('file-organizer'),
    installCommand:
      'cp -r starter-kit/skills/file-organizer .claude/skills/file-organizer',
  },
  {
    id: 'skill-markdown-converter',
    name: 'Markdown Converter',
    description: 'Content conversion to/from markdown.',
    longDescription:
      'Converts content between markdown and other formats. Useful for transforming documents, notes, and structured content.',
    category: 'skill',
    tracks: ['general', 'developer'],
    priority: 'low',
    filePath: 'skills/markdown-converter/SKILL.md',
    isMultiFile: false,
    installInstructions: skillInstall('markdown-converter'),
    installCommand:
      'cp -r starter-kit/skills/markdown-converter .claude/skills/markdown-converter',
  },
  {
    id: 'skill-mermaid-diagrams',
    name: 'Mermaid Diagrams',
    description: 'Mermaid diagram generation.',
    longDescription:
      'Generates Mermaid diagrams with six reference files covering flowcharts, sequence diagrams, class diagrams, ERD diagrams, C4 diagrams, and advanced features. Developer-leaning but accessible to anyone familiar with diagrams.',
    category: 'skill',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'skills/mermaid-diagrams/',
    isMultiFile: true,
    installInstructions: skillInstall('mermaid-diagrams'),
    installCommand:
      'cp -r starter-kit/skills/mermaid-diagrams .claude/skills/mermaid-diagrams',
  },
  {
    id: 'skill-canvas-design',
    name: 'Canvas Design',
    description: 'Canvas/image design skill with font files.',
    longDescription:
      'A specialist design skill for canvas-based image generation, bundled with a collection of fonts and their OFL licences. Best suited for users working on visual design tasks.',
    category: 'skill',
    tracks: ['general', 'developer'],
    priority: 'low',
    filePath: 'skills/canvas-design/',
    isMultiFile: true,
    installInstructions: skillInstall('canvas-design'),
    installCommand:
      'cp -r starter-kit/skills/canvas-design .claude/skills/canvas-design',
  },
  {
    id: 'skill-agent-browser',
    name: 'Agent Browser',
    description: 'Browser automation skill.',
    longDescription:
      'Comprehensive browser automation skill with five reference files (authentication, proxy support, session management, snapshot references, video recording) and three shell templates. Designed for advanced use cases requiring automated browser interaction.',
    category: 'skill',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'skills/agent-browser/',
    isMultiFile: true,
    installInstructions: skillInstall('agent-browser'),
    installCommand:
      'cp -r starter-kit/skills/agent-browser .claude/skills/agent-browser',
  },

  // ── Commands ──────────────────────────────────────────────────────
  {
    id: 'command-brand-review',
    name: 'Brand Review (Command)',
    description: 'Review content against brand guidelines via slash command.',
    longDescription:
      'The slash command version of the brand-review skill, for use in Claude Code. Invoke with /brand-review to run a structured review of content against your brand guidelines. Checks voice, terminology, messaging, style, and legal/compliance concerns.',
    category: 'command',
    tracks: ['developer'],
    priority: 'medium',
    filePath: 'commands/brand-review.md',
    isMultiFile: false,
    installInstructions: {
      claudeCode:
        'Copy the command file to your project:\ncp starter-kit/commands/brand-review.md .claude/commands/brand-review.md\n\nInvoke with: /brand-review',
    },
    installCommand:
      'cp starter-kit/commands/brand-review.md .claude/commands/brand-review.md',
  },

  // ── Templates ─────────────────────────────────────────────────────
  {
    id: 'template-governance-policy',
    name: 'Governance Policy',
    description: 'Customisable AI governance policy for UK SMBs.',
    longDescription:
      'A comprehensive governance policy template covering all AI extension types (skills, plugins, MCPs, commands, agents, hooks). Uses fill-in-the-blanks {{PLACEHOLDER}} variables for company name, industry, team size, and more. Includes approval workflows, risk assessment criteria, GDPR considerations, and a review schedule. Designed for UK organisations.',
    category: 'template',
    tracks: ['general', 'developer'],
    priority: 'medium',
    filePath: 'templates/governance-policy-template.md',
    isMultiFile: false,
    installInstructions: {
      claudeCode:
        "Copy to your project or use as a standalone document:\ncp starter-kit/templates/governance-policy-template.md ./governance-policy.md\n\nReplace all {{PLACEHOLDER}} values with your organisation's details.",
      claudeDesktop:
        "Download the file, open it in a text editor, and replace all {{PLACEHOLDER}} values with your organisation's details. Share with your team for review.",
      claudeAi:
        "Copy the template content into a new document. Replace all {{PLACEHOLDER}} values with your organisation's details.",
    },
    rawContent: RAW_GOVERNANCE_POLICY,
  },
  {
    id: 'template-claude-md',
    name: 'CLAUDE.md Template',
    description: 'Starter CLAUDE.md file for new projects.',
    longDescription:
      'A ready-to-use template for creating CLAUDE.md files — the project-level configuration file that gives Claude Code persistent context about your codebase. Covers project description, tech stack, dev commands, architecture, code style, testing, environment setup, key gotchas, and style rules. Pre-populated with a UK English rule.',
    category: 'template',
    tracks: ['developer'],
    priority: 'medium',
    filePath: 'templates/claude-md-template.md',
    isMultiFile: false,
    installInstructions: {
      claudeCode:
        'Copy to your project root as CLAUDE.md:\ncp starter-kit/templates/claude-md-template.md ./CLAUDE.md\n\nFill in the sections relevant to your project and delete the rest.',
    },
    rawContent: RAW_CLAUDE_MD_TEMPLATE,
  },
  {
    id: 'template-docs-structure',
    name: 'Docs Structure',
    description:
      'Recommended /docs directory layout for AI-readable codebases.',
    longDescription:
      'A guide describing the recommended /docs directory structure based on the progressive disclosure principle: CLAUDE.md as the map, /docs as the system of record. Covers five directories (architecture, conventions, integrations, schemas, references) with example files, maintenance guidance, and instructions for populating with the GSD codebase mapper.',
    category: 'template',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'templates/docs-structure-template.md',
    isMultiFile: false,
    installInstructions: {
      claudeCode:
        'Create the directory structure in your project:\nmkdir -p docs/{architecture,conventions,integrations,schemas,references}\n\nRefer to the template for guidance on what goes in each directory.',
    },
    rawContent: RAW_DOCS_STRUCTURE_TEMPLATE,
  },

  // ── Prompts ───────────────────────────────────────────────────────
  {
    id: 'prompt-handoff-general',
    name: 'Example Handoff (General)',
    description: 'Example session handoff for general users.',
    longDescription: `A completed example showing what a good session handoff looks like for a non-technical user. Demonstrates the simplified single-block format with a realistic scenario: a marketing team member working on blog posts about ${siteConfig.complianceArea} technology.`,
    category: 'prompt',
    tracks: ['general'],
    priority: 'low',
    filePath: 'prompts/example-handoff-general.md',
    isMultiFile: false,
    installInstructions: {
      claudeDesktop:
        'This is a reference example. Use it as a guide when creating your own session handoffs, or let the session-handoff skill generate them automatically.',
      claudeAi:
        'This is a reference example. Use it as a guide when creating your own session handoffs, or let the session-handoff skill generate them automatically.',
    },
    rawContent: RAW_EXAMPLE_HANDOFF_GENERAL,
  },
  {
    id: 'prompt-handoff-technical',
    name: 'Example Handoff (Developer)',
    description: 'Example session handoff for developers.',
    longDescription:
      'A completed example showing what a good session handoff looks like for a Claude Code user. Demonstrates the full structured format with file directives, work tracker, success criteria, and a realistic development scenario.',
    category: 'prompt',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'prompts/example-handoff-technical.md',
    isMultiFile: false,
    installInstructions: {
      claudeCode:
        'This is a reference example. Use it as a guide when creating your own session handoffs, or let the session-handoff skill generate them automatically.',
    },
    rawContent: RAW_EXAMPLE_HANDOFF_TECHNICAL,
  },
  {
    id: 'prompt-brand-voice-setup',
    name: 'Brand Voice Setup Prompt',
    description: 'Prompt to kick off brand voice documentation.',
    longDescription:
      'A ready-to-use prompt that starts the brand voice documentation process. Copy it into a new Claude conversation, fill in the bracketed sections with your company details and content examples, and Claude will guide you through all seven areas of brand voice definition.',
    category: 'prompt',
    tracks: ['general', 'developer'],
    priority: 'medium',
    filePath: 'prompts/brand-voice-setup-prompt.md',
    isMultiFile: false,
    installInstructions: {
      claudeDesktop:
        'Copy the prompt text from below and paste it into a new Claude Desktop conversation. Have your brand materials ready.',
      claudeAi:
        'Copy the prompt text from below and paste it into a new claude.ai conversation. Have your brand materials ready.',
      claudeCode:
        'Copy the prompt text and use it in a Claude Code session, or paste it into claude.ai for a more conversational experience.',
    },
    rawContent: RAW_BRAND_VOICE_SETUP_PROMPT,
  },

  // ── GSD Mapper ────────────────────────────────────────────────────
  {
    id: 'gsd-mapper',
    name: 'GSD Codebase Mapper',
    description: 'Automated codebase documentation generator.',
    longDescription:
      'A comprehensive codebase mapping toolkit that spawns four parallel agents, each analysing a different focus area (technology, architecture, quality, concerns). Generates seven documentation files covering stack, structure, architecture, conventions, integrations, testing, and concerns. Includes an orchestrator command, agent definition, workflow file, and seven document templates.',
    category: 'gsd-mapper',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'gsd-mapper/',
    isMultiFile: true,
    installInstructions: {
      claudeCode:
        'Copy all mapper files to your project:\ncp -r starter-kit/gsd-mapper/agent .claude/agents/\ncp -r starter-kit/gsd-mapper/command .claude/commands/\ncp -r starter-kit/gsd-mapper/workflow .claude/workflows/\ncp -r starter-kit/gsd-mapper/templates .claude/templates/\n\nInvoke with: /map-codebase',
    },
    installCommand:
      'cp -r starter-kit/gsd-mapper/agent .claude/agents/ && cp -r starter-kit/gsd-mapper/command .claude/commands/ && cp -r starter-kit/gsd-mapper/workflow .claude/workflows/ && cp -r starter-kit/gsd-mapper/templates .claude/templates/',
  },

  // ── Plugins ───────────────────────────────────────────────────────
  {
    id: 'plugin-claude-md-management',
    name: 'claude-md-management',
    description: 'CLAUDE.md audit and improvement.',
    longDescription:
      'Audits your existing CLAUDE.md file and suggests improvements. Includes a skill for analysis and a command for revising. High value for developers who want to optimise their project context.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'medium',
    filePath: 'plugins/claude-plugins-official/claude-md-management/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install claude-md-management',
    },
    pluginRecommendation: 'install-marketplace',
    installCommand: 'claude plugin install claude-md-management',
  },
  {
    id: 'plugin-commit-commands',
    name: 'commit-commands',
    description: 'Git workflow commands (commit, push, PR creation).',
    longDescription:
      'Provides slash commands for common git workflows: creating commits with conventional messages, pushing and creating pull requests, and cleaning up merged branches. Essential for daily development workflow.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'medium',
    filePath: 'plugins/claude-plugins-official/commit-commands/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install commit-commands',
    },
    pluginRecommendation: 'install-marketplace',
    installCommand: 'claude plugin install commit-commands',
  },
  {
    id: 'plugin-pr-review-toolkit',
    name: 'pr-review-toolkit',
    description: 'PR review with specialised agents.',
    longDescription:
      'A comprehensive PR review toolkit with six specialised agents: code reviewer, code simplifier, comment analyser, PR test analyser, silent failure hunter, and type design analyser. Provides thorough, multi-perspective code reviews.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'medium',
    filePath: 'plugins/claude-plugins-official/pr-review-toolkit/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install pr-review-toolkit',
    },
    pluginRecommendation: 'install-marketplace',
    installCommand: 'claude plugin install pr-review-toolkit',
  },
  {
    id: 'plugin-coderabbit',
    name: 'coderabbit',
    description: 'Code review integration.',
    longDescription:
      'Code review integration that provides structured code review capabilities with a dedicated agent, command, and skill.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'plugins/claude-plugins-official/coderabbit/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install coderabbit',
    },
    pluginRecommendation: 'install-marketplace',
    installCommand: 'claude plugin install coderabbit',
  },
  {
    id: 'plugin-security-guidance',
    name: 'security-guidance',
    description: 'Security reminder hook.',
    longDescription:
      'A security-focused plugin that includes a hook running a Python script to provide security reminders during development. Helps ensure security considerations are not overlooked.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'plugins/claude-plugins-official/security-guidance/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install security-guidance',
    },
    pluginRecommendation: 'install-marketplace',
    installCommand: 'claude plugin install security-guidance',
  },
  {
    id: 'plugin-code-simplifier',
    name: 'code-simplifier',
    description: 'Code simplification agent.',
    longDescription:
      'Provides a specialised agent focused on simplifying and refactoring code. Useful for reducing complexity and improving readability.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'plugins/claude-plugins-official/code-simplifier/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install code-simplifier',
    },
    pluginRecommendation: 'install-marketplace',
    installCommand: 'claude plugin install code-simplifier',
  },
  {
    id: 'plugin-context7',
    name: 'context7',
    description: 'Library documentation lookup (MCP).',
    longDescription:
      'An MCP connector that provides access to library and framework documentation. Useful for looking up API references and usage patterns without leaving Claude.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'plugins/claude-plugins-official/context7/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install context7',
    },
    pluginRecommendation: 'install-marketplace',
    installCommand: 'claude plugin install context7',
  },
  {
    id: 'plugin-github',
    name: 'github',
    description: 'GitHub integration (MCP).',
    longDescription:
      'An MCP connector for GitHub that provides access to repositories, issues, pull requests, and other GitHub resources directly within Claude.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'plugins/claude-plugins-official/github/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install github',
    },
    pluginRecommendation: 'install-marketplace',
    installCommand: 'claude plugin install github',
  },
  {
    id: 'plugin-playwright',
    name: 'playwright',
    description: 'Browser automation (MCP).',
    longDescription:
      'An MCP connector for Playwright browser automation. Enables automated browser testing and interaction within Claude sessions.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'plugins/claude-plugins-official/playwright/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install playwright',
    },
    pluginRecommendation: 'install-marketplace',
    installCommand: 'claude plugin install playwright',
  },
  {
    id: 'plugin-sentry',
    name: 'sentry',
    description: 'Error tracking integration (MCP).',
    longDescription:
      'Sentry error tracking integration with an MCP connector, commands, skills, and agent definitions. Install if your team uses Sentry for error monitoring.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'plugins/claude-plugins-official/sentry/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install sentry',
    },
    pluginRecommendation: 'install-if-needed',
    installCommand: 'claude plugin install sentry',
  },
  {
    id: 'plugin-plugin-dev',
    name: 'plugin-dev',
    description: 'Plugin development toolkit.',
    longDescription:
      'A comprehensive toolkit for building Claude plugins. Includes three agents, one command, and seven skills covering plugin structure, command development, skill development, and plugin settings. Install only if you plan to build your own plugins.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'plugins/claude-plugins-official/plugin-dev/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install plugin-dev',
    },
    pluginRecommendation: 'install-if-needed',
    installCommand: 'claude plugin install plugin-dev',
  },
  {
    id: 'plugin-example-plugin',
    name: 'example-plugin',
    description: 'Reference plugin structure.',
    longDescription:
      'A reference example showing the structure of a Claude plugin. Includes a plugin manifest, MCP configuration, command, and skill. Do not install — this is for reference only.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'plugins/claude-plugins-official/example-plugin/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'This is a reference example. Do not install.',
    },
    pluginRecommendation: 'reference-only',
  },
  {
    id: 'plugin-php-lsp',
    name: 'php-lsp',
    description: 'PHP Language Server Protocol plugin.',
    longDescription:
      'PHP Language Server Protocol plugin. Install only if your team works with PHP codebases.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'plugins/claude-plugins-official/php-lsp/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install php-lsp',
    },
    pluginRecommendation: 'install-if-needed',
    installCommand: 'claude plugin install php-lsp',
  },
  {
    id: 'plugin-asana',
    name: 'asana',
    description: 'Asana integration (MCP).',
    longDescription:
      'An MCP connector for Asana project management. Install only if your team uses Asana.',
    category: 'plugin',
    tracks: ['developer'],
    priority: 'low',
    filePath: 'plugins/claude-plugins-official/asana/',
    isMultiFile: true,
    installInstructions: {
      claudeCode: 'claude plugin install asana',
    },
    pluginRecommendation: 'install-if-needed',
    installCommand: 'claude plugin install asana',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function getFilesForCategory(
  category: StarterKitCategory,
): StarterKitFile[] {
  return STARTER_KIT_FILES.filter((f) => f.category === category);
}

export function getFilesForTrack(track: Track): StarterKitFile[] {
  return STARTER_KIT_FILES.filter((f) => f.tracks.includes(track));
}

export function getFilesForCategoryAndTrack(
  category: StarterKitCategory,
  track: Track,
): StarterKitFile[] {
  return STARTER_KIT_FILES.filter(
    (f) => f.category === category && f.tracks.includes(track),
  );
}

export function getCategoriesForTrack(track: Track): StarterKitCategory[] {
  const categories = new Set<StarterKitCategory>();
  for (const file of STARTER_KIT_FILES) {
    if (file.tracks.includes(track)) {
      categories.add(file.category);
    }
  }
  return CATEGORY_ORDER.filter((c) => categories.has(c));
}
