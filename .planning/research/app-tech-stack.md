# App Tech Stack Research — Phase 0.7

> **Date:** 2026-02-14
> **Context:** Vite + React + Tailwind CSS playbook app with two audience tracks (General / Developer), hosted on Vercel.
> **Goal:** Select libraries, component frameworks, and interaction patterns optimised for build-agent output quality, lightweight delivery, and developer ergonomics.

---

## Summary Recommendation Table

| Decision Area | Recommendation | Package | Rationale |
|---|---|---|---|
| Component library | **shadcn/ui** | `shadcn` (CLI) | Built on Radix + Tailwind; dominant in AI training data; copy-paste ownership model |
| Visualisation (context simulator) | **Custom SVG + Tailwind** | None (hand-rolled) | Proportional bar is too simple for a charting lib; keeps bundle tiny |
| Decision tree | **Accordion-wizard hybrid** | shadcn Accordion + custom state | Familiar mobile-friendly pattern; no extra dependency |
| Copy-to-clipboard | **Native Clipboard API + custom hook** | None | `navigator.clipboard.writeText()` has universal modern support; no library needed |
| Routing | **React Router v7 (library mode)** | `react-router` | Mature, well-documented, excellent AI training representation; library mode = no framework overhead |
| Syntax highlighting | **Shiki via react-shiki** | `react-shiki` | VS Code-quality grammar; React component wrapper; good theme ecosystem |
| Animation (micro-interactions) | **Motion** | `motion` | Layout animations for accordion/expand; lightweight import via `motion/react` |

---

## 1. Component Library

### Options Evaluated

| Library | Tailwind Integration | AI Training Data | Bundle Approach | Accessibility |
|---|---|---|---|---|
| **shadcn/ui** | Native (built for Tailwind) | Exceptional — 90k+ GitHub stars, Vercel v0.dev generates shadcn code | Copy into project (zero runtime dep) | Radix primitives (WAI-ARIA) |
| Radix UI (direct) | Unstyled — you provide all CSS | Good | npm dependency | Excellent |
| Headless UI | Works with Tailwind but less ergonomic | Moderate | npm dependency | Good |
| DaisyUI | Tailwind plugin | Growing | CSS classes only | Variable |

### Recommendation: **shadcn/ui**

**Why:**
- **AI agent quality** is the critical factor. shadcn/ui is the most widely represented React + Tailwind component library in Claude's training data. Vercel's v0.dev already generates shadcn components, establishing it as the de facto standard for AI-assisted React/Tailwind development.
- Components are copied into the project (`/src/components/ui/`), meaning no version-lock dependency — the build agent can read and modify them directly.
- Built on Radix UI primitives, so accessibility comes free.
- The CLI (`npx shadcn@latest add <component>`) scaffolds individual components on demand, keeping the bundle lean.

**Components needed for this project:**
- `accordion` — decision tree sections, collapsible content
- `tabs` — General / Developer track switching
- `button` — actions, CTA
- `card` — content blocks, prompt examples
- `badge` — labels, track indicators
- `separator` — visual dividers
- `tooltip` — contextual help
- `collapsible` — expandable sections
- `scroll-area` — scrollable content regions
- `alert` — callouts and warnings

**Setup with Vite:**
```bash
npx shadcn@latest init
```
The CLI detects Vite + Tailwind and configures `@` path aliases, `components.json`, and the `src/components/ui/` directory automatically.

---

## 2. Visualisation — Context Window Simulator

### Options Evaluated

| Approach | Bundle Size | Interactivity | Complexity | AI Code Quality |
|---|---|---|---|---|
| **Custom SVG + Tailwind** | 0 KB | Full control | Low-medium | Excellent — simple React code |
| D3.js | ~80 KB min | Overkill | High | Good but verbose |
| Recharts | ~45 KB min | Good for charts | Medium | Good for standard charts |
| CSS-only (div widths) | 0 KB | Limited | Low | Excellent |

### Recommendation: **Custom SVG + Tailwind CSS (with Motion for transitions)**

**Why:**
The context window simulator is fundamentally a proportional stacked bar — "200k tokens total, here's how much is used by system prompt, conversation history, and user message." This is a layout problem, not a charting problem. D3 or Recharts would add significant bundle weight for something achievable with a few `<div>` elements and Tailwind width utilities.

**Implementation pattern:**
```tsx
// Simplified concept — proportional bar segments
interface Segment {
  label: string;
  tokens: number;
  color: string;
}

function ContextWindowBar({ segments, maxTokens = 200000 }: Props) {
  return (
    <div className="flex h-10 w-full rounded-lg overflow-hidden bg-muted">
      {segments.map((seg) => (
        <motion.div
          key={seg.label}
          layout
          className={`${seg.color} flex items-center justify-center text-xs`}
          style={{ width: `${(seg.tokens / maxTokens) * 100}%` }}
        >
          {seg.label}
        </motion.div>
      ))}
    </div>
  );
}
```

**Interactive elements:**
- "Add message" button grows the conversation segment (Motion animates the width transition).
- Degradation zone: when usage exceeds ~80%, the bar shifts colour via Tailwind's conditional classes.
- Tooltip on hover/tap shows exact token counts (shadcn `Tooltip`).

This approach keeps the bundle at zero extra KB for the visualisation itself, with Motion providing smooth transitions.

---

## 3. Decision Tree — "I want to..."

### Options Evaluated

| Pattern | Mobile UX | Implementation Cost | Discoverability |
|---|---|---|---|
| **Accordion-wizard hybrid** | Excellent | Low (shadcn Accordion) | High — all options visible |
| Flowchart (react-flow) | Poor on mobile | High + ~150 KB | Visual but complex |
| Guided wizard (multi-step) | Good | Medium | Moderate — one step at a time |
| Simple linked cards | Good | Low | High |

### Recommendation: **Accordion-based progressive disclosure with stepper state**

**Why:**
- The decision tree has a known, finite structure ("I want to... modify prompts / add tools / extend reasoning / ..."). This maps naturally to an accordion where each top-level item expands to reveal sub-options and guidance.
- Mobile-first: accordions work on every screen size with zero layout issues.
- shadcn's `Accordion` and `Collapsible` components provide animated expand/collapse out of the box.
- A flowchart (react-flow) would add ~150 KB of bundle for a visualisation that becomes unusable on mobile screens.

**Implementation pattern:**
```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="modify-prompts">
    <AccordionTrigger>I want to modify how Claude responds</AccordionTrigger>
    <AccordionContent>
      {/* Sub-options with cards linking to relevant playbook sections */}
      <Card>System prompts - see Section 3.2</Card>
      <Card>Custom instructions - see Section 3.3</Card>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="add-tools">
    <AccordionTrigger>I want to give Claude new capabilities</AccordionTrigger>
    <AccordionContent>
      <Card>MCP servers - see Section 4.1</Card>
      <Card>Tool use - see Section 4.2</Card>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

For deeper trees (more than two levels), nest a second accordion or use `Collapsible` within the content area. The `motion` layout animation on expand/collapse provides a polished feel.

---

## 4. Copy-to-Clipboard

### Options Evaluated

| Approach | Bundle Size | Browser Support | Complexity |
|---|---|---|---|
| **navigator.clipboard.writeText()** | 0 KB | All modern browsers | Minimal |
| clipboard.js | ~3 KB | Legacy support | Low |
| react-copy-to-clipboard | ~2 KB | Legacy support | Low |

### Recommendation: **Native Clipboard API with a custom hook**

**Why:**
- `navigator.clipboard.writeText()` is supported in all modern browsers (Chrome 66+, Firefox 63+, Safari 13.1+, Edge 79+). For a 2026 app, there is no need for a polyfill or library.
- A 15-line custom hook is trivially simple and avoids any dependency.
- The API requires a secure context (HTTPS) — Vercel provides this by default.

**Implementation:**
```tsx
import { useState, useCallback } from 'react';

export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [resetDelay]);

  return { copied, copy };
}
```

**Usage with shadcn Button:**
```tsx
function CopyButton({ text }: { text: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <Button variant="ghost" size="sm" onClick={() => copy(text)}>
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}
```

---

## 5. Routing

### Options Evaluated

| Approach | SEO (Vercel) | Complexity | Track Switching | AI Training Data |
|---|---|---|---|---|
| **React Router v7 (library mode)** | Good with pre-rendering | Low-medium | URL-based tracks | Excellent |
| React Router v6 | Good | Low | URL-based tracks | Excellent |
| Hash-based routing | Poor | Very low | Works | Moderate |
| Scroll anchors (no router) | Poor | Very low | Limited | N/A |

### Recommendation: **React Router v7 in library mode**

**Why:**
- React Router v7 is the current recommended version. In **library mode**, it works as a standard client-side router with Vite — no framework mode, no SSR complexity, no Vite plugin required.
- Library mode uses the familiar `createBrowserRouter` + `RouterProvider` pattern, which is extensively represented in training data.
- v7 is ~15% smaller than v6, eliminates the separate `react-router-dom` package (everything is in `react-router`), and adds TypeScript improvements.
- URL-based routing enables direct linking to tracks (`/general/section-3` vs `/developer/section-3`) and individual sections.
- Vercel handles SPA fallback routing natively (rewrites `/*` to `/index.html`).

**Route structure:**
```tsx
import { createBrowserRouter, RouterProvider } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: ':track',  // 'general' or 'developer'
        element: <TrackLayout />,
        children: [
          { index: true, element: <TrackOverview /> },
          { path: ':section', element: <Section /> },
        ],
      },
    ],
  },
]);
```

**Vercel config** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Why not v6:** v7 is a non-breaking upgrade from v6 with a smaller bundle. There is no reason to start a new project on v6.

**Why not hash routing:** Hash URLs (`/#/general/section-3`) are inferior for SEO and sharing. Vercel's SPA rewrite support eliminates the only reason to use hash routing.

**Why not scroll anchors only:** Two audience tracks require actual route-level navigation, not just scroll positions. Scroll anchors can supplement routing for within-page navigation.

---

## 6. Syntax Highlighting

### Options Evaluated

| Library | Accuracy | Bundle Size | React Integration | Theme Quality |
|---|---|---|---|---|
| **Shiki (via react-shiki)** | VS Code-grade (TextMate grammar) | ~250 KB (web bundle, lazy-loaded) | `react-shiki` component | Excellent (VS Code themes) |
| prism-react-renderer | Good (Prism tokeniser) | ~15 KB core + languages | Built-in render props | Good |
| react-syntax-highlighter | Moderate | ~40 KB+ | Component | Adequate |
| highlight.js | Good | ~30 KB + languages | Manual integration | Good |

### Recommendation: **Shiki via react-shiki**

**Why:**
- **Accuracy matters for a developer playbook.** Shiki uses TextMate grammars (the same engine as VS Code), providing significantly better TypeScript, JSON, and YAML highlighting than Prism. Given this app contains prompt examples and code snippets for developers, highlighting quality directly affects credibility.
- `react-shiki` provides a clean React component wrapper with hook-based API (`useShikiHighlighter`), avoiding the need for raw HTML injection patterns.
- The `shiki/bundle/web` entry point includes common web languages (JS, TS, JSON, HTML, CSS, YAML, bash) at ~250 KB, which is lazy-loaded and cached. For a content-focused app that is not performance-critical on first paint, this is acceptable.
- Shiki supports dual themes (light/dark) natively, which pairs well with Tailwind's dark mode.

**Setup:**
```tsx
// components/CodeBlock.tsx
import ShikiHighlighter from 'react-shiki';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  return (
    <div className="relative group rounded-lg overflow-hidden">
      <ShikiHighlighter language={language} theme="github-dark">
        {code.trim()}
      </ShikiHighlighter>
      <CopyButton text={code} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" />
    </div>
  );
}
```

**Why not prism-react-renderer:** Prism's TypeScript tokenisation is noticeably weaker than Shiki's. For a developer-facing playbook with extensive code examples, the quality difference is visible and worth the size trade-off.

**Mitigation for bundle size:** Use `shiki/bundle/web` (not the full bundle) and load the highlighter lazily. The component only initialises when a code block scrolls into view or on first render.

---

## 7. Animation — Micro-interactions

### Recommendation: **Motion (formerly Framer Motion)**

**Package:** `motion` (import from `motion/react`)

**Why:**
- Layout animations for accordion expand/collapse, tab transitions, and the context window simulator segments resizing.
- Motion is the most widely-used React animation library (18M+ monthly npm downloads), meaning excellent AI training data representation.
- The `layout` prop provides automatic animation of layout changes with zero configuration — ideal for the context window bar resizing.
- Lightweight import: `import { motion } from 'motion/react'` tree-shakes effectively.

**Usage in this project:**
- Context window bar segment width transitions
- Accordion expand/collapse (supplement shadcn's built-in animation)
- Page/section transitions when navigating between tracks
- Feedback widget slide-in

**Keep it minimal:** Only use Motion where CSS transitions are insufficient (layout shifts, shared layout animations). For simple hover/focus effects, prefer Tailwind's `transition-*` utilities.

---

## 8. Other Patterns and Libraries

### Feedback Widget
**Approach:** Custom component using shadcn `Card`, `Button`, and `Textarea`. No library needed. Store responses in localStorage or a simple API endpoint.

### Responsive Layout
**Approach:** Tailwind responsive utilities (`sm:`, `md:`, `lg:`). No CSS-in-JS or grid library needed.

### Icons
**Recommendation:** `lucide-react` — already the default icon set for shadcn/ui, tree-shakeable, 1000+ icons.

### Content Management
**Recommendation:** Co-locate content as TypeScript objects/arrays in a `/src/content/` directory. For a playbook of this scope, a CMS or MDX pipeline adds unnecessary complexity. If content grows significantly, MDX can be added later.

### Dark Mode
**Recommendation:** Tailwind's `darkMode: 'class'` strategy with a toggle component. shadcn/ui components support dark mode out of the box.

---

## Quick Start — Exact Packages to Install

### 1. Scaffold the project
```bash
npm create vite@latest follow-up-and-feedback -- --template react-ts
cd follow-up-and-feedback
```

### 2. Install core dependencies
```bash
# Tailwind CSS (Vite plugin)
npm install tailwindcss @tailwindcss/vite

# Routing
npm install react-router

# Animation
npm install motion

# Syntax highlighting
npm install react-shiki shiki

# Icons (used by shadcn/ui)
npm install lucide-react
```

### 3. Initialise shadcn/ui
```bash
npx shadcn@latest init
```
When prompted, select:
- Style: **Default**
- Base color: **Slate** (or project preference)
- CSS variables: **Yes**

### 4. Add shadcn components
```bash
npx shadcn@latest add accordion tabs button card badge separator tooltip collapsible scroll-area alert
```

### 5. Total new dependencies
| Package | Purpose | Approx. Size (min+gzip) |
|---|---|---|
| `react-router` | Routing | ~14 KB |
| `motion` | Animation | ~18 KB (tree-shaken) |
| `react-shiki` + `shiki` | Syntax highlighting | ~5 KB + ~250 KB lazy |
| `lucide-react` | Icons | ~0 KB (tree-shaken per icon) |
| shadcn components | UI | 0 KB runtime (copied source) |
| **Total eager** | | **~37 KB** |

---

## Architectural Conventions for Build Agents

The following conventions should be followed by any AI build agent working on this project.

### File Structure
```
src/
  components/
    ui/               # shadcn/ui components (auto-generated, do not edit directly)
    layout/           # AppLayout, TrackLayout, Header, Footer
    interactive/      # ContextWindowSimulator, DecisionTree, FeedbackWidget
    content/          # CodeBlock, CopyButton, PromptExample, CalloutCard
  hooks/
    useCopyToClipboard.ts
    useTrack.ts       # Current track context (general/developer)
  content/
    general/          # Track-specific content as TS modules
    developer/        # Track-specific content as TS modules
    shared/           # Content shared across tracks
  routes/
    index.tsx         # Route definitions
  lib/
    utils.ts          # shadcn utility (cn function)
  App.tsx
  main.tsx
```

### Naming Conventions
- Components: PascalCase files and exports (`CodeBlock.tsx`)
- Hooks: camelCase with `use` prefix (`useCopyToClipboard.ts`)
- Content modules: kebab-case (`context-window-guide.ts`)
- shadcn components: leave in `ui/` with their generated names

### Import Conventions
- Use `@/` path alias for all imports (configured by shadcn init)
- Import Motion as: `import { motion, AnimatePresence } from 'motion/react'`
- Import router as: `import { createBrowserRouter, RouterProvider, useParams } from 'react-router'`

### Component Patterns
- **Prefer composition over configuration.** Build complex UI by composing shadcn primitives, not by creating mega-components with many props.
- **Co-locate state.** Keep state as close to where it is used as possible. The track selection is the only truly global state (use React context or URL params).
- **Content as data.** Playbook content should be defined as typed objects, not hard-coded JSX. This enables track filtering and future content management.

### Styling Rules
- Use Tailwind utility classes exclusively. No CSS modules, styled-components, or inline style objects (except for dynamic values like the context window bar widths).
- Use the `cn()` utility from shadcn for conditional class merging.
- Prefer shadcn's CSS variables (`--primary`, `--muted`, etc.) for theming consistency.

### Performance Guidelines
- Lazy-load the Shiki highlighter — do not import at the top of the app.
- Use React Router's lazy route loading for track pages if the bundle grows.
- Keep Motion animations to layout changes and enter/exit transitions only. Use Tailwind `transition-*` for hover and focus states.

---

## Combinations That Work Well Together

1. **shadcn Accordion + Motion layout:** shadcn's Accordion uses Radix's built-in animation, but wrapping content in `motion.div` with `layout` prop enables smoother content-aware transitions when accordion items contain variable-height content.

2. **shadcn Tabs + React Router params:** Use the URL param (`:track`) as the controlled value for shadcn Tabs, so the General/Developer toggle is both a tab switch and a route change. This keeps the URL in sync with the UI without additional state management.

3. **CodeBlock + CopyButton + shadcn Card:** Wrap code examples in a shadcn Card with the CodeBlock (react-shiki) inside and a CopyButton absolutely positioned in the top-right corner. This creates a consistent, reusable prompt/code display pattern across the entire playbook.

4. **shadcn Tooltip + Context Window Simulator:** Use shadcn's Tooltip on each segment of the proportional bar to show token counts and percentages on hover/tap without cluttering the visualisation.

5. **Content-as-data + Track filtering:** Define each content section with a `tracks: ('general' | 'developer')[]` property. The layout component filters sections based on the current route's track parameter, enabling a single content source with dual presentation.

---

## References

- [shadcn/ui documentation](https://ui.shadcn.com/)
- [shadcn/ui vs Radix UI comparison](https://makersden.io/blog/react-ui-libs-2025-comparing-shadcn-radix-mantine-mui-chakra)
- [React Router v7 modes](https://reactrouter.com/start/modes)
- [React Router v7 vs v6](https://medium.com/@ignatovich.dm/react-router-7-vs-6-whats-new-and-should-you-upgrade-93bba58576a8)
- [Motion (formerly Framer Motion)](https://motion.dev/docs/react)
- [Shiki syntax highlighter](https://shiki.style/)
- [Shiki vs Prism comparison](https://chsm.dev/blog/2025/01/08/shiki-code-highlighting)
- [react-shiki on GitHub](https://github.com/avgvstvs96/react-shiki)
- [Clipboard API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [useCopyToClipboard hook pattern](https://usehooks.com/usecopytoclipboard)
