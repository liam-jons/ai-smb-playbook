---
name: client-research
description: Research a client company from website and public sources
argument-hint: [url] [name] [slug] [focus]
---

# Client Research Command

Perform a comprehensive, systematic research crawl of a client's website and public presence. Produce a structured research document that serves as input to the client onboarding skill and as a general-purpose engagement archive.

## Arguments

- **Client website URL:** $0 (e.g. `https://www.example.co.uk`)
- **Client company name:** $1 (e.g. `Acme Industries`)
- **Client slug:** $2 (e.g. `01-acme` — lowercase, hyphens only, for file naming)
- **Focus areas (optional):** $3 (e.g. `healthcare sector, interested in compliance`)

All three positional arguments (URL, name, slug) are required. Focus areas are optional.

## Output

Write the research document to: `.planning/client-specific/$2/{filename}-site-content.md`

where `{filename}` is the client name lowercased with hyphens (e.g. `phew-site-content.md`, `amd-group-site-content.md`).

If the directory `.planning/client-specific/$2/` does not exist, create it.

## Ground Truth Reference

Read `.planning/client-specific/00-phew/phew-site-content.md` before starting. This is the target output format — match its structure, depth, and quality. The Phew document is approximately 35 KB across 20 sections. Aim for comparable thoroughness.

## Research Strategy

Use a three-phase approach: Map → Scrape → Search.

### Phase 1: Site Mapping

Use Firecrawl MCP to discover the site structure:

```
firecrawl_map → $0
```

Identify and categorise URLs into:
- **Priority pages** (scrape immediately): homepage, about, services/products, team, contact, compliance/governance, values/mission
- **Secondary pages** (scrape if time permits): case studies, blog posts, careers, FAQs, press/news
- **Skip**: privacy policy, cookie policy, terms of service (note they exist but do not scrape content)

If Firecrawl is unavailable, fall back to WebFetch for the priority pages and use web search to fill gaps. Note this limitation in the research document metadata.

### Phase 2: Content Extraction

Scrape priority pages using Firecrawl:

```
firecrawl_scrape → each priority URL, format: markdown, onlyMainContent: true
```

For each page, extract:
- Key facts and data points
- Brand voice indicators (tone, vocabulary, self-description)
- Named entities (people, products, certifications, clients)
- Quantified claims (statistics, results, dates)

Scrape secondary pages selectively — focus on case studies (client names, results) and recent blog posts (content themes, publishing cadence).

### Phase 3: Gap Filling via Web Search

Use Firecrawl search or WebSearch to fill gaps the website does not cover:

1. **Companies House registration** — search `"$1" site:company-information.service.gov.uk` for company number, incorporation date, registered address, directors
2. **Industry context** — search for the client's industry positioning, competitors, market context
3. **Recent news** — search for recent mentions, press releases, awards
4. **Regulatory environment** — if the client operates in a regulated sector, search for relevant regulatory bodies and requirements
5. **Social/professional profiles** — LinkedIn company page, Clutch, Crunchbase, Digital Marketplace (if public sector)

If focus areas were provided in $3, prioritise research in those areas.

## Document Structure

Write the research document following this exact section structure (matching the Phew reference):

```markdown
# {Company Name} — Site Content Research

**Research date:** {today's date, DD Month YYYY}
**Source:** {website URL} and related public sources
**Purpose:** Comprehensive research archive for client engagement and playbook onboarding
**Method:** {Firecrawl MCP crawl | WebFetch fallback} + web search

---

## 1. Company Overview

### Legal Entity
- Registered name, trading name, company number, incorporation date
- Company type, registered office, operational address
- ICO/regulatory registrations if found

### Company Size
- Employee count (from website, LinkedIn, or other sources)
- Size descriptor (small/medium/large)

### Contact Details
- Phone, email, key contacts identified

### Company History
- Founding story, key milestones, evolution of services

---

## 2. Services and Products

For each service/product line:
- Name and URL
- Description and key features (bullet list)
- Sub-products or sector variants
- Reported results and statistics
- Pricing model (if publicly available)
- Framework/marketplace availability (e.g. G-Cloud)

---

## 3. Industry Positioning and Target Markets

### Primary Sectors
- List target sectors with brief descriptions

### Positioning Statement
- How the company describes itself

### Government/Framework Presence
- G-Cloud, Digital Marketplace, frameworks

### Competitive Differentiators
- What sets them apart (from their perspective)

---

## 4. Named Clients and Case Studies

Tabulate named clients with:
| Client | Product/Service | Notable Results |

Include aggregate client numbers where stated.

---

## 5. Team Structure and Key People

### Leadership
- Directors, founders, key executives (with roles)

### Named Staff
- Other staff identified from website, blog, LinkedIn

### Team Composition
- Inferred team structure from careers, website mentions

### Working Model
- Office/remote, locations, work approach

---

## 6. Company Values and Ethos

### Values
- Named values, frameworks, acronyms (e.g. IMPACT)

### Vision and Mission
- Stated vision, mission, purpose

### Culture
- Culture descriptors, employer branding themes

---

## 7. Compliance, Governance, and Certifications

### Certifications
| Certification | Standard | Status |

### Cyber Security
- Certifications, standards

### Data Protection
- ICO registration, GDPR stance, data residency

### Other Governance
- Disaster recovery, environmental, social responsibility

---

## 8. Technology and Tools

### Technology Stack
- Programming languages, frameworks, platforms
- Hosting, infrastructure
- Integrations, APIs, standards compliance

### Platforms and Subdomains
| Subdomain | Purpose |

---

## 9. Brand Voice and Tone Observations

### Overall Tone
- One-paragraph summary of brand voice

### Key Characteristics
Number each characteristic (1-7) with a title and description:
1. How they use language around their mission
2. Warmth/formality level
3. Confidence style
4. Use of data and evidence
5. Domain expertise signalling
6. Content marketing approach
7. Inclusivity and empathy

### Copy Patterns
- Headline style, blog register, case study approach

### Taglines/Positioning Lines
- Notable phrases observed

---

## 10. Site Structure and Key URLs

### Main Navigation Pages
| Page | URL |

### Case Study Pages
| Case Study | URL |

### Blog Categories
| Category | URL |

### External Profiles
| Platform | URL |

---

## 11. Notable Blog Posts

| Date | Title | URL |

Observe: publishing cadence, content themes, thought leadership areas.

---

## 12. Research Notes and Gaps

### What Was Well-Documented
- List areas with strong public information

### Gaps and Areas for Follow-Up
- Numbered list of information gaps that may require direct client input

---

## 13. Key Extractions for Playbook Config

This section summarises the fields most relevant to the client onboarding skill (`/client-onboarding`).

### Company Identity
- `companyName`: {full name}
- `companyShortName`: {suggested short name}
- `companyUrl`: {website URL}
- `industry`: {industry descriptor}
- `industryContext`: {context descriptor, e.g. "design agency"}
- `teamSize`: {small/medium/large}

### Compliance and Domain
- `complianceArea`: {primary compliance area}
- `certificationName`: {key certification}
- `sensitiveDataDescription`: {data types handled}
- `complianceStakeholders`: {relevant stakeholder group}

### Developer Track Signals
- `hasDeveloperTrack`: {true/false — based on technical indicators}
- `techStack`: {primary technologies if identifiable}
- `webApplications`: {key web products/apps}

### Brand Voice Inputs
- Brand personality summary (for framework step 1)
- Audience description (for framework step 3)
- Core messaging pillars (for framework step 4)
- Preferred terminology (for framework step 7)

### Recurring Tasks Candidates
- List 3-5 tasks that appear suitable for AI automation based on the company's operations

### ROI Opportunity Areas
- List 2-3 areas where AI could deliver measurable ROI

### Starter Kit Category Recommendations
- Recommended categories from: developer-tools, creative-design, business-development, integration-specific, compliance-security
```

## Quality Standards

1. **UK English throughout** — spelling, grammar, date formats (DD Month YYYY), currency (£)
2. **Cite sources** — note where each piece of information was found
3. **Flag uncertainty** — mark any low-confidence extractions or inferences
4. **Quantify where possible** — include specific numbers, dates, percentages
5. **No fabrication** — if information is not found, note it as a gap rather than guessing
6. **Substantive entries** — each section should contain real content, not placeholder text

## After Completion

1. Report the file path and approximate size
2. Summarise the key findings in 5-10 bullet points
3. List the most significant research gaps
4. Note whether sufficient data exists to run the onboarding skill (`/client-onboarding`) or whether additional information is needed from the consultant

## Fallback Mode (No Firecrawl)

If Firecrawl MCP is not available:

1. Use `WebFetch` to scrape the homepage, about page, services page, team page, and contact page
2. Use `WebSearch` for Companies House, LinkedIn, industry context, and news
3. Add a note to the document metadata: "Method: WebFetch fallback (limited crawl depth) + web search"
4. The output quality will be lower — note specific gaps that a full Firecrawl crawl would have filled
