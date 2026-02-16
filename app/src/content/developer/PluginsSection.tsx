import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CodeBlock } from '@/components/content/CodeBlock';
import { CalloutCard } from '@/components/content/CalloutCard';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

interface PluginEntry {
  name: string;
  author: string;
  description: string;
  provides: string[];
  whatItDoes: string;
  whenToUse: string;
  installCommand: string;
  requirements?: string;
  securityNote?: string;
  category: string;
}

const plugins: PluginEntry[] = [
  // Development Workflow
  {
    name: 'commit-commands',
    author: 'Anthropic',
    description:
      'Streamlines git workflow with commands for committing, pushing, and creating pull requests.',
    provides: ['Commands'],
    whatItDoes:
      '/commit analyses your changes and creates a commit with an appropriate message. /commit-push-pr creates a branch, commits, pushes, and opens a PR. /clean_gone removes local branches deleted from remote.',
    whenToUse:
      'Daily development workflow. Reduces context-switching between coding and git operations.',
    installCommand: '/plugin install commit-commands',
    requirements:
      'Git installed. For /commit-push-pr: GitHub CLI (gh) must be installed and authenticated.',
    category: 'Development Workflow',
  },
  {
    name: 'pr-review-toolkit',
    author: 'Anthropic',
    description:
      'Comprehensive collection of six specialised agents for thorough pull request review.',
    provides: ['Agents', 'Command'],
    whatItDoes:
      'Six review agents: code-reviewer (general review), comment-analyzer (comment accuracy), pr-test-analyzer (test coverage gaps), silent-failure-hunter (error handling), type-design-analyzer (type quality), code-simplifier (complexity reduction).',
    whenToUse:
      'Before creating PRs, after code review feedback, and during periodic code quality audits.',
    installCommand: '/plugin install pr-review-toolkit',
    category: 'Development Workflow',
  },
  {
    name: 'code-simplifier',
    author: 'Anthropic',
    description:
      'Standalone agent that simplifies and refines code for clarity and maintainability.',
    provides: ['Agent'],
    whatItDoes:
      'Analyses code for unnecessary complexity, redundant abstractions, inconsistent patterns, and overly compact logic. Suggests simplifications that preserve behaviour.',
    whenToUse:
      'After getting code working but before finalising. Also included in pr-review-toolkit \u2014 you may not need both.',
    installCommand: '/plugin install code-simplifier',
    category: 'Development Workflow',
  },
  {
    name: 'claude-md-management',
    author: 'Anthropic',
    description:
      'Tools to maintain and improve CLAUDE.md files \u2014 audit quality, capture session learnings.',
    provides: ['Skills', 'Commands'],
    whatItDoes:
      'claude-md-improver audits CLAUDE.md files against the current codebase. /revise-claude-md captures learnings from the current session and proposes updates.',
    whenToUse:
      'Periodically to keep CLAUDE.md accurate. See Section 1.8 for detailed walkthrough.',
    installCommand: '/plugin install claude-md-management',
    category: 'Development Workflow',
  },
  // Security & Code Quality
  {
    name: 'security-guidance',
    author: 'Anthropic',
    description:
      'Security reminder hook that warns about potential security issues when editing files.',
    provides: ['Hooks'],
    whatItDoes:
      'Runs a Python script before every file edit, checking for command injection, XSS, and unsafe code patterns. Surfaces warnings before the edit is applied.',
    whenToUse:
      'Always-on for projects handling user input, authentication, or sensitive data \u2014 all of Phew!\u2019s web applications.',
    installCommand: '/plugin install security-guidance',
    requirements: 'Python 3 must be installed (standard on macOS).',
    securityNote:
      'This is a preventive tool, not a replacement for proper security review.',
    category: 'Security & Code Quality',
  },
  {
    name: 'coderabbit',
    author: 'CodeRabbit AI',
    description:
      'AI-powered code review in Claude Code, powered by CodeRabbit.',
    provides: ['Commands', 'Skills', 'Agent'],
    whatItDoes:
      'Runs CodeRabbit\u2019s AI code review engine within Claude Code. Reviews all changes, committed or uncommitted, grouped by severity.',
    whenToUse:
      'As a second opinion on code quality alongside pr-review-toolkit.',
    installCommand: '/plugin install coderabbit',
    requirements:
      'CodeRabbit CLI must be installed: curl -fsSL https://cli.coderabbit.ai/install.sh | sh && coderabbit auth login',
    securityNote:
      'CodeRabbit sends your code to an external service for analysis. Ensure this is acceptable under your data handling policies (Section 1.5).',
    category: 'Security & Code Quality',
  },
  // External Service Integrations
  {
    name: 'github',
    author: 'GitHub',
    description: 'Official GitHub MCP server for repository management.',
    provides: ['MCP'],
    whatItDoes:
      'Direct access to GitHub\u2019s API: create issues, manage PRs, review code, search repositories, manage branches \u2014 all without leaving Claude Code.',
    whenToUse:
      'Any workflow involving GitHub for project management beyond just version control.',
    installCommand: '/plugin install github',
    requirements:
      'GitHub Personal Access Token stored as GITHUB_PERSONAL_ACCESS_TOKEN env var.',
    securityNote:
      'Use a fine-grained personal access token with minimum required permissions. Rotate tokens periodically.',
    category: 'External Services',
  },
  {
    name: 'context7',
    author: 'Upstash',
    description:
      'Up-to-date documentation lookup via MCP. Pulls version-specific docs from source repositories.',
    provides: ['MCP'],
    whatItDoes:
      'Fetches current documentation from actual source repositories \u2014 not from Claude\u2019s training data. Supports version-specific lookups.',
    whenToUse:
      'Working with third-party libraries where Claude\u2019s training data may be outdated. Choose this OR deepwiki (Section 1.13), not both.',
    installCommand: '/plugin install context7',
    category: 'External Services',
  },
  {
    name: 'playwright',
    author: 'Microsoft',
    description: 'Browser automation and end-to-end testing MCP server.',
    provides: ['MCP'],
    whatItDoes:
      'Full browser control: navigate, screenshot, fill forms, click, extract text, run E2E tests. See Section 1.13 for safety guidance.',
    whenToUse:
      'Testing web applications, verifying CSS changes, regression checks. See Section 1.12 for detailed testing approaches.',
    installCommand: '/plugin install playwright',
    securityNote:
      'Full browser control \u2014 use only on staging/development environments.',
    category: 'External Services',
  },
  {
    name: 'sentry',
    author: 'Sentry',
    description:
      'Sentry plugin for debugging, error monitoring, and performance tracking.',
    provides: ['MCP', 'Commands', 'Skills'],
    whatItDoes:
      '/seer enables natural language queries against your Sentry environment. Setup skills for AI monitoring, structured logging, metrics, and tracing.',
    whenToUse:
      'If Phew! uses or plans to use Sentry for error monitoring and performance tracking.',
    installCommand: '/plugin install sentry',
    requirements:
      'Sentry account. MCP server connects to https://mcp.sentry.dev/mcp.',
    category: 'External Services',
  },
  {
    name: 'asana',
    author: 'Asana',
    description: 'Asana project management integration for Claude Code.',
    provides: ['MCP'],
    whatItDoes:
      'Create and manage tasks, search projects, update assignments, track progress within Claude Code.',
    whenToUse: 'If Phew! uses Asana for project management.',
    installCommand: '/plugin install asana',
    requirements: 'Asana account with appropriate permissions.',
    category: 'External Services',
  },
  // Language & Code Intelligence
  {
    name: 'php-lsp',
    author: 'Anthropic',
    description:
      'PHP language server (Intelephense) for code intelligence and diagnostics.',
    provides: ['LSP'],
    whatItDoes:
      'Real-time PHP code intelligence: automatic diagnostics, jump to definition, find references, hover type information. Particularly relevant for Phew!\u2019s WordPress work.',
    whenToUse:
      'Any PHP/WordPress project. LSP plugins provide code intelligence that runs in the background.',
    installCommand: '/plugin install php-lsp',
    requirements: 'npm install -g intelephense',
    category: 'Language & Code Intelligence',
  },
  // Plugin Development
  {
    name: 'plugin-dev',
    author: 'Anthropic',
    description: 'Comprehensive toolkit for developing Claude Code plugins.',
    provides: ['Skills', 'Commands', 'Agents'],
    whatItDoes:
      'A meta-plugin that helps you build your own plugins. Provides guidance on hooks, MCP, plugin structure, settings, commands, agents, and skills. Includes /plugin-dev:create-plugin for guided creation.',
    whenToUse:
      'When your team is ready to create custom plugins. Start with using existing plugins before building your own.',
    installCommand: '/plugin install plugin-dev',
    category: 'Plugin Development',
  },
];

const categories = [
  'Development Workflow',
  'Security & Code Quality',
  'External Services',
  'Language & Code Intelligence',
  'Plugin Development',
];

interface QuickRefEntry {
  name: string;
  author: string;
  components: string;
  install: string;
}

const quickRefEntries: QuickRefEntry[] = plugins.map((p) => ({
  name: p.name,
  author: p.author,
  components: p.provides.join(', '),
  install: p.installCommand,
}));

interface MarketplaceComparison {
  aspect: string;
  official: string;
  thirdParty: string;
}

const marketplaceComparisons: MarketplaceComparison[] = [
  {
    aspect: 'Source',
    official: 'Maintained by Anthropic',
    thirdParty: 'Community-maintained GitHub repositories',
  },
  {
    aspect: 'Vetting',
    official: 'Reviewed by Anthropic',
    thirdParty: 'Varies \u2014 no guaranteed review process',
  },
  {
    aspect: 'Auto-updates',
    official: 'Yes (default)',
    thirdParty: 'Configurable per marketplace',
  },
  {
    aspect: 'Trust level',
    official: 'High \u2014 backed by Anthropic',
    thirdParty: 'Variable \u2014 review before installing',
  },
  {
    aspect: 'Examples',
    official: 'All plugins listed above',
    thirdParty: 'skills.sh, ClaudePluginHub, Claude-Plugins.dev',
  },
  {
    aspect: 'How to add',
    official: 'Auto-available at startup',
    thirdParty: 'Add marketplace URL via /plugin menu',
  },
];

const BATCH_INSTALL = `# Recommended starter set for Phew! developers
/plugin install commit-commands
/plugin install pr-review-toolkit
/plugin install security-guidance
/plugin install claude-md-management
/plugin install php-lsp
/plugin install github`;

const APPROVAL_CHECKLIST = `## Plugin Approval Checklist

Before installing a new plugin:
- [ ] Is it from the official Anthropic marketplace?
- [ ] If third-party: has the source code been reviewed?
- [ ] What components does it include? (Skills, Hooks, MCP, Agents, LSP)
- [ ] Does it connect to external services? If so, what data is sent?
- [ ] What credentials/tokens does it need? How will they be stored?
- [ ] Does it run hooks on file edits? If so, what does the hook do?
- [ ] Has the team lead approved the installation?
- [ ] Has it been added to the project's plugin inventory?`;

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function PluginsSection() {
  return (
    <div className="flex flex-col gap-12">
      {/* 1. What Are Plugins */}
      <section aria-labelledby="what-are-plugins">
        <h2
          id="what-are-plugins"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          What Are Plugins?
        </h2>
        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Plugins are the packaging layer for Claude Code extensions. A single
            plugin can bundle skills (knowledge and workflows), hooks
            (event-driven automation), subagents (isolated workers), MCP servers
            (external service connections), and LSP servers (code intelligence).
            When you install a plugin, you get all of its components in one
            step, with automatic updates.
          </p>
          <p>
            Think of plugins as &ldquo;capability packs&rdquo; for Claude Code.
            Instead of manually configuring an MCP server, writing hook scripts,
            and creating skill files separately, a plugin gives you all of those
            working together.
          </p>
        </div>
      </section>

      <Separator />

      {/* 2. Installing vs Copying */}
      <section aria-labelledby="install-vs-copy">
        <h2
          id="install-vs-copy"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Installing vs Copying
        </h2>

        <CalloutCard variant="important" className="mb-4">
          The starter kit includes reference copies of 14 plugins. These files
          are for <strong>review</strong>, not for installation. Always install
          plugins from the marketplace when available.
        </CalloutCard>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium">Approach</th>
                <th className="pb-2 pr-4 font-medium">Auto-updates</th>
                <th className="pb-2 pr-4 font-medium">Team sharing</th>
                <th className="pb-2 font-medium">Setup effort</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50 bg-primary/5">
                <td className="py-2 pr-4 font-medium">
                  Install via marketplace
                </td>
                <td className="py-2 pr-4 text-muted-foreground">Yes</td>
                <td className="py-2 pr-4 text-muted-foreground">
                  Yes (User or Project scope)
                </td>
                <td className="py-2 text-muted-foreground">
                  Minimal — one command
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium">
                  Copy files into project
                </td>
                <td className="py-2 pr-4 text-muted-foreground">No</td>
                <td className="py-2 pr-4 text-muted-foreground">
                  Yes (version control)
                </td>
                <td className="py-2 text-muted-foreground">
                  More work — manual maintenance
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Separator />

      {/* 3. Context Cost */}
      <section aria-labelledby="plugin-context-cost">
        <h2
          id="plugin-context-cost"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Context Cost of Plugins
        </h2>

        <div className="space-y-3">
          <div className="flex gap-3 rounded-lg border border-border/50 px-4 py-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-success" />
            <div>
              <p className="text-sm font-medium">Skill descriptions</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Load at session start. Low cost — just names and short
                descriptions.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-border/50 px-4 py-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-warning" />
            <div>
              <p className="text-sm font-medium">Full skill content</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Loads only when Claude uses the skill. Burst cost — can be
                significant for large skills.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-border/50 px-4 py-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-warning" />
            <div>
              <p className="text-sm font-medium">MCP servers</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Load tool definitions at session start. Ongoing cost — same as
                standalone MCP (see Section 1.13).
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-border/50 px-4 py-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-success" />
            <div>
              <p className="text-sm font-medium">Hooks and LSP servers</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Zero context cost. Hooks run externally; LSP diagnostics are
                injected only when relevant.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* 4. Plugin Catalogue */}
      <section aria-labelledby="catalogue">
        <h2
          id="catalogue"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Plugin Catalogue
        </h2>

        <Tabs defaultValue="browse">
          <TabsList>
            <TabsTrigger value="browse">Browse Catalogue</TabsTrigger>
            <TabsTrigger value="quick-ref">Quick Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-4">
            <Accordion type="multiple" className="w-full">
              {categories.map((category) => {
                const categoryPlugins = plugins.filter(
                  (p) => p.category === category,
                );
                return (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="text-base font-medium">
                      {category}
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {categoryPlugins.length}
                      </Badge>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {categoryPlugins.map((plugin) => (
                          <div
                            key={plugin.name}
                            className="rounded-lg border border-border/50 p-4"
                          >
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-semibold">
                                {plugin.name}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {plugin.author}
                              </Badge>
                              {plugin.provides.map((p) => (
                                <Badge
                                  key={p}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {p}
                                </Badge>
                              ))}
                              {plugin.securityNote && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  External data
                                </Badge>
                              )}
                            </div>
                            <p className="mb-1 text-sm text-muted-foreground">
                              {plugin.description}
                            </p>
                            <p className="mb-2 text-sm text-muted-foreground">
                              {plugin.whatItDoes}
                            </p>
                            <p className="mb-3 text-sm">
                              <strong className="text-foreground">
                                When to use:
                              </strong>{' '}
                              <span className="text-muted-foreground">
                                {plugin.whenToUse}
                              </span>
                            </p>
                            {plugin.requirements && (
                              <p className="mb-2 text-xs text-muted-foreground">
                                <strong>Requirements:</strong>{' '}
                                {plugin.requirements}
                              </p>
                            )}
                            {plugin.securityNote && (
                              <p className="mb-2 text-xs text-warning-muted-foreground">
                                <strong>Security:</strong> {plugin.securityNote}
                              </p>
                            )}
                            <CodeBlock
                              code={plugin.installCommand}
                              language="bash"
                            />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>

          <TabsContent value="quick-ref" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 pr-4 font-medium">Plugin</th>
                    <th className="pb-2 pr-4 font-medium">Author</th>
                    <th className="pb-2 pr-4 font-medium">Components</th>
                    <th className="pb-2 font-medium">Install</th>
                  </tr>
                </thead>
                <tbody>
                  {quickRefEntries.map((entry) => (
                    <tr key={entry.name} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">{entry.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {entry.author}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {entry.components}
                      </td>
                      <td className="py-2">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                          {entry.install}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* 4b. Other Recommended Tools */}
      <section aria-labelledby="other-tools">
        <h2
          id="other-tools"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Other Recommended Tools
        </h2>
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          These are not Claude plugins, but they complement the plugin ecosystem
          and are worth knowing about.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-border/50 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold">Mintlify</h4>
              <Badge variant="outline" className="text-xs">
                External SaaS
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Not a plugin
              </Badge>
            </div>
            <p className="mb-1 text-sm text-muted-foreground">
              External SaaS documentation platform. Auto-generates API docs from
              code. Complements the documentation structure approach from
              Section 1.9 &mdash; use Mintlify for public-facing API
              documentation and the Section 1.9 patterns for internal project
              documentation.
            </p>
            <p className="text-sm">
              <strong className="text-foreground">When to consider:</strong>{' '}
              <span className="text-muted-foreground">
                When your team needs polished, hosted API documentation that
                stays in sync with your codebase. A separate service, not
                installed via Claude.
              </span>
            </p>
          </div>

          <div className="rounded-lg border border-border/50 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold">agent-browser</h4>
              <Badge variant="outline" className="text-xs">
                Starter Kit Skill
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Not a plugin
              </Badge>
            </div>
            <p className="mb-1 text-sm text-muted-foreground">
              A skill included in the starter kit (
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                starter-kit/skills/agent-browser/SKILL.md
              </code>
              ). Automates browser interactions for testing, form filling, and
              screenshots. Complements the regression testing approaches from
              Section 1.12.
            </p>
            <p className="text-sm">
              <strong className="text-foreground">When to consider:</strong>{' '}
              <span className="text-muted-foreground">
                When you need browser automation for testing workflows and
                already have the starter kit installed. Works alongside the
                Playwright MCP plugin for more structured E2E testing.
              </span>
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* 5. Official vs Third-Party */}
      <section aria-labelledby="marketplaces">
        <h2
          id="marketplaces"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Official vs Third-Party Marketplaces
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium">Aspect</th>
                <th className="pb-2 pr-4 font-medium">Official Marketplace</th>
                <th className="pb-2 font-medium">Third-Party Marketplaces</th>
              </tr>
            </thead>
            <tbody>
              {marketplaceComparisons.map((row) => (
                <tr key={row.aspect} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">{row.aspect}</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {row.official}
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {row.thirdParty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CalloutCard variant="info" className="mt-4">
          Start with the official marketplace only. Before adding any
          third-party marketplace, follow the approval process in the governance
          policy (Section 1.5). Third-party plugins can contain arbitrary code —
          review the source before installing.
        </CalloutCard>
      </section>

      <Separator />

      {/* 6. Management Commands */}
      <section aria-labelledby="management">
        <h2
          id="management"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Managing Installed Plugins
        </h2>

        <div className="space-y-3">
          <CodeBlock
            code="/plugin"
            language="bash"
            title="Open the plugin manager"
          />
          <CodeBlock
            code="/plugin marketplace update"
            language="bash"
            title="Refresh marketplace listings"
          />
          <CodeBlock
            code="claude plugin validate ."
            language="bash"
            title="Validate plugin structure (useful when building your own)"
          />
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>
            Review installed plugins periodically — uninstall plugins you are no
            longer using.
          </p>
          <p>Check for plugin errors in the /plugin Errors tab.</p>
          <p>
            Plugin skills are namespaced, so multiple plugins can coexist
            without conflicts.
          </p>
        </div>
      </section>

      <Separator />

      {/* 7. Batch Install & Checklist */}
      <section aria-labelledby="starter-set">
        <h2
          id="starter-set"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Recommended Starter Set
        </h2>

        <CodeBlock
          code={BATCH_INSTALL}
          language="bash"
          title="Batch install recommended plugins"
        />

        <div className="mt-6">
          <CodeBlock
            code={APPROVAL_CHECKLIST}
            language="markdown"
            title="Plugin Approval Checklist (copy for your team)"
          />
        </div>
      </section>

      {/* Governance */}
      <CalloutCard variant="info" title="Governance">
        Before installing any new plugin, follow the approval process in the AI
        Governance Policy (Section 1.5). Official marketplace plugins have a
        lower barrier; third-party plugins and those with external API
        connections require additional review of data handling and credentials.
      </CalloutCard>
    </div>
  );
}
