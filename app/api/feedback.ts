import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

/**
 * POST /api/feedback
 *
 * Accepts feedback from the playbook feedback widget and sends it via Resend.
 *
 * Body: { category: string, message: string }
 *
 * Environment variables:
 *   RESEND_API_KEY — Resend API key (set in Vercel dashboard)
 *
 * The sender/recipient config is defined below. When templating this app
 * for another client, update these values.
 */

// ── Client-specific config ──────────────────────────────────────────
// Update these when templating for a new client.
const SENDER_EMAIL = 'playbook@feedback.aisolutionhub.co.uk';
const SENDER_NAME = 'Phew AI Playbook';
const RECIPIENT_EMAIL = 'liam@aisolutionhub.co.uk';
const SUBJECT_PREFIX = 'Phew AI Playbook';
// ─────────────────────────────────────────────────────────────────────

const VALID_CATEGORIES = ['more-info', 'issue', 'general'] as const;

const CATEGORY_LABELS: Record<string, string> = {
  'more-info': 'Request more info',
  'issue': 'Report an issue',
  'general': 'General feedback',
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

  // Parse and validate body
  const { category, message } = req.body ?? {};

  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Category is required' });
  }
  if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }
  if (message.length > 5000) {
    return res.status(400).json({ error: 'Message too long (max 5000 characters)' });
  }

  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  const subject = `${SUBJECT_PREFIX} — ${categoryLabel}`;

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: [RECIPIENT_EMAIL],
      subject,
      text: [
        `Category: ${categoryLabel}`,
        '',
        'Message:',
        message.trim(),
        '',
        '---',
        `Sent from the ${SENDER_NAME} feedback widget`,
      ].join('\n'),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to send feedback email:', error);
    return res.status(500).json({ error: 'Failed to send feedback' });
  }
}
