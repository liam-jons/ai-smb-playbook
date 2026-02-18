import { lazy, type ComponentType } from 'react';

/**
 * Registry of section components.
 *
 * All sections are lazy-loaded via React.lazy() for code-splitting.
 * Each section loads only when the user navigates to it.
 *
 * The key is the section slug (matching Section.slug from sections.ts),
 * and the value is the React component that renders the section content.
 */
export const sectionComponents: Record<string, ComponentType> = {
  // General track sections
  welcome: lazy(() =>
    import('@/content/shared/WelcomeSection').then((m) => ({
      default: m.WelcomeSection,
    })),
  ),
  context: lazy(() =>
    import('@/content/general/ContextSimulatorSection').then((m) => ({
      default: m.ContextSimulatorSection,
    })),
  ),
  sessions: lazy(() =>
    import('@/content/general/SessionManagementSection').then((m) => ({
      default: m.SessionManagementSection,
    })),
  ),
  'reliable-output': lazy(() =>
    import('@/content/general/ReliableOutputSection').then((m) => ({
      default: m.ReliableOutputSection,
    })),
  ),
  'skills-extensions': lazy(() =>
    import('@/content/general/SkillsExtensionsSection').then((m) => ({
      default: m.SkillsExtensionsSection,
    })),
  ),
  governance: lazy(() =>
    import('@/content/general/GovernancePolicySection').then((m) => ({
      default: m.GovernancePolicySection,
    })),
  ),
  'brand-voice': lazy(() =>
    import('@/content/general/BrandVoiceSection').then((m) => ({
      default: m.BrandVoiceSection,
    })),
  ),
  'recurring-tasks': lazy(() =>
    import('@/content/general/RecurringTasksSection').then((m) => ({
      default: m.RecurringTasksSection,
    })),
  ),
  'roi-measurement': lazy(() =>
    import('@/content/general/RoiMeasurementSection').then((m) => ({
      default: m.RoiMeasurementSection,
    })),
  ),

  // Shared sections
  'starter-kit': lazy(() =>
    import('@/content/shared/StarterKitSection').then((m) => ({
      default: m.StarterKitSection,
    })),
  ),

  // Developer track sections
  'claude-md': lazy(() =>
    import('@/content/developer/ClaudeMdSection').then((m) => ({
      default: m.ClaudeMdSection,
    })),
  ),
  documentation: lazy(() =>
    import('@/content/developer/DocumentationSection').then((m) => ({
      default: m.DocumentationSection,
    })),
  ),
  'codebase-mapping': lazy(() =>
    import('@/content/developer/CodebaseMappingSection').then((m) => ({
      default: m.CodebaseMappingSection,
    })),
  ),
  hallucinations: lazy(() =>
    import('@/content/developer/HallucinationsSection').then((m) => ({
      default: m.HallucinationsSection,
    })),
  ),
  'regression-testing': lazy(() =>
    import('@/content/developer/RegressionTestingSection').then((m) => ({
      default: m.RegressionTestingSection,
    })),
  ),
  'mcp-usage': lazy(() =>
    import('@/content/developer/McpUsageSection').then((m) => ({
      default: m.McpUsageSection,
    })),
  ),
  plugins: lazy(() =>
    import('@/content/developer/PluginsSection').then((m) => ({
      default: m.PluginsSection,
    })),
  ),
  'technical-debt': lazy(() =>
    import('@/content/developer/TechnicalDebtSection').then((m) => ({
      default: m.TechnicalDebtSection,
    })),
  ),
};
