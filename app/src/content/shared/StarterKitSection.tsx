import { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import {
  ChevronDown,
  ChevronRight,
  Terminal,
  Monitor,
  Globe,
  ShieldCheck,
  Rocket,
  Sparkles,
  FolderOpen,
  FileText,
  Puzzle,
  Map,
  Check,
  Download,
  ArrowRight,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalloutCard } from '@/components/content/CalloutCard';
import { CodeBlock } from '@/components/content/CodeBlock';
import { CopyButton } from '@/components/content/CopyButton';
import { cn } from '@/lib/utils';
import { useTrack } from '@/hooks/useTrack';
import { useSiteConfig, useClientConfig } from '@/hooks/useClientConfig';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import {
  getStarterKitFiles,
  CATEGORY_LABELS,
  QUICK_START_STEPS,
  getCategoriesForTrack,
  getFilteredFilesForCategoryAndTrack,
  type StarterKitFile,
  type StarterKitCategory,
} from '@/content/shared/starter-kit-data';

/* ------------------------------------------------------------------ */
/*  Reduced-motion hook                                                */
/* ------------------------------------------------------------------ */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return reduced;
}

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
/*  Tab content fade transition wrapper                                */
/* ------------------------------------------------------------------ */

function TabFadeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category icons                                                     */
/* ------------------------------------------------------------------ */

const CATEGORY_ICONS: Record<StarterKitCategory, typeof Sparkles> = {
  skill: Sparkles,
  command: Terminal,
  template: FileText,
  prompt: FolderOpen,
  plugin: Puzzle,
  'gsd-mapper': Map,
};

/* ------------------------------------------------------------------ */
/*  Mobile-friendly short labels for file browser tabs                 */
/* ------------------------------------------------------------------ */

const CATEGORY_SHORT_LABELS: Record<StarterKitCategory, string> = {
  skill: 'Skills',
  command: 'Cmds',
  template: 'Templates',
  prompt: 'Prompts',
  plugin: 'Plugins',
  'gsd-mapper': 'GSD',
};

/* ------------------------------------------------------------------ */
/*  Platform label mapping (module-scope constant)                     */
/* ------------------------------------------------------------------ */

const PLATFORM_LABELS: Record<
  string,
  { label: string; icon: typeof Terminal }
> = {
  claudeCode: { label: 'Claude Code', icon: Terminal },
  claudeDesktop: { label: 'Claude Desktop', icon: Monitor },
  claudeAi: { label: 'claude.ai', icon: Globe },
  teamsAdmin: { label: 'Teams Admin', icon: ShieldCheck },
};

/* ------------------------------------------------------------------ */
/*  Priority / recommendation badge helpers                            */
/* ------------------------------------------------------------------ */

function PriorityBadge({ priority }: { priority: string }) {
  if (priority === 'high') {
    return (
      <Badge className="border-success/30 bg-success-muted text-success-muted-foreground">
        Recommended
      </Badge>
    );
  }
  return null;
}

function PluginBadge({ recommendation }: { recommendation?: string }) {
  if (!recommendation) return null;
  if (recommendation === 'install-marketplace') {
    return (
      <Badge variant="outline" className="text-xs">
        Install via marketplace
      </Badge>
    );
  }
  if (recommendation === 'install-if-needed') {
    return (
      <Badge variant="outline" className="text-xs text-muted-foreground">
        Install if needed
      </Badge>
    );
  }
  if (recommendation === 'reference-only') {
    return (
      <Badge variant="outline" className="text-xs text-muted-foreground">
        Reference only
      </Badge>
    );
  }
  return null;
}

function TrackBadge({ tracks }: { tracks: string[] }) {
  if (tracks.length === 2) {
    return (
      <Badge variant="secondary" className="text-xs">
        All users
      </Badge>
    );
  }
  if (tracks.includes('developer')) {
    return (
      <Badge variant="secondary" className="text-xs">
        Developer
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-xs">
      General
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Install command copy button                                        */
/* ------------------------------------------------------------------ */

function InstallCommandButton({ command }: { command: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 text-xs"
      onClick={() => copy(command)}
      aria-label={copied ? 'Copied install command' : 'Copy install command'}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-success-muted-foreground" />
          Copied
        </>
      ) : (
        <>
          <Terminal className="h-3.5 w-3.5" />
          Copy install command
        </>
      )}
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/*  File card component                                                */
/* ------------------------------------------------------------------ */

function FileCard({ file }: { file: StarterKitFile }) {
  const [expanded, setExpanded] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const { track } = useTrack();
  const reducedMotion = useReducedMotion();

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
    setShowFullContent(false);
  }, []);

  const platformEntries = Object.entries(file.installInstructions).filter(
    ([, value]) => value,
  );

  // Determine which install instructions to show based on track
  const relevantInstructions =
    track === 'general'
      ? platformEntries.filter(([key]) => key !== 'claudeCode')
      : platformEntries;

  // Preview of rawContent: first ~20 lines
  const contentPreview = useMemo(() => {
    if (!file.rawContent) return null;
    const lines = file.rawContent.split('\n');
    if (lines.length <= 20) return null; // No need for preview if short
    return lines.slice(0, 20).join('\n') + '\n...';
  }, [file.rawContent]);

  // Determine download paths for the file
  const downloadPath = file.isMultiFile
    ? null
    : `/starter-kit/${file.filePath}`;

  // ZIP download path for skill files (generated by build script)
  const zipDownloadPath =
    file.category === 'skill'
      ? `/starter-kit/zips/${file.filePath.split('/')[1]?.split('/')[0] ?? file.id.replace('skill-', '')}.zip`
      : null;

  // Animation props respecting prefers-reduced-motion
  const expandMotionProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, scaleY: 0.95 },
        animate: { opacity: 1, scaleY: 1 },
        exit: { opacity: 0, scaleY: 0.95 },
        transition: {
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
        style: { transformOrigin: 'top' as const },
      };

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5',
        expanded && 'shadow-sm',
      )}
    >
      <button
        onClick={toggleExpanded}
        className={cn(
          'flex w-full items-start gap-3 p-4 text-left cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'rounded-t-xl group',
        )}
        aria-expanded={expanded}
        aria-controls={`file-detail-${file.id}`}
        aria-label={`${expanded ? 'Collapse' : 'View'} ${file.name} details`}
      >
        <div className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground">
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">{file.name}</span>
            <TrackBadge tracks={file.tracks} />
            <PriorityBadge priority={file.priority} />
            <PluginBadge recommendation={file.pluginRecommendation} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {file.description}
          </p>
        </div>
        {/* Hover affordance icon */}
        <div className="mt-0.5 shrink-0 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground">
          <Eye className="h-4 w-4" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={`file-detail-${file.id}`}
            {...expandMotionProps}
            className="overflow-hidden"
          >
            <Separator />
            <CardContent className="space-y-4 pt-4">
              {/* Long description */}
              <p
                className="text-sm leading-relaxed text-muted-foreground"
                style={{ maxWidth: '65ch' }}
              >
                {file.longDescription}
              </p>

              {/* File path — only shown for developers (general users receive files as downloads) */}
              {track === 'developer' && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
                    starter-kit/{file.filePath}
                  </code>
                </div>
              )}

              {/* Install instructions */}
              {relevantInstructions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Installation</h4>
                  {relevantInstructions.map(([platform, instructions]) => {
                    const config = PLATFORM_LABELS[platform];
                    if (!config || !instructions) return null;
                    const Icon = config.icon;
                    return (
                      <div key={platform} className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <Icon className="h-3.5 w-3.5" />
                          {config.label}
                        </div>
                        <div className="rounded-md border border-border bg-muted/30 p-3">
                          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
                            {instructions}
                          </pre>
                          <div className="mt-2 flex items-center">
                            <CopyButton text={instructions} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* File contents (rawContent) */}
              {file.rawContent && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">File Contents</h4>
                  <CodeBlock
                    code={
                      showFullContent || !contentPreview
                        ? file.rawContent
                        : contentPreview
                    }
                    language="markdown"
                    title={file.filePath.split('/').pop() ?? file.name}
                  />
                  {contentPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setShowFullContent((prev) => !prev)}
                    >
                      {showFullContent ? 'Show preview' : 'Show full content'}
                    </Button>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {file.installCommand && (
                  <InstallCommandButton command={file.installCommand} />
                )}
                {downloadPath && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    asChild
                  >
                    <a href={downloadPath} download>
                      <Download className="h-3.5 w-3.5" />
                      Download file
                    </a>
                  </Button>
                )}
                {zipDownloadPath && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    asChild
                  >
                    <a href={zipDownloadPath} download>
                      <Download className="h-3.5 w-3.5" />
                      Download as ZIP
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick start section                                                */
/* ------------------------------------------------------------------ */

function QuickStartSection() {
  const { track } = useTrack();
  const siteConfig = useSiteConfig();
  const starterKitFiles = useMemo(
    () => getStarterKitFiles(siteConfig),
    [siteConfig],
  );

  // Filter steps based on track
  const steps = QUICK_START_STEPS.filter((step) => {
    const file = starterKitFiles.find((f) => f.id === step.fileId);
    return file && file.tracks.includes(track);
  });

  return (
    <Card className="border-success/20 bg-success-muted/30 dark:bg-success-muted/15 dark:border-success/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-success-muted-foreground" />
          <CardTitle className="text-lg">Quick Start</CardTitle>
        </div>
        <CardDescription className="text-base">
          Recommended adoption order — start with the highest-value,
          lowest-effort items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li key={step.fileId} className="flex gap-3">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-muted text-xs font-semibold text-success-muted-foreground"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-base font-medium text-foreground">
                    {step.week}:
                  </span>
                  <span className="text-base font-medium text-foreground">
                    {step.title}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {step.effort}
                  </Badge>
                </div>
                <p className="mt-0.5 text-base text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Plugin guidance callout                                            */
/* ------------------------------------------------------------------ */

function PluginGuidanceCallout() {
  const { track } = useTrack();

  return (
    <CalloutCard variant="info" title="Plugins vs. raw files">
      <div className="space-y-2 text-sm">
        <p>
          The plugin files below are reference copies — they show you exactly
          what each plugin does so you can review before installing.
        </p>
        <p>
          <strong>Recommended:</strong> Install plugins via the Claude Code
          marketplace (
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            claude plugin install plugin-name
          </code>
          ). Marketplace plugins receive automatic updates.
        </p>
        <p>
          <strong>Alternative:</strong> If you prefer not to install a plugin,
          you can copy the raw skill/command files from below and maintain them
          manually. Note that you will not receive updates this way.
        </p>
        <p>
          <Link
            to={`/${track}/governance`}
            className="font-medium text-primary hover:underline"
          >
            See the Governance Policy
          </Link>{' '}
          for approval workflows.
        </p>
      </div>
    </CalloutCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Copyable install snippets section                                  */
/* ------------------------------------------------------------------ */

function InstallSnippets() {
  const { track } = useTrack();
  const isDev = track === 'developer';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">
          {isDev ? 'Common Install Commands' : 'Setup Snippets'}
        </h3>
        <p
          className="mt-1 text-sm text-muted-foreground"
          style={{ maxWidth: '65ch' }}
        >
          {isDev
            ? 'Copy-paste commands for installing skills, commands, and plugins across all Claude platforms.'
            : 'These snippets help you set up Claude to work the way your team needs. Each one is a one-time setup step — copy the text and paste it into your Claude preferences.'}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <p className="mb-1.5 text-sm font-medium text-foreground">
            Set UK English in profile preferences (claude.ai / Claude Desktop)
          </p>
          {!isDev && (
            <p className="mb-2 text-sm text-muted-foreground">
              Paste this into your Claude profile preferences so all
              conversations default to UK English spelling and formatting.
            </p>
          )}
          <CodeBlock
            code="Always use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (£) for currency."
            language="text"
            title="Profile preferences"
          />
        </div>

        {isDev && (
          <>
            <div>
              <p className="mb-1.5 text-sm font-medium text-foreground">
                Add UK English rule to CLAUDE.md
              </p>
              <CodeBlock
                code="- **UK English throughout.** All output must use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (£) for currency."
                language="markdown"
                title="CLAUDE.md"
              />
            </div>

            <div>
              <p className="mb-1.5 text-sm font-medium text-foreground">
                Install a skill globally (Claude Code)
              </p>
              <CodeBlock
                code="cp -r starter-kit/skills/skill-name ~/.claude/skills/skill-name"
                language="bash"
                title="Global skill install"
              />
            </div>

            <div>
              <p className="mb-1.5 text-sm font-medium text-foreground">
                Install a skill per-project (Claude Code)
              </p>
              <CodeBlock
                code="cp -r starter-kit/skills/skill-name .claude/skills/skill-name"
                language="bash"
                title="Project skill install"
              />
            </div>

            <div>
              <p className="mb-1.5 text-sm font-medium text-foreground">
                Install a command (Claude Code)
              </p>
              <CodeBlock
                code="cp starter-kit/commands/command-name.md .claude/commands/command-name.md"
                language="bash"
                title="Command install"
              />
            </div>

            <div>
              <p className="mb-1.5 text-sm font-medium text-foreground">
                Install a plugin from the marketplace (Claude Code)
              </p>
              <CodeBlock
                code="claude plugin install <plugin-name>"
                language="bash"
                title="Plugin install"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Installation guides section                                        */
/* ------------------------------------------------------------------ */

function InstallationGuides() {
  const { track } = useTrack();
  const [activeTab, setActiveTab] = useState(
    track === 'developer' ? 'code' : 'desktop',
  );

  const defaultTab = track === 'developer' ? 'code' : 'desktop';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">How to Install</h3>

      <Tabs
        defaultValue={defaultTab}
        onValueChange={(val) => setActiveTab(val)}
      >
        <TabsList className="w-full justify-start bg-muted/40">
          <TabsTrigger value="desktop" className="gap-1.5">
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Claude Desktop</span>
            <span className="sm:hidden">Desktop</span>
          </TabsTrigger>
          <TabsTrigger value="web" className="gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">claude.ai</span>
            <span className="sm:hidden">Web</span>
          </TabsTrigger>
          {track === 'developer' && (
            <TabsTrigger value="code" className="gap-1.5">
              <Terminal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Claude Code</span>
              <span className="sm:hidden">Code</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="admin" className="gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Teams Admin</span>
            <span className="sm:hidden">Admin</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="desktop" className="mt-4">
          <TabFadeWrapper key={`desktop-${activeTab}`}>
            <Card>
              <CardContent className="pt-6">
                <h4 className="mb-3 text-base font-medium">
                  Installing Skills on Claude Desktop
                </h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      1.
                    </span>
                    Download the skill file (or ZIP for multi-file skills)
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      2.
                    </span>
                    Open Claude Desktop and go to{' '}
                    <strong className="text-foreground">Settings</strong>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      3.
                    </span>
                    Navigate to{' '}
                    <strong className="text-foreground">
                      Capabilities &gt; Skills
                    </strong>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      4.
                    </span>
                    Click{' '}
                    <strong className="text-foreground">
                      &ldquo;Upload skill&rdquo;
                    </strong>{' '}
                    and select the downloaded file
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      5.
                    </span>
                    The skill appears in your Skills list and activates
                    automatically
                  </li>
                </ol>
                <CalloutCard
                  variant="tip"
                  title="Automatic invocation"
                  className="mt-4"
                >
                  Skills are invoked automatically based on your task. You do
                  not need to reference the skill by name — just describe what
                  you need and Claude will use the relevant skill.
                </CalloutCard>
              </CardContent>
            </Card>
          </TabFadeWrapper>
        </TabsContent>

        <TabsContent value="web" className="mt-4">
          <TabFadeWrapper key={`web-${activeTab}`}>
            <Card>
              <CardContent className="pt-6">
                <h4 className="mb-3 text-base font-medium">
                  Installing Skills on claude.ai
                </h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      1.
                    </span>
                    Download the skill file (or ZIP for multi-file skills)
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      2.
                    </span>
                    Go to <strong className="text-foreground">claude.ai</strong>{' '}
                    and open{' '}
                    <strong className="text-foreground">Settings</strong>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      3.
                    </span>
                    Navigate to{' '}
                    <strong className="text-foreground">
                      Capabilities &gt; Skills
                    </strong>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      4.
                    </span>
                    Click{' '}
                    <strong className="text-foreground">
                      &ldquo;Upload skill&rdquo;
                    </strong>{' '}
                    and select the downloaded file
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      5.
                    </span>
                    The skill activates automatically when your task matches its
                    description
                  </li>
                </ol>
                <CalloutCard
                  variant="tip"
                  title="Alternative: Projects"
                  className="mt-4"
                >
                  For recurring workflows, consider adding skill files to a
                  Project&apos;s knowledge base instead. This gives every
                  conversation in that project automatic access.
                </CalloutCard>
              </CardContent>
            </Card>
          </TabFadeWrapper>
        </TabsContent>

        {track === 'developer' && (
          <TabsContent value="code" className="mt-4">
            <TabFadeWrapper key={`code-${activeTab}`}>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="mb-3 text-base font-medium">
                    Installing on Claude Code
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-medium text-foreground">
                        Skills
                      </p>
                      <CodeBlock
                        code="# Project-level (available in this project only)\ncp -r starter-kit/skills/skill-name .claude/skills/skill-name\n\n# Global (available in all projects)\ncp -r starter-kit/skills/skill-name ~/.claude/skills/skill-name"
                        language="bash"
                        title="Install a skill"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-foreground">
                        Commands
                      </p>
                      <CodeBlock
                        code="cp starter-kit/commands/command-name.md .claude/commands/command-name.md"
                        language="bash"
                        title="Install a command"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-foreground">
                        Plugins
                      </p>
                      <CodeBlock
                        code="claude plugin install <plugin-name>"
                        language="bash"
                        title="Install a plugin"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabFadeWrapper>
          </TabsContent>
        )}

        <TabsContent value="admin" className="mt-4">
          <TabFadeWrapper key={`admin-${activeTab}`}>
            <Card>
              <CardContent className="pt-6">
                <h4 className="mb-3 text-base font-medium">
                  Provisioning Skills Organisation-Wide
                </h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      1.
                    </span>
                    Download the skill ZIP file
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      2.
                    </span>
                    Open the{' '}
                    <strong className="text-foreground">
                      Teams admin console
                    </strong>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      3.
                    </span>
                    Navigate to{' '}
                    <strong className="text-foreground">
                      Organisation settings &gt; Skills
                    </strong>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      4.
                    </span>
                    Upload the skill ZIP
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-medium text-foreground">
                      5.
                    </span>
                    Set as{' '}
                    <strong className="text-foreground">
                      enabled-by-default
                    </strong>{' '}
                    for all users
                  </li>
                </ol>
                <CalloutCard
                  variant="info"
                  title="Best for organisations"
                  className="mt-4"
                >
                  Admin-provisioned skills require zero action from end users —
                  the skills simply appear in their Claude instance. This is the
                  recommended approach for team-wide deployment.
                </CalloutCard>
              </CardContent>
            </Card>
          </TabFadeWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  File browser — main interactive component                          */
/* ------------------------------------------------------------------ */

/** Default number of cards shown before "Show all" */
const INITIAL_CARD_COUNT = 5;

function FileBrowser() {
  const { track } = useTrack();
  const siteConfig = useSiteConfig();
  const { config } = useClientConfig();
  const enabledCustomCategories = config.starterKit?.enabledCustomCategories;
  const starterKitFiles = useMemo(
    () => getStarterKitFiles(siteConfig),
    [siteConfig],
  );
  const categories = getCategoriesForTrack(starterKitFiles, track);
  const defaultTab = categories[0] || 'skill';
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const toggleShowAll = useCallback((category: string) => {
    setShowAll((prev) => ({ ...prev, [category]: !prev[category] }));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">File Browser</h3>
          <p
            className="mt-1 text-sm text-muted-foreground"
            style={{ maxWidth: '65ch' }}
          >
            Browse all starter kit files by category. Click any item to see full
            details, installation instructions, and copy commands.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 shrink-0 w-full sm:w-auto whitespace-nowrap"
          asChild
        >
          <a
            href="/starter-kit.zip"
            download
            aria-label="Download starter kit as ZIP file"
          >
            <Download className="h-4 w-4" />
            <span>Download All as ZIP</span>
          </a>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Individual skill ZIPs are also available on each skill card — useful for
        uploading directly to Claude Desktop, claude.ai, or the Teams admin
        console.
      </p>

      <Tabs
        defaultValue={defaultTab}
        onValueChange={(val) => setActiveTab(val)}
      >
        <TabsList className="w-full flex-wrap justify-start bg-muted/40">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            const { baseFiles: catBase, customFiles: catCustom } =
              getFilteredFilesForCategoryAndTrack(
                starterKitFiles,
                category,
                track,
                enabledCustomCategories,
              );
            const totalVisible = catBase.length + catCustom.length;
            return (
              <TabsTrigger key={category} value={category} className="gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {CATEGORY_LABELS[category]}
                </span>
                <span className="sm:hidden">
                  {CATEGORY_SHORT_LABELS[category]}
                </span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {totalVisible}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => {
          const { baseFiles, customFiles } =
            getFilteredFilesForCategoryAndTrack(
              starterKitFiles,
              category,
              track,
              enabledCustomCategories,
            );
          const isShowingAll = showAll[category] ?? false;
          const allVisibleFiles = [...baseFiles, ...customFiles];

          // Apply show-more limit across all visible files, prioritising base files
          let baseFilesVisible = baseFiles;
          let customFilesVisible = customFiles;

          if (!isShowingAll && allVisibleFiles.length > INITIAL_CARD_COUNT) {
            if (baseFiles.length >= INITIAL_CARD_COUNT) {
              baseFilesVisible = baseFiles.slice(0, INITIAL_CARD_COUNT);
              customFilesVisible = [];
            } else {
              baseFilesVisible = baseFiles;
              customFilesVisible = customFiles.slice(
                0,
                INITIAL_CARD_COUNT - baseFiles.length,
              );
            }
          }

          return (
            <TabsContent key={category} value={category} className="mt-4">
              <TabFadeWrapper key={`browser-${activeTab}`}>
                {category === 'plugin' && <PluginGuidanceCallout />}
                <div className="mt-4 space-y-3">
                  {/* Base files */}
                  {baseFilesVisible.map((file) => (
                    <FileCard key={file.id} file={file} />
                  ))}

                  {/* Custom files separator */}
                  {customFilesVisible.length > 0 && (
                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                        Additional for your organisation
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}

                  {/* Custom files */}
                  {customFilesVisible.map((file) => (
                    <FileCard key={file.id} file={file} />
                  ))}

                  {allVisibleFiles.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No files in this category for your current track.
                    </p>
                  )}
                </div>

                {/* Show all / show fewer button */}
                {allVisibleFiles.length > INITIAL_CARD_COUNT && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleShowAll(category)}
                      className="gap-1.5"
                    >
                      {isShowingAll ? (
                        <>Show fewer</>
                      ) : (
                        <>
                          Show all {allVisibleFiles.length} files
                          <Badge variant="secondary" className="ml-1 text-xs">
                            +{allVisibleFiles.length - INITIAL_CARD_COUNT}
                          </Badge>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabFadeWrapper>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Track completion callout                                           */
/* ------------------------------------------------------------------ */

function TrackCompletionCallout() {
  const { track } = useTrack();
  const isDev = track === 'developer';
  const siteConfig = useSiteConfig();
  const showOtherTrack = isDev || siteConfig.hasDeveloperTrack;

  return (
    <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10 dark:border-primary/30">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
          <div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              You&apos;ve completed the {isDev ? 'Developer' : 'General Users'}{' '}
              track
            </h3>
            <p
              className="mb-4 text-sm leading-relaxed text-muted-foreground"
              style={{ maxWidth: '65ch' }}
            >
              {isDev
                ? 'You now have everything you need to use Claude Code effectively — from CLAUDE.md setup to testing, plugins, and governance. The starter kit files above will get your projects up and running quickly.'
                : 'You now have a solid foundation for using Claude effectively — from context management to skills, governance, and brand voice. The starter kit files above will help you put it all into practice.'}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:underline"
              >
                Back to homepage
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {showOtherTrack && (
                <Link
                  to={isDev ? '/general' : '/developer'}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:underline"
                >
                  Explore the {isDev ? 'General Users' : 'Developer'} track
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Found this playbook useful — or spotted something that could be
              better? Use the feedback button in the bottom-right corner to let
              us know.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section component                                             */
/* ------------------------------------------------------------------ */

export function StarterKitSection() {
  const { track } = useTrack();
  const isDev = track === 'developer';
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion ? {} : fadeInUp;
  const motionFadeProps = prefersReducedMotion ? {} : fadeIn;

  return (
    <div className="space-y-12">
      {/* -- Introduction ------------------------------------------- */}
      <motion.section {...motionProps} aria-labelledby="starter-kit-intro">
        <h2
          id="starter-kit-intro"
          className="mb-4 text-xl font-bold tracking-tight sm:text-2xl"
          style={{ lineHeight: 1.2 }}
        >
          Starter Kit
        </h2>
        <div
          className="space-y-4 text-base leading-relaxed text-muted-foreground"
          style={{ maxWidth: '65ch' }}
        >
          <p className="text-foreground/80">
            Your toolkit for getting the most from Claude. Everything here is
            ready to use — pick what fits your workflow and start straight away.
          </p>
          <p>
            The starter kit is a collection of ready-to-use skill files,
            templates, prompts, and plugin references that you can drop into
            your Claude environment straight away.
          </p>
          <p>
            {isDev ? (
              <>
                There are two ways to get these files: browse and copy from this
                page, or grab the{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                  starter-kit/
                </code>{' '}
                folder from the project repository.
              </>
            ) : (
              <>
                Browse and copy the files you need directly from this page.
                Every file has a copy button and installation instructions for
                your platform.
              </>
            )}
          </p>
          <p>
            <strong className="text-foreground">Key distinction:</strong>{' '}
            Plugins installed via the marketplace receive automatic updates.
            Files you copy manually will need to be maintained by your team. The
            governance policy covers the approval process for each type.
          </p>
        </div>
      </motion.section>

      <Separator />

      {/* -- Quick start -------------------------------------------- */}
      <motion.section
        {...motionFadeProps}
        aria-labelledby="quick-start-heading"
      >
        <QuickStartSection />
      </motion.section>

      <Separator />

      {/* -- Installation guides ------------------------------------ */}
      <motion.section {...motionFadeProps} aria-labelledby="install-guides">
        <InstallationGuides />
      </motion.section>

      <Separator />

      {/* -- Markdown reader recommendation ----------------------------- */}
      <motion.section {...motionFadeProps}>
        <CalloutCard variant="tip" title="Reading markdown files">
          <div className="space-y-2 text-sm">
            {isDev ? (
              <>
                <p>
                  Skill files and templates use markdown format. In VS Code,
                  press{' '}
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-xs font-mono">
                    Cmd+Shift+V
                  </kbd>{' '}
                  (Mac) or{' '}
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-xs font-mono">
                    Ctrl+Shift+V
                  </kbd>{' '}
                  (Windows/Linux) to preview any .md file with formatting.
                </p>
                <p>
                  For quick browser-based editing,{' '}
                  <a
                    href="https://stackedit.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    StackEdit
                  </a>{' '}
                  is a free online markdown editor — no signup required.
                </p>
              </>
            ) : (
              <>
                <p>
                  The skill files and templates below are in markdown format
                  (.md files). If you are not familiar with markdown, don&apos;t
                  worry — it is just plain text with simple formatting.
                </p>
                <p>
                  To view or edit .md files with formatting,{' '}
                  <a
                    href="https://stackedit.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    StackEdit
                  </a>{' '}
                  is a free online editor (no signup required). You can also ask
                  Claude to convert any markdown file to Word or PDF format.
                </p>
              </>
            )}
          </div>
        </CalloutCard>
      </motion.section>

      <Separator />

      {/* -- File browser ------------------------------------------- */}
      <motion.section {...motionFadeProps} aria-labelledby="file-browser">
        <FileBrowser />
      </motion.section>

      <Separator />

      {/* -- Common install snippets -------------------------------- */}
      <motion.section {...motionFadeProps} aria-labelledby="install-snippets">
        <InstallSnippets />
      </motion.section>

      <Separator />

      {/* -- Maintenance note --------------------------------------- */}
      <motion.section {...motionFadeProps}>
        <CalloutCard variant="info" title="Keeping your starter kit current">
          <div className="space-y-2 text-sm">
            <p>
              Plugins installed from the marketplace update automatically — no
              action needed.
            </p>
            <p>
              Skills, commands, and templates that you copy manually are your
              responsibility to maintain. Set a reminder to review them
              periodically (the governance policy template includes a review
              schedule).
            </p>
            <p>
              If a skill or template is updated in this playbook, you will need
              to re-copy the updated version to your environment.
            </p>
          </div>
        </CalloutCard>
      </motion.section>

      <Separator />

      {/* -- Track completion --------------------------------------- */}
      <motion.section {...motionFadeProps}>
        <TrackCompletionCallout />
      </motion.section>
    </div>
  );
}
