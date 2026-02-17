# AI Task Patterns for UK SMBs

Practical guidance for SMB employees (10-250 staff) in UK engineering, construction, and professional services on using generative AI for common tasks. Each pattern includes suitability assessment, approach, pitfalls, and ready-to-use prompts.

**4D Framework Notes** included per pattern reference [4D Framework for Effective AI Use](ai-decision-framework.md).

---

## Universal Pitfalls

These risks apply across most AI tasks. Individual patterns reference this section rather than repeating warnings.

| Risk | Guidance |
|------|----------|
| **GDPR/Data Protection** | Never input personal data, client names, project details, or contract values to free AI tiers. Free tiers may train on data or retain it for 30+ days. Use enterprise versions for sensitive content. For detailed data sensitivity and UK GDPR requirements, see [SMB Context - Data Sensitivity Classification](smb-context.md#data-sensitivity-classification). |
| **Verification Required** | AI outputs require human review before use. AI can hallucinate facts, misquote regulations, or generate plausible but incorrect information. |
| **Professional Judgement** | AI augments but does not replace professional expertise. For regulated activities (legal, safety, compliance), qualified human oversight is mandatory. |
| **Confidentiality** | Many documents contain confidential information. Assess whether uploading to external AI services breaches contractual or regulatory obligations. |

### Common Prompt Elements

Include these in prompts where applicable (not repeated in individual templates):
- **British English spelling** - UK spelling conventions (e.g., "organisation", "colour")
- **Professional formatting** - Appropriate for business context
- **Placeholder notation** - Use [SQUARE BRACKETS] for items requiring completion

---

## 1. Meeting Minutes from Recordings

**Suitability: High** - AI transcription tools (Otter.ai, Microsoft Copilot) reliably produce accurate transcripts with summaries, action items, and speaker identification.

### Approach
1. Choose tool: Otter.ai (free: 300 min/month) or Copilot in Teams (Business Standard + £25/user/month)
2. Connect calendar for auto-capture; use quality microphone
3. Review auto-generated minutes; correct speaker misidentifications and technical terms
4. Export to Word/Google Docs/project management system

### Pitfalls
| Risk | Detail |
|------|--------|
| **GDPR Consent** | Inform all participants before recording; explicit consent required |
| **Free Tier Data** | See Universal Pitfalls; use enterprise for confidential meetings |
| **Audio Quality** | Overlapping speech, accents, background noise reduce accuracy |
| **Speaker ID** | Similar voices may be misattributed; review labels before distribution |
| **Technical Terms** | Industry jargon may be misheard; add custom vocabulary where possible |

### Prompt
```
Create professional meeting minutes from this [project planning/site review/client call] transcript:

1. **Meeting Details**: Date, attendees, purpose
2. **Key Discussion Points**: 2-3 sentences each topic
3. **Decisions Made**: List with decision-makers
4. **Action Items**: Task, person responsible, due date
5. **Outstanding Issues**: Unresolved matters for follow-up

Format for stakeholder distribution.

TRANSCRIPT:
[Paste here]
```

### 4D Notes
- **Mode**: Augmentation
- **Discernment**: Verify action items match actual agreements; check speaker attributions
- **Diligence**: Have attendees confirm action items; spot-check 2-3 key facts

---

## 2. Document Summarisation

**Suitability: High** - Claude, ChatGPT, Microsoft Copilot excel at summarising lengthy documents. Claude handles up to 75,000 words in single context.

### Approach
1. Identify summary type: executive summary, technical overview, key points, or compliance checklist
2. Prepare document (PDF, DOCX, TXT); run OCR on scanned PDFs first
3. Upload/paste; use paid tier for sensitive documents
4. Specify audience and priority aspects
5. Verify key facts, figures, and conclusions against source

### Pitfalls
| Risk | Detail |
|------|--------|
| **Data Sensitivity** | See Universal Pitfalls |
| **Detail Omission** | AI may judge crucial sections as less important |
| **Hallucination** | Risk with numerical data and technical specifications |
| **Citations** | AI cannot reliably reference specific pages |

### Prompt
```
Summarise this [report type, e.g., "annual H&S report" / "project feasibility study"] for [audience, e.g., "senior management" / "technical implementation staff"].

Structure:
1. **Executive Summary** (3-4 sentences)
2. **Key Findings** (max 8 bullet points)
3. **Recommendations/Actions** (numbered, with responsible parties)
4. **Risks/Concerns** (bullet points)
5. **Important Dates/Deadlines**

Under [500/1000] words. Flag unclear or contradictory areas.

DOCUMENT:
[Paste/upload here]
```

### 4D Notes
- **Mode**: Augmentation
- **Discernment**: AI may omit details crucial to your use case; skim original for critical items
- **Diligence**: For client-facing, verify numerical claims and cross-reference conclusions

---

## 3. Email Drafting

**Suitability: High** - AI excels at drafting professional emails with consistent tone. All client-facing communications require human review.

### Approach
1. Gather context: recipient, relationship, purpose, previous correspondence, desired tone
2. Choose tool: Copilot in Outlook, or Claude/ChatGPT via browser
3. Provide detailed prompt including recipient role, company context, key points
4. Review for accuracy, tone, names; remove generic AI phrasing
5. Anonymise sensitive content before using free AI tiers

### Pitfalls
| Risk | Detail |
|------|--------|
| **Data Sensitivity** | See Universal Pitfalls; anonymise client details for free tiers |
| **Generic Phrasing** | AI often produces "I hope this finds you well", excessive exclamation marks |
| **Factual Errors** | AI may include incorrect details; verify dates, figures, claims |
| **Tone Mismatch** | Defaults may be wrong for your client relationship |

### Prompt
```
Professional follow-up email for UK engineering consultancy.

Context:
- Recipient: [Name], [Title] at [Company]
- Previous: [Last contact, e.g., "Site visit 15 Jan for foundation assessment"]
- Purpose: [e.g., "Chase response on structural survey report submitted 2 weeks ago"]
- Deadline: [e.g., "Planning submission 28 Feb"]
- Relationship: [Existing client / New prospect / Partner]

Requirements:
- Professional, warm UK tone
- Under 150 words
- Clear call to action
- No exclamation marks or overly enthusiastic language

Include subject line.
```

### 4D Notes
- **Mode**: Augmentation
- **Discernment**: Check tone matches relationship; remove AI-isms
- **Diligence**: Always read through before sending; have templates reviewed by colleague

---

## 4. Form/Template Population

**Suitability: Medium** - AI can populate templates but traditional mail-merge is often more reliable and keeps data local.

### Approach
1. Assess need: for simple data insertion, use Word/Google Docs mail merge instead
2. Create template with consistent placeholders: [SQUARE BRACKETS] or {{CURLY BRACES}}
3. Prepare data in clean spreadsheet format
4. Review outputs for formatting changes or altered clauses
5. For recurring automation, consider Power Automate, Zapier, PandaDoc

### Pitfalls
| Risk | Detail |
|------|--------|
| **Data Sensitivity** | See Universal Pitfalls - forms typically contain personal data |
| **Legal Language** | AI may alter clauses, change defined terms |
| **Formatting** | AI may not preserve required layouts |
| **Over-engineering** | Mail merge provides better control and security |

### Prompt
```
Populate this template with provided data. Do NOT alter standard text, legal clauses, or formatting. Only replace placeholders.

TEMPLATE:
[Paste template with [PLACEHOLDERS]]

DATA:
[List placeholder values]

Instructions:
1. Replace all [SQUARE BRACKETS] with corresponding data
2. UK date format (DD Month YYYY)
3. Maintain formatting and paragraph breaks
4. If data missing, leave placeholder visible with [DATA NEEDED]
5. Output completed document only
```

### 4D Notes
- **Mode**: Consider Automation for simple merge; Augmentation only when text generation needed
- **Discernment**: Verify all data inserted correctly; watch for altered legal language
- **Diligence**: For legal documents, compare output against template side-by-side

---

## 5. Report Generation from Data

**Suitability: High** - AI excels at transforming raw data into structured narrative reports and identifying patterns.

### Approach
1. Anonymise data: remove personal data, replace client names with generic identifiers
2. Structure data: clear tables with column headers, date ranges, units
3. Define requirements: purpose, audience, sections, format, calculations needed
4. Request specific analysis: trends, variances, recommendations
5. Verify all calculations independently; add organisation-specific context

### Pitfalls
| Risk | Detail |
|------|--------|
| **Data Sensitivity** | See Universal Pitfalls; anonymise data before processing |
| **Maths Errors** | AI hallucination 3-27% depending on complexity; verify all numbers |
| **Context** | AI may misunderstand industry terms, project codes, abbreviations |
| **Causation** | AI may overstate correlations; review analytical claims critically |

### Prompt
```
Generate a [monthly progress report / quarterly summary / site safety report] from data below.

Requirements:
- Purpose: [e.g., "board-level project update"]
- Audience: [e.g., "senior management, limited technical background"]
- Sections: [e.g., "Executive Summary, Progress, Budget, Risks, Recommendations"]
- Format: Professional narrative with bullet summaries, tables
- Length: ~800 words excluding tables

Data:
[Paste anonymised data]

Context:
- Reporting period: [dates]
- Key events: [significant occurrences]
- Comparisons: [e.g., "vs previous quarter", "vs budget"]

Please:
1. Summarise findings in plain English
2. Highlight concerning trends/variances
3. Suggest areas requiring management attention
4. Mark assumptions with [ASSUMPTION]
```

### 4D Notes
- **Mode**: Augmentation
- **Discernment**: Verify calculations independently; AI can misinterpret trends
- **Diligence**: Cross-check totals; have domain expert review conclusions

---

## 6. Compliance Document Generation

**Suitability: Medium** - AI generates first drafts but outputs require significant expert review due to legally binding nature and sector-specific regulations (Building Safety Act 2022, CDM 2015).

### Approach
1. Define scope: identify applicable regulations (CDM 2015, Building Safety Act, ISO standards)
2. Anonymise personal data; collect organisational details and role definitions
3. Generate structured first draft with clear specifications
4. Expert review: competent person validates against current regulations
5. Follow document control procedures; establish review dates

### Pitfalls
| Risk | Detail |
|------|--------|
| **Hallucinated Regulations** | AI may fabricate or misquote UK law (cf. Ayinde case); verify against legislation.gov.uk, HSE.gov.uk |
| **Outdated Info** | AI training has cut-offs; UK regulations change frequently |
| **PI Insurance** | AI without oversight could void professional indemnity coverage |
| **Competence** | CDM 2015 and Building Safety Act require competent persons - AI cannot fulfil this |
| **Data Sensitivity** | See Universal Pitfalls |

### Prompt
```
First draft [Construction Phase Plan / Risk Assessment / H&S Policy] for [organisation type, e.g., "45-person UK civil engineering contractor"].

Context:
- Applicable regulations: [e.g., "CDM 2015, HASWA 1974, MHSWR 1999"]
- Scope: [work/activities covered]
- Key hazards: [known hazards]
- Existing procedures: [reference existing processes]

Requirements:
- Reference genuine UK legislation/HSE guidance only
- Include sections for: [e.g., "duty holder responsibilities, risk controls, emergency procedures"]
- Format for [audience]
- State "requires verification" if uncertain about regulatory requirements

This draft requires competent person review before use.
```

### 4D Notes
- **Mode**: Augmentation with mandatory human oversight - AI cannot fulfil statutory competence
- **Discernment**: Highest scrutiny - verify all citations against official sources
- **Diligence**: Competent person review non-negotiable; document reviewer and date; version control

---

## 7. Data Extraction from Documents

**Suitability: Medium-High** - AI reliably extracts structured data from invoices, forms, reports. Complex tables and scanned images need specialist tools.

### Approach
1. Create clear schema of fields needed (invoice number, date, supplier, line items, total)
2. Assess document quality: text-based PDFs work well; scanned/handwritten need specialist tools (Google Document AI, Azure Document Intelligence)
3. Request structured output format (table, CSV, JSON)
4. Validate extracted data with human review, especially financial data
5. Export to target system

### Pitfalls
| Risk | Detail |
|------|--------|
| **Data Sensitivity** | See Universal Pitfalls; personal data extraction requires lawful basis |
| **Complex Tables** | Multi-column merged cells confuse general AI; process in stages |
| **Hallucinated Data** | AI may generate plausible but incorrect values; verify financial data |
| **Format Consistency** | AI may format same data differently; specify exact requirements |

### Prompt
```
Extract from this [invoice / PO / timesheet / expense claim] as a table:

Fields:
- Document Reference Number
- Date (DD/MM/YYYY)
- Supplier/Client Name
- Description
- Quantity (if applicable)
- Unit price (if applicable)
- Total amount (£X,XXX.XX)
- VAT amount (if shown)
- Payment terms/due date (if mentioned)

If field not present, enter "Not specified".
Present as table copyable to Excel.
List multiple line items on separate rows.
Flag uncertain values with [VERIFY].

DOCUMENT:
[Paste/upload here]
```

### 4D Notes
- **Mode**: Augmentation for varied formats; Automation only for highly standardised documents
- **Discernment**: Never trust extracted financial data without verification
- **Diligence**: Implement validation step; track accuracy over time

---

## 8. Specification/Tender Summarisation

**Suitability: Medium-High** - AI effectively distils lengthy tender documents, identifies requirements, deadlines, evaluation criteria. Human expertise essential for bid/no-bid decisions.

### Approach
1. Upload complete tender package (ITT, specifications, drawings list, contract terms, evaluation criteria)
2. Request structured analysis: scope, dates, compliance requirements, evaluation criteria
3. Extract technical specifications, quality standards, H&S requirements, submission requirements
4. Ask AI to flag unusual clauses, tight deadlines, penalty provisions, ambiguities
5. Generate compliance checklist; human expert reviews technical feasibility and commercial risk

### Pitfalls
| Risk | Detail |
|------|--------|
| **Confidentiality** | See Universal Pitfalls; never upload tender documents to free tiers |
| **Technical Feasibility** | AI cannot assess whether you can deliver to specifications |
| **Cross-References** | Requirements scattered across documents may be missed |
| **Deadline Accuracy** | Verify all submission deadlines independently |

### Prompt
```
Analyse tender/ITT for [brief description, e.g., "civil engineering works"]:

**1. OVERVIEW**: Contracting authority, title, reference, value, duration, scope summary

**2. KEY DATES** (chronological): Clarification deadline, site visit, submission deadline, award date, start date

**3. MANDATORY REQUIREMENTS**: Qualifications, accreditations, financial/insurance, experience

**4. EVALUATION CRITERIA**: Scoring methodology, quality vs price weighting, key areas

**5. TECHNICAL HIGHLIGHTS**: Deliverables, SLAs, materials/methods/standards

**6. RISKS/RED FLAGS**: Unusual terms, tight timescales, ambiguities, penalties, clarification needed

**7. SUBMISSION REQUIREMENTS**: Documents, formats, page/word limits, questions

Highlight contradictions or unclear areas.

TENDER DOCUMENTATION:
[Upload/paste here]
```

### 4D Notes
- **Mode**: Augmentation
- **Discernment**: Verify deadlines independently; AI cannot assess your capacity
- **Diligence**: Commercial/legal review for contract terms; verify each compliance item

---

## 9. Social Media Content Creation

**Suitability: Medium-High** - AI generates post ideas, captions, content calendars. Outputs need editing for authentic brand voice.

### Approach
1. Define 3-5 content pillars (project completions, industry insights, team news, safety tips)
2. Brief AI with company description, audience, platform, tone, sector specifics
3. Generate 3-5 variations per post; select and combine best elements
4. Adapt per platform: LinkedIn (longer professional), Instagram (visual hooks), X (punchy)
5. Add authentic elements: real photos, testimonials (with permission), genuine insights

### Pitfalls
| Risk | Detail |
|------|--------|
| **Data Sensitivity** | See Universal Pitfalls; don't upload client photos without consent |
| **Generic Content** | AI lacks specific details that engage construction/engineering audiences |
| **Overuse** | Audiences detect generic AI content; limit AI to drafting |
| **Platform Errors** | Each platform has different formats, hashtag limits, character counts |

### Prompt
```
Social media content for UK construction firm (SMB, 50 employees) specialising in commercial refurbishment.

LinkedIn post announcing completed project:
- Project: [Office refurbishment / Warehouse conversion / Retail fit-out]
- Client sector: [e.g., "technology start-up"] (do not name client)
- Location: [City/Region]
- Achievement: [e.g., "2 weeks ahead of schedule" or "BREEAM Excellent"]
- Duration: [X months]

Requirements:
- Professional, approachable tone
- 150-200 words max
- Question or CTA for engagement
- 3-5 UK construction hashtags
- Max 2 emojis
- No unverifiable claims

Note: I'll add project photos separately.
```

### 4D Notes
- **Mode**: Augmentation
- **Discernment**: Check for generic phrasing; verify claims can be supported
- **Diligence**: Test with colleagues; track engagement to refine approach

---

## 10. Job Description Writing

**Suitability: High** - AI generates structured, professional job descriptions quickly. Human review essential for legal compliance.

### Approach
1. Gather: job title, department, reporting line, 5-7 key responsibilities, essential vs desirable qualifications, salary, working pattern
2. Include industry-specific certifications (CSCS, SMSTS/SSSTS, CPCS, Gas Safe, NEBOSH) and professional registration (CEng, IEng via ICE, IStructE, CIBSE)
3. Request UK English explicitly
4. Review for discriminatory language: gendered terms, age-coded language ("young and dynamic", "digital native")
5. Verify certification requirements are current (check cscs.uk.com)

### Pitfalls
| Risk | Detail |
|------|--------|
| **Data Sensitivity** | See Universal Pitfalls; never input candidate data |
| **Equality Act 2010** | AI may generate indirect discrimination; "physically fit" discriminates unless essential |
| **Outdated Certs** | AI may have wrong CSCS requirements; verify current standards |
| **Bias** | "Dominant", "competitive" discourage female applicants; "energetic" discourages older |

### Prompt
```
UK HR professional writing job description for [JOB TITLE] at [COMPANY NAME], [COMPANY DESCRIPTION, e.g., "45-person civil engineering consultancy, Manchester"].

ROLE:
- Department: [DEPARTMENT]
- Reports to: [LINE]
- Location: [LOCATION + hybrid arrangements]
- Contract: [Permanent/Fixed-term]
- Hours: [Full-time 37.5 / Part-time X]
- Salary: [£XX,XXX - £XX,XXX]

RESPONSIBILITIES: [List 5-7 main duties]

ESSENTIAL: [Must-have qualifications/experience, e.g., CSCS Gold, SMSTS, 3 years site management]

DESIRABLE: [Nice-to-have, e.g., NEBOSH, First Aid, specific software]

GUIDELINES:
1. Inclusive, gender-neutral language
2. No age-related terms (young, energetic, mature)
3. Physical requirements only if genuinely essential
4. Welcome reasonable adjustments statement
5. Focus on competencies over years of experience
6. UK equal opportunities statement

Structure: About Us, The Role, Key Responsibilities, Essential, Desirable, What We Offer, How to Apply.
```

### 4D Notes
- **Mode**: Augmentation
- **Discernment**: Review for discriminatory language; verify certification standards
- **Diligence**: Have someone from different background review; update when regulations change

---

## 11. FAQ/Knowledge Base Creation

**Suitability: Medium-High** - AI excellent at structuring information and generating FAQ lists. Requires accurate sources and ongoing verification.

### Approach
1. Gather sources: existing documents, common queries, support tickets, meeting notes
2. Identify audience: new employees, clients, site workers, general public
3. Organise into categories (H&S, HR, Technical, Client Info)
4. Use AI to extract and structure Q&A pairs
5. Review each FAQ for accuracy; establish quarterly review with assigned SME owners

### Pitfalls
| Risk | Detail |
|------|--------|
| **Data Sensitivity** | See Universal Pitfalls; anonymise personal data before processing |
| **Accuracy** | AI may generate confident but incorrect answers for technical/safety content |
| **Outdated** | AI cannot know when regulations change |
| **Oversimplification** | Complex topics may need professional judgement |

### Prompt
```
Technical writer creating internal FAQ for [COMPANY NAME], [DESCRIPTION, e.g., "UK construction contractor, commercial fit-outs"].

Audience: [e.g., "new site operatives" / "project managers" / "clients"]

FORMATTING:
- Plain English for non-specialists
- Clear, specific questions (not vague)
- Answers 50-150 words, concise but complete
- "See also" references for related topics
- Flag manager-approval items with [CHECK WITH LINE MANAGER]

CATEGORIES:
[List, e.g., Site Access, H&S, PPE, Reporting, Emergency, Equipment, Leave]

SOURCE MATERIAL:
[Paste content]

OUTPUT:
## [Category]

### Q: [Specific question as employee might ask]
**A:** [Concise answer in plain English]

*Last reviewed: [Date] | Owner: [Role]*

Note confidence level (High/Medium/Low) and gaps needing additional info.
```

### 4D Notes
- **Mode**: Augmentation
- **Discernment**: Technical/procedural FAQs may oversimplify; verify against current procedures
- **Diligence**: Establish review schedule with assigned owners; track questions to identify gaps

---

## 12. Process Documentation

**Suitability: Medium-High** - AI effectively converts informal process descriptions into SOPs. Recording tasks and using transcripts is practical for non-technical users.

### Approach
1. Record yourself (Loom, Teams, voice memo) performing task while narrating steps and explaining "why"
2. Get transcript (most tools auto-generate); clean up errors
3. Note process name, frequency, performer, tools, safety/compliance considerations
4. Use AI to structure documentation
5. Review with SME; test with someone unfamiliar with process

### Pitfalls
| Risk | Detail |
|------|--------|
| **Safety-Critical** | Method statements must be reviewed by competent persons; AI cannot assess site hazards |
| **Curse of Knowledge** | You may skip "obvious" steps essential for newcomers |
| **Data Sensitivity** | See Universal Pitfalls; anonymise client names and proprietary methods |
| **Version Control** | Establish ownership and review cycles |

### Prompt
```
Process Documentation Assistant creating SOP for UK SMB.

DETAILS:
- Process: [e.g., "Site Induction" / "Invoice Approval" / "Equipment Inspection"]
- Department: [owner]
- Frequency: [daily / per new starter / weekly]
- Performed by: [role]
- Systems/Tools: [software, equipment, forms]
- Compliance: [regulations, e.g., "CDM 2015 site induction"]

TRANSCRIPT/DESCRIPTION:
[Paste here]

CREATE SOP WITH:
1. **Title**
2. **Purpose** (1-2 sentences)
3. **Scope** (coverage and exclusions)
4. **Responsibilities**
5. **Procedure** (numbered steps, max 5 sub-bullets each, action verbs: Select, Click, Enter, Verify)
6. **Safety/Compliance Notes**
7. **Related Documents** (placeholder)
8. **Version Control** (placeholder)

Write for non-technical new staff.
Add "Clarification Needed" for unclear steps.
```

### 4D Notes
- **Mode**: Augmentation
- **Discernment**: Test with unfamiliar person; check for skipped "obvious" steps
- **Diligence**: Safety procedures require competent review; establish version control

---

## 13. Customer Response Templates

**Suitability: High** - AI excels at generating consistent, professional templates. Significantly reduces time on routine communications.

### Approach
1. List common enquiry types (quote requests, status queries, complaints, info requests)
2. Define tone, response time commitments, standard phrases
3. Create prompts for each scenario
4. Generate 2-3 template versions (straightforward, complex, escalation)
5. Build in clear personalisation placeholders
6. Test against real scenarios; update quarterly

### Pitfalls
| Risk | Detail |
|------|--------|
| **Data Sensitivity** | See Universal Pitfalls; never input actual customer data - use placeholders |
| **Personal Touch** | Customers recognise generic templates; staff must personalise meaningfully |
| **Complaints** | Need legal/compliance review; AI may admit liability or make inappropriate promises |
| **Outdated** | Update when policies/timescales change |

### Prompt
```
Customer service specialist for UK professional services firm (engineering/construction, 10-250 staff).

Response template for: [Choose]
- New enquiry about services
- Formal complaint acknowledgement
- Project status update
- Quote/proposal follow-up
- Information request

Requirements:
- Professional but warm tone
- Email or letter format
- Placeholders: [Customer Name], [Company], [Project/Reference], [Details], [Date], [Staff Name]
- 100-150 words
- Include: acknowledgement, key info/action, next steps, professional sign-off
- No specific time commitments (use [timeframe])
- No liability admission or promises beyond standard service

Provide:
- Subject line
- Template
- Staff guidance (2-3 bullets on when to use, what to personalise)
```

### 4D Notes
- **Mode**: Augmentation
- **Discernment**: Complaint templates need legal review; check no liability admission
- **Diligence**: Test against real scenarios; update when policies change

---

## 14. Presentation Content Creation

**Suitability: Medium-High** - AI generates structures, content, speaker notes. Design quality varies; technical accuracy requires review.

### Approach
1. Use AI for outline first: purpose, audience, key messages, time constraints
2. M365 Copilot generates in PowerPoint; others create content then build slides manually
3. Provide comprehensive context: audience profile, technical level, purpose, must-cover points
4. Generate slide-by-slide: title, bullets, speaker notes
5. Verify technical claims and statistics; add real examples and data

### Pitfalls
| Risk | Detail |
|------|--------|
| **Data Sensitivity** | See Universal Pitfalls; don't upload confidential client info |
| **Technical Errors** | AI may generate incorrect statistics, regulations, industry data |
| **Generic Look** | AI presentations look similar; client pitches need distinction |
| **Text-Heavy** | Apply "6x6 rule" (6 bullets, 6 words each) |

### Prompt
```
Presentation content for UK professional services firm.

Client project update:
- Purpose: Quarterly progress for [client type, e.g., "commercial property developer"]
- Audience: Client PM and stakeholders (non-technical)
- Duration: 20 min + 10 min Q&A
- Project type: [e.g., "Structural engineering for office development"]

Sections:
1. Executive Summary (1 slide)
2. Progress Against Programme (2-3 slides)
3. Key Achievements (1-2 slides)
4. Issues and Mitigations (1-2 slides)
5. Next Quarter Priorities (1 slide)
6. Budget Summary (1 slide)
7. Questions/Next Steps (1 slide)

Per slide:
- Title
- 3-4 bullets (concise, action-oriented)
- Speaker notes (2-3 sentences)

Non-technical clarity, [insert figure] placeholders, explain jargon.
```

### 4D Notes
- **Mode**: Augmentation
- **Discernment**: Verify technical claims; ensure narrative isn't undermined by generic content
- **Diligence**: Add real case studies/data; apply branding; review accuracy before presenting

---

## 15. Contract Review Assistance

**Suitability: Medium-Low** - AI assists with preliminary tasks (summarising, explaining jargon, flagging issues) but cannot provide legal advice. UK Law Society: solicitors remain accountable for AI-assisted work.

### Approach
1. Assess confidentiality: many contracts restrict third-party disclosure; never use free tiers
2. Consider redacting sensitive terms, names, specific financials
3. Use AI for preliminary analysis only: summarise terms, explain jargon, identify clause types, flag unusual provisions
4. Compare against your known standard positions if available
5. Document AI use; obtain qualified legal review before execution

### Pitfalls
| Risk | Detail |
|------|--------|
| **Hallucinated Law** | AI may misstate legal principles, invent clauses, apply US law; UK tribunals have documented fabricated case law |
| **Confidentiality** | See Universal Pitfalls; contracts contain sensitive data - uploading may breach obligations |
| **Professional Liability** | Relying on AI without professional review could constitute negligence |
| **Jurisdiction** | AI often trained on US content; may suggest concepts differing from English law |

### Prompt
```
Preliminary contract review - for information only, not legal advice. All outputs require qualified legal professional review.

Contract Context:
- Type: [e.g., "Professional Services Agreement" / "Sub-contractor Agreement"]
- My position: [e.g., "service provider" / "client procuring services"]
- Sector: [e.g., "engineering consultancy"]
- Jurisdiction: England and Wales

Provide:

1. **Plain English Summary** (150 words max): Parties, purpose, key obligations, duration

2. **Key Commercial Terms**: Payment terms, duration/termination, liability caps

3. **Clauses Requiring Attention**: Unlimited liability, indemnities, IP ownership, confidentiality, termination rights, dispute resolution

4. **Questions for Legal Review**: Specific concerns for legal counsel

5. **Potential Gaps**: Standard clauses that appear missing

Contract text:
[Paste redacted text - remove names, specific values, confidential details]

DISCLAIMER: Preliminary only. May contain errors, cannot identify all risks. Professional legal review required before signing.
```

### 4D Notes
- **Mode**: Augmentation with strict limitations - AI summarises; professionals advise
- **Discernment**: AI may misstate law or apply wrong jurisdiction; verify all legal claims
- **Diligence**: Professional legal review mandatory; document AI use; never rely solely on AI for contractual commitments

---

## Cross-Reference: Data Sensitivity

For detailed GDPR guidance and data sensitivity classifications, see **smb-context.md**.

**Quick Reference:**
| Data Type | Free AI Tier? | Action |
|-----------|--------------|--------|
| Generic templates/drafts | Yes | Review before use |
| Internal procedures (anonymised) | Yes, with caution | Anonymise details |
| Client-related content | No | Enterprise tiers only |
| Personal data | No | Local tools or enterprise AI |
| Legal/contractual | No | Professional review required |
