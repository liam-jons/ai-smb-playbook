/**
 * Centralised default configuration values.
 *
 * These provide generic, neutral defaults for the multi-tenant application.
 * Client-specific values are loaded from JSON config files at runtime and
 * merged on top of these defaults via config-loader.ts.
 *
 * To add a new client, create a JSON file in app/public/clients/{slug}.json
 * rather than editing this file. See CUSTOMISATION.md for the full guide.
 */

export const siteConfig = {
  /** Displayed in the header, browser tab, hero, and print documents */
  appTitle: 'AI Playbook',

  /** Full legal company name */
  companyName: 'Your Organisation',

  /** Informal / short brand name (used in prose, callout titles) */
  companyShortName: 'your organisation',

  /** Company website URL */
  companyUrl: 'https://www.example.com/',

  /** Short display URL (no protocol) */
  companyUrlDisplay: 'example.com',

  /** Feedback recipient email address */
  feedbackEmail: 'liam@aisolutionhub.co.uk',

  /** Feedback sender email (Resend verified domain) */
  feedbackSenderEmail: 'playbook@feedback.aisolutionhub.co.uk',

  /** Consultant / trainer name used in welcome copy */
  consultantName: 'Liam',

  /** Date of the training session(s) */
  trainingDate: '',

  /** Prefix for localStorage keys */
  localStoragePrefix: 'ai-playbook',

  /** Prefix used in feedback email subject lines */
  emailSubjectPrefix: 'AI Playbook',

  /** HTML meta description */
  metaDescription: 'Practical guidance for getting the most from Claude AI',

  /** Section 1.1 subtitle */
  welcomeSubtitle: 'Getting started with AI',

  // ─── Client industry & context ──────────────────────────────────────────────

  /** Client's primary industry (e.g., 'design', 'healthcare', 'finance') */
  industry: 'your industry',

  /** Short industry descriptor used in prose (e.g., 'design agency', 'law firm') */
  industryContext: 'your organisation',

  /** General team size descriptor (e.g., 'small', 'medium') */
  teamSize: 'small',

  // ─── Regression testing tool ────────────────────────────────────────────────

  /** Primary regression testing tool name (e.g., 'Ghost Inspector', 'Cypress') */
  testingTool: 'your testing tool',

  /** Regression testing tool documentation URL */
  testingToolDocs: 'the testing tool docs',

  // ─── Industry-specific terms ────────────────────────────────────────────────

  /** Industry-specific compliance or regulatory area (e.g., 'safeguarding', 'HIPAA') */
  complianceArea: 'your compliance area',

  /** Primary software product or management system (e.g., 'LMS', 'CRM', 'ERP') */
  primaryProduct: 'your primary system',

  /** Description of what the primary product does */
  primaryProductDescription: 'primary management system',

  /** Stakeholder group for compliance reports (e.g., 'safeguarding partnership team', 'board') */
  complianceStakeholders: 'your compliance stakeholders',

  /** Key web applications the client builds/maintains */
  webApplications: 'your web applications',

  // ─── Recurring task examples ────────────────────────────────────────────────

  /** Example recurring tasks relevant to the client's industry */
  exampleRecurringTasks: [
    'monthly reports',
    'client communications',
    'compliance documentation',
    'data analysis',
  ] as readonly string[],

  /** Example data export for a recurring report (e.g., 'LMS data export', 'CRM export') */
  reportDataSource: 'your data export',

  /** Example client onboarding context (e.g., 'LMS client', 'new account') */
  clientOnboardingType: 'new client',

  // ─── Technical context (for developer track examples) ───────────────────────

  /** Primary tech stack description for developer examples */
  techStack: 'your tech stack',

  /** Database technology used in developer examples */
  database: 'your database',

  /** Example domain-specific audit or form (e.g., 'safeguarding audit form') */
  domainSpecificForm: 'your domain-specific form',

  /** Example sensitive data description for governance (e.g., 'safeguarding case data, child protection information, or vulnerable person records') */
  sensitiveDataDescription:
    'sensitive client data, personal information, or confidential records',

  /** Short sensitive data label for risk tier examples (e.g., 'safeguarding data', 'patient records') */
  sensitiveDataLabel: 'sensitive data',
} as const;

export type SiteConfig = typeof siteConfig;
