import type { VercelRequest, VercelResponse } from '@vercel/node';
import webpush from 'web-push';
import fs from 'fs';
import path from 'path';

const VAPID_PUBLIC_KEY = 'BA14q6aFrxSwTVw2PqkwbvcWpLpiGOaNVr7PY3OgmXr0VZrfWTMvx0w6u_gC0Uplm5POCqoWYpegiP1TeURcNjY';
const VAPID_PRIVATE_KEY = 'spomTWySOtJjhtt94PvOEVKWiC2qDBmkg7uWqig4Z1k';

webpush.setVapidDetails(
  'mailto:admin@mediseva360.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const SUBS_FILE = path.join('/tmp', 'push-subscriptions.json');

function readSubscriptions(): any[] {
  try {
    if (fs.existsSync(SUBS_FILE)) {
      return JSON.parse(fs.readFileSync(SUBS_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function writeSubscriptions(subs: any[]): void {
  fs.writeFileSync(SUBS_FILE, JSON.stringify(subs), 'utf-8');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, body, url } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    const subs = readSubscriptions();
    
    if (subs.length === 0) {
      return res.status(200).json({ 
        sent: 0, 
        failed: 0, 
        message: 'No subscribers found' 
      });
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
      tag: 'mediseva-push-' + Date.now(),
    });

    let sent = 0;
    let failed = 0;
    const invalidIndices: number[] = [];

    const results = await Promise.allSettled(
      subs.map((sub: any, index: number) =>
        webpush.sendNotification(sub.subscription, payload)
          .then(() => { sent++; })
          .catch((error: any) => {
            failed++;
            // Remove invalid subscriptions (410 Gone, 404 Not Found)
            if (error.statusCode === 410 || error.statusCode === 404) {
              invalidIndices.push(index);
            }
          })
      )
    );

    // Clean up invalid subscriptions
    if (invalidIndices.length > 0) {
      const cleanedSubs = subs.filter((_: any, i: number) => !invalidIndices.includes(i));
      writeSubscriptions(cleanedSubs);
    }

    return res.status(200).json({
      sent,
      failed,
      totalSubscribers: subs.length,
      cleaned: invalidIndices.length,
      message: `Sent to ${sent} subscriber(s)`,
    });
  } catch (error) {
    console.error('Push send error:', error);
    return res.status(500).json({ error: 'Failed to send push notifications' });
  }
}
