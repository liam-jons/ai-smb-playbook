import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CodeBlock } from '@/components/content/CodeBlock';
import { PromptExample } from '@/components/content/PromptExample';
import { CalloutCard } from '@/components/content/CalloutCard';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

interface DocsDirectory {
  name: string;
  path: string;
  whatToPut: string[];
  exampleFiles: string[];
  whyUseful: string;
  whatDoesNotBelong: string;
}

const docsDirectories: DocsDirectory[] = [
  {
    name: 'architecture',
    path: 'docs/architecture/',
    whatToPut: [
      'System architecture overview: how the major parts of the system connect',
      'Domain model: key entities and their relationships',
      'Data flow: how data moves through the system (request lifecycle, event flow)',
      'Deployment architecture: how the system is deployed, what infrastructure it uses',
    ],
    exampleFiles: ['overview.md', 'domain-model.md', 'data-flow.md'],
    whyUseful: 'When asked to add a new feature, Claude can read the architecture doc to understand where the new code should live, what patterns to follow, and how it connects to existing systems.',
    whatDoesNotBelong: 'Line-by-line code walkthroughs, implementation details that change frequently, or anything that duplicates what is already clear from reading the code itself.',
  },
  {
    name: 'conventions',
    path: 'docs/conventions/',
    whatToPut: [
      'Coding standards: naming conventions, file structure rules, import ordering',
      'PR conventions: commit message format, review process, branch naming',
      'Pattern library: "when you need to do X, here is the pattern we use"',
      'Error handling conventions: how errors are handled, logged, and surfaced',
    ],
    exampleFiles: ['code-style.md', 'patterns.md', 'git-workflow.md'],
    whyUseful: 'Consistency. Instead of Claude guessing your conventions by reading a few files, it reads a clear specification and follows it everywhere.',
    whatDoesNotBelong: 'Generic advice that applies to any project. Only project-specific conventions belong here.',
  },
  {
    name: 'integrations',
    path: 'docs/integrations/',
    whatToPut: [
      'Documentation for each third-party service the project uses',
      'API keys and how they are managed (not the keys themselves \u2014 the process)',
      'Common gotchas and workarounds for each integration',
      'Rate limits, retry strategies, fallback behaviour',
    ],
    exampleFiles: ['stripe.md', 'sendgrid.md'],
    whyUseful: 'Third-party integrations are where hallucinations are most likely. Claude\u2019s training data may include outdated API signatures. Your integration docs tell Claude exactly how your project uses each service, with current API patterns.',
    whatDoesNotBelong: 'Full vendor documentation. Link to that instead; focus on how your project uses the service.',
  },
  {
    name: 'schemas',
    path: 'docs/schemas/',
    whatToPut: [
      'Database schemas: tables, columns, relationships, constraints',
      'API schemas: request/response formats for your endpoints',
      'Data dictionaries: what each field means in business terms',
    ],
    exampleFiles: ['database.md', 'api-endpoints.md'],
    whyUseful: 'When writing database queries or API handlers, Claude can reference the actual schema instead of inferring it from code. This drastically reduces errors in data access code.',
    whatDoesNotBelong: 'Auto-generated schema dumps without context. Add business-level annotations.',
  },
  {
    name: 'references',
    path: 'docs/references/',
    whatToPut: [
      'LLM-ready documentation for external tools and frameworks (llms.txt files)',
      'Local copies of critical external documentation Claude needs to write correct code',
      'Condensed API references for frameworks used in the project',
    ],
    exampleFiles: ['nextjs-llms.txt', 'supabase-llms.txt'],
    whyUseful: 'Claude\u2019s training data has a cutoff date. If your project uses a framework that has changed since that cutoff, an llms.txt file gives Claude current, accurate documentation. The context7 MCP (Section 1.14) can also fetch these dynamically, but local copies are available offline and cost no API calls.',
    whatDoesNotBelong: 'Full vendor documentation sites. Use condensed, LLM-ready versions instead.',
  },
];

interface MaintenanceLevel {
  level: number;
  title: string;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'outline';
  description: string;
  details: string[];
}

const maintenanceLevels: MaintenanceLevel[] = [
  {
    level: 1,
    title: 'Manual Updates',
    badge: 'Start Here',
    badgeVariant: 'default',
    description: 'The simplest approach: when you change something, update the docs.',
    details: [
      'PR checklist item: "If this change affects architecture, conventions, schemas, or integrations, update the relevant doc."',
      'Session habit: Run /revise-claude-md at the end of productive sessions to capture learnings.',
    ],
  },
  {
    level: 2,
    title: 'Agent-Driven Doc Gardening',
    badge: 'Intermediate',
    badgeVariant: 'secondary',
    description: 'Use Claude itself to maintain documentation. Run periodic reviews where Claude reads the code and the docs, identifies discrepancies, and proposes updates.',
    details: [
      'Monthly or before a major project phase.',
      'Claude reads the code and the docs, identifies discrepancies, and proposes updates.',
      'Use the doc gardening prompt below.',
    ],
  },
  {
    level: 3,
    title: 'CI-Based Verification',
    badge: 'Advanced',
    badgeVariant: 'outline',
    description: 'Automated CI jobs that validate documentation is up to date, cross-linked, and structured correctly.',
    details: [
      'A linter that checks all files referenced in CLAUDE.md actually exist.',
      'A check that schema docs match the actual database schema.',
      'A freshness check that flags docs not updated in the last N months.',
      'This is aspirational for now \u2014 worth considering when your documentation set is large enough.',
    ],
  },
];

const whatNotToDocument = [
  { title: 'Obvious code structure', description: 'If it is clear from reading the code, do not duplicate it in docs. The purpose of docs is to capture what the code does not tell you.' },
  { title: 'Generic programming advice', description: '"Use meaningful variable names" is not project documentation. Only document conventions specific to your project.' },
  { title: 'Frequently changing implementation details', description: 'If a piece of code changes weekly, documenting its specifics creates maintenance burden. Document the pattern, not the instance.' },
  { title: 'Everything', description: 'Completeness is not the goal. Impact is. A small set of accurate, useful docs beats a large set of stale, overwhelming docs.' },
];

const gettingStartedPhases = [
  { phase: 1, title: 'Scaffold the structure', time: '5 minutes', description: 'Create the directories. Even empty directories signal intent and give Claude a place to look.' },
  { phase: 2, title: 'Generate initial documentation', time: '30 minutes', description: 'Use the gsd-codebase-mapper (Section 1.10) to analyse your existing codebase and generate structured documents. This gives you a substantial starting point.' },
  { phase: 3, title: 'Add high-value content first', time: '1\u20132 hours over a week', description: 'Prioritise: conventions (highest per-token impact), schemas (prevents data-layer hallucinations), integration gotchas, and an architecture overview.' },
  { phase: 4, title: 'Maintain incrementally', time: 'Ongoing', description: 'Build documentation into normal work. When you fix a bug caused by undocumented behaviour, document it. When you add an integration, add a doc.' },
];

const SCAFFOLD_COMMAND = 'mkdir -p docs/architecture docs/conventions docs/integrations docs/schemas docs/references';

const CLAUDE_MD_POINTERS = `## Documentation

For deeper reference, see the \`/docs\` directory:

- \`docs/architecture/\` \u2014 System architecture, domain model, data flow
- \`docs/conventions/\` \u2014 Coding standards, naming patterns, PR conventions
- \`docs/integrations/\` \u2014 Third-party service documentation
- \`docs/schemas/\` \u2014 Database schemas, API request/response schemas
- \`docs/references/\` \u2014 LLM-ready external docs (llms.txt files)`;

const ARCHITECTURE_TEMPLATE = `# Architecture Overview

## System Type

[e.g., "Full-stack web application with React frontend and Node.js API backend"]

## High-Level Components

\`\`\`
[Client Browser]
    \u2193 HTTPS
[React Frontend] \u2190 Static files served by [CDN/Vercel]
    \u2193 API calls
[Node.js API Server]
    \u2193 queries
[PostgreSQL Database]
    \u2193 events
[Background Workers]
\`\`\`

## Key Directories

| Directory | Purpose |
|-----------|---------|
| \`src/frontend/\` | React application |
| \`src/api/\` | API route handlers and middleware |
| \`src/services/\` | Business logic layer |
| \`src/models/\` | Database models and queries |
| \`src/workers/\` | Background job processors |

## Request Lifecycle

1. Browser sends request to API endpoint.
2. Middleware handles: CORS, authentication, rate limiting.
3. Route handler validates input (Zod schema).
4. Handler calls service layer for business logic.
5. Service layer queries database via model layer.
6. Response shaped and returned as JSON.

## Key Architectural Decisions

- **Monorepo:** Frontend and backend in a single repository for deployment simplicity.
- **Service layer:** All business logic lives in \`src/services/\`. Route handlers are thin.
- **No ORM:** Raw SQL with parameterised queries via \`pg\` library.

## See Also

- \`docs/conventions/patterns.md\` \u2014 Code patterns and conventions
- \`docs/schemas/database.md\` \u2014 Database schema`;

const CONVENTIONS_TEMPLATE = `# Code Style Conventions

## Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Files (components) | PascalCase | \`UserProfile.tsx\` |
| Files (utilities) | kebab-case | \`format-date.ts\` |
| Functions | camelCase | \`getUserById()\` |
| Constants | UPPER_SNAKE | \`MAX_RETRY_COUNT\` |
| Types/Interfaces | PascalCase | \`UserProfile\`, \`ApiResponse\` |
| Database columns | snake_case | \`created_at\`, \`user_id\` |

## Error Handling

- Services return \`Result<T, Error>\` types \u2014 never throw.
- Route handlers wrap service calls in try/catch as a safety net.
- All errors are logged with context (user ID, request ID, operation).
- User-facing error messages are generic. Detailed errors go to logs only.

## Import Order

1. Node.js built-ins (\`fs\`, \`path\`)
2. External packages (\`express\`, \`zod\`)
3. Internal absolute imports (\`@/services/\`, \`@/utils/\`)
4. Relative imports (\`./helpers\`, \`../types\`)

Blank line between each group.`;

const ARCHITECTURE_TEMPLATE_ASPNET = `# Architecture Overview

## System Type

ASP.NET MVC application with a service layer pattern.

## Request Lifecycle

1. HTTP request \u2192 Kestrel \u2192 Middleware pipeline
2. Routing \u2192 Controller action
3. Controller \u2192 Service (business logic)
4. Service \u2192 Repository/DbContext (data access)
5. Response flows back through middleware (logging, error handling, CORS)

## Key Patterns

- Repository pattern for data access
- Dependency injection via \`IServiceCollection\`
- Options pattern for configuration (\`IOptions<T>\`)

## Key Directories

| Directory | Purpose |
|-----------|---------|
| \`Controllers/\` | API and MVC controllers |
| \`Services/\` | Business logic layer |
| \`Models/\` | Domain models and DTOs |
| \`Data/\` | DbContext and data access |
| \`Views/\` | Razor views (if MVC) |

## See Also

- \`docs/conventions/code-style.md\` \u2014 Coding standards
- \`docs/schemas/database.md\` \u2014 Database schema`;

const CONVENTIONS_TEMPLATE_ASPNET = `# Code Style Conventions

## Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Public members | PascalCase | \`GetUserById()\` |
| Private fields | _camelCase | \`_userRepository\` |
| Classes | PascalCase | \`UserProfile.cs\` |
| Interfaces | IPascalCase | \`IUserService\` |
| Constants | PascalCase | \`MaxRetryCount\` |
| Database columns | PascalCase (EF default) | \`CreatedAt\`, \`UserId\` |

## Key Rules

- One class per file, file name matches class name
- Controllers return \`IActionResult\` or \`ActionResult<T>\`
- Services return \`Result<T>\` \u2014 never throw for expected failures
- All database queries use parameterised queries via EF Core or Dapper`;

const PROGRESSIVE_DISCLOSURE_FLOW = `Session starts
    \u2193
Claude reads CLAUDE.md (~150 lines, loaded automatically)
    \u2193
Claude understands: project overview, commands, architecture summary, key gotchas
    \u2193
User asks: "Add a new API endpoint for user preferences"
    \u2193
Claude reads docs/architecture/overview.md \u2192 understands where API routes live
Claude reads docs/conventions/patterns.md \u2192 follows existing endpoint pattern
Claude reads docs/schemas/api-endpoints.md \u2192 matches existing response format
Claude reads docs/integrations/stripe.md \u2192 (only if the feature touches Stripe)
    \u2193
Claude writes code that fits the existing codebase`;

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function DocumentationSection() {
  return (
    <div className="flex flex-col gap-12">
      {/* 1. Why Documentation Structure Matters */}
      <section aria-labelledby="why-doc-structure">
        <h2 id="why-doc-structure" className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
          Why Documentation Structure Matters for AI
        </h2>

        <CalloutCard variant="important" className="mb-6">
          <p className="text-sm italic">
            &ldquo;From the agent&apos;s point of view, anything it can&apos;t access in-context effectively doesn&apos;t exist.&rdquo;
          </p>
        </CalloutCard>

        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Knowledge that lives in Slack threads, Google Docs, team meetings, or people&apos;s heads is
            invisible to Claude. It cannot access any of it. The only knowledge Claude can use is what
            exists in the repository: code, markdown files, configuration, schemas.
          </p>
          <p>
            This means documentation is not just for humans any more &mdash; it is a direct input to the
            quality of Claude&apos;s output. A well-documented codebase produces better AI-assisted code.
            A poorly-documented one produces guesswork. This approach is informed by patterns shared by
            engineering teams at organisations like OpenAI, who found that concise, structured project
            documentation significantly improves AI code generation quality.
          </p>
          <p>
            If your team aligned on an architectural pattern in a Slack discussion last month, Claude
            does not know about it. Every piece of undocumented tribal knowledge is a source of errors
            when Claude writes code.
          </p>
        </div>

        <CalloutCard variant="info" title="For Phew!" className="mt-6">
          Most teams do not have extensive documentation, and that is normal. The goal is not to document
          everything overnight &mdash; it is to build a lightweight structure that grows incrementally and
          pays for itself through better AI output.
        </CalloutCard>
      </section>

      <Separator />

      {/* 2. The Recommended /docs Structure */}
      <section aria-labelledby="docs-structure">
        <h2 id="docs-structure" className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
          The Recommended /docs Structure
        </h2>

        <CodeBlock
          code={`docs/\n\u251c\u2500\u2500 architecture/        # System architecture, domain model, data flow\n\u251c\u2500\u2500 conventions/         # Coding standards, naming patterns, PR conventions\n\u251c\u2500\u2500 integrations/        # Third-party service documentation\n\u251c\u2500\u2500 schemas/             # Database schemas, API request/response schemas\n\u2514\u2500\u2500 references/          # LLM-ready external docs (llms.txt files)`}
          language="text"
          title="Recommended /docs directory"
        />

        <Accordion type="multiple" className="mt-6">
          {docsDirectories.map((dir) => (
            <AccordionItem key={dir.name} value={dir.name}>
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-normal">{dir.path}</code>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div>
                  <h4 className="mb-1 text-sm font-medium">What to put here:</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {dir.whatToPut.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-medium">Example files:</h4>
                  <div className="flex flex-wrap gap-2">
                    {dir.exampleFiles.map((file) => (
                      <Badge key={file} variant="outline" className="text-xs font-normal">{file}</Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-md border border-emerald-500/30 bg-emerald-50/50 px-3 py-2 dark:bg-emerald-950/20">
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">What makes this useful for Claude:</p>
                  <p className="text-xs text-muted-foreground">{dir.whyUseful}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    <strong>What does NOT belong here:</strong> {dir.whatDoesNotBelong}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Separator />

      {/* 3. Progressive Disclosure */}
      <section aria-labelledby="progressive-disclosure">
        <h2 id="progressive-disclosure" className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
          Progressive Disclosure: How CLAUDE.md and /docs Work Together
        </h2>

        <div className="mb-6 max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            CLAUDE.md is loaded into context automatically at session start. It costs tokens. Keep it short.
            The /docs files are <strong className="text-foreground">not</strong> loaded automatically &mdash; Claude
            reads them on demand, when it needs them. CLAUDE.md tells Claude what exists and where to find it.
            /docs contains the actual detail.
          </p>
        </div>

        <CodeBlock
          code={PROGRESSIVE_DISCLOSURE_FLOW}
          language="text"
          title="How Claude navigates your documentation"
        />

        <CalloutCard variant="tip" className="mt-4">
          Claude reads documentation on a need-to-know basis. A task about the frontend never loads the
          database schema doc. This is efficient &mdash; the right information is available without crowding
          out the task.
        </CalloutCard>
      </section>

      <Separator />

      {/* 4. Getting Started */}
      <section aria-labelledby="getting-started-docs">
        <h2 id="getting-started-docs" className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
          Getting Started: From Zero to a Working /docs Structure
        </h2>

        <div className="space-y-6">
          {gettingStartedPhases.map((phase) => (
            <div key={phase.phase} className="flex gap-4">
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                'bg-primary/10 text-primary'
              )}>
                {phase.phase}
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{phase.title}</p>
                  <Badge variant="outline" className="text-xs">{phase.time}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{phase.description}</p>
                {phase.phase === 1 && (
                  <div className="mt-3">
                    <CodeBlock code={SCAFFOLD_COMMAND} language="bash" title="Create the directory structure" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <CalloutCard variant="info" className="mt-6">
          For a complete guide to running the codebase mapper and using its output,
          see <strong>Section 1.10 &mdash; Codebase Mapping</strong>.
        </CalloutCard>
      </section>

      <Separator />

      {/* 5. Maintenance */}
      <section aria-labelledby="maintenance">
        <h2 id="maintenance" className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
          Keeping Documentation Current
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {maintenanceLevels.map((level) => (
            <div key={level.level} className="flex flex-col rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant={level.badgeVariant} className="text-xs">{level.badge}</Badge>
              </div>
              <h3 className="mb-1 text-sm font-medium">Level {level.level}: {level.title}</h3>
              <p className="mb-3 text-xs text-muted-foreground">{level.description}</p>
              <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                {level.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <CalloutCard variant="tip" className="mt-6">
          <strong>Recommendation for Phew!:</strong> Start with Level 1. It costs nothing and provides
          immediate value. Move to Level 2 when the team is comfortable with the /docs structure.
          Level 3 is worth considering only when the documentation set is large enough to warrant
          automated checks.
        </CalloutCard>
      </section>

      <Separator />

      {/* 6. What NOT to Document */}
      <section aria-labelledby="what-not-to-document">
        <h2 id="what-not-to-document" className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
          What NOT to Document
        </h2>

        <div className="space-y-3">
          {whatNotToDocument.map((item) => (
            <div key={item.title} className="flex gap-3 rounded-lg border border-border/50 px-4 py-3">
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-destructive/60" />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <CalloutCard variant="info" className="mt-4">
          <strong>The litmus test:</strong> Before writing a doc, ask: &ldquo;If Claude reads this, will it produce better
          code on this project?&rdquo; If yes, write it. If it is generic knowledge Claude already has from
          training, skip it.
        </CalloutCard>
      </section>

      <Separator />

      {/* 7. Copyable Content */}
      <section aria-labelledby="doc-templates">
        <h2 id="doc-templates" className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
          Copyable Templates
        </h2>

        <div className="space-y-6">
          <PromptExample
            title="Doc Gardening Prompt"
            description="Run a documentation review session to check for staleness and gaps."
            prompt={`Review the documentation in /docs against the current codebase. For each doc file:\n1. Check if the information is still accurate (compare against actual code).\n2. Identify any gaps \u2014 things that exist in the code but are not documented.\n3. Flag any stale content that no longer reflects reality.\n\nOutput a summary of what needs updating, then propose specific changes as diffs. Wait for my approval before making any edits.`}
            whenToUse="Monthly, or before a major project phase."
          />

          <CodeBlock
            code={CLAUDE_MD_POINTERS}
            language="markdown"
            title="CLAUDE.md Documentation Pointers section (paste into your CLAUDE.md)"
          />

          <div>
            <h3 className="mb-3 text-base font-medium">Architecture Overview Example</h3>
            <Tabs defaultValue="arch-nodejs">
              <TabsList>
                <TabsTrigger value="arch-nodejs">Node.js / React</TabsTrigger>
                <TabsTrigger value="arch-aspnet">ASP.NET / C#</TabsTrigger>
              </TabsList>
              <TabsContent value="arch-nodejs" className="mt-4">
                <CodeBlock code={ARCHITECTURE_TEMPLATE} language="markdown" title="Example: docs/architecture/overview.md (Node.js)" />
              </TabsContent>
              <TabsContent value="arch-aspnet" className="mt-4">
                <CodeBlock code={ARCHITECTURE_TEMPLATE_ASPNET} language="markdown" title="Example: docs/architecture/overview.md (ASP.NET)" />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <h3 className="mb-3 text-base font-medium">Code Style Conventions Example</h3>
            <Tabs defaultValue="conv-nodejs">
              <TabsList>
                <TabsTrigger value="conv-nodejs">Node.js / React</TabsTrigger>
                <TabsTrigger value="conv-aspnet">ASP.NET / C#</TabsTrigger>
              </TabsList>
              <TabsContent value="conv-nodejs" className="mt-4">
                <CodeBlock code={CONVENTIONS_TEMPLATE} language="markdown" title="Example: docs/conventions/code-style.md (Node.js)" />
              </TabsContent>
              <TabsContent value="conv-aspnet" className="mt-4">
                <CodeBlock code={CONVENTIONS_TEMPLATE_ASPNET} language="markdown" title="Example: docs/conventions/code-style.md (ASP.NET)" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <CalloutCard variant="info" title="llms.txt">
        Many popular frameworks now publish <code className="rounded bg-muted px-1 py-0.5 text-xs">llms.txt</code>{' '}
        or <code className="rounded bg-muted px-1 py-0.5 text-xs">llms-full.txt</code> files &mdash; condensed
        documentation designed for AI consumption. When available, these are a significant quality improvement.
        Check your framework&apos;s website or the <strong>context7</strong> MCP (Section 1.14) for dynamic lookups.
      </CalloutCard>
    </div>
  );
}
