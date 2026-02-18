import type { Track } from '@/content/shared/types';
import type { SiteConfigData } from '@/config/client-config-schema';

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

export type StarterKitTier = 'base' | 'custom';

export type StarterKitCustomCategory =
  | 'developer-tools'
  | 'business-development'
  | 'creative-design'
  | 'integration-specific'
  | 'compliance-security';

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
  /** Whether this item is included in every client deployment (base) or selectable per client (custom). */
  tier: StarterKitTier;
  /** Category for custom-tier items. Only present when tier is 'custom'. */
  customCategory?: StarterKitCustomCategory;
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

function getRawGovernancePolicy(complianceArea: string) {
  const complianceAreaCapitalised =
    complianceArea.charAt(0).toUpperCase() + complianceArea.slice(1);
  return `# AI Tool Governance Policy

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

- [ ] **${complianceAreaCapitalised} data:** If working with ${complianceArea}-related data, ensure no personal data relating to vulnerable individuals is processed through AI extensions without explicit authorisation and appropriate safeguards
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
}

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

const RAW_SKILL_UK_ENGLISH = `---
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
- Example: write \\\`// Initialise the colour palette\\\` but keep \\\`const color = getColor()\\\``;

const RAW_SKILL_BRAND_VOICE = `---
name: brand-voice
description: Apply and enforce brand voice, style guide, and messaging pillars across content. Use when reviewing content for brand consistency, documenting a brand voice, adapting tone for different audiences, or checking terminology and style guide compliance.
---

# Brand Voice Skill

Frameworks for documenting, applying, and enforcing brand voice and style guidelines across marketing content.

## Brand Voice Documentation Framework

A complete brand voice document should cover these areas:

### 1. Brand Personality
Define the brand as if it were a person. What are its defining traits?

### 2. Voice Attributes
Select 3-5 attributes that define how the brand communicates. Each attribute should be defined with:
- What it means in practice
- What it does NOT mean
- An example demonstrating the attribute

### 3. Audience Awareness
- Who the brand is speaking to
- What the audience cares about
- What level of expertise the audience has

### 4. Core Messaging Pillars
- 3-5 key themes the brand consistently communicates
- The hierarchy of these messages

### 5. Tone Spectrum
How the voice adapts across contexts while remaining recognisably the same brand.

### 6. Style Rules
Specific grammar, formatting, and language rules.

### 7. Terminology
Preferred and avoided terms.

## Voice Attributes

### Common Voice Attribute Pairs

| Spectrum | One End | Other End |
|----------|---------|-----------|
| Formality | Formal, institutional | Casual, conversational |
| Authority | Expert, authoritative | Peer-level, collaborative |
| Emotion | Warm, empathetic | Direct, matter-of-fact |
| Complexity | Technical, precise | Simple, accessible |
| Energy | Bold, energetic | Calm, measured |
| Humor | Playful, witty | Serious, earnest |

## Tone Adaptation Across Channels

| Channel | Tone Adaptation |
|---------|----------------|
| Blog | Informative, conversational, educational |
| Social media (LinkedIn) | Professional, thought-provoking, concise |
| Email marketing | Personal, helpful, action-oriented |
| Sales collateral | Confident, benefit-driven, specific |
| Support/Help docs | Clear, patient, step-by-step |
| Error messages | Empathetic, helpful, blame-free |

## Style Guide Enforcement

Document and enforce grammar, formatting, and language choices consistently — including Oxford comma usage, sentence vs. title case, contractions, number formatting, and date/time formats.

## Terminology Management

Maintain preferred terms, product names, inclusive language guidelines, and industry jargon management.`;

const RAW_SKILL_BRAND_REVIEW = `---
name: brand-review
description: >
  Review content against brand voice, style guidelines, and messaging standards.
  WHEN the user asks to review, check, or audit content against brand guidelines,
  or wants feedback on whether content matches their brand voice.
  WHEN NOT the user is creating new content (use brand-voice skill instead).
---

# Brand Review

Review marketing content against brand voice, style guidelines, and messaging standards. Flag deviations and provide specific improvement suggestions.

## Inputs

1. **Content to review** — pasted text, file path, URL, or multiple pieces for batch review
2. **Brand guidelines source** — auto-detected from project, or user provides them

## Review Process

### With Brand Guidelines Configured

Evaluate against:
- **Voice and Tone** — Does content match defined brand voice attributes?
- **Terminology and Language** — Are preferred brand terms used correctly?
- **Messaging Pillars** — Does content align with defined messaging pillars?
- **Style Guide Compliance** — Grammar, punctuation, UK English, formatting

### Without Brand Guidelines (Generic Review)

Evaluate for clarity, consistency, and professionalism.

### Legal and Compliance Flags (Always Checked)

- Unsubstantiated claims (superlatives without evidence)
- Missing disclaimers
- Comparative claims that could be challenged
- Regulatory language needing compliance review
- Copyright concerns

## Output Format

### Summary
Overall assessment with strengths and key improvements.

### Detailed Findings

| Issue | Location | Severity | Suggestion |
|-------|----------|----------|------------|

Severity: **High** (contradicts brand voice / compliance risk), **Medium** (inconsistent), **Low** (minor style issue)

### Revised Sections
Before/after for top 3-5 highest-severity issues.`;

const RAW_SKILL_BRAINSTORMING = `---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

Start by understanding the current project context, then ask questions one at a time to refine the idea. Once you understand what you're building, present the design in small sections (200-300 words), checking after each section whether it looks right so far.

## The Process

**Understanding the idea:**
- Check out the current project state first
- Ask questions one at a time to refine the idea
- Prefer multiple choice questions when possible
- Only one question per message
- Focus on understanding: purpose, constraints, success criteria

**Exploring approaches:**
- Propose 2-3 different approaches with trade-offs
- Lead with your recommended option and explain why

**Presenting the design:**
- Present the design in sections of 200-300 words
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing

## Key Principles

- **One question at a time** — Don't overwhelm with multiple questions
- **Multiple choice preferred** — Easier to answer than open-ended when possible
- **YAGNI ruthlessly** — Remove unnecessary features from all designs
- **Explore alternatives** — Always propose 2-3 approaches before settling
- **Incremental validation** — Present design in sections, validate each
- **Be flexible** — Go back and clarify when something doesn't make sense`;

const RAW_SKILL_WRITING_PLANS = `---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for your codebase. Document everything they need to know: which files to touch, code, testing, docs, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

## Bite-Sized Task Granularity

Each step is one action (2-5 minutes):
- "Write the failing test" — step
- "Run it to make sure it fails" — step
- "Implement the minimal code to make the test pass" — step
- "Run the tests and make sure they pass" — step
- "Commit" — step

## Task Structure

Each task includes:
- **Files:** Create, Modify, Test paths
- **Step 1:** Write the failing test (with code)
- **Step 2:** Run test to verify it fails (with command and expected output)
- **Step 3:** Write minimal implementation (with code)
- **Step 4:** Run test to verify it passes
- **Step 5:** Commit (with exact git commands)

## Remember
- Exact file paths always
- Complete code in plan (not "add validation")
- Exact commands with expected output
- DRY, YAGNI, TDD, frequent commits`;

const RAW_SKILL_WRITING_SKILLS = `---
name: writing-skills
description: Use when creating new skills, editing existing skills, or verifying skills work before deployment
---

# Writing Skills

## Overview

Writing skills IS Test-Driven Development applied to process documentation. You write test cases (pressure scenarios with subagents), watch them fail (baseline behaviour), write the skill (documentation), watch tests pass (agents comply), and refactor (close loopholes).

## What is a Skill?

A **skill** is a reference guide for proven techniques, patterns, or tools. Skills help future Claude instances find and apply effective approaches.

**Skills are:** Reusable techniques, patterns, tools, reference guides
**Skills are NOT:** Narratives about how you solved a problem once

## When to Create a Skill

**Create when:**
- Technique wasn't intuitively obvious
- You'd reference this again across projects
- Pattern applies broadly (not project-specific)
- Others would benefit

## Skill Types

- **Technique** — Concrete method with steps to follow
- **Pattern** — Way of thinking about problems
- **Reference** — API docs, syntax guides, tool documentation

## SKILL.md Structure

Frontmatter (YAML): name and description fields only. Description starts with "Use when..." and describes triggering conditions, not what the skill does.

Key sections: Overview, When to Use, Core Pattern, Quick Reference, Implementation, Common Mistakes.

## RED-GREEN-REFACTOR for Skills

1. **RED:** Run pressure scenario WITHOUT the skill — document baseline behaviour
2. **GREEN:** Write minimal skill addressing those specific failures — verify compliance
3. **REFACTOR:** Close loopholes — add explicit counters for new rationalisations`;

const RAW_SKILL_PROPOSAL_WRITER = `---
name: proposal-writer
description: Expert sales proposal and pricing presentation strategist. Use when writing proposals, executive summaries, ROI business cases, pricing presentations, SOWs, RFP responses, or competitive positioning documents.
---

# Proposal Writer

Strategic expertise for crafting winning sales proposals, pricing presentations, and RFP responses.

## Philosophy

Great proposals don't describe your product. They describe your buyer's **future success**.

1. **Lead with outcomes, not features**
2. **Make the decision easy** — Remove friction, objections, and confusion
3. **Tell a story** — Context → Challenge → Solution → Success
4. **Respect the reader's time** — Every section earns its place

## The CLOSE Framework

Every proposal section should CLOSE:
- **C**ontext — Where the buyer is today
- **L**oss — What it's costing them (pain)
- **O**utcome — The desired future state
- **S**olution — How you get them there
- **E**vidence — Proof it works

## Proposal Types

| Type | Purpose | Length |
|------|---------|--------|
| One-Pager | Early qualification | 1 page |
| Solution Brief | Mid-funnel engagement | 3-5 pages |
| Full Proposal | Final presentation | 8-15 pages |
| RFP Response | Formal bid | Variable |
| SOW | Contract scope | 3-10 pages |

## Anti-Patterns

- Feature dumping — List everything vs. what they need
- One-size-fits-all — Templates without customisation
- Price-first — Showing cost before establishing value
- Missing next steps — No clear action at the end
- Over-promising — Timelines and outcomes you can't deliver

Detailed guidelines in rules/ files: structure, executive summaries, pricing, SOW, RFP, design, strategy.`;

const RAW_SKILL_FILE_ORGANIZER = `---
name: file-organizer
description: Intelligently organises your files and folders by understanding context, finding duplicates, suggesting better structures, and automating cleanup tasks.
---

# File Organiser

Your personal organisation assistant for maintaining a clean, logical file structure.

## When to Use

- Downloads folder is a chaotic mess
- Can't find files — scattered everywhere
- Duplicate files taking up space
- Folder structure doesn't make sense anymore
- Starting a new project and need good structure
- Cleaning up before archiving old projects

## Process

1. **Understand the scope** — Which directory? What's the main problem? Any files to avoid?
2. **Analyse current state** — File types, sizes, date ranges, organisation issues
3. **Identify patterns** — Group by type, purpose, or date
4. **Find duplicates** — Exact duplicates by hash, same-name files, similar-sized files
5. **Propose organisation plan** — Present clear plan before making changes
6. **Execute** — After approval, organise systematically with logging
7. **Summary and maintenance tips** — What changed, new structure, upkeep advice

## Best Practices

### Folder Naming
- Clear, descriptive names
- Avoid spaces (use hyphens or underscores)
- Use prefixes for ordering: "01-current", "02-archive"

### File Naming
- Include dates: "2024-10-17-meeting-notes.md"
- Be descriptive: "q3-financial-report.xlsx"
- Avoid version numbers in names (use version control instead)

### When to Archive
- Projects not touched in 6+ months
- Completed work that might be referenced later
- Files you're hesitant to delete (archive first)`;

const RAW_SKILL_MARKDOWN_CONVERTER = `---
name: markdown-converter
description: Convert documents and files to Markdown using markitdown. Use when converting PDF, Word, PowerPoint, Excel, HTML, CSV, JSON, XML, images, audio, ZIP archives, YouTube URLs, or EPubs to Markdown format.
---

# Markdown Converter

Convert files to Markdown using \\\`uvx markitdown\\\` — no installation required.

## Basic Usage

\\\`\\\`\\\`bash
# Convert to stdout
uvx markitdown input.pdf

# Save to file
uvx markitdown input.pdf -o output.md
uvx markitdown input.docx > output.md

# From stdin
cat input.pdf | uvx markitdown
\\\`\\\`\\\`

## Supported Formats

- **Documents**: PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx, .xls)
- **Web/Data**: HTML, CSV, JSON, XML
- **Media**: Images (EXIF + OCR), Audio (EXIF + transcription)
- **Other**: ZIP (iterates contents), YouTube URLs, EPub

## Options

\\\`\\\`\\\`bash
-o OUTPUT      # Output file
-x EXTENSION   # Hint file extension (for stdin)
-d             # Use Azure Document Intelligence
--use-plugins  # Enable 3rd-party plugins
\\\`\\\`\\\`

## Notes

- Output preserves document structure: headings, tables, lists, links
- First run caches dependencies; subsequent runs are faster
- For complex PDFs with poor extraction, use \\\`-d\\\` with Azure Document Intelligence`;

const RAW_SKILL_MERMAID_DIAGRAMS = `---
name: mermaid-diagrams
description: Comprehensive guide for creating software diagrams using Mermaid syntax. Use when users need to create, visualise, or document software through diagrams including class, sequence, flowcharts, ERD, C4 architecture, state diagrams, and more.
---

# Mermaid Diagramming

Create professional software diagrams using Mermaid's text-based syntax.

## Diagram Type Selection Guide

1. **Class Diagrams** — Domain modelling, OOP design, entity relationships
2. **Sequence Diagrams** — Temporal interactions, API flows, message flows
3. **Flowcharts** — Processes, algorithms, decision trees
4. **ERD** — Database schemas, table relationships
5. **C4 Diagrams** — Software architecture at multiple levels
6. **State Diagrams** — State machines, lifecycle states
7. **Gantt Charts** — Project timelines, scheduling

## Quick Start Examples

Class Diagram, Sequence Diagram, Flowchart, and ERD examples with full Mermaid syntax are included.

## Best Practices

1. **Start Simple** — Begin with core entities, add details incrementally
2. **Use Meaningful Names** — Clear labels make diagrams self-documenting
3. **Keep Focused** — One diagram per concept
4. **Version Control** — Store .mmd files alongside code
5. **Iterate** — Refine diagrams as understanding evolves

## Configuration

Configure with frontmatter: themes (default, forest, dark, neutral, base), layout options (dagre, elk), and look options (classic, handDrawn).

## Detailed References

See references/ directory for in-depth guidance on class diagrams, sequence diagrams, flowcharts, ERD diagrams, C4 diagrams, and advanced features.`;

const RAW_SKILL_CANVAS_DESIGN = `---
name: canvas-design
description: Create beautiful visual art in .png and .pdf documents using design philosophy. Use when the user asks to create a poster, piece of art, design, or other static piece.
---

# Canvas Design

Create original visual designs by first creating a design philosophy, then expressing it on canvas.

## Process

### 1. Design Philosophy Creation (.md file)

Create a VISUAL PHILOSOPHY that will be interpreted through form, space, colour, composition, images, graphics, shapes, and patterns.

**Name the movement** (1-2 words): e.g. "Brutalist Joy", "Chromatic Silence"

**Articulate the philosophy** (4-6 paragraphs) covering:
- Space and form
- Colour and material
- Scale and rhythm
- Composition and balance
- Visual hierarchy

### 2. Canvas Creation (.pdf or .png file)

Express the philosophy visually on canvas:
- Use the design philosophy as foundation
- Create museum or magazine quality work
- Treat as art, not something cartoony
- Use repeating patterns and perfect shapes
- Anchor with simple phrase(s) positioned subtly
- Limited colour palette, intentional and cohesive
- Text is always minimal and visual-first
- Use different fonts from the canvas-fonts directory
- Double-check spacing, alignment, and formatting

## Essential Principles

- **VISUAL PHILOSOPHY** — Create an aesthetic worldview expressed through design
- **MINIMAL TEXT** — Text is sparse, essential-only, integrated as visual element
- **SPATIAL EXPRESSION** — Ideas communicate through space, form, colour, composition
- **PURE DESIGN** — Making ART OBJECTS, not documents with decoration
- **EXPERT CRAFTSMANSHIP** — Final work must look meticulously crafted`;

const RAW_SKILL_AGENT_BROWSER = `---
name: agent-browser
description: Automates browser interactions for web testing, form filling, screenshots, and data extraction. Use when the user needs to navigate websites, interact with web pages, fill forms, take screenshots, test web applications, or extract information from web pages.
---

# Browser Automation with agent-browser

## Quick Start

\\\`\\\`\\\`bash
agent-browser open <url>        # Navigate to page
agent-browser snapshot -i       # Get interactive elements with refs
agent-browser click @e1         # Click element by ref
agent-browser fill @e2 "text"   # Fill input by ref
agent-browser close             # Close browser
\\\`\\\`\\\`

## Core Workflow

1. Navigate: \\\`agent-browser open <url>\\\`
2. Snapshot: \\\`agent-browser snapshot -i\\\` (returns elements with refs like @e1, @e2)
3. Interact using refs from the snapshot
4. Re-snapshot after navigation or significant DOM changes

## Key Commands

### Navigation
\\\`open <url>\\\`, \\\`back\\\`, \\\`forward\\\`, \\\`reload\\\`, \\\`close\\\`

### Snapshot (Page Analysis)
\\\`snapshot\\\` — Full tree | \\\`snapshot -i\\\` — Interactive only | \\\`snapshot -c\\\` — Compact

### Interactions
\\\`click @ref\\\`, \\\`fill @ref "text"\\\`, \\\`type @ref "text"\\\`, \\\`press Enter\\\`, \\\`hover @ref\\\`, \\\`check @ref\\\`, \\\`select @ref "value"\\\`, \\\`scroll down 500\\\`, \\\`upload @ref file.pdf\\\`

### Get Information
\\\`get text @ref\\\`, \\\`get html @ref\\\`, \\\`get value @ref\\\`, \\\`get attr @ref href\\\`, \\\`get title\\\`, \\\`get url\\\`

### Screenshots & Recording
\\\`screenshot\\\`, \\\`screenshot --full\\\`, \\\`pdf output.pdf\\\`, \\\`record start demo.webm\\\`, \\\`record stop\\\`

### Wait
\\\`wait @ref\\\`, \\\`wait 2000\\\`, \\\`wait --text "Success"\\\`, \\\`wait --url "**/dashboard"\\\`

## Deep-Dive Documentation

See references/ directory for snapshot refs, session management, authentication, video recording, and proxy support.`;

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

function getRawExampleHandoffGeneral(complianceArea: string) {
  const complianceAreaCapitalised =
    complianceArea.charAt(0).toUpperCase() + complianceArea.slice(1);
  return `# Example: General User Session Handoff

The following is an example of a completed session handoff for a non-technical user. It demonstrates the simplified format — a single text block that can be copied and pasted into a new conversation.

---

**How to Use This:** Paste everything below into a new conversation to continue where you left off.

---

## What We Were Working On

I am working on a series of three blog posts about how technology is improving ${complianceArea} in the education sector. These are for our company blog and will also be shared on LinkedIn. The target audience is school administrators and ${complianceArea} leads — they are knowledgeable about ${complianceArea} but not particularly technical.

**Project:** Blog series — 'Technology and ${complianceAreaCapitalised} in Education'
**Started:** 10/02/2026
**Goal:** Three publish-ready blog posts of approximately 800-1,000 words each, with consistent tone and messaging.

---

## What Was Accomplished

- Outlined all three posts and agreed on the structure:
  1. 'Why Digital ${complianceAreaCapitalised} Matters More Than Ever' (awareness/problem)
  2. 'Five Questions to Ask When Choosing a ${complianceAreaCapitalised} Platform' (evaluation guide)
  3. 'Building a Culture of Digital Safety in Your School' (practical implementation)
- Completed a full draft of Post 1 ('Why Digital ${complianceAreaCapitalised} Matters More Than Ever')
- Reviewed the draft against our brand voice guidelines — made adjustments to tone (was too formal in places, needed to be more approachable)
- Agreed on key messaging: lead with the human impact, support with data, avoid fear-mongering
- Decided not to mention specific competitor products by name
- Identified three statistics from DfE reports to include across the series

---

## What Needs to Happen Next

- Write the first draft of Post 2 ('Five Questions to Ask When Choosing a ${complianceAreaCapitalised} Platform')
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
}

function getRawExampleHandoffTechnical(complianceArea: string) {
  return `# Session 04 Continuation Prompt

**Project:** CaseHub — Internal case management dashboard for school ${complianceArea} teams
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
}

/* ------------------------------------------------------------------ */
/*  File data                                                          */
/* ------------------------------------------------------------------ */

/** Build starter kit files with client-specific content from config. */
export function getStarterKitFiles(config: SiteConfigData): StarterKitFile[] {
  const complianceArea = config.complianceArea ?? 'compliance';

  return [
    // ── Skills ────────────────────────────────────────────────────────
    {
      id: 'skill-uk-english',
      name: 'UK English',
      description:
        'Enforces UK spelling, grammar, dates, and currency — Use on every project to keep output consistently British.',
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
      rawContent: RAW_SKILL_UK_ENGLISH,
      tier: 'base',
    },
    {
      id: 'skill-session-handoff',
      name: 'Session Handoff',
      description:
        'Preserves context across sessions — Use before ending a conversation you will need to continue later.',
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
      tier: 'base',
    },
    {
      id: 'skill-brand-voice',
      name: 'Brand Voice',
      description:
        'Documents your brand personality, tone, and style rules — Use to create a reusable voice guide for consistent content.',
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
      rawContent: RAW_SKILL_BRAND_VOICE,
      tier: 'base',
    },
    {
      id: 'skill-brand-review',
      name: 'Brand Review',
      description:
        'Audits content for voice, terminology, and style compliance — Use to check drafts against your brand guidelines.',
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
      rawContent: RAW_SKILL_BRAND_REVIEW,
      tier: 'base',
    },
    {
      id: 'skill-brainstorming',
      name: 'Brainstorming',
      description:
        'Turns ideas into designs through guided dialogue — Use when starting any creative or problem-solving task.',
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
      rawContent: RAW_SKILL_BRAINSTORMING,
      tier: 'base',
    },
    {
      id: 'skill-writing-plans',
      name: 'Writing Plans',
      description:
        'Creates step-by-step implementation plans with TDD — Use before starting a multi-step feature to avoid rework.',
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
      rawContent: RAW_SKILL_WRITING_PLANS,
      tier: 'custom',
      customCategory: 'business-development',
    },
    {
      id: 'skill-writing-skills',
      name: 'Writing Skills',
      description:
        'Creates and tests skill files using TDD — Use when building new skills or verifying existing ones work correctly.',
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
      rawContent: RAW_SKILL_WRITING_SKILLS,
      tier: 'custom',
      customCategory: 'business-development',
    },
    {
      id: 'skill-proposal-writer',
      name: 'Proposal Writer',
      description:
        'Crafts outcome-focused proposals and tender responses — Use when writing bids, SOWs, or pricing presentations.',
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
      rawContent: RAW_SKILL_PROPOSAL_WRITER,
      tier: 'custom',
      customCategory: 'business-development',
    },
    {
      id: 'skill-file-organizer',
      name: 'File Organiser',
      description:
        'Analyses and reorganises messy directories — Use when files are scattered, duplicated, or poorly structured.',
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
      rawContent: RAW_SKILL_FILE_ORGANIZER,
      tier: 'base',
    },
    {
      id: 'skill-markdown-converter',
      name: 'Markdown Converter',
      description:
        'Converts PDFs, Word docs, and other files to markdown — Use when you need AI-readable versions of existing documents.',
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
      rawContent: RAW_SKILL_MARKDOWN_CONVERTER,
      tier: 'base',
    },
    {
      id: 'skill-mermaid-diagrams',
      name: 'Mermaid Diagrams',
      description:
        'Generates flowcharts, sequence diagrams, and ERDs in Mermaid syntax — Use to visualise architecture or data flows.',
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
      rawContent: RAW_SKILL_MERMAID_DIAGRAMS,
      tier: 'custom',
      customCategory: 'developer-tools',
    },
    {
      id: 'skill-canvas-design',
      name: 'Canvas Design',
      description:
        'Creates original visual designs from a design philosophy — Use for posters, artwork, or branded visual assets.',
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
      rawContent: RAW_SKILL_CANVAS_DESIGN,
      tier: 'custom',
      customCategory: 'creative-design',
    },
    {
      id: 'skill-agent-browser',
      name: 'Agent Browser',
      description:
        'Automates browser navigation, form filling, and screenshots — Use for web testing or data extraction tasks.',
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
      rawContent: RAW_SKILL_AGENT_BROWSER,
      tier: 'custom',
      customCategory: 'developer-tools',
    },

    // ── Commands ──────────────────────────────────────────────────────
    {
      id: 'command-brand-review',
      name: 'Brand Review (Command)',
      description:
        'Runs a structured brand audit via /brand-review — Use in Claude Code to check content against your style guide.',
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
      tier: 'base',
    },

    // ── Templates ─────────────────────────────────────────────────────
    {
      id: 'template-governance-policy',
      name: 'Governance Policy',
      description:
        'Fill-in-the-blanks AI governance policy with GDPR coverage — Use to establish approval workflows and review schedules.',
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
      rawContent: getRawGovernancePolicy(complianceArea),
      tier: 'base',
    },
    {
      id: 'template-claude-md',
      name: 'CLAUDE.md Template',
      description:
        'Ready-to-use CLAUDE.md with all key sections — Use when setting up Claude Code on a new project.',
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
      tier: 'base',
    },
    {
      id: 'template-docs-structure',
      name: 'Docs Structure',
      description:
        'Recommended /docs directory layout — Use to structure project documentation so Claude can navigate it effectively.',
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
      tier: 'base',
    },

    // ── Prompts ───────────────────────────────────────────────────────
    {
      id: 'prompt-handoff-general',
      name: 'Example Handoff (General)',
      description:
        'Worked example of a non-technical handoff — Use as a reference when creating your own session continuations.',
      longDescription: `A completed example showing what a good session handoff looks like for a non-technical user. Demonstrates the simplified single-block format with a realistic scenario: a marketing team member working on blog posts about ${complianceArea} technology.`,
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
      rawContent: getRawExampleHandoffGeneral(complianceArea),
      tier: 'base',
    },
    {
      id: 'prompt-handoff-technical',
      name: 'Example Handoff (Developer)',
      description:
        'Worked example of a Claude Code handoff with file directives — Use as a reference for structured technical continuations.',
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
      rawContent: getRawExampleHandoffTechnical(complianceArea),
      tier: 'base',
    },
    {
      id: 'prompt-brand-voice-setup',
      name: 'Brand Voice Setup Prompt',
      description:
        'Copy-paste prompt that guides you through brand voice creation — Use to start a structured voice documentation session.',
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
      tier: 'base',
    },

    // ── GSD Mapper ────────────────────────────────────────────────────
    {
      id: 'gsd-mapper',
      name: 'GSD Codebase Mapper',
      description:
        'Spawns parallel agents to map your codebase into docs — Use to auto-generate project documentation from source code.',
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
      tier: 'custom',
      customCategory: 'developer-tools',
    },

    // ── Plugins ───────────────────────────────────────────────────────
    {
      id: 'plugin-claude-md-management',
      name: 'claude-md-management',
      description:
        'Audits and improves your CLAUDE.md file — Use to optimise project context for better Claude Code results.',
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
      tier: 'custom',
      customCategory: 'developer-tools',
    },
    {
      id: 'plugin-commit-commands',
      name: 'commit-commands',
      description:
        'Automates git commits with conventional messages — Use after completing a unit of work to streamline your workflow.',
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
      tier: 'custom',
      customCategory: 'developer-tools',
    },
    {
      id: 'plugin-pr-review-toolkit',
      name: 'pr-review-toolkit',
      description:
        'Reviews PRs with six specialised agents — Use for thorough, multi-perspective code reviews before merging.',
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
      tier: 'custom',
      customCategory: 'developer-tools',
    },
    {
      id: 'plugin-coderabbit',
      name: 'coderabbit',
      description:
        'Structured code review via CodeRabbit — Use as an alternative review tool alongside your existing workflow.',
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
      tier: 'custom',
      customCategory: 'integration-specific',
    },
    {
      id: 'plugin-security-guidance',
      name: 'security-guidance',
      description:
        'Triggers security reminders during development — Use to catch common security oversights before they reach production.',
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
      tier: 'custom',
      customCategory: 'compliance-security',
    },
    {
      id: 'plugin-code-simplifier',
      name: 'code-simplifier',
      description:
        'Simplifies and refactors complex code — Use to reduce complexity and improve readability in existing code.',
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
      tier: 'custom',
      customCategory: 'developer-tools',
    },
    {
      id: 'plugin-context7',
      name: 'context7',
      description:
        'Looks up library and framework docs in-session — Use to check API references without leaving Claude Code.',
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
      tier: 'custom',
      customCategory: 'developer-tools',
    },
    {
      id: 'plugin-github',
      name: 'github',
      description:
        'Connects Claude to GitHub repos, issues, and PRs — Use to manage GitHub workflows without switching tools.',
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
      tier: 'custom',
      customCategory: 'developer-tools',
    },
    {
      id: 'plugin-playwright',
      name: 'playwright',
      description:
        'Enables Playwright browser automation in Claude — Use for automated testing and web page interaction.',
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
      tier: 'custom',
      customCategory: 'developer-tools',
    },
    {
      id: 'plugin-sentry',
      name: 'sentry',
      description:
        'Connects Claude to Sentry error tracking — Use if your team monitors production errors with Sentry.',
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
      tier: 'custom',
      customCategory: 'integration-specific',
    },
    {
      id: 'plugin-plugin-dev',
      name: 'plugin-dev',
      description:
        'Toolkit for building your own Claude plugins — Use only if you plan to create and publish custom plugins.',
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
      tier: 'custom',
      customCategory: 'developer-tools',
    },
    {
      id: 'plugin-example-plugin',
      name: 'example-plugin',
      description:
        'Shows the anatomy of a Claude plugin — Use as a reference when learning how plugins are structured.',
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
      tier: 'custom',
      customCategory: 'developer-tools',
    },
    {
      id: 'plugin-php-lsp',
      name: 'php-lsp',
      description:
        'Adds PHP language intelligence to Claude Code — Use only if your team works with PHP codebases.',
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
      tier: 'custom',
      customCategory: 'integration-specific',
    },
    {
      id: 'plugin-asana',
      name: 'asana',
      description:
        'Connects Claude to Asana project management — Use if your team manages tasks and projects in Asana.',
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
      tier: 'custom',
      customCategory: 'integration-specific',
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function getFilesForCategory(
  files: StarterKitFile[],
  category: StarterKitCategory,
): StarterKitFile[] {
  return files.filter((f) => f.category === category);
}

export function getFilesForTrack(
  files: StarterKitFile[],
  track: Track,
): StarterKitFile[] {
  return files.filter((f) => f.tracks.includes(track));
}

export function getFilesForCategoryAndTrack(
  files: StarterKitFile[],
  category: StarterKitCategory,
  track: Track,
): StarterKitFile[] {
  return files.filter(
    (f) => f.category === category && f.tracks.includes(track),
  );
}

/** Filter starter kit files by tier and enabled custom categories. */
export function filterFilesByTier(
  files: StarterKitFile[],
  enabledCustomCategories?: string[],
): { baseFiles: StarterKitFile[]; customFiles: StarterKitFile[] } {
  const baseFiles = files.filter((f) => f.tier === 'base');
  const customFiles = files.filter(
    (f) =>
      f.tier === 'custom' &&
      f.customCategory != null &&
      (enabledCustomCategories ?? []).includes(f.customCategory),
  );
  return { baseFiles, customFiles };
}

/** Get files for a category and track, split by tier. */
export function getFilteredFilesForCategoryAndTrack(
  files: StarterKitFile[],
  category: StarterKitCategory,
  track: Track,
  enabledCustomCategories?: string[],
): { baseFiles: StarterKitFile[]; customFiles: StarterKitFile[] } {
  const categoryFiles = getFilesForCategoryAndTrack(files, category, track);
  return filterFilesByTier(categoryFiles, enabledCustomCategories);
}

export function getCategoriesForTrack(
  files: StarterKitFile[],
  track: Track,
): StarterKitCategory[] {
  const categories = new Set<StarterKitCategory>();
  for (const file of files) {
    if (file.tracks.includes(track)) {
      categories.add(file.category);
    }
  }
  return CATEGORY_ORDER.filter((c) => categories.has(c));
}
