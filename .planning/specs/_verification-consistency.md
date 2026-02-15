# Phase 1 Consistency Verification

**Date:** 2026-02-15
**Scope:** All 17 spec files (1.1 through 1.17)
**Auditor:** Automated verification agent

---

## Summary

| Metric | Count |
|--------|-------|
| Total copyable content items across all specs | ~96 |
| Content overlap areas (same or near-identical text in 2+ specs) | 7 |
| Overlaps requiring action (risk of build-time divergence) | 3 |
| Overlaps that are intentional/acceptable | 4 |
| Terminology inconsistencies found | 3 |
| Two-track filtering approach variations | 2 (compatible) |
| Agent 4 coherence issues | 0 |

---

## Copyable Content Overlap

### Overlap 1: Session Handoff Prompts (1.2 vs 1.3)

| Aspect | Spec 1.2 | Spec 1.3 |
|--------|----------|----------|
| **Location** | Copyable Content > Session Handoff Prompt | Copyable Content > Prompt 1: General Handoff Prompt |
| **Track** | Both | General (also shown on Developer) |
| **Format** | 6-point numbered list | 5-point numbered list |
| **Output instruction** | "Format this as a single message I can paste at the start of a new session. Write it as instructions to your future self" | "Format this as a single block of text I can paste into a new conversation. Start the output with the instruction: 'This is a continuation from a previous conversation...'" |

**1.2 prompt text:**
```
I need to wrap up this session and continue in a fresh one. Before we stop, please write a comprehensive handoff summary that I can paste into a new session. Include:

1. What we were working on
2. What we accomplished
3. Current state
4. Important context
5. Next steps
6. Open questions
```

**1.3 Prompt 1 text:**
```
Before we finish, I need you to create a handoff summary so I can continue this work in a new conversation.

Please write a continuation prompt that includes:

1. What we were working on
2. What we accomplished
3. What needs to happen next
4. Important things to remember
5. Any open questions
```

**Assessment:** These are **intentionally different** prompts serving different purposes. The 1.2 prompt is positioned as a quick-start tool immediately after the context simulator (teaching moment). The 1.3 prompts are a comprehensive library of scenario-specific templates. The 1.2 prompt is slightly more detailed (6 points vs 5, includes "current state" as a separate point). The 1.3 prompt adds a formatted output instruction at the end.

**Risk:** LOW. Different sections, different agents (both Agent 2), same author context. The user will encounter 1.2 first (context simulator) and then 1.3 (session management). Seeing two similar but not identical prompts could cause minor confusion.

**Recommendation:** Add a cross-reference note in 1.2's handoff prompt section: "For a full library of handoff prompts covering different scenarios (emergency saves, delegation, task decomposition), see Section 1.3." This makes the relationship explicit and avoids the user wondering which version to use.

---

### Overlap 2: UK English Profile Preferences Text (1.6 vs 1.16)

| Aspect | Spec 1.6 | Spec 1.16 |
|--------|----------|-----------|
| **Location** | Copyable Content > #1 Profile Preferences Text | Copyable Content > Install Commands by Platform |
| **Track** | General | Both |

**Identical text in both specs:**
```
Always use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (£) for currency.
```

**Assessment:** **Intentional duplication.** Spec 1.6 (Brand Voice & UK English) is the teaching section that walks users through setting this up. Spec 1.16 (Starter Kit Contents) reproduces it as a quick-reference install command. The user would encounter this text in the context of "learn how to set it up" (1.6) and "here is the text to copy" (1.16). Both are built by different agents (Agent 3 vs Agent 5), so both need the canonical text.

**Risk:** LOW. The text is word-for-word identical. No divergence risk.

**Recommendation:** No change needed. The duplication is by design -- the starter kit is meant to be a self-contained reference that reproduces key content from the teaching sections.

---

### Overlap 3: CLAUDE.md UK English Rule (1.6 vs 1.16)

| Aspect | Spec 1.6 | Spec 1.16 |
|--------|----------|-----------|
| **Location** | Copyable Content > #3 CLAUDE.md Snippet | Copyable Content > Install Commands by Platform |
| **Track** | Developer | Both |

**1.6 text:**
```markdown
## Style

- **UK English throughout.** All output must use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (£) for currency.
```

**1.16 text:**
```markdown
- **UK English throughout.** All output must use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (£) for currency.
```

**Assessment:** Nearly identical. The 1.6 version includes the `## Style` heading; the 1.16 version is just the bullet point. This is a **minor formatting difference** -- 1.6 shows it in the context of a CLAUDE.md file section, 1.16 provides the line to add to an existing CLAUDE.md.

**Risk:** LOW. Functionally identical.

**Recommendation:** No change needed. The difference in context (with/without heading) is appropriate to each spec's purpose.

---

### Overlap 4: Brand Voice Setup Prompt (1.6 vs 1.16)

| Aspect | Spec 1.6 | Spec 1.16 |
|--------|----------|-----------|
| **Location** | Copyable Content > #5 Brand Voice Setup Prompt | Copyable Content > Brand voice setup prompt |
| **Track** | Both | Both |
| **Built by** | Agent 3 | Agent 5 |

**Assessment:** **Word-for-word identical** -- the same ~20-line prompt appears in both specs. The 1.6 version is in the teaching section (Brand Voice & UK English). The 1.16 version is in the Starter Kit section and also references a standalone file at `starter-kit/prompts/brand-voice-setup-prompt.md`.

**Risk:** MEDIUM. Two different agents (Agent 3 and Agent 5) will each implement this prompt. If either agent makes a minor edit (e.g., fixing a typo, rewording for clarity), the versions could diverge. The starter kit file (`brand-voice-setup-prompt.md`) introduces a third location for the same text.

**Recommendation:** The spec 1.16 implementation should source the prompt text from the same data file used by spec 1.6, or both should reference a shared content constant. At integration time (Phase 3), verify all three locations (1.6 component, 1.16 component, starter-kit file) render identical text. Add a note to both specs: "The brand voice setup prompt must be identical across 1.6, 1.16, and `starter-kit/prompts/brand-voice-setup-prompt.md`. Source from a single data definition."

---

### Overlap 5: CLAUDE.md Templates (1.4 vs 1.8)

| Aspect | Spec 1.4 | Spec 1.8 |
|--------|----------|----------|
| **Location** | Copyable Content > Example 1: CLAUDE.md Template | Copyable Content > #1 Complete CLAUDE.md Template |
| **Track** | Developer | Developer |
| **Built by** | Agent 3 | Agent 4 |
| **Length** | ~20 lines | ~70 lines |

**1.4 template sections:** Build Commands, Conventions, Architecture, Key Rules (compact, 4 sections)

**1.8 template sections:** Project description, Commands, Architecture, Key Files, Code Style, Environment, Testing, Gotchas, Documentation Pointers (comprehensive, 10 sections)

**Assessment:** These are **intentionally different** templates serving different purposes. The 1.4 template is a quick example within the decision tree ("here is what a CLAUDE.md looks like"). The 1.8 template is the comprehensive, production-ready template that is the section's primary deliverable. Spec 1.8 also includes a minimal template as a quick-start alternative.

**Risk:** LOW. The templates are clearly different in scope and context. Users will understand that 1.4 shows a brief example and 1.8 provides the real template.

**Recommendation:** Spec 1.4 should include a cross-reference note: "For a complete, production-ready CLAUDE.md template, see Section 1.8." This is already implied by 1.4's structure (it links to reference cards) but should be explicit on the copyable example.

---

### Overlap 6: deepwiki MCP Configuration (1.4 vs 1.13)

| Aspect | Spec 1.4 | Spec 1.13 |
|--------|----------|-----------|
| **Location** | Copyable Content > Example 4: MCP Configuration Snippet | Copyable Content > MCP Configuration -- deepwiki |
| **Track** | Developer | Developer |
| **Built by** | Agent 3 | Agent 4 |

**1.4 text:**
```json
{
  "mcpServers": {
    "deepwiki": {
      "command": "npx",
      "args": ["-y", "@anthropic/deepwiki-mcp"]
    }
  }
}
```

**1.13 text:**
```json
{
  "mcpServers": {
    "deepwiki": {
      "command": "npx",
      "args": ["-y", "@anthropic/deepwiki-mcp"]
    }
  }
}
```

**Assessment:** **Identical configuration.** The 1.4 version is a brief example within the decision tree. The 1.13 version is part of the comprehensive MCP setup guide.

**Risk:** LOW. The JSON is identical and unlikely to diverge. Both agents are implementing from the same source reference.

**Recommendation:** No change needed. Consistent content across specs is desirable for copyable configuration snippets.

---

### Overlap 7: Hook Configuration Pattern (1.4 vs 1.6)

| Aspect | Spec 1.4 | Spec 1.6 |
|--------|----------|----------|
| **Location** | Copyable Content > Example 5: Hook Configuration Snippet | Copyable Content > #4 Britfix Hook Configuration |
| **Track** | Developer | Developer |
| **Built by** | Agent 3 | Agent 3 |

**1.4 text (generic linting hook):**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint -- --fix $TOOL_INPUT_PATH"
          }
        ]
      }
    ]
  }
}
```

**1.6 text (Britfix hook):**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "/absolute/path/to/britfix/run-hook.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

**Assessment:** These are **different hooks** using the same structural pattern (PostToolUse > matcher > command). The 1.4 version is a generic example; the 1.6 version is the specific Britfix hook. Both are built by the same agent (Agent 3), reducing divergence risk.

**Risk:** NONE. These are intentionally different examples demonstrating the same hook pattern with different commands.

**Recommendation:** No change needed.

---

### Overlap 8: Plugin Install Command for claude-md-management (1.8 vs 1.14)

| Aspect | Spec 1.8 | Spec 1.14 |
|--------|----------|-----------|
| **Location** | Copyable Content > #3 Plugin Install Command | Copyable Content > Plugin Install Commands (Individual) |
| **Track** | Developer | Developer |
| **Built by** | Agent 4 | Agent 4 |

**Both contain:**
```bash
claude plugin install claude-md-management
```

(Note: 1.14 uses `/plugin install` format while 1.8 uses `claude plugin install` format)

**Assessment:** Minor format inconsistency. Spec 1.8 uses the CLI format (`claude plugin install`), while spec 1.14 uses the in-session format (`/plugin install`). Both are valid -- the CLI format works from the terminal, the `/plugin install` format works within a Claude Code session.

**Risk:** LOW. Both formats work. However, consistency would help users.

**Recommendation:** Standardise on one format across both specs. Since 1.14 is the comprehensive plugin section, it should set the convention. The `/plugin install` format is more commonly used (it works inside an active Claude Code session, which is where most users will be). Spec 1.8 should use `/plugin install claude-md-management` instead of `claude plugin install claude-md-management`, or include both with a note explaining the difference.

---

## Terminology Audit

| Term Cluster | Specs Using Each Variant | Assessment |
|---|---|---|
| **"handoff prompt" / "continuation prompt" / "session summary"** | 1.2 uses "session handoff prompt"; 1.3 uses "continuation prompt" and "handoff summary" interchangeably; 1.16 uses "continuation prompt" in the skill definition and "handoff" in the file names (`example-handoff-general.md`) | Minor inconsistency. The terms "handoff prompt" and "continuation prompt" are used as near-synonyms across 1.2, 1.3, and 1.16. The session-handoff skill in 1.16 uses "continuation prompt" in its description but "session-handoff" as the skill name. **Recommendation:** Adopt "handoff prompt" as the primary term (it is more intuitive for non-technical users) and "continuation prompt" as the secondary/alias. Add a note in 1.3: "Also called a continuation prompt -- the terms are interchangeable." |
| **"skill" / "command" / "plugin"** | Consistently distinguished across all specs. 1.4 defines the taxonomy clearly. 1.14 explains plugins as bundles. 1.16 correctly separates skills (`.claude/skills/`) from commands (`.claude/commands/`). | No issues. The three terms are well-defined and consistently used. |
| **"extension" / "capability" / "feature"** | 1.4 uses "extension mechanism" throughout. 1.5 uses "AI extension" in the governance context. 1.2 uses "feature" for context window segments. | No issues. The terms are used in different contexts and do not conflict. "Extension" consistently refers to add-on capabilities (skills, plugins, MCP, hooks). |
| **Platform naming: "claude.ai" / "Claude Desktop" / "Claude Code" / "CoWork"** | Consistently named across all 17 specs. | No issues. Platform names are used consistently throughout. |
| **"context window" vs "conversation memory" / "working memory"** | General track specs (1.2, 1.3, 1.7) use plain language: "Claude's memory of this conversation", "conversation getting long". Developer track specs use "context window" freely. 1.2 explicitly instructs: "Use 'conversation' not 'context window' where possible" for the general track. | Well-handled. The two-track approach to terminology is consistent. |
| **"deepwiki" vs "Context7"** | 1.13 notes the overlap and advises choosing one. 1.14 repeats this guidance: "Similar functionality to the deepwiki MCP server (section 1.13). Choose one." | Consistent. Both specs flag the redundancy and provide the same guidance. |

---

## Two-Track Filtering Approaches

| Spec | Routing Pattern | Track Prop Pattern | Data Filtering Pattern | Compatible? |
|---|---|---|---|---|
| **1.1** | Routes to `/general` or `/developer` via track selector cards | N/A (landing page) | N/A | Yes -- establishes the base routes |
| **1.2** | `/:track/how-context-works` | `useParams` extracts `track`, passes `isDev` boolean to children | Conditional rendering: `{isDev && <DevOnlyContent />}` | Yes |
| **1.3** | `/general/session-management` and `/developer/session-management` | Not specified as prop; uses `tracks` property on content data | Content data objects have `tracks: ('general' \| 'developer')[]` property; component filters at render time | Yes |
| **1.4** | `/:track/skills-extensions` | Uses `tracks` property on decision tree entry points | Content data uses `tracks: ('general' \| 'developer')[]` for filtering | Yes |
| **1.5** | Not explicitly stated | General track hides/collapses technical sections | Accordion panels with track-conditional visibility | Yes |
| **1.6** | Not explicitly stated | Platform tabs (claude.ai / Desktop / Code) | Track-conditional tab visibility | Yes |
| **1.7** | General track only | N/A (single track) | N/A | Yes |
| **1.8--1.15** | Developer track only | N/A (single track) | N/A | Yes |
| **1.16** | `/general/starter-kit` and `/developer/starter-kit` | Track filter within the file browser component | `StarterKitFile.tracks` property for filtering | Yes |
| **1.17** | N/A (standalone markdown file) | N/A | N/A | Yes |

**Assessment:** Two compatible patterns are used:

1. **`isDev` prop pattern** (1.2): Extract `track` from URL params, compute `isDev = track === 'developer'`, pass as prop. Components use `{isDev && ...}` for conditional rendering.

2. **`tracks` content-as-data pattern** (1.3, 1.4, 1.16): Content objects include a `tracks: ('general' | 'developer')[]` property. Components filter content based on the current track.

These patterns are fully compatible. The `isDev` pattern is simpler (good for binary show/hide of UI blocks). The `tracks` pattern is more flexible (good for data arrays where each item may appear on different tracks). Both derive the track from the URL, so they share the same source of truth.

**Recommendation:** The App Shell (Agent 1) should provide a `useTrack()` hook that returns both the raw `track` value and a computed `isDev` boolean. This gives build agents a consistent API regardless of which pattern they prefer. Spec 1.2 already references this approach: "Use the `useTrack()` hook (or URL param)". Ensure Agent 1's spec (app shell) defines this hook.

---

## Agent 4 Coherence Check

Agent 4 builds all 8 developer track sections: 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15.

### Shared Conventions Across Agent 4 Specs

| Convention | Consistent? | Details |
|---|---|---|
| **shadcn/ui components** | Yes | All 8 specs use the same component set: Card, Accordion, Alert, Badge, Button, Collapsible, Tooltip, Separator |
| **Shiki syntax highlighting** | Yes | All specs reference `CodeBlock` component with react-shiki and `CopyButton` |
| **Build Agent Checklist** | Yes | All 8 specs include the identical full Frontend Quality Checklist |
| **Content-as-data pattern** | Yes | All specs specify TypeScript data objects for content, not hard-coded JSX |
| **Motion/animation approach** | Yes | All specs reference Motion (`motion/react`) for layout animations, Tailwind for simple transitions |
| **Accessibility requirements** | Yes | All specs include the same accessibility checklist items |
| **UK English requirement** | Yes | All specs explicitly require UK English throughout |
| **Responsive breakpoints** | Yes | All specs use the same breakpoints: < 640px (mobile), 640-1023px (tablet), 1024px+ (desktop) |
| **Max content width** | Yes | All specs specify 65ch for body text |

### Cross-Reference Integrity (Agent 4 Internal)

| From | To | Reference | Valid? |
|---|---|---|---|
| 1.8 | 1.9 | "For a complete guide to setting up the /docs structure, see Section 1.9" | Yes |
| 1.8 | 1.10 | "Section 1.10 (Codebase Mapping) provides a tool that can generate initial documentation" | Yes |
| 1.8 | 1.14 | "Section 1.14 (Plugin Recommendations) covers the claude-md-management plugin" | Yes |
| 1.9 | 1.8 | Builds on 1.8's "map not encyclopedia" principle | Yes |
| 1.9 | 1.10 | References gsd-codebase-mapper for generating initial docs | Yes |
| 1.10 | 1.9 | Output feeds into /docs structure from 1.9 | Yes |
| 1.11 | N/A | Self-contained; references training session | Yes |
| 1.12 | 1.13 | References Playwright MCP from 1.13 | Yes |
| 1.13 | 1.2 | Cross-references context window simulator | Yes |
| 1.13 | 1.5 | Cross-references governance policy | Yes |
| 1.13 | 1.14 | Notes Context7 vs deepwiki overlap; links to 1.14 | Yes |
| 1.14 | 1.2 | Cross-references context cost from 1.2 | Yes |
| 1.14 | 1.5 | Cross-references governance policy | Yes |
| 1.14 | 1.13 | Notes Context7 vs deepwiki overlap; links to 1.13 | Yes |
| 1.15 | 1.10 | Builds on mapper's CONCERNS.md output | Yes |

**Assessment:** All cross-references within Agent 4's scope are valid and bidirectional where appropriate. The narrative flow is logical: 1.8 (CLAUDE.md) -> 1.9 (docs structure) -> 1.10 (codebase mapping) forms a natural learning progression. 1.13 (MCP) and 1.14 (Plugins) correctly cross-reference each other on the Context7/deepwiki overlap.

### Agent 4 Content Flow

The 8 sections follow a coherent narrative arc:
1. **Foundation:** 1.8 (CLAUDE.md) and 1.9 (docs structure) establish the "map not encyclopedia" approach
2. **Tooling:** 1.10 (codebase mapping) provides the tool to populate the docs structure
3. **Quality:** 1.11 (avoiding hallucinations) covers prompting patterns for better output
4. **Testing:** 1.12 (regression testing) covers AI-driven testing approaches
5. **Infrastructure:** 1.13 (MCP) and 1.14 (plugins) cover extending Claude Code
6. **Maintenance:** 1.15 (auditing and tech debt) covers ongoing codebase health

**No coherence issues found.**

---

## Recommendations

Ordered by priority (highest first):

1. **Standardise the brand voice setup prompt source.** The identical prompt appears in specs 1.6, 1.16, and will exist as `starter-kit/prompts/brand-voice-setup-prompt.md`. Two different agents (Agent 3 and Agent 5) will implement this. Define the prompt text in a single shared content file (e.g., `src/content/shared/brand-voice-prompt.ts`) and import it in both sections. The starter kit file should be generated from or verified against this same source during the build. This prevents divergence across three locations.

2. **Add a cross-reference from 1.2 to 1.3 for the handoff prompt.** Spec 1.2's session handoff prompt is a simpler version of spec 1.3's general handoff prompt. Add a note below 1.2's prompt: "For a full library of handoff prompts covering different scenarios (emergency saves, delegation, task decomposition), see Section 1.3 -- Session Management." This guides users to the comprehensive set without them wondering whether the 1.2 version is incomplete.

3. **Standardise the plugin install command format.** Spec 1.8 uses `claude plugin install claude-md-management` (CLI format) while spec 1.14 uses `/plugin install <name>` (in-session format). Both work, but consistency helps users. Recommendation: use `/plugin install <name>` as the primary format across all specs (it is the more common usage context). Include a note in spec 1.14: "These commands work inside a Claude Code session. From the terminal without an active session, use `claude plugin install <name>` instead."

4. **Settle on "handoff prompt" as the primary term.** The terms "handoff prompt", "continuation prompt", and "handoff summary" are used interchangeably across specs 1.2, 1.3, and 1.16. Adopt "handoff prompt" as the primary user-facing term (more intuitive) and note "also called a continuation prompt" on first use in 1.3. The skill name `session-handoff` already aligns with this choice.

5. **Add a cross-reference from 1.4's CLAUDE.md example to 1.8.** Spec 1.4's Example 1 is a compact CLAUDE.md template. Spec 1.8 provides the comprehensive version. Add a note below 1.4's example: "This is a simplified example. For a production-ready CLAUDE.md template with all recommended sections, see Section 1.8."

6. **Confirm the App Shell provides a `useTrack()` hook.** Both filtering patterns (`isDev` prop and `tracks` content-as-data) depend on reading the track from the URL. The App Shell (Agent 1) should export a `useTrack()` hook returning `{ track: 'general' | 'developer', isDev: boolean }`. This is referenced in spec 1.2 but should be confirmed in the App Shell spec to ensure all build agents have access to it.

7. **No action needed on the UK English text duplications (1.6 / 1.16).** These are intentional -- the starter kit is designed to be self-contained. The text is identical and unlikely to diverge because it is short and factual.

8. **No action needed on the deepwiki MCP configuration (1.4 / 1.13).** The JSON configuration is identical across both specs and is a factual reference that will not change independently.
