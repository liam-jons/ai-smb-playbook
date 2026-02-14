# Context Window Mechanics Research

> Phase 0.5 research for the interactive context simulator.
> Compiled: 2026-02-14
> Sources: Anthropic official documentation, community research, published ML papers.
> Caveat: Exact token numbers vary by model version, configuration, and content. All figures are ballpark estimates based on the best available data.

---

## 1. The 200K Context Window: What It Actually Is

Claude's standard context window is **200,000 tokens** (~150,000 words). This is "working memory" -- the total text the model can reference when generating a response, including the response itself. It is NOT long-term memory; it exists only for the current session.

**Extended context (beta):** Claude Opus 4.6, Sonnet 4.5, and Sonnet 4 support a **1 million token** context window (requires usage tier 4, beta header `context-1m-2025-08-07`). Requests exceeding 200K tokens are charged at premium rates (2x input, 1.5x output).

**For Claude Code specifically**, the standard operating context is 200K tokens. The 1M window is available for pay-as-you-go API usage but the default Claude Code experience targets the 200K window.

### How tokens accumulate

- **Progressive accumulation:** Each user message and assistant response adds to the window. Previous turns are preserved completely.
- **Linear growth:** Context usage grows linearly with each turn.
- **Input-output flow:** Each turn = all previous history + current user message (input) then generated response (output). The response becomes part of the next turn's input.

### Extended thinking nuance

When extended thinking is enabled, thinking tokens count toward the context window during that turn but are **automatically stripped** from subsequent turns. They are NOT carried forward as input, so they don't permanently consume context. This is significant -- a model can "think" extensively without permanently eating context.

---

## 2. Context Allocation Breakdown: What Loads at Session Start

### Fixed overhead (loaded every request)

These components are present in EVERY API call Claude Code makes. They consume tokens before any conversation happens.

| Component | Approximate Tokens | Notes |
|---|---|---|
| **System prompt** (base instructions) | ~3,000--8,500 | Claude Code's core personality, behaviour rules, safety instructions. Varies by version. |
| **Built-in tool definitions** | ~12,000--20,000 | JSON schemas for Read, Write, Edit, Bash, Glob, Grep, WebFetch, NotebookEdit, etc. (~15--18 tools). Each tool definition ~500--1,200 tokens. |
| **CLAUDE.md files** | ~1,000--10,000 | Depends entirely on content. Recommendation: keep under ~500 lines. Multiple files (user, project, managed) are additive. |
| **Skill descriptions** | ~500--2,000 | Short descriptions for model-invocable skills. Zero cost if `disable-model-invocation: true`. |
| **MCP tool definitions** | Highly variable: 0--60,000+ | Each MCP server adds all its tool schemas. Single server can cost 4,000--17,000 tokens. Five servers with 58 tools can consume ~55,000 tokens. |
| **Git status / environment** | ~500--1,000 | Repository state, working directory info. |

### What this means in practice

**Minimal setup** (no MCP, small CLAUDE.md):
- Fixed overhead: ~18,000--30,000 tokens
- Response buffer reserve: ~33,000--45,000 tokens
- **Available for conversation: ~125,000--149,000 tokens**

**Moderate setup** (2--3 MCP servers, normal CLAUDE.md):
- Fixed overhead: ~35,000--55,000 tokens
- Response buffer reserve: ~33,000--45,000 tokens
- **Available for conversation: ~100,000--132,000 tokens**

**Heavy setup** (5+ MCP servers, large CLAUDE.md):
- Fixed overhead: ~65,000--100,000+ tokens
- Response buffer reserve: ~33,000--45,000 tokens
- **Available for conversation: ~55,000--102,000 tokens**

### MCP Tool Search optimization

With Tool Search enabled (default since v2.1.7+), MCP tools are loaded up to **10% of context** and the rest are deferred until needed. Instead of loading all 50+ MCP tool schemas (~20K+ tokens), only the Tool Search tool itself (~500 tokens) loads, plus 3--5 relevant tools on demand (~600 tokens each). This can reduce MCP overhead by ~85%.

### What loads on-demand (not at start)

| Component | When it loads | Context impact |
|---|---|---|
| **Full skill content** | When invoked via `/<name>` or auto-selected by Claude | Adds to conversation context at point of use |
| **Subagent results** | When subagent completes | Only the summary returns to main context |
| **Hook output** | On trigger event | Zero unless hook returns output |
| **MCP tool results** | When tool is called | Tool results add to conversation history |
| **File contents** (Read tool) | When Claude reads a file | Full file content enters the context |

---

## 3. The Response Buffer: The Hidden Reserve

Claude Code reserves a buffer at the end of the context window for generating responses. This is NOT available for conversation history.

| Buffer estimate | Source |
|---|---|
| ~33,000 tokens (16.5%) | Recent Claude Code versions (reduced from higher) |
| ~40,000--45,000 tokens | Earlier versions / some configurations |

**Key insight:** The "context remaining" percentage shown in Claude Code's status includes this buffer. So when it shows 20% remaining, you may only have ~3.5% of true free space before compaction triggers.

---

## 4. Context Degradation: How Quality Erodes

Context degradation is NOT about tokens being literally deleted. It is about the model's attention becoming less effective as the context grows. This is a fundamental property of transformer architecture, not a bug.

### The "Lost in the Middle" phenomenon

Published research (Liu et al., 2023, "Lost in the Middle: How Language Models Use Long Contexts") established that:

- LLMs exhibit a **U-shaped attention curve**: performance is highest when relevant information is at the very **beginning** (primacy bias) or very **end** (recency bias) of the context.
- Information in the **middle** of the context receives significantly less attention.
- Performance can **degrade by more than 30%** when relevant information shifts from start/end positions to the middle.
- The root cause lies in **attention mechanisms and positional encodings** (specifically Rotary Position Embedding / RoPE), which introduce a long-term decay effect.

### How degradation manifests in Claude Code

Degradation is a spectrum, not a cliff. Here is how it typically progresses:

**Stage 1: Healthy (0--50% context used)**
- Full recall of all conversation context
- Consistent adherence to CLAUDE.md rules
- Accurate file recall and code understanding
- Middle-context information may already receive slightly less attention, but impact is minimal

**Stage 2: Early degradation (50--70% context used)**
- Instructions from early in the conversation start getting less weight
- Subtle: Claude may need reminders about established conventions
- CLAUDE.md and system prompt (at the very start) remain relatively strong due to primacy bias
- Recent exchanges remain strong due to recency bias
- Middle of conversation history starts "fading"

**Stage 3: Noticeable degradation (70--85% context used)**
- Claude re-reads files it already examined
- Asks about things previously discussed
- May contradict earlier decisions
- Responses get slower (more tokens to process)
- Random solutions instead of systematic reasoning
- Tool results from middle of session become less influential

**Stage 4: Critical (85--95% context used)**
- Compaction triggers (auto-compact)
- Quality has significantly degraded
- Earlier context is largely ineffective
- Only recent exchanges and system prompt/CLAUDE.md are reliably attended to

### Practical signs to watch for

1. Claude asks about something you already told it
2. Claude re-reads files it recently read
3. Claude ignores conventions established earlier in the session
4. Responses become slower
5. Claude tries random approaches instead of reasoning through the problem
6. The "compacting conversation" message appears
7. `/cost` shows high context usage percentage

### When these signs appear, the recommended action is not to push forward but to:
- Commit what works
- Start a fresh session
- Use one context window per task

---

## 5. Compaction Mechanics: What Happens When the Window is Full

### How compaction works (step by step)

1. **Trigger detection:** Input tokens exceed the configured threshold (default: ~150,000 tokens for API; Claude Code auto-triggers at approximately 80--95% usage).
2. **Summary generation:** Claude generates a summary of the entire conversation history. This is an additional sampling step (costs extra tokens and counts toward rate limits).
3. **Compaction block created:** A `compaction` block containing the summary replaces all previous conversation history.
4. **Conversation continues:** The model continues with only the compaction summary + system prompt + tool definitions as its "memory."

### The default summarisation prompt

When compacting, Claude is instructed:

> "You have written a partial transcript for the initial task above. Please write a summary of the transcript. The purpose of this summary is to provide continuity so you can continue to make progress towards solving the task in a future context, where the raw history above may not be accessible and will be replaced with this summary. Write down anything that would be helpful, including the state, next steps, learnings etc."

### What gets preserved during compaction

- **Always preserved** (reloaded fresh, not summarised):
  - System prompt
  - Tool definitions (built-in + MCP)
  - CLAUDE.md content
  - Git status / environment context
- **Summarised** (kept in compressed form):
  - Key decisions and their rationale
  - Current task state and progress
  - Important code snippets and patterns
  - Next steps identified
  - Core findings and learnings
- **Lost** (dropped from context):
  - Verbose file contents from multiple reads
  - Error traces from resolved issues
  - Trial-and-error iteration history
  - Long command outputs no longer relevant
  - Nuanced instructions given early in conversation
  - Specific phrasing and tone of earlier exchanges
  - Detailed tool results from earlier operations

### What compaction frees

Compaction typically frees approximately **50% of consumed context tokens**, giving the session room to continue.

### Multiple compactions

A long session may compact multiple times. Each compaction summarises everything before it. Information loss is **cumulative** -- details that survived the first compaction may be lost in the second. The last compaction block reflects the final state of all prior context.

### Manual compaction (/compact)

Users can run `/compact` at any time with optional focus instructions:
- `/compact` -- general summarisation
- `/compact only keep the API patterns we established` -- focused preservation
- `/compact preserve the coding patterns and file structure` -- targeted retention

You can also add a "Compact Instructions" section to CLAUDE.md to control what is always preserved during compaction.

---

## 6. Data for the Proportional Visualisation

This section provides the segment breakdown for the interactive context simulator.

### Segments to display (200K window, moderate setup)

```
Total: 200,000 tokens
===============================================================================

[  System Prompt  ] ~5,000 tokens    (2.5%)    -- Always present, every request
[  Tool Schemas   ] ~15,000 tokens   (7.5%)    -- Built-in tool definitions
[  CLAUDE.md      ] ~4,000 tokens    (2.0%)    -- Project conventions
[  MCP Tools      ] ~12,000 tokens   (6.0%)    -- External tool definitions
[  Skill Descs    ] ~1,000 tokens    (0.5%)    -- Brief skill descriptions
[  Environment    ] ~1,000 tokens    (0.5%)    -- Git status, cwd, etc.
                   ---------------
     Fixed overhead: ~38,000 tokens  (19.0%)

[  Conversation   ] ~122,000 tokens  (61.0%)   -- Your actual work
[  Response Buffer] ~40,000 tokens   (20.0%)   -- Reserved for generation

===============================================================================
```

### Slider-adjustable parameters for the simulator

| Parameter | Default | Range | Effect |
|---|---|---|---|
| MCP servers | 2 | 0--10 | Each adds ~4,000--8,000 tokens to fixed overhead |
| CLAUDE.md size | 200 lines | 0--1000 lines | ~20 tokens/line = 0--20,000 tokens |
| Number of skills | 3 | 0--20 | ~300--500 tokens per skill description |
| Tool Search enabled | Yes | Yes/No | If No, MCP overhead can be 3--5x higher |
| Extended thinking | Off | Off/On | Thinking tokens consumed during turn but stripped after |

### Degradation overlay for the visualisation

Show a gradient overlay on the conversation segment:

```
Conversation segment (when 70%+ full):

[Strong attention]  <-- Most recent messages (recency bias)
[     ...         ]
[Weak attention   ]  <-- Middle of conversation (lost in the middle)
[     ...         ]
[Moderate attention] <-- Early conversation (some primacy, but fading)
[Strong attention]  <-- System prompt + CLAUDE.md (primacy bias, always at start)
```

The attention gradient should intensify as context fills:
- At 30% full: nearly uniform attention
- At 50% full: slight U-shape
- At 70%+ full: pronounced U-shape, middle messages receiving significantly less attention
- At 85%+ full: critical degradation, only start/end reliably attended

---

## 7. Key Takeaways for Users

### When to start a fresh session

- **Proactive:** Start fresh when context reaches ~60--70%. Don't wait for degradation.
- **Reactive:** Start fresh when you notice signs of degradation (repeating questions, re-reading files, ignoring established patterns).
- **Rule of thumb:** One context window per task. If the task is done, start fresh for the next one.
- **After compaction:** If Claude has compacted and you notice quality issues, starting fresh may be better than pushing through a second compaction.

### How to minimise overhead

1. **Keep CLAUDE.md under ~500 lines.** Move reference material to skills.
2. **Disconnect unused MCP servers.** Run `/mcp` to see token costs per server.
3. **Use Tool Search** (enabled by default) to defer MCP tool loading.
4. **Set `disable-model-invocation: true`** on skills you only trigger manually.
5. **Use subagents** for tasks that read many files -- their context is isolated from yours.
6. **Run `/compact` proactively** at ~60--70% rather than waiting for auto-compact.
7. **Provide focus instructions** when compacting to preserve what matters.

### How to get the most from your context

1. **Put critical instructions at the start** (system prompt / CLAUDE.md) -- primacy bias helps.
2. **Repeat important context in your most recent message** -- recency bias helps.
3. **Don't rely on middle-of-conversation instructions** -- they fade fastest.
4. **Use CLAUDE.md for "always do X" rules** rather than stating them once mid-conversation.
5. **Use `/cost` to monitor** your context usage throughout a session.

---

## 8. Source Documentation and References

### Official Anthropic documentation
- [Context Windows - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/context-windows) -- authoritative reference for context window mechanics, sizes, and extended thinking behaviour.
- [Compaction - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/compaction) -- official compaction feature documentation with API parameters, trigger thresholds, and usage patterns.
- [Extend Claude Code](https://code.claude.com/docs/en/extend-claude-code) -- official context cost by feature table and loading behaviour documentation.
- [Manage Costs Effectively - Claude Code Docs](https://code.claude.com/docs/en/costs) -- cost management and token usage guidance.
- [How Claude Code Works](https://code.claude.com/docs/en/how-claude-code-works) -- core agentic loop and tool architecture.
- [Pricing - Claude API Docs](https://platform.claude.com/docs/en/about-claude/pricing) -- token pricing and long-context premium rates.

### Community research and analysis
- [Claude Code Token Limits - Faros AI](https://www.faros.ai/blog/claude-code-token-limits) -- engineering-focused breakdown of token costs and limits.
- [Understanding Claude Code's Context Window - Damian Galarza](https://www.damiangalarza.com/posts/2025-12-08-understanding-claude-code-context-window/) -- detailed context window breakdown with specific token estimates.
- [Claude Code Context Buffer: The 33K-45K Token Problem - ClaudeFast](https://claudefa.st/blog/guide/mechanics/context-buffer-management) -- analysis of the response buffer reserve.
- [A Practical Guide to Claude Code Context Window Size - Eesel.ai](https://www.eesel.ai/blog/claude-code-context-window-size) -- practical context allocation guide.
- [Context Window Depletion - ClaudeLog](https://claudelog.com/mechanics/context-window-depletion/) -- depletion mechanics and degradation stages.
- [The Hidden Cost of MCP Servers - Mario Giancini](https://mariogiancini.com/the-hidden-cost-of-mcp-servers-and-when-theyre-worth-it) -- MCP token overhead analysis.
- [Claude Code Just Cut MCP Context Bloat by 46.9%](https://medium.com/@joe.njenga/claude-code-just-cut-mcp-context-bloat-by-46-9-51k-tokens-down-to-8-5k-with-new-tool-search-ddf9e905f734) -- Tool Search optimisation impact.
- [How Claude Code Got Better by Protecting More Context](https://hyperdev.matsuoka.com/p/how-claude-code-got-better-by-protecting) -- context protection improvements.
- [Piebald-AI/claude-code-system-prompts (GitHub)](https://github.com/Piebald-AI/claude-code-system-prompts) -- extracted system prompt and tool definition analysis.

### Academic research
- [Lost in the Middle: How Language Models Use Long Contexts (Liu et al., 2023)](https://arxiv.org/abs/2307.03172) -- the foundational paper on U-shaped attention and middle-context degradation. Published in Transactions of the ACL.
- [Found in the Middle: How Language Models Use Long Contexts Better via Plug-and-Play Positional Encoding](https://arxiv.org/html/2403.04797v1) -- follow-up research on mitigating the lost-in-the-middle effect.
- [Context Rot: Why AI Gets Worse the Longer You Chat](https://www.producttalk.org/context-rot/) -- accessible explanation of context degradation syndrome.
- [Context Degradation Syndrome - James Howard](https://jameshoward.us/2024/11/26/context-degradation-syndrome-when-large-language-models-lose-the-plot) -- analysis of degradation patterns in long-context use.

---

## 9. Confidence Notes

| Claim | Confidence | Basis |
|---|---|---|
| 200K standard context window | High | Official Anthropic documentation |
| 1M extended context (beta) | High | Official Anthropic documentation |
| System prompt ~3K--8.5K tokens | Medium | Multiple community analyses; exact number varies by CC version |
| Built-in tool definitions ~12K--20K tokens | Medium | Community analyses and extracted prompts; varies by version |
| CLAUDE.md ~20 tokens/line | Low-Medium | Rough estimate; depends heavily on content |
| MCP tool cost ~500--1,200 tokens per tool | Medium | Multiple sources; varies by schema complexity |
| Response buffer ~33K--45K tokens | Medium | Community analysis; Anthropic has adjusted this over time |
| U-shaped attention / "lost in the middle" | High | Peer-reviewed research (Liu et al., TACL) |
| Compaction frees ~50% of tokens | Medium | Community reports; depends on conversation content |
| Auto-compact trigger at ~80--95% usage | Medium | Multiple sources report different thresholds; has changed between versions |
| Default API compaction trigger at 150K tokens | High | Official Anthropic API documentation |
