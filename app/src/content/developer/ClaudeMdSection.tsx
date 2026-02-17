import { Link } from 'react-router';
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
import { PromptExample } from '@/components/content/PromptExample';
import { CalloutCard } from '@/components/content/CalloutCard';
import { useTrack } from '@/hooks/useTrack';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

interface FileType {
  type: string;
  location: string;
  purpose: string;
  shared: string;
}

const fileTypes: FileType[] = [
  {
    type: 'Project root',
    location: './CLAUDE.md',
    purpose: 'Primary project context',
    shared: 'Yes (checked into git)',
  },
  {
    type: 'Local overrides',
    location: './.claude.local.md',
    purpose: 'Personal/local settings',
    shared: 'No (gitignored)',
  },
  {
    type: 'Global defaults',
    location: '~/.claude/CLAUDE.md',
    purpose: 'User-wide defaults',
    shared: 'Personal only',
  },
  {
    type: 'Package-specific',
    location: './packages/*/CLAUDE.md',
    purpose: 'Module-level context in monorepos',
    shared: 'Yes',
  },
  {
    type: 'Subdirectory',
    location: 'Any nested location',
    purpose: 'Feature/domain-specific context',
    shared: 'Yes',
  },
];

interface ClaudeMdSectionEntry {
  title: string;
  description: string;
  example: string;
}

const claudeMdSections: ClaudeMdSectionEntry[] = [
  {
    title: 'Project Description',
    description:
      '1\u20133 lines explaining what this project is, in plain language.',
    example: `# My LMS Platform\n\nA learning management system built with ASP.NET Core and React, serving safeguarding training for UK organisations.`,
  },
  {
    title: 'Commands',
    description:
      'The essential build/test/dev/lint/deploy commands. Present as a table for scannability. Every command must be copy-paste ready.',
    example: `## Commands\n\n| Command | Description |\n|---------|-------------|\n| \`dotnet run\` | Start development server |\n| \`dotnet test\` | Run test suite |\n| \`npm run build:css\` | Rebuild Tailwind CSS |`,
  },
  {
    title: 'Architecture',
    description:
      'A tree-style overview of the project structure with one-line descriptions of each directory. Not exhaustive \u2014 just the key directories. Point to /docs/architecture/ for deeper detail.',
    example: `## Architecture\n\n\`\`\`\nsrc/\n  Controllers/   # API endpoints\n  Services/      # Business logic\n  Models/        # Data models and DTOs\n  Views/         # Razor pages\nwwwroot/         # Static assets\ntests/           # Unit and integration tests\n\`\`\``,
  },
  {
    title: 'Key Files',
    description:
      'Entry points, configuration files, and any files a developer needs to know about that are not obvious from the directory structure.',
    example: `## Key Files\n\n- \`src/Program.cs\` \u2014 Application entry point\n- \`src/appsettings.json\` \u2014 Base configuration\n- \`.env.local\` \u2014 Local environment variables (not committed)`,
  },
  {
    title: 'Code Style',
    description:
      'Project-specific conventions only. Not "use meaningful variable names" \u2014 things like: "we use camelCase for functions", "all API routes return typed responses".',
    example: `## Code Style\n\n- PascalCase for public members, camelCase for private\n- API responses typed with record classes\n- Error handling uses Result pattern in services\n- Prefer named exports over default exports`,
  },
  {
    title: 'Environment',
    description:
      'Required environment variables, setup steps, any prerequisites. Include the "no real users" note for development environments.',
    example: `## Environment\n\nRequired variables (see .env.example):\n\n| Variable | Purpose |\n|----------|--------|\n| \`CONNECTION_STRING\` | SQL Server connection |\n| \`SMTP_HOST\` | Email server |\n\n**Note:** This is a development environment. There are no real users. Test data can be created and deleted freely.`,
  },
  {
    title: 'Testing',
    description:
      'Test runner, how to run tests, testing conventions, any non-obvious testing patterns.',
    example: `## Testing\n\n- \`dotnet test\` \u2014 Run all tests (xUnit)\n- Tests live in \`tests/\` alongside the source structure\n- Use \`IClassFixture<T>\` for shared test context\n- Integration tests use a test database (see TestDbFixture)`,
  },
  {
    title: 'Gotchas',
    description:
      'Non-obvious things that cause issues. This is often the most valuable section \u2014 it captures knowledge that is not obvious from reading the code.',
    example: `## Gotchas\n\n- The auth module must be initialised before any API calls \u2014 see src/Services/AuthService.cs\n- Database migrations require manual approval in production\n- Hot reload does not pick up changes to appsettings.local.json \u2014 restart the dev server`,
  },
  {
    title: 'Workflow',
    description:
      'Development workflow patterns. When to use which branch, how deployments work, PR conventions.',
    example: `## Workflow\n\n- Feature branches from \`develop\`, PRs reviewed before merge\n- Staging deploys automatically on merge to \`develop\`\n- Production deploys require manual approval via Azure DevOps`,
  },
  {
    title: 'Documentation Pointers',
    description:
      'Links to /docs/ subdirectories for deeper reference. This is the "map" part.',
    example: `## Documentation Pointers\n\nFor deeper reference, see the /docs directory:\n\n- \`docs/architecture/\` \u2014 System architecture, domain model, data flow\n- \`docs/conventions/\` \u2014 Coding standards, naming patterns\n- \`docs/integrations/\` \u2014 Third-party service documentation\n- \`docs/schemas/\` \u2014 Database schemas, API schemas`,
  },
];

interface QualityCriterion {
  name: string;
  points: number;
  description: string;
  excellent: string;
  poor: string;
}

const qualityCriteria: QualityCriterion[] = [
  {
    name: 'Commands/Workflows',
    points: 20,
    description:
      'Are build, test, lint, and deploy commands documented and correct?',
    excellent:
      'All key commands present, copy-paste ready, with flags and options',
    poor: 'Missing or outdated commands',
  },
  {
    name: 'Architecture Clarity',
    points: 20,
    description: 'Does the file convey how the codebase is organised?',
    excellent:
      'Clear directory structure with explanations, key file locations',
    poor: 'No architecture overview or only a file dump',
  },
  {
    name: 'Non-Obvious Patterns',
    points: 15,
    description: 'Are gotchas, quirks, and non-obvious conventions captured?',
    excellent: 'Real gotchas that save debug time, specific to this project',
    poor: 'Generic advice or no gotchas section',
  },
  {
    name: 'Conciseness',
    points: 15,
    description:
      'Is the file appropriately sized? Does every line earn its place?',
    excellent: 'Under 200 lines, no filler, every section adds unique value',
    poor: 'Over 500 lines, verbose explanations, duplicated info',
  },
  {
    name: 'Currency',
    points: 15,
    description: 'Does the file reflect the current state of the codebase?',
    excellent: 'Commands work, file paths exist, patterns match actual code',
    poor: 'References deleted files, outdated commands, stale patterns',
  },
  {
    name: 'Actionability',
    points: 15,
    description:
      'Can a developer (or Claude) act on the instructions immediately?',
    excellent: 'Commands are copy-paste ready, instructions are executable',
    poor: 'Vague guidance like "set up the environment"',
  },
];

const COMPLETE_TEMPLATE = `# [Project Name]

[One-line description of what this project does.]

## Commands

| Command | Description |
|---------|-------------|
| \`npm install\` | Install dependencies |
| \`npm run dev\` | Start development server |
| \`npm run build\` | Production build |
| \`npm test\` | Run test suite |
| \`npm run lint\` | Lint and format check |

## Architecture

\`\`\`
src/
  components/     # React components
  hooks/          # Custom React hooks
  services/       # API and business logic
  utils/          # Shared utility functions
  types/          # TypeScript type definitions
  pages/          # Route-level page components
public/           # Static assets
tests/            # Test files
docs/             # Project documentation (see Documentation Pointers)
\`\`\`

## Key Files

- \`src/main.tsx\` \u2014 Application entry point
- \`src/routes.tsx\` \u2014 Route definitions
- \`.env.local\` \u2014 Local environment variables (not committed)

## Code Style

- TypeScript strict mode enabled
- Functions: camelCase. Components: PascalCase. Files: kebab-case for utilities, PascalCase for components
- API responses typed with Zod schemas at the boundary
- Prefer named exports over default exports
- Error handling: use Result pattern in services, try/catch at route level only

## Environment

Required variables (see \`.env.example\`):

| Variable | Purpose |
|----------|---------|
| \`DATABASE_URL\` | PostgreSQL connection string |
| \`API_KEY\` | Third-party API authentication |

Setup:
1. Copy \`.env.example\` to \`.env.local\`
2. Fill in values (credentials in team password manager)
3. Run \`npm install\`
4. Run \`npm run dev\`

**Note:** This is a development environment. There are no real users. Test data can be created and deleted freely.

## Testing

- \`npm test\` \u2014 Run all tests (Vitest)
- \`npm run test:watch\` \u2014 Watch mode
- \`npm run test:coverage\` \u2014 Coverage report
- Tests live alongside source files: \`Component.test.tsx\` next to \`Component.tsx\`
- Use \`vi.mock()\` for module mocks; prefer dependency injection over mocking where possible

## Gotchas

- The \`auth\` module must be initialised before any API calls \u2014 see \`src/services/auth.ts\`
- Database migrations run automatically in dev but require manual approval in production
- Hot reload does not pick up changes to \`.env.local\` \u2014 restart the dev server
- The legacy \`/api/v1/\` endpoints are still active but deprecated \u2014 all new work uses \`/api/v2/\`

## Documentation Pointers

For deeper reference, see the \`/docs\` directory:

- \`docs/architecture/\` \u2014 System architecture, domain model, data flow
- \`docs/conventions/\` \u2014 Coding standards, naming patterns, PR conventions
- \`docs/integrations/\` \u2014 Third-party service documentation (Stripe, SendGrid, etc.)
- \`docs/schemas/\` \u2014 Database schemas, API request/response schemas`;

const MINIMAL_TEMPLATE = `# [Project Name]

[One-line description.]

## Commands

| Command | Description |
|---------|-------------|
| \`[install command]\` | Install dependencies |
| \`[dev command]\` | Start development server |
| \`[test command]\` | Run tests |

## Architecture

\`\`\`
[Run \`tree -L 2 -d\` and paste the output here, then annotate key directories]
\`\`\`

## Gotchas

- [First non-obvious thing that trips people up]
- [Second thing]`;

const ASPNET_TEMPLATE = `# [Project Name]

[One-line description of what this project does.]

## Commands

| Command | Description |
|---------|-------------|
| \`dotnet build\` | Build the solution |
| \`dotnet run --project src/[ProjectName]\` | Start the application |
| \`dotnet test\` | Run all tests |
| \`dotnet ef database update\` | Apply database migrations |

## Architecture

\`\`\`
src/
  [ProjectName]/
    Controllers/        # API and MVC controllers
    Services/           # Business logic and service layer
    Models/             # Domain models and DTOs
    Data/               # DbContext and data access
    Views/              # Razor views (if MVC)
    wwwroot/            # Static files (CSS, JS, images)
tests/
  [ProjectName].Tests/  # Unit and integration tests
docs/                   # Project documentation
\`\`\`

## Key Files

- \`src/[ProjectName]/Program.cs\` \u2014 Application entry point and service configuration
- \`src/[ProjectName]/appsettings.json\` \u2014 Base configuration
- \`src/[ProjectName]/appsettings.Development.json\` \u2014 Development overrides
- \`src/[ProjectName]/[ProjectName].csproj\` \u2014 Project file and dependencies

## Code Style

- C# naming: PascalCase for public members, _camelCase for private fields
- Nullable reference types enabled (\`<Nullable>enable</Nullable>\`)
- Async/await throughout \u2014 all I/O operations are async
- Dependency injection via constructor injection (no service locator)
- Error handling: use Result pattern in services, try/catch at controller level only

## Environment

Required configuration (see \`appsettings.Development.json\`):

| Setting | Purpose |
|---------|---------|
| \`ConnectionStrings:DefaultConnection\` | SQL Server connection string |
| \`Authentication:JwtSecret\` | JWT signing key |

Setup:
1. Copy \`appsettings.Development.json.example\` to \`appsettings.Development.json\`
2. Fill in connection string and secrets
3. Run \`dotnet ef database update\` to create/update database
4. Run \`dotnet run --project src/[ProjectName]\`

**Note:** This is a development environment. There are no real users. Test data can be created and deleted freely.

## Testing

- \`dotnet test\` \u2014 Run all tests (xUnit)
- \`dotnet test --filter "Category=Integration"\` \u2014 Integration tests only
- Tests use \`IClassFixture<T>\` for shared test context (e.g., database setup)
- Use \`Substitute.For<T>()\` (NSubstitute) for mocking

## Gotchas

- The auth middleware must be registered before \`MapControllers()\` \u2014 see \`Program.cs\`
- Database migrations require manual approval in production
- Hot reload does not pick up changes to \`appsettings.*.json\` \u2014 restart the application
- The legacy \`/api/v1/\` endpoints are still active but deprecated \u2014 all new work uses \`/api/v2/\`

## Documentation Pointers

For deeper reference, see the \`/docs\` directory:
- \`docs/architecture/\` \u2014 System architecture, domain model, data flow
- \`docs/conventions/\` \u2014 Coding standards, naming patterns, PR conventions
- \`docs/integrations/\` \u2014 Third-party service documentation
- \`docs/schemas/\` \u2014 Database schemas, API request/response schemas`;

const bestPractices = [
  {
    title: 'Tech stack specifications',
    description:
      'Document your framework versions, key dependencies, and why they were chosen. Claude uses this to write compatible code.',
  },
  {
    title: 'Development commands',
    description:
      'Every command a developer needs, documented in one place. Include flags and options that matter.',
  },
  {
    title: 'Architecture references',
    description:
      'Point to where Claude can learn about your system architecture. Do not dump the full architecture into CLAUDE.md.',
  },
  {
    title: 'Authentication patterns',
    description:
      'How auth works in this project. Which endpoints are protected, how tokens are handled, where session management lives.',
  },
  {
    title: 'Database schemas',
    description:
      'Point to schema files or docs. Include any non-obvious relationships or conventions (e.g., "all tables use soft deletes").',
  },
  {
    title: '"No real users" note',
    description:
      'For development and staging environments, explicitly state: "This is a development environment. There are no real users. Test data can be created and deleted freely." This prevents Claude from being overly cautious with test data.',
  },
  {
    title: 'Keep it project-specific',
    description:
      'Do not include generic programming advice. If it would be true of any project, it does not belong in CLAUDE.md.',
  },
];

const gettingStartedSteps = [
  {
    step: 1,
    title: 'Create the file',
    description: 'Run `touch CLAUDE.md` in the project root.',
  },
  {
    step: 2,
    title: 'Start with commands',
    description:
      'What are the 3\u20135 commands someone needs to work on this project? Add them first.',
  },
  {
    step: 3,
    title: 'Add architecture',
    description:
      'Run `tree -L 2 -d` (or similar) and annotate the key directories with one-line descriptions.',
  },
  {
    step: 4,
    title: 'Add gotchas',
    description:
      'Think about the last time something confused you or a colleague. Write it down.',
  },
  {
    step: 5,
    title: 'Add documentation pointers',
    description:
      'If you have docs, reference them. If you do not (most projects), note that Section 1.10 covers setting up a /docs structure.',
  },
  {
    step: 6,
    title: 'Commit it',
    description:
      'CLAUDE.md should be checked into git so the whole team benefits.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ClaudeMdSection() {
  const { track } = useTrack();
  return (
    <div className="flex flex-col gap-12">
      {/* 1. What CLAUDE.md Files Are */}
      <section aria-labelledby="what-are-claude-md">
        <h2
          id="what-are-claude-md"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          What CLAUDE.md Files Are and Why They Matter
        </h2>
        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            CLAUDE.md is a markdown file you place in the root of a project (or
            in subdirectories). Claude Code reads it automatically at the start
            of every session. It gives Claude project-specific context: what the
            project is, how to build it, what patterns to follow, where things
            live.
          </p>
          <p>
            Without it, Claude starts every session blind. It can read your
            code, but it does not know your conventions, your commands, your
            architecture decisions, or your gotchas.
          </p>
        </div>

        <CalloutCard variant="tip" title="The impact" className="mt-6">
          A well-maintained CLAUDE.md is the single most impactful improvement
          you can make to Claude Code&apos;s output quality. It is cheap to
          create (15–30 minutes for a first version) and cheap to maintain (a
          few lines added per week). The difference: Claude stops asking
          &ldquo;how do I run this?&rdquo; and starts knowing.
        </CalloutCard>

        {/* File types table */}
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-medium">
            File Types and Where They Live
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th scope="col" className="pb-2 pr-4 font-medium">
                    Type
                  </th>
                  <th scope="col" className="pb-2 pr-4 font-medium">
                    Location
                  </th>
                  <th scope="col" className="pb-2 pr-4 font-medium">
                    Purpose
                  </th>
                  <th scope="col" className="pb-2 font-medium">
                    Shared?
                  </th>
                </tr>
              </thead>
              <tbody>
                {fileTypes.map((ft) => (
                  <tr key={ft.type} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">{ft.type}</td>
                    <td className="py-2 pr-4">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                        {ft.location}
                      </code>
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {ft.purpose}
                    </td>
                    <td className="py-2 text-muted-foreground">{ft.shared}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Claude auto-discovers CLAUDE.md files in parent directories, so
            monorepo structures work automatically.
          </p>
        </div>
      </section>

      <Separator />

      {/* 2. Map Not Encyclopedia */}
      <section aria-labelledby="map-not-encyclopedia">
        <h2
          id="map-not-encyclopedia"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          The &ldquo;Map, Not Encyclopedia&rdquo; Principle
        </h2>
        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            This is the single most important structural concept for CLAUDE.md
            files. Context is a scarce resource. A giant instruction file crowds
            out the task, the code, and the relevant docs. Too much guidance
            becomes non-guidance &mdash; when everything is
            &ldquo;important&rdquo;, nothing is.
          </p>
          <p>
            <strong className="text-foreground">The solution:</strong> Keep
            CLAUDE.md short (aim for under 500 lines, ideally under 200). Use it
            to tell Claude what this project is, how to run it, what patterns to
            follow, and where to find deeper documentation. Deeper documentation
            lives in a structured{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              /docs
            </code>{' '}
            folder (covered in detail in{' '}
            <Link
              to={`/${track}/documentation`}
              className="text-primary hover:underline"
            >
              Section 1.10 &mdash; Documentation Structure
            </Link>
            ).
          </p>
          <p className="text-sm">
            This approach is informed by patterns shared by engineering teams at
            organisations like OpenAI, who found that concise, pointer-based
            documentation outperforms encyclopedic files.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="before-after">
            <AccordionTrigger className="text-base font-medium">
              Before &amp; After: Bloated vs Well-Structured
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <h4 className="mb-2 font-medium text-destructive">
                    Before: 1,200 lines
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Tries to document every API endpoint, every database table,
                    every coding convention. Half of it is stale. Claude reads a
                    summary and misses the two lines that actually matter for
                    the current task.
                  </p>
                </div>
                <div className="rounded-lg border border-success/30 bg-success-muted/50 p-4">
                  <h4 className="mb-2 font-medium text-success-muted-foreground">
                    After: 150 lines
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Commands, architecture overview, key gotchas, and pointers
                    to{' '}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                      /docs/architecture/
                    </code>
                    ,{' '}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                      /docs/conventions/
                    </code>
                    ,{' '}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                      /docs/schemas/
                    </code>
                    . Claude reads all of it, then navigates to the specific doc
                    it needs.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <CalloutCard variant="info" title="IDE alternatives">
        Windsurf, Cursor, and Warp are IDE-integrated AI coding tools that also
        support CLAUDE.md files (or equivalent project context files). This
        playbook focuses on Claude Code as the primary supported interface for
        Phew!, but developers should feel free to experiment with alternatives.
        The principles covered here &mdash; concise documentation, structured
        context, the &ldquo;map not encyclopedia&rdquo; approach &mdash; apply
        regardless of the tool.
      </CalloutCard>

      <Separator />

      {/* 3. How to Structure */}
      <section aria-labelledby="structure">
        <h2
          id="structure"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          How to Structure a CLAUDE.md File
        </h2>

        <CalloutCard
          variant="important"
          title="Key Principles"
          className="mb-6"
        >
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>
              <strong>Be concise.</strong> One line per concept when possible.
              CLAUDE.md is part of the prompt &mdash; every line costs tokens.
            </li>
            <li>
              <strong>Be specific.</strong> Use actual file paths, real commands
              from this project.
            </li>
            <li>
              <strong>Be current.</strong> All information must reflect the
              actual codebase state.
            </li>
            <li>
              <strong>Be actionable.</strong> Commands should be copy-paste
              ready.
            </li>
          </ul>
        </CalloutCard>

        <p className="mb-4 text-sm text-muted-foreground">
          Include only sections that are relevant to your project &mdash; not
          all are needed for every project.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {claudeMdSections.map((section, index) => (
            <AccordionItem key={section.title} value={`section-${index}`}>
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs tabular-nums">
                    {index + 1}
                  </Badge>
                  {section.title}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  {section.description}
                </p>
                <CodeBlock
                  code={section.example}
                  language="markdown"
                  title={`Example: ${section.title}`}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Separator />

      {/* 4. Best Practices */}
      <section aria-labelledby="best-practices">
        <h2
          id="best-practices"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Best Practices from the Training
        </h2>
        <div className="space-y-3">
          {bestPractices.map((bp) => (
            <div
              key={bp.title}
              className="flex gap-3 rounded-lg border border-border/50 px-4 py-3"
            >
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">{bp.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {bp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* 5. Plugin Tools */}
      <section aria-labelledby="claude-md-plugin">
        <h2
          id="claude-md-plugin"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          The claude-md-management Plugin
        </h2>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="pb-2 pr-4 font-medium" />
                <th scope="col" className="pb-2 pr-4 font-medium">
                  claude-md-improver (skill)
                </th>
                <th scope="col" className="pb-2 font-medium">
                  /revise-claude-md (command)
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr>
                <td className="py-2 pr-4 font-medium">Purpose</td>
                <td className="py-2 pr-4 text-muted-foreground">
                  Keep CLAUDE.md aligned with codebase
                </td>
                <td className="py-2 text-muted-foreground">
                  Capture session learnings
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">When to use</td>
                <td className="py-2 pr-4 text-muted-foreground">
                  Periodic maintenance / audit
                </td>
                <td className="py-2 text-muted-foreground">
                  End of productive session
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Triggered by</td>
                <td className="py-2 pr-4 text-muted-foreground">
                  &ldquo;audit my CLAUDE.md&rdquo; or codebase changes
                </td>
                <td className="py-2 text-muted-foreground">
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    /revise-claude-md
                  </code>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Output</td>
                <td className="py-2 pr-4 text-muted-foreground">
                  Quality report with scores + proposed diffs
                </td>
                <td className="py-2 text-muted-foreground">
                  Proposed additions as diffs
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Tabs defaultValue="skill">
          <TabsList>
            <TabsTrigger value="skill">claude-md-improver</TabsTrigger>
            <TabsTrigger value="command">/revise-claude-md</TabsTrigger>
          </TabsList>
          <TabsContent value="skill" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              The skill runs a five-phase workflow to audit and improve your
              CLAUDE.md files:
            </p>
            <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Discovery</strong> &mdash;
                Finds all CLAUDE.md files in the project.
              </li>
              <li>
                <strong className="text-foreground">Quality Assessment</strong>{' '}
                &mdash; Scores each file against six criteria (see below).
                Assigns grades A&ndash;F.
              </li>
              <li>
                <strong className="text-foreground">Quality Report</strong>{' '}
                &mdash; Outputs a detailed report before making any changes.
              </li>
              <li>
                <strong className="text-foreground">Targeted Updates</strong>{' '}
                &mdash; Proposes specific additions as diffs, explaining why
                each helps.
              </li>
              <li>
                <strong className="text-foreground">Apply with Approval</strong>{' '}
                &mdash; Only edits files you approve.
              </li>
            </ol>

            {/* Quality criteria */}
            <Accordion type="multiple" className="mt-4">
              {qualityCriteria.map((criterion) => (
                <AccordionItem key={criterion.name} value={criterion.name}>
                  <AccordionTrigger>
                    <span className="flex items-center gap-2 text-sm">
                      <Badge
                        variant="secondary"
                        className="text-xs tabular-nums"
                      >
                        {criterion.points} pts
                      </Badge>
                      {criterion.name}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2 text-sm text-muted-foreground">
                      {criterion.description}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded border border-success/30 bg-success-muted/50 px-3 py-2">
                        <p className="text-xs font-medium text-success-muted-foreground">
                          Excellent
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {criterion.excellent}
                        </p>
                      </div>
                      <div className="rounded border border-destructive/30 bg-destructive/5 px-3 py-2">
                        <p className="text-xs font-medium text-destructive">
                          Poor
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {criterion.poor}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          <TabsContent value="command" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Best used at the end of a productive session. The workflow:
            </p>
            <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Reflect</strong> &mdash;
                Reviews the session for learnings: commands discovered, style
                patterns, testing approaches, gotchas encountered.
              </li>
              <li>
                <strong className="text-foreground">Find Files</strong> &mdash;
                Locates all CLAUDE.md files and decides where each addition
                belongs (CLAUDE.md for team-shared, .claude.local.md for
                personal).
              </li>
              <li>
                <strong className="text-foreground">Draft</strong> &mdash;
                Writes concise one-line additions. Avoids verbose explanations.
              </li>
              <li>
                <strong className="text-foreground">Show Changes</strong>{' '}
                &mdash; Presents each proposed addition as a diff with a brief
                explanation.
              </li>
              <li>
                <strong className="text-foreground">Apply</strong> &mdash; Only
                applies changes you approve.
              </li>
            </ol>
          </TabsContent>
        </Tabs>

        <CalloutCard variant="tip" title="Quick Shortcut" className="mt-6">
          During any Claude Code session, you can press the{' '}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono">
            #
          </kbd>{' '}
          key to have Claude automatically incorporate learnings into your
          CLAUDE.md file. This is the quickest way to capture context as you
          work.
        </CalloutCard>

        <div className="mt-4">
          <CodeBlock
            code="/plugin install claude-md-management"
            language="bash"
            title="Install the plugin"
          />
        </div>
      </section>

      <Separator />

      {/* 6. Getting Started */}
      <section aria-labelledby="getting-started">
        <h2
          id="getting-started"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Getting Started: Your First CLAUDE.md
        </h2>
        <p className="mb-6 max-w-prose text-base text-muted-foreground">
          A clear path from zero to a working CLAUDE.md in 15&ndash;30 minutes.
        </p>

        <div className="space-y-4">
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
              <div className="pt-1">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* 7. Copyable Templates */}
      <section aria-labelledby="templates">
        <h2
          id="templates"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Copyable Templates
        </h2>

        <Tabs defaultValue="complete">
          <TabsList>
            <TabsTrigger value="complete">Complete Template</TabsTrigger>
            <TabsTrigger value="minimal">Minimal (Quick Start)</TabsTrigger>
            <TabsTrigger value="aspnet">ASP.NET / C# Template</TabsTrigger>
          </TabsList>
          <TabsContent value="complete" className="mt-4">
            <CodeBlock
              code={COMPLETE_TEMPLATE}
              language="markdown"
              title="Complete CLAUDE.md Template"
            />
          </TabsContent>
          <TabsContent value="minimal" className="mt-4">
            <CodeBlock
              code={MINIMAL_TEMPLATE}
              language="markdown"
              title="Minimal CLAUDE.md Template"
            />
          </TabsContent>
          <TabsContent value="aspnet" className="mt-4">
            <CodeBlock
              code={ASPNET_TEMPLATE}
              language="markdown"
              title="ASP.NET / C# CLAUDE.md Template"
            />
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* 8. Copyable Prompts */}
      <section aria-labelledby="prompts">
        <h2
          id="prompts"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Useful Prompts
        </h2>
        <div className="space-y-4">
          <PromptExample
            title="Audit your CLAUDE.md"
            description="Trigger the claude-md-improver skill to score and improve your files."
            prompt="Audit my CLAUDE.md files. Check if they're up to date with the current codebase, score them against quality criteria, and propose any improvements."
            whenToUse="Periodically (weekly or after major changes) to keep CLAUDE.md files accurate."
          />
          <PromptExample
            title="Capture session learnings"
            description="An alternative to the /revise-claude-md command for manually capturing what you learned."
            prompt="Before we end this session, review what we've done and identify any learnings that should be added to CLAUDE.md. Focus on: commands we discovered, patterns we followed, gotchas we encountered, and any configuration details that weren't documented. Propose changes as diffs and wait for my approval before applying."
            whenToUse="At the end of a productive session where you discovered missing context."
          />
        </div>
      </section>

      <div className="my-4" />

      {/* Cross-reference */}
      <CalloutCard variant="info" title="Next step">
        For a complete guide to setting up the /docs structure that CLAUDE.md
        points to, see{' '}
        <Link
          to={`/${track}/documentation`}
          className="text-primary hover:underline"
        >
          Section 1.10 &mdash; Documentation Structure
        </Link>
        .
      </CalloutCard>
    </div>
  );
}
