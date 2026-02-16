import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CodeBlock } from '@/components/content/CodeBlock';
import { PromptExample } from '@/components/content/PromptExample';
import { CalloutCard } from '@/components/content/CalloutCard';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

interface McpRecommendation {
  name: string;
  whatItDoes: string;
  whyItMatters: string;
  configJson: string;
  examplePrompt: string;
  securityNote?: string;
  extraNote?: string;
}

const recommendedMcps: McpRecommendation[] = [
  {
    name: 'deepwiki',
    whatItDoes:
      'Provides access to documentation for open-source projects directly within Claude Code. Instead of Claude relying on its training data (which may be outdated), deepwiki fetches current documentation from the project\u2019s actual source.',
    whyItMatters:
      'When working with WordPress plugins, ASP.NET libraries, or any third-party dependency, Claude can look up the current documentation rather than guessing from potentially outdated training data. This reduces hallucination risk significantly.',
    configJson: `{
  "mcpServers": {
    "deepwiki": {
      "command": "npx",
      "args": ["-y", "@anthropic/deepwiki-mcp"]
    }
  }
}`,
    examplePrompt:
      'Look up the current documentation for [library name] using deepwiki before implementing this feature. Check for any breaking changes since the version we are currently using.',
    extraNote:
      'Context7 (covered in Section 1.14 as a plugin) provides similar documentation lookup functionality. deepwiki is a standalone MCP server; Context7 is available as both an MCP server and an official plugin. Choose one \u2014 running both is redundant and doubles the context cost.',
  },
  {
    name: 'Playwright (chrome-devtools)',
    whatItDoes:
      'Gives Claude Code the ability to control a web browser \u2014 navigate to pages, click elements, fill forms, take screenshots, and run end-to-end tests. The Playwright MCP server from Microsoft is the standard browser automation tool for Claude Code.',
    whyItMatters:
      'Phew! builds web applications (LMS, Audit System, PDMS). Browser automation enables Claude to test pages visually, verify CSS changes, and run regression checks against live or staging environments \u2014 complementing or replacing Ghost Inspector workflows (see Section 1.12).',
    configJson: `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}`,
    examplePrompt:
      'Open the staging site at [URL], navigate to the login page, and take a screenshot. Compare the layout against the design spec.',
    securityNote:
      'The Playwright MCP gives Claude full browser control. It can navigate to any URL, submit forms, and interact with authenticated sessions. Use it only on staging/development environments, never on production with real user data.',
  },
];

interface ContextCostRow {
  feature: string;
  whenItLoads: string;
  contextCost: string;
  mitigation: string;
}

const contextCostRows: ContextCostRow[] = [
  {
    feature: 'MCP server (tool definitions)',
    whenItLoads: 'Session start',
    contextCost: 'Every request (up to 10% with tool search)',
    mitigation: 'Disconnect unused servers',
  },
  {
    feature: 'MCP tool invocation',
    whenItLoads: 'When Claude calls the tool',
    contextCost: 'One-off per call (input + output)',
    mitigation: 'Keep tool outputs focused',
  },
  {
    feature: 'Multiple MCP servers',
    whenItLoads: 'Session start (all at once)',
    contextCost: 'Cumulative \u2014 each adds to the 10% budget',
    mitigation: 'Only connect what you need',
  },
];

interface TroubleshootingItem {
  issue: string;
  steps: string[];
}

const troubleshootingItems: TroubleshootingItem[] = [
  {
    issue: 'Claude stopped using my MCP tool',
    steps: [
      'Run /mcp to check server status.',
      'If disconnected, restart Claude Code or reconfigure the server.',
      'If connected but unused, try explicitly asking: "Use the [server name] MCP tool to..."',
    ],
  },
  {
    issue: 'My MCP server won\u2019t start',
    steps: [
      'Check the command and arguments in your .mcp.json \u2014 typos are common.',
      'For stdio servers: verify the package is installed (npx downloads on first run, but can fail with network issues).',
      'For HTTP/SSE servers: verify the URL is reachable from your machine.',
      'Check environment variables: echo $VAR_NAME to confirm they are set.',
    ],
  },
  {
    issue: 'MCP is consuming too much context',
    steps: [
      'Run /mcp \u2014 it shows token cost per server.',
      'Disconnect servers you are not currently using.',
      'Consider whether a plugin might be more context-efficient than a standalone MCP server.',
    ],
  },
  {
    issue: 'Claude is hallucinating MCP results',
    steps: [
      'This can happen when an MCP server silently disconnects.',
      'Run /mcp to verify connection status.',
      'If disconnected, treat any "results" Claude provided after the disconnection as unreliable.',
      'Reconnect and re-run the operation.',
    ],
  },
];

interface ExtensionComparison {
  need: string;
  use: string;
  why: string;
}

const extensionComparisons: ExtensionComparison[] = [
  {
    need: 'Connect to an external API or service',
    use: 'MCP server',
    why: 'MCP is the protocol for external connections',
  },
  {
    need: 'Give Claude knowledge about how to use a service well',
    use: 'Skill (possibly combined with MCP)',
    why: 'Skills provide context and workflows; MCP provides the connection',
  },
  {
    need: 'Run a deterministic automation on every file edit',
    use: 'Hook',
    why: 'Hooks run outside the agentic loop \u2014 no LLM involved',
  },
  {
    need: 'Package MCP + skills + hooks together for the team',
    use: 'Plugin',
    why: 'Plugins bundle multiple extension types into one installable unit',
  },
];

const GENERIC_HTTP_TEMPLATE = `{
  "mcpServers": {
    "service-name": {
      "type": "http",
      "url": "https://your-service-url.com/mcp",
      "headers": {
        "Authorization": "Bearer \${YOUR_API_TOKEN}"
      }
    }
  }
}`;

const GENERIC_STDIO_TEMPLATE = `{
  "mcpServers": {
    "service-name": {
      "command": "npx",
      "args": ["-y", "@scope/package-name"]
    }
  }
}`;

const SAFETY_CHECKLIST = `## MCP Safety Checklist

Before adding a new MCP server:
- [ ] What credentials does it need? Where will they be stored?
- [ ] Is \`.mcp.json\` in \`.gitignore\`? (if it contains credential references)
- [ ] Has this server been approved under the governance policy?
- [ ] What data can this server access? Is that scope appropriate?

During use:
- [ ] Run \`/mcp\` at the start of each session to verify connections
- [ ] Run \`/mcp\` if Claude stops using an MCP tool unexpectedly
- [ ] Disconnect servers when no longer needed for the current task

After use:
- [ ] Remove MCP servers from config if no longer needed
- [ ] Rotate any API tokens that were used
- [ ] Document which MCP servers are active in the project README or CLAUDE.md`;

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function McpUsageSection() {
  return (
    <div className="flex flex-col gap-12">
      {/* 1. What Are MCP Servers */}
      <section aria-labelledby="what-are-mcps">
        <h2
          id="what-are-mcps"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          What Are MCP Servers?
        </h2>
        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            MCP (Model Context Protocol) is the standard way to connect Claude
            Code to external services. Without MCP, Claude can read and write
            files, run commands, and search the web &mdash; but it cannot query
            your database, control a browser, or pull documentation from a
            third-party source. MCP servers bridge that gap.
          </p>
          <p>
            An MCP server is a small programme that runs alongside Claude Code
            and exposes &ldquo;tools&rdquo; &mdash; specific actions Claude can
            take. When you connect a Context7 MCP server, Claude gains a tool to
            look up documentation. When you connect a Playwright MCP server,
            Claude gains tools to open a browser, navigate to pages, take
            screenshots, and interact with elements.
          </p>
          <p>
            The tool naming convention is{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              mcp__&lt;server-name&gt;__&lt;tool-name&gt;
            </code>{' '}
            (e.g.,{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              mcp__context7__query-docs
            </code>
            ).
          </p>
        </div>

        {/* Simple architecture diagram */}
        <div className="mt-6 flex flex-col items-center gap-4 rounded-lg border border-border bg-muted/20 p-6 sm:flex-row sm:justify-center sm:gap-8">
          <div className="rounded-md border border-border bg-background px-4 py-2 text-center text-sm">
            <p className="font-medium">Context7</p>
            <p className="text-xs text-muted-foreground">
              Documentation lookup
            </p>
          </div>
          <div className="hidden text-muted-foreground sm:block">&larr;</div>
          <div className="text-muted-foreground sm:hidden">&uarr;</div>
          <div className="rounded-md border-2 border-primary/50 bg-primary/5 px-6 py-3 text-center">
            <p className="font-semibold text-primary">Claude Code</p>
            <p className="text-xs text-muted-foreground">Your session</p>
          </div>
          <div className="hidden text-muted-foreground sm:block">&rarr;</div>
          <div className="text-muted-foreground sm:hidden">&darr;</div>
          <div className="rounded-md border border-border bg-background px-4 py-2 text-center text-sm">
            <p className="font-medium">Playwright</p>
            <p className="text-xs text-muted-foreground">Browser automation</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* 2. Context Cost */}
      <section aria-labelledby="context-cost">
        <h2
          id="context-cost"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          How MCP Affects Your Context Window
        </h2>

        <CalloutCard variant="warning" className="mb-4">
          MCP server tool definitions load at <strong>session start</strong> and
          stay in context for
          <strong> every request</strong>. Tool search loads up to{' '}
          <strong>10% of the context window</strong>. More servers = less space
          for your conversation and code.
        </CalloutCard>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium">Feature</th>
                <th className="pb-2 pr-4 font-medium">When it loads</th>
                <th className="pb-2 pr-4 font-medium">Context cost</th>
                <th className="pb-2 font-medium">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {contextCostRows.map((row) => (
                <tr key={row.feature} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">{row.feature}</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {row.whenItLoads}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {row.contextCost}
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {row.mitigation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">
              Check your current MCP context cost:
            </strong>{' '}
            Run{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/mcp</code>{' '}
            &mdash; it shows token usage per server.
          </p>
          <p>
            If Claude seems to be losing track of earlier context, check whether
            MCP tools are consuming too much of your window.
          </p>
        </div>
      </section>

      <Separator />

      {/* 3. Configuration */}
      <section aria-labelledby="setup">
        <h2
          id="setup"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Setting Up an MCP Server
        </h2>

        <div className="mb-4 max-w-prose text-sm text-muted-foreground">
          <p className="mb-2">
            MCP servers can be configured at three levels, with local taking
            precedence:
          </p>
          <ol className="list-inside list-decimal space-y-1">
            <li>
              <strong className="text-foreground">Local</strong> (
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                .mcp.json
              </code>{' '}
              in the project root) &mdash; applies to this project only
            </li>
            <li>
              <strong className="text-foreground">Project</strong> (
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                .claude/settings.json
              </code>
              ) &mdash; shared with the team via version control
            </li>
            <li>
              <strong className="text-foreground">User</strong> (
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                ~/.claude/settings.json
              </code>
              ) &mdash; applies to all your projects
            </li>
          </ol>
        </div>

        <div className="space-y-4">
          <CodeBlock
            code={GENERIC_STDIO_TEMPLATE}
            language="json"
            title="stdio server (runs as a local process)"
          />
          <CodeBlock
            code={GENERIC_HTTP_TEMPLATE}
            language="json"
            title="HTTP/SSE server (connects to a remote service)"
          />
        </div>

        <CalloutCard
          variant="info"
          title="Node.js required for npx"
          className="mt-4"
        >
          Most MCP servers use{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npx</code> to
          launch, which requires <strong>Node.js</strong> to be installed on
          your machine. If your main development stack is .NET, C#, or another
          non-Node language, you will still need Node.js installed to run MCP
          servers &mdash; even if you never use it for your own projects.
          Install the latest LTS version from{' '}
          <a
            href="https://nodejs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            nodejs.org
          </a>{' '}
          and verify with{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            node --version
          </code>{' '}
          in your terminal.
        </CalloutCard>

        <CalloutCard
          variant="warning"
          title="Never hard-code credentials"
          className="mt-4"
        >
          Use environment variable references (
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            ${'{'}VAR_NAME{'}'}
          </code>
          ) in your .mcp.json. Claude Code expands these at runtime.
        </CalloutCard>
      </section>

      <Separator />

      {/* 4. Recommended MCPs */}
      <section aria-labelledby="recommended">
        <h2
          id="recommended"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Recommended MCPs for Phew!
        </h2>

        <div className="space-y-6">
          {recommendedMcps.map((mcp) => (
            <div
              key={mcp.name}
              className="rounded-lg border border-border p-4 sm:p-6"
            >
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-base font-semibold">{mcp.name}</h3>
                <Badge variant="default" className="text-xs">
                  Recommended
                </Badge>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">
                {mcp.whatItDoes}
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                <strong className="text-foreground">
                  Why it matters for Phew!:
                </strong>{' '}
                {mcp.whyItMatters}
              </p>

              <CodeBlock
                code={mcp.configJson}
                language="json"
                title={`Configuration: ${mcp.name}`}
              />

              <div className="mt-4">
                <PromptExample
                  title={`Example: ${mcp.name}`}
                  prompt={mcp.examplePrompt}
                />
              </div>

              {mcp.securityNote && (
                <CalloutCard variant="warning" className="mt-4">
                  {mcp.securityNote}
                </CalloutCard>
              )}

              {mcp.extraNote && (
                <CalloutCard variant="info" className="mt-4">
                  {mcp.extraNote}
                </CalloutCard>
              )}
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* 4b. Discovering MCP Servers */}
      <section aria-labelledby="discovering-mcps">
        <h2
          id="discovering-mcps"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Discovering MCP Servers
        </h2>

        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            The MCP ecosystem is growing quickly. Beyond the two recommended
            servers above, there are hundreds of community-built MCP servers
            covering databases, cloud services, project management tools, and
            more. Here is how to find them.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-border/50 px-4 py-3">
            <h4 className="text-sm font-medium">Official MCP Registry</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              The{' '}
              <a
                href="https://github.com/modelcontextprotocol/servers"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Model Context Protocol servers repository
              </a>{' '}
              on GitHub maintains a curated list of official and community MCP
              servers. The registry is still growing, but it is the best
              starting point for finding well-maintained servers. Check the
              README for servers categorised by function (databases, browsers,
              APIs, etc.).
            </p>
          </div>

          <div className="rounded-lg border border-border/50 px-4 py-3">
            <h4 className="text-sm font-medium">GitHub Search</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Search GitHub for{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                mcp-server-
              </code>{' '}
              to find community-built servers. Most MCP server repositories
              follow the naming convention{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                mcp-server-[service-name]
              </code>
              . Check the repository&rsquo;s stars, recent activity, and
              documentation quality before adopting &mdash; as with any
              open-source dependency.
            </p>
          </div>

          <div className="rounded-lg border border-border/50 px-4 py-3">
            <h4 className="text-sm font-medium">
              Claude Code Plugin Marketplace
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Run{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                claude plugin list
              </code>{' '}
              in your terminal to browse officially supported plugins, many of
              which bundle MCP servers with pre-configured skills and hooks.
              Plugins are the easiest way to add MCP functionality because they
              handle configuration automatically.
            </p>
          </div>

          <div className="rounded-lg border border-border/50 px-4 py-3">
            <h4 className="text-sm font-medium">Community Recommendations</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              The{' '}
              <a
                href="https://discord.gg/anthropic"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Anthropic Discord
              </a>{' '}
              has active channels where developers share MCP servers they have
              built or found useful. Developer forums, Reddit (r/ClaudeAI), and
              X/Twitter are also good sources for discovering new servers as the
              ecosystem evolves.
            </p>
          </div>
        </div>

        <CalloutCard
          variant="tip"
          title="Evaluate before you install"
          className="mt-4"
        >
          Every MCP server you add consumes context and has access to your
          environment. Before installing a new server, ask: Does this need to
          run locally or is a hosted HTTP server available? What permissions
          does it require? Is it actively maintained? Run it in a test project
          first before adding it to production workflows.
        </CalloutCard>
      </section>

      <Separator />

      {/* 5. Safety */}
      <section aria-labelledby="safety">
        <h2
          id="safety"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Safety Considerations
        </h2>

        <CalloutCard variant="warning" title="Silent Failures" className="mb-4">
          <p className="text-sm italic">
            &ldquo;MCP connections can fail silently mid-session. If a server
            disconnects, its tools disappear without warning. Claude may try to
            use a tool that no longer exists.&rdquo;
          </p>
          <p className="mt-2 text-sm">
            This is the single most important safety concern. When an MCP server
            disconnects, Claude does not receive an error message. The tools
            simply stop appearing. Claude may then attempt a different approach,
            hallucinate a result, or fail silently.
          </p>
        </CalloutCard>

        <div className="space-y-4">
          <div className="rounded-lg border border-border/50 px-4 py-3">
            <h4 className="text-sm font-medium">Tool Disappearance</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              When an MCP server disconnects, all its tools vanish. There is no
              notification, no error in the chat, no visual indicator. If you
              are relying on a tool for a multi-step workflow and the server
              drops between steps, Claude will complete the next step without
              that tool &mdash; potentially using incorrect assumptions.
            </p>
          </div>
          <div className="rounded-lg border border-border/50 px-4 py-3">
            <h4 className="text-sm font-medium">Context Cost Creep</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Every MCP server you leave connected consumes context space on
              every single request. Even if you connected a server hours ago for
              a one-off task, it is still costing you tokens. Run{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">/mcp</code>{' '}
              to check what is connected and how much each server costs.
            </p>
          </div>
          <div className="rounded-lg border border-border/50 px-4 py-3">
            <h4 className="text-sm font-medium">Credential Exposure</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              MCP servers that require authentication need API tokens or
              credentials. These must be stored as environment variables, never
              hard-coded in configuration files committed to version control.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <CodeBlock
            code={SAFETY_CHECKLIST}
            language="markdown"
            title="MCP Safety Checklist (copy for your team)"
          />
        </div>
      </section>

      <Separator />

      {/* 6. Troubleshooting */}
      <section aria-labelledby="troubleshooting">
        <h2
          id="troubleshooting"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Troubleshooting MCP Issues
        </h2>

        <Accordion type="single" collapsible>
          {troubleshootingItems.map((item) => (
            <AccordionItem key={item.issue} value={item.issue}>
              <AccordionTrigger className="text-sm">
                &ldquo;{item.issue}&rdquo;
              </AccordionTrigger>
              <AccordionContent>
                <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                  {item.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Separator />

      {/* 7. MCP vs Other Extensions */}
      <section aria-labelledby="mcp-vs-others">
        <h2
          id="mcp-vs-others"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          MCP vs Other Extension Options
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium">Need</th>
                <th className="pb-2 pr-4 font-medium">Use</th>
                <th className="pb-2 font-medium">Why</th>
              </tr>
            </thead>
            <tbody>
              {extensionComparisons.map((row) => (
                <tr key={row.need} className="border-b border-border/50">
                  <td className="py-2 pr-4 text-muted-foreground">
                    {row.need}
                  </td>
                  <td className="py-2 pr-4 font-medium">{row.use}</td>
                  <td className="py-2 text-muted-foreground">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          See{' '}
          <strong className="text-foreground">
            Section 1.4 (Skills &amp; Extensions Decision Tree)
          </strong>{' '}
          for the full comparison.
        </p>
      </section>

      {/* 8. Governance */}
      <CalloutCard variant="info" title="Governance">
        Before adding any new MCP server, follow the approval process in the AI
        Governance Policy (Section 1.5). The governance policy covers: who can
        approve new MCP connections, what security review is required, how to
        document which MCP servers are in use, and periodic review of connected
        servers.
      </CalloutCard>

      <div className="mt-4">
        <CodeBlock
          code="/mcp"
          language="bash"
          title="Check MCP server status"
        />
      </div>
    </div>
  );
}
