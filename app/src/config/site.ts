/**
 * Centralised client-specific configuration.
 *
 * To rebrand this app for a different client, edit only this file.
 * See .planning/research/reusability-audit.md for the full reusability roadmap.
 */

export const siteConfig = {
  /** Displayed in the header, browser tab, hero, and print documents */
  appTitle: 'Phew! AI Playbook',

  /** Full legal company name */
  companyName: 'Phew Design Limited',

  /** Informal / short brand name (used in prose, callout titles) */
  companyShortName: 'Phew!',

  /** Company website URL */
  companyUrl: 'https://www.phew.org.uk/',

  /** Short display URL (no protocol) */
  companyUrlDisplay: 'phew.org.uk',

  /** Feedback recipient email address */
  feedbackEmail: 'liam@aisolutionhub.co.uk',

  /** Feedback sender email (Resend verified domain) */
  feedbackSenderEmail: 'playbook@feedback.aisolutionhub.co.uk',

  /** Consultant / trainer name used in welcome copy */
  consultantName: 'Liam',

  /** Date of the training session(s) */
  trainingDate: '11 February 2026',

  /** Prefix for localStorage keys */
  localStoragePrefix: 'phew-playbook',

  /** Prefix used in feedback email subject lines */
  emailSubjectPrefix: 'Phew AI Playbook',

  /** HTML meta description */
  metaDescription: 'Practical guidance for getting the most from Claude AI',

  /** Section 1.1 subtitle */
  welcomeSubtitle: 'Getting started with AI at Phew',

  // ─── Client industry & context ──────────────────────────────────────────────

  /** Client's primary industry (e.g., 'design', 'healthcare', 'finance') */
  industry: 'Safeguarding and public sector software',

  /** Short industry descriptor used in prose (e.g., 'design agency', 'law firm') */
  industryContext: 'design agency',

  /** General team size descriptor (e.g., 'small', 'medium') */
  teamSize: 'small',

  // ─── Regression testing tool ────────────────────────────────────────────────

  /** Primary regression testing tool name (e.g., 'Ghost Inspector', 'Cypress') */
  testingTool: 'Ghost Inspector',

  /** Regression testing tool documentation URL */
  testingToolDocs: 'the Ghost Inspector docs',

  // ─── Industry-specific terms ────────────────────────────────────────────────

  /** Industry-specific compliance or regulatory area (e.g., 'safeguarding', 'HIPAA') */
  complianceArea: 'safeguarding',

  /** Primary software product or management system (e.g., 'LMS', 'CRM', 'ERP') */
  primaryProduct: 'LMS',

  /** Description of what the primary product does */
  primaryProductDescription: 'learning management system',

  /** Certification or check type relevant to the industry (e.g., 'DBS checks', 'SOC 2 audit') */
  certificationName: 'DBS checks',

  /** Stakeholder group for compliance reports (e.g., 'safeguarding partnership team', 'board') */
  complianceStakeholders: 'safeguarding partnership team',

  /** Key web applications the client builds/maintains */
  webApplications: 'LMS, Audit System, PDMS',

  // ─── Recurring task examples ────────────────────────────────────────────────

  /** Example recurring tasks relevant to the client's industry */
  exampleRecurringTasks: [
    'training completion reports',
    'client site accessibility checks',
    'proposal formatting',
    'audit report generation',
  ] as readonly string[],

  /** Example data export for a recurring report (e.g., 'LMS data export', 'CRM export') */
  reportDataSource: 'LMS data export',

  /** Example client onboarding context (e.g., 'LMS client', 'new account') */
  clientOnboardingType: 'LMS client',

  // ─── Technical context (for developer track examples) ───────────────────────

  /** Primary tech stack description for developer examples */
  techStack: 'ASP.NET/C#',

  /** Database technology used in developer examples */
  database: 'SQL Server',

  /** Example domain-specific audit or form (e.g., 'safeguarding audit form') */
  domainSpecificForm: 'safeguarding audit form',

  /** Example sensitive data description for governance (e.g., 'safeguarding case data, child protection information, or vulnerable person records') */
  sensitiveDataDescription:
    'safeguarding case data, child protection information, or vulnerable person records',

  /** Short sensitive data label for risk tier examples (e.g., 'safeguarding data', 'patient records') */
  sensitiveDataLabel: 'safeguarding data',
} as const;

export type SiteConfig = typeof siteConfig;
