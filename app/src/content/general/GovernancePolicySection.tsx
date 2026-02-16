import { useState } from 'react';
import { Link } from 'react-router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CodeBlock } from '@/components/content/CodeBlock';
import { CalloutCard } from '@/components/content/CalloutCard';
import { CopyButton } from '@/components/content/CopyButton';
import { useTrack } from '@/hooks/useTrack';
import { cn } from '@/lib/utils';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  ClipboardList,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lock,
  Download,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Track } from '@/content/shared/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PolicySection {
  id: string;
  number: string;
  title: string;
  content: string;
  annotation: string;
  tracks: Track[];
  icon: LucideIcon;
}

interface PlaceholderDef {
  placeholder: string;
  description: string;
  example: string;
}

interface RiskTier {
  level: number;
  label: string;
  colour: string;
  characteristics: string[];
  examples: string[];
  approval: string;
}

interface QuickStartStep {
  title: string;
  when: string;
  description: string;
  icon: LucideIcon;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const placeholders: PlaceholderDef[] = [
  {
    placeholder: '{{COMPANY_NAME}}',
    description: 'Organisation name',
    example: 'Phew Design Limited',
  },
  {
    placeholder: '{{INDUSTRY}}',
    description: 'Primary industry or sector',
    example: 'Safeguarding and public sector software',
  },
  {
    placeholder: '{{TEAM_SIZE}}',
    description: 'Approximate team size',
    example: '10',
  },
  {
    placeholder: '{{EFFECTIVE_DATE}}',
    description: 'Date the policy takes effect',
    example: '01/03/2026',
  },
  {
    placeholder: '{{LAST_REVIEWED}}',
    description: 'Date of last review',
    example: '01/03/2026',
  },
  {
    placeholder: '{{POLICY_OWNER}}',
    description: 'Name or role of the policy owner',
    example: 'AI Lead',
  },
  {
    placeholder: '{{AI_LEAD_NAME}}',
    description: 'Name of the designated AI Lead',
    example: '[To be confirmed]',
  },
  {
    placeholder: '{{AI_LEAD_ROLE}}',
    description: 'Role/title of the AI Lead',
    example: '[To be confirmed]',
  },
  {
    placeholder: '{{NEXT_REVIEW}}',
    description: 'Date of next scheduled review',
    example: '01/06/2026',
  },
];

const riskTiers: RiskTier[] = [
  {
    level: 1,
    label: 'Low Risk',
    colour: 'emerald',
    characteristics: [
      'Read-only or output-only functionality (no external data access)',
      'No access to sensitive data, customer information, or production systems',
      'From a verified/official source (Anthropic marketplace, known publisher)',
      "Affects only the individual user's workflow",
    ],
    examples: [
      'Official Anthropic plugins (commit-commands, code-simplifier, context7)',
      'Internal skills that format output or enforce style rules (UK English, brand voice)',
      'Read-only MCP servers (documentation lookup, public API queries)',
    ],
    approval:
      'Self-approval. Log in the AI Extension Register and notify the AI Lead.',
  },
  {
    level: 2,
    label: 'Medium Risk',
    colour: 'amber',
    characteristics: [
      'Read/write access to internal systems, files, or repositories',
      'Accesses non-sensitive company data (project files, internal documentation)',
      'From a reputable but non-verified source',
      'Affects team-wide workflows or shared environments',
    ],
    examples: [
      'MCP servers connecting to internal databases or file systems',
      'Third-party skills from community marketplaces',
      'Hooks that modify files automatically (Britfix, linting hooks)',
      'Skills provisioned organisation-wide by admin',
    ],
    approval:
      'AI Lead approval required. Submit a brief request and wait for confirmation before installation.',
  },
  {
    level: 3,
    label: 'High Risk',
    colour: 'red',
    characteristics: [
      'Access to sensitive data (customer PII, financial records, health data, safeguarding information)',
      'Access to production systems or live environments',
      'From an unknown, unverified, or new source',
      'Could affect data protection compliance (GDPR, ISO 27001)',
      'Involves automated actions with real-world consequences',
    ],
    examples: [
      'MCP servers connecting to customer databases, CRM, or production environments',
      'Any extension handling safeguarding data or personal information',
      'Browser automation tools operating on live client sites',
      'Agent teams with autonomous decision-making authority',
    ],
    approval:
      'AI Lead review + MD sign-off. A written risk assessment must be completed and retained.',
  },
];

const quickStartSteps: QuickStartStep[] = [
  {
    title: 'Designate an AI Lead',
    when: 'Day 1',
    description:
      'Choose one person to own AI extension governance. This should be someone who uses Claude regularly, has authority to make proportionate risk decisions, and can commit 30 minutes per quarter to a review.',
    icon: Users,
  },
  {
    title: 'Lock down installation permissions',
    when: 'Day 1',
    description:
      'On Claude Teams, the admin should review which team members have permission to install extensions and MCP servers. Consider restricting organisation-wide skill deployment to the AI Lead and admin.',
    icon: Lock,
  },
  {
    title: 'Build the initial register',
    when: 'Week 1',
    description:
      'The AI Lead should ask each team member to list what extensions they currently have installed, compile the responses into the register template, classify each by risk tier, and flag any Tier 2 or 3 extensions that need retrospective approval.',
    icon: ClipboardList,
  },
];

const policySections: PolicySection[] = [
  {
    id: 'purpose',
    number: '1',
    title: 'Purpose',
    content: `This policy establishes a clear, proportionate process for evaluating, approving, deploying, and maintaining AI extensions used with Claude across {{COMPANY_NAME}}. It covers all extension types: MCP servers (connectors), plugins, skills, commands, hooks, and subagents.

The goal is not to slow adoption down but to ensure that new AI capabilities are introduced thoughtfully \u2014 with consideration for data security, reliability, and long-term maintainability. For a team of {{TEAM_SIZE}} people, this means lightweight processes, clear ownership, and sensible defaults rather than bureaucratic approval chains.`,
    annotation:
      'This sets the tone for the whole policy: proportionate, not bureaucratic. The key message is that governance exists to enable confident adoption, not to create red tape.',
    tracks: ['general', 'developer'],
    icon: FileText,
  },
  {
    id: 'scope',
    number: '2',
    title: 'Scope',
    content: `This policy applies to:

- All staff at {{COMPANY_NAME}} who use Claude in any form (claude.ai, Claude Desktop, Claude Code, CoWork)
- All AI extensions installed, uploaded, or configured across any Claude environment
- Both production and development/testing environments

Extension types covered: MCP servers (connectors), official marketplace plugins, third-party marketplace plugins, internally developed skills, third-party skills, commands, hooks, and subagents/agent teams.`,
    annotation:
      'Covers everything across all Claude surfaces. The scope is deliberately broad so nothing slips through the cracks, but the risk tiers (Section 4) ensure the process is proportionate to the actual risk.',
    tracks: ['general', 'developer'],
    icon: Shield,
  },
  {
    id: 'roles',
    number: '3',
    title: 'Roles and Responsibilities',
    content: `{{COMPANY_NAME}} designates one person as the AI Lead \u2014 the primary point of contact for all AI extension decisions.

AI Lead responsibilities:
- Maintain the AI Extension Register (Section 7)
- Review and approve extension requests (or escalate to the MD for high-risk items)
- Conduct quarterly reviews of installed extensions
- Stay informed about Claude platform updates
- Coordinate with the team on best practices
- Ensure this policy remains current and proportionate

All staff: Do not install, upload, or configure AI extensions without following the approval process. Report any unexpected behaviour to the AI Lead.

Developers (Claude Code users): Follow the technical standards in Section 6 when creating internal extensions. Include AI extension changes in code review processes.`,
    annotation:
      'One clear owner (the AI Lead) keeps things simple. This does not need to be a developer \u2014 it needs to be someone who can make informed risk judgements and will actually do the quarterly review.',
    tracks: ['general', 'developer'],
    icon: Users,
  },
  {
    id: 'risk-categories',
    number: '4',
    title: 'Risk Categories',
    content: `Extensions are classified into three risk tiers based on their potential impact. The tier determines the approval process.

Tier 1 \u2014 Low Risk: Read-only, verified source, individual use. Self-approval with register logging.
Tier 2 \u2014 Medium Risk: Read/write access, reputable source, team-wide impact. AI Lead approval required.
Tier 3 \u2014 High Risk: Sensitive data access, production systems, unknown sources. AI Lead + MD sign-off required.`,
    annotation:
      'Three tiers keep it simple. Most day-to-day extensions will be Tier 1 (self-approval), so the process does not slow anyone down for low-risk tools. The detail for each tier is shown below.',
    tracks: ['general', 'developer'],
    icon: ShieldAlert,
  },
  {
    id: 'approval-process',
    number: '5',
    title: 'Approval Process',
    content: `Tier 1 \u2014 Self-Approval:
1. Confirm it is Tier 1 (low risk)
2. Install the extension
3. Add an entry to the AI Extension Register
4. Notify the AI Lead: "[Extension name] installed \u2014 Tier 1, [one-line description]"

Tier 2 \u2014 AI Lead Approval:
1. Submit a request with: extension name/source, what it does, why you need it, what it accesses, who will use it
2. AI Lead reviews within 2 working days
3. If approved, install and log in the register

Tier 3 \u2014 AI Lead + MD Approval:
1. Complete the Tier 2 request, plus: data sensitivity assessment, security review, compliance impact, fallback plan
2. AI Lead reviews and prepares a recommendation
3. MD reviews and approves or rejects
4. Decision and rationale documented

Emergency Installation: Install with minimum permissions, notify AI Lead within 4 working hours, complete retrospective review within 2 working days.`,
    annotation:
      'The process scales with risk. Tier 1 takes 30 seconds (just log it). Tier 2 takes a day or two. Tier 3 is the only one that involves the MD. The emergency clause ensures urgent situations are not blocked.',
    tracks: ['general', 'developer'],
    icon: CheckCircle2,
  },
  {
    id: 'technical-standards',
    number: '6',
    title: 'Technical Standards for Internal Extensions',
    content: `When {{COMPANY_NAME}} staff create skills, commands, hooks, or other extensions internally, they must meet these standards:

Skill files (SKILL.md):
- Complete YAML frontmatter with name and description fields
- Description uses the WHEN / WHEN NOT pattern for accurate auto-invocation
- Clear, specific instructions another team member can understand
- UK English throughout
- Tested in at least one environment before sharing

Commands:
- Clear trigger description and usage instructions
- Follow UK English and quality standards

Hooks:
- Document what it does, when it triggers, what it modifies
- Test thoroughly \u2014 hooks run automatically
- Set appropriate timeouts

Code review:
- All team-wide extensions must go through code review
- Extensions provisioned organisation-wide must be reviewed by at least two people

Version control:
- All internal extensions stored in Git with clear commit messages`,
    annotation:
      'These standards ensure internal extensions are reliable and reusable. The key principle: another team member should understand the extension without explanation from the author.',
    tracks: ['developer'],
    icon: FileText,
  },
  {
    id: 'register',
    number: '7',
    title: 'AI Extension Register',
    content: `Maintain a register of all AI extensions in use across {{COMPANY_NAME}}. This can be a shared spreadsheet, a page in your internal wiki, or a markdown file in a shared repository.

Register fields: Extension name, Type, Source, Risk tier, Approved by, Approval date, Installed by, Environment, What it accesses, Review date, Status, Notes.`,
    annotation:
      'The register does not need to be complex \u2014 a shared spreadsheet works well for a team of 10. The important thing is that it exists and gets updated.',
    tracks: ['general', 'developer'],
    icon: ClipboardList,
  },
  {
    id: 'maintenance',
    number: '8',
    title: 'Maintenance and Review',
    content: `Quarterly Review:
1. Register audit: Are all entries current? Any unused extensions to remove?
2. Update check: Are extensions at latest versions? Any deprecations or security issues?
3. Usage review: Are installed extensions actually being used?
4. Policy review: Is this policy still proportionate?

Trigger-based reviews when:
- Claude announces a major platform update
- A security vulnerability is reported in any installed extension
- {{COMPANY_NAME}} undergoes an ISO surveillance or certification audit
- A new team member joins
- Team size changes significantly

Deprecation: Confirm with users, remove from all environments, update register (set to "Removed" \u2014 do not delete the row).`,
    annotation:
      'The quarterly review is 30 minutes, not a full audit. Trigger-based reviews catch the situations where the scheduled review is not soon enough.',
    tracks: ['general', 'developer'],
    icon: Clock,
  },
  {
    id: 'data-protection',
    number: '9',
    title: 'Data Protection Considerations',
    content: `Given {{COMPANY_NAME}}'s work in {{INDUSTRY}} and its obligations under GDPR, ISO 27001, and Cyber Essentials Plus:

- Minimise data exposure: Only grant extensions access to the data they genuinely need
- No customer PII in prompts without justification
- UK data residency: Confirm that external integrations do not transfer data outside the UK without safeguards
- Audit trail: For Tier 3 extensions handling sensitive data, maintain usage logs

Safeguarding data: No AI extension should ever access safeguarding case data, child protection information, or vulnerable person records without a formal Tier 3 assessment, MD approval, and a Data Protection Impact Assessment (DPIA) if applicable.`,
    annotation:
      'This section is critical for Phew! given the safeguarding context. The safeguarding data clause is a hard line \u2014 no exceptions without the full Tier 3 process.',
    tracks: ['general', 'developer'],
    icon: ShieldCheck,
  },
  {
    id: 'incident-response',
    number: '10',
    title: 'Incident Response',
    content: `If an AI extension behaves unexpectedly, produces harmful output, or appears compromised:

1. Stop using the extension immediately \u2014 disable or remove it
2. Notify the AI Lead within 1 working hour
3. Document what happened \u2014 what it did, what data was involved, what actions were taken
4. Assess impact \u2014 was any data exposed, corrupted, or sent externally?
5. Report if required \u2014 if personal data involved, follow existing data breach procedure (ICO notification within 72 hours if applicable)
6. Root cause analysis \u2014 determine why and whether similar extensions are affected
7. Update the register \u2014 record the incident against the extension entry`,
    annotation:
      'Seven clear steps, starting with the most important one: stop using it. The 1-hour notification to the AI Lead ensures nothing festers.',
    tracks: ['general', 'developer'],
    icon: AlertTriangle,
  },
];

const registerTemplate = `| Extension | Type | Source | Tier | Approved By | Date | Environment | Review Date | Status |
|-----------|------|--------|------|-------------|------|-------------|-------------|--------|
| uk-english | Skill | Internal | 1 | Self | {{EFFECTIVE_DATE}} | Organisation | {{NEXT_REVIEW}} | Active |
| brand-voice | Skill | Internal | 1 | Self | {{EFFECTIVE_DATE}} | Organisation | {{NEXT_REVIEW}} | Active |
| brand-review | Skill/Command | Internal | 1 | Self | {{EFFECTIVE_DATE}} | Organisation | {{NEXT_REVIEW}} | Active |
| context7 | Plugin | Anthropic marketplace | 1 | Self | {{EFFECTIVE_DATE}} | Project | {{NEXT_REVIEW}} | Active |
| coderabbit | Plugin | Anthropic marketplace | 2 | AI Lead | {{EFFECTIVE_DATE}} | Project | {{NEXT_REVIEW}} | Active |`;

const fullPolicyText = `# AI Extension Governance Policy

**Organisation:** {{COMPANY_NAME}}
**Industry:** {{INDUSTRY}}
**Team size:** {{TEAM_SIZE}}
**Effective date:** {{EFFECTIVE_DATE}}
**Last reviewed:** {{LAST_REVIEWED}}
**Policy owner:** {{POLICY_OWNER}}
**Version:** 1.0

---

## 1. Purpose

This policy establishes a clear, proportionate process for evaluating, approving, deploying, and maintaining AI extensions used with Claude across {{COMPANY_NAME}}. It covers all extension types: MCP servers (connectors), plugins, skills, commands, hooks, and subagents.

The goal is not to slow adoption down but to ensure that new AI capabilities are introduced thoughtfully \u2014 with consideration for data security, reliability, and long-term maintainability. For a team of {{TEAM_SIZE}} people, this means lightweight processes, clear ownership, and sensible defaults rather than bureaucratic approval chains.

---

## 2. Scope

This policy applies to:

- All staff at {{COMPANY_NAME}} who use Claude in any form (claude.ai, Claude Desktop, Claude Code, CoWork)
- All AI extensions installed, uploaded, or configured across any Claude environment
- Both production and development/testing environments

### Extension Types Covered

| Extension Type | Description | Example |
|---------------|-------------|---------|
| **MCP servers (connectors)** | External services that give Claude access to tools, data sources, or APIs | Database connectors, file system access, browser automation |
| **Official marketplace plugins** | Plugins from Anthropic's verified plugin marketplace | commit-commands, pr-review-toolkit, security-guidance, coderabbit |
| **Third-party marketplace plugins** | Plugins from community or third-party marketplaces | Community-contributed tools and integrations |
| **Internally developed skills** | Custom skill files (SKILL.md) created by {{COMPANY_NAME}} staff | Brand voice skill, UK English skill, session handoff skill |
| **Third-party skills** | Skill files obtained from external sources | Open-source skills, consultant-provided skills |
| **Commands** | Instruction files that define slash-command behaviour in Claude Code | /brand-review, /revise-claude-md |
| **Hooks** | Scripts that run automatically before or after Claude tool use | Britfix (UK English post-processing), linting hooks |
| **Subagents and agent teams** | Multi-agent configurations that delegate tasks | Codebase mapping agent, parallel build agents |

---

## 3. Roles and Responsibilities

### AI Lead

{{COMPANY_NAME}} designates one person as the **AI Lead** \u2014 the primary point of contact for all AI extension decisions.

**Responsibilities:**
- Maintain the AI Extension Register (Section 7)
- Review and approve extension requests (or escalate to the MD for high-risk items)
- Conduct quarterly reviews of installed extensions
- Stay informed about Claude platform updates and new extension capabilities
- Coordinate with the team on best practices and share learnings
- Ensure this policy remains current and proportionate

**Current AI Lead:** {{AI_LEAD_NAME}} ({{AI_LEAD_ROLE}})

### All Staff

- Do not install, upload, or configure AI extensions without following the approval process in Section 5
- Report any unexpected behaviour from AI extensions to the AI Lead
- Keep extensions up to date when notified of updates
- Remove extensions that are no longer needed

### Developers (Claude Code Users)

In addition to the above:
- Follow the technical standards in Section 6 when creating internal skills, commands, or hooks
- Include AI extension changes in code review processes
- Document any project-specific extensions in the project's CLAUDE.md file

---

## 4. Risk Categories

Extensions are classified into three risk tiers based on their potential impact.

### Tier 1 \u2014 Low Risk

**Characteristics:** Read-only or output-only, no sensitive data access, verified source, individual use.
**Examples:** Official Anthropic plugins, internal style/formatting skills, read-only MCP servers.
**Approval:** Self-approval. Log in register and notify the AI Lead.

### Tier 2 \u2014 Medium Risk

**Characteristics:** Read/write access to internal systems, reputable but non-verified source, team-wide impact.
**Examples:** Internal database MCP servers, third-party skills, auto-modifying hooks, org-wide skills.
**Approval:** AI Lead approval required within 2 working days.

### Tier 3 \u2014 High Risk

**Characteristics:** Sensitive data access, production systems, unknown sources, compliance impact, automated real-world actions.
**Examples:** Customer database connectors, safeguarding data handlers, browser automation on live sites, autonomous agent teams.
**Approval:** AI Lead review + MD sign-off with written risk assessment.

---

## 5. Approval Process

### Tier 1 \u2014 Self-Approval
1. Confirm it is Tier 1
2. Install the extension
3. Add to the AI Extension Register
4. Notify the AI Lead

### Tier 2 \u2014 AI Lead Approval
1. Submit request with: name/source, what it does, why needed, what it accesses, who uses it
2. AI Lead reviews within 2 working days
3. If approved, install and log

### Tier 3 \u2014 AI Lead + MD Approval
1. Tier 2 request plus: data sensitivity assessment, security review, compliance impact, fallback plan
2. AI Lead prepares recommendation
3. MD approves or rejects
4. Decision documented and retained

### Emergency Installation
Install with minimum permissions, notify AI Lead within 4 hours, complete retrospective review within 2 working days.

---

## 6. Technical Standards for Internal Extensions

### Skill Files (SKILL.md)
- Complete YAML frontmatter with name and description
- WHEN / WHEN NOT description pattern
- Clear instructions, UK English, tested before sharing

### Commands
- Clear trigger and usage documentation
- UK English and quality standards

### Hooks
- Document trigger, behaviour, and modifications
- Thorough testing, appropriate timeouts

### Code Review
- Team-wide extensions require code review
- Org-wide extensions reviewed by at least two people

### Version Control
- All extensions in Git with clear commit messages

---

## 7. AI Extension Register

${registerTemplate}

---

## 8. Maintenance and Review

### Quarterly Review
1. Register audit
2. Update check
3. Usage review
4. Policy review

### Trigger-Based Reviews
- Major Claude platform updates
- Security vulnerabilities
- ISO audits
- New team members
- Significant team size changes

---

## 9. Data Protection Considerations

- Minimise data exposure
- No customer PII without justification
- UK data residency confirmation
- Audit trail for Tier 3 extensions

### Safeguarding Data
No AI extension may access safeguarding case data without formal Tier 3 assessment, MD approval, and DPIA where applicable.

---

## 10. Incident Response

1. Stop using the extension immediately
2. Notify the AI Lead within 1 working hour
3. Document what happened
4. Assess impact
5. Report if required (ICO within 72 hours if personal data involved)
6. Root cause analysis
7. Update the register

---

## Appendix B — Extension Type Quick Reference

| Type | Risk Tier | Approval | Context Cost | Maintenance |
|------|-----------|----------|--------------|-------------|
| Skills | Low | Self-serve | Medium | Manual updates |
| Plugins | Low–Medium | Self-serve (marketplace) | Low | Automatic updates |
| MCPs | Medium–High | Team lead approval | Low | Manual config |
| Commands | Low | Self-serve | Low | Manual updates |
| Hooks | Medium | Team lead approval | None | Manual maintenance |
| Subagents | High | Team + security review | High | Complex maintenance |`;

// ─── Sub-components ──────────────────────────────────────────────────────────

function PlaceholderBadge({
  placeholder,
  description,
  example,
}: PlaceholderDef) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help items-center rounded-md bg-violet-100 px-1.5 py-0.5 text-xs font-medium text-violet-800 dark:bg-violet-900/40 dark:text-violet-300">
            {placeholder}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4}>
          <p className="max-w-52 text-xs">
            <strong>{description}</strong>
            <br />
            e.g. {example}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function renderContentWithPlaceholders(text: string) {
  const parts = text.split(/({{[A-Z_]+}})/g);
  return parts.map((part, i) => {
    const match = placeholders.find((p) => p.placeholder === part);
    if (match) {
      return <PlaceholderBadge key={i} {...match} />;
    }
    return <span key={i}>{part}</span>;
  });
}

function RiskTierCard({ tier }: { tier: RiskTier }) {
  const colourMap: Record<
    string,
    { bg: string; border: string; badge: string }
  > = {
    emerald: {
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      border: 'border-emerald-200 dark:border-emerald-800/40',
      badge:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    amber: {
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      border: 'border-amber-200 dark:border-amber-800/40',
      badge:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    },
    red: {
      bg: 'bg-red-50/50 dark:bg-red-950/20',
      border: 'border-red-200 dark:border-red-800/40',
      badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    },
  };
  const c = colourMap[tier.colour];

  return (
    <div className={cn('rounded-lg border p-4', c.bg, c.border)}>
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
            c.badge,
          )}
        >
          Tier {tier.level}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {tier.label}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Characteristics
          </span>
          <ul
            className="mt-1.5 space-y-1 text-sm text-muted-foreground"
            role="list"
          >
            {tier.characteristics.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                  aria-hidden="true"
                />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Examples
          </span>
          <ul
            className="mt-1.5 space-y-1 text-sm text-muted-foreground"
            role="list"
          >
            {tier.examples.map((e, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                  aria-hidden="true"
                />
                {e}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md bg-card/50 px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            Approval:{' '}
          </span>
          <span className="text-sm text-foreground">{tier.approval}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function GovernancePolicySection() {
  const { track } = useTrack();
  const isGeneral = track === 'general';
  const [viewMode, setViewMode] = useState<'walkthrough' | 'full'>(
    'walkthrough',
  );

  const filteredSections = policySections.filter((s) =>
    s.tracks.includes(track),
  );

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <section aria-labelledby="gov-intro-heading">
        <p className="max-w-prose text-base leading-relaxed text-foreground">
          This is not about creating red tape. It is about having a clear,
          lightweight process so your team can adopt new AI tools confidently
          without wondering whether they should have asked someone first.
        </p>
        <div className="mt-4 space-y-3">
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            The policy below is a fill-in-the-blanks template — Phew! can use it
            as-is by filling in a few details, and it can be adapted for other
            organisations by changing the highlighted variables. Each variable
            is shown as a{' '}
            <PlaceholderBadge
              placeholder="{{EXAMPLE}}"
              description="A placeholder variable"
              example="Your value here"
            />{' '}
            badge — hover or tap to see what to substitute.
          </p>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            The standalone template is available in the starter kit at{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              starter-kit/templates/governance-policy-template.md
            </code>
            .
          </p>
        </div>

        {/* Download / Copy full document */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <CopyButton
            text={fullPolicyText}
            className="h-auto gap-2 px-3 py-2 opacity-100"
          />
          <span className="text-sm text-muted-foreground">
            Copy full policy to clipboard
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              const blob = new Blob([fullPolicyText], {
                type: 'text/markdown',
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'ai-governance-policy.md';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-4 w-4" />
            Download as Markdown
          </Button>
        </div>
      </section>

      <Separator />

      {/* Quick Start — prominently placed for general track */}
      {isGeneral && (
        <>
          <section aria-labelledby="quick-start-heading">
            <h2
              id="quick-start-heading"
              className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Quick Start: Three Things to Do This Week
            </h2>
            <p className="mb-6 max-w-prose text-sm text-muted-foreground">
              You do not need to implement the entire policy at once. Start with
              these three steps.
            </p>

            <div className="space-y-4">
              {quickStartSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="flex items-start gap-4 rounded-lg border border-border px-4 py-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Icon
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {step.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {step.when}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <Separator />
        </>
      )}

      {/* Risk Tiers — visual presentation */}
      <section aria-labelledby="risk-tiers-heading">
        <h2
          id="risk-tiers-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Risk Categories
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Extensions are classified into three tiers. The tier determines how
          much approval is needed. Most day-to-day extensions will be Tier 1 —
          self-approval with a quick log entry.
        </p>

        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
          {riskTiers.map((tier) => (
            <RiskTierCard key={tier.level} tier={tier} />
          ))}
        </div>
      </section>

      <Separator />

      {/* View mode toggle */}
      <section aria-labelledby="policy-walkthrough-heading">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="policy-walkthrough-heading"
              className="text-xl font-semibold tracking-tight sm:text-2xl"
            >
              The Full Policy
            </h2>
            <p className="mt-1 max-w-prose text-sm text-muted-foreground">
              Walk through the policy section by section, or view the full
              document in one page.
            </p>
          </div>
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as 'walkthrough' | 'full')}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="walkthrough">Walkthrough</TabsTrigger>
              <TabsTrigger value="full">Full Document</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === 'walkthrough' ? (
          <Accordion type="single" collapsible className="space-y-1">
            {filteredSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="rounded-lg border border-border px-4"
                >
                  <AccordionTrigger className="text-sm font-medium hover:no-underline sm:text-base">
                    <span className="flex items-center gap-3">
                      <Icon
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span>
                        {index + 1}. {section.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-5 pt-1">
                    {/* Policy text with placeholders */}
                    <div className="group relative rounded-md border border-border bg-muted/30 p-4">
                      <CopyButton
                        text={section.content}
                        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                      />
                      <div className="max-w-prose whitespace-pre-line pr-10 text-sm leading-relaxed text-foreground">
                        {renderContentWithPlaceholders(section.content)}
                      </div>
                    </div>

                    {/* Annotation */}
                    <CalloutCard variant="info" title="Why this matters">
                      {section.annotation}
                    </CalloutCard>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="space-y-4">
            <div className="group relative rounded-lg border border-border bg-muted/20 p-6">
              <CopyButton
                text={fullPolicyText}
                className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100"
              />
              <div className="max-w-prose whitespace-pre-line pr-10 text-sm leading-relaxed text-foreground">
                {renderContentWithPlaceholders(fullPolicyText)}
              </div>
            </div>
          </div>
        )}
      </section>

      <Separator />

      {/* Parameterisation Reference */}
      <section aria-labelledby="params-heading">
        <h2
          id="params-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          How to Customise the Template
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Replace each placeholder with your organisation's details. Hover or
          tap on any placeholder to see what to substitute.
        </p>

        <ScrollArea className="w-full rounded-lg border border-border">
          <div className="min-w-[480px]">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Placeholder
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Example value
                  </th>
                </tr>
              </thead>
              <tbody>
                {placeholders.map((p, i) => (
                  <tr
                    key={p.placeholder}
                    className={cn(
                      'border-b border-border last:border-b-0',
                      i % 2 === 0 ? 'bg-transparent' : 'bg-muted/20',
                    )}
                  >
                    <td className="px-3 py-2.5">
                      <PlaceholderBadge {...p} />
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {p.description}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {p.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <Separator />

      {/* Register Template */}
      <section aria-labelledby="register-heading">
        <h2
          id="register-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Extension Register Template
        </h2>
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          A starting register pre-populated with the extensions from the Phew!
          starter kit. Copy this into a shared spreadsheet or markdown file.
        </p>
        <CodeBlock
          code={registerTemplate}
          language="markdown"
          title="AI Extension Register"
        />
      </section>

      {/* Appendix B — Extension Type Quick Reference */}
      <Separator />
      <section aria-labelledby="appendix-b-heading">
        <h2
          id="appendix-b-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Extension Type Quick Reference
        </h2>
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          A summary of each extension type, its typical risk tier, approval
          process, context cost, and maintenance requirements.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">Risk Tier</th>
                <th className="py-2 pr-4 font-medium">Approval</th>
                <th className="py-2 pr-4 font-medium">Context Cost</th>
                <th className="py-2 font-medium">Maintenance</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  type: 'Skills',
                  risk: 'Low',
                  approval: 'Self-serve',
                  context: 'Medium',
                  maintenance: 'Manual updates',
                },
                {
                  type: 'Plugins',
                  risk: 'Low\u2013Medium',
                  approval: 'Self-serve (marketplace)',
                  context: 'Low',
                  maintenance: 'Automatic updates',
                },
                {
                  type: 'MCPs',
                  risk: 'Medium\u2013High',
                  approval: 'Team lead approval',
                  context: 'Low',
                  maintenance: 'Manual config',
                },
                {
                  type: 'Commands',
                  risk: 'Low',
                  approval: 'Self-serve',
                  context: 'Low',
                  maintenance: 'Manual updates',
                },
                {
                  type: 'Hooks',
                  risk: 'Medium',
                  approval: 'Team lead approval',
                  context: 'None',
                  maintenance: 'Manual maintenance',
                },
                {
                  type: 'Subagents',
                  risk: 'High',
                  approval: 'Team + security review',
                  context: 'High',
                  maintenance: 'Complex maintenance',
                },
              ].map((row, i) => (
                <tr
                  key={row.type}
                  className={cn(
                    'border-b border-border/50',
                    i === 5 && 'border-b-0',
                  )}
                >
                  <td className="py-2 pr-4 font-medium">{row.type}</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {row.risk}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {row.approval}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {row.context}
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {row.maintenance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Start for developer track (placed after full policy) */}
      {!isGeneral && (
        <>
          <Separator />
          <section aria-labelledby="dev-quick-start-heading">
            <h2
              id="dev-quick-start-heading"
              className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Quick Start: Three Things to Do This Week
            </h2>
            <p className="mb-6 max-w-prose text-sm text-muted-foreground">
              Actionable steps for getting governance in place quickly.
            </p>

            <div className="space-y-4">
              {quickStartSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="flex items-start gap-4 rounded-lg border border-border px-4 py-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Icon
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {step.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {step.when}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* Developer implementation notes */}
          <section aria-labelledby="dev-impl-heading">
            <h2
              id="dev-impl-heading"
              className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Implementation Notes for Developers
            </h2>
            <p className="mb-6 max-w-prose text-sm text-muted-foreground">
              Technical details for enforcing governance through configuration.
            </p>

            <div className="space-y-4">
              <CalloutCard
                variant="info"
                title="Permission management via settings.json"
              >
                Use{' '}
                <code className="rounded bg-muted px-1 text-xs">
                  .claude/settings.json
                </code>{' '}
                to control which tools and MCP servers are available. Scope
                settings at user, project, or local level. Project-level
                settings are version-controlled and apply to all developers on
                the project.
              </CalloutCard>

              <CalloutCard
                variant="tip"
                title="Reference implementations in the starter kit"
              >
                The{' '}
                <code className="rounded bg-muted px-1 text-xs">
                  uk-english
                </code>{' '}
                and{' '}
                <code className="rounded bg-muted px-1 text-xs">
                  brand-review
                </code>{' '}
                skills in the starter kit are examples of well-structured
                internal skills that meet the technical standards in Section 6.
              </CalloutCard>

              <CalloutCard
                variant="warning"
                title="Hooks carry higher governance weight"
              >
                Hooks run automatically without user interaction. Even a simple
                hook like Britfix (UK English post-processing) modifies files
                every time Claude writes code. Always classify hooks as Tier 2
                minimum and test thoroughly before deploying.
              </CalloutCard>
            </div>
          </section>
        </>
      )}

      {/* Cross-references */}
      <Separator />
      <section aria-labelledby="cross-ref-heading">
        <h2
          id="cross-ref-heading"
          className="mb-4 text-lg font-semibold tracking-tight"
        >
          Related Sections
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            For details on what each extension type is and when to use it, see{' '}
            <Link
              to={`/${track}/skills-extensions`}
              className="font-semibold text-primary hover:underline"
            >
              Section 1.4 — Skills, Extensions &amp; Decision Tree
            </Link>
            .
          </p>
          {!isGeneral && (
            <>
              <p>
                For safe MCP server configuration, see{' '}
                <Link
                  to={`/${track}/mcp-usage`}
                  className="font-semibold text-primary hover:underline"
                >
                  Section 1.13 — Safe MCP Usage
                </Link>
                .
              </p>
              <p>
                For plugin evaluation and recommendations, see{' '}
                <Link
                  to={`/${track}/plugins`}
                  className="font-semibold text-primary hover:underline"
                >
                  Section 1.14 — Plugin Recommendations
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
