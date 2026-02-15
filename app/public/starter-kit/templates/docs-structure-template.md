<!--
  Docs Structure Template
  What: Recommended /docs directory structure for AI-readable codebases.
        Based on the progressive disclosure principle: CLAUDE.md as map,
        /docs as system of record.
  Usage: Create these directories in your project. Populate progressively.
        Use gsd-codebase-mapper to generate initial content.
  Prerequisites: None (but gsd-codebase-mapper can populate this automatically).
-->

# Recommended Documentation Structure

## The Progressive Disclosure Principle

Your CLAUDE.md file should be a map, not an encyclopaedia. Keep it under ~500 lines and point to `/docs` for detailed information. Claude navigates to the right document when it needs deeper context — you do not need to load everything upfront.

This approach works because:
- **CLAUDE.md stays lean** — it loads quickly and does not crowd out the actual task
- **Documentation stays current** — it is easier to maintain many focused files than one massive file
- **Claude finds what it needs** — descriptive file names and a clear structure let Claude navigate on demand
- **New team members benefit too** — the same structure that helps Claude helps humans

## Directory Structure

```
docs/
  architecture/        # System architecture, domain model, data flow diagrams
  conventions/         # Coding standards, naming patterns, formatting rules
  integrations/        # Third-party service docs (APIs, webhooks, auth flows)
  schemas/             # Database schemas, API schemas, data models
  references/          # LLM-ready external docs (llms.txt files, vendor docs)
```

---

## Directory Details

### `docs/architecture/`

**What goes here:** High-level system design that helps Claude understand how the pieces fit together.

**Example files:**
- `overview.md` — System architecture diagram and description
- `domain-model.md` — Core domain entities and their relationships
- `data-flow.md` — How data moves through the system
- `deployment.md` — Infrastructure, environments, deployment pipeline
- `decisions/` — Architecture Decision Records (ADRs) for significant choices

**How CLAUDE.md should reference it:**
```markdown
For system architecture and domain model, see `docs/architecture/`.
```

**Maintenance:**
- Update when significant architectural changes are made
- Review quarterly to ensure accuracy
- Consider using a 'doc-gardening' agent to scan for staleness

### `docs/conventions/`

**What goes here:** Coding standards and patterns that Claude should follow when writing code for this project.

**Example files:**
- `code-style.md` — Formatting, naming, import ordering rules
- `patterns.md` — Common patterns used in this codebase (error handling, logging, auth)
- `anti-patterns.md` — Things to avoid and why
- `testing.md` — Test naming conventions, fixture patterns, coverage expectations
- `git.md` — Branch naming, commit message format, PR process

**How CLAUDE.md should reference it:**
```markdown
For coding standards and patterns, see `docs/conventions/`.
```

**Maintenance:**
- Update when new patterns are adopted or old ones deprecated
- Peer review convention changes before committing
- Keep concise — conventions that nobody follows are worse than none

### `docs/integrations/`

**What goes here:** Documentation for every third-party service the application connects to.

**Example files:**
- `stripe.md` — Payment processing setup, webhook configuration, test mode
- `sendgrid.md` — Email service configuration, template IDs, rate limits
- `auth0.md` — Authentication flow, token handling, role mapping
- `aws-s3.md` — File storage configuration, bucket policies, signed URLs

**What each integration doc should cover:**
1. What the service does in your system
2. Authentication method (API key, OAuth, etc.)
3. Key endpoints or resources used
4. Error handling and retry logic
5. Testing approach (sandbox accounts, mock data)
6. Rate limits and quotas
7. Relevant environment variables

**How CLAUDE.md should reference it:**
```markdown
For third-party service documentation, see `docs/integrations/`.
```

**Maintenance:**
- Update when API versions change or new services are added
- Include the date of last verification in each file
- Flag deprecated integrations clearly

### `docs/schemas/`

**What goes here:** Data structure definitions that Claude needs when working with the database or APIs.

**Example files:**
- `database.md` — Full database schema with table descriptions and relationships
- `api.md` — API endpoint documentation with request/response shapes
- `events.md` — Event schemas for webhooks, queues, or pub/sub systems
- `migrations/` — Migration history notes (not the migration files themselves)

**How CLAUDE.md should reference it:**
```markdown
For database and API schemas, see `docs/schemas/`.
```

**Maintenance:**
- Keep in sync with actual schemas (consider auto-generating from source)
- Include relationship diagrams for complex schemas
- Note any non-obvious constraints or defaults

### `docs/references/`

**What goes here:** External documentation that Claude might need, formatted for LLM consumption.

**Example files:**
- `framework-llms.txt` — Your framework's LLM-optimised documentation (if available from the vendor)
- `design-system.md` — Component library documentation relevant to your project
- `regulatory.md` — Regulatory requirements relevant to your industry

**How CLAUDE.md should reference it:**
```markdown
For external reference documentation, see `docs/references/`.
```

**Maintenance:**
- Update when dependency versions change
- Check for updated `llms.txt` files from vendors periodically
- Remove references to deprecated dependencies

---

## Getting Started

### Option 1: Manual Setup

Create the directory structure and populate files as needed:

```bash
mkdir -p docs/{architecture,conventions,integrations,schemas,references}
```

Start with the files most relevant to your current work. You do not need to fill in everything at once.

### Option 2: GSD Codebase Mapper

If you have the GSD codebase mapper installed, it can generate initial documentation automatically:

```bash
# Run the codebase mapper to generate docs
/map-codebase
```

The mapper analyses your codebase and generates documentation across seven areas: stack, structure, architecture, conventions, integrations, testing, and concerns.

### Option 3: AI-Assisted Population

Ask Claude to help populate each directory by analysing your codebase:

```
Please analyse this codebase and create documentation for docs/architecture/overview.md covering the system architecture, key components, and how they interact.
```

Work through each directory one at a time, reviewing and refining Claude's output.

---

## Keeping Documentation Current

### Agent-Driven Doc Gardening

Set up a recurring process (manual or automated) to check for stale documentation:

1. **Weekly:** Quick scan of recently changed files — do the docs still match?
2. **Monthly:** Review each directory for accuracy and completeness
3. **Quarterly:** Full audit against the actual codebase

Consider creating a Claude skill or command that audits your documentation against the codebase and flags inconsistencies.

### Signals That Documentation Is Stale

- Claude keeps getting things wrong in areas covered by docs
- New team members ask questions that should be answered by existing docs
- Code review comments repeatedly point out undocumented patterns
- The documentation references files, functions, or patterns that no longer exist
