# Continuation Prompt 39: Wellbeing People Client Onboarding

## Context

New client onboarding for Wellbeing People Ltd. Unlike previous clients (Phew, AMD), there is NO training transcript available. The config must be built entirely from website research and the client-onboarding skill. This prompt includes the research findings from Session 38.

**Important:** Use the `client-onboarding` skill to guide this process. The skill handles config generation, overlay content creation, and validation. Since there's no transcript, we'll rely on website analysis and the research summary below.

## Company Research Summary

### Company Profile

- **Company name:** Wellbeing People Ltd
- **Short name:** Wellbeing People
- **Website:** https://wellbeingpeople.com/
- **Display URL:** wellbeingpeople.com
- **Phone:** 01622 834834 (Marden, Kent area code)
- **Location:** Kent, UK (previously Marden offices, separated from parent company 2019)
- **Founded:** 2006 as wellbeing division of Water Wellbeing Ltd; separated as Wellbeing People Ltd in August 2019
- **Managing Director:** Ben McGannan (founder)
- **Industry:** Workplace wellbeing services
- **Team size:** small (~11 people based on Meet the Team page)

### Team Members

| Name | Role |
|------|------|
| Ben McGannan | Managing Director (founder) |
| Phillip Lerwill | Sales Director |
| Justine Clarabut | Company Director (part-time) |
| Jacob Neal | Finance Manager |
| Maggie Hurd | New Business and Account Manager |
| Siobhan Payne | New Business and Account Manager (now Events/Delivery Admin) |
| Charlotte Payne | Marketing Manager |
| Grant Payne | Lead Wellbeing Coach |
| Carin Soderberg | Wellbeing & Workplace Culture Lead |
| Andy Jee | Lead Installation Technician |
| Ethan Pearce | Installation Technician |

### Products & Services

1. **Interactive Health Kiosk** (flagship) -- self-service health MOT stations deployed at client sites
2. **Wellbeing Workshops & Webinars** -- group sessions on various wellbeing topics
3. **Health Screening** -- on-site health checks
4. **Habits for Health Employee Programme** (originally "Recalibrate Wellbeing") -- structured wellbeing programme
5. **Advanced Wellbeing Age Assessment** -- individual health age analysis
6. **Personal Wellbeing Consultations** -- 1:1 coaching
7. **Mental Health First Aider Training** -- MHFA certification
8. **Wellbeing Champion Training** -- training internal wellbeing ambassadors

### Brand Characteristics

- **Tone:** Warm, empowering, practical. Not clinical or corporate. Focuses on "empowering individuals to take ownership of their wellbeing."
- **Core values:** Passion, Integrity, Collaboration, Accountability
- **Core principles:** Empowerment, Prevention, Transformation
- **Key messaging:** "Real wellbeing, real impact", "Unlock the full potential of your workforce", nearly 20 years experience
- **Notable clients:** Royal Albert Hall, KP Snacks (both testimonials on website)
- **Differentiators:** Interactive Health Kiosk as engagement tool, nearly 20 years experience, UK and Europe coverage, evidence-based approach

### Technical Context

- **Website platform:** WordPress (with Thrive themes/plugins, CookieYes, Google Analytics, Hotjar, Vimeo, YouTube)
- **Client portal:** myaccount.wellbeingpeople.com (login system for clients)
- **No developer team apparent** -- this is a services/sales team, not a software company
- **hasDeveloperTrack: false** -- general track only

## Phase 1: Create Client Config

### Config slug: `wellbeing-people`

### Key decisions (no transcript -- must infer)

Since there's no training transcript, the following config values need to be determined through discussion or reasonable inference:

| Field | Suggested Value | Confidence | Notes |
|-------|----------------|------------|-------|
| `appTitle` | "Wellbeing People AI Playbook" | High | Standard pattern |
| `companyName` | "Wellbeing People Ltd" | High | From website |
| `companyShortName` | "Wellbeing People" | High | Used throughout site |
| `companyUrl` | "https://wellbeingpeople.com/" | High | From website |
| `feedbackEmail` | "liam@aisolutionhub.co.uk" | High | Standard |
| `consultantName` | "Liam" | High | Standard |
| `trainingDate` | TBD | Ask user | No training date set yet |
| `industry` | "Workplace wellbeing services" | High | From website |
| `industryContext` | "wellbeing services provider" | High | Summary form |
| `teamSize` | "small" | High | ~11 people |
| `hasDeveloperTrack` | `false` | High | No dev team |
| `primaryProduct` | "Interactive Health Kiosk" | Medium | Flagship product, but they have several |
| `primaryProductDescription` | "interactive health kiosk for workplace wellbeing engagement" | Medium | |
| `complianceArea` | "workplace health and safety" | Medium | Could also be "employee wellbeing" |
| `sensitiveDataDescription` | "employee health data, wellbeing assessment results, or personal health metrics" | Medium | Based on health kiosk data |
| `sensitiveDataLabel` | "employee health data" | Medium | |
| `exampleRecurringTasks` | See overlay section | Medium | |
| `reportDataSource` | "health kiosk data export" | Medium | Based on their primary product |
| `clientOnboardingType` | "corporate client" | Medium | B2B service model |

### Logo

Need to obtain the Wellbeing People logo. Their website shows the logo at:
- Light version: `https://wellbeingpeople.com/wp-content/uploads/2023/07/Wellbeing-People-Logo.png`
- Footer version: `https://wellbeingpeople.com/wp-content/uploads/2023/07/Wellbeing-People-Logo-1.png`

Download, convert to WebP, and save to `app/public/clients/logos/wellbeing-people.webp`. Check whether the logo works on both light and dark backgrounds to avoid the AMD logo issue.

## Phase 2: Create Overlay Content

### Brand Voice (7 framework examples)

Generate based on the research above. Key inputs:
- Brand personality: The supportive wellbeing coach who is passionate, evidence-based, and practical. Not clinical, not corporate, not preachy.
- Voice attributes: Empowering, warm, practical, evidence-based
- Audience: HR directors, wellbeing leads, office managers at medium-to-large organisations
- Messaging pillars: Nearly 20 years experience; Interactive Health Kiosk engagement; measurable results; empowering positive behaviour change
- Tone spectrum: Proposals (confident + evidence-led), workshop delivery (warm + encouraging), health reports (clear + reassuring), social media (energetic + inspiring)
- Style rules: UK English, DD/MM/YYYY, GBP
- Terminology: "wellbeing" (not "wellness"), "Interactive Health Kiosk" (capitalised), "Habits for Health" (programme name), "wellbeing coach" (not "health advisor")

### Recurring Tasks (4 examples)

Suggested examples based on their business model:
1. **Post-event engagement report** -- After deploying Health Kiosks at a client site, compile engagement statistics (participation rate, key health metrics flagged, follow-up actions recommended) into a structured report for the client.
2. **Workshop content adaptation** -- A skill that takes a wellbeing workshop brief (topic, audience, duration) and adapts existing workshop content to fit, pulling from Wellbeing People's library of topics and exercises.
3. **Proposal and tender response** -- Draft responses to corporate RFPs for wellbeing services, pulling from previous successful proposals and adapting to the prospective client's industry and size.
4. **Monthly client newsletter** -- Compile wellbeing tips, company news, and seasonal health advice into a newsletter draft following Wellbeing People's brand voice and format.

### ROI Examples (3 client-specific)

Suggested examples:
1. **Proposal writing** -- Wellbeing People regularly responds to corporate RFPs. AI can draft initial responses from previous winning proposals, cutting preparation time significantly.
2. **Client reporting** -- After health kiosk deployments, engagement reports must be compiled from data exports. AI can automate the analysis and formatting of these reports.
3. **Workshop content creation** -- Developing new workshop content and adapting existing materials for different client needs. AI can draft content frameworks and adapt materials faster.

## Phase 3: Starter Kit Configuration

### Recommended custom categories

Since Wellbeing People has no developer team:
- `enabledCustomCategories: []` (base tier only) OR
- `enabledCustomCategories: ["business-development"]` if the proposal writing / tender response skills are relevant (likely yes given their B2B sales model)

### Sections configuration

- `hasDeveloperTrack: false` -- no developer sections
- `sections.enabled: null` -- all general sections enabled (default)
- `sections.disabled: []` -- none disabled

## Phase 4: Validate and Test

1. Create `app/public/clients/wellbeing-people.json` using the `_template.json` as base
2. Run `bun run build` to confirm valid JSON and no TypeScript errors
3. Start dev server and visit `http://localhost:4100/?client=wellbeing-people`
4. Spot-check: homepage, brand voice section, recurring tasks section, governance section, starter kit
5. Verify company name, logo, overlay content all render correctly
6. Run the `playbook-review` skill for `wellbeing-people` to get a GO/NO-GO verdict
7. Create `.planning/client-specific/02-wellbeing-people/` directory with review report

## Deliverables

- `app/public/clients/wellbeing-people.json` -- complete client config
- `app/public/clients/logos/wellbeing-people.webp` -- client logo (light mode friendly)
- `.planning/client-specific/02-wellbeing-people/` -- planning directory with review report
- Playbook-review GO verdict
- Clean build on Vercel

## Open Questions for User

1. What is the training date for Wellbeing People? (Or should we use a placeholder date?)
2. Should we enable the `business-development` starter kit category? (Recommended: yes, for proposal/tender writing skills)
3. Is there any specific compliance area beyond general workplace health? (e.g., do they handle GDPR-sensitive health data that needs special governance?)
4. Any particular sections to disable for this client?
