Initial thoughts on key topics to cover:

## General

### Skills
    
- How to structure a skill file and when to use a Skill versus MCP versus Commands etc.
    - Governance:
        - Safe process for adopting external skills
        - Standards for internal skills so they’re reliable and reusable
- Use cases:
    - How to ensure outputs are always UK English, rather than US
    - Phew branding & templates automatically applied to outputs
    - Security / development standards
    - How to setup recurring/scheduled tasks

- Create policy for Skills, plugins, and connectors
- Send skill files as examples - if happy you won't need auto-updates, just copy and maintain

### Context & Session Management

- Visualisation of how context works
- When to stop a session and start a new one
- How to get Claude to write its own “handoff” prompt and/or structured summary so you restart fresh but keep context
- How to breakdown tasks into subtasks
- Managing context - anything in your project folder/memory file/CLAUDE.md file can be used by Claude, and therefore needs to be accurate
    - Create a skill to clean these

---

## Development

- Setting up and maintaining CLAUDE.md files across the codebase
- Creating a documentation setup which is just for Claude (i.e., LLM-ready and optimised)
    - Using agents to document, and maintain documentation for codebase
- Patterns for avoiding hallucinations and “quick fix” behaviour (e.g., breaking tasks down, planning, creating specs, asking for recommendations/options, prioritising best practice, giving an 'out' - for example, ensuring that Claude can use "I don't know" as an option, for larger tasks ensuring that open questions are outlined and then responded to before implementing any changes, and so.)
- AI-driven regression testing, to compliment or replace use of Ghost Inspector
- Using third-party tools where relevant e.g., Coderabbit, Mintlify, agent-browser
- Setting up and u-sing MCP's safely e.g., deepwiki, chrome-devtools
- Utilising plugins safely - the below only covers plugins which are part of Anthropic's 'claude-plugins-official' marketplace - there are also third party marketplace, but this is a good start
    - Anthropic (claude-plugins-official) - commit-commands, plugin-dev, pr-review-toolkit, security-guidance, code-simplifier, github, context7, playwright, claude-md-management, sentry, php-lsp, coderabbit
- Agents to audit codebase
- Agents to handle any well-documented technical debt
