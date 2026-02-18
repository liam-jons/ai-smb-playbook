# Client Customisation Guide

This guide walks you through creating a new client deployment of the AI SMB Playbook. A single deployed SPA serves all clients — each identified by subdomain and configured via a JSON file. No code changes are needed for new clients.

---

## Quick Start

1. **Copy the template:**
   ```bash
   cp app/public/clients/_template.json app/public/clients/{slug}.json
   ```
2. **Fill in the required fields** (see [Field Reference](#field-reference) below).
3. **Add overlay content** — brand voice, recurring tasks, ROI examples.
4. **Configure sections** — enable/disable individual sections, set `hasDeveloperTrack`.
5. **Configure starter kit categories** — choose which custom categories to include.
6. **Add subdomain in Vercel dashboard** — point `{slug}.playbook.aisolutionhub.co.uk` at the deployment.
7. **Test:** visit `{slug}.playbook.aisolutionhub.co.uk`.

---

## Field Reference

All fields live under the `siteConfig` key in the client JSON file. They are grouped into four tiers below.

### Required (all clients)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `appTitle` | `string` | Browser title bar text | `"Acme AI Playbook"` |
| `companyName` | `string` | Full legal company name | `"Acme Industries Limited"` |
| `companyShortName` | `string` | Short display name used throughout the UI | `"Acme"` |
| `companyUrl` | `string` | Company website URL | `"https://www.acme.co.uk/"` |
| `companyUrlDisplay` | `string` | Displayed URL (no protocol) | `"acme.co.uk"` |
| `feedbackEmail` | `string` | Recipient for feedback widget emails | `"liam@aisolutionhub.co.uk"` |
| `feedbackSenderEmail` | `string` | Sender address for feedback emails | `"playbook@feedback.aisolutionhub.co.uk"` |
| `consultantName` | `string` | Name of the consultant who delivered training | `"Liam"` |
| `trainingDate` | `string` | Date training was delivered | `"11 February 2026"` |
| `localStoragePrefix` | `string` | Prefix for localStorage keys (avoids collisions between clients) | `"acme-playbook"` |
| `emailSubjectPrefix` | `string` | Subject line prefix for feedback emails | `"Acme AI Playbook"` |
| `metaDescription` | `string` | HTML meta description | `"Practical guidance for getting the most from Claude AI"` |
| `welcomeSubtitle` | `string` | Subtitle on the welcome page | `"Getting started with AI at Acme"` |

### Recommended (most clients)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `industry` | `string` | Industry description | `"Manufacturing and distribution"` |
| `industryContext` | `string` | How to describe the company in context | `"manufacturing company"` |
| `teamSize` | `string` | Team size descriptor | `"small"` / `"medium"` / `"large"` |
| `primaryAiTool` | `string` | Primary AI tool name (default: `"Claude"`) | `"Claude"` |

### Developer track only

Set `hasDeveloperTrack: true` in `siteConfig` to enable these fields.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `hasDeveloperTrack` | `boolean` | Whether to show the developer track | `true` |
| `testingTool` | `string?` | Testing tool used | `"Cypress"` |
| `testingToolDocs` | `string?` | How to reference testing docs | `"the Cypress docs"` |
| `techStack` | `string?` | Primary tech stack | `"React/TypeScript"` |
| `database` | `string?` | Primary database | `"PostgreSQL"` |
| `webApplications` | `string?` | Key web applications | `"Portal, Admin Dashboard"` |
| `domainSpecificForm` | `string?` | Domain-specific form/document type | `"patient intake form"` |

### Domain-specific (adjust or omit per client)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `complianceArea` | `string?` | Regulatory/compliance area | `"GDPR"` |
| `primaryProduct` | `string?` | Primary product acronym | `"CRM"` |
| `primaryProductDescription` | `string?` | Full product description | `"customer relationship management system"` |
| `certificationName` | `string?` | Relevant certification type | `"ISO 27001"` |
| `complianceStakeholders` | `string?` | Compliance stakeholder group | `"data protection team"` |
| `sensitiveDataDescription` | `string?` | Description of sensitive data types | `"patient health records and personal data"` |
| `sensitiveDataLabel` | `string?` | Short label for sensitive data | `"health data"` |
| `exampleRecurringTasks` | `string[]` | Four example recurring tasks | `["monthly reports", "client reviews", "invoice reconciliation", "team stand-up prep"]` |
| `reportDataSource` | `string?` | Data source for reports | `"CRM data export"` |
| `clientOnboardingType` | `string?` | Type of client/user being onboarded | `"new patient"` |

---

## Overlays

Overlays provide client-specific content that enriches the playbook sections without changing the underlying structure. All overlays are optional — sections render sensible defaults when an overlay is absent.

### Brand Voice (`overlays.brandVoice`)

**`frameworkExamples`** — `Record<string, string>`

Keys `"1"` through `"7"`, each mapping to a step in the brand voice framework:

| Key | Framework Step | What to write |
|-----|----------------|---------------|
| `"1"` | Brand personality | Describe the brand as if it were a person — traits, demeanour, values. |
| `"2"` | Voice attributes | "We are / we are not / sounds like" descriptors. |
| `"3"` | Audience awareness | Who the brand speaks to — demographics, mindset, needs. |
| `"4"` | Core messaging pillars | Three to five key themes the brand always reinforces. |
| `"5"` | Tone spectrum | How the voice adapts across channels (formal report vs. social media vs. internal). |
| `"6"` | Style rules | Grammar, formatting, and language decisions (e.g. Oxford comma, sentence case headings). |
| `"7"` | Terminology | Preferred and avoided terms — the brand's lexicon. |

**`headStartContent`** — `string?`

Optional pre-filled content for the brand voice head start feature. Provide a short passage that demonstrates the client's established voice so users can see it applied immediately.

### Recurring Tasks (`overlays.recurringTasks`)

**`examples`** — `Array<{ title: string, description: string }>`

Client-specific recurring task examples. Each entry should have a short `title` and a one- to two-sentence `description` explaining the task and how Claude can help.

```json
{
  "overlays": {
    "recurringTasks": {
      "examples": [
        {
          "title": "Monthly client report",
          "description": "Compile analytics data into a branded PDF summary for each active client."
        },
        {
          "title": "Weekly social media schedule",
          "description": "Draft next week's posts across three platforms using the brand voice framework."
        }
      ]
    }
  }
}
```

### ROI (`overlays.roi`)

**`clientExamples`** — `Record<string, { title: string, description: string }>`

Keyed by task ID, each entry provides client-specific ROI example text that replaces the generic placeholder.

```json
{
  "overlays": {
    "roi": {
      "clientExamples": {
        "proposal-drafting": {
          "title": "Proposal turnaround",
          "description": "Reduced average proposal drafting time from 4 hours to 45 minutes."
        }
      }
    }
  }
}
```

---

## Sections Configuration

The `sections` key controls which playbook sections are visible for a given client.

- **Show all sections (default):** set `enabled: null` or omit the key entirely.
- **Show only specific sections:** set `enabled` to an array of section slugs.
  ```json
  { "sections": { "enabled": ["welcome", "context", "prompting", "governance"] } }
  ```
- **Hide specific sections:** set `disabled` to an array of section slugs.
  ```json
  { "sections": { "disabled": ["governance"] } }
  ```
- **Hide the entire developer track:** set `hasDeveloperTrack: false` in `siteConfig`. This removes the developer track from the navigation entirely — no developer-only fields are needed.

---

## Starter Kit Configuration

The `starterKit.enabledCustomCategories` array controls which optional starter kit categories are bundled for the client. Base tier items are always included regardless of this setting.

Available custom categories:

| Category | Contents |
|----------|----------|
| `developer-tools` | Claude Code skills, codebase mapping, testing workflows |
| `business-development` | Proposal templates, pitch preparation, competitor analysis |
| `creative-design` | Brand review, design critique, content creation |
| `integration-specific` | API integration guides, webhook templates |
| `compliance-security` | Audit checklists, data handling policies, security review |

Example for a design agency with developers:

```json
{
  "starterKit": {
    "enabledCustomCategories": ["developer-tools", "creative-design"]
  }
}
```

---

## Deployment

1. **Commit** the new JSON file at `app/public/clients/{slug}.json` to the repo.
2. **Push to `main`** — Vercel auto-deploys on merge.
3. **Add the subdomain in the Vercel dashboard:** `{slug}.playbook.aisolutionhub.co.uk`.
4. **Verify SSL** — ensure the wildcard certificate covers the new subdomain.
5. **For branded domains** (e.g. `ai.clientname.co.uk`):
   - Add the domain as a separate entry in Vercel.
   - The client manages DNS — they need a `CNAME` record pointing to `cname.vercel-dns.com`.

---

## Local Testing

Three approaches, depending on what you need to verify:

### Query parameter (quickest)

Append `?client={slug}` to the dev server URL:

```
http://localhost:4100?client=phew
```

### Environment variable

Create or edit `app/.env.local`:

```
VITE_DEFAULT_CLIENT=phew
```

The dev server will load this client config by default (no query parameter needed).

### Subdomain testing

Edit `/etc/hosts` to point the subdomain at localhost:

```
127.0.0.1  phew.localhost
```

Then visit `http://phew.localhost:4100`. This tests the full subdomain resolution path.
