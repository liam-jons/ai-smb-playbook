import { Link } from 'react-router';
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
import { useTrack } from '@/hooks/useTrack';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

interface AuditType {
  name: string;
  description: string;
  prompt: string;
}

const auditTypes: AuditType[] = [
  {
    name: 'Security Audit',
    description:
      'Scans for hardcoded secrets, injection risks, missing auth checks, insecure dependencies, and exposed debug endpoints.',
    prompt: `Conduct a security audit of this codebase. For each finding, provide:
- Severity: Critical / High / Medium / Low
- File path(s) affected
- Description of the vulnerability
- How it could be exploited
- Recommended fix

Focus areas:
1. Hardcoded secrets, API keys, or credentials in source code
2. SQL injection or NoSQL injection risks
3. Cross-site scripting (XSS) vulnerabilities
4. Missing authentication or authorisation checks on endpoints
5. Insecure file upload handling
6. Missing input validation or sanitisation
7. Insecure dependency versions with known CVEs
8. Exposed debug/development endpoints in production configuration
9. Missing CSRF protection
10. Insecure session management

Start by scanning all source files, then check configuration files and environment handling. Report findings in severity order (critical first).`,
  },
  {
    name: 'Performance Audit',
    description:
      'Identifies N+1 queries, missing indexes, unbounded queries, synchronous bottlenecks, and missing caching opportunities.',
    prompt: `Analyse this codebase for performance issues. For each finding, provide:
- Impact: High / Medium / Low
- File path(s) affected
- Description of the bottleneck
- Estimated impact on user experience or server resources
- Recommended optimisation

Focus areas:
1. N+1 query patterns (database calls inside loops)
2. Missing database indexes (queries filtering on unindexed columns)
3. Unbounded queries (no pagination or limit)
4. Synchronous operations that should be async
5. Large files loaded entirely into memory
6. Missing caching opportunities
7. Redundant API calls or database queries
8. Unoptimised images or assets
9. Render-blocking resources
10. Missing lazy loading for components or routes

Check database queries, API endpoints, and rendering logic. Prioritise findings by user-facing impact.`,
  },
  {
    name: 'Dependency Health Audit',
    description:
      'Checks for vulnerabilities, deprecated packages, unused dependencies, and licence issues.',
    prompt: `Audit the dependencies in this project. For each issue found, provide:
- Risk level: Critical / High / Medium / Low
- Package name and current version
- Issue description
- Recommended action

Check for:
1. Dependencies with known security vulnerabilities (check against recent CVE databases you're aware of)
2. Deprecated or unmaintained packages (no updates in 12+ months)
3. Major version upgrades available that may include breaking changes
4. Dependencies imported in package.json but never used in source code
5. Dependencies used in source code but not declared in package.json
6. Duplicate dependencies (same functionality from multiple packages)
7. Dependencies that could be replaced with built-in language features
8. Packages with restrictive or changing licences
9. Pinned versions that should use ranges (or ranges that should be pinned)
10. Dev dependencies incorrectly listed as production dependencies (or vice versa)

Read the package manifest and lock file, then cross-reference with actual imports in the source code.`,
  },
  {
    name: 'Architecture Consistency Audit',
    description:
      'Detects layer violations, circular dependencies, inconsistent patterns, and misplaced files.',
    prompt: `Analyse this codebase for architectural consistency. Compare the actual code against the patterns described in the documentation (check CLAUDE.md, any docs/ folder, and ARCHITECTURE.md if present). For each finding, provide:
- Severity: High / Medium / Low
- File path(s) affected
- Description of the inconsistency
- What the intended pattern is
- Recommended fix

Check for:
1. Files in the wrong directory (based on the project's stated structure)
2. Layer violations (e.g., UI code directly accessing the database)
3. Circular dependencies between modules
4. Inconsistent error handling patterns across similar components
5. Mixed naming conventions (camelCase vs snake_case in the same layer)
6. Business logic in controllers/routes instead of services
7. Missing abstraction layers (direct third-party SDK calls scattered across multiple files)
8. God objects or god files (single files with too many responsibilities)
9. Inconsistent API response formats
10. Configuration scattered across multiple files instead of centralised

Compare the documented architecture (if any) against the actual code organisation. If no architecture documentation exists, infer the intended patterns from the majority of the code and flag deviations.`,
  },
  {
    name: 'Test Coverage Audit',
    description:
      'Identifies untested files, critical gaps, tautological tests, and missing E2E coverage.',
    prompt: `Analyse the test coverage and testing practices in this codebase. For each finding, provide:
- Priority: High / Medium / Low
- File path(s) affected
- Description of the gap
- Risk if untested code fails in production
- Suggested test approach

Check for:
1. Source files with no corresponding test file
2. Critical business logic without test coverage
3. API endpoints without integration tests
4. Error paths that are never tested (catch blocks, error handlers)
5. Edge cases not covered (empty arrays, null values, boundary conditions)
6. Mocked tests that do not reflect real behaviour
7. Tests that always pass regardless of implementation (tautological tests)
8. Missing test fixtures or factories (tests creating complex objects inline)
9. Flaky tests (tests that depend on timing, order, or external state)
10. Missing E2E tests for critical user flows

Start by listing all source files and their corresponding test files (if any). Then analyse the test files for quality and coverage depth.`,
  },
  {
    name: 'Code Quality / Standards Compliance',
    description:
      'Checks for long functions, deep nesting, magic numbers, duplicated code, and console.log statements.',
    prompt: `Review this codebase for code quality and standards compliance. For each finding, provide:
- Priority: High / Medium / Low
- File path(s) affected
- Description of the issue
- Recommended improvement

Check for:
1. Functions exceeding 50 lines (candidates for extraction)
2. Deeply nested conditionals (more than 3 levels)
3. Magic numbers or strings without named constants
4. Copy-pasted code blocks (duplicated logic)
5. Missing error handling (unhandled promise rejections, missing try/catch)
6. Console.log statements that should be proper logging or removed
7. Commented-out code that should be deleted
8. TODO/FIXME comments without associated issue tracker references
9. Missing JSDoc/TSDoc on public functions
10. Inconsistent use of async/await vs promises vs callbacks

Scan all source files (not test files or config files). Group findings by file and prioritise by impact on maintainability.`,
  },
];

const DEBT_DOCUMENTATION_FORMAT = `**[Area/Component]:**
- Issue: [What is the shortcut/workaround]
- Files: \`[file paths]\`
- Why: [Why it was done this way]
- Impact: [What breaks or degrades because of it]
- Fix approach: [How to properly address it]`;

const DEBT_EXAMPLE = `**Manual webhook signature validation:**
- Issue: Copy-pasted Stripe webhook verification code in 3 different endpoints
- Files: \`app/api/webhooks/stripe/route.ts\`, \`app/api/webhooks/checkout/route.ts\`, \`app/api/webhooks/subscription/route.ts\`
- Why: Each webhook was added ad-hoc without abstraction
- Impact: Easy to miss verification in new webhooks (security risk)
- Fix approach: Create shared \`lib/stripe/validate-webhook.ts\` middleware`;

const crossRefAnalysis = [
  {
    capability: 'Inconsistent patterns',
    description:
      'Scan all files in a directory and identify where coding conventions are not followed.',
  },
  {
    capability: 'Dead code detection',
    description:
      'Trace imports and references across the codebase to identify exported functions never imported.',
  },
  {
    capability: 'Dependency analysis',
    description:
      'Read package.json, check which dependencies are actually imported, and flag unused ones.',
  },
  {
    capability: 'Security pattern scanning',
    description:
      'Look for vulnerability patterns across all files simultaneously.',
  },
];

const workflowSteps = [
  {
    step: 1,
    title: 'Start with the mapper output',
    description:
      'If you have not run /gsd:map-codebase, do that first. The CONCERNS.md document gives you a baseline.',
  },
  {
    step: 2,
    title: 'Choose your audit focus',
    description:
      'Pick a specific focus area for each session: security, performance, dependencies, architecture, test coverage, or code quality.',
  },
  {
    step: 3,
    title: 'Run a focused audit prompt',
    description:
      'Use one of the prompts below, tailored to the specific focus area.',
  },
  {
    step: 4,
    title: 'Review and triage findings',
    description:
      'Review each finding, confirm it is valid (Claude can produce false positives), and prioritise.',
  },
  {
    step: 5,
    title: 'Document confirmed findings',
    description:
      'Add confirmed issues to your CONCERNS.md or tech debt tracker.',
  },
];

const remediationPrinciples = [
  {
    title: 'Always review before executing',
    description:
      'Claude should propose the fix plan before implementing it. This prevents over-engineering.',
  },
  {
    title: 'One debt item at a time',
    description:
      'Do not try to fix multiple items in a single session. Each gets its own focused session with clean context.',
  },
  {
    title: 'Test after every fix',
    description:
      'Run existing tests after each change. If none exist, add tests for the changed code as part of the fix.',
  },
  {
    title: 'Update the documentation',
    description:
      'After fixing a debt item, update CONCERNS.md and CONVENTIONS.md if the fix introduced new patterns.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function TechnicalDebtSection() {
  const { track } = useTrack();
  return (
    <div className="flex flex-col gap-12">
      {/* Opening */}
      <section aria-labelledby="why-audit">
        <h2
          id="why-audit"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Why Audit with AI?
        </h2>
        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Every codebase accumulates issues over time &mdash; shortcuts taken
            under deadline pressure, dependencies that fall behind, patterns
            that made sense years ago but no longer fit. For a small team,
            dedicating time to comprehensive code audits is difficult to justify
            when there is client work to deliver.
          </p>
          <p>
            Claude changes this equation. It can analyse an entire codebase in
            minutes, cross-referencing across files to spot inconsistencies,
            security risks, and performance problems that are invisible when
            reviewing files one at a time. During the training, this was
            demonstrated when Claude generated a 21KB concerns file from a
            single codebase analysis.
          </p>
          <p>
            This section covers two complementary workflows:{' '}
            <strong className="text-foreground">auditing</strong> (finding
            problems) and{' '}
            <strong className="text-foreground">remediation</strong> (fixing
            them). The mapper&apos;s CONCERNS.md from{' '}
            <Link
              to={`/${track}/codebase-mapping`}
              className="text-primary hover:underline"
            >
              Section 1.11
            </Link>{' '}
            is your starting point &mdash; this section takes you deeper.
          </p>
        </div>
      </section>

      <Separator />

      {/* Part 1: Auditing */}
      <section aria-labelledby="audit-workflow">
        <h2
          id="audit-workflow"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Part 1: Codebase Auditing
        </h2>

        {/* Workflow Steps */}
        <h3 className="mb-4 text-lg font-medium">The Audit Workflow</h3>
        <div className="mb-8 space-y-4">
          {workflowSteps.map((step) => (
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
                  {step.step === 1 && (
                    <>
                      {' '}
                      (
                      <Link
                        to={`/${track}/codebase-mapping`}
                        className="text-primary hover:underline"
                      >
                        Section 1.11
                      </Link>
                      )
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Multi-file Cross-Reference */}
        <h3 className="mb-4 text-lg font-medium">
          Multi-File Cross-Reference Analysis
        </h3>
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          What makes Claude particularly effective at auditing is its ability to
          analyse patterns across files simultaneously:
        </p>
        <div className="mb-8 space-y-3">
          {crossRefAnalysis.map((item) => (
            <div
              key={item.capability}
              className="flex gap-3 rounded-lg border border-border/50 px-4 py-3"
            >
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">{item.capability}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <CalloutCard variant="info" className="mb-6">
          For large codebases, a single audit prompt may not cover everything.
          Use the subagent pattern from{' '}
          <Link
            to={`/${track}/skills-extensions`}
            className="text-primary hover:underline"
          >
            Section 1.4
          </Link>{' '}
          &mdash; break the audit into focused tasks, each with its own context
          window.
        </CalloutCard>

        {/* Audit Prompts */}
        <h3 className="mb-4 text-lg font-medium">
          Audit Prompts by Focus Area
        </h3>
        <Accordion type="single" collapsible>
          {auditTypes.map((audit) => (
            <AccordionItem key={audit.name} value={audit.name}>
              <AccordionTrigger className="text-sm font-medium">
                {audit.name}
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {audit.description}
                </p>
                <PromptExample title={audit.name} prompt={audit.prompt} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Separator className="my-8" />

        {/* Quick Health Check */}
        <h3 className="mb-4 text-lg font-medium">Quick Health Check</h3>
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          The audit prompts above are thorough but time-intensive. When you need
          a fast codebase assessment &mdash; say, at the start of a sprint or
          before diving into a new feature &mdash; this lighter prompt covers
          the essentials in roughly five minutes.
        </p>

        <PromptExample
          title="Quick Health Check"
          description="A five-minute sweep of the most common codebase health indicators."
          prompt={`Run a quick health check on this codebase. Keep it concise — I want a brief summary for each area, not a full audit. Flag only genuine issues, not style preferences.

1. **Dependency freshness**
   - Are there any dependencies with known security vulnerabilities?
   - Are any packages more than 2 major versions behind?
   - For NuGet packages (ASP.NET/C#) or Composer/npm packages (WordPress), flag anything end-of-life or unmaintained.

2. **Obvious security issues**
   - Hardcoded secrets, API keys, or credentials in source files
   - Missing input validation on user-facing endpoints
   - Any configuration files exposing sensitive data

3. **Code duplication**
   - Identify the worst cases of copy-pasted logic (3+ duplicated blocks)
   - Suggest which duplications would benefit most from extraction

4. **Unused exports and imports**
   - List exported functions, components, or classes that are never imported elsewhere
   - Flag imports that are declared but never referenced

5. **Test coverage gaps**
   - Which critical paths (authentication, payment processing, data mutations) have no tests?
   - Are there test files that exist but contain no meaningful assertions?

Format the output as a simple pass/warn/fail for each area with a one-line summary, followed by details only for warn or fail items.`}
          whenToUse="At the start of a sprint, before major feature work, or as a regular weekly check."
        />

        <CalloutCard variant="tip" className="mt-4">
          Run this at the start of each sprint or before any major feature work.
          It takes far less time than a full audit and catches the most
          impactful issues early.
        </CalloutCard>
      </section>

      <Separator />

      {/* Part 2: Technical Debt */}
      <section aria-labelledby="tech-debt">
        <h2
          id="tech-debt"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Part 2: Handling Technical Debt
        </h2>

        {/* Documenting */}
        <h3 className="mb-4 text-lg font-medium">Documenting Technical Debt</h3>
        <div className="mb-4 max-w-prose text-sm text-muted-foreground">
          <p>
            Claude can only act on well-documented debt. A vague note like
            &ldquo;auth needs work&rdquo; is not actionable. A structured entry
            with file paths, impact assessment, and suggested fix approach gives
            Claude everything it needs.
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <CodeBlock
            code={DEBT_DOCUMENTATION_FORMAT}
            language="markdown"
            title="Technical Debt Documentation Format"
          />
          <CodeBlock
            code={DEBT_EXAMPLE}
            language="markdown"
            title="Example: Documented Technical Debt"
          />
        </div>

        {/* Prioritisation */}
        <h3 className="mb-4 text-lg font-medium">Prioritisation</h3>
        <PromptExample
          title="Prioritise Technical Debt"
          description="Use a structured framework to prioritise documented debt items."
          prompt={`I have the following technical debt items documented in my codebase. Review each one and prioritise them using this framework:

Priority criteria:
1. Security risk (could it expose data or create vulnerabilities?)
2. User impact (does it affect end users directly?)
3. Developer impact (does it slow down future development?)
4. Fix complexity (how much effort to resolve?)
5. Blast radius (how many files/systems does the fix touch?)

For each item, assign:
- Priority: P1 (fix now) / P2 (fix this sprint) / P3 (fix this quarter) / P4 (fix when convenient)
- Rationale: 1-2 sentences explaining the priority
- Suggested approach: Brief outline of how to fix it
- Estimated effort: Small (< 1 hour) / Medium (1-4 hours) / Large (4+ hours)

Group the output by priority level.

Here are the items:
[paste your CONCERNS.md content or audit findings here]`}
          whenToUse="After completing an audit and documenting findings."
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="destructive" className="text-xs">
            P1 — Fix now
          </Badge>
          <Badge className="bg-warning/80 text-xs hover:bg-warning/70">
            P2 — Fix this sprint
          </Badge>
          <Badge variant="default" className="text-xs">
            P3 — Fix this quarter
          </Badge>
          <Badge variant="secondary" className="text-xs">
            P4 — Fix when convenient
          </Badge>
        </div>
      </section>

      <Separator />

      {/* Remediation */}
      <section aria-labelledby="remediation">
        <h2
          id="remediation"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Executing Debt Remediation
        </h2>

        <PromptExample
          title="Remediation Prompt"
          description="Fix a documented technical debt item with a plan-first approach."
          prompt={`I need to address the following technical debt item:

[paste the documented debt entry from CONCERNS.md]

Before making any changes:
1. Read all affected files listed above
2. Understand the current implementation and its dependencies
3. Propose a fix plan with:
   - Files to modify
   - Files to create (if any)
   - Files to delete (if any)
   - Order of changes (to avoid breaking intermediate states)
   - Tests to add or update
4. Wait for my approval before implementing

Important constraints:
- Follow the existing coding conventions in this project
- Do not change any public APIs unless the fix requires it
- Add or update tests for any changed behaviour
- If the fix is larger than expected, flag it and suggest a phased approach`}
          whenToUse="When addressing a specific, documented technical debt item."
        />

        <div className="mt-6 space-y-3">
          {remediationPrinciples.map((principle) => (
            <div
              key={principle.title}
              className="flex gap-3 rounded-lg border border-border/50 px-4 py-3"
            >
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">{principle.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {principle.description}
                  {principle.title === 'Update the documentation' && (
                    <>
                      {' '}
                      (see{' '}
                      <Link
                        to={`/${track}/codebase-mapping`}
                        className="text-primary hover:underline"
                      >
                        Section 1.11
                      </Link>
                      )
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Architecture Drift */}
      <section aria-labelledby="architecture-drift">
        <h2
          id="architecture-drift"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Architecture Drift Detection
        </h2>
        <div className="mb-4 max-w-prose text-sm text-muted-foreground">
          <p>
            Claude can keep architecture documentation current by comparing
            documented architecture against actual code and flagging drift. This
            is particularly valuable after a period of rapid development.
          </p>
        </div>

        <PromptExample
          title="Architecture Drift Detection"
          description="Compare documented architecture against the actual codebase."
          prompt={`Compare the architecture described in docs/architecture/ (or .planning/codebase/ARCHITECTURE.md) against the actual codebase. For each discrepancy, provide:
- What the documentation says
- What the code actually does
- Which is correct (documentation is outdated, or code has drifted from the intended architecture)
- Recommended action (update docs, refactor code, or accept the change)

Focus on:
1. Layers and their actual dependencies vs documented dependencies
2. File/directory organisation vs documented structure
3. Data flow patterns vs documented flows
4. Error handling strategy vs documented strategy
5. Naming conventions vs documented conventions`}
          whenToUse="After a period of rapid development, or as part of a quarterly review."
        />
      </section>

      <Separator />

      {/* Ongoing Maintenance */}
      <section aria-labelledby="maintenance">
        <h2
          id="maintenance"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Ongoing Maintenance
        </h2>
        <div className="max-w-prose space-y-4 text-sm text-muted-foreground">
          <p>
            Auditing is not a one-time activity. Codebases continue to
            accumulate debt as new features are added and requirements change.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Run the mapper (
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                /gsd:map-codebase
              </code>
              ) quarterly, or before any major new feature begins.
            </li>
            <li>
              Keep CONCERNS.md as a living document &mdash; update it when
              issues are found and resolved.
            </li>
            <li>
              Consider the &ldquo;doc-gardening agent&rdquo; pattern: a
              scheduled task that scans for stale or obsolete documentation.
            </li>
          </ul>
        </div>
      </section>

      {/* Cross-references */}
      <CalloutCard variant="info">
        This section builds on{' '}
        <Link
          to={`/${track}/codebase-mapping`}
          className="text-primary hover:underline"
        >
          Section 1.11 (Codebase Mapping)
        </Link>{' '}
        &mdash; run the mapper first to generate a baseline CONCERNS.md. The
        remediation approach uses the anti-hallucination patterns from{' '}
        <Link
          to={`/${track}/hallucinations`}
          className="text-primary hover:underline"
        >
          Section 1.12
        </Link>{' '}
        (plan first, wait for approval). After fixing debt, update your{' '}
        <Link
          to={`/${track}/claude-md`}
          className="text-primary hover:underline"
        >
          CLAUDE.md (Section 1.9)
        </Link>{' '}
        and{' '}
        <Link
          to={`/${track}/documentation`}
          className="text-primary hover:underline"
        >
          documentation structure (Section 1.10)
        </Link>
        .
      </CalloutCard>
    </div>
  );
}
