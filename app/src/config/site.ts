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

  /** Company website URL */
  companyUrl: 'https://www.phew.org.uk/',

  /** Short display URL (no protocol) */
  companyUrlDisplay: 'phew.org.uk',

  /** Feedback recipient email address */
  feedbackEmail: 'liam@aisolutionhub.co.uk',

  /** Consultant / trainer name used in welcome copy */
  consultantName: 'Liam',

  /** Date of the training session(s) */
  trainingDate: '11 February 2026',

  /** Prefix for localStorage keys */
  localStoragePrefix: 'phew-playbook',

  /** Prefix used in feedback email subject lines */
  emailSubjectPrefix: 'Phew AI Playbook',

  /** HTML meta description */
  metaDescription:
    'Practical guidance for getting the most from Claude AI',

  /** Section 1.1 subtitle */
  welcomeSubtitle: 'Getting started with AI at Phew',
} as const;

export type SiteConfig = typeof siteConfig;
