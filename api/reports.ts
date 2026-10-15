// api/reports.ts — Report wrong data API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './db';
import { v4 as uuidv4 } from 'uuid';

function ok(res: VercelResponse, data: unknown, status = 200) {
  return res.status(status).json({ success: true, data });
}
function err(res: VercelResponse, message: string, status = 400) {
  return res.status(status).json({ success: false, error: message });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return err(res, 'Method not allowed', 405);

  try {
    const { hospitalId, issue, description } = req.body ?? {};

    if (!hospitalId || !issue) {
      return err(res, 'hospitalId and issue are required');
    }

    const id = uuidv4();
    const inserted = await sql`
      INSERT INTO data_reports (id, hospital_id, issue, description, status)
      VALUES (${id}, ${hospitalId}, ${issue}, ${description ?? null}, 'open')
      RETURNING *`;

    return ok(res, inserted[0], 201);
  } catch (e: unknown) {
    console.error('[reports]', e);
    return err(res, 'Internal server error', 500);
  }
}
