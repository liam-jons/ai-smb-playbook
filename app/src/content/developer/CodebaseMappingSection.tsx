import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CodeBlock } from '@/components/content/CodeBlock';
import { CalloutCard } from '@/components/content/CalloutCard';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

interface MapperDocument {
  name: string;
  filename: string;
  coversWhat: string;
  whyItMatters: string;
  exampleSnippet: string;
}

const mapperDocuments: MapperDocument[] = [
  {
    name: 'Technology Stack',
    filename: 'STACK.md',
    coversWhat:
      'Languages, runtime, frameworks, key dependencies, build tooling, platform requirements.',
    whyItMatters:
      'Tells Claude what technologies run the codebase, so it makes recommendations compatible with the existing stack.',
    exampleSnippet: `# Technology Stack

**Analysis Date:** 2026-02-14

## Languages

**Primary:**
- TypeScript 5.3 - All application code

**Secondary:**
- JavaScript - Build scripts, config files

## Runtime

**Environment:**
- Node.js 20.x (LTS)

**Package Manager:**
- npm 10.x
- Lockfile: \`package-lock.json\` present

## Frameworks

**Core:**
- Next.js 14 - Full-stack React framework

**Testing:**
- Vitest 1.0 - Unit tests`,
  },
  {
    name: 'External Integrations',
    filename: 'INTEGRATIONS.md',
    coversWhat:
      'APIs, databases, file storage, auth providers, monitoring, CI/CD, webhooks.',
    whyItMatters:
      'Documents what lives outside the codebase \u2014 external services, credentials (environment variable names, not values), and integration patterns.',
    exampleSnippet: `# External Integrations

## APIs

**Stripe (Payment Processing):**
- Usage: Subscription management, checkout
- Auth: API key via \`STRIPE_SECRET_KEY\` env var
- Endpoints used: /v1/subscriptions, /v1/checkout/sessions
- Webhook: /api/webhooks/stripe (signature verification enabled)

## Data Storage

**PostgreSQL 15:**
- Connection: \`DATABASE_URL\` env var
- ORM: Prisma 5.x
- Migrations: \`prisma migrate dev\``,
  },
  {
    name: 'Architecture',
    filename: 'ARCHITECTURE.md',
    coversWhat:
      'Overall pattern, conceptual layers, data flow, key abstractions, entry points, error handling, cross-cutting concerns.',
    whyItMatters:
      'Tells Claude how the code is organised at a conceptual level \u2014 where to put new features, how layers depend on each other, and what patterns to follow.',
    exampleSnippet: `# Architecture

## Pattern Overview

Monolithic MVC with service layer separation.

## Layers

1. **Routes/Controllers** - HTTP handling, input validation
2. **Services** - Business logic, orchestration
3. **Repositories** - Data access, queries
4. **Models** - Data shapes, validation schemas

## Data Flow

Request \u2192 Middleware \u2192 Controller \u2192 Service \u2192 Repository \u2192 Database
                                                       \u2193
Response \u2190 Controller \u2190 Service \u2190 Result`,
  },
  {
    name: 'Codebase Structure',
    filename: 'STRUCTURE.md',
    coversWhat:
      'Directory layout (ASCII tree), directory purposes, key file locations, naming conventions, where to add new code, special/generated directories.',
    whyItMatters:
      'Answers "where do I put this?" \u2014 the most common question when adding new code. Claude can navigate directly to the right location.',
    exampleSnippet: `# Codebase Structure

\`\`\`
src/
\u251c\u2500\u2500 app/              # Next.js app router pages
\u251c\u2500\u2500 components/       # Shared React components
\u2502   \u251c\u2500\u2500 ui/           # Base UI components (shadcn)
\u2502   \u2514\u2500\u2500 features/     # Feature-specific components
\u251c\u2500\u2500 lib/              # Shared utilities and config
\u251c\u2500\u2500 services/         # Business logic
\u2514\u2500\u2500 types/            # TypeScript type definitions
\`\`\`

## Where to Add New Code

| Adding... | Put it in... |
|-----------|-------------|
| New page | \`src/app/[route]/page.tsx\` |
| Shared component | \`src/components/ui/\` |
| Business logic | \`src/services/\` |`,
  },
  {
    name: 'Coding Conventions',
    filename: 'CONVENTIONS.md',
    coversWhat:
      'Naming patterns, code style, import organisation, error handling, logging, comments, function/module design.',
    whyItMatters:
      'Ensures Claude writes code that matches the existing style. Prescriptive guidance rather than descriptive.',
    exampleSnippet: `# Coding Conventions

## Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | \`UserProfile.tsx\` |
| Utilities | kebab-case | \`format-date.ts\` |
| Functions | camelCase | \`getUserById()\` |
| Constants | UPPER_SNAKE | \`MAX_RETRIES\` |

## Error Handling

- Services return Result<T, Error> types
- Controllers wrap in try/catch as safety net
- Never silently swallow errors`,
  },
  {
    name: 'Testing Patterns',
    filename: 'TESTING.md',
    coversWhat:
      'Test framework, file organisation, test structure, mocking approach, fixtures, coverage requirements, test types.',
    whyItMatters:
      'Claude needs to know how tests are written in this project so it can add matching tests for new code.',
    exampleSnippet: `# Testing Patterns

## Framework

- **Runner:** Vitest
- **Assertion:** Built-in (expect)
- **Mocking:** vi.mock() for modules, vi.fn() for functions

## File Organisation

Tests live alongside source files:
- \`UserProfile.tsx\` \u2192 \`UserProfile.test.tsx\`
- \`format-date.ts\` \u2192 \`format-date.test.ts\`

## Test Structure

\`\`\`typescript
describe('UserService', () => {
  it('creates a user with valid input', async () => {
    // Arrange
    // Act
    // Assert
  });
});
\`\`\``,
  },
  {
    name: 'Codebase Concerns',
    filename: 'CONCERNS.md',
    coversWhat:
      'Technical debt, known bugs, security considerations, performance bottlenecks, fragile areas, scaling limits, dependencies at risk, missing features, test coverage gaps.',
    whyItMatters:
      'The most actionable document. Issues identified here can become future work items. Each concern includes file paths, impact assessment, and a suggested fix approach.',
    exampleSnippet: `# Codebase Concerns

## Technical Debt

**Duplicated webhook handling:**
- Issue: Stripe webhook verification duplicated in 3 endpoints
- Files: \`app/api/webhooks/stripe/route.ts\`,
         \`app/api/webhooks/checkout/route.ts\`,
         \`app/api/webhooks/subscription/route.ts\`
- Impact: Security risk if one endpoint misses verification
- Fix: Create shared middleware in \`lib/stripe/validate-webhook.ts\`

## Security Considerations

**Missing rate limiting on auth endpoints:**
- Files: \`app/api/auth/login/route.ts\`
- Impact: Brute force vulnerability
- Fix: Add rate limiting middleware (e.g., upstash/ratelimit)`,
  },
];

interface AgentInfo {
  agent: number;
  focusArea: string;
  documentsProduced: string[];
}

const agents: AgentInfo[] = [
  {
    agent: 1,
    focusArea: 'Tech \u2014 technology stack and external integrations',
    documentsProduced: ['STACK.md', 'INTEGRATIONS.md'],
  },
  {
    agent: 2,
    focusArea: 'Arch \u2014 architecture and file structure',
    documentsProduced: ['ARCHITECTURE.md', 'STRUCTURE.md'],
  },
  {
    agent: 3,
    focusArea: 'Quality \u2014 coding conventions and testing patterns',
    documentsProduced: ['CONVENTIONS.md', 'TESTING.md'],
  },
  {
    agent: 4,
    focusArea: 'Concerns \u2014 technical debt and issues',
    documentsProduced: ['CONCERNS.md'],
  },
];

interface MapperToDocsMapping {
  mapperOutput: string;
  feedsInto: string;
}

const mapperToDocs: MapperToDocsMapping[] = [
  {
    mapperOutput: 'STACK.md',
    feedsInto: '/docs root or CLAUDE.md tech stack section',
  },
  { mapperOutput: 'INTEGRATIONS.md', feedsInto: 'docs/integrations/' },
  { mapperOutput: 'ARCHITECTURE.md', feedsInto: 'docs/architecture/' },
  { mapperOutput: 'STRUCTURE.md', feedsInto: 'CLAUDE.md (directory overview)' },
  { mapperOutput: 'CONVENTIONS.md', feedsInto: 'docs/conventions/' },
  {
    mapperOutput: 'TESTING.md',
    feedsInto: 'docs/conventions/ or dedicated testing docs',
  },
  {
    mapperOutput: 'CONCERNS.md',
    feedsInto: 'Tech debt tracker or docs/exec-plans/',
  },
];

interface UsageMapping {
  activity: string;
  loads: string;
}

const usageMappings: UsageMapping[] = [
  {
    activity: 'Planning UI/frontend work',
    loads: 'CONVENTIONS.md, STRUCTURE.md',
  },
  {
    activity: 'Planning API/backend work',
    loads: 'ARCHITECTURE.md, CONVENTIONS.md',
  },
  { activity: 'Planning database changes', loads: 'ARCHITECTURE.md, STACK.md' },
  { activity: 'Writing tests', loads: 'TESTING.md, CONVENTIONS.md' },
  { activity: 'Working with integrations', loads: 'INTEGRATIONS.md, STACK.md' },
  { activity: 'Refactoring or cleanup', loads: 'CONCERNS.md, ARCHITECTURE.md' },
  { activity: 'Setting up configuration', loads: 'STACK.md, STRUCTURE.md' },
];

const FLOW_DIAGRAM = `1. You run:  /gsd:map-codebase
2. Orchestrator creates .planning/codebase/ directory
3. Orchestrator spawns 4 agents in parallel:
   \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
   \u2502 Agent 1  \u2502  \u2502 Agent 2  \u2502  \u2502 Agent 3  \u2502  \u2502 Agent 4  \u2502
   \u2502  (tech)  \u2502  \u2502  (arch)  \u2502  \u2502(quality) \u2502  \u2502(concerns)\u2502
   \u2502          \u2502  \u2502          \u2502  \u2502          \u2502  \u2502          \u2502
   \u2502 Explores \u2502  \u2502 Explores \u2502  \u2502 Explores \u2502  \u2502 Explores \u2502
   \u2502 stack,   \u2502  \u2502 patterns,\u2502  \u2502 style,   \u2502  \u2502 debt,    \u2502
   \u2502 deps,    \u2502  \u2502 layers,  \u2502  \u2502 linting, \u2502  \u2502 bugs,    \u2502
   \u2502 APIs     \u2502  \u2502 files    \u2502  \u2502 tests    \u2502  \u2502 security \u2502
   \u2502          \u2502  \u2502          \u2502  \u2502          \u2502  \u2502          \u2502
   \u2502 Writes:  \u2502  \u2502 Writes:  \u2502  \u2502 Writes:  \u2502  \u2502 Writes:  \u2502
   \u2502 STACK.md \u2502  \u2502ARCH...md \u2502  \u2502CONV...md \u2502  \u2502CONC...md \u2502
   \u2502 INTEG.md \u2502  \u2502STRUC..md \u2502  \u2502TEST...md \u2502  \u2502          \u2502
   \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
4. Orchestrator collects confirmations (NOT contents)
5. Orchestrator verifies all 7 documents exist
6. Orchestrator commits the codebase map`;

const gettingStartedSteps = [
  {
    step: 1,
    title: 'Navigate to your project',
    description: 'Open Claude Code in the root of the project you want to map.',
  },
  {
    step: 2,
    title: 'Run the command',
    description:
      'Execute /gsd:map-codebase. Optionally specify a focus area: /gsd:map-codebase api',
  },
  {
    step: 3,
    title: 'Wait for agents to complete',
    description:
      'The orchestrator will spawn 4 agents and show progress. This typically takes 2\u20135 minutes depending on codebase size.',
  },
  {
    step: 4,
    title: 'Review the output',
    description:
      'The mapper creates .planning/codebase/ with 7 documents. Review each one for accuracy.',
  },
  {
    step: 5,
    title: 'Edit and refine',
    description:
      'Correct inaccuracies, add business context the mapper could not discover, remove sections that are not applicable.',
  },
];

const whenToUse = [
  'When onboarding to an unfamiliar codebase (the primary use case for Phew!)',
  'Before major refactoring (understand current state first)',
  'After significant changes (refresh the codebase understanding)',
  'When existing documentation is outdated or missing',
];

const whenToSkip = [
  'Greenfield projects with no code yet (nothing to map)',
  'Trivial codebases with fewer than 5 files',
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function CodebaseMappingSection() {
  return (
    <div className="flex flex-col gap-12">
      {/* Opening */}
      <section aria-labelledby="what-is-mapping">
        <h2
          id="what-is-mapping"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          What Is Codebase Mapping?
        </h2>
        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Most codebases &mdash; especially ones that have grown organically
            over years &mdash; lack comprehensive, up-to-date documentation.
            When you ask Claude to work on a project, it can only act on what it
            can see in its context window. If the codebase has no documentation,
            Claude has to explore from scratch every session.
          </p>
          <p>
            Codebase mapping solves this by using AI agents to systematically
            explore a codebase and produce structured documentation. The output
            becomes a permanent reference &mdash; both for Claude and for the
            human team.
          </p>
          <p>
            The <strong className="text-foreground">gsd-codebase-mapper</strong>{' '}
            is a ready-to-use tool included in the starter kit. It produces 7
            structured documents covering every aspect of a codebase: technology
            stack, integrations, architecture, file structure, coding
            conventions, testing patterns, and concerns (technical debt, bugs,
            security issues).
          </p>
        </div>

        <CalloutCard variant="info" title="For Phew!" className="mt-6">
          This is directly relevant to your existing projects. Whether it is a
          WordPress site, an ASP.NET/C# application, or a new project, running
          the mapper creates a comprehensive baseline understanding that
          persists across sessions.
        </CalloutCard>
      </section>

      <Separator />

      {/* Common Mapper Inaccuracies */}
      <CalloutCard
        variant="important"
        title="Common Mapper Inaccuracies — Always Verify"
      >
        <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm">
          <li>
            <strong>Dependency versions</strong> — mapper may report outdated or
            incorrect version numbers (always check{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              package.json
            </code>{' '}
            or{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              .csproj
            </code>
            )
          </li>
          <li>
            <strong>Dead code detection</strong> — mapper may flag code as
            unused when it is actually called dynamically or via reflection
          </li>
          <li>
            <strong>Architecture boundaries</strong> — mapper may misidentify
            module boundaries or service layers, especially in monolithic
            codebases
          </li>
          <li>
            <strong>Test coverage claims</strong> — mapper estimates may not
            match actual coverage reports
          </li>
        </ul>
        <p className="mt-3 text-sm">
          Treat mapper output as a first draft, not a source of truth. Review
          each document against the actual codebase before sharing with the
          team.
        </p>
      </CalloutCard>

      {/* The 7 Output Documents */}
      <section aria-labelledby="output-documents">
        <h2
          id="output-documents"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          The 7 Output Documents
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Each document covers a specific aspect of your codebase. Full
          templates are available in the starter kit.
        </p>

        <Accordion type="single" collapsible>
          {mapperDocuments.map((doc) => (
            <AccordionItem key={doc.filename} value={doc.filename}>
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {doc.filename}
                  </Badge>
                  <span className="text-sm">{doc.name}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Covers:</strong>{' '}
                  {doc.coversWhat}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Why it matters:</strong>{' '}
                  {doc.whyItMatters}
                </p>
                <CodeBlock
                  code={doc.exampleSnippet}
                  language="markdown"
                  title={`Example: ${doc.filename}`}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Separator />

      {/* Parallel Architecture */}
      <section aria-labelledby="architecture">
        <h2
          id="architecture"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          How It Works: The 4-Agent Parallel Architecture
        </h2>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium">Agent</th>
                <th className="pb-2 pr-4 font-medium">Focus Area</th>
                <th className="pb-2 font-medium">Documents Produced</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a.agent} className="border-b border-border/50">
                  <td className="py-2 pr-4">
                    <Badge variant="secondary" className="text-xs">
                      Agent {a.agent}
                    </Badge>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {a.focusArea}
                  </td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-1">
                      {a.documentsProduced.map((doc) => (
                        <Badge
                          key={doc}
                          variant="outline"
                          className="text-xs font-mono"
                        >
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3 rounded-lg border border-border/50 px-4 py-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div>
              <p className="text-sm font-medium">
                Each agent gets its own full 200k token context
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                The orchestrator delegates to specialised agents, each of which
                can explore deeply within its focus area. This is the same
                principle from the training: breaking work into subtasks gives
                each subtask the full token allocation.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-border/50 px-4 py-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div>
              <p className="text-sm font-medium">
                Agents write documents directly
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Each agent writes output directly to{' '}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  .planning/codebase/
                </code>
                . The orchestrator never receives the document contents &mdash;
                only a brief confirmation. This keeps the orchestrator&apos;s
                context clean.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-border/50 px-4 py-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div>
              <p className="text-sm font-medium">Agents run in parallel</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                All 4 agents are spawned simultaneously. The mapping completes
                in roughly the time it takes the slowest agent &mdash; a few
                minutes for a typical codebase.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <CodeBlock
            code={FLOW_DIAGRAM}
            language="text"
            title="Parallel agent architecture"
          />
        </div>
      </section>

      <Separator />

      {/* Running the Mapper */}
      <section aria-labelledby="running-mapper">
        <h2
          id="running-mapper"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Running the Mapper: Step-by-Step
        </h2>

        <div className="mb-6 space-y-4">
          {gettingStartedSteps.map((step) => (
            <div key={step.step} className="flex gap-4">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                  'bg-primary/10 text-primary',
                )}
              >
                {step.step}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <CodeBlock
            code="/gsd:map-codebase"
            language="bash"
            title="Run the mapper"
          />
          <CodeBlock
            code="/gsd:map-codebase api"
            language="bash"
            title="Run with a focus area"
          />
          <CodeBlock
            code="ls -la .planning/codebase/"
            language="bash"
            title="Review the output"
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-success/30 bg-success-muted/50 p-4">
            <h4 className="mb-2 text-sm font-medium text-success-muted-foreground">
              When to use
            </h4>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
              {whenToUse.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h4 className="mb-2 text-sm font-medium">When to skip</h4>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
              {whenToSkip.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Separator />

      {/* Connection to /docs */}
      <section aria-labelledby="docs-connection">
        <h2
          id="docs-connection"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Connecting to the /docs Structure
        </h2>
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          The mapper&apos;s output becomes the seed content for the /docs
          structure described in Section 1.9. After running the mapper, move the
          relevant content into your /docs directories and update CLAUDE.md to
          point to it.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium">Mapper Output</th>
                <th className="pb-2 font-medium">Feeds Into</th>
              </tr>
            </thead>
            <tbody>
              {mapperToDocs.map((m) => (
                <tr key={m.mapperOutput} className="border-b border-border/50">
                  <td className="py-2 pr-4">
                    <Badge variant="outline" className="text-xs font-mono">
                      {m.mapperOutput}
                    </Badge>
                  </td>
                  <td className="py-2 text-muted-foreground">{m.feedsInto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Separator />

      {/* How Other Commands Use Output */}
      <section aria-labelledby="usage-by-commands">
        <h2
          id="usage-by-commands"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          How Other Commands Use the Output
        </h2>
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          These documents are not just for human reference &mdash; they are
          consumed by other Claude commands and workflows. The quality of the
          mapper output directly affects the quality of Claude&apos;s future
          work on the project.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium">
                  When Claude is&hellip;
                </th>
                <th className="pb-2 font-medium">It loads&hellip;</th>
              </tr>
            </thead>
            <tbody>
              {usageMappings.map((u) => (
                <tr key={u.activity} className="border-b border-border/50">
                  <td className="py-2 pr-4 text-muted-foreground">
                    {u.activity}
                  </td>
                  <td className="py-2">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {u.loads}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CalloutCard variant="info">
        The mapper output is a starting point, not a finished product. Review
        each document, correct inaccuracies, and it becomes your baseline for
        the /docs structure described in{' '}
        <strong>Section 1.9 &mdash; Documentation Structure</strong>.
      </CalloutCard>
    </div>
  );
}
