<!--
  Example Session Handoff — Developer
  What: A completed example of a session handoff prompt for Claude Code users.
        Shows the full structured format with file directives, work tracker,
        and success criteria.
  Usage: Reference this as an example when creating your own handoffs.
        The session-handoff skill generates these automatically.
  Prerequisites: None.
-->

# Session 04 Continuation Prompt

**Project:** SafeguardHub — Internal case management dashboard for school
safeguarding teams **Previous Session:** Session 03 (API route implementation
and database schema refinement) **Date Created:** 12/02/2026 **Repository:**
`/home/dev/projects/safeguardhub`

---

## Context Files to Read First

1. `CLAUDE.md` — Project conventions, tech stack, and key gotchas **Critical**
2. `docs/architecture/overview.md` — System architecture and domain model
3. `.planning/continuation-prompts/session-03-continuation.md` — Previous
   session's handoff (for cumulative context)
4. `src/app/api/cases/route.ts` — The cases API route (primary file being worked
   on)
5. `src/lib/db/schema.ts` — Database schema (recently modified)

---

## Cumulative Progress Summary

### Sessions 01-02: Foundation (Complete)

Project scaffolding, tech stack decisions (Next.js 15, PostgreSQL, Drizzle ORM,
Tailwind CSS), database schema design, and authentication setup with Auth0. See
`docs/architecture/decisions/001-tech-stack.md` for rationale.

### Session 03: API Routes and Schema Refinement (Complete)

- Implemented CRUD API routes for `cases` resource (`/api/cases`)
- Added `case_notes` table to the schema with foreign key to `cases`
- Implemented soft delete on cases (`deleted_at` column, filtered by default)
- Set up Drizzle ORM migrations — 3 migrations applied successfully
- Added input validation with Zod on all API endpoints
- Discovered issue: the `assigned_to` field references a user ID but we have not
  yet implemented the users sync from Auth0 — currently using a placeholder
  string

### Session 03 Decisions:

- **Pagination:** Cursor-based pagination on list endpoints (not offset-based)
- **Soft deletes:** All entities use soft delete pattern — never hard delete
- **Audit trail:** Every mutation logs to `audit_log` table with user ID,
  action, timestamp, and diff
- **Date format:** All dates stored as UTC in the database, formatted to UK
  format (DD/MM/YYYY) in the UI layer only

---

## Session 04 Objectives

### Primary Objective

Implement the `case_notes` API routes and the case detail page UI. A user should
be able to view a case and its associated notes, add new notes, and edit
existing notes.

### Secondary Objective (if time permits)

Begin the users sync from Auth0 — resolve the `assigned_to` placeholder issue by
syncing user profiles from Auth0 on login and storing them in a local `users`
table.

### Tertiary Objective (future sessions)

Dashboard overview page with case statistics (open cases by status, cases by
assigned user, cases opened per week).

---

## Remaining Work Tracker

| Item                         | Category    | Status          | Notes                                    |
| ---------------------------- | ----------- | --------------- | ---------------------------------------- |
| Project scaffolding          | Setup       | **Complete**    | Session 01                               |
| Auth0 authentication         | Auth        | **Complete**    | Session 02                               |
| Database schema (cases)      | Backend     | **Complete**    | Session 02, refined Session 03           |
| Database schema (case_notes) | Backend     | **Complete**    | Session 03                               |
| Cases API routes (CRUD)      | Backend     | **Complete**    | Session 03                               |
| Case notes API routes (CRUD) | Backend     | **In Progress** | Route files created, validation not done |
| Case detail page UI          | Frontend    | Not Started     | Session 04 primary                       |
| Users sync from Auth0        | Backend     | Not Started     | Session 04 secondary                     |
| Dashboard overview page      | Frontend    | Not Started     | Session 05                               |
| Role-based access control    | Auth        | Not Started     | After users sync                         |
| Email notifications          | Integration | Not Started     | Future                                   |
| Export to CSV/PDF            | Feature     | Not Started     | Future                                   |

---

## Important Context / Principles

See `CLAUDE.md` for full project conventions. Key reminders:

1. **Soft deletes everywhere** — always filter by `WHERE deleted_at IS NULL`
   unless explicitly querying archived records
2. **Audit trail required** — every mutation must log to `audit_log` before
   returning
3. **UK English** in all user-facing text, comments, and documentation
4. **Zod validation** on all API inputs — never trust client data
5. **Server Components by default** — only use `'use client'` when the component
   genuinely needs client-side interactivity
6. **No barrel imports** — import directly from source files, not from
   `index.ts`

---

## Recommended Approach

1. **Start with case_notes API routes** — Complete the CRUD endpoints with Zod
   validation and audit logging. The route files exist at
   `src/app/api/cases/[id]/notes/route.ts` but only have the GET handler
   implemented.
2. **Then build the case detail page** — Create `src/app/cases/[id]/page.tsx` as
   a Server Component that fetches the case and its notes. Add a Client
   Component for the notes form (add/edit).
3. **If time permits, begin users sync** — Create `src/lib/auth/sync-users.ts`
   that calls the Auth0 Management API on login to upsert user profiles into a
   local `users` table. Update `assigned_to` to reference this table.

---

## Data Locations

```
safeguardhub/
  src/
    app/
      api/
        cases/
          route.ts              # Cases CRUD (complete)
          [id]/
            route.ts            # Single case operations (complete)
            notes/
              route.ts          # Case notes CRUD (in progress)
      cases/
        page.tsx                # Cases list page (basic, needs polish)
        [id]/
          page.tsx              # Case detail page (does not exist yet)
    lib/
      db/
        schema.ts               # Drizzle schema (cases, case_notes, audit_log)
        index.ts                # Database connection
        migrations/             # 3 applied migrations
      auth/
        middleware.ts           # Auth0 middleware
    components/
      cases/                    # Case-related UI components (empty)
  docs/
    architecture/
      overview.md               # System architecture
      decisions/                # ADRs
  .planning/
    continuation-prompts/       # Session handoffs
```

---

## Technology Stack

| Layer     | Technology   | Version        |
| --------- | ------------ | -------------- |
| Language  | TypeScript   | 5.7            |
| Framework | Next.js      | 15.2           |
| ORM       | Drizzle      | 0.38           |
| Database  | PostgreSQL   | 16             |
| Auth      | Auth0        | Next.js SDK v4 |
| Styling   | Tailwind CSS | 4.0            |
| Hosting   | Vercel       |                |

---

## Open Questions

- [ ] Should case notes support file attachments? Deferred this decision —
      implementing text-only notes first.
- [ ] What is the maximum number of notes per case before we need pagination on
      the notes list? Assumed 50 for now.
- [ ] Do we need real-time updates on the case detail page (WebSocket/SSE) or is
      polling acceptable? Currently assuming reload-on-action.

---

## Known Issues

- **`assigned_to` is a placeholder string:** Currently stores the Auth0 user ID
  as a string rather than referencing a local users table. Works for now but
  will break when we build the dashboard aggregations (Session 05). Fix is part
  of Session 04 secondary objective.
- **No error boundary on API routes:** If the database is unreachable, API
  routes return a generic 500. Need to add proper error handling with meaningful
  error messages. Low priority — address when implementing error boundary
  patterns.

---

## Success Criteria

This session is complete when:

- [ ] Case notes API routes are fully implemented (GET, POST, PATCH, DELETE)
      with Zod validation and audit logging
- [ ] Case detail page displays case information and associated notes
- [ ] Users can add a new note to a case via the UI
- [ ] Users can edit an existing note via the UI
- [ ] All new code has UK English in user-facing strings and comments
- [ ] All existing tests still pass (`npm test`)
