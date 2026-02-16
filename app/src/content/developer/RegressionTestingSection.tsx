import { Link } from 'react-router';
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

interface TestingApproach {
  name: string;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'outline';
  whatItIs: string;
  capabilities: string[];
  limitations: string[];
  bestFor: string;
}

const testingApproaches: TestingApproach[] = [
  {
    name: 'CoWork Browser Automation',
    badge: 'Available now',
    badgeVariant: 'default',
    whatItIs:
      'Anthropic\u2019s CoWork can directly control a web browser. When CoWork is in control, the browser displays an orange hue to indicate AI operation.',
    capabilities: [
      'Navigate to URLs and interact with page elements (click, type, scroll)',
      'Handle authentication flows (login, SSO)',
      'Fill forms and submit data',
      'Take screenshots and verify visual state',
      'Execute multi-step user journeys',
    ],
    limitations: [
      'Requires manual session initiation (not yet schedulable)',
      'No built-in assertion framework \u2014 expected outcomes described in natural language',
      'Slower than headless browser automation (operates through the visual interface)',
      'AI visual understanding can occasionally misidentify elements on complex pages',
      'No native CI/CD integration',
    ],
    bestFor:
      'Exploratory testing, ad-hoc verification, testing flows that are hard to script (visually complex interfaces, dynamic content).',
  },
  {
    name: 'Playwright MCP (Claude Code Integration)',
    badge: 'Available now',
    badgeVariant: 'default',
    whatItIs:
      'The Playwright MCP server gives Claude Code direct access to browser automation through Microsoft\u2019s Playwright framework \u2014 the same engine behind many professional testing tools.',
    capabilities: [
      'Launch browsers (Chromium, Firefox, WebKit) and navigate to pages',
      'Interact with elements using robust selectors (CSS, XPath, text content, ARIA roles)',
      'Assert page state programmatically (element visibility, text content, URL)',
      'Generate Playwright test scripts that can be saved and re-run independently',
      'Run headlessly in CI/CD pipelines',
    ],
    limitations: [
      'Requires Claude Code (not available in claude.ai or Claude Desktop)',
      'Claude generates the test scripts \u2014 hallucinated selectors are a real risk',
      'Generated tests need human review before being trusted in CI/CD',
      'No built-in visual regression (screenshot comparison) without additional tooling',
    ],
    bestFor:
      'Generating test scripts for known user flows, bootstrapping a Playwright test suite, testing during development.',
  },
  {
    name: 'Computer Use API',
    badge: 'API only',
    badgeVariant: 'outline',
    whatItIs:
      'Anthropic\u2019s computer use capability allows Claude to control a full desktop environment \u2014 mouse, keyboard, screenshots. Available through the API.',
    capabilities: [
      'Control any desktop application, not just browsers',
      'Perform complex multi-application workflows',
      'Interact with applications that do not have APIs (e.g., legacy desktop software)',
    ],
    limitations: [
      'API-only (requires development work to set up)',
      'Significantly more expensive per action than scripted automation',
      'Slower than direct browser automation',
      'Not designed for high-frequency regression testing',
    ],
    bestFor:
      'One-off automation tasks, testing legacy applications, cross-application workflows. Not a primary regression testing tool.',
  },
];

interface ComparisonRow {
  capability: string;
  ghostInspector: string;
  aiDriven: string;
  highlight?: boolean;
}

const comparisonRows: ComparisonRow[] = [
  {
    capability: 'Recorded test creation',
    ghostInspector: 'Built-in browser extension recorder',
    aiDriven:
      'CoWork follows instructions; Playwright MCP generates scripts from descriptions',
  },
  {
    capability: 'Scheduled execution',
    ghostInspector: 'Yes \u2014 cron-like scheduling, recurring runs',
    aiDriven: 'Not natively available yet. Would require custom orchestration',
  },
  {
    capability: 'CI/CD integration',
    ghostInspector: 'Built-in (webhooks, API, GitHub Actions)',
    aiDriven: 'Playwright scripts can run in CI/CD; CoWork/computer use cannot',
  },
  {
    capability: 'Visual regression',
    ghostInspector: 'Screenshot comparison built-in',
    aiDriven:
      'Not built-in. Would need Percy, Playwright screenshot comparison, or similar',
  },
  {
    capability: 'Element selectors',
    ghostInspector: 'CSS selectors (can break on redesign)',
    aiDriven:
      'AI can adapt to layout changes; Playwright selectors are more robust than CSS',
  },
  {
    capability: 'Authentication handling',
    ghostInspector: 'Cookie injection, API-based auth',
    aiDriven:
      'CoWork can perform actual login flows; Playwright can handle auth state',
  },
  {
    capability: 'Reporting & history',
    ghostInspector: 'Dashboard with pass/fail history, screenshots',
    aiDriven: 'No built-in reporting. Would need custom solution',
  },
  {
    capability: 'Team collaboration',
    ghostInspector: 'Shared tests, team management',
    aiDriven: 'Tests are code \u2014 version-controlled and reviewable in Git',
  },
  {
    capability: 'Self-healing tests',
    ghostInspector: 'No (tests break when selectors change)',
    aiDriven:
      'AI-generated tests can be regenerated from natural-language descriptions',
    highlight: true,
  },
  {
    capability: 'Cost',
    ghostInspector: 'Subscription-based per test run',
    aiDriven: 'API token costs per generation; Playwright execution is free',
  },
  {
    capability: 'Maintenance burden',
    ghostInspector: 'High \u2014 tests break frequently on redesign',
    aiDriven:
      'Lower for AI-generated tests (regenerate from descriptions); higher for initial setup',
  },
];

const gettingStartedSteps = [
  {
    step: 1,
    title: 'Install the Playwright MCP',
    description:
      'Add the Playwright MCP server to your Claude Code configuration.',
  },
  {
    step: 2,
    title: 'Write your first AI-generated test',
    description:
      'Pick a simple, stable user flow (e.g., "log into the admin panel and verify the dashboard loads"). Ask Claude to generate a Playwright test. Review the output and run it.',
  },
  {
    step: 3,
    title: 'Build a natural-language test catalogue',
    description:
      'Write plain-English descriptions of your 10 most important user journeys. Store them in your repo (e.g., /docs/test-scenarios/). These become the source of truth for test regeneration.',
  },
  {
    step: 4,
    title: 'Experiment with CoWork for exploratory testing',
    description:
      'On your next feature release, use CoWork to walk through the new functionality instead of (or in addition to) manual testing.',
  },
  {
    step: 5,
    title: 'Evaluate after 4\u20136 weeks',
    description:
      'After running AI-generated Playwright tests alongside Ghost Inspector, assess: which caught more bugs? Which required less maintenance?',
  },
  {
    step: 6,
    title: 'Do not cancel Ghost Inspector yet',
    description:
      'Keep it running for your critical paths until you have confidence in the replacement. The goal is not to save the subscription cost \u2014 it is to have better tests.',
  },
];

const limitations = [
  'AI testing is not deterministic. The same prompt can generate slightly different test scripts on different runs.',
  'Hallucinated selectors are a real risk. Claude may generate selectors that look correct but do not match your actual DOM. Always review generated tests manually.',
  'Scheduling is not solved. Ghost Inspector can run tests on a schedule. AI-driven testing currently requires manual initiation or custom orchestration.',
  'Reporting is DIY. Ghost Inspector provides dashboards and history. AI-generated Playwright tests require you to build or adopt a reporting layer.',
  'Cost can be unpredictable. Ghost Inspector has predictable subscription costs. AI token costs depend on test complexity and regeneration frequency.',
  'This landscape is changing fast. Specific tool capabilities described here may change within months. The principles (AI-assisted generation, self-healing tests) are more durable than the specific tooling.',
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function RegressionTestingSection() {
  const { track } = useTrack();
  return (
    <div className="flex flex-col gap-12">
      {/* Opening */}
      <section aria-labelledby="testing-landscape">
        <h2
          id="testing-landscape"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          The Testing Landscape Is Shifting
        </h2>
        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Regression testing has traditionally required dedicated tools that
            record or script browser interactions and replay them. Ghost
            Inspector is a solid example of this &mdash; and it works well for
            Phew!&apos;s current needs.
          </p>
          <p>
            AI is changing this landscape. Instead of brittle recorded scripts
            that break when a CSS class changes, AI-driven testing can
            understand what a page should do and verify it at a semantic level.
            This is not science fiction &mdash; it is available now, with
            caveats.
          </p>
          <p>
            This section lays out what is currently possible, how it compares to
            Ghost Inspector, and a practical path for Phew! to start
            experimenting alongside your existing setup.
          </p>
        </div>
      </section>

      <Separator />

      {/* Current Capabilities */}
      <section aria-labelledby="current-capabilities">
        <h2
          id="current-capabilities"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Current AI Testing Capabilities
        </h2>

        <div className="space-y-6">
          {testingApproaches.map((approach) => (
            <div
              key={approach.name}
              className="rounded-lg border border-border p-4 sm:p-6"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold">{approach.name}</h3>
                <Badge variant={approach.badgeVariant} className="text-xs">
                  {approach.badge}
                </Badge>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                {approach.whatItIs}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Capabilities
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {approach.capabilities.map((cap) => (
                      <li key={cap}>{cap}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Limitations
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {approach.limitations.map((lim) => (
                      <li key={lim}>
                        {lim}
                        {lim.includes('hallucinated selectors') && (
                          <>
                            {' '}
                            (see{' '}
                            <Link
                              to={`/${track}/hallucinations`}
                              className="text-primary hover:underline"
                            >
                              Section 1.11
                            </Link>
                            )
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-3 text-sm">
                <strong className="text-foreground">Best for:</strong>{' '}
                <span className="text-muted-foreground">
                  {approach.bestFor}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Comparison Table */}
      <section aria-labelledby="comparison">
        <h2
          id="comparison"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Ghost Inspector Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="pb-2 pr-4 font-medium">
                  Capability
                </th>
                <th scope="col" className="pb-2 pr-4 font-medium">
                  Ghost Inspector
                </th>
                <th scope="col" className="pb-2 font-medium">
                  AI-Driven (Current State)
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr
                  key={row.capability}
                  className={cn(
                    'border-b border-border/50',
                    row.highlight && 'bg-primary/5',
                  )}
                >
                  <td className="py-2 pr-4 font-medium">
                    {row.capability}
                    {row.highlight && (
                      <Badge variant="default" className="ml-2 text-xs">
                        Key advantage
                      </Badge>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {row.ghostInspector}
                  </td>
                  <td className="py-2 text-muted-foreground">{row.aiDriven}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CalloutCard variant="tip" className="mt-4">
          The most compelling advantage of AI-driven testing is{' '}
          <strong>self-healing</strong>. Traditional regression tests are
          notoriously brittle. AI-generated tests from natural-language
          descriptions can be regenerated when the UI changes, rather than
          manually fixed.
        </CalloutCard>
      </section>

      <Separator />

      {/* Integration Approaches */}
      <section aria-labelledby="approaches">
        <h2
          id="approaches"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Integration Approaches
        </h2>

        <Tabs defaultValue="conservative">
          <TabsList>
            <TabsTrigger value="conservative">Conservative</TabsTrigger>
            <TabsTrigger value="progressive">Progressive</TabsTrigger>
          </TabsList>
          <TabsContent value="conservative" className="mt-4 space-y-4">
            <h3 className="text-base font-semibold">
              Approach A: AI-Assisted Test Generation
            </h3>
            <p className="text-sm text-muted-foreground">
              Use Claude (via Claude Code with Playwright MCP) to generate
              Playwright test scripts, then run and maintain those scripts using
              standard tooling.
            </p>
            <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Describe each test scenario in natural language</li>
              <li>Claude generates a Playwright test script</li>
              <li>Review the script, fix any hallucinated selectors</li>
              <li>Commit the test to your repo</li>
              <li>Run via standard Playwright CLI in CI/CD</li>
              <li>
                When tests break after a redesign, ask Claude to regenerate from
                the original description
              </li>
            </ol>
            <CalloutCard variant="info">
              <strong>Phew! starting point:</strong> Pick 3–5 existing Ghost
              Inspector tests and recreate them as Playwright tests using
              Claude. Compare reliability and maintenance burden over 2–3
              months.
            </CalloutCard>
          </TabsContent>
          <TabsContent value="progressive" className="mt-4 space-y-4">
            <h3 className="text-base font-semibold">
              Approach B: AI-as-Tester Hybrid
            </h3>
            <p className="text-sm text-muted-foreground">
              Use CoWork or Playwright MCP for exploratory and ad-hoc testing
              alongside Ghost Inspector for critical regression paths.
            </p>
            <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>
                Ghost Inspector continues handling critical regression suites
              </li>
              <li>
                CoWork handles exploratory testing for complex user journeys
              </li>
              <li>
                For new features, use Claude to generate Playwright tests before
                they reach Ghost Inspector
              </li>
              <li>
                Gradually migrate Ghost Inspector tests to Playwright as
                confidence builds
              </li>
            </ol>
            <CalloutCard variant="info">
              <strong>Phew! starting point:</strong> Start using CoWork for
              manual QA tasks that are currently done by hand (new feature
              walkthroughs, cross-browser checks). Document which tasks it
              handles well and which it struggles with.
            </CalloutCard>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Getting Started */}
      <section aria-labelledby="getting-started-testing">
        <h2
          id="getting-started-testing"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Practical Starting Points
        </h2>
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
                  {step.step === 1 && (
                    <>
                      {' '}
                      See{' '}
                      <Link
                        to={`/${track}/mcp-usage`}
                        className="text-primary hover:underline"
                      >
                        Section 1.13
                      </Link>{' '}
                      for installation guidance.
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Limitations */}
      <CalloutCard variant="warning" title="Honest Limitations">
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
          {limitations.map((lim, i) => (
            <li key={lim}>
              {lim}
              {i === 1 && (
                <>
                  {' '}
                  (see{' '}
                  <Link
                    to={`/${track}/hallucinations`}
                    className="text-primary hover:underline"
                  >
                    Section 1.11
                  </Link>
                  )
                </>
              )}
            </li>
          ))}
        </ul>
      </CalloutCard>

      <Separator />

      {/* Prompts */}
      <section aria-labelledby="testing-prompts">
        <h2
          id="testing-prompts"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Copyable Prompts
        </h2>
        <div className="space-y-4">
          <PromptExample
            title="Generate a Playwright Test"
            description="Create a test script from a natural-language user journey description."
            prompt={`I want to create a Playwright test for the following user journey on our LMS application (ASP.NET/C#, running locally at http://localhost:5000):

User journey: "Admin creates a new training module"
1. Navigate to the login page
2. Log in with admin credentials (username: testadmin, password: use environment variable TEST_ADMIN_PASSWORD)
3. Navigate to the Training Management section
4. Click "Create New Module"
5. Fill in the module details: Title = "Fire Safety Refresher 2026", Category = "Mandatory", Duration = "30 minutes"
6. Save the module
7. Verify the module appears in the module list with status "Draft"

Generate a Playwright test script in TypeScript. Use robust selectors (prefer text content, ARIA roles, and data-testid attributes over CSS classes). Include appropriate waits and assertions at each step.

Important: if you are unsure about specific selectors or page structure, add a comment saying "VERIFY: [what to check]" rather than guessing.`}
            whenToUse="When creating new automated tests for known user flows."
          />

          <PromptExample
            title="Natural-Language Test Scenario Template"
            description="Create a reusable test description that can be used to generate and regenerate automated tests."
            prompt={`Write a plain-English test scenario description for the following user flow. This description will be used to generate and regenerate automated tests, so it needs to be:
- Specific enough that a developer (or AI) can unambiguously implement it
- Written in terms of user actions and expected outcomes, not technical selectors
- Including any preconditions or test data requirements

User flow: [describe the flow]

Format the output as:
## [Test Name]
**Preconditions:** [what must be true before the test starts]
**Steps:**
1. [action] \u2192 [expected result]
2. [action] \u2192 [expected result]
...
**Postconditions:** [what to clean up after the test]`}
            whenToUse="When building a natural-language test catalogue for your project."
          />

          <PromptExample
            title="CoWork Exploratory Test"
            description="Ask CoWork to walk through a user journey and report observations."
            prompt={`I want you to test the following user journey on our staging site. Navigate through each step and report what you observe, including any errors, unexpected behaviour, or usability issues.

Site: [staging URL]
Journey: New user registration and first login

Steps to test:
1. Go to the registration page
2. Complete the registration form with test data
3. Check for confirmation email (or confirmation screen)
4. Log in with the new credentials
5. Verify the user dashboard loads correctly
6. Check that the user profile shows the correct details

For each step, report:
- What happened (screenshot description)
- Whether it matched expected behaviour
- Any issues, warnings, or unexpected states

Do not fix anything. Just observe and report.`}
            whenToUse="Exploratory testing of new features or user journeys."
          />

          <PromptExample
            title="Migrate a Ghost Inspector Test"
            description="Convert an existing Ghost Inspector test into a Playwright test."
            prompt={`I have an existing Ghost Inspector test that performs the following steps. I want to recreate this as a Playwright test.

Ghost Inspector test name: "[test name]"
What it tests: [describe the user journey in plain English]
Current selectors used: [list any known CSS selectors from Ghost Inspector, or say "unknown"]
Authentication: [how the test handles login \u2014 cookie injection, direct login, etc.]

Generate an equivalent Playwright test in TypeScript. Where the Ghost Inspector test relies on fragile CSS selectors, use more robust alternatives (text content, ARIA roles, data-testid). Add comments explaining any significant differences from the Ghost Inspector version.`}
            whenToUse="When migrating existing tests from Ghost Inspector to Playwright."
          />

          <CodeBlock
            code={`## LMS Admin: Create Training Module

**Preconditions:**
- Admin user exists with valid credentials
- Training Management module is enabled
- No module named "Test Module [timestamp]" exists

**Steps:**
1. Log in as admin \u2192 dashboard loads, "Training Management" link is visible
2. Navigate to Training Management \u2192 module list page loads
3. Click "Create New Module" \u2192 creation form appears
4. Enter title: "Test Module [timestamp]", category: "Mandatory", duration: "30 minutes" \u2192 all fields accept input
5. Click "Save" \u2192 success message appears, redirected to module list
6. Verify new module appears in list with status "Draft" \u2192 module is visible with correct details

**Postconditions:**
- Delete the test module via admin panel or API to avoid test data accumulation`}
            language="markdown"
            title="Example: Natural-Language Test Catalogue Entry"
          />
        </div>
      </section>
    </div>
  );
}
