# Remotion Evaluation: Context Window Simulator

> **Date:** 2026-02-14
> **Context:** Evaluating Remotion as an alternative to Custom SVG/div + Tailwind + Motion for the interactive context window simulator and other animated components in the playbook app.
> **Current recommendation:** Custom SVG/div + Tailwind CSS + Motion (from app-tech-stack.md)
> **Alternative under evaluation:** Remotion (React framework for programmatic video/animation)

---

## TL;DR Recommendation

**Stick with the current recommendation: Custom div + Tailwind + Motion.**

Remotion is purpose-built for programmatic video creation and rendering, not interactive web UI. The context window simulator is fundamentally a user-driven, state-reactive layout component -- exactly what React + Tailwind + Motion already handles well. Remotion would add significant dependency weight, architectural complexity, and a paradigm mismatch (timeline-driven vs. event-driven) for no meaningful gain in this use case.

Remotion would only become the right choice if the project scope expanded to include **rendered video output** (e.g., exportable MP4 explainer videos, social media clips, or auto-generated training content).

---

## 1. What Remotion Brings That Custom SVG/div Does Not

### Genuine capabilities

| Capability | Remotion | Custom div + Motion | Relevant to this project? |
|---|---|---|---|
| **Video export (MP4/WebM)** | Yes -- core feature. Server-side or Lambda rendering | No | Not currently required |
| **Frame-accurate timeline control** | Yes -- `useCurrentFrame()` provides deterministic frame-by-frame animation | Partial -- Motion handles transitions declaratively, not frame-by-frame | Marginally useful for the degradation gradient animation |
| **Complex multi-scene sequencing** | Yes -- `<Sequence>`, `<Series>`, nested compositions with precise timing | Manual with `AnimatePresence` + state management | Useful if building multi-step animated walkthroughs |
| **Spring physics with duration control** | Yes -- `spring()` with configurable mass/damping/stiffness + explicit duration | Yes -- Motion has equivalent spring physics | Wash |
| **Easing/interpolation library** | Yes -- `interpolate()` with clamping, `Easing.*` curves, bezier | Yes -- Motion has its own easing, CSS transitions available | Wash |
| **Deterministic rendering** | Yes -- every frame is reproducible. No CSS transition timing variance | No -- CSS/JS animations have minor timing variance | Not needed for interactive UI |
| **Remotion Player (embed in React)** | Yes -- `<Player>` component embeds compositions in a React app with timeline controls | N/A | See section 3 |

### What sounds good but does not apply here

- **Video rendering pipeline:** The simulator does not need to produce downloadable video. Users interact with it in the browser.
- **Frame-by-frame determinism:** Interactive UI animations do not need to be frame-perfect. Users are clicking buttons and watching divs resize -- Motion's declarative approach is more appropriate than managing frame counts.
- **Composition/sequence model:** The simulator is a single reactive component that responds to user input (add message, adjust sliders). It is not a multi-scene timeline with fixed duration.

---

## 2. What Remotion Costs

### Bundle size impact

| Package | Role | Estimated size (min+gzip) |
|---|---|---|
| `remotion` | Core library (hooks, interpolation, types) | ~30-50 KB |
| `@remotion/player` | Embeddable player component | ~15-25 KB |
| `@remotion/cli` | CLI tooling (dev only, not bundled) | 0 KB client |
| `@remotion/zod-types` | Schema types | ~2-5 KB |
| `zod` | Required peer dependency | ~14 KB |
| **Total additional client bundle** | | **~60-95 KB** |

For comparison, the current stack adds:
- `motion`: ~18 KB (tree-shaken)
- Custom div/SVG: 0 KB

**Remotion adds roughly 40-75 KB of net additional bundle weight** over the current recommendation, assuming Motion is still needed elsewhere in the app and cannot be dropped.

### Dependency complexity

- Remotion requires **exact version pinning** across all `@remotion/*` packages (no caret ranges). This adds maintenance overhead.
- Remotion requires `zod` as a peer dependency. The current stack does not use `zod`.
- Full Remotion projects also need `@remotion/cli` and potentially `@remotion/bundler` for the Studio/dev preview, which use a separate Webpack bundler. This conflicts with the Vite-based build pipeline, though the Player-only path avoids this.

### Paradigm mismatch: timeline-driven vs. event-driven

This is the critical architectural concern.

**Remotion's model:** Animations are functions of frame number. Time flows forward along a timeline. `useCurrentFrame()` returns a monotonically increasing integer. All visual state derives from `interpolate(frame, ...)`. User interaction is a secondary concern -- props can be changed, but the core loop is "what does frame N look like?"

**The simulator's model:** Visual state is a function of **user input**. The user clicks "Add message," adjusts a slider, or toggles a setting. The component re-renders with new proportions. Motion animates the transition between states. There is no timeline, no fixed duration, no frame count.

Using Remotion here means either:
1. **Fighting the paradigm:** Forcing an event-driven interaction model into a timeline container. The Player's `inputProps` mechanism supports this, but it means wrapping a fundamentally simple React component in an unnecessary abstraction layer.
2. **Over-engineering:** Using the Player as a glorified `motion.div` -- paying the bundle and complexity cost for capabilities that are never exercised.

### Learning curve for build agents

Remotion has a specific set of constraints that differ from standard React patterns:
- CSS transitions and animations are **forbidden** in Remotion compositions (they break during rendering).
- All animation must be driven by `useCurrentFrame()`, not React state transitions.
- Tailwind's `transition-*` and `animate-*` classes cannot be used.
- Build agents would need the Remotion skill file loaded, adding to context overhead.

The current approach (divs + Tailwind + Motion) is standard React that any build agent produces reliably without specialist knowledge.

---

## 3. Does the Simulator Actually Need Remotion's Capabilities?

### What the simulator needs to do (from context-window-mechanics.md)

1. **Proportional stacked bar** showing segments (system prompt, tools, CLAUDE.md, MCP, conversation, response buffer) as percentage widths.
2. **Interactive controls:** "Add message" button, sliders for MCP servers/CLAUDE.md size/skills/Tool Search toggle.
3. **Animated segment resizing** when controls change.
4. **Degradation gradient overlay** on the conversation segment that intensifies as context fills (U-shaped attention visualisation).
5. **Tooltips** showing token counts on hover/tap.

### How each need maps to the two approaches

| Need | Custom div + Tailwind + Motion | Remotion Player |
|---|---|---|
| Proportional bar | `<div style={{ width: pct% }}>` in a flex container | Same divs, but inside a `<Player>` composition |
| Interactive controls | Standard React state + event handlers | Props passed via `inputProps` to the Player |
| Animated resizing | `<motion.div layout>` with `animate` prop | `interpolate(frame, ...)` -- but what is "frame" when the user is clicking? |
| Degradation gradient | CSS gradient with opacity tied to fill percentage | Same, but opacity calculated from frame number |
| Tooltips | shadcn Tooltip component | Remotion cannot render shadcn Tooltip in a composition context without additional wiring |

**Verdict:** Every requirement is straightforwardly met by the current approach. Remotion adds an unnecessary abstraction layer between user input and visual output.

The animated resizing point is particularly telling. Motion's `layout` prop automatically animates between any two layout states with zero configuration. In Remotion, you would need to track the "old" segment widths, the "new" segment widths, calculate an interpolation between them over N frames, and manage a playback timeline -- all for a transition that Motion handles in one prop.

---

## 4. Could Remotion Be Useful for Other Parts of the App?

### Potential use cases in the playbook

| Component | Remotion benefit | Likelihood of being needed |
|---|---|---|
| **Animated walkthrough videos** (e.g., "How to set up CLAUDE.md") | Strong -- Remotion can render step-by-step demos as embeddable video | Low -- playbook is text + interactive, not video-based |
| **Social media / marketing clips** | Strong -- generate branded video clips programmatically | Out of scope for this deliverable |
| **Animated diagrams** (e.g., compaction flow, context allocation) | Moderate -- sequenced animation of multi-step processes | Low-moderate -- static diagrams + Motion transitions likely sufficient |
| **Pre-rendered loading/hero animations** | Moderate -- deterministic, polished entrance animations | Very low -- CSS/Motion can handle this |
| **Section transition animations** | Weak -- Remotion is overkill for page transitions | None needed |

### Assessment

There is no component in the current scope where Remotion provides a clear advantage over the existing stack. The playbook is an interactive reference app, not a video production tool.

If the project later expanded to include **embedded training videos** (e.g., screen-recording-style walkthroughs built entirely in React), Remotion would become a compelling addition. But that is not in the current brief.

---

## 5. Hybrid Approach: Custom div for Simulator, Remotion for Pre-Rendered Content

### How it would work

- Build the interactive simulator with custom div + Tailwind + Motion (as currently recommended).
- Add Remotion separately for any pre-rendered explainer content (animated diagrams, walkthrough videos).
- Use `@remotion/player` to embed Remotion compositions inline in the playbook where needed.
- Use `@remotion/renderer` or Lambda to pre-render MP4s for static placements.

### Is this worth it?

**Not for the current scope.** The hybrid approach is architecturally sound, but it introduces:
- Two animation paradigms in one codebase (Motion for interactive, Remotion for pre-rendered).
- Additional dependencies (~60-95 KB client bundle for the Player path).
- Build complexity (Remotion compositions may need their own bundler configuration).
- Cognitive overhead for build agents switching between two animation models.

**When it would be worth it:** If the client requests embedded training videos or auto-generated demo content as part of the playbook, the hybrid approach becomes the right call. At that point, Remotion earns its bundle weight.

---

## 6. When Remotion Tips from "Nice to Have" to "Clearly Better"

Remotion becomes the right choice when **any** of these conditions are true:

| Condition | Why Remotion wins | Current status |
|---|---|---|
| The simulator needs to **export video** (MP4/WebM download, share-to-Slack, embed in docs) | Core Remotion capability; impossible with div+Motion alone | Not in scope |
| The playbook includes **embedded training videos** built from React components | Remotion's composition + rendering pipeline is purpose-built for this | Not in scope |
| Animations require **frame-perfect synchronisation** across multiple elements (e.g., narration synced to visual steps) | `<Sequence>` and `<Series>` provide deterministic timing | Not needed -- all animations are user-triggered |
| The project needs to **generate personalised video** per client (e.g., branded onboarding videos with company name/logo injected) | Remotion's parameterised rendering + Lambda pipeline handles this at scale | Not in scope |
| Multiple **complex animation sequences** need to play out in a fixed order (like a presentation/slideshow within the app) | Remotion's timeline model is natural for sequential, non-interactive animation | Not needed -- content is navigated, not played |

**None of these conditions are currently met.** If any one of them enters the brief, Remotion should be re-evaluated.

---

## 7. Summary: Pros and Cons

### Remotion -- Pros

- Frame-accurate, deterministic animation rendering
- Video export capability (MP4/WebM) if ever needed
- Powerful composition and sequencing model for complex multi-step animations
- Timeline-based control enables sophisticated choreography
- Tailwind-compatible within compositions
- Active development, strong documentation, available skill file in this project

### Remotion -- Cons

- **Paradigm mismatch:** Timeline-driven model is wrong for event-driven interactive UI
- **Bundle overhead:** ~60-95 KB additional client weight vs. ~0 KB for custom divs
- **Dependency complexity:** Exact version pinning, `zod` peer dependency, potential bundler conflicts
- **CSS restrictions:** Forbids CSS transitions/animations and Tailwind animate classes in compositions
- **Over-engineering:** Adds an abstraction layer between user input and visual output with no corresponding benefit
- **Build agent overhead:** Requires specialist Remotion knowledge; standard React patterns are more reliable for AI-generated code
- **No current use case** in the playbook scope that justifies the trade-offs

### Custom div + Tailwind + Motion -- Pros

- Zero additional dependencies (Motion is already in the stack for other animations)
- Standard React patterns -- maximally reliable for AI build agents
- Direct state-to-UI mapping without abstraction layers
- Tailwind utilities work normally (transitions, responsive, dark mode)
- shadcn Tooltip integration for interactive elements is trivial
- Motion's `layout` prop handles animated resizing with one attribute

### Custom div + Tailwind + Motion -- Cons

- No video export capability
- No frame-level animation control (rarely needed for interactive UI)
- Complex multi-step animation sequences require more manual orchestration

---

## Final Recommendation

**Do not add Remotion to the project at this time.**

The context window simulator is an interactive, user-driven layout component. It needs proportional divs, smooth transitions, and tooltips. Custom div + Tailwind + Motion handles all of this with zero additional dependencies, simpler code, and better alignment with the event-driven interaction model.

**Re-evaluate if:** The client requests video export, embedded training videos, or any feature that requires rendering React components to video. At that point, bring in Remotion via the hybrid approach (custom divs for interactive components, Remotion for pre-rendered/exportable content).

---

## References

- [Remotion documentation](https://www.remotion.dev/docs/)
- [Remotion Player](https://www.remotion.dev/docs/player/)
- [Remotion brownfield installation](https://www.remotion.dev/docs/brownfield)
- [Remotion Player best practices](https://www.remotion.dev/docs/player/best-practices)
- [Motion (formerly Framer Motion)](https://motion.dev/docs/react)
- [Comparing React animation libraries (LogRocket, 2026)](https://blog.logrocket.com/best-react-animation-libraries/)
- [npm-compare: framer-motion vs remotion](https://npm-compare.com/framer-motion,react-spring,react-three-fiber,remotion)
- [Remotion vs Motion Canvas comparison](https://www.remotion.dev/docs/compare/motion-canvas)
- Remotion skill file: `.claude/skills/remotion-best-practices/SKILL.md`
- App tech stack research: `.planning/research/app-tech-stack.md`
- Context window mechanics research: `.planning/research/context-window-mechanics.md`
