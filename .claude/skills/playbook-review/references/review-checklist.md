# Playbook Review Checklist

Detailed checklist for each review category. Agents should use this as their scoring rubric.

## 1. Client Configuration Completeness

### Required Fields (BLOCKING if missing)
- [ ] `appTitle` — non-empty, contains company name
- [ ] `companyName` — full legal/trading name
- [ ] `companyShortName` — short version used in content
- [ ] `companyUrl` — valid URL, resolves
- [ ] `companyUrlDisplay` — human-readable domain
- [ ] `feedbackEmail` — valid email
- [ ] `feedbackSenderEmail` — valid email with sender domain
- [ ] `consultantName` — first name of the consultant
- [ ] `trainingDate` — DD Month YYYY format (UK date)
- [ ] `localStoragePrefix` — unique per client, no spaces
- [ ] `emailSubjectPrefix` — includes company name
- [ ] `metaDescription` — non-empty, no placeholder text
- [ ] `welcomeSubtitle` — non-empty, includes company name
- [ ] `industry` — specific to client, not generic
- [ ] `industryContext` — short descriptor
- [ ] `teamSize` — one of: small, medium, large
- [ ] `hasDeveloperTrack` — boolean, matches client's actual capability
- [ ] `exampleRecurringTasks` — array of 4 items, all client-specific

### Optional Fields (ADVISORY if missing)
- [ ] `clientLogoUrl` — path to logo file, file exists on disk
- [ ] `clientLogoAlt` — descriptive alt text
- [ ] `complianceArea` — relevant to client's industry
- [ ] `primaryProduct` — client's main offering
- [ ] `sensitiveDataDescription` — client-specific sensitive data types
- [ ] `reportDataSource` — where the client exports data from

### Placeholder Detection (BLOCKING)
Check all string values for:
- `[your company]`, `[company name]`, `Your Organisation`
- `[relevant ...]`, `[industry]`, `[your ...]`
- Generic defaults: `"your certification requirements"`, `"your team"`
- Any value containing square brackets that looks like a template placeholder

## 2. Overlay Content Quality

### Brand Voice (keys 1-7)
- [ ] Key 1 (Personification): Client-specific, references real company traits
- [ ] Key 2 (Voice attributes): 3-5 attributes with "we are / we are not / sounds like"
- [ ] Key 3 (Audience): Describes client's actual audience, not generic
- [ ] Key 4 (Messaging pillars): Specific to client's value proposition
- [ ] Key 5 (Register): Context-appropriate tone guidance
- [ ] Key 6 (Style guide): UK English, industry-appropriate conventions
- [ ] Key 7 (Terminology): Client-specific terms and usage rules
- [ ] Head start content: Non-empty, references real company traits

### Recurring Tasks (4 examples)
- [ ] Each example has `title` and `description`
- [ ] Titles are client-specific (not generic like "meeting minutes")
- [ ] Descriptions explain HOW the skill would work for this specific client
- [ ] At least 2 examples reference specific tools, systems, or processes the client uses

### ROI Examples
- [ ] At least 2 client-specific ROI examples
- [ ] Each has `title` and `description`
- [ ] Descriptions reference actual client workflows or pain points
- [ ] No named individuals without client approval
- [ ] Keys match the ROI template IDs in `roi-data.ts`

## 3. Browser: Navigation & Chrome

### Homepage
- [ ] Client logo renders (if `clientLogoUrl` is set)
- [ ] Company name appears in the page
- [ ] Welcome subtitle renders correctly
- [ ] Track cards show only enabled tracks
- [ ] Developer track card hidden when `hasDeveloperTrack: false`
- [ ] No flash of default config on load (FOUC check)

### Header
- [ ] App title shows client name
- [ ] Developer track link hidden when disabled
- [ ] Mobile menu works (hamburger opens/closes)
- [ ] Accessibility controls accessible

### Sidebar
- [ ] Shows only sections enabled for this client
- [ ] No developer sections when developer track disabled
- [ ] Active section highlighted on navigation
- [ ] All links navigate correctly

### 404 Page
- [ ] Renders when navigating to invalid path
- [ ] "Developer Track" button hidden when disabled
- [ ] "General Track" button works
- [ ] "Back to homepage" link works

## 4. Browser: Section Content

For each section, check:

### Rendering
- [ ] Page loads without error
- [ ] Heading and subtitle render
- [ ] Content is visible (no blank page, no loading stuck)
- [ ] No layout breaks or overflow issues

### Personalisation
- [ ] Company name appears where expected (personalised sections)
- [ ] Overlay content renders (brand voice, recurring tasks, ROI)
- [ ] No default/placeholder values visible
- [ ] Industry-specific examples are relevant

### Interactivity
- [ ] Copy buttons work on code blocks and prompts
- [ ] Expandable sections (accordions) open/close
- [ ] Calculators and simulators function
- [ ] Links navigate correctly

### Consistency
- [ ] UK English throughout (no "color", "organize", "analyze")
- [ ] Currency in £ not $
- [ ] Date format DD/MM/YYYY or DD Month YYYY
- [ ] Tone matches brand voice (practical, non-condescending)

## 5. Starter Kit

- [ ] Correct number of items visible for this client's tier
- [ ] Custom category items appear when `enabledCustomCategories` includes them
- [ ] Developer-only items hidden when developer track disabled
- [ ] ZIP download links work
- [ ] File previews render correctly
- [ ] Install instructions are relevant to the client's setup

## 6. Developer Track (when enabled)

- [ ] All developer sections render
- [ ] `testingTool` value appears in Regression Testing section
- [ ] `techStack` value appears where referenced
- [ ] Code examples are relevant to the client's stack
- [ ] No general-track content duplicated unnecessarily

## Scoring Guide

Each section receives one of:
- **PASS** — All blocking checks pass, no major issues
- **PASS WITH NOTES** — All blocking checks pass, advisory issues noted
- **FAIL** — One or more blocking issues found

Overall verdict:
- **GO** — Zero FAIL sections, all blocking issues resolved
- **NO-GO** — One or more FAIL sections or blocking issues
