import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory rate limit: IP -> [timestamps]
const rateMap = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

function checkRate(ip) {
  const now = Date.now();
  const hits = (rateMap.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (hits.length >= MAX_REQUESTS) return false;
  hits.push(now);
  rateMap.set(ip, hits);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (!checkRate(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait before trying again.' });
  }

  const { name, email, subject, message, _trap } = req.body;

  // Honeypot: bots fill this, humans don't
  if (_trap) {
    return res.status(200).json({ ok: true });
  }

  // Validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (message.trim().length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters.' });
  }

  const subjectLine = subject?.trim()
    ? `[Portfolio] ${subject.trim()} — from ${name.trim()}`
    : `[Portfolio] Message from ${name.trim()}`;

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <contact@giovannilauffer.com>',
      to: 'giovannielauffer@gmail.com',
      replyTo: email.trim(),
      subject: subjectLine,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${subject?.trim() || 'Not specified'}\n\n${message.trim()}`,
      html: `<p><strong>From:</strong> ${name.trim()} &lt;${email.trim()}&gt;</p>
             <p><strong>Subject:</strong> ${subject?.trim() || 'Not specified'}</p>
             <hr>
             <p>${message.trim().replace(/\n/g, '<br>')}</p>`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send. Please try emailing directly.' });
  }
}
