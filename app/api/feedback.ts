import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import { extractClientSlugFromHostname, sanitiseSlug } from '../src/utils/slug.js';

/**
 * POST /api/feedback
 *
 * Accepts feedback from the playbook feedback widget and sends it via Resend.
 * Multi-tenant: determines the client from the Referer/Origin header and loads
 * the corresponding config from public/clients/{slug}.json.
 *
 * Body: { category: string, message: string, clientName?: string }
 *
 * Environment variables:
 *   RESEND_API_KEY — Resend API key (set in Vercel dashboard)
 */

// ── Default email config (used when client config cannot be loaded) ──
const DEFAULTS = {
  senderEmail: 'playbook@feedback.aisolutionhub.co.uk',
  senderName: 'AI Playbook',
  recipientEmail: 'liam@aisolutionhub.co.uk',
  subjectPrefix: 'AI Playbook',
};

// ── Client config loading ────────────────────────────────────────────
interface ClientSiteConfig {
  appTitle?: string;
  feedbackEmail?: string;
  feedbackSenderEmail?: string;
  emailSubjectPrefix?: string;
}

interface EmailConfig {
  senderEmail: string;
  senderName: string;
  recipientEmail: string;
  subjectPrefix: string;
}

function loadClientEmailConfig(slug: string): EmailConfig {
  if (slug === 'default') return DEFAULTS;

  try {
    const configPath = join(process.cwd(), 'public', 'clients', `${slug}.json`);
    const raw = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(raw) as { siteConfig?: ClientSiteConfig };
    const site = config.siteConfig ?? {};

    return {
      senderEmail: site.feedbackSenderEmail ?? DEFAULTS.senderEmail,
      senderName: site.appTitle ?? DEFAULTS.senderName,
      recipientEmail: site.feedbackEmail ?? DEFAULTS.recipientEmail,
      subjectPrefix: site.emailSubjectPrefix ?? DEFAULTS.subjectPrefix,
    };
  } catch {
    return DEFAULTS;
  }
}

// ── Hostname extraction from request headers ─────────────────────────
function getHostnameFromRequest(req: VercelRequest): string {
  const referer = req.headers.referer ?? req.headers.origin;
  if (!referer || typeof referer !== 'string') return 'localhost';

  try {
    const url = new URL(referer);
    return url.hostname;
  } catch {
    return 'localhost';
  }
}

const VALID_CATEGORIES = ['more-info', 'issue', 'general'] as const;

const CATEGORY_LABELS: Record<string, string> = {
  'more-info': 'Request more info',
  issue: 'Report an issue',
  general: 'General feedback',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate environment
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  // Resolve client-specific email config from the request origin
  const hostname = getHostnameFromRequest(req);
  const rawSlug = extractClientSlugFromHostname(hostname);
  const slug = sanitiseSlug(rawSlug);
  const emailConfig = loadClientEmailConfig(slug);

  // Parse and validate body
  const { category, message, clientName } = req.body ?? {};

  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Category is required' });
  }
  if (
    !VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])
  ) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }
  if (message.length > 5000) {
    return res
      .status(400)
      .json({ error: 'Message too long (max 5000 characters)' });
  }

  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  const subject = `${emailConfig.subjectPrefix} — ${categoryLabel}`;

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: `${emailConfig.senderName} <${emailConfig.senderEmail}>`,
      to: [emailConfig.recipientEmail],
      subject,
      text: [
        `Category: ${categoryLabel}`,
        `Client: ${clientName || 'Unknown'}`,
        '',
        'Message:',
        message.trim(),
        '',
        '---',
        `Sent from the ${emailConfig.senderName} feedback widget`,
      ].join('\n'),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to send feedback email:', error);
    return res.status(500).json({ error: 'Failed to send feedback' });
  }
}
