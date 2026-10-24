import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

const TRACKING_FILE = path.join('/tmp', 'mediseva-tracking.json');

interface TrackingData {
  visits: { timestamp: string; userAgent: string; path?: string }[];
  installs: { timestamp: string; userAgent: string; platform?: string }[];
  pwaOpens: { timestamp: string; userAgent: string }[];
  installPrompts: { timestamp: string; userAgent: string }[];
}

function readTracking(): TrackingData {
  try {
    if (fs.existsSync(TRACKING_FILE)) {
      return JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));
    }
  } catch {}
  return { visits: [], installs: [], pwaOpens: [], installPrompts: [] };
}

function writeTracking(data: TrackingData): void {
  // Keep last 500 of each
  data.visits = data.visits.slice(-500);
  data.installs = data.installs.slice(-500);
  data.pwaOpens = data.pwaOpens.slice(-500);
  data.installPrompts = data.installPrompts.slice(-500);
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(data), 'utf-8');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const { type, userAgent, path: pagePath, platform } = req.body;
      const data = readTracking();
      const timestamp = new Date().toISOString();

      switch (type) {
        case 'visit':
          data.visits.push({ timestamp, userAgent: (userAgent || '').substring(0, 200), path: pagePath });
          break;
        case 'install':
          data.installs.push({ timestamp, userAgent: (userAgent || '').substring(0, 200), platform });
          break;
        case 'pwa_open':
          data.pwaOpens.push({ timestamp, userAgent: (userAgent || '').substring(0, 200) });
          break;
        case 'install_prompt_shown':
          data.installPrompts.push({ timestamp, userAgent: (userAgent || '').substring(0, 200) });
          break;
        default:
          return res.status(400).json({ error: 'Unknown type' });
      }

      writeTracking(data);
      return res.status(200).json({ success: true, type });
    } catch {
      return res.status(500).json({ error: 'Failed to track' });
    }
  }

  if (req.method === 'GET') {
    const data = readTracking();
    const today = new Date().toISOString().split('T')[0];

    return res.status(200).json({
      today: {
        visits: data.visits.filter(v => v.timestamp.startsWith(today)).length,
        installs: data.installs.filter(i => i.timestamp.startsWith(today)).length,
        pwaOpens: data.pwaOpens.filter(p => p.timestamp.startsWith(today)).length,
        installPrompts: data.installPrompts.filter(p => p.timestamp.startsWith(today)).length,
      },
      total: {
        visits: data.visits.length,
        installs: data.installs.length,
        pwaOpens: data.pwaOpens.length,
        installPrompts: data.installPrompts.length,
      },
      recentInstalls: data.installs.slice(-10).reverse(),
      recentVisits: data.visits.slice(-20).reverse(),
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
