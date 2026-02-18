# Field Mapping Reference

Complete mapping of every `ClientConfig` field to its source, derivation rule, and default value. The `ClientConfig` interface is defined at `app/src/config/client-config-schema.ts`.

## siteConfig Fields

### Required (all clients)

| Field | Required | Transcript Extractable | Derivation Rule / Default | Notes |
|-------|----------|----------------------|---------------------------|-------|
| `appTitle` | Yes | No | `"{companyShortName} AI Playbook"` | Derive automatically from `companyShortName`. |
| `companyName` | Yes | Yes — introductions | None — must be confirmed | Ask explicitly if not found. Full legal name. |
| `companyShortName` | Yes | Yes — informal usage | First word of `companyName` minus "Limited"/"Ltd" | Always confirm with consultant — brand names can be surprising. |
| `companyUrl` | Yes | Sometimes | None — must be provided | Ask explicitly. Validate with WebFetch if possible. |
| `companyUrlDisplay` | Yes | No | Strip protocol + trailing slash from `companyUrl` | Derive automatically. E.g. `"https://www.acme.co.uk/"` → `"acme.co.uk"`. |
| `feedbackEmail` | Yes | No | `"liam@aisolutionhub.co.uk"` | Consultant's email, not the client's. Default without asking. |
| `feedbackSenderEmail` | Yes | No | `"playbook@feedback.aisolutionhub.co.uk"` | Fixed — tied to Resend verified domain. Never changes. |
| `consultantName` | Yes | Yes — trainer intro | `"Liam"` | Default to known consultant. |
| `trainingDate` | Yes | Yes — timestamp | None | Extract from transcript metadata. Format: `"DD Month YYYY"`. |
| `localStoragePrefix` | Yes | No | `"{slug}-playbook"` | Derive from the client slug. Lowercase with hyphens only. |
| `emailSubjectPrefix` | Yes | No | `"{companyShortName} AI Playbook"` | Derive automatically. |
| `metaDescription` | Yes | No | `"Practical guidance for getting the most from Claude AI"` | Generic default works for all clients. |
| `welcomeSubtitle` | Yes | No | `"Getting started with AI at {companyShortName}"` | Derive automatically. |

### Recommended (most clients)

| Field | Required | Transcript Extractable | Derivation Rule / Default | Notes |
|-------|----------|----------------------|---------------------------|-------|
| `industry` | Recommended | Yes — scoping discussions | None | Extract from transcript. E.g. "Safeguarding and public sector software", "Construction and engineering". |
| `industryContext` | Recommended | Partially | Infer from `industry` | Short descriptor: "design agency", "engineering firm", "law practice". Confirm with consultant. |
| `teamSize` | Recommended | Yes — "team of eight" | `"small"` | Map numbers: 1-15 → `"small"`, 16-50 → `"medium"`, 51+ → `"large"`. |
| `primaryAiTool` | Recommended | No | `"Claude"` | Always "Claude" for this playbook. Default without asking. |

### Developer track fields

| Field | Required | Transcript Extractable | Derivation Rule / Default | Notes |
|-------|----------|----------------------|---------------------------|-------|
| `hasDeveloperTrack` | Yes | Yes — dev session exists | `true` | Set `true` if any developer/technical session occurred. Ask to confirm. |
| `testingTool` | Dev only | Yes — tool discussions | None | Only if `hasDeveloperTrack: true`. E.g. "Ghost Inspector", "Cypress", "Playwright". |
| `testingToolDocs` | Dev only | No | `"the {testingTool} docs"` | Derive automatically. |
| `techStack` | Dev only | Yes — first dev topic | None | E.g. "ASP.NET/C#", "React/TypeScript", "Python/Django". |
| `database` | Dev only | Sometimes | None | E.g. "SQL Server", "PostgreSQL". Omit if not mentioned. |
| `webApplications` | Dev only | Yes — key products | None | Comma-separated list: "LMS, Audit System, PDMS". |
| `domainSpecificForm` | Dev only | Sometimes | None | E.g. "safeguarding audit form", "patient intake form". Omit if not relevant. |

### Domain-specific fields

| Field | Required | Transcript Extractable | Derivation Rule / Default | Notes |
|-------|----------|----------------------|---------------------------|-------|
| `complianceArea` | Domain | Yes — compliance discussions | None | E.g. "safeguarding", "GDPR", "healthcare", "financial". |
| `primaryProduct` | Domain | Sometimes | None | Acronym: "LMS", "CRM", "ERP". Omit if not applicable. |
| `primaryProductDescription` | Domain | No | Full name of the `primaryProduct` acronym | E.g. "learning management system", "customer relationship management system". |
| `certificationName` | Domain | Sometimes — governance | None | E.g. "DBS checks", "ISO 27001", "SOC 2". |
| `complianceStakeholders` | Domain | Sometimes | None | E.g. "safeguarding partnership team", "data protection team", "board". |
| `sensitiveDataDescription` | Domain | Yes — data handling | None | Full description: "safeguarding case data, child protection information, or vulnerable person records". |
| `sensitiveDataLabel` | Domain | No | Short form of `sensitiveDataDescription` | E.g. "safeguarding data", "patient records", "financial data". |
| `exampleRecurringTasks` | Yes (array) | Yes — workflow discussions | `[]` (empty) | Array of 4 strings. Extract concrete tasks from transcript. |
| `reportDataSource` | Domain | Sometimes | None | E.g. "LMS data export", "CRM export", "Sage 200 report". |
| `clientOnboardingType` | Domain | Sometimes | None | E.g. "LMS client", "new patient", "tenant". |

## Extraction Priority

When extracting from transcripts, prioritise in this order:

1. **High confidence** (almost always present): `companyName`, `trainingDate`, `teamSize`, `industry`, `hasDeveloperTrack`, `techStack`, `exampleRecurringTasks`
2. **Medium confidence** (often present): `complianceArea`, `testingTool`, `webApplications`, `sensitiveDataDescription`, `certificationName`
3. **Low confidence** (rarely in transcripts): `companyUrl`, `database`, `domainSpecificForm`, `reportDataSource`, `clientOnboardingType`

For low-confidence fields, ask the consultant explicitly rather than guessing.

## Consultant Minimum Input

At minimum, the consultant needs to provide or confirm:

1. **Company name** (full and short form)
2. **Company URL**
3. **Training date** (if not in transcript metadata)
4. **Industry / industry context**
5. **Whether the developer track is needed**
6. **Tech stack details** (if developer track enabled)
7. **Compliance/domain context** (if applicable)

Everything else can be derived, defaulted, or extracted from the transcript.
