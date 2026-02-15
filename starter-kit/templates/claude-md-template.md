<!--
  CLAUDE.md Template
  What: Starter template for creating CLAUDE.md files in your projects.
        CLAUDE.md provides Claude Code with project context at session start.
  Usage: Copy this file to the root of your project as CLAUDE.md.
        Fill in the sections relevant to your project, delete the rest.
  Prerequisites: Claude Code installed.
  Tip: Keep CLAUDE.md under ~500 lines. Use it as a map, not an encyclopaedia.
       Point to /docs for detailed documentation.
-->

# CLAUDE.md

<!-- One-line description of what this project is -->

## Project

[Project name]: [Brief description of what this project does and who it is for.]

## Tech Stack

<!-- List the core technologies. Keep it to the essentials. -->

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | [e.g., TypeScript] | [e.g., 5.x] |
| Framework | [e.g., Next.js] | [e.g., 15.x] |
| Database | [e.g., PostgreSQL] | [e.g., 16] |
| Hosting | [e.g., Vercel] | |
| Package Manager | [e.g., npm / pnpm / yarn] | |

## Dev Commands

<!-- Copy-paste ready commands. Keep these up to date. -->

```bash
# Install dependencies
[e.g., npm install]

# Start development server
[e.g., npm run dev]

# Run tests
[e.g., npm test]

# Run linter
[e.g., npm run lint]

# Build for production
[e.g., npm run build]

# Deploy
[e.g., npm run deploy]
```

## Architecture

<!-- Brief directory structure showing the key areas. Not every file — just the map. -->

```
project-root/
  src/
    [key-directory]/     # [what it contains]
    [key-directory]/     # [what it contains]
    [key-directory]/     # [what it contains]
  docs/                  # Detailed documentation (see /docs)
  tests/                 # Test files
  [config-files]         # [what they configure]
```

<!-- Mention entry points, key files, or unusual patterns -->

**Entry point:** `[e.g., src/index.ts]`
**Main config:** `[e.g., next.config.js]`

## Code Style

<!-- Rules that Claude should follow when writing code for this project -->

- [e.g., Use named exports, not default exports]
- [e.g., Prefer `const` over `let`; never use `var`]
- [e.g., Use descriptive variable names; no single-letter variables except loop counters]
- [e.g., Import order: external packages, then internal modules, then relative imports]
- [e.g., Use `@/` path alias for all imports from `src/`]
- [e.g., Functions over classes unless the framework requires classes]

## Testing

<!-- How tests are structured and what patterns to follow -->

- **Test runner:** [e.g., Vitest / Jest / Playwright]
- **Test location:** [e.g., Co-located with source files as `*.test.ts` / Separate `tests/` directory]
- **Naming:** [e.g., `describe('ModuleName', () => { it('should do something', ...) })`]
- **Coverage target:** [e.g., 80% for new code]
- **Patterns:** [e.g., Prefer integration tests over unit tests for API routes]

## Environment

<!-- Required environment variables and setup steps -->

### Required Environment Variables

```
DATABASE_URL=          # [what this connects to]
API_KEY=               # [what service this authenticates with]
[OTHER_VAR]=           # [description]
```

### Setup Steps

1. [e.g., Copy `.env.example` to `.env` and fill in values]
2. [e.g., Run database migrations: `npm run db:migrate`]
3. [e.g., Seed test data: `npm run db:seed`]

## Key Gotchas

<!-- Non-obvious patterns, common mistakes, things Claude tends to get wrong -->

- [e.g., The `users` table uses soft deletes — always include `WHERE deleted_at IS NULL`]
- [e.g., API routes require authentication middleware — do not create unprotected endpoints]
- [e.g., The CI pipeline runs on Node 20, not Node 22 — do not use Node 22 features]
- [e.g., CSS modules are used in `/components` but Tailwind is used in `/app`]
- [e.g., Never import from barrel files (`index.ts`) — import directly from the source file]

## Style

<!-- Language and formatting conventions -->

- **UK English throughout.** All output must use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (£) for currency.

<!-- Add any additional style rules specific to your project -->

## Documentation

<!-- Point to /docs for detailed information. This keeps CLAUDE.md lean. -->

For detailed documentation, see:
- `docs/architecture/` — System architecture and domain model
- `docs/conventions/` — Coding standards and patterns
- `docs/integrations/` — Third-party service documentation
- `docs/schemas/` — Database and API schemas

<!-- Delete any sections above that are not relevant to your project. -->
