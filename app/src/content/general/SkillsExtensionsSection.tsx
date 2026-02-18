import { useState, useRef, useCallback, useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CodeBlock } from '@/components/content/CodeBlock';
import { CalloutCard } from '@/components/content/CalloutCard';
import { ScrollHint } from '@/components/content/ScrollHint';
import { useTrack } from '@/hooks/useTrack';
import { useSiteConfig } from '@/hooks/useClientConfig';
import { cn } from '@/lib/utils';
import { Check, Minus, ArrowDown, ChevronDown, Compass } from 'lucide-react';
import {
  decisionTreeEntries,
  availabilityMatrix,
  getReferenceCards,
  contextCostTable,
  combinationPatterns,
  naturalLanguageTriggerGuide,
  ukEnglishSkillExample,
  layeringRules,
  platformColours,
  tocEntries,
  type Platform,
  type ContextCostRow,
  type AvailabilityRow,
  type CombinationPattern,
} from '@/content/shared/skills-extensions-data';

// ─── Sub-components ──────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        platformColours[platform],
      )}
    >
      {platform}
    </span>
  );
}

/**
 * C7 fix: Tooltip no longer wraps <td>. The <td> is always rendered by the
 * caller; inside the <td> we place a <span> that acts as the TooltipTrigger.
 */
function AvailabilityCell({ value }: { value: string }) {
  const isAvailable = value !== '--';
  const hasQualification = value !== 'Yes' && value !== '--';

  if (!isAvailable) {
    return (
      <td className="px-3 py-2.5 text-center">
        <Minus
          className="mx-auto h-4 w-4 text-muted-foreground/40"
          aria-label="Not available"
        />
      </td>
    );
  }

  if (hasQualification) {
    return (
      <td className="px-3 py-2.5 text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex cursor-default items-center gap-1 text-xs text-success-muted-foreground">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Available: </span>
                <span className="max-w-[6rem] truncate">
                  {value
                    .replace('Yes', '')
                    .replace('(', '')
                    .replace(')', '')
                    .trim() || 'Yes'}
                </span>
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>
              <p className="max-w-48">{value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
    );
  }

  return (
    <td className="px-3 py-2.5 text-center">
      <Check className="mx-auto h-4 w-4 text-success" aria-label="Available" />
    </td>
  );
}

function CostIndicator({ cost }: { cost: ContextCostRow['cost'] }) {
  const config = {
    zero: {
      label: 'Zero',
      className: 'bg-success-muted text-success-muted-foreground',
    },
    low: {
      label: 'Low',
      className: 'bg-success-muted text-success-muted-foreground',
    },
    moderate: {
      label: 'Moderate',
      className: 'bg-warning-muted text-warning-muted-foreground',
    },
    high: {
      label: 'High',
      className: 'bg-danger-muted text-danger-muted-foreground',
    },
  };

  const c = config[cost];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        c.className,
      )}
    >
      {c.label}
    </span>
  );
}

/** Mobile card view for availability rows (I3) */
function AvailabilityMobileCard({ row }: { row: AvailabilityRow }) {
  const platforms: { label: string; value: string }[] = [
    { label: 'claude.ai', value: row.claudeAi },
    { label: 'Desktop', value: row.desktop },
    { label: 'Code', value: row.code },
    { label: 'CoWork', value: row.cowork },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h4 className="mb-3 text-sm font-medium text-foreground">
        {row.feature}
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {platforms.map(({ label, value }) => {
          const isAvailable = value !== '--';
          return (
            <div key={label} className="flex items-center gap-2 text-xs">
              {isAvailable ? (
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-success"
                  aria-hidden="true"
                />
              ) : (
                <Minus
                  className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40"
                  aria-hidden="true"
                />
              )}
              <span
                className={
                  isAvailable ? 'text-foreground' : 'text-muted-foreground/60'
                }
              >
                <span className="font-medium">{label}</span>
                {isAvailable && value !== 'Yes' && (
                  <span className="ml-1 text-muted-foreground">
                    (
                    {value
                      .replace('Yes', '')
                      .replace('(', '')
                      .replace(')', '')
                      .trim() || 'Yes'}
                    )
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Mobile card view for context cost rows (I3) */
function CostMobileCard({
  row,
  showMitigation,
}: {
  row: ContextCostRow;
  showMitigation: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">{row.feature}</h4>
        <CostIndicator cost={row.cost} />
      </div>
      <dl className="space-y-1.5 text-xs">
        <div className="flex gap-2">
          <dt className="font-medium text-muted-foreground">When:</dt>
          <dd className="text-foreground">{row.whenLoads}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-muted-foreground">Loads:</dt>
          <dd className="text-foreground">{row.whatLoads}</dd>
        </div>
        {showMitigation && (
          <div className="flex gap-2">
            <dt className="font-medium text-muted-foreground">Tip:</dt>
            <dd className="text-foreground">{row.mitigation}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

/** Card view for combination patterns (N3) */
function CombinationCard({ pattern }: { pattern: CombinationPattern }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h4 className="mb-2 text-sm font-semibold text-foreground">
        {pattern.name}
      </h4>
      <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
        {pattern.how}
      </p>
      <div className="rounded-md border-l-2 border-accent-foreground/20 bg-muted/30 px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          Example
        </span>
        <p className="mt-0.5 text-sm text-foreground">{pattern.example}</p>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function SkillsExtensionsSection() {
  const siteConfig = useSiteConfig();
  const { track } = useTrack();
  const isGeneral = track === 'general';
  const refCardsRef = useRef<HTMLDivElement>(null);
  const [openRefCard, setOpenRefCard] = useState<string>('');
  const referenceCards = useMemo(
    () => getReferenceCards(siteConfig),
    [siteConfig],
  );
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // N5: Memoised filtered arrays
  const filteredEntries = useMemo(
    () => decisionTreeEntries.filter((e) => !e.devOnly || !isGeneral),
    [isGeneral],
  );

  const filteredRefCards = useMemo(
    () =>
      referenceCards.filter((c) => {
        if (isGeneral) return !c.devOnly;
        return !c.generalOnly;
      }),
    [referenceCards, isGeneral],
  );

  const filteredAvailability = useMemo(
    () =>
      isGeneral
        ? availabilityMatrix.filter((r) => !r.devOnly)
        : availabilityMatrix,
    [isGeneral],
  );

  const advancedAvailability = useMemo(
    () => availabilityMatrix.filter((r) => r.devOnly),
    [],
  );

  const filteredCostTable = useMemo(
    () =>
      isGeneral ? contextCostTable.filter((r) => !r.devOnly) : contextCostTable,
    [isGeneral],
  );

  const filteredCombinations = useMemo(
    () =>
      isGeneral
        ? combinationPatterns.filter((p) => !p.devOnly)
        : combinationPatterns,
    [isGeneral],
  );

  const filteredTocEntries = useMemo(
    () =>
      tocEntries
        .filter((entry) => {
          if (isGeneral && entry.devOnly) return false;
          if (!isGeneral && entry.generalOnly) return false;
          return true;
        })
        .map((entry) => {
          // P18: Match TOC label to the rendered heading for general track
          if (entry.id === 'context-cost-heading' && isGeneral) {
            return { ...entry, label: "Impact on Claude's Working Memory" };
          }
          return entry;
        }),
    [isGeneral],
  );

  // I2: Use onTransitionEnd-based scroll instead of setTimeout / double rAF
  const scrollToCard = useCallback((cardId: string) => {
    setOpenRefCard(cardId);

    // Use a single rAF to wait for React's commit, then listen for the
    // accordion's CSS transition to finish before scrolling.
    requestAnimationFrame(() => {
      const el = document.getElementById(`ref-card-${cardId}`);
      if (!el) return;

      const content = el.querySelector('[data-state="open"]');
      if (content) {
        const handleTransitionEnd = () => {
          content.removeEventListener('transitionend', handleTransitionEnd);
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const trigger = el.querySelector<HTMLButtonElement>(
            '[data-slot="accordion-trigger"]',
          );
          if (trigger) {
            trigger.focus({ preventScroll: true });
          }
        };
        content.addEventListener('transitionend', handleTransitionEnd, {
          once: true,
        });

        // Fallback: if the transition has already completed or doesn't fire,
        // scroll after a generous frame budget.
        const fallbackTimer = setTimeout(() => {
          content.removeEventListener('transitionend', handleTransitionEnd);
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350);

        // Clean up fallback if transitionend fires
        content.addEventListener(
          'transitionend',
          () => clearTimeout(fallbackTimer),
          { once: true },
        );
      } else {
        // Content not yet in DOM — fall back to rAF
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    });
  }, []);

  return (
    <div className="space-y-12">
      {/* I5: Table of Contents */}
      <nav
        aria-label="Page contents"
        className="rounded-lg border border-border bg-muted/20 dark:bg-muted/40 px-4 py-4 sm:px-6"
      >
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          On this page
        </h2>
        <ul className="columns-1 gap-x-8 space-y-1.5 sm:columns-2">
          {filteredTocEntries.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {entry.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* A. Introduction */}
      <section>
        <p className="max-w-prose text-base leading-relaxed text-foreground">
          Claude comes with powerful built-in tools for conversation, writing,
          analysis, and code. But its real power emerges when you extend it —
          teaching it your company's conventions, connecting it to your tools,
          or giving it specialised knowledge. This section helps you find the
          right extension mechanism for what you want to achieve.
        </p>
        <div className="mt-6 space-y-3">
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            Extensions range from <strong>always-on context</strong> (things
            Claude knows every session) to{' '}
            <strong>on-demand capabilities</strong> (things you or Claude can
            invoke when needed) to <strong>background automation</strong>{' '}
            (things that happen automatically on specific events).
          </p>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            Not every mechanism is available on every platform — the decision
            tree and availability matrix below show what works where.{' '}
            {siteConfig.companyName} has Claude Teams licences for all staff and
            Claude Code access for developers.
          </p>
          {isGeneral && (
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              You may see references to <strong>CoWork</strong> below — this is
              Anthropic's browser automation environment. It lets Claude control
              a web browser to complete tasks on websites, such as filling
              forms, extracting data, or monitoring pages.
            </p>
          )}
        </div>
      </section>

      <Separator />

      {/* Natural language callout for general users */}
      {isGeneral && (
        <CalloutCard variant="tip" title="You don't need to type a command">
          On claude.ai and Claude Desktop, you trigger skills by describing what
          you want in natural language. Simply say what you need — &ldquo;I need
          to hand this session off to Sarah&rdquo; — and Claude automatically
          matches it to the right skill. No slash commands or technical syntax
          required.
        </CalloutCard>
      )}

      {/* B. Decision Tree */}
      <section aria-labelledby="decision-tree-heading">
        <div className="rounded-xl border-2 border-primary/10 bg-primary/[0.03] dark:bg-primary/[0.06] p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Compass className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="decision-tree-heading"
                className="text-xl font-semibold tracking-tight sm:text-2xl"
              >
                {isGeneral ? 'What do you want Claude to do?' : 'I want to...'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Find the right extension for your goal
              </p>
            </div>
          </div>
          <p className="mb-6 max-w-prose text-sm text-muted-foreground">
            Select the goal that best describes what you are trying to achieve.
            Each option shows the recommended approach and which platforms
            support it.
          </p>

          <Accordion type="single" collapsible className="space-y-1">
            {filteredEntries.map((entry) => {
              const Icon = entry.icon;
              return (
                <AccordionItem
                  key={entry.id}
                  value={entry.id}
                  className="rounded-lg border border-border bg-card px-4"
                >
                  <AccordionTrigger className="text-sm font-medium hover:no-underline sm:text-base [&[data-state=open]]:text-foreground">
                    <span className="flex items-center gap-3">
                      <Icon
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span>{entry.goal}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1">
                    <div className="space-y-4">
                      {/* Recommended mechanism */}
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Recommended
                        </span>
                        <p className="mt-1 font-medium text-foreground">
                          {entry.recommended}
                        </p>
                      </div>

                      {/* Explanation */}
                      <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
                        {entry.explanation}
                      </p>

                      {/* Example */}
                      <div className="rounded-md border-l-2 border-accent-foreground/20 bg-muted/30 px-4 py-3">
                        <span className="text-xs font-medium text-muted-foreground">
                          Example for {siteConfig.companyName}
                        </span>
                        <p className="mt-1 text-sm text-foreground">
                          {entry.example}
                        </p>
                      </div>

                      {/* Platform badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Available on:
                        </span>
                        {entry.platforms.map((p) => (
                          <PlatformBadge key={p} platform={p} />
                        ))}
                      </div>

                      {/* Track-specific notes */}
                      {isGeneral && entry.generalNote && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {entry.generalNote}
                        </p>
                      )}
                      {!isGeneral && entry.devNote && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {entry.devNote}
                        </p>
                      )}

                      {/* Link to reference card */}
                      <button
                        type="button"
                        onClick={() => scrollToCard(entry.referenceCardId)}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded px-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                        Learn more in the reference card
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      <Separator />

      {/* C. Platform Availability Matrix */}
      <section aria-labelledby="availability-heading">
        <h2
          id="availability-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Platform Availability
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Not every extension is available on every platform. This matrix shows
          what works where.
        </p>

        {/* Desktop table — hidden on mobile (I3) */}
        <div className="hidden md:block">
          <ScrollArea className="w-full rounded-lg border border-border">
            <div className="min-w-[540px]">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Feature
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      claude.ai
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Desktop
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Code
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      CoWork
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAvailability.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={cn(
                        'border-b border-border last:border-b-0',
                        i % 2 === 0
                          ? 'bg-transparent'
                          : 'bg-muted/20 dark:bg-muted/40',
                      )}
                    >
                      <td className="px-3 py-2.5 text-left font-medium text-foreground">
                        {row.feature}
                      </td>
                      <AvailabilityCell value={row.claudeAi} />
                      <AvailabilityCell value={row.desktop} />
                      <AvailabilityCell value={row.code} />
                      <AvailabilityCell value={row.cowork} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Mobile card layout (I3) */}
        <div className="space-y-3 md:hidden">
          {filteredAvailability.map((row) => (
            <AvailabilityMobileCard key={row.feature} row={row} />
          ))}
        </div>

        {/* Matrix notes */}
        <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
          <p>
            <Check
              className="mr-1 inline h-3 w-3 text-success"
              aria-hidden="true"
            />
            = Available and functional on that platform.{' '}
            <Minus
              className="mr-1 inline h-3 w-3 text-muted-foreground/40"
              aria-hidden="true"
            />
            = Not available.
          </p>
          <p>
            &ldquo;Connectors (managed)&rdquo; means claude.ai uses a managed,
            admin-configured version of MCP rather than direct server
            configuration.
          </p>
          <p>
            Claude Desktop and claude.ai share the same skill system — skills
            uploaded on one are available on the other.
          </p>
        </div>

        {/* Advanced / Developer features — collapsed for general users (N6) */}
        {isGeneral && (
          <div className="mt-4">
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted/50"
                >
                  <span>Advanced / Developer features</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                      advancedOpen && 'rotate-180',
                    )}
                    aria-hidden="true"
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 rounded-md border border-border bg-muted/20 dark:bg-muted/40 px-4 py-4">
                  <p className="mb-3 text-sm text-muted-foreground">
                    These features are available only in Claude Code and are
                    primarily relevant to developers. They are included here for
                    completeness.
                  </p>

                  {/* Desktop table — hidden on mobile */}
                  <div className="hidden md:block">
                    <ScrollArea className="w-full">
                      <div className="min-w-[540px]">
                        <table className="w-full text-sm" role="table">
                          <thead>
                            <tr className="border-b border-border bg-muted/40">
                              <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                              >
                                Feature
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                              >
                                claude.ai
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                              >
                                Desktop
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                              >
                                Code
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                              >
                                CoWork
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {advancedAvailability.map((row, i) => (
                              <tr
                                key={row.feature}
                                className={cn(
                                  'border-b border-border last:border-b-0',
                                  i % 2 === 0
                                    ? 'bg-transparent'
                                    : 'bg-muted/20 dark:bg-muted/40',
                                )}
                              >
                                <td className="px-3 py-2 text-left font-medium text-foreground">
                                  {row.feature}
                                </td>
                                <AvailabilityCell value={row.claudeAi} />
                                <AvailabilityCell value={row.desktop} />
                                <AvailabilityCell value={row.code} />
                                <AvailabilityCell value={row.cowork} />
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>

                  {/* Mobile card layout */}
                  <div className="space-y-3 md:hidden">
                    {advancedAvailability.map((row) => (
                      <AvailabilityMobileCard key={row.feature} row={row} />
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </section>

      <Separator />

      {/* D. Reference Cards */}
      <section aria-labelledby="reference-cards-heading" ref={refCardsRef}>
        <h2
          id="reference-cards-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Extension Reference
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Detailed information on each extension mechanism — what it is, when to
          use it, what it costs, and how to set it up.
        </p>

        <Accordion
          type="single"
          collapsible
          value={openRefCard}
          onValueChange={setOpenRefCard}
          className="space-y-1"
        >
          {filteredRefCards.map((card) => (
            <AccordionItem
              key={card.id}
              value={card.id}
              id={`ref-card-${card.id}`}
              className="rounded-lg border border-border px-4"
            >
              <AccordionTrigger className="text-sm font-medium hover:no-underline sm:text-base">
                {card.name}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-5 pt-1">
                {/* What it is */}
                <p className="max-w-prose text-sm leading-relaxed text-foreground">
                  {card.whatItIs}
                </p>

                {/* When to use */}
                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    When to use
                  </h4>
                  <ul
                    className="space-y-1 text-sm text-muted-foreground"
                    role="list"
                  >
                    {card.whenToUse.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* When NOT to use */}
                {card.whenNotToUse && (
                  <div>
                    <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      When not to use
                    </h4>
                    <ul
                      className="space-y-1 text-sm text-muted-foreground"
                      role="list"
                    >
                      {card.whenNotToUse.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Track-specific notes */}
                {isGeneral && card.generalNote && (
                  <CalloutCard variant="tip" title="How it works for you">
                    {card.generalNote}
                  </CalloutCard>
                )}
                {!isGeneral && card.devDetails && (
                  <CalloutCard variant="info" title="Developer details">
                    {card.devDetails}
                  </CalloutCard>
                )}

                {/* Setup steps (general track) */}
                {card.setupSteps && (
                  <div>
                    <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      How to set up
                    </h4>
                    <ol
                      className="space-y-2 text-sm text-muted-foreground"
                      role="list"
                    >
                      {card.setupSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Context cost */}
                <div className="rounded-md bg-muted/30 px-4 py-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {isGeneral
                      ? "Impact on Claude's working memory"
                      : 'Context cost'}
                  </span>
                  <p className="mt-1 text-sm text-foreground">
                    {card.contextCost}
                  </p>
                </div>

                {/* Warning */}
                {card.warning && (
                  <CalloutCard variant="warning" title="Important">
                    {card.warning}
                  </CalloutCard>
                )}

                {/* Comparison table */}
                {card.comparison && (
                  <ScrollHint className="rounded-lg border border-border">
                    <table
                      className="w-full min-w-[400px] text-sm"
                      role="table"
                    >
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          {card.comparison.headers.map((h) => (
                            <th
                              key={h}
                              scope="col"
                              className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {card.comparison.rows.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-border last:border-b-0"
                          >
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className={cn(
                                  'px-3 py-2 text-sm',
                                  j === 0
                                    ? 'font-medium text-foreground'
                                    : 'text-muted-foreground',
                                )}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollHint>
                )}

                {/* Code example */}
                {card.codeExample && !isGeneral && (
                  <CodeBlock
                    code={card.codeExample.code}
                    language={card.codeExample.language}
                    title={card.codeExample.title}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Separator />

      {/* Copyable content for General track */}
      {isGeneral && (
        <>
          <section aria-labelledby="natural-language-heading">
            <h2
              id="natural-language-heading"
              className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Using Skills with Natural Language
            </h2>
            <p className="mb-4 max-w-prose text-sm text-muted-foreground">
              On claude.ai and Claude Desktop, you trigger skills by describing
              what you want. No commands needed.
            </p>
            <CalloutCard
              variant="info"
              title="Using Skills with Natural Language"
            >
              <div className="mt-2 whitespace-pre-line text-sm">
                {naturalLanguageTriggerGuide}
              </div>
            </CalloutCard>
          </section>

          <Separator />

          <section aria-labelledby="uk-skill-heading">
            <h2
              id="uk-skill-heading"
              className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Example: UK English Skill
            </h2>
            <p className="mb-4 max-w-prose text-sm text-muted-foreground">
              This skill ensures Claude uses UK English in all output. Your
              admin can deploy it to the whole team, or you can upload it
              yourself.
            </p>
            <CodeBlock
              code={ukEnglishSkillExample}
              language="markdown"
              title="UK English skill (SKILL.md)"
            />
          </section>

          <Separator />
        </>
      )}

      {/* E. Context Cost Summary */}
      <section aria-labelledby="context-cost-heading">
        <h2
          id="context-cost-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {isGeneral
            ? "Impact on Claude's Working Memory"
            : 'Context Cost Summary'}
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          {isGeneral
            ? "Each extension takes up some of Claude's working memory. This table shows the impact of each type."
            : 'Every extension has a context cost. Understanding these costs helps you keep your session lean and responsive.'}
        </p>

        {/* Desktop table — hidden on mobile (I3) */}
        <div className="hidden md:block">
          <ScrollArea className="w-full rounded-lg border border-border">
            <div className="min-w-[600px]">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Feature
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      When it loads
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      What loads
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Cost
                    </th>
                    {!isGeneral && (
                      <th
                        scope="col"
                        className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        Mitigation
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredCostTable.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={cn(
                        'border-b border-border last:border-b-0',
                        i % 2 === 0
                          ? 'bg-transparent'
                          : 'bg-muted/20 dark:bg-muted/40',
                      )}
                    >
                      <td className="px-3 py-2.5 font-medium text-foreground">
                        {row.feature}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {row.whenLoads}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {row.whatLoads}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <CostIndicator cost={row.cost} />
                      </td>
                      {!isGeneral && (
                        <td className="px-3 py-2.5 text-muted-foreground">
                          {row.mitigation}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Mobile card layout (I3) */}
        <div className="space-y-3 md:hidden">
          {filteredCostTable.map((row) => (
            <CostMobileCard
              key={row.feature}
              row={row}
              showMitigation={!isGeneral}
            />
          ))}
        </div>
      </section>

      <Separator />

      {/* F. Feature Combination Patterns — cards (N3) */}
      <section aria-labelledby="combinations-heading">
        <h2
          id="combinations-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          How Extensions Work Together
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Extensions are designed to complement each other. These patterns show
          common combinations.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredCombinations.map((pattern) => (
            <CombinationCard key={pattern.name} pattern={pattern} />
          ))}
        </div>
      </section>

      {/* G. Feature Layering Rules (Developer only) */}
      {!isGeneral && (
        <>
          <Separator />
          <section aria-labelledby="layering-heading">
            <h2
              id="layering-heading"
              className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Feature Layering Rules
            </h2>
            <p className="mb-6 max-w-prose text-sm text-muted-foreground">
              When the same feature exists at multiple levels (user, project,
              plugin, managed), here is how they interact.
            </p>

            <div className="space-y-3">
              {layeringRules.map((rule) => (
                <div
                  key={rule.feature}
                  className="rounded-md border border-border px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    {rule.feature}
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rule.rule}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Developer copyable examples */}
      {!isGeneral && (
        <>
          <Separator />
          <section aria-labelledby="dev-examples-heading">
            <h2
              id="dev-examples-heading"
              className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Copyable Examples
            </h2>
            <p className="mb-6 max-w-prose text-sm text-muted-foreground">
              Templates and configuration snippets you can use directly in your
              projects.
            </p>
            <div className="space-y-6">
              <CalloutCard
                variant="info"
                title="Using Skills with Natural Language"
              >
                <div className="mt-2 whitespace-pre-line text-sm">
                  {naturalLanguageTriggerGuide}
                </div>
              </CalloutCard>
              <CodeBlock
                code={ukEnglishSkillExample}
                language="markdown"
                title="UK English skill (SKILL.md)"
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
