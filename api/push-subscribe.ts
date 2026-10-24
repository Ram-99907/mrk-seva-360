import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { subscription, timestamp } = req.body;
      
      if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Invalid subscription' });
      }

      const subs = readSubscriptions();
      
      // Check for duplicate
      const exists = subs.some((s: any) => s.subscription?.endpoint === subscription.endpoint);
      
      if (!exists) {
        subs.push({
          subscription,
          timestamp: timestamp || new Date().toISOString(),
          userAgent: req.headers['user-agent'] || 'unknown',
        });
        writeSubscriptions(subs);
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Subscription saved',
        totalSubscribers: subs.length 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save subscription' });
    }
  }

  if (req.method === 'GET') {
    const subs = readSubscriptions();
    return res.status(200).json({ 
      totalSubscribers: subs.length,
      subscriptions: subs.map((s: any) => ({
        timestamp: s.timestamp,
        userAgent: s.userAgent?.substring(0, 50),
      }))
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
