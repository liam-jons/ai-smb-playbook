# Snippet from Reddit post on fully agentic-run repository

We made repository knowledge the system of record
Context management is one of the biggest challenges in making agents effective at large and complex tasks. One of the earliest lessons we learned was simple: give Codex a map, not a 1,000-page instruction manual.

We tried the “one big AGENTS.md⁠(opens in a new window)” approach. It failed in predictable ways:

Context is a scarce resource. A giant instruction file crowds out the task, the code, and the relevant docs—so the agent either misses key constraints or starts optimizing for the wrong ones.

Too much guidance becomes non-guidance**.** When everything is “important,” nothing is. Agents end up pattern-matching locally instead of navigating intentionally.

It rots instantly. A monolithic manual turns into a graveyard of stale rules. Agents can’t tell what’s still true, humans stop maintaining it, and the file quietly becomes an attractive nuisance.

It’s hard to verify. A single blob doesn’t lend itself to mechanical checks (coverage, freshness, ownership, cross-links), so drift is inevitable.

So instead of treating AGENTS.md as the encyclopedia, we treat it as the table of contents.

The repository’s knowledge base lives in a structured docs/ directory treated as the system of record. A short AGENTS.md (roughly 100 lines) is injected into context and serves primarily as a map, with pointers to deeper sources of truth elsewhere.

Plain Text
1
AGENTS.md
2
ARCHITECTURE.md
3
docs/
4
├── design-docs/
5
│   ├── index.md
6
│   ├── core-beliefs.md
7
│   └── ...
8
├── exec-plans/
9
│   ├── active/
10
│   ├── completed/
11
│   └── tech-debt-tracker.md
12
├── generated/
13
│   └── db-schema.md
14
├── product-specs/
15
│   ├── index.md
16
│   ├── new-user-onboarding.md
17
│   └── ...
18
├── references/
19
│   ├── design-system-reference-llms.txt
20
│   ├── nixpacks-llms.txt
21
│   ├── uv-llms.txt
22
│   └── ...
23
├── DESIGN.md
24
├── FRONTEND.md
25
├── PLANS.md
26
├── PRODUCT_SENSE.md
27
├── QUALITY_SCORE.md
28
├── RELIABILITY.md
29
└── SECURITY.md
In-repository knowledge store layout.

Design documentation is catalogued and indexed, including verification status and a set of core beliefs that define agent-first operating principles. Architecture documentation⁠(opens in a new window) provides a top-level map of domains and package layering. A quality document grades each product domain and architectural layer, tracking gaps over time.

Plans are treated as first-class artifacts. Ephemeral lightweight plans are used for small changes, while complex work is captured in execution plans⁠(opens in a new window)with progress and decision logs that are checked into the repository. Active plans, completed plans, and known technical debt are all versioned and co-located, allowing agents to operate without relying on external context.

This enables progressive disclosure: agents start with a small, stable entry point and are taught where to look next, rather than being overwhelmed up front.

We enforce this mechanically. Dedicated linters and CI jobs validate that the knowledge base is up to date, cross-linked, and structured correctly. A recurring “doc-gardening” agent scans for stale or obsolete documentation that does not reflect the real code behavior and opens fix-up pull requests.

Agent legibility is the goal
As the codebase evolved, Codex’s framework for design decisions needed to evolve, too.

Because the repository is entirely agent-generated, it’s optimized first for Codex’s legibility. In the same way teams aim to improve navigability of their code for new engineering hires, our human engineers’ goal was making it possible for an agent to reason about the full business domain directly from the repository itself.

From the agent’s point of view, anything it can’t access in-context while running effectively doesn’t exist. Knowledge that lives in Google Docs, chat threads, or people’s heads are not accessible to the system. Repository-local, versioned artifacts (e.g., code, markdown, schemas, executable plans) are all it can see.

We learned that we needed to push more and more context into the repo over time. That Slack discussion that aligned the team on an architectural pattern? If it isn’t discoverable to the agent, it’s illegible in the same way it would be unknown to a new hire joining three months later.

Giving Codex more context means organizing and exposing the right information so the agent can reason over it, rather than overwhelming it with ad-hoc instructions. In the same way you would onboard a new teammate on product principles, engineering norms, and team culture (emoji preferences included), giving the agent this information leads to better-aligned output.

This framing clarified many tradeoffs. We favored dependencies and abstractions that could be fully internalized and reasoned about in-repo. Technologies often described as “boring” tend to be easier for agents to model due to composability, api stability, and representation in the training set. In some cases, it was cheaper to have the agent reimplement subsets of functionality than to work around opaque upstream behavior from public libraries. For example, rather than pulling in a generic p-limit-style package, we implemented our own map-with-concurrency helper: it’s tightly integrated with our OpenTelemetry instrumentation, has 100% test coverage, and behaves exactly the way our runtime expects.

Pulling more of the system into a form the agent can inspect, validate, and modify directly increases leverage—not just for Codex, but for other agents (e.g. Aardvark) that are working on the codebase as well.

Enforcing architecture and taste
Documentation alone doesn’t keep a fully agent-generated codebase coherent. By enforcing invariants, not micromanaging implementations, we let agents ship fast without undermining the foundation. For example, we require Codex to parse data shapes at the boundary⁠(opens in a new window), but are not prescriptive on how that happens (the model seems to like Zod, but we didn’t specify that specific library).

Agents are most effective in environments with strict boundaries and predictable structure⁠(opens in a new window), so we built the application around a rigid architectural model. Each business domain is divided into a fixed set of layers, with strictly validated dependency directions and a limited set of permissible edges. These constraints are enforced mechanically via custom linters (Codex-generated, of course!) and structural tests.

The diagram below shows the rule: within each business domain (e.g. App Settings), code can only depend “forward” through a fixed set of layers (Types → Config → Repo → Service → Runtime → UI). Cross-cutting concerns (auth, connectors, telemetry, feature flags) enter through a single explicit interface: Providers. Anything else is disallowed and enforced mechanically.

This is the kind of architecture you usually postpone until you have hundreds of engineers. With coding agents, it’s an early prerequisite: the constraints are what allows speed without decay or architectural drift.

In practice, we enforce these rules with custom linters and structural tests, plus a small set of “taste invariants.” For example, we statically enforce structured logging, naming conventions for schemas and types, file size limits, and platform-specific reliability requirements with custom lints. Because the lints are custom, we write the error messages to inject remediation instructions into agent context.

In a human-first workflow, these rules might feel pedantic or constraining. With agents, they become multipliers: once encoded, they apply everywhere at once.

At the same time, we’re explicit about where constraints matter and where they do not. This resembles leading a large engineering platform organization: enforce boundaries centrally, allow autonomy locally. You care deeply about boundaries, correctness, and reproducibility. Within those boundaries, you allow teams—or agents—significant freedom in how solutions are expressed.

The resulting code does not always match human stylistic preferences, and that’s okay. As long as the output is correct, maintainable, and legible to future agent runs, it meets the bar.

Human taste is fed back into the system continuously. Review comments, refactoring pull requests, and user-facing bugs are captured as documentation updates or encoded directly into tooling. When documentation falls short, we promote the rule into code

