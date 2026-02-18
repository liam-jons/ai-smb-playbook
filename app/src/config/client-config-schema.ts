/**
 * Client configuration schema for multi-tenant deployments.
 *
 * Each client gets a JSON file matching this interface, loaded at runtime.
 * This enables a single build to serve multiple clients by swapping the
 * configuration file.
 */

// ─── Site Configuration ─────────────────────────────────────────────────────

export interface ClientConfig {
  siteConfig: {
    // Required (all clients)
    appTitle: string;
    companyName: string;
    companyShortName: string;
    companyUrl: string;
    companyUrlDisplay: string;
    feedbackEmail: string;
    feedbackSenderEmail: string;
    consultantName: string;
    trainingDate: string;
    localStoragePrefix: string;
    emailSubjectPrefix: string;
    metaDescription: string;
    welcomeSubtitle: string;

    // Client branding (optional — text-only fallback when omitted)
    clientLogoUrl?: string; // Path to logo for light mode (e.g. "/clients/logos/acme-light.png")
    clientLogoDarkUrl?: string; // Path to logo for dark mode (optional — falls back to clientLogoUrl)
    clientLogoAlt?: string; // Alt text for the logo (e.g. "Acme Industries logo")
    clientLogoMaxWidth?: number; // Max width in pixels (default: 200, capped at 280)

    // Recommended (most clients)
    industry: string;
    industryContext: string;
    teamSize: string;
    // Developer track only
    hasDeveloperTrack: boolean;
    testingTool?: string;
    testingToolDocs?: string;
    techStack?: string;
    database?: string;
    webApplications?: string;
    domainSpecificForm?: string;

    // Domain-specific (adjust or omit per client)
    complianceArea?: string;
    primaryProduct?: string;
    primaryProductDescription?: string;
    complianceStakeholders?: string;
    sensitiveDataDescription?: string;
    sensitiveDataLabel?: string;
    exampleRecurringTasks: string[];
    reportDataSource?: string;
    clientOnboardingType?: string;
  };

  overlays: {
    brandVoice?: {
      frameworkExamples: Record<string, string>;
      headStartContent?: string;
    };
    recurringTasks?: {
      examples: Array<{ title: string; description: string }>;
    };
    roi?: {
      clientExamples: Record<string, { title: string; description: string }>;
    };
  };

  sections: {
    enabled?: string[] | null;
    disabled?: string[];
  };

  starterKit?: {
    enabledCustomCategories?: string[];
  };
}

/** Convenience type for the siteConfig portion of ClientConfig. */
export type SiteConfigData = ClientConfig['siteConfig'];
