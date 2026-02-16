<!--
  AI Governance Policy Template
  What: Parameterised governance policy for AI tool extensions (skills, plugins,
        MCPs, commands). Designed for UK SMBs.
  Usage: Replace all {{PLACEHOLDER}} values with your organisation's details.
  Prerequisites: None. This is a standalone document.
  Note: This template uses UK English and references UK regulatory context
        (GDPR, ICO). Adapt regulatory references if used outside the UK.
-->

# AI Tool Governance Policy

**Organisation:** {{COMPANY_NAME}} **Industry:** {{INDUSTRY}} **Team Size:**
{{TEAM_SIZE}} **Effective Date:** {{EFFECTIVE_DATE}} **Last Reviewed:**
{{LAST_REVIEWED}} **Policy Owner:** {{ADMIN_CONTACT}} **Review Frequency:**
{{REVIEW_FREQUENCY}}

---

## 1. Purpose and Scope

### 1.1 Purpose

This policy establishes guidelines for the responsible evaluation, approval,
installation, and maintenance of AI tool extensions used by {{COMPANY_NAME}}. It
ensures that all AI capabilities are adopted with appropriate oversight, data
protection, and operational awareness.

### 1.2 Scope

This policy applies to:

- All staff and contractors at {{COMPANY_NAME}} who use Claude or other AI tools
- All extension types: skills, plugins, MCP/connector integrations, commands,
  agents, and hooks
- All platforms: Claude Code, claude.ai, Claude Desktop, and CoWork
- Both organisation-provisioned and individually installed extensions

### 1.3 Why This Policy Exists

AI tool extensions can access data, execute code, connect to external services,
and modify workflows. Whilst these capabilities are valuable, they require
thoughtful governance to:

- Protect client data and confidential information
- Comply with GDPR and UK data protection requirements
- Maintain operational security and reliability
- Ensure consistency across the team
- Provide audit trails for regulatory purposes

---

## 2. Definitions

| Term                  | Definition                                                                                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Skill**             | A markdown file (SKILL.md) that gives Claude specialised knowledge or behaviour for a specific task. Skills work on all Claude platforms.                         |
| **Plugin**            | A packaged collection of skills, commands, agents, and/or hooks distributed via the Claude marketplace. Plugins receive automatic updates.                        |
| **MCP/Connector**     | A Model Context Protocol integration that connects Claude to external services (e.g., GitHub, Asana, Sentry). MCPs can read and write data in connected services. |
| **Command**           | A slash-invocable instruction file for Claude Code. Commands define specific workflows or processes.                                                              |
| **Agent**             | A subagent definition file that creates a specialised Claude instance for a focused task (e.g., code review, documentation generation).                           |
| **Hook**              | A script that runs automatically at specific lifecycle events (e.g., before compaction, after a commit). Hooks execute code on the user's machine.                |
| **Admin-provisioned** | Extensions deployed organisation-wide by a Teams administrator, automatically available to all users.                                                             |

---

## 3. Approved Extension Types

| Extension Type                      | Risk Level  | Approval Required       | Maintenance Owner             | Auto-Update |
| ----------------------------------- | ----------- | ----------------------- | ----------------------------- | ----------- |
| Official marketplace plugin         | Low         | Team lead               | Plugin maintainer (automatic) | Yes         |
| Third-party marketplace plugin      | Medium      | {{ADMIN_CONTACT}}       | Plugin maintainer (automatic) | Yes         |
| Internally developed skill          | Low         | Peer review             | Author + team                 | No (manual) |
| Third-party skill (e.g., skills.sh) | Medium      | {{ADMIN_CONTACT}}       | Installer + team              | No (manual) |
| MCP/Connector integration           | Medium-High | {{ADMIN_CONTACT}}       | {{ADMIN_CONTACT}}             | Varies      |
| Command file                        | Low         | Peer review (Code-only) | Author + team                 | No (manual) |
| Agent file                          | Low         | Peer review (Code-only) | Author + team                 | No (manual) |
| Hook                                | High        | {{ADMIN_CONTACT}}       | Author + {{ADMIN_CONTACT}}    | No (manual) |

---

## 4. Approval Workflows

### 4.1 Official Marketplace Plugins

**Risk level:** Low **Process:**

1. Developer or team member identifies a useful plugin in the Claude marketplace
2. Reviews the plugin description, permissions, and data access
3. Requests approval from their team lead
4. Team lead reviews and approves or escalates to {{ADMIN_CONTACT}}
5. Installer runs `claude plugin install <plugin-name>`
6. Plugin is added to the Approved Extensions appendix

**Rationale:** Official marketplace plugins are reviewed by Anthropic and
receive automatic updates. They present the lowest risk.

### 4.2 Third-Party Marketplace Plugins

**Risk level:** Medium **Process:**

1. Requester identifies the plugin and documents the business need
2. {{ADMIN_CONTACT}} reviews the plugin's:
   - Source and publisher reputation
   - Permissions and data access requirements
   - Content of skills, commands, and agents included
   - Privacy policy and terms of service
3. {{ADMIN_CONTACT}} approves, rejects, or requests modifications
4. If approved, added to the Approved Extensions appendix with any usage
   restrictions

### 4.3 Internally Developed Skills

**Risk level:** Low **Process:**

1. Author creates the skill following the standard SKILL.md format
2. A peer reviews the skill content for:
   - Accuracy and completeness
   - Appropriate scope (not overly broad)
   - UK English compliance
   - No embedded credentials or sensitive data
3. Skill is added to the shared skills repository or provisioned by
   {{ADMIN_CONTACT}}
4. Added to the Approved Extensions appendix

### 4.4 Third-Party Skills

**Risk level:** Medium **Process:**

1. Requester identifies the skill and its source
2. {{ADMIN_CONTACT}} reviews the full content of the SKILL.md and any reference
   files
3. Checks for:
   - Unexpected instructions or prompt injection patterns
   - Data exfiltration instructions (e.g., 'send this data to...')
   - Overly broad permissions or scope
   - Compliance with {{COMPANY_NAME}} data policies
4. If approved, provisioned via the Teams admin console or shared internally

### 4.5 MCP/Connector Integrations

**Risk level:** Medium-High **Process:**

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

**Risk level:** High **Process:**

1. Hooks execute code on the user's machine and require the highest level of
   scrutiny
2. Author documents exactly what the hook does, when it triggers, and what data
   it accesses
3. {{ADMIN_CONTACT}} reviews the hook code line by line
4. Hook is tested in a controlled environment before deployment
5. Must be re-reviewed after any modifications

---

## 5. Risk Assessment Criteria

When evaluating any extension, assess the following:

| Criterion                | Questions to Ask                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| **Data access**          | What data can this extension read? Can it access client data, personal data, or confidential information? |
| **External connections** | Does this extension connect to external services? What data is transmitted?                               |
| **Code execution**       | Does this extension execute code on the user's machine? What permissions does it require?                 |
| **Maintenance status**   | Is this extension actively maintained? When was it last updated?                                          |
| **Source reputation**    | Who created this extension? Is the publisher known and trusted?                                           |
| **Scope**                | Is the extension's scope appropriately narrow, or does it have overly broad capabilities?                 |
| **Reversibility**        | Can the extension's effects be easily undone if problems arise?                                           |
| **Alternatives**         | Are there lower-risk alternatives that achieve the same goal?                                             |

---

## 6. Installation and Maintenance

### 6.1 Marketplace Plugins

- Installed via `claude plugin install <plugin-name>` (Claude Code) or the
  marketplace interface
- **Receive automatic updates** from the plugin maintainer
- {{ADMIN_CONTACT}} monitors update notifications for breaking changes
- If an update introduces concerns, the plugin can be disabled pending review

### 6.2 Manually Copied Files (Skills, Commands, Agents)

- Copied to `.claude/skills/`, `.claude/commands/`, or equivalent directories
- **Do not receive automatic updates** — the team is responsible for maintenance
- {{ADMIN_CONTACT}} schedules a review every {{REVIEW_FREQUENCY}} to:
  - Check for updated versions from the original source
  - Verify the files still meet policy requirements
  - Remove any that are no longer needed
- Admin-provisioned skills should be updated centrally when changes are needed

### 6.3 Version Control

- All internally developed skills, commands, and agents should be stored in a
  version-controlled repository
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

- Extensions must not be used to process personal data beyond what is necessary
  for the task
- Client data should not be exposed to extensions that transmit data to external
  services without explicit approval
- All data processing via AI tools must comply with {{COMPANY_NAME}}'s data
  protection policies

### 8.2 UK GDPR Compliance

As a UK-based organisation, {{COMPANY_NAME}} must ensure that AI tool extensions
comply with the UK General Data Protection Regulation (UK GDPR) and the Data
Protection Act 2018:

- **Lawful basis:** Ensure there is a lawful basis for any processing of
  personal data via AI tools
- **Data minimisation:** Only provide AI tools with the minimum data necessary
  for the task
- **Storage limitation:** Do not retain personal data in AI tool contexts longer
  than necessary
- **Transparency:** Where AI tools are used to process personal data, ensure
  data subjects are informed as required
- **International transfers:** Be aware that AI tool providers may process data
  outside the UK; verify adequacy decisions or appropriate safeguards are in
  place

### 8.3 Sector-Specific Considerations

{{COMPANY_NAME}} operates in {{INDUSTRY}}. The following additional
considerations apply:

- [ ] **Safeguarding data:** If working with safeguarding-related data, ensure
      no personal data relating to vulnerable individuals is processed through
      AI extensions without explicit authorisation and appropriate safeguards
- [ ] **Public sector requirements:** If handling public sector data, verify
      that AI tool usage complies with relevant departmental policies and
      security classifications
- [ ] **Professional standards:** Ensure AI tool usage aligns with any
      professional body requirements relevant to {{INDUSTRY}}

_Customise this section based on your organisation's specific regulatory
environment._

---

## 9. Review Schedule

### Regular Reviews

This policy is reviewed every {{REVIEW_FREQUENCY}} by {{ADMIN_CONTACT}}. Reviews
cover:

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

_Populate this table with your organisation's approved extensions._

| Extension | Type | Approved By | Approved Date | Risk Level | Notes |
| --------- | ---- | ----------- | ------------- | ---------- | ----- |
|           |      |             |               |            |       |
|           |      |             |               |            |       |
|           |      |             |               |            |       |

### Recommended Starting Set

The following extensions are recommended for initial approval based on the
training programme assessment:

| Extension            | Type                 | Risk Level | Recommendation                              |
| -------------------- | -------------------- | ---------- | ------------------------------------------- |
| uk-english           | Skill                | Low        | Enforce UK English across all AI output     |
| session-handoff      | Skill                | Low        | Session continuation and handoff management |
| brand-voice          | Skill                | Low        | Brand voice documentation framework         |
| brand-review         | Skill/Command        | Low        | Content review against brand guidelines     |
| claude-md-management | Plugin (marketplace) | Low        | CLAUDE.md audit and improvement             |
| commit-commands      | Plugin (marketplace) | Low        | Git workflow commands                       |
| pr-review-toolkit    | Plugin (marketplace) | Low        | PR review with specialised agents           |
| context7             | Plugin (marketplace) | Low        | Library documentation lookup                |

---

_End of policy. This document should be stored in a location accessible to all
staff and reviewed on the schedule defined above._
