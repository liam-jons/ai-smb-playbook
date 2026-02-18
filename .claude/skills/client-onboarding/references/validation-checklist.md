# Validation Checklist

Run this validation pipeline after generating the draft (catch structural issues early) and after writing the final file (catch everything).

---

## 1. Schema Conformance

### Required siteConfig fields

Verify all required fields are present and non-empty:

```
appTitle, companyName, companyShortName, companyUrl, companyUrlDisplay,
feedbackEmail, feedbackSenderEmail, consultantName, trainingDate,
localStoragePrefix, emailSubjectPrefix, metaDescription, welcomeSubtitle,
industry, industryContext, teamSize, primaryAiTool, hasDeveloperTrack,
exampleRecurringTasks
```

### No placeholder values

Scan for unresolved template placeholders. Regex: `\[.*?\]`

Any match indicates an unresolved field from `_template.json`. Replace with actual values or remove if optional.

### hasDeveloperTrack consistency

| `hasDeveloperTrack` | Expected state |
|---------------------|----------------|
| `true` | `techStack` should be populated. `testingTool`, `database`, `webApplications` populated where known. |
| `false` | Developer-only fields (`testingTool`, `testingToolDocs`, `techStack`, `database`, `webApplications`, `domainSpecificForm`) should be absent or omitted. |

### Overlay structure

| Check | Rule |
|-------|------|
| `overlays.brandVoice.frameworkExamples` | Must have keys `"1"` through `"7"`, each with a non-empty string value |
| `overlays.brandVoice.headStartContent` | Optional but should be a string (not `null`) |
| `overlays.recurringTasks.examples` | Must be a non-empty array; each entry has `title` (string) and `description` (string) |
| `overlays.roi.clientExamples` | Must be an object; each value has `title` (string) and `description` (string) |

### Sections configuration

| Check | Rule |
|-------|------|
| `sections.enabled` | Must be `null` or an array of valid section slugs |
| `sections.disabled` | Must be an empty array or contain only valid section slugs |

**Valid section slugs:**
- Both tracks: `welcome`, `context`, `sessions`, `skills-extensions`, `governance`, `brand-voice`, `recurring-tasks`, `roi-measurement`, `starter-kit`
- General only: `reliable-output`
- Developer only: `claude-md`, `documentation`, `codebase-mapping`, `hallucinations`, `regression-testing`, `mcp-usage`, `plugins`, `technical-debt`

### Starter kit configuration

| Check | Rule |
|-------|------|
| `starterKit.enabledCustomCategories` | Must be an array containing only valid category names |

**Valid custom categories:** `developer-tools`, `business-development`, `creative-design`, `integration-specific`, `compliance-security`

---

## 2. Content Quality Checks

| Check | Rule | How to verify |
|-------|------|---------------|
| `companyUrl` is a valid URL | Must start with `https://` (or `http://`) and parse as a valid URL | URL parsing |
| `trainingDate` format | Must follow `"DD Month YYYY"` (e.g. "11 February 2026") | Regex: `^\d{1,2} \w+ \d{4}$` |
| `localStoragePrefix` format | Lowercase with hyphens only | Regex: `^[a-z0-9-]+$` |
| `feedbackSenderEmail` domain | Must end with `@feedback.aisolutionhub.co.uk` | String check |
| No empty strings | All required fields have `.trim().length > 0` | Iterate required fields |
| Overlay descriptions substantive | Each description has at least 5 words | `description.split(' ').length >= 5` |
| Brand voice not template placeholders | Framework examples differ from `_template.json` values | Compare against template |
| UK English | No American spellings in overlay content | Spot check for "color" (→ "colour"), "organize" (→ "organise"), etc. |

---

## 3. Build Verification

After writing the JSON file, run:

```bash
cd app && bun run build
```

This executes the TypeScript compiler and Vite build. If the build passes, the config is structurally sound within the application.

If the build fails:
1. Report the error to the consultant.
2. Attempt to fix the JSON (common issues: missing commas, incorrect types, unescaped characters).
3. Re-run the build.

Also run lint and format checks:

```bash
cd app && bun run lint
cd app && bun run format:check
```

---

## 4. Local Preview Prompt

After validation passes, suggest local testing:

```bash
cd app && bun run dev
# Then visit: http://localhost:4100?client={slug}
```

Do not automatically start the dev server — output the command and URL for the consultant.

Key items to verify in the browser:
- Company name appears correctly in header and throughout
- Developer track visible/hidden based on `hasDeveloperTrack`
- Brand voice section shows overlay content (not generic defaults)
- Recurring tasks section shows overlay examples
- ROI section shows client-specific examples
- Starter kit shows correct category mix
- Feedback widget works (submit a test message)

---

## 5. Deployment Checklist

After all validation passes, output:

```
Deployment checklist:
[ ] JSON file committed: app/public/clients/{slug}.json
[ ] Pushed to main branch
[ ] Subdomain added in Vercel: {slug}.playbook.aisolutionhub.co.uk
[ ] SSL verified (automatic with Vercel wildcard)
[ ] Live site tested: company name, developer track, feedback email, starter kit categories
```

---

## Common Issues and Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Build fails with type error | Missing required field or wrong type | Check field against `client-config-schema.ts` |
| `[placeholder]` text appears in browser | Unresolved template value | Replace with actual value |
| Overlay content shows generic text | Overlay keys missing or misspelled | Verify overlay structure matches schema |
| Developer track visible when it should not be | `hasDeveloperTrack` set to `true` | Set to `false` in the config |
| Starter kit shows all items | `enabledCustomCategories` empty | Add relevant categories to the array |
| Feedback email not received | `feedbackSenderEmail` domain wrong | Must be `@feedback.aisolutionhub.co.uk` |
| localStorage collision between clients | `localStoragePrefix` duplicated | Use unique slug-based prefix |
