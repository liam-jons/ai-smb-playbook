import { useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  Zap,
  MessageSquareHeart,
  Download,
  BookOpen,
  Package,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CopyButton } from '@/components/content/CopyButton';
import { useSiteConfig } from '@/hooks/useClientConfig';
import { useTrack } from '@/hooks/useTrack';

/* ------------------------------------------------------------------ */
/*  Track-specific quick wins                                          */
/* ------------------------------------------------------------------ */

const QUICK_WINS_GENERAL = [
  {
    title: 'Set up UK English enforcement',
    description:
      'A one-line instruction that ensures all Claude output uses British spelling and grammar.',
    linkSlug: 'brand-voice',
    linkLabel: 'Go to Brand Voice',
  },
  {
    title: 'Review the governance policy',
    description:
      'A ready-made, customisable AI governance template \u2014 fill in the blanks and share with your team.',
    linkSlug: 'governance',
    linkLabel: 'Go to Governance',
  },
  {
    title: 'Learn session handoff prompts',
    description:
      'Copy the one-line prompt that gets Claude to write its own handoff note, so you can pick up where you left off.',
    linkSlug: 'sessions',
    linkLabel: 'Go to Sessions',
  },
  {
    title: 'Explore the starter kit',
    description:
      'Drop-in skill files, commands, templates, and governance policy \u2014 ready to paste into Claude Desktop.',
    linkSlug: 'starter-kit',
    linkLabel: 'Go to Starter Kit',
  },
];

const QUICK_WINS_DEVELOPER = [
  {
    title: 'Set up your CLAUDE.md file',
    description:
      'Create a project-level context file that Claude Code reads on every session \u2014 tech stack, conventions, and gotchas.',
    linkSlug: 'claude-md',
    linkLabel: 'Go to CLAUDE.md',
  },
  {
    title: 'Review the governance policy',
    description:
      'A ready-made, customisable AI governance template \u2014 fill in the blanks and share with your team.',
    linkSlug: 'governance',
    linkLabel: 'Go to Governance',
  },
  {
    title: 'Learn session handoff prompts',
    description:
      'Copy the one-line prompt that gets Claude to write its own handoff note, so you can pick up where you left off.',
    linkSlug: 'sessions',
    linkLabel: 'Go to Sessions',
  },
  {
    title: 'Explore the starter kit',
    description:
      'Drop-in skill files, commands, templates, and a CLAUDE.md reference \u2014 ready to use with Claude Code.',
    linkSlug: 'starter-kit',
    linkLabel: 'Go to Starter Kit',
  },
];

function getQuickWins(track: string) {
  const items =
    track === 'developer' ? QUICK_WINS_DEVELOPER : QUICK_WINS_GENERAL;
  return items.map((item) => ({
    ...item,
    link: { to: `/${track}/${item.linkSlug}`, label: item.linkLabel },
  }));
}

/* ------------------------------------------------------------------ */
/*  Quick reference data (already track-filtered)                      */
/* ------------------------------------------------------------------ */

const QUICK_REFERENCE_ITEMS_ALL = [
  {
    heading: 'Context Management',
    track: 'both' as const,
    items: [
      'Start a fresh session when switching tasks or topics.',
      'Paste files as attachments to preserve context space.',
      'When quality drops, it is usually a context problem \u2014 start fresh.',
    ],
  },
  {
    heading: 'Session Handoff',
    track: 'both' as const,
    items: [
      'Prompt: "Write a structured handoff note covering what we have done, decisions made, and next steps."',
      'Paste the handoff into your next session for continuity.',
    ],
  },
  {
    heading: 'Skills',
    track: 'both' as const,
    items: [
      "Skills are reusable instruction files that shape Claude's behaviour.",
      'Claude Desktop: Settings > Skills > Add from file.',
    ],
  },
  {
    heading: 'Skills (Developer)',
    track: 'developer' as const,
    items: [
      'Claude Code: Place skill directories (containing a SKILL.md file) in .claude/skills/ in your project root.',
    ],
  },
  {
    heading: 'UK English',
    track: 'both' as const,
    items: [
      'Add to your project instructions: "Always use UK English spelling and grammar."',
      'Reinforced by the brand-voice skill in the starter kit.',
    ],
  },
  {
    heading: 'For Developers',
    track: 'developer' as const,
    items: [
      'CLAUDE.md: project context, tech stack, conventions \u2014 read by Claude Code on every session.',
      'Break large tasks into atomic specs before asking Claude to build.',
      'Use claude plugin install for: pr-review-toolkit, security-guidance, context7.',
    ],
  },
];

function getQuickReferenceItems(track: string) {
  return QUICK_REFERENCE_ITEMS_ALL.filter(
    (section) => section.track === 'both' || section.track === track,
  ).map(({ heading, items }) => ({ heading, items }));
}

/* ------------------------------------------------------------------ */
/*  Reduced motion helper                                              */
/* ------------------------------------------------------------------ */

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as number[] },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as number[] },
};

/* ------------------------------------------------------------------ */
/*  Track display helpers                                              */
/* ------------------------------------------------------------------ */

const TRACK_LABELS: Record<string, string> = {
  general: 'General Users Guide',
  developer: 'Developer Guide',
};

const TRACK_DESCRIPTIONS: Record<string, { intro: string; scope: string }> = {
  general: {
    intro:
      'This guide covers the core topics from the training \u2014 context management, skills, session handling, brand voice, and governance.',
    scope:
      'Everything here is designed for everyday use with Claude via claude.ai or Claude Desktop. Prompts, templates, and examples all have a copy button \u2014 take what you need and use it straight away.',
  },
  developer: {
    intro:
      'This guide covers developer-specific workflows \u2014 CLAUDE.md files, codebase mapping, testing, MCP usage, and plugins \u2014 alongside the core topics from the training.',
    scope:
      'Everything here is designed for use with Claude Code and the developer toolchain. Prompts, templates, and code examples all have a copy button \u2014 take what you need and use it straight away.',
  },
};

function getOtherTrack(track: string): {
  slug: string;
  label: string;
} {
  return track === 'developer'
    ? { slug: 'general', label: 'General Users Guide' }
    : { slug: 'developer', label: 'Developer Guide' };
}

/* ------------------------------------------------------------------ */
/*  Print helper \u2014 builds document via DOM manipulation                */
/* ------------------------------------------------------------------ */

function buildPrintDocument(
  track: string,
  siteConfig: { appTitle: string; trainingDate: string },
): string {
  const referenceItems = getQuickReferenceItems(track);
  const sections = referenceItems
    .map((section) => {
      const listItems = section.items
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join('');
      return `<h2>${escapeHtml(section.heading)}</h2><ul>${listItems}</ul>`;
    })
    .join('');

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8" />',
    `<title>${siteConfig.appTitle} \u2014 Quick Reference Card</title>`,
    '<style>',
    '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
    'body { font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif; font-size: 11pt; line-height: 1.5; color: #1a1a2e; padding: 24pt 32pt; max-width: 700pt; }',
    'h1 { font-size: 16pt; margin-bottom: 4pt; }',
    'h2 { font-size: 12pt; margin-top: 14pt; margin-bottom: 4pt; border-bottom: 1px solid #d4d4d8; padding-bottom: 2pt; }',
    'ul { padding-left: 16pt; margin-top: 2pt; }',
    'li { margin-bottom: 2pt; }',
    '.subtitle { font-size: 9pt; color: #64748b; margin-bottom: 12pt; }',
    '@media print { body { padding: 0; } }',
    '</style>',
    '</head>',
    '<body>',
    `<h1>${siteConfig.appTitle} \u2014 Quick Reference</h1>`,
    `<p class="subtitle">Key takeaways from the AI training sessions (${siteConfig.trainingDate})</p>`,
    sections,
    '</body>',
    '</html>',
  ].join('\n');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function WelcomeSection() {
  const siteConfig = useSiteConfig();
  const { track } = useTrack();

  const quickWins = useMemo(() => getQuickWins(track), [track]);
  const quickReferenceItems = useMemo(
    () => getQuickReferenceItems(track),
    [track],
  );

  const quickReferenceText = useMemo(
    () =>
      quickReferenceItems
        .map(
          (section) =>
            `${section.heading}\n${section.items.map((item) => `- ${item}`).join('\n')}`,
        )
        .join('\n\n'),
    [quickReferenceItems],
  );

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const motionProps = prefersReducedMotion ? {} : fadeInUp;
  const motionFadeProps = prefersReducedMotion ? {} : fadeIn;

  const handlePrint = useCallback(() => {
    const html = buildPrintDocument(track, siteConfig);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');

    if (printWindow) {
      printWindow.addEventListener('afterprint', () => {
        URL.revokeObjectURL(url);
      });
      // Give the window time to load, then trigger print
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    } else {
      URL.revokeObjectURL(url);
    }
  }, [track, siteConfig]);

  const trackLabel = TRACK_LABELS[track] ?? TRACK_LABELS.general;
  const trackDesc = TRACK_DESCRIPTIONS[track] ?? TRACK_DESCRIPTIONS.general;
  const otherTrack = getOtherTrack(track);

  return (
    <div className="space-y-12">
      {/* -- Hero / Opening -- */}
      <motion.section {...motionProps} aria-labelledby="welcome-heading">
        <h2
          id="welcome-heading"
          className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ lineHeight: 1.2 }}
        >
          Welcome to the {trackLabel}
        </h2>
        <div
          className="space-y-4 text-base leading-relaxed text-muted-foreground"
          style={{ maxWidth: '65ch' }}
        >
          <p>
            Following the AI training sessions with your team on{' '}
            {siteConfig.trainingDate}, we put together this interactive playbook
            as a practical reference.
          </p>
          <p>{trackDesc.intro}</p>
          <p>{trackDesc.scope}</p>
        </div>

        {/* Subtle track-switch link — hidden when client has no developer track */}
        {siteConfig.hasDeveloperTrack && (
          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Looking for the{' '}
            <Link
              to={`/${otherTrack.slug}`}
              className="font-medium text-primary hover:underline focus-visible:underline"
            >
              {otherTrack.label}
            </Link>
            ?
          </p>
        )}
      </motion.section>

      <Separator />

      {/* -- How to Use This Playbook -- */}
      <motion.section {...motionFadeProps} aria-labelledby="how-to-use-heading">
        <h2
          id="how-to-use-heading"
          className="mb-4 text-xl font-semibold tracking-tight"
        >
          How to Use This Playbook
        </h2>
        <ul className="space-y-3 text-base leading-relaxed text-muted-foreground">
          <li className="flex gap-3">
            <span className="mt-1 shrink-0 text-primary" aria-hidden="true">
              <BookOpen className="h-4 w-4" />
            </span>
            <span>
              <strong className="text-foreground">Start anywhere.</strong> You
              do not need to read this front-to-back. Each section is
              self-contained. If you already know what you are looking for, jump
              straight there.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 shrink-0 text-primary" aria-hidden="true">
              <Zap className="h-4 w-4" />
            </span>
            <span>
              <strong className="text-foreground">Copy-to-clipboard.</strong>{' '}
              Every prompt, template, and code example has a copy button. Take
              what you need and paste it directly into Claude.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 shrink-0 text-primary" aria-hidden="true">
              <MessageSquareHeart className="h-4 w-4" />
            </span>
            <span>
              <strong className="text-foreground">Feedback.</strong> If
              something is unclear, missing, or you want more detail on a topic,
              there is a feedback button available on every page.
            </span>
          </li>
        </ul>
      </motion.section>

      {/* -- Starter Kit Callout -- */}
      <Link
        to={`/${track}/starter-kit`}
        className="group block rounded-lg border border-primary/20 bg-primary/5 px-5 py-5 transition-colors hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-md bg-primary/10 p-2">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              Starter Kit \u2014 Ready-to-Use Files
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Drop-in skill files, commands, templates, and governance policy
              \u2014 everything you need to configure Claude for your team.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Go to Starter Kit
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>

      <Separator />

      {/* -- Quick Wins -- */}
      <section aria-labelledby="quick-wins-heading">
        <h2
          id="quick-wins-heading"
          className="mb-2 text-xl font-semibold tracking-tight"
        >
          Quick Wins
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Things you can do right now, in under five minutes.
        </p>
        <div className="space-y-4">
          {quickWins.map((win) => (
            <div
              key={win.title}
              className="flex flex-col gap-2 rounded-lg border border-border bg-card px-5 py-4 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {win.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {win.description}
              </p>
              <Link
                to={win.link.to}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:underline"
              >
                {win.link.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* -- Quick Reference Card -- */}
      <section aria-labelledby="quick-ref-heading">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="quick-ref-heading"
              className="text-xl font-semibold tracking-tight"
            >
              Quick Reference Card
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A printable one-page summary of the key takeaways.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="default"
              onClick={handlePrint}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Quick Reference (PDF)
            </Button>
            <CopyButton
              text={quickReferenceText}
              ariaLabel="Copy quick reference to clipboard"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card px-5 py-6">
          <div className="space-y-6">
            {quickReferenceItems.map((section) => (
              <div key={section.heading}>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {section.heading}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* -- How This Playbook Was Built -- */}
      <section aria-labelledby="how-built-heading">
        <h2
          id="how-built-heading"
          className="mb-3 text-xl font-semibold tracking-tight"
        >
          How This Playbook Was Built
        </h2>
        <p
          className="text-sm leading-relaxed text-muted-foreground"
          style={{ maxWidth: '65ch' }}
        >
          This playbook was built using the same tools and workflows it
          describes. Content was planned with structured prompts and session
          handoffs; the application was built by Claude Code agents working from
          detailed specs. The skills, governance principles, and CLAUDE.md
          patterns covered in the training were used throughout \u2014 from
          initial planning through to deployment.
        </p>
      </section>

      <Separator />

      {/* -- Feedback -- */}
      <section aria-labelledby="feedback-heading">
        <h2
          id="feedback-heading"
          className="mb-3 text-xl font-semibold tracking-tight"
        >
          Feedback
        </h2>
        <p
          className="mb-4 text-sm leading-relaxed text-muted-foreground"
          style={{ maxWidth: '65ch' }}
        >
          Spotted something that could be clearer? Want more detail on a
          specific topic? Use the feedback button \u2014 it is available on
          every page. Your feedback goes directly to {siteConfig.consultantName}{' '}
          and will be used to improve the playbook.
        </p>
        <Button
          variant="outline"
          size="default"
          className="gap-2"
          onClick={() => {
            const event = new CustomEvent('open-feedback');
            window.dispatchEvent(event);
          }}
        >
          <MessageSquareHeart className="h-4 w-4" />
          Send Feedback
        </Button>
      </section>
    </div>
  );
}
